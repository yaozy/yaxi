// 扩展创建属性方法
yaxi.impl.property = function (target) {



    var define = Object.defineProperty;

    var cache = Object.create(null);



    cache.boolean = function (value) {
        
        return !!value && value !== 'false';
    }


    cache.integer = function (value) {

        return value | 0;
    }


    cache.number = function (value) {

        return +value || 0;
    }


    cache.string = function (value) {

        return '' + value;
    }


    cache.date = function (value) {

        return Date.create(value);
    }


    
    // 定义属性方法
    return function (name, defaultValue, options) {

        if (/[^\w-]/.test(name))
        {
            throw new Error('define property error: "' + name + '" not a valid property name!'); 
        }

        var properties = this.$properties;
        var alias;

        this.$defaults[name] = defaultValue = defaultValue != null ? defaultValue : null;

        if (!options || typeof options !== 'object')
        {
            options = {
                name: name,
                type: typeof defaultValue,
                change: options !== false
            };
        }
        else
        {
            options.name = name;
            options.type || (options.type = typeof defaultValue);
            options.change = options.change !== false;
        }

        options.defaultValue = defaultValue;

        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            options.convert || (options.convert = null);
            options.set || (options.set = function () {

                var type = this.typeName;
                throw new Error('property "' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!');
            });
        }
        else
        {
            options.convert || (options.convert = cache[options.type]);
            options.get = this.__build_get(name, options);
            options.set || (options.set = this.__build_set(name, options));
        }

        define(this, name, properties[name] = options);

        if ((alias = options.alias) && alias !== name)
        {
            define(this, alias, properties[alias] = options);
        }
    }


}

