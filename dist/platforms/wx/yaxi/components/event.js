const translateEvent = require('../js/yaxi').wx.translateEvent;


// 上次触发事件的时间
let uuid = 0;


// 冒泡事件处理方法
exports.handleEvent = function (event) {
  
  var dataset = event.target.dataset;
  var id = dataset.id;

  if (id > uuid)
  {
      uuid = 0;
      translateEvent(event, id, dataset.flag);
  }
}



// 不冒泡事件直接转换
exports.translateEvent = function (event) {

  var dataset = event.target.dataset;
  translateEvent(event, dataset.id, dataset.flag);
}
