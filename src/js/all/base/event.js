
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
