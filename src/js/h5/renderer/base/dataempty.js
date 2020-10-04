yaxi.DataEmpty.renderer(function (base) {



    this.className = 'yx-control yx-dataempty';


    this.template('<div class="@class"><div class="yx-icon icon-common-nodata"></div><div class="yx-dataempty-text">暂无数据</div></div>')




    this.text = function (control, view, value) {

        view.lastChild.textContent = value;
    }

    

});
