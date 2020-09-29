const Compressor = require('jiac/js-compressor');

new Compressor()
    .load('src', [
        'js/all/base/(yaxi|extend|html|buffer|math|property|event|stream|http|color).js',
        'less/color/*.js',
        'js/all/model/(pipe|model|arraymodel).js',
        'less/color/blue.js',
        'js/all/controls/base/(query|control|collection|box).js',
        'js/all/controls/base/*.js',
        'js/all/controls/form/textbox.js',
        'js/all/controls/form/*.js',
        'js/all/controls/page/page.js',
        'js/all/controls/page/*.js',
        'js/h5/base/(init|event|http).js',
        'js/h5/renderer/base/(control|box).js',
        'js/h5/renderer/base/*.js',
        'js/h5/renderer/form/*.js',
        'js/h5/renderer/page/page.js',
        'js/h5/renderer/page/*.js',
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .push('yaxi.classHost = null;')

    .output('dist/platforms/h5/yaxi/js/yaxi.js')

    .compress()
    .output('dist/platforms/h5/yaxi/js/yaxi.min.js');
