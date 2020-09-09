// yaxi全局变量
var yaxi = Object.create(null);


// 输出至AMD或CMD
if (typeof module !== 'undefined')
{
    module.exports = yaxi;

    // 在有window对象时输出至全局变量
    if (typeof window !== 'undefined')
    {
        window.yaxi = yaxi;
    }
}



// 接口实现
yaxi.impl = Object.create(null);



// 混入
yaxi.impl.mixin = function (fn) {

    if (fn)
    {
        var prototype = this.prototype;
        var base = this.superclass;
        
        fn.call(prototype, prototype.$mixin, base && base.prototype || null);
    }

    return this;
}



// 对象继承实现
Object.extend = function (fn, Class) {
	
    var base = this.prototype || null,
        prototype = Object.create(base),
        ctor;

    if (base && this.sealed)
    {
        throw this.typeName + ' is sealed, can not be extended!';
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
    Class.mixin = this.mixin || yaxi.impl.mixin;
    Class.prototype = prototype;

    prototype.constructor = Class;

    // 类扩展前处理
    if (prototype.__class_init)
    {
        prototype.__class_init(Class);
    }

    if (fn)
    {
        fn.call(prototype, Class, base);
        ctor = Class.ctor;
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


    buffer.fromString = function (value, callback) {

        var data = new Blob([value], { type: 'text/plain' });
        var file = new FileReader();

        file.onload = function () {
            
            callback(this.result);
        }

        file.readAsArrayBuffer(data);
    }


    buffer.toString = function (buffer, callback) {

        var reader = new FileReader();
        
        buffer = new Blob([buffer]);

        reader.onload = function () {

            callback(this.result)
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
    
        // 指定了get如果需要支持set则必须自己实现
        if (options.get)
        {
            options.set || (options.set = function () {

                var type = this.typeName;
                throw '"' + name + '"' + (type ? ' of ' + type : '') + ' is readonly!';
            });
        }
        else
        {
            options.get = get(name, change);
            options.set || (options.set = set(name, converter, change));
        }

        this.$defaults[name] = value;

        value = {
            name: name,
            change: change,
            fn: converter
        };

        converter = this.$converter;
        converter[name] = value;

        define(this, name, options);

        if (alias)
        {
            converter[alias] = converter[name];
            define(this, alias, options);
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

    
}, function Event(type) {

    this.type = type;
});



yaxi.EventTarget = Object.extend(function (Class) {

    
    var Event = yaxi.Event;

    var prototype = this;

    

    // 注册事件
    this.on = yaxi.on = function (type, listener) {
        
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
    this.once = yaxi.once = function (type, listener) {

        if (typeof listener === 'function')
        {
            function callback(event) {

                listener.call(this, event);
                this.off(type, callback);
            }

            this.on(type, callback);
        }
    }


    // 注销事件
    this.off = yaxi.off = function (type, listener) {
        
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
    this.trigger = yaxi.trigger = function (type, payload) {
        
        var target = this,
            events,
            index,
            event,
            fn;

        if (type && typeof type !== 'string')
        {
            event = type;
            event.target = this;
            
            if (payload)
            {
                event.payload = payload;
            }

            type = event.type;
        }

        do
        {
            if ((events = target.__event_keys) && (events = events[type]))
            {
                index = 0;

                while (fn = events[index++])
                {
                    if (!event)
                    {
                        event = new Event(type);
                        event.target = this;

                        if (payload)
                        {
                            event.payload = payload;
                        }
                    }

                    if (fn.call(target, event) === false)
                    {
                        event.defaultPrevented = true;
                    }
    
                    if (event.cancelBubble)
                    {
                        return !event.defaultPrevented;
                    }
                }
            }
        }
        while (target = target.parent);

        return !event || !event.defaultPrevented;
    }


    // 检测是否注册了指定的事件
    this.hasEvent = yaxi.hasEvent = function (type, listener) {

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



    Class.mixin = function (target) {

        target.on = prototype.on;
        target.once = prototype.once;
        target.off = prototype.off;
        target.trigger = prototype.trigger;
        target.hasEvent = prototype.hasEvent;
    }


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




(function () {



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
                    throw 'not exist pipe function "' + list[0] + '"!';
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


    function compile(text) {

        var items = text && parse(text);
        return caches[text] = items && items[0] ? pipe.bind(items) : null;
    }


    yaxi.pipe.compile = function (text) {

        var fn = caches[text];
        return fn !== void 0 ? fn : compile(text);
    }


})();




yaxi.impl.binding = function () {



    this.__model = null;


    // 不转换model
    this.$converter.model = false;


    // 当前模型
    Object.defineProperty(this, 'model', {

        get: function () {

            return this.__model;
        },
        set: function (value) {

            if (value)
            {
                if (!value.__model_type)
                {
                    value = this.__find_model('' + value);
                }
            }
            else
            {
                value = null;
            }

            this.__model = value;
        }
    })

    
    // 处理绑定
    this.__set_bindings = function (values) {

        var model;

        if (values && (model = this.__find_model()))
        {
            yaxi.__bind_model.call(model, this, values);
        }
    }



    // 查找关联的模型
    this.__find_model = function () {
    
        var target = this,
            model;

        while (target)
        {
            if (model = target.__model)
            {
                return model;
            }

            target = target.parent;
        }
    }



    // 模型名称缓存
    var cache = Object.create(null);


    // 查找关联的数组模型
    this.__find_arrayModel = function (name) {

        var model;

        if (model = this.__find_model())
        {
            var keys = cache[name] || (cache[name] = name.split('.')),
                index = 0,
                key;

            while (model && (key = keys[index++]))
            {
                model = model[key];
            }

            if (model && model.__model_type === 2)
            {
                return model;
            }
        }

        throw 'can not find array model "' + name + '"!';
    }


}




;(function () {



    var create = Object.create;

    var define = Object.defineProperty;


    var compile = yaxi.pipe.compile;


    // expression缓存
    var cache = create(null);


    // 绑定的目标
    var bindingTarget = null;

    // 注册的观测变化数量
    var watchKeys = create(null);


    // 模型原型
    var base = this;

    // 定义属性方法
    var property;




    // 定义模型
    yaxi.model = function (properties) {

        var extend = create,
            prototype = extend(base),
            subkeys = prototype.$subkeys = extend(null),
            defaults = prototype.$defaults = extend(null),
            options,
            type;

        function Model(parent) {

            this.$parent = parent || null;
            this.$storage = extend(defaults);
        }
        
        Model.model = prototype.__model_type = 1;
        Model.prototype = prototype;

        prototype.$converter = extend(null);
        
        for (var name in properties)
        {
            if ((options = properties[name]) && typeof options === 'function')
            {
                if (type = options.model)
                {
                    subkeys[name] = type;
                    define(prototype, name, (type === 1 ? submodel : subarrayModel)(name, options));
                }
                else
                {
                    define(prototype, name, { get: options });
                }
            }
            else
            {
                property.call(prototype, name, options);
            }
        }

        return Model;
    }



    function submodel(name, Model) {
    
        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new Model(this));
            },
            set: function (value) {

                var model = this[name];

                if (value)
                {
                    if (value != null)
                    {
                        (model || (this[name] = new Model(this))).$assign(value);
                    }
                }
                else if (model)
                {
                    model.$clear();
                }
            }
        };
    }


    function subarrayModel(name, ArrayModel) {

        name = '__sub_' + name;

        return {
            get: function () {

                return this[name] || (this[name] = new ArrayModel(this));
            },
            set: function (value) {

                var arrayModel = this[name];

                if (value && value.length > 0)
                {
                    if (arrayModel)
                    {
                        if (arrayModel.length > 0)
                        {
                            arrayModel.clear();
                        }
                    }
                    else
                    {
                        this[name] = arrayModel = new ArrayModel(this);
                    }
                    
                    arrayModel.push.apply(arrayModel, value);
                }
                else if (arrayModel && arrayModel.length > 0)
                {
                    arrayModel.clear();
                }
            }
        };
    }
    


    // 定义属性
    property = yaxi.impl.property(function (name) {

        return function () {

            var bindings, any;

            if (bindingTarget)
            {
                if (bindings = this.__bindings)
                {
                    if (any = bindings[name])
                    {
                        any.push(bindingTarget);
                    }
                    else
                    {
                        bindings[name] = [bindingTarget];
                    }
                }
                else
                {
                    (this.__bindings = {})[name] = [bindingTarget];
                }
            }

            return this.$storage[name];
        }

    }, function (name, converter) {

        var watches = watchKeys;

        return function (value) {

            var any = this.$storage;

            if (converter)
            {
                value = converter(value);
            }

            if (value === any[name] || watches[name] && this.$notify(name, value) === false)
            {
                return this;
            }

            any[name] = value;

            if ((any = this.__bindings) && (any = any[name]))
            {
                syncBindings(this, any);
            }
        }

    });



    function syncBindings(model, bindings) {

        var binding, value, pipe;

        for (var name in bindings)
        {
            binding = bindings[name];
            value = model[binding.name];

            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            binding.observe[binding.property] = value;
        }
    }

    

    // 编译绑定
    function compileBinding(observe, model, name, expression) {
    
        var rule = cache[expression] || parseExpression(expression);
        var binding, value;

        if (rule !== 1)
        {
            binding = bindingTarget = createBinding(model, rule);
            binding.observe = observe;

            value = binding.model[binding.name];

            if (rule.pipe)
            {
                value = rule.pipe(value);
            }

            observe[binding.property = name] = value;

            if (binding.model.__model_type === 1)
            {
                (observe.__bindings || (observe.__bindings = {}))[name] = binding;
            }
        }
        else
        {
            throw 'binding expression "' + expression + '" is invalid!';
        }
    }


    function parseExpression(expression) {

        var value, pipe, any;

        if ((any = expression.indexOf('|')) > 0)
        {
            pipe = expression.substring(any);
            value = expression.substring(0, any);
        }
        else
        {
            value = expression;
        }

        if (any = value.match(/\w+/g))
        {
            value = {
                name: any.pop(),
                path: any,
                pipe: pipe,
                bind: value
            };
        }

        return cache[expression] = value || 1;
    }


    // 创建绑定对象
    function createBinding(model, rule) {

        var name = rule.path[0] || rule.name;

        if (model[name] === void 0)
        {
            while (model = model.$parent)
            {
                if (name in model)
                {
                    break;
                }
            }
        }

        if (model)
        {
            return {
                model: model,
                name: name 
            };
        }

        throw '"' + rule.bind + '" is a invalid binding!';
    }


    // 编译推送
    function compilePush(observe, model, expression) {

        var rule = cache[expression] || parseExpression(expression);
        var binding;

        if (rule !== 1)
        {
            binding = createBinding(model, rule);

            if (pipe)
            {
                binding.pipe = compile(pipe);
            }

            observe.__binding_push = binding;
        }
    }



    // 绑定
    this.$bind = yaxi.__bind_model = function (observe, bindings) {

        try
        {
            var expression;

            for (var name in bindings)
            {
                if (expression = bindings[name])
                {
                    if (name === 'change')
                    {
                        compilePush(observe, this, expression);
                    }
                    else
                    {
                        compileBinding(observe, this, name, expression);
                    }
                }
            }
        }
        finally
        {
            bindingTarget = null;
        }

        return this;
    }


    // 解除绑定
    this.$unbind = function (binding) {

        var bindings = this.__bindings;
        var values;

        if (bindings)
        {
            // 属性字段绑定
            if (values = bindings[binding.name])
            {
                for (var i = values.length; i--;)
                {
                    if (values[i] === binding)
                    {
                        values.splice(i, 1);
                        break;
                    }
                }
            }
            else // 计算字段绑定
            {
                for (var name in bindings)
                {
                    values = bindings[name];

                    for (var i = values.length; i--;)
                    {
                        if (values[i] === binding)
                        {
                            values.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }

        return this;
    }


    
    
    // 观测属性变化
    this.$watch = function (name, listener) {

        if (name && typeof listener === 'function')
        {
            if (!++watchKeys[name])
            {
                watchKeys[name] = 1;
            }
            
            var watches = this.__watches,
                items;

            if (watches)
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
                (this.__watches || (this.__watches = {}))[name] = [listener];
            }
        }

        return this;
    }


    // 取消观测属性变化
    this.$unwatch = function (name, listener) {

        var watches = this.__watches,
            items;

        if (!watches)
        {
            return;
        }

        if (typeof listener === 'function')
        {
            if (watches && (items = watches[name]))
            {
                for (var i = items.length; i--;)
                {
                    if (items[i] === listener)
                    {
                        items.splice(i, 1);
                        watchKeys[name]--;
                        return;
                    }
                }
            }
        }
        else if (name)
        {
            if ((items = watches[name]) && items.length > 0)
            {
                watchKeys[name] -= items.length;
                items.length = 0;

                delete watches[name];
            }
        }
        else
        {
            for (name in watches)
            {
                if ((items = watches[name]) && items.length > 0)
                {
                    watchKeys[name] -= items.length;
                    items.length = 0;
                }
            }

            this.__watches = null;
        }

        return this;
    }


    // 通知属性变化
    this.$notify = function (name, value) {

        var target = this,
            watches,
            items,
            index,
            fn;

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

        return this;
    }



    // 手动同步绑定
    this.$sync = function (name) {

        var binding;

        if ((binding = this.__bindings) && (binding = binding[name]))
        {
            syncBindings(this, binding);
        }
    }



    // 赋值
    this.$assign = function (values) {

        if (values)
        {
            var storage = this.$storage || (this.$storage = {}),
                converters = this.$converter,
                converter;

            for (var name in values)
            {
                if (converter = converters[name])
                {
                    storage[name] = converter.fn.call(this, values[name]);
                }
                else
                {
                    this[name] = values[name];
                }
            }
        }

        return this;
    }


    // 清除属性
    this.$clear = function (deep) {

        var subkeys, sub;

        this.$storage = create(this.$defaults);

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
        
        return this;
    }



}).call(Object.create(null));




;(function () {



    var create = Object.create;

    var array = Array.prototype;

    var push = array.push;

    var splice = array.splice;

    var released = false;


    var base = this;




    // 定义数组模型
    yaxi.arrayModel = function (properties, indexName) {
    
        var prototype = create(base);

        properties || (properties = {});

        // 创建索引计算属性
        if (indexName)
        {
            if (indexName in properties)
            {
                throw 'array model index name "' + indexName + '" can not in properties!'; 
            }
            else
            {
                properties[prototype.__indexName = indexName] = function () {

                    return this.__index;
                }
            }
        }

        function ArrayModel(parent) {

            this.$parent = parent || null;
        }

        prototype.$Model = yaxi.model(properties);

        ArrayModel.model = prototype.__model_type = 2;
        ArrayModel.prototype = prototype;

        return ArrayModel;
    }


    

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
                throw 'length is readonly!';
            }
        }
    });


    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;



    this.$bind = function (repeater) {

        (this.__bindings || (this.__bindings = [])).push(repeater);
    }


    this.$unbind = function (repeater) {

        var bindings;

        if (bindings = this.__bindings)
        {
            for (var i = bindings.length; i--;)
            {
                if (bindings[i] === repeater)
                {
                    bindings.splice(i, 1);

                    if (!bindings[0])
                    {
                        this.__bindings = null;
                    }
                    break;
                }
            }
        }
    }




    function createModels(arrayModel, list, index) {

        var outputs = [],
            Model = arrayModel.$Model,
            parent = arrayModel.$parent,
            length = list.length,
            model;

        while (index < length)
        {
            model = new Model(parent);
            model.$assign(list[index++]);
            outputs.push(model);
        }

        return outputs;
    }


    function reindex(arrayModel, index) {

        var name = arrayModel.__indexName;
        var model;

        index |= 0;

        if (name)
        {
            while (model = arrayModel[index])
            {
                if (model.__index !== index)
                {
                    model.__index = index;
                    model.$sync(name);
                }

                index++;
            }
        }
        else
        {
            while (model = arrayModel[index])
            {
                model.__index !== index++;
            }
        }
    }


    function notify(arrayModel, type, arg1, arg2) {

        var bindings;

        if (bindings = arrayModel.__bindings)
        {
            for (var i = 0, l = bindings.length; i < l; i++)
            {
                bindings[i][type](arg1, arg2);
            }
        }
    }



    this.set = function (index, value) {

        if ((index |= 0) >= 0 && this[index])
        {
            var model = new this.$Model(this.$parent);

            model.$assign(value);
            this[index] = model;

            notify(this, '__on_set', index, model);
        }
    }



    this.push = function () {

        var length = arguments.length;

        if (length > 0)
        {
            var list = createModels(this, arguments, 0);

            released = true;
            push.apply(this, list);

            reindex(this, this.__length - length);
            notify(this, '__on_insert', -1, list);
        }

        return this.__length;
    }


    this.pop = function () {

        var item;

        if (this.__length > 0)
        {
            released = true;

            if (item = array.pop.call(this))
            {
                item.$parent = item.__bindings = null;
                notify(this, '__on_remove', -1, 1);
            }
        }

        return item;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var list = createModels(this, arguments, 0);

            released = true;
            array.unshift.apply(this, list);

            reindex(this, 0);
            notify(this, '__on_insert', 0, list);
        }

        return this.__length;
    }


    this.shift = function () {

        var item;

        if (this.__length > 0)
        {
            released = true;

            if (item = array.shift.call(this))
            {
                item.$parent = item.__bindings = null;
                notify(this, '__on_remove', 0, 1);
            }
        }

        return item;
    }


    this.splice = function (index, length) {

        var removed, inserted;

        if ((index |= 0) < 0 && (index += this.length) < 0)
        {
            index = 0;
        }

        if (arguments.length > 2)
        {
            inserted = createModels(this, arguments, 2);

            released = true;
            removed = splice.apply(this, [index, length].concat(inserted));
        }
        else
        {
            released = true;
            removed = splice.apply(this, arguments);
        }

        if (removed.length > 0)
        {
            for (var i = removed.length; i--;)
            {
                removed[i].$parent = removed[i].__bindings = null;
            }

            notify(this, '__on_remove', index, removed.length);
        }

        if (inserted)
        {
            reindex(this, index);
            notify(this, '__on_insert', index, inserted);
        }

        return removed;
    }


    this.clear = function () {

        var list;

        if (this.__length > 0)
        {
            released = true;
            list = splice.call(this, 0);
    
            for (var i = list.length; i--;)
            {
                list[i].$parent = list[i].__bindings = null;
            }

            notify(this, '__on_clear');
        }

        return list;
    }


    this.sort = function (sortFn) {

        array.sort.call(this, sortFn);


        notify(this, '__on_sort', 0);
    }


    this.reverse = function () {

        array.reverse.call(this);
        notify(this, '__on_sort', 1);
    }


    
}).call(Object.create(null));




(function (yaxi) {


    var create = Object.create;

    var colors = yaxi.colors || (yaxi.colors = create(null));

    var color = yaxi.color = colors.default = create(null);


    var bg = color.bg = create(null);

    var font = color.font = create(null);

    var border = color.border = create(null);

    var icon = color.icon = create(null);


    bg.level1 = '#ffffff';
    bg.level2 = '#f7f7f7';
    bg.level3 = '#cccccc';
    bg.level4 = '#888888';
    bg.level5 = '#555555';

    bg.primary = '#1c86ee';
    bg.second = '#48d1cc';
    bg.success = '#71c04a';
    bg.warning = '#e89518';
    bg.danger = '#ff6c6c';
    bg.disabled = '#eeeeee';


    font.level1 = '#31313d';
    font.level2 = '#6c768b';
    font.level3 = '#b8c0de';
    font.level4 = '#cccccc';
    font.level5 = '#f7f7f7';

    font.primary = '#1c86ee';
    font.second = '#48d1cc';
    font.success = '#71c04a';
    font.warning = '#e89518';
    font.danger = '#ff6c6c';
    font.disabled = '#999999';


    border.level1 = '#31313d';
    border.level2 = '#6c768b';
    border.level3 = '#b8c0de';
    border.level4 = '#cccccc';
    border.level5 = '#ffffff';

    border.primary = '#1c86ee';
    border.second = '#48d1cc';
    border.success = '#71c04a';
    border.warning = '#e89518';
    border.danger = '#ff6c6c';
    border.disabled = '#999999';


    icon.level1 = '#31313d';
    icon.level2 = '#6c768b';
    icon.level3 = '#b8c0de';
    icon.level4 = '#cccccc';
    icon.level5 = '#ffffff';

    icon.primary = '#1c86ee';
    icon.second = '#48d1cc';
    icon.success = '#71c04a';
    icon.warning = '#e89518';
    icon.danger = '#ff6c6c';
    icon.disabled = '#999999';


    color.mask = '#000000';
    
    color.shadow = '#888888';



    (function combine(prefix, value) {

        if (typeof value !== 'object')
        {
            color[prefix + 'color'] = value;
        }
        else
        {
            for (var name in value)
            {
                combine(prefix + name + '-', value[name]);
            }
        }

    })('', color);



})(yaxi);





Object.extend.call(Array, function (Class, base) {



    var create = Object.create;


    var classes = yaxi.classes = create(null);

    var cache = create(null);
    


    if (typeof jiac !== 'undefined')
    {
        jiac.classes = classes;
    }

    

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
                            if ((token = tokens[index++][0]) < '0' || token > 'z')
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

        throw 'selector is invalid, ' + token + ' at ' + index + ', ' + message + '!';
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
                return control.$storage.key === rule[1];

            case '':
                return control instanceof (classes[rule[1]] || Boolean);

            case '.':
                rule = rule[1];
                return control.$class.indexOf(rule) >= 0 || ((control = control.__class) ? control.indexOf(rule) >= 0 : false);

            case '#':
                return control.$storage.id === rule[1];

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
    
        if (selector = cache[selector] || parse(selector))
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
            item;

        while (item = this[index++])
        {
            var fn = item[name];

            if (fn)
            {
                if (args)
                {
                    fn.call(item);
                }
                else
                {
                    fn.apply(item, args);
                }
            }
        }

        return this;
    }



    this.hasClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.hasClass(name))
                {
                    return true;
                }
            }
        }
        
        return false;
    }


    this.addClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.addClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.removeClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.removeClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.toggleClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.style = function (value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.style = value;
        }

        return this;
    }


    this.setStyle = function (name, value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.setStyle(name, value);
        }

        return this;
    }


    this.removeStyle = function (name) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.removeStyle(name);
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


    this.trigger = function (type, payload) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.trigger(type, payload);
        }

        return this;
    }


    this.remove = function () {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.remove();
        }

        return this;
    }


});




yaxi.Control = Object.extend.call({}, function (Class, base) {



    var create = Object.create;


    var eventTarget = yaxi.EventTarget.prototype;



    // 注册的控件类集合
    var classes = yaxi.classes;


    
    // 补丁集合
    var patches = yaxi.__patches = [];


    // 渲染前处理集合
    var renderings = [];


    // 渲染后处理集合
    var rendereds = [];


    // 调度器
    var schedule = 0;



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
        if (!control.index) debugger
        patches.push(control);

        if (!schedule)
        {
            schedule = setTimeout(update, 0);
        }
    }


    // 更新补丁
    function update() {

        yaxi.trigger('yaxi-page-patch', patches);
        schedule = patches.length = 0;
    }


    // 通知更新
    yaxi.__notify_update = function (before) {

        var list = before ? renderings : rendereds;
        var index = 0;
        var fn;

        while (fn = list[index++])
        {
            fn.apply(list[index++], list[index++]);
        }

        list.length = 0;
    }


    // 注册渲染前事件
    this.bindBeforeRender = function (fn, args) {

        renderings.push(fn, this, args);
    } 


    // 注册渲染后事件
    this.bindAfterRender = function (fn, args) {

        rendereds.push(fn, this, args);
    }


    
    // 默认值集合
    this.$defaults = create(null);


    // 转换器集合
    this.$converter = create(null);


    // 不转换Class
    this.$converter.Class = false;


    // 混入存储器(h5用来放置自定义渲染逻辑)
    this.$mixin = create(null);



    // 标记是否已发生变化
    this.__dirty = true;



    // 定义属性
    this.$property = yaxi.impl.property(function (name, change) {

        return change ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }

    }, function (name, converter, change) {

        return change ? function (value) {

            var changes = this.__changes,
                storage = this.$storage;

            value = converter.call(this, value);

            if (changes)
            {
                if (value === changes[name])
                {
                    return;
                }

                if (value !== storage[name])
                {
                    changes[name] = value;
                }
                else
                {
                    delete changes[name];
                }
            }
            else if (value !== storage[name])
            {
                (this.__changes = {})[name] = value;
                this.__dirty || patch(this);
            }

        } : function (value) {

            this.$storage[name] = converter.call(this, value);
        }

    });




    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls = create(null);


    // 控件唯一id
    this.$property('uuid', {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });



    // id
    this.$property('id', '', true);


    // 默认class
    this.$class = 'yx-control';


    // class
    this.$property('class', {

        defaultValue: '',

        converter: function (value) {

            if (value)
            {
                this.__class = value = ('' + value).split(/\s+/);
                return value.join(' ');
            }

            this.__class = null;
            return '';
        }

    }, true, 'className');

    
    function change(target, name, value) {

        var changes;

        if (changes = target.__changes)
        {
            changes[name] = value;
        }
        else
        {
            (target.__changes = {})[name] = value;
            target.__dirty || patch(target);
        }
    }


    this.hasClass = function (name) {

        if (name)
        {
            var keys = this.__class;
            return keys ? keys.indexOf(name) >= 0 : false;
        }
        
        return false;
    }


    this.addClass = function (name) {

        var keys;

        if (name && name.search(/\s+/) < 0)
        {
            if (keys = this.__class)
            {
                if (keys.indexOf(name) >= 0)
                {
                    return;
                }

                keys.push(name);
            }
            else
            {
                keys = this.__class = [name];
            }

            change(this, 'class', keys.join(' '));
        }
        else
        {
            throw 'class not null or space';
        }
    }


    this.removeClass = function (name) {

        if (name)
        {
            var keys = this.__class;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);
                change(this, 'class', keys.join(' '));
            }
        }
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var keys = this.__class;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);
                change(this, 'class', keys.join(' '));
            }
            else
            {
                this.addClass(name);
            }
        }
    }
    
    

    // 样式
    this.$property('style', {

        defaultValue: '',

        converter: function (value) {

            if (value)
            {
                value = ('' + value).match(/[:;]|[^:;\s]+/g);

                if (value[value.length - 1] !== ';')
                {
                    value.push(';');
                }

                return (this.__style = value).join('');
            }

            this.__style = null;
            return '';
        }
    });



    this.setStyle = function (name, value) {

        var style, index;

        if (name)
        {
            if (style = this.__style)
            {
                if ((index = style.indexOf(name)) >= 0)
                {
                    style.splice(index, style.indexOf(';', index) - index + 1);
                }
                else
                {
                    style.push(name, ':', value, ';');
                }
            }
            else if (value)
            {
                style = this.__style = [name, ':', value, ';'];
            }

            change(this, 'style', style.join(''));
        }
    }


    this.removeStyle = function (name) {

        var style, index;

        if (name && (style = this.__style) && (index = style.indexOf(name)) >= 0)
        {
            style.splice(index, style.indexOf(';', index) - index + 1);
            change(this, 'style', style.join(''));
        }
    }


    
    // 控件风格
    this.$property('theme', '');
    

    // 是否可见
    this.$property('visible', true);


    // 是否禁用
    this.$property('disabled', false);


    // 是否选中
    this.$property('selected', false);


    // 选中时状态
    this.$property('selectedStatus', null, false);
    

    // 自定义key
    this.$property('key', '', false);
    

    // 自定义tag
    this.$property('tag', null, false);




    // 父控件
    this.parent = null;


    // 检查父控件(默认允许任意容器控件)
    this.checkParent = true;


    // 顶级控件
    this.$property('root', {

        get: function () {

            var target = this,
                parent;

            while (parent = target.parent)
            {
                target = parent;
            }

            return target;
        }
    });



    // 赋值
    this.assign = function (values) {

        if (values)
        {
            var converters = this.$converter,
                converter,
                changes,
                any;

            // 优先处理模型
            if (any = values.model)
            {
                this.model = any;
            }

            for (var name in values)
            {
                if (converter = converters[name])
                {
                    if (typeof converter === 'string') // 样式属性
                    {
                        (changes || (changes = this.__changes = {}))[converter] = '' + values[name];
                    }
                    else if (converter.change) // 需要处理变化
                    {
                        (changes || (changes = this.__changes = {}))[converter.name] = converter.fn.call(this, values[name]);
                    }
                    else if (any = converter.name) // 默认转换器
                    {
                        this.$storage[any] = converter.fn.call(this, values[name]);
                    }
                    else // 自定义转换器
                    {
                        converter.fn.call(this, values[name]);
                    }
                }
                else if (converter !== false)
                {
                    this[name] = values[name];
                }
            }
        }

        return this;
    }
    


    // 扩展查找实现
    yaxi.impl.find.call(this);
    

    // 扩展绑定实现
    yaxi.impl.binding.call(this);


    // 转换bindings
    this.$converter.bindings = {

        fn: this.__set_bindings
    };


    // 推送绑定
    this.$push = function (value) {

        var binding = this.__binding_push,
            pipe;

        if (binding)
        {
            if (pipe = binding.pipe)
            {
                value = pipe(value);
            }

            binding.model[binding.name] = value;
        }
    }



    
    // 绑定事件
    this.on = eventTarget.on;

    
    // 绑定只执行一次的事件
    this.once = eventTarget.once;


    // 注销事件
    this.off = eventTarget.off;


    // 触发事件
    this.trigger = eventTarget.trigger;


    // 检测是否注册了指定的事件
    this.hasEvent = eventTarget.hasEvent;




    this.$converter.events = {
        
        fn: function (events) {

            for (var name in events)
            {
                this.on(name, events[name]);
            }
        }
    };




    this.remove = function () {

        var parent = this.parent,
            children,
            index;

        if (parent && (children = parent.__children) && (index = children.indexOf(this)) >= 0)
        {
            children.splice(index, 1);
        }
    }

    
    
    this.destroy = function () {

        var bindings, any;

        if (any = this.__uuid)
        {
            delete controls[any];
        }

        if (bindings = this.__bindings)
        {
            this.__bindings = null;

            for (var name in bindings)
            {
                if ((any = bindings[name]) && (any = any.model) && any.__bindings)
                {
                    any.$unbind(bindings[name]);
                }
            }
        }

        if (this.__event_keys)
        {
            this.off();
        }

        if (any = this.$view)
        {
            this.destroyView(any);
            this.$view = null;
        }
        
        if (this.ondestroy)
        {
            this.ondestroy();
        }

        this.parent = this.__binding_push = null;
    }


    this.destroyView = function (view) {
    }



    
    this.__class_init = function (Class) {

        Class.register = register;
        Class.allowParent = true;

        this.$defaults = create(this.$defaults);
        this.$converter = create(this.$converter);
        this.$mixin = create(this.$mixin);
    }



    classes[Class.typeName = this.typeName = 'Control'] = Class;

    
    function register(name) {

        if (name)
        {
            var prototype = this.prototype;

            classes[this.typeName = prototype.typeName = name] = this;
            prototype.$class = prototype.$class + ' yx-' + name.toLowerCase();
        }

        return this;
    }


    // 默认允许任意类型父控件
    Class.allowParent = true;



    
    var message1 = ' can not be a sub type';

    var message2 = ' can not be null!';
    

    // 检查父控件
    yaxi.__check_parent = function (Class, parent) {

        var check;

        if (!Class)
        {
            throw 'Class' + message2;
        }

        if (!parent)
        {
            throw 'parent' + message2;
        }

        if (check = Class.allowParent)
        {
            if (check !== true && !check(parent))
            {
                throw Class.typeName + message1 + ' of ' + parent.typeName + '!';
            }
        }
        else if (check = Class.typeName)
        {
            throw check + message1 + '!';
        }
        else
        {
            throw JSON.stringify(Class).substring(0, 20) + '... not a valid type!';
        }
    }



}, function Control() {
 
    var init;

    this.$storage = Object.create(this.$defaults);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

});




yaxi.Collection = Object.extend.call({}, function (Class) {



    var classes = yaxi.classes;

    var controls = yaxi.$controls;

    var Control = yaxi.Control;

    
    var array = Array.prototype;

    var push = array.push;

    var slice = array.slice;

    var splice = array.splice;

    var released = false;


    var check = yaxi.__check_parent;



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
                throw 'length is readonly!';
            }
        }
    });




    function checkSubtype(parent) {

        var subtype;

        if (subtype = parent.subtype)
        {
            switch (typeof subtype)
            {
                case 'string':
                    subtype = classes[subtype];
                    break;

                case 'function':
                    break;

                default:
                    throw 'not a valid subtype, must be a function or a type name!';
            }
        }
        
        check(subtype || (subtype = Control), parent);

        return subtype;
    }


    function createControl(parent, subtype, options) {

        var Class, control;

        if (options)
        {
            if (options.$storage && (Class = options.constructor))
            {
                check(Class, parent);

                control = options;

                if (control.parent && control.parent !== parent)
                {
                    control.remove();
                }

                control.parent = parent;
                return control;
            }

            if (Class = options.Class)
            {
                if (typeof Class === 'string')
                {
                    Class = classes[control];
                }
                
                check(Class, parent);
            }

            control = new (Class || subtype)();
            control.parent = parent;
            control.assign(options);
        }
        else
        {
            control = new subtype();
            control.parent = parent;
        }

        return control;
    }



    function patch(target) {

        target.__last = slice.call(target, 0);

        if ((target = target.$uuid) && (target = controls[target]) && !target.__dirty)
        {
            yaxi.patch(target);
        }
    }



    this.createControls = function (list, index, outputs) {

        var parent = controls[this.$uuid],
            subtype = checkSubtype(parent),
            length = list.length,
            control;

        if ((index |= 0) < 0)
        {
            index = 0;
        }

        outputs || (outputs = []);

        while (index < length)
        {
            if (control = createControl(parent, subtype, list[index++]))
            {
                outputs.push(control);
            }
        }

        return outputs;
    }


    
    this.indexOf = array.indexOf;
    
    this.lastIndexOf = array.lastIndexOf;


    this.forEach = array.forEach;

    this.map = array.map;

    this.reduce = array.reduce;

    this.reduceRight = array.reduceRight;



    this.assign = function (values) {

        var parent = controls[this.$uuid],
            subtype = checkSubtype(parent),
            index = 0,
            control;

        if (this.__length > 0)
        {
            this.clear();
        }

        for (var i = 0, l = values.length; i < l; i++)
        {
            if (control = createControl(parent, subtype, values[i]))
            {
                this[index++] = control;
            }
        }

        this.__length = index;
    }


    this.set = function (index, value) {

        if ((index |= 0) >= 0 && this.__length > index)
        {
            var parent = controls[this.$uuid];
            var subtype = parent.subtype || yaxi.Control;

            check(subtype, parent);
            value = createControl(parent, subtype, value);

            this.__last || patch(this);
            this[0] = value;
        }
    }


    this.push = function () {

        if (arguments.length > 0)
        {
            var controls = this.createControls(arguments, 0, []);

            this.__last || patch(this);

            released = true;
            return push.apply(this, controls);
        }

        return this.__length;
    }


    this.pop = function () {

        var control;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;

            if (control = array.pop.call(this))
            {
                control.parent = null;
            }
        }

        return control;
    }


    this.unshift = function () {

        if (arguments.length > 0)
        {
            var controls = this.createControls(arguments, 0, []);

            this.__last || patch(this);

            released = true;
            return array.unshift.apply(this, controls);
        }

        return this.__length;
    }


    this.shift = function () {

        var control;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;

            if (control = array.shift.call(this))
            {
                control.parent = null;
            }
        }

        return control;
    }


    this.splice = function (index, length) {

        var controls;

        this.__last || patch(this);

        released = true;

        if (arguments.length > 2)
        {
            controls = this.createControls(arguments, 2, [index, length]);
            controls = splice.apply(this, controls);
        }
        else
        {
            controls = splice.apply(this, arguments);
        }

        if (controls.length > 0)
        {
            for (var i = controls.length; i--;)
            {
                controls[i].parent = null;
            }
        }

        return controls;
    }


    this.clear = function () {

        var controls;

        if (this.__length > 0)
        {
            this.__last || patch(this);

            released = true;
            controls = splice.call(this, 0)

            for (var i = controls.length; i--;)
            {
                controls[i].parent = null;
            }
        }

        return controls || [];
    }


    this.sort = function (sortby) {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.sort.call(this, sortby);
        }

        return this;
    }



    this.reverse = function () {

        if (this.__length > 0)
        {
            this.__last || patch(this);
            array.reverse.call(this);
        }

        return this;
    }



}, function Collection(control) {

    this.$uuid = control.uuid;
    
});




/*
 * ContentControl主要作为自定义内容展示用
 * 不支持对子控件进行操作
*/
yaxi.ContentControl = yaxi.Control.extend(function (Class, base) {


    
    var classes = yaxi.classes;

    var check = yaxi.__check_parent;


    
    // 内容
    this.$property('content', {

        defaultValue: null,

        converter: function (value) {

            var content = this.__content;
    
            if (content && typeof content !== 'string')
            {
                for (var i = list.length; i--;)
                {
                    list[i].destroy();
                }
            }
    
            if (!value || typeof value !== 'object')
            {
                content = this.__text_content(value = '' + value);
            }
            else if (value instanceof Array)
            {
                content = createControls(this, value);
            }
            else if (value.Class)
            {
                content = [createControl(this, value)];
            }
            else
            {
                content = value = '' + value; 
            }
    
            this.__content = content;
            return value;
        }

    });




    this.__text_content = function (text) {

        return text;
    }
    


    function createControls(parent, values) {

        var length = values.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = createControl(parent, values[i]);
        }

        return list;
    }


    function createControl(parent, options) {

        var Class = options.Class;
        var control;

        if (typeof Class === 'string')
        {
            Class = classes[Class];
        }

        if (Class)
        {
            check(Class, parent);
        }
        else
        {
            Class = yaxi.Text;
        }

        control = new Class();
        control.parent = parent;
        control.assign(options);

        return control;
    }



    this.destroy = function () {

        var content = this.__content;

        if (content && typeof content !== 'string')
        {
            for (var i = content.length; i--;)
            {
                content[i].destroy();
            }
        }

        base.destroy.call(this);
    }


});




/*
 * Panel是一个自由的容器控件
 * 不仅可以通过children属性访问子控件集合, 也可以通过find及query方法对子控件进行处理
*/
yaxi.Panel = yaxi.Control.extend(function (Class, base) {



    // 布局
    this.$property('layout', '');

    

    // 子控件集合
    this.$property('children', {

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


    this.$converter.children = {
        
        fn: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.assign(values);
            }
        }
    };



    // 扩展查询实现
    yaxi.impl.query.call(this);
    

    
    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].destroy();
        }

        base.destroy.call(this);
    }

    

}, function Panel() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);
    
    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Panel');





/*
 * Repeater是一个通过模型(arrayModel)和模板(template)进行重复展现的容器控件
 * 不支持children属性, 但是可以通过find或query对子控件进行操作
*/
yaxi.Repeater = yaxi.Control.extend(function (Class, base) {



    var assign = Object.assign;


    
    // 标记不能被继承
    Class.sealed = true;



    // 模板
    this.$property('template', {
     
        defaultValue: null,

        converter: function (value) {

            var storage = this.$storage;
            var arrayModel = storage.arrayModel;

            if (value && typeof value !== 'object')
            {
                value = null;
            }
            else if (arrayModel && value !== storage.template)
            {
                rebuild(this, arrayModel, value);
            }

            return value;
        }

    }, false);



    // 数组模型
    this.$property('arrayModel', {

        defaultValue: null,

        converter: function (value) {

            if (value)
            {
                var arrayModel, template;

                if (typeof value !== 'object')
                {
                    arrayModel = this.__find_arrayModel(value = '' + value);
                }
                else if (value.__model_type === 2)
                {
                    arrayModel = value;
                }
                else
                {
                    return null;
                }

                if (arrayModel !== this.__arrayModel)
                {
                    arrayModel.$bind(this);
                    this.__arrayModel = arrayModel;

                    if (template = this.$storage.template)
                    {
                        rebuild(this, value, template);
                    }
                }
            }
            else
            {
                value = null;
            }

            return value;
        }

    }, false);

    

    // 子项名称
    this.$property('item', 'item', false);


    // 索引名称
    this.$property('index', 'index', false);


    // 子控件集合
    this.$property('children', {

        get: no_children,
        set: no_children
    });



    function no_children () {

        throw 'Repeater doesn\'t supports children property, please use template and arrayModel!';
    }



    // 扩展查询实现
    yaxi.impl.query.call(this);


    

    function rebuild(repeater, arrayModel, template) {

        var children = repeater.__children;

        if (children[0])
        {
            children.clear();
        }

        if (arrayModel && arrayModel[0])
        {
            children.push.apply(children, createItems(arrayModel, template));
        }
    }



    function createItems(arrayModel, template) {

        var length = arrayModel.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = assign({ __model: arrayModel[i] }, template);
        }

        return list;
    }


    this.__on_set = function (index, item) {

        var template;

        if (template = this.template)
        {
            this.__children.set(index, assign({ __model: item }, template))
        }
    }


    this.__on_insert = function (index, list) {

        var template, children;

        if (template = this.template)
        {
            children = this.__children;
            list = createItems(list, template);

            if (index < 0)
            {
                children.push.apply(children, list);
            }
            else
            {
                list.unshift(index, 0);
                children.splice.apply(children, list);
            }
        }
    }


    this.__on_remove = function (index, length) {

        this.__children.splice(index, length);
    }


    this.__on_clear = function () {

        this.__children.clear();
    }


    this.__on_sort = function () {

        this.__children.sort(sort);
    }


    function sort(a, b) {

        a = a.__model.__index;
        b = b.__model.__index;

        return a > b ? 1 : (a < b ? -1 : 0);
    }



    this.destroy = function () {

        var any = this.__children;

        for (var i = any.length; i--;)
        {
            any[i].destroy();
        }

        if (any = this.arrayModel)
        {
            any.$unbind(this);
        }

        base.destroy.call(this);
    }



}, function Repeater() {

    var init;
    
    this.$storage = Object.create(this.$defaults);
    this.__children = new yaxi.Collection(this);

    if (init = this.init)
    {
        init.apply(this, arguments);
    }

}).register('Repeater');




yaxi.Band = yaxi.Panel.extend(function (Class, base) {




}, function Band() {

    yaxi.Panel.apply(this, arguments);

}).register('Band');




yaxi.Button = yaxi.ContentControl.extend(function (Class, base) {



    // 布局
    this.$property('layout', '');



}, function Button() {

    yaxi.Control.apply(this, arguments);

}).register('Button');




yaxi.Icon = yaxi.Control.extend(function (Class, base) {



}, function Icon() {

    yaxi.Control.apply(this, arguments);

}).register('Icon');




yaxi.IconButton = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$property('layout', '');
    

    // 图标名
    this.$property('icon', '');


    // 图标大小
    this.$property('size', '');



}, function IconButton() {

    yaxi.Control.apply(this, arguments);

}).register('IconButton');




yaxi.Image = yaxi.Control.extend(function (Class, base) {


    


}, function Image() {

    yaxi.Control.apply(this, arguments);

}).register('Image');




yaxi.ImageButton = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$property('layout', '');
    

    // 图像url
    this.$property('image', '');


    // 图像大小
    this.$property('size', '');



}, function ImageButton() {

    yaxi.Control.apply(this, arguments);

}).register('ImageButton');




yaxi.Popup = yaxi.Panel.extend(function (Class, base) {
	


	
	
}, function Popup() {

	yaxi.Panel.call(this);

}).register('Popup');




yaxi.ScrollPanel = yaxi.Panel.extend(function () {


}, function ScrollPanel() {

    yaxi.Panel.call(this);

}).register('ScrollPanel');




yaxi.SideBar = yaxi.Panel.extend(function (Class, base) {


    


}, function SideBar() {

    yaxi.Panel.apply(this, arguments);

}).register('SideBar');




yaxi.Tab = yaxi.Panel.extend(function (Class, base) {



    this.subtype = yaxi.IconButton;



    // 线条(目前只支持top及bottom)
    this.$property('line', 'bottom');
    

    // 容器宿主
    this.$property('host', '', false);



    // 获取或设置当前页索引
    this.$property('selectedIndex', {

        defaultValue: -1,

        converter: function (value) {

            value = (value |= 0) < 0 ? -1 : value;

            // 第一次设置选中索引时在渲染前再处理,否则host可能没有初始化好
            if (value >= 0)
            {
                this.bindBeforeRender(initIndex, [value]);
            }

            return value;
        },

        set: function (value) {

            var lastIndex = this.$storage.selectedIndex;

            if ((value |= 0) < 0)
            {
                value = -1;
            }

            if (lastIndex !== value)
            {
                changeIndex(this, value, lastIndex);
            }
        }

    }, false, 'selected-index');



    // 选中的页头
    this.$property('selectedItem', {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.children[index] || null;
        }
    });


    // 选中的页签容器
    this.$property('selectedHost', {

        get: function () {

            var host = this.host;

            if (!host)
            {
                throw 'Tab host not allow empty!'; 
            }

            if (host[0] !== '<')
            {
                throw 'Tab host must use "<" or "<<" to find up!';
            }

            if (host = this.find(host))
            {
                if (host.children)
                {
                    return host;
                }

                throw 'Tab host must be a Panel!';
            }

            throw 'Tab can not find host "' + this.host + '"!';
        }
    });



    function initIndex(index) {

        changeIndex(this, index, -1);
    }


    function changeIndex(tab, index, lastIndex) {

        var children = tab.children;
        var event = new yaxi.Event('changing');
        var item;

        event.lastIndex = lastIndex;
        event.lastPage = tab.findPage(event.lastItem = children[lastIndex] || null);

        event.index = index;
        event.page = tab.findPage(event.item = children[index] || null);

        if (tab.trigger(event) !== false)
        {
            tab.$storage.selectedIndex = index;

            if (item = event.lastPage)
            {
                item.addClass('yx-hidden');
            }

            if (item = event.lastItem)
            {
                item.selected = false;
            }

            if (item = event.item)
            {
                item.selected = true;
                checkPage(tab, event);
            }

            event.type = 'changed';
            tab.trigger(event);
        }
    }


    function checkPage(tab, event) {

        var page = event.page;
        var item = event.item;

        if (!page)
        {
            if (page = item.module)
            {
                page = event.page = new page();
                tab.selectedHost.children.push(page);
            }
            else
            {
                return;
            }
        }

        if (page.__tab)
        {
            page.removeClass('yx-hidden');
        }
        else
        {
            page.__tab = item.uuid;
            page.addClass('yx-tab-page');
        }
    }



    this.findPage = function (item) {

        if (item)
        {
            var children = this.selectedHost.children;
            var uuid = item.uuid;
    
            for (var i = children.length; i--;)
            {
                if (children[i].__tab === uuid)
                {
                    return children[i];
                }
            }
        }

        return null;
    }



    this.__on_tap = function (event) {

        var control = this.parentToThis(event.target);

        if (control && !control.selected)
        {
            this.selectedIndex = this.children.indexOf(control);
        }
    }
    


}, function Tab() {


    yaxi.Panel.apply(this, arguments);


}).register('Tab');




yaxi.Text = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');


    this.$property('security', '');


    this.$property('format', {
    
        defaultValue: null,
        converter: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);


}, function Text() {

    yaxi.Control.apply(this, arguments);

}).register('Text');




yaxi.TextBox = yaxi.Control.extend(function () {




    this.$property('value', '');



    this.$property('text', {

        get: function () {

            return (any = this.__format) ? any(this.value) : this.value;
        },
        set: function (value) {

            this.value = value;
        }
    });

    
    this.$property('placeholder', '');


    this.$property('align', 'left');


    this.$property('maxlength', 0, true);


    this.$property('pattern', '');


    this.$property('format', {
    
        defaultValue: null,

        converter: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    }, false);


}, function TextBox() {

    yaxi.Control.apply(this, arguments);
    
}).register('TextBox');




yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-checkbox-checked', true, 'checked-icon');


    this.$property('uncheckedIcon', 'icon-yaxi-checkbox-unchecked', true, 'unchecked-icon');

    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');




yaxi.NumberBox = yaxi.TextBox.extend(function () {


    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', {
    
        defaultValue: 0,
        converter: function (value) {

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
    this.$property('min', -Infinity, false);


    // 最大值
    this.$property('max', Infinity, false);


    // 加减步进
    this.$property('step', 1);


}, function NumberBox() {

    yaxi.Control.apply(this, arguments);

}).register('NumberBox');




yaxi.PasswordBox = yaxi.TextBox.extend(function () {



    this.$property('type', '');



}).register('PasswordBox');




yaxi.Memo = yaxi.Control.extend(function () {


    this.$property('value', '');

    
    this.$property('placeholder', '');


    this.$property('text', '');


    
}, function Memo() {

    yaxi.Control.apply(this, arguments);

}).register('Memo');




yaxi.RadioButton = yaxi.Control.extend(function (Class, base) {



    this.$property('text', '');


    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-radio-checked', true, 'checked-icon');


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked', true, 'unchecked-icon');


    // 互斥容器级别
    this.$property('host', 1);


}, function RadioButton() {

    yaxi.Control.apply(this, arguments);

}).register('RadioButton');




yaxi.SwitchButton = yaxi.Control.extend(function (Class, base) {


    this.$property('checked', false);
    

}, function SwitchButton() {

    yaxi.Control.apply(this, arguments);

}).register('SwitchButton');




yaxi.Page = yaxi.Panel.extend(function (Class, base) {



	var define = Object.defineProperty;

	
	// 页面栈
	var all = [];


	
	// 禁止作为子控件
	Class.allowParent = false;



	// 所有窗口
	define(Class, 'all', {

		get: function () {

			return all;
		}
	});


	// 当前窗口
	define(Class, 'current', {

		get: function () {

			return all[all.length - 1] || null;
		}
	});



	Class.close = function (amount, closeType) {

		if (typeof amount === 'string')
		{
			closeType = amount;
			amount = 1;
		}
		else
		{
			amount = amount || 1;
		}

		for (var i = all.length; i--;)
		{
			if (--amount < 0)
			{
				return;
			}

			all[i].close(closeType);
		}

		return all[all.length - 1] || null;
	}


	Class.closeTo = function (level, closeType) {

		level |= 0;

		for (var i = all.length - 1; i > level; i--)
		{
			all[i].close(closeType || 'OK');
		}

		return all[level] || null;
	}


	Class.closeAll = function (closeType) {

		for (var i = all.length; i--;)
		{
			all[i].close(closeType || 'OK');
		}
	}



	
	this.index = function () {

		return all.indexOf(this);
	}



	this.__find_up = function () {
	
		return null;
	}

	

	this.open = function () {

		if (all.indexOf(this) >= 0 ||
			this.onopening() === false ||
			this.trigger('opening') === false)
		{
			return;
		}

		all.push(this);

		// 触发全局事件通知窗口打开, 以便其它平台处理
		var event = new yaxi.Event('yaxi-page-change');

		event.index = all.length - 1;
		event.page = this;
		event.open = true;
		event.callback = '__open';

		this.removeClass('yx-hidden');

		yaxi.trigger(event);
	}


	this.__open = function (index) {

		var last;

		if (last = all[index - 1])
		{
			last.addClass('yx-hidden');
			last.onhide();
		}

		this.onopened();
		this.onshow(true);

		this.trigger('opened');
	}
	
	
	
	this.close = function (closeType, payload) {
		
		var index = all.indexOf(this);

		if (index < 0)
		{
			return false;
		}

		if (this.onclosing(closeType || (closeType = 'OK'), payload) === false)
		{
			return false;
		}

		var event = new yaxi.Event('closing');

		event.closeType = closeType;

		if (this.trigger(event, payload) === false)
		{
			return false;
		}

		all.splice(index, 1);

		// 触发全局事件通知窗口关闭, 以便其它平台处理
		event = new yaxi.Event('yaxi-page-change');
		event.index = all.length;
		event.page = this;
		event.callback = '__close';

		yaxi.trigger(event);
	}


	this.__close = function (index) {

		var event = new yaxi.Event('closed');

		this.onhide();
		this.onclosed();

		this.trigger(event);

		// 延时销毁以加快页面切换速度
		setTimeout(this.destroy.bind(this), 10);

		// 关闭的是最后一个窗口时才显示上一个窗口
		if (index > 0 && index === all.length)
		{
			var page = all[index - 1];

			page.removeClass('yx-hidden');
			page.onshow(false);
		}
	}
	
	
	this.onopening = function () {
	}
	
	
	this.onopened = function () {
		
	}
	
	
	this.onclosing = function (closeType, payload) {
	}
	
	
	this.onclosed = function (closeType, payload) {
		
	}


	this.onshow = function (first) {

	}


	this.onhide = function () {

	}


	
	
    this.__class_init = function (Class) {

		base.__class_init.call(this, Class);
		Class.open = open;
	}



	function open() {

		var page;

		if (arguments.length > 0)
		{
			page = Object.create(this.prototype);
			this.apply(page, arguments);
		}
		else
		{
			page = new this();
		}

		return page.open();
	}


    
}, function Page() {

    yaxi.Panel.apply(this, arguments);

}).register('Page');




yaxi.Header = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;


    Class.allowParent = function (parent) {

        if (parent instanceof yaxi.Page)
        {
            return true;
        }

        throw 'Header can only add to Page!';
    }



    // 图标
    this.$property('icon', '');


    this.__on_tap = function (event) {

        if (event.key === 'back')
        {
            var root = this.root;

            if (root && root.close)
            {
                root.close();
            }
        }
    }


}, function Header() {

    yaxi.Control.apply(this, arguments);

}).register('Header');








yaxi.Dialog = yaxi.Page.extend(function (Class) {
	
	
	



}, function Dialog() {

	yaxi.Panel.call(this);

}).register('Dialog');




;(function (yaxi) {
    
    
    
    var h5 = yaxi.h5 = Object.create(null);

    var update = yaxi.__notify_update;



    yaxi.platform = 'h5';


    // 是否在微信浏览器中打开
    h5.weixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;



    yaxi.on('yaxi-page-change', function (event) {

        var host = yaxi.__view_host;
        var page = event.page;
        var index = event.index;
        var callback = event.callback;

        event.page = null;

        if (event.open)
        {
            update(true);

            host.appendChild(page.render());
            page[callback](index);

            update(false);
        }
        else if (page.$view)
        {
            host.removeChild(page.$view);
            page[callback](index);
        }
        
    });


    yaxi.on('yaxi-page-patch', function (event) {

        var patches = event.payload;
        var index = 0;
        var control, view;

        event.payload = null;

        update(true);

        while (control = patches[index++])
        {
            if (view = control.$view)
            {
                control.patch(view);
            }
        }

        update(false);
    });


    // 获取系统信息
    yaxi.getSystemInfo = function (callback) {

        var w = window;
        var n = navigator;
        var s = screen;
        var o = w.orientation;

        callback && callback({
            deviceOrientation: o == 180 || o == 0 ? 'portrait' : 'landscape',
            language: n.language,
            pixelRatio: w.devicePixelRatio,
            platform: n.platform,
            screenHeight: s.height,
            screenWidth: s.width,
            statusBarHeight: 0,
            system: n.appName,
            version: n.appVersion,
            windowHeight: w.innerWidth,
            windowWidth: w.innerHeight
        });
    }



})(yaxi);




;(function (yaxi) {



    var host = yaxi.__view_host = document.createElement('div');


	host.className = 'yx-host';

    if (document.body)
    {
        document.body.appendChild(host);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', function () {

            document.body.appendChild(host);
        });
	}
	
	
	// 在微信中打开时(微信自动排版会打乱网页布局)
	if (yaxi.h5.weixin)
	{
        // 1rem = 100px
		document.documentElement.style.fontSize = (yaxi.rem = 100) + 'px';
	}
	else
	{
		// 处理rem自适应
		document.documentElement.style.fontSize = (yaxi.rem = (window.innerWidth * 10000 / 750 | 0) / 10000) + 'px';
        host.style.cssText = 'width:100%;height:100%;transform-origin: 0 0;';
	}



    var controls = yaxi.$controls;


    var Event = yaxi.Event;

    
    // 滑动事件按下时的状态
    var state = Object.create(null);


    // 是否检查点击
    var tap = false;

    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();


    var bind = host.addEventListener.bind(host);




    function findControl(view) {

        var control, uuid;

        while (view)
        {
            if ((uuid = view.$uuid) && (control = controls[uuid]))
            {
                while (control.disabled)
                {
                    control = control.parent;
                }

                return control;
            }

            view = view.parentNode;
        }
    }

    

    function touchEvent(event, touch) {

        var e = new Event(event.type);

        touch = touch || event.changedTouches[0];

        e.key = event.target.getAttribute('key');
        e.state = state;
        e.touches = event.changedTouches;
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        e.distanceX = e.clientX - state.clientX;
        e.distanceY = e.clientY - state.clientY;

        return e;
    }


    
    function handler(event) {

        var control;

        if (control = findControl(event.target))
        {
            return control.trigger(event.type);
        }
    }


    function call(control, name, event) {

        var fn;

        while (control)
        {
            if ((fn = control[name]) && fn.call(control, event) === false)
            {
                return false;
            }

            control = control.parent;
        }
    }


    function stop(event) {
      
        event.stopPropagation();
        event.preventDefault();

        return false;
    }


    
	bind('touchstart', function (event) {
		
        var control;

        if (control = findControl(event.target))
        {
            var touch = event.changedTouches[0],
                e = touchEvent(event, touch);

            tap = true;

            state.time = new Date();
            state.control = control;
            state.clientX = touch.clientX;
            state.clientY = touch.clientY;

            if (call(control, '__on_touchstart', e) === false || control.trigger(e) === false)
            {
                return tap = stop(event);
            }
        }

	}, true);


	bind('touchmove', function (event) {
        
        var control;

        if (control = state.control)
        {
            var e = touchEvent(event),
                x,
                y;

            if (call(control, '__on_touchmove', e) === false)
            {
                return stop(event);
            }

            if (control.trigger(e) === false)
            {
                return tap = stop(event);
            }
            
            if (tap)
            {
                x = e.distanceX;
                y = e.distanceY;

                // 如果移动了指定距离
                if (x < -8 || x > 8 || y < -8 || y > 8)
                {
                    tap = false;
                }
            }
        }

        if (yaxi.h5.weixin)
        {
            return stop(event);
        }

	}, true);


	bind('touchend', function (event) {
        
        var control, time;

        if (control = state.control)
        {
            var e = touchEvent(event);

            state.control = null;

            if (call(control, '__on_touchend', e) === false || control.trigger(e) === false)
            {
                return stop(event);
            }

            // 按下大于350毫秒则触发longpress事件
            if ((time = new Date()) - state.time > 350)
            {
                e.type = 'longpress';

                if (control.trigger(e) === false)
                {
                    return stop(event);
                }
            }
            // 500ms内不重复触发tap事件
            else if (tap && (time - tapTime > 500 || tapControl !== control))
            {
                tapControl = control;
                tapTime = time;

                e.type = 'tap';
 
                if (call(control, '__on_tap', e) === false || control.trigger(e) === false)
                {
                    return stop(event);
                }
            }
        }

	}, true);


	bind('touchcancel', function (event) {
        
        var control;

        if (control = state.control)
        {
            var e = touchEvent(event);

            state.control = null;

            if (call(control, '__on_touchcancel', e) === false || control.trigger(e) === false)
            {
                return stop(event);
            }
        }

    }, true);



    bind('input', function (event) {

        var control, e;

        if (control = findControl(event.target))
        {
            if ((fn = control.__on_input) && fn.call(control, event) === false)
            {
                return false;
            }

            e = new Event('input');
            e.value = event.target.value;

            return control.trigger(e);
        }

    }, true);


    bind('change', function (event) {

        var control, fn, e;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_change)
            {
                fn.call(control, event);
            }

            e = new Event('change');
            e.value = event.target.value;

            return control.trigger(e);
        }

    }, true);



    
    bind('keydown', handler, true);

    bind('keypress', handler, true);

    bind('keyup', handler, true);



    bind('blur', handler, true);

    bind('focus', function (event) {
     
        var target = event.target,
            control;

        // 页面刚打开时禁止自动弹出键盘
        if ((control = yaxi.Page.current) && (new Date() - control.openTime) < 200)
        {
            target.blur();
            return;
        }

        if (control = findControl(target))
        {
            return control.trigger('focus');
        }
        
    }, true);

    

    bind('scroll', function (event) {

        var control, fn;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_scroll)
            {
                fn.call(control, event.target);
            }

            return control.trigger('scroll');
        }

    }, true);


    
    window.addEventListener('resize', function () {

        var view = document.activeElement;

        // 打开输入法时把焦点控件移动可视区
        if (view && this.innerHeight / this.innerWidth < 1.2)
        {
            view.scrollIntoViewIfNeeded();
        }
    });



})(yaxi);




// http
yaxi.HTTP = yaxi.http = Object.extend.call({}, function (Class) {



    // 重定向状态码
    Class.redirectStatus = 299;


    // 默认超时时间
    Class.timeout = 10000;




    // 重定向
    this.redirect = function () {
        
        location.href = 'index.html';
    }



    this.send = function (options) {

        var self = this,
            stream = new yaxi.Stream(),
            ajax = new XMLHttpRequest(),
            any;
        
        // CORS
        if (options.CORS)
        {
            // withCredentials是XMLHTTPRequest2中独有的
            if ('withCredentials' in ajax)
            {
                ajax.withCredentials = true;
            }
            else if (any = window.XDomainRequest)
            {
                ajax = new any();
            }
        }

        ajax.onreadystatechange = function () {

            if (this.readyState === 4)
            {
                this.onreadystatechange = null;

                if (self)
                {
                    clearTimeout(this.__timeout);
                    self.receive(this, stream, options);
                }
            }
        }

        ajax.open(options.method, options.url, options.async !== false);

        if (options.contentType)
        {
            ajax.setRequestHeader('Content-Type', options.contentType);

            // if (any = options.data)
            // {
            //     ajax.setRequestHeader('Content-Length', any.length);
            // }
        }

        if (any = options.header)
        {
            for (var name in any)
            {
                ajax.setRequestHeader(name, any[name]);
            }
        }

        ajax.__timeout = setTimeout(function () {

            self = null;
            ajax.abort();

            stream.reject({
                url: options.url,
                status: 601,
                message: yaxi.i18n.ajax.timeout
            });

        }, options.timeout || Class.timeout);

        ajax.send(options.data);

        return stream;
    }


    this.receive = function (ajax, stream, options) {

        if (ajax.status >= 100 && ajax.status < 300)
        {
            this.response(ajax, stream, options);
        }
        else
        {
            stream.reject({
                url: options.url,
                status: ajax.status || 600,
                message: ajax.statusText || ajax.responseText || yaxi.i18n.ajax.network,
                options: options
            });
        }
    }


    this.response = function (ajax, stream, options) {

        if (ajax.status === Class.redirectStatus)
        {
            this.redirect();
        }
        else
        {
            stream.resolve(ajax.responseText || ajax.responseXML);
        }
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


    function parseOptions(method, url, data, options, flag) {

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

        return options;
    }



    ;(this.__class_init = function (Class) {


        var parse = parseOptions;


        Class.send = function (method, url, data, options) {

            options = parse(method ? method.toUpperCase() : 'GET', url, data, options || {}); 
            return new Class().send(options);
        }
    
    
        Class.head = function (url, data, options) {
    
            options = parse('HEAD', url, data, options || {}, true);
            return new Class().send(options);
        }
    
    
        Class.get = function (url, data, options) {
    
            options = parse('GET', url, data, options || {}, true);
            return new Class().send(options);
        }
    
    
        Class.post = function (url, data, options) {
    
            options = parse('POST', url, data, options || {});
            return new Class().send(options);
        }
    
    
        Class.put = function (url, data, options) {
    
            options = parse('PUT', url, data, options || {});
            return new Class().send(options);
        }
        
    
        Class.del = function (url, data, options) {
    
            options = parse('DELETE', url, data, options || {});
            return new Class().send(options);
        }
        
    })(Class);



}, function HTTP() {});





yaxi.Control.mixin(function (mixin) {



    var assign = Object.assign;

    var div = document.createElement('div');

    var color = yaxi.color;

    

    yaxi.template = function (target, html) {

        if (target && html)
        {
            target.__template = html;
            target.__dom_template = null;
        }
    }



    this.__template = '<div class="$class"></div>';
    


    function init_template(target) {

        div.innerHTML = target.__template.replace('$class', target.$class);

        view = div.firstChild;
        div.removeChild(view);

        return target.constructor.prototype.__dom_template = view;
    }



    // 渲染控件
    this.render = function () {

        var view = this.$view || (this.$view = (this.__dom_template || init_template(this)).cloneNode(true));

        view.$uuid = this.uuid;
        this.patch(view);

        return view;
    }



    this.destroyView = function (view) {
    }



    this.patch = function (view) {

        var changes;

        this.__dirty = false;

        if (changes = this.__changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin;
            var fn;

            this.__changes = null;

            assign(storage, changes);

            for (var name in changes)
            {
                if (fn = mixin[name])
                {
                    fn.call(this, view, changes[name]);
                }
            }

            return changes;
        }
    }



    this.__render_content = function (view, content) {

        if (typeof content === 'string')
        {
            view.textContent = content;
        }
        else
        {
            var index = 0;
            var control;

            while (control = content[index++])
            {
                view.appendChild(control.render());
            }
        }
    }


    this.__change_class = function (view, prefix, value) {

        var classList = view.classList;

        for (var i = classList.length; i--;)
        {
            if (classList[i].indexOf(prefix) === 0)
            {
                if (value)
                {
                    classList.replace(classList[i], prefix + value);
                }
                else
                {
                    classList.remove(classList[i]);
                }

                return;
            }
        }

        if (value)
        {
            classList.add(prefix + value);
        }
    }



    mixin.theme = function (view, value) {

        this.__change_class(view, 'yx-theme-', value);
    }


    mixin.visible = function (view, value) {

        view.style.display = value ? '' : 'hidden';
    }


    mixin.selected = function (view, value) {

        var status, mixin, changes, fn;

        // 同步状态
        if (status = this.selectedStatus)
        {
            mixin = this.$mixin;
            changes = value ? status : this;

            for (var name in status)
            {
                if (value && name === 'style')
                {
                    view.style.cssText = this.style + changes[name];
                }
                else if (fn = mixin[name])
                {
                    fn.call(this, view, changes[name]);
                }
            }
        }
    }



    mixin.id = function (view, value) {

        view.id = value;
    }


    mixin.class = function (view, value) {

        view.className = value ? this.$class + ' ' + value : this.$class;
    }


    mixin.style = function (view, value) {

        view.style.cssText = value.replace(/@([\w-]+)/g, function (_, key) {

            return color[key];
        });
    }


    mixin.disabled = function (view, value) {

        if (value)
        {
            view.setAttribute('disabled', 'disabled');
        }
        else
        {
            view.removeAttribute('disabled');
        }
    }

    

    mixin.layout = function (view, value) {

        this.__change_class(view, 'yx-layout-', value);
    }


    
});





yaxi.ContentControl.mixin(function (mixin, base) {



    this.__no_content = '';



    this.render = function () {

        var view = base.render.call(this);
        var content = this.__content;

        if (content == null)
        {
            content = this.__no_content;
        }

        this.__render_content(view, content);

        return view;
    }


    
    this.__render_content = function (view, content) {

        if (typeof content === 'string')
        {
            this.__render_text(view, content);
        }
        else
        {
            var index = 0;
            var control;

            while (control = content[index++])
            {
                view.appendChild(control.render());
            }
        }
    }


    this.__render_text = function (view, text) {

        view.textContent = text;
    }


    mixin.content = function (view, value) {

        this.__render_content(view, this.__content || '');
    }


});




yaxi.Panel.mixin(function (mixin, base) {


    
    yaxi.template(this, '<div class="$class"></div>');




    this.render = function () {

        var view = base.render.call(this),
            children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            view.appendChild(control.render());
        }

        return view;
    }


    
    this.patch = function (view) {

        var children = this.__children,
            control,
            length;

        base.patch.call(this, view);

        if (children.__last)
        {
            children.__last = null;
            patch(children, view);
        }

        if ((length = children.length) > 0)
        {
            for (var i = 0; i < length; i++)
            {
                if ((control = children[i]) && control.__dirty && (view = control.$view))
                {
                    control.patch(view);
                }
            }
        }
    }


    function patch(children, view) {

        var refChild = view.firstChild;
        var index = 0;
        var control;
        var newChild;

        while (control = children[index++])
        {
            if (newChild = control.$view)
            {
                if (newChild !== refChild)
                {
                    view.insertBefore(newChild, refChild);
                }
                else
                {
                    refChild = refChild.nextSibling;
                }
            }
            else
            {
                view.insertBefore(control.render(), refChild);
            }
        }

        while (refChild)
        {
            newChild = refChild;
            refChild = refChild.nextSibling;

            view.removeChild(newChild);
        }
    }



});




yaxi.Repeater.mixin(function (mixin, base) {



    var panel = yaxi.Panel.prototype;

    

    yaxi.template(this, '<div class="$class"></div>');



    this.render = panel.render;


    this.patch = panel.patch;

    

});




yaxi.Text.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"></span>');

    

    mixin.text = function (view, value) {

        var format;

        if (!this.__security)
        {
            view.textContent = (format = this.__format) ? format(value) : value;
        }
    }


    mixin.security = function (view, value) {

        var format;

        if (this.__security = value)
        {
            view.textContent = value;
        }
        else
        {
            view.textContent = (format = this.__format) ? format(this.text) : this.text;
        }
    }



});




yaxi.Button.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class"></div>');



    this.__no_content = 'content is empty';
    


});





yaxi.IconButton.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class">'
            + '<div></div>'
            + '<div class="yx-iconbutton-content"></div>'
        + '</div>');


    
    mixin.icon = function (view, value) {

        view.firstChild.className = 'yx-iconbutton-icon iconfont ' + value;
    }


    mixin.size = function (view, value) {

        var style = view.firstChild.style;
        style.width = style.height = value;
    }


    this.__render_content = function (view, content) {

        base.__render_content.call(this, view.lastChild, content);
    }


});




yaxi.ScrollPanel.mixin(function (mixin, base) {



    var pulldown, loading, host;



    // loading设置
    this.$property('loading', {
    
        get: function () {

            return this.__loading;
        },
        set: function (value) {

            if (value)
            {
                var loading = yaxi.Loading;

                if (typeof value === 'function')
                {
                    loading = new loading();
                    loading.onload = value;
                }
                else
                {
                    if (typeof value.onload !== 'function')
                    {
                        throw 'loading onload must be a function!'
                    }
                    
                    loading = value instanceof loading ? value : new loading(value);
                }

                loading.parent = this;

                this.__loading = loading;
                this.__on_scroll = scroll;
            }
            else
            {
                this.__on_scroll = null;
            }
        }
    });

    
    // 下拉设置
    this.$property('pulldown', {

        get: function () {

            return this.__pulldown;
        },
        set: function (value) {

            var pulldown;

            if (value)
            {
                pulldown = yaxi.Pulldown;

                if (typeof value === 'function')
                {
                    pulldown = new pulldown();
                    pulldown.onload = value;
                }
                else
                {
                    if (typeof value.onload !== 'function')
                    {
                        throw 'pulldown onload must be a function!'
                    }

                    pulldown = value instanceof pulldown ? value : new pulldown(value);
                }
            }

            this.__pulldown = pulldown;
        }
    });


    function scroll() {

        var loading;

        if (!pulldown && (loading = this.__loading) && loading.status !== 'completed')
        {
            // 延时处理以避免加载太快
            var time = new Date().getTime();

            if (time - (loading.__time || 0) < 100)
            {
                return;
            }

            var view = this.$view;

            if (view.scrollTop + view.offsetHeight < view.scrollHeight)
            {
                return;
            }

            loading.index++ || (loading.index = 1);
            loading.__time = time;
            loading.onload.call(this, loading);
        }
    }



    this.__on_touchmove = function (event) {

        if (pulldown && pulldown.$view)
        {
            pulldown.move(event.distanceY);

            event.stop(true);
            return false;
        }

        if ((pulldown = this.__pulldown) && this.$view.scrollTop < 1 && 
            (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var state = event.state,
                style = this.$view.style;

            if (loading = this.__loading)
            {
                if (loading.$view)
                {
                    loading.$view.style.visibility = 'hidden';
                }
                else
                {
                    loading = null;
                }
            }

            // 以当前控件和位置开始滑动
            state.control = this;
            state.clientX = event.clientX;
            state.clientY = event.clientY;
    
            // 记录前当滚动的容器
            host = style.overflowY === 'auto' ? this.$view : null;

            pulldown.start(this);

            event.stop(true);
            return false;
        }
        else
        {
            pulldown = host = null;
        }
    }


    this.__on_touchend = this.__on_touchcancel = function (event) {

        if (pulldown)
        {
            if (pulldown.$view)
            {
                if (host)
                {
                    host.style.overflowY = 'auto';
                }

                pulldown.stop(this, loading);
                pulldown = null;

                event.stop(true);
                return false;
            }

            pulldown = loading = host = null;
        }
    }


});




yaxi.Band.mixin(function (mixin, base) {


    
    yaxi.template(this, '<div class="$class"></div>');



});




yaxi.SideBar.mixin(function (mixin, base) {


    
    yaxi.template(this, '<div class="$class"></div>');



});




yaxi.Tab.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class yx-tab-bottom"></div>');



    mixin.line = function (view, value) {

        this.__change_class(view, 'yx-tab-', value);
    }


});




yaxi.TextBox.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><input type="text" /></span>');



    this.focus = function () {

        var view;

        if (view = this.$view)
        {
            view.focus();
        }
    }

    
    this.blur = function () {

        var view;

        if (view = this.$view)
        {
            view.blur();
        }
    }



    mixin.value = function (view, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        view.firstChild.value = value;
    }



    mixin.placeholder = function (view, value) {

        view.firstChild.setAttribute('placeholder', value);
    }


    mixin.maxlength = function (view, value) {

        view.firstChild.setAttribute('maxlength', value);
    }


    mixin.pattern = function (view, value) {

        view.firstChild.setAttribute('pattern', value);
    }


    
    this.__on_change = function (event) {

        var value = this.value;

        this.value = event.target.value;;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            this.$mixin.value(this.$view, value);
        }
    }



});




yaxi.CheckBox.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-checkbox-unchecked"></use></svg><span></span></span>');



    mixin.text = function (view, value) {

        view.lastChild.textContent = value;
    }


    mixin.checked = function (view, value) {

        view.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    mixin.checkedIcon = function (view, value) {

        if (value && this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    mixin.uncheckedIcon = function (view, value) {

        if (value && !this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }



    this.__on_tap = function () {

        this.$push(this.checked = !this.checked);
        this.trigger('change');
    }



});




yaxi.NumberBox.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class">'
            + '<input type="number" />'
            + '<span class="yx-number-minus">-</span>'
            + '<span class="yx-number-plus">＋</span>'
        + '</span>');



    this.clear = function () {

        var view;

        if (view = this.$view)
        {
            view.firstChild.value = '';
        }

        this.$storage.value = 0;
    }



    mixin.button = function (view, value) {

        if (value)
        {
            view.setAttribute('button', true);
        }
        else
        {
            view.removeAttribute('button');
        }
    }



    mixin.value = function (view, value) {

        var format = this.__format;

        if (format)
        {
            value = format(value);
        }

        view = view.firstChild;
        view.value = value ? value : (view.value ? 0 : '');

        view = view.nextSibling;

        if (value === this.min)
        {
            view.setAttribute('disabled', true);
        }
        else
        {
            view.removeAttribute('disabled');
        }

        view = view.nextSibling;

        if (value === this.max)
        {
            view.setAttribute('disabled', true);
        }
        else
        {
            view.removeAttribute('disabled');
        }
    }


    this.__on_tap = function (event) {

        var view = this.$view,
            target = event.view,
            keys;

        while (target && target !== view)
        {
            if (keys = target.classList)
            {
                if (keys.contains('yx-number-minus'))
                {
                    change(this, (+view.firstChild.value || 0) - this.step);

                    event.stop();
                    return false;
                }
                
                if (keys.contains('yx-number-plus'))
                {
                    change(this, (+view.firstChild.value || 0) + this.step);

                    event.stop();
                    return false;
                }
            }

            target = target.parentNode;
        }
    }



    function change(control, value) {

        var any;

        any = control.value;
        control.value = value;

        if ((value = control.value) !== any)
        {
            control.$push(value);

            any = new yaxi.Event('change');
            any.view = control.$view.firstChild;
            any.value = value;

            return control.trigger(any);
        }
        else
        {
            control.$mixin.value(control.$view, value);
        }
    }



    this.__on_input = function (event) {

        var maxlength = this.maxlength;

        // 增加input type="number"不支持maxlength的问题
        if (maxlength > 0 && event.target.value.length >= maxlength)
        {
            return false;
        }
    }


    this.__on_change = function (event) {

        var value = this.value;

        this.value = +event.target.value || 0;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            this.$mixin.value(this.$view, value);
        }
    }




});




yaxi.PasswordBox.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><input type="password" /><span><svg aria-hidden="true"><use xlink:href="#icon-yaxi-eye-close"></use></svg></span></span>');




    mixin.type = function (view, value) {

        view.lastChild.className = value ? 'yx-password-' + value : '';
    }


    this.__on_tap = function (event) {

        var view = this.$view,
            target = event.view,
            icon;

        while (target && target !== view)
        {
            if (target.tagName === 'SPAN')
            {
                view = view.firstChild;
                
                if (view.type === 'text')
                {
                    view.type = 'password';
                    icon = 'yaxi-eye-close';
                }
                else
                {
                    view.type = 'text';
                    icon = 'yaxi-eye-open';
                }

                target.firstChild.firstChild.setAttribute('xlink:href', '#icon-' + icon);
                return;
            }

            target = target.parentNode;
        }
    }




});




yaxi.Memo.mixin(function (mixin, base) {



    this.focus = function () {

        var view;

        if (view = this.$view)
        {
            view.focus();
        }
    }

    
    this.blur = function () {

        var view;

        if (view = this.$view)
        {
            view.blur();
        }
    }

    

    yaxi.template(this, '<span class="$class"><textarea></textarea></span>');



    mixin.value = function (view, value) {

        view.firstChild.value = value;
    }


    mixin.placeholder = function (view, value) {

        view.firstChild.placeholder = value;
    }



    this.__on_change = function (event) {

        var value = this.value;

        this.value = event.target.value;

        if (this.value !== value)
        {
            this.$push(this.value);
        }
        else
        {
            mixin.value(this.$view, value);
        }
    }



});




yaxi.RadioButton.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><svg aria-hidden="true"><use xlink:href="#icon-yaxi-radio-unchecked"></use></svg><span></span></span>');

    


    mixin.text = function (view, value) {

        view.lastChild.textContent = value;
    }


    mixin.checked = function (view, value) {

        view.firstChild.firstChild.setAttribute('xlink:href', '#' + (value ? this.checkedIcon : this.uncheckedIcon));
    }


    mixin.checkedIcon = function (view, value) {

        if (value && this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }


    mixin.uncheckedIcon = function (view, value) {

        if (value && !this.checked)
        {
            view.firstChild.firstChild.setAttribute('xlink:href', '#' + value);
        }
    }

    

    this.__on_tap = function () {

        if (!this.checked)
        {
            this.$push(this.checked = true);
            this.trigger('change');

            // 同一容器内的组件互斥
            this.mutex(this.host)
        }
    }



    this.mutex = function (host) {

        var parent = this.parent;

        host |= 0;

        while (--host)
        {
            parent = parent.parent;
        }

        if (parent)
        {
            var list = parent.query('>>RadioButton');

            for (var i = list.length; i--;)
            {
                var item = list[i];
    
                if (item instanceof Class && item !== this && item.checked)
                {
                    item.checked = false;
                }
            }
        }
    }



});




yaxi.SwitchButton.mixin(function (mixin, base) {



    yaxi.template(this, '<span class="$class"><span class="yx-switchbutton-bar"></span><span class="yx-switchbutton-button"></span></span>');



    mixin.checked = function (view, value) {

        var classList = view.classList;

        if (value)
        {
            classList.add('yx-switchbutton-checked');
        }
        else
        {
            classList.remove('yx-switchbutton-checked');
        }
    }



    this.__on_tap = function () {

        this.$push(this.checked = !this.checked);
        this.trigger('change');
    }



});




yaxi.Page.mixin(function (mixin, base) {



	yaxi.template(this, '<div class="$class"></div>');


	

    
});




yaxi.Header.mixin(function (mixin, base) {



    yaxi.template(this, '<div class="$class">'
            + '<span class="yx-header-back iconfont icon-yaxi-back" key="back" style="display:none;"></span>'
            + '<span class="yx-header-hide"></span>'
            + '<span class="yx-header-host"></span>'
        + '</div>');



    this.__render_content = function (view, content) {

        var root = this.root;

        base.__render_content.call(this, view.lastChild, content);
        view.firstChild.style.display = root.index && root.index() > 0 ? '' : 'none';
    }



    mixin.icon = function (view, value) {

        view = view.firstChild.nextSibling;
        view.className = value ? 'yx-header-icon iconfont ' + value : 'yx-header-hidden';
    }


});




yaxi.Title = yaxi.Control.extend(function (Class) {
    
    

    yaxi.template(this, '<div class="$class"></div>');
    
    


    this.$property('text', '');




    this.$mixin.text = function (view, value) {

        view.textContent = value;
    }
	
	
	
}).register('Title');