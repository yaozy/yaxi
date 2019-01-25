yaxi.Tab = yaxi.Panel.extend(function (Class, base) {


    
    yaxi.template(this, '<div class="yx-control yx-panel yx-tab" layout="same-width"></div>');




    this.$defaults.layout = 'same-width';



    // 容器宿主
    this.$property('host', '', false);



    this.$property('selectedIndex', {

        type: 'int',
        defaultValue: -1

    }, true, 'selected-index');



    // 选中的页头
    Object.defineProperty(this, 'selectedItem', {

        get: function () {

            var index = this.selectedIndex;
            return index >= 0 && this.__children[index] || null;
        }
    });


    // 选中的页签容器
    Object.defineProperty(this, 'selectedHost', {

        get: function () {

            var index = this.selectedIndex,
                item;

            if (index >= 0 && (item = this.__children[index]))
            {
                return item.host || null;
            }

            return null;
        }
    });



    this.__on_tap = function (event) {

        var target = event.target,
            parent;

        while (target && target !== this)
        {
            parent = target.parent;

            if (parent === this)
            {
                var children = this.__children,
                    index = children.indexOf(target);

                if (this.selectedIndex !== index)
                {
                    var event = new yaxi.Event('changing');

                    event.index = index;
                    event.item = children[index];

                    if (this.trigger(event) !== false)
                    {
                        this.selectedIndex = index;
                    }
                }

                break;
            }

            target = parent;
        }
    }



    function createControl(base, url, args) {

        var Class = yaxi.loadModule(base, url),
            control,
            style;

        if (args && args.length > 0)
        {
            control = Object.create(Class.prototype);
            Class.apply(control, args);
        }
        else
        {
            control = new Class();
        }

        style = control.style;
        style.position = 'absolute';
        style.top = style.left = style.right = style.bottom = 0;

        return control;
    }




    this.renderer.selectedIndex = function (dom, value) {

        var children = this.__children,
            previous,
            item,
            host,
            start;

        if (previous = children[this.__index])
        {
            previous.theme = '';

            if (host = previous.host)
            {
                host.display = 'none';
                host.onhide && host.onhide();
            }
        }

        if (item = children[value])
        {
            item.theme = 'primary';

            if (host = item.host)
            {
                host.display = 'block';
                host.onshow && host.onshow(false);
            }
            else if (item.url && (host = this.host && this.find(this.host)) && (children = host.children)) // 打开指定url
            {
                host = createControl(this.base, item.url, item.args);

                children.push(item.host = host);
                host.onshow && host.onshow(true);

                start = true;
            }
        }
        else if (previous)
        {
            value = -1;
        }

        this.__index = value;

        
        var event = new yaxi.Event('change');

        event.last = previous;
        event.previous = previous;
        event.selected = item;
        event.start = start || false;

        this.trigger(event);
    }



    this.onshow = function (first) {

        var host = this.selectedHost;

        if (host && host.onshow)
        {
            host.onshow(first || false);
        }
    }


    this.onhide = function () {

        var host = this.selectedHost;

        if (host && host.onhide)
        {
            host.onhide();
        }
    }



    this.destroy = function () {

        var children = this.__children;

        for (var i = children.length; i--;)
        {
            children[i].host = null;
        }

        base.destroy.call(this);
    }

    


}).register('Tab');
