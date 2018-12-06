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

        var defaultValue, convertor, key;

        if (/\W/.test(name))
        {
            throw '"' + name + '" not a valid property name!'; 
        }

        if (options && typeof options === 'object')
        {
            key = options.name || name;
            defaultValue = options.defaultValue;
            convertor = options.convertor;

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

        if (!convertor)
        {
            switch (options.type || typeof defaultValue)
            {
                case 'boolean':
                    convertor = to_boolean;
                    break;
    
                case 'int':
                case 'integer':
                    convertor = to_integer;
                    break;
    
                case 'number':
                    convertor = to_number;
                    break;
    
                case 'string':
                    convertor = to_string;
                    break;
    
                case 'date':
                    convertor = to_date;
                    break;
    
                default:
                    convertor = to_object;
                    break;
            }
        }
 
        options.get || (options.get = get(key, change = change !== false));
        options.set || (options.set = set(key, convertor, change));

        this.$defaults[name] = defaultValue;
        this['__convert_' + name] = [key, convertor, change];

        define(this, name, options);
    }


}
