module.exports = yaxi.Page.extend(function (Class, base) {


    this.init = function () {

        this.assign({
            children: [
                {
                    Class: yaxi.Header,
                    content: 'yaxi main page'
                },
                {
                    Class: yaxi.Panel,
                    children: [
                        {
                            Class: yaxi.Button,
                            content: 'open page',
                            events: {
                                tap: function () {

                                    new (require('./test'))().open();
                                }
                            }
                        }
                    ]
                }
            ]
        });
    }


});
