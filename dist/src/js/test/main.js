const yaxi = require('../../yaxi/js/yaxi');


module.exports = yaxi.Panel.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Button,
                    content: {
                        Class: yaxi.Panel,
                        children: [
                            {
                                Class: yaxi.Text,
                                text: 'A '
                            },
                            {
                                Class: yaxi.Text,
                                text: '01 '
                            }
                        ]
                    },
                    events: {
                        tap: function () {

                            new (require('./test'))().open();
                        }
                    }
                },
                {
                    Class: yaxi.Button,
                    content: 'open model',
                    events: {
                        tap: function () {

                            new (require('./model'))().open();
                        }
                    }
                }
            ]
        });
    }


});
