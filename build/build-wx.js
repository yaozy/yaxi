const Compressor = require('jiac/js-compressor');

new Compressor()
    .load('src', [
        'js/all/base/(yaxi|extend|html|buffer|math|property|event|stream|http|color).js',
        'less/color/*.js',
        'js/all/model/(pipe|model|arraymodel).js',
        'less/color/blue.js',
        'js/all/controls/base/(query|control|collection|content-control|box).js',
        'js/all/controls/base/*.js',
        'js/all/controls/form/textbox.js',
        'js/all/controls/form/*.js',
        'js/all/controls/page/(page|header|dialog).js',
        'js/wx/base/(init|event).js',
        'js/wx/renderer/base/(control|content-control|box).js',
        'js/wx/renderer/base/*.js',
        'js/wx/renderer/page/(page|header).js'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/platforms/wx/yaxi/js/yaxi.js')

