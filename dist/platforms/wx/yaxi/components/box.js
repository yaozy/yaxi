const yaxi = require('../js/yaxi').wx;

const translateEvent = yaxi.translateEvent;



let time = new Date();



Component({
    options: {
        // 开放class至组件外 小程序基础库版本>=2.2.3
        addGlobalClass: true,

        // 虚拟化组件节点 小程序基础库版本>=2.11.2
        // virtualHost: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
        children: Array,
        active: String
    },

    /**
     * 组件的初始数据
     */
    data: {
        active: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {

        // 冒泡事件处理方法
        handleEvent: function (event) {

            var dataset = event.target.dataset;
            var id, t;

            if ((id = dataset.id) && ((t = new Date()) - time) > 50)
            {
                time = t;

                yaxi.__event_id = id;
                yaxi.__event_flag = dataset.flag;
            }
        },

        // 不冒泡事件直接转换
        translateEvent: function (event) {

            var dataset = event.target.dataset;
            var id;

            if (id = dataset.id)
            {
                yaxi.__event_id = id;
                yaxi.__event_flag = dataset.flag;

                translateEvent(event);
            }
        }
    }
})
