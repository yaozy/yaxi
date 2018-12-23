yaxi.__extend_properties = function (get, set) {



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
    return function (name, options, change) {

        var defaultValue, converter, key;

        if (/\W/.test(name))
        {
            throw '"' + name + '" not a valid property name!'; 
        }

        if (options && typeof options === 'object')
        {
            key = options.name || name;
            defaultValue = options.defaultValue;
            converter = options.converter;

            if (defaultValue === void 0)
            {
                defaultValue = null;
            }
        }
        else
        {
            key = name;
            defaultValue = options == null ? null : options;
            options = {};
        }

        if (!converter)
        {
            switch (options.type || typeof defaultValue)
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
 
        options.get || (options.get = get(key, change = change !== false));
        options.set || (options.set = set(key, converter, change));

        this.$defaults[name] = defaultValue;

        this.$converters[name] = {
            name: key,
            change: change,
            fn: converter
        };

        define(this, name, options);
    }


}
