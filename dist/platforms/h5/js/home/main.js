const yaxi = require('../../yaxi/js/yaxi');


module.exports = yaxi.Panel.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
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
