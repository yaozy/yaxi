const Compressor = require('jiac/js-compressor');
const theme = require('./theme').theme


new Compressor()
    .load('', [
        'src/base/(yaxi|i18n|extend|utils|math|properties|event|event.m|pipe|binding|model|store|stream|http|cache).js',
        'icon/iconfont.js',
        'less/theme/' + theme + '/color.js',
        'src/control/(style|control|container|panel).js',
        'src/control/*.js',
        'src/form/textbox.js',
        'src/form/*.js',
        'src/page/page.js',
        'src/page/*.js',
        'src/advanced/*.js'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/js/yaxi.1.0.js')

    .compress()
    .output('dist/js/yaxi.min.1.0.js');
