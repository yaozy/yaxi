var test = require('thread-test.js');



self.syncCall = function (arg1, arg2) {

    return arg1 + test.value + arg2;
}


self.asyncCall = function (arg1, arg2, callback) {

    setTimeout(function () {

        callback(arg1 + test.value + arg2);

    }, 0);
}

