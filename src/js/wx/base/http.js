yaxi.__ajax_send = function (options) {

    var stream = new yaxi.Stream();
    
    options.success = function (res) {
        
        var status = this.statusCode || 600;

        if (status >= 100 && status < 300)
        {
            stream.resolve(res.data);
        }
        else
        {
            stream.reject({
                url: options.url,
                status: status,
                message: res.data,
                options: options
            });
        }
    }

    options.fail = function (res) {

        stream.reject({
            url: options.url,
            status: res.statusCode || 600,
            message: res.data,
            options: options
        });
    }
    
    wx.request(options);
}

