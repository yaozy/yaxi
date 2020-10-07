yaxi.component('Pulldown', function (Class, base) {



    var statusIcons = ['pulldown', 'pulldown', 'release', '', 'done'];

    var statusText = ['start', 'start', 'release', 'loading', 'done'];
    


    this.template = function () {

        var self = this;

        return [
            'box',
            {
                layout: 'row middle center',
                height: 0,
                maxHeight: '100rem',
                theme: 'text-lightest'
            },
            [
                [
                    'icon',
                    {
                        fontSize: '60rem',
                        marginRight: '5rem',
                        bindings: {

                            hidden: function () {
                            
                                return self.status === 3;
                            },

                            icon: function () {

                                return 'common-' + statusIcons[self.status];
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
                                    
                                        return self.status !== 3;
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

                                return self[statusText[self.status] + 'Text'];
                            }
                        }
                    }
                ]
            ]
        ];

    }




    // 下拉状态
    // 0    未下拉
    // 1    开启下拉
    // 2    松开刷新
    // 3    加载中
    // 4    加载完成
    this.$('status', 0);



    this.$('startText', '下拉即可刷新', {

        change: false,
        alias: 'start-text'
    });


    this.$('releaseText', '松开立即刷新', {

        change: false,
        alias: 'release-text'
    });


    this.$('loadingText', '正在加载, 请稍候...', {

        change: false,
        alias: 'loading-text'
    });

    
    this.$('doneText', '加载完毕', {

        change: false,
        alias: 'done-text'
    });



    this.release = function () {

        switch (this.status)
        {
            case 1:
                this.transition = 'height 600ms ease';
                this.height = 0;
                break;

            case 2:
                this.status = 3;
                this.trigger('refresh');
                break;
        }
    }


    this.done = function () {

        if (this.status > 1)
        {
            this.status = 4;
            this.transition = 'height 600ms ease';
            this.height = 0;
        }
    }



}, function Pulldown() {


    yaxi.Control.apply(this, arguments);


});
