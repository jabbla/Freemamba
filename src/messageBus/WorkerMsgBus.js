/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:27 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 00:43:00
 */
var MessageBus = require('./MessageBus.js');
var Extend = require('../utils/extend.js');

function WorkerMsgBus(){
    this.super();
    this._receiveBusDispatcher = {};
}

Extend(WorkerMsgBus, MessageBus);

WorkerMsgBus.prototype._initWorker = function(){
    /*eslint-disable*/
    onmessage = this._onMessage.bind(this);
}

WorkerMsgBus.prototype._postMessage = function(Info){
    /*eslint-disable*/
    postMessage(Info);
}

WorkerMsgBus.prototype.buildReceiveDispatcher = function(type, fn){
    var dispatcher = this._receiveBusDispatcher;
    
    dispatcher[type] = fn;
}

WorkerMsgBus.prototype._serialize = function(message){
    this._sendInfoToWorker(message);
};

WorkerMsgBus.prototype._receiveBusResolver = function(Info){
    var type = Info.type,
        data = Info.data,
        mambaID = Info.mambaID,
        id = Info.id,
        dispatcher = this._receiveBusDispatcher;

    if(dispatcher[type]){
        /**_vdomStore */
        debugger;
        dispatcher[type].call(this, {data: data, mambaID: mambaID, id: id});
    }else{
        throw new Error('worker MessgaeBus haven\'t registered type: '+type);
    }
    
}

WorkerMsgBus.prototype.onReceiveMessage = function(fn){

}

module.exports = WorkerMsgBus;