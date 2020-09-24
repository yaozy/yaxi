yaxi.FloatLayer.renderer(function (base) {


    
    yaxi.template(this, '<div class="$class"><div class="yx-masklayer"></div><div></div></div>');



    this.getChildrenView = function (view) {

        return view.lastChild;
    }


    // 重载layout把属性设置到子容器上
    this.layout = function (control, view, value) {

        view.lastChild.className = value ? 'yx-layout-' + value.replace(/\s+/g, ' yx-layout-') : '';
    }


});
