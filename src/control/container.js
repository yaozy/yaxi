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



    var layouts = Object.create(null);

    var defaultLayout = parseLayout('? * ?');



    function parseLayout(data) {

        var list = data.match(/\S/g),
            length = list.length,
            result;

        if (length > 0)
        {
            result = [];
            
            for (var i = 0; i < length; i++)
            {
                var text = list[i],
                    last = text[text.length - 1],
                    none = 0;

                if (last === '?')
                {
                    result.push([3]);
                    continue;
                }
                
                if (last === '!')
                {
                    none = 1;
                    last = text[text.length - 2];
                }

                if (last === '*') // 权重
                {
                    result.push([2, parseInt(text) || 100, none]);
                }
                else if (last === '%') // 百分比
                {
                    result.push([1, parseFloat(text), none]);
                }
                else if (last === 'x') // px
                {
                    result.push([0, parseInt(text), none]);
                }
                else // rem
                {
                    result.push([0, parseFloat(text) * yaxi.rem + .5 | 0, none]);
                }
            }
        }
        else
        {
            result = defaultLayout;
        }

        return layouts[data] = result;
    }



    this.__check_layout = function () {

        var children = this.__children;
            storage = this.$storage,
            layout = storage.layout;

        if (layout === 'row' || layout === 'column')
        {
            var last = this.__layout,
                data = this.$dom,
                width = data.clientWidth,
                height = data.clientHeight;

            // 布局发生变化或容器发生变化则重新排列
            if (!last || last.width !== width || last.height !== height)
            {
                data = storage.detail;
                data = layouts[data] || parseLayout(data) || defaultLayout;

                arrange(this, width, height, layout, data, storage.gap);
            }
        }

        for (var i = 0, l = children.length; i < l; i++)
        {
            var control = children[i];

            if (control.__check_layout && control.$dom)
            {
                control.__check_layout();
            }
        }
    }


    function arrange(self, width, height, layout, detail, gap) {

        
    }


    
    // 窗口变化时检查布局
    window.addEventListener('resize', function () {

        yaxi.trigger('yaxi-check-layout');
        
    });




    this.renderer.layout = function (dom, value) {

        // 标记布局发生了变化
        this.__layout = null;

        dom.setAttribute('layout', value);
    }


    this.renderer.detail = this.renderer.gap = function () {

        // 标记布局发生了变化
        this.__layout = null;
    }

    
    this.renderer.baseURL = function (dom, value) {

        if (value)
        {
            if (!this.hasEvent('tap', openURL))
            {
                this.on('tap', openURL);
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
                var Class = yaxi.loadModule(this.baseURL, url),
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
