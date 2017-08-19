/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:27 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 20:13:47
 */
var MessageBus = require('./MessageBus.js');
var Extend = require('../utils/extend.js');

function WorkerMsgBus(){
    this.super();
}

Extend(WorkerMsgBus, MessageBus);

WorkerMsgBus.prototype._initWorker = function(){
    onmessage = this._onMessage.bind(this);
}

WorkerMsgBus.prototype._postMessage = function(Info){
    postMessage(Info);
}

module.exports = WorkerMsgBus;