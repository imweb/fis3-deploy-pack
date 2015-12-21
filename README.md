# fis3-deploy-pack

fis3 打包压缩插件


# Usage

```js
// fis-conf.js
fis.match('/usedomain/(*)', {
        release: '$1',
        domain: 'http://test.qq.com/m'
    })
    .match('/setpack/(*)', {
        pack: '$1'
    })
    .match('/notpack', {
        pack: false
    })
    .match('*', {
        deploy: [
            fis.plugin('local-deliver', {
                // ...
            }),
            fis.plugin('pack')
        ]
    });
```

# Options

```js
entry.defaultOptions = {
    tmp: '../.pack-tmp', // 临时文件夹

    type: 'zip', // 压缩类型, 传给archiver

    to: '../pack/pack.zip', // 输出压缩包名

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
}
```

