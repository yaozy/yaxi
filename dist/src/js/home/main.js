const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');
const MainBand = require('./main-band');



module.exports = yaxi.Box.extend(function (Class, base) {



    function render(data) {

        var children = this.find('>>@host').children;
        var list = [];

        for (var name in data)
        {
            list.push(new MainBand(data[name]));
        }

        children.clear();
        children.push.apply(children, list);
    }



    this.init = function () {

        this.loadTemplate(template);
        yaxi.http.get('home').json(render.bind(this));
    }


    this.handleSearch = function (event) {

        var tab = this.parent.find('>>Tab');

        console.log(tab)
    }


});
