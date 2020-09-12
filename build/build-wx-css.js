const Compressor = require('jiac/css-compressor');
const theme = require('./theme').theme


new Compressor()
    .load('src/less', [
        'theme/' + theme + '/color.less',
        'all/control/(control|text|button|iconbutton|box).less',
        'all/control/*.less',
        'all/page/(page|header|host).less',
        'all/after/*.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .less()

    .replace(function (text) {
        
        return text.replace(/rem/g, 'rpx').replace(/:active/g, '.active');
    })

    .output('dist/platforms/wx/yaxi/wxss/' + theme + '/yaxi.wxss');



new Compressor()
    .load('src/less', [
        'theme/' + theme + '/color.less',
        'all/base/scrollbar.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .less()

    .replace(function (text) {
        
        return text.replace(/rem/g, 'rpx').replace(/:active/g, '.active');
    })

    .output('dist/platforms/wx/yaxi/pages/host.wxss');