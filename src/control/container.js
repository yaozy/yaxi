yaxi.impl.container = function (base) {



    // 查找具有指定属性值的子控件
    this.locate = function (name, value) {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            if (children[i][name] === value)
            {
                return children[i];
            }
        }
    }


    // 查找符合指定选择器的子对象
    this.query = function (selector) {

        var Query = yaxi.Query,
            outputs = new Query(),
            list = this.__children,
            tokens;

        if (list.length > 0)
        {
            if (selector && (tokens = Query.parse(selector)))
            {
                list = query([this], tokens, 0);

                if (list.length > 0)
                {
                    list.push.apply(outputs, list);
                }
            }
            else if (selector === false)
            {
                outputs.push.apply(outputs, list);
            }
            else
            {
                query_all(list, outputs);
            }
        }

        return outputs;
    }

    
    function query(inputs, tokens, index) {

        var list = [],
            i = 0,
            control;

        switch (tokens[index++])
        {
            case '<':
                while (control = inputs[i++])
                {
                    if (control = control.__find_up(tokens[index++], tokens[index++], false))
                    {
                        list.push(control);
                    }
                }
                break;

            case '<<':
                while (control = inputs[i++])
                {
                    if (control = control.__find_up(tokens[index++], tokens[index++], true))
                    {
                        list.push(control);
                    }
                }
                break;

            case '>':
                while (control = inputs[i++])
                {
                    if (control.__query)
                    {
                        control.__query(list, tokens[index++], tokens[index++], false);
                    }
                }
                break;

            case '>>':
                while (control = inputs[i++])
                {
                    if (control.__query)
                    {
                        control.__query(list, tokens[index++], tokens[index++], true);
                    }
                }
                break;
        }

        if (list.length > 0 && tokens[index])
        {
            return query(list, tokens, index);
        }

        return list;
    }


    function query_all(inputs, outputs) {

        var index = 0,
            control;

        while (control = inputs[index++])
        {
            var children = control.__children;

            outputs.push(control);

            if (children && children.length > 0)
            {
                query_all(children, outputs);
            }
        }
    }


    this.__query = function (outputs, key, value, deep) {

        var children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            if (control.__find_value(key, value))
            {
                outputs.push(control);
            }

            if (deep && control.__query)
            {
                control.__query(outputs, key, value, true);
            }
        }
    }


    this.__find_down = function (key, value, deep) {
    
        var children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            if (control.__find_value(key, value))
            {
                return control;
            }

            if (deep && control.__children && (control = control.__find_down(key, value, true)))
            {
                return control;
            }
        }
    }



    this.onmounted = function () {

        if (this.$dom)
        {
            var children = this.__children;
    
            for (var i = 0, l = children.length; i < l; i++)
            {
                children[i].onmounted();
            }
        }
    }



    // 重算布局
    this.invalidate = function () {

        var children = this.__children,
            length,
            dom,
            any;

        if ((length = children.length) > 0 && (dom = this.$dom))
        {
            if (any = layouts[this.$storage.layout])
            {
                any(children, dom, this.__gap);
            }

            for (var i = 0; i < length; i++)
            {
                if ((any = children[i]) && any.invalidate && any.$dom)
                {
                    any.invalidate();
                }
            }
        }
    }



    var layouts = Object.create(null);
    


    function computeWeight(children, size, name) {

        var total = 0,
            control,
            dom,
            style,
            weight;

        for (var i = children.length; i--;)
        {
            if ((control = children[i]) && (dom = control.$dom) && 
                (weight = control.$storage.weight) > 0 &&
                (!(style = control.__style) || style.display !== 'none'))
            {
                total += weight;
                size += dom[name];
            }
            else
            {
                weight = 0;
            }

            control.__weight = weight;
        }

        return total ? [size, total] : null;
    }

    
    function arrange(children, size, total, name) {

        var control, style, weight, value;

        for (var i = children.length; i--;)
        {
            if ((control = children[i]) && (weight = control.__weight))
            {
                value = weight * size / total + .5 | 0;
                size -= value;
                total -= weight;

                value += 'px';
                style = control.$dom.style;
                
                if (style[name] !== value)
                {
                    style[name] = value;
                }
            }
        }
    }


    layouts.row = function (children, dom) {

        var time = performance.now();

        var width = dom.clientWidth,
            last = dom.lastChild,
            size = last.offsetLeft + last.offsetWidth;

        if (width !== size && (size = computeWeight(children, width - size, 'offsetWidth')))
        {
            arrange(children, size[0], size[1], 'width');
        }

        console.log(performance.now() - time);
    }


    layouts.column = function (children, dom) {

        var height = dom.clientHeight,
            last = dom.lastChild,
            size = last.offsetTop + last.offsetHeight;

        if (height !== size && (size = computeWeight(children, height - size, 'offsetHeight')))
        {
            arrange(children, size[0], size[1], 'height');
        }
    }


    layouts['same-width'] = function (children, dom, gap) {

        var length = children.length,
            width;

        if (gap > 0)
        {
            gap = gap * length - 1;
            width = (1000000 - gap * 100 / dom.clientWidth) / length;
        }
        else
        {
            width = 1000000 / length;
        }

        width = (width | 0) / 10000 + '%';

        for (var i = 0; i < length; i++)
        {
            var style = children[i].$dom.style;

            if (style.width !== width)
            {
                style.width = width;
            }
        }
    }


    layouts['same-height'] = function (children, dom, gap) {

        var length = children.length,
            height;

        if (gap > 0)
        {
            gap = gap * length - 1;
            height = (1000000 - gap * 100 / dom.clientHeight) / length;
        }
        else
        {
            height = 1000000 / length;
        }

        for (var i = 0; i < length; i++)
        {
            var style = children[i].$dom.style;

            if (style.height !== height)
            {
                style.height = height;
            }
        }
    }



    // 窗口变化时检查布局
    window.addEventListener('resize', function () {

        yaxi.trigger('yaxi-check-layout');
        
    });



    
    var styleSheet;

    var renderer = this.renderer;



    renderer.layout = function (dom, value) {

        dom.setAttribute('layout', value);
    }


    renderer.gap = function (dom, value) {

        var style = styleSheet || document.styleSheets[0];

        // 标记布局发生了变化
        this.__layout = null;

        // 动态添加样式
        if (!style)
        {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');

            document.head.appendChild(style);
            style = styleSheet = style.sheet;
        }

        if (value && (value = value.split(' ', 2))[0])
        {
            var type = value[1] !== 'top' ? 'left' : 'top',
                key = type + ':' + (value = value[0]);

            if (!style[key])
            {
                style.addRule('[gap="' + key + '"]>*', 'margin-' + type + ': ' + value + ' !important');
                style[key] = 1;
            }
            
            this.__gap = value.indexOf('px') > 0 ? parseInt(value) : parseFloat(value) * yaxi.rem + .5 | 0;
            dom.setAttribute('gap', key);
        }
        else
        {
            this.__gap = 0;
            dom.removeAttribute('gap');
        }
    }


    renderer.full = function (dom, value) {

        if (value)
        {
            dom.setAttribute('full', value);
        }
        else
        {
            dom.removeAttribute('full');
        }
    }


    
    renderer.baseURL = function (dom, value) {

        if (value)
        {
            if (!this.__baseURL)
            {
                this.on('tap', openURL);
                this.__baseURL = value;
            }
        }
        else
        {
            this.off('tap', openURL);
        }
    }


    function openURL(event) {

        var control = event.target,
            url;

        while (control && control !== this)
        {
            if (url = control.url)
            {
                var Class = yaxi.loadModule(this.__baseURL, url),
                    args = control.args;

                if (!Class.prototype.open)
                {
                    continue;
                }

                if (args && args.length > 0)
                {
                    control = Object.create(Class.prototype);

                    Class.apply(control, args);
                    control.open();
                }
                else
                {
                    new Class().open();
                }
                
                event.stop();
                return false;
            }

            control = control.parent;
        }
    }



    this.render = function () {

        var dom = base.render.call(this),
            children = this.__children,
            index = 0,
            control;

        children.__patch = 1;

        while (control = children[index++])
        {
            dom.appendChild(control.render());
        }

        return dom;
    }


    
    this.destroy = function () {

        var any = this.__children;

        for (var i = any.length; i--;)
        {
            any[i].destroy();
        }

        if (any = this.__loading)
        {
            any.destroy();
        }

        if (any = this.__pulldown)
        {
            any.destroy();
        }

        base.destroy.call(this);
    }

}




yaxi.impl.pulldown = function () {

    
    var pulldown, loading, overflowY;



    // loading设置
    Object.defineProperty(this, 'loading', {
    
        get: function () {

            return this.__loading;
        },
        set: function (value) {

            if (value)
            {
                var loading = yaxi.Loading;

                if (typeof value === 'function')
                {
                    loading = new loading();
                    loading.onload = value;
                }
                else
                {
                    if (typeof value.onload !== 'function')
                    {
                        throw 'loading onload must be a function!'
                    }
                    
                    loading = value instanceof loading ? value : new loading(value);
                }

                loading.parent = this;

                this.__loading = loading;
                this.__on_scroll = scroll;
            }
            else
            {
                this.__on_scroll = null;
            }
        }
    });

    
    // 下拉设置
    Object.defineProperty(this, 'pulldown', {

        get: function () {

            return this.__pulldown;
        },
        set: function (value) {

            if (value)
            {
                var pulldown = yaxi.Pulldown;

                if (typeof value === 'function')
                {
                    pulldown = new pulldown();
                    pulldown.onload = value;
                }
                else
                {
                    if (typeof value.onload !== 'function')
                    {
                        throw 'pulldown onload must be a function!'
                    }

                    pulldown = value instanceof pulldown ? value : new pulldown(value);
                }

                if (!this.__pulldown)
                {
                    this.on('touchmove', touchmove);
                    this.on('touchend', touchend);
                    this.on('touchcancel', touchend);
                }

                this.__pulldown = pulldown;
            }
            else
            {
                this.off('touchmove', touchmove);
                this.off('touchend', touchend);
                this.off('touchcancel', touchend);

                this.__pulldown = null;
            }
        }
    });


    function scroll() {

        var loading;

        if (!pulldown && (loading = this.__loading) && loading.status !== 'completed')
        {
            // 延时处理以避免加载太快
            var time = new Date().getTime();

            if (time - (loading.__time || 0) < 100)
            {
                return;
            }

            var dom = this.$dom;

            if (loading.before)
            {
                if (dom.scrollTop > dom.offsetHeight)
                {
                    return;
                }
            }
            else if (dom.scrollTop + (dom.offsetHeight << 1) < dom.scrollHeight)
            {
                return;
            }

            loading.index++ || (loading.index = 1);
            loading.__time = time;
            loading.onload.call(this, loading);
        }
    }



    function touchmove(event) {

        if (pulldown)
        {
            if (pulldown.$dom)
            {
                pulldown.move(event.distanceY);

                event.stop();
                return false;
            }
            else
            {
                pulldown = null;
            }
        }

        if (this.$dom.scrollTop < 1 && (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var start = event.start,
                style = this.$dom.style;

            if (loading = this.__loading)
            {
                if (loading.shown)
                {
                    loading.status = 'loading';
                    loading.style.visibility = 'hidden';
                }
                else
                {
                    loading = null;
                }
            }

            // 以当前控件和位置开始滑动
            start.control = this;
            start.clientX = event.clientX;
            start.clientY = event.clientY;
    
            overflowY = style.overflowY;
            style.overflowY = 'hidden';

            pulldown = this.pulldown;
            pulldown.start(this);

            event.stop();
            return false;
        }
    }


    function touchend(event) {

        if (pulldown)
        {
            this.$dom.style.overflowY = overflowY || '';

            if (pulldown.$dom)
            {
                pulldown.stop(this, loading);
                pulldown = null;

                event.stop();
                return false;
            }

            pulldown = loading = null;
        }
    }



}
