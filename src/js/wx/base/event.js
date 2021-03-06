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

