;(function (colors) {

    
    var create = Object.create;
    var names = 'black,white,standard,thick,thicker,thickest,light,lighter,lightest,primary,secondary,important,success,warning,danger,disabled'.split(',');

    
    colors.load = function (name, values) {

        var color = yaxi.color = colors[name] = create(null);

        parse(color, 'bg', values[0]);
        parse(color, 'text', values[1]);
        parse(color, 'line', values[2]);
    }


    function parse(color, type, values) {

        var keys = names;
        var item = create(null);

        values = values.split(',');

        for (var i = values.length; i--;)
        {
            var name = keys[i];
            var value = '#' + values[i];

            item[name] = value;
            color[type + '-' + name] = value;
        }

        color[type] = item;
    }


})(yaxi.colors = Object.create(null));


