yaxi.PaggingPanel = yaxi.Panel.extend(function (Class, base) {



    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);

        this.loading = onloading;
        this.pulldown = onpulldown;
    }



    // 当前页码
    Object.defineProperty(this, 'pageIndex', {

        get: function () {

            return this.loading.index || this.startIndex || 0;
        }
    });



    // 开始页码
    this.startIndex = 1;


    // 每页显示的记录数
    this.pageSize = 50;


    // 是否自动加载
    this.autoLoading = true;

    


    function onloading(loading) {

        var size = this.pageSize;

        this.load(loading.index, size).then(function (data) {

            if (data && data.length < size)
            {
                loading.complete(!data.length);
            }

        }).catch(function () {

            loading.fail();
        });
    }


    function onpulldown(pulldown) {

        var loading = this.loading,
            size = this.pageSize;

        this.load(loading.index = this.startIndex || 0, size).then(function (data) {

            if (data && loading && data.length < size)
            {
                loading.complete(!data.length, false);
            }

            pulldown.hide(false, loading);

        }).catch(function () {

            pulldown.hide(true, loading);
        });
    }




    this.refresh = function () {

        var loading = this.loading;

        if (loading)
        {
            var size = this.pageSize;
            
            loading.load(200);

            this.load(loading.index = this.startIndex || 0, size).then(function (data) {

                if (data && data.length < size)
                {
                    loading.complete(!data.length);
                }

            }).catch(function () {

                loading.fail();
            });
        }
        else
        {
            this.load(0);
        }
    }



    this.setData = function (data, page) {

        if (page > this.startIndex || 0)
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
