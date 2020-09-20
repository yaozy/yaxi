const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');



module.exports = yaxi.Box.extend(function (Class, base) {



    function render(data) {

        this.find('>>@host').data = data;
    }



    this.init = function () {

        this.load(template(this, {
            
            marquee: '滚动文字 滚动文字 滚动文字 滚动文字'
        }));

        yaxi.http.get('home').json(render.bind(this));
    }


    this.handleOpenDetail = function (event) {

        var control;

        if (control = event.target.findHasTag())
        {
            require('../lesson/detail/main').open(control.tag);
        }
    }


});
