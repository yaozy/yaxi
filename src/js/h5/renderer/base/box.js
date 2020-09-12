yaxi.Box.mixin(function (mixin, base) {


    
    yaxi.template(this, '<div class="$class"></div>');




    this.render = function () {

        var view = base.render.call(this),
            children = this.__children,
            index = 0,
            control;

        while (control = children[index++])
        {
            view.appendChild(control.render());
        }

        return view;
    }


    
    this.patch = function (view) {

        var children = this.__children,
            control,
            length;

        base.patch.call(this, view);

        if (children.__last)
        {
            children.__last = null;
            patch(children, view);
        }

        if ((length = children.length) > 0)
        {
            for (var i = 0; i < length; i++)
            {
                if ((control = children[i]) && control.__dirty && (view = control.$view))
                {
                    control.patch(view);
                }
            }
        }
    }


    function patch(children, view) {

        var refChild = view.firstChild;
        var index = 0;
        var control;
        var newChild;

        while (control = children[index++])
        {
            if (newChild = control.$view)
            {
                if (newChild !== refChild)
                {
                    view.insertBefore(newChild, refChild);
                }
                else
                {
                    refChild = refChild.nextSibling;
                }
            }
            else
            {
                view.insertBefore(control.render(), refChild);
            }
        }

        while (refChild)
        {
            newChild = refChild;
            refChild = refChild.nextSibling;

            view.removeChild(newChild);
        }
    }



});
