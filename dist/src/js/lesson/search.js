const yaxi = require('../../yaxi/js/yaxi');
const template = require('./search.html');


module.exports = yaxi.Box.extend(function () {


    var model = yaxi.store1 = new (yaxi.model({

        last: '',
        text: '',

        hidden: true,

        empty: function () {

            return !this.text;
        }

    }))();


    var data;


    this.init = function (size) {

        this.load(template(this, {

            size: size || '100%'

        }), model);
    }



    this.max = 8;



    function loadData(search, value) {

        var list = data = [];

        for (var i = 1, l = search.max || 8; i <= l; i++)
        {
            list.push({
                before: '课程',
                after: '章节' + i
            });
        }

        model.hidden = !value;
        model.text = value;

        search.find('>>@search-body').data = list;
    }


    this.handleInput = function (event) {

        loadData(this, event.value);
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

        loadData(this, model.text);
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

        var item = +event.source.tag;

        if (item >= 0 && (item = data[item]))
        {
            raiseEvent(this, item.before + model.text + item.after);
        }
    }



});
