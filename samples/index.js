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
                        Class: yaxi.Text,
                        text: 'samples'
                    }
                ]
            },
            content: {
                subtype: yaxi.Button,
                layout: 'block',
                baseURL: require.baseURL,
                gap: '4px top',
                style: {
                    padding: '.1rem'
                },
                children: [
                    { text: '模板开发演示', url: 'template.js' },
                    { text: '模型开发演示', url: 'model.js' },
                    { text: '多线程开发演示', events: { tap: runThread } },
                    {
                        Class: yaxi.Tab,
                        subtype: yaxi.TabItem,
                        children: [
                            { text: 'abc' },
                            { text: 'def' },
                            { text: 'abc' }
                        ]
                    }
                    // {
                    //     Class: yaxi.ClipImage,
                    //     src: 'http://img5.imgtn.bdimg.com/it/u=49764040,3750999451&fm=26&gp=0.jpg',
                    //     style: {
                    //         height: '4rem'
                    //     }
                    // }
                ]
            },
            footer: {
                style: {
                    height: '.5rem'
                }
            }
        });
    }



    function runThread() {

        var thread = require.runAsThread('thread.js');

        // 调用线程内的异步方法
        thread.exec('asyncCall', ['async call: get thread ', ' value'], function (value, error) {
            
            alert(value);

        }, true);

        // 调用线程内的同步方法
        thread.exec('syncCall', ['sync call: get thread ', ' value'], function (value, error) {
            
            alert(value);
        });
    }



});
    