const webminify = require('webminify');
const theme = webminify.theme || 'default';


webminify()
    .load('icon/iconfont.js')
    .load('src', [
        'js/base/(yaxi|extend|math|properties|event|observe|style|model|store|stream|http|web).js',
        'less/theme/' + theme + '/color.js',
        'js/control/(control|container|panel).js',
        'js/control/*.js',
        'js/form/textbox.js',
        'js/form/*.js',
        'js/page/page.js',
        'js/page/*.js'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .output('dist/js/yaxi.js')

    .compressjs()
    .output('dist/js/yaxi.min.js');
