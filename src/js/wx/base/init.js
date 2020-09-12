;(function (yaxi) {
    
    

    var create = Object.create;

 

    yaxi.platform = 'wx';



    yaxi.wx = Object.create(null);





    // yaxi.on('yaxi-page-change', function (event) {

    //     var index = event.index;
    //     var page = event.page;
    //     var open = event.open;
    //     var data = create(null);

    //     open && update(true);

    //     event.page = null;
    //     // data[wxPagesName + '[' + index + ']'] = open ? page.render() : null;

    //     // console.log(data);

    //     if (open)
    //     {
    //         wx.navigateTo({

    //             url: '/yaxi/pages/host?uuid=' + page.uuid
    //         });
    //     }

    //     // wxPage.setData(data, function () {

    //     //     page[event.callback](index);
    //     //     open && update(false);
    //     // });
    // });



    // yaxi.wx.init = function (wxPage, wxPagesName) {


    //     var create = Object.create;

    //     var update = yaxi.__notify_update;


    //     yaxi.on('yaxi-page-change', function (event) {

    //         var index = event.index;
    //         var page = event.page;
    //         var open = event.open;
    //         var data = create(null);

    //         open && update(true);

    //         event.page = null;
    //         data[wxPagesName + '[' + index + ']'] = open ? page.render() : null;

    //         console.log(data);

    //         if (open)
    //         {
    //             wx.navigateTo({

    //                 url: '../pages/host?uuid=' + page.uuid
    //             });
    //         }

    //         // wxPage.setData(data, function () {

    //         //     page[event.callback](index);
    //         //     open && update(false);
    //         // });
    //     });


    //     yaxi.on('yaxi-page-patch', function (event) {

    //         var patches = event.payload;
    //         var data = create(null);
    //         var index = 0;
    //         var control;

    //         event.payload = null;

    //         update(true);

    //         while (control = patches[index++])
    //         {
    //             control.patch(data, wxPagesName + '[' + control.index() + ']');
    //         }

    //         console.log(data);
            
    //         wxPage.setData(data, function () {

    //             update(false);
    //         });
    //     });

    // }


    // 获取系统信息
    yaxi.wx.getSystemInfo = function (callback) {

        callback && wx.getSystemInfo({

            success: function (res) {
                
                callback(res);
            }
        });
    }


})(yaxi);

