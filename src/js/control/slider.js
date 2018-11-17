yaxi.Slider = yaxi.Control.extend(function (Class, base) {



	var create = Object.create;

    var thumb = '<svg class="yx-slider-thumb" aria-hidden="true"><use xlink:href="#icon-circle"></use></svg>';



    yaxi.template(this, '<div class="yx-control yx-slider"><div class="yx-slider-line"></div><div class="yx-slider-body">' + thumb + '</div>');




    Class.ctor = function (data) {

        // 初始化存储值
        this.$storage = create(this.__defaults);

        if (data)
        {
            this.__init(data);
        }

        this.on('touchstart', touchstart);
        this.on('touchmove', touchmove);
        this.on('touchend', touchend);
        this.on('touchcancel', touchcancel);
    }




    // 最小值
    this.$property('min', 0);


    // 最大值
    this.$property('max', 100);


    // 当前值
    this.$property('value', 0);


    // 步进
    this.$property('step', 1);


    // 分段
    this.$property('steps', null);


    // 是否强制到分段值
    this.$property('force', true);

    
    // 空间
    this.$property('space', '');




    this.__set_value = function (dom, value) {

        var min = this.min;
        dom.lastChild.lastChild.style.left = (value - min) * 100 / (this.max - min) + '%';
    }


    this.__set_steps = function (dom, value) {

        value = value && value.length > 0 ? render.call(this, value) : '';
        dom.lastChild.innerHTML = value + thumb;
    }


    this.__set_space = function (dom, value) {

        dom = dom.firstChild;

        while (dom)
        {
            dom.style.left = dom.style.right = value;
            dom = dom.nextSibling;
        }
    }



    function render(steps) {

        var array = [],
            min = this.min,
            max = this.max,
            long = max - min;

        for (var i = 0, l = steps.length; i < l; i++)
        {
            array.push('<svg class="yx-slider-node" aria-hidden="true" style="left:',
                (steps[i] - min) * 100 / long,
                '%;"><use xlink:href="#icon-hollow-circle"></use></svg>');
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
            if (target.classList && target.classList.contains('yx-slider-thumb'))
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

        var value = (event.clientX - state.left) / state.width,
            any;

        state.thumb = null;

        if (value < 0)
        {
            value = 0;
        }
        else if (value > 1)
        {
            value = 1;
        }

        value = (any = this.min) + (this.max - any) * value;

        if (any = this.step)
        {
            value = any * Math.round(value / any);
        }

        if (this.force && (any = this.steps))
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
            this.trigger('change', { value: value });
        }
        else
        {
            this.__set_value(this.$dom, value);
        }

        event.stop();
        return false;
    }


    function touchcancel() {

        this.__set_value(this.$dom, this.value);
    }



}).register('Slider');
