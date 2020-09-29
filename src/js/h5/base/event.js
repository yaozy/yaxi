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

    
    var bind = host.addEventListener.bind(host);



    // 是否检查点击
    var tap = false;

    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();

    // 开始触摸时的控件及时间
    var touchControl, touchTime, touches;
    
    // dom标记
    var flag;




    function findControl(view) {

        var control, uuid, f;

        while (view)
        {
            f || (f = view.getAttribute('flag'));

            if ((uuid = view.id) && (control = controls[uuid]))
            {
                flag = f || '';
                return control.disabled ? control.parent || null : control;
            }

            view = view.parentNode;
        }

        return null;
    }

    

    function touchEvent(event) {

        var e = new Event(event.type);

        e.target = touchControl;
        e.flag = flag;
        e.changedTouches = parseTouches(event.changedTouches);
        e.touches = parseTouches(event.touches);

        return e;
    }


    function touchendEvent(event) {

        var touch1 = touches;
        var touch2 = event.changedTouches;
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


    function parseTouches(touches) {

        var index = touches.length;
        var list = new Array(index);

        while (index--)
        {
            var touch = touches[index];

            // 微信小程序只支持以下touch属性
            list[index] = {
                identifier: touch.identifier,
                pageX: touch.pageX,
                pageY: touch.pageY,
                clientX: touch.clientX,
                clientY: touch.clientY 
            }
        }

        return list;
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


    
	bind('touchstart', function (event) {
		
        var control;

        if (control = findControl(event.target))
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

	}, true);


	bind('touchmove', function (event) {
        
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

        if (yaxi.h5.weixin)
        {
            return false;
        }

	}, true);


	bind('touchend', function (event) {
        
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

	}, true);


	bind('touchcancel', function (event) {
        
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

    }, true);



    bind('input', function (event) {

        var control, fn, value;

        if (control = findControl(event.target))
        {
            value = event.target.value;

            if ((fn = control.__on_input) && fn.call(control, value) === false)
            {
                return false;
            }

            event = new Event('input');
            event.flag = flag;
            event.value = value;

            return control.trigger(event);
        }

    }, true);


    bind('change', function (event) {

        var control, fn, value;

        if (control = findControl(event.target))
        {
            value = event.target.value;

            if ((fn = control.__on_change) && fn.call(control, value) === false)
            {
                return false;
            }

            event = new Event('change');
            event.flag = flag;
            event.value = value;

            return control.trigger(event);
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
