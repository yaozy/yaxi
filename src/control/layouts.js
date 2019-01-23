
(function (layouts) {



    function same(children, name) {

        var length = children.length,
            value = (1000000 / length | 0) / 10000 + '%';

        for (var i = 0; i < length; i++)
        {
            var style = children[i].$dom.style;

            if (style[name] !== value)
            {
                style[name] = value;
            }
        }
    }


    function sameGap(children, name, total, gap) {

        var margin = name === 'width' ? 'marginLeft' : 'marginTop',
            length = children.length,
            style,
            size;

        total -= gap * length;

        for (var i = 0; i < length; i++)
        {
            style = children[i].style;
            style[margin] = i > 0 ? gap + 'px' : 0;

            size = total / (length - i) + .5 | 0;
            total -= size;

            style[name] = size + 'px';
        }
    }



    layouts['same-width'] = function (children, dom, gap) {

        if (gap > 0)
        {
            sameGap(children, 'width', dom.clientWidth, gap);
        }
        else
        {
            same(children, 'width', length);
        }
    }



    layouts['same-height'] = function (children, dom, gap) {

        if (gap > 0)
        {
            sameGap(children, 'height', dom.clientHeight, gap);
        }
        else
        {
            same(children, 'height', length);
        }
    }



})(yaxi.layouts = Object.create(null));
