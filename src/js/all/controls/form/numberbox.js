yaxi.NumberBox = yaxi.TextBox.extend(function () {


    // 是否显示button
    this.$property('button', false);


    // 当前值
    this.$property('value', 0, {
    
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
    this.$property('min', -Infinity, {

        change: false
    });


    // 最大值
    this.$property('max', Infinity, {

        change: false
    });


    // 加减步进
    this.$property('step', 1);


}, function NumberBox() {

    yaxi.Control.apply(this, arguments);

}).register('NumberBox');
