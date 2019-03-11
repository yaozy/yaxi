
var globalValue = 'global';
debugger
jiac.module('thread-data.js', function (require, exports, module) {


	exports.value = 'module';
	
});


var data = require('thread-data.js');

// require('global-var.js', false);


self.syncCall = function (arg1, arg2) {

    return arg1 + data.value + arg2;
}


self.asyncCall = function (arg1, arg2, callback) {

    setTimeout(function () {

        callback(arg1 + globalValue + arg2);

    }, 0);
}


