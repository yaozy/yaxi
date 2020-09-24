yaxi.FloatLayer.renderer(function (base) {



    // 重载layout把属性设置到子容器上
    this.layout = function (control, view, prefix, value) {

        view[prefix + 'layout'] = value ? 'yx-layout-' + value.replace(/\s+/g, ' yx-layout-') : '';
    }



});
