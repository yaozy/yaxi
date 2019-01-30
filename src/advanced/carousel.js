yaxi.Carousel = yaxi.Control.extend(function (Class, base) {



    
    var create = Object.create;


    
    yaxi.template(this, '<div class="yx-control yx-carousel"><div class="yx-carousel-host"></div><div class="yx-carousel-pagination"></div></div>');



    Class.ctor = function () {

        var init;

        this.$storage = create(this.$defaults);
        this.__children = new yaxi.ControlCollection(this);

        if (init = this.init)
		{
			init.apply(this, arguments);
        }
    }



    // 当前索引
    this.$property('index', {

        defaultValue: 0,

        converter: function (value) {

            if ((value |= 0) < 0)
            {
                return -1;
            }
            
            if (value >= this.children.length)
            {
                return this.children.length - 1;
            }

            return value;
        }
    });


    // 间隔时间
    this.$property('time', {
    
        defaultValue: 0,

        converter: function (value) {

            value |= 0;
            return value < 0 ? 0 : value;
        }
    });


    // 页码
    this.$property('pagination', 'dot');


    // url基础路径(没置了此路径点击时将打开子项绑定的url)
    this.$property('base', '', false, 'baseURL');



    // 子控件集合
    Object.defineProperty(this, 'children', {

        get: function () {

            return this.__children;
        },
        set: function (value) {

            var children = this.__children;

            if (children.length > 0)
            {
                children.clear();
            }

            if (value && value.length > 0)
            {
                children.push.apply(children, value);
            }
        }
    });



    this.$converter.children = {
        
        fn: function (values) {
      
            if (values && values.length > 0)
            {
                this.__children.assign(values);
            }
        }
    };



    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.impl.container.call(this, base);




    this.render = function () {

        var dom = base.render.call(this),
            host = dom.firstChild,
            children = this.__children,
            index = 0,
            any;

        while (any = children[index++])
        {
            host.appendChild(any.$dom || any.render());
        }

        if ((any = this.pagination) && children.length > 0)
        {
            dom.lastChild.innerHTML = renderPagination(children, any, this.index);
        }

        if (any = this.time)
        {
            renderer.time.call(this, dom, any);
        }

        children.onchange = onchange;

        return dom;
    }




    var last = 0;

    var position = 0;

    var swipe = 0;


    this.__on_touchstart = function (event) {

        var children = this.__children;

        if (children.length > 0)
        {
            var dom = this.$dom,
                width = dom.clientWidth;

            last = -(children.length - 1) * width;
            position = -this.index * width;

            dom.firstChild.style.transition = '';
            swipe = 0;
        }
        else
        {
            swipe = -1;
        }
    }


    this.__on_touchmove = function (event) {

        if (swipe < 0)
        {
            return;
        }

        var x = event.distanceX,
            y = event.distanceY;

        if (swipe === 0)
        {
            if (y < 0)
            {
                y = -y;
            }

            if ((x > 0 ? x : -x) < y)
            {
                return;
            }

            swipe = 1;
        }

        x += position;

        if (x > 0)
        {
            x = 0;
        }
        else if (x < last)
        {
            x = last;
        }

        this.$dom.firstChild.style.transform = 'translateX(' + x + 'px)';

        event.stop(true);
        return false;
    }


    this.__on_touchend = this.__on_touchcancel = function (event) {

        if (swipe > 0)
        {
            var index = this.index,
                offset = event.distanceX,
                value = yaxi.rem / 2;

            if (offset < -value && index < this.__children.length - 1)
            {
                this.index++;
            }
            else if (offset > value && index > 0)
            {
                this.index--;
            }
            else
            {
                renderer.index.call(this, this.$dom, index | 0);
            }

            if (value = this.time)
            {
                renderer.time.call(this, this.$dom, value + 1000);
            }

            event.stop(true);
            return false;
        }
    }




    var renderer = this.renderer;

    
    renderer.index = function (dom, value) {

        if (this.__children.length > 0)
        {
            var name = 'yx-carousel-selected',
                style1 = dom.firstChild.style,
                style2,
                any;

            if (value > 0 || swipe > 0)
            {
                style1.transform = 'translateX(-' + value + '00%)';
            }
            else // 回到第一页动画特殊处理
            {
                if (any = +style1.transform.match(/\d+/) | 0)
                {
                    any += 100;
                }

                style2 = dom.firstChild.firstChild.style;
                style2.transform = 'translateX(' + any + '%)';

                style1.transform = 'translateX(-' + any + '%)';

                setTimeout(function () {

                    style1.transform = style1.transition = style2.transform = '';

                }, 600);
            }

            style1.transition = 'transform 600ms ease';

            if (any = dom.lastChild.querySelector('.' + name))
            {
                any.classList.remove(name);
            }

            if (any = dom.lastChild.children[value])
            {
                any.classList.add(name);
            }
        }
    }


    renderer.time = function (dom, value) {

        if (this.__delay)
        {
            clearTimeout(this.__delay);
        }

        if (value > 0)
        {
            autoplay.call(this, value);
        }
    }


    renderer.pagination = function (dom, value) {

        dom.lastChild.innerHTML = renderPagination(this.__children, value, this.index);
    }


    function onchange(carousel) {
    
        var dom;

        if (dom = carousel.$dom)
        {
            dom.lastChild.innerHTML = renderPagination(this, carousel.pagination, carousel.index);
        }
    }


    function renderPagination(children, pagination, index) {

        if (pagination && children.length > 0)
        {
            switch (pagination)
            {
                default:
                    return renderDot(children, index);
            }
        }

        return '';
    }


    function renderDot(children, index) {

        var array = [];

        for (var i = 0, l = children.length; i < l; i++)
        {
            array.push('<div class="yx-carousel-dot', 
                index === i ? ' yx-carousel-selected' : '',
                '"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg></div>');
        }

        return array.join('');
    }


    function autoplay(time) {

        var fn = (function () {

            var time = this.time,
                children,
                index;

            if (time > 0)
            {
                if (!yaxi.pressdown && (children = this.__children).length > 0)
                {
                    if (swipe > 0)
                    {
                        swipe = 0;
                    }
                    else
                    {
                        index = this.index + 1;

                        if (index >= children.length)
                        {
                            index = 0;
                        }

                        this.index = index;
                    }
                }

                this.__delay = setTimeout(fn, time);
            }

        }).bind(this);

        this.__delay = setTimeout(fn, time);
    }



}).register('Carousel');
