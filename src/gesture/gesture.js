yaxi.Gesture = Object.extend.call({}, function () {



    var keys = Object.create(null);



    function register(name) {

        keys[name] = this;
    }



    


    this.__class_init = function (Class) {

        Class.register = register;
    }

    
});
