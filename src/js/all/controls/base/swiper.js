yaxi.component('Swiper', function (Class, base) {


    this.template = function ($this) {

        return [
            'box',
            {
                height: '300rem'
            },
            [
                [
                    'slidebox',
                    {
                        bindings: {
                            circular: function () { return $this.circular },
                            autoplay: function () { return $this.autoplay },
                            interval: function () { return $this.interval },
                            duration: function () { return $this.duration },
                            selectedIndex: function () { return $this.current },
                            onchange: function (value) { $this.current = value; }
                        }
                    },
                    [
                        ['slot']
                    ]
                ],
                [
                    'slot',
                    {
                        name: 'dots'
                    },
                    [
                        [
                            'databox',
                            {
                                absolute: 'center bottom',
                                bottom: '30rem',
                                width: 'auto'
                            },
                            function (template, data) {

                                for (var $index = 0, length = data.length; $index < length; $index++)
                                {
                                    template($index, $item,
                                        [
                                            "control",
                                            {
                                                width: '10rem',
                                                height: '10rem',
                                                borderRadius: '10rem',
                                                bindings: {
                                                    theme: function (index) {

                                                        return this.current === index ? 'bg-primary' : 'bg-thick';

                                                    }.bind($this, $index)
                                                }
                                            }
                                        ]
                                    );
                                }
                            }
                        ]
                    ]
                ]
            ]
        ];

    }



    // 是否循环
    this.$('circular', true);


    // 是否自动切换
    this.$('autoplay', true);


    // 自动切换时间间隔(毫秒)
    this.$('interval', 5000);


    // 过渡动画时长(毫秒), 0表示没有过渡动画
    this.$('duration', 500, {

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });
    

    // 当前项
    this.$('current', 0);


});
