module.exports = yaxi.Page.extend(function () {



    var Store = yaxi.store({
        name: '',
        age: 0
    });

    
    var Model = yaxi.model({
        width: '320px',
        text: '',
        displayText: function () {

            return this.text;
        },
        submodel: yaxi.model({

            value: 0
        }),
        store: Store
    });



    this.init = function () {

        this.assign({
            header: '模型开发演示',
            content: {
                model: new Model({
                    text: 11111.1222223,
                    submodel: {
                        value: 20
                    },
                    store: [
                        { name: 1111, age: 1 },
                        { name: 2222, age: 2 },
                        { name: 3333, age: 3 }
                    ]
                }),
                children: [
                    {
                        Class: yaxi.Repeater,
                        store: 'store',
                        template: {
                            Class: yaxi.Text,
                            line: 'bottom-1px',
                            style: {
                                display: 'block'
                            },
                            bindings: {
                                text: 'name'
                            }
                        }
                    },
                    {
                        Class: yaxi.TextBox,
                        bindings: {
                            value: 'text',
                            change: 'text'
                        }
                    },
                    {
                        Class: yaxi.TextBox,
                        value: 50,
                        bindings: {
                            value: 'submodel.value',
                            change: 'submodel.value'
                        }
                    }
                ]
            }
        });
    }


});
