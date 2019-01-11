yaxi.Loading = yaxi.Control.extend(function (Class, base) {


    Class['en-US'] = {
        loading: 'loading, please wait...',
        empty: 'no data',
        completed: 'no more data',
        failed: 'load fail, please click to retry'
    };


    Class['zh-CN'] = {
        loading: '正在加载, 请稍候...',
        empty: '无数据',
        completed: '没有更多数据了',
        failed: '加载失败, 请点击重试'
    };


    Class['zh-TW'] = {
        loading: '正在加載, 請稍候...',
        empty: '無數據',
        completed: '沒有更多數據了',
        failed: '加載失敗, 請點擊重試'
    };


    

    yaxi.template(this, '<div class="yx-loading"><span class="yx-loading-img"></span><span></span></div>');


    

    // 加载时提示文字
    this.loadingText = '';

    // 无数据时提示文字
    this.emptyText = '';

    // 加载完毕时提示文字
    this.completedText = '';
    
    // 失败时提示文字
    this.failedText = '';


    // 是否无数据
    this.empty = false;

    // 是否前置loading
    this.before = false;



    // 状态
    // loading: 正在加载
    // completed: 已完成
    // failed: 失败
    // hidden: 隐藏
    this.status = 'loading';




    // 是否显示
    Object.defineProperty(this, 'shown', {

        get: function () {

            var dom = this.$dom;
            return dom && dom.parentNode ? true : false;
        }
    });



    // 当前索引
    this.index = 1;


    // 显示loading
    this.show = function () {

        var status = this.status || 'loading',
            dom = this.$dom,
            parent;

        if (status === 'hidden')
        {
            if ((dom = this.$dom) && (parent = dom.parentNode))
            {
                parent.removeChild(dom);
            }

            return;
        }

        var i18n = Class[yaxi.language] || Class['en-US'],
            display = 'none',
            text;

        switch (status)
        {
            case 'loading':
                display = '';
                text = this.loadingText || i18n.loading;
                break;

            case 'completed':
                text = this.empty ? this.emptyText || i18n.empty : this.completedText || i18n.completed;
                break;

            case 'failed':
                text = this.failedText || i18n.failed;
                break;
        }

        dom = dom || (this.$dom = this.render());
        dom.firstChild.style.display = display;
        dom.lastChild.innerHTML = text;
        
        if (parent = this.parent)
        {
            parent = parent.$dom;
        }

        if (this.before)
        {
            dom.$loading = 1;

            if (parent)
            {
                parent.insertBefore(dom, parent.firstChild || null);
            }
        }
        else
        {
            dom.$loading = 2;

            if (parent)
            {
                parent.appendChild(dom);
            }
        }
    }




    // 正在加载
    this.load = function (show) {

        this.stop();
        this.status = 'loading';

        if (show !== false)
        {
            this.__delay = setTimeout(this.show.bind(this), show || 0);
        }
    }


    // 加载完毕
    this.complete = function (empty, show) {

        this.stop();
        
        this.empty = empty;
        this.status = 'completed';

        if (show !== false)
        {
            this.__delay = setTimeout(this.show.bind(this), show || 0);
        }
    }


    // 加载失败
    this.fail = function (show) {

        this.stop();
        this.status = 'failed';

        if (show !== false)
        {
            this.__delay = setTimeout(this.show.bind(this), show || 0);
        }
    }


    // 停止定时更新
    this.stop = function () {
    
        if (this.__delay)
        {
            clearTimeout(this.__delay);
            this.__delay = 0;
        }
    }


    // 隐藏loading
    this.hide = function () {

        var parent, dom;

        this.stop();
        this.status = 'hidden';

        if ((dom = this.$dom) && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }
    }



    this.render = function () {

        var dom = base.render.call(this);

        if (this.status !== 'hidden')
        {
            this.show();
        }

        return dom;
    }



    this.__on_tap = function () {

        if (this.status === 'failed')
        {
            // 显示loading
            this.load();

            // 最少显示500msloading
            setTimeout(this.onload.bind(this.parent, this), 500);
        }
    }



}).register('Loading');
