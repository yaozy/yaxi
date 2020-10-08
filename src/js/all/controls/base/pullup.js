yaxi.component('Pullup', function (Class, base) {



    this.template = function () {

        var self = this;

        return [
            'box',
            {
                layout: 'row middle center',
                height: '100rem',
                theme: 'text-lightest'
            },
            [
                [
                    'icon',
                    {
                        icon: 'common-done',
                        fontSize: '60rem',
                        marginRight: '5rem',
                        bindings: {

                            hidden: function () {
                            
                                return !self.status;
                            }
                        }
                    }
                ],
                [
                    'slot',
                    null,
                    [
                        [
                            'loading',
                            {
                                width: '40rem',
                                height: '40rem',
                                fontSize: '8rem',
                                marginRight: '10rem',
                                bindings: {

                                    hidden: function () {
                                    
                                        return self.status;
                                    }
                                }
                            }
                        ]
                    ]
                ],
                [
                    'text',
                    {
                        bindings: {

                            text: function () {

                                return self.status ? self.doneText : self.loadingText;
                            }
                        }
                    }
                ]
            ]
        ];

    }



    // 下拉状态
    // 0    加载中
    // 1    加载完成
    this.$('status', 0);


    
    this.$('loadingText', '正在加载, 请稍候...', {

        change: false,
        alias: 'loading-text'
    });



    this.$('doneText', '已全部加载完毕', {

        change: false,
        alias: 'done-text'
    });




    this.start = function () {

        this.status = 0;
        this.trigger('refresh');
    }


    this.done = function () {

        this.status = 1;
    }



}, function Pullup() {


    yaxi.Control.apply(this, arguments);


});
