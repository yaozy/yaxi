yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    var create = Object.create;

    var defaults = this.$defaults = create(null);
    


    Class.ctor = function (parent) {

        this.parent = parent;
        this.$storage = create(defaults);
    }
    


    ;(function () {

        var keys = {},
            style = document.createElement('div').style,
            regex = /^(?:webkit|ms|moz|o)([A-Z])/;

        function replace(_, key) {

            return key.toLowerCase();
        }

        for (var name in style)
        {
            switch (name)
            {
                case 'cssFloat':
                case 'styleFloat':
                    keys.float = { name: name, defaultValue: '' };
                    break;

                case 'cssText':
                    break;

                default:
                keys[key = name.replace(regex, replace)] = { name: name, defaultValue: '' };
                    break;
            }
        }

        for (var name in keys)
        {
            this.$property(name, keys[name]);
        }

    }).call(this);




    this.__update_patch = function () {

        var dom, changes;

        if ((dom = this.parent) && (dom = dom.$dom) && (changes = this.__changes))
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
