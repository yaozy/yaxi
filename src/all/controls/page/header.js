yaxi.Header = yaxi.ContentControl.extend(function (Class, base) {


    // 标记不能被继承
    Class.sealed = true;


    Class.allowParent = function (parent) {

        if (parent instanceof yaxi.Page)
        {
            return true;
        }

        throw 'Header can only add to Page!';
    }



    // 图标
    this.$property('icon', '');


    this.__on_tap = function (event) {

        if (event.key === 'back')
        {
            var root = this.root;

            if (root && root.close)
            {
                root.close();
            }
        }
    }


}, function Header() {

    yaxi.Control.apply(this, arguments);

}).register('Header');
