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
    var touchControl, touchTime;
    
    var uuid, flag;



    wx.translateEvent = function (event) {

        var fn;

        uuid = this.__event_id;
        flag = this.__event_flag || '';

        if (fn = translates[event.type])
        {
            fn(event);
        }
        else
        {
            event = new Event(event.type);
            event.flag = flag;

            return controls[uuid].trigger(event);
        }

    }.bind(wx);
    


    function findControl() {

        var control = controls[uuid];
        return control ? control.findEventTarget() : null;
    }
    
    
    function touchEvent(event, control) {
    
        var e = new Event(event.type);
    
        e.target = control;
        e.flag = flag;
        e.changedTouches = event.changedTouches;
        e.touches = event.touches;
    
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
            
        var control = findControl();
        var touch = event.changedTouches[0];

        if (control && touch)
        {
            // 修复自定义组件不支持active的问题
            control.__change_active(true);

            touchControl = control;
            touchTime = new Date();

            tap = true;

            event = touchEvent(event, control);

            if (call(control, '__on_touchstart', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }
    
    
    translates.touchmove = function (event) {
        
        var control;
    
        if (control = touchControl)
        {
            event = touchEvent(event, control);

            if (call(control, '__on_touchmove', event) === false || 
                control.trigger(event) === false)
            {
                tap = false;
                return false;
            }
        }
    }
    
    
    translates.touchend = function (event) {
        
        var control, time;
    
        if (control = touchControl)
        {
            touchControl = null;
    
            event = touchEvent(event, control);
            control.__change_active(false);

            if (call(control, '__on_touchend', event) === false || 
                control.trigger(event) === false)
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
                console.log('tap:' , new Date().getTime())
                // 延时触发tap事件解决input先触发change事件的问题
                setTimeout(function () {

                    tapControl = control;
                    tapTime = time;
    
                    event.type = 'tap';
        
                    if (call(control, '__on_tap', event) !== false)
                    {
                        control.trigger(event) === false
                    }

                }, 0);
            }
        }
    }
    
    
    translates.touchcancel = function (event) {
        
        var control;
    
        if (control = touchControl)
        {
            touchControl = null;

            event = touchEvent(event, control);
            control.__change_active(false);

            if (call(control, '__on_touchcancel', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }


    // tap事件有延迟, 直接在touchend事件中触发
    // translates.tap = function (event) {

    //     var control = findControl();

    //     event = touchEvent(event, control);

    //     if (call(control, '__on_tap', event) === false || 
    //         control.trigger(event) === false)
    //     {
    //         return false;
    //     }
    // }


    // translates.longpress = function (event) {

    //     var control = findControl();

    //     event = touchEvent(event, control);

    //     if (call(control, '__on_longpress', event) === false || 
    //         control.trigger(event) === false)
    //     {
    //         return false;
    //     }
    // }



    translates.change = function (event) {

        var control = findControl();
        var current = event.detail.current;

        event = new Event(event.type);
        event.target = control;
        event.flag = flag;
        event.current = current;

        if (call(control, '__on_change', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }


    translates.input = translates.change = function (event) {

        var control = findControl();
        var value = event.detail.value;

        event = new Event(event.type);
        event.target = control;
        event.flag = flag;
        event.value = value;

        return control.trigger(event);
    }

    

})(yaxi.wx);

