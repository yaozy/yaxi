yaxi.Tab = yaxi.Panel.extend(function (Class, base) {


    
    yaxi.template(this, '<div class="yx-control yx-panel yx-tab"></div>');


    
    Class.ctor = function (data) {

        base.constructor.ctor.call(this, data);
        this.on('tap', handleTap.bind(this));
    }



    function handleTap(event) {

        var target = event.target;

        while (target && target !== this)
        {
            if (target.parent === this)
            {
                if (target.theme !== 'primary')
                {
                    var children = this.children,
                        last;

                    for (var i = children.length; i--;)
                    {
                        if ((last = children[i]) && last.theme === 'primary')
                        {
                            last.theme = '';
                            break;
                        }
                    }

                    target.theme = 'primary';

                    this.trigger('selected-change', {

                        current: target,
                        last: last
                    });
                }

                break;
            }

            target = target.parent;
        }
    }

    

}).register('Tab');
