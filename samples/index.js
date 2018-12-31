module.exports = yaxi.Page.extend(function () {


    this.init = function () {

        this.assign({
            // header: 'samples',
            header: {
                children: [
                    {
                        Class: yaxi.BackButton
                    },
                    {
                        text: 'samples'
                    }
                ]
            },
            content: {
                subtype: yaxi.Button,
                layout: 'block-fill',
                baseURL: require.baseURL,
                openURL: true,
                style: {
                    padding: '.1rem'
                },
                children: [
                    { text: '模板开发演示', url: 'template.js' },
                    { text: '模型开发演示', url: 'model.js' },
                    { text: '多线程开发演示', events: { tap: runThread } }
                ]
            }
        });
    }



    function runThread() {

        var thread = require.runAsThread('thread.js');

        // 调用线程内的同步方法
        thread.exec('syncCall', ['sync call: ', ' value'], function (value, error) {
            
            alert(value);
        });

        // 调用线程内的异步方法
        thread.exec('asyncCall', ['async call: ', ' value'], function (value, error) {
            
            alert(value);

        }, true);
    }



});
    