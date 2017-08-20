/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 12:02:09
 */

var MessageBus = require('./messageBus/WorkerMsgBus.js');
var WKRenderStore = require('./store/WKRenderStore.js');

var myMessageBus = new MessageBus();

myMessageBus.addEvent('render', function(data){
    var store = new WKRenderStore(data);
    store.render();
    this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
    console.log('worker messageBus');
});