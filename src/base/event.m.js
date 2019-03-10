(function () {



    var host = yaxi.__dom_host = document.createElement('div');

    // 是否放大一倍
    var scale = yaxi.scale = 0

    // 是否在微信浏览器中打开
    var weixin = navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0;


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
	
	
	// 在微信中打开时(微信自动排版会打乱网页布局)
	if (weixin)
	{
        // 1rem = 100px
		document.documentElement.style.fontSize = (yaxi.rem = 100) + 'px';
	}
	else
	{
		// 处理rem自适应
		// 字体放大两倍, 然后设置页面为2倍屏幕宽度再缩小一半解决无法渲染1px像素问题
		document.documentElement.style.fontSize = (yaxi.rem = (window.innerWidth * 2 * 10000 / 375 | 0) / 100) + 'px';
        host.style.cssText = 'width:200%;height:200%;transform-origin: 0 0;transform: scale(.5, .5);';
        
        yaxi.scale = scale = 1
	}



    var Event = yaxi.Event;

	
	var stack = yaxi.__layer_stack = [];

    
    // 滑动事件按下时的状态
    var state = Object.create(null);


    // 上次tap事件触发时的控件
    var tapControl = null;

    // 上次tap事件触发时的时间
    var tapTime = new Date();


    var bind = host.addEventListener.bind(host);




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
        e.clientX = touch.clientX << scale;
        e.clientY = touch.clientY << scale;
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


    function stop(event) {
      
        event.stopPropagation();
        event.preventDefault();

        return false;
    }



	bind('touchstart', function (event) {
		
        var control;

        yaxi.pressdown = true;

        if ((control = stack[0]) && closeLayer(stack[stack.length - 1], event.target))
        {
            return stop(event);
        }
    
        if (control = findControl(event.target))
        {
            var touch = event.changedTouches[0],
                e = touchEvent(event, touch);

            state.tap = state.longTap = true;

            state.dom = event.target;
            state.control = control;
            state.clientX = touch.clientX << scale;
            state.clientY = touch.clientY << scale;

            if (trigger(control, '__on_touchstart', e) === false || control.trigger(e) === false)
            {
                return state.tap = stop(event);
            }
        }

	}, true);


	bind('touchmove', function (event) {
        
        var control;

        if (control = state.control)
        {
            var e = touchEvent(event),
                x,
                y;

            if (trigger(control, '__on_touchmove', e) === false)
            {
                return stop(event);
            }

            if (control.trigger(e) === false)
            {
                return state.tap = stop(event);
            }
            
            if (state.tap)
            {
                x = e.distanceX;
                y = e.distanceY;

                // 如果移动了指定
                if (x < -8 || x > 8 || y < -8 || y > 8)
                {
                    state.tap = false;
                }
            }
        }

        if (weixin)
        {
            // return stop(event);
        }

	}, true);


	bind('touchend', function (event) {
        
        var control, time;

        yaxi.pressdown = false;

        if (control = state.control)
        {
            var e = touchEvent(event);

            state.control = null;

            if (trigger(control, '__on_touchend', e) === false || control.trigger(e) === false)
            {
                return stop(event);
            }

            // 500ms内不重复触发tap事件
            if (state.tap && (((time = new Date()) - tapTime > 500) || tapControl !== control))
            {
                tapControl = control;
                tapTime = time;

                e.type = 'tap';
                e.endEdit = endEdit;

                if (trigger(control, '__on_tap', e) === false || control.trigger(e) === false)
                {
                    return stop(event);
                }
            }
        }

	}, true);


	bind('touchcancel', function (event) {
        
        var control;

        yaxi.pressdown = false;

        if (control = state.control)
        {
            var e = touchEvent(event);

            state.control = null;

            if (trigger(control, '__on_touchcancel', e) === false || control.trigger(e) === false)
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
