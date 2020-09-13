const Compressor = require('jiac/js-compressor');

new Compressor()
    .load('src', [
        'js/all/base/(yaxi|extend|html|buffer|math|property|event|stream).js',
        'js/all/model/(pipe|model|arraymodel).js',
        'less/theme/default/*.js',
        'js/all/controls/base/(query|control|collection|content-control|box|repeater).js',
        'js/all/controls/base/*.js',
        'js/all/controls/form/(textbox|checkbox|numberbox|passwordbox|memo|radiobutton|switchbutton).js',
        'js/all/controls/page/(page|header|title|dialog).js',
        'js/wx/base/(init|event).js',
        'js/wx/renderer/base/(control|content-control|box|repeater|tab).js',
        'js/wx/renderer/page/(page|header).js'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/platforms/wx/yaxi/js/yaxi.js')

