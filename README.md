verdict.js
==========

Javascript condition evaluator.

Rewritten from the ground up from the original [verdict](https://github.com/rfink/verdict),
cleaner interface inspired from [ruler](https://github.com/RedVentures/ruler) by
[Garrett Johnson](https://github.com/gjohnson).  Adds nesting and "any" vs "all"
composite capabilities.  Browser-friendly.  The segmentation tree capabilities have been
dropped and may be available in a separate module with this as a dependency, but are
not baked in.  For now.

Installation
=====================

```

npm install verdict.js

```

Usage
==========

There are two main ways to use verdict.  The first is a fluent interface:

```javascript

var assert = require('assert');
var verdict = require('verdict');
var res = verdict()
  .eq('a', '1')
  .eq('b', '2')
  .test({ a: '1', b: '2' });
assert(res, true);

```

Rulesets are implicitly assumed to use the "all" composite handler, aka all must be true.
That's easy to change:

```javascript

var res = verdict()
  .any()
  .eq('a', '1')
  .eq('b', 'not correct')
  .test({ a: '1', b: '2' });
assert(res, true);

```

You can also make more complex, nested rulesets as necessary:

```javascript

var res = verdict()
  .all(
    verdict().any()
      .eq('a', '1')
      .eq('b', 'not correct, but that is okay, it is an "any"'),
    verdict().all()
      .eq('c', '3')
      .eq('d', '4')
  )
  .test({ a: '1', b: '2', c: '3', d: '4' });
  assert(res, true);

```

The second way to use verdict is to pass a plain javascript object, and you
will receive a valid ruleset object back:

```javascript

var ruleset = verdict()
  .parse({
    composite: 'all',
    rules: [
      {
        composite: 'any',
        rules: [
          {
            path: 'a',
            comparator: 'eq',
            value: '1'
          },
          {
            path: 'b',
            comparator: 'eq',
            value: '2'
          }
        ]
      },
      {
        path: 'c',
        comparator: 'eq',
        value: '3'
      }
    ]
  });

```

See test/**/*.js for more examples, and see lib/comparison/index.js for all available
comparison functions.


License
==========

MIT license, do very bad things
