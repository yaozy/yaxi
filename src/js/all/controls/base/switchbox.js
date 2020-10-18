yaxi.Box.extend('SwitchBox', function (Class, base, yaxi) {



    // 扩展切换容器接口
    yaxi.impl.switchbox.call(this);



    // 重载取消坐标变换处理
    this.__transform = function () {
    }



    this.__switch = function (switchbox, index, oldIndex) {

        var children = switchbox.__children;
        var control;

        if (control = oldIndex >= 0 && children[oldIndex])
        {
            control.onhide && control.onhide();
            control.hidden = true;
        }
    
        if (control = children[index])
        {
            if (!control.__shown)
            {
                control.__shown = true;
                control.onload && control.onload();
            }

            control.onshow && control.onshow();
            control.hidden = false;
        }
    }



}, function SwitchBox() {


    yaxi.Box.apply(this, arguments);


});
