yaxi.Pulldown = yaxi.Control.extend(function (Class, base) {



    var delay;



    function i18n(key) {
    
        return yaxi.i18n.pulldown[key];
    }



    yaxi.template(this, '<div class="yx-control yx-pulldown" layout="line-middle">' +
            '<svg aria-hidden="true"><use xlink:href="#icon-yaxi-pulldown"></use></svg>' +
            '<span class="yx-loading-img" style="display:none;"></span>' +
            '<span></span>' +
        '</div>');



    // 下拉时显示文字
    this.pulldownText = '';

    // 可释放刷新时显示文字
    this.releaseText = '';
    
    // 加载时显示文字
    this.loadingText = '';



    function done(container) {

        var dom = this.$dom;

        if (dom)
        {
            dom = dom.firstChild;
            dom.style.display = 'none';

            dom = dom.nextSibling;
            dom.style.display = '';

            dom = dom.nextSibling;
            dom.innerHTML = this.loadingText || i18n('loading');

            // 最少显示500ms的loading
            setTimeout(function () {

                this.onload.call(container, this);

            }.bind(this), 500);
        }
    }


    function hide(loading) {

        var dom = this.$dom;

        if (dom)
        {
            dom.style.transition = 'height 600ms ease';
            dom.style.height = 0;

            delay = setTimeout(remove.bind(this, loading), 600);
        }
    }
    

    function remove(loading) {

        var dom = this.$dom,
            parent;

        if (dom && (parent = dom.parentNode))
        {
            parent.removeChild(dom);
        }

        if (loading)
        {
            loading.show();
            loading.style.visibility = '';
        }
    }



    this.start = function (host) {

        var dom = this.$dom || this.render(),
            style = dom.style;

        host = host.$dom || host;
        host.insertBefore(dom, host.firstChild);

        dom = dom.firstChild;
        dom.style.display = '';
        dom.nextSibling.style.display = 'none';

        style.transition = '';
        style.height = 0;
    }


    this.move = function (offset) {

        var dom = this.$dom,
            style = dom.style,
            svg,
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
                svg = '#icon-yaxi-pulldown-up';
                text = this.releaseText || i18n('release');
            }
            else
            {
                svg = '#icon-yaxi-pulldown';
                text = this.pulldownText || i18n('pulldown');
            }

            dom.firstChild.firstChild.setAttribute('xlink:href', svg);
            dom.lastChild.innerHTML = text;

            style.height = offset + 'px';
        }
    }


    this.stop = function (container, loading) {

        var style = this.$dom.style;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        style.transition = 'height 600ms ease';

        if (this.ready)
        {
            style.height = '.5rem';
            delay = setTimeout(done.bind(this, container), 600);

            return true;
        }

        style.height = 0;
        delay = setTimeout(remove.bind(this, loading), 600);
    }


    this.hide = function (fail, loading) {

        var dom = this.$dom,
            parent;

        if (delay)
        {
            clearTimeout(delay);
            delay = 0;
        }

        if (dom && (parent = dom.parentNode))
        {
            if (this.ready)
            {
                var node = dom.lastChild;

                node.innerHTML = i18n(fail ? 'fail' : 'success');
                node.previousSibling.style.display = 'none';

                if (loading)
                {
                    loading.status = fail ? 'failed' : 'completed';
                }

                delay = setTimeout(hide.bind(this, loading), 1000);
            }
            else
            {
                parent.removeChild(dom);
                
                if (loading)
                {
                    loading.show();
                    loading.style.visibility = '';
                }
            }
        }
    }



}).register('Pulldown');
