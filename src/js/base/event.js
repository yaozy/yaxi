
yaxi.Event = Object.extend(function (Class) {


    
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

    
});



yaxi.EventTarget = Object.extend(function (Class) {

    
    var Event = yaxi.Event;

    var prototype = this;

    

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
                        event = new Event();
                        event.target = this;

                        if (payload)
                        {
                            for (var name in payload)
                            {
                                event[name] = payload[name];
                            }
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



    Class.mixin = function (target) {

        target.on = prototype.on;
        target.once = prototype.once;
        target.off = prototype.off;
        target.trigger = prototype.trigger;
    }



});




(function () {



    var Event = yaxi.Event;

    
    // 滑动事件按下时的状态
    var start = Object.create(null);


    // longTap定时器
    var delay = 0;


    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();


    // 正在输入的控件
    var input;

 


    function findControl(dom) {

        var control;

        while (dom)
        {
            if (control = dom.$control)
            {
                while (control.disabled)
                {
                    control = control.parent;
                }

                return control;
            }

            dom = dom.parentNode;
        }
    }


	function longTapDelay() {
        
        var control = start.control;

        delay = 0;

        start.control = null;
        start.tap = false;

		if (control && start.longTap)
		{
            var e = new Event();

            e.type = 'longTap';
            e.dom = start.dom;

            return control.trigger(e);
        }
    }


    function cancelTap() {

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        start.tap = start.longTap = false;
    }

    

    function touchEvent(event, touch) {

        var e = new Event();

        touch = touch || event.changedTouches[0];

        e.type = event.type;
        e.dom = event.target;
        e.start = start;
        e.original = event;
        e.touches = event.changedTouches;
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        e.distanceX = (e.screenX = touch.screenX) - start.screenX;
        e.distanceY = (e.screenY = touch.screenY) - start.screenY;

        return e;
    }
    


	document.addEventListener('touchstart', function (event) {
		
        var control = findControl(event.target);

        if (control)
        {
            var touch = event.changedTouches[0];

            start.swipe = 0;
            start.tap = start.longTap = true;

            start.dom = event.target;
            start.control = control;
            start.screenX = touch.screenX;
            start.screenY = touch.screenY;

            // 提交输入
            if (input && input !== control)
            {
                input.__on_change && input.__on_change();
                input = null;
            }

            if (control.trigger(touchEvent(event, touch)) === false)
            {
                cancelTap();
                return false;
            }

            delay = setTimeout(longTapDelay, 600);
        }
        
	}, true);


	document.addEventListener('touchmove', function (event) {
        
        var control = start.control;

        if (control)
        {
            event = touchEvent(event);

            if (control.trigger(event) === false)
            {
                start.tap && cancelTap();
                return false;
            }

            if (start.tap)
            {
                var x = event.distanceX,
                    y = event.distanceY;

                // 如果移动了指定
                if (x < -8 || x > 8 || y < -8 || y > 8)
                {
                    cancelTap();
                }
            }
        }

	}, true);


	document.addEventListener('touchend', function (event) {
        
        var control = start.control,
            any;

        start.control = null;

        if (delay)
        {
			clearTimeout(delay);
		    delay = 0;
        }

        if (control)
        {
            event = touchEvent(event);

            if (control.trigger(event) === false)
            {
                return false;
            }

            // 500ms内不重复触发tap事件
            if (start.tap && (((any = new Date()) - tapTime > 500) || tapControl !== control))
            {
                tapControl = control;
                tapTime = any;

                if (any = control.__on_tap)
                {
                    any.call(control, event.dom);
                }
                
                event.type = 'tap';

                if (control.trigger(event) === false)
                {
                    return false;
                }
            }
        }

	}, true);


	document.addEventListener('touchcancel', function (event) {
        
        var control = start.control;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (control)
        {
            start.control = null;
            return control.trigger(touchEvent(event));
        }

    }, true);



    document.addEventListener('input', function (event) {

        var control = findControl(event.target);

        if (control)
        {
            var e = new Event();

            input = control;

            e.type = 'input';
            e.dom = event.dom;
            e.text = event.target.value;

            return control.trigger(e);
        }

    }, true);


    document.addEventListener('change', function () {

        var control = findControl(event.target);

        if (control)
        {
            var fn = control.__on_change;
            
            input = null;

            fn && fn.call(control);

            var e = new Event();

            e.type = 'change';
            e.dom = event.target;

            return control.trigger('change');
        }

    }, true);



    
    document.addEventListener('keydown', listener, true);

    document.addEventListener('keypress', listener, true);

    document.addEventListener('keyup', listener, true);


    document.addEventListener('focus', listener, true);

    document.addEventListener('blur', listener, true);


    document.addEventListener('scroll', listener, true);



    function listener(event) {

        var control = findControl(event.target);

        if (control)
        {
            var e = new Event();

            e.type = event.type;
            e.dom = event.target;
            e.original = event;

            return control.trigger(e);
        }
    }



})();
