yaxi.Segment = yaxi.Control.extend(function (Class, base) {



	var create = Object.create;

    var thumb = '<svg class="yx-segment-thumb" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>'


    yaxi.template(this, '<div class="yx-control yx-segment"><div class="yx-segment-line"></div><div class="yx-segment-body">' + thumb + '</div>');




    Class.ctor = function (values) {

        var init;

        // 初始化存储值
        this.$storage = create(this.$defaults);

        if (init = this.init)
		{
			init.apply(this, arguments);
        }
        
        if (values)
        {
            this.assign(values);
        }

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchcancel);
    }




    // 当前值
    this.$property('value', 0);


    // 步进(为零时只能落在分段上)
    this.$property('step', 0, false);


    // 分段数
    this.$property('segments', {
    
        defaultValue: null,

        converter: function (value) {

            if (value)
            {
                if (value > 0)
                {
                    var array = [0],
                        decimal = Decimal.singleton,
                        split = decimal(100).div(value);

                    array[value] = 100;

                    for (var i = value; i--;)
                    {
                        array[i] = decimal(split).mul(i).value;
                    }
                    
                    value = array;
                }
                else if (!(value instanceof Array) || !value.length)
                {
                    value = null;
                }
            }

            this.__segments = value;
            return value;
        }
    });

    
    // 空间
    this.$property('space', '');



    // 获取当前索引
    Object.defineProperty(this, 'index', {
        
        get: function () {

            var segments = this.__segments;

            if (segments)
            {
                var value = this.value;

                for (var i = segments.length; i--;)
                {
                    if (i === 0 || value >= segments[i] - (segments[i] - segments[i - 1] >> 1))
                    {
                        return i;
                    }
                }
            }

            return -1;
        }
    });




    var renderer = this.renderer;


    renderer.value = function (dom, value) {

        dom.lastChild.lastChild.style.left = value + '%';
    }


    renderer.segments = function (dom, value) {

        value = value ? render.call(this, value) : '';

        dom.lastChild.innerHTML = value + thumb;
        dom.lastChild.lastChild.style.left = this.value + '%';
    }


    renderer.space = function (dom, value) {

        dom = dom.firstChild;

        while (dom)
        {
            dom.style.left = dom.style.right = value;
            dom = dom.nextSibling;
        }
    }



    function render(segments) {

        var array = [];

        this.__segments = segments;

        for (var i = 0, l = segments.length; i < l; i++)
        {
            array.push('<svg class="yx-segment-node" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="left:',
                segments[i],
                '%;"><circle cx="50" cy="50" r="50" /><circle cx="50" cy="50" r="40" /></svg>');
        }

        return array.join('');
    }




    var state = {};


    function touchstart(event) {

        var target = event.dom,
            dom = this.$dom.lastChild;

        state.left = dom.getBoundingClientRect().left;
        state.width = dom.offsetWidth;

        while (target && target !== dom)
        {
            if (target.classList && target.classList.contains('yx-segment-thumb'))
            {
                state.thumb = target;
                event.stop();

                return false;
            }

            target = target.parentNode;
        }
    }


    function touchmove(event) {

        var thumb = state.thumb;

        if (thumb)
        {
            thumb.style.left = (event.clientX - state.left) * 100 / state.width + '%';
            event.stop();

            return false;
        }
    }


    function touchend(event) {

        var value = Decimal.singleton(event.clientX).plus(-state.left).pow(2).div(state.width),
            any;

        state.thumb = null;

        if (value <= 0)
        {
            value = 0;
        }
        else if (value >= 100)
        {
            value = 100;
        }
        else if (any = this.step) // 指定步进
        {
            value = Decimal(any).mul(Math.round(value / any));
        }
        else if (any = this.__segments) // 强制到最新的节点
        {
            for (var i = any.length; i--;)
            {
                if (i === 0 || value >= any[i] - (any[i] - any[i - 1] >> 1))
                {
                    value = any[i];
                    break;
                }
            }
        }

        if (this.$storage.value !== value)
        {
            this.value = value;

            this.trigger('change', {
                index: this.index,
                value: value
            });
        }
        else
        {
            this.renderer.value(this.$dom, value);
        }

        event.stop();
        return false;
    }


    function touchcancel() {

        this.renderer.value(this.$dom, this.value);
    }



}).register('Segment');
