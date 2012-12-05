/**
 * Utility methods for verdict and applications using verdict
 */
exports = module.exports = {

    /**
     * Take an object and recursively turn its strings into lower case
     */

    toLowerRecursive: (function toLowerRecursive(obj) {
        if (Array.isArray(obj)) {
            var ret = [];
            obj.forEach(function(el) {
                if (typeof el === 'string') {
                    ret.push(el.toLowerCase());
                } else if (el && typeof el === 'object' && !(el instanceof Date)) {
                    ret.push(toLowerRecursive(el));
                } else {
                    ret.push(el);
                }
            });
        } else {
            var ret = {};
            Object.keys(obj).forEach(function(key) {
                if (typeof obj[key] === 'string') {
                    ret[key] = obj[key].toLowerCase();
                } else if (obj[key] && typeof obj[key] === 'object' && !(obj[key] instanceof Date)) {
                    ret[key] = toLowerRecursive(obj[key]);
                } else {
                    ret[key] = obj[key];
                }
            });
        }
        return ret;
    }),

    /**
     * Format a given date string for mysql
     */

    formatForMysql: function(dt) {
        if (!dt) return null;
        var myDate = new Date(Date.parse(dt));
        return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' '
                + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
    },

    /**
     * Format a given input value for a mongo query, using the given type
     */

    mongoFormatValue: function(input, propType) {
        if (propType === Number) {
            return +input;
        } else if (propType === Boolean) {
            if (input === '0') {
                return false;
            }
            return !!input;
        } else if (propType === String && input !== null && input !== undefined) {
            return input.toString();
        }
        return input;
    },

    /**
     * Convert a string to the type constructor and return
     */
    typeStringToConstructor: function(typeString) {
        switch (typeString) {
            case 'Date': return Date;
            case 'Number': return Number;
            case 'Array': return Array;
            case 'Boolean': return Boolean;
            // Break intentionally ommitted
            case 'String':
            default: return String;
        }
    }

};