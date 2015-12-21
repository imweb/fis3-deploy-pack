'use strict';

var path = require('path'),
    fs = require('fs'),
    archiver = require('archiver'); 

var entry = module.exports = function(opts, modified, total, next) {
    fis.util.del(opts.to);

    total.filter(function(file) {
        return (opts.packDomain && file.domain && file.pack !== false) 
            || file.pack;
    }).map(function(file) {
        return {
            subpath: opts.subpath(file),
            content: opts.content(file)
        };
    }).forEach(function(file) {
        fis.util.write(projectPath(opts.tmp, file.subpath), file.content);
    });

    pack(opts.type, projectPath(opts.tmp), projectPath(opts.to, opts.filename));
    next();
};

function projectPath() {
    return fis.project.getProjectPath(fis.util.apply(fis.util, arguments));
}

function pack(type, dir, output) {
    var archive = archiver(type)
        .bulk([{
            expand: true,
            cwd: dir,
            src: ['**', '!' + output.replace(dir, '').replace(/^\//, '')]
        }])
        .on('error', function() {
            fis.log.error('zip failed: ' + output);
        });

    fis.util.mkdir(path.dirname(output));
    archive.pipe(fs.createWriteStream(output));
    archive.finalize();
}

/**
 * defaultOpitons for fix fis missspell bug
 */
entry.defaultOptions = entry.defaultOpitons = {
    tmp: '../.pack-tmp', // 临时文件夹

    type: 'zip', // 压缩类型, 传给archiver

    to: '../pack', // 输出目录

    filename: 'pack.zip', // 压缩包名

    packDomain: true, // 是否打包所有包含domain属性的文件

    // 文件在压缩包中的路径
    subpath: function(file) {
        return typeof file.pack === 'string' ? file.pack : fis.util(
            (file.domain || '').replace(/^http:\/\//i, ''), 
            file.release || file.subpath
        );
    },

    // 文件内容
    content: function(file) {
        var inject = {
            version: Date.now()
        };
        return !file. _likes || !file. _likes.isHtmlLike 
            ? file.getContent()
            : (file.getContent() || '').replace(
                /(<script)/, 
                '<script>var pack = ' + JSON.stringify(inject) + '</script>$1'
            );
    }
};

