// 扩展创建属性方法
yaxi.impl.property = function (target) {



    var define = Object.defineProperty;

    var cache = Object.create(null);



    cache.boolean = function (value) {
        
        return !!value;
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
            throw '"' + name + '" not a valid property name!'; 
        }

        var converts = this.$converts;
        var alias;

        if (!options || typeof options !== 'object')
        {
            options = {};
        }

        this.$defaults[name] = defaultValue = defaultValue != null ? defaultValue : null;

        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            converts[name] = null; // 指定了get的情况下不支持转换器, 直接设置属性值

            options.set || (options.set = function () {

                var type = this.typeName;
                throw '"' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!';
            });
        }
        else
        {
            options.change = options.change !== false;

            options.get = this.__build_get(name, options);
            options.set || (options.set = this.__build_set(name, options));

            // convert等于false则不创建转换器
            converts[name] = options.convert === false ? null : {
                name: name,
                change: options.change,
                fn: options.convert || (options.convert = cache[options.type || typeof defaultValue])
            };
        }

        define(this, name, options);

        if (alias = options.alias)
        {
            converts[alias] = converts[name];
            define(this, alias, options);
        }
    }


}

