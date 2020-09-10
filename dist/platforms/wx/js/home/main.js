const yaxi = require('../../yaxi/js/yaxi');


module.exports = yaxi.Panel.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Swiper,
                    subtype: yaxi.Image,
                    children: [
                        {
                            src: '/images/splash-screen.jpg'
                        },
                        {
                            src: '/images/splash-screen.jpg'
                        },
                        {
                            src: '/images/splash-screen.jpg'
                        },
                        {
                            src: '/images/splash-screen.jpg'
                        }
                    ]
                },
                {
                    Class: yaxi.Button,
                    content: 'open page',
                    events: {
                        tap: function () {

                            new (require('./test'))().open();
                        }
                    }
                }
            ]
        });
    }


});
