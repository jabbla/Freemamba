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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var documentFragment = __webpack_require__(4);
var Element = __webpack_require__(5);

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
/* 4 */
/***/ (function(module, exports) {

function documentFragment(){
    this._children = [];
}
documentFragment.prototype.append = function(node){
    this._children.push(node);
};

module.exports = documentFragment;

/***/ }),
/* 5 */
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
/* 6 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 14:54:33 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 14:59:40
 */

function extend(childClass, baseClass){
    var fn = function(){};
    fn.prototype = baseClass.prototype;
    childClass.prototype = new fn();
    childClass.prototype.super = baseClass;
}

module.exports = extend;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 15:05:01 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 18:04:46
 */
var Parser = __webpack_require__(8);

if(!this.document){
    document = __webpack_require__(3);
}

function BaseRenderStore(obj){

    this._beforeConfig();
    this._configModel(obj);
    this._afterConfig();
    this._parse();
}

BaseRenderStore.prototype._beforeConfig = function(){
};

BaseRenderStore.prototype._afterConfig = function(){
    this.config && this.config(this.data);
};

BaseRenderStore.prototype._configModel = function(model){
    Object.assign(this, model);

    if(!model.data) this.data = {};
    this._list = {};
    this._definer = model;
}

BaseRenderStore.prototype._compile = function(ast, listInfo){
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

BaseRenderStore.prototype._parse = function(){
    this.AST = new Parser(this.template).parse();
};

BaseRenderStore.prototype._render = function(){};

BaseRenderStore.prototype._sg_ = function (path, data) {
    var result;
    if (path instanceof Event) {
        result = path;
    } else {
        result = data[path];
    }
    return result;
}

module.exports = BaseRenderStore;

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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {var Freelist = __webpack_require__(19);
var MessageBus = __webpack_require__(22);

(function(root){
    if(root.NEJ && NEJ.define){
        NEJ.define([], function(){
            return {
                Freelist: Freelist,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(window && window.define){
        window.define([], function(){
            return {
                Freelist: Freelist,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(document && document.nodeType){
        window.Freelist = {
            Freelist: Freelist,
            MessageBus: MessageBus
        };
    }

    if(module && module.exports){
        module.exports = {
            Freelist: Freelist,
            MessageBus: MessageBus
        };
    }

})(this);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(18)(module)))

/***/ }),
/* 18 */
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


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var Extend = __webpack_require__(6);
var BaseRenderStore = __webpack_require__(7);
var Compiler = __webpack_require__(20);

function Freelist(config) {
    this.super(config);
    this._compiler = Compiler;
}

Extend(Freelist, BaseRenderStore);

Freelist.replaceList = function (oldList, newList) {
    for (var i = oldList.length - 1; i >= 0; i--) {
        if (typeof newList[i] === 'undefined') {
            oldList.splice(i, 1);
        } else {
            oldList[i] = newList[i];
        }
    }
}

Freelist.prototype.$inject = function (node) {
    this.containerNode = node;

    this.$render();
    node.append(this.domTree);
}

Freelist.prototype.$modify = function (index, model) {
    var _list = this._list,
        _listContainer = _list.container,
        _body = _list.body;

    /**设置数据模型 */
    _list.data[index] = model;

    /**Dom精确更新 */
    var targetDom = _listContainer.children[index];
    var node = this._compile(_body, { item: model, item_index: index });

    _listContainer.replaceChild(node, targetDom);
}

Freelist.prototype.$insert = function (index, model) {
    var _list = this._list,
        _listContainer = _list.container,
        _body = _list.body;

    /**设置数据模型 */
    _list.data.splice(index, 0, model);

    this.$render();
}

/**替换列表数据 */
Freelist.prototype.$replace = function (newList) {
    var _list = this._list;

    Freelist.replaceList(_list.data, newList);
    this.$render();
};

Freelist.prototype.$delete = function (index) {
    var _list = this._list,
        _listContainer = _list.container;

    /**设置数据模型 */
    _list.data.splice(index, 1);
    this.$render();
}

Freelist.prototype.$render = function (workerRender) {
    if (workerRender) {
        this._renderAsync(workerRender);
    } else {
        this._renderSync();
    }
}

Freelist.prototype._renderSync = function () {
    var newRoot = this.domTree = this._compile(this.AST),
        containerNode = this.containerNode,
        rootNode = this.rootNode;

    this.rootNode = newRoot.children[0];
    if (rootNode) {
        containerNode.replaceChild(newRoot, rootNode);
    }
}

Freelist.prototype._renderAsync = function (workerRender) {
    var data = this.data,
        ast = this.AST;

    workerRender.receive({ type: 'render', data: { template: this.template, data: this.data } })
        .then(function (data) {
            this.containerNode.innerHTML = data.html;
            this.rootNode = this.containerNode.children[0];

            Freelist.addAsyncEvents.call(this, this.rootNode, data.events);
        }.bind(this));
}

Freelist.addAsyncEvents = function (node, events) {
    if (node.getAttribute('list-container')) {
        this._list.container = node;
    }
    if (typeof node.dataset === 'undefined' || typeof node.dataset.nodeID === 'undefined') {
        if (!node.children) return;
        for (var i = 0; i < node.children.length; i++) {
            Freelist.addAsyncEvents.call(this, node.children[i], events);
        }
    }
    var nodeId = node.dataset.nodeid;

    for (var id in events) {
        if (id == nodeId) {
            var eventHub = events[id];
            for (var j = 0; j < eventHub.length; j++) {
                var getHandler = new Function('c', 'd', 'e', 'return ' + eventHub[j].value + ';');
                var handler = getHandler(this, this.data, '');
                node.addEventListener(eventHub[j].name, getHandler(this, this.data, ''), false);
            }
            break;
        }
    }


    delete events[nodeId];

}

module.exports = Freelist;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:44:12 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 16:54:59
 */
var attrResolver = __webpack_require__(21);

function element(ast, context, listInfo) {
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs;
    /**处理属性 */
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        switch (attr.type) {
            case 'attribute': attrResolver(attr, node, context, listInfo); break;
        }
    }

    /**处理子节点 */
    if (ast.children) {
        for (var j = 0; j < ast.children.length; j++) {
            var child = ast.children[j];
            node.append(context._compile(child, listInfo));
        }
    }

    return node;
}

function text(ast) {
    var node = document.createTextNode(ast.text);
    return node;
}

function expression(ast, context, listInfo) {
    var text = '';
    if (listInfo) {
        var getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
        text = getValue(context, listInfo, '');
    } else {
        var getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
        text = getValue(context, context.data, '');
    }

    var node = document.createTextNode(text);

    return node;
}

function list(ast, context) {
    var listBody = ast.body;
    var node = document.createDocumentFragment();
    var getValue = new Function('c', 'd', 'e', 'return (' + ast.sequence.body + ')');
    var arrayData = getValue(context, context.data, '');
    var variable = ast.variable;

    for (var j = 0; j < arrayData.length; j++) {
        node.append(itemNode(listBody, arrayData[j], j));
    }

    function itemNode(body, item, index) {
        var node = document.createDocumentFragment();
        var listInfo = {};

        listInfo[variable] = item;
        listInfo[variable + '_index'] = index;
        for (var i = 0; i < body.length; i++) {
            node.append(context._compile(body[i], listInfo));
        }
        return node;
    }
    context._list.data = arrayData;
    context._list.body = listBody;

    return node;
}

module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:51:33 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 16:53:44
 */
function resolveAttribute(attr, node, context, listInfo) {
    var valueType = typeof attr.value;
    switch (valueType) {
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, resolveAttrValue(attr, node, context, listInfo)); break;
    }

    if (attr.name === 'list-container') {
        context._list.container = node;
    }
}

 function resolveAttrValue(attr, node, context, listInfo) {
    var isEvent = attr.name.slice(0, 2) === 'on';

    if (isEvent) {
        var eventName = attr.name.slice(3);
        attr.value.body = attr.value.body.replace(/'\$event'/g, '$event');
        var getHandler = new Function('c', 'd', 'e', 'return function($event){return ' + attr.value.body + ';}');

        node.addEventListener(eventName, getHandler(context, listInfo || context.data, ''), false);
        return '';
    } else {
        var getValue = new Function('c', 'd', 'e', 'return (' + attr.value.body + ')');
        return getValue(context, context.data, '');
    }
}

module.exports = resolveAttribute;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

function MessageBus(worker){
    this._worker = worker;
    this._onSendWorker = [];
    this._connectionCenter = {};
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
        watcher(Info);
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
    for(var i=watchers.length-1, watcher;i>=0;i--){
        watcher = watchers[i];
        watcher(data);
        watchers.splice(i, 1);
    }
}

window.MessageBus = MessageBus;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzIxYjQzM2FmMjMxOTkwOGNhZTEiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci91dGlsLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9jb25maWcuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL0Jhc2VSZW5kZXJTdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL3NyYy9QYXJzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzLy4yLjAuNEB0aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy8uMS4wLjVAc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvLjAuMTEuMTBAcHJvY2Vzcy9icm93c2VyLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL3NoaW0uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9oZWxwZXIvZW50aXRpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvbm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL3NyYy9MZXhlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdWlfaW5kZXguanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RvcmUvVUlSZW5kZXJTdG9yZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvbWFpblRocmVhZC9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvbWFpblRocmVhZC9hdHRyUmVzb2x2ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7NERDN0RBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSx5QkFBeUIsNkNBQTZDLDBDQUEwQzs7O0FBR2hIO0FBQ0E7QUFDQSxrREFBa0QsU0FBUztBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRSwwQkFBMEI7QUFDMUIsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpQ0FBaUM7QUFDakMsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTO0FBQzlDOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQSx3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCO0FBQ0EsR0FBRztBQUNIOzs7QUFHQSwrRkFBK0Y7O0FBRS9GOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTyxNQUFNO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCLGFBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQ0FBcUMsU0FBUztBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBTTs7QUFFYjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDemhCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNuQkE7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsQzs7Ozs7O0FDTEE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxxQjs7Ozs7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQzs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsc0JBQXNCLGlDQUFpQztBQUN2RDs7QUFFQTtBQUNBLHVCQUF1QixpREFBaUQ7QUFDeEU7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHlCOzs7Ozs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Qjs7Ozs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsYUFBYTtBQUNqQztBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQzs7Ozs7O0FDL0RBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixPQUFPO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE1BQU0sVUFBVSxXQUFXLE1BQU0sT0FBTyxhQUFhOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFVBQVU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHFFQUFxRSxLQUFLO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxPQUFPO0FBQ1Asa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaUNBQWlDLG1CQUFtQiw0QkFBNEIsV0FBVyxZQUFZLEVBQUUsYUFBYTtBQUNsSjtBQUNBOztBQUVBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSwwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssS0FBSztBQUNWO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsS0FBSztBQUNSLG1EQUFtRDtBQUNuRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLHdCOzs7Ozs7QUNsdUJBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLHNCQUFzQixFQUFFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3pMRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7O0FDdkx0QztBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFNBQVM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSwyQjs7Ozs7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7QUN4REE7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixFQUFFLEtBQUssWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxZQUFZOztBQUUzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDLE9BQU87QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esb0JBQW9CO0FBQ3BCLG9DQUFvQyxVQUFVO0FBQzlDO0FBQ0E7QUFDQSxpQ0FBaUMsbUJBQW1CO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMsT0FBTztBQUM1QyxzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLE9BQU87QUFDbEMseUM7QUFDQSwwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsTUFBTTtBQUNuQztBQUNBLG9CQUFvQjtBQUNwQixHQUFHOztBQUVIO0FBQ0EsNkJBQTZCLE1BQU07QUFDbkM7QUFDQSxvQkFBb0I7QUFDcEIsR0FBRzs7QUFFSCxzRDtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQix3QkFBd0I7O0FBRXhCLGlCQUFpQixLQUFLLDBCQUEwQjtBQUNoRCxZQUFZO0FBQ1osR0FBRztBQUNILG9CQUFvQixLQUFLO0FBQ3pCO0FBQ0EsWUFBWTtBQUNaLEdBQUc7O0FBRUg7QUFDQSx1QkFBdUIsTUFBTTtBQUM3QjtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQSxZQUFZO0FBQ1osR0FBRztBQUNILHdFO0FBQ0E7O0FBRUEsWUFBWTtBQUNaLEdBQUc7O0FBRUgsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBLGVBQWUsTUFBTSxFQUFFLE1BQU0sR0FBRyxNQUFNO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGdCQUFnQixJQUFJO0FBQ3BCLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMO0FBQ0EsY0FBYztBQUNkO0FBQ0EsR0FBRztBQUNILGdCQUFnQixNQUFNLE9BQU8sTUFBTSxLQUFLLElBQUk7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxrQkFBa0IsTUFBTSxnQkFBZ0IsSUFBSTtBQUM1QztBQUNBLEdBQUc7QUFDSCxvQkFBb0IsTUFBTTtBQUMxQjtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxnQkFBZ0IsTUFBTTtBQUN0QjtBQUNBLCtFQUErRTtBQUMvRSxZQUFZO0FBQ1osR0FBRzs7QUFFSCxnRUFBZ0U7QUFDaEUsWUFBWTtBQUNaLEdBQUc7QUFDSDtBQUNBLFlBQVk7QUFDWixHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7Ozs7QUFJQSx1Qjs7Ozs7Ozs7Ozs7OztBQzlWQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7O0FDdENEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxvQ0FBb0MsUUFBUTtBQUM1QztBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFDQUFxQyxpQ0FBaUM7O0FBRXRFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsMEJBQTBCLHdCQUF3QiwyQ0FBMkMsRUFBRTtBQUMvRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDBCQUEwQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIscUJBQXFCO0FBQ2hELCtGQUErRjtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBLDBCOzs7Ozs7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQzs7QUFFQTtBQUNBLDBFQUEwRTtBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUJBQW1CLHNCQUFzQjtBQUN6QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRTtBQUNoRSxxR0FBcUc7QUFDckc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEUsZ0NBQWdDOztBQUU5RztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7O0FBRUEseUJBQXlCLGtCQUFrQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsS0FBSztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCIiwiZmlsZSI6IkZyZWVsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGMyMWI0MzNhZjIzMTk5MDhjYWUxIiwicmVxdWlyZSgnLi9oZWxwZXIvc2hpbS5qcycpKCk7XHJcblxyXG5cclxuXHJcbnZhciBfICA9IG1vZHVsZS5leHBvcnRzO1xyXG52YXIgZW50aXRpZXMgPSByZXF1aXJlKCcuL2hlbHBlci9lbnRpdGllcy5qcycpO1xyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIG8yc3RyID0gKHt9KS50b1N0cmluZztcclxudmFyIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09J3VuZGVmaW5lZCc/IHdpbmRvdzogZ2xvYmFsO1xyXG52YXIgTUFYX1BSSU9SSVRZID0gOTk5OTtcclxuXHJcblxyXG5fLm5vb3AgPSBmdW5jdGlvbigpe307XHJcbl8udWlkID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIF91aWQ9MDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBfdWlkKys7XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXy5leHRlbmQgPSBmdW5jdGlvbiggbzEsIG8yLCBvdmVycmlkZSApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYgKG8yLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkIHx8IG92ZXJyaWRlID09PSB0cnVlICl7XHJcbiAgICAgIG8xW2ldID0gbzJbaV1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG8xO1xyXG59XHJcblxyXG5fLmtleXMgPSBPYmplY3Qua2V5cz8gT2JqZWN0LmtleXM6IGZ1bmN0aW9uKG9iail7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICByZXMucHVzaChpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuXy5zb21lID0gZnVuY3Rpb24obGlzdCwgZm4pe1xyXG4gIGZvcih2YXIgaSA9MCxsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgIGlmKGZuKGxpc3RbaV0pKSByZXR1cm4gdHJ1ZVxyXG4gIH1cclxufVxyXG5cclxuXy52YXJOYW1lID0gJ2QnO1xyXG5fLnNldE5hbWUgPSAncF8nO1xyXG5fLmN0eE5hbWUgPSAnYyc7XHJcbl8uZXh0TmFtZSA9ICdlJztcclxuXHJcbl8ucldvcmQgPSAvXltcXCRcXHddKyQvO1xyXG5fLnJTaW1wbGVBY2Nlc3NvciA9IC9eW1xcJFxcd10rKFxcLltcXCRcXHddKykqJC87XHJcblxyXG5fLm5leHRUaWNrID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJz8gXHJcbiAgc2V0SW1tZWRpYXRlLmJpbmQod2luKSA6IFxyXG4gIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKSBcclxuICB9XHJcblxyXG5cclxuXHJcbl8ucHJlZml4ID0gXCIndXNlIHN0cmljdCc7dmFyIFwiICsgXy52YXJOYW1lICsgXCI9XCIgKyBfLmN0eE5hbWUgKyBcIi5kYXRhO1wiICsgIF8uZXh0TmFtZSAgKyBcIj1cIiArIF8uZXh0TmFtZSArIFwifHwnJztcIjtcclxuXHJcblxyXG5fLnNsaWNlID0gZnVuY3Rpb24ob2JqLCBzdGFydCwgZW5kKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yKHZhciBpID0gc3RhcnQgfHwgMCwgbGVuID0gZW5kIHx8IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICByZXMucHVzaChvYmpbaV0pXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIGJlYWN1c2Ugc2xpY2UgYW5kIHRvTG93ZXJDYXNlIGlzIGV4cGVuc2l2ZS4gd2UgaGFuZGxlIHVuZGVmaW5lZCBhbmQgbnVsbCBpbiBhbm90aGVyIHdheVxyXG5fLnR5cGVPZiA9IGZ1bmN0aW9uIChvKSB7XHJcbiAgcmV0dXJuIG8gPT0gbnVsbCA/IFN0cmluZyhvKSA6bzJzdHIuY2FsbChvKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXy5tYWtlUHJlZGljYXRlID0gZnVuY3Rpb24gbWFrZVByZWRpY2F0ZSh3b3JkcywgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIHdvcmRzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgd29yZHMgPSB3b3Jkcy5zcGxpdChcIiBcIik7XHJcbiAgICB9XHJcbiAgICB2YXIgZiA9IFwiXCIsXHJcbiAgICBjYXRzID0gW107XHJcbiAgICBvdXQ6IGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNhdHMubGVuZ3RoOyArK2ope1xyXG4gICAgICAgICAgaWYgKGNhdHNbal1bMF0ubGVuZ3RoID09PSB3b3Jkc1tpXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBjYXRzW2pdLnB1c2god29yZHNbaV0pO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlIG91dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0cy5wdXNoKFt3b3Jkc1tpXV0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY29tcGFyZVRvKGFycikge1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAxKSByZXR1cm4gZiArPSBcInJldHVybiBzdHIgPT09ICdcIiArIGFyclswXSArIFwiJztcIjtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0cil7XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpe1xyXG4gICAgICAgICAgIGYgKz0gXCJjYXNlICdcIiArIGFycltpXSArIFwiJzpcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcInJldHVybiB0cnVlfXJldHVybiBmYWxzZTtcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gdGhyZWUgbGVuZ3RoIGNhdGVnb3JpZXMsIGFuIG91dGVyXHJcbiAgICAvLyBzd2l0Y2ggZmlyc3QgZGlzcGF0Y2hlcyBvbiB0aGUgbGVuZ3RocywgdG8gc2F2ZSBvbiBjb21wYXJpc29ucy5cclxuICAgIGlmIChjYXRzLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICBjYXRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0ci5sZW5ndGgpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY2F0ID0gY2F0c1tpXTtcclxuICAgICAgICAgICAgZiArPSBcImNhc2UgXCIgKyBjYXRbMF0ubGVuZ3RoICsgXCI6XCI7XHJcbiAgICAgICAgICAgIGNvbXBhcmVUbyhjYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmICs9IFwifVwiO1xyXG5cclxuICAgICAgICAvLyBPdGhlcndpc2UsIHNpbXBseSBnZW5lcmF0ZSBhIGZsYXQgYHN3aXRjaGAgc3RhdGVtZW50LlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb21wYXJlVG8od29yZHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcInN0clwiLCBmKTtcclxufVxyXG5cclxuXHJcbl8udHJhY2tFcnJvclBvcyA9IChmdW5jdGlvbiAoKXtcclxuICAvLyBsaW5lYnJlYWtcclxuICB2YXIgbGIgPSAvXFxyXFxufFtcXG5cXHJcXHUyMDI4XFx1MjAyOV0vZztcclxuICB2YXIgbWluUmFuZ2UgPSAyMCwgbWF4UmFuZ2UgPSAyMDtcclxuICBmdW5jdGlvbiBmaW5kTGluZShsaW5lcywgcG9zKXtcclxuICAgIHZhciB0bXBMZW4gPSAwO1xyXG4gICAgZm9yKHZhciBpID0gMCxsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICAgIHZhciBsaW5lTGVuID0gKGxpbmVzW2ldIHx8IFwiXCIpLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmKHRtcExlbiArIGxpbmVMZW4gPiBwb3MpIHtcclxuICAgICAgICByZXR1cm4ge251bTogaSwgbGluZTogbGluZXNbaV0sIHN0YXJ0OiBwb3MgLSBpIC0gdG1wTGVuICwgcHJldjpsaW5lc1tpLTFdLCBuZXh0OiBsaW5lc1tpKzFdIH07XHJcbiAgICAgIH1cclxuICAgICAgLy8gMSBpcyBmb3IgdGhlIGxpbmVicmVha1xyXG4gICAgICB0bXBMZW4gPSB0bXBMZW4gKyBsaW5lTGVuIDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZm9ybWF0TGluZShzdHIsICBzdGFydCwgbnVtLCB0YXJnZXQpe1xyXG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICB2YXIgbWluID0gc3RhcnQgLSBtaW5SYW5nZTtcclxuICAgIGlmKG1pbiA8IDApIG1pbiA9IDA7XHJcbiAgICB2YXIgbWF4ID0gc3RhcnQgKyBtYXhSYW5nZTtcclxuICAgIGlmKG1heCA+IGxlbikgbWF4ID0gbGVuO1xyXG5cclxuICAgIHZhciByZW1haW4gPSBzdHIuc2xpY2UobWluLCBtYXgpO1xyXG4gICAgdmFyIHByZWZpeCA9IFwiW1wiICsobnVtKzEpICsgXCJdIFwiICsgKG1pbiA+IDA/IFwiLi5cIiA6IFwiXCIpXHJcbiAgICB2YXIgcG9zdGZpeCA9IG1heCA8IGxlbiA/IFwiLi5cIjogXCJcIjtcclxuICAgIHZhciByZXMgPSBwcmVmaXggKyByZW1haW4gKyBwb3N0Zml4O1xyXG4gICAgaWYodGFyZ2V0KSByZXMgKz0gXCJcXG5cIiArIG5ldyBBcnJheShzdGFydC1taW4gKyBwcmVmaXgubGVuZ3RoICsgMSkuam9pbihcIiBcIikgKyBcIl5eXlwiO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBwb3Mpe1xyXG4gICAgaWYocG9zID4gaW5wdXQubGVuZ3RoLTEpIHBvcyA9IGlucHV0Lmxlbmd0aC0xO1xyXG4gICAgbGIubGFzdEluZGV4ID0gMDtcclxuICAgIHZhciBsaW5lcyA9IGlucHV0LnNwbGl0KGxiKTtcclxuICAgIHZhciBsaW5lID0gZmluZExpbmUobGluZXMscG9zKTtcclxuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnQsIG51bSA9IGxpbmUubnVtO1xyXG5cclxuICAgIHJldHVybiAobGluZS5wcmV2PyBmb3JtYXRMaW5lKGxpbmUucHJldiwgc3RhcnQsIG51bS0xICkgKyAnXFxuJzogJycgKSArIFxyXG4gICAgICBmb3JtYXRMaW5lKGxpbmUubGluZSwgc3RhcnQsIG51bSwgdHJ1ZSkgKyAnXFxuJyArIFxyXG4gICAgICAobGluZS5uZXh0PyBmb3JtYXRMaW5lKGxpbmUubmV4dCwgc3RhcnQsIG51bSsxICkgKyAnXFxuJzogJycgKTtcclxuXHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXHJcbnZhciBpZ25vcmVkUmVmID0gL1xcKChcXD9cXCF8XFw/XFw6fFxcP1xcPSkvZztcclxuXy5maW5kU3ViQ2FwdHVyZSA9IGZ1bmN0aW9uIChyZWdTdHIpIHtcclxuICB2YXIgbGVmdCA9IDAsXHJcbiAgICByaWdodCA9IDAsXHJcbiAgICBsZW4gPSByZWdTdHIubGVuZ3RoLFxyXG4gICAgaWdub3JlZCA9IHJlZ1N0ci5tYXRjaChpZ25vcmVkUmVmKTsgLy8gaWdub3JlZCB1bmNhcHR1cmVcclxuICBpZihpZ25vcmVkKSBpZ25vcmVkID0gaWdub3JlZC5sZW5ndGhcclxuICBlbHNlIGlnbm9yZWQgPSAwO1xyXG4gIGZvciAoOyBsZW4tLTspIHtcclxuICAgIHZhciBsZXR0ZXIgPSByZWdTdHIuY2hhckF0KGxlbik7XHJcbiAgICBpZiAobGVuID09PSAwIHx8IHJlZ1N0ci5jaGFyQXQobGVuIC0gMSkgIT09IFwiXFxcXFwiICkgeyBcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIoXCIpIGxlZnQrKztcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIpXCIpIHJpZ2h0Kys7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChsZWZ0ICE9PSByaWdodCkgdGhyb3cgXCJSZWdFeHA6IFwiKyByZWdTdHIgKyBcIidzIGJyYWNrZXQgaXMgbm90IG1hcmNoZWRcIjtcclxuICBlbHNlIHJldHVybiBsZWZ0IC0gaWdub3JlZDtcclxufTtcclxuXHJcblxyXG5fLmVzY2FwZVJlZ0V4cCA9IGZ1bmN0aW9uKCBzdHIpey8vIENyZWRpdDogWFJlZ0V4cCAwLjYuMSAoYykgMjAwNy0yMDA4IFN0ZXZlbiBMZXZpdGhhbiA8aHR0cDovL3N0ZXZlbmxldml0aGFuLmNvbS9yZWdleC94cmVnZXhwLz4gTUlUIExpY2Vuc2VcclxuICByZXR1cm4gc3RyLnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uXFxcXF4kfCwjXFxzXS9nLCBmdW5jdGlvbihtYXRjaCl7XHJcbiAgICByZXR1cm4gJ1xcXFwnICsgbWF0Y2g7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxudmFyIHJFbnRpdHkgPSBuZXcgUmVnRXhwKFwiJig/OigjeFswLTlhLWZBLUZdKyl8KCNbMC05XSspfChcIiArIF8ua2V5cyhlbnRpdGllcykuam9pbignfCcpICsgJykpOycsICdnaScpO1xyXG5cclxuXy5jb252ZXJ0RW50aXR5ID0gZnVuY3Rpb24oY2hyKXtcclxuXHJcbiAgcmV0dXJuIChcIlwiICsgY2hyKS5yZXBsYWNlKHJFbnRpdHksIGZ1bmN0aW9uKGFsbCwgaGV4LCBkZWMsIGNhcHR1cmUpe1xyXG4gICAgdmFyIGNoYXJDb2RlO1xyXG4gICAgaWYoIGRlYyApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGRlYy5zbGljZSgxKSwgMTAgKTtcclxuICAgIGVsc2UgaWYoIGhleCApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGhleC5zbGljZSgyKSwgMTYgKTtcclxuICAgIGVsc2UgY2hhckNvZGUgPSBlbnRpdGllc1tjYXB0dXJlXVxyXG5cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCBjaGFyQ29kZSApXHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5cclxuLy8gc2ltcGxlIGdldCBhY2Nlc3NvclxyXG5cclxuXy5jcmVhdGVPYmplY3QgPSBPYmplY3QuY3JlYXRlPyBmdW5jdGlvbihvKXtcclxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShvIHx8IG51bGwpXHJcbn06IChmdW5jdGlvbigpe1xyXG4gICAgZnVuY3Rpb24gVGVtcCgpIHt9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24obyl7XHJcbiAgICAgIGlmKCFvKSByZXR1cm4ge31cclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBvO1xyXG4gICAgICB2YXIgb2JqID0gbmV3IFRlbXAoKTtcclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBudWxsOyAvLyDkuI3opoHkv53mjIHkuIDkuKogTyDnmoTmnYLmlaPlvJXnlKjvvIhhIHN0cmF5IHJlZmVyZW5jZe+8iS4uLlxyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5fLmNyZWF0ZVByb3RvID0gZnVuY3Rpb24oZm4sIG8pe1xyXG4gICAgZnVuY3Rpb24gRm9vKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZm47fVxyXG4gICAgRm9vLnByb3RvdHlwZSA9IG87XHJcbiAgICByZXR1cm4gKGZuLnByb3RvdHlwZSA9IG5ldyBGb28oKSk7XHJcbn1cclxuXHJcblxyXG5fLnJlbW92ZU9uZSA9IGZ1bmN0aW9uKGxpc3QgLCBmaWx0ZXIpe1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICBmb3IoO2xlbi0tOyl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkge1xyXG4gICAgICBsaXN0LnNwbGljZShsZW4sIDEpXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuY2xvbmVcclxuKi9cclxuXy5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKG9iail7XHJcbiAgaWYoIW9iaiB8fCAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgKSkgcmV0dXJuIG9iajtcclxuICBpZihBcnJheS5pc0FycmF5KG9iaikpe1xyXG4gICAgdmFyIGNsb25lZCA9IFtdO1xyXG4gICAgZm9yKHZhciBpPTAsbGVuID0gb2JqLmxlbmd0aDsgaTwgbGVuO2krKyl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lZDtcclxuICB9ZWxzZXtcclxuICAgIHZhciBjbG9uZWQgPSB7fTtcclxuICAgIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5fLmVxdWFscyA9IGZ1bmN0aW9uKG5vdywgb2xkKXtcclxuICB2YXIgdHlwZSA9IHR5cGVvZiBub3c7XHJcbiAgaWYodHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIG9sZCA9PT0gJ251bWJlcicmJiBpc05hTihub3cpICYmIGlzTmFOKG9sZCkpIHJldHVybiB0cnVlXHJcbiAgcmV0dXJuIG5vdyA9PT0gb2xkO1xyXG59XHJcblxyXG52YXIgZGFzaCA9IC8tKFthLXpdKS9nO1xyXG5fLmNhbWVsQ2FzZSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGRhc2gsIGZ1bmN0aW9uKGFsbCwgY2FwdHVyZSl7XHJcbiAgICByZXR1cm4gY2FwdHVyZS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cclxuXy50aHJvdHRsZSA9IGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQpe1xyXG4gIHZhciB3YWl0ID0gd2FpdCB8fCAxMDA7XHJcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcclxuICB2YXIgdGltZW91dCA9IG51bGw7XHJcbiAgdmFyIHByZXZpb3VzID0gMDtcclxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHByZXZpb3VzID0gK25ldyBEYXRlO1xyXG4gICAgdGltZW91dCA9IG51bGw7XHJcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gIH07XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG5vdyA9ICsgbmV3IERhdGU7XHJcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XHJcbiAgICBjb250ZXh0ID0gdGhpcztcclxuICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICBwcmV2aW91cyA9IG5vdztcclxuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICghdGltZW91dCkge1xyXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIGhvZ2FuIGVzY2FwZVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5fLmVzY2FwZSA9IChmdW5jdGlvbigpe1xyXG4gIHZhciByQW1wID0gLyYvZyxcclxuICAgICAgckx0ID0gLzwvZyxcclxuICAgICAgckd0ID0gLz4vZyxcclxuICAgICAgckFwb3MgPSAvXFwnL2csXHJcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcclxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihzdHIpIHtcclxuICAgIHJldHVybiBoQ2hhcnMudGVzdChzdHIpID9cclxuICAgICAgc3RyXHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZShyTHQsICcmbHQ7JylcclxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcclxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZShyUXVvdCwgJyZxdW90OycpIDpcclxuICAgICAgc3RyO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uY2FjaGUgPSBmdW5jdGlvbihtYXgpe1xyXG4gIG1heCA9IG1heCB8fCAxMDAwO1xyXG4gIHZhciBrZXlzID0gW10sXHJcbiAgICAgIGNhY2hlID0ge307XHJcbiAgcmV0dXJuIHtcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiB0aGlzLm1heCkge1xyXG4gICAgICAgIGNhY2hlW2tleXMuc2hpZnQoKV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgLy8gXHJcbiAgICAgIGlmKGNhY2hlW2tleV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgICAgY2FjaGVba2V5XSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGU7XHJcbiAgICAgIHJldHVybiBjYWNoZVtrZXldO1xyXG4gICAgfSxcclxuICAgIG1heDogbWF4LFxyXG4gICAgbGVuOmZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBrZXlzLmxlbmd0aDtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vLyAvLyBzZXR1cCB0aGUgcmF3IEV4cHJlc3Npb25cclxuXHJcblxyXG4vLyBoYW5kbGUgdGhlIHNhbWUgbG9naWMgb24gY29tcG9uZW50J3MgYG9uLSpgIGFuZCBlbGVtZW50J3MgYG9uLSpgXHJcbi8vIHJldHVybiB0aGUgZmlyZSBvYmplY3RcclxuXy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKHZhbHVlLCB0eXBlICl7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLCBldmFsdWF0ZTtcclxuICBpZih2YWx1ZS50eXBlID09PSAnZXhwcmVzc2lvbicpeyAvLyBpZiBpcyBleHByZXNzaW9uLCBnbyBldmFsdWF0ZWQgd2F5XHJcbiAgICBldmFsdWF0ZSA9IHZhbHVlLmdldDtcclxuICB9XHJcbiAgaWYoZXZhbHVhdGUpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUob2JqKXtcclxuICAgICAgc2VsZi4kdXBkYXRlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSBvYmo7XHJcbiAgICAgICAgdmFyIHJlcyA9IGV2YWx1YXRlKHNlbGYpO1xyXG4gICAgICAgIGlmKHJlcyA9PT0gZmFsc2UgJiYgb2JqICYmIG9iai5wcmV2ZW50RGVmYXVsdCkgb2JqLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUoKXtcclxuICAgICAgdmFyIGFyZ3MgPSBfLnNsaWNlKGFyZ3VtZW50cyk7XHJcbiAgICAgIGFyZ3MudW5zaGlmdCh2YWx1ZSk7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHNlbGYuJGVtaXQuYXBwbHkoc2VsZiwgYXJncyk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvbmx5IGNhbGwgb25jZVxyXG5fLm9uY2UgPSBmdW5jdGlvbihmbil7XHJcbiAgdmFyIHRpbWUgPSAwO1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgaWYoIHRpbWUrKyA9PT0gMCkgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcbn1cclxuXHJcbl8uZml4T2JqU3RyID0gZnVuY3Rpb24oc3RyKXtcclxuICBpZihzdHIudHJpbSgpLmluZGV4T2YoJ3snKSAhPT0gMCl7XHJcbiAgICByZXR1cm4gJ3snICsgc3RyICsgJ30nO1xyXG4gIH1cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG5cclxuXy5tYXA9IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjayl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgcmVzLnB1c2goY2FsbGJhY2soYXJyYXlbaV0sIGkpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gbG9nKG1zZywgdHlwZSl7XHJcbiAgaWYodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpICBjb25zb2xlW3R5cGUgfHwgXCJsb2dcIl0obXNnKTtcclxufVxyXG5cclxuXy5sb2cgPSBsb2c7XHJcblxyXG5cclxuXy5ub3JtTGlzdGVuZXIgPSBmdW5jdGlvbiggZXZlbnRzICApe1xyXG4gICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW107XHJcbiAgICB2YXIgcFR5cGUgPSBfLnR5cGVPZiggZXZlbnRzICk7XHJcbiAgICBpZiggcFR5cGUgPT09ICdhcnJheScgKXtcclxuICAgICAgcmV0dXJuIGV2ZW50cztcclxuICAgIH1lbHNlIGlmICggcFR5cGUgPT09ICdvYmplY3QnICl7XHJcbiAgICAgIGZvciggdmFyIGkgaW4gZXZlbnRzICkgaWYgKCBldmVudHMuaGFzT3duUHJvcGVydHkoaSkgKXtcclxuICAgICAgICBldmVudExpc3RlbmVycy5wdXNoKHtcclxuICAgICAgICAgIHR5cGU6IGksXHJcbiAgICAgICAgICBsaXN0ZW5lcjogZXZlbnRzW2ldXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV2ZW50TGlzdGVuZXJzO1xyXG59XHJcblxyXG5cclxuLy9odHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9zaW5nbGUtcGFnZS5odG1sI3ZvaWQtZWxlbWVudHNcclxuXy5pc1ZvaWRUYWcgPSBfLm1ha2VQcmVkaWNhdGUoXCJhcmVhIGJhc2UgYnIgY29sIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZW51aXRlbSBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnIgci1jb250ZW50XCIpO1xyXG5fLmlzQm9vbGVhbkF0dHIgPSBfLm1ha2VQcmVkaWNhdGUoJ3NlbGVjdGVkIGNoZWNrZWQgZGlzYWJsZWQgcmVhZG9ubHkgcmVxdWlyZWQgb3BlbiBhdXRvZm9jdXMgY29udHJvbHMgYXV0b3BsYXkgY29tcGFjdCBsb29wIGRlZmVyIG11bHRpcGxlJyk7XHJcblxyXG5cclxuXy5pc0V4cHIgPSBmdW5jdGlvbihleHByKXtcclxuICByZXR1cm4gZXhwciAmJiBleHByLnR5cGUgPT09ICdleHByZXNzaW9uJztcclxufVxyXG4vLyBAVE9ETzogbWFrZSBpdCBtb3JlIHN0cmljdFxyXG5fLmlzR3JvdXAgPSBmdW5jdGlvbihncm91cCl7XHJcbiAgcmV0dXJuIGdyb3VwLmluamVjdCB8fCBncm91cC4kaW5qZWN0O1xyXG59XHJcblxyXG5fLmdldENvbXBpbGVGbiA9IGZ1bmN0aW9uKHNvdXJjZSwgY3R4LCBvcHRpb25zKXtcclxuICByZXR1cm4gY3R4LiRjb21waWxlLmJpbmQoY3R4LHNvdXJjZSwgb3B0aW9ucylcclxufVxyXG5cclxuLy8gcmVtb3ZlIGRpcmVjdGl2ZSBwYXJhbSBmcm9tIEFTVFxyXG5fLmZpeFRhZ0FTVCA9IGZ1bmN0aW9uKCB0YWdBU1QsIENvbXBvbmVudCApe1xyXG5cclxuICBpZiggdGFnQVNULnRvdWNoZWQgKSByZXR1cm47XHJcblxyXG4gIHZhciBhdHRycyA9IHRhZ0FTVC5hdHRycztcclxuXHJcbiAgaWYoICFhdHRycyApIHJldHVybjtcclxuXHJcbiAgLy8gTWF5YmUgbXVsdGlwbGUgZGlyZWN0aXZlIG5lZWQgc2FtZSBwYXJhbSwgXHJcbiAgLy8gV2UgcGxhY2UgYWxsIHBhcmFtIGluIHRvdGFsUGFyYW1NYXBcclxuICB2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xyXG4gIGlmKCFsZW4pIHJldHVybjtcclxuICB2YXIgZGlyZWN0aXZlcz1bXSwgb3RoZXJBdHRyTWFwID0ge307XHJcbiAgZm9yKDtsZW4tLTspe1xyXG5cclxuICAgIHZhciBhdHRyID0gYXR0cnNbIGxlbiBdO1xyXG5cclxuXHJcbiAgICAvLyBASUUgZml4IElFOS0gaW5wdXQgdHlwZSBjYW4ndCBhc3NpZ24gYWZ0ZXIgdmFsdWVcclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ3R5cGUnKSBhdHRyLnByaW9yaXR5ID0gTUFYX1BSSU9SSVRZKzE7XHJcblxyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IENvbXBvbmVudC5kaXJlY3RpdmUoIGF0dHIubmFtZSApO1xyXG4gICAgaWYoIGRpcmVjdGl2ZSApIHtcclxuXHJcbiAgICAgIGF0dHIucHJpb3JpdHkgPSBkaXJlY3RpdmUucHJpb3JpdHkgfHwgMTtcclxuICAgICAgYXR0ci5kaXJlY3RpdmUgPSB0cnVlO1xyXG4gICAgICBkaXJlY3RpdmVzLnB1c2goYXR0cik7XHJcblxyXG4gICAgfWVsc2UgaWYoYXR0ci50eXBlID09PSAnYXR0cmlidXRlJyl7XHJcbiAgICAgIG90aGVyQXR0ck1hcFthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaCggZnVuY3Rpb24oIGF0dHIgKXtcclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKGF0dHIubmFtZSk7XHJcbiAgICB2YXIgcGFyYW0gPSBkaXJlY3RpdmUucGFyYW07XHJcbiAgICBpZihwYXJhbSAmJiBwYXJhbS5sZW5ndGgpe1xyXG4gICAgICBhdHRyLnBhcmFtID0ge307XHJcbiAgICAgIHBhcmFtLmZvckVhY2goZnVuY3Rpb24oIG5hbWUgKXtcclxuICAgICAgICBpZiggbmFtZSBpbiBvdGhlckF0dHJNYXAgKXtcclxuICAgICAgICAgIGF0dHIucGFyYW1bbmFtZV0gPSBvdGhlckF0dHJNYXBbbmFtZV0gPT09IHVuZGVmaW5lZD8gdHJ1ZTogb3RoZXJBdHRyTWFwW25hbWVdXHJcbiAgICAgICAgICBfLnJlbW92ZU9uZShhdHRycywgZnVuY3Rpb24oYXR0cil7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyLm5hbWUgPT09IG5hbWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhdHRycy5zb3J0KGZ1bmN0aW9uKGExLCBhMil7XHJcbiAgICBcclxuICAgIHZhciBwMSA9IGExLnByaW9yaXR5O1xyXG4gICAgdmFyIHAyID0gYTIucHJpb3JpdHk7XHJcblxyXG4gICAgaWYoIHAxID09IG51bGwgKSBwMSA9IE1BWF9QUklPUklUWTtcclxuICAgIGlmKCBwMiA9PSBudWxsICkgcDIgPSBNQVhfUFJJT1JJVFk7XHJcblxyXG4gICAgcmV0dXJuIHAyIC0gcDE7XHJcblxyXG4gIH0pXHJcblxyXG4gIHRhZ0FTVC50b3VjaGVkID0gdHJ1ZTtcclxufVxyXG5cclxuXy5maW5kSXRlbSA9IGZ1bmN0aW9uKGxpc3QsIGZpbHRlcil7XHJcbiAgaWYoIWxpc3QgfHwgIWxpc3QubGVuZ3RoKSByZXR1cm47XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIHdoaWxlKGxlbi0tKXtcclxuICAgIGlmKGZpbHRlcihsaXN0W2xlbl0pKSByZXR1cm4gbGlzdFtsZW5dXHJcbiAgfVxyXG59XHJcblxyXG5fLmdldFBhcmFtT2JqID0gZnVuY3Rpb24oY29tcG9uZW50LCBwYXJhbSl7XHJcbiAgdmFyIHBhcmFtT2JqID0ge307XHJcbiAgaWYocGFyYW0pIHtcclxuICAgIGZvcih2YXIgaSBpbiBwYXJhbSkgaWYocGFyYW0uaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbVtpXTtcclxuICAgICAgcGFyYW1PYmpbaV0gPSAgdmFsdWUgJiYgdmFsdWUudHlwZT09PSdleHByZXNzaW9uJz8gY29tcG9uZW50LiRnZXQodmFsdWUpOiB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHBhcmFtT2JqO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ0JFR0lOJzogJ3snLFxyXG4gICdFTkQnOiAnfScsXHJcbiAgJ1BSRUNPTVBJTEUnOiBmYWxzZVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcbnZhciBFbGVtZW50ID0gcmVxdWlyZSgnLi9FbGVtZW50LmpzJyk7XHJcblxyXG52YXIgcHJvdG8gPSB7XHJcbiAgICBjcmVhdGVEb2N1bWVudEZyYWdtZW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgZG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhZ05hbWUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVUZXh0Tm9kZTogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgZG9jID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvYztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RvY3VtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiZnVuY3Rpb24gZG9jdW1lbnRGcmFnbWVudCgpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5kb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50RnJhZ21lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiZnVuY3Rpb24gRWxlbWVudCh0YWdOYW1lKXtcclxuICAgIHRoaXMuX3RhZ05hbWUgPSB0YWdOYW1lO1xyXG4gICAgdGhpcy5fYXR0cnMgPSBbXTtcclxuICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24oYXR0ck5hbWUsIGF0dHJWYWx1ZSl7XHJcbiAgICB2YXIgZXZlbnRQYXR0ZXJuID0gL29uLS87XHJcblxyXG4gICAgaWYoZXZlbnRQYXR0ZXJuLnRlc3QoYXR0ck5hbWUpKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5fYXR0cnMucHVzaCh7bmFtZTogYXR0ck5hbWUsIHZhbHVlOiBhdHRyVmFsdWV9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIpe1xyXG4gICAgdGhpcy5fZXZlbnRzLnB1c2goe25hbWU6IGV2ZW50TmFtZS5yZXBsYWNlKC8tLywgJycpLCB2YWx1ZTogaGFuZGxlcn0pO1xyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obm9kZSl7XHJcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE0OjU0OjMzIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTE5IDE0OjU5OjQwXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKGNoaWxkQ2xhc3MsIGJhc2VDbGFzcyl7XHJcbiAgICB2YXIgZm4gPSBmdW5jdGlvbigpe307XHJcbiAgICBmbi5wcm90b3R5cGUgPSBiYXNlQ2xhc3MucHJvdG90eXBlO1xyXG4gICAgY2hpbGRDbGFzcy5wcm90b3R5cGUgPSBuZXcgZm4oKTtcclxuICAgIGNoaWxkQ2xhc3MucHJvdG90eXBlLnN1cGVyID0gYmFzZUNsYXNzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91dGlscy9leHRlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNTowNTowMSBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxODowNDo0NlxyXG4gKi9cclxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uLy9wYXJzZXIvc3JjL1BhcnNlci5qcycpO1xyXG5cclxuaWYoIXRoaXMuZG9jdW1lbnQpe1xyXG4gICAgZG9jdW1lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50LmpzJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEJhc2VSZW5kZXJTdG9yZShvYmope1xyXG5cclxuICAgIHRoaXMuX2JlZm9yZUNvbmZpZygpO1xyXG4gICAgdGhpcy5fY29uZmlnTW9kZWwob2JqKTtcclxuICAgIHRoaXMuX2FmdGVyQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9wYXJzZSgpO1xyXG59XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9iZWZvcmVDb25maWcgPSBmdW5jdGlvbigpe1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fYWZ0ZXJDb25maWcgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcodGhpcy5kYXRhKTtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbmZpZ01vZGVsID0gZnVuY3Rpb24obW9kZWwpe1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBtb2RlbCk7XHJcblxyXG4gICAgaWYoIW1vZGVsLmRhdGEpIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgdGhpcy5fbGlzdCA9IHt9O1xyXG4gICAgdGhpcy5fZGVmaW5lciA9IG1vZGVsO1xyXG59XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9jb21waWxlID0gZnVuY3Rpb24oYXN0LCBsaXN0SW5mbyl7XHJcbiAgICBpZihhc3QgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKHRoaXMuX2NvbXBpbGUoYXN0W2ldLCBsaXN0SW5mbykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21waWxlclthc3QudHlwZV0oYXN0LCB0aGlzLCBsaXN0SW5mbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3BhcnNlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuQVNUID0gbmV3IFBhcnNlcih0aGlzLnRlbXBsYXRlKS5wYXJzZSgpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fc2dfID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEV2ZW50KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZGF0YVtwYXRoXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZVJlbmRlclN0b3JlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0b3JlL0Jhc2VSZW5kZXJTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcblxyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxudmFyIG5vZGUgPSByZXF1aXJlKFwiLi9ub2RlLmpzXCIpO1xyXG52YXIgTGV4ZXIgPSByZXF1aXJlKFwiLi9MZXhlci5qc1wiKTtcclxudmFyIHZhck5hbWUgPSBfLnZhck5hbWU7XHJcbnZhciBjdHhOYW1lID0gXy5jdHhOYW1lO1xyXG52YXIgZXh0TmFtZSA9IF8uZXh0TmFtZTtcclxudmFyIGlzUGF0aCA9IF8ubWFrZVByZWRpY2F0ZShcIlNUUklORyBJREVOVCBOVU1CRVJcIik7XHJcbnZhciBpc0tleVdvcmQgPSBfLm1ha2VQcmVkaWNhdGUoXCJ0cnVlIGZhbHNlIHVuZGVmaW5lZCBudWxsIHRoaXMgQXJyYXkgRGF0ZSBKU09OIE1hdGggTmFOIFJlZ0V4cCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50IGVuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgcGFyc2VGbG9hdCBwYXJzZUludCBPYmplY3RcIik7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBQYXJzZXIoaW5wdXQsIG9wdHMpe1xyXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgdGhpcy50b2tlbnMgPSBuZXcgTGV4ZXIoaW5wdXQsIG9wdHMpLmxleCgpO1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB0aGlzLmxlbmd0aCA9IHRoaXMudG9rZW5zLmxlbmd0aDtcclxufVxyXG5cclxuXHJcbnZhciBvcCA9IFBhcnNlci5wcm90b3R5cGU7XHJcblxyXG5cclxub3AucGFyc2UgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB2YXIgcmVzPSB0aGlzLnByb2dyYW0oKTtcclxuICBpZih0aGlzLmxsKCkudHlwZSA9PT0gJ1RBR19DTE9TRScpe1xyXG4gICAgdGhpcy5lcnJvcihcIllvdSBtYXkgZ290IGEgdW5jbG9zZWQgVGFnXCIpXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbm9wLmxsID0gIGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgaWYoayA8IDApIGsgPSBrICsgMTtcclxuICB2YXIgcG9zID0gdGhpcy5wb3MgKyBrIC0gMTtcclxuICBpZihwb3MgPiB0aGlzLmxlbmd0aCAtIDEpe1xyXG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5sZW5ndGgtMV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLnRva2Vuc1twb3NdO1xyXG59XHJcbiAgLy8gbG9va2FoZWFkXHJcbm9wLmxhID0gZnVuY3Rpb24oayl7XHJcbiAgcmV0dXJuICh0aGlzLmxsKGspIHx8ICcnKS50eXBlO1xyXG59XHJcblxyXG5vcC5tYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGw7XHJcbiAgaWYoIShsbCA9IHRoaXMuZWF0KHR5cGUsIHZhbHVlKSkpe1xyXG4gICAgbGwgID0gdGhpcy5sbCgpO1xyXG4gICAgdGhpcy5lcnJvcignZXhwZWN0IFsnICsgdHlwZSArICh2YWx1ZSA9PSBudWxsPyAnJzonOicrIHZhbHVlKSArICddXCIgLT4gZ290IFwiWycgKyBsbC50eXBlICsgKHZhbHVlPT1udWxsPyAnJzonOicrbGwudmFsdWUpICsgJ10nLCBsbC5wb3MpXHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gbGw7XHJcbiAgfVxyXG59XHJcblxyXG5vcC5lcnJvciA9IGZ1bmN0aW9uKG1zZywgcG9zKXtcclxuICBtc2cgPSAgXCJcXG7jgJAgcGFyc2UgZmFpbGVkIOOAkSBcIiArIG1zZyArICAnOlxcblxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdHlwZW9mIHBvcyA9PT0gJ251bWJlcic/IHBvczogdGhpcy5sbCgpLnBvc3x8MCk7XHJcbiAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XHJcbn1cclxuXHJcbm9wLm5leHQgPSBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIHRoaXMucG9zICs9IGs7XHJcbn1cclxub3AuZWF0ID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBpZih0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpe1xyXG4gICAgZm9yKHZhciBsZW4gPSB0eXBlLmxlbmd0aCA7IGxlbi0tOyl7XHJcbiAgICAgIGlmKGxsLnR5cGUgPT09IHR5cGVbbGVuXSkge1xyXG4gICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIHJldHVybiBsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgaWYoIGxsLnR5cGUgPT09IHR5cGUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbGwudmFsdWUgPT09IHZhbHVlKSApe1xyXG4gICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICByZXR1cm4gbGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gcHJvZ3JhbVxyXG4vLyAgOkVPRlxyXG4vLyAgfCAoc3RhdGVtZW50KSogRU9GXHJcbm9wLnByb2dyYW0gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZW1lbnRzID0gW10sICBsbCA9IHRoaXMubGwoKTtcclxuICB3aGlsZShsbC50eXBlICE9PSAnRU9GJyAmJiBsbC50eXBlICE9PSdUQUdfQ0xPU0UnKXtcclxuXHJcbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICB9XHJcbiAgLy8gaWYobGwudHlwZSA9PT0gJ1RBR19DTE9TRScpIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGhhdmUgdW5tYXRjaGVkIFRhZ1wiKVxyXG4gIHJldHVybiBzdGF0ZW1lbnRzO1xyXG59XHJcblxyXG4vLyBzdGF0ZW1lbnRcclxuLy8gIDogeG1sXHJcbi8vICB8IGpzdFxyXG4vLyAgfCB0ZXh0XHJcbm9wLnN0YXRlbWVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgJ05BTUUnOlxyXG4gICAgY2FzZSAnVEVYVCc6XHJcbiAgICAgIHZhciB0ZXh0ID0gbGwudmFsdWU7XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB3aGlsZShsbCA9IHRoaXMuZWF0KFsnTkFNRScsICdURVhUJ10pKXtcclxuICAgICAgICB0ZXh0ICs9IGxsLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBub2RlLnRleHQodGV4dCk7XHJcbiAgICBjYXNlICdUQUdfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLnhtbCgpO1xyXG4gICAgY2FzZSAnT1BFTic6IFxyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlY3RpdmUoKTtcclxuICAgIGNhc2UgJ0VYUFJfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuLy8geG1sIFxyXG4vLyBzdGFnIHN0YXRlbWVudCogVEFHX0NMT1NFPyhpZiBzZWxmLWNsb3NlZCB0YWcpXHJcbm9wLnhtbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUsIGF0dHJzLCBjaGlsZHJlbiwgc2VsZkNsb3NlZDtcclxuICBuYW1lID0gdGhpcy5tYXRjaCgnVEFHX09QRU4nKS52YWx1ZTtcclxuICBhdHRycyA9IHRoaXMuYXR0cnMoKTtcclxuICBzZWxmQ2xvc2VkID0gdGhpcy5lYXQoJy8nKVxyXG4gIHRoaXMubWF0Y2goJz4nKTtcclxuICBpZiggIXNlbGZDbG9zZWQgJiYgIV8uaXNWb2lkVGFnKG5hbWUpICl7XHJcbiAgICBjaGlsZHJlbiA9IHRoaXMucHJvZ3JhbSgpO1xyXG4gICAgaWYoIXRoaXMuZWF0KCdUQUdfQ0xPU0UnLCBuYW1lKSkgdGhpcy5lcnJvcignZXhwZWN0IDwvJytuYW1lKyc+IGdvdCcrICdubyBtYXRjaGVkIGNsb3NlVGFnJylcclxuICB9XHJcbiAgcmV0dXJuIG5vZGUuZWxlbWVudChuYW1lLCBhdHRycywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vLyB4ZW50aXR5XHJcbi8vICAtcnVsZSh3cmFwIGF0dHJpYnV0ZSlcclxuLy8gIC1hdHRyaWJ1dGVcclxuLy9cclxuLy8gX19leGFtcGxlX19cclxuLy8gIG5hbWUgPSAxIHwgIFxyXG4vLyAgbmctaGlkZSB8XHJcbi8vICBvbi1jbGljaz17e319IHwgXHJcbi8vICB7eyNpZiBuYW1lfX1vbi1jbGljaz17e3h4fX17eyNlbHNlfX1vbi10YXA9e3t9fXt7L2lmfX1cclxuXHJcbm9wLnhlbnRpdHkgPSBmdW5jdGlvbihsbCl7XHJcbiAgdmFyIG5hbWUgPSBsbC52YWx1ZSwgdmFsdWUsIG1vZGlmaWVyO1xyXG4gIGlmKGxsLnR5cGUgPT09ICdOQU1FJyl7XHJcbiAgICAvL0Agb25seSBmb3IgdGVzdFxyXG4gICAgaWYofm5hbWUuaW5kZXhPZignLicpKXtcclxuICAgICAgdmFyIHRtcCA9IG5hbWUuc3BsaXQoJy4nKTtcclxuICAgICAgbmFtZSA9IHRtcFswXTtcclxuICAgICAgbW9kaWZpZXIgPSB0bXBbMV1cclxuXHJcbiAgICB9XHJcbiAgICBpZiggdGhpcy5lYXQoXCI9XCIpICkgdmFsdWUgPSB0aGlzLmF0dHZhbHVlKG1vZGlmaWVyKTtcclxuICAgIHJldHVybiBub2RlLmF0dHJpYnV0ZSggbmFtZSwgdmFsdWUsIG1vZGlmaWVyICk7XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbmFtZSAhPT0gJ2lmJykgdGhpcy5lcnJvcihcImN1cnJlbnQgdmVyc2lvbi4gT05MWSBSVUxFICNpZiAjZWxzZSAjZWxzZWlmIGlzIHZhbGlkIGluIHRhZywgdGhlIHJ1bGUgI1wiICsgbmFtZSArICcgaXMgaW52YWxpZCcpO1xyXG4gICAgcmV0dXJuIHRoaXNbJ2lmJ10odHJ1ZSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gc3RhZyAgICAgOjo9ICAgICc8JyBOYW1lIChTIGF0dHIpKiBTPyAnPicgIFxyXG4vLyBhdHRyICAgIDo6PSAgICAgTmFtZSBFcSBhdHR2YWx1ZVxyXG5vcC5hdHRycyA9IGZ1bmN0aW9uKGlzQXR0cmlidXRlKXtcclxuICB2YXIgZWF0XHJcbiAgaWYoIWlzQXR0cmlidXRlKXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIiwgXCJPUEVOXCJdXHJcbiAgfWVsc2V7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCJdXHJcbiAgfVxyXG5cclxuICB2YXIgYXR0cnMgPSBbXSwgbGw7XHJcbiAgd2hpbGUgKGxsID0gdGhpcy5lYXQoZWF0KSl7XHJcbiAgICBhdHRycy5wdXNoKHRoaXMueGVudGl0eSggbGwgKSlcclxuICB9XHJcbiAgcmV0dXJuIGF0dHJzO1xyXG59XHJcblxyXG4vLyBhdHR2YWx1ZVxyXG4vLyAgOiBTVFJJTkcgIFxyXG4vLyAgfCBOQU1FXHJcbm9wLmF0dHZhbHVlID0gZnVuY3Rpb24obWRmKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIk5BTUVcIjpcclxuICAgIGNhc2UgXCJVTlFcIjpcclxuICAgIGNhc2UgXCJTVFJJTkdcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IGxsLnZhbHVlO1xyXG4gICAgICBpZih+dmFsdWUuaW5kZXhPZihjb25maWcuQkVHSU4pICYmIH52YWx1ZS5pbmRleE9mKGNvbmZpZy5FTkQpICYmIG1kZiE9PSdjbXBsJyl7XHJcbiAgICAgICAgdmFyIGNvbnN0YW50ID0gdHJ1ZTtcclxuICAgICAgICB2YXIgcGFyc2VkID0gbmV3IFBhcnNlcih2YWx1ZSwgeyBtb2RlOiAyIH0pLnBhcnNlKCk7XHJcbiAgICAgICAgaWYocGFyc2VkLmxlbmd0aCA9PT0gMSAmJiBwYXJzZWRbMF0udHlwZSA9PT0gJ2V4cHJlc3Npb24nKSByZXR1cm4gcGFyc2VkWzBdO1xyXG4gICAgICAgIHZhciBib2R5ID0gW107XHJcbiAgICAgICAgcGFyc2VkLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICBpZighaXRlbS5jb25zdGFudCkgY29uc3RhbnQ9ZmFsc2U7XHJcbiAgICAgICAgICAvLyBzaWxlbnQgdGhlIG11dGlwbGUgaW50ZXBsYXRpb25cclxuICAgICAgICAgICAgYm9keS5wdXNoKGl0ZW0uYm9keSB8fCBcIidcIiArIGl0ZW0udGV4dC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIikgKyBcIidcIik7ICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBib2R5ID0gXCJbXCIgKyBib2R5LmpvaW4oXCIsXCIpICsgXCJdLmpvaW4oJycpXCI7XHJcbiAgICAgICAgdmFsdWUgPSBub2RlLmV4cHJlc3Npb24oYm9keSwgbnVsbCwgY29uc3RhbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIGNhc2UgXCJFWFBSX09QRU5cIjpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICAvLyBjYXNlIFwiT1BFTlwiOlxyXG4gICAgLy8gICBpZihsbC52YWx1ZSA9PT0gJ2luYycgfHwgbGwudmFsdWUgPT09ICdpbmNsdWRlJyl7XHJcbiAgICAvLyAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaW5jKCk7XHJcbiAgICAvLyAgIH1lbHNle1xyXG4gICAgLy8gICAgIHRoaXMuZXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBvbmx5IHN1cHBvcnQgaW50ZXBsYXRpb24gYW5kIHsjaW5jfSBzdGF0ZW1lbnQnKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7I319XHJcbm9wLmRpcmVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUgPSB0aGlzLmxsKCkudmFsdWU7XHJcbiAgdGhpcy5uZXh0KCk7XHJcbiAgaWYodHlwZW9mIHRoaXNbbmFtZV0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV0oKVxyXG4gIH1lbHNle1xyXG4gICAgdGhpcy5lcnJvcignVW5kZWZpbmVkIGRpcmVjdGl2ZVsnKyBuYW1lICsnXScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7fX1cclxub3AuaW50ZXJwbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCdFWFBSX09QRU4nKTtcclxuICB2YXIgcmVzID0gdGhpcy5leHByZXNzaW9uKHRydWUpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIHt7fn19XHJcbm9wLmluYyA9IG9wLmluY2x1ZGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb250ZW50ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIG5vZGUudGVtcGxhdGUoY29udGVudCk7XHJcbn1cclxuXHJcbi8vIHt7I2lmfX1cclxub3BbXCJpZlwiXSA9IGZ1bmN0aW9uKHRhZyl7XHJcbiAgdmFyIHRlc3QgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcblxyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG4gIHZhciBzdGF0ZW1lbnQgPSAhdGFnPyBcInN0YXRlbWVudFwiIDogXCJhdHRyc1wiO1xyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgdmFyIGxsLCBjbG9zZTtcclxuICB3aGlsZSggISAoY2xvc2UgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gICAgaWYoIGxsLnR5cGUgPT09ICdPUEVOJyApe1xyXG4gICAgICBzd2l0Y2goIGxsLnZhbHVlICl7XHJcbiAgICAgICAgY2FzZSAnZWxzZSc6XHJcbiAgICAgICAgICBjb250YWluZXIgPSBhbHRlcm5hdGU7XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIHRoaXMubWF0Y2goICdFTkQnICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdlbHNlaWYnOlxyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICBhbHRlcm5hdGUucHVzaCggdGhpc1tcImlmXCJdKHRhZykgKTtcclxuICAgICAgICAgIHJldHVybiBub2RlWydpZiddKCB0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUgKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29udGFpbmVyLnB1c2goIHRoaXNbc3RhdGVtZW50XSh0cnVlKSApO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpc1tzdGF0ZW1lbnRdKHRydWUpKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gaWYgc3RhdGVtZW50IG5vdCBtYXRjaGVkXHJcbiAgaWYoY2xvc2UudmFsdWUgIT09IFwiaWZcIikgdGhpcy5lcnJvcignVW5tYXRjaGVkIGlmIGRpcmVjdGl2ZScpXHJcbiAgcmV0dXJuIG5vZGVbXCJpZlwiXSh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xyXG59XHJcblxyXG5cclxuLy8gQG1hcmsgICBtdXN0YWNoZSBzeW50YXggaGF2ZSBuYXRydXJlIGRpcywgY2Fub3Qgd2l0aCBleHByZXNzaW9uXHJcbi8vIHt7I2xpc3R9fVxyXG5vcC5saXN0ID0gZnVuY3Rpb24oKXtcclxuICAvLyBzZXF1ZW5jZSBjYW4gYmUgYSBsaXN0IG9yIGhhc2hcclxuICB2YXIgc2VxdWVuY2UgPSB0aGlzLmV4cHJlc3Npb24oKSwgdmFyaWFibGUsIGxsLCB0cmFjaztcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0lERU5UJywgJ2FzJyk7XHJcblxyXG4gIHZhcmlhYmxlID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ0lERU5UJywgJ2J5Jykpe1xyXG4gICAgaWYodGhpcy5lYXQoJ0lERU5UJyx2YXJpYWJsZSArICdfaW5kZXgnKSl7XHJcbiAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICB0cmFjayA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gICAgICBpZih0cmFjay5jb25zdGFudCl7XHJcbiAgICAgICAgLy8gdHJ1ZSBpcyBtZWFucyBjb25zdGFudCwgd2UgaGFuZGxlIGl0IGp1c3QgbGlrZSB4eHhfaW5kZXguXHJcbiAgICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgd2hpbGUoICEobGwgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGlmKHRoaXMuZWF0KCdPUEVOJywgJ2Vsc2UnKSl7XHJcbiAgICAgIGNvbnRhaW5lciA9ICBhbHRlcm5hdGU7XHJcbiAgICAgIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBpZihsbC52YWx1ZSAhPT0gJ2xpc3QnKSB0aGlzLmVycm9yKCdleHBlY3QgJyArICdsaXN0IGdvdCAnICsgJy8nICsgbGwudmFsdWUgKyAnICcsIGxsLnBvcyApO1xyXG4gIHJldHVybiBub2RlLmxpc3Qoc2VxdWVuY2UsIHZhcmlhYmxlLCBjb25zZXF1ZW50LCBhbHRlcm5hdGUsIHRyYWNrKTtcclxufVxyXG5cclxuXHJcbm9wLmV4cHJlc3Npb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBleHByZXNzaW9uO1xyXG4gIGlmKHRoaXMuZWF0KCdAKCcpKXsgLy9vbmNlIGJpbmRcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICAgIGV4cHJlc3Npb24ub25jZSA9IHRydWU7XHJcbiAgICB0aGlzLm1hdGNoKCcpJylcclxuICB9ZWxzZXtcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICB9XHJcbiAgcmV0dXJuIGV4cHJlc3Npb247XHJcbn1cclxuXHJcbm9wLmV4cHIgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZGVwZW5kID0gW107XHJcblxyXG4gIHZhciBidWZmZXIgPSB0aGlzLmZpbHRlcigpXHJcblxyXG4gIHZhciBib2R5ID0gYnVmZmVyLmdldCB8fCBidWZmZXI7XHJcbiAgdmFyIHNldGJvZHkgPSBidWZmZXIuc2V0O1xyXG4gIHJldHVybiBub2RlLmV4cHJlc3Npb24oYm9keSwgc2V0Ym9keSwgIXRoaXMuZGVwZW5kLmxlbmd0aCwgYnVmZmVyLmZpbHRlcnMpO1xyXG59XHJcblxyXG5cclxuLy8gZmlsdGVyXHJcbi8vIGFzc2lnbiAoJ3wnIGZpbHRlcm5hbWVbJzonIGFyZ3NdKSAqIFxyXG5vcC5maWx0ZXIgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hc3NpZ24oKTtcclxuICB2YXIgbGwgPSB0aGlzLmVhdCgnfCcpO1xyXG4gIHZhciBidWZmZXIgPSBbXSwgZmlsdGVycyxzZXRCdWZmZXIsIHByZWZpeCxcclxuICAgIGF0dHIgPSBcInRcIiwgXHJcbiAgICBzZXQgPSBsZWZ0LnNldCwgZ2V0LCBcclxuICAgIHRtcCA9IFwiXCI7XHJcblxyXG4gIGlmKGxsKXtcclxuICAgIGlmKHNldCkge1xyXG4gICAgICBzZXRCdWZmZXIgPSBbXTtcclxuICAgICAgZmlsdGVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeCA9IFwiKGZ1bmN0aW9uKFwiICsgYXR0ciArIFwiKXtcIjtcclxuXHJcbiAgICBkb3tcclxuICAgICAgdmFyIGZpbHRlck5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICB0bXAgPSBhdHRyICsgXCIgPSBcIiArIGN0eE5hbWUgKyBcIi5fZl8oJ1wiICsgZmlsdGVyTmFtZSArIFwiJyApLmdldC5jYWxsKCBcIitfLmN0eE5hbWUgK1wiLFwiICsgYXR0ciA7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCc6Jykpe1xyXG4gICAgICAgIHRtcCArPVwiLCBcIisgdGhpcy5hcmd1bWVudHMoXCJ8XCIpLmpvaW4oXCIsXCIpICsgXCIpO1wiXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRtcCArPSAnKTsnXHJcbiAgICAgIH1cclxuICAgICAgYnVmZmVyLnB1c2godG1wKTtcclxuICAgICAgXHJcbiAgICAgIGlmKHNldCl7XHJcbiAgICAgICAgLy8gb25seSBpbiBydW50aW1lICx3ZSBjYW4gZGV0ZWN0ICB3aGV0aGVyICB0aGUgZmlsdGVyIGhhcyBhIHNldCBmdW5jdGlvbi4gXHJcbiAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlck5hbWUpO1xyXG4gICAgICAgIHNldEJ1ZmZlci51bnNoaWZ0KCB0bXAucmVwbGFjZShcIiApLmdldC5jYWxsXCIsIFwiICkuc2V0LmNhbGxcIikgKTtcclxuICAgICAgfVxyXG5cclxuICAgIH13aGlsZShsbCA9IHRoaXMuZWF0KCd8JykpO1xyXG4gICAgYnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyICk7XHJcbiAgICBzZXRCdWZmZXIgJiYgc2V0QnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyKTtcclxuXHJcbiAgICBnZXQgPSAgcHJlZml4ICsgYnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK2xlZnQuZ2V0K1wiKVwiO1xyXG4gICAgLy8gd2UgY2FsbCBiYWNrIHRvIHZhbHVlLlxyXG4gICAgaWYoc2V0QnVmZmVyKXtcclxuICAgICAgLy8gY2hhbmdlIF9zc19fKG5hbWUsIF9wXykgdG8gX3NfXyhuYW1lLCBmaWx0ZXJGbihfcF8pKTtcclxuICAgICAgc2V0ID0gc2V0LnJlcGxhY2UoXy5zZXROYW1lLCBcclxuICAgICAgICBwcmVmaXggKyBzZXRCdWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIr44CAXy5zZXROYW1l44CAK1wiKVwiICk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gdGhlIHNldCBmdW5jdGlvbiBpcyBkZXBlbmQgb24gdGhlIGZpbHRlciBkZWZpbml0aW9uLiBpZiBpdCBoYXZlIHNldCBtZXRob2QsIHRoZSBzZXQgd2lsbCB3b3JrXHJcbiAgICB2YXIgcmV0ID0gZ2V0c2V0KGdldCwgc2V0KTtcclxuICAgIHJldC5maWx0ZXJzID0gZmlsdGVycztcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBhc3NpZ25cclxuLy8gbGVmdC1oYW5kLWV4cHIgPSBjb25kaXRpb25cclxub3AuYXNzaWduID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuY29uZGl0aW9uKCksIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWyc9JywgJys9JywgJy09JywgJyo9JywgJy89JywgJyU9J10pKXtcclxuICAgIGlmKCFsZWZ0LnNldCkgdGhpcy5lcnJvcignaW52YWxpZCBsZWZ0aGFuZCBleHByZXNzaW9uIGluIGFzc2lnbm1lbnQgZXhwcmVzc2lvbicpO1xyXG4gICAgcmV0dXJuIGdldHNldCggbGVmdC5zZXQucmVwbGFjZSggXCIsXCIgKyBfLnNldE5hbWUsIFwiLFwiICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKS5yZXBsYWNlKFwiJz0nXCIsIFwiJ1wiK2xsLnR5cGUrXCInXCIpLCBsZWZ0LnNldCk7XHJcbiAgICAvLyByZXR1cm4gZ2V0c2V0KCcoJyArIGxlZnQuZ2V0ICsgbGwudHlwZSAgKyB0aGlzLmNvbmRpdGlvbigpLmdldCArICcpJywgbGVmdC5zZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gb3JcclxuLy8gb3IgPyBhc3NpZ24gOiBhc3NpZ25cclxub3AuY29uZGl0aW9uID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHRlc3QgPSB0aGlzLm9yKCk7XHJcbiAgaWYodGhpcy5lYXQoJz8nKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KFt0ZXN0LmdldCArIFwiP1wiLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXQsIFxyXG4gICAgICB0aGlzLm1hdGNoKFwiOlwiKS50eXBlLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXRdLmpvaW4oXCJcIikpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRlc3Q7XHJcbn1cclxuXHJcbi8vIGFuZFxyXG4vLyBhbmQgJiYgb3Jcclxub3Aub3IgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuYW5kKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCd8fCcpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnfHwnICsgdGhpcy5vcigpLmdldCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyBlcXVhbFxyXG4vLyBlcXVhbCAmJiBhbmRcclxub3AuYW5kID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmVxdWFsKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCcmJicpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnJiYnICsgdGhpcy5hbmQoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyByZWxhdGlvblxyXG4vLyBcclxuLy8gZXF1YWwgPT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT0gcmVsYXRpb25cclxuLy8gZXF1YWwgPT09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9PSByZWxhdGlvblxyXG5vcC5lcXVhbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJlbGF0aW9uKCksIGxsO1xyXG4gIC8vIEBwZXJmO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnPT0nLCchPScsICc9PT0nLCAnIT09J10pKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5lcXVhbCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gcmVsYXRpb24gPCBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIDw9IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID49IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIGluIGFkZGl0aXZlXHJcbm9wLnJlbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYWRkaXRpdmUoKSwgbGw7XHJcbiAgLy8gQHBlcmZcclxuICBpZihsbCA9ICh0aGlzLmVhdChbJzwnLCAnPicsICc+PScsICc8PSddKSB8fCB0aGlzLmVhdCgnSURFTlQnLCAnaW4nKSApKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMucmVsYXRpb24oKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIGFkZGl0aXZlIDpcclxuLy8gbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSArIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgLSBtdWx0aXZlXHJcbm9wLmFkZGl0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMubXVsdGl2ZSgpICxsbDtcclxuICBpZihsbD0gdGhpcy5lYXQoWycrJywnLSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5hZGRpdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gbXVsdGl2ZSA6XHJcbi8vIHVuYXJ5XHJcbi8vIG11bHRpdmUgKiB1bmFyeVxyXG4vLyBtdWx0aXZlIC8gdW5hcnlcclxuLy8gbXVsdGl2ZSAlIHVuYXJ5XHJcbm9wLm11bHRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yYW5nZSgpICxsbDtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJyonLCAnLycgLCclJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMubXVsdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5vcC5yYW5nZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnVuYXJ5KCksIGxsLCByaWdodDtcclxuXHJcbiAgaWYobGwgPSB0aGlzLmVhdCgnLi4nKSl7XHJcbiAgICByaWdodCA9IHRoaXMudW5hcnkoKTtcclxuICAgIHZhciBib2R5ID0gXHJcbiAgICAgIFwiKGZ1bmN0aW9uKHN0YXJ0LGVuZCl7dmFyIHJlcyA9IFtdLHN0ZXA9ZW5kPnN0YXJ0PzE6LTE7IGZvcih2YXIgaSA9IHN0YXJ0OyBlbmQ+c3RhcnQ/aSA8PSBlbmQ6IGk+PWVuZDsgaT1pK3N0ZXApe3Jlcy5wdXNoKGkpOyB9IHJldHVybiByZXMgfSkoXCIrbGVmdC5nZXQrXCIsXCIrcmlnaHQuZ2V0K1wiKVwiXHJcbiAgICByZXR1cm4gZ2V0c2V0KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gbGVmdGhhbmRcclxuLy8gKyB1bmFyeVxyXG4vLyAtIHVuYXJ5XHJcbi8vIH4gdW5hcnlcclxuLy8gISB1bmFyeVxyXG5vcC51bmFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWycrJywnLScsJ34nLCAnISddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCcoJyArIGxsLnR5cGUgKyB0aGlzLnVuYXJ5KCkuZ2V0ICsgJyknKSA7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gdGhpcy5tZW1iZXIoKVxyXG4gIH1cclxufVxyXG5cclxuLy8gY2FsbFtsZWZ0aGFuZF0gOlxyXG4vLyBtZW1iZXIgYXJnc1xyXG4vLyBtZW1iZXIgWyBleHByZXNzaW9uIF1cclxuLy8gbWVtYmVyIC4gaWRlbnQgIFxyXG5cclxub3AubWVtYmVyID0gZnVuY3Rpb24oYmFzZSwgbGFzdCwgcGF0aGVzLCBwcmV2QmFzZSl7XHJcbiAgdmFyIGxsLCBwYXRoLCBleHRWYWx1ZTtcclxuXHJcblxyXG4gIHZhciBvbmx5U2ltcGxlQWNjZXNzb3IgPSBmYWxzZTtcclxuICBpZighYmFzZSl7IC8vZmlyc3RcclxuICAgIHBhdGggPSB0aGlzLnByaW1hcnkoKTtcclxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhdGg7XHJcbiAgICBpZih0eXBlID09PSAnc3RyaW5nJyl7IFxyXG4gICAgICBwYXRoZXMgPSBbXTtcclxuICAgICAgcGF0aGVzLnB1c2goIHBhdGggKTtcclxuICAgICAgbGFzdCA9IHBhdGg7XHJcbiAgICAgIGV4dFZhbHVlID0gZXh0TmFtZSArIFwiLlwiICsgcGF0aFxyXG4gICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgcGF0aCArIFwiJywgXCIgKyB2YXJOYW1lICsgXCIsIFwiICsgZXh0TmFtZSArIFwiKVwiO1xyXG4gICAgICBvbmx5U2ltcGxlQWNjZXNzb3IgPSB0cnVlO1xyXG4gICAgfWVsc2V7IC8vUHJpbWF0aXZlIFR5cGVcclxuICAgICAgaWYocGF0aC5nZXQgPT09ICd0aGlzJyl7XHJcbiAgICAgICAgYmFzZSA9IGN0eE5hbWU7XHJcbiAgICAgICAgcGF0aGVzID0gWyd0aGlzJ107XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICAgICAgYmFzZSA9IHBhdGguZ2V0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7IC8vIG5vdCBmaXJzdCBlbnRlclxyXG4gICAgaWYodHlwZW9mIGxhc3QgPT09ICdzdHJpbmcnICYmIGlzUGF0aCggbGFzdCkgKXsgLy8gaXMgdmFsaWQgcGF0aFxyXG4gICAgICBwYXRoZXMucHVzaChsYXN0KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBpZihwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCkgdGhpcy5kZXBlbmQucHVzaChwYXRoZXMpO1xyXG4gICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZihsbCA9IHRoaXMuZWF0KFsnWycsICcuJywgJygnXSkpe1xyXG4gICAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgICBjYXNlICcuJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICB2YXIgdG1wTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHRtcE5hbWUgKyBcIicsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIlsnXCIgKyB0bXBOYW1lICsgXCInXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoIGJhc2UsIHRtcE5hbWUsIHBhdGhlcywgIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnWyc6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgcGF0aCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgIC8vIG1lYW5zIGZ1bmN0aW9uIGNhbGwsIHdlIG5lZWQgdGhyb3cgdW5kZWZpbmVkIGVycm9yIHdoZW4gY2FsbCBmdW5jdGlvblxyXG4gICAgICAgIC8vIGFuZCBjb25maXJtIHRoYXQgdGhlIGZ1bmN0aW9uIGNhbGwgd29udCBsb3NlIGl0cyBjb250ZXh0XHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oXCIgKyBwYXRoLmdldCArIFwiLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbXCIgKyBwYXRoLmdldCArIFwiXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1hdGNoKCddJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgcGF0aCwgcGF0aGVzLCBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJygnOlxyXG4gICAgICAgIC8vIGNhbGwoY2FsbGVlLCBhcmdzKVxyXG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHMoKS5qb2luKCcsJyk7XHJcbiAgICAgICAgYmFzZSA9ICBiYXNlK1wiKFwiICsgYXJncyArXCIpXCI7XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIG51bGwsIHBhdGhlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCBwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCApIHRoaXMuZGVwZW5kLnB1c2goIHBhdGhlcyApO1xyXG4gIHZhciByZXMgPSAge2dldDogYmFzZX07XHJcbiAgaWYobGFzdCl7XHJcbiAgICByZXMuc2V0ID0gY3R4TmFtZSArIFwiLl9zc18oXCIgKyBcclxuICAgICAgICAobGFzdC5nZXQ/IGxhc3QuZ2V0IDogXCInXCIrIGxhc3QgKyBcIidcIikgKyBcclxuICAgICAgICBcIixcIisgXy5zZXROYW1lICsgXCIsXCIrIFxyXG4gICAgICAgIChwcmV2QmFzZT9wcmV2QmFzZTpfLnZhck5hbWUpICsgXHJcbiAgICAgICAgXCIsICc9JywgXCIrICggb25seVNpbXBsZUFjY2Vzc29yPyAxIDogMCApICsgXCIpXCI7XHJcbiAgXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcbm9wLmFyZ3VtZW50cyA9IGZ1bmN0aW9uKGVuZCl7XHJcbiAgZW5kID0gZW5kIHx8ICcpJ1xyXG4gIHZhciBhcmdzID0gW107XHJcbiAgZG97XHJcbiAgICBpZih0aGlzLmxhKCkgIT09IGVuZCl7XHJcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmFzc2lnbigpLmdldClcclxuICAgIH1cclxuICB9d2hpbGUoIHRoaXMuZWF0KCcsJykpO1xyXG4gIHJldHVybiBhcmdzXHJcbn1cclxuXHJcblxyXG4vLyBwcmltYXJ5IDpcclxuLy8gdGhpcyBcclxuLy8gaWRlbnRcclxuLy8gbGl0ZXJhbFxyXG4vLyBhcnJheVxyXG4vLyBvYmplY3RcclxuLy8gKCBleHByZXNzaW9uIClcclxuXHJcbm9wLnByaW1hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwie1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcclxuICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XHJcbiAgICBjYXNlIFwiKFwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbigpO1xyXG4gICAgLy8gbGl0ZXJhbCBvciBpZGVudFxyXG4gICAgY2FzZSAnU1RSSU5HJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IFwiXCIgKyBsbC52YWx1ZTtcclxuICAgICAgdmFyIHF1b3RhID0gfnZhbHVlLmluZGV4T2YoXCInXCIpPyBcIlxcXCJcIjogXCInXCIgO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KHF1b3RhICsgdmFsdWUgKyBxdW90YSk7XHJcbiAgICBjYXNlICdOVU1CRVInOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgcmV0dXJuIGdldHNldCggXCJcIiArIGxsLnZhbHVlICk7XHJcbiAgICBjYXNlIFwiSURFTlRcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIGlmKGlzS2V5V29yZChsbC52YWx1ZSkpe1xyXG4gICAgICAgIHJldHVybiBnZXRzZXQoIGxsLnZhbHVlICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxsLnZhbHVlO1xyXG4gICAgZGVmYXVsdDogXHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgVG9rZW46ICcgKyBsbC50eXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIG9iamVjdFxyXG4vLyAge3Byb3BBc3NpZ24gWywgcHJvcEFzc2lnbl0gKiBbLF19XHJcblxyXG4vLyBwcm9wQXNzaWduXHJcbi8vICBwcm9wIDogYXNzaWduXHJcblxyXG4vLyBwcm9wXHJcbi8vICBTVFJJTkdcclxuLy8gIElERU5UXHJcbi8vICBOVU1CRVJcclxuXHJcbm9wLm9iamVjdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgneycpLnR5cGVdO1xyXG5cclxuICB2YXIgbGwgPSB0aGlzLmVhdCggWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10gKTtcclxuICB3aGlsZShsbCl7XHJcbiAgICBjb2RlLnB1c2goXCInXCIgKyBsbC52YWx1ZSArIFwiJ1wiICsgdGhpcy5tYXRjaCgnOicpLnR5cGUpO1xyXG4gICAgdmFyIGdldCA9IHRoaXMuYXNzaWduKCkuZ2V0O1xyXG4gICAgY29kZS5wdXNoKGdldCk7XHJcbiAgICBsbCA9IG51bGw7XHJcbiAgICBpZih0aGlzLmVhdChcIixcIikgJiYgKGxsID0gdGhpcy5lYXQoWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10pKSApIGNvZGUucHVzaChcIixcIik7XHJcbiAgfVxyXG4gIGNvZGUucHVzaCh0aGlzLm1hdGNoKCd9JykudHlwZSk7XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX1cclxufVxyXG5cclxuLy8gYXJyYXlcclxuLy8gWyBhc3NpZ25bLGFzc2lnbl0qXVxyXG5vcC5hcnJheSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgnWycpLnR5cGVdLCBpdGVtO1xyXG4gIGlmKCB0aGlzLmVhdChcIl1cIikgKXtcclxuXHJcbiAgICAgY29kZS5wdXNoKFwiXVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUoaXRlbSA9IHRoaXMuYXNzaWduKCkpe1xyXG4gICAgICBjb2RlLnB1c2goaXRlbS5nZXQpO1xyXG4gICAgICBpZih0aGlzLmVhdCgnLCcpKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gICAgICBlbHNlIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ10nKS50eXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX07XHJcbn1cclxuXHJcbi8vICcoJyBleHByZXNzaW9uICcpJ1xyXG5vcC5wYXJlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnKCcpO1xyXG4gIHZhciByZXMgPSB0aGlzLmZpbHRlcigpXHJcbiAgcmVzLmdldCA9ICcoJyArIHJlcy5nZXQgKyAnKSc7XHJcbiAgcmVzLnNldCA9IHJlcy5zZXQ7XHJcbiAgdGhpcy5tYXRjaCgnKScpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldHNldChnZXQsIHNldCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGdldDogZ2V0LFxyXG4gICAgc2V0OiBzZXRcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9QYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzLy4yLjAuNEB0aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvLjEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzLy4wLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBzaGltIGZvciBlczVcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciB0c3RyID0gKHt9KS50b1N0cmluZztcclxuXHJcbmZ1bmN0aW9uIGV4dGVuZChvMSwgbzIgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgIG8xW2ldID0gbzJbaV1cclxuICB9XHJcbiAgcmV0dXJuIG8yO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIC8vIFN0cmluZyBwcm90byA7XHJcbiAgZXh0ZW5kKFN0cmluZy5wcm90b3R5cGUsIHtcclxuICAgIHRyaW06IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG4gIC8vIEFycmF5IHByb3RvO1xyXG4gIGV4dGVuZChBcnJheS5wcm90b3R5cGUsIHtcclxuICAgIGluZGV4T2Y6IGZ1bmN0aW9uKG9iaiwgZnJvbSl7XHJcbiAgICAgIGZyb20gPSBmcm9tIHx8IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSBmcm9tLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikgcmV0dXJuIGk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuICAgIC8vIHBvbHlmaWxsIGZyb20gTUROIFxyXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaFxyXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIGN0eCl7XHJcbiAgICAgIHZhciBrID0gMDtcclxuXHJcbiAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCBwYXNzaW5nIHRoZSB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcclxuXHJcbiAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDsgXHJcblxyXG4gICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoIGNhbGxiYWNrICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIiApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgICAgd2hpbGUoIGsgPCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBrVmFsdWU7XHJcblxyXG4gICAgICAgIGlmICggayBpbiBPICkge1xyXG5cclxuICAgICAgICAgIGtWYWx1ZSA9IE9bIGsgXTtcclxuXHJcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKCBjdHgsIGtWYWx1ZSwgaywgTyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBrKys7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBAZGVwcmVjYXRlZFxyXG4gICAgLy8gIHdpbGwgYmUgcmVtb3ZlZCBhdCAwLjUuMFxyXG4gICAgZmlsdGVyOiBmdW5jdGlvbihmdW4sIGNvbnRleHQpe1xyXG5cclxuICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XHJcbiAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcclxuICAgICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcblxyXG4gICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXHJcbiAgICAgIHtcclxuICAgICAgICBpZiAoaSBpbiB0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhciB2YWwgPSB0W2ldO1xyXG4gICAgICAgICAgaWYgKGZ1bi5jYWxsKGNvbnRleHQsIHZhbCwgaSwgdCkpXHJcbiAgICAgICAgICAgIHJlcy5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBGdW5jdGlvbiBwcm90bztcclxuICBleHRlbmQoRnVuY3Rpb24ucHJvdG90eXBlLCB7XHJcbiAgICBiaW5kOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgdmFyIGZuID0gdGhpcztcclxuICAgICAgdmFyIHByZUFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBhcmdzID0gcHJlQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIFxyXG4gIC8vIEFycmF5XHJcbiAgZXh0ZW5kKEFycmF5LCB7XHJcbiAgICBpc0FycmF5OiBmdW5jdGlvbihhcnIpe1xyXG4gICAgICByZXR1cm4gdHN0ci5jYWxsKGFycikgPT09IFwiW29iamVjdCBBcnJheV1cIjtcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvaGVscGVyL3NoaW0uanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzU0MDY0L2hvdy10by1jb252ZXJ0LWNoYXJhY3RlcnMtdG8taHRtbC1lbnRpdGllcy11c2luZy1wbGFpbi1qYXZhc2NyaXB0XHJcbnZhciBlbnRpdGllcyA9IHtcclxuICAncXVvdCc6MzQsIFxyXG4gICdhbXAnOjM4LCBcclxuICAnYXBvcyc6MzksIFxyXG4gICdsdCc6NjAsIFxyXG4gICdndCc6NjIsIFxyXG4gICduYnNwJzoxNjAsIFxyXG4gICdpZXhjbCc6MTYxLCBcclxuICAnY2VudCc6MTYyLCBcclxuICAncG91bmQnOjE2MywgXHJcbiAgJ2N1cnJlbic6MTY0LCBcclxuICAneWVuJzoxNjUsIFxyXG4gICdicnZiYXInOjE2NiwgXHJcbiAgJ3NlY3QnOjE2NywgXHJcbiAgJ3VtbCc6MTY4LCBcclxuICAnY29weSc6MTY5LCBcclxuICAnb3JkZic6MTcwLCBcclxuICAnbGFxdW8nOjE3MSwgXHJcbiAgJ25vdCc6MTcyLCBcclxuICAnc2h5JzoxNzMsIFxyXG4gICdyZWcnOjE3NCwgXHJcbiAgJ21hY3InOjE3NSwgXHJcbiAgJ2RlZyc6MTc2LCBcclxuICAncGx1c21uJzoxNzcsIFxyXG4gICdzdXAyJzoxNzgsIFxyXG4gICdzdXAzJzoxNzksIFxyXG4gICdhY3V0ZSc6MTgwLCBcclxuICAnbWljcm8nOjE4MSwgXHJcbiAgJ3BhcmEnOjE4MiwgXHJcbiAgJ21pZGRvdCc6MTgzLCBcclxuICAnY2VkaWwnOjE4NCwgXHJcbiAgJ3N1cDEnOjE4NSwgXHJcbiAgJ29yZG0nOjE4NiwgXHJcbiAgJ3JhcXVvJzoxODcsIFxyXG4gICdmcmFjMTQnOjE4OCwgXHJcbiAgJ2ZyYWMxMic6MTg5LCBcclxuICAnZnJhYzM0JzoxOTAsIFxyXG4gICdpcXVlc3QnOjE5MSwgXHJcbiAgJ0FncmF2ZSc6MTkyLCBcclxuICAnQWFjdXRlJzoxOTMsIFxyXG4gICdBY2lyYyc6MTk0LCBcclxuICAnQXRpbGRlJzoxOTUsIFxyXG4gICdBdW1sJzoxOTYsIFxyXG4gICdBcmluZyc6MTk3LCBcclxuICAnQUVsaWcnOjE5OCwgXHJcbiAgJ0NjZWRpbCc6MTk5LCBcclxuICAnRWdyYXZlJzoyMDAsIFxyXG4gICdFYWN1dGUnOjIwMSwgXHJcbiAgJ0VjaXJjJzoyMDIsIFxyXG4gICdFdW1sJzoyMDMsIFxyXG4gICdJZ3JhdmUnOjIwNCwgXHJcbiAgJ0lhY3V0ZSc6MjA1LCBcclxuICAnSWNpcmMnOjIwNiwgXHJcbiAgJ0l1bWwnOjIwNywgXHJcbiAgJ0VUSCc6MjA4LCBcclxuICAnTnRpbGRlJzoyMDksIFxyXG4gICdPZ3JhdmUnOjIxMCwgXHJcbiAgJ09hY3V0ZSc6MjExLCBcclxuICAnT2NpcmMnOjIxMiwgXHJcbiAgJ090aWxkZSc6MjEzLCBcclxuICAnT3VtbCc6MjE0LCBcclxuICAndGltZXMnOjIxNSwgXHJcbiAgJ09zbGFzaCc6MjE2LCBcclxuICAnVWdyYXZlJzoyMTcsIFxyXG4gICdVYWN1dGUnOjIxOCwgXHJcbiAgJ1VjaXJjJzoyMTksIFxyXG4gICdVdW1sJzoyMjAsIFxyXG4gICdZYWN1dGUnOjIyMSwgXHJcbiAgJ1RIT1JOJzoyMjIsIFxyXG4gICdzemxpZyc6MjIzLCBcclxuICAnYWdyYXZlJzoyMjQsIFxyXG4gICdhYWN1dGUnOjIyNSwgXHJcbiAgJ2FjaXJjJzoyMjYsIFxyXG4gICdhdGlsZGUnOjIyNywgXHJcbiAgJ2F1bWwnOjIyOCwgXHJcbiAgJ2FyaW5nJzoyMjksIFxyXG4gICdhZWxpZyc6MjMwLCBcclxuICAnY2NlZGlsJzoyMzEsIFxyXG4gICdlZ3JhdmUnOjIzMiwgXHJcbiAgJ2VhY3V0ZSc6MjMzLCBcclxuICAnZWNpcmMnOjIzNCwgXHJcbiAgJ2V1bWwnOjIzNSwgXHJcbiAgJ2lncmF2ZSc6MjM2LCBcclxuICAnaWFjdXRlJzoyMzcsIFxyXG4gICdpY2lyYyc6MjM4LCBcclxuICAnaXVtbCc6MjM5LCBcclxuICAnZXRoJzoyNDAsIFxyXG4gICdudGlsZGUnOjI0MSwgXHJcbiAgJ29ncmF2ZSc6MjQyLCBcclxuICAnb2FjdXRlJzoyNDMsIFxyXG4gICdvY2lyYyc6MjQ0LCBcclxuICAnb3RpbGRlJzoyNDUsIFxyXG4gICdvdW1sJzoyNDYsIFxyXG4gICdkaXZpZGUnOjI0NywgXHJcbiAgJ29zbGFzaCc6MjQ4LCBcclxuICAndWdyYXZlJzoyNDksIFxyXG4gICd1YWN1dGUnOjI1MCwgXHJcbiAgJ3VjaXJjJzoyNTEsIFxyXG4gICd1dW1sJzoyNTIsIFxyXG4gICd5YWN1dGUnOjI1MywgXHJcbiAgJ3Rob3JuJzoyNTQsIFxyXG4gICd5dW1sJzoyNTUsIFxyXG4gICdmbm9mJzo0MDIsIFxyXG4gICdBbHBoYSc6OTEzLCBcclxuICAnQmV0YSc6OTE0LCBcclxuICAnR2FtbWEnOjkxNSwgXHJcbiAgJ0RlbHRhJzo5MTYsIFxyXG4gICdFcHNpbG9uJzo5MTcsIFxyXG4gICdaZXRhJzo5MTgsIFxyXG4gICdFdGEnOjkxOSwgXHJcbiAgJ1RoZXRhJzo5MjAsIFxyXG4gICdJb3RhJzo5MjEsIFxyXG4gICdLYXBwYSc6OTIyLCBcclxuICAnTGFtYmRhJzo5MjMsIFxyXG4gICdNdSc6OTI0LCBcclxuICAnTnUnOjkyNSwgXHJcbiAgJ1hpJzo5MjYsIFxyXG4gICdPbWljcm9uJzo5MjcsIFxyXG4gICdQaSc6OTI4LCBcclxuICAnUmhvJzo5MjksIFxyXG4gICdTaWdtYSc6OTMxLCBcclxuICAnVGF1Jzo5MzIsIFxyXG4gICdVcHNpbG9uJzo5MzMsIFxyXG4gICdQaGknOjkzNCwgXHJcbiAgJ0NoaSc6OTM1LCBcclxuICAnUHNpJzo5MzYsIFxyXG4gICdPbWVnYSc6OTM3LCBcclxuICAnYWxwaGEnOjk0NSwgXHJcbiAgJ2JldGEnOjk0NiwgXHJcbiAgJ2dhbW1hJzo5NDcsIFxyXG4gICdkZWx0YSc6OTQ4LCBcclxuICAnZXBzaWxvbic6OTQ5LCBcclxuICAnemV0YSc6OTUwLCBcclxuICAnZXRhJzo5NTEsIFxyXG4gICd0aGV0YSc6OTUyLCBcclxuICAnaW90YSc6OTUzLCBcclxuICAna2FwcGEnOjk1NCwgXHJcbiAgJ2xhbWJkYSc6OTU1LCBcclxuICAnbXUnOjk1NiwgXHJcbiAgJ251Jzo5NTcsIFxyXG4gICd4aSc6OTU4LCBcclxuICAnb21pY3Jvbic6OTU5LCBcclxuICAncGknOjk2MCwgXHJcbiAgJ3Jobyc6OTYxLCBcclxuICAnc2lnbWFmJzo5NjIsIFxyXG4gICdzaWdtYSc6OTYzLCBcclxuICAndGF1Jzo5NjQsIFxyXG4gICd1cHNpbG9uJzo5NjUsIFxyXG4gICdwaGknOjk2NiwgXHJcbiAgJ2NoaSc6OTY3LCBcclxuICAncHNpJzo5NjgsIFxyXG4gICdvbWVnYSc6OTY5LCBcclxuICAndGhldGFzeW0nOjk3NywgXHJcbiAgJ3Vwc2loJzo5NzgsIFxyXG4gICdwaXYnOjk4MiwgXHJcbiAgJ2J1bGwnOjgyMjYsIFxyXG4gICdoZWxsaXAnOjgyMzAsIFxyXG4gICdwcmltZSc6ODI0MiwgXHJcbiAgJ1ByaW1lJzo4MjQzLCBcclxuICAnb2xpbmUnOjgyNTQsIFxyXG4gICdmcmFzbCc6ODI2MCwgXHJcbiAgJ3dlaWVycCc6ODQ3MiwgXHJcbiAgJ2ltYWdlJzo4NDY1LCBcclxuICAncmVhbCc6ODQ3NiwgXHJcbiAgJ3RyYWRlJzo4NDgyLCBcclxuICAnYWxlZnN5bSc6ODUwMSwgXHJcbiAgJ2xhcnInOjg1OTIsIFxyXG4gICd1YXJyJzo4NTkzLCBcclxuICAncmFycic6ODU5NCwgXHJcbiAgJ2RhcnInOjg1OTUsIFxyXG4gICdoYXJyJzo4NTk2LCBcclxuICAnY3JhcnInOjg2MjksIFxyXG4gICdsQXJyJzo4NjU2LCBcclxuICAndUFycic6ODY1NywgXHJcbiAgJ3JBcnInOjg2NTgsIFxyXG4gICdkQXJyJzo4NjU5LCBcclxuICAnaEFycic6ODY2MCwgXHJcbiAgJ2ZvcmFsbCc6ODcwNCwgXHJcbiAgJ3BhcnQnOjg3MDYsIFxyXG4gICdleGlzdCc6ODcwNywgXHJcbiAgJ2VtcHR5Jzo4NzA5LCBcclxuICAnbmFibGEnOjg3MTEsIFxyXG4gICdpc2luJzo4NzEyLCBcclxuICAnbm90aW4nOjg3MTMsIFxyXG4gICduaSc6ODcxNSwgXHJcbiAgJ3Byb2QnOjg3MTksIFxyXG4gICdzdW0nOjg3MjEsIFxyXG4gICdtaW51cyc6ODcyMiwgXHJcbiAgJ2xvd2FzdCc6ODcyNywgXHJcbiAgJ3JhZGljJzo4NzMwLCBcclxuICAncHJvcCc6ODczMywgXHJcbiAgJ2luZmluJzo4NzM0LCBcclxuICAnYW5nJzo4NzM2LCBcclxuICAnYW5kJzo4NzQzLCBcclxuICAnb3InOjg3NDQsIFxyXG4gICdjYXAnOjg3NDUsIFxyXG4gICdjdXAnOjg3NDYsIFxyXG4gICdpbnQnOjg3NDcsIFxyXG4gICd0aGVyZTQnOjg3NTYsIFxyXG4gICdzaW0nOjg3NjQsIFxyXG4gICdjb25nJzo4NzczLCBcclxuICAnYXN5bXAnOjg3NzYsIFxyXG4gICduZSc6ODgwMCwgXHJcbiAgJ2VxdWl2Jzo4ODAxLCBcclxuICAnbGUnOjg4MDQsIFxyXG4gICdnZSc6ODgwNSwgXHJcbiAgJ3N1Yic6ODgzNCwgXHJcbiAgJ3N1cCc6ODgzNSwgXHJcbiAgJ25zdWInOjg4MzYsIFxyXG4gICdzdWJlJzo4ODM4LCBcclxuICAnc3VwZSc6ODgzOSwgXHJcbiAgJ29wbHVzJzo4ODUzLCBcclxuICAnb3RpbWVzJzo4ODU1LCBcclxuICAncGVycCc6ODg2OSwgXHJcbiAgJ3Nkb3QnOjg5MDEsIFxyXG4gICdsY2VpbCc6ODk2OCwgXHJcbiAgJ3JjZWlsJzo4OTY5LCBcclxuICAnbGZsb29yJzo4OTcwLCBcclxuICAncmZsb29yJzo4OTcxLCBcclxuICAnbGFuZyc6OTAwMSwgXHJcbiAgJ3JhbmcnOjkwMDIsIFxyXG4gICdsb3onOjk2NzQsIFxyXG4gICdzcGFkZXMnOjk4MjQsIFxyXG4gICdjbHVicyc6OTgyNywgXHJcbiAgJ2hlYXJ0cyc6OTgyOSwgXHJcbiAgJ2RpYW1zJzo5ODMwLCBcclxuICAnT0VsaWcnOjMzOCwgXHJcbiAgJ29lbGlnJzozMzksIFxyXG4gICdTY2Fyb24nOjM1MiwgXHJcbiAgJ3NjYXJvbic6MzUzLCBcclxuICAnWXVtbCc6Mzc2LCBcclxuICAnY2lyYyc6NzEwLCBcclxuICAndGlsZGUnOjczMiwgXHJcbiAgJ2Vuc3AnOjgxOTQsIFxyXG4gICdlbXNwJzo4MTk1LCBcclxuICAndGhpbnNwJzo4MjAxLCBcclxuICAnenduaic6ODIwNCwgXHJcbiAgJ3p3aic6ODIwNSwgXHJcbiAgJ2xybSc6ODIwNiwgXHJcbiAgJ3JsbSc6ODIwNywgXHJcbiAgJ25kYXNoJzo4MjExLCBcclxuICAnbWRhc2gnOjgyMTIsIFxyXG4gICdsc3F1byc6ODIxNiwgXHJcbiAgJ3JzcXVvJzo4MjE3LCBcclxuICAnc2JxdW8nOjgyMTgsIFxyXG4gICdsZHF1byc6ODIyMCwgXHJcbiAgJ3JkcXVvJzo4MjIxLCBcclxuICAnYmRxdW8nOjgyMjIsIFxyXG4gICdkYWdnZXInOjgyMjQsIFxyXG4gICdEYWdnZXInOjgyMjUsIFxyXG4gICdwZXJtaWwnOjgyNDAsIFxyXG4gICdsc2FxdW8nOjgyNDksIFxyXG4gICdyc2FxdW8nOjgyNTAsIFxyXG4gICdldXJvJzo4MzY0XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgID0gZW50aXRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2hlbHBlci9lbnRpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBlbGVtZW50OiBmdW5jdGlvbihuYW1lLCBhdHRycywgY2hpbGRyZW4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2VsZW1lbnQnLFxyXG4gICAgICB0YWc6IG5hbWUsXHJcbiAgICAgIGF0dHJzOiBhdHRycyxcclxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXHJcbiAgICB9XHJcbiAgfSxcclxuICBhdHRyaWJ1dGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtZGYpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgbWRmOiBtZGZcclxuICAgIH1cclxuICB9LFxyXG4gIFwiaWZcIjogZnVuY3Rpb24odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdpZicsXHJcbiAgICAgIHRlc3Q6IHRlc3QsXHJcbiAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnQsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlXHJcbiAgICB9XHJcbiAgfSxcclxuICBsaXN0OiBmdW5jdGlvbihzZXF1ZW5jZSwgdmFyaWFibGUsIGJvZHksIGFsdGVybmF0ZSwgdHJhY2spe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2xpc3QnLFxyXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlLFxyXG4gICAgICB2YXJpYWJsZTogdmFyaWFibGUsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIHRyYWNrOiB0cmFja1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZXhwcmVzc2lvbjogZnVuY3Rpb24oIGJvZHksIHNldGJvZHksIGNvbnN0YW50LCBmaWx0ZXJzICl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcImV4cHJlc3Npb25cIixcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgY29uc3RhbnQ6IGNvbnN0YW50IHx8IGZhbHNlLFxyXG4gICAgICBzZXRib2R5OiBzZXRib2R5IHx8IGZhbHNlLFxyXG4gICAgICBmaWx0ZXJzOiBmaWx0ZXJzXHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICB0ZXh0OiB0ZXh0XHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ3RlbXBsYXRlJyxcclxuICAgICAgY29udGVudDogdGVtcGxhdGVcclxuICAgIH1cclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL25vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vdXRpbC5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcuanNcIik7XHJcblxyXG4vLyBzb21lIGN1c3RvbSB0YWcgIHdpbGwgY29uZmxpY3Qgd2l0aCB0aGUgTGV4ZXIgcHJvZ3Jlc3NcclxudmFyIGNvbmZsaWN0VGFnID0ge1wifVwiOiBcIntcIiwgXCJdXCI6IFwiW1wifSwgbWFwMSwgbWFwMjtcclxuLy8gc29tZSBtYWNybyBmb3IgbGV4ZXJcclxudmFyIG1hY3JvID0ge1xyXG4gICdOQU1FJzogLyg/Ols6X0EtWmEtel1bLVxcLjpfMC05QS1aYS16XSopLyxcclxuICAnSURFTlQnOiAvW1xcJF9BLVphLXpdW18wLTlBLVphLXpcXCRdKi8sXHJcbiAgJ1NQQUNFJzogL1tcXHJcXG5cXHRcXGYgXS9cclxufVxyXG5cclxuXHJcbnZhciB0ZXN0ID0gL2F8KGIpLy5leGVjKFwiYVwiKTtcclxudmFyIHRlc3RTdWJDYXB1cmUgPSB0ZXN0ICYmIHRlc3RbMV0gPT09IHVuZGVmaW5lZD8gXHJcbiAgZnVuY3Rpb24oc3RyKXsgcmV0dXJuIHN0ciAhPT0gdW5kZWZpbmVkIH1cclxuICA6ZnVuY3Rpb24oc3RyKXtyZXR1cm4gISFzdHJ9O1xyXG5cclxuZnVuY3Rpb24gd3JhcEhhbmRlcihoYW5kbGVyKXtcclxuICByZXR1cm4gZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7dHlwZTogaGFuZGxlciwgdmFsdWU6IGFsbCB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBMZXhlcihpbnB1dCwgb3B0cyl7XHJcbiAgaWYoY29uZmxpY3RUYWdbY29uZmlnLkVORF0pe1xyXG4gICAgdGhpcy5tYXJrU3RhcnQgPSBjb25mbGljdFRhZ1tjb25maWcuRU5EXTtcclxuICAgIHRoaXMubWFya0VuZCA9IGNvbmZpZy5FTkQ7XHJcbiAgfVxyXG5cclxuICB0aGlzLmlucHV0ID0gKGlucHV0fHxcIlwiKS50cmltKCk7XHJcbiAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fTtcclxuICB0aGlzLm1hcCA9IHRoaXMub3B0cy5tb2RlICE9PSAyPyAgbWFwMTogbWFwMjtcclxuICB0aGlzLnN0YXRlcyA9IFtcIklOSVRcIl07XHJcbiAgaWYob3B0cyAmJiBvcHRzLmV4cHJlc3Npb24pe1xyXG4gICAgIHRoaXMuc3RhdGVzLnB1c2goXCJKU1RcIik7XHJcbiAgICAgdGhpcy5leHByZXNzaW9uID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbnZhciBsbyA9IExleGVyLnByb3RvdHlwZVxyXG5cclxuXHJcbmxvLmxleCA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgc3RyID0gKHN0ciB8fCB0aGlzLmlucHV0KS50cmltKCk7XHJcbiAgdmFyIHRva2VucyA9IFtdLCBzcGxpdCwgdGVzdCxtbGVuLCB0b2tlbiwgc3RhdGU7XHJcbiAgdGhpcy5pbnB1dCA9IHN0ciwgXHJcbiAgdGhpcy5tYXJrcyA9IDA7XHJcbiAgLy8gaW5pdCB0aGUgcG9zIGluZGV4XHJcbiAgdGhpcy5pbmRleD0wO1xyXG4gIHZhciBpID0gMDtcclxuICB3aGlsZShzdHIpe1xyXG4gICAgaSsrXHJcbiAgICBzdGF0ZSA9IHRoaXMuc3RhdGUoKTtcclxuICAgIHNwbGl0ID0gdGhpcy5tYXBbc3RhdGVdIFxyXG4gICAgdGVzdCA9IHNwbGl0LlRSVU5LLmV4ZWMoc3RyKTtcclxuICAgIGlmKCF0ZXN0KXtcclxuICAgICAgdGhpcy5lcnJvcignVW5yZWNvZ2luaXplZCBUb2tlbicpO1xyXG4gICAgfVxyXG4gICAgbWxlbiA9IHRlc3RbMF0ubGVuZ3RoO1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKG1sZW4pXHJcbiAgICB0b2tlbiA9IHRoaXMuX3Byb2Nlc3MuY2FsbCh0aGlzLCB0ZXN0LCBzcGxpdCwgc3RyKVxyXG4gICAgaWYodG9rZW4pIHRva2Vucy5wdXNoKHRva2VuKVxyXG4gICAgdGhpcy5pbmRleCArPSBtbGVuO1xyXG4gICAgLy8gaWYoc3RhdGUgPT0gJ1RBRycgfHwgc3RhdGUgPT0gJ0pTVCcpIHN0ciA9IHRoaXMuc2tpcHNwYWNlKHN0cik7XHJcbiAgfVxyXG5cclxuICB0b2tlbnMucHVzaCh7dHlwZTogJ0VPRid9KTtcclxuXHJcbiAgcmV0dXJuIHRva2VucztcclxufVxyXG5cclxubG8uZXJyb3IgPSBmdW5jdGlvbihtc2cpe1xyXG4gIHRocm93ICBFcnJvcihcIlBhcnNlIEVycm9yOiBcIiArIG1zZyArICAnOlxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdGhpcy5pbmRleCkpO1xyXG59XHJcblxyXG5sby5fcHJvY2VzcyA9IGZ1bmN0aW9uKGFyZ3MsIHNwbGl0LHN0cil7XHJcbiAgLy8gY29uc29sZS5sb2coYXJncy5qb2luKFwiLFwiKSwgdGhpcy5zdGF0ZSgpKVxyXG4gIHZhciBsaW5rcyA9IHNwbGl0LmxpbmtzLCBtYXJjaGVkID0gZmFsc2UsIHRva2VuO1xyXG5cclxuICBmb3IodmFyIGxlbiA9IGxpbmtzLmxlbmd0aCwgaT0wO2k8bGVuIDtpKyspe1xyXG4gICAgdmFyIGxpbmsgPSBsaW5rc1tpXSxcclxuICAgICAgaGFuZGxlciA9IGxpbmtbMl0sXHJcbiAgICAgIGluZGV4ID0gbGlua1swXTtcclxuICAgIC8vIGlmKGFyZ3NbNl0gPT09ICc+JyAmJiBpbmRleCA9PT0gNikgY29uc29sZS5sb2coJ2hhaGEnKVxyXG4gICAgaWYodGVzdFN1YkNhcHVyZShhcmdzW2luZGV4XSkpIHtcclxuICAgICAgbWFyY2hlZCA9IHRydWU7XHJcbiAgICAgIGlmKGhhbmRsZXIpe1xyXG4gICAgICAgIHRva2VuID0gaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzLnNsaWNlKGluZGV4LCBpbmRleCArIGxpbmtbMV0pKVxyXG4gICAgICAgIGlmKHRva2VuKSAgdG9rZW4ucG9zID0gdGhpcy5pbmRleDtcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgaWYoIW1hcmNoZWQpeyAvLyBpbiBpZSBsdDggLiBzdWIgY2FwdHVyZSBpcyBcIlwiIGJ1dCBvbnQgXHJcbiAgICBzd2l0Y2goc3RyLmNoYXJBdCgwKSl7XHJcbiAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgdGhpcy5lbnRlcihcIlRBR1wiKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aGlzLmVudGVyKFwiSlNUXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdG9rZW47XHJcbn1cclxubG8uZW50ZXIgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdGhpcy5zdGF0ZXMucHVzaChzdGF0ZSlcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubG8uc3RhdGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcclxuICByZXR1cm4gc3RhdGVzW3N0YXRlcy5sZW5ndGgtMV07XHJcbn1cclxuXHJcbmxvLmxlYXZlID0gZnVuY3Rpb24oc3RhdGUpe1xyXG4gIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcclxuICBpZighc3RhdGUgfHwgc3RhdGVzW3N0YXRlcy5sZW5ndGgtMV0gPT09IHN0YXRlKSBzdGF0ZXMucG9wKClcclxufVxyXG5cclxuXHJcbkxleGVyLnNldHVwID0gZnVuY3Rpb24oKXtcclxuICBtYWNyby5FTkQgPSBjb25maWcuRU5EO1xyXG4gIG1hY3JvLkJFR0lOID0gY29uZmlnLkJFR0lOO1xyXG4gIC8vXHJcbiAgbWFwMSA9IGdlbk1hcChbXHJcbiAgICAvLyBJTklUXHJcbiAgICBydWxlcy5FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5FTlRFUl9UQUcsXHJcbiAgICBydWxlcy5URVhULFxyXG5cclxuICAgIC8vVEFHXHJcbiAgICBydWxlcy5UQUdfTkFNRSxcclxuICAgIHJ1bGVzLlRBR19PUEVOLFxyXG4gICAgcnVsZXMuVEFHX0NMT1NFLFxyXG4gICAgcnVsZXMuVEFHX1BVTkNIT1IsXHJcbiAgICBydWxlcy5UQUdfRU5URVJfSlNULFxyXG4gICAgcnVsZXMuVEFHX1VOUV9WQUxVRSxcclxuICAgIHJ1bGVzLlRBR19TVFJJTkcsXHJcbiAgICBydWxlcy5UQUdfU1BBQ0UsXHJcbiAgICBydWxlcy5UQUdfQ09NTUVOVCxcclxuXHJcbiAgICAvLyBKU1RcclxuICAgIHJ1bGVzLkpTVF9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0NMT1NFLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfRVhQUl9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0lERU5ULFxyXG4gICAgcnVsZXMuSlNUX1NQQUNFLFxyXG4gICAgcnVsZXMuSlNUX0xFQVZFLFxyXG4gICAgcnVsZXMuSlNUX05VTUJFUixcclxuICAgIHJ1bGVzLkpTVF9QVU5DSE9SLFxyXG4gICAgcnVsZXMuSlNUX1NUUklORyxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5UXHJcbiAgICBdKVxyXG5cclxuICAvLyBpZ25vcmVkIHRoZSB0YWctcmVsYXRpdmUgdG9rZW5cclxuICBtYXAyID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVQgbm8gPCByZXN0cmljdFxyXG4gICAgcnVsZXMuRU5URVJfSlNUMixcclxuICAgIHJ1bGVzLlRFWFQsXHJcbiAgICAvLyBKU1RcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5ULFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfRVhQUl9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0lERU5ULFxyXG4gICAgcnVsZXMuSlNUX1NQQUNFLFxyXG4gICAgcnVsZXMuSlNUX0xFQVZFLFxyXG4gICAgcnVsZXMuSlNUX05VTUJFUixcclxuICAgIHJ1bGVzLkpTVF9QVU5DSE9SLFxyXG4gICAgcnVsZXMuSlNUX1NUUklORyxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5UXHJcbiAgICBdKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2VuTWFwKHJ1bGVzKXtcclxuICB2YXIgcnVsZSwgbWFwID0ge30sIHNpZ247XHJcbiAgZm9yKHZhciBpID0gMCwgbGVuID0gcnVsZXMubGVuZ3RoOyBpIDwgbGVuIDsgaSsrKXtcclxuICAgIHJ1bGUgPSBydWxlc1tpXTtcclxuICAgIHNpZ24gPSBydWxlWzJdIHx8ICdJTklUJztcclxuICAgICggbWFwW3NpZ25dIHx8IChtYXBbc2lnbl0gPSB7cnVsZXM6W10sIGxpbmtzOltdfSkgKS5ydWxlcy5wdXNoKHJ1bGUpO1xyXG4gIH1cclxuICByZXR1cm4gc2V0dXAobWFwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXAobWFwKXtcclxuICB2YXIgc3BsaXQsIHJ1bGVzLCB0cnVua3MsIGhhbmRsZXIsIHJlZywgcmV0YWluLCBydWxlO1xyXG4gIGZ1bmN0aW9uIHJlcGxhY2VGbihhbGwsIG9uZSl7XHJcbiAgICByZXR1cm4gdHlwZW9mIG1hY3JvW29uZV0gPT09ICdzdHJpbmcnPyBcclxuICAgICAgXy5lc2NhcGVSZWdFeHAobWFjcm9bb25lXSkgXHJcbiAgICAgIDogU3RyaW5nKG1hY3JvW29uZV0pLnNsaWNlKDEsLTEpO1xyXG4gIH1cclxuXHJcbiAgZm9yKHZhciBpIGluIG1hcCl7XHJcblxyXG4gICAgc3BsaXQgPSBtYXBbaV07XHJcbiAgICBzcGxpdC5jdXJJbmRleCA9IDE7XHJcbiAgICBydWxlcyA9IHNwbGl0LnJ1bGVzO1xyXG4gICAgdHJ1bmtzID0gW107XHJcblxyXG4gICAgZm9yKHZhciBqID0gMCxsZW4gPSBydWxlcy5sZW5ndGg7IGo8bGVuOyBqKyspe1xyXG4gICAgICBydWxlID0gcnVsZXNbal07IFxyXG4gICAgICByZWcgPSBydWxlWzBdO1xyXG4gICAgICBoYW5kbGVyID0gcnVsZVsxXTtcclxuXHJcbiAgICAgIGlmKHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgaGFuZGxlciA9IHdyYXBIYW5kZXIoaGFuZGxlcik7XHJcbiAgICAgIH1cclxuICAgICAgaWYoXy50eXBlT2YocmVnKSA9PT0gJ3JlZ2V4cCcpIHJlZyA9IHJlZy50b1N0cmluZygpLnNsaWNlKDEsIC0xKTtcclxuXHJcbiAgICAgIHJlZyA9IHJlZy5yZXBsYWNlKC9cXHsoXFx3KylcXH0vZywgcmVwbGFjZUZuKVxyXG4gICAgICByZXRhaW4gPSBfLmZpbmRTdWJDYXB0dXJlKHJlZykgKyAxOyBcclxuICAgICAgc3BsaXQubGlua3MucHVzaChbc3BsaXQuY3VySW5kZXgsIHJldGFpbiwgaGFuZGxlcl0pOyBcclxuICAgICAgc3BsaXQuY3VySW5kZXggKz0gcmV0YWluO1xyXG4gICAgICB0cnVua3MucHVzaChyZWcpO1xyXG4gICAgfVxyXG4gICAgc3BsaXQuVFJVTksgPSBuZXcgUmVnRXhwKFwiXig/OihcIiArIHRydW5rcy5qb2luKFwiKXwoXCIpICsgXCIpKVwiKVxyXG4gIH1cclxuICByZXR1cm4gbWFwO1xyXG59XHJcblxyXG52YXIgcnVsZXMgPSB7XHJcblxyXG4gIC8vIDEuIElOSVRcclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLy8gbW9kZTEncyBKU1QgRU5URVIgUlVMRVxyXG4gIEVOVEVSX0pTVDogWy9bXlxceDAwPF0qPyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIEVOVEVSX0pTVDI6IFsvW15cXHgwMF0qPyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgRU5URVJfVEFHOiBbL1teXFx4MDBdKj8oPz08W1xcd1xcL1xcIV0pLywgZnVuY3Rpb24oYWxsKXsgXHJcbiAgICB0aGlzLmVudGVyKCdUQUcnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIFRFWFQ6IFsvW15cXHgwMF0rLywgJ1RFWFQnIF0sXHJcblxyXG4gIC8vIDIuIFRBR1xyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgVEFHX05BTUU6IFsve05BTUV9LywgJ05BTUUnLCAnVEFHJ10sXHJcbiAgVEFHX1VOUV9WQUxVRTogWy9bXlxce30mXCInPT48YFxcclxcblxcZlxcdCBdKy8sICdVTlEnLCAnVEFHJ10sXHJcblxyXG4gIFRBR19PUEVOOiBbLzwoe05BTUV9KVxccyovLCBmdW5jdGlvbihhbGwsIG9uZSl7IC8vXCJcclxuICAgIHJldHVybiB7dHlwZTogJ1RBR19PUEVOJywgdmFsdWU6IG9uZX1cclxuICB9LCAnVEFHJ10sXHJcbiAgVEFHX0NMT1NFOiBbLzxcXC8oe05BTUV9KVtcXHJcXG5cXGZcXHQgXSo+LywgZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX0NMT1NFJywgdmFsdWU6IG9uZSB9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICAgIC8vIG1vZGUyJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBUQUdfRU5URVJfSlNUOiBbLyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gIH0sICdUQUcnXSxcclxuXHJcblxyXG4gIFRBR19QVU5DSE9SOiBbL1tcXD5cXC89Jl0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgaWYoYWxsID09PSAnPicpIHRoaXMubGVhdmUoKTtcclxuICAgIHJldHVybiB7dHlwZTogYWxsLCB2YWx1ZTogYWxsIH1cclxuICB9LCAnVEFHJ10sXHJcbiAgVEFHX1NUUklORzogIFsgLycoW14nXSopJ3xcIihbXlwiXSopXFxcIi8sIC8qJyovICBmdW5jdGlvbihhbGwsIG9uZSwgdHdvKXsgXHJcbiAgICB2YXIgdmFsdWUgPSBvbmUgfHwgdHdvIHx8IFwiXCI7XHJcblxyXG4gICAgcmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IHZhbHVlfVxyXG4gIH0sICdUQUcnXSxcclxuXHJcbiAgVEFHX1NQQUNFOiBbL3tTUEFDRX0rLywgbnVsbCwgJ1RBRyddLFxyXG4gIFRBR19DT01NRU5UOiBbLzxcXCEtLShbXlxceDAwXSo/KS0tXFw+LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMubGVhdmUoKVxyXG4gICAgLy8gdGhpcy5sZWF2ZSgnVEFHJylcclxuICB9ICwnVEFHJ10sXHJcblxyXG4gIC8vIDMuIEpTVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgSlNUX09QRU46IFsne0JFR0lOfSN7U1BBQ0V9Kih7SURFTlR9KScsIGZ1bmN0aW9uKGFsbCwgbmFtZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnT1BFTicsXHJcbiAgICAgIHZhbHVlOiBuYW1lXHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9MRUFWRTogWy97RU5EfS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZih0aGlzLm1hcmtFbmQgPT09IGFsbCAmJiB0aGlzLmV4cHJlc3Npb24pIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfTtcclxuICAgIGlmKCF0aGlzLm1hcmtFbmQgfHwgIXRoaXMubWFya3MgKXtcclxuICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5sZWF2ZSgnSlNUJyk7XHJcbiAgICAgIHJldHVybiB7dHlwZTogJ0VORCd9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5tYXJrcy0tO1xyXG4gICAgICByZXR1cm4ge3R5cGU6IHRoaXMubWFya0VuZCwgdmFsdWU6IHRoaXMubWFya0VuZH1cclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NMT1NFOiBbL3tCRUdJTn1cXHMqXFwvKHtJREVOVH0pXFxzKntFTkR9LywgZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgdGhpcy5sZWF2ZSgnSlNUJyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnQ0xPU0UnLFxyXG4gICAgICB2YWx1ZTogb25lXHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9DT01NRU5UOiBbL3tCRUdJTn1cXCEoW15cXHgwMF0qPylcXCF7RU5EfS8sIGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9FWFBSX09QRU46IFsne0JFR0lOfScsZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgaWYoYWxsID09PSB0aGlzLm1hcmtTdGFydCl7XHJcbiAgICAgIGlmKHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICBpZih0aGlzLmZpcnN0RW50ZXJTdGFydCB8fCB0aGlzLm1hcmtzKXtcclxuICAgICAgICB0aGlzLm1hcmtzKytcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6IHRoaXMubWFya1N0YXJ0LCB2YWx1ZTogdGhpcy5tYXJrU3RhcnQgfTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnRVhQUl9PUEVOJyxcclxuICAgICAgZXNjYXBlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0lERU5UOiBbJ3tJREVOVH0nLCAnSURFTlQnLCAnSlNUJ10sXHJcbiAgSlNUX1NQQUNFOiBbL1sgXFxyXFxuXFxmXSsvLCBudWxsLCAnSlNUJ10sXHJcbiAgSlNUX1BVTkNIT1I6IFsvWz0hXT89PXxbLT0+PCsqXFwvJVxcIV0/XFw9fFxcfFxcfHwmJnxcXEBcXCh8XFwuXFwufFs8XFw+XFxbXFxdXFwoXFwpXFwtXFx8XFx7fVxcK1xcKlxcLyU/OlxcLiEsXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4geyB0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sJ0pTVCddLFxyXG5cclxuICBKU1RfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcIi8sIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyAvL1wiJ1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IG9uZSB8fCB0d28gfHwgXCJcIn1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX05VTUJFUjogWy8oPzpbMC05XSpcXC5bMC05XSt8WzAtOV0rKShlXFxkKyk/LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7dHlwZTogJ05VTUJFUicsIHZhbHVlOiBwYXJzZUZsb2F0KGFsbCwgMTApfTtcclxuICB9LCAnSlNUJ11cclxufVxyXG5cclxuXHJcbi8vIHNldHVwIHdoZW4gZmlyc3QgY29uZmlnXHJcbkxleGVyLnNldHVwKCk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV4ZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9MZXhlci5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgRnJlZWxpc3QgPSByZXF1aXJlKCcuL3N0b3JlL1VJUmVuZGVyU3RvcmUuanMnKTtcclxudmFyIE1lc3NhZ2VCdXMgPSByZXF1aXJlKCcuL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qcycpO1xyXG5cclxuKGZ1bmN0aW9uKHJvb3Qpe1xyXG4gICAgaWYocm9vdC5ORUogJiYgTkVKLmRlZmluZSl7XHJcbiAgICAgICAgTkVKLmRlZmluZShbXSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIEZyZWVsaXN0OiBGcmVlbGlzdCxcclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VCdXM6IE1lc3NhZ2VCdXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYod2luZG93ICYmIHdpbmRvdy5kZWZpbmUpe1xyXG4gICAgICAgIHdpbmRvdy5kZWZpbmUoW10sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBGcmVlbGlzdDogRnJlZWxpc3QsXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlQnVzOiBNZXNzYWdlQnVzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGRvY3VtZW50ICYmIGRvY3VtZW50Lm5vZGVUeXBlKXtcclxuICAgICAgICB3aW5kb3cuRnJlZWxpc3QgPSB7XHJcbiAgICAgICAgICAgIEZyZWVsaXN0OiBGcmVlbGlzdCxcclxuICAgICAgICAgICAgTWVzc2FnZUJ1czogTWVzc2FnZUJ1c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKXtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICAgICAgICAgRnJlZWxpc3Q6IEZyZWVsaXN0LFxyXG4gICAgICAgICAgICBNZXNzYWdlQnVzOiBNZXNzYWdlQnVzXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKHRoaXMpO1xyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VpX2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1vZHVsZSkge1xyXG5cdGlmKCFtb2R1bGUud2VicGFja1BvbHlmaWxsKSB7XHJcblx0XHRtb2R1bGUuZGVwcmVjYXRlID0gZnVuY3Rpb24oKSB7fTtcclxuXHRcdG1vZHVsZS5wYXRocyA9IFtdO1xyXG5cdFx0Ly8gbW9kdWxlLnBhcmVudCA9IHVuZGVmaW5lZCBieSBkZWZhdWx0XHJcblx0XHRpZighbW9kdWxlLmNoaWxkcmVuKSBtb2R1bGUuY2hpbGRyZW4gPSBbXTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwibG9hZGVkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJpZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5pO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdG1vZHVsZS53ZWJwYWNrUG9seWZpbGwgPSAxO1xyXG5cdH1cclxuXHRyZXR1cm4gbW9kdWxlO1xyXG59O1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9tb2R1bGUuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBFeHRlbmQgPSByZXF1aXJlKCcuLi91dGlscy9leHRlbmQuanMnKTtcclxudmFyIEJhc2VSZW5kZXJTdG9yZSA9IHJlcXVpcmUoJy4vQmFzZVJlbmRlclN0b3JlLmpzJyk7XHJcbnZhciBDb21waWxlciA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL21haW5UaHJlYWQvY29tcGlsZXIuanMnKTtcclxuXHJcbmZ1bmN0aW9uIEZyZWVsaXN0KGNvbmZpZykge1xyXG4gICAgdGhpcy5zdXBlcihjb25maWcpO1xyXG4gICAgdGhpcy5fY29tcGlsZXIgPSBDb21waWxlcjtcclxufVxyXG5cclxuRXh0ZW5kKEZyZWVsaXN0LCBCYXNlUmVuZGVyU3RvcmUpO1xyXG5cclxuRnJlZWxpc3QucmVwbGFjZUxpc3QgPSBmdW5jdGlvbiAob2xkTGlzdCwgbmV3TGlzdCkge1xyXG4gICAgZm9yICh2YXIgaSA9IG9sZExpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIG5ld0xpc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIG9sZExpc3Quc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9sZExpc3RbaV0gPSBuZXdMaXN0W2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLiRpbmplY3QgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdGhpcy5jb250YWluZXJOb2RlID0gbm9kZTtcclxuXHJcbiAgICB0aGlzLiRyZW5kZXIoKTtcclxuICAgIG5vZGUuYXBwZW5kKHRoaXMuZG9tVHJlZSk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kbW9kaWZ5ID0gZnVuY3Rpb24gKGluZGV4LCBtb2RlbCkge1xyXG4gICAgdmFyIF9saXN0ID0gdGhpcy5fbGlzdCxcclxuICAgICAgICBfbGlzdENvbnRhaW5lciA9IF9saXN0LmNvbnRhaW5lcixcclxuICAgICAgICBfYm9keSA9IF9saXN0LmJvZHk7XHJcblxyXG4gICAgLyoq6K6+572u5pWw5o2u5qih5Z6LICovXHJcbiAgICBfbGlzdC5kYXRhW2luZGV4XSA9IG1vZGVsO1xyXG5cclxuICAgIC8qKkRvbeeyvuehruabtOaWsCAqL1xyXG4gICAgdmFyIHRhcmdldERvbSA9IF9saXN0Q29udGFpbmVyLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIHZhciBub2RlID0gdGhpcy5fY29tcGlsZShfYm9keSwgeyBpdGVtOiBtb2RlbCwgaXRlbV9pbmRleDogaW5kZXggfSk7XHJcblxyXG4gICAgX2xpc3RDb250YWluZXIucmVwbGFjZUNoaWxkKG5vZGUsIHRhcmdldERvbSk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kaW5zZXJ0ID0gZnVuY3Rpb24gKGluZGV4LCBtb2RlbCkge1xyXG4gICAgdmFyIF9saXN0ID0gdGhpcy5fbGlzdCxcclxuICAgICAgICBfbGlzdENvbnRhaW5lciA9IF9saXN0LmNvbnRhaW5lcixcclxuICAgICAgICBfYm9keSA9IF9saXN0LmJvZHk7XHJcblxyXG4gICAgLyoq6K6+572u5pWw5o2u5qih5Z6LICovXHJcbiAgICBfbGlzdC5kYXRhLnNwbGljZShpbmRleCwgMCwgbW9kZWwpO1xyXG5cclxuICAgIHRoaXMuJHJlbmRlcigpO1xyXG59XHJcblxyXG4vKirmm7/mjaLliJfooajmlbDmja4gKi9cclxuRnJlZWxpc3QucHJvdG90eXBlLiRyZXBsYWNlID0gZnVuY3Rpb24gKG5ld0xpc3QpIHtcclxuICAgIHZhciBfbGlzdCA9IHRoaXMuX2xpc3Q7XHJcblxyXG4gICAgRnJlZWxpc3QucmVwbGFjZUxpc3QoX2xpc3QuZGF0YSwgbmV3TGlzdCk7XHJcbiAgICB0aGlzLiRyZW5kZXIoKTtcclxufTtcclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kZGVsZXRlID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICB2YXIgX2xpc3QgPSB0aGlzLl9saXN0LFxyXG4gICAgICAgIF9saXN0Q29udGFpbmVyID0gX2xpc3QuY29udGFpbmVyO1xyXG5cclxuICAgIC8qKuiuvue9ruaVsOaNruaooeWeiyAqL1xyXG4gICAgX2xpc3QuZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgdGhpcy4kcmVuZGVyKCk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LnByb3RvdHlwZS4kcmVuZGVyID0gZnVuY3Rpb24gKHdvcmtlclJlbmRlcikge1xyXG4gICAgaWYgKHdvcmtlclJlbmRlcikge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFzeW5jKHdvcmtlclJlbmRlcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclN5bmMoKTtcclxuICAgIH1cclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLl9yZW5kZXJTeW5jID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIG5ld1Jvb3QgPSB0aGlzLmRvbVRyZWUgPSB0aGlzLl9jb21waWxlKHRoaXMuQVNUKSxcclxuICAgICAgICBjb250YWluZXJOb2RlID0gdGhpcy5jb250YWluZXJOb2RlLFxyXG4gICAgICAgIHJvb3ROb2RlID0gdGhpcy5yb290Tm9kZTtcclxuXHJcbiAgICB0aGlzLnJvb3ROb2RlID0gbmV3Um9vdC5jaGlsZHJlblswXTtcclxuICAgIGlmIChyb290Tm9kZSkge1xyXG4gICAgICAgIGNvbnRhaW5lck5vZGUucmVwbGFjZUNoaWxkKG5ld1Jvb3QsIHJvb3ROb2RlKTtcclxuICAgIH1cclxufVxyXG5cclxuRnJlZWxpc3QucHJvdG90eXBlLl9yZW5kZXJBc3luYyA9IGZ1bmN0aW9uICh3b3JrZXJSZW5kZXIpIHtcclxuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxyXG4gICAgICAgIGFzdCA9IHRoaXMuQVNUO1xyXG5cclxuICAgIHdvcmtlclJlbmRlci5yZWNlaXZlKHsgdHlwZTogJ3JlbmRlcicsIGRhdGE6IHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUsIGRhdGE6IHRoaXMuZGF0YSB9IH0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5jb250YWluZXJOb2RlLmlubmVySFRNTCA9IGRhdGEuaHRtbDtcclxuICAgICAgICAgICAgdGhpcy5yb290Tm9kZSA9IHRoaXMuY29udGFpbmVyTm9kZS5jaGlsZHJlblswXTtcclxuXHJcbiAgICAgICAgICAgIEZyZWVsaXN0LmFkZEFzeW5jRXZlbnRzLmNhbGwodGhpcywgdGhpcy5yb290Tm9kZSwgZGF0YS5ldmVudHMpO1xyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcbn1cclxuXHJcbkZyZWVsaXN0LmFkZEFzeW5jRXZlbnRzID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50cykge1xyXG4gICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCdsaXN0LWNvbnRhaW5lcicpKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jb250YWluZXIgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBub2RlLmRhdGFzZXQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBub2RlLmRhdGFzZXQubm9kZUlEID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGlmICghbm9kZS5jaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBGcmVlbGlzdC5hZGRBc3luY0V2ZW50cy5jYWxsKHRoaXMsIG5vZGUuY2hpbGRyZW5baV0sIGV2ZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIG5vZGVJZCA9IG5vZGUuZGF0YXNldC5ub2RlaWQ7XHJcblxyXG4gICAgZm9yICh2YXIgaWQgaW4gZXZlbnRzKSB7XHJcbiAgICAgICAgaWYgKGlkID09IG5vZGVJZCkge1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRIdWIgPSBldmVudHNbaWRdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGV2ZW50SHViLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuICcgKyBldmVudEh1YltqXS52YWx1ZSArICc7Jyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IGdldEhhbmRsZXIodGhpcywgdGhpcy5kYXRhLCAnJyk7XHJcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRIdWJbal0ubmFtZSwgZ2V0SGFuZGxlcih0aGlzLCB0aGlzLmRhdGEsICcnKSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgZGVsZXRlIGV2ZW50c1tub2RlSWRdO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGcmVlbGlzdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9VSVJlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNjo0NDoxMiBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxNjo1NDo1OVxyXG4gKi9cclxudmFyIGF0dHJSZXNvbHZlciA9IHJlcXVpcmUoJy4vYXR0clJlc29sdmVyLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBlbGVtZW50KGFzdCwgY29udGV4dCwgbGlzdEluZm8pIHtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhc3QudGFnKTtcclxuXHJcbiAgICB2YXIgYXR0cnMgPSBhc3QuYXR0cnM7XHJcbiAgICAvKirlpITnkIblsZ7mgKcgKi9cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGF0dHIudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdhdHRyaWJ1dGUnOiBhdHRyUmVzb2x2ZXIoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pOyBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5aSE55CG5a2Q6IqC54K5ICovXHJcbiAgICBpZiAoYXN0LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhc3QuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gYXN0LmNoaWxkcmVuW2pdO1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZChjb250ZXh0Ll9jb21waWxlKGNoaWxkLCBsaXN0SW5mbykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGV4dChhc3QpIHtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXN0LnRleHQpO1xyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4cHJlc3Npb24oYXN0LCBjb250ZXh0LCBsaXN0SW5mbykge1xyXG4gICAgdmFyIHRleHQgPSAnJztcclxuICAgIGlmIChsaXN0SW5mbykge1xyXG4gICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuICgnICsgYXN0LmJvZHkgKyAnKScpO1xyXG4gICAgICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbywgJycpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAoJyArIGFzdC5ib2R5ICsgJyknKTtcclxuICAgICAgICB0ZXh0ID0gZ2V0VmFsdWUoY29udGV4dCwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdChhc3QsIGNvbnRleHQpIHtcclxuICAgIHZhciBsaXN0Qm9keSA9IGFzdC5ib2R5O1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAoJyArIGFzdC5zZXF1ZW5jZS5ib2R5ICsgJyknKTtcclxuICAgIHZhciBhcnJheURhdGEgPSBnZXRWYWx1ZShjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgIHZhciB2YXJpYWJsZSA9IGFzdC52YXJpYWJsZTtcclxuXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5RGF0YS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIG5vZGUuYXBwZW5kKGl0ZW1Ob2RlKGxpc3RCb2R5LCBhcnJheURhdGFbal0sIGopKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpdGVtTm9kZShib2R5LCBpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIHZhciBsaXN0SW5mbyA9IHt9O1xyXG5cclxuICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZV0gPSBpdGVtO1xyXG4gICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlICsgJ19pbmRleCddID0gaW5kZXg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBib2R5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoYm9keVtpXSwgbGlzdEluZm8pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgICBjb250ZXh0Ll9saXN0LmRhdGEgPSBhcnJheURhdGE7XHJcbiAgICBjb250ZXh0Ll9saXN0LmJvZHkgPSBsaXN0Qm9keTtcclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAnZWxlbWVudCc6IGVsZW1lbnQsXHJcbiAgICAndGV4dCc6IHRleHQsXHJcbiAgICAnZXhwcmVzc2lvbic6IGV4cHJlc3Npb24sXHJcbiAgICAnbGlzdCc6IGxpc3RcclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2NvbXBpbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNjo1MTozMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxNjo1Mzo0NFxyXG4gKi9cclxuZnVuY3Rpb24gcmVzb2x2ZUF0dHJpYnV0ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbykge1xyXG4gICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiBhdHRyLnZhbHVlO1xyXG4gICAgc3dpdGNoICh2YWx1ZVR5cGUpIHtcclxuICAgICAgICBjYXNlICdzdHJpbmcnOiBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpOyBicmVhaztcclxuICAgICAgICBjYXNlICdvYmplY3QnOiBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIHJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pKTsgYnJlYWs7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGF0dHIubmFtZSA9PT0gJ2xpc3QtY29udGFpbmVyJykge1xyXG4gICAgICAgIGNvbnRleHQuX2xpc3QuY29udGFpbmVyID0gbm9kZTtcclxuICAgIH1cclxufVxyXG5cclxuIGZ1bmN0aW9uIHJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pIHtcclxuICAgIHZhciBpc0V2ZW50ID0gYXR0ci5uYW1lLnNsaWNlKDAsIDIpID09PSAnb24nO1xyXG5cclxuICAgIGlmIChpc0V2ZW50KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zbGljZSgzKTtcclxuICAgICAgICBhdHRyLnZhbHVlLmJvZHkgPSBhdHRyLnZhbHVlLmJvZHkucmVwbGFjZSgvJ1xcJGV2ZW50Jy9nLCAnJGV2ZW50Jyk7XHJcbiAgICAgICAgdmFyIGdldEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiBmdW5jdGlvbigkZXZlbnQpe3JldHVybiAnICsgYXR0ci52YWx1ZS5ib2R5ICsgJzt9Jyk7XHJcblxyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGdldEhhbmRsZXIoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyksIGZhbHNlKTtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuICgnICsgYXR0ci52YWx1ZS5ib2R5ICsgJyknKTtcclxuICAgICAgICByZXR1cm4gZ2V0VmFsdWUoY29udGV4dCwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUF0dHJpYnV0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2F0dHJSZXNvbHZlci5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZnVuY3Rpb24gTWVzc2FnZUJ1cyh3b3JrZXIpe1xyXG4gICAgdGhpcy5fd29ya2VyID0gd29ya2VyO1xyXG4gICAgdGhpcy5fb25TZW5kV29ya2VyID0gW107XHJcbiAgICB0aGlzLl9jb25uZWN0aW9uQ2VudGVyID0ge307XHJcbiAgICB0aGlzLl9pbml0V29ya2VyKCk7XHJcbiAgICB0aGlzLl9jcmVhdGVFdmVudHNTdG9yZSgpO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fY3JlYXRlRXZlbnRzU3RvcmUgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5fZXZlbnRzU3RvcmUgPSB7fTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIF93b3JrZXIgPSB0aGlzLl93b3JrZXI7XHJcblxyXG4gICAgX3dvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fb25Xb3JrZXJNZXNzYWdlLmJpbmQodGhpcykpO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fb25Xb3JrZXJNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSl7XHJcblxyXG4gICAgdGhpcy5fZGVzZXJpYWxpemUobWVzc2FnZSk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLnJlY2VpdmUgPSBmdW5jdGlvbihtZXNzYWdlKXtcclxuICAgIHRoaXMuX2J1ZmZlciA9IG1lc3NhZ2U7XHJcbiAgICB0aGlzLl9zZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuYWRkRXZlbnQgPSBmdW5jdGlvbihldmVudFR5cGUsIGZuKXtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKGV2ZW50VHlwZSwgZm4uYmluZCh0aGlzKSk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9kZXNlcmlhbGl6ZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdmFyIHR5cGUgPSBtZXNzYWdlLmRhdGEudHlwZSxcclxuICAgICAgICBkYXRhID0gbWVzc2FnZS5kYXRhLmRhdGE7XHJcblxyXG4gICAgdGhpcy5fZW1pdCh0eXBlLCBkYXRhKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3NlcmlhbGl6ZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdmFyIEluZm8gPSB7fTtcclxuXHJcbiAgICBJbmZvLnR5cGUgPSBtZXNzYWdlLnR5cGU7XHJcbiAgICBJbmZvLmRhdGEgPSBtZXNzYWdlLmRhdGE7XHJcblxyXG4gICAgdGhpcy5fc2VuZEluZm9Ub1dvcmtlcihJbmZvKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VuZEluZm9Ub1dvcmtlciA9IGZ1bmN0aW9uKEluZm8pe1xyXG4gICAgdmFyIF93b3JrZXIgPSB0aGlzLl93b3JrZXIsXHJcbiAgICAgICAgX29uU2VuZFdvcmtlciA9IHRoaXMuX29uU2VuZFdvcmtlcjtcclxuXHJcbiAgICBfd29ya2VyLnBvc3RNZXNzYWdlKEluZm8pO1xyXG5cclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihfb25TZW5kV29ya2VyLmxlbmd0aCkgdGhpcy5fY2hlY2tXYXRjaGVycyhfb25TZW5kV29ya2VyLCBJbmZvKTtcclxuICAgIH0uYmluZCh0aGlzKSwgMCk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9jaGVja1dhdGNoZXJzID0gZnVuY3Rpb24od2F0Y2hlcnMsIEluZm8pe1xyXG4gICAgXHJcbiAgICBmb3IodmFyIGk9MCwgd2F0Y2hlcjtpPHdhdGNoZXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKEluZm8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbihmbil7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIucHVzaChmbik7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihmbil7XHJcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2J1ZmZlcjtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKG1lc3NhZ2UudHlwZSwgZm4pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3JlZ2lzdGVyID0gZnVuY3Rpb24oZXZlbnROYW1lLCBmbil7XHJcbiAgICB2YXIgX2V2ZW50c1N0b3JlID0gdGhpcy5fZXZlbnRzU3RvcmU7XHJcblxyXG4gICAgaWYoX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0ud2F0Y2hlcnMucHVzaChmbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0gPSB7d2F0Y2hlcnM6IFtmbl19O1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSl7XHJcbiAgICB2YXIgX2V2ZW50c1N0b3JlID0gdGhpcy5fZXZlbnRzU3RvcmU7XHJcblxyXG4gICAgaWYoX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0gJiYgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0ud2F0Y2hlcnMubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGVXYXRjaGVycyhfZXZlbnRzU3RvcmVbZXZlbnROYW1lXS53YXRjaGVycywgZGF0YSk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9leGVjdXRlV2F0Y2hlcnMgPSBmdW5jdGlvbih3YXRjaGVycywgZGF0YSl7XHJcbiAgICBmb3IodmFyIGk9d2F0Y2hlcnMubGVuZ3RoLTEsIHdhdGNoZXI7aT49MDtpLS0pe1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKGRhdGEpO1xyXG4gICAgICAgIHdhdGNoZXJzLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxufVxyXG5cclxud2luZG93Lk1lc3NhZ2VCdXMgPSBNZXNzYWdlQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==