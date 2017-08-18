/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports) {

function documentFragment(){
    this._children = [];
}
documentFragment.prototype.append = function(node){
    this._children.push(node);
};

module.exports = documentFragment;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

function Element(tagName){
    this._tagName = tagName;
    this._attrs = [];
    this._events = [];
    this._children = [];
}

Element.prototype.setAttribute = function(attrName, attrValue){
    var eventPattern = /on-/;

    if(eventPattern.test(attrName)) return;

    this._attrs.push({name: attrName, value: attrValue});
};

Element.prototype.addEventListener = function(eventName, handler){
    this._events.push({name: eventName.replace(/-/, ''), value: handler});
};

Element.prototype.append = function(node){
    this._children.push(node);
};

module.exports = Element;

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var MessageBus = __webpack_require__(21);
var RenderStore = __webpack_require__(19);

var myMessageBus = new MessageBus();

myMessageBus.addEvent('render', function(data){
    var store = new RenderStore(data);
    store.render();
    this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
});

/***/ }),
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(20);
var documentFragment = __webpack_require__(3);
var Element = __webpack_require__(4);

function RenderStore(obj){
    this.ast = obj.ast;
    this.data = obj.data;
    this.events = {};
    this.nodeId = 0;

    this._list = {};
}

RenderStore.prototype.render = function(){
    var ast = this.ast,
        data = this.data;
    
    this._compiler = RenderStore.compiler;
    this._typedFlater = RenderStore.typedFlater;
    this.vDom = this._compile(ast, data);
    this.renderedStr = this.flatToString(this.vDom._children);
}

RenderStore.compiler = {
    'element': function(ast, context, listInfo){
        var node = document.createElement(ast.tag);

        var attrs = ast.attrs;
        /**处理属性 */
        for(var i=0;i<attrs.length;i++){
            var attr = attrs[i];
            
            switch(attr.type){
                case 'attribute': RenderStore.resolveAttribute(attr, node, context, listInfo); break;
            }
        }

        /**处理子节点 */
        if(ast.children){
            for(var j=0;j<ast.children.length;j++){
                var child = ast.children[j];
                node.append(context._compile(child, listInfo));
            }
        }

        return node;
    },
    'text': function(ast){
        var node = document.createTextNode(ast.text);
        return node;
    },
    'expression': function(ast, context, listInfo){
        var text = '';
        if(listInfo){
            var getValue = new Function('c','d','e','return ('+ast.body+')');
            text = getValue(context, listInfo, '');
        }else{
            var getValue = new Function('c','d','e','return ('+ast.body+')');
            text = getValue(context, context.data, '');
        }

        var node = document.createTextNode(text);

        return node;
    },
    'list': function(ast, context){
        var listBody = ast.body;
        var node = document.createDocumentFragment();
        var getValue = new Function('c','d','e','return ('+ast.sequence.body+')');
        var arrayData = getValue(context, context.data, '');
        var variable = ast.variable;

        for(var j=0;j<arrayData.length;j++){
            node.append(itemNode(listBody, arrayData[j], j));
        }

        function itemNode(body, item, index){
            var node = document.createDocumentFragment();
            var listInfo = {};

            listInfo[variable] = item;
            listInfo[variable+'_index'] = index;
            for(var i=0;i<body.length;i++){
                node.append(context._compile(body[i], listInfo));
            }
            return node;
        }
        context._list.data = arrayData;
        context._list.body = listBody;
        return node;
    }
};

RenderStore.resolveAttribute = function(attr, node, context, listInfo){
    var valueType = typeof attr.value;
    switch(valueType){
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, RenderStore.resolveAttrValue(attr, node, context, listInfo)); break;
    }

    if(attr.name === 'list-container'){
        node.setAttribute('list-container', true);
    }
    
}

RenderStore.resolveAttrValue = function(attr, node, context, listInfo){
    var isEvent = attr.name.slice(0,2) === 'on';

    if(isEvent){
        var eventName = attr.name.slice(3);
        attr.value.body = attr.value.body.replace(/'\$event'/g, '$event');
        var getHandler = new Function('c', 'd', 'e', 'return function($event){return '+attr.value.body+';}');

        node.addEventListener(eventName, getHandler(context, listInfo || context.data, ''), false);
        return '';
    }else{
        var getValue = new Function('c','d','e','return ('+attr.value.body+')');
        return getValue(context, context.data, '');
    }
}

RenderStore.prototype._compile = function(ast, listInfo){
    if(ast instanceof Array){
        var node = document.createDocumentFragment();
        for(var i=0;i<ast.length;i++){
            node.append(this._compile(ast[i], listInfo));
        }
        return node;
    }else{
        return this._compiler[ast.type](ast, this, listInfo);
    }
}

RenderStore.prototype.flatToString = function(node){
    if(node instanceof Array){
        var result = '';
        for(var i=0;i<node.length;i++){
            result += this.flatToString(node[i]);
        }
        return result;
    }else{
        return this.flatNode(node);
    }
    
}

RenderStore.prototype.flatNode = function(node){
    var tagName = node._tagName,
        attrs = node._attrs,
        events = node._events,
        children = node._children,
        body = '', attrStr = '', eventStr = '',
        nodeId = this.nodeId;
    
    /**文本节点处理 */
    if(typeof node === 'string'){
        return node;
    }

    /**插入子节点 */
    for(var i=0;i<children.length;i++){
        body += this.flatNode(children[i]);
    }

    /**fragMent */
    if(node instanceof documentFragment){
        return body;
    }

    /**生成属性字符串 */
    for(var j=0;j<attrs.length;j++){
        attrStr += (attrs[j].name+'="'+attrs[j].value+'" ');
    }

    /**事件处理 */
    if(events.length){
        attrStr += 'data-nodeid="'+nodeId+'"';
        for(var h=0;h<events.length;h++){
            events[h].value += ''; 
        }
        this.events[nodeId] = events;
    }
    this.nodeId++;

    return '<'+tagName+' '+attrStr+eventStr+'>'+body+'</'+tagName+'>';
}   

RenderStore.prototype._sg_ = function(path, data){
    var result;
    if(path instanceof Event){
        result = path;
    }else{
        result = data[path];
    }
    return result;
}

module.exports = RenderStore;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var documentFragment = __webpack_require__(3);
var Element = __webpack_require__(4);

var proto = {
    createDocumentFragment: function(){
        return new documentFragment();
    },
    createElement: function(tagName){
        return new Element(tagName);
    },
    createTextNode: function(text){
        return text;
    }
};

var doc = Object.create(proto);

module.exports = doc;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

function MessageBus(){
    this._onSendWorker = [];
    this._initWorker();
    this._createEventsStore();
}

MessageBus.prototype._createEventsStore = function(){
    this._eventsStore = {};
}

MessageBus.prototype._initWorker = function(){
    var _worker = this._worker;

    onmessage = this._onWorkerMessage.bind(this);
}

MessageBus.prototype._onWorkerMessage = function(message){

    this._deserialize(message);
}

MessageBus.prototype.receive = function(message){
    this._buffer = message;

    this._serialize(message);
    return this;
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

    this._sendInfoToMain(Info);
    return this;
}

MessageBus.prototype.addEvent = function(eventType, fn){
    this._register(eventType, fn.bind(this));
}

MessageBus.prototype._sendInfoToMain = function(Info){
    var _onSendWorker = this._onSendWorker;
    postMessage(Info);

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
    this._onSendWorker.push(fn.bind(this));
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

module.exports = MessageBus;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWQ5YWU5YTJlNDE4Y2M5YTk2N2EiLCJ3ZWJwYWNrOi8vLy4vc3JjL3ZEb20vZG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdkRvbS9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy93b3JrZXJfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1JlbmRlclN0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy92RG9tL2RvY3VtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9NZXNzYWdlQnVzL01lc3NhZ2VCdXNfd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0M7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHNCQUFzQixpQ0FBaUM7QUFDdkQ7O0FBRUE7QUFDQSx1QkFBdUIsaURBQWlEO0FBQ3hFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkJBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHVCQUF1QiwrQ0FBK0M7QUFDeEYsQ0FBQyxFOzs7Ozs7O0FDVEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixlQUFlO0FBQ25DOztBQUVBO0FBQ0EsOEZBQThGO0FBQzlGO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdCQUF3QixzQkFBc0I7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsbUJBQW1CO0FBQ3ZDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3QkFBd0IsY0FBYztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQWdFO0FBQ2hFLGlIQUFpSDtBQUNqSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEUsNEJBQTRCOztBQUUxRztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixhQUFhO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGNBQWM7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0Isa0JBQWtCO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsZUFBZTtBQUMvQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixnQkFBZ0I7QUFDcEMsa0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkI7Ozs7OztBQ3RNQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCOzs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSx5QkFBeUIsa0JBQWtCO0FBQzNDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QixrQkFBa0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEIiLCJmaWxlIjoiV29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGVkOWFlOWEyZTQxOGNjOWE5NjdhIiwiZnVuY3Rpb24gZG9jdW1lbnRGcmFnbWVudCgpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5kb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50RnJhZ21lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdkRvbS9kb2N1bWVudEZyYWdtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsImZ1bmN0aW9uIEVsZW1lbnQodGFnTmFtZSl7XHJcbiAgICB0aGlzLl90YWdOYW1lID0gdGFnTmFtZTtcclxuICAgIHRoaXMuX2F0dHJzID0gW107XHJcbiAgICB0aGlzLl9ldmVudHMgPSBbXTtcclxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGF0dHJOYW1lLCBhdHRyVmFsdWUpe1xyXG4gICAgdmFyIGV2ZW50UGF0dGVybiA9IC9vbi0vO1xyXG5cclxuICAgIGlmKGV2ZW50UGF0dGVybi50ZXN0KGF0dHJOYW1lKSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuX2F0dHJzLnB1c2goe25hbWU6IGF0dHJOYW1lLCB2YWx1ZTogYXR0clZhbHVlfSk7XHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnROYW1lLCBoYW5kbGVyKXtcclxuICAgIHRoaXMuX2V2ZW50cy5wdXNoKHtuYW1lOiBldmVudE5hbWUucmVwbGFjZSgvLS8sICcnKSwgdmFsdWU6IGhhbmRsZXJ9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWxlbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92RG9tL0VsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIE1lc3NhZ2VCdXMgPSByZXF1aXJlKCcuL01lc3NhZ2VCdXMvTWVzc2FnZUJ1c193b3JrZXIuanMnKTtcclxudmFyIFJlbmRlclN0b3JlID0gcmVxdWlyZSgnLi9SZW5kZXJTdG9yZS5qcycpO1xyXG5cclxudmFyIG15TWVzc2FnZUJ1cyA9IG5ldyBNZXNzYWdlQnVzKCk7XHJcblxyXG5teU1lc3NhZ2VCdXMuYWRkRXZlbnQoJ3JlbmRlcicsIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgdmFyIHN0b3JlID0gbmV3IFJlbmRlclN0b3JlKGRhdGEpO1xyXG4gICAgc3RvcmUucmVuZGVyKCk7XHJcbiAgICB0aGlzLnJlY2VpdmUoe3R5cGU6ICdyZW5kZXInLCBkYXRhOiB7aHRtbDogc3RvcmUucmVuZGVyZWRTdHIsIGV2ZW50czogc3RvcmUuZXZlbnRzfX0pO1xyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy93b3JrZXJfaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vdkRvbS9kb2N1bWVudC5qcycpO1xyXG52YXIgZG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoJy4vdkRvbS9kb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcbnZhciBFbGVtZW50ID0gcmVxdWlyZSgnLi92RG9tL0VsZW1lbnQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlclN0b3JlKG9iail7XHJcbiAgICB0aGlzLmFzdCA9IG9iai5hc3Q7XHJcbiAgICB0aGlzLmRhdGEgPSBvYmouZGF0YTtcclxuICAgIHRoaXMuZXZlbnRzID0ge307XHJcbiAgICB0aGlzLm5vZGVJZCA9IDA7XHJcblxyXG4gICAgdGhpcy5fbGlzdCA9IHt9O1xyXG59XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBhc3QgPSB0aGlzLmFzdCxcclxuICAgICAgICBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgXHJcbiAgICB0aGlzLl9jb21waWxlciA9IFJlbmRlclN0b3JlLmNvbXBpbGVyO1xyXG4gICAgdGhpcy5fdHlwZWRGbGF0ZXIgPSBSZW5kZXJTdG9yZS50eXBlZEZsYXRlcjtcclxuICAgIHRoaXMudkRvbSA9IHRoaXMuX2NvbXBpbGUoYXN0LCBkYXRhKTtcclxuICAgIHRoaXMucmVuZGVyZWRTdHIgPSB0aGlzLmZsYXRUb1N0cmluZyh0aGlzLnZEb20uX2NoaWxkcmVuKTtcclxufVxyXG5cclxuUmVuZGVyU3RvcmUuY29tcGlsZXIgPSB7XHJcbiAgICAnZWxlbWVudCc6IGZ1bmN0aW9uKGFzdCwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhc3QudGFnKTtcclxuXHJcbiAgICAgICAgdmFyIGF0dHJzID0gYXN0LmF0dHJzO1xyXG4gICAgICAgIC8qKuWkhOeQhuWxnuaApyAqL1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXR0cnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBhdHRyID0gYXR0cnNbaV07XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzd2l0Y2goYXR0ci50eXBlKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IFJlbmRlclN0b3JlLnJlc29sdmVBdHRyaWJ1dGUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pOyBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoq5aSE55CG5a2Q6IqC54K5ICovXHJcbiAgICAgICAgaWYoYXN0LmNoaWxkcmVuKXtcclxuICAgICAgICAgICAgZm9yKHZhciBqPTA7ajxhc3QuY2hpbGRyZW4ubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBhc3QuY2hpbGRyZW5bal07XHJcbiAgICAgICAgICAgICAgICBub2RlLmFwcGVuZChjb250ZXh0Ll9jb21waWxlKGNoaWxkLCBsaXN0SW5mbykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0sXHJcbiAgICAndGV4dCc6IGZ1bmN0aW9uKGFzdCl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhc3QudGV4dCk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9LFxyXG4gICAgJ2V4cHJlc3Npb24nOiBmdW5jdGlvbihhc3QsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgICAgICB2YXIgdGV4dCA9ICcnO1xyXG4gICAgICAgIGlmKGxpc3RJbmZvKXtcclxuICAgICAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXN0LmJvZHkrJyknKTtcclxuICAgICAgICAgICAgdGV4dCA9IGdldFZhbHVlKGNvbnRleHQsIGxpc3RJbmZvLCAnJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsJ2QnLCdlJywncmV0dXJuICgnK2FzdC5ib2R5KycpJyk7XHJcbiAgICAgICAgICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSxcclxuICAgICdsaXN0JzogZnVuY3Rpb24oYXN0LCBjb250ZXh0KXtcclxuICAgICAgICB2YXIgbGlzdEJvZHkgPSBhc3QuYm9keTtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3Quc2VxdWVuY2UuYm9keSsnKScpO1xyXG4gICAgICAgIHZhciBhcnJheURhdGEgPSBnZXRWYWx1ZShjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgICAgICB2YXIgdmFyaWFibGUgPSBhc3QudmFyaWFibGU7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaj0wO2o8YXJyYXlEYXRhLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZChpdGVtTm9kZShsaXN0Qm9keSwgYXJyYXlEYXRhW2pdLCBqKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpdGVtTm9kZShib2R5LCBpdGVtLCBpbmRleCl7XHJcbiAgICAgICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgICAgICB2YXIgbGlzdEluZm8gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlXSA9IGl0ZW07XHJcbiAgICAgICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlKydfaW5kZXgnXSA9IGluZGV4O1xyXG4gICAgICAgICAgICBmb3IodmFyIGk9MDtpPGJvZHkubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBub2RlLmFwcGVuZChjb250ZXh0Ll9jb21waWxlKGJvZHlbaV0sIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRleHQuX2xpc3QuZGF0YSA9IGFycmF5RGF0YTtcclxuICAgICAgICBjb250ZXh0Ll9saXN0LmJvZHkgPSBsaXN0Qm9keTtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxufTtcclxuXHJcblJlbmRlclN0b3JlLnJlc29sdmVBdHRyaWJ1dGUgPSBmdW5jdGlvbihhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbyl7XHJcbiAgICB2YXIgdmFsdWVUeXBlID0gdHlwZW9mIGF0dHIudmFsdWU7XHJcbiAgICBzd2l0Y2godmFsdWVUeXBlKXtcclxuICAgICAgICBjYXNlICdzdHJpbmcnOiBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpOyBicmVhaztcclxuICAgICAgICBjYXNlICdvYmplY3QnOiBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIFJlbmRlclN0b3JlLnJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pKTsgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoYXR0ci5uYW1lID09PSAnbGlzdC1jb250YWluZXInKXtcclxuICAgICAgICBub2RlLnNldEF0dHJpYnV0ZSgnbGlzdC1jb250YWluZXInLCB0cnVlKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5SZW5kZXJTdG9yZS5yZXNvbHZlQXR0clZhbHVlID0gZnVuY3Rpb24oYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIGlzRXZlbnQgPSBhdHRyLm5hbWUuc2xpY2UoMCwyKSA9PT0gJ29uJztcclxuXHJcbiAgICBpZihpc0V2ZW50KXtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5uYW1lLnNsaWNlKDMpO1xyXG4gICAgICAgIGF0dHIudmFsdWUuYm9keSA9IGF0dHIudmFsdWUuYm9keS5yZXBsYWNlKC8nXFwkZXZlbnQnL2csICckZXZlbnQnKTtcclxuICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuIGZ1bmN0aW9uKCRldmVudCl7cmV0dXJuICcrYXR0ci52YWx1ZS5ib2R5Kyc7fScpO1xyXG5cclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBnZXRIYW5kbGVyKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXR0ci52YWx1ZS5ib2R5KycpJyk7XHJcbiAgICAgICAgcmV0dXJuIGdldFZhbHVlKGNvbnRleHQsIGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbihhc3QsIGxpc3RJbmZvKXtcclxuICAgIGlmKGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQodGhpcy5fY29tcGlsZShhc3RbaV0sIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyW2FzdC50eXBlXShhc3QsIHRoaXMsIGxpc3RJbmZvKTtcclxuICAgIH1cclxufVxyXG5cclxuUmVuZGVyU3RvcmUucHJvdG90eXBlLmZsYXRUb1N0cmluZyA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgaWYobm9kZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxub2RlLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gdGhpcy5mbGF0VG9TdHJpbmcobm9kZVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0Tm9kZShub2RlKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuZmxhdE5vZGUgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHZhciB0YWdOYW1lID0gbm9kZS5fdGFnTmFtZSxcclxuICAgICAgICBhdHRycyA9IG5vZGUuX2F0dHJzLFxyXG4gICAgICAgIGV2ZW50cyA9IG5vZGUuX2V2ZW50cyxcclxuICAgICAgICBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuLFxyXG4gICAgICAgIGJvZHkgPSAnJywgYXR0clN0ciA9ICcnLCBldmVudFN0ciA9ICcnLFxyXG4gICAgICAgIG5vZGVJZCA9IHRoaXMubm9kZUlkO1xyXG4gICAgXHJcbiAgICAvKirmlofmnKzoioLngrnlpITnkIYgKi9cclxuICAgIGlmKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5o+S5YWl5a2Q6IqC54K5ICovXHJcbiAgICBmb3IodmFyIGk9MDtpPGNoaWxkcmVuLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGJvZHkgKz0gdGhpcy5mbGF0Tm9kZShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqZnJhZ01lbnQgKi9cclxuICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudEZyYWdtZW50KXtcclxuICAgICAgICByZXR1cm4gYm9keTtcclxuICAgIH1cclxuXHJcbiAgICAvKirnlJ/miJDlsZ7mgKflrZfnrKbkuLIgKi9cclxuICAgIGZvcih2YXIgaj0wO2o8YXR0cnMubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgYXR0clN0ciArPSAoYXR0cnNbal0ubmFtZSsnPVwiJythdHRyc1tqXS52YWx1ZSsnXCIgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu25aSE55CGICovXHJcbiAgICBpZihldmVudHMubGVuZ3RoKXtcclxuICAgICAgICBhdHRyU3RyICs9ICdkYXRhLW5vZGVpZD1cIicrbm9kZUlkKydcIic7XHJcbiAgICAgICAgZm9yKHZhciBoPTA7aDxldmVudHMubGVuZ3RoO2grKyl7XHJcbiAgICAgICAgICAgIGV2ZW50c1toXS52YWx1ZSArPSAnJzsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXZlbnRzW25vZGVJZF0gPSBldmVudHM7XHJcbiAgICB9XHJcbiAgICB0aGlzLm5vZGVJZCsrO1xyXG5cclxuICAgIHJldHVybiAnPCcrdGFnTmFtZSsnICcrYXR0clN0citldmVudFN0cisnPicrYm9keSsnPC8nK3RhZ05hbWUrJz4nO1xyXG59ICAgXHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuX3NnXyA9IGZ1bmN0aW9uKHBhdGgsIGRhdGEpe1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmKHBhdGggaW5zdGFuY2VvZiBFdmVudCl7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aDtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJlc3VsdCA9IGRhdGFbcGF0aF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJlbmRlclN0b3JlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1JlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoJy4vZG9jdW1lbnRGcmFnbWVudC5qcycpO1xyXG52YXIgRWxlbWVudCA9IHJlcXVpcmUoJy4vRWxlbWVudC5qcycpO1xyXG5cclxudmFyIHByb3RvID0ge1xyXG4gICAgY3JlYXRlRG9jdW1lbnRGcmFnbWVudDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IGRvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbih0YWdOYW1lKXtcclxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnQodGFnTmFtZSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlVGV4dE5vZGU6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGRvYyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkb2M7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdkRvbS9kb2N1bWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiZnVuY3Rpb24gTWVzc2FnZUJ1cygpe1xyXG4gICAgdGhpcy5fb25TZW5kV29ya2VyID0gW107XHJcbiAgICB0aGlzLl9pbml0V29ya2VyKCk7XHJcbiAgICB0aGlzLl9jcmVhdGVFdmVudHNTdG9yZSgpO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fY3JlYXRlRXZlbnRzU3RvcmUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5fZXZlbnRzU3RvcmUgPSB7fTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIF93b3JrZXIgPSB0aGlzLl93b3JrZXI7XHJcblxyXG4gICAgb25tZXNzYWdlID0gdGhpcy5fb25Xb3JrZXJNZXNzYWdlLmJpbmQodGhpcyk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9vbldvcmtlck1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKXtcclxuXHJcbiAgICB0aGlzLl9kZXNlcmlhbGl6ZShtZXNzYWdlKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdGhpcy5fYnVmZmVyID0gbWVzc2FnZTtcclxuXHJcbiAgICB0aGlzLl9zZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB2YXIgdHlwZSA9IG1lc3NhZ2UuZGF0YS50eXBlLFxyXG4gICAgICAgIGRhdGEgPSBtZXNzYWdlLmRhdGEuZGF0YTtcclxuXHJcbiAgICB0aGlzLl9lbWl0KHR5cGUsIGRhdGEpO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB2YXIgSW5mbyA9IHt9O1xyXG5cclxuICAgIEluZm8udHlwZSA9IG1lc3NhZ2UudHlwZTtcclxuICAgIEluZm8uZGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuXHJcbiAgICB0aGlzLl9zZW5kSW5mb1RvTWFpbihJbmZvKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgZm4pe1xyXG4gICAgdGhpcy5fcmVnaXN0ZXIoZXZlbnRUeXBlLCBmbi5iaW5kKHRoaXMpKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3NlbmRJbmZvVG9NYWluID0gZnVuY3Rpb24oSW5mbyl7XHJcbiAgICB2YXIgX29uU2VuZFdvcmtlciA9IHRoaXMuX29uU2VuZFdvcmtlcjtcclxuICAgIHBvc3RNZXNzYWdlKEluZm8pO1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihfb25TZW5kV29ya2VyLmxlbmd0aCkgdGhpcy5fY2hlY2tXYXRjaGVycyhfb25TZW5kV29ya2VyLCBJbmZvKTtcclxuICAgIH0uYmluZCh0aGlzKSwgMCk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9jaGVja1dhdGNoZXJzID0gZnVuY3Rpb24od2F0Y2hlcnMsIEluZm8pe1xyXG4gICAgZm9yKHZhciBpPTAsIHdhdGNoZXI7aTx3YXRjaGVycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlci5jYWxsKHRoaXMsIEluZm8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbihmbil7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIucHVzaChmbi5iaW5kKHRoaXMpKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKGZuKXtcclxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5fYnVmZmVyO1xyXG4gICAgdGhpcy5fcmVnaXN0ZXIobWVzc2FnZS50eXBlLCBmbik7XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVnaXN0ZXIgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKXtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZihfZXZlbnRzU3RvcmVbZXZlbnROYW1lXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbZXZlbnROYW1lXS53YXRjaGVycy5wdXNoKGZuKTtcclxuICAgIGVsc2VcclxuICAgICAgICBfZXZlbnRzU3RvcmVbZXZlbnROYW1lXSA9IHt3YXRjaGVyczogW2ZuXX07XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9lbWl0ID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKXtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZihfZXZlbnRzU3RvcmVbZXZlbnROYW1lXSAmJiBfZXZlbnRzU3RvcmVbZXZlbnROYW1lXS53YXRjaGVycy5sZW5ndGgpXHJcbiAgICAgICAgdGhpcy5fZXhlY3V0ZVdhdGNoZXJzKF9ldmVudHNTdG9yZVtldmVudE5hbWVdLndhdGNoZXJzLCBkYXRhKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2V4ZWN1dGVXYXRjaGVycyA9IGZ1bmN0aW9uKHdhdGNoZXJzLCBkYXRhKXtcclxuICAgIGZvcih2YXIgaT0wLCB3YXRjaGVyO2k8d2F0Y2hlcnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgd2F0Y2hlciA9IHdhdGNoZXJzW2ldO1xyXG4gICAgICAgIHdhdGNoZXIuY2FsbCh0aGlzLCBkYXRhKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL01lc3NhZ2VCdXMvTWVzc2FnZUJ1c193b3JrZXIuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=