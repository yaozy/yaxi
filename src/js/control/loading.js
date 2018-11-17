yaxi.Loading = yaxi.Control.extend(function (Class) {


    Class['en-US'] = {
        end: 'no more data',
        empty: 'no data',
        loading: 'loading, please wait...'
    };


    Class['zh-CN'] = {
        end: '没有更多数据了',
        empty: '无数据',
        loading: '正在加载, 请稍候...'
    };


    Class['zh-TW'] = {
        end: '沒有更多數據了',
        empty: '無數據',
        loading: '正在加載, 請稍候...'
    };


    yaxi.template(this, '<div class="yx-loading"><span class="yx-loading-img"></span><span></span></div>');
    
    

    this.$property('emptyText', '');

    this.$property('endText', '');
    
    this.$property('loadingText', '');



    // 显示loading
    this.show = function (host) {

        var dom = this.$dom || this.render();

        this.index = 0;
        this.completed = false;

        dom.firstChild.style.display = '';
        dom.lastChild.innerHTML = this.loadingText || Class[yaxi.language].loading;

        (host.$dom || host).appendChild(dom);
    }


    // 加载完毕
    this.done = function (empty) {

        var i18n = Class[yaxi.language];

        this.completed = true;
        this.$dom.firstChild.style.display = 'none';
        this.$dom.lastChild.innerHTML = empty ? this.emptyText || i18n.empty : this.endText || i18n.end;
    }


    // 隐藏loading
    this.hide = function () {

        var dom = this.$dom,
            parent;

        if (dom && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }
    }



}).register('Loading');
