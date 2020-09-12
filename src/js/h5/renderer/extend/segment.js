yaxi.Segment = yaxi.Control.extend(function (Class, base) {



    var thumb = '<svg class="yx-segment-thumb" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" /></svg>'


    yaxi.template(this, '<div class="$class"><div class="yx-segment-line"></div><div class="yx-segment-body">' + thumb + '</div>');




    // 当前值
    this.$property('value', 0);


    // 步进(为零时只能落在分段上)
    this.$property('step', 0, {

        change: false
    });


    // 分段数
    this.$property('segments', null, {
    
        convert: function (value) {

            if (value)
            {
                if (value > 0)
                {
                    var array = [0],
                        decimal = Decimal.singleton,
                        split = decimal(100).div(value).value;

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
    this.$property('index', -1, {
        
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




    mixin.value = function (view, value) {

        view.lastChild.lastChild.style.left = value + '%';
    }


    mixin.segments = function (view, value) {

        value = value ? render.call(this, value) : '';

        view.lastChild.innerHTML = value + thumb;
        view.lastChild.lastChild.style.left = this.value + '%';
    }


    mixin.space = function (view, value) {

        view = view.firstChild;

        while (view)
        {
            view.style.left = view.style.right = value;
            view = view.nextSibling;
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


    this.__on_touchstart = function (event) {

        var target = event.view,
            view = this.$view.lastChild;

        state.left = view.getBoundingClientRect().left;
        state.width = view.offsetWidth;

        while (target && target !== view)
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


    this.__on_touchmove = function (event) {

        var thumb = state.thumb;

        if (thumb)
        {
            thumb.style.left = (event.clientX - state.left) * 100 / state.width + '%';
            event.stop(true);

            return false;
        }
    }


    this.__on_touchend = function (event) {

        var value = Decimal.singleton(event.clientX).plus(-state.left).pow10(2).div(state.width),
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
            var event = new yaxi.Event('change');

            this.value = value;

            event.index = this.index;
            event.value = this.value = value;
            
            this.trigger(event);
        }
        else
        {
            this.$mixin.value(this.$view, value);
        }

        event.stop(true);
        return false;
    }


    this.__on_touchcancel = function () {

        this.$mixin.value(this.$view, this.value);

        event.stop(true);
        return false;
    }



}).register('Segment');
