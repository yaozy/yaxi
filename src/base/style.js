yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    var create = Object.create;

    var cache = create(null);

    var defaults = this.$defaults = create(null);

    var map;
    


    Class.ctor = function (parent, data) {

        this.$parent = parent;
        this.$storage = create(defaults);

        if (data)
        {
            this.__init(data);
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



    
    this.__init = function (data) {

        if (typeof data === 'string')
        {
            data = cache[data] || parse(data, map, yaxi.color);
        }

        base.__init.call(this, data);
    }



    this.__update_patch = function () {

        var dom, changes;

        if ((dom = this.$parent) && (dom = dom.$dom) && (changes = this.__changes))
        {
            var storage = this.$storage,
                style = dom.style;

            for (var name in changes)
            {
                storage[name] = style[name] = changes[name];
            }

            this.__changes = null;
        }
    }


});
