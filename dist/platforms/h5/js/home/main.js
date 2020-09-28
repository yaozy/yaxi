const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');



module.exports = yaxi.Box.extend(function (Class, base) {



    function render(data) {

        this.find('>>@host').data = data;
    }



    this.init = function () {

        this.loadTemplate(template, {
            
            marquee: '滚动文字 滚动文字 滚动文字 滚动文字'
        });

        yaxi.http.get('home').json(render.bind(this));
    }


    this.handleOpenDetail = function (event) {

        require('../lesson/detail/main').open(event.source.tag);
    }


    this.handleMore = function (event) {

        var target = event.target;
        this.trigger('more', target.tag || target.parent.tag);
    }


});
