yaxi.container = function (base, nopulldown) {



    // 布局类型
    this.$property('layout', '');



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



    this.__set_layout = function (dom, value) {

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

        if (control = this.__loading)
        {
            control.show(dom);

            if (control.load)
            {
                control.index = 0;
                control.load.call(this, control);
            }
        }

        return dom;
    }



    // 不支持pulldown及loading
    if (nopulldown)
    {
        return;
    }


    

    
    var pulldown, overflowY;



    // loading设置
    Object.defineProperty(this, 'loading', {
    
        get: function () {

            return this.__loading;
        },
        set: function (value) {

            if (value)
            {
                var loading;

                if (typeof value === 'function')
                {
                    loading = new yaxi.Loading();
                    loading.load = value;
                }
                else
                {
                    if (typeof value.load !== 'function')
                    {
                        throw 'loading load must be a function!'
                    }
                    
                    if (!(value instanceof yaxi.Loading))
                    {
                        loading = new yaxi.Loading(value);
                    }
                }

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
                var pulldown;

                if (typeof value === 'function')
                {
                    pulldown = new yaxi.Pulldown();
                    pulldown.refresh = value;
                }
                else
                {
                    if (typeof value.refresh !== 'function')
                    {
                        throw 'pulldown refresh must be a function!'
                    }

                    if (!(value instanceof yaxi.Pulldown))
                    {
                        pulldown = new yaxi.Pulldown(value);
                    }
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


    function scroll(event) {

        var loading = this.__loading;

        if (!pulldown && loading && !loading.completed && this.scrollTop + (this.offsetHeight << 1) > this.scrollHeight)
        {
            loading.index++;
            loading.load.call(this, loading);
        }
    }


    function touchmove(event) {

        var start = event.start;

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

        if (!start.swipe && this.pulldown && this.$dom.scrollTop < 1 &&
            (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var style = this.$dom.style;

            // 以当前控件和位置开始滑动
            start.swipe = 2;
            start.control = this;
            start.screenX = event.screenX;
            start.screenY = event.screenY;
    
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
                if (pulldown.stop())
                {
                    pulldown.refresh.call(this, pulldown);
                }

                pulldown = null;
            
                event.stop();
                return false;
            }
            else
            {
                pulldown = null;
            }
        }
    }


}
