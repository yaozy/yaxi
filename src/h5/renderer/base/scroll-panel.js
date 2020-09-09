yaxi.ScrollPanel.mixin(function (mixin, base) {



    var pulldown, loading, host;



    // loading设置
    this.$property('loading', {
    
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
    this.$property('pulldown', {

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

            var view = this.$view;

            if (view.scrollTop + view.offsetHeight < view.scrollHeight)
            {
                return;
            }

            loading.index++ || (loading.index = 1);
            loading.__time = time;
            loading.onload.call(this, loading);
        }
    }



    this.__on_touchmove = function (event) {

        if (pulldown && pulldown.$view)
        {
            pulldown.move(event.distanceY);

            event.stop(true);
            return false;
        }

        if ((pulldown = this.__pulldown) && this.$view.scrollTop < 1 && 
            (event.distanceY > 16 && event.distanceY > event.distanceX + 4))
        {
            var state = event.state,
                style = this.$view.style;

            if (loading = this.__loading)
            {
                if (loading.$view)
                {
                    loading.$view.style.visibility = 'hidden';
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
    
            // 记录前当滚动的容器
            host = style.overflowY === 'auto' ? this.$view : null;

            pulldown.start(this);

            event.stop(true);
            return false;
        }
        else
        {
            pulldown = host = null;
        }
    }


    this.__on_touchend = this.__on_touchcancel = function (event) {

        if (pulldown)
        {
            if (pulldown.$view)
            {
                if (host)
                {
                    host.style.overflowY = 'auto';
                }

                pulldown.stop(this, loading);
                pulldown = null;

                event.stop(true);
                return false;
            }

            pulldown = loading = host = null;
        }
    }


});
