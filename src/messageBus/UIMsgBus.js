/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:38 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 16:40:38
 */
var MessageBus = require('./MessageBus.js');
var Extend = require('../utils/extend.js');

function UIMsgBus(worker){
    this._worker = worker;
    this.super();
}

Extend(UIMsgBus, MessageBus);

UIMsgBus.prototype._initWorker = function(){
    var _worker = this._worker;

    _worker.addEventListener('message', this._onMessage.bind(this));
};

UIMsgBus.prototype._postMessage = function(Info){
    var _worker = this._worker;

    _worker.postMessage(Info);
};

module.exports = UIMsgBus;