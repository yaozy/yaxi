yaxi.Loading.renderer(function (base) {


    this.className = 'yx-control yx-loading';


    this.template('<div class="@class">' +

        (function () {
            
            var list = new Array(12);

            for (var i = 1; i < 13; i++)
            {
                list.push('<div class="yx-loading-box yx-loading-box' + i + '"><div class="yx-loading-dot yx-loading-dot' + i + '"></div></div>');
            }

            return list.join('');

        })() +
        '</div>');



    this.color = function (control, view, value) {

        view = view.firstChild;

        while (view)
        {
            view.firstChild.style.backgroundColor = value;
            view = view.nextSibling;
        }

        return null;
    }


});
