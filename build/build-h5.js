const Compressor = require('jiac/js-compressor');
const theme = require('./theme').theme

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
        'src/h5/base/(init|event|http).js',
        'src/h5/renderer/base/(control|content-control|panel|repeater|text|button|iconbutton|scroll-panel|band|sidebar|tab).js',
        'src/h5/renderer/form/(textbox|checkbox|numberbox|passwordbox|memo|radiobutton|switchbutton).js',
        'src/h5/renderer/page/(page|header|title).js',
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/platforms/h5/yaxi/js/yaxi.js')

    .compress()
    .output('dist/platforms/h5/yaxi/js/yaxi.min.js');
