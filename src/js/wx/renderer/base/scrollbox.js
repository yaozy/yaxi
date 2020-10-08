yaxi.ScrollBox.renderer(function (base) {


  
    // 分开渲染layout类的class
    this.renderClasses = function () {

        this.renderSplit1.apply(this, arguments);
    }


    // 分开渲染容器类的样式
    this.renderStyles = this.renderSplit2;
    

});
