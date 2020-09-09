module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Header,
                    content: 'yaxi test page'
                },
                {
                    Class: yaxi.Panel,
                    layout: 'row',
                    children: [
                        {
                            Class: yaxi.SideBar
                        },
                        {
                            Class: yaxi.Panel,
                            layout: 'column',
                            children: [
                                {
                                    Class: yaxi.Band
                                },
                                {
                                    Class: yaxi.Panel,
                                    children: [
                                        {
                                            Class: yaxi.Panel
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
                                    Class: yaxi.Band
                                }
                            ]
                        },
                        {
                            Class: yaxi.SideBar
                        }
                    ]
                },
                {
                    Class: yaxi.Band
                }
            ]
        });
    }


});
