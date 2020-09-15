const yaxi = require('../../yaxi/js/yaxi');
const template = require('./main.html');
const lessonItemTemplate = require('./lesson-item.html');



module.exports = yaxi.Box.extend(function (Class, base) {

    

    function render(data) {

        var children = this.find('>>@host').children;
        var list = [];

        for (var name in data)
        {
            list.push(lessonItemTemplate.call(data[name]));
        }

        children.clear();
        children.push.apply(children, list);
    }


    this.init = function () {

        this.loadTemplate(template);
        yaxi.http.get('lesson').json(render.bind(this));
    }


});
