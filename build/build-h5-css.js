const Compressor = require('jiac/css-compressor');
const theme = require('./theme').theme


new Compressor()
    .load('less', [
        'all/theme/' + theme + '/color.less',
        'h5/base/reset.less',
        'all/control/(control|button|panel|repeater|band|sidebar).less',
        'all/control/*.less',
        'all/form/textbox.less',
        'all/form/*.less',
        'all/page/*.less',
        'all/after/*.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .less()
    .compress()
    .output('dist/platforms/h5/yaxi/css/' + theme + '/yaxi.css');
