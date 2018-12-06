const webminify = require('webminify');
const theme = webminify.theme || 'default'


webminify()
    .load('less', [
        'theme/' + theme + '/color.less',
        'base/(reset|animation|base).less',
        'control/(control|panel).less',
        'control/*.less',
        'form/textbox.less',
        'form/*.less',
        'page/*.less',
        'advanced/*.less'
    ])
    .combine('\r\n\r\n\r\n\r\n')
    .lessToCss()
    .output('dist/css/' + theme + '/yaxi.css');
