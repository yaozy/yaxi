
(function (buffer) {


    buffer.fromString = function (value, callback) {

        var data = new Blob([value], { type: 'text/plain' });
        var file = new FileReader();

        file.onload = function () {
            
            callback(this.result);
        }

        file.readAsArrayBuffer(data);
    }


    buffer.toString = function (buffer, callback) {

        var reader = new FileReader();
        
        buffer = new Blob([buffer]);

        reader.onload = function () {

            callback(this.result)
        };

        reader.readAsText(buffer, 'utf-8');
    }


    buffer.fromBase64 = function (value) {

        var data = window.atob(value);
        var length = data.length;
        var array = new Uint8Array(length);
 
        for (var i = 0; i < length; ++i)
        {
            array[i] = data.charCodeAt(i);
        }

        return array.buffer;
    }


    buffer.toBase64 = function (buffer) {

        var bytes = new Uint8Array(buffer);
        var length = bytes.byteLength;
        var result = new Array(length);

        for (var i = 0; i < length; i++)
        {
            result[i] = String.fromCharCode(bytes[i]);
        }

        return window.btoa(result.join(''));
    }


})(yaxi.buffer = Object.create(null));

