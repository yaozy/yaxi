yaxi.component('Header', function (Class, base, yaxi) {



    // 默认标题文字
    Class.text = 'yaxi';



    Class.allowParent = function (parent) {

        if (parent instanceof yaxi.Page)
        {
            return true;
        }

        throw new Error('Header can only add to Page or Dialog!');
    }




    this.template = function () {

        var self = this;

        return [
            'box',
            {
                layout: 'row middle',
                theme: 'bg-standard line-lightest line-bottom',
                height: '90rem',
                paddingLeft: '20rem'
            },
            [
                [
                    'icon',
                    {
                        icon: 'common-back',
                        width: '90rem',
                        height: '100%',
                        marginLeft: '-20rem',
                        hidden: yaxi.currentPages.length < 1,
                        events: {
    
                            tap: function handleClose() {
    
                                this.root.close('Back');
                                return false;
                            }
                        }
                    }
                ],
                [
                    'slot',
                    null,
                    [
                        [
                            'text',
                            {
                                bindings: {
    
                                    text: function () {
    
                                        return self.text || Class.text || '';
                                    }
                                }
                            }
                        ]
                    ]
                ]
            ]
        ];
    }




    this.$('text', '');




}, function Header() {


    yaxi.Component.apply(this, arguments);


});

