// 更新补丁
(function () {



    var patches = yaxi.__patches = [];

    var delay = 0;



    function update() {

        var list = patches,
            index = 0,
            item;

        while (item = list[index++])
        {
            item.__update_patch();
        }

        list.length = delay = 0;
        list = list.after;

        index = 0;

        yaxi.trigger('yaxi-check-layout');
    }


    
    yaxi.__observe_patch = function (target) {

        if (!delay)
        {
            delay = setTimeout(update);
        }

        patches.push(target);

        return target.__changes = {};
    }


    yaxi.__add_patch = function (target) {

        if (!delay)
        {
            delay = setTimeout(update);
        }

        patches.push(target);
    }



})();
