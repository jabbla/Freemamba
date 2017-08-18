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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {__webpack_require__(12)();



var _  = module.exports;
var entities = __webpack_require__(13);
var slice = [].slice;
var o2str = ({}).toString;
var win = typeof window !=='undefined'? window: global;
var MAX_PRIORITY = 9999;


_.noop = function(){};
_.uid = (function(){
  var _uid=0;
  return function(){
    return _uid++;
  }
})();

_.extend = function( o1, o2, override ){
  for(var i in o2) if (o2.hasOwnProperty(i)){
    if( o1[i] === undefined || override === true ){
      o1[i] = o2[i]
    }
  }
  return o1;
}

_.keys = Object.keys? Object.keys: function(obj){
  var res = [];
  for(var i in obj) if(obj.hasOwnProperty(i)){
    res.push(i);
  }
  return res;
}

_.some = function(list, fn){
  for(var i =0,len = list.length; i < len; i++){
    if(fn(list[i])) return true
  }
}

_.varName = 'd';
_.setName = 'p_';
_.ctxName = 'c';
_.extName = 'e';

_.rWord = /^[\$\w]+$/;
_.rSimpleAccessor = /^[\$\w]+(\.[\$\w]+)*$/;

_.nextTick = typeof setImmediate === 'function'? 
  setImmediate.bind(win) : 
  function(callback) {
    setTimeout(callback, 0) 
  }



_.prefix = "'use strict';var " + _.varName + "=" + _.ctxName + ".data;" +  _.extName  + "=" + _.extName + "||'';";


_.slice = function(obj, start, end){
  var res = [];
  for(var i = start || 0, len = end || obj.length; i < len; i++){
    res.push(obj[i])
  }
  return res;
}

// beacuse slice and toLowerCase is expensive. we handle undefined and null in another way
_.typeOf = function (o) {
  return o == null ? String(o) :o2str.call(o).slice(8, -1).toLowerCase();
}




_.makePredicate = function makePredicate(words, prefix) {
    if (typeof words === "string") {
        words = words.split(" ");
    }
    var f = "",
    cats = [];
    out: for (var i = 0; i < words.length; ++i) {
        for (var j = 0; j < cats.length; ++j){
          if (cats[j][0].length === words[i].length) {
              cats[j].push(words[i]);
              continue out;
          }
        }
        cats.push([words[i]]);
    }
    function compareTo(arr) {
        if (arr.length === 1) return f += "return str === '" + arr[0] + "';";
        f += "switch(str){";
        for (var i = 0; i < arr.length; ++i){
           f += "case '" + arr[i] + "':";
        }
        f += "return true}return false;";
    }

    // When there are more than three length categories, an outer
    // switch first dispatches on the lengths, to save on comparisons.
    if (cats.length > 3) {
        cats.sort(function(a, b) {
            return b.length - a.length;
        });
        f += "switch(str.length){";
        for (var i = 0; i < cats.length; ++i) {
            var cat = cats[i];
            f += "case " + cat[0].length + ":";
            compareTo(cat);
        }
        f += "}";

        // Otherwise, simply generate a flat `switch` statement.
    } else {
        compareTo(words);
    }
    return new Function("str", f);
}


_.trackErrorPos = (function (){
  // linebreak
  var lb = /\r\n|[\n\r\u2028\u2029]/g;
  var minRange = 20, maxRange = 20;
  function findLine(lines, pos){
    var tmpLen = 0;
    for(var i = 0,len = lines.length; i < len; i++){
      var lineLen = (lines[i] || "").length;

      if(tmpLen + lineLen > pos) {
        return {num: i, line: lines[i], start: pos - i - tmpLen , prev:lines[i-1], next: lines[i+1] };
      }
      // 1 is for the linebreak
      tmpLen = tmpLen + lineLen ;
    }
  }
  function formatLine(str,  start, num, target){
    var len = str.length;
    var min = start - minRange;
    if(min < 0) min = 0;
    var max = start + maxRange;
    if(max > len) max = len;

    var remain = str.slice(min, max);
    var prefix = "[" +(num+1) + "] " + (min > 0? ".." : "")
    var postfix = max < len ? "..": "";
    var res = prefix + remain + postfix;
    if(target) res += "\n" + new Array(start-min + prefix.length + 1).join(" ") + "^^^";
    return res;
  }
  return function(input, pos){
    if(pos > input.length-1) pos = input.length-1;
    lb.lastIndex = 0;
    var lines = input.split(lb);
    var line = findLine(lines,pos);
    var start = line.start, num = line.num;

    return (line.prev? formatLine(line.prev, start, num-1 ) + '\n': '' ) + 
      formatLine(line.line, start, num, true) + '\n' + 
      (line.next? formatLine(line.next, start, num+1 ) + '\n': '' );

  }
})();


var ignoredRef = /\((\?\!|\?\:|\?\=)/g;
_.findSubCapture = function (regStr) {
  var left = 0,
    right = 0,
    len = regStr.length,
    ignored = regStr.match(ignoredRef); // ignored uncapture
  if(ignored) ignored = ignored.length
  else ignored = 0;
  for (; len--;) {
    var letter = regStr.charAt(len);
    if (len === 0 || regStr.charAt(len - 1) !== "\\" ) { 
      if (letter === "(") left++;
      if (letter === ")") right++;
    }
  }
  if (left !== right) throw "RegExp: "+ regStr + "'s bracket is not marched";
  else return left - ignored;
};


_.escapeRegExp = function( str){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
  return str.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, function(match){
    return '\\' + match;
  });
};


var rEntity = new RegExp("&(?:(#x[0-9a-fA-F]+)|(#[0-9]+)|(" + _.keys(entities).join('|') + '));', 'gi');

_.convertEntity = function(chr){

  return ("" + chr).replace(rEntity, function(all, hex, dec, capture){
    var charCode;
    if( dec ) charCode = parseInt( dec.slice(1), 10 );
    else if( hex ) charCode = parseInt( hex.slice(2), 16 );
    else charCode = entities[capture]

    return String.fromCharCode( charCode )
  });

}


// simple get accessor

_.createObject = Object.create? function(o){
  return Object.create(o || null)
}: (function(){
    function Temp() {}
    return function(o){
      if(!o) return {}
      Temp.prototype = o;
      var obj = new Temp();
      Temp.prototype = null; // 不要保持一个 O 的杂散引用（a stray reference）...
      return obj
    }
})();

_.createProto = function(fn, o){
    function Foo() { this.constructor = fn;}
    Foo.prototype = o;
    return (fn.prototype = new Foo());
}


_.removeOne = function(list , filter){
  var len = list.length;
  for(;len--;){
    if(filter(list[len])) {
      list.splice(len, 1)
      return;
    }
  }
}


/**
clone
*/
_.clone = function clone(obj){
  if(!obj || (typeof obj !== 'object' )) return obj;
  if(Array.isArray(obj)){
    var cloned = [];
    for(var i=0,len = obj.length; i< len;i++){
      cloned[i] = obj[i]
    }
    return cloned;
  }else{
    var cloned = {};
    for(var i in obj) if(obj.hasOwnProperty(i)){
      cloned[i] = obj[i];
    }
    return cloned;
  }
}

_.equals = function(now, old){
  var type = typeof now;
  if(type === 'number' && typeof old === 'number'&& isNaN(now) && isNaN(old)) return true
  return now === old;
}

var dash = /-([a-z])/g;
_.camelCase = function(str){
  return str.replace(dash, function(all, capture){
    return capture.toUpperCase();
  })
}



_.throttle = function throttle(func, wait){
  var wait = wait || 100;
  var context, args, result;
  var timeout = null;
  var previous = 0;
  var later = function() {
    previous = +new Date;
    timeout = null;
    result = func.apply(context, args);
    context = args = null;
  };
  return function() {
    var now = + new Date;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
      context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};

// hogan escape
// ==============
_.escape = (function(){
  var rAmp = /&/g,
      rLt = /</g,
      rGt = />/g,
      rApos = /\'/g,
      rQuot = /\"/g,
      hChars = /[&<>\"\']/;

  return function(str) {
    return hChars.test(str) ?
      str
        .replace(rAmp, '&amp;')
        .replace(rLt, '&lt;')
        .replace(rGt, '&gt;')
        .replace(rApos, '&#39;')
        .replace(rQuot, '&quot;') :
      str;
  }
})();

_.cache = function(max){
  max = max || 1000;
  var keys = [],
      cache = {};
  return {
    set: function(key, value) {
      if (keys.length > this.max) {
        cache[keys.shift()] = undefined;
      }
      // 
      if(cache[key] === undefined){
        keys.push(key);
      }
      cache[key] = value;
      return value;
    },
    get: function(key) {
      if (key === undefined) return cache;
      return cache[key];
    },
    max: max,
    len:function(){
      return keys.length;
    }
  };
}

// // setup the raw Expression


// handle the same logic on component's `on-*` and element's `on-*`
// return the fire object
_.handleEvent = function(value, type ){
  var self = this, evaluate;
  if(value.type === 'expression'){ // if is expression, go evaluated way
    evaluate = value.get;
  }
  if(evaluate){
    return function fire(obj){
      self.$update(function(){
        var data = this.data;
        data.$event = obj;
        var res = evaluate(self);
        if(res === false && obj && obj.preventDefault) obj.preventDefault();
        data.$event = undefined;
      })

    }
  }else{
    return function fire(){
      var args = _.slice(arguments);
      args.unshift(value);
      self.$update(function(){
        self.$emit.apply(self, args);
      })
    }
  }
}

// only call once
_.once = function(fn){
  var time = 0;
  return function(){
    if( time++ === 0) fn.apply(this, arguments);
  }
}

_.fixObjStr = function(str){
  if(str.trim().indexOf('{') !== 0){
    return '{' + str + '}';
  }
  return str;
}


_.map= function(array, callback){
  var res = [];
  for (var i = 0, len = array.length; i < len; i++) {
    res.push(callback(array[i], i));
  }
  return res;
}

function log(msg, type){
  if(typeof console !== "undefined")  console[type || "log"](msg);
}

_.log = log;


_.normListener = function( events  ){
    var eventListeners = [];
    var pType = _.typeOf( events );
    if( pType === 'array' ){
      return events;
    }else if ( pType === 'object' ){
      for( var i in events ) if ( events.hasOwnProperty(i) ){
        eventListeners.push({
          type: i,
          listener: events[i]
        })
      }
    }
    return eventListeners;
}


//http://www.w3.org/html/wg/drafts/html/master/single-page.html#void-elements
_.isVoidTag = _.makePredicate("area base br col embed hr img input keygen link menuitem meta param source track wbr r-content");
_.isBooleanAttr = _.makePredicate('selected checked disabled readonly required open autofocus controls autoplay compact loop defer multiple');


_.isExpr = function(expr){
  return expr && expr.type === 'expression';
}
// @TODO: make it more strict
_.isGroup = function(group){
  return group.inject || group.$inject;
}

_.getCompileFn = function(source, ctx, options){
  return ctx.$compile.bind(ctx,source, options)
}

// remove directive param from AST
_.fixTagAST = function( tagAST, Component ){

  if( tagAST.touched ) return;

  var attrs = tagAST.attrs;

  if( !attrs ) return;

  // Maybe multiple directive need same param, 
  // We place all param in totalParamMap
  var len = attrs.length;
  if(!len) return;
  var directives=[], otherAttrMap = {};
  for(;len--;){

    var attr = attrs[ len ];


    // @IE fix IE9- input type can't assign after value
    if(attr.name === 'type') attr.priority = MAX_PRIORITY+1;

    var directive = Component.directive( attr.name );
    if( directive ) {

      attr.priority = directive.priority || 1;
      attr.directive = true;
      directives.push(attr);

    }else if(attr.type === 'attribute'){
      otherAttrMap[attr.name] = attr.value;
    }
  }

  directives.forEach( function( attr ){
    var directive = Component.directive(attr.name);
    var param = directive.param;
    if(param && param.length){
      attr.param = {};
      param.forEach(function( name ){
        if( name in otherAttrMap ){
          attr.param[name] = otherAttrMap[name] === undefined? true: otherAttrMap[name]
          _.removeOne(attrs, function(attr){
            return attr.name === name
          })
        }
      })
    }
  });

  attrs.sort(function(a1, a2){
    
    var p1 = a1.priority;
    var p2 = a2.priority;

    if( p1 == null ) p1 = MAX_PRIORITY;
    if( p2 == null ) p2 = MAX_PRIORITY;

    return p2 - p1;

  })

  tagAST.touched = true;
}

_.findItem = function(list, filter){
  if(!list || !list.length) return;
  var len = list.length;
  while(len--){
    if(filter(list[len])) return list[len]
  }
}

_.getParamObj = function(component, param){
  var paramObj = {};
  if(param) {
    for(var i in param) if(param.hasOwnProperty(i)){
      var value = param[i];
      paramObj[i] =  value && value.type==='expression'? component.$get(value): value;
    }
  }
  return paramObj;
}






/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(9).setImmediate))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports) {


module.exports = {
  'BEGIN': '{',
  'END': '}',
  'PRECOMPILE': false
}

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Freelist = __webpack_require__(7);

if(window.define){
    window.define([], function(){
        return Freelist;
    });
}
if(document && document.nodeType){
    window.Freelist = Freelist;
}
module.exports = Freelist;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Parser = __webpack_require__(8);

function Freelist(config){
    var tpl = config.template;
    var data = config.data;
    
    /**配置数据模型 */
    Freelist.config(config, this);

    /**执行config */
    typeof this.config === 'function' && this.config(this.data);

    /**解析字符串--->AST树 */
    this.AST = Freelist.parse(tpl)
    
}

Freelist.parse = function(str){
    return new Parser(str).parse();
}

Freelist.config = function(config, context){
    var keys = Object.keys(config);
    for(var i=0;i<keys.length;i++){
        var value = config[keys[i]];
        context[keys[i]] = value;
    }
    /**设置列表 */
    context._list = {};

    /**设置默认data */
    context.data = config.data || {};

    /**保存设置 */
    context.define = config;
}

Freelist.compiler = {
    'element': function(ast, context, listInfo){
        var node = document.createElement(ast.tag);

        var attrs = ast.attrs;
        /**处理属性 */
        for(var i=0;i<attrs.length;i++){
            var attr = attrs[i];
            
            switch(attr.type){
                case 'attribute': Freelist.resolveAttribute(attr, node, context, listInfo); break;
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

Freelist.replaceList = function(oldList, newList){
    for(var i=oldList.length-1;i>=0;i--){
        if(typeof newList[i] === 'undefined'){
            oldList.splice(i, 1);
        }else{
            oldList[i] = newList[i];
        }
    }
}

Freelist.resolveAttribute = function(attr, node, context, listInfo){
    var valueType = typeof attr.value;
    switch(valueType){
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, Freelist.resolveAttrValue(attr, node, context, listInfo)); break;
    }

    if(attr.name === 'list-container'){
        context._list.container = node;
    }
    
}

Freelist.resolveAttrValue = function(attr, node, context, listInfo){
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

Freelist.prototype._compile = function(ast, listInfo){
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

Freelist.prototype.$inject = function(node){
    this.containerNode = node;

    this.$render()
    node.append(this.domTree);
}

Freelist.prototype.$modify = function(index, model){
    var _list = this._list,
        _listContainer = _list.container,
        _body = _list.body;

    /**设置数据模型 */
    _list.data[index] = model;

    /**Dom精确更新 */
    var targetDom = _listContainer.children[index];
    var node = this._compile(_body, {item: model, item_index: index});

    _listContainer.replaceChild(node, targetDom);
}

Freelist.prototype.$insert = function(index, model){
    var _list = this._list,
        _listContainer = _list.container,
        _body = _list.body;

    /**设置数据模型 */
    _list.data.splice(index, 0, model);

    this.$render();
}

/**替换列表数据 */
Freelist.prototype.$replace = function(newList){
    var _list = this._list;

    Freelist.replaceList(_list.data, newList);
    this.$render();
};

Freelist.prototype.$delete = function(index){
     var _list = this._list,
        _listContainer = _list.container;

    /**设置数据模型 */
    _list.data.splice(index, 1);
    this.$render();
}

Freelist.prototype.$render = function(workerRender){
    if(workerRender){
        this._renderAsync(workerRender);
    }else{
        this._renderSync();
    }
}

Freelist.prototype._renderSync = function(){
    /**获得编译器 */
    this._compiler = Freelist.compiler;

    /**编译AST树--->DOM树 */
    var newRoot = this.domTree = this._compile(this.AST),
        containerNode = this.containerNode,
        rootNode = this.rootNode;

    
    this.rootNode = newRoot.children[0];
    if(rootNode){
        containerNode.replaceChild(newRoot, rootNode);
    }
}

Freelist.prototype._renderAsync = function(workerRender){
    var data = this.data,
        ast = this.AST;
        //_worker = this.worker,
        //_messageBus = this._messageBus || new MessageBus(_worker);

    workerRender.receive({type: 'render', data: {ast: ast, data: data}})
        .then(function(data){
            this.containerNode.innerHTML = data.html;
            this.rootNode = this.containerNode.children[0];

            Freelist.addAsyncEvents.call(this, this.rootNode, data.events);
        }.bind(this));
}

Freelist.addAsyncEvents = function(node, events){
    if(node.getAttribute('list-container')){
        this._list.container = node;
    }
    if(typeof node.dataset === 'undefined' || typeof node.dataset.nodeID === 'undefined'){
        if(!node.children) return;
        for(var i=0;i<node.children.length;i++){
            Freelist.addAsyncEvents.call(this, node.children[i], events);
        }
    }
    var nodeId = node.dataset.nodeid;

    for(var id in events){
        if(id == nodeId){
            var eventHub = events[id];
            for(var j=0;j<eventHub.length;j++){
                var getHandler = new Function('c', 'd', 'e', 'return '+eventHub[j].value+';');
                var handler = getHandler(this, this.data, '');
                node.addEventListener(eventHub[j].name, getHandler(this, this.data, ''), false);
            }
            break;
        }
    }
    

    delete events[nodeId];

}

Freelist.prototype._sg_ = function(path, data){
    var result;
    if(path instanceof Event){
        result = path;
    }else{
        result = data[path];
    }
    return result;
}
module.exports = Freelist;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(0);

var config = __webpack_require__(2);
var node = __webpack_require__(14);
var Lexer = __webpack_require__(15);
var varName = _.varName;
var ctxName = _.ctxName;
var extName = _.extName;
var isPath = _.makePredicate("STRING IDENT NUMBER");
var isKeyWord = _.makePredicate("true false undefined null this Array Date JSON Math NaN RegExp decodeURI decodeURIComponent encodeURI encodeURIComponent parseFloat parseInt Object");




function Parser(input, opts){
  opts = opts || {};

  this.input = input;
  this.tokens = new Lexer(input, opts).lex();
  this.pos = 0;
  this.length = this.tokens.length;
}


var op = Parser.prototype;


op.parse = function(){
  this.pos = 0;
  var res= this.program();
  if(this.ll().type === 'TAG_CLOSE'){
    this.error("You may got a unclosed Tag")
  }
  return res;
}

op.ll =  function(k){
  k = k || 1;
  if(k < 0) k = k + 1;
  var pos = this.pos + k - 1;
  if(pos > this.length - 1){
      return this.tokens[this.length-1];
  }
  return this.tokens[pos];
}
  // lookahead
op.la = function(k){
  return (this.ll(k) || '').type;
}

op.match = function(type, value){
  var ll;
  if(!(ll = this.eat(type, value))){
    ll  = this.ll();
    this.error('expect [' + type + (value == null? '':':'+ value) + ']" -> got "[' + ll.type + (value==null? '':':'+ll.value) + ']', ll.pos)
  }else{
    return ll;
  }
}

op.error = function(msg, pos){
  msg =  "\n【 parse failed 】 " + msg +  ':\n\n' + _.trackErrorPos(this.input, typeof pos === 'number'? pos: this.ll().pos||0);
  throw new Error(msg);
}

op.next = function(k){
  k = k || 1;
  this.pos += k;
}
op.eat = function(type, value){
  var ll = this.ll();
  if(typeof type !== 'string'){
    for(var len = type.length ; len--;){
      if(ll.type === type[len]) {
        this.next();
        return ll;
      }
    }
  }else{
    if( ll.type === type && (typeof value === 'undefined' || ll.value === value) ){
       this.next();
       return ll;
    }
  }
  return false;
}

// program
//  :EOF
//  | (statement)* EOF
op.program = function(){
  var statements = [],  ll = this.ll();
  while(ll.type !== 'EOF' && ll.type !=='TAG_CLOSE'){

    statements.push(this.statement());
    ll = this.ll();
  }
  // if(ll.type === 'TAG_CLOSE') this.error("You may have unmatched Tag")
  return statements;
}

// statement
//  : xml
//  | jst
//  | text
op.statement = function(){
  var ll = this.ll();
  switch(ll.type){
    case 'NAME':
    case 'TEXT':
      var text = ll.value;
      this.next();
      while(ll = this.eat(['NAME', 'TEXT'])){
        text += ll.value;
      }
      return node.text(text);
    case 'TAG_OPEN':
      return this.xml();
    case 'OPEN': 
      return this.directive();
    case 'EXPR_OPEN':
      return this.interplation();
    default:
      this.error('Unexpected token: '+ this.la())
  }
}

// xml 
// stag statement* TAG_CLOSE?(if self-closed tag)
op.xml = function(){
  var name, attrs, children, selfClosed;
  name = this.match('TAG_OPEN').value;
  attrs = this.attrs();
  selfClosed = this.eat('/')
  this.match('>');
  if( !selfClosed && !_.isVoidTag(name) ){
    children = this.program();
    if(!this.eat('TAG_CLOSE', name)) this.error('expect </'+name+'> got'+ 'no matched closeTag')
  }
  return node.element(name, attrs, children);
}

// xentity
//  -rule(wrap attribute)
//  -attribute
//
// __example__
//  name = 1 |  
//  ng-hide |
//  on-click={{}} | 
//  {{#if name}}on-click={{xx}}{{#else}}on-tap={{}}{{/if}}

op.xentity = function(ll){
  var name = ll.value, value, modifier;
  if(ll.type === 'NAME'){
    //@ only for test
    if(~name.indexOf('.')){
      var tmp = name.split('.');
      name = tmp[0];
      modifier = tmp[1]

    }
    if( this.eat("=") ) value = this.attvalue(modifier);
    return node.attribute( name, value, modifier );
  }else{
    if( name !== 'if') this.error("current version. ONLY RULE #if #else #elseif is valid in tag, the rule #" + name + ' is invalid');
    return this['if'](true);
  }

}

// stag     ::=    '<' Name (S attr)* S? '>'  
// attr    ::=     Name Eq attvalue
op.attrs = function(isAttribute){
  var eat
  if(!isAttribute){
    eat = ["NAME", "OPEN"]
  }else{
    eat = ["NAME"]
  }

  var attrs = [], ll;
  while (ll = this.eat(eat)){
    attrs.push(this.xentity( ll ))
  }
  return attrs;
}

// attvalue
//  : STRING  
//  | NAME
op.attvalue = function(mdf){
  var ll = this.ll();
  switch(ll.type){
    case "NAME":
    case "UNQ":
    case "STRING":
      this.next();
      var value = ll.value;
      if(~value.indexOf(config.BEGIN) && ~value.indexOf(config.END) && mdf!=='cmpl'){
        var constant = true;
        var parsed = new Parser(value, { mode: 2 }).parse();
        if(parsed.length === 1 && parsed[0].type === 'expression') return parsed[0];
        var body = [];
        parsed.forEach(function(item){
          if(!item.constant) constant=false;
          // silent the mutiple inteplation
            body.push(item.body || "'" + item.text.replace(/'/g, "\\'") + "'");        
        });
        body = "[" + body.join(",") + "].join('')";
        value = node.expression(body, null, constant);
      }
      return value;
    case "EXPR_OPEN":
      return this.interplation();
    // case "OPEN":
    //   if(ll.value === 'inc' || ll.value === 'include'){
    //     this.next();
    //     return this.inc();
    //   }else{
    //     this.error('attribute value only support inteplation and {#inc} statement')
    //   }
    //   break;
    default:
      this.error('Unexpected token: '+ this.la())
  }
}


// {{#}}
op.directive = function(){
  var name = this.ll().value;
  this.next();
  if(typeof this[name] === 'function'){
    return this[name]()
  }else{
    this.error('Undefined directive['+ name +']');
  }
}


// {{}}
op.interplation = function(){
  this.match('EXPR_OPEN');
  var res = this.expression(true);
  this.match('END');
  return res;
}

// {{~}}
op.inc = op.include = function(){
  var content = this.expression();
  this.match('END');
  return node.template(content);
}

// {{#if}}
op["if"] = function(tag){
  var test = this.expression();
  var consequent = [], alternate=[];

  var container = consequent;
  var statement = !tag? "statement" : "attrs";

  this.match('END');

  var ll, close;
  while( ! (close = this.eat('CLOSE')) ){
    ll = this.ll();
    if( ll.type === 'OPEN' ){
      switch( ll.value ){
        case 'else':
          container = alternate;
          this.next();
          this.match( 'END' );
          break;
        case 'elseif':
          this.next();
          alternate.push( this["if"](tag) );
          return node['if']( test, consequent, alternate );
        default:
          container.push( this[statement](true) );
      }
    }else{
      container.push(this[statement](true));
    }
  }
  // if statement not matched
  if(close.value !== "if") this.error('Unmatched if directive')
  return node["if"](test, consequent, alternate);
}


// @mark   mustache syntax have natrure dis, canot with expression
// {{#list}}
op.list = function(){
  // sequence can be a list or hash
  var sequence = this.expression(), variable, ll, track;
  var consequent = [], alternate=[];
  var container = consequent;

  this.match('IDENT', 'as');

  variable = this.match('IDENT').value;

  if(this.eat('IDENT', 'by')){
    if(this.eat('IDENT',variable + '_index')){
      track = true;
    }else{
      track = this.expression();
      if(track.constant){
        // true is means constant, we handle it just like xxx_index.
        track = true;
      }
    }
  }

  this.match('END');

  while( !(ll = this.eat('CLOSE')) ){
    if(this.eat('OPEN', 'else')){
      container =  alternate;
      this.match('END');
    }else{
      container.push(this.statement());
    }
  }
  
  if(ll.value !== 'list') this.error('expect ' + 'list got ' + '/' + ll.value + ' ', ll.pos );
  return node.list(sequence, variable, consequent, alternate, track);
}


op.expression = function(){
  var expression;
  if(this.eat('@(')){ //once bind
    expression = this.expr();
    expression.once = true;
    this.match(')')
  }else{
    expression = this.expr();
  }
  return expression;
}

op.expr = function(){
  this.depend = [];

  var buffer = this.filter()

  var body = buffer.get || buffer;
  var setbody = buffer.set;
  return node.expression(body, setbody, !this.depend.length, buffer.filters);
}


// filter
// assign ('|' filtername[':' args]) * 
op.filter = function(){
  var left = this.assign();
  var ll = this.eat('|');
  var buffer = [], filters,setBuffer, prefix,
    attr = "t", 
    set = left.set, get, 
    tmp = "";

  if(ll){
    if(set) {
      setBuffer = [];
      filters = [];
    }

    prefix = "(function(" + attr + "){";

    do{
      var filterName = this.match('IDENT').value;
      tmp = attr + " = " + ctxName + "._f_('" + filterName + "' ).get.call( "+_.ctxName +"," + attr ;
      if(this.eat(':')){
        tmp +=", "+ this.arguments("|").join(",") + ");"
      }else{
        tmp += ');'
      }
      buffer.push(tmp);
      
      if(set){
        // only in runtime ,we can detect  whether  the filter has a set function. 
        filters.push(filterName);
        setBuffer.unshift( tmp.replace(" ).get.call", " ).set.call") );
      }

    }while(ll = this.eat('|'));
    buffer.push("return " + attr );
    setBuffer && setBuffer.push("return " + attr);

    get =  prefix + buffer.join("") + "})("+left.get+")";
    // we call back to value.
    if(setBuffer){
      // change _ss__(name, _p_) to _s__(name, filterFn(_p_));
      set = set.replace(_.setName, 
        prefix + setBuffer.join("") + "})("+　_.setName　+")" );

    }
    // the set function is depend on the filter definition. if it have set method, the set will work
    var ret = getset(get, set);
    ret.filters = filters;
    return ret;
  }
  return left;
}

// assign
// left-hand-expr = condition
op.assign = function(){
  var left = this.condition(), ll;
  if(ll = this.eat(['=', '+=', '-=', '*=', '/=', '%='])){
    if(!left.set) this.error('invalid lefthand expression in assignment expression');
    return getset( left.set.replace( "," + _.setName, "," + this.condition().get ).replace("'='", "'"+ll.type+"'"), left.set);
    // return getset('(' + left.get + ll.type  + this.condition().get + ')', left.set);
  }
  return left;
}

// or
// or ? assign : assign
op.condition = function(){

  var test = this.or();
  if(this.eat('?')){
    return getset([test.get + "?", 
      this.assign().get, 
      this.match(":").type, 
      this.assign().get].join(""));
  }

  return test;
}

// and
// and && or
op.or = function(){

  var left = this.and();

  if(this.eat('||')){
    return getset(left.get + '||' + this.or().get);
  }

  return left;
}
// equal
// equal && and
op.and = function(){

  var left = this.equal();

  if(this.eat('&&')){
    return getset(left.get + '&&' + this.and().get);
  }
  return left;
}
// relation
// 
// equal == relation
// equal != relation
// equal === relation
// equal !== relation
op.equal = function(){
  var left = this.relation(), ll;
  // @perf;
  if( ll = this.eat(['==','!=', '===', '!=='])){
    return getset(left.get + ll.type + this.equal().get);
  }
  return left
}
// relation < additive
// relation > additive
// relation <= additive
// relation >= additive
// relation in additive
op.relation = function(){
  var left = this.additive(), ll;
  // @perf
  if(ll = (this.eat(['<', '>', '>=', '<=']) || this.eat('IDENT', 'in') )){
    return getset(left.get + ll.value + this.relation().get);
  }
  return left
}
// additive :
// multive
// additive + multive
// additive - multive
op.additive = function(){
  var left = this.multive() ,ll;
  if(ll= this.eat(['+','-']) ){
    return getset(left.get + ll.value + this.additive().get);
  }
  return left
}
// multive :
// unary
// multive * unary
// multive / unary
// multive % unary
op.multive = function(){
  var left = this.range() ,ll;
  if( ll = this.eat(['*', '/' ,'%']) ){
    return getset(left.get + ll.type + this.multive().get);
  }
  return left;
}

op.range = function(){
  var left = this.unary(), ll, right;

  if(ll = this.eat('..')){
    right = this.unary();
    var body = 
      "(function(start,end){var res = [],step=end>start?1:-1; for(var i = start; end>start?i <= end: i>=end; i=i+step){res.push(i); } return res })("+left.get+","+right.get+")"
    return getset(body);
  }

  return left;
}



// lefthand
// + unary
// - unary
// ~ unary
// ! unary
op.unary = function(){
  var ll;
  if(ll = this.eat(['+','-','~', '!'])){
    return getset('(' + ll.type + this.unary().get + ')') ;
  }else{
    return this.member()
  }
}

// call[lefthand] :
// member args
// member [ expression ]
// member . ident  

op.member = function(base, last, pathes, prevBase){
  var ll, path, extValue;


  var onlySimpleAccessor = false;
  if(!base){ //first
    path = this.primary();
    var type = typeof path;
    if(type === 'string'){ 
      pathes = [];
      pathes.push( path );
      last = path;
      extValue = extName + "." + path
      base = ctxName + "._sg_('" + path + "', " + varName + ", " + extName + ")";
      onlySimpleAccessor = true;
    }else{ //Primative Type
      if(path.get === 'this'){
        base = ctxName;
        pathes = ['this'];
      }else{
        pathes = null;
        base = path.get;
      }
    }
  }else{ // not first enter
    if(typeof last === 'string' && isPath( last) ){ // is valid path
      pathes.push(last);
    }else{
      if(pathes && pathes.length) this.depend.push(pathes);
      pathes = null;
    }
  }
  if(ll = this.eat(['[', '.', '('])){
    switch(ll.type){
      case '.':
          // member(object, property, computed)
        var tmpName = this.match('IDENT').value;
        prevBase = base;
        if( this.la() !== "(" ){ 
          base = ctxName + "._sg_('" + tmpName + "', " + base + ")";
        }else{
          base += "['" + tmpName + "']";
        }
        return this.member( base, tmpName, pathes,  prevBase);
      case '[':
          // member(object, property, computed)
        path = this.assign();
        prevBase = base;
        if( this.la() !== "(" ){ 
        // means function call, we need throw undefined error when call function
        // and confirm that the function call wont lose its context
          base = ctxName + "._sg_(" + path.get + ", " + base + ")";
        }else{
          base += "[" + path.get + "]";
        }
        this.match(']')
        return this.member(base, path, pathes, prevBase);
      case '(':
        // call(callee, args)
        var args = this.arguments().join(',');
        base =  base+"(" + args +")";
        this.match(')')
        return this.member(base, null, pathes);
    }
  }
  if( pathes && pathes.length ) this.depend.push( pathes );
  var res =  {get: base};
  if(last){
    res.set = ctxName + "._ss_(" + 
        (last.get? last.get : "'"+ last + "'") + 
        ","+ _.setName + ","+ 
        (prevBase?prevBase:_.varName) + 
        ", '=', "+ ( onlySimpleAccessor? 1 : 0 ) + ")";
  
  }
  return res;
}

/**
 * 
 */
op.arguments = function(end){
  end = end || ')'
  var args = [];
  do{
    if(this.la() !== end){
      args.push(this.assign().get)
    }
  }while( this.eat(','));
  return args
}


// primary :
// this 
// ident
// literal
// array
// object
// ( expression )

op.primary = function(){
  var ll = this.ll();
  switch(ll.type){
    case "{":
      return this.object();
    case "[":
      return this.array();
    case "(":
      return this.paren();
    // literal or ident
    case 'STRING':
      this.next();
      var value = "" + ll.value;
      var quota = ~value.indexOf("'")? "\"": "'" ;
      return getset(quota + value + quota);
    case 'NUMBER':
      this.next();
      return getset( "" + ll.value );
    case "IDENT":
      this.next();
      if(isKeyWord(ll.value)){
        return getset( ll.value );
      }
      return ll.value;
    default: 
      this.error('Unexpected Token: ' + ll.type);
  }
}

// object
//  {propAssign [, propAssign] * [,]}

// propAssign
//  prop : assign

// prop
//  STRING
//  IDENT
//  NUMBER

op.object = function(){
  var code = [this.match('{').type];

  var ll = this.eat( ['STRING', 'IDENT', 'NUMBER'] );
  while(ll){
    code.push("'" + ll.value + "'" + this.match(':').type);
    var get = this.assign().get;
    code.push(get);
    ll = null;
    if(this.eat(",") && (ll = this.eat(['STRING', 'IDENT', 'NUMBER'])) ) code.push(",");
  }
  code.push(this.match('}').type);
  return {get: code.join("")}
}

// array
// [ assign[,assign]*]
op.array = function(){
  var code = [this.match('[').type], item;
  if( this.eat("]") ){

     code.push("]");
  } else {
    while(item = this.assign()){
      code.push(item.get);
      if(this.eat(',')) code.push(",");
      else break;
    }
    code.push(this.match(']').type);
  }
  return {get: code.join("")};
}

// '(' expression ')'
op.paren = function(){
  this.match('(');
  var res = this.filter()
  res.get = '(' + res.get + ')';
  res.set = res.set;
  this.match(')');
  return res;
}

function getset(get, set){
  return {
    get: get,
    set: set
  }
}



module.exports = Parser;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(10);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), __webpack_require__(11)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports) {

// shim for es5
var slice = [].slice;
var tstr = ({}).toString;

function extend(o1, o2 ){
  for(var i in o2) if( o1[i] === undefined){
    o1[i] = o2[i]
  }
  return o2;
}


module.exports = function(){
  // String proto ;
  extend(String.prototype, {
    trim: function(){
      return this.replace(/^\s+|\s+$/g, '');
    }
  });


  // Array proto;
  extend(Array.prototype, {
    indexOf: function(obj, from){
      from = from || 0;
      for (var i = from, len = this.length; i < len; i++) {
        if (this[i] === obj) return i;
      }
      return -1;
    },
    // polyfill from MDN 
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    forEach: function(callback, ctx){
      var k = 0;

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      var len = O.length >>> 0; 

      if ( typeof callback !== "function" ) {
        throw new TypeError( callback + " is not a function" );
      }

      // 7. Repeat, while k < len
      while( k < len ) {

        var kValue;

        if ( k in O ) {

          kValue = O[ k ];

          callback.call( ctx, kValue, k, O );
        }
        k++;
      }
    },
    // @deprecated
    //  will be removed at 0.5.0
    filter: function(fun, context){

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== "function")
        throw new TypeError();

      var res = [];
      for (var i = 0; i < len; i++)
      {
        if (i in t)
        {
          var val = t[i];
          if (fun.call(context, val, i, t))
            res.push(val);
        }
      }

      return res;
    }
  });

  // Function proto;
  extend(Function.prototype, {
    bind: function(context){
      var fn = this;
      var preArgs = slice.call(arguments, 1);
      return function(){
        var args = preArgs.concat(slice.call(arguments));
        return fn.apply(context, args);
      }
    }
  })
  
  // Array
  extend(Array, {
    isArray: function(arr){
      return tstr.call(arr) === "[object Array]";
    }
  })
}



/***/ }),
/* 13 */
/***/ (function(module, exports) {

// http://stackoverflow.com/questions/1354064/how-to-convert-characters-to-html-entities-using-plain-javascript
var entities = {
  'quot':34, 
  'amp':38, 
  'apos':39, 
  'lt':60, 
  'gt':62, 
  'nbsp':160, 
  'iexcl':161, 
  'cent':162, 
  'pound':163, 
  'curren':164, 
  'yen':165, 
  'brvbar':166, 
  'sect':167, 
  'uml':168, 
  'copy':169, 
  'ordf':170, 
  'laquo':171, 
  'not':172, 
  'shy':173, 
  'reg':174, 
  'macr':175, 
  'deg':176, 
  'plusmn':177, 
  'sup2':178, 
  'sup3':179, 
  'acute':180, 
  'micro':181, 
  'para':182, 
  'middot':183, 
  'cedil':184, 
  'sup1':185, 
  'ordm':186, 
  'raquo':187, 
  'frac14':188, 
  'frac12':189, 
  'frac34':190, 
  'iquest':191, 
  'Agrave':192, 
  'Aacute':193, 
  'Acirc':194, 
  'Atilde':195, 
  'Auml':196, 
  'Aring':197, 
  'AElig':198, 
  'Ccedil':199, 
  'Egrave':200, 
  'Eacute':201, 
  'Ecirc':202, 
  'Euml':203, 
  'Igrave':204, 
  'Iacute':205, 
  'Icirc':206, 
  'Iuml':207, 
  'ETH':208, 
  'Ntilde':209, 
  'Ograve':210, 
  'Oacute':211, 
  'Ocirc':212, 
  'Otilde':213, 
  'Ouml':214, 
  'times':215, 
  'Oslash':216, 
  'Ugrave':217, 
  'Uacute':218, 
  'Ucirc':219, 
  'Uuml':220, 
  'Yacute':221, 
  'THORN':222, 
  'szlig':223, 
  'agrave':224, 
  'aacute':225, 
  'acirc':226, 
  'atilde':227, 
  'auml':228, 
  'aring':229, 
  'aelig':230, 
  'ccedil':231, 
  'egrave':232, 
  'eacute':233, 
  'ecirc':234, 
  'euml':235, 
  'igrave':236, 
  'iacute':237, 
  'icirc':238, 
  'iuml':239, 
  'eth':240, 
  'ntilde':241, 
  'ograve':242, 
  'oacute':243, 
  'ocirc':244, 
  'otilde':245, 
  'ouml':246, 
  'divide':247, 
  'oslash':248, 
  'ugrave':249, 
  'uacute':250, 
  'ucirc':251, 
  'uuml':252, 
  'yacute':253, 
  'thorn':254, 
  'yuml':255, 
  'fnof':402, 
  'Alpha':913, 
  'Beta':914, 
  'Gamma':915, 
  'Delta':916, 
  'Epsilon':917, 
  'Zeta':918, 
  'Eta':919, 
  'Theta':920, 
  'Iota':921, 
  'Kappa':922, 
  'Lambda':923, 
  'Mu':924, 
  'Nu':925, 
  'Xi':926, 
  'Omicron':927, 
  'Pi':928, 
  'Rho':929, 
  'Sigma':931, 
  'Tau':932, 
  'Upsilon':933, 
  'Phi':934, 
  'Chi':935, 
  'Psi':936, 
  'Omega':937, 
  'alpha':945, 
  'beta':946, 
  'gamma':947, 
  'delta':948, 
  'epsilon':949, 
  'zeta':950, 
  'eta':951, 
  'theta':952, 
  'iota':953, 
  'kappa':954, 
  'lambda':955, 
  'mu':956, 
  'nu':957, 
  'xi':958, 
  'omicron':959, 
  'pi':960, 
  'rho':961, 
  'sigmaf':962, 
  'sigma':963, 
  'tau':964, 
  'upsilon':965, 
  'phi':966, 
  'chi':967, 
  'psi':968, 
  'omega':969, 
  'thetasym':977, 
  'upsih':978, 
  'piv':982, 
  'bull':8226, 
  'hellip':8230, 
  'prime':8242, 
  'Prime':8243, 
  'oline':8254, 
  'frasl':8260, 
  'weierp':8472, 
  'image':8465, 
  'real':8476, 
  'trade':8482, 
  'alefsym':8501, 
  'larr':8592, 
  'uarr':8593, 
  'rarr':8594, 
  'darr':8595, 
  'harr':8596, 
  'crarr':8629, 
  'lArr':8656, 
  'uArr':8657, 
  'rArr':8658, 
  'dArr':8659, 
  'hArr':8660, 
  'forall':8704, 
  'part':8706, 
  'exist':8707, 
  'empty':8709, 
  'nabla':8711, 
  'isin':8712, 
  'notin':8713, 
  'ni':8715, 
  'prod':8719, 
  'sum':8721, 
  'minus':8722, 
  'lowast':8727, 
  'radic':8730, 
  'prop':8733, 
  'infin':8734, 
  'ang':8736, 
  'and':8743, 
  'or':8744, 
  'cap':8745, 
  'cup':8746, 
  'int':8747, 
  'there4':8756, 
  'sim':8764, 
  'cong':8773, 
  'asymp':8776, 
  'ne':8800, 
  'equiv':8801, 
  'le':8804, 
  'ge':8805, 
  'sub':8834, 
  'sup':8835, 
  'nsub':8836, 
  'sube':8838, 
  'supe':8839, 
  'oplus':8853, 
  'otimes':8855, 
  'perp':8869, 
  'sdot':8901, 
  'lceil':8968, 
  'rceil':8969, 
  'lfloor':8970, 
  'rfloor':8971, 
  'lang':9001, 
  'rang':9002, 
  'loz':9674, 
  'spades':9824, 
  'clubs':9827, 
  'hearts':9829, 
  'diams':9830, 
  'OElig':338, 
  'oelig':339, 
  'Scaron':352, 
  'scaron':353, 
  'Yuml':376, 
  'circ':710, 
  'tilde':732, 
  'ensp':8194, 
  'emsp':8195, 
  'thinsp':8201, 
  'zwnj':8204, 
  'zwj':8205, 
  'lrm':8206, 
  'rlm':8207, 
  'ndash':8211, 
  'mdash':8212, 
  'lsquo':8216, 
  'rsquo':8217, 
  'sbquo':8218, 
  'ldquo':8220, 
  'rdquo':8221, 
  'bdquo':8222, 
  'dagger':8224, 
  'Dagger':8225, 
  'permil':8240, 
  'lsaquo':8249, 
  'rsaquo':8250, 
  'euro':8364
}



module.exports  = entities;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = {
  element: function(name, attrs, children){
    return {
      type: 'element',
      tag: name,
      attrs: attrs,
      children: children
    }
  },
  attribute: function(name, value, mdf){
    return {
      type: 'attribute',
      name: name,
      value: value,
      mdf: mdf
    }
  },
  "if": function(test, consequent, alternate){
    return {
      type: 'if',
      test: test,
      consequent: consequent,
      alternate: alternate
    }
  },
  list: function(sequence, variable, body, alternate, track){
    return {
      type: 'list',
      sequence: sequence,
      alternate: alternate,
      variable: variable,
      body: body,
      track: track
    }
  },
  expression: function( body, setbody, constant, filters ){
    return {
      type: "expression",
      body: body,
      constant: constant || false,
      setbody: setbody || false,
      filters: filters
    }
  },
  text: function(text){
    return {
      type: "text",
      text: text
    }
  },
  template: function(template){
    return {
      type: 'template',
      content: template
    }
  }
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(0);
var config = __webpack_require__(2);

// some custom tag  will conflict with the Lexer progress
var conflictTag = {"}": "{", "]": "["}, map1, map2;
// some macro for lexer
var macro = {
  'NAME': /(?:[:_A-Za-z][-\.:_0-9A-Za-z]*)/,
  'IDENT': /[\$_A-Za-z][_0-9A-Za-z\$]*/,
  'SPACE': /[\r\n\t\f ]/
}


var test = /a|(b)/.exec("a");
var testSubCapure = test && test[1] === undefined? 
  function(str){ return str !== undefined }
  :function(str){return !!str};

function wrapHander(handler){
  return function(all){
    return {type: handler, value: all }
  }
}

function Lexer(input, opts){
  if(conflictTag[config.END]){
    this.markStart = conflictTag[config.END];
    this.markEnd = config.END;
  }

  this.input = (input||"").trim();
  this.opts = opts || {};
  this.map = this.opts.mode !== 2?  map1: map2;
  this.states = ["INIT"];
  if(opts && opts.expression){
     this.states.push("JST");
     this.expression = true;
  }
}

var lo = Lexer.prototype


lo.lex = function(str){
  str = (str || this.input).trim();
  var tokens = [], split, test,mlen, token, state;
  this.input = str, 
  this.marks = 0;
  // init the pos index
  this.index=0;
  var i = 0;
  while(str){
    i++
    state = this.state();
    split = this.map[state] 
    test = split.TRUNK.exec(str);
    if(!test){
      this.error('Unrecoginized Token');
    }
    mlen = test[0].length;
    str = str.slice(mlen)
    token = this._process.call(this, test, split, str)
    if(token) tokens.push(token)
    this.index += mlen;
    // if(state == 'TAG' || state == 'JST') str = this.skipspace(str);
  }

  tokens.push({type: 'EOF'});

  return tokens;
}

lo.error = function(msg){
  throw  Error("Parse Error: " + msg +  ':\n' + _.trackErrorPos(this.input, this.index));
}

lo._process = function(args, split,str){
  // console.log(args.join(","), this.state())
  var links = split.links, marched = false, token;

  for(var len = links.length, i=0;i<len ;i++){
    var link = links[i],
      handler = link[2],
      index = link[0];
    // if(args[6] === '>' && index === 6) console.log('haha')
    if(testSubCapure(args[index])) {
      marched = true;
      if(handler){
        token = handler.apply(this, args.slice(index, index + link[1]))
        if(token)  token.pos = this.index;
      }
      break;
    }
  }
  if(!marched){ // in ie lt8 . sub capture is "" but ont 
    switch(str.charAt(0)){
      case "<":
        this.enter("TAG");
        break;
      default:
        this.enter("JST");
        break;
    }
  }
  return token;
}
lo.enter = function(state){
  this.states.push(state)
  return this;
}

lo.state = function(){
  var states = this.states;
  return states[states.length-1];
}

lo.leave = function(state){
  var states = this.states;
  if(!state || states[states.length-1] === state) states.pop()
}


Lexer.setup = function(){
  macro.END = config.END;
  macro.BEGIN = config.BEGIN;
  //
  map1 = genMap([
    // INIT
    rules.ENTER_JST,
    rules.ENTER_TAG,
    rules.TEXT,

    //TAG
    rules.TAG_NAME,
    rules.TAG_OPEN,
    rules.TAG_CLOSE,
    rules.TAG_PUNCHOR,
    rules.TAG_ENTER_JST,
    rules.TAG_UNQ_VALUE,
    rules.TAG_STRING,
    rules.TAG_SPACE,
    rules.TAG_COMMENT,

    // JST
    rules.JST_OPEN,
    rules.JST_CLOSE,
    rules.JST_COMMENT,
    rules.JST_EXPR_OPEN,
    rules.JST_IDENT,
    rules.JST_SPACE,
    rules.JST_LEAVE,
    rules.JST_NUMBER,
    rules.JST_PUNCHOR,
    rules.JST_STRING,
    rules.JST_COMMENT
    ])

  // ignored the tag-relative token
  map2 = genMap([
    // INIT no < restrict
    rules.ENTER_JST2,
    rules.TEXT,
    // JST
    rules.JST_COMMENT,
    rules.JST_OPEN,
    rules.JST_CLOSE,
    rules.JST_EXPR_OPEN,
    rules.JST_IDENT,
    rules.JST_SPACE,
    rules.JST_LEAVE,
    rules.JST_NUMBER,
    rules.JST_PUNCHOR,
    rules.JST_STRING,
    rules.JST_COMMENT
    ])
}


function genMap(rules){
  var rule, map = {}, sign;
  for(var i = 0, len = rules.length; i < len ; i++){
    rule = rules[i];
    sign = rule[2] || 'INIT';
    ( map[sign] || (map[sign] = {rules:[], links:[]}) ).rules.push(rule);
  }
  return setup(map);
}

function setup(map){
  var split, rules, trunks, handler, reg, retain, rule;
  function replaceFn(all, one){
    return typeof macro[one] === 'string'? 
      _.escapeRegExp(macro[one]) 
      : String(macro[one]).slice(1,-1);
  }

  for(var i in map){

    split = map[i];
    split.curIndex = 1;
    rules = split.rules;
    trunks = [];

    for(var j = 0,len = rules.length; j<len; j++){
      rule = rules[j]; 
      reg = rule[0];
      handler = rule[1];

      if(typeof handler === 'string'){
        handler = wrapHander(handler);
      }
      if(_.typeOf(reg) === 'regexp') reg = reg.toString().slice(1, -1);

      reg = reg.replace(/\{(\w+)\}/g, replaceFn)
      retain = _.findSubCapture(reg) + 1; 
      split.links.push([split.curIndex, retain, handler]); 
      split.curIndex += retain;
      trunks.push(reg);
    }
    split.TRUNK = new RegExp("^(?:(" + trunks.join(")|(") + "))")
  }
  return map;
}

var rules = {

  // 1. INIT
  // ---------------

  // mode1's JST ENTER RULE
  ENTER_JST: [/[^\x00<]*?(?={BEGIN})/, function(all){
    this.enter('JST');
    if(all) return {type: 'TEXT', value: all}
  }],

  // mode2's JST ENTER RULE
  ENTER_JST2: [/[^\x00]*?(?={BEGIN})/, function(all){
    this.enter('JST');
    if(all) return {type: 'TEXT', value: all}
  }],

  ENTER_TAG: [/[^\x00]*?(?=<[\w\/\!])/, function(all){ 
    this.enter('TAG');
    if(all) return {type: 'TEXT', value: all}
  }],

  TEXT: [/[^\x00]+/, 'TEXT' ],

  // 2. TAG
  // --------------------
  TAG_NAME: [/{NAME}/, 'NAME', 'TAG'],
  TAG_UNQ_VALUE: [/[^\{}&"'=><`\r\n\f\t ]+/, 'UNQ', 'TAG'],

  TAG_OPEN: [/<({NAME})\s*/, function(all, one){ //"
    return {type: 'TAG_OPEN', value: one}
  }, 'TAG'],
  TAG_CLOSE: [/<\/({NAME})[\r\n\f\t ]*>/, function(all, one){
    this.leave();
    return {type: 'TAG_CLOSE', value: one }
  }, 'TAG'],

    // mode2's JST ENTER RULE
  TAG_ENTER_JST: [/(?={BEGIN})/, function(){
    this.enter('JST');
  }, 'TAG'],


  TAG_PUNCHOR: [/[\>\/=&]/, function(all){
    if(all === '>') this.leave();
    return {type: all, value: all }
  }, 'TAG'],
  TAG_STRING:  [ /'([^']*)'|"([^"]*)\"/, /*'*/  function(all, one, two){ 
    var value = one || two || "";

    return {type: 'STRING', value: value}
  }, 'TAG'],

  TAG_SPACE: [/{SPACE}+/, null, 'TAG'],
  TAG_COMMENT: [/<\!--([^\x00]*?)--\>/, function(all){
    this.leave()
    // this.leave('TAG')
  } ,'TAG'],

  // 3. JST
  // -------------------

  JST_OPEN: ['{BEGIN}#{SPACE}*({IDENT})', function(all, name){
    return {
      type: 'OPEN',
      value: name
    }
  }, 'JST'],
  JST_LEAVE: [/{END}/, function(all){
    if(this.markEnd === all && this.expression) return {type: this.markEnd, value: this.markEnd};
    if(!this.markEnd || !this.marks ){
      this.firstEnterStart = false;
      this.leave('JST');
      return {type: 'END'}
    }else{
      this.marks--;
      return {type: this.markEnd, value: this.markEnd}
    }
  }, 'JST'],
  JST_CLOSE: [/{BEGIN}\s*\/({IDENT})\s*{END}/, function(all, one){
    this.leave('JST');
    return {
      type: 'CLOSE',
      value: one
    }
  }, 'JST'],
  JST_COMMENT: [/{BEGIN}\!([^\x00]*?)\!{END}/, function(){
    this.leave();
  }, 'JST'],
  JST_EXPR_OPEN: ['{BEGIN}',function(all, one){
    if(all === this.markStart){
      if(this.expression) return { type: this.markStart, value: this.markStart };
      if(this.firstEnterStart || this.marks){
        this.marks++
        this.firstEnterStart = false;
        return { type: this.markStart, value: this.markStart };
      }else{
        this.firstEnterStart = true;
      }
    }
    return {
      type: 'EXPR_OPEN',
      escape: false
    }

  }, 'JST'],
  JST_IDENT: ['{IDENT}', 'IDENT', 'JST'],
  JST_SPACE: [/[ \r\n\f]+/, null, 'JST'],
  JST_PUNCHOR: [/[=!]?==|[-=><+*\/%\!]?\=|\|\||&&|\@\(|\.\.|[<\>\[\]\(\)\-\|\{}\+\*\/%?:\.!,]/, function(all){
    return { type: all, value: all }
  },'JST'],

  JST_STRING:  [ /'([^']*)'|"([^"]*)"/, function(all, one, two){ //"'
    return {type: 'STRING', value: one || two || ""}
  }, 'JST'],
  JST_NUMBER: [/(?:[0-9]*\.[0-9]+|[0-9]+)(e\d+)?/, function(all){
    return {type: 'NUMBER', value: parseFloat(all, 10)};
  }, 'JST']
}


// setup when first config
Lexer.setup();



module.exports = Lexer;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTY1ODc3ZTZhNDkzYzRjODA4N2MiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9GcmVlbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGFyc2VyL3NyYy9QYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL190aW1lcnMtYnJvd3NlcmlmeUAyLjAuNEB0aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fc2V0aW1tZWRpYXRlQDEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL19wcm9jZXNzQDAuMTEuMTBAcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIvaGVscGVyL3NoaW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9oZWxwZXIvZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGFyc2VyL3NyYy9MZXhlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxVQUFVO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixxRUFBcUUsS0FBSztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7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QTtBQUNBLDBDQUEwQyxzQkFBc0IsRUFBRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7QUN6TEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7OztBQ3ZMdEM7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxTQUFTO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUEsMkI7Ozs7OztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7O0FDeERBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsRUFBRSxLQUFLLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsWUFBWTs7QUFFM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtDQUFrQyxPQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLG9CQUFvQjtBQUNwQixvQ0FBb0MsVUFBVTtBQUM5QztBQUNBO0FBQ0EsaUNBQWlDLG1CQUFtQjtBQUNwRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDLE9BQU87QUFDNUMsc0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixPQUFPO0FBQ2xDLHlDO0FBQ0EsMEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLE1BQU07QUFDbkM7QUFDQSxvQkFBb0I7QUFDcEIsR0FBRzs7QUFFSDtBQUNBLDZCQUE2QixNQUFNO0FBQ25DO0FBQ0Esb0JBQW9CO0FBQ3BCLEdBQUc7O0FBRUgsc0Q7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQixHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEIsd0JBQXdCOztBQUV4QixpQkFBaUIsS0FBSywwQkFBMEI7QUFDaEQsWUFBWTtBQUNaLEdBQUc7QUFDSCxvQkFBb0IsS0FBSztBQUN6QjtBQUNBLFlBQVk7QUFDWixHQUFHOztBQUVIO0FBQ0EsdUJBQXVCLE1BQU07QUFDN0I7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsWUFBWTtBQUNaLEdBQUc7QUFDSCx3RTtBQUNBOztBQUVBLFlBQVk7QUFDWixHQUFHOztBQUVILGdCQUFnQixNQUFNO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQSxlQUFlLE1BQU0sRUFBRSxNQUFNLEdBQUcsTUFBTTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxnQkFBZ0IsSUFBSTtBQUNwQix3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLEtBQUs7QUFDTDtBQUNBLGNBQWM7QUFDZDtBQUNBLEdBQUc7QUFDSCxnQkFBZ0IsTUFBTSxPQUFPLE1BQU0sS0FBSyxJQUFJO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsa0JBQWtCLE1BQU0sZ0JBQWdCLElBQUk7QUFDNUM7QUFDQSxHQUFHO0FBQ0gsb0JBQW9CLE1BQU07QUFDMUI7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQSwrRUFBK0U7QUFDL0UsWUFBWTtBQUNaLEdBQUc7O0FBRUgsZ0VBQWdFO0FBQ2hFLFlBQVk7QUFDWixHQUFHO0FBQ0g7QUFDQSxZQUFZO0FBQ1osR0FBRztBQUNIOzs7QUFHQTtBQUNBOzs7O0FBSUEsdUIiLCJmaWxlIjoiRnJlZWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBhNjU4NzdlNmE0OTNjNGM4MDg3YyIsInJlcXVpcmUoJy4vaGVscGVyL3NoaW0uanMnKSgpO1xyXG5cclxuXHJcblxyXG52YXIgXyAgPSBtb2R1bGUuZXhwb3J0cztcclxudmFyIGVudGl0aWVzID0gcmVxdWlyZSgnLi9oZWxwZXIvZW50aXRpZXMuanMnKTtcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciBvMnN0ciA9ICh7fSkudG9TdHJpbmc7XHJcbnZhciB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSd1bmRlZmluZWQnPyB3aW5kb3c6IGdsb2JhbDtcclxudmFyIE1BWF9QUklPUklUWSA9IDk5OTk7XHJcblxyXG5cclxuXy5ub29wID0gZnVuY3Rpb24oKXt9O1xyXG5fLnVpZCA9IChmdW5jdGlvbigpe1xyXG4gIHZhciBfdWlkPTA7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gX3VpZCsrO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uZXh0ZW5kID0gZnVuY3Rpb24oIG8xLCBvMiwgb3ZlcnJpZGUgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCB8fCBvdmVycmlkZSA9PT0gdHJ1ZSApe1xyXG4gICAgICBvMVtpXSA9IG8yW2ldXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvMTtcclxufVxyXG5cclxuXy5rZXlzID0gT2JqZWN0LmtleXM/IE9iamVjdC5rZXlzOiBmdW5jdGlvbihvYmope1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgcmVzLnB1c2goaSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbl8uc29tZSA9IGZ1bmN0aW9uKGxpc3QsIGZuKXtcclxuICBmb3IodmFyIGkgPTAsbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICBpZihmbihsaXN0W2ldKSkgcmV0dXJuIHRydWVcclxuICB9XHJcbn1cclxuXHJcbl8udmFyTmFtZSA9ICdkJztcclxuXy5zZXROYW1lID0gJ3BfJztcclxuXy5jdHhOYW1lID0gJ2MnO1xyXG5fLmV4dE5hbWUgPSAnZSc7XHJcblxyXG5fLnJXb3JkID0gL15bXFwkXFx3XSskLztcclxuXy5yU2ltcGxlQWNjZXNzb3IgPSAvXltcXCRcXHddKyhcXC5bXFwkXFx3XSspKiQvO1xyXG5cclxuXy5uZXh0VGljayA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbic/IFxyXG4gIHNldEltbWVkaWF0ZS5iaW5kKHdpbikgOiBcclxuICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgMCkgXHJcbiAgfVxyXG5cclxuXHJcblxyXG5fLnByZWZpeCA9IFwiJ3VzZSBzdHJpY3QnO3ZhciBcIiArIF8udmFyTmFtZSArIFwiPVwiICsgXy5jdHhOYW1lICsgXCIuZGF0YTtcIiArICBfLmV4dE5hbWUgICsgXCI9XCIgKyBfLmV4dE5hbWUgKyBcInx8Jyc7XCI7XHJcblxyXG5cclxuXy5zbGljZSA9IGZ1bmN0aW9uKG9iaiwgc3RhcnQsIGVuZCl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSA9IHN0YXJ0IHx8IDAsIGxlbiA9IGVuZCB8fCBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgcmVzLnB1c2gob2JqW2ldKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyBiZWFjdXNlIHNsaWNlIGFuZCB0b0xvd2VyQ2FzZSBpcyBleHBlbnNpdmUuIHdlIGhhbmRsZSB1bmRlZmluZWQgYW5kIG51bGwgaW4gYW5vdGhlciB3YXlcclxuXy50eXBlT2YgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBvID09IG51bGwgPyBTdHJpbmcobykgOm8yc3RyLmNhbGwobykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbl8ubWFrZVByZWRpY2F0ZSA9IGZ1bmN0aW9uIG1ha2VQcmVkaWNhdGUod29yZHMsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiB3b3JkcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHdvcmRzID0gd29yZHMuc3BsaXQoXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgdmFyIGYgPSBcIlwiLFxyXG4gICAgY2F0cyA9IFtdO1xyXG4gICAgb3V0OiBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXRzLmxlbmd0aDsgKytqKXtcclxuICAgICAgICAgIGlmIChjYXRzW2pdWzBdLmxlbmd0aCA9PT0gd29yZHNbaV0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgY2F0c1tqXS5wdXNoKHdvcmRzW2ldKTtcclxuICAgICAgICAgICAgICBjb250aW51ZSBvdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdHMucHVzaChbd29yZHNbaV1dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmVUbyhhcnIpIHtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGYgKz0gXCJyZXR1cm4gc3RyID09PSAnXCIgKyBhcnJbMF0gKyBcIic7XCI7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKXtcclxuICAgICAgICAgICBmICs9IFwiY2FzZSAnXCIgKyBhcnJbaV0gKyBcIic6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgKz0gXCJyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2U7XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHRocmVlIGxlbmd0aCBjYXRlZ29yaWVzLCBhbiBvdXRlclxyXG4gICAgLy8gc3dpdGNoIGZpcnN0IGRpc3BhdGNoZXMgb24gdGhlIGxlbmd0aHMsIHRvIHNhdmUgb24gY29tcGFyaXNvbnMuXHJcbiAgICBpZiAoY2F0cy5sZW5ndGggPiAzKSB7XHJcbiAgICAgICAgY2F0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIubGVuZ3RoKXtcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNhdCA9IGNhdHNbaV07XHJcbiAgICAgICAgICAgIGYgKz0gXCJjYXNlIFwiICsgY2F0WzBdLmxlbmd0aCArIFwiOlwiO1xyXG4gICAgICAgICAgICBjb21wYXJlVG8oY2F0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcIn1cIjtcclxuXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzaW1wbHkgZ2VuZXJhdGUgYSBmbGF0IGBzd2l0Y2hgIHN0YXRlbWVudC5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGFyZVRvKHdvcmRzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCJzdHJcIiwgZik7XHJcbn1cclxuXHJcblxyXG5fLnRyYWNrRXJyb3JQb3MgPSAoZnVuY3Rpb24gKCl7XHJcbiAgLy8gbGluZWJyZWFrXHJcbiAgdmFyIGxiID0gL1xcclxcbnxbXFxuXFxyXFx1MjAyOFxcdTIwMjldL2c7XHJcbiAgdmFyIG1pblJhbmdlID0gMjAsIG1heFJhbmdlID0gMjA7XHJcbiAgZnVuY3Rpb24gZmluZExpbmUobGluZXMsIHBvcyl7XHJcbiAgICB2YXIgdG1wTGVuID0gMDtcclxuICAgIGZvcih2YXIgaSA9IDAsbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgICB2YXIgbGluZUxlbiA9IChsaW5lc1tpXSB8fCBcIlwiKS5sZW5ndGg7XHJcblxyXG4gICAgICBpZih0bXBMZW4gKyBsaW5lTGVuID4gcG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIHtudW06IGksIGxpbmU6IGxpbmVzW2ldLCBzdGFydDogcG9zIC0gaSAtIHRtcExlbiAsIHByZXY6bGluZXNbaS0xXSwgbmV4dDogbGluZXNbaSsxXSB9O1xyXG4gICAgICB9XHJcbiAgICAgIC8vIDEgaXMgZm9yIHRoZSBsaW5lYnJlYWtcclxuICAgICAgdG1wTGVuID0gdG1wTGVuICsgbGluZUxlbiA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGZvcm1hdExpbmUoc3RyLCAgc3RhcnQsIG51bSwgdGFyZ2V0KXtcclxuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgdmFyIG1pbiA9IHN0YXJ0IC0gbWluUmFuZ2U7XHJcbiAgICBpZihtaW4gPCAwKSBtaW4gPSAwO1xyXG4gICAgdmFyIG1heCA9IHN0YXJ0ICsgbWF4UmFuZ2U7XHJcbiAgICBpZihtYXggPiBsZW4pIG1heCA9IGxlbjtcclxuXHJcbiAgICB2YXIgcmVtYWluID0gc3RyLnNsaWNlKG1pbiwgbWF4KTtcclxuICAgIHZhciBwcmVmaXggPSBcIltcIiArKG51bSsxKSArIFwiXSBcIiArIChtaW4gPiAwPyBcIi4uXCIgOiBcIlwiKVxyXG4gICAgdmFyIHBvc3RmaXggPSBtYXggPCBsZW4gPyBcIi4uXCI6IFwiXCI7XHJcbiAgICB2YXIgcmVzID0gcHJlZml4ICsgcmVtYWluICsgcG9zdGZpeDtcclxuICAgIGlmKHRhcmdldCkgcmVzICs9IFwiXFxuXCIgKyBuZXcgQXJyYXkoc3RhcnQtbWluICsgcHJlZml4Lmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpICsgXCJeXl5cIjtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG4gIHJldHVybiBmdW5jdGlvbihpbnB1dCwgcG9zKXtcclxuICAgIGlmKHBvcyA+IGlucHV0Lmxlbmd0aC0xKSBwb3MgPSBpbnB1dC5sZW5ndGgtMTtcclxuICAgIGxiLmxhc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgbGluZXMgPSBpbnB1dC5zcGxpdChsYik7XHJcbiAgICB2YXIgbGluZSA9IGZpbmRMaW5lKGxpbmVzLHBvcyk7XHJcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0LCBudW0gPSBsaW5lLm51bTtcclxuXHJcbiAgICByZXR1cm4gKGxpbmUucHJldj8gZm9ybWF0TGluZShsaW5lLnByZXYsIHN0YXJ0LCBudW0tMSApICsgJ1xcbic6ICcnICkgKyBcclxuICAgICAgZm9ybWF0TGluZShsaW5lLmxpbmUsIHN0YXJ0LCBudW0sIHRydWUpICsgJ1xcbicgKyBcclxuICAgICAgKGxpbmUubmV4dD8gZm9ybWF0TGluZShsaW5lLm5leHQsIHN0YXJ0LCBudW0rMSApICsgJ1xcbic6ICcnICk7XHJcblxyXG4gIH1cclxufSkoKTtcclxuXHJcblxyXG52YXIgaWdub3JlZFJlZiA9IC9cXCgoXFw/XFwhfFxcP1xcOnxcXD9cXD0pL2c7XHJcbl8uZmluZFN1YkNhcHR1cmUgPSBmdW5jdGlvbiAocmVnU3RyKSB7XHJcbiAgdmFyIGxlZnQgPSAwLFxyXG4gICAgcmlnaHQgPSAwLFxyXG4gICAgbGVuID0gcmVnU3RyLmxlbmd0aCxcclxuICAgIGlnbm9yZWQgPSByZWdTdHIubWF0Y2goaWdub3JlZFJlZik7IC8vIGlnbm9yZWQgdW5jYXB0dXJlXHJcbiAgaWYoaWdub3JlZCkgaWdub3JlZCA9IGlnbm9yZWQubGVuZ3RoXHJcbiAgZWxzZSBpZ25vcmVkID0gMDtcclxuICBmb3IgKDsgbGVuLS07KSB7XHJcbiAgICB2YXIgbGV0dGVyID0gcmVnU3RyLmNoYXJBdChsZW4pO1xyXG4gICAgaWYgKGxlbiA9PT0gMCB8fCByZWdTdHIuY2hhckF0KGxlbiAtIDEpICE9PSBcIlxcXFxcIiApIHsgXHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKFwiKSBsZWZ0Kys7XHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKVwiKSByaWdodCsrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobGVmdCAhPT0gcmlnaHQpIHRocm93IFwiUmVnRXhwOiBcIisgcmVnU3RyICsgXCIncyBicmFja2V0IGlzIG5vdCBtYXJjaGVkXCI7XHJcbiAgZWxzZSByZXR1cm4gbGVmdCAtIGlnbm9yZWQ7XHJcbn07XHJcblxyXG5cclxuXy5lc2NhcGVSZWdFeHAgPSBmdW5jdGlvbiggc3RyKXsvLyBDcmVkaXQ6IFhSZWdFeHAgMC42LjEgKGMpIDIwMDctMjAwOCBTdGV2ZW4gTGV2aXRoYW4gPGh0dHA6Ly9zdGV2ZW5sZXZpdGhhbi5jb20vcmVnZXgveHJlZ2V4cC8+IE1JVCBMaWNlbnNlXHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLVtcXF17fSgpKis/LlxcXFxeJHwsI1xcc10vZywgZnVuY3Rpb24obWF0Y2gpe1xyXG4gICAgcmV0dXJuICdcXFxcJyArIG1hdGNoO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbnZhciByRW50aXR5ID0gbmV3IFJlZ0V4cChcIiYoPzooI3hbMC05YS1mQS1GXSspfCgjWzAtOV0rKXwoXCIgKyBfLmtleXMoZW50aXRpZXMpLmpvaW4oJ3wnKSArICcpKTsnLCAnZ2knKTtcclxuXHJcbl8uY29udmVydEVudGl0eSA9IGZ1bmN0aW9uKGNocil7XHJcblxyXG4gIHJldHVybiAoXCJcIiArIGNocikucmVwbGFjZShyRW50aXR5LCBmdW5jdGlvbihhbGwsIGhleCwgZGVjLCBjYXB0dXJlKXtcclxuICAgIHZhciBjaGFyQ29kZTtcclxuICAgIGlmKCBkZWMgKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBkZWMuc2xpY2UoMSksIDEwICk7XHJcbiAgICBlbHNlIGlmKCBoZXggKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBoZXguc2xpY2UoMiksIDE2ICk7XHJcbiAgICBlbHNlIGNoYXJDb2RlID0gZW50aXRpZXNbY2FwdHVyZV1cclxuXHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSggY2hhckNvZGUgKVxyXG4gIH0pO1xyXG5cclxufVxyXG5cclxuXHJcbi8vIHNpbXBsZSBnZXQgYWNjZXNzb3JcclxuXHJcbl8uY3JlYXRlT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZT8gZnVuY3Rpb24obyl7XHJcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUobyB8fCBudWxsKVxyXG59OiAoZnVuY3Rpb24oKXtcclxuICAgIGZ1bmN0aW9uIFRlbXAoKSB7fVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG8pe1xyXG4gICAgICBpZighbykgcmV0dXJuIHt9XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbztcclxuICAgICAgdmFyIG9iaiA9IG5ldyBUZW1wKCk7XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbnVsbDsgLy8g5LiN6KaB5L+d5oyB5LiA5LiqIE8g55qE5p2C5pWj5byV55So77yIYSBzdHJheSByZWZlcmVuY2XvvIkuLi5cclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXy5jcmVhdGVQcm90byA9IGZ1bmN0aW9uKGZuLCBvKXtcclxuICAgIGZ1bmN0aW9uIEZvbygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGZuO31cclxuICAgIEZvby5wcm90b3R5cGUgPSBvO1xyXG4gICAgcmV0dXJuIChmbi5wcm90b3R5cGUgPSBuZXcgRm9vKCkpO1xyXG59XHJcblxyXG5cclxuXy5yZW1vdmVPbmUgPSBmdW5jdGlvbihsaXN0ICwgZmlsdGVyKXtcclxuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XHJcbiAgZm9yKDtsZW4tLTspe1xyXG4gICAgaWYoZmlsdGVyKGxpc3RbbGVuXSkpIHtcclxuICAgICAgbGlzdC5zcGxpY2UobGVuLCAxKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbmNsb25lXHJcbiovXHJcbl8uY2xvbmUgPSBmdW5jdGlvbiBjbG9uZShvYmope1xyXG4gIGlmKCFvYmogfHwgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICkpIHJldHVybiBvYmo7XHJcbiAgaWYoQXJyYXkuaXNBcnJheShvYmopKXtcclxuICAgIHZhciBjbG9uZWQgPSBbXTtcclxuICAgIGZvcih2YXIgaT0wLGxlbiA9IG9iai5sZW5ndGg7IGk8IGxlbjtpKyspe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV1cclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfWVsc2V7XHJcbiAgICB2YXIgY2xvbmVkID0ge307XHJcbiAgICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG4gIH1cclxufVxyXG5cclxuXy5lcXVhbHMgPSBmdW5jdGlvbihub3csIG9sZCl7XHJcbiAgdmFyIHR5cGUgPSB0eXBlb2Ygbm93O1xyXG4gIGlmKHR5cGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBvbGQgPT09ICdudW1iZXInJiYgaXNOYU4obm93KSAmJiBpc05hTihvbGQpKSByZXR1cm4gdHJ1ZVxyXG4gIHJldHVybiBub3cgPT09IG9sZDtcclxufVxyXG5cclxudmFyIGRhc2ggPSAvLShbYS16XSkvZztcclxuXy5jYW1lbENhc2UgPSBmdW5jdGlvbihzdHIpe1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShkYXNoLCBmdW5jdGlvbihhbGwsIGNhcHR1cmUpe1xyXG4gICAgcmV0dXJuIGNhcHR1cmUudG9VcHBlckNhc2UoKTtcclxuICB9KVxyXG59XHJcblxyXG5cclxuXHJcbl8udGhyb3R0bGUgPSBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0KXtcclxuICB2YXIgd2FpdCA9IHdhaXQgfHwgMTAwO1xyXG4gIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XHJcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xyXG4gIHZhciBwcmV2aW91cyA9IDA7XHJcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBwcmV2aW91cyA9ICtuZXcgRGF0ZTtcclxuICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICB9O1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBub3cgPSArIG5ldyBEYXRlO1xyXG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xyXG4gICAgY29udGV4dCA9IHRoaXM7XHJcbiAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgcHJldmlvdXMgPSBub3c7XHJcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn07XHJcblxyXG4vLyBob2dhbiBlc2NhcGVcclxuLy8gPT09PT09PT09PT09PT1cclxuXy5lc2NhcGUgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgckFtcCA9IC8mL2csXHJcbiAgICAgIHJMdCA9IC88L2csXHJcbiAgICAgIHJHdCA9IC8+L2csXHJcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxyXG4gICAgICByUXVvdCA9IC9cXFwiL2csXHJcbiAgICAgIGhDaGFycyA9IC9bJjw+XFxcIlxcJ10vO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XHJcbiAgICAgIHN0clxyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXHJcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2Uockd0LCAnJmd0OycpXHJcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXHJcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XHJcbiAgICAgIHN0cjtcclxuICB9XHJcbn0pKCk7XHJcblxyXG5fLmNhY2hlID0gZnVuY3Rpb24obWF4KXtcclxuICBtYXggPSBtYXggfHwgMTAwMDtcclxuICB2YXIga2V5cyA9IFtdLFxyXG4gICAgICBjYWNoZSA9IHt9O1xyXG4gIHJldHVybiB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgaWYgKGtleXMubGVuZ3RoID4gdGhpcy5tYXgpIHtcclxuICAgICAgICBjYWNoZVtrZXlzLnNoaWZ0KCldID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFxyXG4gICAgICBpZihjYWNoZVtrZXldID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhY2hlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlO1xyXG4gICAgICByZXR1cm4gY2FjaGVba2V5XTtcclxuICAgIH0sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIGxlbjpmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ga2V5cy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLy8gLy8gc2V0dXAgdGhlIHJhdyBFeHByZXNzaW9uXHJcblxyXG5cclxuLy8gaGFuZGxlIHRoZSBzYW1lIGxvZ2ljIG9uIGNvbXBvbmVudCdzIGBvbi0qYCBhbmQgZWxlbWVudCdzIGBvbi0qYFxyXG4vLyByZXR1cm4gdGhlIGZpcmUgb2JqZWN0XHJcbl8uaGFuZGxlRXZlbnQgPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSApe1xyXG4gIHZhciBzZWxmID0gdGhpcywgZXZhbHVhdGU7XHJcbiAgaWYodmFsdWUudHlwZSA9PT0gJ2V4cHJlc3Npb24nKXsgLy8gaWYgaXMgZXhwcmVzc2lvbiwgZ28gZXZhbHVhdGVkIHdheVxyXG4gICAgZXZhbHVhdGUgPSB2YWx1ZS5nZXQ7XHJcbiAgfVxyXG4gIGlmKGV2YWx1YXRlKXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKG9iail7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gb2JqO1xyXG4gICAgICAgIHZhciByZXMgPSBldmFsdWF0ZShzZWxmKTtcclxuICAgICAgICBpZihyZXMgPT09IGZhbHNlICYmIG9iaiAmJiBvYmoucHJldmVudERlZmF1bHQpIG9iai5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9KVxyXG5cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKCl7XHJcbiAgICAgIHZhciBhcmdzID0gXy5zbGljZShhcmd1bWVudHMpO1xyXG4gICAgICBhcmdzLnVuc2hpZnQodmFsdWUpO1xyXG4gICAgICBzZWxmLiR1cGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgICBzZWxmLiRlbWl0LmFwcGx5KHNlbGYsIGFyZ3MpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gb25seSBjYWxsIG9uY2VcclxuXy5vbmNlID0gZnVuY3Rpb24oZm4pe1xyXG4gIHZhciB0aW1lID0gMDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGlmKCB0aW1lKysgPT09IDApIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG59XHJcblxyXG5fLmZpeE9ialN0ciA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgaWYoc3RyLnRyaW0oKS5pbmRleE9mKCd7JykgIT09IDApe1xyXG4gICAgcmV0dXJuICd7JyArIHN0ciArICd9JztcclxuICB9XHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbl8ubWFwPSBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2spe1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIHJlcy5wdXNoKGNhbGxiYWNrKGFycmF5W2ldLCBpKSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZyhtc2csIHR5cGUpe1xyXG4gIGlmKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSAgY29uc29sZVt0eXBlIHx8IFwibG9nXCJdKG1zZyk7XHJcbn1cclxuXHJcbl8ubG9nID0gbG9nO1xyXG5cclxuXHJcbl8ubm9ybUxpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50cyAgKXtcclxuICAgIHZhciBldmVudExpc3RlbmVycyA9IFtdO1xyXG4gICAgdmFyIHBUeXBlID0gXy50eXBlT2YoIGV2ZW50cyApO1xyXG4gICAgaWYoIHBUeXBlID09PSAnYXJyYXknICl7XHJcbiAgICAgIHJldHVybiBldmVudHM7XHJcbiAgICB9ZWxzZSBpZiAoIHBUeXBlID09PSAnb2JqZWN0JyApe1xyXG4gICAgICBmb3IoIHZhciBpIGluIGV2ZW50cyApIGlmICggZXZlbnRzLmhhc093blByb3BlcnR5KGkpICl7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBpLFxyXG4gICAgICAgICAgbGlzdGVuZXI6IGV2ZW50c1tpXVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBldmVudExpc3RlbmVycztcclxufVxyXG5cclxuXHJcbi8vaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvc2luZ2xlLXBhZ2UuaHRtbCN2b2lkLWVsZW1lbnRzXHJcbl8uaXNWb2lkVGFnID0gXy5tYWtlUHJlZGljYXRlKFwiYXJlYSBiYXNlIGJyIGNvbCBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWVudWl0ZW0gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyIHItY29udGVudFwiKTtcclxuXy5pc0Jvb2xlYW5BdHRyID0gXy5tYWtlUHJlZGljYXRlKCdzZWxlY3RlZCBjaGVja2VkIGRpc2FibGVkIHJlYWRvbmx5IHJlcXVpcmVkIG9wZW4gYXV0b2ZvY3VzIGNvbnRyb2xzIGF1dG9wbGF5IGNvbXBhY3QgbG9vcCBkZWZlciBtdWx0aXBsZScpO1xyXG5cclxuXHJcbl8uaXNFeHByID0gZnVuY3Rpb24oZXhwcil7XHJcbiAgcmV0dXJuIGV4cHIgJiYgZXhwci50eXBlID09PSAnZXhwcmVzc2lvbic7XHJcbn1cclxuLy8gQFRPRE86IG1ha2UgaXQgbW9yZSBzdHJpY3RcclxuXy5pc0dyb3VwID0gZnVuY3Rpb24oZ3JvdXApe1xyXG4gIHJldHVybiBncm91cC5pbmplY3QgfHwgZ3JvdXAuJGluamVjdDtcclxufVxyXG5cclxuXy5nZXRDb21waWxlRm4gPSBmdW5jdGlvbihzb3VyY2UsIGN0eCwgb3B0aW9ucyl7XHJcbiAgcmV0dXJuIGN0eC4kY29tcGlsZS5iaW5kKGN0eCxzb3VyY2UsIG9wdGlvbnMpXHJcbn1cclxuXHJcbi8vIHJlbW92ZSBkaXJlY3RpdmUgcGFyYW0gZnJvbSBBU1RcclxuXy5maXhUYWdBU1QgPSBmdW5jdGlvbiggdGFnQVNULCBDb21wb25lbnQgKXtcclxuXHJcbiAgaWYoIHRhZ0FTVC50b3VjaGVkICkgcmV0dXJuO1xyXG5cclxuICB2YXIgYXR0cnMgPSB0YWdBU1QuYXR0cnM7XHJcblxyXG4gIGlmKCAhYXR0cnMgKSByZXR1cm47XHJcblxyXG4gIC8vIE1heWJlIG11bHRpcGxlIGRpcmVjdGl2ZSBuZWVkIHNhbWUgcGFyYW0sIFxyXG4gIC8vIFdlIHBsYWNlIGFsbCBwYXJhbSBpbiB0b3RhbFBhcmFtTWFwXHJcbiAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcclxuICBpZighbGVuKSByZXR1cm47XHJcbiAgdmFyIGRpcmVjdGl2ZXM9W10sIG90aGVyQXR0ck1hcCA9IHt9O1xyXG4gIGZvcig7bGVuLS07KXtcclxuXHJcbiAgICB2YXIgYXR0ciA9IGF0dHJzWyBsZW4gXTtcclxuXHJcblxyXG4gICAgLy8gQElFIGZpeCBJRTktIGlucHV0IHR5cGUgY2FuJ3QgYXNzaWduIGFmdGVyIHZhbHVlXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICd0eXBlJykgYXR0ci5wcmlvcml0eSA9IE1BWF9QUklPUklUWSsxO1xyXG5cclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKCBhdHRyLm5hbWUgKTtcclxuICAgIGlmKCBkaXJlY3RpdmUgKSB7XHJcblxyXG4gICAgICBhdHRyLnByaW9yaXR5ID0gZGlyZWN0aXZlLnByaW9yaXR5IHx8IDE7XHJcbiAgICAgIGF0dHIuZGlyZWN0aXZlID0gdHJ1ZTtcclxuICAgICAgZGlyZWN0aXZlcy5wdXNoKGF0dHIpO1xyXG5cclxuICAgIH1lbHNlIGlmKGF0dHIudHlwZSA9PT0gJ2F0dHJpYnV0ZScpe1xyXG4gICAgICBvdGhlckF0dHJNYXBbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXJlY3RpdmVzLmZvckVhY2goIGZ1bmN0aW9uKCBhdHRyICl7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0gQ29tcG9uZW50LmRpcmVjdGl2ZShhdHRyLm5hbWUpO1xyXG4gICAgdmFyIHBhcmFtID0gZGlyZWN0aXZlLnBhcmFtO1xyXG4gICAgaWYocGFyYW0gJiYgcGFyYW0ubGVuZ3RoKXtcclxuICAgICAgYXR0ci5wYXJhbSA9IHt9O1xyXG4gICAgICBwYXJhbS5mb3JFYWNoKGZ1bmN0aW9uKCBuYW1lICl7XHJcbiAgICAgICAgaWYoIG5hbWUgaW4gb3RoZXJBdHRyTWFwICl7XHJcbiAgICAgICAgICBhdHRyLnBhcmFtW25hbWVdID0gb3RoZXJBdHRyTWFwW25hbWVdID09PSB1bmRlZmluZWQ/IHRydWU6IG90aGVyQXR0ck1hcFtuYW1lXVxyXG4gICAgICAgICAgXy5yZW1vdmVPbmUoYXR0cnMsIGZ1bmN0aW9uKGF0dHIpe1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0ci5uYW1lID09PSBuYW1lXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXR0cnMuc29ydChmdW5jdGlvbihhMSwgYTIpe1xyXG4gICAgXHJcbiAgICB2YXIgcDEgPSBhMS5wcmlvcml0eTtcclxuICAgIHZhciBwMiA9IGEyLnByaW9yaXR5O1xyXG5cclxuICAgIGlmKCBwMSA9PSBudWxsICkgcDEgPSBNQVhfUFJJT1JJVFk7XHJcbiAgICBpZiggcDIgPT0gbnVsbCApIHAyID0gTUFYX1BSSU9SSVRZO1xyXG5cclxuICAgIHJldHVybiBwMiAtIHAxO1xyXG5cclxuICB9KVxyXG5cclxuICB0YWdBU1QudG91Y2hlZCA9IHRydWU7XHJcbn1cclxuXHJcbl8uZmluZEl0ZW0gPSBmdW5jdGlvbihsaXN0LCBmaWx0ZXIpe1xyXG4gIGlmKCFsaXN0IHx8ICFsaXN0Lmxlbmd0aCkgcmV0dXJuO1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICB3aGlsZShsZW4tLSl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkgcmV0dXJuIGxpc3RbbGVuXVxyXG4gIH1cclxufVxyXG5cclxuXy5nZXRQYXJhbU9iaiA9IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFyYW0pe1xyXG4gIHZhciBwYXJhbU9iaiA9IHt9O1xyXG4gIGlmKHBhcmFtKSB7XHJcbiAgICBmb3IodmFyIGkgaW4gcGFyYW0pIGlmKHBhcmFtLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgdmFyIHZhbHVlID0gcGFyYW1baV07XHJcbiAgICAgIHBhcmFtT2JqW2ldID0gIHZhbHVlICYmIHZhbHVlLnR5cGU9PT0nZXhwcmVzc2lvbic/IGNvbXBvbmVudC4kZ2V0KHZhbHVlKTogdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBwYXJhbU9iajtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1BhcnNlci91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ0JFR0lOJzogJ3snLFxyXG4gICdFTkQnOiAnfScsXHJcbiAgJ1BSRUNPTVBJTEUnOiBmYWxzZVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUGFyc2VyL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgRnJlZWxpc3QgPSByZXF1aXJlKCcuL0ZyZWVsaXN0LmpzJyk7XHJcblxyXG5pZih3aW5kb3cuZGVmaW5lKXtcclxuICAgIHdpbmRvdy5kZWZpbmUoW10sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIEZyZWVsaXN0O1xyXG4gICAgfSk7XHJcbn1cclxuaWYoZG9jdW1lbnQgJiYgZG9jdW1lbnQubm9kZVR5cGUpe1xyXG4gICAgd2luZG93LkZyZWVsaXN0ID0gRnJlZWxpc3Q7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBGcmVlbGlzdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgUGFyc2VyID0gcmVxdWlyZSgnLi9QYXJzZXIvc3JjL1BhcnNlci5qcycpO1xyXG5cclxuZnVuY3Rpb24gRnJlZWxpc3QoY29uZmlnKXtcclxuICAgIHZhciB0cGwgPSBjb25maWcudGVtcGxhdGU7XHJcbiAgICB2YXIgZGF0YSA9IGNvbmZpZy5kYXRhO1xyXG4gICAgXHJcbiAgICAvKirphY3nva7mlbDmja7mqKHlnosgKi9cclxuICAgIEZyZWVsaXN0LmNvbmZpZyhjb25maWcsIHRoaXMpO1xyXG5cclxuICAgIC8qKuaJp+ihjGNvbmZpZyAqL1xyXG4gICAgdHlwZW9mIHRoaXMuY29uZmlnID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY29uZmlnKHRoaXMuZGF0YSk7XHJcblxyXG4gICAgLyoq6Kej5p6Q5a2X56ym5LiyLS0tPkFTVOagkSAqL1xyXG4gICAgdGhpcy5BU1QgPSBGcmVlbGlzdC5wYXJzZSh0cGwpXHJcbiAgICBcclxufVxyXG5cclxuRnJlZWxpc3QucGFyc2UgPSBmdW5jdGlvbihzdHIpe1xyXG4gICAgcmV0dXJuIG5ldyBQYXJzZXIoc3RyKS5wYXJzZSgpO1xyXG59XHJcblxyXG5GcmVlbGlzdC5jb25maWcgPSBmdW5jdGlvbihjb25maWcsIGNvbnRleHQpe1xyXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhjb25maWcpO1xyXG4gICAgZm9yKHZhciBpPTA7aTxrZXlzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGNvbmZpZ1trZXlzW2ldXTtcclxuICAgICAgICBjb250ZXh0W2tleXNbaV1dID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKirorr7nva7liJfooaggKi9cclxuICAgIGNvbnRleHQuX2xpc3QgPSB7fTtcclxuXHJcbiAgICAvKirorr7nva7pu5jorqRkYXRhICovXHJcbiAgICBjb250ZXh0LmRhdGEgPSBjb25maWcuZGF0YSB8fCB7fTtcclxuXHJcbiAgICAvKirkv53lrZjorr7nva4gKi9cclxuICAgIGNvbnRleHQuZGVmaW5lID0gY29uZmlnO1xyXG59XHJcblxyXG5GcmVlbGlzdC5jb21waWxlciA9IHtcclxuICAgICdlbGVtZW50JzogZnVuY3Rpb24oYXN0LCBjb250ZXh0LCBsaXN0SW5mbyl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGFzdC50YWcpO1xyXG5cclxuICAgICAgICB2YXIgYXR0cnMgPSBhc3QuYXR0cnM7XHJcbiAgICAgICAgLyoq5aSE55CG5bGe5oCnICovXHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhdHRycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHN3aXRjaChhdHRyLnR5cGUpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnYXR0cmlidXRlJzogRnJlZWxpc3QucmVzb2x2ZUF0dHJpYnV0ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbyk7IGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKirlpITnkIblrZDoioLngrkgKi9cclxuICAgICAgICBpZihhc3QuY2hpbGRyZW4pe1xyXG4gICAgICAgICAgICBmb3IodmFyIGo9MDtqPGFzdC5jaGlsZHJlbi5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZCA9IGFzdC5jaGlsZHJlbltqXTtcclxuICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoY2hpbGQsIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSxcclxuICAgICd0ZXh0JzogZnVuY3Rpb24oYXN0KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFzdC50ZXh0KTtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0sXHJcbiAgICAnZXhwcmVzc2lvbic6IGZ1bmN0aW9uKGFzdCwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgICAgIHZhciB0ZXh0ID0gJyc7XHJcbiAgICAgICAgaWYobGlzdEluZm8pe1xyXG4gICAgICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3QuYm9keSsnKScpO1xyXG4gICAgICAgICAgICB0ZXh0ID0gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8sICcnKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXN0LmJvZHkrJyknKTtcclxuICAgICAgICAgICAgdGV4dCA9IGdldFZhbHVlKGNvbnRleHQsIGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9LFxyXG4gICAgJ2xpc3QnOiBmdW5jdGlvbihhc3QsIGNvbnRleHQpe1xyXG4gICAgICAgIHZhciBsaXN0Qm9keSA9IGFzdC5ib2R5O1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsJ2QnLCdlJywncmV0dXJuICgnK2FzdC5zZXF1ZW5jZS5ib2R5KycpJyk7XHJcbiAgICAgICAgdmFyIGFycmF5RGF0YSA9IGdldFZhbHVlKGNvbnRleHQsIGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgICAgIHZhciB2YXJpYWJsZSA9IGFzdC52YXJpYWJsZTtcclxuXHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajxhcnJheURhdGEubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGl0ZW1Ob2RlKGxpc3RCb2R5LCBhcnJheURhdGFbal0sIGopKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGl0ZW1Ob2RlKGJvZHksIGl0ZW0sIGluZGV4KXtcclxuICAgICAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgICAgIHZhciBsaXN0SW5mbyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgbGlzdEluZm9bdmFyaWFibGVdID0gaXRlbTtcclxuICAgICAgICAgICAgbGlzdEluZm9bdmFyaWFibGUrJ19pbmRleCddID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wO2k8Ym9keS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoYm9keVtpXSwgbGlzdEluZm8pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5fbGlzdC5kYXRhID0gYXJyYXlEYXRhO1xyXG4gICAgICAgIGNvbnRleHQuX2xpc3QuYm9keSA9IGxpc3RCb2R5O1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxufTtcclxuXHJcbkZyZWVsaXN0LnJlcGxhY2VMaXN0ID0gZnVuY3Rpb24ob2xkTGlzdCwgbmV3TGlzdCl7XHJcbiAgICBmb3IodmFyIGk9b2xkTGlzdC5sZW5ndGgtMTtpPj0wO2ktLSl7XHJcbiAgICAgICAgaWYodHlwZW9mIG5ld0xpc3RbaV0gPT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgb2xkTGlzdC5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIG9sZExpc3RbaV0gPSBuZXdMaXN0W2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuRnJlZWxpc3QucmVzb2x2ZUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgYXR0ci52YWx1ZTtcclxuICAgIHN3aXRjaCh2YWx1ZVR5cGUpe1xyXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6IG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0ci52YWx1ZSk7IGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ29iamVjdCc6IG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgRnJlZWxpc3QucmVzb2x2ZUF0dHJWYWx1ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbykpOyBicmVhaztcclxuICAgIH1cclxuXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICdsaXN0LWNvbnRhaW5lcicpe1xyXG4gICAgICAgIGNvbnRleHQuX2xpc3QuY29udGFpbmVyID0gbm9kZTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5GcmVlbGlzdC5yZXNvbHZlQXR0clZhbHVlID0gZnVuY3Rpb24oYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIGlzRXZlbnQgPSBhdHRyLm5hbWUuc2xpY2UoMCwyKSA9PT0gJ29uJztcclxuXHJcbiAgICBpZihpc0V2ZW50KXtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5uYW1lLnNsaWNlKDMpO1xyXG4gICAgICAgIGF0dHIudmFsdWUuYm9keSA9IGF0dHIudmFsdWUuYm9keS5yZXBsYWNlKC8nXFwkZXZlbnQnL2csICckZXZlbnQnKTtcclxuICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuIGZ1bmN0aW9uKCRldmVudCl7cmV0dXJuICcrYXR0ci52YWx1ZS5ib2R5Kyc7fScpO1xyXG5cclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBnZXRIYW5kbGVyKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXR0ci52YWx1ZS5ib2R5KycpJyk7XHJcbiAgICAgICAgcmV0dXJuIGdldFZhbHVlKGNvbnRleHQsIGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5GcmVlbGlzdC5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbihhc3QsIGxpc3RJbmZvKXtcclxuICAgIGlmKGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQodGhpcy5fY29tcGlsZShhc3RbaV0sIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyW2FzdC50eXBlXShhc3QsIHRoaXMsIGxpc3RJbmZvKTtcclxuICAgIH1cclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLiRpbmplY3QgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuY29udGFpbmVyTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgdGhpcy4kcmVuZGVyKClcclxuICAgIG5vZGUuYXBwZW5kKHRoaXMuZG9tVHJlZSk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kbW9kaWZ5ID0gZnVuY3Rpb24oaW5kZXgsIG1vZGVsKXtcclxuICAgIHZhciBfbGlzdCA9IHRoaXMuX2xpc3QsXHJcbiAgICAgICAgX2xpc3RDb250YWluZXIgPSBfbGlzdC5jb250YWluZXIsXHJcbiAgICAgICAgX2JvZHkgPSBfbGlzdC5ib2R5O1xyXG5cclxuICAgIC8qKuiuvue9ruaVsOaNruaooeWeiyAqL1xyXG4gICAgX2xpc3QuZGF0YVtpbmRleF0gPSBtb2RlbDtcclxuXHJcbiAgICAvKipEb23nsr7noa7mm7TmlrAgKi9cclxuICAgIHZhciB0YXJnZXREb20gPSBfbGlzdENvbnRhaW5lci5jaGlsZHJlbltpbmRleF07XHJcbiAgICB2YXIgbm9kZSA9IHRoaXMuX2NvbXBpbGUoX2JvZHksIHtpdGVtOiBtb2RlbCwgaXRlbV9pbmRleDogaW5kZXh9KTtcclxuXHJcbiAgICBfbGlzdENvbnRhaW5lci5yZXBsYWNlQ2hpbGQobm9kZSwgdGFyZ2V0RG9tKTtcclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLiRpbnNlcnQgPSBmdW5jdGlvbihpbmRleCwgbW9kZWwpe1xyXG4gICAgdmFyIF9saXN0ID0gdGhpcy5fbGlzdCxcclxuICAgICAgICBfbGlzdENvbnRhaW5lciA9IF9saXN0LmNvbnRhaW5lcixcclxuICAgICAgICBfYm9keSA9IF9saXN0LmJvZHk7XHJcblxyXG4gICAgLyoq6K6+572u5pWw5o2u5qih5Z6LICovXHJcbiAgICBfbGlzdC5kYXRhLnNwbGljZShpbmRleCwgMCwgbW9kZWwpO1xyXG5cclxuICAgIHRoaXMuJHJlbmRlcigpO1xyXG59XHJcblxyXG4vKirmm7/mjaLliJfooajmlbDmja4gKi9cclxuRnJlZWxpc3QucHJvdG90eXBlLiRyZXBsYWNlID0gZnVuY3Rpb24obmV3TGlzdCl7XHJcbiAgICB2YXIgX2xpc3QgPSB0aGlzLl9saXN0O1xyXG5cclxuICAgIEZyZWVsaXN0LnJlcGxhY2VMaXN0KF9saXN0LmRhdGEsIG5ld0xpc3QpO1xyXG4gICAgdGhpcy4kcmVuZGVyKCk7XHJcbn07XHJcblxyXG5GcmVlbGlzdC5wcm90b3R5cGUuJGRlbGV0ZSA9IGZ1bmN0aW9uKGluZGV4KXtcclxuICAgICB2YXIgX2xpc3QgPSB0aGlzLl9saXN0LFxyXG4gICAgICAgIF9saXN0Q29udGFpbmVyID0gX2xpc3QuY29udGFpbmVyO1xyXG5cclxuICAgIC8qKuiuvue9ruaVsOaNruaooeWeiyAqL1xyXG4gICAgX2xpc3QuZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy4kcmVuZGVyKCk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kcmVuZGVyID0gZnVuY3Rpb24od29ya2VyUmVuZGVyKXtcclxuICAgIGlmKHdvcmtlclJlbmRlcil7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQXN5bmMod29ya2VyUmVuZGVyKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclN5bmMoKTtcclxuICAgIH1cclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLl9yZW5kZXJTeW5jID0gZnVuY3Rpb24oKXtcclxuICAgIC8qKuiOt+W+l+e8luivkeWZqCAqL1xyXG4gICAgdGhpcy5fY29tcGlsZXIgPSBGcmVlbGlzdC5jb21waWxlcjtcclxuXHJcbiAgICAvKirnvJbor5FBU1TmoJEtLS0+RE9N5qCRICovXHJcbiAgICB2YXIgbmV3Um9vdCA9IHRoaXMuZG9tVHJlZSA9IHRoaXMuX2NvbXBpbGUodGhpcy5BU1QpLFxyXG4gICAgICAgIGNvbnRhaW5lck5vZGUgPSB0aGlzLmNvbnRhaW5lck5vZGUsXHJcbiAgICAgICAgcm9vdE5vZGUgPSB0aGlzLnJvb3ROb2RlO1xyXG5cclxuICAgIFxyXG4gICAgdGhpcy5yb290Tm9kZSA9IG5ld1Jvb3QuY2hpbGRyZW5bMF07XHJcbiAgICBpZihyb290Tm9kZSl7XHJcbiAgICAgICAgY29udGFpbmVyTm9kZS5yZXBsYWNlQ2hpbGQobmV3Um9vdCwgcm9vdE5vZGUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5GcmVlbGlzdC5wcm90b3R5cGUuX3JlbmRlckFzeW5jID0gZnVuY3Rpb24od29ya2VyUmVuZGVyKXtcclxuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxyXG4gICAgICAgIGFzdCA9IHRoaXMuQVNUO1xyXG4gICAgICAgIC8vX3dvcmtlciA9IHRoaXMud29ya2VyLFxyXG4gICAgICAgIC8vX21lc3NhZ2VCdXMgPSB0aGlzLl9tZXNzYWdlQnVzIHx8IG5ldyBNZXNzYWdlQnVzKF93b3JrZXIpO1xyXG5cclxuICAgIHdvcmtlclJlbmRlci5yZWNlaXZlKHt0eXBlOiAncmVuZGVyJywgZGF0YToge2FzdDogYXN0LCBkYXRhOiBkYXRhfX0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyTm9kZS5pbm5lckhUTUwgPSBkYXRhLmh0bWw7XHJcbiAgICAgICAgICAgIHRoaXMucm9vdE5vZGUgPSB0aGlzLmNvbnRhaW5lck5vZGUuY2hpbGRyZW5bMF07XHJcblxyXG4gICAgICAgICAgICBGcmVlbGlzdC5hZGRBc3luY0V2ZW50cy5jYWxsKHRoaXMsIHRoaXMucm9vdE5vZGUsIGRhdGEuZXZlbnRzKTtcclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG59XHJcblxyXG5GcmVlbGlzdC5hZGRBc3luY0V2ZW50cyA9IGZ1bmN0aW9uKG5vZGUsIGV2ZW50cyl7XHJcbiAgICBpZihub2RlLmdldEF0dHJpYnV0ZSgnbGlzdC1jb250YWluZXInKSl7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jb250YWluZXIgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgaWYodHlwZW9mIG5vZGUuZGF0YXNldCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIG5vZGUuZGF0YXNldC5ub2RlSUQgPT09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICBpZighbm9kZS5jaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bm9kZS5jaGlsZHJlbi5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgRnJlZWxpc3QuYWRkQXN5bmNFdmVudHMuY2FsbCh0aGlzLCBub2RlLmNoaWxkcmVuW2ldLCBldmVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBub2RlSWQgPSBub2RlLmRhdGFzZXQubm9kZWlkO1xyXG5cclxuICAgIGZvcih2YXIgaWQgaW4gZXZlbnRzKXtcclxuICAgICAgICBpZihpZCA9PSBub2RlSWQpe1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRIdWIgPSBldmVudHNbaWRdO1xyXG4gICAgICAgICAgICBmb3IodmFyIGo9MDtqPGV2ZW50SHViLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGdldEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAnK2V2ZW50SHViW2pdLnZhbHVlKyc7Jyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IGdldEhhbmRsZXIodGhpcywgdGhpcy5kYXRhLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRIdWJbal0ubmFtZSwgZ2V0SGFuZGxlcih0aGlzLCB0aGlzLmRhdGEsICcnKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGRlbGV0ZSBldmVudHNbbm9kZUlkXTtcclxuXHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS5fc2dfID0gZnVuY3Rpb24ocGF0aCwgZGF0YSl7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYocGF0aCBpbnN0YW5jZW9mIEV2ZW50KXtcclxuICAgICAgICByZXN1bHQgPSBwYXRoO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmVzdWx0ID0gZGF0YVtwYXRoXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBGcmVlbGlzdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9GcmVlbGlzdC5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcuanNcIik7XHJcbnZhciBub2RlID0gcmVxdWlyZShcIi4vbm9kZS5qc1wiKTtcclxudmFyIExleGVyID0gcmVxdWlyZShcIi4vTGV4ZXIuanNcIik7XHJcbnZhciB2YXJOYW1lID0gXy52YXJOYW1lO1xyXG52YXIgY3R4TmFtZSA9IF8uY3R4TmFtZTtcclxudmFyIGV4dE5hbWUgPSBfLmV4dE5hbWU7XHJcbnZhciBpc1BhdGggPSBfLm1ha2VQcmVkaWNhdGUoXCJTVFJJTkcgSURFTlQgTlVNQkVSXCIpO1xyXG52YXIgaXNLZXlXb3JkID0gXy5tYWtlUHJlZGljYXRlKFwidHJ1ZSBmYWxzZSB1bmRlZmluZWQgbnVsbCB0aGlzIEFycmF5IERhdGUgSlNPTiBNYXRoIE5hTiBSZWdFeHAgZGVjb2RlVVJJIGRlY29kZVVSSUNvbXBvbmVudCBlbmNvZGVVUkkgZW5jb2RlVVJJQ29tcG9uZW50IHBhcnNlRmxvYXQgcGFyc2VJbnQgT2JqZWN0XCIpO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gUGFyc2VyKGlucHV0LCBvcHRzKXtcclxuICBvcHRzID0gb3B0cyB8fCB7fTtcclxuXHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIHRoaXMudG9rZW5zID0gbmV3IExleGVyKGlucHV0LCBvcHRzKS5sZXgoKTtcclxuICB0aGlzLnBvcyA9IDA7XHJcbiAgdGhpcy5sZW5ndGggPSB0aGlzLnRva2Vucy5sZW5ndGg7XHJcbn1cclxuXHJcblxyXG52YXIgb3AgPSBQYXJzZXIucHJvdG90eXBlO1xyXG5cclxuXHJcbm9wLnBhcnNlID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLnBvcyA9IDA7XHJcbiAgdmFyIHJlcz0gdGhpcy5wcm9ncmFtKCk7XHJcbiAgaWYodGhpcy5sbCgpLnR5cGUgPT09ICdUQUdfQ0xPU0UnKXtcclxuICAgIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGdvdCBhIHVuY2xvc2VkIFRhZ1wiKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5vcC5sbCA9ICBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIGlmKGsgPCAwKSBrID0gayArIDE7XHJcbiAgdmFyIHBvcyA9IHRoaXMucG9zICsgayAtIDE7XHJcbiAgaWYocG9zID4gdGhpcy5sZW5ndGggLSAxKXtcclxuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMubGVuZ3RoLTFdO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy50b2tlbnNbcG9zXTtcclxufVxyXG4gIC8vIGxvb2thaGVhZFxyXG5vcC5sYSA9IGZ1bmN0aW9uKGspe1xyXG4gIHJldHVybiAodGhpcy5sbChrKSB8fCAnJykudHlwZTtcclxufVxyXG5cclxub3AubWF0Y2ggPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKCEobGwgPSB0aGlzLmVhdCh0eXBlLCB2YWx1ZSkpKXtcclxuICAgIGxsICA9IHRoaXMubGwoKTtcclxuICAgIHRoaXMuZXJyb3IoJ2V4cGVjdCBbJyArIHR5cGUgKyAodmFsdWUgPT0gbnVsbD8gJyc6JzonKyB2YWx1ZSkgKyAnXVwiIC0+IGdvdCBcIlsnICsgbGwudHlwZSArICh2YWx1ZT09bnVsbD8gJyc6JzonK2xsLnZhbHVlKSArICddJywgbGwucG9zKVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGxsO1xyXG4gIH1cclxufVxyXG5cclxub3AuZXJyb3IgPSBmdW5jdGlvbihtc2csIHBvcyl7XHJcbiAgbXNnID0gIFwiXFxu44CQIHBhcnNlIGZhaWxlZCDjgJEgXCIgKyBtc2cgKyAgJzpcXG5cXG4nICsgXy50cmFja0Vycm9yUG9zKHRoaXMuaW5wdXQsIHR5cGVvZiBwb3MgPT09ICdudW1iZXInPyBwb3M6IHRoaXMubGwoKS5wb3N8fDApO1xyXG4gIHRocm93IG5ldyBFcnJvcihtc2cpO1xyXG59XHJcblxyXG5vcC5uZXh0ID0gZnVuY3Rpb24oayl7XHJcbiAgayA9IGsgfHwgMTtcclxuICB0aGlzLnBvcyArPSBrO1xyXG59XHJcbm9wLmVhdCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgaWYodHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKXtcclxuICAgIGZvcih2YXIgbGVuID0gdHlwZS5sZW5ndGggOyBsZW4tLTspe1xyXG4gICAgICBpZihsbC50eXBlID09PSB0eXBlW2xlbl0pIHtcclxuICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICByZXR1cm4gbGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIGlmKCBsbC50eXBlID09PSB0eXBlICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IGxsLnZhbHVlID09PSB2YWx1ZSkgKXtcclxuICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgcmV0dXJuIGxsO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIHByb2dyYW1cclxuLy8gIDpFT0ZcclxuLy8gIHwgKHN0YXRlbWVudCkqIEVPRlxyXG5vcC5wcm9ncmFtID0gZnVuY3Rpb24oKXtcclxuICB2YXIgc3RhdGVtZW50cyA9IFtdLCAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgd2hpbGUobGwudHlwZSAhPT0gJ0VPRicgJiYgbGwudHlwZSAhPT0nVEFHX0NMT1NFJyl7XHJcblxyXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgfVxyXG4gIC8vIGlmKGxsLnR5cGUgPT09ICdUQUdfQ0xPU0UnKSB0aGlzLmVycm9yKFwiWW91IG1heSBoYXZlIHVubWF0Y2hlZCBUYWdcIilcclxuICByZXR1cm4gc3RhdGVtZW50cztcclxufVxyXG5cclxuLy8gc3RhdGVtZW50XHJcbi8vICA6IHhtbFxyXG4vLyAgfCBqc3RcclxuLy8gIHwgdGV4dFxyXG5vcC5zdGF0ZW1lbnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlICdOQU1FJzpcclxuICAgIGNhc2UgJ1RFWFQnOlxyXG4gICAgICB2YXIgdGV4dCA9IGxsLnZhbHVlO1xyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgd2hpbGUobGwgPSB0aGlzLmVhdChbJ05BTUUnLCAnVEVYVCddKSl7XHJcbiAgICAgICAgdGV4dCArPSBsbC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbm9kZS50ZXh0KHRleHQpO1xyXG4gICAgY2FzZSAnVEFHX09QRU4nOlxyXG4gICAgICByZXR1cm4gdGhpcy54bWwoKTtcclxuICAgIGNhc2UgJ09QRU4nOiBcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aXZlKCk7XHJcbiAgICBjYXNlICdFWFBSX09QRU4nOlxyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgdG9rZW46ICcrIHRoaXMubGEoKSlcclxuICB9XHJcbn1cclxuXHJcbi8vIHhtbCBcclxuLy8gc3RhZyBzdGF0ZW1lbnQqIFRBR19DTE9TRT8oaWYgc2VsZi1jbG9zZWQgdGFnKVxyXG5vcC54bWwgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBuYW1lLCBhdHRycywgY2hpbGRyZW4sIHNlbGZDbG9zZWQ7XHJcbiAgbmFtZSA9IHRoaXMubWF0Y2goJ1RBR19PUEVOJykudmFsdWU7XHJcbiAgYXR0cnMgPSB0aGlzLmF0dHJzKCk7XHJcbiAgc2VsZkNsb3NlZCA9IHRoaXMuZWF0KCcvJylcclxuICB0aGlzLm1hdGNoKCc+Jyk7XHJcbiAgaWYoICFzZWxmQ2xvc2VkICYmICFfLmlzVm9pZFRhZyhuYW1lKSApe1xyXG4gICAgY2hpbGRyZW4gPSB0aGlzLnByb2dyYW0oKTtcclxuICAgIGlmKCF0aGlzLmVhdCgnVEFHX0NMT1NFJywgbmFtZSkpIHRoaXMuZXJyb3IoJ2V4cGVjdCA8LycrbmFtZSsnPiBnb3QnKyAnbm8gbWF0Y2hlZCBjbG9zZVRhZycpXHJcbiAgfVxyXG4gIHJldHVybiBub2RlLmVsZW1lbnQobmFtZSwgYXR0cnMsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLy8geGVudGl0eVxyXG4vLyAgLXJ1bGUod3JhcCBhdHRyaWJ1dGUpXHJcbi8vICAtYXR0cmlidXRlXHJcbi8vXHJcbi8vIF9fZXhhbXBsZV9fXHJcbi8vICBuYW1lID0gMSB8ICBcclxuLy8gIG5nLWhpZGUgfFxyXG4vLyAgb24tY2xpY2s9e3t9fSB8IFxyXG4vLyAge3sjaWYgbmFtZX19b24tY2xpY2s9e3t4eH19e3sjZWxzZX19b24tdGFwPXt7fX17ey9pZn19XHJcblxyXG5vcC54ZW50aXR5ID0gZnVuY3Rpb24obGwpe1xyXG4gIHZhciBuYW1lID0gbGwudmFsdWUsIHZhbHVlLCBtb2RpZmllcjtcclxuICBpZihsbC50eXBlID09PSAnTkFNRScpe1xyXG4gICAgLy9AIG9ubHkgZm9yIHRlc3RcclxuICAgIGlmKH5uYW1lLmluZGV4T2YoJy4nKSl7XHJcbiAgICAgIHZhciB0bXAgPSBuYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgIG5hbWUgPSB0bXBbMF07XHJcbiAgICAgIG1vZGlmaWVyID0gdG1wWzFdXHJcblxyXG4gICAgfVxyXG4gICAgaWYoIHRoaXMuZWF0KFwiPVwiKSApIHZhbHVlID0gdGhpcy5hdHR2YWx1ZShtb2RpZmllcik7XHJcbiAgICByZXR1cm4gbm9kZS5hdHRyaWJ1dGUoIG5hbWUsIHZhbHVlLCBtb2RpZmllciApO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoIG5hbWUgIT09ICdpZicpIHRoaXMuZXJyb3IoXCJjdXJyZW50IHZlcnNpb24uIE9OTFkgUlVMRSAjaWYgI2Vsc2UgI2Vsc2VpZiBpcyB2YWxpZCBpbiB0YWcsIHRoZSBydWxlICNcIiArIG5hbWUgKyAnIGlzIGludmFsaWQnKTtcclxuICAgIHJldHVybiB0aGlzWydpZiddKHRydWUpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIHN0YWcgICAgIDo6PSAgICAnPCcgTmFtZSAoUyBhdHRyKSogUz8gJz4nICBcclxuLy8gYXR0ciAgICA6Oj0gICAgIE5hbWUgRXEgYXR0dmFsdWVcclxub3AuYXR0cnMgPSBmdW5jdGlvbihpc0F0dHJpYnV0ZSl7XHJcbiAgdmFyIGVhdFxyXG4gIGlmKCFpc0F0dHJpYnV0ZSl7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCIsIFwiT1BFTlwiXVxyXG4gIH1lbHNle1xyXG4gICAgZWF0ID0gW1wiTkFNRVwiXVxyXG4gIH1cclxuXHJcbiAgdmFyIGF0dHJzID0gW10sIGxsO1xyXG4gIHdoaWxlIChsbCA9IHRoaXMuZWF0KGVhdCkpe1xyXG4gICAgYXR0cnMucHVzaCh0aGlzLnhlbnRpdHkoIGxsICkpXHJcbiAgfVxyXG4gIHJldHVybiBhdHRycztcclxufVxyXG5cclxuLy8gYXR0dmFsdWVcclxuLy8gIDogU1RSSU5HICBcclxuLy8gIHwgTkFNRVxyXG5vcC5hdHR2YWx1ZSA9IGZ1bmN0aW9uKG1kZil7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgXCJOQU1FXCI6XHJcbiAgICBjYXNlIFwiVU5RXCI6XHJcbiAgICBjYXNlIFwiU1RSSU5HXCI6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB2YXIgdmFsdWUgPSBsbC52YWx1ZTtcclxuICAgICAgaWYofnZhbHVlLmluZGV4T2YoY29uZmlnLkJFR0lOKSAmJiB+dmFsdWUuaW5kZXhPZihjb25maWcuRU5EKSAmJiBtZGYhPT0nY21wbCcpe1xyXG4gICAgICAgIHZhciBjb25zdGFudCA9IHRydWU7XHJcbiAgICAgICAgdmFyIHBhcnNlZCA9IG5ldyBQYXJzZXIodmFsdWUsIHsgbW9kZTogMiB9KS5wYXJzZSgpO1xyXG4gICAgICAgIGlmKHBhcnNlZC5sZW5ndGggPT09IDEgJiYgcGFyc2VkWzBdLnR5cGUgPT09ICdleHByZXNzaW9uJykgcmV0dXJuIHBhcnNlZFswXTtcclxuICAgICAgICB2YXIgYm9keSA9IFtdO1xyXG4gICAgICAgIHBhcnNlZC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgaWYoIWl0ZW0uY29uc3RhbnQpIGNvbnN0YW50PWZhbHNlO1xyXG4gICAgICAgICAgLy8gc2lsZW50IHRoZSBtdXRpcGxlIGludGVwbGF0aW9uXHJcbiAgICAgICAgICAgIGJvZHkucHVzaChpdGVtLmJvZHkgfHwgXCInXCIgKyBpdGVtLnRleHQucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpICsgXCInXCIpOyAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYm9keSA9IFwiW1wiICsgYm9keS5qb2luKFwiLFwiKSArIFwiXS5qb2luKCcnKVwiO1xyXG4gICAgICAgIHZhbHVlID0gbm9kZS5leHByZXNzaW9uKGJvZHksIG51bGwsIGNvbnN0YW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICBjYXNlIFwiRVhQUl9PUEVOXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgLy8gY2FzZSBcIk9QRU5cIjpcclxuICAgIC8vICAgaWYobGwudmFsdWUgPT09ICdpbmMnIHx8IGxsLnZhbHVlID09PSAnaW5jbHVkZScpe1xyXG4gICAgLy8gICAgIHRoaXMubmV4dCgpO1xyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLmluYygpO1xyXG4gICAgLy8gICB9ZWxzZXtcclxuICAgIC8vICAgICB0aGlzLmVycm9yKCdhdHRyaWJ1dGUgdmFsdWUgb25seSBzdXBwb3J0IGludGVwbGF0aW9uIGFuZCB7I2luY30gc3RhdGVtZW50JylcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgdG9rZW46ICcrIHRoaXMubGEoKSlcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyB7eyN9fVxyXG5vcC5kaXJlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBuYW1lID0gdGhpcy5sbCgpLnZhbHVlO1xyXG4gIHRoaXMubmV4dCgpO1xyXG4gIGlmKHR5cGVvZiB0aGlzW25hbWVdID09PSAnZnVuY3Rpb24nKXtcclxuICAgIHJldHVybiB0aGlzW25hbWVdKClcclxuICB9ZWxzZXtcclxuICAgIHRoaXMuZXJyb3IoJ1VuZGVmaW5lZCBkaXJlY3RpdmVbJysgbmFtZSArJ10nKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyB7e319XHJcbm9wLmludGVycGxhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnRVhQUl9PUEVOJyk7XHJcbiAgdmFyIHJlcyA9IHRoaXMuZXhwcmVzc2lvbih0cnVlKTtcclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyB7e359fVxyXG5vcC5pbmMgPSBvcC5pbmNsdWRlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29udGVudCA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiBub2RlLnRlbXBsYXRlKGNvbnRlbnQpO1xyXG59XHJcblxyXG4vLyB7eyNpZn19XHJcbm9wW1wiaWZcIl0gPSBmdW5jdGlvbih0YWcpe1xyXG4gIHZhciB0ZXN0ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdmFyIGNvbnNlcXVlbnQgPSBbXSwgYWx0ZXJuYXRlPVtdO1xyXG5cclxuICB2YXIgY29udGFpbmVyID0gY29uc2VxdWVudDtcclxuICB2YXIgc3RhdGVtZW50ID0gIXRhZz8gXCJzdGF0ZW1lbnRcIiA6IFwiYXR0cnNcIjtcclxuXHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcblxyXG4gIHZhciBsbCwgY2xvc2U7XHJcbiAgd2hpbGUoICEgKGNsb3NlID0gdGhpcy5lYXQoJ0NMT1NFJykpICl7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICAgIGlmKCBsbC50eXBlID09PSAnT1BFTicgKXtcclxuICAgICAgc3dpdGNoKCBsbC52YWx1ZSApe1xyXG4gICAgICAgIGNhc2UgJ2Vsc2UnOlxyXG4gICAgICAgICAgY29udGFpbmVyID0gYWx0ZXJuYXRlO1xyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICB0aGlzLm1hdGNoKCAnRU5EJyApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZWxzZWlmJzpcclxuICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgYWx0ZXJuYXRlLnB1c2goIHRoaXNbXCJpZlwiXSh0YWcpICk7XHJcbiAgICAgICAgICByZXR1cm4gbm9kZVsnaWYnXSggdGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlICk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbnRhaW5lci5wdXNoKCB0aGlzW3N0YXRlbWVudF0odHJ1ZSkgKTtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXNbc3RhdGVtZW50XSh0cnVlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGlmIHN0YXRlbWVudCBub3QgbWF0Y2hlZFxyXG4gIGlmKGNsb3NlLnZhbHVlICE9PSBcImlmXCIpIHRoaXMuZXJyb3IoJ1VubWF0Y2hlZCBpZiBkaXJlY3RpdmUnKVxyXG4gIHJldHVybiBub2RlW1wiaWZcIl0odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKTtcclxufVxyXG5cclxuXHJcbi8vIEBtYXJrICAgbXVzdGFjaGUgc3ludGF4IGhhdmUgbmF0cnVyZSBkaXMsIGNhbm90IHdpdGggZXhwcmVzc2lvblxyXG4vLyB7eyNsaXN0fX1cclxub3AubGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gc2VxdWVuY2UgY2FuIGJlIGEgbGlzdCBvciBoYXNoXHJcbiAgdmFyIHNlcXVlbmNlID0gdGhpcy5leHByZXNzaW9uKCksIHZhcmlhYmxlLCBsbCwgdHJhY2s7XHJcbiAgdmFyIGNvbnNlcXVlbnQgPSBbXSwgYWx0ZXJuYXRlPVtdO1xyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG5cclxuICB0aGlzLm1hdGNoKCdJREVOVCcsICdhcycpO1xyXG5cclxuICB2YXJpYWJsZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCdJREVOVCcsICdieScpKXtcclxuICAgIGlmKHRoaXMuZWF0KCdJREVOVCcsdmFyaWFibGUgKyAnX2luZGV4Jykpe1xyXG4gICAgICB0cmFjayA9IHRydWU7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdHJhY2sgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICAgICAgaWYodHJhY2suY29uc3RhbnQpe1xyXG4gICAgICAgIC8vIHRydWUgaXMgbWVhbnMgY29uc3RhbnQsIHdlIGhhbmRsZSBpdCBqdXN0IGxpa2UgeHh4X2luZGV4LlxyXG4gICAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcblxyXG4gIHdoaWxlKCAhKGxsID0gdGhpcy5lYXQoJ0NMT1NFJykpICl7XHJcbiAgICBpZih0aGlzLmVhdCgnT1BFTicsICdlbHNlJykpe1xyXG4gICAgICBjb250YWluZXIgPSAgYWx0ZXJuYXRlO1xyXG4gICAgICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBjb250YWluZXIucHVzaCh0aGlzLnN0YXRlbWVudCgpKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgaWYobGwudmFsdWUgIT09ICdsaXN0JykgdGhpcy5lcnJvcignZXhwZWN0ICcgKyAnbGlzdCBnb3QgJyArICcvJyArIGxsLnZhbHVlICsgJyAnLCBsbC5wb3MgKTtcclxuICByZXR1cm4gbm9kZS5saXN0KHNlcXVlbmNlLCB2YXJpYWJsZSwgY29uc2VxdWVudCwgYWx0ZXJuYXRlLCB0cmFjayk7XHJcbn1cclxuXHJcblxyXG5vcC5leHByZXNzaW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgZXhwcmVzc2lvbjtcclxuICBpZih0aGlzLmVhdCgnQCgnKSl7IC8vb25jZSBiaW5kXHJcbiAgICBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XHJcbiAgICBleHByZXNzaW9uLm9uY2UgPSB0cnVlO1xyXG4gICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgfWVsc2V7XHJcbiAgICBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XHJcbiAgfVxyXG4gIHJldHVybiBleHByZXNzaW9uO1xyXG59XHJcblxyXG5vcC5leHByID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmRlcGVuZCA9IFtdO1xyXG5cclxuICB2YXIgYnVmZmVyID0gdGhpcy5maWx0ZXIoKVxyXG5cclxuICB2YXIgYm9keSA9IGJ1ZmZlci5nZXQgfHwgYnVmZmVyO1xyXG4gIHZhciBzZXRib2R5ID0gYnVmZmVyLnNldDtcclxuICByZXR1cm4gbm9kZS5leHByZXNzaW9uKGJvZHksIHNldGJvZHksICF0aGlzLmRlcGVuZC5sZW5ndGgsIGJ1ZmZlci5maWx0ZXJzKTtcclxufVxyXG5cclxuXHJcbi8vIGZpbHRlclxyXG4vLyBhc3NpZ24gKCd8JyBmaWx0ZXJuYW1lWyc6JyBhcmdzXSkgKiBcclxub3AuZmlsdGVyID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgdmFyIGxsID0gdGhpcy5lYXQoJ3wnKTtcclxuICB2YXIgYnVmZmVyID0gW10sIGZpbHRlcnMsc2V0QnVmZmVyLCBwcmVmaXgsXHJcbiAgICBhdHRyID0gXCJ0XCIsIFxyXG4gICAgc2V0ID0gbGVmdC5zZXQsIGdldCwgXHJcbiAgICB0bXAgPSBcIlwiO1xyXG5cclxuICBpZihsbCl7XHJcbiAgICBpZihzZXQpIHtcclxuICAgICAgc2V0QnVmZmVyID0gW107XHJcbiAgICAgIGZpbHRlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXggPSBcIihmdW5jdGlvbihcIiArIGF0dHIgKyBcIil7XCI7XHJcblxyXG4gICAgZG97XHJcbiAgICAgIHZhciBmaWx0ZXJOYW1lID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuICAgICAgdG1wID0gYXR0ciArIFwiID0gXCIgKyBjdHhOYW1lICsgXCIuX2ZfKCdcIiArIGZpbHRlck5hbWUgKyBcIicgKS5nZXQuY2FsbCggXCIrXy5jdHhOYW1lICtcIixcIiArIGF0dHIgO1xyXG4gICAgICBpZih0aGlzLmVhdCgnOicpKXtcclxuICAgICAgICB0bXAgKz1cIiwgXCIrIHRoaXMuYXJndW1lbnRzKFwifFwiKS5qb2luKFwiLFwiKSArIFwiKTtcIlxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0bXAgKz0gJyk7J1xyXG4gICAgICB9XHJcbiAgICAgIGJ1ZmZlci5wdXNoKHRtcCk7XHJcbiAgICAgIFxyXG4gICAgICBpZihzZXQpe1xyXG4gICAgICAgIC8vIG9ubHkgaW4gcnVudGltZSAsd2UgY2FuIGRldGVjdCAgd2hldGhlciAgdGhlIGZpbHRlciBoYXMgYSBzZXQgZnVuY3Rpb24uIFxyXG4gICAgICAgIGZpbHRlcnMucHVzaChmaWx0ZXJOYW1lKTtcclxuICAgICAgICBzZXRCdWZmZXIudW5zaGlmdCggdG1wLnJlcGxhY2UoXCIgKS5nZXQuY2FsbFwiLCBcIiApLnNldC5jYWxsXCIpICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9d2hpbGUobGwgPSB0aGlzLmVhdCgnfCcpKTtcclxuICAgIGJ1ZmZlci5wdXNoKFwicmV0dXJuIFwiICsgYXR0ciApO1xyXG4gICAgc2V0QnVmZmVyICYmIHNldEJ1ZmZlci5wdXNoKFwicmV0dXJuIFwiICsgYXR0cik7XHJcblxyXG4gICAgZ2V0ID0gIHByZWZpeCArIGJ1ZmZlci5qb2luKFwiXCIpICsgXCJ9KShcIitsZWZ0LmdldCtcIilcIjtcclxuICAgIC8vIHdlIGNhbGwgYmFjayB0byB2YWx1ZS5cclxuICAgIGlmKHNldEJ1ZmZlcil7XHJcbiAgICAgIC8vIGNoYW5nZSBfc3NfXyhuYW1lLCBfcF8pIHRvIF9zX18obmFtZSwgZmlsdGVyRm4oX3BfKSk7XHJcbiAgICAgIHNldCA9IHNldC5yZXBsYWNlKF8uc2V0TmFtZSwgXHJcbiAgICAgICAgcHJlZml4ICsgc2V0QnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK+OAgF8uc2V0TmFtZeOAgCtcIilcIiApO1xyXG5cclxuICAgIH1cclxuICAgIC8vIHRoZSBzZXQgZnVuY3Rpb24gaXMgZGVwZW5kIG9uIHRoZSBmaWx0ZXIgZGVmaW5pdGlvbi4gaWYgaXQgaGF2ZSBzZXQgbWV0aG9kLCB0aGUgc2V0IHdpbGwgd29ya1xyXG4gICAgdmFyIHJldCA9IGdldHNldChnZXQsIHNldCk7XHJcbiAgICByZXQuZmlsdGVycyA9IGZpbHRlcnM7XHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gYXNzaWduXHJcbi8vIGxlZnQtaGFuZC1leHByID0gY29uZGl0aW9uXHJcbm9wLmFzc2lnbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmNvbmRpdGlvbigpLCBsbDtcclxuICBpZihsbCA9IHRoaXMuZWF0KFsnPScsICcrPScsICctPScsICcqPScsICcvPScsICclPSddKSl7XHJcbiAgICBpZighbGVmdC5zZXQpIHRoaXMuZXJyb3IoJ2ludmFsaWQgbGVmdGhhbmQgZXhwcmVzc2lvbiBpbiBhc3NpZ25tZW50IGV4cHJlc3Npb24nKTtcclxuICAgIHJldHVybiBnZXRzZXQoIGxlZnQuc2V0LnJlcGxhY2UoIFwiLFwiICsgXy5zZXROYW1lLCBcIixcIiArIHRoaXMuY29uZGl0aW9uKCkuZ2V0ICkucmVwbGFjZShcIic9J1wiLCBcIidcIitsbC50eXBlK1wiJ1wiKSwgbGVmdC5zZXQpO1xyXG4gICAgLy8gcmV0dXJuIGdldHNldCgnKCcgKyBsZWZ0LmdldCArIGxsLnR5cGUgICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKyAnKScsIGxlZnQuc2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbi8vIG9yXHJcbi8vIG9yID8gYXNzaWduIDogYXNzaWduXHJcbm9wLmNvbmRpdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciB0ZXN0ID0gdGhpcy5vcigpO1xyXG4gIGlmKHRoaXMuZWF0KCc/Jykpe1xyXG4gICAgcmV0dXJuIGdldHNldChbdGVzdC5nZXQgKyBcIj9cIiwgXHJcbiAgICAgIHRoaXMuYXNzaWduKCkuZ2V0LCBcclxuICAgICAgdGhpcy5tYXRjaChcIjpcIikudHlwZSwgXHJcbiAgICAgIHRoaXMuYXNzaWduKCkuZ2V0XS5qb2luKFwiXCIpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0ZXN0O1xyXG59XHJcblxyXG4vLyBhbmRcclxuLy8gYW5kICYmIG9yXHJcbm9wLm9yID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFuZCgpO1xyXG5cclxuICBpZih0aGlzLmVhdCgnfHwnKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgJ3x8JyArIHRoaXMub3IoKS5nZXQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuLy8gZXF1YWxcclxuLy8gZXF1YWwgJiYgYW5kXHJcbm9wLmFuZCA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBsZWZ0ID0gdGhpcy5lcXVhbCgpO1xyXG5cclxuICBpZih0aGlzLmVhdCgnJiYnKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgJyYmJyArIHRoaXMuYW5kKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuLy8gcmVsYXRpb25cclxuLy8gXHJcbi8vIGVxdWFsID09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9IHJlbGF0aW9uXHJcbi8vIGVxdWFsID09PSByZWxhdGlvblxyXG4vLyBlcXVhbCAhPT0gcmVsYXRpb25cclxub3AuZXF1YWwgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yZWxhdGlvbigpLCBsbDtcclxuICAvLyBAcGVyZjtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJz09JywnIT0nLCAnPT09JywgJyE9PSddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMuZXF1YWwoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIHJlbGF0aW9uIDwgYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPiBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA8PSBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+PSBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiBpbiBhZGRpdGl2ZVxyXG5vcC5yZWxhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFkZGl0aXZlKCksIGxsO1xyXG4gIC8vIEBwZXJmXHJcbiAgaWYobGwgPSAodGhpcy5lYXQoWyc8JywgJz4nLCAnPj0nLCAnPD0nXSkgfHwgdGhpcy5lYXQoJ0lERU5UJywgJ2luJykgKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudmFsdWUgKyB0aGlzLnJlbGF0aW9uKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyBhZGRpdGl2ZSA6XHJcbi8vIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgKyBtdWx0aXZlXHJcbi8vIGFkZGl0aXZlIC0gbXVsdGl2ZVxyXG5vcC5hZGRpdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLm11bHRpdmUoKSAsbGw7XHJcbiAgaWYobGw9IHRoaXMuZWF0KFsnKycsJy0nXSkgKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMuYWRkaXRpdmUoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIG11bHRpdmUgOlxyXG4vLyB1bmFyeVxyXG4vLyBtdWx0aXZlICogdW5hcnlcclxuLy8gbXVsdGl2ZSAvIHVuYXJ5XHJcbi8vIG11bHRpdmUgJSB1bmFyeVxyXG5vcC5tdWx0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMucmFuZ2UoKSAsbGw7XHJcbiAgaWYoIGxsID0gdGhpcy5lYXQoWycqJywgJy8nICwnJSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnR5cGUgKyB0aGlzLm11bHRpdmUoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxub3AucmFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy51bmFyeSgpLCBsbCwgcmlnaHQ7XHJcblxyXG4gIGlmKGxsID0gdGhpcy5lYXQoJy4uJykpe1xyXG4gICAgcmlnaHQgPSB0aGlzLnVuYXJ5KCk7XHJcbiAgICB2YXIgYm9keSA9IFxyXG4gICAgICBcIihmdW5jdGlvbihzdGFydCxlbmQpe3ZhciByZXMgPSBbXSxzdGVwPWVuZD5zdGFydD8xOi0xOyBmb3IodmFyIGkgPSBzdGFydDsgZW5kPnN0YXJ0P2kgPD0gZW5kOiBpPj1lbmQ7IGk9aStzdGVwKXtyZXMucHVzaChpKTsgfSByZXR1cm4gcmVzIH0pKFwiK2xlZnQuZ2V0K1wiLFwiK3JpZ2h0LmdldCtcIilcIlxyXG4gICAgcmV0dXJuIGdldHNldChib2R5KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5cclxuXHJcbi8vIGxlZnRoYW5kXHJcbi8vICsgdW5hcnlcclxuLy8gLSB1bmFyeVxyXG4vLyB+IHVuYXJ5XHJcbi8vICEgdW5hcnlcclxub3AudW5hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbDtcclxuICBpZihsbCA9IHRoaXMuZWF0KFsnKycsJy0nLCd+JywgJyEnXSkpe1xyXG4gICAgcmV0dXJuIGdldHNldCgnKCcgKyBsbC50eXBlICsgdGhpcy51bmFyeSgpLmdldCArICcpJykgO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIHRoaXMubWVtYmVyKClcclxuICB9XHJcbn1cclxuXHJcbi8vIGNhbGxbbGVmdGhhbmRdIDpcclxuLy8gbWVtYmVyIGFyZ3NcclxuLy8gbWVtYmVyIFsgZXhwcmVzc2lvbiBdXHJcbi8vIG1lbWJlciAuIGlkZW50ICBcclxuXHJcbm9wLm1lbWJlciA9IGZ1bmN0aW9uKGJhc2UsIGxhc3QsIHBhdGhlcywgcHJldkJhc2Upe1xyXG4gIHZhciBsbCwgcGF0aCwgZXh0VmFsdWU7XHJcblxyXG5cclxuICB2YXIgb25seVNpbXBsZUFjY2Vzc29yID0gZmFsc2U7XHJcbiAgaWYoIWJhc2UpeyAvL2ZpcnN0XHJcbiAgICBwYXRoID0gdGhpcy5wcmltYXJ5KCk7XHJcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBwYXRoO1xyXG4gICAgaWYodHlwZSA9PT0gJ3N0cmluZycpeyBcclxuICAgICAgcGF0aGVzID0gW107XHJcbiAgICAgIHBhdGhlcy5wdXNoKCBwYXRoICk7XHJcbiAgICAgIGxhc3QgPSBwYXRoO1xyXG4gICAgICBleHRWYWx1ZSA9IGV4dE5hbWUgKyBcIi5cIiArIHBhdGhcclxuICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHBhdGggKyBcIicsIFwiICsgdmFyTmFtZSArIFwiLCBcIiArIGV4dE5hbWUgKyBcIilcIjtcclxuICAgICAgb25seVNpbXBsZUFjY2Vzc29yID0gdHJ1ZTtcclxuICAgIH1lbHNleyAvL1ByaW1hdGl2ZSBUeXBlXHJcbiAgICAgIGlmKHBhdGguZ2V0ID09PSAndGhpcycpe1xyXG4gICAgICAgIGJhc2UgPSBjdHhOYW1lO1xyXG4gICAgICAgIHBhdGhlcyA9IFsndGhpcyddO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgICAgIGJhc2UgPSBwYXRoLmdldDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNleyAvLyBub3QgZmlyc3QgZW50ZXJcclxuICAgIGlmKHR5cGVvZiBsYXN0ID09PSAnc3RyaW5nJyAmJiBpc1BhdGgoIGxhc3QpICl7IC8vIGlzIHZhbGlkIHBhdGhcclxuICAgICAgcGF0aGVzLnB1c2gobGFzdCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYocGF0aGVzICYmIHBhdGhlcy5sZW5ndGgpIHRoaXMuZGVwZW5kLnB1c2gocGF0aGVzKTtcclxuICAgICAgcGF0aGVzID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJ1snLCAnLicsICcoJ10pKXtcclxuICAgIHN3aXRjaChsbC50eXBlKXtcclxuICAgICAgY2FzZSAnLic6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgdmFyIHRtcE5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICAgIHByZXZCYXNlID0gYmFzZTtcclxuICAgICAgICBpZiggdGhpcy5sYSgpICE9PSBcIihcIiApeyBcclxuICAgICAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXygnXCIgKyB0bXBOYW1lICsgXCInLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbJ1wiICsgdG1wTmFtZSArIFwiJ11cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKCBiYXNlLCB0bXBOYW1lLCBwYXRoZXMsICBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJ1snOlxyXG4gICAgICAgICAgLy8gbWVtYmVyKG9iamVjdCwgcHJvcGVydHksIGNvbXB1dGVkKVxyXG4gICAgICAgIHBhdGggPSB0aGlzLmFzc2lnbigpO1xyXG4gICAgICAgIHByZXZCYXNlID0gYmFzZTtcclxuICAgICAgICBpZiggdGhpcy5sYSgpICE9PSBcIihcIiApeyBcclxuICAgICAgICAvLyBtZWFucyBmdW5jdGlvbiBjYWxsLCB3ZSBuZWVkIHRocm93IHVuZGVmaW5lZCBlcnJvciB3aGVuIGNhbGwgZnVuY3Rpb25cclxuICAgICAgICAvLyBhbmQgY29uZmlybSB0aGF0IHRoZSBmdW5jdGlvbiBjYWxsIHdvbnQgbG9zZSBpdHMgY29udGV4dFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKFwiICsgcGF0aC5nZXQgKyBcIiwgXCIgKyBiYXNlICsgXCIpXCI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiYXNlICs9IFwiW1wiICsgcGF0aC5nZXQgKyBcIl1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnXScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIHBhdGgsIHBhdGhlcywgcHJldkJhc2UpO1xyXG4gICAgICBjYXNlICcoJzpcclxuICAgICAgICAvLyBjYWxsKGNhbGxlZSwgYXJncylcclxuICAgICAgICB2YXIgYXJncyA9IHRoaXMuYXJndW1lbnRzKCkuam9pbignLCcpO1xyXG4gICAgICAgIGJhc2UgPSAgYmFzZStcIihcIiArIGFyZ3MgK1wiKVwiO1xyXG4gICAgICAgIHRoaXMubWF0Y2goJyknKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcihiYXNlLCBudWxsLCBwYXRoZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiggcGF0aGVzICYmIHBhdGhlcy5sZW5ndGggKSB0aGlzLmRlcGVuZC5wdXNoKCBwYXRoZXMgKTtcclxuICB2YXIgcmVzID0gIHtnZXQ6IGJhc2V9O1xyXG4gIGlmKGxhc3Qpe1xyXG4gICAgcmVzLnNldCA9IGN0eE5hbWUgKyBcIi5fc3NfKFwiICsgXHJcbiAgICAgICAgKGxhc3QuZ2V0PyBsYXN0LmdldCA6IFwiJ1wiKyBsYXN0ICsgXCInXCIpICsgXHJcbiAgICAgICAgXCIsXCIrIF8uc2V0TmFtZSArIFwiLFwiKyBcclxuICAgICAgICAocHJldkJhc2U/cHJldkJhc2U6Xy52YXJOYW1lKSArIFxyXG4gICAgICAgIFwiLCAnPScsIFwiKyAoIG9ubHlTaW1wbGVBY2Nlc3Nvcj8gMSA6IDAgKSArIFwiKVwiO1xyXG4gIFxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5vcC5hcmd1bWVudHMgPSBmdW5jdGlvbihlbmQpe1xyXG4gIGVuZCA9IGVuZCB8fCAnKSdcclxuICB2YXIgYXJncyA9IFtdO1xyXG4gIGRve1xyXG4gICAgaWYodGhpcy5sYSgpICE9PSBlbmQpe1xyXG4gICAgICBhcmdzLnB1c2godGhpcy5hc3NpZ24oKS5nZXQpXHJcbiAgICB9XHJcbiAgfXdoaWxlKCB0aGlzLmVhdCgnLCcpKTtcclxuICByZXR1cm4gYXJnc1xyXG59XHJcblxyXG5cclxuLy8gcHJpbWFyeSA6XHJcbi8vIHRoaXMgXHJcbi8vIGlkZW50XHJcbi8vIGxpdGVyYWxcclxuLy8gYXJyYXlcclxuLy8gb2JqZWN0XHJcbi8vICggZXhwcmVzc2lvbiApXHJcblxyXG5vcC5wcmltYXJ5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIntcIjpcclxuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0KCk7XHJcbiAgICBjYXNlIFwiW1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xyXG4gICAgY2FzZSBcIihcIjpcclxuICAgICAgcmV0dXJuIHRoaXMucGFyZW4oKTtcclxuICAgIC8vIGxpdGVyYWwgb3IgaWRlbnRcclxuICAgIGNhc2UgJ1NUUklORyc6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB2YXIgdmFsdWUgPSBcIlwiICsgbGwudmFsdWU7XHJcbiAgICAgIHZhciBxdW90YSA9IH52YWx1ZS5pbmRleE9mKFwiJ1wiKT8gXCJcXFwiXCI6IFwiJ1wiIDtcclxuICAgICAgcmV0dXJuIGdldHNldChxdW90YSArIHZhbHVlICsgcXVvdGEpO1xyXG4gICAgY2FzZSAnTlVNQkVSJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHJldHVybiBnZXRzZXQoIFwiXCIgKyBsbC52YWx1ZSApO1xyXG4gICAgY2FzZSBcIklERU5UXCI6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICBpZihpc0tleVdvcmQobGwudmFsdWUpKXtcclxuICAgICAgICByZXR1cm4gZ2V0c2V0KCBsbC52YWx1ZSApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBsbC52YWx1ZTtcclxuICAgIGRlZmF1bHQ6IFxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIFRva2VuOiAnICsgbGwudHlwZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvYmplY3RcclxuLy8gIHtwcm9wQXNzaWduIFssIHByb3BBc3NpZ25dICogWyxdfVxyXG5cclxuLy8gcHJvcEFzc2lnblxyXG4vLyAgcHJvcCA6IGFzc2lnblxyXG5cclxuLy8gcHJvcFxyXG4vLyAgU1RSSU5HXHJcbi8vICBJREVOVFxyXG4vLyAgTlVNQkVSXHJcblxyXG5vcC5vYmplY3QgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb2RlID0gW3RoaXMubWF0Y2goJ3snKS50eXBlXTtcclxuXHJcbiAgdmFyIGxsID0gdGhpcy5lYXQoIFsnU1RSSU5HJywgJ0lERU5UJywgJ05VTUJFUiddICk7XHJcbiAgd2hpbGUobGwpe1xyXG4gICAgY29kZS5wdXNoKFwiJ1wiICsgbGwudmFsdWUgKyBcIidcIiArIHRoaXMubWF0Y2goJzonKS50eXBlKTtcclxuICAgIHZhciBnZXQgPSB0aGlzLmFzc2lnbigpLmdldDtcclxuICAgIGNvZGUucHVzaChnZXQpO1xyXG4gICAgbGwgPSBudWxsO1xyXG4gICAgaWYodGhpcy5lYXQoXCIsXCIpICYmIChsbCA9IHRoaXMuZWF0KFsnU1RSSU5HJywgJ0lERU5UJywgJ05VTUJFUiddKSkgKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gIH1cclxuICBjb2RlLnB1c2godGhpcy5tYXRjaCgnfScpLnR5cGUpO1xyXG4gIHJldHVybiB7Z2V0OiBjb2RlLmpvaW4oXCJcIil9XHJcbn1cclxuXHJcbi8vIGFycmF5XHJcbi8vIFsgYXNzaWduWyxhc3NpZ25dKl1cclxub3AuYXJyYXkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb2RlID0gW3RoaXMubWF0Y2goJ1snKS50eXBlXSwgaXRlbTtcclxuICBpZiggdGhpcy5lYXQoXCJdXCIpICl7XHJcblxyXG4gICAgIGNvZGUucHVzaChcIl1cIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlKGl0ZW0gPSB0aGlzLmFzc2lnbigpKXtcclxuICAgICAgY29kZS5wdXNoKGl0ZW0uZ2V0KTtcclxuICAgICAgaWYodGhpcy5lYXQoJywnKSkgY29kZS5wdXNoKFwiLFwiKTtcclxuICAgICAgZWxzZSBicmVhaztcclxuICAgIH1cclxuICAgIGNvZGUucHVzaCh0aGlzLm1hdGNoKCddJykudHlwZSk7XHJcbiAgfVxyXG4gIHJldHVybiB7Z2V0OiBjb2RlLmpvaW4oXCJcIil9O1xyXG59XHJcblxyXG4vLyAnKCcgZXhwcmVzc2lvbiAnKSdcclxub3AucGFyZW4gPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMubWF0Y2goJygnKTtcclxuICB2YXIgcmVzID0gdGhpcy5maWx0ZXIoKVxyXG4gIHJlcy5nZXQgPSAnKCcgKyByZXMuZ2V0ICsgJyknO1xyXG4gIHJlcy5zZXQgPSByZXMuc2V0O1xyXG4gIHRoaXMubWF0Y2goJyknKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRzZXQoZ2V0LCBzZXQpe1xyXG4gIHJldHVybiB7XHJcbiAgICBnZXQ6IGdldCxcclxuICAgIHNldDogc2V0XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1BhcnNlci9zcmMvUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3RpbWVycy1icm93c2VyaWZ5QDIuMC40QHRpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3Byb2Nlc3NAMC4xMS4xMEBwcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIGVzNVxyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIHRzdHIgPSAoe30pLnRvU3RyaW5nO1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKG8xLCBvMiApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYoIG8xW2ldID09PSB1bmRlZmluZWQpe1xyXG4gICAgbzFbaV0gPSBvMltpXVxyXG4gIH1cclxuICByZXR1cm4gbzI7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gU3RyaW5nIHByb3RvIDtcclxuICBleHRlbmQoU3RyaW5nLnByb3RvdHlwZSwge1xyXG4gICAgdHJpbTogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbiAgLy8gQXJyYXkgcHJvdG87XHJcbiAgZXh0ZW5kKEFycmF5LnByb3RvdHlwZSwge1xyXG4gICAgaW5kZXhPZjogZnVuY3Rpb24ob2JqLCBmcm9tKXtcclxuICAgICAgZnJvbSA9IGZyb20gfHwgMDtcclxuICAgICAgZm9yICh2YXIgaSA9IGZyb20sIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSByZXR1cm4gaTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9LFxyXG4gICAgLy8gcG9seWZpbGwgZnJvbSBNRE4gXHJcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgY3R4KXtcclxuICAgICAgdmFyIGsgPSAwO1xyXG5cclxuICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXHJcbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG5cclxuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwOyBcclxuXHJcbiAgICAgIGlmICggdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggY2FsbGJhY2sgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxyXG4gICAgICB3aGlsZSggayA8IGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGtWYWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKCBrIGluIE8gKSB7XHJcblxyXG4gICAgICAgICAga1ZhbHVlID0gT1sgayBdO1xyXG5cclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoIGN0eCwga1ZhbHVlLCBrLCBPICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGsrKztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEBkZXByZWNhdGVkXHJcbiAgICAvLyAgd2lsbCBiZSByZW1vdmVkIGF0IDAuNS4wXHJcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGZ1biwgY29udGV4dCl7XHJcblxyXG4gICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcclxuICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xyXG4gICAgICBpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuXHJcbiAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuICAgICAge1xyXG4gICAgICAgIGlmIChpIGluIHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIHZhbCA9IHRbaV07XHJcbiAgICAgICAgICBpZiAoZnVuLmNhbGwoY29udGV4dCwgdmFsLCBpLCB0KSlcclxuICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIEZ1bmN0aW9uIHByb3RvO1xyXG4gIGV4dGVuZChGdW5jdGlvbi5wcm90b3R5cGUsIHtcclxuICAgIGJpbmQ6IGZ1bmN0aW9uKGNvbnRleHQpe1xyXG4gICAgICB2YXIgZm4gPSB0aGlzO1xyXG4gICAgICB2YXIgcHJlQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBwcmVBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgXHJcbiAgLy8gQXJyYXlcclxuICBleHRlbmQoQXJyYXksIHtcclxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKGFycil7XHJcbiAgICAgIHJldHVybiB0c3RyLmNhbGwoYXJyKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1BhcnNlci9oZWxwZXIvc2hpbS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzU0MDY0L2hvdy10by1jb252ZXJ0LWNoYXJhY3RlcnMtdG8taHRtbC1lbnRpdGllcy11c2luZy1wbGFpbi1qYXZhc2NyaXB0XHJcbnZhciBlbnRpdGllcyA9IHtcclxuICAncXVvdCc6MzQsIFxyXG4gICdhbXAnOjM4LCBcclxuICAnYXBvcyc6MzksIFxyXG4gICdsdCc6NjAsIFxyXG4gICdndCc6NjIsIFxyXG4gICduYnNwJzoxNjAsIFxyXG4gICdpZXhjbCc6MTYxLCBcclxuICAnY2VudCc6MTYyLCBcclxuICAncG91bmQnOjE2MywgXHJcbiAgJ2N1cnJlbic6MTY0LCBcclxuICAneWVuJzoxNjUsIFxyXG4gICdicnZiYXInOjE2NiwgXHJcbiAgJ3NlY3QnOjE2NywgXHJcbiAgJ3VtbCc6MTY4LCBcclxuICAnY29weSc6MTY5LCBcclxuICAnb3JkZic6MTcwLCBcclxuICAnbGFxdW8nOjE3MSwgXHJcbiAgJ25vdCc6MTcyLCBcclxuICAnc2h5JzoxNzMsIFxyXG4gICdyZWcnOjE3NCwgXHJcbiAgJ21hY3InOjE3NSwgXHJcbiAgJ2RlZyc6MTc2LCBcclxuICAncGx1c21uJzoxNzcsIFxyXG4gICdzdXAyJzoxNzgsIFxyXG4gICdzdXAzJzoxNzksIFxyXG4gICdhY3V0ZSc6MTgwLCBcclxuICAnbWljcm8nOjE4MSwgXHJcbiAgJ3BhcmEnOjE4MiwgXHJcbiAgJ21pZGRvdCc6MTgzLCBcclxuICAnY2VkaWwnOjE4NCwgXHJcbiAgJ3N1cDEnOjE4NSwgXHJcbiAgJ29yZG0nOjE4NiwgXHJcbiAgJ3JhcXVvJzoxODcsIFxyXG4gICdmcmFjMTQnOjE4OCwgXHJcbiAgJ2ZyYWMxMic6MTg5LCBcclxuICAnZnJhYzM0JzoxOTAsIFxyXG4gICdpcXVlc3QnOjE5MSwgXHJcbiAgJ0FncmF2ZSc6MTkyLCBcclxuICAnQWFjdXRlJzoxOTMsIFxyXG4gICdBY2lyYyc6MTk0LCBcclxuICAnQXRpbGRlJzoxOTUsIFxyXG4gICdBdW1sJzoxOTYsIFxyXG4gICdBcmluZyc6MTk3LCBcclxuICAnQUVsaWcnOjE5OCwgXHJcbiAgJ0NjZWRpbCc6MTk5LCBcclxuICAnRWdyYXZlJzoyMDAsIFxyXG4gICdFYWN1dGUnOjIwMSwgXHJcbiAgJ0VjaXJjJzoyMDIsIFxyXG4gICdFdW1sJzoyMDMsIFxyXG4gICdJZ3JhdmUnOjIwNCwgXHJcbiAgJ0lhY3V0ZSc6MjA1LCBcclxuICAnSWNpcmMnOjIwNiwgXHJcbiAgJ0l1bWwnOjIwNywgXHJcbiAgJ0VUSCc6MjA4LCBcclxuICAnTnRpbGRlJzoyMDksIFxyXG4gICdPZ3JhdmUnOjIxMCwgXHJcbiAgJ09hY3V0ZSc6MjExLCBcclxuICAnT2NpcmMnOjIxMiwgXHJcbiAgJ090aWxkZSc6MjEzLCBcclxuICAnT3VtbCc6MjE0LCBcclxuICAndGltZXMnOjIxNSwgXHJcbiAgJ09zbGFzaCc6MjE2LCBcclxuICAnVWdyYXZlJzoyMTcsIFxyXG4gICdVYWN1dGUnOjIxOCwgXHJcbiAgJ1VjaXJjJzoyMTksIFxyXG4gICdVdW1sJzoyMjAsIFxyXG4gICdZYWN1dGUnOjIyMSwgXHJcbiAgJ1RIT1JOJzoyMjIsIFxyXG4gICdzemxpZyc6MjIzLCBcclxuICAnYWdyYXZlJzoyMjQsIFxyXG4gICdhYWN1dGUnOjIyNSwgXHJcbiAgJ2FjaXJjJzoyMjYsIFxyXG4gICdhdGlsZGUnOjIyNywgXHJcbiAgJ2F1bWwnOjIyOCwgXHJcbiAgJ2FyaW5nJzoyMjksIFxyXG4gICdhZWxpZyc6MjMwLCBcclxuICAnY2NlZGlsJzoyMzEsIFxyXG4gICdlZ3JhdmUnOjIzMiwgXHJcbiAgJ2VhY3V0ZSc6MjMzLCBcclxuICAnZWNpcmMnOjIzNCwgXHJcbiAgJ2V1bWwnOjIzNSwgXHJcbiAgJ2lncmF2ZSc6MjM2LCBcclxuICAnaWFjdXRlJzoyMzcsIFxyXG4gICdpY2lyYyc6MjM4LCBcclxuICAnaXVtbCc6MjM5LCBcclxuICAnZXRoJzoyNDAsIFxyXG4gICdudGlsZGUnOjI0MSwgXHJcbiAgJ29ncmF2ZSc6MjQyLCBcclxuICAnb2FjdXRlJzoyNDMsIFxyXG4gICdvY2lyYyc6MjQ0LCBcclxuICAnb3RpbGRlJzoyNDUsIFxyXG4gICdvdW1sJzoyNDYsIFxyXG4gICdkaXZpZGUnOjI0NywgXHJcbiAgJ29zbGFzaCc6MjQ4LCBcclxuICAndWdyYXZlJzoyNDksIFxyXG4gICd1YWN1dGUnOjI1MCwgXHJcbiAgJ3VjaXJjJzoyNTEsIFxyXG4gICd1dW1sJzoyNTIsIFxyXG4gICd5YWN1dGUnOjI1MywgXHJcbiAgJ3Rob3JuJzoyNTQsIFxyXG4gICd5dW1sJzoyNTUsIFxyXG4gICdmbm9mJzo0MDIsIFxyXG4gICdBbHBoYSc6OTEzLCBcclxuICAnQmV0YSc6OTE0LCBcclxuICAnR2FtbWEnOjkxNSwgXHJcbiAgJ0RlbHRhJzo5MTYsIFxyXG4gICdFcHNpbG9uJzo5MTcsIFxyXG4gICdaZXRhJzo5MTgsIFxyXG4gICdFdGEnOjkxOSwgXHJcbiAgJ1RoZXRhJzo5MjAsIFxyXG4gICdJb3RhJzo5MjEsIFxyXG4gICdLYXBwYSc6OTIyLCBcclxuICAnTGFtYmRhJzo5MjMsIFxyXG4gICdNdSc6OTI0LCBcclxuICAnTnUnOjkyNSwgXHJcbiAgJ1hpJzo5MjYsIFxyXG4gICdPbWljcm9uJzo5MjcsIFxyXG4gICdQaSc6OTI4LCBcclxuICAnUmhvJzo5MjksIFxyXG4gICdTaWdtYSc6OTMxLCBcclxuICAnVGF1Jzo5MzIsIFxyXG4gICdVcHNpbG9uJzo5MzMsIFxyXG4gICdQaGknOjkzNCwgXHJcbiAgJ0NoaSc6OTM1LCBcclxuICAnUHNpJzo5MzYsIFxyXG4gICdPbWVnYSc6OTM3LCBcclxuICAnYWxwaGEnOjk0NSwgXHJcbiAgJ2JldGEnOjk0NiwgXHJcbiAgJ2dhbW1hJzo5NDcsIFxyXG4gICdkZWx0YSc6OTQ4LCBcclxuICAnZXBzaWxvbic6OTQ5LCBcclxuICAnemV0YSc6OTUwLCBcclxuICAnZXRhJzo5NTEsIFxyXG4gICd0aGV0YSc6OTUyLCBcclxuICAnaW90YSc6OTUzLCBcclxuICAna2FwcGEnOjk1NCwgXHJcbiAgJ2xhbWJkYSc6OTU1LCBcclxuICAnbXUnOjk1NiwgXHJcbiAgJ251Jzo5NTcsIFxyXG4gICd4aSc6OTU4LCBcclxuICAnb21pY3Jvbic6OTU5LCBcclxuICAncGknOjk2MCwgXHJcbiAgJ3Jobyc6OTYxLCBcclxuICAnc2lnbWFmJzo5NjIsIFxyXG4gICdzaWdtYSc6OTYzLCBcclxuICAndGF1Jzo5NjQsIFxyXG4gICd1cHNpbG9uJzo5NjUsIFxyXG4gICdwaGknOjk2NiwgXHJcbiAgJ2NoaSc6OTY3LCBcclxuICAncHNpJzo5NjgsIFxyXG4gICdvbWVnYSc6OTY5LCBcclxuICAndGhldGFzeW0nOjk3NywgXHJcbiAgJ3Vwc2loJzo5NzgsIFxyXG4gICdwaXYnOjk4MiwgXHJcbiAgJ2J1bGwnOjgyMjYsIFxyXG4gICdoZWxsaXAnOjgyMzAsIFxyXG4gICdwcmltZSc6ODI0MiwgXHJcbiAgJ1ByaW1lJzo4MjQzLCBcclxuICAnb2xpbmUnOjgyNTQsIFxyXG4gICdmcmFzbCc6ODI2MCwgXHJcbiAgJ3dlaWVycCc6ODQ3MiwgXHJcbiAgJ2ltYWdlJzo4NDY1LCBcclxuICAncmVhbCc6ODQ3NiwgXHJcbiAgJ3RyYWRlJzo4NDgyLCBcclxuICAnYWxlZnN5bSc6ODUwMSwgXHJcbiAgJ2xhcnInOjg1OTIsIFxyXG4gICd1YXJyJzo4NTkzLCBcclxuICAncmFycic6ODU5NCwgXHJcbiAgJ2RhcnInOjg1OTUsIFxyXG4gICdoYXJyJzo4NTk2LCBcclxuICAnY3JhcnInOjg2MjksIFxyXG4gICdsQXJyJzo4NjU2LCBcclxuICAndUFycic6ODY1NywgXHJcbiAgJ3JBcnInOjg2NTgsIFxyXG4gICdkQXJyJzo4NjU5LCBcclxuICAnaEFycic6ODY2MCwgXHJcbiAgJ2ZvcmFsbCc6ODcwNCwgXHJcbiAgJ3BhcnQnOjg3MDYsIFxyXG4gICdleGlzdCc6ODcwNywgXHJcbiAgJ2VtcHR5Jzo4NzA5LCBcclxuICAnbmFibGEnOjg3MTEsIFxyXG4gICdpc2luJzo4NzEyLCBcclxuICAnbm90aW4nOjg3MTMsIFxyXG4gICduaSc6ODcxNSwgXHJcbiAgJ3Byb2QnOjg3MTksIFxyXG4gICdzdW0nOjg3MjEsIFxyXG4gICdtaW51cyc6ODcyMiwgXHJcbiAgJ2xvd2FzdCc6ODcyNywgXHJcbiAgJ3JhZGljJzo4NzMwLCBcclxuICAncHJvcCc6ODczMywgXHJcbiAgJ2luZmluJzo4NzM0LCBcclxuICAnYW5nJzo4NzM2LCBcclxuICAnYW5kJzo4NzQzLCBcclxuICAnb3InOjg3NDQsIFxyXG4gICdjYXAnOjg3NDUsIFxyXG4gICdjdXAnOjg3NDYsIFxyXG4gICdpbnQnOjg3NDcsIFxyXG4gICd0aGVyZTQnOjg3NTYsIFxyXG4gICdzaW0nOjg3NjQsIFxyXG4gICdjb25nJzo4NzczLCBcclxuICAnYXN5bXAnOjg3NzYsIFxyXG4gICduZSc6ODgwMCwgXHJcbiAgJ2VxdWl2Jzo4ODAxLCBcclxuICAnbGUnOjg4MDQsIFxyXG4gICdnZSc6ODgwNSwgXHJcbiAgJ3N1Yic6ODgzNCwgXHJcbiAgJ3N1cCc6ODgzNSwgXHJcbiAgJ25zdWInOjg4MzYsIFxyXG4gICdzdWJlJzo4ODM4LCBcclxuICAnc3VwZSc6ODgzOSwgXHJcbiAgJ29wbHVzJzo4ODUzLCBcclxuICAnb3RpbWVzJzo4ODU1LCBcclxuICAncGVycCc6ODg2OSwgXHJcbiAgJ3Nkb3QnOjg5MDEsIFxyXG4gICdsY2VpbCc6ODk2OCwgXHJcbiAgJ3JjZWlsJzo4OTY5LCBcclxuICAnbGZsb29yJzo4OTcwLCBcclxuICAncmZsb29yJzo4OTcxLCBcclxuICAnbGFuZyc6OTAwMSwgXHJcbiAgJ3JhbmcnOjkwMDIsIFxyXG4gICdsb3onOjk2NzQsIFxyXG4gICdzcGFkZXMnOjk4MjQsIFxyXG4gICdjbHVicyc6OTgyNywgXHJcbiAgJ2hlYXJ0cyc6OTgyOSwgXHJcbiAgJ2RpYW1zJzo5ODMwLCBcclxuICAnT0VsaWcnOjMzOCwgXHJcbiAgJ29lbGlnJzozMzksIFxyXG4gICdTY2Fyb24nOjM1MiwgXHJcbiAgJ3NjYXJvbic6MzUzLCBcclxuICAnWXVtbCc6Mzc2LCBcclxuICAnY2lyYyc6NzEwLCBcclxuICAndGlsZGUnOjczMiwgXHJcbiAgJ2Vuc3AnOjgxOTQsIFxyXG4gICdlbXNwJzo4MTk1LCBcclxuICAndGhpbnNwJzo4MjAxLCBcclxuICAnenduaic6ODIwNCwgXHJcbiAgJ3p3aic6ODIwNSwgXHJcbiAgJ2xybSc6ODIwNiwgXHJcbiAgJ3JsbSc6ODIwNywgXHJcbiAgJ25kYXNoJzo4MjExLCBcclxuICAnbWRhc2gnOjgyMTIsIFxyXG4gICdsc3F1byc6ODIxNiwgXHJcbiAgJ3JzcXVvJzo4MjE3LCBcclxuICAnc2JxdW8nOjgyMTgsIFxyXG4gICdsZHF1byc6ODIyMCwgXHJcbiAgJ3JkcXVvJzo4MjIxLCBcclxuICAnYmRxdW8nOjgyMjIsIFxyXG4gICdkYWdnZXInOjgyMjQsIFxyXG4gICdEYWdnZXInOjgyMjUsIFxyXG4gICdwZXJtaWwnOjgyNDAsIFxyXG4gICdsc2FxdW8nOjgyNDksIFxyXG4gICdyc2FxdW8nOjgyNTAsIFxyXG4gICdldXJvJzo4MzY0XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgID0gZW50aXRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUGFyc2VyL2hlbHBlci9lbnRpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZWxlbWVudDogZnVuY3Rpb24obmFtZSwgYXR0cnMsIGNoaWxkcmVuKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdlbGVtZW50JyxcclxuICAgICAgdGFnOiBuYW1lLFxyXG4gICAgICBhdHRyczogYXR0cnMsXHJcbiAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYXR0cmlidXRlOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgbWRmKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIG1kZjogbWRmXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImlmXCI6IGZ1bmN0aW9uKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnaWYnLFxyXG4gICAgICB0ZXN0OiB0ZXN0LFxyXG4gICAgICBjb25zZXF1ZW50OiBjb25zZXF1ZW50LFxyXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbGlzdDogZnVuY3Rpb24oc2VxdWVuY2UsIHZhcmlhYmxlLCBib2R5LCBhbHRlcm5hdGUsIHRyYWNrKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdsaXN0JyxcclxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlLFxyXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZSxcclxuICAgICAgdmFyaWFibGU6IHZhcmlhYmxlLFxyXG4gICAgICBib2R5OiBib2R5LFxyXG4gICAgICB0cmFjazogdHJhY2tcclxuICAgIH1cclxuICB9LFxyXG4gIGV4cHJlc3Npb246IGZ1bmN0aW9uKCBib2R5LCBzZXRib2R5LCBjb25zdGFudCwgZmlsdGVycyApe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJleHByZXNzaW9uXCIsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIGNvbnN0YW50OiBjb25zdGFudCB8fCBmYWxzZSxcclxuICAgICAgc2V0Ym9keTogc2V0Ym9keSB8fCBmYWxzZSxcclxuICAgICAgZmlsdGVyczogZmlsdGVyc1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgdGV4dDogdGV4dFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICd0ZW1wbGF0ZScsXHJcbiAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlXHJcbiAgICB9XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUGFyc2VyL3NyYy9ub2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxuXHJcbi8vIHNvbWUgY3VzdG9tIHRhZyAgd2lsbCBjb25mbGljdCB3aXRoIHRoZSBMZXhlciBwcm9ncmVzc1xyXG52YXIgY29uZmxpY3RUYWcgPSB7XCJ9XCI6IFwie1wiLCBcIl1cIjogXCJbXCJ9LCBtYXAxLCBtYXAyO1xyXG4vLyBzb21lIG1hY3JvIGZvciBsZXhlclxyXG52YXIgbWFjcm8gPSB7XHJcbiAgJ05BTUUnOiAvKD86WzpfQS1aYS16XVstXFwuOl8wLTlBLVphLXpdKikvLFxyXG4gICdJREVOVCc6IC9bXFwkX0EtWmEtel1bXzAtOUEtWmEtelxcJF0qLyxcclxuICAnU1BBQ0UnOiAvW1xcclxcblxcdFxcZiBdL1xyXG59XHJcblxyXG5cclxudmFyIHRlc3QgPSAvYXwoYikvLmV4ZWMoXCJhXCIpO1xyXG52YXIgdGVzdFN1YkNhcHVyZSA9IHRlc3QgJiYgdGVzdFsxXSA9PT0gdW5kZWZpbmVkPyBcclxuICBmdW5jdGlvbihzdHIpeyByZXR1cm4gc3RyICE9PSB1bmRlZmluZWQgfVxyXG4gIDpmdW5jdGlvbihzdHIpe3JldHVybiAhIXN0cn07XHJcblxyXG5mdW5jdGlvbiB3cmFwSGFuZGVyKGhhbmRsZXIpe1xyXG4gIHJldHVybiBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiBoYW5kbGVyLCB2YWx1ZTogYWxsIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExleGVyKGlucHV0LCBvcHRzKXtcclxuICBpZihjb25mbGljdFRhZ1tjb25maWcuRU5EXSl7XHJcbiAgICB0aGlzLm1hcmtTdGFydCA9IGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdO1xyXG4gICAgdGhpcy5tYXJrRW5kID0gY29uZmlnLkVORDtcclxuICB9XHJcblxyXG4gIHRoaXMuaW5wdXQgPSAoaW5wdXR8fFwiXCIpLnRyaW0oKTtcclxuICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gIHRoaXMubWFwID0gdGhpcy5vcHRzLm1vZGUgIT09IDI/ICBtYXAxOiBtYXAyO1xyXG4gIHRoaXMuc3RhdGVzID0gW1wiSU5JVFwiXTtcclxuICBpZihvcHRzICYmIG9wdHMuZXhwcmVzc2lvbil7XHJcbiAgICAgdGhpcy5zdGF0ZXMucHVzaChcIkpTVFwiKTtcclxuICAgICB0aGlzLmV4cHJlc3Npb24gPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGxvID0gTGV4ZXIucHJvdG90eXBlXHJcblxyXG5cclxubG8ubGV4ID0gZnVuY3Rpb24oc3RyKXtcclxuICBzdHIgPSAoc3RyIHx8IHRoaXMuaW5wdXQpLnRyaW0oKTtcclxuICB2YXIgdG9rZW5zID0gW10sIHNwbGl0LCB0ZXN0LG1sZW4sIHRva2VuLCBzdGF0ZTtcclxuICB0aGlzLmlucHV0ID0gc3RyLCBcclxuICB0aGlzLm1hcmtzID0gMDtcclxuICAvLyBpbml0IHRoZSBwb3MgaW5kZXhcclxuICB0aGlzLmluZGV4PTA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlKHN0cil7XHJcbiAgICBpKytcclxuICAgIHN0YXRlID0gdGhpcy5zdGF0ZSgpO1xyXG4gICAgc3BsaXQgPSB0aGlzLm1hcFtzdGF0ZV0gXHJcbiAgICB0ZXN0ID0gc3BsaXQuVFJVTksuZXhlYyhzdHIpO1xyXG4gICAgaWYoIXRlc3Qpe1xyXG4gICAgICB0aGlzLmVycm9yKCdVbnJlY29naW5pemVkIFRva2VuJyk7XHJcbiAgICB9XHJcbiAgICBtbGVuID0gdGVzdFswXS5sZW5ndGg7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UobWxlbilcclxuICAgIHRva2VuID0gdGhpcy5fcHJvY2Vzcy5jYWxsKHRoaXMsIHRlc3QsIHNwbGl0LCBzdHIpXHJcbiAgICBpZih0b2tlbikgdG9rZW5zLnB1c2godG9rZW4pXHJcbiAgICB0aGlzLmluZGV4ICs9IG1sZW47XHJcbiAgICAvLyBpZihzdGF0ZSA9PSAnVEFHJyB8fCBzdGF0ZSA9PSAnSlNUJykgc3RyID0gdGhpcy5za2lwc3BhY2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIHRva2Vucy5wdXNoKHt0eXBlOiAnRU9GJ30pO1xyXG5cclxuICByZXR1cm4gdG9rZW5zO1xyXG59XHJcblxyXG5sby5lcnJvciA9IGZ1bmN0aW9uKG1zZyl7XHJcbiAgdGhyb3cgIEVycm9yKFwiUGFyc2UgRXJyb3I6IFwiICsgbXNnICsgICc6XFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0aGlzLmluZGV4KSk7XHJcbn1cclxuXHJcbmxvLl9wcm9jZXNzID0gZnVuY3Rpb24oYXJncywgc3BsaXQsc3RyKXtcclxuICAvLyBjb25zb2xlLmxvZyhhcmdzLmpvaW4oXCIsXCIpLCB0aGlzLnN0YXRlKCkpXHJcbiAgdmFyIGxpbmtzID0gc3BsaXQubGlua3MsIG1hcmNoZWQgPSBmYWxzZSwgdG9rZW47XHJcblxyXG4gIGZvcih2YXIgbGVuID0gbGlua3MubGVuZ3RoLCBpPTA7aTxsZW4gO2krKyl7XHJcbiAgICB2YXIgbGluayA9IGxpbmtzW2ldLFxyXG4gICAgICBoYW5kbGVyID0gbGlua1syXSxcclxuICAgICAgaW5kZXggPSBsaW5rWzBdO1xyXG4gICAgLy8gaWYoYXJnc1s2XSA9PT0gJz4nICYmIGluZGV4ID09PSA2KSBjb25zb2xlLmxvZygnaGFoYScpXHJcbiAgICBpZih0ZXN0U3ViQ2FwdXJlKGFyZ3NbaW5kZXhdKSkge1xyXG4gICAgICBtYXJjaGVkID0gdHJ1ZTtcclxuICAgICAgaWYoaGFuZGxlcil7XHJcbiAgICAgICAgdG9rZW4gPSBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3Muc2xpY2UoaW5kZXgsIGluZGV4ICsgbGlua1sxXSkpXHJcbiAgICAgICAgaWYodG9rZW4pICB0b2tlbi5wb3MgPSB0aGlzLmluZGV4O1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZighbWFyY2hlZCl7IC8vIGluIGllIGx0OCAuIHN1YiBjYXB0dXJlIGlzIFwiXCIgYnV0IG9udCBcclxuICAgIHN3aXRjaChzdHIuY2hhckF0KDApKXtcclxuICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICB0aGlzLmVudGVyKFwiVEFHXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJKU1RcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbjtcclxufVxyXG5sby5lbnRlciA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKVxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5sby5zdGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIHJldHVybiBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXTtcclxufVxyXG5cclxubG8ubGVhdmUgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIGlmKCFzdGF0ZSB8fCBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXSA9PT0gc3RhdGUpIHN0YXRlcy5wb3AoKVxyXG59XHJcblxyXG5cclxuTGV4ZXIuc2V0dXAgPSBmdW5jdGlvbigpe1xyXG4gIG1hY3JvLkVORCA9IGNvbmZpZy5FTkQ7XHJcbiAgbWFjcm8uQkVHSU4gPSBjb25maWcuQkVHSU47XHJcbiAgLy9cclxuICBtYXAxID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVRcclxuICAgIHJ1bGVzLkVOVEVSX0pTVCxcclxuICAgIHJ1bGVzLkVOVEVSX1RBRyxcclxuICAgIHJ1bGVzLlRFWFQsXHJcblxyXG4gICAgLy9UQUdcclxuICAgIHJ1bGVzLlRBR19OQU1FLFxyXG4gICAgcnVsZXMuVEFHX09QRU4sXHJcbiAgICBydWxlcy5UQUdfQ0xPU0UsXHJcbiAgICBydWxlcy5UQUdfUFVOQ0hPUixcclxuICAgIHJ1bGVzLlRBR19FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5UQUdfVU5RX1ZBTFVFLFxyXG4gICAgcnVsZXMuVEFHX1NUUklORyxcclxuICAgIHJ1bGVzLlRBR19TUEFDRSxcclxuICAgIHJ1bGVzLlRBR19DT01NRU5ULFxyXG5cclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcblxyXG4gIC8vIGlnbm9yZWQgdGhlIHRhZy1yZWxhdGl2ZSB0b2tlblxyXG4gIG1hcDIgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVCBubyA8IHJlc3RyaWN0XHJcbiAgICBydWxlcy5FTlRFUl9KU1QyLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZW5NYXAocnVsZXMpe1xyXG4gIHZhciBydWxlLCBtYXAgPSB7fSwgc2lnbjtcclxuICBmb3IodmFyIGkgPSAwLCBsZW4gPSBydWxlcy5sZW5ndGg7IGkgPCBsZW4gOyBpKyspe1xyXG4gICAgcnVsZSA9IHJ1bGVzW2ldO1xyXG4gICAgc2lnbiA9IHJ1bGVbMl0gfHwgJ0lOSVQnO1xyXG4gICAgKCBtYXBbc2lnbl0gfHwgKG1hcFtzaWduXSA9IHtydWxlczpbXSwgbGlua3M6W119KSApLnJ1bGVzLnB1c2gocnVsZSk7XHJcbiAgfVxyXG4gIHJldHVybiBzZXR1cChtYXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cChtYXApe1xyXG4gIHZhciBzcGxpdCwgcnVsZXMsIHRydW5rcywgaGFuZGxlciwgcmVnLCByZXRhaW4sIHJ1bGU7XHJcbiAgZnVuY3Rpb24gcmVwbGFjZUZuKGFsbCwgb25lKXtcclxuICAgIHJldHVybiB0eXBlb2YgbWFjcm9bb25lXSA9PT0gJ3N0cmluZyc/IFxyXG4gICAgICBfLmVzY2FwZVJlZ0V4cChtYWNyb1tvbmVdKSBcclxuICAgICAgOiBTdHJpbmcobWFjcm9bb25lXSkuc2xpY2UoMSwtMSk7XHJcbiAgfVxyXG5cclxuICBmb3IodmFyIGkgaW4gbWFwKXtcclxuXHJcbiAgICBzcGxpdCA9IG1hcFtpXTtcclxuICAgIHNwbGl0LmN1ckluZGV4ID0gMTtcclxuICAgIHJ1bGVzID0gc3BsaXQucnVsZXM7XHJcbiAgICB0cnVua3MgPSBbXTtcclxuXHJcbiAgICBmb3IodmFyIGogPSAwLGxlbiA9IHJ1bGVzLmxlbmd0aDsgajxsZW47IGorKyl7XHJcbiAgICAgIHJ1bGUgPSBydWxlc1tqXTsgXHJcbiAgICAgIHJlZyA9IHJ1bGVbMF07XHJcbiAgICAgIGhhbmRsZXIgPSBydWxlWzFdO1xyXG5cclxuICAgICAgaWYodHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICBoYW5kbGVyID0gd3JhcEhhbmRlcihoYW5kbGVyKTtcclxuICAgICAgfVxyXG4gICAgICBpZihfLnR5cGVPZihyZWcpID09PSAncmVnZXhwJykgcmVnID0gcmVnLnRvU3RyaW5nKCkuc2xpY2UoMSwgLTEpO1xyXG5cclxuICAgICAgcmVnID0gcmVnLnJlcGxhY2UoL1xceyhcXHcrKVxcfS9nLCByZXBsYWNlRm4pXHJcbiAgICAgIHJldGFpbiA9IF8uZmluZFN1YkNhcHR1cmUocmVnKSArIDE7IFxyXG4gICAgICBzcGxpdC5saW5rcy5wdXNoKFtzcGxpdC5jdXJJbmRleCwgcmV0YWluLCBoYW5kbGVyXSk7IFxyXG4gICAgICBzcGxpdC5jdXJJbmRleCArPSByZXRhaW47XHJcbiAgICAgIHRydW5rcy5wdXNoKHJlZyk7XHJcbiAgICB9XHJcbiAgICBzcGxpdC5UUlVOSyA9IG5ldyBSZWdFeHAoXCJeKD86KFwiICsgdHJ1bmtzLmpvaW4oXCIpfChcIikgKyBcIikpXCIpXHJcbiAgfVxyXG4gIHJldHVybiBtYXA7XHJcbn1cclxuXHJcbnZhciBydWxlcyA9IHtcclxuXHJcbiAgLy8gMS4gSU5JVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvLyBtb2RlMSdzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUOiBbL1teXFx4MDA8XSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUMjogWy9bXlxceDAwXSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBFTlRFUl9UQUc6IFsvW15cXHgwMF0qPyg/PTxbXFx3XFwvXFwhXSkvLCBmdW5jdGlvbihhbGwpeyBcclxuICAgIHRoaXMuZW50ZXIoJ1RBRycpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgVEVYVDogWy9bXlxceDAwXSsvLCAnVEVYVCcgXSxcclxuXHJcbiAgLy8gMi4gVEFHXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUQUdfTkFNRTogWy97TkFNRX0vLCAnTkFNRScsICdUQUcnXSxcclxuICBUQUdfVU5RX1ZBTFVFOiBbL1teXFx7fSZcIic9PjxgXFxyXFxuXFxmXFx0IF0rLywgJ1VOUScsICdUQUcnXSxcclxuXHJcbiAgVEFHX09QRU46IFsvPCh7TkFNRX0pXFxzKi8sIGZ1bmN0aW9uKGFsbCwgb25lKXsgLy9cIlxyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX09QRU4nLCB2YWx1ZTogb25lfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfQ0xPU0U6IFsvPFxcLyh7TkFNRX0pW1xcclxcblxcZlxcdCBdKj4vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfQ0xPU0UnLCB2YWx1ZTogb25lIH1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gICAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIFRBR19FTlRFUl9KU1Q6IFsvKD89e0JFR0lOfSkvLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuXHJcbiAgVEFHX1BVTkNIT1I6IFsvW1xcPlxcLz0mXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZihhbGwgPT09ICc+JykgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcXFwiLywgLyonKi8gIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyBcclxuICAgIHZhciB2YWx1ZSA9IG9uZSB8fCB0d28gfHwgXCJcIjtcclxuXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogdmFsdWV9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICBUQUdfU1BBQ0U6IFsve1NQQUNFfSsvLCBudWxsLCAnVEFHJ10sXHJcbiAgVEFHX0NPTU1FTlQ6IFsvPFxcIS0tKFteXFx4MDBdKj8pLS1cXD4vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5sZWF2ZSgpXHJcbiAgICAvLyB0aGlzLmxlYXZlKCdUQUcnKVxyXG4gIH0gLCdUQUcnXSxcclxuXHJcbiAgLy8gMy4gSlNUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBKU1RfT1BFTjogWyd7QkVHSU59I3tTUEFDRX0qKHtJREVOVH0pJywgZnVuY3Rpb24oYWxsLCBuYW1lKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdPUEVOJyxcclxuICAgICAgdmFsdWU6IG5hbWVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0xFQVZFOiBbL3tFTkR9LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKHRoaXMubWFya0VuZCA9PT0gYWxsICYmIHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9O1xyXG4gICAgaWYoIXRoaXMubWFya0VuZCB8fCAhdGhpcy5tYXJrcyApe1xyXG4gICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiAnRU5EJ31cclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLm1hcmtzLS07XHJcbiAgICAgIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ0xPU0U6IFsve0JFR0lOfVxccypcXC8oe0lERU5UfSlcXHMqe0VORH0vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdDTE9TRScsXHJcbiAgICAgIHZhbHVlOiBvbmVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NPTU1FTlQ6IFsve0JFR0lOfVxcIShbXlxceDAwXSo/KVxcIXtFTkR9LywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0VYUFJfT1BFTjogWyd7QkVHSU59JyxmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICBpZihhbGwgPT09IHRoaXMubWFya1N0YXJ0KXtcclxuICAgICAgaWYodGhpcy5leHByZXNzaW9uKSByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIGlmKHRoaXMuZmlyc3RFbnRlclN0YXJ0IHx8IHRoaXMubWFya3Mpe1xyXG4gICAgICAgIHRoaXMubWFya3MrK1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdFWFBSX09QRU4nLFxyXG4gICAgICBlc2NhcGU6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfSURFTlQ6IFsne0lERU5UfScsICdJREVOVCcsICdKU1QnXSxcclxuICBKU1RfU1BBQ0U6IFsvWyBcXHJcXG5cXGZdKy8sIG51bGwsICdKU1QnXSxcclxuICBKU1RfUFVOQ0hPUjogWy9bPSFdPz09fFstPT48KypcXC8lXFwhXT9cXD18XFx8XFx8fCYmfFxcQFxcKHxcXC5cXC58WzxcXD5cXFtcXF1cXChcXClcXC1cXHxcXHt9XFwrXFwqXFwvJT86XFwuISxdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7IHR5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwnSlNUJ10sXHJcblxyXG4gIEpTVF9TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVwiLywgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IC8vXCInXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogb25lIHx8IHR3byB8fCBcIlwifVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTlVNQkVSOiBbLyg/OlswLTldKlxcLlswLTldK3xbMC05XSspKGVcXGQrKT8vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnTlVNQkVSJywgdmFsdWU6IHBhcnNlRmxvYXQoYWxsLCAxMCl9O1xyXG4gIH0sICdKU1QnXVxyXG59XHJcblxyXG5cclxuLy8gc2V0dXAgd2hlbiBmaXJzdCBjb25maWdcclxuTGV4ZXIuc2V0dXAoKTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXhlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9QYXJzZXIvc3JjL0xleGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9