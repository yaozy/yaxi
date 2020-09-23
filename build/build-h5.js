const Compressor = require('jiac/js-compressor');
const theme = require('./theme').theme

new Compressor()
    .load('src', [
        'js/all/base/(yaxi|extend|html|buffer|math|property|event|stream|http).js',
        'js/all/model/(pipe|model|arraymodel).js',
        'less/theme/default/*.js',
        'js/all/controls/base/(query|control|collection|content-control|box).js',
        'js/all/controls/base/*.js',
        'js/all/controls/form/textbox.js',
        'js/all/controls/form/*.js',
        'js/all/controls/page/(page|header|dialog).js',
        'js/h5/base/(init|event|http).js',
        'js/h5/renderer/base/(control|content-control|box).js',
        'js/h5/renderer/base/*.js',
        'js/h5/renderer/form/(textbox|checkbox|numberbox|passwordbox|memo|radiobutton|switchbutton).js',
        'js/h5/renderer/page/(page|header).js',
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/platforms/h5/yaxi/js/yaxi.js')

    .compress()
    .output('dist/platforms/h5/yaxi/js/yaxi.min.js');
