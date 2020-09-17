const yaxi = require('../../yaxi/js/yaxi');


module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Header,
                    content: 'yaxi test page'
                },
                {
                    Class: yaxi.Box,
                    layout: 'row',
                    children: [
                        {
                            Class: yaxi.Box
                        },
                        {
                            Class: yaxi.Box,
                            layout: 'column',
                            children: [
                                {
                                    Class: yaxi.Box
                                },
                                {
                                    Class: yaxi.Box,
                                    children: [
                                        {
                                            Class: yaxi.Box
                                        },
                                        {
                                            Class: yaxi.Button,
                                            content: 'append',
                                            events: {
                                                tap: function () {
    
                                                    var children = this.parent.children[0].children;

                                                    children.push({
                                                        Class: yaxi.Text,
                                                        text: new Date()
                                                    });
                                                    
                                                    children[0].text = new Date();
                                                }
                                            }
                                        },
                                        {
                                            Class: yaxi.Button,
                                            content: 'remove last',
                                            style: 'margin-top: 10rem;',
                                            events: {
                                                tap: function () {
    
                                                    this.parent.children[0].children.pop();
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    Class: yaxi.Box
                                }
                            ]
                        },
                        {
                            Class: yaxi.Box
                        }
                    ]
                },
                {
                    Class: yaxi.Box,
                    style: 'background-color: silver;'
                }
            ]
        });
    }


});
