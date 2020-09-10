yaxi.impl.property = function (get, set) {



    var define = Object.defineProperty;




    function to_boolean(value) {
        
        return !!value;
    }


    function to_integer(value) {

        return value | 0;
    }


    function to_number(value) {

        return +value || 0;
    }


    function to_string(value) {

        return '' + value;
    }


    function to_date(value) {

        return Date.create(value);
    }


    function to_object(value) {

        return value;
    }

    
    // 定义属性方法
    return function (name, options, change, alias) {

        var converter, value;

        if (/[^\w-]/.test(name))
        {
            throw '"' + name + '" not a valid property name!'; 
        }

        if (options && typeof options === 'object')
        {
            value = options.defaultValue;
            converter = options.converter;

            if (value === void 0)
            {
                value = null;
            }
        }
        else
        {
            value = options == null ? null : options;
            options = {};
        }

        if (!converter)
        {
            switch (options.type || typeof value)
            {
                case 'boolean':
                    converter = to_boolean;
                    break;
    
                case 'int':
                case 'integer':
                    converter = to_integer;
                    break;
    
                case 'number':
                    converter = to_number;
                    break;
    
                case 'string':
                    converter = to_string;
                    break;
    
                case 'date':
                    converter = to_date;
                    break;
    
                default:
                    converter = to_object;
                    break;
            }
        }
 
        change = change !== false;
    
        this.$defaults[name] = value;

        value = {
            name: name,
            change: change,
            fn: converter
        };

        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            converter = this.$converter;
            converter[name] = false; // 指定了get的情况下不支持转换器

            options.set || (options.set = function () {

                var type = this.typeName;
                throw '"' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!';
            });
        }
        else
        {
            options.get = get(name, change);
            options.set || (options.set = set(name, converter, change));

            converter = this.$converter;
            converter[name] = value;
        }

        define(this, name, options);

        if (alias)
        {
            converter[alias] = converter[name];
            define(this, alias, options);
        }
    }


}
