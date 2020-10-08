const yaxi = require('../js/yaxi');
const controls = yaxi.$controls;
const translateEvent = yaxi.wx.translateEvent;


// 本程序最低要支持的版本: 2.2.3


Component({
  options: {
      // 开放class至组件外 小程序基础库版本>=2.2.3
      addGlobalClass: true,

      // 虚拟化组件节点 小程序基础库版本>=2.11.2
      //   virtualHost: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    children: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    translateEvent: translateEvent
  },

  lifetimes: {
    attached: function () {

      // 输出对象至yaxi控件体系以解决自定义组件无法获取boundingClientRect的问题
      controls[this.dataset.id].__po = this;
    }
  }


})
