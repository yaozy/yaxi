yaxi.RadioGroup = yaxi.Box.extend(function (Class, base) {



    this.__on_tap = function (event) {

        var target = event.target;

        if (target.parent === this && !target.checked && this.trigger('changing') !== false)
        {
            var children = this.children;

            for (var i = children.length; i--;)
            {
                children[i].checked = children[i] === target;
            }
        }
    }
    


}, function RadioGroup() {


    yaxi.Box.apply(this, arguments);
    

}).register('RadioGroup');
