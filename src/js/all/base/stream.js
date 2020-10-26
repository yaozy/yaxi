yaxi.Stream = Object.extend(function (Class) {



    // 从promise对象转成stream流
    Class.fromPromise = function (promise) {

        var stream = new Stream();

        setTimeout(function () {

            promise.then(value => {

                stream.resolve(value);
            });
    
            promise.catch(err => {
    
                stream.reject(err);
            });

        }, 0);

        return stream;
    }



    this.resolve = function (value) {

        var next, fn;

        if (next = this.__next)
        {
            try
            {
                if (fn = this.__fn)
                {
                    if (fn = fn.call(this, value, next))
                    {
                        fn.then(function (value) {

                            next.resolve(value);
                        });

                        fn.catch(function (err) {

                            next.reject(err);
                        });
                    }
                }
                else
                {
                    next.resolve(value);
                }
            }
            catch (err)
            {
                next.reject(err);
            }
        }
    }



    this.reject = function (err) {

        let next, fn;

        if (next = this.__next)
        {
            try
            {
                if ((fn = this.__fail) && (fn = fn.call(this, err, next)))
                {
                    fn.catch(function (err) {

                        next.reject(err);
                    });
                }
                else if (fn !== false)
                {
                    next.reject(err);
                }
            }
            catch (err)
            {
                next.reject(err);
            }
        }
        else
        {
            throw err;
        }
    }



    this.then = function (fn) {

        if (typeof fn === 'function')
        {
            this.__fn = fn;
            return this.__next = new this.constructor();
        }
        
        throw 'method then must be a function!';
    }



    this.catch = function (fn) {

        if (typeof fn === 'function')
        {
            this.__fail = fn;
            return this.__next = new this.constructor();
        }
        
        throw 'method catch must be a function!';
    }



    this.map = function (fn) {

        return this.then(function (value, next) {
            
            next.resolve(fn(value));
        });
    }



    this.json = function () {

        return this.then(function (value, next) {
            
            if (typeof value === 'string')
            {
                value = JSON.parse(value);
            }

            next.resolve(value);
        });
    }



    this.delay = function (time) {

        return this.then(function (value, next) {
            
            setTimeout(() => {

                next.resolve(value);

            }, time | 0);
        });
    }


    /**
     * 转换成Promise对象
     * @return {Promise} promise对象
     */
    this.toPromise = function () {

        return new Promise(function (resolve, reject) {

            this.then(value => {

                resolve(value);
            });

            this.catch(err => {

                reject(err);
            });

        }.bind(this));
    }


    
}, function Stream() {});
