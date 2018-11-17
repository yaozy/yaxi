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



    
    // 定义属性方法
    return function (name, options) {

        if (/\W/.test(name))
        {
            throw '"' + name + '" not a valid property name!'; 
        }

        if (options == null)
        {
            options = { defaultValue: null };
        }
        else if (typeof options !== 'object')
        {
            options = { defaultValue: options };
        }
        
        var type = options.type,
            defaultValue = options.defaultValue,
            convertor = options.convertor || null,
            alias = options.name || (options.name = name);

        if (defaultValue === void 0)
        {
            options.defaultValue = defaultValue = null;
        }

        this.__defaults[name] = defaultValue;

        if (!type)
        {
            options.type = type = typeof defaultValue;
        }

        switch (type)
        {
            case 'boolean':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_boolean), alias);
                break;

            case 'int':
            case 'integer':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_integer), alias);
                break;

            case 'number':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_number), alias);
                break;

            case 'string':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_string), alias);
                break;

            case 'date':
                options.get = get(name, alias);
                options.set = set(name, convertor || (convertor = to_date), alias);
                break;

            default:
                options.get = get(name, alias);
                options.set = set(name, convertor, alias);
                break;
        }

        this['__convert_' + name] = [alias, options.convertor = convertor];

        define(this, name, this.__properties[name] = options);
    }


}
