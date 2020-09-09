const Compressor = require('jiac/css-compressor');
const theme = require('./theme').theme


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});


new Compressor()
    .load('less', [
        'all/theme/' + theme + '/color.less',
        'all/control/(control|text|button|iconbutton|panel).less',
        'all/control/*.less',
        'all/page/(page|header|host).less',
        'all/after/*.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .less()

    .replace(function (text) {
        
        return text.replace(/rem/g, 'rpx').replace(/:active/g, '.active');
    })

    // .compress()
    .output('dist/platforms/wx/yaxi/wxss/' + theme + '/yaxi.wxss');
