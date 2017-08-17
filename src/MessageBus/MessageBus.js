function MessageBus(worker){
    this._worker = worker;
    this._onSendWorker = [];
    this._initWorker();
    this._createEventsStore();
}

MessageBus.prototype._createEventsStore = function(){
    this._eventsStore = {};
}

MessageBus.prototype._initWorker = function(){
    var _worker = this._worker;

    _worker.addEventListener('message', this._onWorkerMessage.bind(this));
}

MessageBus.prototype._onWorkerMessage = function(message){

    this._deserialize(message);
}

MessageBus.prototype.receive = function(message){
    this._buffer = message;
    this._serialize(message);
    return this;
}

MessageBus.prototype.addEvent = function(eventType, fn){
    this._register(eventType, fn.bind(this));
}

MessageBus.prototype._deserialize = function(message){
    var type = message.data.type,
        data = message.data.data;

    this._emit(type, data);
}

MessageBus.prototype._serialize = function(message){
    var Info = {};

    Info.type = message.type;
    Info.data = message.data;

    this._sendInfoToWorker(Info);
    return this;
}

MessageBus.prototype._sendInfoToWorker = function(Info){
    var _worker = this._worker,
        _onSendWorker = this._onSendWorker;

    _worker.postMessage(Info);

    setTimeout(function(){
        if(_onSendWorker.length) this._checkWatchers(_onSendWorker, Info);
    }.bind(this), 0);
}

MessageBus.prototype._checkWatchers = function(watchers, Info){
    
    for(var i=0, watcher;i<watchers.length;i++){
        watcher = watchers[i];
        watcher.call(this, Info);
    }
}

MessageBus.prototype.onSend = function(fn){
    this._onSendWorker.push(fn);
}

MessageBus.prototype.then = function(fn){
    var message = this._buffer;
    this._register(message.type, fn);
    
    return this;
}

MessageBus.prototype._register = function(eventName, fn){
    var _eventsStore = this._eventsStore;

    if(_eventsStore[eventName])
        _eventsStore[eventName].watchers.push(fn);
    else
        _eventsStore[eventName] = {watchers: [fn]};
}

MessageBus.prototype._emit = function(eventName, data){
    var _eventsStore = this._eventsStore;

    if(_eventsStore[eventName] && _eventsStore[eventName].watchers.length)
        this._executeWatchers(_eventsStore[eventName].watchers, data);
}

MessageBus.prototype._executeWatchers = function(watchers, data){
    for(var i=0, watcher;i<watchers.length;i++){
        watcher = watchers[i];
        watcher.call(this, data);
    }
}

window.MessageBus = MessageBus;