yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    var create = Object.create;

    var cache = create(null);

    var defaults = this.$defaults = create(null);

    var map;
    


    Class.ctor = function (owner, values) {

        this.$owner = owner;
        this.$storage = create(defaults);

        if (values)
        {
            this.assign(values);
        }
    }
    


    ;(function () {

        var keys = map = Object.create(null),
            properties = {},
            style = document.createElement('div').style,
            regex1 = /^(?:webkit|ms|moz|o)([A-Z])/,
            regex2 = /([A-Z])/g,
            key;

        function replace(_, key) {

            return key.toLowerCase();
        }

        function css(_, key) {

            return '-' + key.toLowerCase();
        }

        for (var name in style)
        {
            switch (name)
            {
                case 'cssFloat':
                case 'styleFloat':
                    properties.float = { name: name, defaultValue: '' };
                    keys.float = 'float';
                    break;

                case 'cssText':
                    break;

                default:
                    properties[key = name.replace(regex1, replace)] = { name: name, defaultValue: '' };
                    keys[key.replace(regex2, css)] = key;
                    break;
            }
        }

        for (var name in properties)
        {
            this.$property(name, properties[name]);
        }

    }).call(this);




    function parse(text, map, color) {

        var style = create(null),
            regex1 = /\s*:\s*/g,
            regex2 = /^\s+/,
            regex3 = /\s+$/,
            tokens = text.split(';'),
            token,
            list,
            name;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if ((token = tokens[i]) && (list = token.split(regex1, 2)))
            {
                if (token = list[1])
                {
                    name =  list[0].replace(regex2, '');
                    name = map[name] || name;

                    token = token.replace(regex3, '');

                    switch (token[0])
                    {
                        case '@':
                            if (token.length > 1 && (token = color[token.substring(1)]))
                            {
                                style[name] = token;
                            }
                            break;

                        case '%':
                            if (token.length > 1)
                            {
                                (style.bindings || (style.bindings = {}))[name] = token.substring(1);
                            }
                            break;

                        default:
                            style[name] = token;
                            break;
                    }
                }
            }
        }

        return cache[text] = style;
    }



    
    this.assign = function (values) {

        if (typeof values === 'string')
        {
            values = cache[values] || parse(values, map, yaxi.color);
        }

        base.assign.call(this, values);
    }



    this.__update_patch = function () {

        var dom, changes;

        if ((dom = this.$owner) && (dom = dom.$dom) && (changes = this.__changes))
        {
            var storage = this.$storage,
                style = dom.style,
                value;

            for (var name in changes)
            {
                value = changes[name];

                // 圆角边框转换rem为px以解决在android下不圆的问题
                if (name === 'borderRadius' && value.indexOf('rem') > 0)
                {
                    style[name] = (parseFloat(value) * yaxi.rem | 0) + 'px';
                }
                else
                {
                    style[name] = value;
                }

                storage[name] = value;
            }

            this.__changes = null;
        }
    }


});
