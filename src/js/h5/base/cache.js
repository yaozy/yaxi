yaxi.Cache = Object.extend.call({}, function () {


    var cache = {};



    function loadData(type) {

        var data = localStorage.getItem('cache-' + type);
        return cache[type] = data && JSON.parse(data) || {};
    }


    function saveData(type, data) {

        localStorage.setItem('cache-' + type, JSON.stringify(data));
    }



    this.contains = function (key) {

        var type = this.type,
            data = cache[type] || loadData(type);

        return key in data;
    }


    this.get = function (key, defaults) {

        var type = this.type,
            data = cache[type] || loadData(type);

        if (key in data)
        {
            return data[key];
        }

        if (defaults !== void 0)
        {
            return data[key] = defaults;
        }
    }


    this.set = function (key, value, save) {

        var type = this.type,
            data = cache[type] || loadData(type);

        data[key] = value;

        if (save !== false)
        {
            saveData(type, data);
        }
    }


    this.remove = function (key, save) {

        var type = this.type,
            data = localStorage.getItem('cache-' + type);

        if (data && key in data)
        {
            delete data[key];

            if (save !== false)
            {
                saveData(type, data);
            }
        }
    }


    this.save = function () {

        var type = this.type,
            data;

        if (data = cache[type])
        {
            saveData(type, data);
        }
    }


}, function Cache(type) {

    this.type = type;
});