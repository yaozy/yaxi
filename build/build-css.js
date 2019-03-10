const Compressor = require('jiac/css-compressor');
const theme = require('./theme').theme


new Compressor()
    .load('less', [
        'theme/' + theme + '/color.less',
        'base/(reset|animation).less',
        'control/control.less',
        'control/*.less',
        'form/textbox.less',
        'form/*.less',
        'page/*.less',
        'advanced/*.less',
        'after/*.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .less()
    .compress()
    .output('dist/css/' + theme + '/yaxi.1.0.css');
