/*
 * build.js
 */

var sass = require('node-sass'),
    Q = require('q'),
    path = require('path'),
    format = require('util').format,
    fs = require('fs');

var moduleTmpl = "angular.module('settings', [])%s;",
    constantTmpl = ".constant('%s', %s)";

function transformSettings(settings, outPath) {
    var mod = '';
    Object.keys(settings).map(function (attr) {
        mod += format(constantTmpl, attr, JSON.stringify(settings[attr]));
    });
    fs.writeFileSync(outPath, format(moduleTmpl, mod));
    console.log('- transform settings in angular module `settings` - done');
    return settings;
}

module.exports.build = function build(platform, localSettings, config) {
    var defer = Q.defer(),
        sassSrc = path.resolve(__dirname, '../scss/main.scss'),
        sassOut = path.resolve(__dirname, '../www/app.css'),
        settingsOut = path.resolve(__dirname, '../www/settings.js');

    sass.render({
        file: sassSrc
    }, function(err, result) {
        if(err) defer.reject(err);
        else defer.resolve(result);
    });
    return defer.promise.then(function (r) {
        fs.writeFileSync(sassOut, r.css);
        console.log('- sass - done');
        var conf = localSettings.configurations[platform][config];
        conf.version = conf.version || localSettings.version;
        return conf;
    }).then(function (settings) {
        return transformSettings(settings, settingsOut);
    });
};
