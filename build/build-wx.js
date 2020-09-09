const Compressor = require('jiac/js-compressor');

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

new Compressor()
    .load('', [
        'src/all/base/(yaxi|extend|html|buffer|math|properties|event|stream).js',
        'src/all/model/(pipe|binding|model|arraymodel).js',
        'less/all/theme/default/*.js',
        'src/all/controls/base/(query|control|collection|content-control|panel|repeater).js',
        'src/all/controls/base/*.js',
        'src/all/controls/form/(textbox|checkbox|numberbox|passwordbox|memo|radiobutton|switchbutton).js',
        'src/all/controls/page/(page|header|title|dialog).js',
        'src/wx/base/(init|event).js',
        'src/wx/renderer/base/(control|content-control|panel|repeater|iconbutton|tab).js',
        'src/wx/renderer/page/header.js'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/platforms/wx/yaxi/js/yaxi.js')

