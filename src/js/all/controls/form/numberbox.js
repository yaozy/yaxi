yaxi.TextBox.extend('NumberBox', function () {



    this.$('name', '');
    

    // 是否显示button
    this.$('button', false);


    // 当前值
    this.$('value', 0, {
    
        convert: function (value) {

            var any;

            value = +value || 0;

            if (value < (any = this.min))
            {
                return any;
            }

            if (value > (any = this.max))
            {
                return any;
            }

            return value;
        }
    });

    

    // 最小值
    this.$('min', -Infinity, false);


    // 最大值
    this.$('max', Infinity, false);


    // 加减步进
    this.$('step', 1);



}, function NumberBox() {

    
    yaxi.Control.apply(this, arguments);


});
