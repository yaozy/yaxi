const yaxi = require('../../yaxi/js/yaxi');
const template = require('./search.html');


module.exports = yaxi.Box.extend(function () {


    var model = yaxi.store = new (yaxi.model({

        last: '',
        text: '',
        data: [
            {
                before: '',
                after: ''
            }
        ],

        hidden: true,

        empty: function () {

            return !this.text;
        }

    }))();


    this.init = function (size) {

        this.size = size || '100%';
        this.load(template.call(this), model);
    }



    this.max = 8;



    function loadData(value, max) {

        var data = [];

        for (var i = 1; i <= max; i++)
        {
            data.push({
                before: '课程',
                after: '章节' + i
            });
        }

        model.hidden = !value;
        model.text = value;
        model.data = data;
    }


    this.handleInput = function (event) {

        loadData(event.value, this.max || 8);
    }


    this.handleClear = function () {

        model.hidden = true;
        model.text = model.last = '';
    }


    this.handleCancel = function () {

        model.text = model.last;
        model.hidden = false;
    }


    this.handleFocus = function () {

        loadData(model.text, this.max || 8);
    }



    function raiseEvent(target, value) {

        var event = new yaxi.Event('change', { value: value });

        model.hidden = true;
        model.text = model.last = value;

        target.trigger(event);
    }


    this.handleSearch = function () {

        raiseEvent(this, model.text);
    }


    this.handleSuggest = function (event) {

        var target = event.target;
        var submodel;

        while (target)
        {
            if (submodel = target.currentModel)
            {
                raiseEvent(this, submodel.before + model.text + submodel.after);
                break;
            }

            target = target.parent;
        }
    }



});
