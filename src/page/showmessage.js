yaxi.showMessage = function (options) {

    var Button = yaxi.Button,
        i18n = Button[yaxi.language] || Button['en-US'],
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
            for (var i = buttons.length; i--;)
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
                    buttons[i] = {
                        key: item,
                        text: i18n[item] || item
                    }
                }
            }
        }
        
        callback = options.callback;
    }
 
    options.className = 'yx-messagebox';

    options.footer = {
        subtype: Button,
        layout: 'same-width',
        gap: '1px',
        children: options.buttons || [
            {
                key: 'OK',
                text: i18n.OK
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
