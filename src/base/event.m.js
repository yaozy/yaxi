(function () {



    // 标记当前设备为移动设备(仅使用触摸事件)
    yaxi.device = 'mobile';



    var Event = yaxi.Event;

	
	var stack = yaxi.__layer_stack = [];

    
    // 滑动事件按下时的状态
    var state = Object.create(null);


    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();


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

    

    function touchEvent(event, touch) {

        var e = new Event(event.type);

        touch = touch || event.changedTouches[0];

        e.dom = event.target;
        e.state = state;
        e.domEvent = event;
        e.touches = event.changedTouches;
        e.clientX = touch.clientX << 1;
        e.clientY = touch.clientY << 1;
        e.distanceX = e.clientX - state.clientX;
        e.distanceY = e.clientY - state.clientY;

        return e;
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


    function endEdit() {

        var dom = document.activeElement;

        if (dom && dom !== document.body)
        {
            dom.blur();
        }
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


    function trigger(control, name, event) {

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



	bind('touchstart', function (event) {
		
        var control;

        if ((control = stack[0]) && closeLayer(stack[stack.length - 1], event.target))
        {
            event.stopPropagation();
            return false;
        }
    
        if (control = findControl(event.target))
        {
            var touch = event.changedTouches[0];

            state.tap = state.longTap = true;

            state.dom = event.target;
            state.control = control;
            state.clientX = touch.clientX << 1;
            state.clientY = touch.clientY << 1;

            event = touchEvent(event, touch);

            if (trigger(control, '__on_touchstart', event) === false)
            {
                return state.tap = false;
            }

            if (control.trigger(event) === false)
            {
                return state.tap = false;
            }
        }
        
	}, true);


	bind('touchmove', function (event) {
        
        var control;

        if (control = state.control)
        {
            event = touchEvent(event);

            if (trigger(control, '__on_touchmove', event) === false)
            {
                return false;
            }

            if (control.trigger(event) === false)
            {
                return state.tap = false;
            }

            if (state.tap)
            {
                var x = event.distanceX,
                    y = event.distanceY;

                // 如果移动了指定
                if (x < -8 || x > 8 || y < -8 || y > 8)
                {
                    state.tap = false;
                }
            }
        }

	}, true);


	bind('touchend', function (event) {
        
        var control = state.control,
            time;

        state.control = null;

        if (control)
        {
            event = touchEvent(event);

            if (trigger(control, '__on_touchend', event) === false)
            {
                return false;
            }

            if (control.trigger(event) === false)
            {
                return false;
            }

            // 500ms内不重复触发tap事件
            if (state.tap && (((time = new Date()) - tapTime > 500) || tapControl !== control))
            {
                tapControl = control;
                tapTime = time;

                event.type = 'tap';
                event.endEdit = endEdit;

                if (trigger(control, '__on_tap', event) === false)
                {
                    return false;
                }
                
                return control.trigger(event) === false;
            }
        }

	}, true);


	bind('touchcancel', function (event) {
        
        var control;

        if (control = state.control)
        {
            if (trigger(control, '__on_touchcancel', event) === false)
            {
                return false;
            }

            state.control = null;
            return control.trigger(touchEvent(event));
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
                fn.call(control, event);
            }

            e = new Event('change');
            e.dom = event.target;
            e.value = e.dom.value;

            return control.trigger(e);
        }

    }, true);



    
    bind('keydown', handler, true);

    bind('keypress', handler, true);

    bind('keyup', handler, true);



    bind('blur', handler, true);

    bind('focus', function (event) {
     
        var target = event.target,
            control,
            e;

        // 页面刚打开时禁止自动弹出键盘
        if ((control = yaxi.Page.current) && (new Date() - control.openTime) < 200)
        {
            target.blur();
            return;
        }

        if (control = findControl(target))
        {
            e = new Event('focus');
            e.dom = event.target;
            e.domEvent = event;

            return control.trigger(e);
        }
        
    }, true);

    

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

            return control.trigger(e);
        }

    }, true);


    
    window.addEventListener('resize', function () {

        var dom = document.activeElement;

        // 打开输入法时把焦点控件移动可视区
        if (dom && this.innerHeight / this.innerWidth < 1.2)
        {
            dom.scrollIntoViewIfNeeded();
        }
    });



})();
