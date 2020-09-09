;(function (wx) {



    var create = Object.create;


    var Event = yaxi.Event;

    
    var controls = yaxi.$controls;

    var translates = create(null);

    var state = create(null);

    var uuid, key;



    wx.translateEvent = function (event) {

        var fn;

        if (fn = translates[event.type])
        {
            uuid = this.__event_id;
            key = this.__event_key;

            fn(event);
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

    

})(yaxi.wx);

