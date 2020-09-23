yaxi.Header.renderer(function (renderer, base) {



    renderer.onchange = function (view, prefix) {

        view[prefix + 'back'] = yaxi.currentPages.length > 1;
    }



});
