yaxi.SlideBox.renderer(function (base, thisControl, yaxi) {



    var width = 0;



    this.className = 'yx-control yx-box yx-slidebox';
    



    thisControl.__start = function () {

        var view = this.$view.firstChild;

        width = view ? view.offsetWidth : 0;
        document.body.classList.add('yx-noscroll');
    }


    thisControl.__move = function (distance) {

        var indexes = this.__indexes;
        var children = this.__children;

        for (var i = indexes.length; i--;)
        {
            children[indexes[i]].$view.style.transform = 'translateX(' + ((i + 1) * width + distance) + 'px)';
        }
    }


    thisControl.__stop = function () {

        document.body.classList.remove('yx-noscroll');
    }


});
