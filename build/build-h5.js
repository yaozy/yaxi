const Compressor = require('jiac/js-compressor');
const theme = require('./theme').theme

new Compressor()
    .load('src', [
        'js/all/base/(yaxi|extend|html|buffer|math|property|event|stream).js',
        'js/all/model/(pipe|binding|model|arraymodel).js',
        'less/theme/default/*.js',
        'js/all/controls/base/(query|control|collection|content-control|panel|repeater).js',
        'js/all/controls/base/*.js',
        'js/all/controls/form/(textbox|checkbox|numberbox|passwordbox|memo|radiobutton|switchbutton).js',
        'js/all/controls/page/(page|header|title|dialog).js',
        'js/h5/base/(init|event|http).js',
        'js/h5/renderer/base/(control|content-control|panel|repeater).js',
        'js/h5/renderer/base/*.js',
        'js/h5/renderer/form/(textbox|checkbox|numberbox|passwordbox|memo|radiobutton|switchbutton).js',
        'js/h5/renderer/page/(page|header|title).js',
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/platforms/h5/yaxi/js/yaxi.js')

    .compress()
    .output('dist/platforms/h5/yaxi/js/yaxi.min.js');
