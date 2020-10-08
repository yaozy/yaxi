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


    
    this.onshow = function () {

        var swiper = this.find('>>swiper');

        setTimeout(function () {

            swiper.autoplay = true;

        }, 100);
    }


    this.onhide = function () {
        
        var swiper = this.find('>>swiper');

        setTimeout(function () {

            swiper.autoplay = false;
            
        }, 100);
    }



    this.handleOpenDetail = function (event) {

        require('../course/detail/main').open(event.source.tag);
    }


    this.handleMore = function (event) {

        var target = event.target;
        this.trigger('more', target.tag || target.parent.tag);
    }


});
