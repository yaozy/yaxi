const Compressor = require('jiac/css-compressor');
const theme = require('./theme').theme


new Compressor()
    .load('src/less', [
        'theme/' + theme + '/color.less',
        'all/base/scrollbar.less',
        'all/control/(control|box).less',
        'all/control/*.less',
        'all/form/textbox.less',
        'all/form/*.less',
        'all/page/*.less',
        'all/after/*.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .less()

    .replace(function (text) {
        
        return text.replace(/rem/g, 'rpx');
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
        
        return text.replace(/rem/g, 'rpx');
    })

    .push(`@import '../../icon/iconfont.wxss';\n@import '../wxss/default/yaxi.wxss';`)

    .output('dist/platforms/wx/yaxi/pages/host.wxss');