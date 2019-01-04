yaxi.container = function (base) {



    // 布局类型
    this.$property('layout', '');


    // url基础路径
    this.$property('baseURL', '', false);


    // 是否在点击时打开子项绑定的url
    this.$property('openURL', {
    
        defaultValue: false,

        converter: function (value) {

            value = !!value;

            if (value !== this.openURL)
            {
                if (value)
                {
                    this.on('tap', openURL);
                }
                else
                {
                    this.off('tap', openURL);
                }
            }
            
            return value;
        }

    }, false);



    function openURL(event) {

        var control = event.target,
            url;

        while (control && control !== this)
        {
            if (url = control.url)
            {
                var Class = yaxi.loadModule(this.baseURL, url),
                    args = control.args;

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



    this.renderer.layout = function (dom, value) {

        dom.setAttribute('layout', value);
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

        if ((control = this.__loading) && control.status === 'loading')
        {
            control.show();
            control.onload.call(this, control, true);
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




yaxi.__extend_pulldown = function () {

    
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
                loading.on('tap', reload);

                this.__loading = loading;
                this.on('scroll', scroll);
            }
            else
            {
                this.off('scroll', scroll);
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

                this.__pulldown = pulldown;

                this.on('touchmove', touchmove);
                this.on('touchend', touchend);
                this.on('touchcancel', touchend);
            }
            else
            {
                this.off('touchmove', touchmove);
                this.off('touchend', touchend);
                this.off('touchcancel', touchend);
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

            loading.index++;
            loading.__time = time;
            loading.onload.call(this, loading);
        }
    }


    function reload() {

        if (this.status === 'failed')
        {
            // 显示loading
            this.load();

            // 最少显示500msloading
            setTimeout(function () {

                this.onload.call(this.parent, this);

            }.bind(this), 500);
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

        if (!this.pulldown || (loading = this.__loading) && loading.shown && loading.status === 'loading')
        {
            loading = null;
            return;
        }

        if (this.$dom.scrollTop < 1 && (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var start = event.start,
                style = this.$dom.style;

            if (loading)
            {
                if (loading.shown)
                {
                    loading.hide();
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
