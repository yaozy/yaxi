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



    var cache_uuid, cache_flag;
    


    wx.translateEvent = function (event, uuid, flag) {

        var any;
console.log(uuid, flag)
        if (uuid)
        {
            cache_uuid = uuid;
            cache_flag = flag = flag || '';
        }
        else
        {
            any = event.target.dataset;

            if (uuid = any.id)
            {
                flag = any.flag;
            }
            else
            {
                uuid = cache_uuid;
                flag = cache_flag;
            }
        }

        if (any = translates[event.type])
        {
            any(event, uuid, flag);
        }
        else if (any !== false && (any = controls[uuid]))
        {
            event = new Event(event.type, event.detail);
            event.flag = flag;

            return any.trigger(event);
        }

    }.bind(wx);
    


    function findControl(uuid) {

        var control = controls[uuid];
        return control ? control.findEventTarget() : null;
    }
    
    
    function touchEvent(event, control, flag) {
    
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
    
    
    
    translates.touchstart = function (event, uuid, flag) {
            
        var control;

        if (control = findControl(uuid))
        {
            event = touchEvent(event, touchControl = control, flag);

            touchControl = control;
            touchTime = new Date();
            
            tap = true;

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
            event = touchEvent(event, control, cache_flag);

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
            event = touchEvent(event, control, cache_flag);
            touchControl = null;

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
            event = touchEvent(event, control, cache_flag);
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



    translates.input = translates.change = function (event, uuid, flag) {

        var control;

        if (control = findControl(uuid))
        {
            event = new Event(event.type, event.detail);
            event.target = control;
            event.flag = flag;

            return control.trigger(event);
        }
    }

    

})(yaxi.wx);

