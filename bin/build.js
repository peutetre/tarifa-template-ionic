/*
 * build.js
 */

var sass = require('node-sass'),
    Q = require('q'),
    path = require('path'),
    fs = require('fs');

module.exports.build = function build(platform, localSettings, config) {
    var defer = Q.defer();
    sass.render({
        file: path.resolve(__dirname, '../scss/main.scss')
    }, function(err, result) {
        if(err) defer.reject(err);
        else defer.resolve(result);
    });
    return defer.promise.then(function (r) {
        fs.writeFileSync(path.resolve(__dirname, '../www/app.css'), r.css);
        return localSettings;
    });
};
