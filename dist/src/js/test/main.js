const yaxi = require('../../yaxi/js/yaxi');


module.exports = yaxi.Box.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Button,
                    content: {
                        Class: yaxi.Box,
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

                            require('./test').open();
                        }
                    }
                },
                {
                    Class: yaxi.Button,
                    content: 'open model',
                    events: {
                        tap: function () {

                            require('./model').open();
                        }
                    }
                }
            ]
        });
    }


});
