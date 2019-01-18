const webminify = require('webminify');
const theme = webminify.theme || 'default';


webminify()
    .load('', [
        'src/base/(yaxi|i18n|extend|utils|math|properties|event|event.m|pipe|patch|observe|style|model|store|stream|http|cache|require|template|thread).js',
        'icon/iconfont.js',
        'less/theme/' + theme + '/color.js',
        'src/control/(control|container|panel).js',
        'src/control/*.js',
        'src/form/textbox.js',
        'src/form/*.js',
        'src/page/page.js',
        'src/page/*.js',
        'src/advanced/*.js'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/js/yaxi.js')

    .compressjs()
    .output('dist/js/yaxi.min.js');
