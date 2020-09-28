const yaxi = require('../../yaxi/js/yaxi');
const template = require('./exercise.html');


const arrayModel = new (yaxi.arrayModel({
    
    id: 0,

    name: '',

    time: 0,

    score: 0,

    publish: ''

}))();



module.exports = yaxi.Page.extend(function (Class, base) {



    this.init = function () {

        this.loadTemplate(template, {}, arrayModel);

        yaxi.http.get('my/exercise').json(function (data) {

            arrayModel.load(data);
        });
    }



    this.handleStart = function (event) {
        
        var model;

        if (model = arrayModel[event.source.tag])
        {
            require('./exercise-start').open(model);
        }
    }


});
