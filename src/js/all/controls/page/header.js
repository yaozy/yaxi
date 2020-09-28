yaxi.component('Header', function (Class, base) {



    // 标记不能被继承
    Class.sealed = true;



    Class.allowParent = function (parent) {

        if (parent && parent.isTopLevel)
        {
            return true;
        }

        throw new Error('Header can only add to top level control!');
    }




    // 图标
    this.$('icon', '');


    this.__on_tap = function (event) {

        if (event.flag === 'back')
        {
            this.parent.close('Back');
        }
    }


});
