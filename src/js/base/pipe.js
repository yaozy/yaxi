yaxi.pipe = (function () {



    var pipes = Object.create(null);

    var caches = Object.create(null);


    var decimal = Decimal.singleton;



    pipes.fixed = function (value, count) {

        return decimal(value).toFixed(count);
    }



    function compile(expression) {

        var tokens = text.match(/"[^"]"|[|:]|\w+/g);

        if (tokens)
        {
            
        }
        else
        {
            expression = true;
        }

        return caches[expression] = tokens;
    }


    // user.name|currency:2|round:2
    function pipe(expression, value) {

        var list;

        if (expression && (list = caches[expression] || compile(expression)) && list !== true)
        {
            var index = 0,
                token;

            while (token = pipe[index])
            {

            }
        }
    }


    pipe.register = function (name, fn) {

        if (name && typeof fn === 'function')
        {
            pipes[name] = fn;
        }
    }


    return pipe;


})();
