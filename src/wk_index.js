/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 12:54:49
 */

var MessageBus = require('./messageBus/WorkerMsgBus.js');
var WKRenderStore = require('./store/WKRenderStore.js');
var Differ = require('./vdom/Differ.js');

var myMessageBus = new MessageBus();

/**v-domStore */
var VdomStore = {};

/**状态枚举 */
var INITIAL_RENDER = 'INITIAL_RENDER';
var UPDATE_RENDER = 'UPDATE_RENDER';

/**INITIAL_RENDER */
myMessageBus.buildReceiveDispatcher(INITIAL_RENDER, function(data){
    data = data.data;

    var mambaID = data.mambaID,
        store = new WKRenderStore(data);

    store.render();
    VdomStore[mambaID] = store.vDom;
    console.log(store.vDom);
    //store.render();
    //this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
});

/**UPDATE_RENDER */
myMessageBus.buildReceiveDispatcher(UPDATE_RENDER, function(data){
    data = data.data;

    var mambaID = data.mambaID,
        store = new WKRenderStore(data);
    store.render();
    console.log(VdomStore[mambaID], store.vDom);
    var differs = Differ(VdomStore[mambaID], store.vDom);
    VdomStore[mambaID] = store.vDom;
    console.log(differs);    
});

