
yaxi.Query = Object.extend.call(Array, function (Class, base) {



    var cache = Object.create(null);



    function parse(selector) {

        var tokens = selector.match(/\<{1,2}|\>{1,2}|[#.@=]|[\w-]+/g),
            index = 0,
            token,
            key;

        while (token = tokens[index++])
        {
            if ((key = token[0]) === '<' || key === '>')
            {
                if (token = tokens[index++])
                {
                    switch (token)
                    {
                        case '@':
                        case '#':
                        case '.':
                            index++;
                            break;

                        default:
                            if (tokens[index] === '=')
                            {
                                tokens.splice(index++, 1);
                            }
                            else
                            {
                                tokens.splice(index - 1, 0, '');
                                index++;
                            }
                            break;
                    }
                }
                else
                {
                    raise(selector);
                }
            }
            else
            {
                raise(selector);
            }
        }

        return cache[selector] = tokens;
    }


    function raise(selector) {

        throw 'selector "' + selector + '" is invalid!';
    }


    Class.parse = function (selector) {

        return selector ? cache[selector] || parse(selector) : null;
    }



    
    this.find = function (selector) {
    
        if (selector = cache[selector] || parse(selector))
        {
            for (var i = this.length; i--;)
            {
                if (!this[i].__find_value(key, selector))
                {
                    this.splice(i, 1);
                }
            }
        }

        return this;
    }



    this.get = function (name) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            if ((item = item[name]) !== void 0)
            {
                return item;
            }
        }
    }


    this.set = function (name, value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item[name] = value;
        }

        return this;
    }


    this.call = function (name, args) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            var fn = item[name];

            if (fn)
            {
                if (args)
                {
                    fn.call(item);
                }
                else
                {
                    fn.apply(item, args);
                }
            }
        }

        return this;
    }



    this.hasClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.hasClass(name))
                {
                    return true;
                }
            }
        }
        
        return false;
    }


    this.addClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.addClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.removeClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.removeClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }


    this.toggleClass = function (name) {

        if (name)
        {
            var index = 0,
                item;

            while (item = this[index++])
            {
                if (item.toggleClass(name))
                {
                    return true;
                }
            }
        }

        return this;
    }



    this.style = function (name, value) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.style[name] = value;
        }

        return this;
    }


    this.on = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.on(type, listener);
        }

        return this;
    }


    this.off = function (type, listener) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.off(type, listener);
        }

        return this;
    }


    this.trigger = function (type, payload) {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.trigger(type, payload);
        }

        return this;
    }


    this.remove = function () {

        var index = 0,
            item;

        while (item = this[index++])
        {
            item.remove();
        }

        return this;
    }


});
