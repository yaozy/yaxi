var k = Object.create(null);


k.__bindings = Object.create(null);

k.__cache = Object.create(null);



k.__bind = function (name, chart) {

    var bindings = this.__bindings,
        any;
        
    if (any = bindings[name])
    {
        any.push(chart);
    }
    else
    {
        bindings[name] = [chart];
    }

    if (any = this.__cache[name])
    {
        for (var name in any)
        {
            chart[name] = any[name];
        }

        chart.update();
    }
}


k.__unbind = function (name, chart) {

    var bindings = this.__bindings,
        items;
        
    if (items = bindings[name])
    {
        for (var i = items.length; i--;)
        {
            if (items[i] === chart)
            {
                items.splice(i, 1);
                break;
            }
        }
    }
}


k.__notify = function (name, type, value) {

    var bindings = this.__bindings,
        cache = this.__cache[name];

    if (cache)
    {
        cache[type] = value;
    }
    else
    {
        (cache[name] = {})[type] = value;
    }

    if (bindings = bindings[name])
    {
        var index = 0,
            chart;

        while (chart = bindings[index++])
        {
            chart[type] = value;
            chart.update();
        }
    }
}



k.data = function (name, data) {

    this.__notify(name, 'data', data);
}


k.moveTo = function (name, position) {

    this.__notify(name, 'position', position);
}


k.scaleTo = function (name, scale) {

    this.__notify(name, 'scale', scale);
}



k.push = function (name, data) {


}
