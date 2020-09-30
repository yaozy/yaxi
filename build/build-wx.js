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
        'js/wx/base/(init|event).js',
        'js/wx/renderer/base/(control|box).js',
        'js/wx/renderer/base/*.js',
        'js/wx/renderer/form/*.js',
        'js/wx/renderer/page/page.js',
        'js/wx/renderer/page/*.js',
    ])
    
    .combine('\r\n\r\n\r\n\r\n')
    .push('yaxi.exports = null;')

    .output('dist/platforms/wx/yaxi/js/yaxi.js')

