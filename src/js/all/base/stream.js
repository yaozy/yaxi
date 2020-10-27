yaxi.Stream = Object.extend(function (Class) {



    // 从promise对象转成stream流
    Class.fromPromise = function (promise) {

        let stream = new Stream();

        setTimeout(function () {

            promise.then(function (value) {

                stream.resolve(value);
            });
    
            promise.catch(function (err) {
    
                stream.reject(err);
            });

        }, 0);

        return stream;
    }


    Class.resolve = function (value) {

        let stream = new Stream();

        setTimeout(function () {

            stream.resolve(value);

        }, 0);

        return stream;
    }



    /**
     * 成功执行, 继续下一任务流
     * 
     * @param {any} value 往后传递的值
     * @return {Stream} 当前实例
     */
    this.resolve = function (value) {

        let next, fn;

        if (next = this.__next)
        {
            try
            {
                if (fn = this.__done)
                {
                    fn.call(this, value, next);
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
        else
        {
            this.__value = [value];
        }
    }


    /**
     * 执行失败, 往后传递错误
     * 
     * @param {any} err 当前任务实例
     * @return {Stream} 当前实例
     */
    this.reject = function (err) {

        let next, fn;

        if (next = this.__next)
        {
            try
            {
                if (fn = this.__fail)
                {
                    fn.call(this, err, next);
                }
                else
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
            console.error(err);
        }
    }


    /**
     * 添加处理
     * @param {Function} done 成功处理 
     * @param {Function} fail 失败处理
     */
    this.push = function (done, fail) {

        if (typeof done === 'function')
        {
            this.__done = done;

            if (done = this.__value)
            {
                this.__value = void 0;

                setTimeout(function () {

                    this.resolve(done[0]);

                }.bind(this));
            }
        }
        
        if (typeof fail === 'function')
        {
            this.__fail = fail;
        }

        return this.__next = new this.constructor();
    }


    /**
     * 注册继续任务处理方法
     * 
     * @param {Function} fn 任务处理函数
     * @return {Stream} 当前实例
     */
    this.then = function (fn) {

        return this.push(function (value, next) {
            
            let result;

            // promise
            if (result = fn(value))
            {
                result.then(function (value) {

                    if (value !== false)
                    {
                        next.resolve(value);
                    }
                });

                result.catch(function (err) {

                    next.reject(err);
                });
            }
            else if (result !== false)
            {
                next.resolve(value);
            }
        });
    }


    /**
     * 注册失败处理方法
     * 
     * @param {Function} fn 失败处理函数
     * @return {Stream} 当前实例
     */
    this.catch = function (fn) {

        return this.push(null, function (err, next) {
            
            let result;

            // promise
            if (result = fn(err))
            {
                result.finally(function (value) {

                    if (value !== false)
                    {
                        next.reject(err);
                    }
                });
            }
            else if (result !== false)
            {
                next.reject(err);
            }
        });
    }


    /**
     * 任务值转换
     * 注: 执行结果作为后续任务流输入值直到被其它值覆盖
     * 
     * @param {Function} fn 转换函数
     * @return {Stream} 当前实例
     */
    this.map = function (fn) {

        return this.push(function (value, next) {
            
            value = fn(value);

            // promise
            if (value && typeof value.catch === 'function')
            {
                value.then(function (value) {

                    next.resolve(value);
                });

                value.catch(function (err) {

                    next.reject(err);
                });
            }
            else
            {
                next.resolve(value);
            }
        });
    }


    /**
     * 注册任务值json处理
     * 注: 执行结果作为后续任务流输入值直到被其它值覆盖
     * 
     * @return {Stream} 当前实例
     */
    this.json = function () {

        return this.push(function (value, next) {
            
            if (typeof value === 'string')
            {
                value = JSON.parse(value);
            }

            next.resolve(value);
        });
    }


    /**
     * 注册延时处理
     * 
     * @param {int|undefined} time 延时时间, 默认为0
     * @return {Stream} 当前实例
     */
    this.delay = function (time) {

        return this.push(function (value, next) {
            
            setTimeout(function () {

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

            this.push(function (value) {

               resolve(value) 

            }, function (err) {

                reject(err)
            });
        });
    }



    
}, function Stream() {});
