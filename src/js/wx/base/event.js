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
    var touchControl, touchTime, touchFlag, touches;

    


    wx.translateEvent = function (event) {

        var control, any;

        if (any = translates[event.type])
        {
            any(event);
        }
        else if (any !== false && (any = event.target.dataset) &&
            (control = any.id) && (control = findControl(control)))
        {
            event = new Event(event.type, event.detail);
            event.flag = any.flag;

            control.trigger(event);
        }

    }.bind(wx);
    


    function findControl(uuid) {

        var control = controls[uuid];
        return control ? control.findEventTarget() : null;
    }
    
    
    function touchEvent(event) {
    
        var e = new Event(event.type);
    
        e.target = touchControl;
        e.flag = touchFlag;
        e.changedTouches = event.changedTouches;
        e.touches = event.touches;
    
        return e;
    }
    
    
    function touchendEvent(event) {

        var touch1 = event.changedTouches;
        var touch2 = touches;
        var e = touchEvent(event);

        if (touch1 && (touch1 = touch1[0]) && touch2 && (touch2 = touch2[0]))
        {
            var x = touch2.clientX - touch1.clientX;
            var y = touch2.clientY - touch1.clientY;

            e.distanceX = x;
            e.distanceY = y;
            e.move = x < -10 || x > 10 || y < -10 || y > 10;
        }

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
            
        var control, dataset;

        // 阻止冒泡事件(触摸没有弹起时不处理)
        if (touchControl)
        {
            return;
        }

        dataset = event.target.dataset;

        if (control = findControl(dataset.id))
        {
            touchControl = control;
            touchFlag = dataset.flag;
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
            event = touchEvent(event);

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
            event = touchendEvent(event);
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



    translates.input = translates.change = function (event) {

        var dataset = event.target.dataset;
        var control, detail;

        if (control = findControl(dataset.id))
        {
            detail = event.detail;

            event = new Event(event.type);
            event.target = control;
            event.flag = dataset.flag;

            if (detail)
            {
                event.value = detail.value || detail.current;
            }

            return control.trigger(event);
        }
    }

    

})(yaxi.wx);

