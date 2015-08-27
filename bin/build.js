/*
 * build.js
 */

var sass = require('node-sass'),
    Q = require('q'),
    path = require('path'),
    format = require('util').format,
    chokidar = require('chokidar'),
    fs = require('fs'),

    watcherWWW,
    watcherScss,

    moduleTmpl = "angular.module('settings', [])%s;",
    constantTmpl = ".constant('%s', %s)",
    www = path.resolve(__dirname, '../www'),
    sassSrcFolder = path.resolve(__dirname, '../scss'),
    sassSrc = path.resolve(sassSrcFolder, 'main.scss'),
    sassOut = path.resolve(www, 'app.css'),
    settingsOut = path.resolve(www, 'settings.js');

function transformSettings(settings, outPath) {
    var mod = '';
    Object.keys(settings).map(function (attr) {
        mod += format(constantTmpl, attr, JSON.stringify(settings[attr]));
    });
    fs.writeFileSync(outPath, format(moduleTmpl, mod));
    console.log('- transform settings in angular module `settings` - done');
    return settings;
}

function sassRenderer(src, out) {
    var defer = Q.defer();

    sass.render({
        file: src
    }, function(err, result) {
        if(err) defer.reject(err);
        else defer.resolve(result);
    });

    return defer.promise.then(function (r) {
        fs.writeFileSync(out, r.css);
        console.log('- sass - done');
    });
}

module.exports.build = function build(platform, localSettings, config) {
    return sassRenderer(sassSrc, sassOut).then(function () {
        var conf = localSettings.configurations[platform][config];
        conf.version = conf.version || localSettings.version;
        return conf;
    }).then(function (conf) {
        return transformSettings(conf, settingsOut);
    });
};

module.exports.watch = function (f, localSettings, platform, config, confEmitter) {
    watcherWWW = chokidar.watch(www, { ignored: /app\.css/, persistent: true });
    watcherSCSS = chokidar.watch(sassSrcFolder, { persistent: true });

    confEmitter.on('change', function (conf) {
        conf.version = conf.version || localSettings.version;
        transformSettings(conf, settingsOut);
    });

    setTimeout(function () {
        watcherWWW.on('all', function (evt, p) { f(p); });
        watcherSCSS.on('all', function (evt, p) {
            sassRenderer(sassSrc, sassOut).then(function () {
                f(sassOut);
            });
        });
    }, 4000);
};

module.exports.close = function () {
    if(watcherWWW) watcherWWW.close();
    if(watcherSCSS) watcherSCSS.close();
};
