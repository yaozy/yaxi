yaxi.Style = Object.extend.call({}, function () {
    


    function get(name) {

        return function () {
    
            return (this.__changes || this.$storage)[name] || '';
        }
    }


    function set(name) {

        return function (value) {
        
            var changes;
    
            value = '' + value;
    
            if (changes = this.__changes)
            {
                if (value === changes[name])
                {
                    return;
                }
    
                if (value !== this.$storage[name])
                {
                    changes[name] = value;
                }
                else
                {
                    delete changes[name];
                }
            }
            else if (value !== this.$storage[name])
            {
                (this.__changes = {})[name] = value;
    
                if ((value = this.$control) && !value.__dirty)
                {
                    value.$patch();
                }
            }
        }
    }

    
    ;(function () {

        var define = Object.defineProperty,
            styles = yaxi.styles = {},
            regex1 = /^(?:webkit|ms|moz|o)([A-Z])/,
            regex2 = /[A-Z]/g,
            style = document.createElement('div').style,
            key,
            any;

        function lower(_, text) {

            return text.toLowerCase();
        }

        function css(text) {
        
            return '-' + text.toLowerCase();
        }

        for (var name in style)
        {
            switch (name)
            {
                case 'cssFloat':
                case 'styleFloat':
                    if (!styles.float)
                    {
                        styles.float = ['float', 'float', name];
                    }
                    break;

                case 'cssText':
                    break;

                default:
                    key = name.replace(regex1, lower);

                    if (key === name || !styles[key])
                    {
                        styles[key] = [key, name.replace(regex2, css), name];
                    }
                    break;
            }
        }

        for (var name in styles)
        {
            style = styles[name];
            key = style[2];

            define(this, name = style[0], any = {
                get: get(key),
                set: set(key)
            });
            
            if (name !== (key = style[1]))
            {
                define(this, key, any);
                styles[key] = style;
            }
        }

    }).call(this);



    // 扩展绑定实现
    yaxi.impl.binding.call(this);



    // 赋值
    this.assign = function (values) {

        if (values)
        {
            var changes = this.__changes = {};

            for (var name in values)
            {
                if (name !== 'bindings')
                {
                    changes[name] = '' + values[name];
                }
                else
                {
                    this.__set_bindings(values[name]);
                }
            }
        }

        return this;
    }



    this.__patch = function (dom, changes) {

        var storage = this.$storage,
            style = dom.style;

        for (var name in changes)
        {
            storage[name] = style[name] = changes[name];
        }

        this.__changes = null;
    }



}, function Style(control) {

    this.$control = control;
    this.$storage = Object.create(null);
});
