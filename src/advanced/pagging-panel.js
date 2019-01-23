yaxi.PaggingPanel = yaxi.Panel.extend(function (Class, base) {



    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);

        this.loading = onloading;
        this.pulldown = onpulldown;
        this.overflowY = 'auto';
    }



    // 当前页码
    Object.defineProperty(this, 'pageIndex', {

        get: function () {

            return this.loading.index || 1;
        }
    });



    // 每页显示的记录数
    this.pageSize = 50;


    // 是否自动加载
    this.autoLoading = true;

    


    function onloading(loading) {

        var size = this.pageSize;

        this.load(loading.index).then(function (data) {

            if (data && data.length < size)
            {
                loading.complete(!data.length);
            }

        }).catch(function () {

            loading.fail();
        });
    }


    function onpulldown(pulldown) {

        var loading = this.__loading,
            size = this.pageSize;

        this.load(loading ? loading.index = 1 : 1, size).then(function (data) {

            if (data && loading && data.length < size)
            {
                loading.complete(!data.length, false);
            }

            pulldown.hide(false, loading);

        }).catch(function () {

            pulldown.hide(true, loading);
        });
    }


    function refresh() {

        var loading = this.__loading;
            size = this.pageSize;
            
        this.load(loading.index = 1, size).then(function (data) {

            if (data && data.length < size)
            {
                loading.complete(!data.length);
            }

        }).catch(function () {

            loading.fail();
        });
    }



    this.refresh = function () {

        var loading = this.__loading;

        if (loading)
        {
            // 先显示loading
            loading.load();

            // 先显示200msloading再加载数据以解决加载过快闪烁的问题
            setTimeout(refresh.bind(this), 200);
        }
        else
        {
            this.load(0);
        }
    }



    this.setData = function (data, page) {

        if (page > 1)
        {
            this.children.push.apply(this.children, data);
        }
        else
        {
            this.children = data;
        }
    }



    this.render = function () {

        var dom = base.render.call(this);

        if (this.autoLoading)
        {
            this.refresh();
        }

        return dom;
    }



}).register('PaggingPanel');
