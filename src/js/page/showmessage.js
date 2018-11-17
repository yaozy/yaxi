yaxi.showMessage = function (options) {

    var Button = yaxi.Button,
        dialog,
        content,
        callback;

    if (typeof options === 'string')
    {
        options = {
            header: options
        }
    }
    else
    {
        options = options || {};
    }

    if ((content = options.content) && typeof content === 'string')
    {
        content = [
            {
                Class: yaxi.HtmlControl,
                html: content
            }
        ];
    }

    callback = options.callback;

    options = {
        className: 'yx-messagebox',
        header: options.header || yaxi.showMessage.header,
        content: {
            layout: 'row',
            style: {
                alignItems: 'center',
                wordBreak: 'break-word'
            },
            children: content
        },
        footer: {
            subtype: Button,
            children: options.buttons || [
                {
                    key: 'OK',
                    text: Button[yaxi.language].OK
                }
            ],
            events: {

                tap: function (event) {

                    var target = event.target;

                    if (target !== this && target.key && (!callback || callback.call(dialog, target) !== false))
                    {
                        dialog.close();
                    }
                }
            }
        }
    };
    
    dialog = new yaxi.Dialog(options);
    dialog.open();

    return dialog;
}


yaxi.prompt = function (options) {

    var callback = options && options.callback,
        i18n = yaxi.Button[yaxi.language];

    options = options || {};

    callback && (options.callback = function (button) {

        return callback.call(this, this.content.findByKey('input').displayText, button);
    });

    options.content = [
        {
            Class: options.control || (options.password ? yaxi.Password : yaxi.TextBox),
            key: 'input',
            text: options.value || '',
            style: {
                width: '100%',
                margin: '.3rem 0 .2rem',
                borderStyle: 'none none solid none'
            }
        }
    ];

    options.buttons || (options.buttons = [
        {
            theme: 'primary',
            key: 'OK',
            text: i18n.OK
        },
        {
            key: 'Cancel',
            text: i18n.Cancel
        }
    ]);

    return yaxi.showMessage(options);
}
