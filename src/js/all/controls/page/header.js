yaxi.Component.extend('Header', function (Class, base) {



    // 默认标题文字
    Class.text = 'yaxi';



    Class.allowParent = function (parent) {

        if (parent && parent.isTopLevel)
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
                height: '80rem',
                paddingLeft: '20rem'
            },
            [
                [
                    'icon',
                    {
                        icon: 'common-back',
                        width: '80rem',
                        height: '100%',
                        marginLeft: '-20rem',
                        hidden: yaxi.currentPages.length < 1,
                        events: {
    
                            tap: function handleClose() {
    
                                self.root.close('Back');
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

