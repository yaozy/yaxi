yaxi.showMessage = function (options) {

    var i18n = yaxi.i18n,
        buttons,
        callback;

    if (!options || typeof options !== 'object')
    {
        options = {
            header: yaxi.showMessage.header || '',
            content: {
                textAlign: 'center',
                children: [
                    {
                        Class: yaxi.Text,
                        text: options
                    }
                ]
            }
        };
    }
    else
    {
        options.header || (options.header = yaxi.showMessage.header || '');
        
        if (typeof options.content === 'string')
        {
            options.content = {
                wordBreak: 'break-word',
                children: [
                    {
                        Class: yaxi.Multiline,
                        text: options.content
                    }
                ]
            };
        }

        if (buttons = options.buttons)
        {
            var length = buttons.length,
                width = (1000000 / length | 0) / 10000 + '%';

            for (var i = 0; i < length; i++)
            {
                var item = buttons[i];

                if (item && typeof item === 'object')
                {
                    if (!item.text)
                    {
                        item.text = i18n[item.key] || item.key;
                    }
                }
                else
                {
                    buttons[i] = item = {
                        key: item,
                        text: i18n[item] || item
                    }
                }

                item.width = width;

                if (i > 0)
                {
                    item.line = 'left';
                }
            }
        }
        
        callback = options.callback;
    }
 
    options.class = 'yx-messagebox';

    options.footer = {
        subtype: yaxi.Button,
        children: options.buttons || [
            {
                key: 'OK',
                text: i18n.OK,
                width: '100%'
            }
        ],
        events: {
            tap: function (event) {

                var dialog = this.parent,
                    target = event.target;

                if (target !== this && target.key && (!callback || callback.call(dialog, target) !== false))
                {
                    dialog.close();
                }
            }
        }
    };
    
    return new yaxi.Dialog().assign(options).open();
}


yaxi.prompt = function (options) {

    var callback = options && options.callback;

    options = options || {};

    callback && (options.callback = function (button) {

        return callback.call(this, this.content.find('>>@input').text, button);
    });

    options.content = {
        margin: 0,
        padding: '.1rem .3rem .3rem',
        children: [
            {
                Class: options.control || (options.password ? yaxi.Password : yaxi.TextBox),
                key: 'input',
                value: options.value || '',
                placeholder: options.placeholder || '',
                width: '100%',
                borderStyle: 'none none solid none'
            }
        ]
    };

    options.buttons || (options.buttons = [
        'Cancel',
        {
            theme: 'primary',
            key: 'OK'
        }
    ]);

    return yaxi.showMessage(options);
}
