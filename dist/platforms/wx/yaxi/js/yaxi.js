'use strict'



// yaxi全局变量
var yaxi = Object.create(null);


// 输出至AMD或CMD
if (typeof module !== 'undefined')
{
    module.exports = yaxi;

    // 调试用
    if (typeof window !== 'undefined')
    {
        window.global = yaxi;
    }
}
else if (typeof window !== 'undefined')
{
    window.yaxi = yaxi;
}



// 接口实现
yaxi.impl = Object.create(null);


// 注册的类型集合
yaxi.classes = Object.create(null);




// 设置默认类型导出对象为自身
// 比如yaxi.Control.extend('Box' ... 会导出类为yaxi.Box
// 框架初始化完毕后清除
yaxi.exports = yaxi;



// 对象继承实现
Object.extend = function (name, fn, Class, force) {
	
    if (this.sealed)
    {
        throw new Error(this.typeName + ' is sealed, can not be extended!');
    }

    var base = this.prototype || null;
    var prototype = Object.create(base);
    var classes, ctor;

    if (typeof name === 'function')
    {
        force = Class;
        Class = fn;
        fn = name;
        name = '';
    }
    else if (Class === true) // 在具名的情况下第三或第四个参数传的是true表示强制覆盖同名类
    {
        force = true;
        Class = false;
    }

    if (Class)
    {
        Class.ctor = Class;
    }
    else
    {
        Class = function Class() {

            if (ctor)
            {
                ctor.apply(this, arguments);
            }
        }

        Class.ctor = this.ctor;
    }
	
    Class.superclass = base ? this : null;
    Class.extend = this.extend || Object.extend;
    Class.prototype = prototype;

    prototype.constructor = Class;

    // 类扩展前处理
    if (prototype.__class_init)
    {
        prototype.__class_init(Class);
    }

    if (fn)
    {
        fn.call(prototype, Class, base, yaxi);
        ctor = Class.ctor;
    }

    if (name && (classes = yaxi.classes))
    {
        if (force || !classes[name])
        {
            // 绑定到类容器
            if (force = yaxi.exports)
            {
                force[name] = Class;
            }

            classes[Class.typeName = prototype.typeName = name] = Class;
            classes[name = name.toLowerCase()] = Class;
        }
        else
        {
            throw new Error('class name "' + name + '" has exists!');
        }
    }

	return Class;
}





Function.prototype.bind || (Function.prototype.bind = function (context) {

    var fn = this;

    if (arguments.length > 1)
    {
        var list = [].slice.call(arguments, 1),
            push = list.push;

        return function () {

            var data = list.slice(0);

            if (arguments.length > 0)
            {
                push.apply(data, arguments);
            }

            return fn.apply(context || this, data);
        };
    }

    return function () {

        return fn.apply(context || this, arguments);
    };
});




(function () {
    

    var regex = /([yMdhmsSq]+)/g;
    
    var keys1 = {
    
        'GMT': 'toGMTString',
        'ISO': 'toISOString',
        'UTC': 'toUTCString',
        'date': 'toDateString',
        'time': 'toTimeString',
        'locale': 'toLocaleString',
        'locale-date': 'toLocaleDateString',
        'locale-time': 'toLocaleTimeString'
    };

    var keys2 = {

        'y': 'getFullYear',
        'd': 'getDate',
        'h': 'getHours',
        'm': 'getMinutes',
        's': 'getSeconds',
        'S': 'getMilliseconds'
    };


    this.format = function (format) {

        var any;

        if (format)
        {
            if (any = keys1[format])
            {
                return this[any]();
            }

            any = this;

            return format.replace(regex, function (_, text) {

                var length = text.length;

                switch (text = text.charAt(0))
                {
                    case 'M':
                        text = any.getMonth() + 1;
                        break;

                    case 'q':
                        text = (any.getMonth() + 3) / 3 | 0;
                        break;

                    default:
                        text = any[keys2[text]]();
                        break;
                }

                text = '' + text;

                if (length === 1 || (length -= text.length) <= 0)
                {
                    return text;
                }

                //substr负索引有IE7下有问题
                return '0000'.substring(0, length) + text;
            });
        }
        
        return this.toString();
    };



    this.addHour = function (value) {

        if (value |= 0)
        {
            this.setTime(this.getTime() + value * 3600000);
        }

        return this;
    }


    this.addMinute = function (value) {

        if (value |= 0)
        {
            this.setTime(this.getTime() + value * 60000);
        }

        return this;
    }


    this.addSecond = function (value) {

        if (value |= 0)
        {
            this.setTime(this.getTime() + value * 1000);
        }

        return this;
    }


    //解决不同浏览器对字符串解析不同的问题(不同浏览器之间存在很多差别)
    //比如IE不支持new Date('2017-1-1 1:1:1')
    Date.create = function (value) {

        if (value)
        {
            var date = new Date(value),
                any = date.valueOf();

            if (any === any)
            {
                return date;
            }

            if (typeof value === 'string' && (value = value.match(/\d+/g)))
            {
                any = value[1] | 0;
                return new Date(value[0], any > 0 ? any - 1 : 0, value[2] | 0, value[3] | 0, value[4] | 0, value[5] | 0);
            }
        }

        return null;
    };



}).call(Date.prototype);




;(function (html) {


    var encode = Object.create(null);

    var decode = Object.create(null);


    encode['&'] = '&amp;';
    encode['<'] = '&lt;';
    encode['>'] = '&gt;';
    encode['\''] = '&apos;';
    encode['"'] = '&quot;';

    decode['amp'] = '&';
    decode['lt'] = '<';
    decode['gt'] = '>';
    decode['apos'] = '\'';
    decode['quot'] = '"';



    //html编码函数
    html.encode = function (text) {

        if (text && typeof text === 'string')
        {
            var keys = encode;

            return text.replace(/([&<>'"])/g, function (_, key) {

                return keys[key];
            });
        }

        return '' + text;
    }


    //html解码函数
    html.decode = function (text) {

        var keys = decode;

        return text && text.replace(/&(\w+);/g, function (_, key) {

            return keys[key] || key;
        });
    }



})(yaxi.html = Object.create(null));







(function (buffer) {


    buffer.fromString = function (value, callbackFn) {

        var data = new Blob([value], { type: 'text/plain' });
        var file = new FileReader();

        file.onload = function () {
            
            callbackFn(this.result);
        }

        file.readAsArrayBuffer(data);
    }


    buffer.toString = function (buffer, callbackFn) {

        var reader = new FileReader();
        
        buffer = new Blob([buffer]);

        reader.onload = function () {

            callbackFn(this.result)
        };

        reader.readAsText(buffer, 'utf-8');
    }


    buffer.fromBase64 = function (value) {

        var data = window.atob(value);
        var length = data.length;
        var array = new Uint8Array(length);
 
        for (var i = 0; i < length; ++i)
        {
            array[i] = data.charCodeAt(i);
        }

        return array.buffer;
    }


    buffer.toBase64 = function (buffer) {

        var bytes = new Uint8Array(buffer);
        var length = bytes.byteLength;
        var result = new Array(length);

        for (var i = 0; i < length; i++)
        {
            result[i] = String.fromCharCode(bytes[i]);
        }

        return window.btoa(result.join(''));
    }


})(yaxi.buffer = Object.create(null));





;(function (Math) {



    var round = Math.round;

    var toFixed = (0).toFixed;

    var cache = new Decimal(0);



    // 小数处理类
    function Decimal(value) {

        var v, d;

        if (value)
        {
            if (value instanceof Decimal)
            {
                d = value.d;
                v = value.v;
            }
            else if ((value = +value) === value)
            {
                if (value === (value | 0))
                {
                    v = value;
                }
                else if (d = (v = ('' + value).split('.'))[1])
                {
                    d = d.length;
                    v = +(v[0] + v[1]);
                }
                else
                {
                    d = 0;
                    v = value;
                }
            }
        }

        this.v = v || 0;
        this.d = d || 0;

        return this;
    }
    


    Decimal.singleton = Decimal.bind(new Decimal(0));



    yaxi.Decimal = Decimal;
    

    var prototype = Decimal.prototype;



    prototype.clone = function () {

        var result = Object.create(prototype);

        result.v = this.v;
        result.d = this.d;

        return result;
    }


    prototype.plus = function (value) {

        var d1, d2;

        if (!value)
        {
            return this;
        }
        
        if (value instanceof Decimal)
        {
            d2 = value.d;
            value = value.v;
        }
        else if ((value = +value) !== value)
        {
            return this;
        }
        else if (value === (value | 0))
        {
            d2 = 0;
        }
        else if (d2 = (value = ('' + value).split('.'))[1])
        {
            d2 = d2.length;
            value = +(value[0] + value[1]);
        }
        else
        {
            d2 = 0;
        }
        
        if ((d1 = this.d) > d2)
        {
            this.v += value * ('1e' + d1) / ('1e' + d2);
        }
        else if (d1 < d2)
        {
            this.d = d2;
            this.v = this.v * ('1e' + d2) / ('1e' + d1) + value;
        }
        else
        {
            this.v += value;
        }

        return this;
    }


    prototype.minus = function (value) {

        return this.plus(-value);
    }


    prototype.mul = function (value) {

        var d;

        if (!value)
        {
            this.v = this.d = 0;
            return this;
        }

        if (!this.v)
        {
            return this;
        }

        if (value instanceof Decimal)
        {
            d = value.d;
            value = value.v;
        }
        else if ((value = +value) !== value)
        {
            return this;
        }
        else if (value === (value | 0))
        {
            d = 0;
        }
        else if (d = (value = ('' + value).split('.'))[1])
        {
            d = d.length;
            value = +(value[0] + value[1]);
        }
        else
        {
            d = 0;
        }

        if (value)
        {
            this.v *= value;
        }
        else
        {
            this.v = this.d = 0;
            return this;
        }

        this.d += d;

        return this;
    }


    prototype.div = function (value) {

        var d1, d2;
        
        if (!value)
        {
            this.v = this.d = 0;
            return this;
        }

        if (!this.v)
        {
            return this;
        }

        if (value instanceof Decimal)
        {
            d2 = value.d;
            value = this.v / value.v;
        }
        else if ((value = +value) !== value)
        {
            this.v = this.d = 0;
            return this;
        }
        else if (value === (value | 0))
        {
            d2 = 0;
        }
        else if (d2 = (value = ('' + value).split('.'))[1])
        {
            d2 = d2.length;
            value = +(value[0] + value[1]);
        }
        else
        {
            d2 = 0;
        }

        if (!value)
        {
            this.v = this.d = 0;
            return this;
        }

        if ((d1 = this.d) !== d2)
        {
            if (d1 > d2)
            {
                value = this.v / (value * ('1e' + (d1 - d2)));
            }
            else
            {
                value = this.v * ('1e' + (d2 - d1)) / value;
            }
        }
        else
        {
            value = this.v / value;
        }

        value = Decimal.call(cache, value);

        this.v = value.v;
        this.d = value.d;

        return this;
    }


    prototype.pow10 = function (value) {

        if (value |= 0)
        {
            var v = this.v;

            if (!v)
            {
                return this;
            }

            if (value > 0)
            {
                var d = this.d;

                if (value > d)
                {
                    this.d = 0;
                    this.v *= '1e' + (value - d);
                }
                else if (value === d)
                {
                    this.d = 0;
                }
                else
                {
                    this.d -= value;
                }
            }
            else
            {
                this.d -= value;
            }
        }

        return this;
    }


    prototype.round = function (digits) {

        var d = this.d;

        if ((digits |= 0) < d)
        {
            this.v = round(this.v / ('1e' + (d - digits)));
            this.d = digits;
        }

        return this;
    }


    prototype.toFixed = function (digits) {

        var d = this.d,
            v = this.v;

        if (d > 0)
        {
            v = v / ('1e' + d);
        }

        return v.toFixed(digits);
    }


    prototype.toString = function (k) {

        var d = this.d,
            v = this.v;

        if (d > 0)
        {
            v = v / ('1e' + d);
        }

        return v.toString(k);
    }



    Object.defineProperty(prototype, 'value', {

        get: prototype.valueOf = function () {

            var d = this.d,
                v = this.v;

            if (d > 0)
            {
                v = v / ('1e' + d);
            }

            return v;
        }
    });




    // 扩展数字方法
    var number = Number.prototype;


    // 注: 不同浏览器toFixed有差异, chrome使用的是银行家舍入规则
    // 银行家舍入: 所谓银行家舍入法, 其实质是一种四舍六入五取偶(又称四舍六入五留双)法
    // 简单来说就是: 四舍六入五考虑, 五后非零就进一, 五后为零看奇偶, 五前为奇应舍去, 五前为偶要进一
    // 此处统一处理为四舍五入
    if ((1.115).toFixed(2) === '1.11')
    {
        number.toFixed = function (digits) {

            return toFixed.call(roundFix(+this, digits |= 0), digits);
        }
    }


    number.round = function (digits) {

        return roundFix(+this, digits);
    }



    // 重载四舍五入方法增加指定小数位数
    function roundFix(value, digits) {

        if (value !== value)
        {
            return 0;
        }

        if ((digits |= 0) > 0)
        {
            digits = '1e' + digits;
            return round(value * digits) / digits;
        }

        return round(value);
    }



    Math.round = roundFix;



})(Math);




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
                kind: 'field',
                change: options !== false
            };
        }
        else
        {
            options.name = name;
            options.type || (options.type = typeof defaultValue);
            options.kind || (options.kind = 'field');
            options.change = options.change !== false;
        }

        options.defaultValue = defaultValue;

        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            options.change = false;
            options.convert || (options.convert = null);

            options.set || (options.set = function () {

                var type = this.typeName;
                throw new Error('property "' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!');
            });
        }
        else
        {
            if (options.convert === void 0)
            {
                options.convert = cache[options.type];
            }
            
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






yaxi.Event = Object.extend.call({}, function (Class) {


    
    this.type = '';


    this.target = null;


    this.cancelBubble = false;

    
    this.defaultPrevented = false;



    this.stop = function () {

        this.cancelBubble = true;
    }


    this.prevent = function () {

        this.defaultPrevented = true;
    }

    
}, function Event(type, detail) {

    this.type = type;

    if (detail)
    {
        this.detail = detail;
    }
});



yaxi.EventTarget = Object.extend(function (Class, base, yaxi) {

    
    var Event = yaxi.Event;

    var prototype = this;

    

    // 注册事件
    this.on = function (type, listener) {
        
        if (type && typeof listener === 'function')
        {
            var events = this.__event_keys,
                items;

            if (events)
            {
                if (items = events[type])
                {
                    items.push(listener);
                }
                else
                {
                    items = events[type] = [listener];
                }
            }
            else
            {
                events = this.__event_keys = {};
                items = events[type] = [listener];
            }
            
            if (listener = this.__event_change)
            {
                this.__event_change(type, items, true);
            }
        }
    }


    // 注册只执行一次的事件
    this.once = function (type, listener) {

        if (typeof listener === 'function')
        {
            var callbackFn = function (event) {

                listener.call(this, event);
                this.off(type, callbackFn);
            }

            this.on(type, callbackFn);
        }
    }


    // 注销事件
    this.off = function (type, listener) {
        
        var events = this.__event_keys,
            items;

        if (!events)
        {
            return;
        }

        if (!type)
        {
            for (type in events)
            {
                this.off(type);
            }
        }
        else if (items = events[type])
        {
            if (listener)
            {
                for (var i = items.length; i--;)
                {
                    if (items[i] === listener)
                    {
                        items.splice(i, 1);
                    }
                }

                if (!items[0])
                {
                    events[type] = null;
                }
            }
            else
            {
                items.length = 0;
                events[type] = null;
            }

            if (listener = this.__event_change)
            {
                listener.call(this, type, items, false);
            }
        }
    }


    // 触发事件
    this.trigger = function (event, detail, bubble) {
        
        var target = this,
            events,
            index,
            type,
            fn;

        if (!event)
        {
            return false;
        }

        if (typeof event === 'object')
        {
            type = event.type;
        }
        else
        {
            event = new Event(type = '' + event);
        }

        event.target = this;

        if (detail !== void 0)
        {
            event.detail = detail;
        }

        do
        {
            if ((events = target.__event_keys) && (events = events[type]))
            {
                index = 0;

                while (fn = events[index++])
                {
                    if (fn.call(event.source = target, event) === false)
                    {
                        event.defaultPrevented = true;
                    }
    
                    if (event.cancelBubble)
                    {
                        return !event.defaultPrevented;
                    }
                }
            }

            if (bubble === false)
            {
                break;
            }

            // 影子控件再向上冒泡时要修改target为容器控件
            if (target.__shadow)
            {
                event.target = target.parent;
            }
        }
        while (target = target.parent);

        return !event.defaultPrevented;
    }


    // 检测是否注册了指定的事件
    this.hasEvent = function (type, listener) {

        var events = this.__event_keys,
            items;

        if (events && (items = events[type]) && items[0])
        {
            if (!listener)
            {
                return true;
            }

            for (var i = items.length; i--;)
            {
                if (items[i] === listener)
                {
                    return true;
                }
            }
        }

        return false;
    }



    ;(Class.mixin = function (target) {

        target.on = prototype.on;
        target.once = prototype.once;
        target.off = prototype.off;
        target.trigger = prototype.trigger;
        target.hasEvent = prototype.hasEvent;

    })(yaxi);


});




yaxi.Stream = Object.extend(function (Class) {



    Class.fromPromise = function (promise) {

        var instance = new Class();

        if (typeof promise === 'function')
        {
            promise = promise();
        }

        promise
            .then(function (value) {

                instance.resolve(value);
            })
            .catch(function (reason) {

                instance.reject(reason);
            });

        return instance;
    }


    Class.interval = function (period) {

        var instance = new Class();
        var value = 0;

        function interval() {

            setTimeout(function () {

                instance.resolve(value++);
                interval();

            }, period | 0);
        }

        interval();

        return instance;
    }


    Class.all = function () {

        var instance = new Class(),
            cache = [],
            index = 0,
            length = 0,
            item;

        while (item = arguments[index])
        {
            length++;

            (function (item, index) {

                item
                    .then(function (value) {

                        cache[index] = value;

                        if (!--length)
                        {
                            instance.resolve(cache);
                        }
                    })
                    .catch(function (reason) {
                        
                        instance.reject(reason);
                    });

            })(item, index++);
        }

        return instance;
    }



    this.registry = function (fn) {

        var next = this.__next = new Class();
        var cache = this.__cache;

        this.__fn = fn;

        if (cache)
        {
            while (cache.length > 0)
            {
                try
                {
                    fn.call(this, cache.shift(), next);
                }
                catch (e)
                {
                    this.reject(e);
                }
            }

            this.__cache = null;
        }

        return next;
    }



    this.resolve = function (value) {

        var next = this.__next,
            any;

        if (next)
        {
            if (any = this.__fn)
            {
                try
                {
                    any.call(this, value, next);
                }
                catch (e)
                {
                    this.reject(e);
                }
            }
            else
            {
                next.resolve(value);
            }
        }
        else if (any = this.__cache)
        {
            any.push(value);
        }
        else
        {
            this.__cache = [value];
        }
    }


    this.reject = function (reason) {

        var fn = this.__fail,
            next = this.__next;

        if (fn)
        {
            try
            {
                if (fn.call(this, reason, next) === false)
                {
                    return false;
                }
            }
            catch (e)
            {
                reason = e;
            }
        }

        if (next)
        {
            next.reject(reason);
        }
        else
        {
            throw reason;
        }
    }


    this.then = function (fn) {

        return this.registry(function (value, next) {

            if (fn)
            {
                var result = fn(value);

                if (result !== void 0)
                {
                    value = result;
                }
            }

            next.resolve(value);
        });
    }


    this.combine = function (stream) {

        return this.registry(function (value1, next) {

            stream
                .then(function (value2) {

                    var array = value1;

                    if (array instanceof Array)
                    {
                        array.push(value2);
                    }
                    else
                    {
                        array = [value1, value2];
                    }

                    next.resolve(array);
                })
                .catch(function (reason) {

                    next.reject(reason);
                });
        });
    }


    this.map = function (fn) {

        return this.registry(function (value, next) {

            next.resolve(fn(value));
        });
    }


    this.json = function (fn) {

        return this.registry(function (value, next) {

            if (typeof value === 'string')
            {
                value = JSON.parse(value);
            }

            if (fn)
            {
                value = fn(value);
            }

            next.resolve(value);
        });
    }


    this.catch = function (fail) {

        this.__fail = fail;
        return this.__next = new Class();
    }


    this.wait = function (time) {

        var cache = [];
        var timeout;

        return this.registry(function (value, next) {

            if (timeout)
            {
                cache.push(value);
            }
            else
            {
                timeout = setTimeout(function () {

                    next.resolve(cache);
                    timeout = 0;
                    cache = [];

                }, time | 0);
            }
        });
    }


    this.delay = function (time) {

        return this.registry(function (value, next) {

            setTimeout(function () {

                next.resolve(value);

            }, time | 0);
        });
    }


    this.debounce = function (time) {

        var timeout;

        return this.registry(function (value, next) {

            if (timeout)
            {
                clearTimeout(timeout);
            }

            timeout = setTimeout(function () {

                next.resolve(value);
                timeout = 0;

            }, time | 0);
        });
    }


    this.throttle = function (time) {

        var timeout;

        return this.registry(function (value, next) {

            if (!timeout)
            {
                next.resolve(value);

                timeout = setTimeout(function () {

                    timeout = 0;

                }, time | 0);
            }
        });
    }

    
}, function Stream(value) {
 
    if (arguments.length > 0)
    {
        if (typeof value === 'function')
        {
            value(this);
        }
        else
        {
            this.__cache = [value];
        }
    }
});




yaxi.http = Object.extend.call({}, function (Class) {



    // 默认超时时间
    Class.timeout = 10000;



    function ajax_mock(method, url, data) {

        var stream = new yaxi.Stream();
    
        setTimeout(function () {
    
            try
            {
                var response = require('../../mock/' + url);
    
                if (typeof response === 'function')
                {
                    stream.resolve(response(data));
                }
                else
                {
                    stream.resolve(response);
                }
            }
            catch (e)
            {
                console.error(e);
                stream.reject(url + '\n' + e);
            }
    
        }, 500);

        return stream;
    }
    

    function encodeData(data) {

        if (!data)
        {
            return '';
        }

        var list = [],
            encode = encodeURIComponent,
            value,
            any;

        for (var name in data)
        {
            value = data[name];
            name = encode(name);

            if (value === null)
            {
                list.push(name, '=null', '&');
                continue;
            }

            switch (typeof value)
            {
                case 'undefined':
                    list.push(name, '=&');
                    break;

                case 'boolean':
                case 'number':
                    list.push(name, '=', value, '&');
                    break;

                case 'string':
                case 'function':
                    list.push(name, '=', encode(value), '&');
                    break;

                default:
                    if (value instanceof Array)
                    {
                        for (var i = 0, l = value.length; i < l; i++)
                        {
                            if ((any = value[i]) === void 0)
                            {
                                list.push(name, '=&');
                            }
                            else
                            {
                                list.push(name, '=', encode(any), '&'); //数组不支持嵌套
                            }
                        }
                    }
                    else
                    {
                        list.push(name, '=', encodeData(value), '&');
                    }
                    break;
            }
        }

        list.pop();

        return list.join('');
    }


    function send(method, url, data, options, flag) {

        if (Class.mock)
        {
            return ajax_mock(method, url, data);
        }

        if (data && !(data instanceof FormData))
        {
            if (flag || /GET|HEAD|OPTIONS/i.test(method))
            {
                url = url + (url.indexOf('?') >= 0 ? '&' : '?') + encodeData(data);
                data = null;
            }
            else if (options.contentType === 'application/x-www-form-urlencoded')
            {
                data = encodeData(data);
            }
            else if (typeof data !== 'string')
            {
                if (!options.contentType)
                {
                    options.contentType = 'application/json';
                }
                
                data = JSON.stringify(data);
            }
        }

        options.method = method;
        options.url = url;
        options.data = data;
        options.timeout = options.timeout || Class.timeout;

        return yaxi.__ajax_send(options);
    }



    Class.send = function (method, url, data, options) {

        return send(method ? method.toUpperCase() : 'GET', url, data, options || {}); 
    }



    Class.options = function (url, data, options) {

        return send('OPTIONS', url, data, options || {}, true);
    }


    Class.head = function (url, data, options) {

        return send('HEAD', url, data, options || {}, true);
    }


    Class.get = function (url, data, options) {

        return send('GET', url, data, options || {}, true);
    }


    Class.post = function (url, data, options) {

        return send('POST', url, data, options || {});
    }


    Class.put = function (url, data, options) {

        return send('PUT', url, data, options || {});
    }
    

    Class.delete = function (url, data, options) {

        return send('DELETE', url, data, options || {});
    }


    Class.trace = function (url, data, options) {

        return send('TRACE', url, data, options || {});
    }


    Class.connect = function (url, data, options) {

        return send('CONNECT', url, data, options || {});
    }


});





;(function (colors) {

    
    var create = Object.create;
    var names = 'black,white,standard,thick,thicker,thickest,light,lighter,lightest,primary,secondary,important,success,warning,danger,disabled'.split(',');

    
    colors.load = function (name, values) {

        var color = yaxi.color = colors[name] = create(null);

        parse(color, 'bg', values[0]);
        parse(color, 'text', values[1]);
        parse(color, 'line', values[2]);
    }


    function parse(color, type, values) {

        var keys = names;
        var item = create(null);

        values = values.split(',');

        for (var i = values.length; i--;)
        {
            var name = keys[i];
            var value = '#' + values[i];

            item[name] = value;
            color[type + '-' + name] = value;
        }

        color[type] = item;
    }


})(yaxi.colors = Object.create(null));






yaxi.colors.load('blue', [
    '000000,ffffff,ffffff,f5f5f5,e0e0e0,bdbdbd,ffffff,ffffff,ffffff,1c86ee,5eaadd,ff6c6c,71c04a,e89518,c40606,eeeeee',
    '000000,ffffff,212121,181818,121212,000000,37474f,616161,9e9e9e,1c86ee,5eaadd,ff6c6c,71c04a,e89518,c40606,999999',
    '000000,ffffff,263238,212121,121212,000000,37474f,546e7a,78909c,1c86ee,5eaadd,ff6c6c,71c04a,e89518,c40606,999999'
]);




(function (yaxi) {



    var pipes = Object.create(null);

    var caches = Object.create(null);


    var decimal = yaxi.Decimal.singleton;




    pipes.round = function (value, digits) {

        return decimal(value).round(digits);
    }


    pipes.fixed = function (value, digits) {

        return decimal(value).toFixed(digits);
    }




    yaxi.pipe = function (name, fn) {

        if (name && typeof fn === 'function')
        {
            pipes[name] = fn;
        }
    }



    function parse(text) {

        var tokens = text.split('|'),
            items = [],
            list,
            text,
            fn;

        for (var i = 0, l = tokens.length; i < l; i++)
        {
            if (tokens[i] && (list = tokens[i].match(/"(?:[^"]|\\")"|[^:\s]+/g)) && (fn = list[0]))
            {
                if (fn = pipes[fn])
                {
                    list[0] = null;

                    for (var j = list.length - 1; j > 0; j--)
                    {
                        text = list[j];

                        if (text[0] === '"' && text[text.length - 1] === '"')
                        {
                            list[j] = text.slice(1, -1).replace(/\\"/g, '"');
                        }
                    }

                    items.push(fn, list);
                }
                else
                {
                    throw new Error('compile pipe error: not exist pipe function "' + list[0] + '"!');
                }
            }
        }

        return items;
    }


    function pipe(value) {

        var index = 0,
            fn,
            args;

        while (fn = this[index++])
        {
            args = this[index++];
            args[0] = value;

            value = fn.apply(this, args);
        }

        return value;
    }


    function empty(value) {

        return value;
    }


    function compile(text) {

        var items = text && parse(text);
        return caches[text] = items && items[0] ? pipe.bind(items) : empty;
    }


    yaxi.pipe.compile = function (text) {

        return caches[text] || compile(text);
    }


})(yaxi);




;(function (yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;


    // 管道编译器
    var compile = yaxi.pipe.compile;

    
    // 控件对象集合
    var controls = yaxi.$controls = new Array(2 << 19);


    // 绑定的目标
    var bindingTarget = null;



    // 模型原型
    var base = this;


    // 定义属性方法
    var $ = yaxi.impl.property();




    // 定义模型
    yaxi.model = function (properties) {

        var extend = create;
        var prototype = extend(base);
        var subkeys = prototype.$subkeys = extend(null);
        var defaults = prototype.$defaults = extend(null);

        function Model(parent) {

            this.$parent = parent || null;
            this.__fields = extend(defaults);
        }
        
        prototype.$properties = extend(null);
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;

        defineProperties(prototype, properties, subkeys);

        return Model;
    }



    
    this.__build_get = function (name) {

        return function () {

            var control, target;

            // 找到控件才收集依赖
            if ((target = bindingTarget) && (control = controls[target.control]))
            {
                addDep(this, name, target, control);
            }

            return this.__fields[name];
        }
    }
    
    
    this.__build_set = function (name, options) {

        var convert = options.convert;
        var watches;

        return function (value) {

            var fields = this.__fields;
            var bindings;

            if (convert)
            {
                value = convert(value);
            }

            if (value === fields[name] || (watches = this.__watches) && watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            fields[name] = value;

            if ((bindings = this.__bindings) && (bindings = bindings[name]))
            {
                syncBindings(bindings);
            }
        }
    }



    this.__index = -1;


    // 添加索引属性
    define(this, '$index', {

        get: function () {

            var control, target;

            // 找到控件才收集依赖
            if ((target = bindingTarget) && (control = controls[target.control]))
            {
                addDep(this, '$index', target, control);
            }

            return this.__index;
        },

        set: function (value) {

            var bindings;

            if (this.__index !== (value |= 0))
            {
                this.__index = value;

                if ((bindings = this.__bindings) && (bindings = bindings.$index))
                {
                    syncBindings(bindings);
                }
            }
        }
    });


    // 顶层模型对象
    define(this, '$top', {
        
        get: function () {

            var target = this;
            var parent;

            while (parent = target.$parent)
            {
                target = parent;
            }

            return target;
        }
    });



    // 添加依赖
    function addDep(model, name, target, control) {

        var bindings, control, any;

        // 给模型添加绑定关系
        if (bindings = model.__bindings)
        {
            if (any = bindings[name])
            {
                any.push(target);
            }
            else
            {
                bindings[name] = [target];
            }
        }
        else
        {
            (model.__bindings = create(null))[name] = [target];
        }

        // 给控件记录依赖关系以便控件销毁时自动解除绑定
        if (bindings = control.__bindings)
        {
            bindings.push(name, model);
        }
        else
        {
            control.__bindings = [name, model];
        }
    }


    // 同步绑定
    function syncBindings(bindings) {

        var index = 0;
        var binding, control, fn;

        while (binding = bindings[index++])
        {
            if (control = controls[binding.control])
            {
                if (fn = binding.fn)
                {
                    control[binding.property] = fn(compile);
                }
            }
            else
            {
                bindings.splice(--index, 1);
            }
        }
    }




    function defineProperties(prototype, properties, subkeys) {

        var options, type;

        for (var name in properties)
        {
            if (name[0] === '$' || name[0] === '_' && name[1] === '_')
            {
                throw new Error('define model error: model field can not use "$" or "__" to begin!');
            }

            if (options = properties[name])
            {
                switch (typeof options)
                {
                    case 'function':
                        // 子模型
                        if (type = options.model)
                        {
                            define(prototype, name, (type === 1 ? defineSubModel : defineSubArrayModel)(name, options));
                            subkeys[name] = type;
                        }
                        else // 计算字段
                        {
                            define(prototype, name, { get: options });
                        }
                        break;
                    
                    case 'object': // 对象
                        if (options instanceof Array) // 子数组模型
                        {
                            define(prototype, name, defineSubArrayModel(name, type = checkSubArrayModel(options)));
                        }
                        else // 子模型
                        {
                            define(prototype, name, defineSubModel(name, type = yaxi.model(options)));
                        }

                        subkeys[name] = type;
                        break;

                    default:
                        $.call(prototype, name, options);
                        break; 
                }
            }
            else
            {
                $.call(prototype, name, options);
            }
        }
    }


    function checkSubArrayModel(options) {

        if (options.length !== 1 && !options[0] || typeof options[0] !== 'object')
        {
            throw new Error('define model error: sub array model must be a none empty object only!');
        }

        return yaxi.arrayModel(options[0]);
    }



    function defineSubModel(name, Model) {
    
        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Model(this));
            },
            set: function (values) {

                var model = this[name];

                if (values)
                {
                    (model || (this[name] = new Model(this))).$assign(values);
                }
                else if (model)
                {
                    model.$clear();
                }
            }
        };
    }


    function defineSubArrayModel(name, ArrayModel) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new ArrayModel(this));
            },
            set: function (values) {

                (this[name] || (this[name] = new ArrayModel(this))).load(values);
            }
        };
    }
    
    


    // 绑定
    yaxi.$bind = function (bindings) {

        try
        {
            var uuid = this.uuid;
            var fn;

            for (var name in bindings)
            {
                if (fn = bindings[name])
                {
                    // 字段绑定
                    if (typeof fn !== 'function')
                    {
                        throw new Error('bind error: binding expression "' + fn + '" is not a function!');
                    }
                    else if (name === 'onchange')
                    {
                        this.__onchange = fn;
                    }
                    else // 表达式绑定
                    {
                        bindingTarget = yaxi.__bindingTarget = {
                            control: uuid,
                            property: name,
                            fn: fn
                        }

                        this[name] = fn(compile);
                    }
                }
            }
        }
        finally
        {
            // 终止收集依赖
            bindingTarget = yaxi.__bindingTarget = null;
        }
    }


    // 解除绑定
    this.$unbind = function (name, uuid) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[name]))
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i].control === uuid)
                {
                    bindings.splice(i, 1);
                    break;
                }
            }
        }
    }


    
    // 观测属性变化
    this.$watch = function (name, listener) {

        var watches, items;

        if (name && typeof listener === 'function')
        {
            if (watches = this.__watches)
            {
                if (items = watches[name])
                {
                    items.push(listener);
                }
                else
                {
                    watches[name] = [listener];
                }
            }
            else
            {
                (this.__watches || (this.__watches = create(null)))[name] = [listener];
            }
        }
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches, items;

        if (watches = this.__watches)
        {
            if (typeof listener === 'function')
            {
                if (items = watches[name])
                {
                    for (var i = items.length; i--;)
                    {
                        if (items[i] === listener)
                        {
                            items.splice(i, 1);
                            return;
                        }
                    }
                }
            }
            else if (name)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    items.length = 0;
                    delete watches[name];
                }
            }
            else
            {
                for (name in watches)
                {
                    watches[name].length = 0;
                }
    
                this.__watches = null;
            }
        }
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var target = this;
        var watches, items, index, fn;

        while (target)
        {
            if ((watches = this.__watches) && (items = watches[name]))
            {
                index = 0;

                while (fn = items[index++])
                {
                    if (fn.call(target, this, value) === false)
                    {
                        return false;
                    }
                }
            }

            target = target.$parent;
        }
    }



    // 手动同步绑定
    this.$sync = function (name) {

        var bindings = this.__bindings;

        if (bindings && (bindings = bindings[name]))
        {
            syncBindings(bindings);
        }
    }



    // 批量赋值
    this.$assign = function (values) {

        if (values)
        {
            values = values.__fields || values;

            for (var name in values)
            {
                this[name] = values[name];
            }
        }
    }


    // 清除属性
    this.$clear = function (deep) {

        var subkeys, sub;

        this.__fields = create(this.$defaults);

        if (deep && (subkeys = this.$subkeys))
        {
            for (var name in subkeys)
            {
                if (sub = this['__sub_' + name])
                {
                    if (subkeys[name] === 1)
                    {
                        sub.$clear();
                    }
                    else
                    {
                        sub.clear();
                    }
                }
            }
        }
    }



}).call(Object.create(null), yaxi);




;(function () {



    var create = Object.create;

    var A = Array;

    var array = A.prototype;



    var base = this;


    // 所有控件集合
    var controls = yaxi.$controls;




    // 定义数组模型
    yaxi.arrayModel = function (properties) {
    
        var prototype = create(base);

        properties || (properties = {});

        function ArrayModel(parent) {

            this.$parent = parent || null;
        }

        prototype.$Model = yaxi.model(properties);

        ArrayModel.model = prototype.__model_type = 2;
        ArrayModel.prototype = prototype;

        return ArrayModel;
    }



    function createModels(arrayModel, list, start) {

        var Model = arrayModel.$Model;
        var parent = arrayModel.$parent;
        var length = list.length;
        var outputs;

        if (start != null)
        {
            outputs = new A(length + 2);
            outputs[0] = start;
            outputs[1] = 0;
            start = 2;
        }
        else
        {
            outputs = new A(length);
            start = 0;
        }

        for (var i = 0; i < length; i++)
        {
            outputs[start + i] = createModel(parent, Model, list[i]);
        }

        return outputs;
    }


    function createModel(parent, Model, data) {

        var model;

        if (data instanceof Model)
        {
            model = data;
            model.$parent = parent;
        }
        else
        {
            model = new Model(parent);
            model.$assign(data);    
        }

        return model;
    }


    function reindex(arrayModel, index) {

        var model;

        index |= 0;

        while (model = arrayModel[index])
        {
            var old = model.__index;

            if (old == null)
            {
                model.__index = index;
            }
            else if (old !== index)
            {
                model.$index = index;
            }

            index++;
        }
    }


    function notify(arrayModel, type, arg1, arg2) {

        var bindings, databox;

        if (bindings = arrayModel.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                if (databox = controls[bindings[i]])
                {
                    databox[type](arg1, arg2);
                }
            }
        }
    }


    function destroyItem(model) {

        var bindings, control;

        if (bindings = model.__bindings)
        {
            model.__bindings = null;

            for (var name in bindings)
            {
                var list = bindings[name];

                for (var i = list.length; i--;)
                {
                    if (control = controls[list[i].control])
                    {
                        control.__unbind(model);
                    }
                }
            }
        }

        model.$parent = null;
    }




    var released = false;


    this.__length = 0;


    // 获取数组模型长度(只读)
    Object.defineProperty(this, 'length', {

        get: function () {

            return this.__length;
        },

        set: function (value) {

            if (released)
            {
                this.__length = value;
                released = false;
            }
            else
            {
                throw new Error('length is readonly!');
            }
        }
    });



    this.indexOf = function (item) {

        return array.indexOf.call(this, item);
    }

    
    this.lastIndexOf = function (item) {

        return array.lastIndexOf.call(this, item);
    }


    this.forEach = function (fn) {

        return array.forEach.apply(this, arguments);
    }


    this.filter = function (fn) {

        return array.filter.apply(this, arguments);
    }


    this.map = function (fn) {

        return array.map.apply(this, arguments);
    }


    this.reduce = function (fn, initialValue) {

        return array.reduce.apply(this, arguments);
    }


    this.reduceRight = function (fn, initialValue) {

        return array.reduceRight.apply(this, arguments);
    }



    // 创建一个临时的模型
    this.create = function (data) {

        var model = new this.$Model();

        if (data)
        {
            model.$assign(data);
        }

        return model;
    }


    // 复制一个临时的模型
    this.copy = function (index) {

        var model = new this.$Model();
        var data;

        if (data = this[index])
        {
            model.$assign(data.__fields);
        }

        return model;
    }



    this.load = function (values) {

        var length = this.__length;

        if (length > 0)
        {
            while (length--)
            {
                destroyItem(this[length]);
            }

            released = true;
            array.splice.call(this, 0);
        }

        if (values.length > 0)
        {
            values = createModels(this, values);

            released = true;
            array.push.apply(this, values);
            
            for (var i = values.length; i--;)
            {
                values[i].__index = i;
            }
        }

        notify(this, '__on_load', values);
    }


    this.set = function (index, data) {

        var model;

        if ((index |= 0) < 0)
        {
            index += this.__length;
        }

        if (model = this[index])
        {
            destroyItem(model);

            model = this[index] = createModel(this.$parent, this.$Model, data);
            notify(this, '__on_set', index, model);
        }
        else
        {
            return false;
        }
    }


    this.append = function () {

        if (arguments.length > 0)
        {
            var index = this.__length;
            var models, model;
    
            models = createModels(this, arguments);

            released = true;
            array.push.apply(this, models);
    
            while (model = this[index])
            {
                model.__index = index++;
            }
            
            notify(this, '__on_insert', -1, models);
        }
    }


    this.insert = function (index) {

        if (arguments.length > 1)
        {
            var length = this.__length;
            var values = array.slice.call(arguments, 1);

            if ((index |= 0) < 0 && (index += length) < 0)
            {
                index = 0;
            }
            else if (index > length)
            {
                index = length;
            }
    
            values = createModels(this, values, index);
    
            released = true;
            array.splice.apply(this, values);

            reindex(this, index);
            notify(this, '__on_insert', index, values.slice(2));
        }
    }


    this.removeAt = function (index, count) {

        var length = this.__length;
        var removed;

        if ((index |= 0) < 0 && (index += length) < 0)
        {
            index = 0;
        }
        else if (index >= length)
        {
            return false;
        }

        released = true;
        removed = array.splice.call(this, index, count || 1);
        
        if ((length = removed.length) > 0)
        {
            for (var i = length; i--;)
            {
                destroyItem(removed[i]);
            }

            reindex(this, index);
            notify(this, '__on_removeAt', index, length);
        }
        else
        {
            return false;
        }
    }


    this.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            this.removeAt(index, 1);
        }
    }


    this.clear = function () {

        if (this.__length > 0)
        {
            for (var i = this.__length; i--;)
            {
                destroyItem(this[i]);
            }

            released = true;
            array.splice.call(this, 0);

            notify(this, '__on_clear');
        }
    }



    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);

        reindex(this, 0);
        notify(this, '__on_sort');
    }


    this.reverse = function () {

        array.reverse.call(this);
        
        reindex(this, 0);
        notify(this, '__on_reverse');
    }


    
}).call(Object.create(null));





Object.extend.call(Array, function (Class, base) {



    var create = Object.create;


    var classes = yaxi.classes;

    var cache = create(null);
    


    // 实现查找单个控件
    yaxi.impl.find = function () {


        // 查找符合指定选择器规则的第一个控件
        /*
         * *            任意控件选择器
         * xxx          控件类型选择器
         * @xxx         key值选择器
         * #xxx         id选择器
         * .xxx         class选择器
         * [xxx==?]     属性选择器, 仅支持"==", "!=", "===", "!=="运算符
         * <            从上一级查找控件
         * <<           从任意上级查找控件
         * >            从下级子控件中查找控件
         * >>           从所有下级控件中(含下级控件中的下级控件)中查找控件
        */
        this.find = function (selector) {

            return find(this, selector);
        }

    }



    // 查找多个控件实现
    yaxi.impl.query = function () {


        // 从指定的控件向上搜索至当前控件的子控件
        this.parentToThis = function (control) {

            var parent;

            if (!control || control === this)
            {
                return null;
            }

            while ((parent = control.parent) && parent !== this)
            {
                control = parent;
            }

            return control || null;
        }


        this.findByKey = function (key) {

            var children = this.__children;
            var index = 0;
            var control;

            while (control = children[index++])
            {
                if (control.key === key && control.selectedIndex >= -1)
                {
                    return control;
                }

                if (control.__children && (control = control.findByKey(key)))
                {
                    return control;
                }
            }
        }


        // 查找符合指定选择器规则的所有控件
        /*
         * *            任意控件选择器
         * xxx          控件类型选择器
         * @xxx         key值选择器
         * #xxx         id选择器
         * .xxx         class选择器
         * [xxx==?]     属性选择器, 仅支持"==", "!=", "===", "!=="运算符
         * <            从上一级查找控件
         * <<           从任意上级查找控件
         * >            从下级子控件中查找控件
         * >>           从所有下级控件中(含下级控件中的下级控件)中查找控件
        */
        this.query = function (selector) {

            return query(this, selector);
        }
    

    }



    function parse(selector) {

        var tokens = selector.match(/("[^"]*"|'[^']*'|>>|<<|[<>#.@*\[\]]|[!=]==?|[\w-]+)/g),
            outputs = [],
            index = 0,
            token,
            key;

        while (token = tokens[index++])
        {
            if ((key = token[0]) === '<' || key === '>')
            {
                outputs.push(token);

                if (key = tokens[index++])
                {
                    switch (key)
                    {
                        case '@':
                        case '#':
                        case '.':
                            if ((token = tokens[index++])[0] < '0' || token[0] > 'z')
                            {
                                raise(key, index - 2, ' , ' + key + ' must be followed alphabet or number or "_"');
                            }

                            outputs.push([key, token]);
                            break;

                        case '*':
                            outputs.push(key);
                            break;

                        case '[':
                            token = tokens[index + 1];

                            if (token !== '==' && token !== '!=' && token !== '===' && token !== '!==')
                            {
                                raise(key, index, ' [] only support "==" or "!=" or "===" or "!=="');
                            }
                            else if (tokens[index + 3] !== ']')
                            {
                                raise(key, index, ' [] not properly closed');
                            }

                            outputs.push(['[]', token, parseValue(tokens[index + 2])]);
                            index += 4;
                            break;

                        default:
                            if (key[0] < 'A' || key[0] > 'z')
                            {
                                raise(token, index, token + ' must be followed "@" or "#" or "." or "[x==y]" or "*" or a type name');
                            }
                            else
                            {
                                outputs.push(['', key]);
                            }
                            break;
                    }
                }
                else
                {
                    raise(token, index, ' ');
                }
            }
            else
            {
                raise(token, index, 'must use "<<" or "<" or ">>" or ">" as relation symbol');
            }
        }

        return cache[selector] = outputs;
    }


    function parseValue(value) {

        var n;

        switch (value)
        {
            case 'undefined':
                return void 0;

            case 'null':
                return null;

            case 'true':
                return true;

            case 'false':
                return false;
        }

        if (value[0] === '\'' || value[0] === '"')
        {
            return value.substring(0, value.length - 1);
        }
        
        return (n = +value) === n ? n : value;
    }


    function raise(token, index, message) {

        throw new Error('selector is invalid, ' + token + ' at ' + index + ', ' + message + '!');
    }



    function find(control, selector) {

        var tokens;

        if (selector && (tokens = cache[selector] || parse(selector)) && tokens[0])
        {
            return findControl(control, tokens, 0);
        }

        return null;
    }


    function findControl(control, tokens, index) {
    
        var rule = tokens[index + 1];
        var down;

        switch (tokens[index])
        {
            case '<':
                control = findUp(control, rule, false);
                break;

            case '<<':
                control = findUp(control, rule, true);
                break;

            case '>':
                control = (down = control.__children) && down[0] && findDown(down, rule, false) || null;
                break;

            case '>>':
                control = (down = control.__children) && down[0] && findDown(down, rule, true) || null;
                break;
        }

        if (control && tokens[index += 2])
        {
            return findControl(control, tokens, index);
        }

        return control || null;
    }


    function checkValue(control, rule) {

        switch (rule[0])
        {
            case '@':
                return control.__fields.key === rule[1];

            case '':
                return control instanceof (classes[rule[1]] || Boolean);

            case '#':
                return control.__fields.id === rule[1];

            case '[':
                return checkProperty(control, rule);

            case '*':
                return true;
        }
    }


    function checkProperty(control, rule) {

        var value1 = control[rule[0]];
        var value2 = rule[2];

        switch (rule[1])
        {
            case '==':
                return value1 == value2;

            case '!=':
                return value1 != value2;

            case '===':
                return value1 === value2;

            case '!==':
                return value1 !== value2;

            default:
                return false;
        }
    }


    function findUp(control, rule, deep) {

        if (control = control.parent)
        {
            if (deep)
            {
                do
                {
                    if (checkValue(control, rule))
                    {
                        return control;
                    }
                }
                while (control = control.parent);
            }
            else if (checkValue(control, rule))
            {
                return control;
            }
        }
    }


    function findDown(children, rule, deep) {

        var index = 0;
        var control, down;

        while (control = children[index++])
        {
            if (checkValue(control, rule))
            {
                return control;
            }

            if (deep && (down = control.__children) && down[0] && (control = findDown(down, rule, true)))
            {
                return control;
            }
        }
    }


    function query(control, selector) {

        var outputs = new Class(),
            tokens,
            any;

        if (selector && (any = control.__children) && any[0] && 
            (tokens = cache[selector] || parse(selector)) && tokens[0])
        {
            any = queryControls([control], tokens, 0);

            if (any.length > 0)
            {
                outputs.push.apply(outputs, any);
            }
        }

        return outputs;
    }


    function queryControls(inputs, tokens, index) {

        var exists = create(null);
        var outputs = [];
        var rule = tokens[index + 1];
        var i = 0;
        var control, any;

        switch (tokens[index])
        {
            case '<':
                while (control = inputs[i++])
                {
                    if ((control = findUp(control, rule, false)) && !exists[any = control.uuid])
                    {
                        exists[any] = true;  // 去重
                        outputs.push(control);
                    }
                }
                break;

            case '<<':
                while (control = inputs[i++])
                {
                    if ((control = findUp(control, rule, true)) && !exists[any = control.uuid])
                    {
                        exists[any] = true;  // 去重
                        outputs.push(control);
                    }
                }
                break;

            case '>':
                while (control = inputs[i++])
                {
                    if ((any = control.__children) && any[0])
                    {
                        queryDown(any, outputs, rule, false, exists);
                    }
                }
                break;

            case '>>':
                while (control = inputs[i++])
                {
                    if ((any = control.__children) && any[0])
                    {
                        queryDown(any, outputs, rule, true, exists);
                    }
                }
                break;
        }

        if (outputs.length > 0 && tokens[index += 2])
        {
            return queryControls(outputs, tokens, index);
        }
        
        return outputs;
    }


    function queryDown(children, outputs, rule, deep, exists) {
    
        var index = 0;
        var control, any;

        while (control = children[index++])
        {
            if (checkValue(control, rule) && !exists[any = control.uuid])
            {
                exists[any] = true;   // 去重
                outputs.push(control);
            }

            if (deep && (any = control.__children) && any[0])
            {
                queryDown(any, outputs, rule, true, exists);
            }
        }
    }



    
    this.filter = function (selector) {
    
        if (typeof selector === 'function')
        {
            for (var i = this.length; i--;)
            {
                if (!selector(this[i]))
                {
                    this.splice(i, 1);
                }
            }
        }
        else if (selector = cache[selector] || parse(selector))
        {
            for (var i = this.length; i--;)
            {
                if (!this[i].__find(selector, 0))
                {
                    this.splice(i, 1);
                }
            }
        }

        return this;
    }



    this.get = function (name) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            if ((item = item[name]) !== void 0)
            {
                return item;
            }
        }
    }


    this.set = function (name, value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item[name] = value;
        }

        return this;
    }


    this.call = function (name, args) {

        var index = 0,
            item,
            fn;

        while (item = this[index++])
        {
            if (fn = item[name])
            {
                fn.apply(item, args);
            }
        }

        return this;
    }


    this.on = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.on(type, listener);
        }

        return this;
    }


    this.once = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.once(type, listener);
        }

        return this;
    }


    this.off = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.off(type, listener);
        }

        return this;
    }


    this.trigger = function (event) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.trigger(event);
        }

        return this;
    }



});




Object.extend.call({}, 'Control', function (Class, base, yaxi) {




    var create = Object.create;

    var own = Object.getOwnPropertyNames;



    // 注册的控件类集合
    var classes = yaxi.classes;


    
    // 补丁集合
    var patches = yaxi.__patches = [];


    // 调度器
    var schedule = 0;


    

    // 默认允许任意类型父控件
    Class.allowParent = true;

    // 渲染器扩展
    Class.renderer = renderer;




    // 注册补丁
    var patch = yaxi.patch = function (control) {

        var parent;

        control.__dirty = true;

        while (parent = control.parent)
        {
            if (parent.__dirty)
            {
                return;
            }

            parent.__dirty = true;
            control = parent;
        }

        patches.push(control);

        if (!schedule)
        {
            schedule = setTimeout(update, 0);
        }
    }


    // 更新补丁
    function update() {

        yaxi.__on_page_patch(patches);
        schedule = patches.length = 0;
    }


    function throwError(text) {

        throw new Error('create control error: ' + text);
    }



    // 检查父控件
    function checkParent(Class, parent) {

        var check;

        if (!Class)
        {
            throwError('type can not be null!');
        }

        if (check = Class.allowParent)
        {
            if (check !== true && !check(parent || (parent = yaxi.Box.prototype)))
            {
                throwError(Class.typeName + ' can not be a sub type of ' + parent.typeName + '!');
            }
        }
        else if (check = Class.typeName)
        {
            throwError(check + ' can not be a sub type!');
        }
        else
        {
            throwError(JSON.stringify(Class).substring(0, 20) + '... not a valid type!');
        }
    }

    
    
    Class.build = function (parent, options, scope) {

        var type, control;

        if (options)
        {
            // 本来就是控件
            if (options instanceof Class)
            {
                control = options;

                // 插槽控件的父控件直接指向component组件对象
                if (control.__slot)
                {
                    control.__slot = parent;
                    return control;
                }

                checkParent(control.constructor, parent);

                if (control.parent && control.parent !== parent)
                {
                    control.remove();
                }

                control.parent = parent;
                return control;
            }

            if (type = options[0])
            {
                if (typeof type === 'string' && !(type = classes[type]))
                {
                    if (options[0] === 'slot')
                    {
                        throwError('can only use slot in component!');
                    }

                    throwError('"' + options[0] + '" doesn\'t register!');
                }
                
                checkParent(type, parent);

                control = new type();

                control.parent = parent;
                control.__load(options, scope);

                return control;
            }
        }

        throwError('no options, eg: ["box", { theme: "text-primary" }, [[...], ...]]');
    }



    
    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$properties = create(null);


    // 渲染器
    this.$renderer = create(null);



    // 标记是否已发生变化
    this.__dirty = true;




    // 扩展属性实现
    this.$ = this.property = yaxi.impl.property();




    // 构建触发变更通知的属性
    function build_set_change(name, convert) {

        var init = create;
        var key = '__set_' + name;

        return function (value) {

            var changes, any;

            if (convert)
            {
                value = convert.call(this, value);
            }

            if (changes = this.__changes)
            {
                if (value !== (any = changes[name]))
                {
                    changes[name] = value;

                    if (this[key] && this[key](value, any) === false)
                    {
                        if (this.__fields[name] === any)
                        {
                            delete changes[name];
                        }
                        else
                        {
                            changes[name] = any;
                        }
                    }
                }
            }
            else if (value !== (any = this.__fields)[name])
            {
                (this.__changes = init(any))[name] = value;

                if (this[key] && this[key](value, any[name]) === false)
                {
                    this.__changes = null;
                }
                else
                {
                    this.__dirty || patch(this);
                }
            }
        }
    }


    // 构建不触发变更通知的属性
    function build_set_unchange(name, convert) {

        var key = '__set_' + name;

        return function (value) {

            var fields = this.__fields;
            var oldValue = fields[name];

            if (convert)
            {
                value = convert.call(this, value);
            }

            if (value !== oldValue)
            {
                fields[name] = value;

                if (this[key] && this[key](value, oldValue) === false)
                {
                    fields[name] = oldValue;
                }
            }
        }
    }


    
    this.__build_get = function (name, options) {

        return options.change ? function () {

            return (this.__changes || this.__fields)[name];

        } : function () {

            return this.__fields[name];
        }
    }


    this.__build_set = function (name, options) {

        return (options.change ? build_set_change : build_set_unchange)(name, options.convert);
    }




    // 直接设置属性值
    this.$set = function (name, value, force) {

        var fields, changes;

        if (changes = this.__changes)
        {
            changes[name] = value;
        }
        else if ((fields = this.__fields) && (force || value !== fields[name]))
        {
            (this.__changes = create(fields))[name] = value;
            this.__dirty || patch(this);
        }
    }



    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls;


    // 控件唯一id
    this.$('uuid', 0, {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });


    // 收缩uuid
    this.__shrink_uuid = function () {

        var list = controls;
        var count = 0;

        for (var i = uuid; i--;)
        {
            if (list[i])
            {
                uuid -= count;
                return;
            }
            
            count++;
        }
    }



    // id 控件id仅做为内部属性用, 不会同步到dom节点上
    this.$('id', '', false);


    
    // 控件风格
    this.$('theme', '', {

        kind: 'class',
        data: 'yx-theme-'
    });
    


    // 插槽名
    this.$('slot', '', false);


    // 是否隐藏
    this.$('hidden', false);


    // 是否选中
    this.$('selected', false, {

        change: false,

        get: function () {

            return this.__selected || false;
        },

        set: function (value) {

            if ((value = !!value) !== this.__selected)
            {
                // 从不选中状态切换到选中有选中状态值时则切换状态
                if ((this.__selected = value) && (value = this.__selected_status))
                {
                    changeSelectedStatus(this, value);
                }
                else if (this.__save_status) // 有保存的状态时清空
                {
                    changeSelectedStatus(this);
                }
            }
        }
    });


    // 选中时状态
    this.$('selectedStatus', null, {
        
        change: false,

        alias: 'selected-status',

        get: function () {

            return this.__selected_status || null;
        },

        set: function (value) {

            this.__selected_status = value;

            if (this.__selected)
            {
                changeSelectedStatus(this, value);
            }
        }
    });



    // 变更选中状态
    function changeSelectedStatus(control, selectedStatus) {

        var status;

        // 有缓存状态时需先恢复
        if (status = control.__save_status)
        {
            for (var name in status)
            {
                var values = status[name];

                // 等于选中值才恢复
                if (control[name] === values[1])
                {
                    control[name] = values[0];
                }
            }

            status = null;
        }

        // 处理选中状态
        if (selectedStatus)
        {
            status = {};

            for (var name in selectedStatus)
            {
                var value1 = control[name];

                control[name] = selectedStatus[name];;
                status[name] = [value1, control[name]];
            }
        }

        // 记录保存状态
        control.__save_status = status;
    }

    

    // 自定义key
    this.$('key', '', false);
    

    // 自定义tag
    this.$('tag', null, false);



    // 父控件
    this.parent = null;


    // 顶级控件
    this.$('root', null, {

        get: function () {

            var target = this;
            var parent;

            while (parent = target.parent)
            {
                target = parent;
            }

            return target;
        }
    });



    // 绝对定位
    // 本系统不支持 display, position, float等布局相关的属性
    // 布局使用flex, 在容器上设置layout实现
    // 绝对定位使用absolute, 设置了absolute的情况下top, left, right, bottom属性才生效
    // 这么限制的目的是为了让系统能够更容易的跨平台, 使用上述布局体系也能很方便的实现业务布局需求
    this.$('absolute', '', {

        kind: 'class',
        data: 'yx-absolute-'
    });



    // 是否使用静态定位(默认使用相对定位)
    this.$('static', false, {

        kind: 'class',
        data: 'yx-static'
    });




    var style = function (name, layout, data) {

        var key = name.replace(/-(\w)/g, function (_, x) {
        
            return x.toUpperCase();
        });

        this.$(key, '', {
            alias: name,
            kind: 'style',
            data: data | 0,
            layout: !!layout
        });

    }.bind(this);



    style('overflow', 1);


    style('overflow-x', 1);


    style('overflow-y', 1);


    style('top', 0, 1);

    style('right', 0, 1);

    style('bottom', 0, 1);

    style('left', 0, 1);


    style('width', 0, 1);


    style('height', 0, 1);


    style('min-width', 0, 1);


    style('max-width', 0, 1);


    style('min-height', 0, 1);


    style('max-height', 0, 1);


    style('margin', 0, 1);

    style('margin-top', 0, 1);

    style('margin-right', 0, 1);

    style('margin-bottom', 0, 1);

    style('margin-left', 0, 1);


    style('border', 0, 3);

    style('border-top', 0, 3);

    style('border-right', 0, 3);

    style('border-bottom', 0, 3);

    style('border-left', 0, 3);


    style('padding', 1, 1);

    style('padding-top', 1, 1);

    style('padding-right', 1, 1);

    style('padding-bottom', 1, 1);

    style('padding-left', 1, 1);



    style('flex-direction', 1);


    style('flex-wrap', 1);


    style('flex-flow', 1);


    style('justify-content', 1);


    style('align-items', 1);


    style('align-content', 1);



    style('order', 0);


    style('flex-grow', 0);


    style('flex-shrink', 0);


    style('flex-basis', 0);


    style('flex', 0);


    style('align-self', 0);


    style('justify-self', 0);
    


    //控件层叠顺序
    style('z-index', 0);


    //控件内容横向对齐样式
    //left      左边对齐
    //center    横向居中对齐
    //right     右边对齐
    style('text-align', 1);



    style('outline', 0, 3);

    style('outline-color', 0, 2);

    style('outline-style', 0);

    style('outline-offset', 0, 1);

    style('outline-width', 0, 1);



    style('box-shadow', 0, 3);



    //控件上右下左边框宽度
    style('border-width', 0, 1);

    style('border-top-width', 0, 1);

    style('border-right-width', 0, 1);

    style('border-bottom-width', 0, 1);

    style('border-left-width', 0, 1);


    //控件上右下左边框样式
    style('border-style', 0);

    style('border-top-style', 0);

    style('border-right-style', 0);

    style('border-bottom-style', 0);

    style('border-left-style', 0);


    //控件上右下左边框颜色
    style('border-color', 0, 2);

    style('border-top-color', 0, 2);

    style('border-right-color', 0, 2);

    style('border-bottom-color', 0, 2);

    style('border-left-color', 0, 2);


    //控件上右下左边框圆角
    style('border-radius', 0, 1);

    style('border-top-left-radius', 0, 1);

    style('border-top-right-radius', 0, 1);

    style('border-bottom-left-radius', 0, 1);

    style('border-bottom-right-radius', 0, 1);


    //阅读方向
    //ltr	    从左到右 
    //rtl	    从右到左 
    style('direction', 0);

    
    //控件透明度
    //number	0(完全透明)到1(完全不透明)之间数值
    style('opacity', 0);


    // 控件背景
    style('background', 0, 2);


    //控件背景颜色
    //color_name	规定颜色值为颜色名称的背景颜色(比如 red)  transparent:透明 
    //hex_number	规定颜色值为十六进制值的背景颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的背景颜色(比如 rgb(255,0,0)) 
    style('background-color', 0, 2);

    //控件背景图片
    //string        图像名(空字符串则表示无背景)
    //url('URL')	指向图像的路径
    style('background-image', 0);

    //控件背景重复方式
    //repeat	背景图像将在垂直方向和水平方向重复 
    //repeat-x	背景图像将在水平方向重复 
    //repeat-y	背景图像将在垂直方向重复 
    //no-repeat	背景图像将仅显示一次 
    style('background-repeat', 0);

    //控件背景颜色对齐方式
    //top left
    //top center
    //top right
    //center left
    //center center
    //center right
    //bottom left
    //bottom center
    //bottom right  如果您仅规定了一个关键词, 那么第二个值将是'center'     默认值：0% 0% 
    //x% y%	        第一个值是水平位置, 第二个值是垂直位置     左上角是 0% 0% 右下角是 100% 100%     如果您仅规定了一个值, 另一个值将是 50% 
    //xpos ypos	    第一个值是水平位置, 第二个值是垂直位置     左上角是 0 0 单位是像素 (0px 0px) 或任何其他的 CSS 单位     如果您仅规定了一个值, 另一个值将是50%     您可以混合使用 % 和 position 值 
    style('background-position', 0, 1);


    //控件颜色
    //color_name	规定颜色值为颜色名称的颜色(比如 red) 
    //hex_number	规定颜色值为十六进制值的颜色(比如 #ff0000) 
    //rgb_number	规定颜色值为 rgb 代码的颜色(比如 rgb(255,0,0)) 
    style('color', 1, 2);


    // 字体
    style('font', 1, 3);


    //控件字体样式
    //normal	浏览器显示一个标准的字体样式 
    //italic	浏览器会显示一个斜体的字体样式 
    //oblique	浏览器会显示一个倾斜的字体样式 
    style('font-style', 1);

    //控件字体变体
    //normal	    浏览器会显示一个标准的字体 
    //small-caps	浏览器会显示小型大写字母的字体 
    style('font-variant', 1);

    //控件字体粗细
    //normal	定义标准的字符 
    //bold	    定义粗体字符 
    //bolder	定义更粗的字符 
    //lighter	定义更细的字符 
    //100-900   定义由粗到细的字符 400 等同于 normal, 而 700 等同于 bold 
    style('font-weight', 1);

    //控件字体大小
    style('font-size', 1, 1);

    //控件文字行高
    style('line-height', 1, 1);

    //控件字体族 family-name generic-family  用于某个元素的字体族名称或/及类族名称的一个优先表
    style('font-family', 1);


    //
    style('white-space', 1, 1);


    //控件文字词间距(以空格为准)
    style('word-spacing', 1, 1);

    //控件文字字间距
    style('letter-spacing', 1, 1);

    //控件文字缩进
    style('text-indent', 1);

    //控件文字装饰
    //none	        默认 定义标准的文本 
    //underline	    定义文本下的一条线 
    //overline	    定义文本上的一条线 
    //line-through	定义穿过文本下的一条线 
    //blink	        定义闪烁的文本 
    style('text-decoration', 1);

    //控件文字溢出处理方式
    //clip	    修剪文本
    //ellipsis	显示省略符号来代表被修剪的文本 	
    //string	使用给定的字符串来代表被修剪的文本 
    style('text-overflow', 1);


    style('text-shadow', 1, 3);



    //转换
    style('transform', 0, 1);


    style('transform-origin', 0, 1);


    style('transform-style', 0);


    style('transform-box', 0)



    //过渡
    style('transition', 0);


    style('transition-delay', 0);


    style('transition-duration', 0);


    style('transition-property', 0);


    style('transition-timing-function', 0);



    //动画
    style('animation', 0);


    style('animation-delay', 0);


    style('animation-direction', 0);


    style('animation-duration', 0);


    style('animation-fill-mode', 0);


    style('animation-iteration-count', 0);


    style('animation-name', 0);


    style('animation-play-state', 0);

    
    style('animation-timing-function', 0);




    // 变更缓存
    var A = Array;
    var changesCache = [0, new A(20), new A(20), 0, new A(200), new A(200), 0, new A(100), new A(100)];


    // 颜色转换函数, 把@color颜色变量转换成实际的颜色
    var convertColor = function (translateFn, value) {

        return value ? ('' + value).replace(this, translateFn) : '';

    }.bind(/@([\w-]+)/g, function (_, key) {

        return this[key];

    }.bind(yaxi.color));


    var replaceClass = /\s+/g;

    

    // 获取变更数据
    this.__get_changes = function (changes, noproperty) {

        var properties = this.$properties;
        var names = own(changes || (changes = this.__changes));
        var cache = changesCache;
        var index = 0;
        var property, name, value, any;

        // 置空
        cache[0] = cache[3] = cache[6] = 0;

        while (name = names[index++])
        {
            value = changes[name];

            if (property = properties[name])
            {
                if (!property.change)
                {
                    continue;
                }

                switch (property.kind)
                {
                    case 'class': // class属性
                        if (value)
                        {
                            any = ' ' + property.data;
                            value = property.type === 'string' ? any + value.replace(replaceClass, any) : any;
                        }
                        else
                        {
                            value = '';
                        }

                        any = cache[0]++;
                        cache[1][any] = property;
                        cache[2][any] = value;
                        break;

                    case 'style': // 样式属性
                        // 处理颜色值
                        if ((property.data) & 2 === 2)
                        {
                            value = convertColor(value);
                        }

                        any = cache[3]++;
                        cache[4][any] = property;
                        cache[5][any] = value;
                        break;

                    default:
                        any = cache[6]++;
                        cache[7][any] = property;
                        cache[8][any] = value;
                        break;
                }
            }
            else if (noproperty)
            {
                any = cache[6]++;
                cache[7][any] = name;
                cache[8][any] = value;
            }
        }

        return cache;
    }
    



    // 从json结构加载组件
    /*
     * [
     *   'box',
     *   null,
     *   [
     *       ['text', null, 'test1'],
     *       ['text', null, 'test2'],
     *   ]
     * ]
    */
    this.__load = function (options, scope) {

        var data, fn;

        if (data = options[1])
        {
            this.__load_attributes(data);
        }

        if ((data = options[2]) && (fn = this.__load_children))
        {
            fn.call(this, data, scope);
        }

        return this;
    }


    this.__load_attributes = function (attributes) {

        var properties = this.$properties;
        var property, changes, fn, value;

        for (var name in attributes)
        {
            value = attributes[name];

            if (property = properties[name])
            {
                // 从转换器中获取存储名以解决别名存储的问题
                name = property.name;

                if (fn = property.convert)
                {
                    value = fn.call(this, value);

                    // 有属性值才处理, 像events, bindings等纯转换器不处理
                    if (name)
                    {
                        if (property.change) // 需要处理变化
                        {
                            (changes || (changes = this.__changes = create(this.__fields)))[name] = value;
                        }
                        else
                        {
                            (property.force ? this : this.__fields)[name] = value;
                        }
                    }
                }
                else if (fn !== false)
                {
                    this[name] = value;
                }
            }
            else
            {
                this[name] = value;
            }
        }
    }



    this.load = function (options) {

        this.__load(options);
    }


    this.loadTemplate = function (template, data, model) {

        this.__load(template(this, data, model));
    }
    


    this.$properties.bindings = {
        
        convert: yaxi.$bind
    };



    // 推送绑定
    this.$push = function (value) {

        var change;

        if (change = this.__onchange)
        {
            change(value);
        }
    }


    
    // 开放管道函数给模板用
    this.pipe = yaxi.pipe.compile;



    // 扩展查找实现
    yaxi.impl.find.call(this);
    

    // 向上查找存在非空key值的控件
    this.lookupHasKey = function () {

        var control = this;

        do
        {
            if (control.key)
            {
                return control;
            }
        }
        while (control = control.parent);
    }


    // 向上查找存在非空tag值的控件
    this.lookupHasTag = function () {

        var control = this;

        do
        {
            if (control.tag != null)
            {
                return control;
            }
        }
        while (control = control.parent);
    }



    
    // 扩展事件支持
    yaxi.EventTarget.mixin(this);

    
    this.$properties.events = {
        
        convert: function (events) {

            for (var name in events)
            {
                this.on(name, events[name]);
            }
        }
    };



    // 查询多个控件的渲染坐标
    yaxi.boundingClientRects = function (controls, callbackFn) {

        if (controls && controls.length > 0 && callbackFn)
        {
            var count = controls.length;
            var index = 0;
            var control;

            while (control = controls[index])
            {
                controls[index].boundingClientRect(function (controls, index) {
                    
                    return function (rect) {

                        controls[index] = rect;

                        if (!--count)
                        {
                            callbackFn.apply(this, controls);
                        }
                    }

                }(controls, index++));
            }
        }
    }



    this.remove = function () {

        var parent = this.parent;
        var children;
        var index;

        if (parent && (children = parent.__children) && (index = children.indexOf(this)) >= 0)
        {
            // 插槽控件被移除后就不再是插槽控件了
            this.__slot = null;
            children.splice(index, 1);
        }
    }



    // 模型销毁时调用此方法解除绑定关系
    this.__unbind = function (model) {

        var bindings;

        if (bindings = this.__bindings)
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i] === model)
                {
                    bindings.splice(i - 1, 2);
                }

                i--;
            }
        }
    }

    
    this.destroy = function () {

        var bindings, uuid;

        if (uuid = this.__uuid)
        {
            controls[uuid] = null;

            if (bindings = this.__bindings)
            {
                for (var i = bindings.length; i--;)
                {
                    bindings[i--].$unbind(bindings[i], uuid);
                }
                
                this.__bindings = null;
            }
        }

        if (this.__event_keys)
        {
            this.off();
        }

        this.$view = null;
        this.ondestroy && this.ondestroy();

        this.parent = this.__scope = this.__slot = 
        this.__onchange = this.__po = null;
    }


    this.destroyChildren = function (children) {

        var control, flag;

        for (var i = children.length; i--;)
        {
            // 无父窗口的控件则销毁
            if ((control = children[i]) && !control.parent)
            {
                control.destroy();
            }
            else
            {
                // 标记有未移除的控件
                flag = true;
            }
        }

        return flag;
    }



    
    this.__class_init = function (Class) {

        Class.allowParent = true;
        Class.renderer = renderer;

        this.$defaults = create(this.$defaults);
        this.$properties = create(this.$properties);
        this.$renderer = create(this.$renderer);
    }



    function renderer(fn) {

        var prototype = this.prototype;
        var base = this.superclass;

        if (base && (base = base.prototype))
        {
            base = base.$renderer;
        }
        
        fn.call(prototype.$renderer, base || null, prototype, yaxi);
    }




}, function Control() {
 
    var init;

    this.__fields = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});




yaxi.Collection = Object.extend.call({}, function (Class) {


    
    var A = Array;

    var array = A.prototype;


    var $patch = yaxi.patch;


    var controls = yaxi.$controls;

    var build = yaxi.Control.build;


    var released = false;



    this.__length = 0;


    // 获取集合长度(只读)
    Object.defineProperty(this, 'length', {

        get: function () {

            return this.__length;
        },

        set: function (value) {

            if (released)
            {
                released = false;
                this.__length = value;
            }
            else
            {
                throw new Error('the length of collection is readonly!');
            }
        }
    });



    function patch(target) {

        target.__last = array.slice.call(target, 0);

        if (target = controls[target.$uuid])
        {
            target.__dirty || $patch(target);
        }
    }


    function createControls(parent, list, index, offset) {

        var length = list.length;
        var outputs = new A(length + offset);

        while (index < length)
        {
            outputs[index + offset] = build(parent, list[index++]);
        }

        return outputs;
    }


    
    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;




    this.load = function (values, scope) {

        var parent = controls[this.$uuid];
        var length = values.length;

        if (this.__length > 0)
        {
            this.clear();
        }
        else
        {
            this.__last || patch(this);
        }

        for (var i = 0; i < length; i++)
        {
            this[i] = build(parent, values[i], scope);
        }
        
        this.__length = length;
    }



    this.set = function (index, value) {
        
        var control;

        if ((index |= 0) < 0)
        {
            index += this.__length;
        }

        if (control = this[index])
        {
            control.destroy();
            control = build(controls[this.$uuid], value);

            this.__last || patch(this);
            this[index] = control;
        }
        else
        {
            return false;
        }
    }


    this.append = function () {

        if (arguments.length > 0)
        {
            var list = createControls(controls[this.$uuid], arguments, 0, 0);

            this.__last || patch(this);

            released = true;
            array.push.apply(this, list);
        }
    }


    this.insert = function (index) {

        if (arguments.length > 1)
        {
            var length = this.__length;

            if ((index |= 0) < 0 && (index += length) < 0)
            {
                index = 0;
            }
            else if (index > length)
            {
                index = length;
            }

            this.__last || patch(this);

            list = createControls(controls[this.$uuid], arguments, 1, 2);
            list[0] = index;
            list[1] = 0;

            released = true;
            array.push.apply(this, list);
        }
    }


    this.removeAt = function (index, count) {

        var length = this.__length;
        var removed;

        if ((index |= 0) < 0 && (index += length) < 0)
        {
            index = 0;
        }
        else if (index >= length)
        {
            return false;
        }

        this.__last || patch(this);

        released = true;
        removed = array.splice.call(this, index, count || 1);

        for (var i = removed.length; i--;)
        {
            removed[i].parent = null;
        }

        return removed;
    }


    this.remove = function (item) {

        var index = this.indexOf(item);

        if (index >= 0)
        {
            this.removeAt(index, 1);
        }
    }


    this.clear = function () {

        var list;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;
            list = array.splice.call(this, 0)

            for (var i = list.length; i--;)
            {
                list[i].parent = null;
            }
        }
    }


    this.sort = function (sortby) {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.sort.call(this, sortby);
        }
    }



    this.reverse = function () {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.reverse.call(this);
        }
    }



    // 直接插入控件(给databox控件用)
    this.__insert = function (index, controls) {

        this.__last || patch(this);

        released = true;

        if (index < 0)
        {
            controls.push.apply(this, controls);
        }
        else
        {
            controls.unshift(index, 0);
            controls.splice.apply(this, controls);
        }
    }


    this.__set = function (index, control) {

        this.__last || patch(this);

        this[index].destroy();
        this[index] = control;
    }



}, function Collection(control) {

    this.$uuid = control && control.uuid;
    
});




/*
 * Box是一个自由的容器控件
 * 不仅可以通过children属性访问子控件集合, 也可以通过find及query方法对子控件进行处理
*/
yaxi.Control.extend('Box', function (Class, base) {




    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });

    

    // 子控件集合
    this.$('children', null, {

        get: function () {

            return this.__children;
        },
        set: function (value) {

            var children = this.__children;

            if (children.length > 0)
            {
                children.clear();
            }

            if (value && value.length > 0)
            {
                children.push.apply(children, value);
            }
        }
    });


    this.$properties.children = {
        
        convert: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.load(values);
            }
        }
    };



    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);
    



    // 查找关联控件, 给子类(TabBar, StackBox, SlideBox)用
    this.__find_related = function (related) {

        var control;

        if (related)
        {
            if (control = this.root.findByKey(related))
            {
                if (control.$properties.selectedIndex)
                {
                    return control;
                }

                throw new Error('related "' + related + '" has no selectedIndex property!');
            }
        }
        else if (related = this.parent.__children) // 否则在同层找有selectedIndex属性的控件
        {
            for (var i = related.length; i--;)
            {
                if ((control = related[i]) && control.$properties.selectedIndex && control !== this)
                {
                    return control;
                }
            }
        }
    }


    
    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].destroy();
        }


        // 清除变更
        children.__last = null;

        base.destroy.call(this);
    }

    

}, function Box() {

    var init;
    
    this.__fields = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);
    
    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});




// 单页切换控件接口
yaxi.impl.switchbox = function () {



    // 不支持layout属性
    this.$('layout', {

        get: nolayout,
        set: nolayout
    });

    function nolayout() {

        throw new Error('StackBox control doesn\'t supports layout!');
    }



    // 获取或设置当前页索引
    this.$('selectedIndex', 0, {

        force: true,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });



    // 选中的页头
    this.$('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex | 0;
            return index >= 0 && this.__children[index] || null;
        }
    });



    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        this.__switch(this, this.selectedIndex, -1);
    }


    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            this.__switch(this, value, oldValue); 

            // change事件不冒泡
            this.trigger('change', value, false);
        }
    }


    this.__switch = function (switchbox, index, oldIndex) {

        var children = switchbox.__children;
        var control;

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.onhide && control.onhide();
        }
    
        if (control = children[index])
        {
            if (!control.__shown)
            {
                control.__shown = true;
                control.onload && control.onload();
            }

            control.onshow && control.onshow();
        }
    }


}





yaxi.Component = yaxi.Control.extend(function (Class, base, yaxi) {


    
    var create = Object.create;

    var own = Object.getOwnPropertyNames;


    var A = Array;
    
    var build = yaxi.Control.build;
    

    // 管道编译器
    var compile = yaxi.pipe.compile;


    // 控件对象集合
    var controls = yaxi.$controls;




    this.__build_get = function (name) {

        var yx = yaxi;
        var init = create;

        return function () {

            var target, observes, list;

            if (target = yx.__bindingTarget)
            {
                // 添加观察对象
                if (observes = this.__observes)
                {
                    if (list = observes[name])
                    {
                        list.push(target);
                    }
                    else
                    {
                        observes[name] = [target];
                    }
                }
                else
                {
                    (this.__observes = init(null))[name] = [target];
                }
    
                if (target = controls[target])
                {
                    // 给控件记录依赖关系以便控件销毁时自动解除绑定
                    if (bindings = target.__bindings)
                    {
                        bindings.push(name, this);
                    }
                    else
                    {
                        target.__bindings = [name, this];
                    }
                }
            }

            return this.__fields[name];
        }
    }


    this.__build_set = function (name, options) {

        var convert = options.convert;

        return function (value) {

            var fields = this.__fields;

            value = convert ? convert.call(this, value) : value;

            if (value !== fields[name])
            {
                fields[name] = value;
                onchange.call(this, name);
            }
        }
    }


    function onchange(name) {

        var observes, observe, control, index, fn;
        
        if ((observes = this.__observes) && (observes = observes[name]))
        {
            index = 0;

            while (observe = observes[index++])
            {
                if (control = controls[observe.control])
                {
                    if (fn = observe.fn)
                    {
                        control[observe.property] = fn(compile);
                    }
                }
                else
                {
                    observes.splice(--index, 1);
                }
            }
        }
    }



    this.__load = function (options, scope) {

        var template = this.template;
        var shadowRoot;

        if (template)
        {
            if (typeof template === 'function')
            {
                template = template.call(this) || [];
            }
        }
        else
        {
            template = [];
        }

        if (options[1])
        {
            this.__load_attributes(options[1]);
        }

        if (template[2])
        {
            parseSlots(this, template[2], options[2]);
        }

        // 使用shadow的方式管理组件内部控件的目的是为了隔离
        shadowRoot = this.__shadowRoot = build(this, template, scope);
        shadowRoot.__shadow = true;
    }


    function parseSlots(component, options, slots) {

        var values;

        for (var i = options.length; i--;)
        {
            if (values = options[i])
            {
                if (values[0] === 'slot')
                {
                    values = handleSlots(values[1], slots, values[2]);

                    if (values && values.length > 0)
                    {
                        values = createSlots(component, i, values);
                        options.splice.apply(options, values);
                    }
                }
                else if (values[2])
                {
                    parseSlots(component, values[2], slots);
                }
            }    
        }
    }


    function handleSlots(name, slots, defaults) {

        // 使用者传入了插槽
        if (slots != null)
        {
            name = name && name.name;

            if (typeof slots === 'string')
            {
                if (name)
                {
                    throw new Error('slot input error: named slot can not support string, current slot name "' + name + '"!');
                }

                return [['text', null, slots]];
            }
            
            if (slots.length > 0)
            {
                var outputs = [];
                var index = 0;
                var item;

                // 指定了slot名称
                if (name)
                {
                    while (item = slots[index++])
                    {
                        if (item.slot === name)
                        {
                            outputs.push(item);
                        }
                    }
                }
                else
                {
                    while (item = slots[index++])
                    {
                        if (!item.slot)
                        {
                            outputs.push(item);
                        }
                    }
                }

                if (outputs.length > 0)
                {
                    return outputs;
                }
            }
        }
        
        return defaults;
    }



    function createSlots(parent, index, items) {

        var length = items.length;
        var outputs = new A(length + 2);
        var control;

        outputs[0] = index;
        outputs[1] = 1;

        for (var i = 0; i < length; i++)
        {
            control = outputs[i + 2] = build(parent, items[i]);
            control.__slot = true;
        }

        return outputs;
    }



    this.$combineChanges = function () {

        var fields = this.__fields;
        var changes = this.__changes;
        var shadowRoot = this.__shadowRoot;
        var properties = this.$properties;
        var names = own(changes);
        var index = 0;
        var name, values;

        while (name = names[index++])
        {
            fields[name] = changes[name];

            switch (properties[name].kind)
            {
                // 从以下三类属性同步到shadowRoot上, 其它属性不处理
                case 'class':
                case 'style':
                case 'attribute':
                    (values || (values = shadowRoot.__changes || (shadowRoot.__changes = create(null))))[name] = changes[name];
                    break;
            }
        }
    }



    // 观测属性变化
    this.$watch = function (name, listener) {

        var watches, items;

        if (name && typeof listener === 'function')
        {
            if (watches = this.__watches)
            {
                if (items = watches[name])
                {
                    items.push(listener);
                }
                else
                {
                    watches[name] = [listener];
                }
            }
            else
            {
                (this.__watches || (this.__watches = create(null)))[name] = [listener];
            }
        }
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches, items;

        if (watches = this.__watches)
        {
            if (typeof listener === 'function')
            {
                if (items = watches[name])
                {
                    for (var i = items.length; i--;)
                    {
                        if (items[i] === listener)
                        {
                            items.splice(i, 1);
                            return;
                        }
                    }
                }
            }
            else if (name)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    items.length = 0;
                    delete watches[name];
                }
            }
            else
            {
                for (name in watches)
                {
                    watches[name].length = 0;
                }
    
                this.__watches = null;
            }
        }
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var watches, items, index, fn;

        if ((watches = this.__watches) && (items = watches[name]))
        {
            index = 0;

            while (fn = items[index++])
            {
                if (fn.call(target, this, value) === false)
                {
                    return false;
                }
            }
        }
    }



    // 解除绑定
    this.$unbind = function (name, uuid) {

        var observes = this.__observes;

        if (observes && (observes = observes[name]))
        {
            for (var i = observes.length; i--;)
            {
                if (observes[i].control === uuid)
                {
                    observes.splice(i, 1);
                    break;
                }
            }
        }
    }




    this.destroy = function () {

        var root;

        if (root = this.__shadowRoot)
        {
            root.destroy();
            this.__shadowRoot = null;
        }

        base.destroy.call(this);
    }



    // 输出组件创建方法
    yaxi.component = Class.extend.bind(Class);
    
    


}, function Component() {

    var init;

    this.__fields = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});





/*
 * DataBox是一个通过数据集合(data)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.Control.extend('DataBox', function (Class, base, yaxi) {




    var build = yaxi.Control.build;



    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });


    // 模板
    this.$('template', null, {
     
        change: false,

        get: function () {

            return this.__template || null;
        },

        set: function (value) {

            if (typeof value === 'function')
            {
                this.__template = value;
            }
            else
            {
                throw new Error('databox template must be a template function!');
            }
        }
    });



    // 数据集合
    // 可以是数组模型也可以是普通的数组, 如果是普通数组不能实现双向绑定
    this.$('data', null, {

        change: false,

        get: function () {

            return this.__data || null;
        },

        set: function (value) {

            var any;

            if ((any = this.__model) && any !== value)
            {
                unbind(this, any);
            }

            if (value)
            {
                if (value.__model_type === 2)
                {
                    bind(this, value);
                }

                if (value.length > 0)
                {
                    this.__data = value;

                    if (any = this.__template)
                    {
                        loadData(this, value, any);
                    }

                    return;
                }
            }

            this.__data = null;

            if (this.__loaded)
            {
                showEmpty(this);
            }
        }
    });



    // 加载中配置, 取值范围: false或null或控件对象
    // false表示不显示loading
    // null表示显示默认的loading控件
    // 指定控件时表示使用自定义的loading控件来展示
    this.$('loading', null, {

        change: false,
        convert: convert
    });



    // 无数据时配置, 取值范围: false或null或控件对象
    // false表示无数据时不显示任何信息
    // null表示显示默认的无数据控件
    // 指定控件时表示使用自定义的控件来展示无数据时的内容
    this.$('empty', null, {

        change: false,
        convert: convert
    });



    function convert(value) {

        return value ? value : (value === false ? false : null);
    }


    

    // 子控件集合
    this.$('children', null, {

        get: nochildren,
        set: nochildren
    });


    function nochildren () {

        throw new Error('BataBox control doesn\'t supports children, please use data and template!');
    }



    this.__load_children = function (value, scope) {

        var data;

        if (this.template = value)
        {
            if (data = this.__data)
            {
                loadData(this, data, value, scope);
            }
            else
            {
                this.showLoading();
            }
        }
        
        // 标记子项已经加载过
        this.__loaded = true;
    }



    this.showLoading = function () {

        var children = this.__children;
        var loading = this.loading;

        children.clear();

        if (loading !== false)
        {
            if (loading)
            {
                loading = build(this, loading);
            }
            else
            {
                loading = new yaxi.Loading();
                loading.center = true;
            }

            children.append(this.__loading = loading);
        }
    }


    this.closeLoading = function () {

        var loading;

        if (loading = this.__loading)
        {
            this.__children.remove(loading);
            this.__loading = null;
        }
    }


    function showEmpty(databox) {

        var children = databox.__children;
        var empty = databox.empty;

        children.clear();

        if (empty !== false)
        {
            empty = empty ? build(this, empty) : new yaxi.DataEmpty();
            children.append(empty);
        }
    }
    

    function loadTemplate(controls, scope, index, item, template) {

        var control;

        scope = scope.concat(index, item);

        if (control = build(this, template, scope))
        {
            control.__scope = scope;
            controls.push(control);
        }
    }

    
    function createControls(databox, data, template, scope) {

        var controls = [];
        var fn;

        scope || (scope = findScope(databox));
        fn = loadTemplate.bind(databox, controls, scope);

        template(fn, data, scope);

        return controls;
    }


    function findScope(control) {

        var stack;

        while (control)
        {
            if (stack = control.__scope)
            {
                return stack;
            }

            control = control.parent;
        }

        return [];
    }


    function loadData(databox, data, template, scope) {

        var children = databox.__children;
        var controls = createControls(databox, data, template, scope);

        children.clear();
        
        if (controls.length > 0)
        {
            children.load(controls);
        }
    }


    function bind(databox, arrayModel) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            bindings.push(databox.uuid);
        }
        else
        {
            arrayModel.__bindings = [databox.uuid];
        }

        databox.__model = arrayModel;
    }


    function unbind(databox, arrayModel) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            var index = bindings.indexOf(databox.uuid);

            if (index >= 0)
            {
                bindings.splice(index, 1);
            }
        }

        databox.__model = null;
    }




    this.__on_load = function (list) {

        var template;
        
        if (list.length > 0 && (template = this.__template))
        {
            var children = this.__children;

            if (children.__length > 0)
            {
                children.clear();
            }

            list = createControls(this, list, template);
            this.__children.__insert(-1, list);
        }
        else
        {
            showEmpty(this);
        }
    }


    this.__on_set = function (index, model) {

        var template, controls;

        if (template = this.__template)
        {
            controls = createControls(this, [model], template);

            if (controls.length > 0)
            {
                this.__children.__set(index, controls[0]);
            }
        }
    }


    this.__on_insert = function (index, list) {

        var template;

        if (template = this.__template)
        {
            list = createControls(this, list, template);
            this.__children.__insert(index, list);
        }
    }


    this.__on_removeAt = function (index, length) {

        this.__children.removeAt(index, length);
    }


    this.__on_clear = function () {

        this.__children.clear();
    }


    this.__on_sort = function () {

        this.__children.sort(sort);
    }

    
    this.__on_reverse = function () {

        this.__children.reverse();
    }


    function sort(a, b) {

        var index;

        a = a.__scope;
        b = b.__scope;

        index = a.length - 1;

        a = a[index].__index;
        b = b[index].__index;

        return a > b ? 1 : (a < b ? -1 : 0);
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);



    this.destroy = function () {

        var any = this.__children;

        for (var i = any.length; i--;)
        {
            any[i].destroy();
        }

        if (any = this.__model)
        {
            unbind(this, any);
        }

        base.destroy.call(this);
    }




}, function DataBox() {

    var init;
    
    this.__fields = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});




yaxi.Control.extend('DataEmpty', function (Class, base) {



    this.$('text', '暂无数据');



}, function DataEmpty() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('Icon', function (Class, base) {


    
    // 图标名
    this.$('icon', '', {

        kind: 'class',
        data: 'icon-'
    });



}, function Icon() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('IconButton', function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图标名
    this.$('icon', '');


    // 图标大小
    this.$('size', '');


    // 文字内容
    this.$('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function IconButton() {


    yaxi.Control.apply(this, arguments);

    
});




yaxi.Control.extend('Image', function (Class, base) {


    // 图片资源地址
    this.$('src', '');


    // 图片裁剪、缩放的模式
    /*
     *  scaleToFill	缩放模式, 不保持纵横比缩放图片, 使图片的宽高完全拉伸至填满 image 元素	
     *  aspectFit	缩放模式, 保持纵横比缩放图片, 使图片的长边能完全显示出来。也就是说, 可以完整地将图片显示出来。	
     *  aspectFill	缩放模式, 保持纵横比缩放图片, 只保证图片的短边能完全显示出来。也就是说, 图片通常只在水平或垂直方向是完整的, 另一个方向将会发生截取。	
     *  widthFix	缩放模式, 宽度不变, 高度自动变化, 保持原图宽高比不变	
     *  heightFix	缩放模式, 高度不变, 宽度自动变化, 保持原图宽高比不变	2.10.3
     *  top	裁剪模式, 不缩放图片, 只显示图片的顶部区域	
     *  bottom	裁剪模式, 不缩放图片, 只显示图片的底部区域	
     *  center	裁剪模式, 不缩放图片, 只显示图片的中间区域	
     *  left	裁剪模式, 不缩放图片, 只显示图片的左边区域	
     *  right	裁剪模式, 不缩放图片, 只显示图片的右边区域	
     *  top left	裁剪模式, 不缩放图片, 只显示图片的左上边区域	
     *  top right	裁剪模式, 不缩放图片, 只显示图片的右上边区域	
     *  bottom left	裁剪模式, 不缩放图片, 只显示图片的左下边区域	
     *  bottom right	裁剪模式, 不缩放图片, 只显示图片的右下边区域
    */
    this.$('mode', '');


    // 图片懒加载，在即将进入一定范围（上下三屏）时才开始加载
    this.$('lazyLoad', false, {

        alias: 'lazy-load'
    });



}, function Image() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('ImageButton', function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$('layout', '', {

        kind: 'class',
        data: 'yx-layout-'
    });
    

    // 图像路径
    this.$('src', '');


    // 图像大小
    this.$('size', '');


    // 文字内容
    this.$('text', '');



    this.__load_children = function (values) {

        this.text = values;
    }



}, function ImageButton() {


    yaxi.Control.apply(this, arguments);

    
});




yaxi.Control.extend('Line', function (Class, base) {



    this.$('size', '5rem');


    this.$('color', 'text-standard');



}, function Line() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('Vline', function (Class, base) {



    this.$('size', '5rem');


    this.$('color', 'text-standard');



}, function Vline() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('Loading', function (Class, base) {



    this.$('center', false, {

        kind: 'class',
        data: 'yx-loading-center'
    });



}, function Loading() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('Marquee', function (Class, base) {



    this.$('text', '');


    // 速度, 每32字显示的秒数
    this.$('speed', 10);


    
}, function Marquee() {


    yaxi.Control.apply(this, arguments);

    
});




yaxi.Control.extend('MaskLayer', function (Class, base) {


    



}, function MaskLayer() {


    yaxi.Control.apply(this, arguments);


});




yaxi.component('Pulldown', function (Class, base) {



    var statusIcons = ['pulldown', 'pulldown', 'release', '', 'done'];

    var statusText = ['start', 'start', 'release', 'loading', 'done'];
    


    this.template = function () {

        var $this = this;

        return [
            'box',
            {
                layout: 'row middle center',
                height: 0,
                maxHeight: '100rem',
                theme: 'text-lightest'
            },
            [
                [
                    'icon',
                    {
                        fontSize: '60rem',
                        marginRight: '5rem',
                        bindings: {

                            hidden: function () {
                            
                                return $this.status === 3;
                            },

                            icon: function () {

                                return 'common-' + statusIcons[$this.status];
                            }
                        }
                    }
                ],
                [
                    'slot',
                    null,
                    [
                        [
                            'loading',
                            {
                                width: '40rem',
                                height: '40rem',
                                fontSize: '8rem',
                                marginRight: '10rem',
                                bindings: {

                                    hidden: function () {
                                    
                                        return $this.status !== 3;
                                    }
                                }
                            }
                        ]
                    ]
                ],
                [
                    'text',
                    {
                        bindings: {

                            text: function () {

                                return $this[statusText[$this.status] + 'Text'];
                            }
                        }
                    }
                ]
            ]
        ];

    }




    // 下拉状态
    // 0    未下拉
    // 1    开启下拉
    // 2    松开刷新
    // 3    加载中
    // 4    加载完成
    this.$('status', 0);



    this.$('startText', '下拉即可刷新', {

        change: false,
        alias: 'start-text'
    });


    this.$('releaseText', '松开立即刷新', {

        change: false,
        alias: 'release-text'
    });


    this.$('loadingText', '正在加载, 请稍候...', {

        change: false,
        alias: 'loading-text'
    });

    
    this.$('doneText', '加载完毕', {

        change: false,
        alias: 'done-text'
    });



    this.release = function () {

        switch (this.status)
        {
            case 1:
                this.transition = 'height 600ms ease';
                this.height = '0px';
                break;

            case 2:
                this.status = 3;
                this.trigger('pulldown');
                break;
        }
    }


    this.done = function () {

        if (this.status > 1)
        {
            this.status = 4;
            this.transition = 'height 600ms ease';
            this.height = 0;
        }
    }



}, function Pulldown() {


    yaxi.Control.apply(this, arguments);


});




yaxi.component('Pullup', function (Class, base) {



    this.template = function () {

        var $this = this;

        return [
            'box',
            {
                layout: 'row middle center',
                height: '100rem',
                theme: 'text-lightest'
            },
            [
                [
                    'icon',
                    {
                        icon: 'common-done',
                        fontSize: '60rem',
                        marginRight: '5rem',
                        bindings: {

                            hidden: function () {
                            
                                return !$this.status;
                            }
                        }
                    }
                ],
                [
                    'slot',
                    null,
                    [
                        [
                            'loading',
                            {
                                width: '40rem',
                                height: '40rem',
                                fontSize: '8rem',
                                marginRight: '10rem',
                                bindings: {

                                    hidden: function () {
                                    
                                        return $this.status;
                                    }
                                }
                            }
                        ]
                    ]
                ],
                [
                    'text',
                    {
                        bindings: {

                            text: function () {

                                return $this.status ? $this.doneText : $this.loadingText;
                            }
                        }
                    }
                ]
            ]
        ];

    }



    // 下拉状态
    // 0    加载中
    // 1    加载完成
    this.$('status', 0);


    
    this.$('loadingText', '正在加载, 请稍候...', {

        change: false,
        alias: 'loading-text'
    });



    this.$('doneText', '已全部加载完毕', {

        change: false,
        alias: 'done-text'
    });




    this.start = function () {

        this.status = 0;
        this.trigger('pullup');
    }


    this.done = function () {

        this.status = 1;
    }



}, function Pullup() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('RichText', function (Class, base) {


    
    this.$('html', '');



}, function RichText() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Box.extend('ScrollBox', function (Class, base, yaxi) {



    var pulldown, start, switchHeight;



    // 下拉刷新高度为多少rem时变换状态
    this.$('pulldownHeight', 80, false);


    // 上拉刷新高度为多少rem时触发刷新动作
    this.$('pullupHeight', 20, false);




    this.scrollTop = 0;
    

    this.scrollLeft = 0;
    

    this.scrollWidth = 0;
    
    
    this.scrollHeight = 0;

    

    this.scrollTo = function (top) {

        this.$set('scrollTo', top | 0);
    }


    this.scrollIntoView = function (childControl) {

        if (childControl)
        {
            this.$set('scrollIntoView', childControl.uuid);
        }
    }




    this.__on_touchstart = function () {

        if ((pulldown = this.__children[0]) && (pulldown instanceof yaxi.Pulldown))
        {
            start = -1;
            switchHeight = this.pulldownHeight * yaxi.remRatio | 0;

            pulldown.transition = '';
            pulldown.height = 0;
        }
        else
        {
            pulldown = null;
        }
    }

    
    this.__on_touchmove = function (event) {

        var touch;

        if (pulldown && (touch = event.changedTouches) && (touch = touch[0]))
        {
            var status, height;

            if (this.scrollTop <= 0)
            {
                var y = touch.pageY | 0;

                if (start < 0 || start >= y)
                {
                    start = y;
                }
                else
                {
                    y -= start;

                    status = y < switchHeight ? 1 : 2;
                    height = y + 'px';
                }
            }
            else
            {
                start = -1;
            }

            pulldown.status = status || 0;
            pulldown.height = height || '0px';
        }
    }


    this.__on_touchend = function () {

        var control;

        if (control = pulldown)
        {
            pulldown = null;

            if (control.status > 0)
            {
                control.release();
                return;
            }
        }

        var children = this.__children;

        // 最后一个是上拉刷新控件
        if ((control = children[children.length - 1]) && control instanceof yaxi.Pullup)
        {
            var height = this.pullupHeight * yaxi.remRatio; 

            yaxi.boundingClientRects([this, control], function (rect1, rect2) {

                if (rect2.top + height < rect1.height)
                {
                    control.start();
                }
            });
        }
    }



}, function ScrollBox() {


    yaxi.Box.call(this);


});




yaxi.Box.extend('SlideBox', function (Class, base) {




    Class.allowParent = function (parent) {

        if (parent instanceof Class)
        {
            throw new Error('slidebox cannot be added to slidebox!');
        }

        return true;
    }




    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);




    // 是否循环
    this.$('circular', false);


    // 是否自动切换
    this.$('autoplay', false);


    // 自动切换时间间隔(毫秒)
    this.$('interval', 5000, false);


    // 过渡动画时长(毫秒), 0表示没有过渡动画
    this.$('duration', 0, {

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });



    
    // 滑动状态
    var state = {
        start: -1,      // 开始位置, 如果小于0则表示不滑动
        index: 0,       // 当前子项索引
        last: 0,        // 最后子项数
        move: 0,        // 是否已经滑动
        width: 0,       // 容器宽度
        change: 0,      // 子项索引是否已变化
        capture: 0,     // 是否已捕获事件
        time: 0         // 按下时间
    };


    function touchX(event) {

        var touch = event.changedTouches;
        return touch && (touch = touch[0]) ? touch.pageX | 0 : -1;
    }


    function checkMove(slidebox, state, event) {

        var x = event.distanceX;
        var y = event.distanceY;
        var delta;

        if (x < 0)
        {
            x = -x;
        }

        if (y < 0)
        {
            y = -y;
        }

        // 横向滑动的距离更多则启动滑动功能
        if ((delta = x - y) >= 4)
        {
            state.move = 1;
            state.index = slidebox.selectedIndex;

            slidebox.__start();
        }
        else if (delta <= -4) // 纵向滚动则不再滑动
        {
            return false;
        }
    }


    function checkChange(state, event) {

        // 500ms只要移动了小段距离就算换页
        if (new Date() - state.time < 500)
        {
            var x = event.distanceX;
            var size = 100 * yaxi.remRatio;
    
            if (x  < -size)
            {
                if (state.index < state.last)
                {
                    return 1;
                }
            }
            else if (x > size && state.index > 0)
            {
                return -1;
            }
        }
    }


    this.__on_touchstart = function (event) {

        var s = state;

        if (this.autoplay)
        {
            this.__autoplay = true;
            this.autoplay = false;
        }
        
        if (!s.capture)
        {
            var start = -1;
            var last = this.__children.length - 1;
    
            if (last >= 0)
            {
                s.move = 0;
                s.last = last;
    
                (start = touchX(event)) >= 0 && this.boundingClientRect(function (rect) {
        
                    if ((s.width = rect.width) <= 0)
                    {
                        start = -1;
                    }
                });
            }
    
            s.start = start;
            s.time = new Date();
            s.capture = 1;
        }
    }


    this.__on_touchmove = function (event) {

        var s = state;

        if (s.start >= 0)
        {
            if (!s.move && checkMove(this, s, event) === false)
            {
                s.start = -1;
                return;
            }

            var index = s.index;
            var distance = touchX(event) - s.start;
            var size = s.width >> 1;
            var change = s.change;

            if (distance < -size)
            {
                if (!change && index < s.last)
                {
                    s.change = 1;
                    this.trigger('transition', index + 1, false);
                }
            }
            else if (distance > size)
            {
                if (!change && index > 0)
                {
                    s.change = -1;
                    this.trigger('transition', index - 1, false);
                }
            }
            else if (change)
            {
                s.change = 0;
                this.trigger('transition', index, false);
            }

            if (index > 0)
            {
                distance += -index * s.width;
            }

            this.__move(distance);

            event.stop();
            return false;
        }
    }


    this.__on_touchend = function (event) {

        var s = state;

        this.__on_touchcancel();

        if (s.move)
        {
            this.__stop(s.change || checkChange(s, event));

            event.stop();
            return false;
        }
    }


    this.__on_touchcancel = function () {

        state.capture = 0;

        if (this.__autoplay)
        {
            this.__autoplay = false;
            this.autoplay = true;
        }
    }



    // 切换autoplay默认实现
    this.__do_autoplay = function (value) {

        var interval;

        clearTimeout(this.__time);

        if (value && (interval = this.interval) > 0)
        {
            this.__time = setTimeout(autoplay.bind(this), interval);
        }
    }


    function autoplay(interval) {

        var index = this.selectedIndex + 1;
        var interval = this.interval;

        if (index >= this.__children.length)
        {
            index = 0;
        }

        this.selectedIndex = index;

        if (interval > 0)
        {
            this.__time = setTimeout(autoplay.bind(this), interval);
        }
    }



    // 小程序在拖动结束时直接从change事件获取当前索引
    this.__on_change = function (index) {

        this.selectedIndex = index;
        return false;
    }



    this.__start = this.__move = function () {
    }
    
    
    this.__stop = function (change) {
    }




}, function SlideBox() {


    yaxi.Box.apply(this, arguments);


});




yaxi.Box.extend('StackBox', function (Class, base) {



    // 动画时长
    this.$('duration', 500);


    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);



}, function StackBox() {


    yaxi.Box.apply(this, arguments);


});




yaxi.component('Swiper', function (Class, base) {


    this.template = function () {

        var $this = this;

        return [
            'box',
            {
                height: '300rem'
            },
            [
                [
                    'slidebox',
                    {
                        bindings: {
                            circular: function () { return $this.circular },
                            autoplay: function () { return $this.autoplay },
                            interval: function () { return $this.interval },
                            duration: function () { return $this.duration },
                            selectedIndex: function () { return $this.current },
                            onchange: function (value) { $this.current = value; }
                        }
                    },
                    [
                        ['slot']
                    ]
                ],
                [
                    'slot',
                    {
                        name: 'dots'
                    },
                    [
                        [
                            'databox',
                            {
                                absolute: 'center bottom',
                                bottom: '30rem',
                                width: 'auto'
                            },
                            function (template, data) {

                                for (var $index = 0, length = data.length; $index < length; $index++)
                                {
                                    template($index, $item,
                                        [
                                            "control",
                                            {
                                                width: '10rem',
                                                height: '10rem',
                                                borderRadius: '10rem',
                                                bindings: {
                                                    theme: function (index) {

                                                        return this.current === index ? 'bg-primary' : 'bg-thick';

                                                    }.bind($this, $index)
                                                }
                                            }
                                        ]
                                    );
                                }
                            }
                        ]
                    ]
                ]
            ]
        ];

    }



    // 是否循环
    this.$('circular', true);


    // 是否自动切换
    this.$('autoplay', true);


    // 自动切换时间间隔(毫秒)
    this.$('interval', 5000);


    // 过渡动画时长(毫秒), 0表示没有过渡动画
    this.$('duration', 500, {

        convert: function (value) {

            return (value |= 0) < 0 ? 0 : value;
        }
    });
    

    // 当前项
    this.$('current', 0);


});




yaxi.Box.extend('SwitchBox', function (Class, base, yaxi) {



    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);




    this.__switch = function (switchbox, index, oldIndex) {

        var children = switchbox.__children;
        var control;

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.onhide && control.onhide();
            control.hidden = true;
        }
    
        if (control = children[index])
        {
            if (!control.__shown)
            {
                control.__shown = true;
                control.onload && control.onload();
            }

            control.onshow && control.onshow();
            control.hidden = false;
        }
    }



}, function SwitchBox() {


    yaxi.Box.apply(this, arguments);


});




yaxi.Box.extend('TabBar', function (Class, base) {



    // 关联控件的key
    this.$('related', '', false);



    // 获取或设置当前页索引
    this.$('selectedIndex', 0, {

        force: true,
        change: false,
        alias: 'selected-index',

        convert: function (value) {

            return (value |= 0) < 0 ? -1 : value;
        }
    });



    // 选中的页头
    this.$('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.__children[index] || null;
        }
    });



    this.changeSelected = function (index) {

        var children = this.__children;
        var control;

        for (var i = children.length; i--;)
        {
            if (i !== index && (control = children[i]) && control.selected)
            {
                control.selected = false;
            }
        }

        if (control = children[index])
        {
            control.selected = true;
        }
    }



    this.__set_selectedIndex = function (value, oldValue) {

        if (this.__children[value])
        {
            switchChange(this, value);
        }

        this.trigger('change', value, false);
    }



    function switchChange(tabbar, index) {

        var control;
        
        if (control = tabbar.__find_related(tabbar.related))
        {
            control.selectedIndex = index;
        }

        tabbar.changeSelected(index);
    }


    this.__load_children = function (values, scope) {

        this.__children.load(values, scope);
        switchChange(this, this.selectedIndex);
    }



    this.__on_touchend = function (event) {

        var control = this.parentToThis(event.target);

        if (control && !control.selected)
        {
            var index = this.__children.indexOf(control);

            if (index >= 0 && this.trigger('changing', { 
                index: index, 
                lastIndex: this.selectedIndex 
            }) !== false)
            {
                this.selectedIndex = index;
            }
        }
    }
    


}, function TabBar() {


    yaxi.Box.apply(this, arguments);


});




yaxi.Control.extend('Text', function (Class, base) {



    var pipe = yaxi.pipe.compile;
    


    this.$('text', '');


    this.$('security', '');


    this.$('format', null, false);


    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.__load_children = function (value) {

        this.text = value;
    }



}, function Text() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('TextBox', function () {



    var pipe = yaxi.pipe.compile;

    


    this.$('name', '');


    this.$('value', '');

    
    this.$('placeholder', '');


    this.$('maxlength', -1);


    this.$('pattern', '');


    this.$('format', null, false);



    this.__set_format = function (value) {

        this.__format = typeof value === 'function' ? value : pipe(value);
    }



    this.$('selectionStart', 0, {

        alias: 'selection-start'
    });


    
    this.$('selectionEnd', 0, {

        alias: 'selection-end'
    });



    // 是否禁用
    this.$('disabled', false);

    

    this.focus = function () {

        this.$renderer.focus(this);
    }



    this.__on_change = function (value) {

        this.$push(value);
    }




}, function TextBox() {


    yaxi.Control.apply(this, arguments);
    

});




yaxi.Control.extend('Button', function (Class, base) {


    
    var A = Array;
    
    var build = yaxi.Control.build;
    
    var loading;



    this.$('text', '');


    this.__set_text = function (value) {

        this.content(value);
    }


    // 是否禁用
    this.$('disabled', false);



    function createShadows(parent, values) {

        var length = values.length;
        var controls = new A(length);

        for (var i = 0; i < length; i++)
        {
            controls[i] = build(parent, values[i]);
            controls[i].__shadow = true;
        }

        return controls;
    }


    this.content = this.__load_children = function (values) {

        var shadows;

        if (shadows = this.__shadows)
        {
            if (typeof shadows === 'object')
            {
                for (var i = shadows.length; i--;)
                {
                    shadows[i].destroy();
                }
            }
        }

        if (values instanceof A)
        {
            if (loading)
            {
                throw new Error('load button error: button can not embed button!');
            }

            try
            {
                loading = true;

                if (values[0] instanceof A)
                {
                    values = createShadows(this, values);
                }
                else
                {
                    values = [build(this, values)];
                    values[0].__shadow = true;
                }

                this.__fields.text = '';
            }
            finally
            {
                loading = false;
            }
        }
        else
        {
            this.__fields.text = values = '' + values; 
        }

        this.__shadows = values;
    }



    this.destroy = function () {

        var shadows = this.__shadows;

        if (shadows && typeof shadows !== 'string')
        {
            for (var i = shadows.length; i--;)
            {
                shadows[i].destroy();
            }
        }

        base.destroy.call(this);
    }



}, function Button() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('CheckBox', function (Class, base) {




    this.$('name', '');
    

    this.$('text', '');
    

    this.$('checked', false);


    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change', value);
    }


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);

    

    this.__on_tap = function () {

        var checked = !this.checked;

        if (this.trigger('changing', checked) !== false)
        {
            this.checked = checked;
        }
    }


    
}, function CheckBox() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Box.extend('CheckGroup', function (Class, base) {




}, function CheckGroup() {


    yaxi.Box.apply(this, arguments);


});




yaxi.Box.extend('Form', function (Class, base) {



}, function Form() {


    yaxi.Box.apply(this, arguments);


});




yaxi.Control.extend('Memo', function () {


    
    this.$('name', '');
    

    this.$('value', '');

    
    this.$('placeholder', '');


    this.$('text', '');


    // 是否禁用
    this.$('disabled', false);


    
}, function Memo() {


    yaxi.Control.apply(this, arguments);


});




yaxi.TextBox.extend('NumberBox', function () {



    this.$('name', '');
    

    // 是否显示button
    this.$('button', false);


    // 当前值
    this.$('value', 0, {
    
        convert: function (value) {

            var any;

            value = +value || 0;

            if (value < (any = this.min))
            {
                return any;
            }

            if (value > (any = this.max))
            {
                return any;
            }

            return value;
        }
    });

    

    // 最小值
    this.$('min', -Infinity, false);


    // 最大值
    this.$('max', Infinity, false);


    // 加减步进
    this.$('step', 1);



}, function NumberBox() {

    
    yaxi.Control.apply(this, arguments);


});




yaxi.TextBox.extend('PasswordBox', function () {






}, function PasswordBox() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('Radio', function (Class, base) {




    Class.allowParent = function (parent) {

        return parent instanceof yaxi.RadioGroup;
    }



    this.$('text', '');


    this.$('checked', false);


    this.$('color', '');


    // 是否禁用
    this.$('disabled', false);



    this.__set_checked = function (value) {

        this.$push(value);
        this.trigger('change', value);
    }



}, function Radio() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Box.extend('RadioGroup', function (Class, base) {



    this.$('name', '');


    this.$('value', '');




    function syncValue(children, value) {

        for (var i = children.length; i--;)
        {
            var radio = children[i];

            if (radio.key === value)
            {
                radio.checked = true;
            }
            else if (radio.checked)
            {
                radio.checked = false;
            }
        }
    }


    this.__set_value = function (value) {

        syncValue(this.__children, value);
        this.$push(value);
    }



    this.__load_children = function (values, scope) {

        var children = this.__children;

        children.load(values, scope);
        syncValue(children, this.value);
    }



    this.__on_tap = function (event) {

        var target = event.target;

        if (target.parent === this && !target.checked)
        {
            var children = this.children;

            for (var i = children.length; i--;)
            {
                if (children[i].checked)
                {
                    if (children[i].trigger('changing', false) === false)
                    {
                        return false;
                    }

                    break;
                }
            }

            if (target.trigger('changing', true) === false)
            {
                return false;
            }

            if (!(this.value = target.key))
            {
                throw new Error('radio control must set key!');
            }
        }
    }
    


}, function RadioGroup() {


    yaxi.Box.apply(this, arguments);
    

});




yaxi.Control.extend('RichEdit', function (Class, base) {


    
    // 是否禁用
    this.$('disabled', false);



}, function RichEdit() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Control.extend('SwitchButton', function (Class, base) {



    this.$('name', '');
    

    this.$('checked', false);
    

    // 是否禁用
    this.$('disabled', false);



}, function SwitchButton() {


    yaxi.Control.apply(this, arguments);


});




yaxi.TextBox.extend('TextArea', function () {


    
    // 是否禁用
    this.$('disabled', false);



}, function TextArea() {


    yaxi.Control.apply(this, arguments);


});




yaxi.Box.extend('Page', function (Class, base) {


	
	// 禁止作为子控件
	Class.allowParent = false;




	this.__find_up = function () {
	
		return null;
	}



	// 是否全屏显示
	// 对于微信小程序等平台, 可设置此值使用全面屏
	// 注: 此值生效后不可修改
	this.$('full', false, false);

	
	
	// 页面加载处理
	this.onload = function (options) {
	}
	

	// 页面显示处理
	this.onshow = function () {
	}


	// 页面隐藏处理
	this.onhide = function () {
	}


	// 页面卸载处理
	this.onunload = function (options) {
	}



	// 关闭页面
	this.close = function (type, payload) {

		yaxi.closePage(type, payload);
	}



	function open(options, callbackFn) {

		yaxi.openPage(this, options, callbackFn);
	}


	this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}


    
}, function Page() {


    yaxi.Box.apply(this, arguments);


});




yaxi.Page.extend('Dialog', function (Class, base, yaxi) {
	
	
	
}, function Dialog() {


	yaxi.Box.apply(this, arguments);


});




yaxi.MessageBox = yaxi.Dialog.extend(function (Class) {



	Class.sealed = true;


	Class.buttons = {
		OK: '确定',
		Cancel: '取消',
		Yes: '是',
		No: '否',
		Agree: '同意',
		Refuse: '拒绝'
	}



	function close(event) {

		this.close(event.target.key);
	}


	this.init = function (options) {

		var title, content, buttons;
		
		if (options)
		{
			if (typeof options !== 'object')
			{
				options = '' + options;
			}
		}
		else
		{
			options = {};
		}

		title = options.title || Class.title || 'yaxi';
		content = options.content;
		buttons = options.buttons || 'OK,Cancel';
	
		if (typeof title === 'string')
		{
			title = [
				'text',
				{
					height: '120rem',
					lineHeight: '120rem',
					textAlign: 'center',
					fontWeight: 'bold'
				},
				title
			];
		}
	
		if (typeof content === 'string')
		{
			content = [
				'text', 
				{
					padding: '20rem 50rem 80rem'
				},
				content
			];
		}
	
		if (typeof buttons === 'string')
		{
			var keys = Class.buttons;
			var last = (buttons = buttons.split(',')).length - 1;

			for (var i = last + 1; i--;)
			{
				buttons[i] = [
					'text',
					{
						key: buttons[i],
						minWidth: '180rem',
						height: '80rem',
						lineHeight: '80rem',
						theme: i === last ? 'text-primary' : '',
						textAlign: 'center',
						fontWeight: 'bold',
						events: {
							tap: close.bind(this)
						}
					},
					keys[buttons[i]]
				]
			}
		}
	
		this.load([
			'',
			null,
			[
				[
					'masklayer',
					{
						key: 'Cancel',
						events: {
							tap: close.bind(this)
						}
					}
				],
				[
					'box',
					{
						theme: 'bg-standard line-lighter line-top',
						absolute: 'middle center',
						width: '90%',
						minHeight: '250rem',
						maxHeight: '80%',
						layout: 'column'
					},
					[
						title,
						content,
						[
							'box',
							{
								layout: 'row middle after',
								theme: 'line-lightest line-top',
								minHeight: '120rem',
								padding: '0 50rem'
							},
							buttons
						]
					]
				]
			]

		]);
	}




	Class.delete = function (text, callbackFn) {

		if (typeof text === 'function')
		{
			callbackFn = text;
			text = '';
		}

		this.open({

			title: '确认删除',
			content: '确认要删除' + (text || '') + '?'

		}, callbackFn);
	}


	Class.info = function (text) {

		this.open({

			title: '提醒',
			content: text,
			buttons: 'OK'
		});
	}


});




yaxi.component('Header', function (Class, base, yaxi) {



    // 默认标题文字
    Class.text = 'yaxi';



    Class.allowParent = function (parent) {

        if (parent instanceof yaxi.Page)
        {
            return true;
        }

        throw new Error('Header can only add to Page or Dialog!');
    }



    this.template = function () {

        var $this = this;
        
        return [
            'box',
            {
                layout: 'row middle',
                theme: 'bg-standard line-lightest line-bottom',
                height: '90rem',
                paddingLeft: '20rem'
            },
            [
                [
                    'icon',
                    {
                        icon: 'common-back',
                        width: '90rem',
                        height: '100%',
                        marginLeft: '-20rem',
                        hidden: yaxi.currentPages.length < 1,
                        events: {

                            tap: function () {

                                $this.root.close('Back');
                                return false;
                            }
                        }
                    }
                ],
                [
                    'slot',
                    null,
                    [
                        [
                            'text',
                            {
                                bindings: {

                                    text: function () {

                                        return $this.text || Class.text || '';
                                    }
                                }
                            }
                        ]
                    ]
                ]
            ]
        ];
    }




    this.$('text', '');




}, function Header() {


    yaxi.Component.apply(this, arguments);


});





;(function (yaxi) {
    
    

    yaxi.platform = 'wx';



    yaxi.wx = Object.create(null);



    // 获取系统信息
    yaxi.getSystemInfo = function (callbackFn) {

        callbackFn && wx.getSystemInfo({

            success: callbackFn
        });
    }


})(yaxi);





;(function (wx) {



    var create = Object.create;


    var Event = yaxi.Event;

    
    var controls = yaxi.$controls;

    var translates = create(null);



    // 是否检查点击
    var tap = false;

    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();

    // 开始触摸时的控件及时间
    var touchControl, touchTime, touches;

    


    wx.translateEvent = function (event) {
        
        var control, any;

        if (any = translates[event.type])
        {
            any(event);
        }
        else if (any !== false && (control = findControl(event.target.dataset.id)))
        {
            event = new Event(event.type, event.detail);
            control.trigger(event);
        }

    }.bind(wx);
    


    function findControl(uuid) {

        var control;

        if (control = controls[uuid])
        {
            return control.disabled ? control.parent || null : control;
        }

        return null;
    }
    
    
    function touchEvent(event) {
    
        var e = new Event(event.type);
    
        e.target = touchControl;
        e.changedTouches = event.changedTouches;
        e.touches = event.touches;
    
        return e;
    }
    
    
    function touchToEvent(event) {

        var touch1 = touches;
        var touch2 = event.changedTouches;

        event = touchEvent(event);

        if (touch1 && (touch1 = touch1[0]) && touch2 && (touch2 = touch2[0]))
        {
            var x = touch2.pageX - touch1.pageX;
            var y = touch2.pageY - touch1.pageY;

            event.distanceX = x;
            event.distanceY = y;
            event.move = x < -10 || x > 10 || y < -10 || y > 10;
        }

        return event;
    }

    
    function call(control, name, event) {
    
        var fn;
    
        while (control)
        {
            if ((fn = control[name]) && fn.call(control, event) === false)
            {
                return false;
            }
            
            // 插槽控件也要向真正的父控件冒泡
            control = control.__slot || control.parent;
        }
    }
    
    
    
    translates.touchstart = function (event) {
            
        var control;

        // 阻止冒泡事件(触摸没有弹起时不处理)
        if (touchControl)
        {
            return;
        }

        if (control = findControl(event.target.dataset.id))
        {
            touchControl = control;
            touchTime = new Date();
            tap = true;

            event = touchEvent(event);
            touches = event.changedTouches;

            if (call(control, '__on_touchstart', event) === false || 
                control.trigger(event) === false)
            {
                return tap = false;
            }
        }
    }
    
    
    translates.touchmove = function (event) {
        
        var control;

        if (control = touchControl)
        {
            event = touchToEvent(event);

            if (call(control, '__on_touchmove', event) === false || 
                control.trigger(event) === false)
            {
                return tap = false;
            }
        }
    }
    
    
    translates.touchend = function (event) {
        
        var control, time;
    
        if (control = touchControl)
        {
            event = touchToEvent(event);
            touchControl = null;

            if (call(control, '__on_touchend', event) === false || 
                control.trigger(event) === false ||
                event.move)  // 检测滑动距离
            {
                return false;
            }

            // 按下大于350毫秒则触发longpress事件
            if ((time = new Date()) - touchTime > 350)
            {
                event.type = 'longpress';

                if (control.trigger(event) === false)
                {
                    return false;
                }
            }

            // 200ms内不重复触发tap事件
            if (tap && (time - tapTime > 200 || tapControl !== control))
            {
                // 延时触发tap事件解决input先触发change事件的问题
                setTimeout(function () {

                    tapControl = control;
                    tapTime = time;
    
                    event.type = 'tap';
    
                    if (call(control, '__on_tap', event) === false ||
                        control.trigger(event) === false)
                    {
                        return false;
                    }

                }, 0);
            }
        }
    }
    
    
    translates.touchcancel = function (event) {
        
        var control;
    
        if (control = touchControl)
        {
            event = touchEvent(event);
            touchControl = null;

            if (call(control, '__on_touchcancel', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }



    // 不支持以下原生事件, 用touch模拟
    translates.tap = translates.longpress = false;



    translates.input = function (event) {

        var control, fn, detail;

        if (control = findControl(event.target.dataset.id))
        {
            detail = event.detail.value;

            // 不冒泡
            if ((fn = control.__on_input) && fn.call(control, detail) === false)
            {
                return false;
            }

            return control.trigger('input', detail);
        }
    }



    translates.change = function (event) {

        var control, fn, detail;

        if (control = findControl(event.target.dataset.id))
        {
            detail = event.detail.value || event.detail.current;

            // 不冒泡
            if ((fn = control.__on_change) && fn.call(control, detail) === false)
            {
                return false;
            }

            return control.trigger('change', detail);
        }
    }



    translates.scroll = function (event) {

        var control, detail;

        if (control = findControl(event.target.dataset.id))
        {
            detail = event.detail;

            control.scrollTop = detail.scrollTop;
            control.scrollLeft = detail.scrollLeft;
            control.scrollWidth = detail.scrollWidth;
            control.scrollHeight = detail.scrollHeight;

            return control.trigger('scroll');
        }
    }



    

})(yaxi.wx);





yaxi.Control.renderer(function (base, thisControl) {



    var create = Object.create;

    var assign = Object.assign;


    var replaceUnit = /rem/g;





    this.renderClasses = function (control, properties, values, count, view, prefix) {

        view[prefix + 'class'] = values.slice(0, count).join('');
    }


    this.renderSplitClasses = function (control, properties, values, count, view, prefix) {

        var property;

        for (var i = 0; i < count; i++)
        {
            var property = properties[i];

            if (property.name === 'layout')
            {
                view[prefix + 'layout'] = values[i];
                values[i] = '';
                break;
            }
        }

        view[prefix + 'class'] = values.slice(0, count).join('');
    }


    this.renderStyles = function (control, properties, values, count, view, prefix) {

        for (var i = 0; i < count; i++)
        {
            var property = properties[i];
            var value = values[i];

            if ((property.data & 1) === 1)
            {
                value = value.replace(replaceUnit, 'rpx');
            }

            values[i] = property.alias + ':' + value + ';';
        }

        view[prefix + 's'] = values.slice(0, count).join('');
    }


    this.renderSplitStyles = function (control, properties, values, count, view, prefix) {

        var layout = '';

        for (var i = 0; i < count; i++)
        {
            var property = properties[i];
            var value = values[i];

            if ((property.data & 1) === 1)
            {
                value = value.replace(replaceUnit, 'rpx');
            }

            value = property.alias + ':' + value + ';';

            if (property.layout)
            {
                layout += value;
                value = '';
            }

            values[i] = value;
        }

        view[prefix + 's'] = values.slice(0, count).join('');
        view[prefix + 'style'] = layout;
    }



    this.renderAttributes = function (control, properties, values, count, view, prefix) {

        var property, fn, name;

        for (var i = 0; i < count; i++)
        {
            property = properties[i];
            name = property.name || property;

            if (fn = this[name])
            {
                fn.call(this, control, view, prefix, values[i]);
            }
            else if (fn !== false) // 自定义渲染为false不做任何处理
            {
                view[prefix + name] = values[i];
            }
        }
    }



    // 全局渲染
    this.render = function (control) {

        var fields = control.__fields;
        var view = create(null);
        var changes, count;

        control.__dirty = false;

        view.t = control.typeName;
        view.u = control.uuid;

        if (changes = control.__changes)
        {
            assign(fields, changes);
            control.__changes = null;
        }

        changes = control.__get_changes(fields, true);

        if (count = changes[0])
        {
            this.renderClasses(control, changes[1], changes[2], count, view, '');
        }

        if (count = changes[3])
        {
            this.renderStyles(control,  changes[4], changes[5], count, view, '');
        }

        if (count = changes[6])
        {
            this.renderAttributes(control,  changes[7], changes[8], count, view, '');
        }

        this.onchange.call(this, control, view, '');
        return view;
    }


    // 全新渲染子控件(给子类用)
    this.renderChildren = function (view, prefix, children) {

        var length = children.length;
        var list;
        
        if (length > 0)
        {
            list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].$renderer.render(children[i]);
            }
        }

        view[prefix + 'c'] = list || [];
    }



    // 增量渲染
    this.patch = function (control, view, prefix) {

        var fields, changes, count;

        control.__dirty = false;

        if (changes = control.__changes)
        {
            assign(fields = control.__fields, changes);
            changes = control.__get_changes(changes, true);

            prefix += '.';

            if (count = changes[6])
            {
                this.renderAttributes(control,  changes[7], changes[8], count, view, prefix);
            }

            // 如果class和样式有变化需要重新渲染
            if (changes[0] > 0 || changes[3] > 0)
            {
                fields = control.__get_changes(fields, true);

                if (changes[0] > 0 && (count = fields[0]))
                {
                    this.renderClasses(control, fields[1], fields[2], count, view, prefix);
                }
        
                if (changes[3] > 0 && (count = fields[3]))
                {
                    this.renderStyles(control,  fields[4], fields[5], count, view, prefix);
                }
            }

            this.onchange.call(this, control, view, prefix);
            control.__changes = null;
        }
    }


    // 子控件变化补丁(给子类用)
    this.patchChildren = function (control, view, prefix, children) {

        var last, any;

        prefix += '.';

        if (last = children.__last)
        {
            children.__last = null;

            if (any = last.length > 0)
            {
                any = control.destroyChildren(last);
            }

            // 全部为新添加的控件
            if (!any)
            {
                this.renderChildren(view, prefix, children);
            }
            else if (children.length < last.length)
            {
                patchRemoved(children, view, prefix);
            }
            else
            {
                patchChanged(children, last, view, prefix);
            }
        }
        else
        {
            patchUnchanged(children, view, prefix);
        }
    }


    function patchUnchanged(children, view, prefix) {

        var item;

        prefix += 'c[';

        for (var i = 0, l = children.length; i < l; i++)
        {
            if ((item = children[i]) && item.__dirty)
            {
                item.$renderer.patch(item, view, prefix + i + ']');
            }
        }
    }


    function patchRemoved(children, view, prefix) {

        var length = children.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = children[i].$renderer.render(children[i]);
        }

        view[prefix + 'c'] = list;
    }


    function patchChanged(children, last, view, prefix) {

        var length = children.length;
        var item;

        prefix += 'c[';

        for (var i = 0; i < length; i++)
        {
            if ((item = children[i]) !== last[i])
            {
                view[prefix + i + ']'] = item.$renderer.render(item);
            }
            else if (item.__dirty)
            {
                item.$renderer.patch(item, view, prefix + i + ']');
            }
        }
    }



    this.onchange = function (control, view, prefix) {
    }


    // 局部渲染
    this.renderPart = function (control, name, value) {

        var key = '';
        var data;

        while (data = control.parent)
        {
            var children = data.__children;

            for (var i = children.length; i--;)
            {
                if (children[i] === control)
                {
                    key = 'c[' + i + '].' + key;
                    break;
                }
            }

            control = data;
        }

        data = {};

        if (value == null)
        {
            value = name;

            for (name in value)
            {
                data['p.' + key + name] = value[name];
            }
        }
        else
        {
            data['p.' + key + name] = value;
        }

        console.log(data);
        control.__po.setData(data);
    }



    
    thisControl.boundingClientRect = function (callbackFn) {

        var parent, uuid, po;

        if (callbackFn && (uuid = (this.__shadowRoot || this).__uuid))
        {
            parent = this;

            while (parent = parent.parent)
            {
                if (po = parent.__po)
                {
                    break;
                }
            }

            (po || wx).createSelectorQuery().select('#id-' + uuid).boundingClientRect(function (rect) {

                callbackFn({
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    right: rect.right,
                    bottom: rect.bottom
                })
    
            }).exec();
        }
    }

    

});




yaxi.Box.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, '', children);

        return view;
    }


    this.patch = function (control, view, prefix) {

        this.patchChildren(control, view, prefix, control.__children);
        base.patch.call(this, control, view, prefix);
    }


});




yaxi.Component.renderer(function (base) {


    // 全局渲染
    this.render = function (control) {

        var shadowRoot = control.__shadowRoot;

        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        // 渲染shadowRoot
        return shadowRoot.$renderer.render(shadowRoot);
    }
    

    
    this.patch = function (control, view, prefix) {

        var shadowRoot = control.__shadowRoot;

        control.__dirty = false;

        if (control.__changes)
        {
            control.$combineChanges();
            control.__changes = null;
        }

        // 渲染shadowRoot
        shadowRoot.$renderer.patch(shadowRoot, view, prefix);
    }



});




yaxi.DataBox.renderer(function (base) {



    this.render = function (control) {

        var view = base.render.call(this, control);
        var children = control.__children;

        children.__last = null;
        this.renderChildren(view, '', children);

        return view;
    }


    this.patch = function (control, view, prefix) {

        this.patchChildren(control, view, prefix, control.__children);
        base.patch.call(this, control, view, prefix);
    }



});



yaxi.IconButton.renderer(function (base) {



    this.size = function (control, view, prefix, value) {

        view[prefix + 'size'] = value ? value.replace('rem', 'rpx') : '';
    }



});




yaxi.ImageButton.renderer(function (base) {



    this.size = function (control, view, prefix, value) {

        view[prefix + 'size'] = value ? value.replace('rem', 'rpx') : '';
    }



});




yaxi.Loading.renderer(function (base) {



    this.color = function (control, view, prefix, value) {

        view[prefix + 'color'] = value;
        return null;
    }



});




yaxi.Marquee.renderer(function (base) {



    this.text = function (control, view, prefix, value) {

        // var length = value.length;

        // view[prefix + 'text'] = value;

        // if (length > 0)
        // {
        //     var speed = length >> 5;

        //     if ((speed << 5) < length)
        //     {
        //         speed++;
        //     }
        
        //     if (speed < 1)
        //     {
        //         speed = 1;
        //     }

        //     speed = speed * control.speed | 0;
        //     value = 'marquee ' + speed + 's linear infinite';
        // }

        // view[prefix + 'animation'] = value;
    }


    this.speed = function (control, view) {

        this.text.call(this, control, view, control.text);
    }



});




yaxi.ScrollBox.renderer(function (base) {


  
    // 分开渲染layout类的class
    this.renderClasses = this.renderSplitClasses;


    // 分开渲染容器类的样式
    this.renderStyles = this.renderSplitStyles;
    

});




yaxi.Button.renderer(function (base) {

    

    function renderShadows(control, view, prefix) {

        var shadows = control.__shadows || '';

        if (typeof shadows === 'string')
        {
            view[prefix + 'c'] = [{
                t: 'Text',
                u: control.uuid,
                text: shadows
            }];
        }
        else
        {
            this.renderChildren(view, prefix, shadows)
        }
    }



    this.render = function (control) {

        var view = base.render.call(this, control);

        renderShadows.call(this, control, view, '');

        return view;
    }
    
    
    this.text = function (control, view, prefix) {

        renderShadows.call(this, control, view, prefix);
    }



});




yaxi.TextBox.renderer(function (base) {



    this.focus = function (control) {

        this.$set('focused', true);
    }


});




yaxi.Page.renderer(function (base, thisControl, yaxi) {



    var create = Object.create;

    var define = Object.defineProperty;



	// 页面栈
    var all = [];
    



    function find(uuid) {

        var list = all;

        for (var i = list.length; i--;)
        {
            if (list[i].uuid === uuid)
            {
                return list[i];
            }
        }

        throw new Error('can not find uuid ' + uuid + ' of page!');
    }



	
	// 获取当前所有页面
    define(yaxi, 'currentPages', {

        get: function () {

            return all.slice();
        }
    });


	// 获取当前页面
	define(yaxi, 'currentPage', {

        get: function () {

            return all[all.length - 1] || null;
        }
    });




    // 打开微信主页面
    yaxi.openMainPage = function (Page, options, wxPage) {

        var page = new Page(options);
        var uuid = page.uuid;

        all.push(page);
        page.onload(page.options = options);

        yaxi.__on_page_open(uuid, wxPage, true);

        return uuid;
    }
    

	// 打开指定页面
    yaxi.openPage = function (Page, options, callbackFn) {

        var stack = all;
        var wxPage, page;
    
        if (typeof options === 'function')
        {
            callbackFn = options;
            options = null;
        }
        
        if (page = stack[stack.length - 1])
        {
            wxPage = page.__po;
            page.onhide();
        }

        stack.push(page = new Page(options));

        page.onload(page.options = options);
        page.__cb = callbackFn;
        page.onshow();

        // 对话框直接嵌在当前页面内, 不创建新的微信页面
        if (page instanceof yaxi.Dialog && all.length > 0)
        {
            page.__po = wxPage;
            openDialog(page, options, callbackFn);
        }
        else
        {
            wx.navigateTo({

                url: '../../yaxi/pages/host?uuid=' + page.uuid
            });
        }
    }


	// 关闭当前页面
    yaxi.closePage = function (type, payload) {

        var page = all[all.length - 1];
        var wxPage, data;

        if (page && page.onunload(page.options) !== false)
        {
            // 对话框
            if (wxPage = page.__pod)
            {
                data = {};
                data[wxPage] = null;

                wxPage = page.__po;
                wxPage.setData(data, function () {

                    closePage(type, payload);
                    wxPage.__poi--;
                });
            }
            else // 页面
            {
                wx.navigateBack({

                    delta: 1,
                    complete: function () {

                        closePage(type, payload);
                    }
                });
            }
        }
	}
    


    yaxi.__on_page_open = function (uuid, wxPage) {

        yaxi.getSystemInfo(info => {

            var page = find(uuid);
            var data;

            yaxi.remRatio = 1 / info.pixelRatio;
            page.__po = wxPage;
            

            data = page.$renderer.render(page);
            data = { top: 0, p: data };

            if (!page.full)
            {
                data.top = info.statusBarHeight || 0;
            }

            console.log(data);

            wxPage.setData(data);
        });
    }


    yaxi.__on_page_patch = function (patches) {

        var index = 0;
        var control, page, data;

        while (control = patches[index++])
        {
            if (page = control.__po)
            {
                control.$renderer.patch(control, data = create(null), control.__pod || 'p');
                console.log(data);

                page.setData(data);
            }
        }
    }



    function openDialog(dialog) {

        var wxPage = dialog.__po;
        var index = ++wxPage.__poi || (wxPage.__poi = 0);
        var data;

        data = {};
        data[index = 'd[' + index + ']'] = dialog.$renderer.render(dialog);

        console.log(data);

        wxPage.setData(data);

        // 标记对话框关闭数据, 关闭对话框时用
        dialog.__pod = index;
    }


    function closePage(type, payload) {

        var stack = all;
        var page = stack[stack.length - 1];
        var callbackFn;

        page.options = page.__po = null;
        page.destroy();

        page.__shrink_uuid();
        
        stack.pop();

        if (callbackFn = page.__cb)
        {
            page.__cb = null;
            callbackFn(type, payload);
        }

        if (page = stack[stack.length - 1])
        {
            page.onshow();
        }
    }


});

yaxi.exports = null;