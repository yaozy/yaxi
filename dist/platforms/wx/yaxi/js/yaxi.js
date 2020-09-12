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
    this.$converts.model = false;


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
    var property = yaxi.impl.property();


    
    this.__build_get = function (name) {

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

    }
    
    
    this.__build_set = function (name, options) {

        var watches = watchKeys;
        var convert = options.convert;

        return function (value) {

            var any = this.$storage;

            if (convert)
            {
                value = convert(value);
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
    }



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

        prototype.$converts = extend(null);
        
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
                converts = this.$converts,
                convert;

            for (var name in values)
            {
                if (convert = converts[name])
                {
                    storage[name] = convert.fn.call(this, values[name]);
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
    this.$converts = create(null);


    // 不转换Class
    this.$converts.Class = false;


    // 混入存储器(h5用来放置自定义渲染逻辑)
    this.$mixin = create(null);



    // 标记是否已发生变化
    this.__dirty = true;




    // 扩展属性实现
    this.$property = yaxi.impl.property();



    // 构建会造成class变更的属性
    function build_set_class(name, boolean, prefix) {

        return function (value) {

            var storage = this.$storage;
            var list, className;

            value = boolean ? !!value : '' + value;

            if (value !== storage[name])
            {
                storage[name] = value;
                className = value === true ? prefix : prefix + value;

                if (list = this.__class_data)
                {
                    for (var i = list.length; i--;)
                    {
                        if (list[i].indexOf(prefix) === 0)
                        {
                            if (value)
                            {
                                list[i] = className;
                            }
                            else
                            {
                                list.splice(i, 1);
                            }
                            
                            value = 0;
                            break;
                        }
                    }

                    if (value)
                    {
                        list.push(className);
                    }
                }
                else if (value)
                {
                    this.__class_data = [className];
                }

                this.__class_dirty = true;
                this.__dirty || patch(this);
            }
        }
    }


    // 构建触发变更通知的属性
    function build_set_change(name, convert) {

        return function (value) {

            var storage = this.$storage;
            var changes;

            value = convert ? convert.call(this, value) : value;

            if (changes = this.__changes)
            {
                if (value !== changes[name])
                {
                    if (value !== storage[name])
                    {
                        changes[name] = value;
                    }
                    else
                    {
                        delete changes[name];
                    }
                }
            }
            else if (value !== storage[name])
            {
                (this.__changes = {})[name] = value;
                this.__dirty || patch(this);
            }
        }
    }


    // 构建不触发变更通知的属性
    function build_set_unchange(name, convert) {

        return function (value) {

            this.$storage[name] = convert ? convert.call(this, value) : value;
        }
    }

    
    this.__build_get = function (name, options) {

        return options.change && !options.class ? function () {

            var value = this.__changes;
            return value && (value = value[name]) !== void 0 ? value : this.$storage[name];

        } : function () {

            return this.$storage[name];
        }
    }


    this.__build_set = function (name, options) {

        var value;

        // 造成class变更的属性
        if (value = options.class)
        {
            // 不支持触发自身变更通知
            options.change = false;

            // 不支持转换器
            options.convert = false;

            return build_set_class(name, options.type === 'boolean', value);
        }

        return (options.change ? build_set_change : build_set_unchange)(name, options.convert);
    }

    


    // 唯一Id
    var uuid = 1;


    // 所有控件集合
    var controls = yaxi.$controls = create(null);


    // 控件唯一id
    this.$property('uuid', 0, {

        get: function () {

            return this.__uuid || (controls[uuid] = this, this.__uuid = uuid++);
        }
    });



    // id
    this.$property('id', '');


    // 默认class
    this.$class = 'yx-control';


    // class
    this.$property('class', '', {

        change: false,

        alias: 'className',

        get: function () {

            return this.$storage.class;
        },

        set: function (value) {

            var storage = this.$storage;

            value = '' + value;

            if (storage.class !== value)
            {
                storage.class = value;

                this.__class_list = value ? value.split(/\s+/) : [];
                this.__class_dirty = true;
                this.__dirty || patch(this);
            }
        }
    });




    this.hasClass = function (name) {

        if (name)
        {
            var keys = this.__class_list;
            return keys ? keys.indexOf(name) >= 0 : false;
        }
        
        return false;
    }


    this.addClass = function (name) {

        var keys;

        if (name && name.search(/\s+/) < 0)
        {
            if (keys = this.__class_list)
            {
                if (keys.indexOf(name) < 0)
                {
                    keys.push(name);
                }
            }
            else
            {
                this.__class_list = [name];
            }

            this.__class_dirty = true;
            this.__dirty || patch(this);
        }
        else
        {
            throw 'class not null or space';
        }
    }


    this.removeClass = function (name) {

        if (name)
        {
            var keys = this.__class_list;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);

                this.__class_dirty = true;
                this.__dirty || patch(this);
            }
        }
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var keys = this.__class_list;
            var index;

            if (keys && (index = keys.indexOf(name)) >= 0)
            {
                keys.splice(index, 1);
            }
            else
            {
                this.addClass(name);
            }

            this.__class_dirty = true;
            this.__dirty || patch(this);
        }
    }
    
    

    // 样式
    this.$property('style', '', {

        change: false,

        get: function () {

            var style = this.__style;
            return style ? style.join('') : '';
        },

        set: function (value) {

            if (value = '' + value)
            {
                value = value.match(/[:;]|[^:;\s]+/g);

                if (value[value.length - 1] !== ';')
                {
                    value.push(';');
                }
            }
            else
            {
                value = null;
            }
            
            this.__style = value;
            this.__style_dirty = true;
            this.__dirty || patch(this);
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
                this.__style = [name, ':', value, ';'];
            }

            this.__style_dirty = true;
            this.__dirty || patch(this);
        }
    }


    this.removeStyle = function (name) {

        var style, index;

        if (name && (style = this.__style) && (index = style.indexOf(name)) >= 0)
        {
            style.splice(index, style.indexOf(';', index) - index + 1);

            this.__style_dirty = true;
            this.__dirty || patch(this);
        }
    }


    
    // 控件风格
    this.$property('theme', '', {

        class: 'yx-theme-'
    });
    

    // 是否隐藏
    this.$property('hidden', false, {

        type: 'boolean',
        class: 'yx-hidden'
    });


    // 是否禁用
    this.$property('disabled', false);


    // 是否选中
    this.$property('selected', false, {

        change: false,

        get: function () {

            return this.__selected || false;
        },

        set: function (value) {

            if ((value = !!value) !== this.__selected)
            {
                // 从不选中状态切换到选中有选中状态值时则切换状态
                if (value && (value = this.__selected_status))
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
    this.$property('selectedStatus', null, {
        
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
            var converts = control.$converts;
            var convert;
            
            status = {};

            for (var name in selectedStatus)
            {
                var value1 = control[name];
                var value2 = selectedStatus[name];

                if ((convert = converts[name]) && (convert = convert.fn))
                {
                    value2 = convert.call(control, value2);
                }

                if (value1 !== value2)
                {
                    status[name] = [value1, value2];
                    control[name] = value2;
                }
            }
        }

        // 记录保存状态
        control.__save_status = status;
    }

    

    // 自定义key
    this.$property('key', '', {
        
        change: false
    });
    

    // 自定义tag
    this.$property('tag', null, {
        
        change: false
    });




    // 父控件
    this.parent = null;


    // 检查父控件(默认允许任意容器控件)
    this.checkParent = true;


    // 顶级控件
    this.$property('root', null, {

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
            var converts = this.$converts,
                convert,
                changes,
                value,
                any;

            // 优先处理模型
            if (any = values.model)
            {
                this.model = any;
            }

            for (var name in values)
            {
                value = values[name];

                if (convert = converts[name])
                {
                    // 从转换器中获取存储名以解决别名存储的问题
                    name = convert.name;

                    if (any = convert.fn)
                    {
                        value = any.call(this, value);
                    }

                    if (convert.change) // 需要处理变化
                    {
                        (changes || (changes = this.__changes = {}))[name] = value;
                    }
                    else
                    {
                        this.$storage[name] = value;
                    }
                }
                else if (convert !== false)
                {
                    this[name] = value;
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
    this.$converts.bindings = {

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




    this.$converts.events = {
        
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
        this.$converts = create(this.$converts);
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
                if (typeof Class === 'string' && !(Class = classes[Class]))
                {
                    throw '"' + options.Class + '" doesn\'t register!';
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
    this.$property('content', null, {

        convert: function (value) {

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
            this.__content_dirty = true;  // 标记内容已变更

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

        if (typeof Class === 'string' && !(Class = classes[Class]))
        {
            throw '"' + options.Class + '" doesn\'t register!';
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
    this.$property('layout', '', {

        class: 'yx-layout-'
    });

    

    // 子控件集合
    this.$property('children', null, {

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


    this.$converts.children = {
        
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


    
    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });


    // 模板
    this.$property('template', null, {
     
        change: false,

        convert: function (value) {

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

    });



    // 数组模型
    this.$property('arrayModel', null, {

        change: false,

        convert: function (value) {

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

    });

    

    // 子项名称
    this.$property('item', 'item', {

        change: false
    });


    // 索引名称
    this.$property('index', 'index', {
        
        change: false
    });


    // 子控件集合
    this.$property('children', null, {

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
    this.$property('layout', '', {

        class: 'yx-layout-'
    });



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
    this.$property('layout', '', {

        class: 'yx-layout-'
    });
    

    // 图标名
    this.$property('icon', '');


    // 图标大小
    this.$property('size', '');



}, function IconButton() {

    yaxi.Control.apply(this, arguments);

}).register('IconButton');




yaxi.Image = yaxi.Control.extend(function (Class, base) {


    // 图片资源地址
    this.$property('src', '');


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
    this.$property('mode', '');


    // 图片懒加载，在即将进入一定范围（上下三屏）时才开始加载
    this.$property('lazyLoad', false, {

        alias: 'lazy-load'
    });



}, function Image() {

    yaxi.Control.apply(this, arguments);

}).register('Image');




yaxi.ImageButton = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;

    
    // 布局
    this.$property('layout', '', {

        class: 'yx-layout-'
    });
    

    // 图像路径
    this.$property('src', '');


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




yaxi.Swiper = yaxi.Panel.extend(function (Class, base) {



    // 是否显示面板指示点
    this.$property('dots', true);


    // 指示点样式
    this.$property('dotStyle', '', {

        alias: 'dot-style'
    });


    // 活动指示点颜色
    this.$property('activeDotStyle', '', {

        alias: 'dot-active-style'
    });


    // 是否自动切换
    this.$property('autoplay', false);


    // 当前所在滑块的 index
    this.$property('current', 0);


    // 自动切换时间间隔
    this.$property('interval', 5000);


    // 滑动动画时长
    this.$property('duration', 500);


    // 是否采用衔接滑动
    this.$property('circular', 500);


    // 滑动方向是否为纵向
    this.$property('vertical', false);


    // 前边距, 可用于露出前一项的一小部分, 接受px和rem值
    this.$property('before', '');


    // 后边距, 可用于露出后一项的一小部分, 接受px和rem值
    this.$property('after', '');



    this.__on_change = function (event) {

        this.current = event.current;
    }



}, function Swiper() {

    yaxi.Panel.apply(this, arguments);

}).register("Swiper");




yaxi.Tab = yaxi.Panel.extend(function (Class, base) {



    this.subtype = yaxi.IconButton;



    // 线条(目前只支持top及bottom)
    this.$property('line', 'bottom', {

        class: 'yx-tab-'
    });
    

    // 容器宿主
    this.$property('host', '', {

        change: false
    });



    // 获取或设置当前页索引
    this.$property('selectedIndex', -1, {

        change: false,

        alias: 'selected-index',

        convert: function (value) {

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

    });



    // 选中的页头
    this.$property('selectedItem', null, {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.children[index] || null;
        }
    });


    // 选中的页签容器
    this.$property('selectedHost', null, {

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


    this.$property('format', null, {
    
        change: false,

        convert: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    });


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


    this.$property('maxlength', 0);


    this.$property('pattern', '');


    this.$property('format', null, {
    
        change: false,

        convert: function (value) {

            this.__format = typeof value === 'function' ? value : yaxi.pipe.compile(value);
            return value;
        }
        
    });


}, function TextBox() {

    yaxi.Control.apply(this, arguments);
    
}).register('TextBox');




yaxi.CheckBox = yaxi.Control.extend(function (Class, base) {


    this.$property('text', '');
    

    this.$property('checked', false);


    this.$property('checkedIcon', 'icon-yaxi-checkbox-checked', {
        
        alias: 'checked-icon'
    });


    this.$property('uncheckedIcon', 'icon-yaxi-checkbox-unchecked', {
        
        alias: 'unchecked-icon'
    });

    
}, function CheckBox() {

    yaxi.Control.apply(this, arguments);

}).register('CheckBox');




yaxi.NumberBox = yaxi.TextBox.extend(function () {


    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', 0, {
    
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
    this.$property('min', -Infinity, {

        change: false
    });


    // 最大值
    this.$property('max', Infinity, {

        change: false
    });


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


    this.$property('checkedIcon', 'icon-yaxi-radio-checked', {

        alias: 'checked-icon'
    });


    this.$property('uncheckedIcon', 'icon-yaxi-radio-unchecked', {

        alias: 'unchecked-icon'
    });


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
    
    

    yaxi.platform = 'wx';



    yaxi.wx = Object.create(null);


    yaxi.wx.init = function (wxPage, wxPagesName) {


        var create = Object.create;

        var update = yaxi.__notify_update;


        yaxi.on('yaxi-page-change', function (event) {

            var index = event.index;
            var page = event.page;
            var open = event.open;
            var data = create(null);

            open && update(true);

            event.page = null;
            data[wxPagesName + '[' + index + ']'] = open ? page.render() : null;

            console.log(data);

            wxPage.setData(data, function () {

                page[event.callback](index);
                open && update(false);
            });
        });


        yaxi.on('yaxi-page-patch', function (event) {

            var patches = event.payload;
            var data = create(null);
            var index = 0;
            var control;

            event.payload = null;

            update(true);

            while (control = patches[index++])
            {
                control.patch(data, wxPagesName + '[' + control.index() + ']');
            }

            console.log(data);
            
            wxPage.setData(data, function () {

                update(false);
            });
        });

    }


    // 获取系统信息
    yaxi.getSystemInfo = function (callback) {

        callback && wx.getSystemInfo({

            success: function (res) {
                
                callback(res);
            }
        });
    }


})(yaxi);





;(function (wx) {



    var create = Object.create;


    var Event = yaxi.Event;

    
    var controls = yaxi.$controls;

    var translates = create(null);

    var state = create(null);

    var uuid, key;



    wx.translateEvent = function (event) {

        var any;

        uuid = this.__event_id;
        key = this.__event_key;

        if (any = translates[event.type])
        {
            any(event);
        }
        else
        {
            event = new Event(event.type);

            event.target = any = controls[uuid];
            event.key = key;

            any.trigger(event);
        }

    }.bind(wx);
    
    
    
    function touchEvent(event, touch) {
    
        var e = new Event(event.type);
    
        touch = touch || event.changedTouches[0];
    
        e.key = key;
        e.state = state;
        e.touches = event.changedTouches;
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        e.distanceX = e.clientX - state.clientX;
        e.distanceY = e.clientY - state.clientY;
    
        return e;
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
    
    
    
    translates.touchstart = function (event) {
            
        var control = controls[uuid],
            touch = event.changedTouches[0];

        state.time = new Date();
        state.control = control;
        state.clientX = touch.clientX;
        state.clientY = touch.clientY;

        if (!touch)
        {
            console.log(event)
        }

        event = touchEvent(event, touch);
        event.target = control;

        if (call(control, '__on_touchstart', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }
    
    
    translates.touchmove = function (event) {
        
        var control;
    
        if (control = state.control)
        {
            event = touchEvent(event);
            event.target = control;
    
            if (call(control, '__on_touchmove', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }
    
    
    translates.touchend = function (event) {
        
        var control;
    
        if (control = state.control)
        {
            event = touchEvent(event);
            event.target = control;

            state.control = null;
    
            if (call(control, '__on_touchend', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }
    
    
    translates.touchcancel = function (event) {
        
        var control;
    
        if (control = state.control)
        {
            event = touchEvent(event);
            event.target = control;

            state.control = null;
    
            if (call(control, '__on_touchcancel', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }


    translates.tap = function (event) {

        var control = controls[uuid],
            touch = event.changedTouches[0];

        event = touchEvent(event, touch);
        event.target = control;

        if (call(control, '__on_tap', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }


    translates.longpress = function (event) {

        var control = controls[uuid],
            touch = event.changedTouches[0];

        event = touchEvent(event, touch);
        event.target = control;

        if (call(control, '__on_longpress', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }



    translates.change = function (event) {

        var control = controls[uuid];
        var current = event.detail.current;

        event = new Event(event.type);
        event.target = control;
        event.key = key;
        event.current = current;

        if (call(control, '__on_change', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }

    

})(yaxi.wx);





yaxi.Control.mixin(function (mixin) {



    var create = Object.create;

    var assign = Object.assign;

    var owner = Object.getOwnPropertyNames; 


    var color = yaxi.color;




    // 全局渲染
    this.render = function () {

        var mixin = this.$mixin;
        var storage = this.$storage;
        var converts = this.$converts;
        var view = create(null);
        var value, fn;

        this.__dirty = false;

        view.t = this.typeName;
        view.u = this.uuid;

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view, '');
        }

        if (this.__style_dirty)
        {
            this.__style_dirty = false;
            this.__render_style(view, '');
        }

        if (value = this.__changes)
        {
            this.__changes = null;
            assign(storage, value);
        }

        var names = owner(storage);

        for (var i = 0, l = names.length; i < l; i++)
        {
            var name = names[i];

            // 配置了处理变更的属性才处理
            if ((value = converts[name]) && value.change)
            {
                if (fn = mixin[name])
                {
                    fn.call(this, view, '', storage[name]);
                }
                else if (fn !== false) // 自定义渲染为false不做任何处理
                {
                    view[name] = storage[name];
                }
            }
        }

        mixin.onrender.call(this, view, '');

        return view;
    }


    // 增量渲染
    this.patch = function (view, prefix) {

        var changes;

        this.__dirty = false;

        prefix += '.';

        if (this.__class_dirty)
        {
            this.__class_dirty = false;
            this.__render_class(view, prefix);
        }

        if (this.__style_dirty)
        {
            this.__style_dirty = false;
            this.__render_style(view, prefix);
        }
    
        if (changes = this.__changes)
        {
            var storage = this.$storage;
            var mixin = this.$mixin; 
            var value, fn;

            this.__changes = null;

            for (var name in changes)
            {
                value = storage[name] = changes[name];

                if (fn = mixin[name])
                {
                    fn.call(this, view, prefix, value);
                }
                else if (fn !== false) // 自定义渲染为false不做任何处理
                {
                    view[prefix + name] = value;
                }
            }

            mixin.onrender.call(this, view, prefix);
        }
    }




    this.__render_class = function (view, prefix) {

        var class1 = this.__class_list;
        var class2 = this.__class_data;

        class1 = class1 ? ' ' + class1.join(' ') : '';
        class2 = class2 ? ' ' + class2.join(' ') : '';

        view[prefix + 'class'] = this.$class + class1 + class2;
    }



    this.__render_style = function (view, prefix) {

        var style = this.__style;

        if (style && (style = style.join('')))
        {
            // 把默认的rem改成rpx, 系统规定1rem = 1rpx
            style = style.replace(/rem/g, 'rpx');

            // 替换颜色值
            style = style.replace(/@([\w-]+)/g, function (_, key) {

                return color[key];
            });;
        }

        view[prefix + 'style'] = style || '';
    }



    mixin.onrender = function (view, prefix) {
    }

    

});




yaxi.ContentControl.mixin(function (mixin, base) {



    function renderContent(self, content) {

        self.__content_dirty = false;

        if (typeof content === 'string')
        {
            return [{
                t: 'Text',
                u: self.__uuid,
                text: content
            }];
        }

        var length = content.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = content[i].render();
        }

        return list;
    }


    this.render = function () {

        var view = base.render.call(this);
        var content = this.__content;

        if (content == null)
        {
            content = this.__no_content;
        }

        if (content)
        {
            view.content = renderContent(this, content);
        }
        else
        {
            delete view.content;
        }
        
        return view;
    }


    this.patch = function (view, prefix) {

        base.patch.call(this, view, prefix);

        if (this.__content_dirty)
        {
            view[prefix + 'content'] = renderContent(this, this.__content || '');
        }
        else
        {
            delete view.content;
        }
    }



});




yaxi.Panel.mixin(function (mixin, base) {



    this.render = function () {

        var view = base.render.call(this);
        var children = this.__children;
        var length = children.length;
        
        children.__last = null;

        if (length > 0)
        {
            var list = new Array(length);

            for (var i = 0; i < length; i++)
            {
                list[i] = children[i].render();
            }

            view.c = list;
        }
        else
        {
            delete view.c;
        }

        return view;
    }


    this.patch = function (view, prefix) {

        var children = this.__children;
        var last;

        base.patch.call(this, view, prefix);

        if (last = children.__last)
        {
            children.__last = null;

            if (children.length < last.length)
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

        prefix += '.c[';

        for (var i = 0, l = children.length; i < l; i++)
        {
            if ((item = children[i]) && item.__dirty)
            {
                item.patch(view, prefix + i + ']');
            }
        }
    }


    function patchRemoved(children, view, prefix) {

        var length = children.length;
        var list = new Array(length);

        for (var i = 0; i < length; i++)
        {
            list[i] = children[i].render();
        }

        view[prefix + '.c'] = view.children = list;
    }


    function patchChanged(children, last, view, prefix) {

        var length = children.length;
        var item;

        prefix += '.c[';

        for (var i = 0; i < length; i++)
        {
            if ((item = children[i]) !== last[i])
            {
                view[prefix + i + ']'] = item.render();
            }
            else if (item.__dirty)
            {
                item.patch(view, prefix + i + ']');
            }
        }
    }


});




yaxi.Repeater.mixin(function (mixin, base) {



    var panel = yaxi.Panel.prototype;




    this.render = panel.render;


    this.patch = panel.patch;



});



yaxi.Tab.mixin(function (mixin, base) {



});




yaxi.Header.mixin(function (mixin, base) {



    mixin.onrender = function (view, prefix) {

        var root = this.root;
        view[prefix + 'back'] = root.index && root.index() > 0;
    }



});