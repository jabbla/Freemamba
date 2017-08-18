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

/* WEBPACK VAR INJECTION */(function(module) {var Freelist = __webpack_require__(7);

(function(){
    if(NEJ && NEJ.define){
        NEJ.define([], function(){
            return Freelist;
        });
        return;
    }
    if(window.define){
        window.define([], function(){
            return Freelist;
        });
    }

    if(document && document.nodeType){
        window.Freelist = Freelist;
    }

    if(module && module.exports){
        module.exports = Freelist;
    }

})()



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)(module)))

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

/***/ }),
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTkwMDM4NDc3OTcwZTAzYjc2N2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9GcmVlbGlzdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGFyc2VyL3NyYy9QYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL190aW1lcnMtYnJvd3NlcmlmeUAyLjAuNEB0aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fc2V0aW1tZWRpYXRlQDEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL19wcm9jZXNzQDAuMTEuMTBAcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9QYXJzZXIvaGVscGVyL3NoaW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9oZWxwZXIvZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGFyc2VyL3NyYy9MZXhlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsTUFBTSxVQUFVLFdBQVcsTUFBTSxPQUFPLGFBQWE7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsVUFBVTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0U7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YscUVBQXFFLEtBQUs7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELE9BQU87QUFDUCxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDekxEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7QUN2THRDO0FBQ0E7QUFDQSxjQUFjOztBQUVkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsU0FBUztBQUNwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7OztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLDJCOzs7Ozs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxH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Z0JBQWdCLElBQUk7QUFDcEIsd0RBQXdEO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0w7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxHQUFHO0FBQ0gsZ0JBQWdCLE1BQU0sT0FBTyxNQUFNLEtBQUssSUFBSTtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGtCQUFrQixNQUFNLGdCQUFnQixJQUFJO0FBQzVDO0FBQ0EsR0FBRztBQUNILG9CQUFvQixNQUFNO0FBQzFCO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQixPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsR0FBRztBQUNILGdCQUFnQixNQUFNO0FBQ3RCO0FBQ0EsK0VBQStFO0FBQy9FLFlBQVk7QUFDWixHQUFHOztBQUVILGdFQUFnRTtBQUNoRSxZQUFZO0FBQ1osR0FBRztBQUNIO0FBQ0EsWUFBWTtBQUNaLEdBQUc7QUFDSDs7O0FBR0E7QUFDQTs7OztBQUlBLHVCOzs7Ozs7Ozs7Ozs7QUM5VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkZyZWVsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTkwMDM4NDc3OTcwZTAzYjc2N2QiLCJyZXF1aXJlKCcuL2hlbHBlci9zaGltLmpzJykoKTtcclxuXHJcblxyXG5cclxudmFyIF8gID0gbW9kdWxlLmV4cG9ydHM7XHJcbnZhciBlbnRpdGllcyA9IHJlcXVpcmUoJy4vaGVscGVyL2VudGl0aWVzLmpzJyk7XHJcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xyXG52YXIgbzJzdHIgPSAoe30pLnRvU3RyaW5nO1xyXG52YXIgd2luID0gdHlwZW9mIHdpbmRvdyAhPT0ndW5kZWZpbmVkJz8gd2luZG93OiBnbG9iYWw7XHJcbnZhciBNQVhfUFJJT1JJVFkgPSA5OTk5O1xyXG5cclxuXHJcbl8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcclxuXy51aWQgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgX3VpZD0wO1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIF91aWQrKztcclxuICB9XHJcbn0pKCk7XHJcblxyXG5fLmV4dGVuZCA9IGZ1bmN0aW9uKCBvMSwgbzIsIG92ZXJyaWRlICl7XHJcbiAgZm9yKHZhciBpIGluIG8yKSBpZiAobzIuaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgaWYoIG8xW2ldID09PSB1bmRlZmluZWQgfHwgb3ZlcnJpZGUgPT09IHRydWUgKXtcclxuICAgICAgbzFbaV0gPSBvMltpXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbzE7XHJcbn1cclxuXHJcbl8ua2V5cyA9IE9iamVjdC5rZXlzPyBPYmplY3Qua2V5czogZnVuY3Rpb24ob2JqKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yKHZhciBpIGluIG9iaikgaWYob2JqLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgIHJlcy5wdXNoKGkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5fLnNvbWUgPSBmdW5jdGlvbihsaXN0LCBmbil7XHJcbiAgZm9yKHZhciBpID0wLGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgaWYoZm4obGlzdFtpXSkpIHJldHVybiB0cnVlXHJcbiAgfVxyXG59XHJcblxyXG5fLnZhck5hbWUgPSAnZCc7XHJcbl8uc2V0TmFtZSA9ICdwXyc7XHJcbl8uY3R4TmFtZSA9ICdjJztcclxuXy5leHROYW1lID0gJ2UnO1xyXG5cclxuXy5yV29yZCA9IC9eW1xcJFxcd10rJC87XHJcbl8uclNpbXBsZUFjY2Vzc29yID0gL15bXFwkXFx3XSsoXFwuW1xcJFxcd10rKSokLztcclxuXHJcbl8ubmV4dFRpY2sgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nPyBcclxuICBzZXRJbW1lZGlhdGUuYmluZCh3aW4pIDogXHJcbiAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApIFxyXG4gIH1cclxuXHJcblxyXG5cclxuXy5wcmVmaXggPSBcIid1c2Ugc3RyaWN0Jzt2YXIgXCIgKyBfLnZhck5hbWUgKyBcIj1cIiArIF8uY3R4TmFtZSArIFwiLmRhdGE7XCIgKyAgXy5leHROYW1lICArIFwiPVwiICsgXy5leHROYW1lICsgXCJ8fCcnO1wiO1xyXG5cclxuXHJcbl8uc2xpY2UgPSBmdW5jdGlvbihvYmosIHN0YXJ0LCBlbmQpe1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IodmFyIGkgPSBzdGFydCB8fCAwLCBsZW4gPSBlbmQgfHwgb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgIHJlcy5wdXNoKG9ialtpXSlcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLy8gYmVhY3VzZSBzbGljZSBhbmQgdG9Mb3dlckNhc2UgaXMgZXhwZW5zaXZlLiB3ZSBoYW5kbGUgdW5kZWZpbmVkIGFuZCBudWxsIGluIGFub3RoZXIgd2F5XHJcbl8udHlwZU9mID0gZnVuY3Rpb24gKG8pIHtcclxuICByZXR1cm4gbyA9PSBudWxsID8gU3RyaW5nKG8pIDpvMnN0ci5jYWxsKG8pLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5fLm1ha2VQcmVkaWNhdGUgPSBmdW5jdGlvbiBtYWtlUHJlZGljYXRlKHdvcmRzLCBwcmVmaXgpIHtcclxuICAgIGlmICh0eXBlb2Ygd29yZHMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICB3b3JkcyA9IHdvcmRzLnNwbGl0KFwiIFwiKTtcclxuICAgIH1cclxuICAgIHZhciBmID0gXCJcIixcclxuICAgIGNhdHMgPSBbXTtcclxuICAgIG91dDogZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2F0cy5sZW5ndGg7ICsrail7XHJcbiAgICAgICAgICBpZiAoY2F0c1tqXVswXS5sZW5ndGggPT09IHdvcmRzW2ldLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGNhdHNbal0ucHVzaCh3b3Jkc1tpXSk7XHJcbiAgICAgICAgICAgICAgY29udGludWUgb3V0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRzLnB1c2goW3dvcmRzW2ldXSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjb21wYXJlVG8oYXJyKSB7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDEpIHJldHVybiBmICs9IFwicmV0dXJuIHN0ciA9PT0gJ1wiICsgYXJyWzBdICsgXCInO1wiO1xyXG4gICAgICAgIGYgKz0gXCJzd2l0Y2goc3RyKXtcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSl7XHJcbiAgICAgICAgICAgZiArPSBcImNhc2UgJ1wiICsgYXJyW2ldICsgXCInOlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmICs9IFwicmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlO1wiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFdoZW4gdGhlcmUgYXJlIG1vcmUgdGhhbiB0aHJlZSBsZW5ndGggY2F0ZWdvcmllcywgYW4gb3V0ZXJcclxuICAgIC8vIHN3aXRjaCBmaXJzdCBkaXNwYXRjaGVzIG9uIHRoZSBsZW5ndGhzLCB0byBzYXZlIG9uIGNvbXBhcmlzb25zLlxyXG4gICAgaWYgKGNhdHMubGVuZ3RoID4gMykge1xyXG4gICAgICAgIGNhdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGYgKz0gXCJzd2l0Y2goc3RyLmxlbmd0aCl7XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXQgPSBjYXRzW2ldO1xyXG4gICAgICAgICAgICBmICs9IFwiY2FzZSBcIiArIGNhdFswXS5sZW5ndGggKyBcIjpcIjtcclxuICAgICAgICAgICAgY29tcGFyZVRvKGNhdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgKz0gXCJ9XCI7XHJcblxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2ltcGx5IGdlbmVyYXRlIGEgZmxhdCBgc3dpdGNoYCBzdGF0ZW1lbnQuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbXBhcmVUbyh3b3Jkcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwic3RyXCIsIGYpO1xyXG59XHJcblxyXG5cclxuXy50cmFja0Vycm9yUG9zID0gKGZ1bmN0aW9uICgpe1xyXG4gIC8vIGxpbmVicmVha1xyXG4gIHZhciBsYiA9IC9cXHJcXG58W1xcblxcclxcdTIwMjhcXHUyMDI5XS9nO1xyXG4gIHZhciBtaW5SYW5nZSA9IDIwLCBtYXhSYW5nZSA9IDIwO1xyXG4gIGZ1bmN0aW9uIGZpbmRMaW5lKGxpbmVzLCBwb3Mpe1xyXG4gICAgdmFyIHRtcExlbiA9IDA7XHJcbiAgICBmb3IodmFyIGkgPSAwLGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgICAgdmFyIGxpbmVMZW4gPSAobGluZXNbaV0gfHwgXCJcIikubGVuZ3RoO1xyXG5cclxuICAgICAgaWYodG1wTGVuICsgbGluZUxlbiA+IHBvcykge1xyXG4gICAgICAgIHJldHVybiB7bnVtOiBpLCBsaW5lOiBsaW5lc1tpXSwgc3RhcnQ6IHBvcyAtIGkgLSB0bXBMZW4gLCBwcmV2OmxpbmVzW2ktMV0sIG5leHQ6IGxpbmVzW2krMV0gfTtcclxuICAgICAgfVxyXG4gICAgICAvLyAxIGlzIGZvciB0aGUgbGluZWJyZWFrXHJcbiAgICAgIHRtcExlbiA9IHRtcExlbiArIGxpbmVMZW4gO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBmb3JtYXRMaW5lKHN0ciwgIHN0YXJ0LCBudW0sIHRhcmdldCl7XHJcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgIHZhciBtaW4gPSBzdGFydCAtIG1pblJhbmdlO1xyXG4gICAgaWYobWluIDwgMCkgbWluID0gMDtcclxuICAgIHZhciBtYXggPSBzdGFydCArIG1heFJhbmdlO1xyXG4gICAgaWYobWF4ID4gbGVuKSBtYXggPSBsZW47XHJcblxyXG4gICAgdmFyIHJlbWFpbiA9IHN0ci5zbGljZShtaW4sIG1heCk7XHJcbiAgICB2YXIgcHJlZml4ID0gXCJbXCIgKyhudW0rMSkgKyBcIl0gXCIgKyAobWluID4gMD8gXCIuLlwiIDogXCJcIilcclxuICAgIHZhciBwb3N0Zml4ID0gbWF4IDwgbGVuID8gXCIuLlwiOiBcIlwiO1xyXG4gICAgdmFyIHJlcyA9IHByZWZpeCArIHJlbWFpbiArIHBvc3RmaXg7XHJcbiAgICBpZih0YXJnZXQpIHJlcyArPSBcIlxcblwiICsgbmV3IEFycmF5KHN0YXJ0LW1pbiArIHByZWZpeC5sZW5ndGggKyAxKS5qb2luKFwiIFwiKSArIFwiXl5eXCI7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH1cclxuICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIHBvcyl7XHJcbiAgICBpZihwb3MgPiBpbnB1dC5sZW5ndGgtMSkgcG9zID0gaW5wdXQubGVuZ3RoLTE7XHJcbiAgICBsYi5sYXN0SW5kZXggPSAwO1xyXG4gICAgdmFyIGxpbmVzID0gaW5wdXQuc3BsaXQobGIpO1xyXG4gICAgdmFyIGxpbmUgPSBmaW5kTGluZShsaW5lcyxwb3MpO1xyXG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydCwgbnVtID0gbGluZS5udW07XHJcblxyXG4gICAgcmV0dXJuIChsaW5lLnByZXY/IGZvcm1hdExpbmUobGluZS5wcmV2LCBzdGFydCwgbnVtLTEgKSArICdcXG4nOiAnJyApICsgXHJcbiAgICAgIGZvcm1hdExpbmUobGluZS5saW5lLCBzdGFydCwgbnVtLCB0cnVlKSArICdcXG4nICsgXHJcbiAgICAgIChsaW5lLm5leHQ/IGZvcm1hdExpbmUobGluZS5uZXh0LCBzdGFydCwgbnVtKzEgKSArICdcXG4nOiAnJyApO1xyXG5cclxuICB9XHJcbn0pKCk7XHJcblxyXG5cclxudmFyIGlnbm9yZWRSZWYgPSAvXFwoKFxcP1xcIXxcXD9cXDp8XFw/XFw9KS9nO1xyXG5fLmZpbmRTdWJDYXB0dXJlID0gZnVuY3Rpb24gKHJlZ1N0cikge1xyXG4gIHZhciBsZWZ0ID0gMCxcclxuICAgIHJpZ2h0ID0gMCxcclxuICAgIGxlbiA9IHJlZ1N0ci5sZW5ndGgsXHJcbiAgICBpZ25vcmVkID0gcmVnU3RyLm1hdGNoKGlnbm9yZWRSZWYpOyAvLyBpZ25vcmVkIHVuY2FwdHVyZVxyXG4gIGlmKGlnbm9yZWQpIGlnbm9yZWQgPSBpZ25vcmVkLmxlbmd0aFxyXG4gIGVsc2UgaWdub3JlZCA9IDA7XHJcbiAgZm9yICg7IGxlbi0tOykge1xyXG4gICAgdmFyIGxldHRlciA9IHJlZ1N0ci5jaGFyQXQobGVuKTtcclxuICAgIGlmIChsZW4gPT09IDAgfHwgcmVnU3RyLmNoYXJBdChsZW4gLSAxKSAhPT0gXCJcXFxcXCIgKSB7IFxyXG4gICAgICBpZiAobGV0dGVyID09PSBcIihcIikgbGVmdCsrO1xyXG4gICAgICBpZiAobGV0dGVyID09PSBcIilcIikgcmlnaHQrKztcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGxlZnQgIT09IHJpZ2h0KSB0aHJvdyBcIlJlZ0V4cDogXCIrIHJlZ1N0ciArIFwiJ3MgYnJhY2tldCBpcyBub3QgbWFyY2hlZFwiO1xyXG4gIGVsc2UgcmV0dXJuIGxlZnQgLSBpZ25vcmVkO1xyXG59O1xyXG5cclxuXHJcbl8uZXNjYXBlUmVnRXhwID0gZnVuY3Rpb24oIHN0cil7Ly8gQ3JlZGl0OiBYUmVnRXhwIDAuNi4xIChjKSAyMDA3LTIwMDggU3RldmVuIExldml0aGFuIDxodHRwOi8vc3RldmVubGV2aXRoYW4uY29tL3JlZ2V4L3hyZWdleHAvPiBNSVQgTGljZW5zZVxyXG4gIHJldHVybiBzdHIucmVwbGFjZSgvWy1bXFxde30oKSorPy5cXFxcXiR8LCNcXHNdL2csIGZ1bmN0aW9uKG1hdGNoKXtcclxuICAgIHJldHVybiAnXFxcXCcgKyBtYXRjaDtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG52YXIgckVudGl0eSA9IG5ldyBSZWdFeHAoXCImKD86KCN4WzAtOWEtZkEtRl0rKXwoI1swLTldKyl8KFwiICsgXy5rZXlzKGVudGl0aWVzKS5qb2luKCd8JykgKyAnKSk7JywgJ2dpJyk7XHJcblxyXG5fLmNvbnZlcnRFbnRpdHkgPSBmdW5jdGlvbihjaHIpe1xyXG5cclxuICByZXR1cm4gKFwiXCIgKyBjaHIpLnJlcGxhY2UockVudGl0eSwgZnVuY3Rpb24oYWxsLCBoZXgsIGRlYywgY2FwdHVyZSl7XHJcbiAgICB2YXIgY2hhckNvZGU7XHJcbiAgICBpZiggZGVjICkgY2hhckNvZGUgPSBwYXJzZUludCggZGVjLnNsaWNlKDEpLCAxMCApO1xyXG4gICAgZWxzZSBpZiggaGV4ICkgY2hhckNvZGUgPSBwYXJzZUludCggaGV4LnNsaWNlKDIpLCAxNiApO1xyXG4gICAgZWxzZSBjaGFyQ29kZSA9IGVudGl0aWVzW2NhcHR1cmVdXHJcblxyXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoIGNoYXJDb2RlIClcclxuICB9KTtcclxuXHJcbn1cclxuXHJcblxyXG4vLyBzaW1wbGUgZ2V0IGFjY2Vzc29yXHJcblxyXG5fLmNyZWF0ZU9iamVjdCA9IE9iamVjdC5jcmVhdGU/IGZ1bmN0aW9uKG8pe1xyXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKG8gfHwgbnVsbClcclxufTogKGZ1bmN0aW9uKCl7XHJcbiAgICBmdW5jdGlvbiBUZW1wKCkge31cclxuICAgIHJldHVybiBmdW5jdGlvbihvKXtcclxuICAgICAgaWYoIW8pIHJldHVybiB7fVxyXG4gICAgICBUZW1wLnByb3RvdHlwZSA9IG87XHJcbiAgICAgIHZhciBvYmogPSBuZXcgVGVtcCgpO1xyXG4gICAgICBUZW1wLnByb3RvdHlwZSA9IG51bGw7IC8vIOS4jeimgeS/neaMgeS4gOS4qiBPIOeahOadguaVo+W8leeUqO+8iGEgc3RyYXkgcmVmZXJlbmNl77yJLi4uXHJcbiAgICAgIHJldHVybiBvYmpcclxuICAgIH1cclxufSkoKTtcclxuXHJcbl8uY3JlYXRlUHJvdG8gPSBmdW5jdGlvbihmbiwgbyl7XHJcbiAgICBmdW5jdGlvbiBGb28oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBmbjt9XHJcbiAgICBGb28ucHJvdG90eXBlID0gbztcclxuICAgIHJldHVybiAoZm4ucHJvdG90eXBlID0gbmV3IEZvbygpKTtcclxufVxyXG5cclxuXHJcbl8ucmVtb3ZlT25lID0gZnVuY3Rpb24obGlzdCAsIGZpbHRlcil7XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIGZvcig7bGVuLS07KXtcclxuICAgIGlmKGZpbHRlcihsaXN0W2xlbl0pKSB7XHJcbiAgICAgIGxpc3Quc3BsaWNlKGxlbiwgMSlcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG5jbG9uZVxyXG4qL1xyXG5fLmNsb25lID0gZnVuY3Rpb24gY2xvbmUob2JqKXtcclxuICBpZighb2JqIHx8ICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyApKSByZXR1cm4gb2JqO1xyXG4gIGlmKEFycmF5LmlzQXJyYXkob2JqKSl7XHJcbiAgICB2YXIgY2xvbmVkID0gW107XHJcbiAgICBmb3IodmFyIGk9MCxsZW4gPSBvYmoubGVuZ3RoOyBpPCBsZW47aSsrKXtcclxuICAgICAgY2xvbmVkW2ldID0gb2JqW2ldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG4gIH1lbHNle1xyXG4gICAgdmFyIGNsb25lZCA9IHt9O1xyXG4gICAgZm9yKHZhciBpIGluIG9iaikgaWYob2JqLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgY2xvbmVkW2ldID0gb2JqW2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lZDtcclxuICB9XHJcbn1cclxuXHJcbl8uZXF1YWxzID0gZnVuY3Rpb24obm93LCBvbGQpe1xyXG4gIHZhciB0eXBlID0gdHlwZW9mIG5vdztcclxuICBpZih0eXBlID09PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb2xkID09PSAnbnVtYmVyJyYmIGlzTmFOKG5vdykgJiYgaXNOYU4ob2xkKSkgcmV0dXJuIHRydWVcclxuICByZXR1cm4gbm93ID09PSBvbGQ7XHJcbn1cclxuXHJcbnZhciBkYXNoID0gLy0oW2Etel0pL2c7XHJcbl8uY2FtZWxDYXNlID0gZnVuY3Rpb24oc3RyKXtcclxuICByZXR1cm4gc3RyLnJlcGxhY2UoZGFzaCwgZnVuY3Rpb24oYWxsLCBjYXB0dXJlKXtcclxuICAgIHJldHVybiBjYXB0dXJlLnRvVXBwZXJDYXNlKCk7XHJcbiAgfSlcclxufVxyXG5cclxuXHJcblxyXG5fLnRocm90dGxlID0gZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCl7XHJcbiAgdmFyIHdhaXQgPSB3YWl0IHx8IDEwMDtcclxuICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xyXG4gIHZhciB0aW1lb3V0ID0gbnVsbDtcclxuICB2YXIgcHJldmlvdXMgPSAwO1xyXG4gIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcHJldmlvdXMgPSArbmV3IERhdGU7XHJcbiAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XHJcbiAgfTtcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbm93ID0gKyBuZXcgRGF0ZTtcclxuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcclxuICAgIGNvbnRleHQgPSB0aGlzO1xyXG4gICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgdGltZW91dCA9IG51bGw7XHJcbiAgICAgIHByZXZpb3VzID0gbm93O1xyXG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKCF0aW1lb3V0KSB7XHJcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG59O1xyXG5cclxuLy8gaG9nYW4gZXNjYXBlXHJcbi8vID09PT09PT09PT09PT09XHJcbl8uZXNjYXBlID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJBbXAgPSAvJi9nLFxyXG4gICAgICByTHQgPSAvPC9nLFxyXG4gICAgICByR3QgPSAvPi9nLFxyXG4gICAgICByQXBvcyA9IC9cXCcvZyxcclxuICAgICAgclF1b3QgPSAvXFxcIi9nLFxyXG4gICAgICBoQ2hhcnMgPSAvWyY8PlxcXCJcXCddLztcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xyXG4gICAgcmV0dXJuIGhDaGFycy50ZXN0KHN0cikgP1xyXG4gICAgICBzdHJcclxuICAgICAgICAucmVwbGFjZShyQW1wLCAnJmFtcDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJMdCwgJyZsdDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJHdCwgJyZndDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJBcG9zLCAnJiMzOTsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJRdW90LCAnJnF1b3Q7JykgOlxyXG4gICAgICBzdHI7XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXy5jYWNoZSA9IGZ1bmN0aW9uKG1heCl7XHJcbiAgbWF4ID0gbWF4IHx8IDEwMDA7XHJcbiAgdmFyIGtleXMgPSBbXSxcclxuICAgICAgY2FjaGUgPSB7fTtcclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgIGlmIChrZXlzLmxlbmd0aCA+IHRoaXMubWF4KSB7XHJcbiAgICAgICAgY2FjaGVba2V5cy5zaGlmdCgpXSA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICAvLyBcclxuICAgICAgaWYoY2FjaGVba2V5XSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBrZXlzLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgICBjYWNoZVtrZXldID0gdmFsdWU7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZTtcclxuICAgICAgcmV0dXJuIGNhY2hlW2tleV07XHJcbiAgICB9LFxyXG4gICAgbWF4OiBtYXgsXHJcbiAgICBsZW46ZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIGtleXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbi8vIC8vIHNldHVwIHRoZSByYXcgRXhwcmVzc2lvblxyXG5cclxuXHJcbi8vIGhhbmRsZSB0aGUgc2FtZSBsb2dpYyBvbiBjb21wb25lbnQncyBgb24tKmAgYW5kIGVsZW1lbnQncyBgb24tKmBcclxuLy8gcmV0dXJuIHRoZSBmaXJlIG9iamVjdFxyXG5fLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24odmFsdWUsIHR5cGUgKXtcclxuICB2YXIgc2VsZiA9IHRoaXMsIGV2YWx1YXRlO1xyXG4gIGlmKHZhbHVlLnR5cGUgPT09ICdleHByZXNzaW9uJyl7IC8vIGlmIGlzIGV4cHJlc3Npb24sIGdvIGV2YWx1YXRlZCB3YXlcclxuICAgIGV2YWx1YXRlID0gdmFsdWUuZ2V0O1xyXG4gIH1cclxuICBpZihldmFsdWF0ZSl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gZmlyZShvYmope1xyXG4gICAgICBzZWxmLiR1cGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBkYXRhLiRldmVudCA9IG9iajtcclxuICAgICAgICB2YXIgcmVzID0gZXZhbHVhdGUoc2VsZik7XHJcbiAgICAgICAgaWYocmVzID09PSBmYWxzZSAmJiBvYmogJiYgb2JqLnByZXZlbnREZWZhdWx0KSBvYmoucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBkYXRhLiRldmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gZmlyZSgpe1xyXG4gICAgICB2YXIgYXJncyA9IF8uc2xpY2UoYXJndW1lbnRzKTtcclxuICAgICAgYXJncy51bnNoaWZ0KHZhbHVlKTtcclxuICAgICAgc2VsZi4kdXBkYXRlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc2VsZi4kZW1pdC5hcHBseShzZWxmLCBhcmdzKTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIG9ubHkgY2FsbCBvbmNlXHJcbl8ub25jZSA9IGZ1bmN0aW9uKGZuKXtcclxuICB2YXIgdGltZSA9IDA7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICBpZiggdGltZSsrID09PSAwKSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxufVxyXG5cclxuXy5maXhPYmpTdHIgPSBmdW5jdGlvbihzdHIpe1xyXG4gIGlmKHN0ci50cmltKCkuaW5kZXhPZigneycpICE9PSAwKXtcclxuICAgIHJldHVybiAneycgKyBzdHIgKyAnfSc7XHJcbiAgfVxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcblxyXG5fLm1hcD0gZnVuY3Rpb24oYXJyYXksIGNhbGxiYWNrKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICByZXMucHVzaChjYWxsYmFjayhhcnJheVtpXSwgaSkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2cobXNnLCB0eXBlKXtcclxuICBpZih0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikgIGNvbnNvbGVbdHlwZSB8fCBcImxvZ1wiXShtc2cpO1xyXG59XHJcblxyXG5fLmxvZyA9IGxvZztcclxuXHJcblxyXG5fLm5vcm1MaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudHMgICl7XHJcbiAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXTtcclxuICAgIHZhciBwVHlwZSA9IF8udHlwZU9mKCBldmVudHMgKTtcclxuICAgIGlmKCBwVHlwZSA9PT0gJ2FycmF5JyApe1xyXG4gICAgICByZXR1cm4gZXZlbnRzO1xyXG4gICAgfWVsc2UgaWYgKCBwVHlwZSA9PT0gJ29iamVjdCcgKXtcclxuICAgICAgZm9yKCB2YXIgaSBpbiBldmVudHMgKSBpZiAoIGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShpKSApe1xyXG4gICAgICAgIGV2ZW50TGlzdGVuZXJzLnB1c2goe1xyXG4gICAgICAgICAgdHlwZTogaSxcclxuICAgICAgICAgIGxpc3RlbmVyOiBldmVudHNbaV1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXZlbnRMaXN0ZW5lcnM7XHJcbn1cclxuXHJcblxyXG4vL2h0dHA6Ly93d3cudzMub3JnL2h0bWwvd2cvZHJhZnRzL2h0bWwvbWFzdGVyL3NpbmdsZS1wYWdlLmh0bWwjdm9pZC1lbGVtZW50c1xyXG5fLmlzVm9pZFRhZyA9IF8ubWFrZVByZWRpY2F0ZShcImFyZWEgYmFzZSBiciBjb2wgZW1iZWQgaHIgaW1nIGlucHV0IGtleWdlbiBsaW5rIG1lbnVpdGVtIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdiciByLWNvbnRlbnRcIik7XHJcbl8uaXNCb29sZWFuQXR0ciA9IF8ubWFrZVByZWRpY2F0ZSgnc2VsZWN0ZWQgY2hlY2tlZCBkaXNhYmxlZCByZWFkb25seSByZXF1aXJlZCBvcGVuIGF1dG9mb2N1cyBjb250cm9scyBhdXRvcGxheSBjb21wYWN0IGxvb3AgZGVmZXIgbXVsdGlwbGUnKTtcclxuXHJcblxyXG5fLmlzRXhwciA9IGZ1bmN0aW9uKGV4cHIpe1xyXG4gIHJldHVybiBleHByICYmIGV4cHIudHlwZSA9PT0gJ2V4cHJlc3Npb24nO1xyXG59XHJcbi8vIEBUT0RPOiBtYWtlIGl0IG1vcmUgc3RyaWN0XHJcbl8uaXNHcm91cCA9IGZ1bmN0aW9uKGdyb3VwKXtcclxuICByZXR1cm4gZ3JvdXAuaW5qZWN0IHx8IGdyb3VwLiRpbmplY3Q7XHJcbn1cclxuXHJcbl8uZ2V0Q29tcGlsZUZuID0gZnVuY3Rpb24oc291cmNlLCBjdHgsIG9wdGlvbnMpe1xyXG4gIHJldHVybiBjdHguJGNvbXBpbGUuYmluZChjdHgsc291cmNlLCBvcHRpb25zKVxyXG59XHJcblxyXG4vLyByZW1vdmUgZGlyZWN0aXZlIHBhcmFtIGZyb20gQVNUXHJcbl8uZml4VGFnQVNUID0gZnVuY3Rpb24oIHRhZ0FTVCwgQ29tcG9uZW50ICl7XHJcblxyXG4gIGlmKCB0YWdBU1QudG91Y2hlZCApIHJldHVybjtcclxuXHJcbiAgdmFyIGF0dHJzID0gdGFnQVNULmF0dHJzO1xyXG5cclxuICBpZiggIWF0dHJzICkgcmV0dXJuO1xyXG5cclxuICAvLyBNYXliZSBtdWx0aXBsZSBkaXJlY3RpdmUgbmVlZCBzYW1lIHBhcmFtLCBcclxuICAvLyBXZSBwbGFjZSBhbGwgcGFyYW0gaW4gdG90YWxQYXJhbU1hcFxyXG4gIHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XHJcbiAgaWYoIWxlbikgcmV0dXJuO1xyXG4gIHZhciBkaXJlY3RpdmVzPVtdLCBvdGhlckF0dHJNYXAgPSB7fTtcclxuICBmb3IoO2xlbi0tOyl7XHJcblxyXG4gICAgdmFyIGF0dHIgPSBhdHRyc1sgbGVuIF07XHJcblxyXG5cclxuICAgIC8vIEBJRSBmaXggSUU5LSBpbnB1dCB0eXBlIGNhbid0IGFzc2lnbiBhZnRlciB2YWx1ZVxyXG4gICAgaWYoYXR0ci5uYW1lID09PSAndHlwZScpIGF0dHIucHJpb3JpdHkgPSBNQVhfUFJJT1JJVFkrMTtcclxuXHJcbiAgICB2YXIgZGlyZWN0aXZlID0gQ29tcG9uZW50LmRpcmVjdGl2ZSggYXR0ci5uYW1lICk7XHJcbiAgICBpZiggZGlyZWN0aXZlICkge1xyXG5cclxuICAgICAgYXR0ci5wcmlvcml0eSA9IGRpcmVjdGl2ZS5wcmlvcml0eSB8fCAxO1xyXG4gICAgICBhdHRyLmRpcmVjdGl2ZSA9IHRydWU7XHJcbiAgICAgIGRpcmVjdGl2ZXMucHVzaChhdHRyKTtcclxuXHJcbiAgICB9ZWxzZSBpZihhdHRyLnR5cGUgPT09ICdhdHRyaWJ1dGUnKXtcclxuICAgICAgb3RoZXJBdHRyTWFwW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGlyZWN0aXZlcy5mb3JFYWNoKCBmdW5jdGlvbiggYXR0ciApe1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IENvbXBvbmVudC5kaXJlY3RpdmUoYXR0ci5uYW1lKTtcclxuICAgIHZhciBwYXJhbSA9IGRpcmVjdGl2ZS5wYXJhbTtcclxuICAgIGlmKHBhcmFtICYmIHBhcmFtLmxlbmd0aCl7XHJcbiAgICAgIGF0dHIucGFyYW0gPSB7fTtcclxuICAgICAgcGFyYW0uZm9yRWFjaChmdW5jdGlvbiggbmFtZSApe1xyXG4gICAgICAgIGlmKCBuYW1lIGluIG90aGVyQXR0ck1hcCApe1xyXG4gICAgICAgICAgYXR0ci5wYXJhbVtuYW1lXSA9IG90aGVyQXR0ck1hcFtuYW1lXSA9PT0gdW5kZWZpbmVkPyB0cnVlOiBvdGhlckF0dHJNYXBbbmFtZV1cclxuICAgICAgICAgIF8ucmVtb3ZlT25lKGF0dHJzLCBmdW5jdGlvbihhdHRyKXtcclxuICAgICAgICAgICAgcmV0dXJuIGF0dHIubmFtZSA9PT0gbmFtZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGF0dHJzLnNvcnQoZnVuY3Rpb24oYTEsIGEyKXtcclxuICAgIFxyXG4gICAgdmFyIHAxID0gYTEucHJpb3JpdHk7XHJcbiAgICB2YXIgcDIgPSBhMi5wcmlvcml0eTtcclxuXHJcbiAgICBpZiggcDEgPT0gbnVsbCApIHAxID0gTUFYX1BSSU9SSVRZO1xyXG4gICAgaWYoIHAyID09IG51bGwgKSBwMiA9IE1BWF9QUklPUklUWTtcclxuXHJcbiAgICByZXR1cm4gcDIgLSBwMTtcclxuXHJcbiAgfSlcclxuXHJcbiAgdGFnQVNULnRvdWNoZWQgPSB0cnVlO1xyXG59XHJcblxyXG5fLmZpbmRJdGVtID0gZnVuY3Rpb24obGlzdCwgZmlsdGVyKXtcclxuICBpZighbGlzdCB8fCAhbGlzdC5sZW5ndGgpIHJldHVybjtcclxuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XHJcbiAgd2hpbGUobGVuLS0pe1xyXG4gICAgaWYoZmlsdGVyKGxpc3RbbGVuXSkpIHJldHVybiBsaXN0W2xlbl1cclxuICB9XHJcbn1cclxuXHJcbl8uZ2V0UGFyYW1PYmogPSBmdW5jdGlvbihjb21wb25lbnQsIHBhcmFtKXtcclxuICB2YXIgcGFyYW1PYmogPSB7fTtcclxuICBpZihwYXJhbSkge1xyXG4gICAgZm9yKHZhciBpIGluIHBhcmFtKSBpZihwYXJhbS5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBhcmFtW2ldO1xyXG4gICAgICBwYXJhbU9ialtpXSA9ICB2YWx1ZSAmJiB2YWx1ZS50eXBlPT09J2V4cHJlc3Npb24nPyBjb21wb25lbnQuJGdldCh2YWx1ZSk6IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcGFyYW1PYmo7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9QYXJzZXIvdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdCRUdJTic6ICd7JyxcclxuICAnRU5EJzogJ30nLFxyXG4gICdQUkVDT01QSUxFJzogZmFsc2VcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1BhcnNlci9jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIEZyZWVsaXN0ID0gcmVxdWlyZSgnLi9GcmVlbGlzdC5qcycpO1xyXG5cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICBpZihORUogJiYgTkVKLmRlZmluZSl7XHJcbiAgICAgICAgTkVKLmRlZmluZShbXSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIEZyZWVsaXN0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmKHdpbmRvdy5kZWZpbmUpe1xyXG4gICAgICAgIHdpbmRvdy5kZWZpbmUoW10sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiBGcmVlbGlzdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZihkb2N1bWVudCAmJiBkb2N1bWVudC5ub2RlVHlwZSl7XHJcbiAgICAgICAgd2luZG93LkZyZWVsaXN0ID0gRnJlZWxpc3Q7XHJcbiAgICB9XHJcblxyXG4gICAgaWYobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKXtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEZyZWVsaXN0O1xyXG4gICAgfVxyXG5cclxufSkoKVxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBQYXJzZXIgPSByZXF1aXJlKCcuL1BhcnNlci9zcmMvUGFyc2VyLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBGcmVlbGlzdChjb25maWcpe1xyXG4gICAgdmFyIHRwbCA9IGNvbmZpZy50ZW1wbGF0ZTtcclxuICAgIHZhciBkYXRhID0gY29uZmlnLmRhdGE7XHJcbiAgICBcclxuICAgIC8qKumFjee9ruaVsOaNruaooeWeiyAqL1xyXG4gICAgRnJlZWxpc3QuY29uZmlnKGNvbmZpZywgdGhpcyk7XHJcblxyXG4gICAgLyoq5omn6KGMY29uZmlnICovXHJcbiAgICB0eXBlb2YgdGhpcy5jb25maWcgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jb25maWcodGhpcy5kYXRhKTtcclxuXHJcbiAgICAvKirop6PmnpDlrZfnrKbkuLItLS0+QVNU5qCRICovXHJcbiAgICB0aGlzLkFTVCA9IEZyZWVsaXN0LnBhcnNlKHRwbClcclxuICAgIFxyXG59XHJcblxyXG5GcmVlbGlzdC5wYXJzZSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgICByZXR1cm4gbmV3IFBhcnNlcihzdHIpLnBhcnNlKCk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LmNvbmZpZyA9IGZ1bmN0aW9uKGNvbmZpZywgY29udGV4dCl7XHJcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGNvbmZpZyk7XHJcbiAgICBmb3IodmFyIGk9MDtpPGtleXMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgdmFyIHZhbHVlID0gY29uZmlnW2tleXNbaV1dO1xyXG4gICAgICAgIGNvbnRleHRba2V5c1tpXV0gPSB2YWx1ZTtcclxuICAgIH1cclxuICAgIC8qKuiuvue9ruWIl+ihqCAqL1xyXG4gICAgY29udGV4dC5fbGlzdCA9IHt9O1xyXG5cclxuICAgIC8qKuiuvue9rum7mOiupGRhdGEgKi9cclxuICAgIGNvbnRleHQuZGF0YSA9IGNvbmZpZy5kYXRhIHx8IHt9O1xyXG5cclxuICAgIC8qKuS/neWtmOiuvue9riAqL1xyXG4gICAgY29udGV4dC5kZWZpbmUgPSBjb25maWc7XHJcbn1cclxuXHJcbkZyZWVsaXN0LmNvbXBpbGVyID0ge1xyXG4gICAgJ2VsZW1lbnQnOiBmdW5jdGlvbihhc3QsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXN0LnRhZyk7XHJcblxyXG4gICAgICAgIHZhciBhdHRycyA9IGFzdC5hdHRycztcclxuICAgICAgICAvKirlpITnkIblsZ7mgKcgKi9cclxuICAgICAgICBmb3IodmFyIGk9MDtpPGF0dHJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc3dpdGNoKGF0dHIudHlwZSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdhdHRyaWJ1dGUnOiBGcmVlbGlzdC5yZXNvbHZlQXR0cmlidXRlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKuWkhOeQhuWtkOiKgueCuSAqL1xyXG4gICAgICAgIGlmKGFzdC5jaGlsZHJlbil7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaj0wO2o8YXN0LmNoaWxkcmVuLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gYXN0LmNoaWxkcmVuW2pdO1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmQoY29udGV4dC5fY29tcGlsZShjaGlsZCwgbGlzdEluZm8pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9LFxyXG4gICAgJ3RleHQnOiBmdW5jdGlvbihhc3Qpe1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXN0LnRleHQpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfSxcclxuICAgICdleHByZXNzaW9uJzogZnVuY3Rpb24oYXN0LCBjb250ZXh0LCBsaXN0SW5mbyl7XHJcbiAgICAgICAgdmFyIHRleHQgPSAnJztcclxuICAgICAgICBpZihsaXN0SW5mbyl7XHJcbiAgICAgICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsJ2QnLCdlJywncmV0dXJuICgnK2FzdC5ib2R5KycpJyk7XHJcbiAgICAgICAgICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbywgJycpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3QuYm9keSsnKScpO1xyXG4gICAgICAgICAgICB0ZXh0ID0gZ2V0VmFsdWUoY29udGV4dCwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH0sXHJcbiAgICAnbGlzdCc6IGZ1bmN0aW9uKGFzdCwgY29udGV4dCl7XHJcbiAgICAgICAgdmFyIGxpc3RCb2R5ID0gYXN0LmJvZHk7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXN0LnNlcXVlbmNlLmJvZHkrJyknKTtcclxuICAgICAgICB2YXIgYXJyYXlEYXRhID0gZ2V0VmFsdWUoY29udGV4dCwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICAgICAgdmFyIHZhcmlhYmxlID0gYXN0LnZhcmlhYmxlO1xyXG5cclxuICAgICAgICBmb3IodmFyIGo9MDtqPGFycmF5RGF0YS5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoaXRlbU5vZGUobGlzdEJvZHksIGFycmF5RGF0YVtqXSwgaikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXRlbU5vZGUoYm9keSwgaXRlbSwgaW5kZXgpe1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICAgICAgdmFyIGxpc3RJbmZvID0ge307XHJcblxyXG4gICAgICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZV0gPSBpdGVtO1xyXG4gICAgICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZSsnX2luZGV4J10gPSBpbmRleDtcclxuICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxib2R5Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hcHBlbmQoY29udGV4dC5fY29tcGlsZShib2R5W2ldLCBsaXN0SW5mbykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0Ll9saXN0LmRhdGEgPSBhcnJheURhdGE7XHJcbiAgICAgICAgY29udGV4dC5fbGlzdC5ib2R5ID0gbGlzdEJvZHk7XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG59O1xyXG5cclxuRnJlZWxpc3QucmVwbGFjZUxpc3QgPSBmdW5jdGlvbihvbGRMaXN0LCBuZXdMaXN0KXtcclxuICAgIGZvcih2YXIgaT1vbGRMaXN0Lmxlbmd0aC0xO2k+PTA7aS0tKXtcclxuICAgICAgICBpZih0eXBlb2YgbmV3TGlzdFtpXSA9PT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgICAgICBvbGRMaXN0LnNwbGljZShpLCAxKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgb2xkTGlzdFtpXSA9IG5ld0xpc3RbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5GcmVlbGlzdC5yZXNvbHZlQXR0cmlidXRlID0gZnVuY3Rpb24oYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiBhdHRyLnZhbHVlO1xyXG4gICAgc3dpdGNoKHZhbHVlVHlwZSl7XHJcbiAgICAgICAgY2FzZSAnc3RyaW5nJzogbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnb2JqZWN0Jzogbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBGcmVlbGlzdC5yZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKSk7IGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ2xpc3QtY29udGFpbmVyJyl7XHJcbiAgICAgICAgY29udGV4dC5fbGlzdC5jb250YWluZXIgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbkZyZWVsaXN0LnJlc29sdmVBdHRyVmFsdWUgPSBmdW5jdGlvbihhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbyl7XHJcbiAgICB2YXIgaXNFdmVudCA9IGF0dHIubmFtZS5zbGljZSgwLDIpID09PSAnb24nO1xyXG5cclxuICAgIGlmKGlzRXZlbnQpe1xyXG4gICAgICAgIHZhciBldmVudE5hbWUgPSBhdHRyLm5hbWUuc2xpY2UoMyk7XHJcbiAgICAgICAgYXR0ci52YWx1ZS5ib2R5ID0gYXR0ci52YWx1ZS5ib2R5LnJlcGxhY2UoLydcXCRldmVudCcvZywgJyRldmVudCcpO1xyXG4gICAgICAgIHZhciBnZXRIYW5kbGVyID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gZnVuY3Rpb24oJGV2ZW50KXtyZXR1cm4gJythdHRyLnZhbHVlLmJvZHkrJzt9Jyk7XHJcblxyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGdldEhhbmRsZXIoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyksIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythdHRyLnZhbHVlLmJvZHkrJyknKTtcclxuICAgICAgICByZXR1cm4gZ2V0VmFsdWUoY29udGV4dCwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS5fY29tcGlsZSA9IGZ1bmN0aW9uKGFzdCwgbGlzdEluZm8pe1xyXG4gICAgaWYoYXN0IGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZCh0aGlzLl9jb21waWxlKGFzdFtpXSwgbGlzdEluZm8pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGlsZXJbYXN0LnR5cGVdKGFzdCwgdGhpcywgbGlzdEluZm8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5GcmVlbGlzdC5wcm90b3R5cGUuJGluamVjdCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5jb250YWluZXJOb2RlID0gbm9kZTtcclxuXHJcbiAgICB0aGlzLiRyZW5kZXIoKVxyXG4gICAgbm9kZS5hcHBlbmQodGhpcy5kb21UcmVlKTtcclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLiRtb2RpZnkgPSBmdW5jdGlvbihpbmRleCwgbW9kZWwpe1xyXG4gICAgdmFyIF9saXN0ID0gdGhpcy5fbGlzdCxcclxuICAgICAgICBfbGlzdENvbnRhaW5lciA9IF9saXN0LmNvbnRhaW5lcixcclxuICAgICAgICBfYm9keSA9IF9saXN0LmJvZHk7XHJcblxyXG4gICAgLyoq6K6+572u5pWw5o2u5qih5Z6LICovXHJcbiAgICBfbGlzdC5kYXRhW2luZGV4XSA9IG1vZGVsO1xyXG5cclxuICAgIC8qKkRvbeeyvuehruabtOaWsCAqL1xyXG4gICAgdmFyIHRhcmdldERvbSA9IF9saXN0Q29udGFpbmVyLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIHZhciBub2RlID0gdGhpcy5fY29tcGlsZShfYm9keSwge2l0ZW06IG1vZGVsLCBpdGVtX2luZGV4OiBpbmRleH0pO1xyXG5cclxuICAgIF9saXN0Q29udGFpbmVyLnJlcGxhY2VDaGlsZChub2RlLCB0YXJnZXREb20pO1xyXG59XHJcblxyXG5GcmVlbGlzdC5wcm90b3R5cGUuJGluc2VydCA9IGZ1bmN0aW9uKGluZGV4LCBtb2RlbCl7XHJcbiAgICB2YXIgX2xpc3QgPSB0aGlzLl9saXN0LFxyXG4gICAgICAgIF9saXN0Q29udGFpbmVyID0gX2xpc3QuY29udGFpbmVyLFxyXG4gICAgICAgIF9ib2R5ID0gX2xpc3QuYm9keTtcclxuXHJcbiAgICAvKirorr7nva7mlbDmja7mqKHlnosgKi9cclxuICAgIF9saXN0LmRhdGEuc3BsaWNlKGluZGV4LCAwLCBtb2RlbCk7XHJcblxyXG4gICAgdGhpcy4kcmVuZGVyKCk7XHJcbn1cclxuXHJcbi8qKuabv+aNouWIl+ihqOaVsOaNriAqL1xyXG5GcmVlbGlzdC5wcm90b3R5cGUuJHJlcGxhY2UgPSBmdW5jdGlvbihuZXdMaXN0KXtcclxuICAgIHZhciBfbGlzdCA9IHRoaXMuX2xpc3Q7XHJcblxyXG4gICAgRnJlZWxpc3QucmVwbGFjZUxpc3QoX2xpc3QuZGF0YSwgbmV3TGlzdCk7XHJcbiAgICB0aGlzLiRyZW5kZXIoKTtcclxufTtcclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kZGVsZXRlID0gZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgIHZhciBfbGlzdCA9IHRoaXMuX2xpc3QsXHJcbiAgICAgICAgX2xpc3RDb250YWluZXIgPSBfbGlzdC5jb250YWluZXI7XHJcblxyXG4gICAgLyoq6K6+572u5pWw5o2u5qih5Z6LICovXHJcbiAgICBfbGlzdC5kYXRhLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLiRyZW5kZXIoKTtcclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLiRyZW5kZXIgPSBmdW5jdGlvbih3b3JrZXJSZW5kZXIpe1xyXG4gICAgaWYod29ya2VyUmVuZGVyKXtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBc3luYyh3b3JrZXJSZW5kZXIpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyU3luYygpO1xyXG4gICAgfVxyXG59XHJcblxyXG5GcmVlbGlzdC5wcm90b3R5cGUuX3JlbmRlclN5bmMgPSBmdW5jdGlvbigpe1xyXG4gICAgLyoq6I635b6X57yW6K+R5ZmoICovXHJcbiAgICB0aGlzLl9jb21waWxlciA9IEZyZWVsaXN0LmNvbXBpbGVyO1xyXG5cclxuICAgIC8qKue8luivkUFTVOagkS0tLT5ET03moJEgKi9cclxuICAgIHZhciBuZXdSb290ID0gdGhpcy5kb21UcmVlID0gdGhpcy5fY29tcGlsZSh0aGlzLkFTVCksXHJcbiAgICAgICAgY29udGFpbmVyTm9kZSA9IHRoaXMuY29udGFpbmVyTm9kZSxcclxuICAgICAgICByb290Tm9kZSA9IHRoaXMucm9vdE5vZGU7XHJcblxyXG4gICAgXHJcbiAgICB0aGlzLnJvb3ROb2RlID0gbmV3Um9vdC5jaGlsZHJlblswXTtcclxuICAgIGlmKHJvb3ROb2RlKXtcclxuICAgICAgICBjb250YWluZXJOb2RlLnJlcGxhY2VDaGlsZChuZXdSb290LCByb290Tm9kZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS5fcmVuZGVyQXN5bmMgPSBmdW5jdGlvbih3b3JrZXJSZW5kZXIpe1xyXG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEsXHJcbiAgICAgICAgYXN0ID0gdGhpcy5BU1Q7XHJcbiAgICAgICAgLy9fd29ya2VyID0gdGhpcy53b3JrZXIsXHJcbiAgICAgICAgLy9fbWVzc2FnZUJ1cyA9IHRoaXMuX21lc3NhZ2VCdXMgfHwgbmV3IE1lc3NhZ2VCdXMoX3dvcmtlcik7XHJcblxyXG4gICAgd29ya2VyUmVuZGVyLnJlY2VpdmUoe3R5cGU6ICdyZW5kZXInLCBkYXRhOiB7YXN0OiBhc3QsIGRhdGE6IGRhdGF9fSlcclxuICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJOb2RlLmlubmVySFRNTCA9IGRhdGEuaHRtbDtcclxuICAgICAgICAgICAgdGhpcy5yb290Tm9kZSA9IHRoaXMuY29udGFpbmVyTm9kZS5jaGlsZHJlblswXTtcclxuXHJcbiAgICAgICAgICAgIEZyZWVsaXN0LmFkZEFzeW5jRXZlbnRzLmNhbGwodGhpcywgdGhpcy5yb290Tm9kZSwgZGF0YS5ldmVudHMpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LmFkZEFzeW5jRXZlbnRzID0gZnVuY3Rpb24obm9kZSwgZXZlbnRzKXtcclxuICAgIGlmKG5vZGUuZ2V0QXR0cmlidXRlKCdsaXN0LWNvbnRhaW5lcicpKXtcclxuICAgICAgICB0aGlzLl9saXN0LmNvbnRhaW5lciA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICBpZih0eXBlb2Ygbm9kZS5kYXRhc2V0ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygbm9kZS5kYXRhc2V0Lm5vZGVJRCA9PT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgIGlmKCFub2RlLmNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxub2RlLmNoaWxkcmVuLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBGcmVlbGlzdC5hZGRBc3luY0V2ZW50cy5jYWxsKHRoaXMsIG5vZGUuY2hpbGRyZW5baV0sIGV2ZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIG5vZGVJZCA9IG5vZGUuZGF0YXNldC5ub2RlaWQ7XHJcblxyXG4gICAgZm9yKHZhciBpZCBpbiBldmVudHMpe1xyXG4gICAgICAgIGlmKGlkID09IG5vZGVJZCl7XHJcbiAgICAgICAgICAgIHZhciBldmVudEh1YiA9IGV2ZW50c1tpZF07XHJcbiAgICAgICAgICAgIGZvcih2YXIgaj0wO2o8ZXZlbnRIdWIubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuICcrZXZlbnRIdWJbal0udmFsdWUrJzsnKTtcclxuICAgICAgICAgICAgICAgIHZhciBoYW5kbGVyID0gZ2V0SGFuZGxlcih0aGlzLCB0aGlzLmRhdGEsICcnKTtcclxuICAgICAgICAgICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudEh1YltqXS5uYW1lLCBnZXRIYW5kbGVyKHRoaXMsIHRoaXMuZGF0YSwgJycpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgZGVsZXRlIGV2ZW50c1tub2RlSWRdO1xyXG5cclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLl9zZ18gPSBmdW5jdGlvbihwYXRoLCBkYXRhKXtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZihwYXRoIGluc3RhbmNlb2YgRXZlbnQpe1xyXG4gICAgICAgIHJlc3VsdCA9IHBhdGg7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXN1bHQgPSBkYXRhW3BhdGhdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IEZyZWVsaXN0O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0ZyZWVsaXN0LmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcblxyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxudmFyIG5vZGUgPSByZXF1aXJlKFwiLi9ub2RlLmpzXCIpO1xyXG52YXIgTGV4ZXIgPSByZXF1aXJlKFwiLi9MZXhlci5qc1wiKTtcclxudmFyIHZhck5hbWUgPSBfLnZhck5hbWU7XHJcbnZhciBjdHhOYW1lID0gXy5jdHhOYW1lO1xyXG52YXIgZXh0TmFtZSA9IF8uZXh0TmFtZTtcclxudmFyIGlzUGF0aCA9IF8ubWFrZVByZWRpY2F0ZShcIlNUUklORyBJREVOVCBOVU1CRVJcIik7XHJcbnZhciBpc0tleVdvcmQgPSBfLm1ha2VQcmVkaWNhdGUoXCJ0cnVlIGZhbHNlIHVuZGVmaW5lZCBudWxsIHRoaXMgQXJyYXkgRGF0ZSBKU09OIE1hdGggTmFOIFJlZ0V4cCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50IGVuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgcGFyc2VGbG9hdCBwYXJzZUludCBPYmplY3RcIik7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBQYXJzZXIoaW5wdXQsIG9wdHMpe1xyXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgdGhpcy50b2tlbnMgPSBuZXcgTGV4ZXIoaW5wdXQsIG9wdHMpLmxleCgpO1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB0aGlzLmxlbmd0aCA9IHRoaXMudG9rZW5zLmxlbmd0aDtcclxufVxyXG5cclxuXHJcbnZhciBvcCA9IFBhcnNlci5wcm90b3R5cGU7XHJcblxyXG5cclxub3AucGFyc2UgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB2YXIgcmVzPSB0aGlzLnByb2dyYW0oKTtcclxuICBpZih0aGlzLmxsKCkudHlwZSA9PT0gJ1RBR19DTE9TRScpe1xyXG4gICAgdGhpcy5lcnJvcihcIllvdSBtYXkgZ290IGEgdW5jbG9zZWQgVGFnXCIpXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbm9wLmxsID0gIGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgaWYoayA8IDApIGsgPSBrICsgMTtcclxuICB2YXIgcG9zID0gdGhpcy5wb3MgKyBrIC0gMTtcclxuICBpZihwb3MgPiB0aGlzLmxlbmd0aCAtIDEpe1xyXG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5sZW5ndGgtMV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLnRva2Vuc1twb3NdO1xyXG59XHJcbiAgLy8gbG9va2FoZWFkXHJcbm9wLmxhID0gZnVuY3Rpb24oayl7XHJcbiAgcmV0dXJuICh0aGlzLmxsKGspIHx8ICcnKS50eXBlO1xyXG59XHJcblxyXG5vcC5tYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGw7XHJcbiAgaWYoIShsbCA9IHRoaXMuZWF0KHR5cGUsIHZhbHVlKSkpe1xyXG4gICAgbGwgID0gdGhpcy5sbCgpO1xyXG4gICAgdGhpcy5lcnJvcignZXhwZWN0IFsnICsgdHlwZSArICh2YWx1ZSA9PSBudWxsPyAnJzonOicrIHZhbHVlKSArICddXCIgLT4gZ290IFwiWycgKyBsbC50eXBlICsgKHZhbHVlPT1udWxsPyAnJzonOicrbGwudmFsdWUpICsgJ10nLCBsbC5wb3MpXHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gbGw7XHJcbiAgfVxyXG59XHJcblxyXG5vcC5lcnJvciA9IGZ1bmN0aW9uKG1zZywgcG9zKXtcclxuICBtc2cgPSAgXCJcXG7jgJAgcGFyc2UgZmFpbGVkIOOAkSBcIiArIG1zZyArICAnOlxcblxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdHlwZW9mIHBvcyA9PT0gJ251bWJlcic/IHBvczogdGhpcy5sbCgpLnBvc3x8MCk7XHJcbiAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XHJcbn1cclxuXHJcbm9wLm5leHQgPSBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIHRoaXMucG9zICs9IGs7XHJcbn1cclxub3AuZWF0ID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBpZih0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpe1xyXG4gICAgZm9yKHZhciBsZW4gPSB0eXBlLmxlbmd0aCA7IGxlbi0tOyl7XHJcbiAgICAgIGlmKGxsLnR5cGUgPT09IHR5cGVbbGVuXSkge1xyXG4gICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIHJldHVybiBsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgaWYoIGxsLnR5cGUgPT09IHR5cGUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbGwudmFsdWUgPT09IHZhbHVlKSApe1xyXG4gICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICByZXR1cm4gbGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gcHJvZ3JhbVxyXG4vLyAgOkVPRlxyXG4vLyAgfCAoc3RhdGVtZW50KSogRU9GXHJcbm9wLnByb2dyYW0gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZW1lbnRzID0gW10sICBsbCA9IHRoaXMubGwoKTtcclxuICB3aGlsZShsbC50eXBlICE9PSAnRU9GJyAmJiBsbC50eXBlICE9PSdUQUdfQ0xPU0UnKXtcclxuXHJcbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICB9XHJcbiAgLy8gaWYobGwudHlwZSA9PT0gJ1RBR19DTE9TRScpIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGhhdmUgdW5tYXRjaGVkIFRhZ1wiKVxyXG4gIHJldHVybiBzdGF0ZW1lbnRzO1xyXG59XHJcblxyXG4vLyBzdGF0ZW1lbnRcclxuLy8gIDogeG1sXHJcbi8vICB8IGpzdFxyXG4vLyAgfCB0ZXh0XHJcbm9wLnN0YXRlbWVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgJ05BTUUnOlxyXG4gICAgY2FzZSAnVEVYVCc6XHJcbiAgICAgIHZhciB0ZXh0ID0gbGwudmFsdWU7XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB3aGlsZShsbCA9IHRoaXMuZWF0KFsnTkFNRScsICdURVhUJ10pKXtcclxuICAgICAgICB0ZXh0ICs9IGxsLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBub2RlLnRleHQodGV4dCk7XHJcbiAgICBjYXNlICdUQUdfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLnhtbCgpO1xyXG4gICAgY2FzZSAnT1BFTic6IFxyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlY3RpdmUoKTtcclxuICAgIGNhc2UgJ0VYUFJfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuLy8geG1sIFxyXG4vLyBzdGFnIHN0YXRlbWVudCogVEFHX0NMT1NFPyhpZiBzZWxmLWNsb3NlZCB0YWcpXHJcbm9wLnhtbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUsIGF0dHJzLCBjaGlsZHJlbiwgc2VsZkNsb3NlZDtcclxuICBuYW1lID0gdGhpcy5tYXRjaCgnVEFHX09QRU4nKS52YWx1ZTtcclxuICBhdHRycyA9IHRoaXMuYXR0cnMoKTtcclxuICBzZWxmQ2xvc2VkID0gdGhpcy5lYXQoJy8nKVxyXG4gIHRoaXMubWF0Y2goJz4nKTtcclxuICBpZiggIXNlbGZDbG9zZWQgJiYgIV8uaXNWb2lkVGFnKG5hbWUpICl7XHJcbiAgICBjaGlsZHJlbiA9IHRoaXMucHJvZ3JhbSgpO1xyXG4gICAgaWYoIXRoaXMuZWF0KCdUQUdfQ0xPU0UnLCBuYW1lKSkgdGhpcy5lcnJvcignZXhwZWN0IDwvJytuYW1lKyc+IGdvdCcrICdubyBtYXRjaGVkIGNsb3NlVGFnJylcclxuICB9XHJcbiAgcmV0dXJuIG5vZGUuZWxlbWVudChuYW1lLCBhdHRycywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vLyB4ZW50aXR5XHJcbi8vICAtcnVsZSh3cmFwIGF0dHJpYnV0ZSlcclxuLy8gIC1hdHRyaWJ1dGVcclxuLy9cclxuLy8gX19leGFtcGxlX19cclxuLy8gIG5hbWUgPSAxIHwgIFxyXG4vLyAgbmctaGlkZSB8XHJcbi8vICBvbi1jbGljaz17e319IHwgXHJcbi8vICB7eyNpZiBuYW1lfX1vbi1jbGljaz17e3h4fX17eyNlbHNlfX1vbi10YXA9e3t9fXt7L2lmfX1cclxuXHJcbm9wLnhlbnRpdHkgPSBmdW5jdGlvbihsbCl7XHJcbiAgdmFyIG5hbWUgPSBsbC52YWx1ZSwgdmFsdWUsIG1vZGlmaWVyO1xyXG4gIGlmKGxsLnR5cGUgPT09ICdOQU1FJyl7XHJcbiAgICAvL0Agb25seSBmb3IgdGVzdFxyXG4gICAgaWYofm5hbWUuaW5kZXhPZignLicpKXtcclxuICAgICAgdmFyIHRtcCA9IG5hbWUuc3BsaXQoJy4nKTtcclxuICAgICAgbmFtZSA9IHRtcFswXTtcclxuICAgICAgbW9kaWZpZXIgPSB0bXBbMV1cclxuXHJcbiAgICB9XHJcbiAgICBpZiggdGhpcy5lYXQoXCI9XCIpICkgdmFsdWUgPSB0aGlzLmF0dHZhbHVlKG1vZGlmaWVyKTtcclxuICAgIHJldHVybiBub2RlLmF0dHJpYnV0ZSggbmFtZSwgdmFsdWUsIG1vZGlmaWVyICk7XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbmFtZSAhPT0gJ2lmJykgdGhpcy5lcnJvcihcImN1cnJlbnQgdmVyc2lvbi4gT05MWSBSVUxFICNpZiAjZWxzZSAjZWxzZWlmIGlzIHZhbGlkIGluIHRhZywgdGhlIHJ1bGUgI1wiICsgbmFtZSArICcgaXMgaW52YWxpZCcpO1xyXG4gICAgcmV0dXJuIHRoaXNbJ2lmJ10odHJ1ZSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gc3RhZyAgICAgOjo9ICAgICc8JyBOYW1lIChTIGF0dHIpKiBTPyAnPicgIFxyXG4vLyBhdHRyICAgIDo6PSAgICAgTmFtZSBFcSBhdHR2YWx1ZVxyXG5vcC5hdHRycyA9IGZ1bmN0aW9uKGlzQXR0cmlidXRlKXtcclxuICB2YXIgZWF0XHJcbiAgaWYoIWlzQXR0cmlidXRlKXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIiwgXCJPUEVOXCJdXHJcbiAgfWVsc2V7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCJdXHJcbiAgfVxyXG5cclxuICB2YXIgYXR0cnMgPSBbXSwgbGw7XHJcbiAgd2hpbGUgKGxsID0gdGhpcy5lYXQoZWF0KSl7XHJcbiAgICBhdHRycy5wdXNoKHRoaXMueGVudGl0eSggbGwgKSlcclxuICB9XHJcbiAgcmV0dXJuIGF0dHJzO1xyXG59XHJcblxyXG4vLyBhdHR2YWx1ZVxyXG4vLyAgOiBTVFJJTkcgIFxyXG4vLyAgfCBOQU1FXHJcbm9wLmF0dHZhbHVlID0gZnVuY3Rpb24obWRmKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIk5BTUVcIjpcclxuICAgIGNhc2UgXCJVTlFcIjpcclxuICAgIGNhc2UgXCJTVFJJTkdcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IGxsLnZhbHVlO1xyXG4gICAgICBpZih+dmFsdWUuaW5kZXhPZihjb25maWcuQkVHSU4pICYmIH52YWx1ZS5pbmRleE9mKGNvbmZpZy5FTkQpICYmIG1kZiE9PSdjbXBsJyl7XHJcbiAgICAgICAgdmFyIGNvbnN0YW50ID0gdHJ1ZTtcclxuICAgICAgICB2YXIgcGFyc2VkID0gbmV3IFBhcnNlcih2YWx1ZSwgeyBtb2RlOiAyIH0pLnBhcnNlKCk7XHJcbiAgICAgICAgaWYocGFyc2VkLmxlbmd0aCA9PT0gMSAmJiBwYXJzZWRbMF0udHlwZSA9PT0gJ2V4cHJlc3Npb24nKSByZXR1cm4gcGFyc2VkWzBdO1xyXG4gICAgICAgIHZhciBib2R5ID0gW107XHJcbiAgICAgICAgcGFyc2VkLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICBpZighaXRlbS5jb25zdGFudCkgY29uc3RhbnQ9ZmFsc2U7XHJcbiAgICAgICAgICAvLyBzaWxlbnQgdGhlIG11dGlwbGUgaW50ZXBsYXRpb25cclxuICAgICAgICAgICAgYm9keS5wdXNoKGl0ZW0uYm9keSB8fCBcIidcIiArIGl0ZW0udGV4dC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIikgKyBcIidcIik7ICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBib2R5ID0gXCJbXCIgKyBib2R5LmpvaW4oXCIsXCIpICsgXCJdLmpvaW4oJycpXCI7XHJcbiAgICAgICAgdmFsdWUgPSBub2RlLmV4cHJlc3Npb24oYm9keSwgbnVsbCwgY29uc3RhbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIGNhc2UgXCJFWFBSX09QRU5cIjpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICAvLyBjYXNlIFwiT1BFTlwiOlxyXG4gICAgLy8gICBpZihsbC52YWx1ZSA9PT0gJ2luYycgfHwgbGwudmFsdWUgPT09ICdpbmNsdWRlJyl7XHJcbiAgICAvLyAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaW5jKCk7XHJcbiAgICAvLyAgIH1lbHNle1xyXG4gICAgLy8gICAgIHRoaXMuZXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBvbmx5IHN1cHBvcnQgaW50ZXBsYXRpb24gYW5kIHsjaW5jfSBzdGF0ZW1lbnQnKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7I319XHJcbm9wLmRpcmVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUgPSB0aGlzLmxsKCkudmFsdWU7XHJcbiAgdGhpcy5uZXh0KCk7XHJcbiAgaWYodHlwZW9mIHRoaXNbbmFtZV0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV0oKVxyXG4gIH1lbHNle1xyXG4gICAgdGhpcy5lcnJvcignVW5kZWZpbmVkIGRpcmVjdGl2ZVsnKyBuYW1lICsnXScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7fX1cclxub3AuaW50ZXJwbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCdFWFBSX09QRU4nKTtcclxuICB2YXIgcmVzID0gdGhpcy5leHByZXNzaW9uKHRydWUpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIHt7fn19XHJcbm9wLmluYyA9IG9wLmluY2x1ZGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb250ZW50ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIG5vZGUudGVtcGxhdGUoY29udGVudCk7XHJcbn1cclxuXHJcbi8vIHt7I2lmfX1cclxub3BbXCJpZlwiXSA9IGZ1bmN0aW9uKHRhZyl7XHJcbiAgdmFyIHRlc3QgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcblxyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG4gIHZhciBzdGF0ZW1lbnQgPSAhdGFnPyBcInN0YXRlbWVudFwiIDogXCJhdHRyc1wiO1xyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgdmFyIGxsLCBjbG9zZTtcclxuICB3aGlsZSggISAoY2xvc2UgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gICAgaWYoIGxsLnR5cGUgPT09ICdPUEVOJyApe1xyXG4gICAgICBzd2l0Y2goIGxsLnZhbHVlICl7XHJcbiAgICAgICAgY2FzZSAnZWxzZSc6XHJcbiAgICAgICAgICBjb250YWluZXIgPSBhbHRlcm5hdGU7XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIHRoaXMubWF0Y2goICdFTkQnICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdlbHNlaWYnOlxyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICBhbHRlcm5hdGUucHVzaCggdGhpc1tcImlmXCJdKHRhZykgKTtcclxuICAgICAgICAgIHJldHVybiBub2RlWydpZiddKCB0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUgKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29udGFpbmVyLnB1c2goIHRoaXNbc3RhdGVtZW50XSh0cnVlKSApO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpc1tzdGF0ZW1lbnRdKHRydWUpKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gaWYgc3RhdGVtZW50IG5vdCBtYXRjaGVkXHJcbiAgaWYoY2xvc2UudmFsdWUgIT09IFwiaWZcIikgdGhpcy5lcnJvcignVW5tYXRjaGVkIGlmIGRpcmVjdGl2ZScpXHJcbiAgcmV0dXJuIG5vZGVbXCJpZlwiXSh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xyXG59XHJcblxyXG5cclxuLy8gQG1hcmsgICBtdXN0YWNoZSBzeW50YXggaGF2ZSBuYXRydXJlIGRpcywgY2Fub3Qgd2l0aCBleHByZXNzaW9uXHJcbi8vIHt7I2xpc3R9fVxyXG5vcC5saXN0ID0gZnVuY3Rpb24oKXtcclxuICAvLyBzZXF1ZW5jZSBjYW4gYmUgYSBsaXN0IG9yIGhhc2hcclxuICB2YXIgc2VxdWVuY2UgPSB0aGlzLmV4cHJlc3Npb24oKSwgdmFyaWFibGUsIGxsLCB0cmFjaztcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0lERU5UJywgJ2FzJyk7XHJcblxyXG4gIHZhcmlhYmxlID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ0lERU5UJywgJ2J5Jykpe1xyXG4gICAgaWYodGhpcy5lYXQoJ0lERU5UJyx2YXJpYWJsZSArICdfaW5kZXgnKSl7XHJcbiAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICB0cmFjayA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gICAgICBpZih0cmFjay5jb25zdGFudCl7XHJcbiAgICAgICAgLy8gdHJ1ZSBpcyBtZWFucyBjb25zdGFudCwgd2UgaGFuZGxlIGl0IGp1c3QgbGlrZSB4eHhfaW5kZXguXHJcbiAgICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgd2hpbGUoICEobGwgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGlmKHRoaXMuZWF0KCdPUEVOJywgJ2Vsc2UnKSl7XHJcbiAgICAgIGNvbnRhaW5lciA9ICBhbHRlcm5hdGU7XHJcbiAgICAgIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBpZihsbC52YWx1ZSAhPT0gJ2xpc3QnKSB0aGlzLmVycm9yKCdleHBlY3QgJyArICdsaXN0IGdvdCAnICsgJy8nICsgbGwudmFsdWUgKyAnICcsIGxsLnBvcyApO1xyXG4gIHJldHVybiBub2RlLmxpc3Qoc2VxdWVuY2UsIHZhcmlhYmxlLCBjb25zZXF1ZW50LCBhbHRlcm5hdGUsIHRyYWNrKTtcclxufVxyXG5cclxuXHJcbm9wLmV4cHJlc3Npb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBleHByZXNzaW9uO1xyXG4gIGlmKHRoaXMuZWF0KCdAKCcpKXsgLy9vbmNlIGJpbmRcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICAgIGV4cHJlc3Npb24ub25jZSA9IHRydWU7XHJcbiAgICB0aGlzLm1hdGNoKCcpJylcclxuICB9ZWxzZXtcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICB9XHJcbiAgcmV0dXJuIGV4cHJlc3Npb247XHJcbn1cclxuXHJcbm9wLmV4cHIgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZGVwZW5kID0gW107XHJcblxyXG4gIHZhciBidWZmZXIgPSB0aGlzLmZpbHRlcigpXHJcblxyXG4gIHZhciBib2R5ID0gYnVmZmVyLmdldCB8fCBidWZmZXI7XHJcbiAgdmFyIHNldGJvZHkgPSBidWZmZXIuc2V0O1xyXG4gIHJldHVybiBub2RlLmV4cHJlc3Npb24oYm9keSwgc2V0Ym9keSwgIXRoaXMuZGVwZW5kLmxlbmd0aCwgYnVmZmVyLmZpbHRlcnMpO1xyXG59XHJcblxyXG5cclxuLy8gZmlsdGVyXHJcbi8vIGFzc2lnbiAoJ3wnIGZpbHRlcm5hbWVbJzonIGFyZ3NdKSAqIFxyXG5vcC5maWx0ZXIgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hc3NpZ24oKTtcclxuICB2YXIgbGwgPSB0aGlzLmVhdCgnfCcpO1xyXG4gIHZhciBidWZmZXIgPSBbXSwgZmlsdGVycyxzZXRCdWZmZXIsIHByZWZpeCxcclxuICAgIGF0dHIgPSBcInRcIiwgXHJcbiAgICBzZXQgPSBsZWZ0LnNldCwgZ2V0LCBcclxuICAgIHRtcCA9IFwiXCI7XHJcblxyXG4gIGlmKGxsKXtcclxuICAgIGlmKHNldCkge1xyXG4gICAgICBzZXRCdWZmZXIgPSBbXTtcclxuICAgICAgZmlsdGVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeCA9IFwiKGZ1bmN0aW9uKFwiICsgYXR0ciArIFwiKXtcIjtcclxuXHJcbiAgICBkb3tcclxuICAgICAgdmFyIGZpbHRlck5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICB0bXAgPSBhdHRyICsgXCIgPSBcIiArIGN0eE5hbWUgKyBcIi5fZl8oJ1wiICsgZmlsdGVyTmFtZSArIFwiJyApLmdldC5jYWxsKCBcIitfLmN0eE5hbWUgK1wiLFwiICsgYXR0ciA7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCc6Jykpe1xyXG4gICAgICAgIHRtcCArPVwiLCBcIisgdGhpcy5hcmd1bWVudHMoXCJ8XCIpLmpvaW4oXCIsXCIpICsgXCIpO1wiXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRtcCArPSAnKTsnXHJcbiAgICAgIH1cclxuICAgICAgYnVmZmVyLnB1c2godG1wKTtcclxuICAgICAgXHJcbiAgICAgIGlmKHNldCl7XHJcbiAgICAgICAgLy8gb25seSBpbiBydW50aW1lICx3ZSBjYW4gZGV0ZWN0ICB3aGV0aGVyICB0aGUgZmlsdGVyIGhhcyBhIHNldCBmdW5jdGlvbi4gXHJcbiAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlck5hbWUpO1xyXG4gICAgICAgIHNldEJ1ZmZlci51bnNoaWZ0KCB0bXAucmVwbGFjZShcIiApLmdldC5jYWxsXCIsIFwiICkuc2V0LmNhbGxcIikgKTtcclxuICAgICAgfVxyXG5cclxuICAgIH13aGlsZShsbCA9IHRoaXMuZWF0KCd8JykpO1xyXG4gICAgYnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyICk7XHJcbiAgICBzZXRCdWZmZXIgJiYgc2V0QnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyKTtcclxuXHJcbiAgICBnZXQgPSAgcHJlZml4ICsgYnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK2xlZnQuZ2V0K1wiKVwiO1xyXG4gICAgLy8gd2UgY2FsbCBiYWNrIHRvIHZhbHVlLlxyXG4gICAgaWYoc2V0QnVmZmVyKXtcclxuICAgICAgLy8gY2hhbmdlIF9zc19fKG5hbWUsIF9wXykgdG8gX3NfXyhuYW1lLCBmaWx0ZXJGbihfcF8pKTtcclxuICAgICAgc2V0ID0gc2V0LnJlcGxhY2UoXy5zZXROYW1lLCBcclxuICAgICAgICBwcmVmaXggKyBzZXRCdWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIr44CAXy5zZXROYW1l44CAK1wiKVwiICk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gdGhlIHNldCBmdW5jdGlvbiBpcyBkZXBlbmQgb24gdGhlIGZpbHRlciBkZWZpbml0aW9uLiBpZiBpdCBoYXZlIHNldCBtZXRob2QsIHRoZSBzZXQgd2lsbCB3b3JrXHJcbiAgICB2YXIgcmV0ID0gZ2V0c2V0KGdldCwgc2V0KTtcclxuICAgIHJldC5maWx0ZXJzID0gZmlsdGVycztcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBhc3NpZ25cclxuLy8gbGVmdC1oYW5kLWV4cHIgPSBjb25kaXRpb25cclxub3AuYXNzaWduID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuY29uZGl0aW9uKCksIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWyc9JywgJys9JywgJy09JywgJyo9JywgJy89JywgJyU9J10pKXtcclxuICAgIGlmKCFsZWZ0LnNldCkgdGhpcy5lcnJvcignaW52YWxpZCBsZWZ0aGFuZCBleHByZXNzaW9uIGluIGFzc2lnbm1lbnQgZXhwcmVzc2lvbicpO1xyXG4gICAgcmV0dXJuIGdldHNldCggbGVmdC5zZXQucmVwbGFjZSggXCIsXCIgKyBfLnNldE5hbWUsIFwiLFwiICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKS5yZXBsYWNlKFwiJz0nXCIsIFwiJ1wiK2xsLnR5cGUrXCInXCIpLCBsZWZ0LnNldCk7XHJcbiAgICAvLyByZXR1cm4gZ2V0c2V0KCcoJyArIGxlZnQuZ2V0ICsgbGwudHlwZSAgKyB0aGlzLmNvbmRpdGlvbigpLmdldCArICcpJywgbGVmdC5zZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gb3JcclxuLy8gb3IgPyBhc3NpZ24gOiBhc3NpZ25cclxub3AuY29uZGl0aW9uID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHRlc3QgPSB0aGlzLm9yKCk7XHJcbiAgaWYodGhpcy5lYXQoJz8nKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KFt0ZXN0LmdldCArIFwiP1wiLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXQsIFxyXG4gICAgICB0aGlzLm1hdGNoKFwiOlwiKS50eXBlLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXRdLmpvaW4oXCJcIikpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRlc3Q7XHJcbn1cclxuXHJcbi8vIGFuZFxyXG4vLyBhbmQgJiYgb3Jcclxub3Aub3IgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuYW5kKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCd8fCcpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnfHwnICsgdGhpcy5vcigpLmdldCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyBlcXVhbFxyXG4vLyBlcXVhbCAmJiBhbmRcclxub3AuYW5kID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmVxdWFsKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCcmJicpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnJiYnICsgdGhpcy5hbmQoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyByZWxhdGlvblxyXG4vLyBcclxuLy8gZXF1YWwgPT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT0gcmVsYXRpb25cclxuLy8gZXF1YWwgPT09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9PSByZWxhdGlvblxyXG5vcC5lcXVhbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJlbGF0aW9uKCksIGxsO1xyXG4gIC8vIEBwZXJmO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnPT0nLCchPScsICc9PT0nLCAnIT09J10pKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5lcXVhbCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gcmVsYXRpb24gPCBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIDw9IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID49IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIGluIGFkZGl0aXZlXHJcbm9wLnJlbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYWRkaXRpdmUoKSwgbGw7XHJcbiAgLy8gQHBlcmZcclxuICBpZihsbCA9ICh0aGlzLmVhdChbJzwnLCAnPicsICc+PScsICc8PSddKSB8fCB0aGlzLmVhdCgnSURFTlQnLCAnaW4nKSApKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMucmVsYXRpb24oKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIGFkZGl0aXZlIDpcclxuLy8gbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSArIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgLSBtdWx0aXZlXHJcbm9wLmFkZGl0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMubXVsdGl2ZSgpICxsbDtcclxuICBpZihsbD0gdGhpcy5lYXQoWycrJywnLSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5hZGRpdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gbXVsdGl2ZSA6XHJcbi8vIHVuYXJ5XHJcbi8vIG11bHRpdmUgKiB1bmFyeVxyXG4vLyBtdWx0aXZlIC8gdW5hcnlcclxuLy8gbXVsdGl2ZSAlIHVuYXJ5XHJcbm9wLm11bHRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yYW5nZSgpICxsbDtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJyonLCAnLycgLCclJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMubXVsdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5vcC5yYW5nZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnVuYXJ5KCksIGxsLCByaWdodDtcclxuXHJcbiAgaWYobGwgPSB0aGlzLmVhdCgnLi4nKSl7XHJcbiAgICByaWdodCA9IHRoaXMudW5hcnkoKTtcclxuICAgIHZhciBib2R5ID0gXHJcbiAgICAgIFwiKGZ1bmN0aW9uKHN0YXJ0LGVuZCl7dmFyIHJlcyA9IFtdLHN0ZXA9ZW5kPnN0YXJ0PzE6LTE7IGZvcih2YXIgaSA9IHN0YXJ0OyBlbmQ+c3RhcnQ/aSA8PSBlbmQ6IGk+PWVuZDsgaT1pK3N0ZXApe3Jlcy5wdXNoKGkpOyB9IHJldHVybiByZXMgfSkoXCIrbGVmdC5nZXQrXCIsXCIrcmlnaHQuZ2V0K1wiKVwiXHJcbiAgICByZXR1cm4gZ2V0c2V0KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gbGVmdGhhbmRcclxuLy8gKyB1bmFyeVxyXG4vLyAtIHVuYXJ5XHJcbi8vIH4gdW5hcnlcclxuLy8gISB1bmFyeVxyXG5vcC51bmFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWycrJywnLScsJ34nLCAnISddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCcoJyArIGxsLnR5cGUgKyB0aGlzLnVuYXJ5KCkuZ2V0ICsgJyknKSA7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gdGhpcy5tZW1iZXIoKVxyXG4gIH1cclxufVxyXG5cclxuLy8gY2FsbFtsZWZ0aGFuZF0gOlxyXG4vLyBtZW1iZXIgYXJnc1xyXG4vLyBtZW1iZXIgWyBleHByZXNzaW9uIF1cclxuLy8gbWVtYmVyIC4gaWRlbnQgIFxyXG5cclxub3AubWVtYmVyID0gZnVuY3Rpb24oYmFzZSwgbGFzdCwgcGF0aGVzLCBwcmV2QmFzZSl7XHJcbiAgdmFyIGxsLCBwYXRoLCBleHRWYWx1ZTtcclxuXHJcblxyXG4gIHZhciBvbmx5U2ltcGxlQWNjZXNzb3IgPSBmYWxzZTtcclxuICBpZighYmFzZSl7IC8vZmlyc3RcclxuICAgIHBhdGggPSB0aGlzLnByaW1hcnkoKTtcclxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhdGg7XHJcbiAgICBpZih0eXBlID09PSAnc3RyaW5nJyl7IFxyXG4gICAgICBwYXRoZXMgPSBbXTtcclxuICAgICAgcGF0aGVzLnB1c2goIHBhdGggKTtcclxuICAgICAgbGFzdCA9IHBhdGg7XHJcbiAgICAgIGV4dFZhbHVlID0gZXh0TmFtZSArIFwiLlwiICsgcGF0aFxyXG4gICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgcGF0aCArIFwiJywgXCIgKyB2YXJOYW1lICsgXCIsIFwiICsgZXh0TmFtZSArIFwiKVwiO1xyXG4gICAgICBvbmx5U2ltcGxlQWNjZXNzb3IgPSB0cnVlO1xyXG4gICAgfWVsc2V7IC8vUHJpbWF0aXZlIFR5cGVcclxuICAgICAgaWYocGF0aC5nZXQgPT09ICd0aGlzJyl7XHJcbiAgICAgICAgYmFzZSA9IGN0eE5hbWU7XHJcbiAgICAgICAgcGF0aGVzID0gWyd0aGlzJ107XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICAgICAgYmFzZSA9IHBhdGguZ2V0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7IC8vIG5vdCBmaXJzdCBlbnRlclxyXG4gICAgaWYodHlwZW9mIGxhc3QgPT09ICdzdHJpbmcnICYmIGlzUGF0aCggbGFzdCkgKXsgLy8gaXMgdmFsaWQgcGF0aFxyXG4gICAgICBwYXRoZXMucHVzaChsYXN0KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBpZihwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCkgdGhpcy5kZXBlbmQucHVzaChwYXRoZXMpO1xyXG4gICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZihsbCA9IHRoaXMuZWF0KFsnWycsICcuJywgJygnXSkpe1xyXG4gICAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgICBjYXNlICcuJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICB2YXIgdG1wTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHRtcE5hbWUgKyBcIicsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIlsnXCIgKyB0bXBOYW1lICsgXCInXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoIGJhc2UsIHRtcE5hbWUsIHBhdGhlcywgIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnWyc6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgcGF0aCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgIC8vIG1lYW5zIGZ1bmN0aW9uIGNhbGwsIHdlIG5lZWQgdGhyb3cgdW5kZWZpbmVkIGVycm9yIHdoZW4gY2FsbCBmdW5jdGlvblxyXG4gICAgICAgIC8vIGFuZCBjb25maXJtIHRoYXQgdGhlIGZ1bmN0aW9uIGNhbGwgd29udCBsb3NlIGl0cyBjb250ZXh0XHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oXCIgKyBwYXRoLmdldCArIFwiLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbXCIgKyBwYXRoLmdldCArIFwiXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1hdGNoKCddJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgcGF0aCwgcGF0aGVzLCBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJygnOlxyXG4gICAgICAgIC8vIGNhbGwoY2FsbGVlLCBhcmdzKVxyXG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHMoKS5qb2luKCcsJyk7XHJcbiAgICAgICAgYmFzZSA9ICBiYXNlK1wiKFwiICsgYXJncyArXCIpXCI7XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIG51bGwsIHBhdGhlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCBwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCApIHRoaXMuZGVwZW5kLnB1c2goIHBhdGhlcyApO1xyXG4gIHZhciByZXMgPSAge2dldDogYmFzZX07XHJcbiAgaWYobGFzdCl7XHJcbiAgICByZXMuc2V0ID0gY3R4TmFtZSArIFwiLl9zc18oXCIgKyBcclxuICAgICAgICAobGFzdC5nZXQ/IGxhc3QuZ2V0IDogXCInXCIrIGxhc3QgKyBcIidcIikgKyBcclxuICAgICAgICBcIixcIisgXy5zZXROYW1lICsgXCIsXCIrIFxyXG4gICAgICAgIChwcmV2QmFzZT9wcmV2QmFzZTpfLnZhck5hbWUpICsgXHJcbiAgICAgICAgXCIsICc9JywgXCIrICggb25seVNpbXBsZUFjY2Vzc29yPyAxIDogMCApICsgXCIpXCI7XHJcbiAgXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcbm9wLmFyZ3VtZW50cyA9IGZ1bmN0aW9uKGVuZCl7XHJcbiAgZW5kID0gZW5kIHx8ICcpJ1xyXG4gIHZhciBhcmdzID0gW107XHJcbiAgZG97XHJcbiAgICBpZih0aGlzLmxhKCkgIT09IGVuZCl7XHJcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmFzc2lnbigpLmdldClcclxuICAgIH1cclxuICB9d2hpbGUoIHRoaXMuZWF0KCcsJykpO1xyXG4gIHJldHVybiBhcmdzXHJcbn1cclxuXHJcblxyXG4vLyBwcmltYXJ5IDpcclxuLy8gdGhpcyBcclxuLy8gaWRlbnRcclxuLy8gbGl0ZXJhbFxyXG4vLyBhcnJheVxyXG4vLyBvYmplY3RcclxuLy8gKCBleHByZXNzaW9uIClcclxuXHJcbm9wLnByaW1hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwie1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcclxuICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XHJcbiAgICBjYXNlIFwiKFwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbigpO1xyXG4gICAgLy8gbGl0ZXJhbCBvciBpZGVudFxyXG4gICAgY2FzZSAnU1RSSU5HJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IFwiXCIgKyBsbC52YWx1ZTtcclxuICAgICAgdmFyIHF1b3RhID0gfnZhbHVlLmluZGV4T2YoXCInXCIpPyBcIlxcXCJcIjogXCInXCIgO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KHF1b3RhICsgdmFsdWUgKyBxdW90YSk7XHJcbiAgICBjYXNlICdOVU1CRVInOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgcmV0dXJuIGdldHNldCggXCJcIiArIGxsLnZhbHVlICk7XHJcbiAgICBjYXNlIFwiSURFTlRcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIGlmKGlzS2V5V29yZChsbC52YWx1ZSkpe1xyXG4gICAgICAgIHJldHVybiBnZXRzZXQoIGxsLnZhbHVlICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxsLnZhbHVlO1xyXG4gICAgZGVmYXVsdDogXHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgVG9rZW46ICcgKyBsbC50eXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIG9iamVjdFxyXG4vLyAge3Byb3BBc3NpZ24gWywgcHJvcEFzc2lnbl0gKiBbLF19XHJcblxyXG4vLyBwcm9wQXNzaWduXHJcbi8vICBwcm9wIDogYXNzaWduXHJcblxyXG4vLyBwcm9wXHJcbi8vICBTVFJJTkdcclxuLy8gIElERU5UXHJcbi8vICBOVU1CRVJcclxuXHJcbm9wLm9iamVjdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgneycpLnR5cGVdO1xyXG5cclxuICB2YXIgbGwgPSB0aGlzLmVhdCggWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10gKTtcclxuICB3aGlsZShsbCl7XHJcbiAgICBjb2RlLnB1c2goXCInXCIgKyBsbC52YWx1ZSArIFwiJ1wiICsgdGhpcy5tYXRjaCgnOicpLnR5cGUpO1xyXG4gICAgdmFyIGdldCA9IHRoaXMuYXNzaWduKCkuZ2V0O1xyXG4gICAgY29kZS5wdXNoKGdldCk7XHJcbiAgICBsbCA9IG51bGw7XHJcbiAgICBpZih0aGlzLmVhdChcIixcIikgJiYgKGxsID0gdGhpcy5lYXQoWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10pKSApIGNvZGUucHVzaChcIixcIik7XHJcbiAgfVxyXG4gIGNvZGUucHVzaCh0aGlzLm1hdGNoKCd9JykudHlwZSk7XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX1cclxufVxyXG5cclxuLy8gYXJyYXlcclxuLy8gWyBhc3NpZ25bLGFzc2lnbl0qXVxyXG5vcC5hcnJheSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgnWycpLnR5cGVdLCBpdGVtO1xyXG4gIGlmKCB0aGlzLmVhdChcIl1cIikgKXtcclxuXHJcbiAgICAgY29kZS5wdXNoKFwiXVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUoaXRlbSA9IHRoaXMuYXNzaWduKCkpe1xyXG4gICAgICBjb2RlLnB1c2goaXRlbS5nZXQpO1xyXG4gICAgICBpZih0aGlzLmVhdCgnLCcpKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gICAgICBlbHNlIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ10nKS50eXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX07XHJcbn1cclxuXHJcbi8vICcoJyBleHByZXNzaW9uICcpJ1xyXG5vcC5wYXJlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnKCcpO1xyXG4gIHZhciByZXMgPSB0aGlzLmZpbHRlcigpXHJcbiAgcmVzLmdldCA9ICcoJyArIHJlcy5nZXQgKyAnKSc7XHJcbiAgcmVzLnNldCA9IHJlcy5zZXQ7XHJcbiAgdGhpcy5tYXRjaCgnKScpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldHNldChnZXQsIHNldCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGdldDogZ2V0LFxyXG4gICAgc2V0OiBzZXRcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUGFyc2VyL3NyYy9QYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fc2V0aW1tZWRpYXRlQDEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc2hpbSBmb3IgZXM1XHJcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xyXG52YXIgdHN0ciA9ICh7fSkudG9TdHJpbmc7XHJcblxyXG5mdW5jdGlvbiBleHRlbmQobzEsIG8yICl7XHJcbiAgZm9yKHZhciBpIGluIG8yKSBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICBvMVtpXSA9IG8yW2ldXHJcbiAgfVxyXG4gIHJldHVybiBvMjtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuICAvLyBTdHJpbmcgcHJvdG8gO1xyXG4gIGV4dGVuZChTdHJpbmcucHJvdG90eXBlLCB7XHJcbiAgICB0cmltOiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICAvLyBBcnJheSBwcm90bztcclxuICBleHRlbmQoQXJyYXkucHJvdG90eXBlLCB7XHJcbiAgICBpbmRleE9mOiBmdW5jdGlvbihvYmosIGZyb20pe1xyXG4gICAgICBmcm9tID0gZnJvbSB8fCAwO1xyXG4gICAgICBmb3IgKHZhciBpID0gZnJvbSwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHJldHVybiBpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH0sXHJcbiAgICAvLyBwb2x5ZmlsbCBmcm9tIE1ETiBcclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZvckVhY2hcclxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjdHgpe1xyXG4gICAgICB2YXIgayA9IDA7XHJcblxyXG4gICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZyB0aGUgfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cclxuICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7IFxyXG5cclxuICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiApIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCBjYWxsYmFjayArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICAgIHdoaWxlKCBrIDwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIga1ZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoIGsgaW4gTyApIHtcclxuXHJcbiAgICAgICAgICBrVmFsdWUgPSBPWyBrIF07XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2suY2FsbCggY3R4LCBrVmFsdWUsIGssIE8gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaysrO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQGRlcHJlY2F0ZWRcclxuICAgIC8vICB3aWxsIGJlIHJlbW92ZWQgYXQgMC41LjBcclxuICAgIGZpbHRlcjogZnVuY3Rpb24oZnVuLCBjb250ZXh0KXtcclxuXHJcbiAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XHJcbiAgICAgIGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKGkgaW4gdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICB2YXIgdmFsID0gdFtpXTtcclxuICAgICAgICAgIGlmIChmdW4uY2FsbChjb250ZXh0LCB2YWwsIGksIHQpKVxyXG4gICAgICAgICAgICByZXMucHVzaCh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gRnVuY3Rpb24gcHJvdG87XHJcbiAgZXh0ZW5kKEZ1bmN0aW9uLnByb3RvdHlwZSwge1xyXG4gICAgYmluZDogZnVuY3Rpb24oY29udGV4dCl7XHJcbiAgICAgIHZhciBmbiA9IHRoaXM7XHJcbiAgICAgIHZhciBwcmVBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgYXJncyA9IHByZUFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICBcclxuICAvLyBBcnJheVxyXG4gIGV4dGVuZChBcnJheSwge1xyXG4gICAgaXNBcnJheTogZnVuY3Rpb24oYXJyKXtcclxuICAgICAgcmV0dXJuIHRzdHIuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvUGFyc2VyL2hlbHBlci9zaGltLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNTQwNjQvaG93LXRvLWNvbnZlcnQtY2hhcmFjdGVycy10by1odG1sLWVudGl0aWVzLXVzaW5nLXBsYWluLWphdmFzY3JpcHRcclxudmFyIGVudGl0aWVzID0ge1xyXG4gICdxdW90JzozNCwgXHJcbiAgJ2FtcCc6MzgsIFxyXG4gICdhcG9zJzozOSwgXHJcbiAgJ2x0Jzo2MCwgXHJcbiAgJ2d0Jzo2MiwgXHJcbiAgJ25ic3AnOjE2MCwgXHJcbiAgJ2lleGNsJzoxNjEsIFxyXG4gICdjZW50JzoxNjIsIFxyXG4gICdwb3VuZCc6MTYzLCBcclxuICAnY3VycmVuJzoxNjQsIFxyXG4gICd5ZW4nOjE2NSwgXHJcbiAgJ2JydmJhcic6MTY2LCBcclxuICAnc2VjdCc6MTY3LCBcclxuICAndW1sJzoxNjgsIFxyXG4gICdjb3B5JzoxNjksIFxyXG4gICdvcmRmJzoxNzAsIFxyXG4gICdsYXF1byc6MTcxLCBcclxuICAnbm90JzoxNzIsIFxyXG4gICdzaHknOjE3MywgXHJcbiAgJ3JlZyc6MTc0LCBcclxuICAnbWFjcic6MTc1LCBcclxuICAnZGVnJzoxNzYsIFxyXG4gICdwbHVzbW4nOjE3NywgXHJcbiAgJ3N1cDInOjE3OCwgXHJcbiAgJ3N1cDMnOjE3OSwgXHJcbiAgJ2FjdXRlJzoxODAsIFxyXG4gICdtaWNybyc6MTgxLCBcclxuICAncGFyYSc6MTgyLCBcclxuICAnbWlkZG90JzoxODMsIFxyXG4gICdjZWRpbCc6MTg0LCBcclxuICAnc3VwMSc6MTg1LCBcclxuICAnb3JkbSc6MTg2LCBcclxuICAncmFxdW8nOjE4NywgXHJcbiAgJ2ZyYWMxNCc6MTg4LCBcclxuICAnZnJhYzEyJzoxODksIFxyXG4gICdmcmFjMzQnOjE5MCwgXHJcbiAgJ2lxdWVzdCc6MTkxLCBcclxuICAnQWdyYXZlJzoxOTIsIFxyXG4gICdBYWN1dGUnOjE5MywgXHJcbiAgJ0FjaXJjJzoxOTQsIFxyXG4gICdBdGlsZGUnOjE5NSwgXHJcbiAgJ0F1bWwnOjE5NiwgXHJcbiAgJ0FyaW5nJzoxOTcsIFxyXG4gICdBRWxpZyc6MTk4LCBcclxuICAnQ2NlZGlsJzoxOTksIFxyXG4gICdFZ3JhdmUnOjIwMCwgXHJcbiAgJ0VhY3V0ZSc6MjAxLCBcclxuICAnRWNpcmMnOjIwMiwgXHJcbiAgJ0V1bWwnOjIwMywgXHJcbiAgJ0lncmF2ZSc6MjA0LCBcclxuICAnSWFjdXRlJzoyMDUsIFxyXG4gICdJY2lyYyc6MjA2LCBcclxuICAnSXVtbCc6MjA3LCBcclxuICAnRVRIJzoyMDgsIFxyXG4gICdOdGlsZGUnOjIwOSwgXHJcbiAgJ09ncmF2ZSc6MjEwLCBcclxuICAnT2FjdXRlJzoyMTEsIFxyXG4gICdPY2lyYyc6MjEyLCBcclxuICAnT3RpbGRlJzoyMTMsIFxyXG4gICdPdW1sJzoyMTQsIFxyXG4gICd0aW1lcyc6MjE1LCBcclxuICAnT3NsYXNoJzoyMTYsIFxyXG4gICdVZ3JhdmUnOjIxNywgXHJcbiAgJ1VhY3V0ZSc6MjE4LCBcclxuICAnVWNpcmMnOjIxOSwgXHJcbiAgJ1V1bWwnOjIyMCwgXHJcbiAgJ1lhY3V0ZSc6MjIxLCBcclxuICAnVEhPUk4nOjIyMiwgXHJcbiAgJ3N6bGlnJzoyMjMsIFxyXG4gICdhZ3JhdmUnOjIyNCwgXHJcbiAgJ2FhY3V0ZSc6MjI1LCBcclxuICAnYWNpcmMnOjIyNiwgXHJcbiAgJ2F0aWxkZSc6MjI3LCBcclxuICAnYXVtbCc6MjI4LCBcclxuICAnYXJpbmcnOjIyOSwgXHJcbiAgJ2FlbGlnJzoyMzAsIFxyXG4gICdjY2VkaWwnOjIzMSwgXHJcbiAgJ2VncmF2ZSc6MjMyLCBcclxuICAnZWFjdXRlJzoyMzMsIFxyXG4gICdlY2lyYyc6MjM0LCBcclxuICAnZXVtbCc6MjM1LCBcclxuICAnaWdyYXZlJzoyMzYsIFxyXG4gICdpYWN1dGUnOjIzNywgXHJcbiAgJ2ljaXJjJzoyMzgsIFxyXG4gICdpdW1sJzoyMzksIFxyXG4gICdldGgnOjI0MCwgXHJcbiAgJ250aWxkZSc6MjQxLCBcclxuICAnb2dyYXZlJzoyNDIsIFxyXG4gICdvYWN1dGUnOjI0MywgXHJcbiAgJ29jaXJjJzoyNDQsIFxyXG4gICdvdGlsZGUnOjI0NSwgXHJcbiAgJ291bWwnOjI0NiwgXHJcbiAgJ2RpdmlkZSc6MjQ3LCBcclxuICAnb3NsYXNoJzoyNDgsIFxyXG4gICd1Z3JhdmUnOjI0OSwgXHJcbiAgJ3VhY3V0ZSc6MjUwLCBcclxuICAndWNpcmMnOjI1MSwgXHJcbiAgJ3V1bWwnOjI1MiwgXHJcbiAgJ3lhY3V0ZSc6MjUzLCBcclxuICAndGhvcm4nOjI1NCwgXHJcbiAgJ3l1bWwnOjI1NSwgXHJcbiAgJ2Zub2YnOjQwMiwgXHJcbiAgJ0FscGhhJzo5MTMsIFxyXG4gICdCZXRhJzo5MTQsIFxyXG4gICdHYW1tYSc6OTE1LCBcclxuICAnRGVsdGEnOjkxNiwgXHJcbiAgJ0Vwc2lsb24nOjkxNywgXHJcbiAgJ1pldGEnOjkxOCwgXHJcbiAgJ0V0YSc6OTE5LCBcclxuICAnVGhldGEnOjkyMCwgXHJcbiAgJ0lvdGEnOjkyMSwgXHJcbiAgJ0thcHBhJzo5MjIsIFxyXG4gICdMYW1iZGEnOjkyMywgXHJcbiAgJ011Jzo5MjQsIFxyXG4gICdOdSc6OTI1LCBcclxuICAnWGknOjkyNiwgXHJcbiAgJ09taWNyb24nOjkyNywgXHJcbiAgJ1BpJzo5MjgsIFxyXG4gICdSaG8nOjkyOSwgXHJcbiAgJ1NpZ21hJzo5MzEsIFxyXG4gICdUYXUnOjkzMiwgXHJcbiAgJ1Vwc2lsb24nOjkzMywgXHJcbiAgJ1BoaSc6OTM0LCBcclxuICAnQ2hpJzo5MzUsIFxyXG4gICdQc2knOjkzNiwgXHJcbiAgJ09tZWdhJzo5MzcsIFxyXG4gICdhbHBoYSc6OTQ1LCBcclxuICAnYmV0YSc6OTQ2LCBcclxuICAnZ2FtbWEnOjk0NywgXHJcbiAgJ2RlbHRhJzo5NDgsIFxyXG4gICdlcHNpbG9uJzo5NDksIFxyXG4gICd6ZXRhJzo5NTAsIFxyXG4gICdldGEnOjk1MSwgXHJcbiAgJ3RoZXRhJzo5NTIsIFxyXG4gICdpb3RhJzo5NTMsIFxyXG4gICdrYXBwYSc6OTU0LCBcclxuICAnbGFtYmRhJzo5NTUsIFxyXG4gICdtdSc6OTU2LCBcclxuICAnbnUnOjk1NywgXHJcbiAgJ3hpJzo5NTgsIFxyXG4gICdvbWljcm9uJzo5NTksIFxyXG4gICdwaSc6OTYwLCBcclxuICAncmhvJzo5NjEsIFxyXG4gICdzaWdtYWYnOjk2MiwgXHJcbiAgJ3NpZ21hJzo5NjMsIFxyXG4gICd0YXUnOjk2NCwgXHJcbiAgJ3Vwc2lsb24nOjk2NSwgXHJcbiAgJ3BoaSc6OTY2LCBcclxuICAnY2hpJzo5NjcsIFxyXG4gICdwc2knOjk2OCwgXHJcbiAgJ29tZWdhJzo5NjksIFxyXG4gICd0aGV0YXN5bSc6OTc3LCBcclxuICAndXBzaWgnOjk3OCwgXHJcbiAgJ3Bpdic6OTgyLCBcclxuICAnYnVsbCc6ODIyNiwgXHJcbiAgJ2hlbGxpcCc6ODIzMCwgXHJcbiAgJ3ByaW1lJzo4MjQyLCBcclxuICAnUHJpbWUnOjgyNDMsIFxyXG4gICdvbGluZSc6ODI1NCwgXHJcbiAgJ2ZyYXNsJzo4MjYwLCBcclxuICAnd2VpZXJwJzo4NDcyLCBcclxuICAnaW1hZ2UnOjg0NjUsIFxyXG4gICdyZWFsJzo4NDc2LCBcclxuICAndHJhZGUnOjg0ODIsIFxyXG4gICdhbGVmc3ltJzo4NTAxLCBcclxuICAnbGFycic6ODU5MiwgXHJcbiAgJ3VhcnInOjg1OTMsIFxyXG4gICdyYXJyJzo4NTk0LCBcclxuICAnZGFycic6ODU5NSwgXHJcbiAgJ2hhcnInOjg1OTYsIFxyXG4gICdjcmFycic6ODYyOSwgXHJcbiAgJ2xBcnInOjg2NTYsIFxyXG4gICd1QXJyJzo4NjU3LCBcclxuICAnckFycic6ODY1OCwgXHJcbiAgJ2RBcnInOjg2NTksIFxyXG4gICdoQXJyJzo4NjYwLCBcclxuICAnZm9yYWxsJzo4NzA0LCBcclxuICAncGFydCc6ODcwNiwgXHJcbiAgJ2V4aXN0Jzo4NzA3LCBcclxuICAnZW1wdHknOjg3MDksIFxyXG4gICduYWJsYSc6ODcxMSwgXHJcbiAgJ2lzaW4nOjg3MTIsIFxyXG4gICdub3Rpbic6ODcxMywgXHJcbiAgJ25pJzo4NzE1LCBcclxuICAncHJvZCc6ODcxOSwgXHJcbiAgJ3N1bSc6ODcyMSwgXHJcbiAgJ21pbnVzJzo4NzIyLCBcclxuICAnbG93YXN0Jzo4NzI3LCBcclxuICAncmFkaWMnOjg3MzAsIFxyXG4gICdwcm9wJzo4NzMzLCBcclxuICAnaW5maW4nOjg3MzQsIFxyXG4gICdhbmcnOjg3MzYsIFxyXG4gICdhbmQnOjg3NDMsIFxyXG4gICdvcic6ODc0NCwgXHJcbiAgJ2NhcCc6ODc0NSwgXHJcbiAgJ2N1cCc6ODc0NiwgXHJcbiAgJ2ludCc6ODc0NywgXHJcbiAgJ3RoZXJlNCc6ODc1NiwgXHJcbiAgJ3NpbSc6ODc2NCwgXHJcbiAgJ2NvbmcnOjg3NzMsIFxyXG4gICdhc3ltcCc6ODc3NiwgXHJcbiAgJ25lJzo4ODAwLCBcclxuICAnZXF1aXYnOjg4MDEsIFxyXG4gICdsZSc6ODgwNCwgXHJcbiAgJ2dlJzo4ODA1LCBcclxuICAnc3ViJzo4ODM0LCBcclxuICAnc3VwJzo4ODM1LCBcclxuICAnbnN1Yic6ODgzNiwgXHJcbiAgJ3N1YmUnOjg4MzgsIFxyXG4gICdzdXBlJzo4ODM5LCBcclxuICAnb3BsdXMnOjg4NTMsIFxyXG4gICdvdGltZXMnOjg4NTUsIFxyXG4gICdwZXJwJzo4ODY5LCBcclxuICAnc2RvdCc6ODkwMSwgXHJcbiAgJ2xjZWlsJzo4OTY4LCBcclxuICAncmNlaWwnOjg5NjksIFxyXG4gICdsZmxvb3InOjg5NzAsIFxyXG4gICdyZmxvb3InOjg5NzEsIFxyXG4gICdsYW5nJzo5MDAxLCBcclxuICAncmFuZyc6OTAwMiwgXHJcbiAgJ2xveic6OTY3NCwgXHJcbiAgJ3NwYWRlcyc6OTgyNCwgXHJcbiAgJ2NsdWJzJzo5ODI3LCBcclxuICAnaGVhcnRzJzo5ODI5LCBcclxuICAnZGlhbXMnOjk4MzAsIFxyXG4gICdPRWxpZyc6MzM4LCBcclxuICAnb2VsaWcnOjMzOSwgXHJcbiAgJ1NjYXJvbic6MzUyLCBcclxuICAnc2Nhcm9uJzozNTMsIFxyXG4gICdZdW1sJzozNzYsIFxyXG4gICdjaXJjJzo3MTAsIFxyXG4gICd0aWxkZSc6NzMyLCBcclxuICAnZW5zcCc6ODE5NCwgXHJcbiAgJ2Vtc3AnOjgxOTUsIFxyXG4gICd0aGluc3AnOjgyMDEsIFxyXG4gICd6d25qJzo4MjA0LCBcclxuICAnendqJzo4MjA1LCBcclxuICAnbHJtJzo4MjA2LCBcclxuICAncmxtJzo4MjA3LCBcclxuICAnbmRhc2gnOjgyMTEsIFxyXG4gICdtZGFzaCc6ODIxMiwgXHJcbiAgJ2xzcXVvJzo4MjE2LCBcclxuICAncnNxdW8nOjgyMTcsIFxyXG4gICdzYnF1byc6ODIxOCwgXHJcbiAgJ2xkcXVvJzo4MjIwLCBcclxuICAncmRxdW8nOjgyMjEsIFxyXG4gICdiZHF1byc6ODIyMiwgXHJcbiAgJ2RhZ2dlcic6ODIyNCwgXHJcbiAgJ0RhZ2dlcic6ODIyNSwgXHJcbiAgJ3Blcm1pbCc6ODI0MCwgXHJcbiAgJ2xzYXF1byc6ODI0OSwgXHJcbiAgJ3JzYXF1byc6ODI1MCwgXHJcbiAgJ2V1cm8nOjgzNjRcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgPSBlbnRpdGllcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9QYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBlbGVtZW50OiBmdW5jdGlvbihuYW1lLCBhdHRycywgY2hpbGRyZW4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2VsZW1lbnQnLFxyXG4gICAgICB0YWc6IG5hbWUsXHJcbiAgICAgIGF0dHJzOiBhdHRycyxcclxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXHJcbiAgICB9XHJcbiAgfSxcclxuICBhdHRyaWJ1dGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtZGYpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgbWRmOiBtZGZcclxuICAgIH1cclxuICB9LFxyXG4gIFwiaWZcIjogZnVuY3Rpb24odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdpZicsXHJcbiAgICAgIHRlc3Q6IHRlc3QsXHJcbiAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnQsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlXHJcbiAgICB9XHJcbiAgfSxcclxuICBsaXN0OiBmdW5jdGlvbihzZXF1ZW5jZSwgdmFyaWFibGUsIGJvZHksIGFsdGVybmF0ZSwgdHJhY2spe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2xpc3QnLFxyXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlLFxyXG4gICAgICB2YXJpYWJsZTogdmFyaWFibGUsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIHRyYWNrOiB0cmFja1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZXhwcmVzc2lvbjogZnVuY3Rpb24oIGJvZHksIHNldGJvZHksIGNvbnN0YW50LCBmaWx0ZXJzICl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcImV4cHJlc3Npb25cIixcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgY29uc3RhbnQ6IGNvbnN0YW50IHx8IGZhbHNlLFxyXG4gICAgICBzZXRib2R5OiBzZXRib2R5IHx8IGZhbHNlLFxyXG4gICAgICBmaWx0ZXJzOiBmaWx0ZXJzXHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICB0ZXh0OiB0ZXh0XHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ3RlbXBsYXRlJyxcclxuICAgICAgY29udGVudDogdGVtcGxhdGVcclxuICAgIH1cclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9QYXJzZXIvc3JjL25vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzXCIpO1xyXG5cclxuLy8gc29tZSBjdXN0b20gdGFnICB3aWxsIGNvbmZsaWN0IHdpdGggdGhlIExleGVyIHByb2dyZXNzXHJcbnZhciBjb25mbGljdFRhZyA9IHtcIn1cIjogXCJ7XCIsIFwiXVwiOiBcIltcIn0sIG1hcDEsIG1hcDI7XHJcbi8vIHNvbWUgbWFjcm8gZm9yIGxleGVyXHJcbnZhciBtYWNybyA9IHtcclxuICAnTkFNRSc6IC8oPzpbOl9BLVphLXpdWy1cXC46XzAtOUEtWmEtel0qKS8sXHJcbiAgJ0lERU5UJzogL1tcXCRfQS1aYS16XVtfMC05QS1aYS16XFwkXSovLFxyXG4gICdTUEFDRSc6IC9bXFxyXFxuXFx0XFxmIF0vXHJcbn1cclxuXHJcblxyXG52YXIgdGVzdCA9IC9hfChiKS8uZXhlYyhcImFcIik7XHJcbnZhciB0ZXN0U3ViQ2FwdXJlID0gdGVzdCAmJiB0ZXN0WzFdID09PSB1bmRlZmluZWQ/IFxyXG4gIGZ1bmN0aW9uKHN0cil7IHJldHVybiBzdHIgIT09IHVuZGVmaW5lZCB9XHJcbiAgOmZ1bmN0aW9uKHN0cil7cmV0dXJuICEhc3RyfTtcclxuXHJcbmZ1bmN0aW9uIHdyYXBIYW5kZXIoaGFuZGxlcil7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4ge3R5cGU6IGhhbmRsZXIsIHZhbHVlOiBhbGwgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gTGV4ZXIoaW5wdXQsIG9wdHMpe1xyXG4gIGlmKGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdKXtcclxuICAgIHRoaXMubWFya1N0YXJ0ID0gY29uZmxpY3RUYWdbY29uZmlnLkVORF07XHJcbiAgICB0aGlzLm1hcmtFbmQgPSBjb25maWcuRU5EO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pbnB1dCA9IChpbnB1dHx8XCJcIikudHJpbSgpO1xyXG4gIHRoaXMub3B0cyA9IG9wdHMgfHwge307XHJcbiAgdGhpcy5tYXAgPSB0aGlzLm9wdHMubW9kZSAhPT0gMj8gIG1hcDE6IG1hcDI7XHJcbiAgdGhpcy5zdGF0ZXMgPSBbXCJJTklUXCJdO1xyXG4gIGlmKG9wdHMgJiYgb3B0cy5leHByZXNzaW9uKXtcclxuICAgICB0aGlzLnN0YXRlcy5wdXNoKFwiSlNUXCIpO1xyXG4gICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgbG8gPSBMZXhlci5wcm90b3R5cGVcclxuXHJcblxyXG5sby5sZXggPSBmdW5jdGlvbihzdHIpe1xyXG4gIHN0ciA9IChzdHIgfHwgdGhpcy5pbnB1dCkudHJpbSgpO1xyXG4gIHZhciB0b2tlbnMgPSBbXSwgc3BsaXQsIHRlc3QsbWxlbiwgdG9rZW4sIHN0YXRlO1xyXG4gIHRoaXMuaW5wdXQgPSBzdHIsIFxyXG4gIHRoaXMubWFya3MgPSAwO1xyXG4gIC8vIGluaXQgdGhlIHBvcyBpbmRleFxyXG4gIHRoaXMuaW5kZXg9MDtcclxuICB2YXIgaSA9IDA7XHJcbiAgd2hpbGUoc3RyKXtcclxuICAgIGkrK1xyXG4gICAgc3RhdGUgPSB0aGlzLnN0YXRlKCk7XHJcbiAgICBzcGxpdCA9IHRoaXMubWFwW3N0YXRlXSBcclxuICAgIHRlc3QgPSBzcGxpdC5UUlVOSy5leGVjKHN0cik7XHJcbiAgICBpZighdGVzdCl7XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VucmVjb2dpbml6ZWQgVG9rZW4nKTtcclxuICAgIH1cclxuICAgIG1sZW4gPSB0ZXN0WzBdLmxlbmd0aDtcclxuICAgIHN0ciA9IHN0ci5zbGljZShtbGVuKVxyXG4gICAgdG9rZW4gPSB0aGlzLl9wcm9jZXNzLmNhbGwodGhpcywgdGVzdCwgc3BsaXQsIHN0cilcclxuICAgIGlmKHRva2VuKSB0b2tlbnMucHVzaCh0b2tlbilcclxuICAgIHRoaXMuaW5kZXggKz0gbWxlbjtcclxuICAgIC8vIGlmKHN0YXRlID09ICdUQUcnIHx8IHN0YXRlID09ICdKU1QnKSBzdHIgPSB0aGlzLnNraXBzcGFjZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgdG9rZW5zLnB1c2goe3R5cGU6ICdFT0YnfSk7XHJcblxyXG4gIHJldHVybiB0b2tlbnM7XHJcbn1cclxuXHJcbmxvLmVycm9yID0gZnVuY3Rpb24obXNnKXtcclxuICB0aHJvdyAgRXJyb3IoXCJQYXJzZSBFcnJvcjogXCIgKyBtc2cgKyAgJzpcXG4nICsgXy50cmFja0Vycm9yUG9zKHRoaXMuaW5wdXQsIHRoaXMuaW5kZXgpKTtcclxufVxyXG5cclxubG8uX3Byb2Nlc3MgPSBmdW5jdGlvbihhcmdzLCBzcGxpdCxzdHIpe1xyXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3Muam9pbihcIixcIiksIHRoaXMuc3RhdGUoKSlcclxuICB2YXIgbGlua3MgPSBzcGxpdC5saW5rcywgbWFyY2hlZCA9IGZhbHNlLCB0b2tlbjtcclxuXHJcbiAgZm9yKHZhciBsZW4gPSBsaW5rcy5sZW5ndGgsIGk9MDtpPGxlbiA7aSsrKXtcclxuICAgIHZhciBsaW5rID0gbGlua3NbaV0sXHJcbiAgICAgIGhhbmRsZXIgPSBsaW5rWzJdLFxyXG4gICAgICBpbmRleCA9IGxpbmtbMF07XHJcbiAgICAvLyBpZihhcmdzWzZdID09PSAnPicgJiYgaW5kZXggPT09IDYpIGNvbnNvbGUubG9nKCdoYWhhJylcclxuICAgIGlmKHRlc3RTdWJDYXB1cmUoYXJnc1tpbmRleF0pKSB7XHJcbiAgICAgIG1hcmNoZWQgPSB0cnVlO1xyXG4gICAgICBpZihoYW5kbGVyKXtcclxuICAgICAgICB0b2tlbiA9IGhhbmRsZXIuYXBwbHkodGhpcywgYXJncy5zbGljZShpbmRleCwgaW5kZXggKyBsaW5rWzFdKSlcclxuICAgICAgICBpZih0b2tlbikgIHRva2VuLnBvcyA9IHRoaXMuaW5kZXg7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCFtYXJjaGVkKXsgLy8gaW4gaWUgbHQ4IC4gc3ViIGNhcHR1cmUgaXMgXCJcIiBidXQgb250IFxyXG4gICAgc3dpdGNoKHN0ci5jaGFyQXQoMCkpe1xyXG4gICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJUQUdcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5lbnRlcihcIkpTVFwiKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRva2VuO1xyXG59XHJcbmxvLmVudGVyID0gZnVuY3Rpb24oc3RhdGUpe1xyXG4gIHRoaXMuc3RhdGVzLnB1c2goc3RhdGUpXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmxvLnN0YXRlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgcmV0dXJuIHN0YXRlc1tzdGF0ZXMubGVuZ3RoLTFdO1xyXG59XHJcblxyXG5sby5sZWF2ZSA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgaWYoIXN0YXRlIHx8IHN0YXRlc1tzdGF0ZXMubGVuZ3RoLTFdID09PSBzdGF0ZSkgc3RhdGVzLnBvcCgpXHJcbn1cclxuXHJcblxyXG5MZXhlci5zZXR1cCA9IGZ1bmN0aW9uKCl7XHJcbiAgbWFjcm8uRU5EID0gY29uZmlnLkVORDtcclxuICBtYWNyby5CRUdJTiA9IGNvbmZpZy5CRUdJTjtcclxuICAvL1xyXG4gIG1hcDEgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVFxyXG4gICAgcnVsZXMuRU5URVJfSlNULFxyXG4gICAgcnVsZXMuRU5URVJfVEFHLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuXHJcbiAgICAvL1RBR1xyXG4gICAgcnVsZXMuVEFHX05BTUUsXHJcbiAgICBydWxlcy5UQUdfT1BFTixcclxuICAgIHJ1bGVzLlRBR19DTE9TRSxcclxuICAgIHJ1bGVzLlRBR19QVU5DSE9SLFxyXG4gICAgcnVsZXMuVEFHX0VOVEVSX0pTVCxcclxuICAgIHJ1bGVzLlRBR19VTlFfVkFMVUUsXHJcbiAgICBydWxlcy5UQUdfU1RSSU5HLFxyXG4gICAgcnVsZXMuVEFHX1NQQUNFLFxyXG4gICAgcnVsZXMuVEFHX0NPTU1FTlQsXHJcblxyXG4gICAgLy8gSlNUXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5ULFxyXG4gICAgcnVsZXMuSlNUX0VYUFJfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9JREVOVCxcclxuICAgIHJ1bGVzLkpTVF9TUEFDRSxcclxuICAgIHJ1bGVzLkpTVF9MRUFWRSxcclxuICAgIHJ1bGVzLkpTVF9OVU1CRVIsXHJcbiAgICBydWxlcy5KU1RfUFVOQ0hPUixcclxuICAgIHJ1bGVzLkpTVF9TVFJJTkcsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVFxyXG4gICAgXSlcclxuXHJcbiAgLy8gaWdub3JlZCB0aGUgdGFnLXJlbGF0aXZlIHRva2VuXHJcbiAgbWFwMiA9IGdlbk1hcChbXHJcbiAgICAvLyBJTklUIG5vIDwgcmVzdHJpY3RcclxuICAgIHJ1bGVzLkVOVEVSX0pTVDIsXHJcbiAgICBydWxlcy5URVhULFxyXG4gICAgLy8gSlNUXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0NMT1NFLFxyXG4gICAgcnVsZXMuSlNUX0VYUFJfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9JREVOVCxcclxuICAgIHJ1bGVzLkpTVF9TUEFDRSxcclxuICAgIHJ1bGVzLkpTVF9MRUFWRSxcclxuICAgIHJ1bGVzLkpTVF9OVU1CRVIsXHJcbiAgICBydWxlcy5KU1RfUFVOQ0hPUixcclxuICAgIHJ1bGVzLkpTVF9TVFJJTkcsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVFxyXG4gICAgXSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdlbk1hcChydWxlcyl7XHJcbiAgdmFyIHJ1bGUsIG1hcCA9IHt9LCBzaWduO1xyXG4gIGZvcih2YXIgaSA9IDAsIGxlbiA9IHJ1bGVzLmxlbmd0aDsgaSA8IGxlbiA7IGkrKyl7XHJcbiAgICBydWxlID0gcnVsZXNbaV07XHJcbiAgICBzaWduID0gcnVsZVsyXSB8fCAnSU5JVCc7XHJcbiAgICAoIG1hcFtzaWduXSB8fCAobWFwW3NpZ25dID0ge3J1bGVzOltdLCBsaW5rczpbXX0pICkucnVsZXMucHVzaChydWxlKTtcclxuICB9XHJcbiAgcmV0dXJuIHNldHVwKG1hcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwKG1hcCl7XHJcbiAgdmFyIHNwbGl0LCBydWxlcywgdHJ1bmtzLCBoYW5kbGVyLCByZWcsIHJldGFpbiwgcnVsZTtcclxuICBmdW5jdGlvbiByZXBsYWNlRm4oYWxsLCBvbmUpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBtYWNyb1tvbmVdID09PSAnc3RyaW5nJz8gXHJcbiAgICAgIF8uZXNjYXBlUmVnRXhwKG1hY3JvW29uZV0pIFxyXG4gICAgICA6IFN0cmluZyhtYWNyb1tvbmVdKS5zbGljZSgxLC0xKTtcclxuICB9XHJcblxyXG4gIGZvcih2YXIgaSBpbiBtYXApe1xyXG5cclxuICAgIHNwbGl0ID0gbWFwW2ldO1xyXG4gICAgc3BsaXQuY3VySW5kZXggPSAxO1xyXG4gICAgcnVsZXMgPSBzcGxpdC5ydWxlcztcclxuICAgIHRydW5rcyA9IFtdO1xyXG5cclxuICAgIGZvcih2YXIgaiA9IDAsbGVuID0gcnVsZXMubGVuZ3RoOyBqPGxlbjsgaisrKXtcclxuICAgICAgcnVsZSA9IHJ1bGVzW2pdOyBcclxuICAgICAgcmVnID0gcnVsZVswXTtcclxuICAgICAgaGFuZGxlciA9IHJ1bGVbMV07XHJcblxyXG4gICAgICBpZih0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgIGhhbmRsZXIgPSB3cmFwSGFuZGVyKGhhbmRsZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKF8udHlwZU9mKHJlZykgPT09ICdyZWdleHAnKSByZWcgPSByZWcudG9TdHJpbmcoKS5zbGljZSgxLCAtMSk7XHJcblxyXG4gICAgICByZWcgPSByZWcucmVwbGFjZSgvXFx7KFxcdyspXFx9L2csIHJlcGxhY2VGbilcclxuICAgICAgcmV0YWluID0gXy5maW5kU3ViQ2FwdHVyZShyZWcpICsgMTsgXHJcbiAgICAgIHNwbGl0LmxpbmtzLnB1c2goW3NwbGl0LmN1ckluZGV4LCByZXRhaW4sIGhhbmRsZXJdKTsgXHJcbiAgICAgIHNwbGl0LmN1ckluZGV4ICs9IHJldGFpbjtcclxuICAgICAgdHJ1bmtzLnB1c2gocmVnKTtcclxuICAgIH1cclxuICAgIHNwbGl0LlRSVU5LID0gbmV3IFJlZ0V4cChcIl4oPzooXCIgKyB0cnVua3Muam9pbihcIil8KFwiKSArIFwiKSlcIilcclxuICB9XHJcbiAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxudmFyIHJ1bGVzID0ge1xyXG5cclxuICAvLyAxLiBJTklUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8vIG1vZGUxJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBFTlRFUl9KU1Q6IFsvW15cXHgwMDxdKj8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIC8vIG1vZGUyJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBFTlRFUl9KU1QyOiBbL1teXFx4MDBdKj8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIEVOVEVSX1RBRzogWy9bXlxceDAwXSo/KD89PFtcXHdcXC9cXCFdKS8sIGZ1bmN0aW9uKGFsbCl7IFxyXG4gICAgdGhpcy5lbnRlcignVEFHJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBURVhUOiBbL1teXFx4MDBdKy8sICdURVhUJyBdLFxyXG5cclxuICAvLyAyLiBUQUdcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRBR19OQU1FOiBbL3tOQU1FfS8sICdOQU1FJywgJ1RBRyddLFxyXG4gIFRBR19VTlFfVkFMVUU6IFsvW15cXHt9JlwiJz0+PGBcXHJcXG5cXGZcXHQgXSsvLCAnVU5RJywgJ1RBRyddLFxyXG5cclxuICBUQUdfT1BFTjogWy88KHtOQU1FfSlcXHMqLywgZnVuY3Rpb24oYWxsLCBvbmUpeyAvL1wiXHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfT1BFTicsIHZhbHVlOiBvbmV9XHJcbiAgfSwgJ1RBRyddLFxyXG4gIFRBR19DTE9TRTogWy88XFwvKHtOQU1FfSlbXFxyXFxuXFxmXFx0IF0qPi8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICAgIHJldHVybiB7dHlwZTogJ1RBR19DTE9TRScsIHZhbHVlOiBvbmUgfVxyXG4gIH0sICdUQUcnXSxcclxuXHJcbiAgICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgVEFHX0VOVEVSX0pTVDogWy8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICB9LCAnVEFHJ10sXHJcblxyXG5cclxuICBUQUdfUFVOQ0hPUjogWy9bXFw+XFwvPSZdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKGFsbCA9PT0gJz4nKSB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwgJ1RBRyddLFxyXG4gIFRBR19TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVxcXCIvLCAvKicqLyAgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IFxyXG4gICAgdmFyIHZhbHVlID0gb25lIHx8IHR3byB8fCBcIlwiO1xyXG5cclxuICAgIHJldHVybiB7dHlwZTogJ1NUUklORycsIHZhbHVlOiB2YWx1ZX1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gIFRBR19TUEFDRTogWy97U1BBQ0V9Ky8sIG51bGwsICdUQUcnXSxcclxuICBUQUdfQ09NTUVOVDogWy88XFwhLS0oW15cXHgwMF0qPyktLVxcPi8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmxlYXZlKClcclxuICAgIC8vIHRoaXMubGVhdmUoJ1RBRycpXHJcbiAgfSAsJ1RBRyddLFxyXG5cclxuICAvLyAzLiBKU1RcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIEpTVF9PUEVOOiBbJ3tCRUdJTn0je1NQQUNFfSooe0lERU5UfSknLCBmdW5jdGlvbihhbGwsIG5hbWUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ09QRU4nLFxyXG4gICAgICB2YWx1ZTogbmFtZVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTEVBVkU6IFsve0VORH0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgaWYodGhpcy5tYXJrRW5kID09PSBhbGwgJiYgdGhpcy5leHByZXNzaW9uKSByZXR1cm4ge3R5cGU6IHRoaXMubWFya0VuZCwgdmFsdWU6IHRoaXMubWFya0VuZH07XHJcbiAgICBpZighdGhpcy5tYXJrRW5kIHx8ICF0aGlzLm1hcmtzICl7XHJcbiAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubGVhdmUoJ0pTVCcpO1xyXG4gICAgICByZXR1cm4ge3R5cGU6ICdFTkQnfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRoaXMubWFya3MtLTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9XHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9DTE9TRTogWy97QkVHSU59XFxzKlxcLyh7SURFTlR9KVxccyp7RU5EfS8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIHRoaXMubGVhdmUoJ0pTVCcpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ0NMT1NFJyxcclxuICAgICAgdmFsdWU6IG9uZVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ09NTUVOVDogWy97QkVHSU59XFwhKFteXFx4MDBdKj8pXFwhe0VORH0vLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5sZWF2ZSgpO1xyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfRVhQUl9PUEVOOiBbJ3tCRUdJTn0nLGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIGlmKGFsbCA9PT0gdGhpcy5tYXJrU3RhcnQpe1xyXG4gICAgICBpZih0aGlzLmV4cHJlc3Npb24pIHJldHVybiB7IHR5cGU6IHRoaXMubWFya1N0YXJ0LCB2YWx1ZTogdGhpcy5tYXJrU3RhcnQgfTtcclxuICAgICAgaWYodGhpcy5maXJzdEVudGVyU3RhcnQgfHwgdGhpcy5tYXJrcyl7XHJcbiAgICAgICAgdGhpcy5tYXJrcysrXHJcbiAgICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ0VYUFJfT1BFTicsXHJcbiAgICAgIGVzY2FwZTogZmFsc2VcclxuICAgIH1cclxuXHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9JREVOVDogWyd7SURFTlR9JywgJ0lERU5UJywgJ0pTVCddLFxyXG4gIEpTVF9TUEFDRTogWy9bIFxcclxcblxcZl0rLywgbnVsbCwgJ0pTVCddLFxyXG4gIEpTVF9QVU5DSE9SOiBbL1s9IV0/PT18Wy09PjwrKlxcLyVcXCFdP1xcPXxcXHxcXHx8JiZ8XFxAXFwofFxcLlxcLnxbPFxcPlxcW1xcXVxcKFxcKVxcLVxcfFxce31cXCtcXCpcXC8lPzpcXC4hLF0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHsgdHlwZTogYWxsLCB2YWx1ZTogYWxsIH1cclxuICB9LCdKU1QnXSxcclxuXHJcbiAgSlNUX1NUUklORzogIFsgLycoW14nXSopJ3xcIihbXlwiXSopXCIvLCBmdW5jdGlvbihhbGwsIG9uZSwgdHdvKXsgLy9cIidcclxuICAgIHJldHVybiB7dHlwZTogJ1NUUklORycsIHZhbHVlOiBvbmUgfHwgdHdvIHx8IFwiXCJ9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9OVU1CRVI6IFsvKD86WzAtOV0qXFwuWzAtOV0rfFswLTldKykoZVxcZCspPy8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdOVU1CRVInLCB2YWx1ZTogcGFyc2VGbG9hdChhbGwsIDEwKX07XHJcbiAgfSwgJ0pTVCddXHJcbn1cclxuXHJcblxyXG4vLyBzZXR1cCB3aGVuIGZpcnN0IGNvbmZpZ1xyXG5MZXhlci5zZXR1cCgpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExleGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL1BhcnNlci9zcmMvTGV4ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==