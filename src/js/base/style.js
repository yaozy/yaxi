yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    var create = Object.create;
    


    Class.ctor = function (data) {

        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }
    }
    


    this.$properties((function () {

        var properties = {},
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
                    properties.float = { name: name, defaultValue: '' };
                    break;

                case 'cssText':
                    break;

                default:
                    properties[name.replace(regex, replace)] = { name: name, defaultValue: '' };
                    break;
            }
        }

        return properties;

    })());



    this.__update_patch = function () {

        var dom = this.parent.$dom,
            changes;

        if (dom && (changes = this.__changes))
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
