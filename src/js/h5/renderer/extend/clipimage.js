yaxi.ClipImage = yaxi.Control.extend(function (Class, base) {



    yaxi.template(this, '<div class="$class">' +
            '<div class="yx-clipimage-mask"></div>' +
            '<div class="yx-clipimage-box">' +
                '<div class="yx-clipimage-tl"></div>' +
                '<div class="yx-clipimage-tr"></div>' +
                '<div class="yx-clipimage-bl"></div>' +
                '<div class="yx-clipimage-br"></div>' +
            '</div>' +
        '</div>');



    // 图片路径
    this.$property('src', '');


    // 高宽比
    this.$property('ratio', .75);




    var state = {};


    function resizeMask(view) {

        var box = view.lastChild,
            size = 100 * yaxi.rem,
            w = view.clientWidth,
            h = view.clientHeight,
            x = size - w / 2,
            y = size - h / 2;

        box.previousSibling.style.borderWidth = [
            y + box.offsetTop + .5 | 0,
            x + w - box.offsetLeft - box.offsetWidth + .5 | 0,
            y + h - box.offsetTop - box.offsetHeight + .5 | 0,
            x + box.offsetLeft + .5 | 0
        ].join('px ') + 'px';
    }


    function move(x, y) {

        var style = this.$view.lastChild.style;

        style.top = state.top + y + 'px';
        style.left = state.left + x + 'px';
    }


    function resize_tl(x, y) {

        var style = this.$view.lastChild.style,
            width = state.width,
            height = state.height,
            minWidth = state.minWidth,
            minHeight = state.minHeight;

        if (width - x < minWidth)
        {
            x = width - minWidth;
        }

        if (height - y < minHeight)
        {
            y = height - minHeight;
        }

        style.top = state.top + y + 'px';
        style.left = state.left + x + 'px';
        style.width = width - x + 'px';
        style.height = height - y + 'px';
    }


    function resize_tr(x, y) {
        
        var style = this.$view.lastChild.style,
            width = state.width,
            height = state.height,
            minWidth = state.minWidth,
            minHeight = state.minHeight;

        if (width + x < minWidth)
        {
            x = minWidth - width;
        }

        if (height - y < minHeight)
        {
            y = height - minHeight;
        }

        style.top = state.top + y + 'px';
        style.width = width + x + 'px';
        style.height = height - y + 'px';
    }


    function resize_bl(x, y) {
        
        var style = this.$view.lastChild.style,
            width = state.width,
            height = state.height,
            minWidth = state.minWidth,
            minHeight = state.minHeight;

        if (width - x < minWidth)
        {
            x = width - minWidth;
        }

        if (height + y < minHeight)
        {
            y = minHeight - height;
        }

        style.left = state.left + x + 'px';
        style.width = width - x + 'px';
        style.height = height + y + 'px';
    }


    function resize_br(x, y) {

        var style = this.$view.lastChild.style,
            width = state.width,
            height = state.height,
            minWidth = state.minWidth,
            minHeight = state.minHeight;

        if (width + x < minWidth)
        {
            x = minWidth - width;
        }

        if (height + y < minHeight)
        {
            y = minHeight - height;
        }
        
        style.width = width + x + 'px';
        style.height = height + y + 'px';
    }


    this.__on_touchstart = function (event) {

        var view = this.$view.lastChild,
            top = view.offsetTop,
            left = view.offsetLeft,
            width = view.offsetWidth,
            height = view.offsetHeight,
            ratio = state.ratio = this.ratio,
            style = view.style;

        style.marginTop = style.marginLeft = 0;

        style.top = (state.top = top) + 'px';
        style.left = (state.left = left) + 'px';
        style.width = (state.width = width) + 'px';
        style.height = (state.height = height) + 'px';

        state.tag = 0;
        state.minWidth = state.minHeight = yaxi.rem >> 1;
        state.maxWidth = (view = this.$view).clientWidth;
        state.maxHeight = view.clientHeight;

        if (ratio >= 1)
        {
            state.minHeight = state.minWidth * ratio + .5 | 0;
            state.maxHeight = state.maxWidth * ratio + .5 | 0;
        }
        else if (ratio > 0)
        {
            state.minWidth = state.minHeight / ratio + .5 | 0;
            state.maxWidth = state.maxHeight / ratio + .5 | 0;
        }

        switch (event.view.className)
        {
            case 'yx-clipimage-tl':
                state.fn = resize_tl;
                break;

            case 'yx-clipimage-tr':
                state.fn = resize_tr;
                state.tag = 1;
                break;

            case 'yx-clipimage-bl':
                state.fn = resize_bl;
                state.tag = 1;
                break;

            case 'yx-clipimage-br':
                state.fn = resize_br;
                break;

            default:
                state.fn = move;
                break;
        }
    }


    this.__on_touchmove = function (event) {

        var fn = state.fn,
            x = event.distanceX,
            y = event.distanceY,
            r = state.ratio;

        if (r > 0 && fn !== move)
        {
            y = x * r + .5 | 0;
            
            if (state.tag)
            {
                y = -y;
            }
        }

        fn.call(this, x, y);
        resizeMask(this.$view);
    }



    this.toCanvas = function () {

        var view = this.$view,
            img;

        if (view && (img = view.firstChild).tagName === 'IMG')
        {
            var canvas = document.createElement('canvas'),
                box = view.lastChild,
                width = view.clientWidth,
                height = view.clientHeight,
                size = img.size,
                x,
                y,
                s;

            // 宽度充满
            if (height / width >= size[1] / size[0])
            {
                // 缩放比
                s = size[0] / width;

                width = box.offsetWidth * s;
                height = width * this.ratio;
            }
            else // 高度充满
            {
                // 缩放比
                s = size[1] / height;

                height = box.offsetHeight * s;
                width = height / this.ratio;
            }

            // 居中对齐的坐标
            x = size[0] - width >> 1;
            y = size[1] - height >> 1;

            // 加上盒子偏移中心线的距离
            x += (box.offsetLeft + box.offsetWidth / 2 - view.offsetWidth / 2) * s | 0;
            y += (box.offsetTop + box.offsetHeight / 2 - view.offsetHeight / 2) * s | 0;

            canvas.width = width = width + .5 | 0;
            canvas.height = height = height + .5 | 0;

            canvas.getContext('2d').drawImage(img, -x, -y);

            return canvas;
        }
    }


    function compress(source, width, height) {

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        if (width)
        {
            height = source.height * width / source.width | 0;
        }
        else
        {
            width = source.width * height / source.height | 0;
        }
    
        canvas.width = width;
        canvas.height = height;
    
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    
        context.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
    
        return canvas;
    }


    this.toDataURL = function (type, quality, width, height) {

        var canvas = this.toCanvas();

        if (width > 0)
        {
            if (width < canvas.width)
            {
                canvas = compress(canvas, width);
            }
        }
        else if (height > 0 && height < canvas.height)
        {
            canvas = compress(canvas, 0, height);
        }

        return canvas.toDataURL(type, quality);
    }



    this.$mixin.src = function (view, value) {

        var img = document.createElement('img');

        img.setAttribute('crossOrigin', 'anonymous');

        img.onload = function () {

            this.size = [this.width, this.height];
            view.insertBefore(img, view.firstChild);
        };

        img.src = value;
    }


    this.$mixin.ratio = function (view, value) {

        if (value > 0)
        {
            var style = view.lastChild.style;

            style.height = Decimal.singleton(value).mul(2) + 'rem';
            style.marginTop = -value + 'rem';
        }
    }



}).register('ClipImage');
