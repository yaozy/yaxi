;(function (yaxi) {



    var host = yaxi.__view_host = document.createElement('div');


	host.className = 'yx-host';

    if (document.body)
    {
        document.body.appendChild(host);
    }
    else
    {
        document.addEventListener('DOMContentLoaded', function () {

            document.body.appendChild(host);
        });
	}
	
	
    // 处理rem自适应
    document.documentElement.style.fontSize = (yaxi.rem = (window.innerWidth * 10000 / 750 | 0) / 10000) + 'px';
    host.style.cssText = 'width:100%;height:100%;transform-origin: 0 0;';



    var controls = yaxi.$controls;


    var Event = yaxi.Event;

    
    // 滑动事件按下时的状态
    var state = Object.create(null);


    // 是否检查点击
    var tap = false;

    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();


    var bind = host.addEventListener.bind(host);


    var touchControl, flag;




    function findControl(view) {

        var control, uuid, f;

        while (view)
        {
            f || (f = view.getAttribute('flag'));

            if ((uuid = view.$uuid) && (control = controls[uuid]))
            {
                flag = f || '';
                return control.findEventTarget();
            }

            view = view.parentNode;
        }
    }

    

    function touchEvent(event, touch) {

        var e = new Event(event.type);

        touch = touch || event.changedTouches[0];

        e.flag = flag;
        e.state = state;
        e.touches = event.changedTouches;
        e.clientX = touch.clientX;
        e.clientY = touch.clientY;
        e.distanceX = e.clientX - state.clientX;
        e.distanceY = e.clientY - state.clientY;

        return e;
    }


    
    function handler(event) {

        var control;

        if (control = findControl(event.target))
        {
            event = new Event(event.type);
            event.flag = flag;

            return control.trigger(event);
        }
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


    function stop(event) {
      
        event.stopPropagation();
        event.preventDefault();

        return false;
    }


    
	bind('touchstart', function (event) {
		
        var control;

        if (control = findControl(event.target))
        {
            var touch = event.changedTouches[0];
            var e = touchEvent(event, touch);

            control.__change_active(true);
            touchControl = control;
            tap = true;

            state.time = new Date();
            state.clientX = touch.clientX;
            state.clientY = touch.clientY;

            if (call(control, '__on_touchstart', e) === false || control.trigger(e) === false)
            {
                return tap = stop(event);
            }
        }

	}, true);


	bind('touchmove', function (event) {
        
        var control;

        if (control = touchControl)
        {
            var e = touchEvent(event);
            var x, y;

            if (call(control, '__on_touchmove', e) === false)
            {
                return stop(event);
            }

            if (control.trigger(e) === false)
            {
                return tap = stop(event);
            }
            
            if (tap)
            {
                x = e.distanceX;
                y = e.distanceY;

                // 如果移动了指定距离
                if (x < -8 || x > 8 || y < -8 || y > 8)
                {
                    tap = false;
                }
            }
        }

        if (yaxi.h5.weixin)
        {
            return stop(event);
        }

	}, true);


	bind('touchend', function (event) {
        
        var control, time;

        if (control = touchControl)
        {
            var e = touchEvent(event);

            touchControl = null;
            control.__change_active(false);

            if (call(control, '__on_touchend', e) === false || control.trigger(e) === false)
            {
                return stop(event);
            }

            // 按下大于350毫秒则触发longpress事件
            if ((time = new Date()) - state.time > 350)
            {
                e.type = 'longpress';

                if (control.trigger(e) === false)
                {
                    return stop(event);
                }
            }
            // 350ms内不重复触发tap事件
            else if (tap && (time - tapTime > 350 || tapControl !== control))
            {
                tapControl = control;
                tapTime = time;

                e.type = 'tap';
 
                if (call(control, '__on_tap', e) === false || control.trigger(e) === false)
                {
                    return stop(event);
                }
            }
        }

	}, true);


	bind('touchcancel', function (event) {
        
        var control;

        if (control = touchControl)
        {
            var e = touchEvent(event);

            touchControl = null;
            control.__change_active(false);

            if (call(control, '__on_touchcancel', e) === false || control.trigger(e) === false)
            {
                return stop(event);
            }
        }

    }, true);



    bind('input', function (event) {

        var control, e;

        if (control = findControl(event.target))
        {
            if ((fn = control.__on_input) && fn.call(control, event) === false)
            {
                return false;
            }

            e = new Event('input');
            e.flag = flag;
            e.value = event.target.value;

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
            e.flag = flag;
            e.value = event.target.value;

            return control.trigger(e);
        }

    }, true);



    
    bind('keydown', handler, true);

    bind('keypress', handler, true);

    bind('keyup', handler, true);



    bind('blur', handler, true);

    bind('focus', function (event) {
     
        var control;

        if (control = findControl(event.target))
        {
            event = new Event('focus');
            event.flag = false;

            return control.trigger(event);
        }
        
    }, true);

    

    bind('scroll', function (event) {

        var control, fn;

        if (control = findControl(event.target))
        {
            if (fn = control.__on_scroll)
            {
                fn.call(control, event.target);
            }

            event = new Event('scroll');
            event.flag = false;

            return control.trigger(event);
        }

    }, true);


    
    window.addEventListener('resize', function () {

        var view = document.activeElement;

        // 打开输入法时把焦点控件移动可视区
        if (view && this.innerHeight / this.innerWidth < 1.2)
        {
            view.scrollIntoViewIfNeeded();
        }
    });



})(yaxi);
