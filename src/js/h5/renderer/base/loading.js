yaxi.Loading.renderer(function (base) {


    this.className = 'yx-control yx-loading';


    this.template('<div class="@class">' +

        (function () {
            
            var list = new Array(12);

            for (var i = 1; i < 13; i++)
            {
                list.push('<div class="yx-loading-dot yx-loading-dot' + i + ' icon-common-dot"></div>');
            }

            return list.join('');

        })() +

        '</div>');


});
