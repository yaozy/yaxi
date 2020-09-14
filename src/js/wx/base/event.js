;(function (wx) {



    var create = Object.create;


    var Event = yaxi.Event;

    
    var controls = yaxi.$controls;

    var translates = create(null);


    var state = create(null);

    var touchControl, uuid, flag;



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
            controls[uuid].trigger(event);
        }

    }.bind(wx);
    


    function findControl() {

        var control = controls[uuid];
        return control ? control.findEventTarget() : null;
    }
    
    
    function touchEvent(event, touch) {
    
        var e = new Event(event.type);
    
        touch || (touch = event.changedTouches[0]);
    
        e.flag = flag;
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
            
        var control = findControl();
        var touch = event.changedTouches[0];

        if (control && touch)
        {
            // 修复自定义组件不支持active的问题
            control.__change_active(true);

            touchControl = control;

            state.time = new Date();
            state.clientX = touch.clientX;
            state.clientY = touch.clientY;

            event = touchEvent(event, touch);
            event.target = control;

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
    
        if (control = touchControl)
        {
            touchControl = null;
    
            event = touchEvent(event);
            event.target = control;

            control.__change_active(false);

            if (call(control, '__on_touchend', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }
    
    
    translates.touchcancel = function (event) {
        
        var control;
    
        if (control = touchControl)
        {
            touchControl = null;

            event = touchEvent(event);
            event.target = control;

            control.__change_active(false);

            if (call(control, '__on_touchcancel', event) === false || 
                control.trigger(event) === false)
            {
                return false;
            }
        }
    }


    translates.tap = function (event) {

        var control = findControl();
        var touch = event.changedTouches[0];

        event = touchEvent(event, touch);
        event.target = control;

        if (call(control, '__on_tap', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }


    translates.longpress = function (event) {

        var control = findControl();
        var touch = event.changedTouches[0];

        event = touchEvent(event, touch);
        event.target = control;

        if (call(control, '__on_longpress', event) === false || 
            control.trigger(event) === false)
        {
            return false;
        }
    }



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

    

})(yaxi.wx);

