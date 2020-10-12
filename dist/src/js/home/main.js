const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');



module.exports = yaxi.Box.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template, {
            
            marquee: '滚动文字 滚动文字 滚动文字 滚动文字'
        });

        yaxi.http.get('home').json(function (data) {

            this.find('>@host').data = data;

        }.bind(this));
    }


    
    this.onshow = function () {

        this.find('>swiper').autoplay = true;
    }


    this.onhide = function () {
        
        this.find('>swiper').autoplay = false;
    }



    this.handleOpenDetail = function (event) {

        require('../course/detail/main').open(event.source.tag);
    }


    this.handleMore = function (event) {

        var target = event.target;
        this.trigger('more', target.tag || target.parent.tag);
    }


});
