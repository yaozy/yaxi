const yaxi = require('../../yaxi/js/yaxi');


module.exports = yaxi.Page.extend(function (Class, base) {


    var arrayModel = yaxi.store = new (yaxi.arrayModel({
        name: '',
        value: 0,

        computed: function () {

            return 'computed: ' + this.name + ' + ' + this.value;
        }
    }));


    for (var i = 1; i < 5; i++)
    {
        arrayModel.push({
            name: 'name' + i,
            value: Math.random()
        })
    }



    this.init = function () {


        var id = 1;


        this.assign({
            children: [
                {
                    Class: yaxi.Header,
                    content: 'yaxi model page'
                },
                {
                    Class: yaxi.Box,
                    layout: 'column',
                    children: [
                        {
                            Class: yaxi.Box,
                            style: 'background-color: @bg-level2-color',
                            subtype: yaxi.Button,
                            layout: 'row',
                            children: [
                                {
                                    content: 'Append',
                                    events: {

                                        tap: function () {

                                            arrayModel.push({
                                                name: 'name' + id++,
                                                value: Math.random()
                                            })
                                        }
                                    }
                                },
                                {
                                    content: 'Replace',
                                    events: {

                                        tap: function () {

                                            arrayModel.forEach(function (item) {

                                                item.value = Math.random();
                                            });
                                        }
                                    }
                                },
                                {
                                    content: 'Remove',
                                    events: {

                                        tap: function () {

                                            arrayModel.pop();
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            Class: yaxi.Repeater,
                            arrayModel: arrayModel,
                            layout: 'column',
                            template: {
                                Class: yaxi.Box,
                                subtype: yaxi.Text,
                                style: 'height:auto;padding:20rem;',
                                children: [
                                    // {
                                    //     style: 'width:200rem;',
                                    //     bindings: {
                                    //         text: 'index'
                                    //     }
                                    // },
                                    {
                                        style: 'width:200rem;',
                                        bindings: {
                                            text: 'name'
                                        }
                                    },
                                    {
                                        bindings: {
                                            text: 'value'
                                        }
                                    },
                                    {
                                        style: 'display:block;',
                                        bindings: {
                                            text: 'computed'
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            ]
        });
    }


});
