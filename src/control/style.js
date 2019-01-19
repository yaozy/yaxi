yaxi.Style = yaxi.Observe.extend(function (Class, base) {
    
    

    this.$defaults = Object.create(null);
    


    var keys = (function () {

        var keys = {},
            style = document.createElement('div').style,
            regex = /^(?:webkit|ms|moz|o)([A-Z])/,
            key;

        function lower(_, key) {

            return key.toLowerCase();
        }

        for (var name in style)
        {
            switch (name)
            {
                case 'cssFloat':
                case 'styleFloat':
                    keys.float = { name: name, defaultValue: '' };
                    break;

                case 'cssText':
                    break;

                default:
                    key = name.replace(regex, lower);

                    if (key === name || !keys[key])
                    {
                        keys[key] = name;
                    }
                    break;
            }
        }

        for (var name in keys)
        {
            this.$property(name, keys[name]);
        }


        return keys;


    }).call(this);



    // 给控件扩展通用样式
    var style = function (name) {

        var key = name.replace(/-(\w)/g, camelize);

        this.renderer[key] = function (dom, value) {

            dom.style[key] = value;
        }

        this.$property(key, '', true, name);

        key = keys[key] || key;

    }.bind(yaxi.Control.prototype);



    function camelize(_, text) {

        return text.toUpperCase();
    }

    
    
    ('animation,animation-delay,animation-direction,animation-duration,animation-fill-mode,animation-iteration-count,animation-name,animation-play-state,animation-timing-function,' +
        'background,background-attachment,background-blend-mode,background-clip,background-color,background-image,background-origin,background-position,background-position-x,background-position-y,background-repeat,background-repeat-y,background-size,' +
        'border,border-bottom-color,border-bottom-left-radius,border-bottom-right-radius,border-bottom-width,border-collapse,border-color,border-image-outset,border-image-repeat,border-image-slice,border-image-source,border-image-width,border-left,border-left-color,border-left-style,border-left-width,border-radius,border-right,border-right-color,border-right-style,border-right-width,border-spacing,border-style,border-top,border-top-color,border-top-left-radius,border-top-right-radius,border-top-style,border-top-width,border-width,' +
        'bottom,box-shadow,box-sizing,break-after,break-before,break-inside,caret-color,' +
        'clip,clip-path,clip-rule,color,cursor,' + 
        'direction,display,' +
        'fill,fill-opacity,fill-rule,float,' +
        'font,font-display,font-family,font-feature-settings,font-kerning,font-size,font-stretch,font-style,font-variant,font-variant-caps,font-variant-east-asian,font-variant-ligatures,font-variant-numeric,font-variation-settings,font-weight,' +
        'height,' +
        'left,' +
        'line-beak,line-height,list-style,list-style-image,list-style-position,list-style-type,' +
        'margin,margin-top,margin-left,margin-right,margin-bottom,' +
        'max-height,max-width,min-height,min-width,' +
        'object-fit,object-position,opacity,' +
        'outline,outline-color,outline-offset,outline-style,outline-width,' +
        'overflow,overflow-x,overflow-y,' +
        'padding,padding-top,padding-right,padding-bottom,padding-left,' +
        'position,' +
        'right,' +
        'speak,' +
        'stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,' +
        'top,' +
        'transform,transform-box,transform-origin,transform-style,transition,transition-delay,transition-duration,transition-property,transition-timing-function,' +
        'text-align,text-align-last,text-anchor,text-combine-upright,text-decoration,text-decoration-color,text-decoration-line,text-decoration-skip-ink,text-decoration-style,text-indent,text-orientation,text-overflow,text-rendering,text-shadow,text-size-adjust,text-transform,text-underline-position,' +
        'user-select,' +
        'vertical-align,visibility,' +
        'white-space,width,word-break,word-spacing,word-wrap,writing-mode,' +
        'z-index,zoom').split(',').forEach(function (name) {

        style(name);
        
    });

    

    this.__update_patch = function () {

        var dom, changes;

        if ((dom = this.parent) && (dom = dom.$dom) && (changes = this.__changes))
        {
            var storage = this.$storage,
                style = dom.style;

            for (var name in changes)
            {
                storage[name] = style[name] = changes[name];
            }

            this.__changes = null;
        }
    }



}, function Style(control) {

    this.parent = control;
    this.$storage = Object.create(this.$defaults);
});
