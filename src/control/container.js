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
            length = list.length;

        if (length > 0)
        {
            var weight, size;
            
            for (var i = 0; i < length; i++)
            {
                var text = list[i],
                    last = text[text.length - 1],
                    none = 0;

                if (last === '?')
                {
                    list[i] = [3];
                    size = 1;
                    continue;
                }
                
                if (last === '!')
                {
                    none = 1;
                    last = text[text.length - 2];
                }

                if (last === '*') // 权重
                {
                    list[i] = [2, parseFloat(text) || 100, none];
                    weight = 1;
                }
                else if (last === '%') // 百分比
                {
                    list[i] = [1, parseFloat(text), none];
                    size = 1;
                }
                else if (last === 'x') // px
                {
                    list[i] = [0, parseInt(text), none];
                    size = 1;
                }
                else // rem
                {
                    list[i] = [0, parseFloat(text) * yaxi.rem + .5 | 0, none];
                    size = 1;
                }
            }

            list.weight = weight;
            list.size = size;
        }
        else
        {
            list = defaultLayout;
        }

        return layouts[data] = list;
    }



    // 重算布局
    this.invalidate = function () {

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

                if (layout === 'row')
                {
                    arrangeRow(this, width, data, storage.gap);
                }
                else
                {
                    arrangeColumn(this, height, data, storage.gap);
                }
            }
        }

        for (var i = 0, l = children.length; i < l; i++)
        {
            var control = children[i];

            if (control.invalidate && control.$dom)
            {
                control.invalidate();
            }
        }
    }


    function arrangeRow(self, width, list, gap) {

        var fixed;

        if (list.size)
        {
            for (var i = 0, l = list.length; i < l; i++)
            {
                var item = list[i];

                // switch (item[0])
                // {
                //     // case 
                // }
            }
        }
    }


    function arrangeColumn(self, height, list, gap) {

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


    this.renderer.detail = function () {

        // 标记布局发生了变化
        this.__layout = null;
    }


    
    var styleSheet;


    this.renderer.gap = function (dom, value) {

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
                style.addRule('.yx-control[gap="' + key + '"]>*', 'margin-' + type + ': ' + value);
                style[key] = 1;
            }
            
            dom.setAttribute('gap', key);
        }
        else
        {
            dom.removeAttribute('gap');
        }
    }


    
    this.renderer.baseURL = function (dom, value) {

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
