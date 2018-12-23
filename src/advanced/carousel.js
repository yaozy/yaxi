yaxi.Carousel = yaxi.Control.extend(function (Class, base) {



    
    var create = Object.create;


    
    yaxi.template(this, '<div class="yx-control yx-carousel"><div class="yx-carousel-host"></div><div class="yx-carousel-pagination"></div></div>');



    Class.ctor = function (data) {

        this.$storage = create(this.$defaults);
        this.__children = new yaxi.ControlCollection(this);

        if (data)
        {
            this.__init(data);
        }

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchend);

        this.__auto = auto.bind(this);
    }



    // 当前索引
    this.$property('index', {

        defaultValue: 0,

        convertor: function (value) {

            if ((value |= 0) < 0)
            {
                return 0;
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

        convertor: function (value) {

            value |= 0;
            return value < 0 ? 0 : value;
        }
    });


    // 页码
    this.$property('pagination', 'dot');



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


    this.__convert_children = [0, function (value) {
      
        if (value && value.length > 0)
        {
            this.__children.__init(this, value);
        }
    }];


    // 子控件类型
    this.__child_class = yaxi.Control;




    // 扩展容器功能
    yaxi.container.call(this, base);




    this.render = function () {

        var dom = base.render.call(this),
            host = dom.firstChild,
            children = this.__children,
            index = 0,
            any;

        children.__patch = 1;

        while (any = children[index++])
        {
            host.appendChild(any.render());
        }

        if ((any = this.pagination) && children.length > 0)
        {
            dom.lastChild.innerHTML = renderPagination(children, any, this.index);
        }

        if (any = this.time)
        {
            this.renderer.time(dom, any);
        }

        children.onchange = onchange;

        return dom;
    }




    var last = 0;

    var position = 0;


    function touchstart() {

        var dom = this.$dom,
            width = dom.clientWidth;

        if (this.__delay)
        {
            clearTimeout(this.__delay);
            this.__delay = 0;
        }

        last = -(this.__children.length - 1) * width;
        position = -this.index * width;

        dom.firstChild.style.transition = '';
    }


    function touchmove(event) {

        var offset = position + event.distanceX;

        if (offset > 0)
        {
            offset = 0;
        }
        else if (offset < last)
        {
            offset = last;
        }

        this.$dom.firstChild.style.transform = 'translateX(' + offset + 'px)';

        event.stop();
        return false;
    }


    function touchend(event) {

        var index = this.index,
            offset = event.distanceX,
            value = yaxi.rem;

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
            this.renderer.index(this.$dom, index | 0);
        }

        if (value = this.time)
        {
            this.renderer.time(this.$dom, value + 1000);
        }
    }




    var renderer = this.renderer;

    
    renderer.index = function (dom, value) {

        var name = 'yx-carousel-selected',
            style1 = dom.firstChild.style,
            style2,
            any;

        if (value > 0 || position)
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


    renderer.time = function (dom, value) {

        if (this.__delay)
        {
            clearTimeout(this.__delay);
        }

        if (value > 0)
        {
            this.__delay = setTimeout(this.__auto, value);
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


    
    function auto() {

        var children = this.children,
            index = this.index + 1;

        if (index >= children.length)
        {
            index = 0;
        }

        this.index = index;

        this.__delay = setTimeout(this.__auto, this.time);
    }




}).register('Carousel');
