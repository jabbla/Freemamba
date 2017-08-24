/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 07:41:43
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
myMessageBus.buildReceiveDispatcher(INITIAL_RENDER, function(message){
    var data = message.data,
        mambaID = message.mambaID,
        store = new WKRenderStore(data);

    store.render();
    VdomStore[mambaID] = store.vDom;
    //console.log(store.vDom);
});

/**UPDATE_RENDER */
myMessageBus.buildReceiveDispatcher(UPDATE_RENDER, function(message){
    var data = message.data,
        mambaID = message.mambaID,
        id = message.id,
        store = new WKRenderStore(data);

    store.render();
    //console.log('Worker 收到', UPDATE_RENDER);

    var differs = Differ(VdomStore[mambaID], store.vDom);
    VdomStore[mambaID] = store.vDom;
    
    this.receive({ type: UPDATE_RENDER, data: differs, id: id });
});

/**消息Log */
myMessageBus.onSend(function(){
    //console.log('Worker 已发送：', message);
});

