exports = module.exports = {
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
    formatForMysql: function(dt) {
        if (!dt) return null;
        var myDate = new Date(Date.parse(dt));
        return myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' '
                + myDate.getHours() + ':' + myDate.getMinutes() + ':' + myDate.getSeconds();
    }
};