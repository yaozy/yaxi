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

        var children = this.__children;

        if (children.length > 0 && (dom = this.$dom))
        {
            var gap = this.__gap,
                dom,
                any;

            if (any = yaxi.layouts[this.$storage.layout])
            {
                any(children, dom, gap ? gap[2] : 0);
            }
            else if (gap)
            {
                computeGap(children, gap);
            }

            for (var i = 0, l = children.length; i < l; i++)
            {
                if ((any = children[i]) && any.invalidate && any.$dom)
                {
                    any.invalidate();
                }
            }
        }
    }


    // 计算间隙
    function computeGap(children, gap) {
        
        var name = gap[0],
            dom,
            style;

        gap = gap[1];

        if ((dom = children[0].$dom) && (style = dom.style)[name] !== '0')
        {
            style[name] = '0';
        }

        for (var i = 1, l = children.length; i < l; i++)
        {
            if (i > 0 && (dom = children[i].$dom) && (style = dom.style)[name] !== gap)
            {
                style[name] = gap;
            }
        }
    }




    var renderer = this.renderer;



    renderer.layout = function (dom, value) {

        dom.setAttribute('layout', value);
    }


    renderer.gap = function (dom, value) {

        if (value && (value = value.split(' ', 2))[0])
        {
            this.__gap = [
                value[1] === 'top' ? 'marginTop' : 'marginLeft',
                value[0],
                value[0].indexOf('px') > 0 ? parseInt(value[0]) : parseFloat(value[0]) * yaxi.rem + .5 | 0
            ];
        }
        else
        {
            this.__gap = null;
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


    renderer.nomargin = function (dom, value) {

        if (value)
        {
            dom.setAttribute('nomargin', value);
        }
        else
        {
            dom.removeAttribute('nomargin');
        }
    }


    
    this.__on_tap = function (event) {

        var base = this.base;

        if (base)
        {
            var control = event.target,
                url;

            while (control && control !== this)
            {
                if (url = control.url)
                {
                    var Class = yaxi.loadModule(base, url),
                        args = control.args;

                    if (!Class.prototype.open)
                    {
                        control = control.parent;
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
    }



    this.render = function () {

        var dom = base.render.call(this),
            children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            dom.appendChild(control.render());
        }

        return dom;
    }


    
    this.__patch = function (dom) {

        var children = this.__children,
            changes,
            length,
            control,
            dom;

        base.__patch.call(this, dom);

        if (changes = children.__changes)
        {
            children.__patch(this, dom, changes);
        }

        if ((length = children.length) > 0)
        {
            for (var i = 0; i < length; i++)
            {
                if ((control = children[i]) && (dom = control.$dom))
                {
                    control.__patch(dom);
                }
            }
        }
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

            var pulldown;

            if (value)
            {
                pulldown = yaxi.Pulldown;

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
            }

            this.__pulldown = pulldown;
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

            if (dom.scrollTop + (dom.offsetHeight << 1) < dom.scrollHeight)
            {
                return;
            }

            loading.index++ || (loading.index = 1);
            loading.__time = time;
            loading.onload.call(this, loading);
        }
    }



    this.__on_touchmove = function (event) {

        if (pulldown)
        {
            if (pulldown.$dom)
            {
                pulldown.move(event.distanceY);

                event.stop(true);
                return false;
            }
            else
            {
                pulldown = null;
            }
        }

        if ((pulldown = this.__pulldown) && this.$dom.scrollTop < 1 && 
            (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var state = event.state,
                style = this.$dom.style;

            if (loading = this.__loading)
            {
                if (loading.$dom)
                {
                    loading.$dom.style.visibility = 'hidden';
                }
                else
                {
                    loading = null;
                }
            }

            // 以当前控件和位置开始滑动
            state.control = this;
            state.clientX = event.clientX;
            state.clientY = event.clientY;
    
            overflowY = style.overflowY;
            style.overflowY = 'hidden';

            pulldown.start(this);

            event.stop(true);
            return false;
        }
    }


    this.__on_touchend = this.__on_touchcancel = function (event) {

        if (pulldown)
        {
            if (pulldown.$dom)
            {
                this.$dom.style.overflowY = overflowY || '';

                pulldown.stop(this, loading);
                pulldown = null;

                event.stop(true);
                return false;
            }

            pulldown = loading = null;
        }
    }



}
