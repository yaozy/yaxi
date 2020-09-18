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
            throw 'define property error: "' + name + '" not a valid property name!'; 
        }

        var converts = this.$converts;
        var alias;

        if (!options || typeof options !== 'object')
        {
            options = {
                change: options !== false
            };
        }

        this.$defaults[name] = defaultValue = defaultValue != null ? defaultValue : null;

        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            // 指定了get的情况下不支持转换器, 直接设置属性值
            converts[name] = null;

            options.set || (options.set = function () {

                var type = this.typeName;
                throw 'property "' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!';
            });
        }
        else
        {
            options.change = options.change !== false;
            options.convert || (options.convert = cache[options.type || typeof defaultValue]);

            options.get = this.__build_get(name, options);
            options.set || (options.set = this.__build_set(name, options));

            // convert等于false则不创建转换器
            converts[name] = options.convert === false ? null : {
                name: name,
                change: options.change,
                style: !!options.style,
                fn: options.convert
            };
        }

        define(this, name, options);

        if ((alias = options.alias) && alias !== name)
        {
            converts[alias] = converts[name];
            define(this, alias, options);
        }
    }


}

