yaxi.Button = yaxi.Box.extend(function (Class, base) {


    
    // 内容
    this.property('text', null, {

        convert: function (value) {

            var content = this.__content;

            if (content)
            {
                this.__content = null;

                if (typeof content === 'object')
                {
                    for (var i = content.length; i--;)
                    {
                        content[i].destroy();
                    }
                }
            }

            return value;
        }
    });



}, function Button() {

    yaxi.Box.apply(this, arguments);

}).register('Button');
