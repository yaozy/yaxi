const Compressor = require('jiac/css-compressor');



new Compressor()
    .load('src/less/color/blue.less')
    .output('dist/platforms/h5/yaxi/less/color/blue.less');

new Compressor()
    .load('src/less/color/blue.js')
    .output('dist/platforms/h5/yaxi/less/color/blue.js');



new Compressor()
    .load('src/less', [
        'all/base/scrollbar.less',
        'all/control/(control|box).less',
        'all/control/*.less',
        'all/form/textbox.less',
        'all/form/*.less',
        'all/page/*.less',
        'all/after/*.less',
        'h5/noscroll.less'
    ])
    .combine('\n\n\n\n')
    .output('dist/platforms/h5/yaxi/less/yaxi.less');



new Compressor()
    .load('dist/platforms/h5/yaxi/less', [
        'color/blue.less',
        'yaxi.less'
    ])
    .combine('\n\n\n\n')
    .less()
    .compress()
    .output('dist/platforms/h5/yaxi/css/yaxi.css');

