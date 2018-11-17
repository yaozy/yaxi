yaxi.Pulldown = yaxi.Control.extend(function (Class) {



    Class['en-US'] = {
        pulldown: 'pulldown to refresh',
        release: 'release refresh',
        loading: 'loading, please wait...'
    };


    Class['zh-CN'] = {
        pulldown: '下拉刷新',
        release: '放开刷新',
        loading: '正在加载, 请稍候...'
    };


    Class['zh-TW'] = {
        pulldown: '下拉重繪',
        release: '放開重繪',
        loading: '正在加載, 請稍候...'
    };



    yaxi.template(this, '<div class="yx-control yx-pulldown" style="height:0;">' +
            '<span class="yx-pulldown-body">' +
                '<svg aria-hidden="true"><use xlink:href="#icon-pulldown"></use></svg>' +
                '<span class="yx-loading-img" style="display:none;"></span>' +
                '<span></span>' +
            '</span>' +
        '</div>');




    this.$property('pulldownText', '');

    this.$property('releaseText', '');
    
    this.$property('loadingText', '');



    this.start = function (host) {

        var dom = this.$dom || this.render(),
            style = dom.style;

        host = host.$dom || host;
        host.insertBefore(dom, host.firstChild);

        dom = dom.firstChild.firstChild;
        dom.style.display = '';
        dom.nextSibling.style.display = 'none';

        style.transition = '';
        style.height = 0;
    }


    this.move = function (offset) {

        var dom = this.$dom,
            style = dom.style,
            transform,
            text;

        if (offset <= 0)
        {
            this.ready = false;
            style.height = 0;
        }
        else
        {
            if (this.ready = offset >= yaxi.rem * .8)
            {
                transform = 'rotateZ(180deg)';
                text = this.releaseText || Class[yaxi.language].release;
            }
            else
            {
                transform = '';
                text = this.pulldownText || Class[yaxi.language].pulldown;
            }

            dom = dom.firstChild;
            dom.firstChild.style.transform = transform;
            dom.lastChild.innerHTML = text;

            style.height = offset + 'px';
        }
    }


    this.stop = function () {

        var dom = this.$dom,
            style = dom.style;

        style.transition = 'height 600ms ease';

        if (this.ready)
        {
            style.height = '.5rem';

            dom = dom.firstChild.firstChild;
            dom.style.display = 'none';
    
            dom = dom.nextSibling;
            dom.style.display = '';
    
            dom = dom.nextSibling;
            dom.innerHTML = this.loadingText || Class[yaxi.language].loading;

            return true;
        }

        style.height = 0;
        setTimeout(this.hide.bind(this), 600);
    }


    this.hide = function () {

        var dom = this.$dom,
            parent;

        if (dom && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }
    }



}).register('Pulldown');
