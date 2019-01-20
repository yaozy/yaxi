(function () {



    // 标记当前设备为移动设备(以鼠标事件为主)
    yaxi.device = 'pc';



    var Event = yaxi.Event;

	
	var stack = yaxi.__layer_stack = [];

    
    // 鼠标事件按下时的状态
    var state = Object.create(null);


    var bind = document.addEventListener.bind(document);




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
    

    function closeLayer(layer, dom) {

        var host = layer.$dom;

        while (dom)
        {
            if (dom === host)
            {
                return false;
            }

            dom = dom.parentNode;
        }

        layer.close();
        return true;
    }


    function mouseEvent(event) {

        var e = new Event(event.type);

        e.dom = event.target;
        e.state = state;
        e.domEvent = event;
        e.clientX = event.clientX << 1;
        e.clientY = event.clientY << 1;
        e.distanceX = e.clientX - state.clientX;
        e.distanceY = e.clientY - state.clientY;

        return e;
    }

    
    function handler(event) {

        var control, e;

        if (control = findControl(event.target))
        {
            e = new Event(event.type);
            e.dom = event.target;
            e.domEvent = event;

            return control.trigger(e);
        }
    }



	bind('mousedown', function (event) {
		
        var control;

        if ((control = stack[0]) && closeLayer(stack[stack.length - 1], event.target))
        {
            event.stopPropagation();
            return false;
        }
    
        if (control = findControl(event.target))
        {
            state.mousedown = state.tap = true;
            state.dom = event.target;
            state.control = control;
            state.clientX = event.clientX << 1;
            state.clientY = event.clientY << 1;

            event = mouseEvent(event);

            if ((fn = control.__on_touchstart) && fn.call(control, event) === false)
            {
                return state.tap = false;
            }

            if (control.trigger(event) === false)
            {
                return stat.tap = false;
            }
        }
        
	}, true);


	bind('mousemove', function (event) {
        
        var control;

        if (control = state.control)
        {
            event = mouseEvent(event);

            if (state.mousedown && (fn = control.__on_touchmove) && fn.call(control, event) === false)
            {
                return false;
            }

            return control.trigger(event);
        }

	}, true);

    
	bind('mouseup', function (event) {
        
        var control;

        if (control = state.control)
        {
            state.mousedown = false;    
            event = mouseEvent(event);

            if ((fn = control.__on_touchend) && fn.call(control, event) === false)
            {
                return false;
            }

            return control.trigger(event);
        }

    }, true);
    
    
	bind('click', function (event) {
        
        var control, fn;

        if (state.tap && (control = state.control))
        {
            if ((fn = control.__on_tap) && fn.call(control, event) === false)
            {
                return false;
            }

            event = mouseEvent(event);

            if (control.trigger(event) === false)
            {
                return false;
            }

            // 兼容tap事件
            event.type = 'tap';
            return control.trigger(event);
        }

    }, true);
    

    bind('dblclick', function (event) {
        
        var control;

        if (state.tap && (control = state.control))
        {
            return control.trigger(mouseEvent(event));
        }

    }, true);




    bind('input', function (event) {

        var control, e;

        if (control = findControl(event.target))
        {
            e = new Event('input');
            e.dom = event.target;
            e.domEvent = event;
            e.value = e.dom.value;

            return control.trigger(e);
        }

    }, true);


    bind('change', function (event) {

        var control, fn, e;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_change)
            {
                fn.call(control, event.target);
            }

            e = new Event('change');
            e.dom = event.target;
            e.domEvent = event;
            e.value = e.dom.value;

            return control.trigger(e);
        }

    }, true);



    
    bind('keydown', handler, true);

    bind('keypress', handler, true);

    bind('keyup', handler, true);



    bind('blur', handler, true);

    bind('focus', handler, true);

    

    bind('scroll', function (event) {

        var control, fn, e;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_scroll)
            {
                fn.call(control, event.target);
            }

            e = new Event('scroll');
            e.dom = event.target;
            e.domEvent = event;

            return control.trigger(e);
        }

    }, true);



})();
