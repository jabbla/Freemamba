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
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function documentFragment(){
    this._children = [];
}
documentFragment.prototype.append = function(node){
    this._children.push(node);
};

module.exports = documentFragment;

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {__webpack_require__(11)();



var _  = module.exports;
var entities = __webpack_require__(12);
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






/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(8).setImmediate))

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {


module.exports = {
  'BEGIN': '{',
  'END': '}',
  'PRECOMPILE': false
}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

function TextNode(text){
    this._value = text;
}

module.exports = TextNode;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 15:05:01 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-24 23:33:34
 */
var Parser = __webpack_require__(7);

if(!this.document){
    /*eslint-disable*/
    document = __webpack_require__(15);
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
    this.$list = {};
    this.$refs = {};

    this._definer = model;
};

BaseRenderStore.prototype._compile = function(ast, listInfo, listBuffer, curIndex, rootPath, listName){
    if(ast instanceof Array){
        var node = document.createDocumentFragment();
        for(var i=0;i<ast.length;i++){
            node.append(this._compile(ast[i], listInfo, listBuffer, i, rootPath, listName));
        }
        return node;
    }else{
        return this._compiler[ast.type](ast, this, listInfo, listBuffer, curIndex, rootPath, listName);
    }
};

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
};

module.exports = BaseRenderStore;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(2);

var config = __webpack_require__(4);
var node = __webpack_require__(13);
var Lexer = __webpack_require__(14);
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
/* 8 */
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
__webpack_require__(9);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 9 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(10)))

/***/ }),
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(2);
var config = __webpack_require__(4);

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
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var documentFragment = __webpack_require__(0);
var Element = __webpack_require__(16);
var TextNode = __webpack_require__(5);

var proto = {
    createDocumentFragment: function(){
        return new documentFragment();
    },
    createElement: function(tagName){
        return new Element(tagName);
    },
    createTextNode: function(text){
        return new TextNode(text);
    }
};

var doc = Object.create(proto);

module.exports = doc;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var documentFragment = __webpack_require__(0);

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

Element.prototype.addEventListener = function(eventName, handler, isPop, argContext){
    this._events.push({name: eventName.replace(/-/, ''), value: handler+'', context: argContext});
};

Element.prototype.append = function(node){
    // if(node instanceof documentFragment){
    //     for(var i=0;i<node._children.length;i++){
    //         this._children.push(node._children[i]);     
    //     }
    //     return;
    // }
    this._children.push(node);
};

module.exports = Element;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:51:53 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 07:41:12
 */
function MessageBus() {
    this._onSendWorker = [];
    this._baseId = 0;
    this._initWorker();
    this._createEventsStore();
}

MessageBus.prototype._createEventsStore = function () {
    this._eventsStore = {};
};

MessageBus.prototype._initWorker = function () {
};

MessageBus.prototype._onMessage = function (message) {
    var Info = this._deserialize(message);
    this._receiveBusResolver(Info);
    this._emit(Info.id, Info.type, Info.data);
};

MessageBus.prototype._receiveBusResolver = function () {
};

MessageBus.prototype.receive = function (message) {
    this._buffer = message;
    this._serialize(message);
    return this;
};

MessageBus.prototype.addEvent = function (eventType, fn) {
    this._register(eventType, fn.bind(this));
};

MessageBus.prototype._deserialize = function (message) {
    var type = message.data.type,
        data = message.data.data,
        id = message.data.id,
        mambaID = message.data.mambaID;

    return { mambaID: mambaID , id: id, type: type, data: data };
};

MessageBus.prototype._serialize = function () {
};

MessageBus.prototype._sendInfoToWorker = function (Info) {
    var _onSendWorker = this._onSendWorker;

    this._postMessage(Info);

    setTimeout(function () {
        if (_onSendWorker.length) this._checkWatchers(_onSendWorker, Info);
    }.bind(this), 0);
};

MessageBus.prototype._postMessage = function () {
};

MessageBus.prototype._checkWatchers = function (watchers, Info) {

    for (var i = watchers.length - 1, watcher; i >= 0; i--) {
        watcher = watchers[i];
        watcher(Info);
        watchers.splice(i, 1);
    }
};

MessageBus.prototype.onSend = function (fn) {
    this._onSendWorker.push(fn);
};

MessageBus.prototype.then = function (fn) {
    var message = this._buffer;
    this._register(message.id, message.type, fn);

    return this;
};

MessageBus.prototype._register = function (id, eventName, fn) {
    var _eventsStore = this._eventsStore;

    if(!_eventsStore[id])
        _eventsStore[id] = {};

    if (_eventsStore[id][eventName])
        _eventsStore[id][eventName].watchers.push(fn);
    else
        _eventsStore[id][eventName] = { watchers: [fn] };
};

MessageBus.prototype._emit = function (id, eventName, data) {
    var _eventsStore = this._eventsStore;

    if (_eventsStore[id] && _eventsStore[id][eventName] && _eventsStore[id][eventName].watchers.length)
        this._executeWatchers(_eventsStore[id][eventName].watchers, eventName, data);
};

MessageBus.prototype._executeWatchers = function (watchers, eventName, data) {
    for (var i = watchers.length - 1, watcher; i >= 0; i--) {
        watcher = watchers[i];
        watcher(eventName, data);
        watchers.splice(i, 1);
    }
};

module.exports = MessageBus;

/***/ }),
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(28);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 07:41:43
 */

var MessageBus = __webpack_require__(29);
var WKRenderStore = __webpack_require__(30);
var Differ = __webpack_require__(33);

var myMessageBus = new MessageBus();

/**v-domStore */
var VdomStore = {};

/**状态枚举 */
var INITIAL_RENDER = 'INITIAL_RENDER';
var UPDATE_RENDER = 'UPDATE_RENDER';
var DIFF_DETECT = 'DIFF_DETECT';

/**INITIAL_RENDER */
myMessageBus.buildReceiveDispatcher(INITIAL_RENDER, function(message){
    var data = message.data,
        mambaID = message.mambaID,
        store = new WKRenderStore(data);

    store.render();
    VdomStore[mambaID] = store.vDom;
    //console.log('Worker 收到', INITIAL_RENDER);
    //console.log(store.vDom);
});

/**UPDATE_RENDER */
myMessageBus.buildReceiveDispatcher(UPDATE_RENDER, function(message){
    var data = message.data,
        mambaID = message.mambaID,
        store = new WKRenderStore(data);

    store.render();
    //console.log('Worker 收到', UPDATE_RENDER);
    VdomStore[mambaID] = store.vDom;
});

/**DIFF_DETECT */
myMessageBus.buildReceiveDispatcher(DIFF_DETECT, function(message){
    var data = message.data,
        mambaID = message.mambaID,
        id = message.id,
        store = new WKRenderStore(data);

    store.render();
    console.log('Worker 收到', DIFF_DETECT);
    console.log(VdomStore[mambaID], store.vDom);
    var differs = Differ(VdomStore[mambaID], store.vDom);
    console.log(differs);
    VdomStore[mambaID] = store.vDom;
    this.receive({ type: DIFF_DETECT, data: differs, id: id });
});
/**消息Log */
myMessageBus.onSend(function(){
    //console.log('Worker 已发送：', message);
});



/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:27 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 00:43:00
 */
var MessageBus = __webpack_require__(17);
var Extend = __webpack_require__(1);

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
        dispatcher[type].call(this, {data: data, mambaID: mambaID, id: id});
    }else{
        throw new Error('worker MessgaeBus haven\'t registered type: '+type);
    }
    
}

WorkerMsgBus.prototype.onReceiveMessage = function(fn){

}

module.exports = WorkerMsgBus;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:44 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:21:24
 */

var BaseRenderStore = __webpack_require__(6);
var Extend = __webpack_require__(1);
var Compiler = __webpack_require__(31);

var documentFragment = __webpack_require__(0);

function RenderStore(obj) {
    this.super(obj);
    this.events = {};
    this.nodeId = 0;
}

Extend(RenderStore, BaseRenderStore);

RenderStore.prototype.render = function () {
    this._compiler = Compiler;
    this._typedFlater = RenderStore.typedFlater;
    this.vDom = this._compile(this.AST, this.data, null, 0, '');

};

RenderStore.prototype.flatToString = function (node) {
    if (node instanceof Array) {
        var result = '';
        for (var i = 0; i < node.length; i++) {
            result += this.flatToString(node[i]);
        }
        return result;
    } else {
        return this.flatNode(node);
    }

};

RenderStore.prototype.flatNode = function (node) {
    var tagName = node._tagName,
        attrs = node._attrs,
        events = node._events,
        children = node._children,
        body = '', attrStr = '', eventStr = '',
        nodeId = this.nodeId;

    /**文本节点处理 */
    if (typeof node === 'string') {
        return node;
    }

    /**插入子节点 */
    for (var i = 0; i < children.length; i++) {
        body += this.flatNode(children[i]);
    }

    /**fragMent */
    if (node instanceof documentFragment) {
        return body;
    }

    /**生成属性字符串 */
    for (var j = 0; j < attrs.length; j++) {
        attrStr += (attrs[j].name + '="' + attrs[j].value + '" ');
    }

    /**事件处理 */
    if (events.length) {
        attrStr += 'data-nodeid="' + nodeId + '"';
        for (var h = 0; h < events.length; h++) {
            events[h].value += '';
        }
        this.events[nodeId] = events;
    }
    this.nodeId++;
    return '<' + tagName + ' ' + attrStr + eventStr + '>' + body + '</' + tagName + '>';
};

module.exports = RenderStore;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-24 23:43:18
 */
var attrResolver = __webpack_require__(32);

function element(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs;
    /**处理属性 */
    for(var i=0;i<attrs.length;i++){
        var attr = attrs[i];

        if(attr.name === 'list' && attr.value){
            node._listName = attr.value;
        }

        switch(attr.type){
            case 'attribute': 
                attrResolver(attr, node, context, listInfo); break;
            default:
        }
    }

    rootPath = rootPath+' '+curIndex;
    /**处理子节点 */
    if(ast.children){

        for(var j=0, nextIndex=0;j<ast.children.length;j++, nextIndex++){
            var child = ast.children[j],
                childNode = context._compile(child, listInfo, null, nextIndex, rootPath, node._listName || listName);
            
            if(child.type === 'list' || child.type === 'if'){
                nextIndex += (childNode._length-1);
            }

            if(child.type === 'list'){
                node._container = 'true';
                node._getListData = child.sequence.body;
                node._ast = ast;
                node._variable = child.variable;
            }

            node.append(childNode);
        }
    }
    
    node._path = rootPath;
    if(listName) node._listName = listName;
    
    return node;
}

function text(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var node = document.createTextNode(ast.text);

    node._path = (rootPath+' '+curIndex);
    if(listName) node._listName = listName;

    return node;
}

function expression(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var text = '', getValue;
    
    getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
    text = getValue(context, listInfo || context.data, '');

    var node = document.createTextNode(text);

    node._path = (rootPath+' '+curIndex);
    if(listName) node._listName = listName;

    return node;
}

function list(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var listBody = ast.body;
    var node = document.createDocumentFragment();
    var getValue = new Function('c','d','e','return ('+ast.sequence.body+')');
    var arrayData = getValue(context, listInfo || context.data, '');
    var variable = ast.variable;

    /**计算列表总长度 */
    node._length = arrayData.length * listBody.length;

    for(var j=0;j<arrayData.length;j++){
        node.append(itemNode(listBody, arrayData[j], j, rootPath, listName));
    }

    function itemNode(body, item, index, rootPath, listName){
        var node = document.createDocumentFragment();
        var listInfo = {};

        listInfo[variable] = item;
        listInfo[variable+'_index'] = index;
        for(var i=0;i<body.length;i++){
            var itemIndex = curIndex + (j*arrayData.length) + i;
            node.append(context._compile(body[i], listInfo, null, itemIndex, rootPath, listName));
        }

        if(listName) node._listName = listName;

        return node;
    }
    if(listName) node._listName = listName;

    node._isListBody = true;
    return node;
}

function condition(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var test = ast.test, node = document.createDocumentFragment();
    var getValue = new Function('c', 'd', 'e', 'return (' + test.body + ')');
    var consequent = ast.consequent, length;

    if(getValue(context, listInfo || context.data, '')){
        for(var i=0;i<consequent.length;i++){
            var itemIndex = curIndex + i;
            node.append(context._compile(consequent[i], listInfo || context.data, listBuffer, itemIndex, rootPath, listName));
        }
        length = consequent.length;
    }else{
        length = 0;
    }
    node._length = length;

    return node;
}

module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list,
    'if': condition
};

/***/ }),
/* 32 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:14:37 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:34:16
 */

function resolveAttribute(attr, node, context, listInfo){
    var valueType = typeof attr.value;

    switch(valueType){
        case 'string': 
            node.setAttribute(attr.name, attr.value); break;
        case 'object': 
            node.setAttribute(attr.name, resolveAttrValue(attr, node, context, listInfo)); break;
        default:
    }
    
    

    if(attr.name === 'list-container'){
        node.setAttribute('list-container', true);
    }
}

function resolveAttrValue(attr, node, context, listInfo){
    var isEvent = attr.name.slice(0,2) === 'on';

    if(isEvent){
        var eventName = attr.name.slice(3);
        attr.value.body = attr.value.body.replace(/'\$event'/g, '$event');
        var getHandler = new Function('c', 'd', 'e', 'return function($event){return '+attr.value.body+';}');

        node.addEventListener(eventName, getHandler(context, listInfo || context.data, ''), false, listInfo || context.data);
        return '';
    }else{
        var getValue = new Function('c','d','e','return ('+attr.value.body+')');
        return getValue(context, listInfo || context.data, '');
    }
}

module.exports = resolveAttribute;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(34);
var TextNode = __webpack_require__(5);
//var COMPARE_FIELD = ['_attrs', '_events', '_tagName'];
var ADD = 'ADD';
var DELETE = 'DELETE';
var REPLACE = 'REPLACE';

function Differ(prevDom, curDom, result){

    if(typeof prevDom === 'undefined' && typeof curDom === 'undefined'){
        return;
    }
    /**添加操作 */
    if(typeof prevDom === 'undefined' && typeof curDom === 'object'){
        result.push({ type: ADD, curDom: curDom, prevDom: prevDom });
        return;
    }

    /**删除操作 */
    if(typeof curDom === 'undefined' && typeof prevDom === 'object'){
        result.push({ type: DELETE, curDom: curDom, prevDom: prevDom });
        return;
    }

    /**修改操作 */
    var diffInfo = { type: REPLACE, curDom: curDom, prevDom: prevDom};

    /**Text node */
    if(prevDom instanceof TextNode && curDom instanceof TextNode){
        if(prevDom._value.trim() !== curDom._value.trim()){
            result.push(diffInfo);
            return;
        }
        return;
    }else if(prevDom instanceof TextNode || curDom instanceof TextNode){
        result.push(diffInfo);
        return;
    }

    /**标签名 */
    var prevTagName = prevDom._tagName,
        curTagName = curDom._tagName;
    
    if(diff(prevTagName, curTagName)){
        result.push(diffInfo);
        return;
    }

    /**属性diff */
    var prevAttrs = prevDom._attrs,
        curAttrs = curDom._attrs;

    if(diff(prevAttrs, curAttrs)){
        result.push(diffInfo);
        return;
    }

    /**children diff */
    if(prevDom._children && curDom._children){
        var prevChildren = prevDom._children,
            curChildren = curDom._children,
            maxLength = prevChildren.length > curChildren.length ? prevChildren.length : curChildren.length;

        for(var i=0;i<maxLength;i++){
            var prevChild = prevChildren[i],
                curChild = curChildren[i];

            Differ(prevChild, curChild, result);
        }
    }else if((prevDom._children && !curDom._children) || (!prevDom._children && curDom._children)){
        result.push(diffInfo);
    }
    return;
}

function mergeDiff(diffs){
    var listMap = {},
        result = [];
    for(var i=0;i<diffs.length;i++){
        var listName = (diffs[i].prevDom && diffs[i].prevDom._listName) || (diffs[i].curDom && diffs[i].curDom._listName),
            isContainer = (diffs[i].prevDom && diffs[i].prevDom._container) || (diffs[i].curDom && diffs[i].curDom._container);
        if(listName && !isContainer){
            if(!listMap[listName]){
                result.push(diffs[i]);
                listMap[listName] = true;
            }
        }else{
            result.push(diffs[i]);
        }
    }
    return result;
}

function sortDiff(diffs){
    diffs.sort(function(val1, val2){
        var path1 = val1.prevDom && val1.prevDom._path || val1.curDom._path,
            path2 = val2.prevDom && val2.prevDom._path || val2.curDom._path,
            path1s = path1.trim().split(' '),
            path2s = path2.trim().split(' '),
            curIndex1 = path1s[path1s.length-1],
            curIndex2 = path2s[path2s.length-1],
            rootPath1 = path1s.slice(0, -1).join(' '),
            rootPath2 = path2s.slice(0, -1).join(' ');

        if(rootPath1 === rootPath2){
            return curIndex2 - curIndex1;
        }
    });
    return diffs;
}

function mainDiff(prevRoot, curRoot){
    var result = [];
    Differ(prevRoot._children[0], curRoot._children[0], result);
    
    return sortDiff(mergeDiff(result));
}

module.exports = mainDiff;

/***/ }),
/* 34 */
/***/ (function(module, exports) {

var toString = Object.prototype.toString;

function diff(item1, item2){
    if(!isSameType(item1, item2)){
        return true;
    }
    var bool;
    switch(typeOf(item1)){
        case 'Array': 
            bool = diffArray(item1, item2); 
            break;
        case 'Object':
            bool = diffObj(item1, item2); 
            break;
        default:
            bool = item1 !== item2;
    }

    return bool;
}

function diffObj(obj1, obj2){
    if(obj1===obj2){
        return false;
    }

    var keys1 = Object.keys(obj1),
        keys2 = Object.keys(obj2);

    /**检测key数量 */
    if(keys1.length !== keys2.length){
        return true;
    }

    /**检测value */
    for(var i=0;i<keys1.length;i++){
        var value1 = obj1[keys1[i]],
            value2 = obj2[keys1[i]];

        if(!isSameType(value1, value2)) return true;

        var bool;
        switch (typeOf(value1)){
            case 'Array': 
                bool = diffArray(value1, value2); 
                break;
            case 'Object':
                bool = diffObj(value1, value2); 
                break;
            default:
                bool = value1 !== value2;
        }
        if(bool) return true;
    }
    return false;
}

function diffArray(array1, array2){
    if(array1 === array2){
        return false;
    }
    if(array1.length !== array2.length){
        return true;
    }
    for(var i=0;i<array1.length;i++){
        if(!isSameType(array1[i], array2[i])){
            return true;
        }

        var bool;
        switch (typeOf(array1[i])){
            case 'Array': 
                bool = diffArray(array1[i], array2[i]); 
                break;
            case 'Object':
                bool = diffObj(array1[i], array2[i]); 
                break;
            default: 
                bool = array1[i] !== array2[i];
        }
        if(bool) return true;
    }

    return false;
}

function isSameType(item1, item2){
    return typeOf(item1) === typeOf(item2);
}

function typeOf(item){
    
    if(typeof item !== 'object'){
        return typeof item;
    }
    return toString.call(item).slice(8, -1);
}

module.exports = diff;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTMxNDEzYjYzY2E1ZTdhMjhmYTUiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL1RleHROb2RlLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy93a19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9Xb3JrZXJNc2dCdXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL1dLUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2F0dHJSZXNvbHZlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9EaWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RpZmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQzs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Qjs7Ozs7OzREQ2RBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE1BQU0sVUFBVSxXQUFXLE1BQU0sT0FBTyxhQUFhOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFVBQVU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHFFQUFxRSxLQUFLO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxPQUFPO0FBQ1Asa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaUNBQWlDLG1CQUFtQiw0QkFBNEIsV0FBVyxZQUFZLEVBQUUsYUFBYTtBQUNsSjtBQUNBOztBQUVBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSwwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssS0FBSztBQUNWO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsS0FBSztBQUNSLG1EQUFtRDtBQUNuRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLHdCOzs7Ozs7QUNsdUJBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLHNCQUFzQixFQUFFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3pMRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7O0FDdkx0QztBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFNBQVM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTs7QUFFQSxzQiIsImZpbGUiOiJXb3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyNyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTMxNDEzYjYzY2E1ZTdhMjhmYTUiLCJmdW5jdGlvbiBkb2N1bWVudEZyYWdtZW50KCl7XHJcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG59XHJcbmRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnRGcmFnbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RvY3VtZW50RnJhZ21lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNDo1NDozMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxNDo1OTo0MFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGV4dGVuZChjaGlsZENsYXNzLCBiYXNlQ2xhc3Mpe1xyXG4gICAgdmFyIGZuID0gZnVuY3Rpb24oKXt9O1xyXG4gICAgZm4ucHJvdG90eXBlID0gYmFzZUNsYXNzLnByb3RvdHlwZTtcclxuICAgIGNoaWxkQ2xhc3MucHJvdG90eXBlID0gbmV3IGZuKCk7XHJcbiAgICBjaGlsZENsYXNzLnByb3RvdHlwZS5zdXBlciA9IGJhc2VDbGFzcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdXRpbHMvZXh0ZW5kLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwicmVxdWlyZSgnLi9oZWxwZXIvc2hpbS5qcycpKCk7XHJcblxyXG5cclxuXHJcbnZhciBfICA9IG1vZHVsZS5leHBvcnRzO1xyXG52YXIgZW50aXRpZXMgPSByZXF1aXJlKCcuL2hlbHBlci9lbnRpdGllcy5qcycpO1xyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIG8yc3RyID0gKHt9KS50b1N0cmluZztcclxudmFyIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09J3VuZGVmaW5lZCc/IHdpbmRvdzogZ2xvYmFsO1xyXG52YXIgTUFYX1BSSU9SSVRZID0gOTk5OTtcclxuXHJcblxyXG5fLm5vb3AgPSBmdW5jdGlvbigpe307XHJcbl8udWlkID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIF91aWQ9MDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBfdWlkKys7XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXy5leHRlbmQgPSBmdW5jdGlvbiggbzEsIG8yLCBvdmVycmlkZSApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYgKG8yLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkIHx8IG92ZXJyaWRlID09PSB0cnVlICl7XHJcbiAgICAgIG8xW2ldID0gbzJbaV1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG8xO1xyXG59XHJcblxyXG5fLmtleXMgPSBPYmplY3Qua2V5cz8gT2JqZWN0LmtleXM6IGZ1bmN0aW9uKG9iail7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICByZXMucHVzaChpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuXy5zb21lID0gZnVuY3Rpb24obGlzdCwgZm4pe1xyXG4gIGZvcih2YXIgaSA9MCxsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgIGlmKGZuKGxpc3RbaV0pKSByZXR1cm4gdHJ1ZVxyXG4gIH1cclxufVxyXG5cclxuXy52YXJOYW1lID0gJ2QnO1xyXG5fLnNldE5hbWUgPSAncF8nO1xyXG5fLmN0eE5hbWUgPSAnYyc7XHJcbl8uZXh0TmFtZSA9ICdlJztcclxuXHJcbl8ucldvcmQgPSAvXltcXCRcXHddKyQvO1xyXG5fLnJTaW1wbGVBY2Nlc3NvciA9IC9eW1xcJFxcd10rKFxcLltcXCRcXHddKykqJC87XHJcblxyXG5fLm5leHRUaWNrID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJz8gXHJcbiAgc2V0SW1tZWRpYXRlLmJpbmQod2luKSA6IFxyXG4gIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKSBcclxuICB9XHJcblxyXG5cclxuXHJcbl8ucHJlZml4ID0gXCIndXNlIHN0cmljdCc7dmFyIFwiICsgXy52YXJOYW1lICsgXCI9XCIgKyBfLmN0eE5hbWUgKyBcIi5kYXRhO1wiICsgIF8uZXh0TmFtZSAgKyBcIj1cIiArIF8uZXh0TmFtZSArIFwifHwnJztcIjtcclxuXHJcblxyXG5fLnNsaWNlID0gZnVuY3Rpb24ob2JqLCBzdGFydCwgZW5kKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yKHZhciBpID0gc3RhcnQgfHwgMCwgbGVuID0gZW5kIHx8IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICByZXMucHVzaChvYmpbaV0pXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIGJlYWN1c2Ugc2xpY2UgYW5kIHRvTG93ZXJDYXNlIGlzIGV4cGVuc2l2ZS4gd2UgaGFuZGxlIHVuZGVmaW5lZCBhbmQgbnVsbCBpbiBhbm90aGVyIHdheVxyXG5fLnR5cGVPZiA9IGZ1bmN0aW9uIChvKSB7XHJcbiAgcmV0dXJuIG8gPT0gbnVsbCA/IFN0cmluZyhvKSA6bzJzdHIuY2FsbChvKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXy5tYWtlUHJlZGljYXRlID0gZnVuY3Rpb24gbWFrZVByZWRpY2F0ZSh3b3JkcywgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIHdvcmRzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgd29yZHMgPSB3b3Jkcy5zcGxpdChcIiBcIik7XHJcbiAgICB9XHJcbiAgICB2YXIgZiA9IFwiXCIsXHJcbiAgICBjYXRzID0gW107XHJcbiAgICBvdXQ6IGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNhdHMubGVuZ3RoOyArK2ope1xyXG4gICAgICAgICAgaWYgKGNhdHNbal1bMF0ubGVuZ3RoID09PSB3b3Jkc1tpXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBjYXRzW2pdLnB1c2god29yZHNbaV0pO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlIG91dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0cy5wdXNoKFt3b3Jkc1tpXV0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY29tcGFyZVRvKGFycikge1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAxKSByZXR1cm4gZiArPSBcInJldHVybiBzdHIgPT09ICdcIiArIGFyclswXSArIFwiJztcIjtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0cil7XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpe1xyXG4gICAgICAgICAgIGYgKz0gXCJjYXNlICdcIiArIGFycltpXSArIFwiJzpcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcInJldHVybiB0cnVlfXJldHVybiBmYWxzZTtcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gdGhyZWUgbGVuZ3RoIGNhdGVnb3JpZXMsIGFuIG91dGVyXHJcbiAgICAvLyBzd2l0Y2ggZmlyc3QgZGlzcGF0Y2hlcyBvbiB0aGUgbGVuZ3RocywgdG8gc2F2ZSBvbiBjb21wYXJpc29ucy5cclxuICAgIGlmIChjYXRzLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICBjYXRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0ci5sZW5ndGgpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY2F0ID0gY2F0c1tpXTtcclxuICAgICAgICAgICAgZiArPSBcImNhc2UgXCIgKyBjYXRbMF0ubGVuZ3RoICsgXCI6XCI7XHJcbiAgICAgICAgICAgIGNvbXBhcmVUbyhjYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmICs9IFwifVwiO1xyXG5cclxuICAgICAgICAvLyBPdGhlcndpc2UsIHNpbXBseSBnZW5lcmF0ZSBhIGZsYXQgYHN3aXRjaGAgc3RhdGVtZW50LlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb21wYXJlVG8od29yZHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcInN0clwiLCBmKTtcclxufVxyXG5cclxuXHJcbl8udHJhY2tFcnJvclBvcyA9IChmdW5jdGlvbiAoKXtcclxuICAvLyBsaW5lYnJlYWtcclxuICB2YXIgbGIgPSAvXFxyXFxufFtcXG5cXHJcXHUyMDI4XFx1MjAyOV0vZztcclxuICB2YXIgbWluUmFuZ2UgPSAyMCwgbWF4UmFuZ2UgPSAyMDtcclxuICBmdW5jdGlvbiBmaW5kTGluZShsaW5lcywgcG9zKXtcclxuICAgIHZhciB0bXBMZW4gPSAwO1xyXG4gICAgZm9yKHZhciBpID0gMCxsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICAgIHZhciBsaW5lTGVuID0gKGxpbmVzW2ldIHx8IFwiXCIpLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmKHRtcExlbiArIGxpbmVMZW4gPiBwb3MpIHtcclxuICAgICAgICByZXR1cm4ge251bTogaSwgbGluZTogbGluZXNbaV0sIHN0YXJ0OiBwb3MgLSBpIC0gdG1wTGVuICwgcHJldjpsaW5lc1tpLTFdLCBuZXh0OiBsaW5lc1tpKzFdIH07XHJcbiAgICAgIH1cclxuICAgICAgLy8gMSBpcyBmb3IgdGhlIGxpbmVicmVha1xyXG4gICAgICB0bXBMZW4gPSB0bXBMZW4gKyBsaW5lTGVuIDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZm9ybWF0TGluZShzdHIsICBzdGFydCwgbnVtLCB0YXJnZXQpe1xyXG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICB2YXIgbWluID0gc3RhcnQgLSBtaW5SYW5nZTtcclxuICAgIGlmKG1pbiA8IDApIG1pbiA9IDA7XHJcbiAgICB2YXIgbWF4ID0gc3RhcnQgKyBtYXhSYW5nZTtcclxuICAgIGlmKG1heCA+IGxlbikgbWF4ID0gbGVuO1xyXG5cclxuICAgIHZhciByZW1haW4gPSBzdHIuc2xpY2UobWluLCBtYXgpO1xyXG4gICAgdmFyIHByZWZpeCA9IFwiW1wiICsobnVtKzEpICsgXCJdIFwiICsgKG1pbiA+IDA/IFwiLi5cIiA6IFwiXCIpXHJcbiAgICB2YXIgcG9zdGZpeCA9IG1heCA8IGxlbiA/IFwiLi5cIjogXCJcIjtcclxuICAgIHZhciByZXMgPSBwcmVmaXggKyByZW1haW4gKyBwb3N0Zml4O1xyXG4gICAgaWYodGFyZ2V0KSByZXMgKz0gXCJcXG5cIiArIG5ldyBBcnJheShzdGFydC1taW4gKyBwcmVmaXgubGVuZ3RoICsgMSkuam9pbihcIiBcIikgKyBcIl5eXlwiO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBwb3Mpe1xyXG4gICAgaWYocG9zID4gaW5wdXQubGVuZ3RoLTEpIHBvcyA9IGlucHV0Lmxlbmd0aC0xO1xyXG4gICAgbGIubGFzdEluZGV4ID0gMDtcclxuICAgIHZhciBsaW5lcyA9IGlucHV0LnNwbGl0KGxiKTtcclxuICAgIHZhciBsaW5lID0gZmluZExpbmUobGluZXMscG9zKTtcclxuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnQsIG51bSA9IGxpbmUubnVtO1xyXG5cclxuICAgIHJldHVybiAobGluZS5wcmV2PyBmb3JtYXRMaW5lKGxpbmUucHJldiwgc3RhcnQsIG51bS0xICkgKyAnXFxuJzogJycgKSArIFxyXG4gICAgICBmb3JtYXRMaW5lKGxpbmUubGluZSwgc3RhcnQsIG51bSwgdHJ1ZSkgKyAnXFxuJyArIFxyXG4gICAgICAobGluZS5uZXh0PyBmb3JtYXRMaW5lKGxpbmUubmV4dCwgc3RhcnQsIG51bSsxICkgKyAnXFxuJzogJycgKTtcclxuXHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXHJcbnZhciBpZ25vcmVkUmVmID0gL1xcKChcXD9cXCF8XFw/XFw6fFxcP1xcPSkvZztcclxuXy5maW5kU3ViQ2FwdHVyZSA9IGZ1bmN0aW9uIChyZWdTdHIpIHtcclxuICB2YXIgbGVmdCA9IDAsXHJcbiAgICByaWdodCA9IDAsXHJcbiAgICBsZW4gPSByZWdTdHIubGVuZ3RoLFxyXG4gICAgaWdub3JlZCA9IHJlZ1N0ci5tYXRjaChpZ25vcmVkUmVmKTsgLy8gaWdub3JlZCB1bmNhcHR1cmVcclxuICBpZihpZ25vcmVkKSBpZ25vcmVkID0gaWdub3JlZC5sZW5ndGhcclxuICBlbHNlIGlnbm9yZWQgPSAwO1xyXG4gIGZvciAoOyBsZW4tLTspIHtcclxuICAgIHZhciBsZXR0ZXIgPSByZWdTdHIuY2hhckF0KGxlbik7XHJcbiAgICBpZiAobGVuID09PSAwIHx8IHJlZ1N0ci5jaGFyQXQobGVuIC0gMSkgIT09IFwiXFxcXFwiICkgeyBcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIoXCIpIGxlZnQrKztcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIpXCIpIHJpZ2h0Kys7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChsZWZ0ICE9PSByaWdodCkgdGhyb3cgXCJSZWdFeHA6IFwiKyByZWdTdHIgKyBcIidzIGJyYWNrZXQgaXMgbm90IG1hcmNoZWRcIjtcclxuICBlbHNlIHJldHVybiBsZWZ0IC0gaWdub3JlZDtcclxufTtcclxuXHJcblxyXG5fLmVzY2FwZVJlZ0V4cCA9IGZ1bmN0aW9uKCBzdHIpey8vIENyZWRpdDogWFJlZ0V4cCAwLjYuMSAoYykgMjAwNy0yMDA4IFN0ZXZlbiBMZXZpdGhhbiA8aHR0cDovL3N0ZXZlbmxldml0aGFuLmNvbS9yZWdleC94cmVnZXhwLz4gTUlUIExpY2Vuc2VcclxuICByZXR1cm4gc3RyLnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uXFxcXF4kfCwjXFxzXS9nLCBmdW5jdGlvbihtYXRjaCl7XHJcbiAgICByZXR1cm4gJ1xcXFwnICsgbWF0Y2g7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxudmFyIHJFbnRpdHkgPSBuZXcgUmVnRXhwKFwiJig/OigjeFswLTlhLWZBLUZdKyl8KCNbMC05XSspfChcIiArIF8ua2V5cyhlbnRpdGllcykuam9pbignfCcpICsgJykpOycsICdnaScpO1xyXG5cclxuXy5jb252ZXJ0RW50aXR5ID0gZnVuY3Rpb24oY2hyKXtcclxuXHJcbiAgcmV0dXJuIChcIlwiICsgY2hyKS5yZXBsYWNlKHJFbnRpdHksIGZ1bmN0aW9uKGFsbCwgaGV4LCBkZWMsIGNhcHR1cmUpe1xyXG4gICAgdmFyIGNoYXJDb2RlO1xyXG4gICAgaWYoIGRlYyApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGRlYy5zbGljZSgxKSwgMTAgKTtcclxuICAgIGVsc2UgaWYoIGhleCApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGhleC5zbGljZSgyKSwgMTYgKTtcclxuICAgIGVsc2UgY2hhckNvZGUgPSBlbnRpdGllc1tjYXB0dXJlXVxyXG5cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCBjaGFyQ29kZSApXHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5cclxuLy8gc2ltcGxlIGdldCBhY2Nlc3NvclxyXG5cclxuXy5jcmVhdGVPYmplY3QgPSBPYmplY3QuY3JlYXRlPyBmdW5jdGlvbihvKXtcclxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShvIHx8IG51bGwpXHJcbn06IChmdW5jdGlvbigpe1xyXG4gICAgZnVuY3Rpb24gVGVtcCgpIHt9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24obyl7XHJcbiAgICAgIGlmKCFvKSByZXR1cm4ge31cclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBvO1xyXG4gICAgICB2YXIgb2JqID0gbmV3IFRlbXAoKTtcclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBudWxsOyAvLyDkuI3opoHkv53mjIHkuIDkuKogTyDnmoTmnYLmlaPlvJXnlKjvvIhhIHN0cmF5IHJlZmVyZW5jZe+8iS4uLlxyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5fLmNyZWF0ZVByb3RvID0gZnVuY3Rpb24oZm4sIG8pe1xyXG4gICAgZnVuY3Rpb24gRm9vKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZm47fVxyXG4gICAgRm9vLnByb3RvdHlwZSA9IG87XHJcbiAgICByZXR1cm4gKGZuLnByb3RvdHlwZSA9IG5ldyBGb28oKSk7XHJcbn1cclxuXHJcblxyXG5fLnJlbW92ZU9uZSA9IGZ1bmN0aW9uKGxpc3QgLCBmaWx0ZXIpe1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICBmb3IoO2xlbi0tOyl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkge1xyXG4gICAgICBsaXN0LnNwbGljZShsZW4sIDEpXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuY2xvbmVcclxuKi9cclxuXy5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKG9iail7XHJcbiAgaWYoIW9iaiB8fCAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgKSkgcmV0dXJuIG9iajtcclxuICBpZihBcnJheS5pc0FycmF5KG9iaikpe1xyXG4gICAgdmFyIGNsb25lZCA9IFtdO1xyXG4gICAgZm9yKHZhciBpPTAsbGVuID0gb2JqLmxlbmd0aDsgaTwgbGVuO2krKyl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lZDtcclxuICB9ZWxzZXtcclxuICAgIHZhciBjbG9uZWQgPSB7fTtcclxuICAgIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5fLmVxdWFscyA9IGZ1bmN0aW9uKG5vdywgb2xkKXtcclxuICB2YXIgdHlwZSA9IHR5cGVvZiBub3c7XHJcbiAgaWYodHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIG9sZCA9PT0gJ251bWJlcicmJiBpc05hTihub3cpICYmIGlzTmFOKG9sZCkpIHJldHVybiB0cnVlXHJcbiAgcmV0dXJuIG5vdyA9PT0gb2xkO1xyXG59XHJcblxyXG52YXIgZGFzaCA9IC8tKFthLXpdKS9nO1xyXG5fLmNhbWVsQ2FzZSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGRhc2gsIGZ1bmN0aW9uKGFsbCwgY2FwdHVyZSl7XHJcbiAgICByZXR1cm4gY2FwdHVyZS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cclxuXy50aHJvdHRsZSA9IGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQpe1xyXG4gIHZhciB3YWl0ID0gd2FpdCB8fCAxMDA7XHJcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcclxuICB2YXIgdGltZW91dCA9IG51bGw7XHJcbiAgdmFyIHByZXZpb3VzID0gMDtcclxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHByZXZpb3VzID0gK25ldyBEYXRlO1xyXG4gICAgdGltZW91dCA9IG51bGw7XHJcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gIH07XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG5vdyA9ICsgbmV3IERhdGU7XHJcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XHJcbiAgICBjb250ZXh0ID0gdGhpcztcclxuICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICBwcmV2aW91cyA9IG5vdztcclxuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICghdGltZW91dCkge1xyXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIGhvZ2FuIGVzY2FwZVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5fLmVzY2FwZSA9IChmdW5jdGlvbigpe1xyXG4gIHZhciByQW1wID0gLyYvZyxcclxuICAgICAgckx0ID0gLzwvZyxcclxuICAgICAgckd0ID0gLz4vZyxcclxuICAgICAgckFwb3MgPSAvXFwnL2csXHJcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcclxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihzdHIpIHtcclxuICAgIHJldHVybiBoQ2hhcnMudGVzdChzdHIpID9cclxuICAgICAgc3RyXHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZShyTHQsICcmbHQ7JylcclxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcclxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZShyUXVvdCwgJyZxdW90OycpIDpcclxuICAgICAgc3RyO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uY2FjaGUgPSBmdW5jdGlvbihtYXgpe1xyXG4gIG1heCA9IG1heCB8fCAxMDAwO1xyXG4gIHZhciBrZXlzID0gW10sXHJcbiAgICAgIGNhY2hlID0ge307XHJcbiAgcmV0dXJuIHtcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiB0aGlzLm1heCkge1xyXG4gICAgICAgIGNhY2hlW2tleXMuc2hpZnQoKV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgLy8gXHJcbiAgICAgIGlmKGNhY2hlW2tleV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgICAgY2FjaGVba2V5XSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGU7XHJcbiAgICAgIHJldHVybiBjYWNoZVtrZXldO1xyXG4gICAgfSxcclxuICAgIG1heDogbWF4LFxyXG4gICAgbGVuOmZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBrZXlzLmxlbmd0aDtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vLyAvLyBzZXR1cCB0aGUgcmF3IEV4cHJlc3Npb25cclxuXHJcblxyXG4vLyBoYW5kbGUgdGhlIHNhbWUgbG9naWMgb24gY29tcG9uZW50J3MgYG9uLSpgIGFuZCBlbGVtZW50J3MgYG9uLSpgXHJcbi8vIHJldHVybiB0aGUgZmlyZSBvYmplY3RcclxuXy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKHZhbHVlLCB0eXBlICl7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLCBldmFsdWF0ZTtcclxuICBpZih2YWx1ZS50eXBlID09PSAnZXhwcmVzc2lvbicpeyAvLyBpZiBpcyBleHByZXNzaW9uLCBnbyBldmFsdWF0ZWQgd2F5XHJcbiAgICBldmFsdWF0ZSA9IHZhbHVlLmdldDtcclxuICB9XHJcbiAgaWYoZXZhbHVhdGUpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUob2JqKXtcclxuICAgICAgc2VsZi4kdXBkYXRlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSBvYmo7XHJcbiAgICAgICAgdmFyIHJlcyA9IGV2YWx1YXRlKHNlbGYpO1xyXG4gICAgICAgIGlmKHJlcyA9PT0gZmFsc2UgJiYgb2JqICYmIG9iai5wcmV2ZW50RGVmYXVsdCkgb2JqLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUoKXtcclxuICAgICAgdmFyIGFyZ3MgPSBfLnNsaWNlKGFyZ3VtZW50cyk7XHJcbiAgICAgIGFyZ3MudW5zaGlmdCh2YWx1ZSk7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHNlbGYuJGVtaXQuYXBwbHkoc2VsZiwgYXJncyk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvbmx5IGNhbGwgb25jZVxyXG5fLm9uY2UgPSBmdW5jdGlvbihmbil7XHJcbiAgdmFyIHRpbWUgPSAwO1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgaWYoIHRpbWUrKyA9PT0gMCkgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcbn1cclxuXHJcbl8uZml4T2JqU3RyID0gZnVuY3Rpb24oc3RyKXtcclxuICBpZihzdHIudHJpbSgpLmluZGV4T2YoJ3snKSAhPT0gMCl7XHJcbiAgICByZXR1cm4gJ3snICsgc3RyICsgJ30nO1xyXG4gIH1cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG5cclxuXy5tYXA9IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjayl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgcmVzLnB1c2goY2FsbGJhY2soYXJyYXlbaV0sIGkpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gbG9nKG1zZywgdHlwZSl7XHJcbiAgaWYodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpICBjb25zb2xlW3R5cGUgfHwgXCJsb2dcIl0obXNnKTtcclxufVxyXG5cclxuXy5sb2cgPSBsb2c7XHJcblxyXG5cclxuXy5ub3JtTGlzdGVuZXIgPSBmdW5jdGlvbiggZXZlbnRzICApe1xyXG4gICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW107XHJcbiAgICB2YXIgcFR5cGUgPSBfLnR5cGVPZiggZXZlbnRzICk7XHJcbiAgICBpZiggcFR5cGUgPT09ICdhcnJheScgKXtcclxuICAgICAgcmV0dXJuIGV2ZW50cztcclxuICAgIH1lbHNlIGlmICggcFR5cGUgPT09ICdvYmplY3QnICl7XHJcbiAgICAgIGZvciggdmFyIGkgaW4gZXZlbnRzICkgaWYgKCBldmVudHMuaGFzT3duUHJvcGVydHkoaSkgKXtcclxuICAgICAgICBldmVudExpc3RlbmVycy5wdXNoKHtcclxuICAgICAgICAgIHR5cGU6IGksXHJcbiAgICAgICAgICBsaXN0ZW5lcjogZXZlbnRzW2ldXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV2ZW50TGlzdGVuZXJzO1xyXG59XHJcblxyXG5cclxuLy9odHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9zaW5nbGUtcGFnZS5odG1sI3ZvaWQtZWxlbWVudHNcclxuXy5pc1ZvaWRUYWcgPSBfLm1ha2VQcmVkaWNhdGUoXCJhcmVhIGJhc2UgYnIgY29sIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZW51aXRlbSBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnIgci1jb250ZW50XCIpO1xyXG5fLmlzQm9vbGVhbkF0dHIgPSBfLm1ha2VQcmVkaWNhdGUoJ3NlbGVjdGVkIGNoZWNrZWQgZGlzYWJsZWQgcmVhZG9ubHkgcmVxdWlyZWQgb3BlbiBhdXRvZm9jdXMgY29udHJvbHMgYXV0b3BsYXkgY29tcGFjdCBsb29wIGRlZmVyIG11bHRpcGxlJyk7XHJcblxyXG5cclxuXy5pc0V4cHIgPSBmdW5jdGlvbihleHByKXtcclxuICByZXR1cm4gZXhwciAmJiBleHByLnR5cGUgPT09ICdleHByZXNzaW9uJztcclxufVxyXG4vLyBAVE9ETzogbWFrZSBpdCBtb3JlIHN0cmljdFxyXG5fLmlzR3JvdXAgPSBmdW5jdGlvbihncm91cCl7XHJcbiAgcmV0dXJuIGdyb3VwLmluamVjdCB8fCBncm91cC4kaW5qZWN0O1xyXG59XHJcblxyXG5fLmdldENvbXBpbGVGbiA9IGZ1bmN0aW9uKHNvdXJjZSwgY3R4LCBvcHRpb25zKXtcclxuICByZXR1cm4gY3R4LiRjb21waWxlLmJpbmQoY3R4LHNvdXJjZSwgb3B0aW9ucylcclxufVxyXG5cclxuLy8gcmVtb3ZlIGRpcmVjdGl2ZSBwYXJhbSBmcm9tIEFTVFxyXG5fLmZpeFRhZ0FTVCA9IGZ1bmN0aW9uKCB0YWdBU1QsIENvbXBvbmVudCApe1xyXG5cclxuICBpZiggdGFnQVNULnRvdWNoZWQgKSByZXR1cm47XHJcblxyXG4gIHZhciBhdHRycyA9IHRhZ0FTVC5hdHRycztcclxuXHJcbiAgaWYoICFhdHRycyApIHJldHVybjtcclxuXHJcbiAgLy8gTWF5YmUgbXVsdGlwbGUgZGlyZWN0aXZlIG5lZWQgc2FtZSBwYXJhbSwgXHJcbiAgLy8gV2UgcGxhY2UgYWxsIHBhcmFtIGluIHRvdGFsUGFyYW1NYXBcclxuICB2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xyXG4gIGlmKCFsZW4pIHJldHVybjtcclxuICB2YXIgZGlyZWN0aXZlcz1bXSwgb3RoZXJBdHRyTWFwID0ge307XHJcbiAgZm9yKDtsZW4tLTspe1xyXG5cclxuICAgIHZhciBhdHRyID0gYXR0cnNbIGxlbiBdO1xyXG5cclxuXHJcbiAgICAvLyBASUUgZml4IElFOS0gaW5wdXQgdHlwZSBjYW4ndCBhc3NpZ24gYWZ0ZXIgdmFsdWVcclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ3R5cGUnKSBhdHRyLnByaW9yaXR5ID0gTUFYX1BSSU9SSVRZKzE7XHJcblxyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IENvbXBvbmVudC5kaXJlY3RpdmUoIGF0dHIubmFtZSApO1xyXG4gICAgaWYoIGRpcmVjdGl2ZSApIHtcclxuXHJcbiAgICAgIGF0dHIucHJpb3JpdHkgPSBkaXJlY3RpdmUucHJpb3JpdHkgfHwgMTtcclxuICAgICAgYXR0ci5kaXJlY3RpdmUgPSB0cnVlO1xyXG4gICAgICBkaXJlY3RpdmVzLnB1c2goYXR0cik7XHJcblxyXG4gICAgfWVsc2UgaWYoYXR0ci50eXBlID09PSAnYXR0cmlidXRlJyl7XHJcbiAgICAgIG90aGVyQXR0ck1hcFthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaCggZnVuY3Rpb24oIGF0dHIgKXtcclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKGF0dHIubmFtZSk7XHJcbiAgICB2YXIgcGFyYW0gPSBkaXJlY3RpdmUucGFyYW07XHJcbiAgICBpZihwYXJhbSAmJiBwYXJhbS5sZW5ndGgpe1xyXG4gICAgICBhdHRyLnBhcmFtID0ge307XHJcbiAgICAgIHBhcmFtLmZvckVhY2goZnVuY3Rpb24oIG5hbWUgKXtcclxuICAgICAgICBpZiggbmFtZSBpbiBvdGhlckF0dHJNYXAgKXtcclxuICAgICAgICAgIGF0dHIucGFyYW1bbmFtZV0gPSBvdGhlckF0dHJNYXBbbmFtZV0gPT09IHVuZGVmaW5lZD8gdHJ1ZTogb3RoZXJBdHRyTWFwW25hbWVdXHJcbiAgICAgICAgICBfLnJlbW92ZU9uZShhdHRycywgZnVuY3Rpb24oYXR0cil7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyLm5hbWUgPT09IG5hbWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhdHRycy5zb3J0KGZ1bmN0aW9uKGExLCBhMil7XHJcbiAgICBcclxuICAgIHZhciBwMSA9IGExLnByaW9yaXR5O1xyXG4gICAgdmFyIHAyID0gYTIucHJpb3JpdHk7XHJcblxyXG4gICAgaWYoIHAxID09IG51bGwgKSBwMSA9IE1BWF9QUklPUklUWTtcclxuICAgIGlmKCBwMiA9PSBudWxsICkgcDIgPSBNQVhfUFJJT1JJVFk7XHJcblxyXG4gICAgcmV0dXJuIHAyIC0gcDE7XHJcblxyXG4gIH0pXHJcblxyXG4gIHRhZ0FTVC50b3VjaGVkID0gdHJ1ZTtcclxufVxyXG5cclxuXy5maW5kSXRlbSA9IGZ1bmN0aW9uKGxpc3QsIGZpbHRlcil7XHJcbiAgaWYoIWxpc3QgfHwgIWxpc3QubGVuZ3RoKSByZXR1cm47XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIHdoaWxlKGxlbi0tKXtcclxuICAgIGlmKGZpbHRlcihsaXN0W2xlbl0pKSByZXR1cm4gbGlzdFtsZW5dXHJcbiAgfVxyXG59XHJcblxyXG5fLmdldFBhcmFtT2JqID0gZnVuY3Rpb24oY29tcG9uZW50LCBwYXJhbSl7XHJcbiAgdmFyIHBhcmFtT2JqID0ge307XHJcbiAgaWYocGFyYW0pIHtcclxuICAgIGZvcih2YXIgaSBpbiBwYXJhbSkgaWYocGFyYW0uaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbVtpXTtcclxuICAgICAgcGFyYW1PYmpbaV0gPSAgdmFsdWUgJiYgdmFsdWUudHlwZT09PSdleHByZXNzaW9uJz8gY29tcG9uZW50LiRnZXQodmFsdWUpOiB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHBhcmFtT2JqO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ0JFR0lOJzogJ3snLFxyXG4gICdFTkQnOiAnfScsXHJcbiAgJ1BSRUNPTVBJTEUnOiBmYWxzZVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsImZ1bmN0aW9uIFRleHROb2RlKHRleHQpe1xyXG4gICAgdGhpcy5fdmFsdWUgPSB0ZXh0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHROb2RlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vVGV4dE5vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNTowNTowMSBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNCAyMzozMzozNFxyXG4gKi9cclxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uLy9wYXJzZXIvc3JjL1BhcnNlci5qcycpO1xyXG5cclxuaWYoIXRoaXMuZG9jdW1lbnQpe1xyXG4gICAgLyplc2xpbnQtZGlzYWJsZSovXHJcbiAgICBkb2N1bWVudCA9IHJlcXVpcmUoJy4uL3Zkb20vRG9jdW1lbnQuanMnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQmFzZVJlbmRlclN0b3JlKG9iail7XHJcblxyXG4gICAgdGhpcy5fYmVmb3JlQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9jb25maWdNb2RlbChvYmopO1xyXG4gICAgdGhpcy5fYWZ0ZXJDb25maWcoKTtcclxuICAgIHRoaXMuX3BhcnNlKCk7XHJcbn1cclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2JlZm9yZUNvbmZpZyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9hZnRlckNvbmZpZyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZyh0aGlzLmRhdGEpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fY29uZmlnTW9kZWwgPSBmdW5jdGlvbihtb2RlbCl7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG1vZGVsKTtcclxuXHJcbiAgICBpZighbW9kZWwuZGF0YSkgdGhpcy5kYXRhID0ge307XHJcbiAgICB0aGlzLl9saXN0ID0ge307XHJcbiAgICB0aGlzLiRsaXN0ID0ge307XHJcbiAgICB0aGlzLiRyZWZzID0ge307XHJcblxyXG4gICAgdGhpcy5fZGVmaW5lciA9IG1vZGVsO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fY29tcGlsZSA9IGZ1bmN0aW9uKGFzdCwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGN1ckluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpe1xyXG4gICAgaWYoYXN0IGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZCh0aGlzLl9jb21waWxlKGFzdFtpXSwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGksIHJvb3RQYXRoLCBsaXN0TmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21waWxlclthc3QudHlwZV0oYXN0LCB0aGlzLCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgY3VySW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9wYXJzZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLkFTVCA9IG5ldyBQYXJzZXIodGhpcy50ZW1wbGF0ZSkucGFyc2UoKTtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKCl7fTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3NnXyA9IGZ1bmN0aW9uIChwYXRoLCBkYXRhKSB7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYgKHBhdGggaW5zdGFuY2VvZiBFdmVudCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHBhdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IGRhdGFbcGF0aF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNlUmVuZGVyU3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RvcmUvQmFzZVJlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vdXRpbC5qc1wiKTtcclxuXHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzXCIpO1xyXG52YXIgbm9kZSA9IHJlcXVpcmUoXCIuL25vZGUuanNcIik7XHJcbnZhciBMZXhlciA9IHJlcXVpcmUoXCIuL0xleGVyLmpzXCIpO1xyXG52YXIgdmFyTmFtZSA9IF8udmFyTmFtZTtcclxudmFyIGN0eE5hbWUgPSBfLmN0eE5hbWU7XHJcbnZhciBleHROYW1lID0gXy5leHROYW1lO1xyXG52YXIgaXNQYXRoID0gXy5tYWtlUHJlZGljYXRlKFwiU1RSSU5HIElERU5UIE5VTUJFUlwiKTtcclxudmFyIGlzS2V5V29yZCA9IF8ubWFrZVByZWRpY2F0ZShcInRydWUgZmFsc2UgdW5kZWZpbmVkIG51bGwgdGhpcyBBcnJheSBEYXRlIEpTT04gTWF0aCBOYU4gUmVnRXhwIGRlY29kZVVSSSBkZWNvZGVVUklDb21wb25lbnQgZW5jb2RlVVJJIGVuY29kZVVSSUNvbXBvbmVudCBwYXJzZUZsb2F0IHBhcnNlSW50IE9iamVjdFwiKTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIFBhcnNlcihpbnB1dCwgb3B0cyl7XHJcbiAgb3B0cyA9IG9wdHMgfHwge307XHJcblxyXG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICB0aGlzLnRva2VucyA9IG5ldyBMZXhlcihpbnB1dCwgb3B0cykubGV4KCk7XHJcbiAgdGhpcy5wb3MgPSAwO1xyXG4gIHRoaXMubGVuZ3RoID0gdGhpcy50b2tlbnMubGVuZ3RoO1xyXG59XHJcblxyXG5cclxudmFyIG9wID0gUGFyc2VyLnByb3RvdHlwZTtcclxuXHJcblxyXG5vcC5wYXJzZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5wb3MgPSAwO1xyXG4gIHZhciByZXM9IHRoaXMucHJvZ3JhbSgpO1xyXG4gIGlmKHRoaXMubGwoKS50eXBlID09PSAnVEFHX0NMT1NFJyl7XHJcbiAgICB0aGlzLmVycm9yKFwiWW91IG1heSBnb3QgYSB1bmNsb3NlZCBUYWdcIilcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxub3AubGwgPSAgZnVuY3Rpb24oayl7XHJcbiAgayA9IGsgfHwgMTtcclxuICBpZihrIDwgMCkgayA9IGsgKyAxO1xyXG4gIHZhciBwb3MgPSB0aGlzLnBvcyArIGsgLSAxO1xyXG4gIGlmKHBvcyA+IHRoaXMubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmxlbmd0aC0xXTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3Bvc107XHJcbn1cclxuICAvLyBsb29rYWhlYWRcclxub3AubGEgPSBmdW5jdGlvbihrKXtcclxuICByZXR1cm4gKHRoaXMubGwoaykgfHwgJycpLnR5cGU7XHJcbn1cclxuXHJcbm9wLm1hdGNoID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbDtcclxuICBpZighKGxsID0gdGhpcy5lYXQodHlwZSwgdmFsdWUpKSl7XHJcbiAgICBsbCAgPSB0aGlzLmxsKCk7XHJcbiAgICB0aGlzLmVycm9yKCdleHBlY3QgWycgKyB0eXBlICsgKHZhbHVlID09IG51bGw/ICcnOic6JysgdmFsdWUpICsgJ11cIiAtPiBnb3QgXCJbJyArIGxsLnR5cGUgKyAodmFsdWU9PW51bGw/ICcnOic6JytsbC52YWx1ZSkgKyAnXScsIGxsLnBvcylcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBsbDtcclxuICB9XHJcbn1cclxuXHJcbm9wLmVycm9yID0gZnVuY3Rpb24obXNnLCBwb3Mpe1xyXG4gIG1zZyA9ICBcIlxcbuOAkCBwYXJzZSBmYWlsZWQg44CRIFwiICsgbXNnICsgICc6XFxuXFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0eXBlb2YgcG9zID09PSAnbnVtYmVyJz8gcG9zOiB0aGlzLmxsKCkucG9zfHwwKTtcclxuICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcclxufVxyXG5cclxub3AubmV4dCA9IGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgdGhpcy5wb3MgKz0gaztcclxufVxyXG5vcC5lYXQgPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIGlmKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJyl7XHJcbiAgICBmb3IodmFyIGxlbiA9IHR5cGUubGVuZ3RoIDsgbGVuLS07KXtcclxuICAgICAgaWYobGwudHlwZSA9PT0gdHlwZVtsZW5dKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIGxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbGwudHlwZSA9PT0gdHlwZSAmJiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBsbC52YWx1ZSA9PT0gdmFsdWUpICl7XHJcbiAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgIHJldHVybiBsbDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vLyBwcm9ncmFtXHJcbi8vICA6RU9GXHJcbi8vICB8IChzdGF0ZW1lbnQpKiBFT0Zcclxub3AucHJvZ3JhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlbWVudHMgPSBbXSwgIGxsID0gdGhpcy5sbCgpO1xyXG4gIHdoaWxlKGxsLnR5cGUgIT09ICdFT0YnICYmIGxsLnR5cGUgIT09J1RBR19DTE9TRScpe1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLnN0YXRlbWVudCgpKTtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gIH1cclxuICAvLyBpZihsbC50eXBlID09PSAnVEFHX0NMT1NFJykgdGhpcy5lcnJvcihcIllvdSBtYXkgaGF2ZSB1bm1hdGNoZWQgVGFnXCIpXHJcbiAgcmV0dXJuIHN0YXRlbWVudHM7XHJcbn1cclxuXHJcbi8vIHN0YXRlbWVudFxyXG4vLyAgOiB4bWxcclxuLy8gIHwganN0XHJcbi8vICB8IHRleHRcclxub3Auc3RhdGVtZW50ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSAnTkFNRSc6XHJcbiAgICBjYXNlICdURVhUJzpcclxuICAgICAgdmFyIHRleHQgPSBsbC52YWx1ZTtcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHdoaWxlKGxsID0gdGhpcy5lYXQoWydOQU1FJywgJ1RFWFQnXSkpe1xyXG4gICAgICAgIHRleHQgKz0gbGwudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5vZGUudGV4dCh0ZXh0KTtcclxuICAgIGNhc2UgJ1RBR19PUEVOJzpcclxuICAgICAgcmV0dXJuIHRoaXMueG1sKCk7XHJcbiAgICBjYXNlICdPUEVOJzogXHJcbiAgICAgIHJldHVybiB0aGlzLmRpcmVjdGl2ZSgpO1xyXG4gICAgY2FzZSAnRVhQUl9PUEVOJzpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHRva2VuOiAnKyB0aGlzLmxhKCkpXHJcbiAgfVxyXG59XHJcblxyXG4vLyB4bWwgXHJcbi8vIHN0YWcgc3RhdGVtZW50KiBUQUdfQ0xPU0U/KGlmIHNlbGYtY2xvc2VkIHRhZylcclxub3AueG1sID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbmFtZSwgYXR0cnMsIGNoaWxkcmVuLCBzZWxmQ2xvc2VkO1xyXG4gIG5hbWUgPSB0aGlzLm1hdGNoKCdUQUdfT1BFTicpLnZhbHVlO1xyXG4gIGF0dHJzID0gdGhpcy5hdHRycygpO1xyXG4gIHNlbGZDbG9zZWQgPSB0aGlzLmVhdCgnLycpXHJcbiAgdGhpcy5tYXRjaCgnPicpO1xyXG4gIGlmKCAhc2VsZkNsb3NlZCAmJiAhXy5pc1ZvaWRUYWcobmFtZSkgKXtcclxuICAgIGNoaWxkcmVuID0gdGhpcy5wcm9ncmFtKCk7XHJcbiAgICBpZighdGhpcy5lYXQoJ1RBR19DTE9TRScsIG5hbWUpKSB0aGlzLmVycm9yKCdleHBlY3QgPC8nK25hbWUrJz4gZ290JysgJ25vIG1hdGNoZWQgY2xvc2VUYWcnKVxyXG4gIH1cclxuICByZXR1cm4gbm9kZS5lbGVtZW50KG5hbWUsIGF0dHJzLCBjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8vIHhlbnRpdHlcclxuLy8gIC1ydWxlKHdyYXAgYXR0cmlidXRlKVxyXG4vLyAgLWF0dHJpYnV0ZVxyXG4vL1xyXG4vLyBfX2V4YW1wbGVfX1xyXG4vLyAgbmFtZSA9IDEgfCAgXHJcbi8vICBuZy1oaWRlIHxcclxuLy8gIG9uLWNsaWNrPXt7fX0gfCBcclxuLy8gIHt7I2lmIG5hbWV9fW9uLWNsaWNrPXt7eHh9fXt7I2Vsc2V9fW9uLXRhcD17e319e3svaWZ9fVxyXG5cclxub3AueGVudGl0eSA9IGZ1bmN0aW9uKGxsKXtcclxuICB2YXIgbmFtZSA9IGxsLnZhbHVlLCB2YWx1ZSwgbW9kaWZpZXI7XHJcbiAgaWYobGwudHlwZSA9PT0gJ05BTUUnKXtcclxuICAgIC8vQCBvbmx5IGZvciB0ZXN0XHJcbiAgICBpZih+bmFtZS5pbmRleE9mKCcuJykpe1xyXG4gICAgICB2YXIgdG1wID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICBuYW1lID0gdG1wWzBdO1xyXG4gICAgICBtb2RpZmllciA9IHRtcFsxXVxyXG5cclxuICAgIH1cclxuICAgIGlmKCB0aGlzLmVhdChcIj1cIikgKSB2YWx1ZSA9IHRoaXMuYXR0dmFsdWUobW9kaWZpZXIpO1xyXG4gICAgcmV0dXJuIG5vZGUuYXR0cmlidXRlKCBuYW1lLCB2YWx1ZSwgbW9kaWZpZXIgKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCBuYW1lICE9PSAnaWYnKSB0aGlzLmVycm9yKFwiY3VycmVudCB2ZXJzaW9uLiBPTkxZIFJVTEUgI2lmICNlbHNlICNlbHNlaWYgaXMgdmFsaWQgaW4gdGFnLCB0aGUgcnVsZSAjXCIgKyBuYW1lICsgJyBpcyBpbnZhbGlkJyk7XHJcbiAgICByZXR1cm4gdGhpc1snaWYnXSh0cnVlKTtcclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBzdGFnICAgICA6Oj0gICAgJzwnIE5hbWUgKFMgYXR0cikqIFM/ICc+JyAgXHJcbi8vIGF0dHIgICAgOjo9ICAgICBOYW1lIEVxIGF0dHZhbHVlXHJcbm9wLmF0dHJzID0gZnVuY3Rpb24oaXNBdHRyaWJ1dGUpe1xyXG4gIHZhciBlYXRcclxuICBpZighaXNBdHRyaWJ1dGUpe1xyXG4gICAgZWF0ID0gW1wiTkFNRVwiLCBcIk9QRU5cIl1cclxuICB9ZWxzZXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIl1cclxuICB9XHJcblxyXG4gIHZhciBhdHRycyA9IFtdLCBsbDtcclxuICB3aGlsZSAobGwgPSB0aGlzLmVhdChlYXQpKXtcclxuICAgIGF0dHJzLnB1c2godGhpcy54ZW50aXR5KCBsbCApKVxyXG4gIH1cclxuICByZXR1cm4gYXR0cnM7XHJcbn1cclxuXHJcbi8vIGF0dHZhbHVlXHJcbi8vICA6IFNUUklORyAgXHJcbi8vICB8IE5BTUVcclxub3AuYXR0dmFsdWUgPSBmdW5jdGlvbihtZGYpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwiTkFNRVwiOlxyXG4gICAgY2FzZSBcIlVOUVwiOlxyXG4gICAgY2FzZSBcIlNUUklOR1wiOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgdmFyIHZhbHVlID0gbGwudmFsdWU7XHJcbiAgICAgIGlmKH52YWx1ZS5pbmRleE9mKGNvbmZpZy5CRUdJTikgJiYgfnZhbHVlLmluZGV4T2YoY29uZmlnLkVORCkgJiYgbWRmIT09J2NtcGwnKXtcclxuICAgICAgICB2YXIgY29uc3RhbnQgPSB0cnVlO1xyXG4gICAgICAgIHZhciBwYXJzZWQgPSBuZXcgUGFyc2VyKHZhbHVlLCB7IG1vZGU6IDIgfSkucGFyc2UoKTtcclxuICAgICAgICBpZihwYXJzZWQubGVuZ3RoID09PSAxICYmIHBhcnNlZFswXS50eXBlID09PSAnZXhwcmVzc2lvbicpIHJldHVybiBwYXJzZWRbMF07XHJcbiAgICAgICAgdmFyIGJvZHkgPSBbXTtcclxuICAgICAgICBwYXJzZWQuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgIGlmKCFpdGVtLmNvbnN0YW50KSBjb25zdGFudD1mYWxzZTtcclxuICAgICAgICAgIC8vIHNpbGVudCB0aGUgbXV0aXBsZSBpbnRlcGxhdGlvblxyXG4gICAgICAgICAgICBib2R5LnB1c2goaXRlbS5ib2R5IHx8IFwiJ1wiICsgaXRlbS50ZXh0LnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKSArIFwiJ1wiKTsgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJvZHkgPSBcIltcIiArIGJvZHkuam9pbihcIixcIikgKyBcIl0uam9pbignJylcIjtcclxuICAgICAgICB2YWx1ZSA9IG5vZGUuZXhwcmVzc2lvbihib2R5LCBudWxsLCBjb25zdGFudCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgY2FzZSBcIkVYUFJfT1BFTlwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcclxuICAgIC8vIGNhc2UgXCJPUEVOXCI6XHJcbiAgICAvLyAgIGlmKGxsLnZhbHVlID09PSAnaW5jJyB8fCBsbC52YWx1ZSA9PT0gJ2luY2x1ZGUnKXtcclxuICAgIC8vICAgICB0aGlzLm5leHQoKTtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5pbmMoKTtcclxuICAgIC8vICAgfWVsc2V7XHJcbiAgICAvLyAgICAgdGhpcy5lcnJvcignYXR0cmlidXRlIHZhbHVlIG9ubHkgc3VwcG9ydCBpbnRlcGxhdGlvbiBhbmQgeyNpbmN9IHN0YXRlbWVudCcpXHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHRva2VuOiAnKyB0aGlzLmxhKCkpXHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8ge3sjfX1cclxub3AuZGlyZWN0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbmFtZSA9IHRoaXMubGwoKS52YWx1ZTtcclxuICB0aGlzLm5leHQoKTtcclxuICBpZih0eXBlb2YgdGhpc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICByZXR1cm4gdGhpc1tuYW1lXSgpXHJcbiAgfWVsc2V7XHJcbiAgICB0aGlzLmVycm9yKCdVbmRlZmluZWQgZGlyZWN0aXZlWycrIG5hbWUgKyddJyk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8ge3t9fVxyXG5vcC5pbnRlcnBsYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMubWF0Y2goJ0VYUFJfT1BFTicpO1xyXG4gIHZhciByZXMgPSB0aGlzLmV4cHJlc3Npb24odHJ1ZSk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLy8ge3t+fX1cclxub3AuaW5jID0gb3AuaW5jbHVkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvbnRlbnQgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICByZXR1cm4gbm9kZS50ZW1wbGF0ZShjb250ZW50KTtcclxufVxyXG5cclxuLy8ge3sjaWZ9fVxyXG5vcFtcImlmXCJdID0gZnVuY3Rpb24odGFnKXtcclxuICB2YXIgdGVzdCA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gIHZhciBjb25zZXF1ZW50ID0gW10sIGFsdGVybmF0ZT1bXTtcclxuXHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcbiAgdmFyIHN0YXRlbWVudCA9ICF0YWc/IFwic3RhdGVtZW50XCIgOiBcImF0dHJzXCI7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG5cclxuICB2YXIgbGwsIGNsb3NlO1xyXG4gIHdoaWxlKCAhIChjbG9zZSA9IHRoaXMuZWF0KCdDTE9TRScpKSApe1xyXG4gICAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgICBpZiggbGwudHlwZSA9PT0gJ09QRU4nICl7XHJcbiAgICAgIHN3aXRjaCggbGwudmFsdWUgKXtcclxuICAgICAgICBjYXNlICdlbHNlJzpcclxuICAgICAgICAgIGNvbnRhaW5lciA9IGFsdGVybmF0ZTtcclxuICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgdGhpcy5tYXRjaCggJ0VORCcgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Vsc2VpZic6XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIGFsdGVybmF0ZS5wdXNoKCB0aGlzW1wiaWZcIl0odGFnKSApO1xyXG4gICAgICAgICAgcmV0dXJuIG5vZGVbJ2lmJ10oIHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSApO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjb250YWluZXIucHVzaCggdGhpc1tzdGF0ZW1lbnRdKHRydWUpICk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBjb250YWluZXIucHVzaCh0aGlzW3N0YXRlbWVudF0odHJ1ZSkpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBpZiBzdGF0ZW1lbnQgbm90IG1hdGNoZWRcclxuICBpZihjbG9zZS52YWx1ZSAhPT0gXCJpZlwiKSB0aGlzLmVycm9yKCdVbm1hdGNoZWQgaWYgZGlyZWN0aXZlJylcclxuICByZXR1cm4gbm9kZVtcImlmXCJdKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XHJcbn1cclxuXHJcblxyXG4vLyBAbWFyayAgIG11c3RhY2hlIHN5bnRheCBoYXZlIG5hdHJ1cmUgZGlzLCBjYW5vdCB3aXRoIGV4cHJlc3Npb25cclxuLy8ge3sjbGlzdH19XHJcbm9wLmxpc3QgPSBmdW5jdGlvbigpe1xyXG4gIC8vIHNlcXVlbmNlIGNhbiBiZSBhIGxpc3Qgb3IgaGFzaFxyXG4gIHZhciBzZXF1ZW5jZSA9IHRoaXMuZXhwcmVzc2lvbigpLCB2YXJpYWJsZSwgbGwsIHRyYWNrO1xyXG4gIHZhciBjb25zZXF1ZW50ID0gW10sIGFsdGVybmF0ZT1bXTtcclxuICB2YXIgY29udGFpbmVyID0gY29uc2VxdWVudDtcclxuXHJcbiAgdGhpcy5tYXRjaCgnSURFTlQnLCAnYXMnKTtcclxuXHJcbiAgdmFyaWFibGUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG5cclxuICBpZih0aGlzLmVhdCgnSURFTlQnLCAnYnknKSl7XHJcbiAgICBpZih0aGlzLmVhdCgnSURFTlQnLHZhcmlhYmxlICsgJ19pbmRleCcpKXtcclxuICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRyYWNrID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICAgIGlmKHRyYWNrLmNvbnN0YW50KXtcclxuICAgICAgICAvLyB0cnVlIGlzIG1lYW5zIGNvbnN0YW50LCB3ZSBoYW5kbGUgaXQganVzdCBsaWtlIHh4eF9pbmRleC5cclxuICAgICAgICB0cmFjayA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG5cclxuICB3aGlsZSggIShsbCA9IHRoaXMuZWF0KCdDTE9TRScpKSApe1xyXG4gICAgaWYodGhpcy5lYXQoJ09QRU4nLCAnZWxzZScpKXtcclxuICAgICAgY29udGFpbmVyID0gIGFsdGVybmF0ZTtcclxuICAgICAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGlmKGxsLnZhbHVlICE9PSAnbGlzdCcpIHRoaXMuZXJyb3IoJ2V4cGVjdCAnICsgJ2xpc3QgZ290ICcgKyAnLycgKyBsbC52YWx1ZSArICcgJywgbGwucG9zICk7XHJcbiAgcmV0dXJuIG5vZGUubGlzdChzZXF1ZW5jZSwgdmFyaWFibGUsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSwgdHJhY2spO1xyXG59XHJcblxyXG5cclxub3AuZXhwcmVzc2lvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGV4cHJlc3Npb247XHJcbiAgaWYodGhpcy5lYXQoJ0AoJykpeyAvL29uY2UgYmluZFxyXG4gICAgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcigpO1xyXG4gICAgZXhwcmVzc2lvbi5vbmNlID0gdHJ1ZTtcclxuICAgIHRoaXMubWF0Y2goJyknKVxyXG4gIH1lbHNle1xyXG4gICAgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcigpO1xyXG4gIH1cclxuICByZXR1cm4gZXhwcmVzc2lvbjtcclxufVxyXG5cclxub3AuZXhwciA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5kZXBlbmQgPSBbXTtcclxuXHJcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuZmlsdGVyKClcclxuXHJcbiAgdmFyIGJvZHkgPSBidWZmZXIuZ2V0IHx8IGJ1ZmZlcjtcclxuICB2YXIgc2V0Ym9keSA9IGJ1ZmZlci5zZXQ7XHJcbiAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbihib2R5LCBzZXRib2R5LCAhdGhpcy5kZXBlbmQubGVuZ3RoLCBidWZmZXIuZmlsdGVycyk7XHJcbn1cclxuXHJcblxyXG4vLyBmaWx0ZXJcclxuLy8gYXNzaWduICgnfCcgZmlsdGVybmFtZVsnOicgYXJnc10pICogXHJcbm9wLmZpbHRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFzc2lnbigpO1xyXG4gIHZhciBsbCA9IHRoaXMuZWF0KCd8Jyk7XHJcbiAgdmFyIGJ1ZmZlciA9IFtdLCBmaWx0ZXJzLHNldEJ1ZmZlciwgcHJlZml4LFxyXG4gICAgYXR0ciA9IFwidFwiLCBcclxuICAgIHNldCA9IGxlZnQuc2V0LCBnZXQsIFxyXG4gICAgdG1wID0gXCJcIjtcclxuXHJcbiAgaWYobGwpe1xyXG4gICAgaWYoc2V0KSB7XHJcbiAgICAgIHNldEJ1ZmZlciA9IFtdO1xyXG4gICAgICBmaWx0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJlZml4ID0gXCIoZnVuY3Rpb24oXCIgKyBhdHRyICsgXCIpe1wiO1xyXG5cclxuICAgIGRve1xyXG4gICAgICB2YXIgZmlsdGVyTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgIHRtcCA9IGF0dHIgKyBcIiA9IFwiICsgY3R4TmFtZSArIFwiLl9mXygnXCIgKyBmaWx0ZXJOYW1lICsgXCInICkuZ2V0LmNhbGwoIFwiK18uY3R4TmFtZSArXCIsXCIgKyBhdHRyIDtcclxuICAgICAgaWYodGhpcy5lYXQoJzonKSl7XHJcbiAgICAgICAgdG1wICs9XCIsIFwiKyB0aGlzLmFyZ3VtZW50cyhcInxcIikuam9pbihcIixcIikgKyBcIik7XCJcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdG1wICs9ICcpOydcclxuICAgICAgfVxyXG4gICAgICBidWZmZXIucHVzaCh0bXApO1xyXG4gICAgICBcclxuICAgICAgaWYoc2V0KXtcclxuICAgICAgICAvLyBvbmx5IGluIHJ1bnRpbWUgLHdlIGNhbiBkZXRlY3QgIHdoZXRoZXIgIHRoZSBmaWx0ZXIgaGFzIGEgc2V0IGZ1bmN0aW9uLiBcclxuICAgICAgICBmaWx0ZXJzLnB1c2goZmlsdGVyTmFtZSk7XHJcbiAgICAgICAgc2V0QnVmZmVyLnVuc2hpZnQoIHRtcC5yZXBsYWNlKFwiICkuZ2V0LmNhbGxcIiwgXCIgKS5zZXQuY2FsbFwiKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgfXdoaWxlKGxsID0gdGhpcy5lYXQoJ3wnKSk7XHJcbiAgICBidWZmZXIucHVzaChcInJldHVybiBcIiArIGF0dHIgKTtcclxuICAgIHNldEJ1ZmZlciAmJiBzZXRCdWZmZXIucHVzaChcInJldHVybiBcIiArIGF0dHIpO1xyXG5cclxuICAgIGdldCA9ICBwcmVmaXggKyBidWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIrbGVmdC5nZXQrXCIpXCI7XHJcbiAgICAvLyB3ZSBjYWxsIGJhY2sgdG8gdmFsdWUuXHJcbiAgICBpZihzZXRCdWZmZXIpe1xyXG4gICAgICAvLyBjaGFuZ2UgX3NzX18obmFtZSwgX3BfKSB0byBfc19fKG5hbWUsIGZpbHRlckZuKF9wXykpO1xyXG4gICAgICBzZXQgPSBzZXQucmVwbGFjZShfLnNldE5hbWUsIFxyXG4gICAgICAgIHByZWZpeCArIHNldEJ1ZmZlci5qb2luKFwiXCIpICsgXCJ9KShcIivjgIBfLnNldE5hbWXjgIArXCIpXCIgKTtcclxuXHJcbiAgICB9XHJcbiAgICAvLyB0aGUgc2V0IGZ1bmN0aW9uIGlzIGRlcGVuZCBvbiB0aGUgZmlsdGVyIGRlZmluaXRpb24uIGlmIGl0IGhhdmUgc2V0IG1ldGhvZCwgdGhlIHNldCB3aWxsIHdvcmtcclxuICAgIHZhciByZXQgPSBnZXRzZXQoZ2V0LCBzZXQpO1xyXG4gICAgcmV0LmZpbHRlcnMgPSBmaWx0ZXJzO1xyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbi8vIGFzc2lnblxyXG4vLyBsZWZ0LWhhbmQtZXhwciA9IGNvbmRpdGlvblxyXG5vcC5hc3NpZ24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5jb25kaXRpb24oKSwgbGw7XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJz0nLCAnKz0nLCAnLT0nLCAnKj0nLCAnLz0nLCAnJT0nXSkpe1xyXG4gICAgaWYoIWxlZnQuc2V0KSB0aGlzLmVycm9yKCdpbnZhbGlkIGxlZnRoYW5kIGV4cHJlc3Npb24gaW4gYXNzaWdubWVudCBleHByZXNzaW9uJyk7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCBsZWZ0LnNldC5yZXBsYWNlKCBcIixcIiArIF8uc2V0TmFtZSwgXCIsXCIgKyB0aGlzLmNvbmRpdGlvbigpLmdldCApLnJlcGxhY2UoXCInPSdcIiwgXCInXCIrbGwudHlwZStcIidcIiksIGxlZnQuc2V0KTtcclxuICAgIC8vIHJldHVybiBnZXRzZXQoJygnICsgbGVmdC5nZXQgKyBsbC50eXBlICArIHRoaXMuY29uZGl0aW9uKCkuZ2V0ICsgJyknLCBsZWZ0LnNldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBvclxyXG4vLyBvciA/IGFzc2lnbiA6IGFzc2lnblxyXG5vcC5jb25kaXRpb24gPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgdGVzdCA9IHRoaXMub3IoKTtcclxuICBpZih0aGlzLmVhdCgnPycpKXtcclxuICAgIHJldHVybiBnZXRzZXQoW3Rlc3QuZ2V0ICsgXCI/XCIsIFxyXG4gICAgICB0aGlzLmFzc2lnbigpLmdldCwgXHJcbiAgICAgIHRoaXMubWF0Y2goXCI6XCIpLnR5cGUsIFxyXG4gICAgICB0aGlzLmFzc2lnbigpLmdldF0uam9pbihcIlwiKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGVzdDtcclxufVxyXG5cclxuLy8gYW5kXHJcbi8vIGFuZCAmJiBvclxyXG5vcC5vciA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBsZWZ0ID0gdGhpcy5hbmQoKTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ3x8Jykpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArICd8fCcgKyB0aGlzLm9yKCkuZ2V0KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcbi8vIGVxdWFsXHJcbi8vIGVxdWFsICYmIGFuZFxyXG5vcC5hbmQgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuZXF1YWwoKTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJyYmJykpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArICcmJicgKyB0aGlzLmFuZCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcbi8vIHJlbGF0aW9uXHJcbi8vIFxyXG4vLyBlcXVhbCA9PSByZWxhdGlvblxyXG4vLyBlcXVhbCAhPSByZWxhdGlvblxyXG4vLyBlcXVhbCA9PT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT09IHJlbGF0aW9uXHJcbm9wLmVxdWFsID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMucmVsYXRpb24oKSwgbGw7XHJcbiAgLy8gQHBlcmY7XHJcbiAgaWYoIGxsID0gdGhpcy5lYXQoWyc9PScsJyE9JywgJz09PScsICchPT0nXSkpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnR5cGUgKyB0aGlzLmVxdWFsKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyByZWxhdGlvbiA8IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID4gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPD0gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPj0gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gaW4gYWRkaXRpdmVcclxub3AucmVsYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hZGRpdGl2ZSgpLCBsbDtcclxuICAvLyBAcGVyZlxyXG4gIGlmKGxsID0gKHRoaXMuZWF0KFsnPCcsICc+JywgJz49JywgJzw9J10pIHx8IHRoaXMuZWF0KCdJREVOVCcsICdpbicpICkpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5yZWxhdGlvbigpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gYWRkaXRpdmUgOlxyXG4vLyBtdWx0aXZlXHJcbi8vIGFkZGl0aXZlICsgbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSAtIG11bHRpdmVcclxub3AuYWRkaXRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5tdWx0aXZlKCkgLGxsO1xyXG4gIGlmKGxsPSB0aGlzLmVhdChbJysnLCctJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudmFsdWUgKyB0aGlzLmFkZGl0aXZlKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyBtdWx0aXZlIDpcclxuLy8gdW5hcnlcclxuLy8gbXVsdGl2ZSAqIHVuYXJ5XHJcbi8vIG11bHRpdmUgLyB1bmFyeVxyXG4vLyBtdWx0aXZlICUgdW5hcnlcclxub3AubXVsdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJhbmdlKCkgLGxsO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnKicsICcvJyAsJyUnXSkgKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5tdWx0aXZlKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbm9wLnJhbmdlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMudW5hcnkoKSwgbGwsIHJpZ2h0O1xyXG5cclxuICBpZihsbCA9IHRoaXMuZWF0KCcuLicpKXtcclxuICAgIHJpZ2h0ID0gdGhpcy51bmFyeSgpO1xyXG4gICAgdmFyIGJvZHkgPSBcclxuICAgICAgXCIoZnVuY3Rpb24oc3RhcnQsZW5kKXt2YXIgcmVzID0gW10sc3RlcD1lbmQ+c3RhcnQ/MTotMTsgZm9yKHZhciBpID0gc3RhcnQ7IGVuZD5zdGFydD9pIDw9IGVuZDogaT49ZW5kOyBpPWkrc3RlcCl7cmVzLnB1c2goaSk7IH0gcmV0dXJuIHJlcyB9KShcIitsZWZ0LmdldCtcIixcIityaWdodC5nZXQrXCIpXCJcclxuICAgIHJldHVybiBnZXRzZXQoYm9keSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuXHJcblxyXG4vLyBsZWZ0aGFuZFxyXG4vLyArIHVuYXJ5XHJcbi8vIC0gdW5hcnlcclxuLy8gfiB1bmFyeVxyXG4vLyAhIHVuYXJ5XHJcbm9wLnVuYXJ5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGw7XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJysnLCctJywnficsICchJ10pKXtcclxuICAgIHJldHVybiBnZXRzZXQoJygnICsgbGwudHlwZSArIHRoaXMudW5hcnkoKS5nZXQgKyAnKScpIDtcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiB0aGlzLm1lbWJlcigpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBjYWxsW2xlZnRoYW5kXSA6XHJcbi8vIG1lbWJlciBhcmdzXHJcbi8vIG1lbWJlciBbIGV4cHJlc3Npb24gXVxyXG4vLyBtZW1iZXIgLiBpZGVudCAgXHJcblxyXG5vcC5tZW1iZXIgPSBmdW5jdGlvbihiYXNlLCBsYXN0LCBwYXRoZXMsIHByZXZCYXNlKXtcclxuICB2YXIgbGwsIHBhdGgsIGV4dFZhbHVlO1xyXG5cclxuXHJcbiAgdmFyIG9ubHlTaW1wbGVBY2Nlc3NvciA9IGZhbHNlO1xyXG4gIGlmKCFiYXNlKXsgLy9maXJzdFxyXG4gICAgcGF0aCA9IHRoaXMucHJpbWFyeSgpO1xyXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgcGF0aDtcclxuICAgIGlmKHR5cGUgPT09ICdzdHJpbmcnKXsgXHJcbiAgICAgIHBhdGhlcyA9IFtdO1xyXG4gICAgICBwYXRoZXMucHVzaCggcGF0aCApO1xyXG4gICAgICBsYXN0ID0gcGF0aDtcclxuICAgICAgZXh0VmFsdWUgPSBleHROYW1lICsgXCIuXCIgKyBwYXRoXHJcbiAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXygnXCIgKyBwYXRoICsgXCInLCBcIiArIHZhck5hbWUgKyBcIiwgXCIgKyBleHROYW1lICsgXCIpXCI7XHJcbiAgICAgIG9ubHlTaW1wbGVBY2Nlc3NvciA9IHRydWU7XHJcbiAgICB9ZWxzZXsgLy9QcmltYXRpdmUgVHlwZVxyXG4gICAgICBpZihwYXRoLmdldCA9PT0gJ3RoaXMnKXtcclxuICAgICAgICBiYXNlID0gY3R4TmFtZTtcclxuICAgICAgICBwYXRoZXMgPSBbJ3RoaXMnXTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcGF0aGVzID0gbnVsbDtcclxuICAgICAgICBiYXNlID0gcGF0aC5nZXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ZWxzZXsgLy8gbm90IGZpcnN0IGVudGVyXHJcbiAgICBpZih0eXBlb2YgbGFzdCA9PT0gJ3N0cmluZycgJiYgaXNQYXRoKCBsYXN0KSApeyAvLyBpcyB2YWxpZCBwYXRoXHJcbiAgICAgIHBhdGhlcy5wdXNoKGxhc3QpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGlmKHBhdGhlcyAmJiBwYXRoZXMubGVuZ3RoKSB0aGlzLmRlcGVuZC5wdXNoKHBhdGhlcyk7XHJcbiAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKGxsID0gdGhpcy5lYXQoWydbJywgJy4nLCAnKCddKSl7XHJcbiAgICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICAgIGNhc2UgJy4nOlxyXG4gICAgICAgICAgLy8gbWVtYmVyKG9iamVjdCwgcHJvcGVydHksIGNvbXB1dGVkKVxyXG4gICAgICAgIHZhciB0bXBOYW1lID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuICAgICAgICBwcmV2QmFzZSA9IGJhc2U7XHJcbiAgICAgICAgaWYoIHRoaXMubGEoKSAhPT0gXCIoXCIgKXsgXHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgdG1wTmFtZSArIFwiJywgXCIgKyBiYXNlICsgXCIpXCI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiYXNlICs9IFwiWydcIiArIHRtcE5hbWUgKyBcIiddXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlciggYmFzZSwgdG1wTmFtZSwgcGF0aGVzLCAgcHJldkJhc2UpO1xyXG4gICAgICBjYXNlICdbJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICBwYXRoID0gdGhpcy5hc3NpZ24oKTtcclxuICAgICAgICBwcmV2QmFzZSA9IGJhc2U7XHJcbiAgICAgICAgaWYoIHRoaXMubGEoKSAhPT0gXCIoXCIgKXsgXHJcbiAgICAgICAgLy8gbWVhbnMgZnVuY3Rpb24gY2FsbCwgd2UgbmVlZCB0aHJvdyB1bmRlZmluZWQgZXJyb3Igd2hlbiBjYWxsIGZ1bmN0aW9uXHJcbiAgICAgICAgLy8gYW5kIGNvbmZpcm0gdGhhdCB0aGUgZnVuY3Rpb24gY2FsbCB3b250IGxvc2UgaXRzIGNvbnRleHRcclxuICAgICAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXyhcIiArIHBhdGguZ2V0ICsgXCIsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIltcIiArIHBhdGguZ2V0ICsgXCJdXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWF0Y2goJ10nKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcihiYXNlLCBwYXRoLCBwYXRoZXMsIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnKCc6XHJcbiAgICAgICAgLy8gY2FsbChjYWxsZWUsIGFyZ3MpXHJcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cygpLmpvaW4oJywnKTtcclxuICAgICAgICBiYXNlID0gIGJhc2UrXCIoXCIgKyBhcmdzICtcIilcIjtcclxuICAgICAgICB0aGlzLm1hdGNoKCcpJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgbnVsbCwgcGF0aGVzKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYoIHBhdGhlcyAmJiBwYXRoZXMubGVuZ3RoICkgdGhpcy5kZXBlbmQucHVzaCggcGF0aGVzICk7XHJcbiAgdmFyIHJlcyA9ICB7Z2V0OiBiYXNlfTtcclxuICBpZihsYXN0KXtcclxuICAgIHJlcy5zZXQgPSBjdHhOYW1lICsgXCIuX3NzXyhcIiArIFxyXG4gICAgICAgIChsYXN0LmdldD8gbGFzdC5nZXQgOiBcIidcIisgbGFzdCArIFwiJ1wiKSArIFxyXG4gICAgICAgIFwiLFwiKyBfLnNldE5hbWUgKyBcIixcIisgXHJcbiAgICAgICAgKHByZXZCYXNlP3ByZXZCYXNlOl8udmFyTmFtZSkgKyBcclxuICAgICAgICBcIiwgJz0nLCBcIisgKCBvbmx5U2ltcGxlQWNjZXNzb3I/IDEgOiAwICkgKyBcIilcIjtcclxuICBcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxub3AuYXJndW1lbnRzID0gZnVuY3Rpb24oZW5kKXtcclxuICBlbmQgPSBlbmQgfHwgJyknXHJcbiAgdmFyIGFyZ3MgPSBbXTtcclxuICBkb3tcclxuICAgIGlmKHRoaXMubGEoKSAhPT0gZW5kKXtcclxuICAgICAgYXJncy5wdXNoKHRoaXMuYXNzaWduKCkuZ2V0KVxyXG4gICAgfVxyXG4gIH13aGlsZSggdGhpcy5lYXQoJywnKSk7XHJcbiAgcmV0dXJuIGFyZ3NcclxufVxyXG5cclxuXHJcbi8vIHByaW1hcnkgOlxyXG4vLyB0aGlzIFxyXG4vLyBpZGVudFxyXG4vLyBsaXRlcmFsXHJcbi8vIGFycmF5XHJcbi8vIG9iamVjdFxyXG4vLyAoIGV4cHJlc3Npb24gKVxyXG5cclxub3AucHJpbWFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgXCJ7XCI6XHJcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xyXG4gICAgY2FzZSBcIltcIjpcclxuICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcclxuICAgIGNhc2UgXCIoXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLnBhcmVuKCk7XHJcbiAgICAvLyBsaXRlcmFsIG9yIGlkZW50XHJcbiAgICBjYXNlICdTVFJJTkcnOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgdmFyIHZhbHVlID0gXCJcIiArIGxsLnZhbHVlO1xyXG4gICAgICB2YXIgcXVvdGEgPSB+dmFsdWUuaW5kZXhPZihcIidcIik/IFwiXFxcIlwiOiBcIidcIiA7XHJcbiAgICAgIHJldHVybiBnZXRzZXQocXVvdGEgKyB2YWx1ZSArIHF1b3RhKTtcclxuICAgIGNhc2UgJ05VTUJFUic6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KCBcIlwiICsgbGwudmFsdWUgKTtcclxuICAgIGNhc2UgXCJJREVOVFwiOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgaWYoaXNLZXlXb3JkKGxsLnZhbHVlKSl7XHJcbiAgICAgICAgcmV0dXJuIGdldHNldCggbGwudmFsdWUgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGwudmFsdWU7XHJcbiAgICBkZWZhdWx0OiBcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCBUb2tlbjogJyArIGxsLnR5cGUpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gb2JqZWN0XHJcbi8vICB7cHJvcEFzc2lnbiBbLCBwcm9wQXNzaWduXSAqIFssXX1cclxuXHJcbi8vIHByb3BBc3NpZ25cclxuLy8gIHByb3AgOiBhc3NpZ25cclxuXHJcbi8vIHByb3BcclxuLy8gIFNUUklOR1xyXG4vLyAgSURFTlRcclxuLy8gIE5VTUJFUlxyXG5cclxub3Aub2JqZWN0ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29kZSA9IFt0aGlzLm1hdGNoKCd7JykudHlwZV07XHJcblxyXG4gIHZhciBsbCA9IHRoaXMuZWF0KCBbJ1NUUklORycsICdJREVOVCcsICdOVU1CRVInXSApO1xyXG4gIHdoaWxlKGxsKXtcclxuICAgIGNvZGUucHVzaChcIidcIiArIGxsLnZhbHVlICsgXCInXCIgKyB0aGlzLm1hdGNoKCc6JykudHlwZSk7XHJcbiAgICB2YXIgZ2V0ID0gdGhpcy5hc3NpZ24oKS5nZXQ7XHJcbiAgICBjb2RlLnB1c2goZ2V0KTtcclxuICAgIGxsID0gbnVsbDtcclxuICAgIGlmKHRoaXMuZWF0KFwiLFwiKSAmJiAobGwgPSB0aGlzLmVhdChbJ1NUUklORycsICdJREVOVCcsICdOVU1CRVInXSkpICkgY29kZS5wdXNoKFwiLFwiKTtcclxuICB9XHJcbiAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ30nKS50eXBlKTtcclxuICByZXR1cm4ge2dldDogY29kZS5qb2luKFwiXCIpfVxyXG59XHJcblxyXG4vLyBhcnJheVxyXG4vLyBbIGFzc2lnblssYXNzaWduXSpdXHJcbm9wLmFycmF5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29kZSA9IFt0aGlzLm1hdGNoKCdbJykudHlwZV0sIGl0ZW07XHJcbiAgaWYoIHRoaXMuZWF0KFwiXVwiKSApe1xyXG5cclxuICAgICBjb2RlLnB1c2goXCJdXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZShpdGVtID0gdGhpcy5hc3NpZ24oKSl7XHJcbiAgICAgIGNvZGUucHVzaChpdGVtLmdldCk7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCcsJykpIGNvZGUucHVzaChcIixcIik7XHJcbiAgICAgIGVsc2UgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBjb2RlLnB1c2godGhpcy5tYXRjaCgnXScpLnR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4ge2dldDogY29kZS5qb2luKFwiXCIpfTtcclxufVxyXG5cclxuLy8gJygnIGV4cHJlc3Npb24gJyknXHJcbm9wLnBhcmVuID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCcoJyk7XHJcbiAgdmFyIHJlcyA9IHRoaXMuZmlsdGVyKClcclxuICByZXMuZ2V0ID0gJygnICsgcmVzLmdldCArICcpJztcclxuICByZXMuc2V0ID0gcmVzLnNldDtcclxuICB0aGlzLm1hdGNoKCcpJyk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0c2V0KGdldCwgc2V0KXtcclxuICByZXR1cm4ge1xyXG4gICAgZ2V0OiBnZXQsXHJcbiAgICBzZXQ6IHNldFxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL1BhcnNlci5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3RpbWVycy1icm93c2VyaWZ5QDIuMC40QHRpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fc2V0aW1tZWRpYXRlQDEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3Byb2Nlc3NAMC4xMS4xMEBwcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gc2hpbSBmb3IgZXM1XHJcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xyXG52YXIgdHN0ciA9ICh7fSkudG9TdHJpbmc7XHJcblxyXG5mdW5jdGlvbiBleHRlbmQobzEsIG8yICl7XHJcbiAgZm9yKHZhciBpIGluIG8yKSBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICBvMVtpXSA9IG8yW2ldXHJcbiAgfVxyXG4gIHJldHVybiBvMjtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuICAvLyBTdHJpbmcgcHJvdG8gO1xyXG4gIGV4dGVuZChTdHJpbmcucHJvdG90eXBlLCB7XHJcbiAgICB0cmltOiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICAvLyBBcnJheSBwcm90bztcclxuICBleHRlbmQoQXJyYXkucHJvdG90eXBlLCB7XHJcbiAgICBpbmRleE9mOiBmdW5jdGlvbihvYmosIGZyb20pe1xyXG4gICAgICBmcm9tID0gZnJvbSB8fCAwO1xyXG4gICAgICBmb3IgKHZhciBpID0gZnJvbSwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHJldHVybiBpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH0sXHJcbiAgICAvLyBwb2x5ZmlsbCBmcm9tIE1ETiBcclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZvckVhY2hcclxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjdHgpe1xyXG4gICAgICB2YXIgayA9IDA7XHJcblxyXG4gICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZyB0aGUgfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cclxuICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7IFxyXG5cclxuICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiApIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCBjYWxsYmFjayArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICAgIHdoaWxlKCBrIDwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIga1ZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoIGsgaW4gTyApIHtcclxuXHJcbiAgICAgICAgICBrVmFsdWUgPSBPWyBrIF07XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2suY2FsbCggY3R4LCBrVmFsdWUsIGssIE8gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaysrO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQGRlcHJlY2F0ZWRcclxuICAgIC8vICB3aWxsIGJlIHJlbW92ZWQgYXQgMC41LjBcclxuICAgIGZpbHRlcjogZnVuY3Rpb24oZnVuLCBjb250ZXh0KXtcclxuXHJcbiAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XHJcbiAgICAgIGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKGkgaW4gdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICB2YXIgdmFsID0gdFtpXTtcclxuICAgICAgICAgIGlmIChmdW4uY2FsbChjb250ZXh0LCB2YWwsIGksIHQpKVxyXG4gICAgICAgICAgICByZXMucHVzaCh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gRnVuY3Rpb24gcHJvdG87XHJcbiAgZXh0ZW5kKEZ1bmN0aW9uLnByb3RvdHlwZSwge1xyXG4gICAgYmluZDogZnVuY3Rpb24oY29udGV4dCl7XHJcbiAgICAgIHZhciBmbiA9IHRoaXM7XHJcbiAgICAgIHZhciBwcmVBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgYXJncyA9IHByZUFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICBcclxuICAvLyBBcnJheVxyXG4gIGV4dGVuZChBcnJheSwge1xyXG4gICAgaXNBcnJheTogZnVuY3Rpb24oYXJyKXtcclxuICAgICAgcmV0dXJuIHRzdHIuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTM1NDA2NC9ob3ctdG8tY29udmVydC1jaGFyYWN0ZXJzLXRvLWh0bWwtZW50aXRpZXMtdXNpbmctcGxhaW4tamF2YXNjcmlwdFxyXG52YXIgZW50aXRpZXMgPSB7XHJcbiAgJ3F1b3QnOjM0LCBcclxuICAnYW1wJzozOCwgXHJcbiAgJ2Fwb3MnOjM5LCBcclxuICAnbHQnOjYwLCBcclxuICAnZ3QnOjYyLCBcclxuICAnbmJzcCc6MTYwLCBcclxuICAnaWV4Y2wnOjE2MSwgXHJcbiAgJ2NlbnQnOjE2MiwgXHJcbiAgJ3BvdW5kJzoxNjMsIFxyXG4gICdjdXJyZW4nOjE2NCwgXHJcbiAgJ3llbic6MTY1LCBcclxuICAnYnJ2YmFyJzoxNjYsIFxyXG4gICdzZWN0JzoxNjcsIFxyXG4gICd1bWwnOjE2OCwgXHJcbiAgJ2NvcHknOjE2OSwgXHJcbiAgJ29yZGYnOjE3MCwgXHJcbiAgJ2xhcXVvJzoxNzEsIFxyXG4gICdub3QnOjE3MiwgXHJcbiAgJ3NoeSc6MTczLCBcclxuICAncmVnJzoxNzQsIFxyXG4gICdtYWNyJzoxNzUsIFxyXG4gICdkZWcnOjE3NiwgXHJcbiAgJ3BsdXNtbic6MTc3LCBcclxuICAnc3VwMic6MTc4LCBcclxuICAnc3VwMyc6MTc5LCBcclxuICAnYWN1dGUnOjE4MCwgXHJcbiAgJ21pY3JvJzoxODEsIFxyXG4gICdwYXJhJzoxODIsIFxyXG4gICdtaWRkb3QnOjE4MywgXHJcbiAgJ2NlZGlsJzoxODQsIFxyXG4gICdzdXAxJzoxODUsIFxyXG4gICdvcmRtJzoxODYsIFxyXG4gICdyYXF1byc6MTg3LCBcclxuICAnZnJhYzE0JzoxODgsIFxyXG4gICdmcmFjMTInOjE4OSwgXHJcbiAgJ2ZyYWMzNCc6MTkwLCBcclxuICAnaXF1ZXN0JzoxOTEsIFxyXG4gICdBZ3JhdmUnOjE5MiwgXHJcbiAgJ0FhY3V0ZSc6MTkzLCBcclxuICAnQWNpcmMnOjE5NCwgXHJcbiAgJ0F0aWxkZSc6MTk1LCBcclxuICAnQXVtbCc6MTk2LCBcclxuICAnQXJpbmcnOjE5NywgXHJcbiAgJ0FFbGlnJzoxOTgsIFxyXG4gICdDY2VkaWwnOjE5OSwgXHJcbiAgJ0VncmF2ZSc6MjAwLCBcclxuICAnRWFjdXRlJzoyMDEsIFxyXG4gICdFY2lyYyc6MjAyLCBcclxuICAnRXVtbCc6MjAzLCBcclxuICAnSWdyYXZlJzoyMDQsIFxyXG4gICdJYWN1dGUnOjIwNSwgXHJcbiAgJ0ljaXJjJzoyMDYsIFxyXG4gICdJdW1sJzoyMDcsIFxyXG4gICdFVEgnOjIwOCwgXHJcbiAgJ050aWxkZSc6MjA5LCBcclxuICAnT2dyYXZlJzoyMTAsIFxyXG4gICdPYWN1dGUnOjIxMSwgXHJcbiAgJ09jaXJjJzoyMTIsIFxyXG4gICdPdGlsZGUnOjIxMywgXHJcbiAgJ091bWwnOjIxNCwgXHJcbiAgJ3RpbWVzJzoyMTUsIFxyXG4gICdPc2xhc2gnOjIxNiwgXHJcbiAgJ1VncmF2ZSc6MjE3LCBcclxuICAnVWFjdXRlJzoyMTgsIFxyXG4gICdVY2lyYyc6MjE5LCBcclxuICAnVXVtbCc6MjIwLCBcclxuICAnWWFjdXRlJzoyMjEsIFxyXG4gICdUSE9STic6MjIyLCBcclxuICAnc3psaWcnOjIyMywgXHJcbiAgJ2FncmF2ZSc6MjI0LCBcclxuICAnYWFjdXRlJzoyMjUsIFxyXG4gICdhY2lyYyc6MjI2LCBcclxuICAnYXRpbGRlJzoyMjcsIFxyXG4gICdhdW1sJzoyMjgsIFxyXG4gICdhcmluZyc6MjI5LCBcclxuICAnYWVsaWcnOjIzMCwgXHJcbiAgJ2NjZWRpbCc6MjMxLCBcclxuICAnZWdyYXZlJzoyMzIsIFxyXG4gICdlYWN1dGUnOjIzMywgXHJcbiAgJ2VjaXJjJzoyMzQsIFxyXG4gICdldW1sJzoyMzUsIFxyXG4gICdpZ3JhdmUnOjIzNiwgXHJcbiAgJ2lhY3V0ZSc6MjM3LCBcclxuICAnaWNpcmMnOjIzOCwgXHJcbiAgJ2l1bWwnOjIzOSwgXHJcbiAgJ2V0aCc6MjQwLCBcclxuICAnbnRpbGRlJzoyNDEsIFxyXG4gICdvZ3JhdmUnOjI0MiwgXHJcbiAgJ29hY3V0ZSc6MjQzLCBcclxuICAnb2NpcmMnOjI0NCwgXHJcbiAgJ290aWxkZSc6MjQ1LCBcclxuICAnb3VtbCc6MjQ2LCBcclxuICAnZGl2aWRlJzoyNDcsIFxyXG4gICdvc2xhc2gnOjI0OCwgXHJcbiAgJ3VncmF2ZSc6MjQ5LCBcclxuICAndWFjdXRlJzoyNTAsIFxyXG4gICd1Y2lyYyc6MjUxLCBcclxuICAndXVtbCc6MjUyLCBcclxuICAneWFjdXRlJzoyNTMsIFxyXG4gICd0aG9ybic6MjU0LCBcclxuICAneXVtbCc6MjU1LCBcclxuICAnZm5vZic6NDAyLCBcclxuICAnQWxwaGEnOjkxMywgXHJcbiAgJ0JldGEnOjkxNCwgXHJcbiAgJ0dhbW1hJzo5MTUsIFxyXG4gICdEZWx0YSc6OTE2LCBcclxuICAnRXBzaWxvbic6OTE3LCBcclxuICAnWmV0YSc6OTE4LCBcclxuICAnRXRhJzo5MTksIFxyXG4gICdUaGV0YSc6OTIwLCBcclxuICAnSW90YSc6OTIxLCBcclxuICAnS2FwcGEnOjkyMiwgXHJcbiAgJ0xhbWJkYSc6OTIzLCBcclxuICAnTXUnOjkyNCwgXHJcbiAgJ051Jzo5MjUsIFxyXG4gICdYaSc6OTI2LCBcclxuICAnT21pY3Jvbic6OTI3LCBcclxuICAnUGknOjkyOCwgXHJcbiAgJ1Jobyc6OTI5LCBcclxuICAnU2lnbWEnOjkzMSwgXHJcbiAgJ1RhdSc6OTMyLCBcclxuICAnVXBzaWxvbic6OTMzLCBcclxuICAnUGhpJzo5MzQsIFxyXG4gICdDaGknOjkzNSwgXHJcbiAgJ1BzaSc6OTM2LCBcclxuICAnT21lZ2EnOjkzNywgXHJcbiAgJ2FscGhhJzo5NDUsIFxyXG4gICdiZXRhJzo5NDYsIFxyXG4gICdnYW1tYSc6OTQ3LCBcclxuICAnZGVsdGEnOjk0OCwgXHJcbiAgJ2Vwc2lsb24nOjk0OSwgXHJcbiAgJ3pldGEnOjk1MCwgXHJcbiAgJ2V0YSc6OTUxLCBcclxuICAndGhldGEnOjk1MiwgXHJcbiAgJ2lvdGEnOjk1MywgXHJcbiAgJ2thcHBhJzo5NTQsIFxyXG4gICdsYW1iZGEnOjk1NSwgXHJcbiAgJ211Jzo5NTYsIFxyXG4gICdudSc6OTU3LCBcclxuICAneGknOjk1OCwgXHJcbiAgJ29taWNyb24nOjk1OSwgXHJcbiAgJ3BpJzo5NjAsIFxyXG4gICdyaG8nOjk2MSwgXHJcbiAgJ3NpZ21hZic6OTYyLCBcclxuICAnc2lnbWEnOjk2MywgXHJcbiAgJ3RhdSc6OTY0LCBcclxuICAndXBzaWxvbic6OTY1LCBcclxuICAncGhpJzo5NjYsIFxyXG4gICdjaGknOjk2NywgXHJcbiAgJ3BzaSc6OTY4LCBcclxuICAnb21lZ2EnOjk2OSwgXHJcbiAgJ3RoZXRhc3ltJzo5NzcsIFxyXG4gICd1cHNpaCc6OTc4LCBcclxuICAncGl2Jzo5ODIsIFxyXG4gICdidWxsJzo4MjI2LCBcclxuICAnaGVsbGlwJzo4MjMwLCBcclxuICAncHJpbWUnOjgyNDIsIFxyXG4gICdQcmltZSc6ODI0MywgXHJcbiAgJ29saW5lJzo4MjU0LCBcclxuICAnZnJhc2wnOjgyNjAsIFxyXG4gICd3ZWllcnAnOjg0NzIsIFxyXG4gICdpbWFnZSc6ODQ2NSwgXHJcbiAgJ3JlYWwnOjg0NzYsIFxyXG4gICd0cmFkZSc6ODQ4MiwgXHJcbiAgJ2FsZWZzeW0nOjg1MDEsIFxyXG4gICdsYXJyJzo4NTkyLCBcclxuICAndWFycic6ODU5MywgXHJcbiAgJ3JhcnInOjg1OTQsIFxyXG4gICdkYXJyJzo4NTk1LCBcclxuICAnaGFycic6ODU5NiwgXHJcbiAgJ2NyYXJyJzo4NjI5LCBcclxuICAnbEFycic6ODY1NiwgXHJcbiAgJ3VBcnInOjg2NTcsIFxyXG4gICdyQXJyJzo4NjU4LCBcclxuICAnZEFycic6ODY1OSwgXHJcbiAgJ2hBcnInOjg2NjAsIFxyXG4gICdmb3JhbGwnOjg3MDQsIFxyXG4gICdwYXJ0Jzo4NzA2LCBcclxuICAnZXhpc3QnOjg3MDcsIFxyXG4gICdlbXB0eSc6ODcwOSwgXHJcbiAgJ25hYmxhJzo4NzExLCBcclxuICAnaXNpbic6ODcxMiwgXHJcbiAgJ25vdGluJzo4NzEzLCBcclxuICAnbmknOjg3MTUsIFxyXG4gICdwcm9kJzo4NzE5LCBcclxuICAnc3VtJzo4NzIxLCBcclxuICAnbWludXMnOjg3MjIsIFxyXG4gICdsb3dhc3QnOjg3MjcsIFxyXG4gICdyYWRpYyc6ODczMCwgXHJcbiAgJ3Byb3AnOjg3MzMsIFxyXG4gICdpbmZpbic6ODczNCwgXHJcbiAgJ2FuZyc6ODczNiwgXHJcbiAgJ2FuZCc6ODc0MywgXHJcbiAgJ29yJzo4NzQ0LCBcclxuICAnY2FwJzo4NzQ1LCBcclxuICAnY3VwJzo4NzQ2LCBcclxuICAnaW50Jzo4NzQ3LCBcclxuICAndGhlcmU0Jzo4NzU2LCBcclxuICAnc2ltJzo4NzY0LCBcclxuICAnY29uZyc6ODc3MywgXHJcbiAgJ2FzeW1wJzo4Nzc2LCBcclxuICAnbmUnOjg4MDAsIFxyXG4gICdlcXVpdic6ODgwMSwgXHJcbiAgJ2xlJzo4ODA0LCBcclxuICAnZ2UnOjg4MDUsIFxyXG4gICdzdWInOjg4MzQsIFxyXG4gICdzdXAnOjg4MzUsIFxyXG4gICduc3ViJzo4ODM2LCBcclxuICAnc3ViZSc6ODgzOCwgXHJcbiAgJ3N1cGUnOjg4MzksIFxyXG4gICdvcGx1cyc6ODg1MywgXHJcbiAgJ290aW1lcyc6ODg1NSwgXHJcbiAgJ3BlcnAnOjg4NjksIFxyXG4gICdzZG90Jzo4OTAxLCBcclxuICAnbGNlaWwnOjg5NjgsIFxyXG4gICdyY2VpbCc6ODk2OSwgXHJcbiAgJ2xmbG9vcic6ODk3MCwgXHJcbiAgJ3JmbG9vcic6ODk3MSwgXHJcbiAgJ2xhbmcnOjkwMDEsIFxyXG4gICdyYW5nJzo5MDAyLCBcclxuICAnbG96Jzo5Njc0LCBcclxuICAnc3BhZGVzJzo5ODI0LCBcclxuICAnY2x1YnMnOjk4MjcsIFxyXG4gICdoZWFydHMnOjk4MjksIFxyXG4gICdkaWFtcyc6OTgzMCwgXHJcbiAgJ09FbGlnJzozMzgsIFxyXG4gICdvZWxpZyc6MzM5LCBcclxuICAnU2Nhcm9uJzozNTIsIFxyXG4gICdzY2Fyb24nOjM1MywgXHJcbiAgJ1l1bWwnOjM3NiwgXHJcbiAgJ2NpcmMnOjcxMCwgXHJcbiAgJ3RpbGRlJzo3MzIsIFxyXG4gICdlbnNwJzo4MTk0LCBcclxuICAnZW1zcCc6ODE5NSwgXHJcbiAgJ3RoaW5zcCc6ODIwMSwgXHJcbiAgJ3p3bmonOjgyMDQsIFxyXG4gICd6d2onOjgyMDUsIFxyXG4gICdscm0nOjgyMDYsIFxyXG4gICdybG0nOjgyMDcsIFxyXG4gICduZGFzaCc6ODIxMSwgXHJcbiAgJ21kYXNoJzo4MjEyLCBcclxuICAnbHNxdW8nOjgyMTYsIFxyXG4gICdyc3F1byc6ODIxNywgXHJcbiAgJ3NicXVvJzo4MjE4LCBcclxuICAnbGRxdW8nOjgyMjAsIFxyXG4gICdyZHF1byc6ODIyMSwgXHJcbiAgJ2JkcXVvJzo4MjIyLCBcclxuICAnZGFnZ2VyJzo4MjI0LCBcclxuICAnRGFnZ2VyJzo4MjI1LCBcclxuICAncGVybWlsJzo4MjQwLCBcclxuICAnbHNhcXVvJzo4MjQ5LCBcclxuICAncnNhcXVvJzo4MjUwLCBcclxuICAnZXVybyc6ODM2NFxyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzICA9IGVudGl0aWVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9oZWxwZXIvZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZWxlbWVudDogZnVuY3Rpb24obmFtZSwgYXR0cnMsIGNoaWxkcmVuKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdlbGVtZW50JyxcclxuICAgICAgdGFnOiBuYW1lLFxyXG4gICAgICBhdHRyczogYXR0cnMsXHJcbiAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYXR0cmlidXRlOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgbWRmKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIG1kZjogbWRmXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImlmXCI6IGZ1bmN0aW9uKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnaWYnLFxyXG4gICAgICB0ZXN0OiB0ZXN0LFxyXG4gICAgICBjb25zZXF1ZW50OiBjb25zZXF1ZW50LFxyXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbGlzdDogZnVuY3Rpb24oc2VxdWVuY2UsIHZhcmlhYmxlLCBib2R5LCBhbHRlcm5hdGUsIHRyYWNrKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdsaXN0JyxcclxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlLFxyXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZSxcclxuICAgICAgdmFyaWFibGU6IHZhcmlhYmxlLFxyXG4gICAgICBib2R5OiBib2R5LFxyXG4gICAgICB0cmFjazogdHJhY2tcclxuICAgIH1cclxuICB9LFxyXG4gIGV4cHJlc3Npb246IGZ1bmN0aW9uKCBib2R5LCBzZXRib2R5LCBjb25zdGFudCwgZmlsdGVycyApe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJleHByZXNzaW9uXCIsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIGNvbnN0YW50OiBjb25zdGFudCB8fCBmYWxzZSxcclxuICAgICAgc2V0Ym9keTogc2V0Ym9keSB8fCBmYWxzZSxcclxuICAgICAgZmlsdGVyczogZmlsdGVyc1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgdGV4dDogdGV4dFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICd0ZW1wbGF0ZScsXHJcbiAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlXHJcbiAgICB9XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9ub2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzXCIpO1xyXG5cclxuLy8gc29tZSBjdXN0b20gdGFnICB3aWxsIGNvbmZsaWN0IHdpdGggdGhlIExleGVyIHByb2dyZXNzXHJcbnZhciBjb25mbGljdFRhZyA9IHtcIn1cIjogXCJ7XCIsIFwiXVwiOiBcIltcIn0sIG1hcDEsIG1hcDI7XHJcbi8vIHNvbWUgbWFjcm8gZm9yIGxleGVyXHJcbnZhciBtYWNybyA9IHtcclxuICAnTkFNRSc6IC8oPzpbOl9BLVphLXpdWy1cXC46XzAtOUEtWmEtel0qKS8sXHJcbiAgJ0lERU5UJzogL1tcXCRfQS1aYS16XVtfMC05QS1aYS16XFwkXSovLFxyXG4gICdTUEFDRSc6IC9bXFxyXFxuXFx0XFxmIF0vXHJcbn1cclxuXHJcblxyXG52YXIgdGVzdCA9IC9hfChiKS8uZXhlYyhcImFcIik7XHJcbnZhciB0ZXN0U3ViQ2FwdXJlID0gdGVzdCAmJiB0ZXN0WzFdID09PSB1bmRlZmluZWQ/IFxyXG4gIGZ1bmN0aW9uKHN0cil7IHJldHVybiBzdHIgIT09IHVuZGVmaW5lZCB9XHJcbiAgOmZ1bmN0aW9uKHN0cil7cmV0dXJuICEhc3RyfTtcclxuXHJcbmZ1bmN0aW9uIHdyYXBIYW5kZXIoaGFuZGxlcil7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4ge3R5cGU6IGhhbmRsZXIsIHZhbHVlOiBhbGwgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gTGV4ZXIoaW5wdXQsIG9wdHMpe1xyXG4gIGlmKGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdKXtcclxuICAgIHRoaXMubWFya1N0YXJ0ID0gY29uZmxpY3RUYWdbY29uZmlnLkVORF07XHJcbiAgICB0aGlzLm1hcmtFbmQgPSBjb25maWcuRU5EO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pbnB1dCA9IChpbnB1dHx8XCJcIikudHJpbSgpO1xyXG4gIHRoaXMub3B0cyA9IG9wdHMgfHwge307XHJcbiAgdGhpcy5tYXAgPSB0aGlzLm9wdHMubW9kZSAhPT0gMj8gIG1hcDE6IG1hcDI7XHJcbiAgdGhpcy5zdGF0ZXMgPSBbXCJJTklUXCJdO1xyXG4gIGlmKG9wdHMgJiYgb3B0cy5leHByZXNzaW9uKXtcclxuICAgICB0aGlzLnN0YXRlcy5wdXNoKFwiSlNUXCIpO1xyXG4gICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgbG8gPSBMZXhlci5wcm90b3R5cGVcclxuXHJcblxyXG5sby5sZXggPSBmdW5jdGlvbihzdHIpe1xyXG4gIHN0ciA9IChzdHIgfHwgdGhpcy5pbnB1dCkudHJpbSgpO1xyXG4gIHZhciB0b2tlbnMgPSBbXSwgc3BsaXQsIHRlc3QsbWxlbiwgdG9rZW4sIHN0YXRlO1xyXG4gIHRoaXMuaW5wdXQgPSBzdHIsIFxyXG4gIHRoaXMubWFya3MgPSAwO1xyXG4gIC8vIGluaXQgdGhlIHBvcyBpbmRleFxyXG4gIHRoaXMuaW5kZXg9MDtcclxuICB2YXIgaSA9IDA7XHJcbiAgd2hpbGUoc3RyKXtcclxuICAgIGkrK1xyXG4gICAgc3RhdGUgPSB0aGlzLnN0YXRlKCk7XHJcbiAgICBzcGxpdCA9IHRoaXMubWFwW3N0YXRlXSBcclxuICAgIHRlc3QgPSBzcGxpdC5UUlVOSy5leGVjKHN0cik7XHJcbiAgICBpZighdGVzdCl7XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VucmVjb2dpbml6ZWQgVG9rZW4nKTtcclxuICAgIH1cclxuICAgIG1sZW4gPSB0ZXN0WzBdLmxlbmd0aDtcclxuICAgIHN0ciA9IHN0ci5zbGljZShtbGVuKVxyXG4gICAgdG9rZW4gPSB0aGlzLl9wcm9jZXNzLmNhbGwodGhpcywgdGVzdCwgc3BsaXQsIHN0cilcclxuICAgIGlmKHRva2VuKSB0b2tlbnMucHVzaCh0b2tlbilcclxuICAgIHRoaXMuaW5kZXggKz0gbWxlbjtcclxuICAgIC8vIGlmKHN0YXRlID09ICdUQUcnIHx8IHN0YXRlID09ICdKU1QnKSBzdHIgPSB0aGlzLnNraXBzcGFjZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgdG9rZW5zLnB1c2goe3R5cGU6ICdFT0YnfSk7XHJcblxyXG4gIHJldHVybiB0b2tlbnM7XHJcbn1cclxuXHJcbmxvLmVycm9yID0gZnVuY3Rpb24obXNnKXtcclxuICB0aHJvdyAgRXJyb3IoXCJQYXJzZSBFcnJvcjogXCIgKyBtc2cgKyAgJzpcXG4nICsgXy50cmFja0Vycm9yUG9zKHRoaXMuaW5wdXQsIHRoaXMuaW5kZXgpKTtcclxufVxyXG5cclxubG8uX3Byb2Nlc3MgPSBmdW5jdGlvbihhcmdzLCBzcGxpdCxzdHIpe1xyXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3Muam9pbihcIixcIiksIHRoaXMuc3RhdGUoKSlcclxuICB2YXIgbGlua3MgPSBzcGxpdC5saW5rcywgbWFyY2hlZCA9IGZhbHNlLCB0b2tlbjtcclxuXHJcbiAgZm9yKHZhciBsZW4gPSBsaW5rcy5sZW5ndGgsIGk9MDtpPGxlbiA7aSsrKXtcclxuICAgIHZhciBsaW5rID0gbGlua3NbaV0sXHJcbiAgICAgIGhhbmRsZXIgPSBsaW5rWzJdLFxyXG4gICAgICBpbmRleCA9IGxpbmtbMF07XHJcbiAgICAvLyBpZihhcmdzWzZdID09PSAnPicgJiYgaW5kZXggPT09IDYpIGNvbnNvbGUubG9nKCdoYWhhJylcclxuICAgIGlmKHRlc3RTdWJDYXB1cmUoYXJnc1tpbmRleF0pKSB7XHJcbiAgICAgIG1hcmNoZWQgPSB0cnVlO1xyXG4gICAgICBpZihoYW5kbGVyKXtcclxuICAgICAgICB0b2tlbiA9IGhhbmRsZXIuYXBwbHkodGhpcywgYXJncy5zbGljZShpbmRleCwgaW5kZXggKyBsaW5rWzFdKSlcclxuICAgICAgICBpZih0b2tlbikgIHRva2VuLnBvcyA9IHRoaXMuaW5kZXg7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCFtYXJjaGVkKXsgLy8gaW4gaWUgbHQ4IC4gc3ViIGNhcHR1cmUgaXMgXCJcIiBidXQgb250IFxyXG4gICAgc3dpdGNoKHN0ci5jaGFyQXQoMCkpe1xyXG4gICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJUQUdcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5lbnRlcihcIkpTVFwiKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRva2VuO1xyXG59XHJcbmxvLmVudGVyID0gZnVuY3Rpb24oc3RhdGUpe1xyXG4gIHRoaXMuc3RhdGVzLnB1c2goc3RhdGUpXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmxvLnN0YXRlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgcmV0dXJuIHN0YXRlc1tzdGF0ZXMubGVuZ3RoLTFdO1xyXG59XHJcblxyXG5sby5sZWF2ZSA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgaWYoIXN0YXRlIHx8IHN0YXRlc1tzdGF0ZXMubGVuZ3RoLTFdID09PSBzdGF0ZSkgc3RhdGVzLnBvcCgpXHJcbn1cclxuXHJcblxyXG5MZXhlci5zZXR1cCA9IGZ1bmN0aW9uKCl7XHJcbiAgbWFjcm8uRU5EID0gY29uZmlnLkVORDtcclxuICBtYWNyby5CRUdJTiA9IGNvbmZpZy5CRUdJTjtcclxuICAvL1xyXG4gIG1hcDEgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVFxyXG4gICAgcnVsZXMuRU5URVJfSlNULFxyXG4gICAgcnVsZXMuRU5URVJfVEFHLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuXHJcbiAgICAvL1RBR1xyXG4gICAgcnVsZXMuVEFHX05BTUUsXHJcbiAgICBydWxlcy5UQUdfT1BFTixcclxuICAgIHJ1bGVzLlRBR19DTE9TRSxcclxuICAgIHJ1bGVzLlRBR19QVU5DSE9SLFxyXG4gICAgcnVsZXMuVEFHX0VOVEVSX0pTVCxcclxuICAgIHJ1bGVzLlRBR19VTlFfVkFMVUUsXHJcbiAgICBydWxlcy5UQUdfU1RSSU5HLFxyXG4gICAgcnVsZXMuVEFHX1NQQUNFLFxyXG4gICAgcnVsZXMuVEFHX0NPTU1FTlQsXHJcblxyXG4gICAgLy8gSlNUXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5ULFxyXG4gICAgcnVsZXMuSlNUX0VYUFJfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9JREVOVCxcclxuICAgIHJ1bGVzLkpTVF9TUEFDRSxcclxuICAgIHJ1bGVzLkpTVF9MRUFWRSxcclxuICAgIHJ1bGVzLkpTVF9OVU1CRVIsXHJcbiAgICBydWxlcy5KU1RfUFVOQ0hPUixcclxuICAgIHJ1bGVzLkpTVF9TVFJJTkcsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVFxyXG4gICAgXSlcclxuXHJcbiAgLy8gaWdub3JlZCB0aGUgdGFnLXJlbGF0aXZlIHRva2VuXHJcbiAgbWFwMiA9IGdlbk1hcChbXHJcbiAgICAvLyBJTklUIG5vIDwgcmVzdHJpY3RcclxuICAgIHJ1bGVzLkVOVEVSX0pTVDIsXHJcbiAgICBydWxlcy5URVhULFxyXG4gICAgLy8gSlNUXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0NMT1NFLFxyXG4gICAgcnVsZXMuSlNUX0VYUFJfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9JREVOVCxcclxuICAgIHJ1bGVzLkpTVF9TUEFDRSxcclxuICAgIHJ1bGVzLkpTVF9MRUFWRSxcclxuICAgIHJ1bGVzLkpTVF9OVU1CRVIsXHJcbiAgICBydWxlcy5KU1RfUFVOQ0hPUixcclxuICAgIHJ1bGVzLkpTVF9TVFJJTkcsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVFxyXG4gICAgXSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdlbk1hcChydWxlcyl7XHJcbiAgdmFyIHJ1bGUsIG1hcCA9IHt9LCBzaWduO1xyXG4gIGZvcih2YXIgaSA9IDAsIGxlbiA9IHJ1bGVzLmxlbmd0aDsgaSA8IGxlbiA7IGkrKyl7XHJcbiAgICBydWxlID0gcnVsZXNbaV07XHJcbiAgICBzaWduID0gcnVsZVsyXSB8fCAnSU5JVCc7XHJcbiAgICAoIG1hcFtzaWduXSB8fCAobWFwW3NpZ25dID0ge3J1bGVzOltdLCBsaW5rczpbXX0pICkucnVsZXMucHVzaChydWxlKTtcclxuICB9XHJcbiAgcmV0dXJuIHNldHVwKG1hcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwKG1hcCl7XHJcbiAgdmFyIHNwbGl0LCBydWxlcywgdHJ1bmtzLCBoYW5kbGVyLCByZWcsIHJldGFpbiwgcnVsZTtcclxuICBmdW5jdGlvbiByZXBsYWNlRm4oYWxsLCBvbmUpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBtYWNyb1tvbmVdID09PSAnc3RyaW5nJz8gXHJcbiAgICAgIF8uZXNjYXBlUmVnRXhwKG1hY3JvW29uZV0pIFxyXG4gICAgICA6IFN0cmluZyhtYWNyb1tvbmVdKS5zbGljZSgxLC0xKTtcclxuICB9XHJcblxyXG4gIGZvcih2YXIgaSBpbiBtYXApe1xyXG5cclxuICAgIHNwbGl0ID0gbWFwW2ldO1xyXG4gICAgc3BsaXQuY3VySW5kZXggPSAxO1xyXG4gICAgcnVsZXMgPSBzcGxpdC5ydWxlcztcclxuICAgIHRydW5rcyA9IFtdO1xyXG5cclxuICAgIGZvcih2YXIgaiA9IDAsbGVuID0gcnVsZXMubGVuZ3RoOyBqPGxlbjsgaisrKXtcclxuICAgICAgcnVsZSA9IHJ1bGVzW2pdOyBcclxuICAgICAgcmVnID0gcnVsZVswXTtcclxuICAgICAgaGFuZGxlciA9IHJ1bGVbMV07XHJcblxyXG4gICAgICBpZih0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgIGhhbmRsZXIgPSB3cmFwSGFuZGVyKGhhbmRsZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKF8udHlwZU9mKHJlZykgPT09ICdyZWdleHAnKSByZWcgPSByZWcudG9TdHJpbmcoKS5zbGljZSgxLCAtMSk7XHJcblxyXG4gICAgICByZWcgPSByZWcucmVwbGFjZSgvXFx7KFxcdyspXFx9L2csIHJlcGxhY2VGbilcclxuICAgICAgcmV0YWluID0gXy5maW5kU3ViQ2FwdHVyZShyZWcpICsgMTsgXHJcbiAgICAgIHNwbGl0LmxpbmtzLnB1c2goW3NwbGl0LmN1ckluZGV4LCByZXRhaW4sIGhhbmRsZXJdKTsgXHJcbiAgICAgIHNwbGl0LmN1ckluZGV4ICs9IHJldGFpbjtcclxuICAgICAgdHJ1bmtzLnB1c2gocmVnKTtcclxuICAgIH1cclxuICAgIHNwbGl0LlRSVU5LID0gbmV3IFJlZ0V4cChcIl4oPzooXCIgKyB0cnVua3Muam9pbihcIil8KFwiKSArIFwiKSlcIilcclxuICB9XHJcbiAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxudmFyIHJ1bGVzID0ge1xyXG5cclxuICAvLyAxLiBJTklUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8vIG1vZGUxJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBFTlRFUl9KU1Q6IFsvW15cXHgwMDxdKj8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIC8vIG1vZGUyJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBFTlRFUl9KU1QyOiBbL1teXFx4MDBdKj8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIEVOVEVSX1RBRzogWy9bXlxceDAwXSo/KD89PFtcXHdcXC9cXCFdKS8sIGZ1bmN0aW9uKGFsbCl7IFxyXG4gICAgdGhpcy5lbnRlcignVEFHJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBURVhUOiBbL1teXFx4MDBdKy8sICdURVhUJyBdLFxyXG5cclxuICAvLyAyLiBUQUdcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRBR19OQU1FOiBbL3tOQU1FfS8sICdOQU1FJywgJ1RBRyddLFxyXG4gIFRBR19VTlFfVkFMVUU6IFsvW15cXHt9JlwiJz0+PGBcXHJcXG5cXGZcXHQgXSsvLCAnVU5RJywgJ1RBRyddLFxyXG5cclxuICBUQUdfT1BFTjogWy88KHtOQU1FfSlcXHMqLywgZnVuY3Rpb24oYWxsLCBvbmUpeyAvL1wiXHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfT1BFTicsIHZhbHVlOiBvbmV9XHJcbiAgfSwgJ1RBRyddLFxyXG4gIFRBR19DTE9TRTogWy88XFwvKHtOQU1FfSlbXFxyXFxuXFxmXFx0IF0qPi8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICAgIHJldHVybiB7dHlwZTogJ1RBR19DTE9TRScsIHZhbHVlOiBvbmUgfVxyXG4gIH0sICdUQUcnXSxcclxuXHJcbiAgICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgVEFHX0VOVEVSX0pTVDogWy8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICB9LCAnVEFHJ10sXHJcblxyXG5cclxuICBUQUdfUFVOQ0hPUjogWy9bXFw+XFwvPSZdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKGFsbCA9PT0gJz4nKSB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwgJ1RBRyddLFxyXG4gIFRBR19TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVxcXCIvLCAvKicqLyAgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IFxyXG4gICAgdmFyIHZhbHVlID0gb25lIHx8IHR3byB8fCBcIlwiO1xyXG5cclxuICAgIHJldHVybiB7dHlwZTogJ1NUUklORycsIHZhbHVlOiB2YWx1ZX1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gIFRBR19TUEFDRTogWy97U1BBQ0V9Ky8sIG51bGwsICdUQUcnXSxcclxuICBUQUdfQ09NTUVOVDogWy88XFwhLS0oW15cXHgwMF0qPyktLVxcPi8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmxlYXZlKClcclxuICAgIC8vIHRoaXMubGVhdmUoJ1RBRycpXHJcbiAgfSAsJ1RBRyddLFxyXG5cclxuICAvLyAzLiBKU1RcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIEpTVF9PUEVOOiBbJ3tCRUdJTn0je1NQQUNFfSooe0lERU5UfSknLCBmdW5jdGlvbihhbGwsIG5hbWUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ09QRU4nLFxyXG4gICAgICB2YWx1ZTogbmFtZVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTEVBVkU6IFsve0VORH0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgaWYodGhpcy5tYXJrRW5kID09PSBhbGwgJiYgdGhpcy5leHByZXNzaW9uKSByZXR1cm4ge3R5cGU6IHRoaXMubWFya0VuZCwgdmFsdWU6IHRoaXMubWFya0VuZH07XHJcbiAgICBpZighdGhpcy5tYXJrRW5kIHx8ICF0aGlzLm1hcmtzICl7XHJcbiAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubGVhdmUoJ0pTVCcpO1xyXG4gICAgICByZXR1cm4ge3R5cGU6ICdFTkQnfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRoaXMubWFya3MtLTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9XHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9DTE9TRTogWy97QkVHSU59XFxzKlxcLyh7SURFTlR9KVxccyp7RU5EfS8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIHRoaXMubGVhdmUoJ0pTVCcpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ0NMT1NFJyxcclxuICAgICAgdmFsdWU6IG9uZVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ09NTUVOVDogWy97QkVHSU59XFwhKFteXFx4MDBdKj8pXFwhe0VORH0vLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5sZWF2ZSgpO1xyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfRVhQUl9PUEVOOiBbJ3tCRUdJTn0nLGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIGlmKGFsbCA9PT0gdGhpcy5tYXJrU3RhcnQpe1xyXG4gICAgICBpZih0aGlzLmV4cHJlc3Npb24pIHJldHVybiB7IHR5cGU6IHRoaXMubWFya1N0YXJ0LCB2YWx1ZTogdGhpcy5tYXJrU3RhcnQgfTtcclxuICAgICAgaWYodGhpcy5maXJzdEVudGVyU3RhcnQgfHwgdGhpcy5tYXJrcyl7XHJcbiAgICAgICAgdGhpcy5tYXJrcysrXHJcbiAgICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ0VYUFJfT1BFTicsXHJcbiAgICAgIGVzY2FwZTogZmFsc2VcclxuICAgIH1cclxuXHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9JREVOVDogWyd7SURFTlR9JywgJ0lERU5UJywgJ0pTVCddLFxyXG4gIEpTVF9TUEFDRTogWy9bIFxcclxcblxcZl0rLywgbnVsbCwgJ0pTVCddLFxyXG4gIEpTVF9QVU5DSE9SOiBbL1s9IV0/PT18Wy09PjwrKlxcLyVcXCFdP1xcPXxcXHxcXHx8JiZ8XFxAXFwofFxcLlxcLnxbPFxcPlxcW1xcXVxcKFxcKVxcLVxcfFxce31cXCtcXCpcXC8lPzpcXC4hLF0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHsgdHlwZTogYWxsLCB2YWx1ZTogYWxsIH1cclxuICB9LCdKU1QnXSxcclxuXHJcbiAgSlNUX1NUUklORzogIFsgLycoW14nXSopJ3xcIihbXlwiXSopXCIvLCBmdW5jdGlvbihhbGwsIG9uZSwgdHdvKXsgLy9cIidcclxuICAgIHJldHVybiB7dHlwZTogJ1NUUklORycsIHZhbHVlOiBvbmUgfHwgdHdvIHx8IFwiXCJ9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9OVU1CRVI6IFsvKD86WzAtOV0qXFwuWzAtOV0rfFswLTldKykoZVxcZCspPy8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdOVU1CRVInLCB2YWx1ZTogcGFyc2VGbG9hdChhbGwsIDEwKX07XHJcbiAgfSwgJ0pTVCddXHJcbn1cclxuXHJcblxyXG4vLyBzZXR1cCB3aGVuIGZpcnN0IGNvbmZpZ1xyXG5MZXhlci5zZXR1cCgpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExleGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKCcuL0RvY3VtZW50RnJhZ21lbnQuanMnKTtcclxudmFyIEVsZW1lbnQgPSByZXF1aXJlKCcuL0VsZW1lbnQuanMnKTtcclxudmFyIFRleHROb2RlID0gcmVxdWlyZSgnLi9UZXh0Tm9kZS5qcycpO1xyXG5cclxudmFyIHByb3RvID0ge1xyXG4gICAgY3JlYXRlRG9jdW1lbnRGcmFnbWVudDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IGRvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbih0YWdOYW1lKXtcclxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnQodGFnTmFtZSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlVGV4dE5vZGU6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiBuZXcgVGV4dE5vZGUodGV4dCk7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgZG9jID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvYztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RvY3VtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcblxyXG5mdW5jdGlvbiBFbGVtZW50KHRhZ05hbWUpe1xyXG4gICAgdGhpcy5fdGFnTmFtZSA9IHRhZ05hbWU7XHJcbiAgICB0aGlzLl9hdHRycyA9IFtdO1xyXG4gICAgdGhpcy5fZXZlbnRzID0gW107XHJcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbihhdHRyTmFtZSwgYXR0clZhbHVlKXtcclxuICAgIHZhciBldmVudFBhdHRlcm4gPSAvb24tLztcclxuXHJcbiAgICBpZihldmVudFBhdHRlcm4udGVzdChhdHRyTmFtZSkpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLl9hdHRycy5wdXNoKHtuYW1lOiBhdHRyTmFtZSwgdmFsdWU6IGF0dHJWYWx1ZX0pO1xyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgaGFuZGxlciwgaXNQb3AsIGFyZ0NvbnRleHQpe1xyXG4gICAgdGhpcy5fZXZlbnRzLnB1c2goe25hbWU6IGV2ZW50TmFtZS5yZXBsYWNlKC8tLywgJycpLCB2YWx1ZTogaGFuZGxlcisnJywgY29udGV4dDogYXJnQ29udGV4dH0pO1xyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obm9kZSl7XHJcbiAgICAvLyBpZihub2RlIGluc3RhbmNlb2YgZG9jdW1lbnRGcmFnbWVudCl7XHJcbiAgICAvLyAgICAgZm9yKHZhciBpPTA7aTxub2RlLl9jaGlsZHJlbi5sZW5ndGg7aSsrKXtcclxuICAgIC8vICAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlLl9jaGlsZHJlbltpXSk7ICAgICBcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgcmV0dXJuO1xyXG4gICAgLy8gfVxyXG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWxlbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0VsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NTE6NTMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjUgMDc6NDE6MTJcclxuICovXHJcbmZ1bmN0aW9uIE1lc3NhZ2VCdXMoKSB7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIgPSBbXTtcclxuICAgIHRoaXMuX2Jhc2VJZCA9IDA7XHJcbiAgICB0aGlzLl9pbml0V29ya2VyKCk7XHJcbiAgICB0aGlzLl9jcmVhdGVFdmVudHNTdG9yZSgpO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fY3JlYXRlRXZlbnRzU3RvcmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9ldmVudHNTdG9yZSA9IHt9O1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fb25NZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciBJbmZvID0gdGhpcy5fZGVzZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICB0aGlzLl9yZWNlaXZlQnVzUmVzb2x2ZXIoSW5mbyk7XHJcbiAgICB0aGlzLl9lbWl0KEluZm8uaWQsIEluZm8udHlwZSwgSW5mby5kYXRhKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9yZWNlaXZlQnVzUmVzb2x2ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5yZWNlaXZlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHRoaXMuX2J1ZmZlciA9IG1lc3NhZ2U7XHJcbiAgICB0aGlzLl9zZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLmFkZEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50VHlwZSwgZm4pIHtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKGV2ZW50VHlwZSwgZm4uYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZGVzZXJpYWxpemUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdmFyIHR5cGUgPSBtZXNzYWdlLmRhdGEudHlwZSxcclxuICAgICAgICBkYXRhID0gbWVzc2FnZS5kYXRhLmRhdGEsXHJcbiAgICAgICAgaWQgPSBtZXNzYWdlLmRhdGEuaWQsXHJcbiAgICAgICAgbWFtYmFJRCA9IG1lc3NhZ2UuZGF0YS5tYW1iYUlEO1xyXG5cclxuICAgIHJldHVybiB7IG1hbWJhSUQ6IG1hbWJhSUQgLCBpZDogaWQsIHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VuZEluZm9Ub1dvcmtlciA9IGZ1bmN0aW9uIChJbmZvKSB7XHJcbiAgICB2YXIgX29uU2VuZFdvcmtlciA9IHRoaXMuX29uU2VuZFdvcmtlcjtcclxuXHJcbiAgICB0aGlzLl9wb3N0TWVzc2FnZShJbmZvKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoX29uU2VuZFdvcmtlci5sZW5ndGgpIHRoaXMuX2NoZWNrV2F0Y2hlcnMoX29uU2VuZFdvcmtlciwgSW5mbyk7XHJcbiAgICB9LmJpbmQodGhpcyksIDApO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3Bvc3RNZXNzYWdlID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NoZWNrV2F0Y2hlcnMgPSBmdW5jdGlvbiAod2F0Y2hlcnMsIEluZm8pIHtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gd2F0Y2hlcnMubGVuZ3RoIC0gMSwgd2F0Y2hlcjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlcihJbmZvKTtcclxuICAgICAgICB3YXRjaGVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgIHRoaXMuX29uU2VuZFdvcmtlci5wdXNoKGZuKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5fYnVmZmVyO1xyXG4gICAgdGhpcy5fcmVnaXN0ZXIobWVzc2FnZS5pZCwgbWVzc2FnZS50eXBlLCBmbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVnaXN0ZXIgPSBmdW5jdGlvbiAoaWQsIGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZighX2V2ZW50c1N0b3JlW2lkXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbaWRdID0ge307XHJcblxyXG4gICAgaWYgKF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMucHVzaChmbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdID0geyB3YXRjaGVyczogW2ZuXSB9O1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoaWQsIGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgdmFyIF9ldmVudHNTdG9yZSA9IHRoaXMuX2V2ZW50c1N0b3JlO1xyXG5cclxuICAgIGlmIChfZXZlbnRzU3RvcmVbaWRdICYmIF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSAmJiBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGVXYXRjaGVycyhfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMsIGV2ZW50TmFtZSwgZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZXhlY3V0ZVdhdGNoZXJzID0gZnVuY3Rpb24gKHdhdGNoZXJzLCBldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIGZvciAodmFyIGkgPSB3YXRjaGVycy5sZW5ndGggLSAxLCB3YXRjaGVyOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKGV2ZW50TmFtZSwgZGF0YSk7XHJcbiAgICAgICAgd2F0Y2hlcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0OTowMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNSAwNzo0MTo0M1xyXG4gKi9cclxuXHJcbnZhciBNZXNzYWdlQnVzID0gcmVxdWlyZSgnLi9tZXNzYWdlQnVzL1dvcmtlck1zZ0J1cy5qcycpO1xyXG52YXIgV0tSZW5kZXJTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUvV0tSZW5kZXJTdG9yZS5qcycpO1xyXG52YXIgRGlmZmVyID0gcmVxdWlyZSgnLi92ZG9tL0RpZmZlci5qcycpO1xyXG5cclxudmFyIG15TWVzc2FnZUJ1cyA9IG5ldyBNZXNzYWdlQnVzKCk7XHJcblxyXG4vKip2LWRvbVN0b3JlICovXHJcbnZhciBWZG9tU3RvcmUgPSB7fTtcclxuXHJcbi8qKueKtuaAgeaemuS4viAqL1xyXG52YXIgSU5JVElBTF9SRU5ERVIgPSAnSU5JVElBTF9SRU5ERVInO1xyXG52YXIgVVBEQVRFX1JFTkRFUiA9ICdVUERBVEVfUkVOREVSJztcclxudmFyIERJRkZfREVURUNUID0gJ0RJRkZfREVURUNUJztcclxuXHJcbi8qKklOSVRJQUxfUkVOREVSICovXHJcbm15TWVzc2FnZUJ1cy5idWlsZFJlY2VpdmVEaXNwYXRjaGVyKElOSVRJQUxfUkVOREVSLCBmdW5jdGlvbihtZXNzYWdlKXtcclxuICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhLFxyXG4gICAgICAgIG1hbWJhSUQgPSBtZXNzYWdlLm1hbWJhSUQsXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgV0tSZW5kZXJTdG9yZShkYXRhKTtcclxuXHJcbiAgICBzdG9yZS5yZW5kZXIoKTtcclxuICAgIFZkb21TdG9yZVttYW1iYUlEXSA9IHN0b3JlLnZEb207XHJcbiAgICAvL2NvbnNvbGUubG9nKCdXb3JrZXIg5pS25YiwJywgSU5JVElBTF9SRU5ERVIpO1xyXG4gICAgLy9jb25zb2xlLmxvZyhzdG9yZS52RG9tKTtcclxufSk7XHJcblxyXG4vKipVUERBVEVfUkVOREVSICovXHJcbm15TWVzc2FnZUJ1cy5idWlsZFJlY2VpdmVEaXNwYXRjaGVyKFVQREFURV9SRU5ERVIsIGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGEsXHJcbiAgICAgICAgbWFtYmFJRCA9IG1lc3NhZ2UubWFtYmFJRCxcclxuICAgICAgICBzdG9yZSA9IG5ldyBXS1JlbmRlclN0b3JlKGRhdGEpO1xyXG5cclxuICAgIHN0b3JlLnJlbmRlcigpO1xyXG4gICAgLy9jb25zb2xlLmxvZygnV29ya2VyIOaUtuWIsCcsIFVQREFURV9SRU5ERVIpO1xyXG4gICAgVmRvbVN0b3JlW21hbWJhSURdID0gc3RvcmUudkRvbTtcclxufSk7XHJcblxyXG4vKipESUZGX0RFVEVDVCAqL1xyXG5teU1lc3NhZ2VCdXMuYnVpbGRSZWNlaXZlRGlzcGF0Y2hlcihESUZGX0RFVEVDVCwgZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YSxcclxuICAgICAgICBtYW1iYUlEID0gbWVzc2FnZS5tYW1iYUlELFxyXG4gICAgICAgIGlkID0gbWVzc2FnZS5pZCxcclxuICAgICAgICBzdG9yZSA9IG5ldyBXS1JlbmRlclN0b3JlKGRhdGEpO1xyXG5cclxuICAgIHN0b3JlLnJlbmRlcigpO1xyXG4gICAgY29uc29sZS5sb2coJ1dvcmtlciDmlLbliLAnLCBESUZGX0RFVEVDVCk7XHJcbiAgICBjb25zb2xlLmxvZyhWZG9tU3RvcmVbbWFtYmFJRF0sIHN0b3JlLnZEb20pO1xyXG4gICAgdmFyIGRpZmZlcnMgPSBEaWZmZXIoVmRvbVN0b3JlW21hbWJhSURdLCBzdG9yZS52RG9tKTtcclxuICAgIGNvbnNvbGUubG9nKGRpZmZlcnMpO1xyXG4gICAgVmRvbVN0b3JlW21hbWJhSURdID0gc3RvcmUudkRvbTtcclxuICAgIHRoaXMucmVjZWl2ZSh7IHR5cGU6IERJRkZfREVURUNULCBkYXRhOiBkaWZmZXJzLCBpZDogaWQgfSk7XHJcbn0pO1xyXG4vKirmtojmga9Mb2cgKi9cclxubXlNZXNzYWdlQnVzLm9uU2VuZChmdW5jdGlvbigpe1xyXG4gICAgLy9jb25zb2xlLmxvZygnV29ya2VyIOW3suWPkemAge+8micsIG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3drX2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo1MDoyNyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNSAwMDo0MzowMFxyXG4gKi9cclxudmFyIE1lc3NhZ2VCdXMgPSByZXF1aXJlKCcuL01lc3NhZ2VCdXMuanMnKTtcclxudmFyIEV4dGVuZCA9IHJlcXVpcmUoJy4uL3V0aWxzL2V4dGVuZC5qcycpO1xyXG5cclxuZnVuY3Rpb24gV29ya2VyTXNnQnVzKCl7XHJcbiAgICB0aGlzLnN1cGVyKCk7XHJcbiAgICB0aGlzLl9yZWNlaXZlQnVzRGlzcGF0Y2hlciA9IHt9O1xyXG59XHJcblxyXG5FeHRlbmQoV29ya2VyTXNnQnVzLCBNZXNzYWdlQnVzKTtcclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgLyplc2xpbnQtZGlzYWJsZSovXHJcbiAgICBvbm1lc3NhZ2UgPSB0aGlzLl9vbk1lc3NhZ2UuYmluZCh0aGlzKTtcclxufVxyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5fcG9zdE1lc3NhZ2UgPSBmdW5jdGlvbihJbmZvKXtcclxuICAgIC8qZXNsaW50LWRpc2FibGUqL1xyXG4gICAgcG9zdE1lc3NhZ2UoSW5mbyk7XHJcbn1cclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUuYnVpbGRSZWNlaXZlRGlzcGF0Y2hlciA9IGZ1bmN0aW9uKHR5cGUsIGZuKXtcclxuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5fcmVjZWl2ZUJ1c0Rpc3BhdGNoZXI7XHJcbiAgICBcclxuICAgIGRpc3BhdGNoZXJbdHlwZV0gPSBmbjtcclxufVxyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB0aGlzLl9zZW5kSW5mb1RvV29ya2VyKG1lc3NhZ2UpO1xyXG59O1xyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5fcmVjZWl2ZUJ1c1Jlc29sdmVyID0gZnVuY3Rpb24oSW5mbyl7XHJcbiAgICB2YXIgdHlwZSA9IEluZm8udHlwZSxcclxuICAgICAgICBkYXRhID0gSW5mby5kYXRhLFxyXG4gICAgICAgIG1hbWJhSUQgPSBJbmZvLm1hbWJhSUQsXHJcbiAgICAgICAgaWQgPSBJbmZvLmlkLFxyXG4gICAgICAgIGRpc3BhdGNoZXIgPSB0aGlzLl9yZWNlaXZlQnVzRGlzcGF0Y2hlcjtcclxuXHJcbiAgICBpZihkaXNwYXRjaGVyW3R5cGVdKXtcclxuICAgICAgICAvKipfdmRvbVN0b3JlICovXHJcbiAgICAgICAgZGlzcGF0Y2hlclt0eXBlXS5jYWxsKHRoaXMsIHtkYXRhOiBkYXRhLCBtYW1iYUlEOiBtYW1iYUlELCBpZDogaWR9KTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignd29ya2VyIE1lc3NnYWVCdXMgaGF2ZW5cXCd0IHJlZ2lzdGVyZWQgdHlwZTogJyt0eXBlKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLm9uUmVjZWl2ZU1lc3NhZ2UgPSBmdW5jdGlvbihmbil7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtlck1zZ0J1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZXNzYWdlQnVzL1dvcmtlck1zZ0J1cy5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NDg6NDQgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MjE6MjRcclxuICovXHJcblxyXG52YXIgQmFzZVJlbmRlclN0b3JlID0gcmVxdWlyZSgnLi9CYXNlUmVuZGVyU3RvcmUuanMnKTtcclxudmFyIEV4dGVuZCA9IHJlcXVpcmUoJy4uL3V0aWxzL2V4dGVuZC5qcycpO1xyXG52YXIgQ29tcGlsZXIgPSByZXF1aXJlKCcuLi9jb21waWxlci93b3JrZXJUaHJlYWQvY29tcGlsZXIuanMnKTtcclxuXHJcbnZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi4vdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJTdG9yZShvYmopIHtcclxuICAgIHRoaXMuc3VwZXIob2JqKTtcclxuICAgIHRoaXMuZXZlbnRzID0ge307XHJcbiAgICB0aGlzLm5vZGVJZCA9IDA7XHJcbn1cclxuXHJcbkV4dGVuZChSZW5kZXJTdG9yZSwgQmFzZVJlbmRlclN0b3JlKTtcclxuXHJcblJlbmRlclN0b3JlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9jb21waWxlciA9IENvbXBpbGVyO1xyXG4gICAgdGhpcy5fdHlwZWRGbGF0ZXIgPSBSZW5kZXJTdG9yZS50eXBlZEZsYXRlcjtcclxuICAgIHRoaXMudkRvbSA9IHRoaXMuX2NvbXBpbGUodGhpcy5BU1QsIHRoaXMuZGF0YSwgbnVsbCwgMCwgJycpO1xyXG5cclxufTtcclxuXHJcblJlbmRlclN0b3JlLnByb3RvdHlwZS5mbGF0VG9TdHJpbmcgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZmxhdFRvU3RyaW5nKG5vZGVbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuZmxhdE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIHRhZ05hbWUgPSBub2RlLl90YWdOYW1lLFxyXG4gICAgICAgIGF0dHJzID0gbm9kZS5fYXR0cnMsXHJcbiAgICAgICAgZXZlbnRzID0gbm9kZS5fZXZlbnRzLFxyXG4gICAgICAgIGNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW4sXHJcbiAgICAgICAgYm9keSA9ICcnLCBhdHRyU3RyID0gJycsIGV2ZW50U3RyID0gJycsXHJcbiAgICAgICAgbm9kZUlkID0gdGhpcy5ub2RlSWQ7XHJcblxyXG4gICAgLyoq5paH5pys6IqC54K55aSE55CGICovXHJcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5o+S5YWl5a2Q6IqC54K5ICovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9keSArPSB0aGlzLmZsYXROb2RlKGNoaWxkcmVuW2ldKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipmcmFnTWVudCAqL1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq55Sf5oiQ5bGe5oCn5a2X56ym5LiyICovXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgYXR0clN0ciArPSAoYXR0cnNbal0ubmFtZSArICc9XCInICsgYXR0cnNbal0udmFsdWUgKyAnXCIgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu25aSE55CGICovXHJcbiAgICBpZiAoZXZlbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGF0dHJTdHIgKz0gJ2RhdGEtbm9kZWlkPVwiJyArIG5vZGVJZCArICdcIic7XHJcbiAgICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCBldmVudHMubGVuZ3RoOyBoKyspIHtcclxuICAgICAgICAgICAgZXZlbnRzW2hdLnZhbHVlICs9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50c1tub2RlSWRdID0gZXZlbnRzO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlSWQrKztcclxuICAgIHJldHVybiAnPCcgKyB0YWdOYW1lICsgJyAnICsgYXR0clN0ciArIGV2ZW50U3RyICsgJz4nICsgYm9keSArICc8LycgKyB0YWdOYW1lICsgJz4nO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJTdG9yZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9XS1JlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNzoxMjozNiBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNCAyMzo0MzoxOFxyXG4gKi9cclxudmFyIGF0dHJSZXNvbHZlciA9IHJlcXVpcmUoJy4vYXR0clJlc29sdmVyLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBlbGVtZW50KGFzdCwgY29udGV4dCwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGN1ckluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpe1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGFzdC50YWcpO1xyXG5cclxuICAgIHZhciBhdHRycyA9IGFzdC5hdHRycztcclxuICAgIC8qKuWkhOeQhuWxnuaApyAqL1xyXG4gICAgZm9yKHZhciBpPTA7aTxhdHRycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG5cclxuICAgICAgICBpZihhdHRyLm5hbWUgPT09ICdsaXN0JyAmJiBhdHRyLnZhbHVlKXtcclxuICAgICAgICAgICAgbm9kZS5fbGlzdE5hbWUgPSBhdHRyLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoKGF0dHIudHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IFxyXG4gICAgICAgICAgICAgICAgYXR0clJlc29sdmVyKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJvb3RQYXRoID0gcm9vdFBhdGgrJyAnK2N1ckluZGV4O1xyXG4gICAgLyoq5aSE55CG5a2Q6IqC54K5ICovXHJcbiAgICBpZihhc3QuY2hpbGRyZW4pe1xyXG5cclxuICAgICAgICBmb3IodmFyIGo9MCwgbmV4dEluZGV4PTA7ajxhc3QuY2hpbGRyZW4ubGVuZ3RoO2orKywgbmV4dEluZGV4Kyspe1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhc3QuY2hpbGRyZW5bal0sXHJcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBjb250ZXh0Ll9jb21waWxlKGNoaWxkLCBsaXN0SW5mbywgbnVsbCwgbmV4dEluZGV4LCByb290UGF0aCwgbm9kZS5fbGlzdE5hbWUgfHwgbGlzdE5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2hpbGQudHlwZSA9PT0gJ2xpc3QnIHx8IGNoaWxkLnR5cGUgPT09ICdpZicpe1xyXG4gICAgICAgICAgICAgICAgbmV4dEluZGV4ICs9IChjaGlsZE5vZGUuX2xlbmd0aC0xKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoY2hpbGQudHlwZSA9PT0gJ2xpc3QnKXtcclxuICAgICAgICAgICAgICAgIG5vZGUuX2NvbnRhaW5lciA9ICd0cnVlJztcclxuICAgICAgICAgICAgICAgIG5vZGUuX2dldExpc3REYXRhID0gY2hpbGQuc2VxdWVuY2UuYm9keTtcclxuICAgICAgICAgICAgICAgIG5vZGUuX2FzdCA9IGFzdDtcclxuICAgICAgICAgICAgICAgIG5vZGUuX3ZhcmlhYmxlID0gY2hpbGQudmFyaWFibGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNoaWxkTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBub2RlLl9wYXRoID0gcm9vdFBhdGg7XHJcbiAgICBpZihsaXN0TmFtZSkgbm9kZS5fbGlzdE5hbWUgPSBsaXN0TmFtZTtcclxuICAgIFxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRleHQoYXN0LCBjb250ZXh0LCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgY3VySW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSl7XHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFzdC50ZXh0KTtcclxuXHJcbiAgICBub2RlLl9wYXRoID0gKHJvb3RQYXRoKycgJytjdXJJbmRleCk7XHJcbiAgICBpZihsaXN0TmFtZSkgbm9kZS5fbGlzdE5hbWUgPSBsaXN0TmFtZTtcclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwcmVzc2lvbihhc3QsIGNvbnRleHQsIGxpc3RJbmZvLCBsaXN0QnVmZmVyLCBjdXJJbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKXtcclxuICAgIHZhciB0ZXh0ID0gJycsIGdldFZhbHVlO1xyXG4gICAgXHJcbiAgICBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuICgnICsgYXN0LmJvZHkgKyAnKScpO1xyXG4gICAgdGV4dCA9IGdldFZhbHVlKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpO1xyXG5cclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XHJcblxyXG4gICAgbm9kZS5fcGF0aCA9IChyb290UGF0aCsnICcrY3VySW5kZXgpO1xyXG4gICAgaWYobGlzdE5hbWUpIG5vZGUuX2xpc3ROYW1lID0gbGlzdE5hbWU7XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3QoYXN0LCBjb250ZXh0LCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgY3VySW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSl7XHJcbiAgICB2YXIgbGlzdEJvZHkgPSBhc3QuYm9keTtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXN0LnNlcXVlbmNlLmJvZHkrJyknKTtcclxuICAgIHZhciBhcnJheURhdGEgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgIHZhciB2YXJpYWJsZSA9IGFzdC52YXJpYWJsZTtcclxuXHJcbiAgICAvKirorqHnrpfliJfooajmgLvplb/luqYgKi9cclxuICAgIG5vZGUuX2xlbmd0aCA9IGFycmF5RGF0YS5sZW5ndGggKiBsaXN0Qm9keS5sZW5ndGg7XHJcblxyXG4gICAgZm9yKHZhciBqPTA7ajxhcnJheURhdGEubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgbm9kZS5hcHBlbmQoaXRlbU5vZGUobGlzdEJvZHksIGFycmF5RGF0YVtqXSwgaiwgcm9vdFBhdGgsIGxpc3ROYW1lKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXRlbU5vZGUoYm9keSwgaXRlbSwgaW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgdmFyIGxpc3RJbmZvID0ge307XHJcblxyXG4gICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlXSA9IGl0ZW07XHJcbiAgICAgICAgbGlzdEluZm9bdmFyaWFibGUrJ19pbmRleCddID0gaW5kZXg7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxib2R5Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgaXRlbUluZGV4ID0gY3VySW5kZXggKyAoaiphcnJheURhdGEubGVuZ3RoKSArIGk7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoYm9keVtpXSwgbGlzdEluZm8sIG51bGwsIGl0ZW1JbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihsaXN0TmFtZSkgbm9kZS5fbGlzdE5hbWUgPSBsaXN0TmFtZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgICBpZihsaXN0TmFtZSkgbm9kZS5fbGlzdE5hbWUgPSBsaXN0TmFtZTtcclxuXHJcbiAgICBub2RlLl9pc0xpc3RCb2R5ID0gdHJ1ZTtcclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb25kaXRpb24oYXN0LCBjb250ZXh0LCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgY3VySW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSl7XHJcbiAgICB2YXIgdGVzdCA9IGFzdC50ZXN0LCBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gKCcgKyB0ZXN0LmJvZHkgKyAnKScpO1xyXG4gICAgdmFyIGNvbnNlcXVlbnQgPSBhc3QuY29uc2VxdWVudCwgbGVuZ3RoO1xyXG5cclxuICAgIGlmKGdldFZhbHVlKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpKXtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGNvbnNlcXVlbnQubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBjdXJJbmRleCArIGk7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoY29uc2VxdWVudFtpXSwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCBsaXN0QnVmZmVyLCBpdGVtSW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZW5ndGggPSBjb25zZXF1ZW50Lmxlbmd0aDtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGxlbmd0aCA9IDA7XHJcbiAgICB9XHJcbiAgICBub2RlLl9sZW5ndGggPSBsZW5ndGg7XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgJ2VsZW1lbnQnOiBlbGVtZW50LFxyXG4gICAgJ3RleHQnOiB0ZXh0LFxyXG4gICAgJ2V4cHJlc3Npb24nOiBleHByZXNzaW9uLFxyXG4gICAgJ2xpc3QnOiBsaXN0LFxyXG4gICAgJ2lmJzogY29uZGl0aW9uXHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2NvbXBpbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNzoxNDozNyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMzozNDoxNlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyaWJ1dGUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiBhdHRyLnZhbHVlO1xyXG5cclxuICAgIHN3aXRjaCh2YWx1ZVR5cGUpe1xyXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6IFxyXG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpOyBicmVhaztcclxuICAgICAgICBjYXNlICdvYmplY3QnOiBcclxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCByZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKSk7IGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG5cclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ2xpc3QtY29udGFpbmVyJyl7XHJcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2xpc3QtY29udGFpbmVyJywgdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIGlzRXZlbnQgPSBhdHRyLm5hbWUuc2xpY2UoMCwyKSA9PT0gJ29uJztcclxuXHJcbiAgICBpZihpc0V2ZW50KXtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5uYW1lLnNsaWNlKDMpO1xyXG4gICAgICAgIGF0dHIudmFsdWUuYm9keSA9IGF0dHIudmFsdWUuYm9keS5yZXBsYWNlKC8nXFwkZXZlbnQnL2csICckZXZlbnQnKTtcclxuICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuIGZ1bmN0aW9uKCRldmVudCl7cmV0dXJuICcrYXR0ci52YWx1ZS5ib2R5Kyc7fScpO1xyXG5cclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBnZXRIYW5kbGVyKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpLCBmYWxzZSwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhKTtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythdHRyLnZhbHVlLmJvZHkrJyknKTtcclxuICAgICAgICByZXR1cm4gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUF0dHJpYnV0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci93b3JrZXJUaHJlYWQvYXR0clJlc29sdmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgZGlmZiA9IHJlcXVpcmUoJy4uL3V0aWxzL2RpZmYuanMnKTtcclxudmFyIFRleHROb2RlID0gcmVxdWlyZSgnLi9UZXh0Tm9kZS5qcycpO1xyXG4vL3ZhciBDT01QQVJFX0ZJRUxEID0gWydfYXR0cnMnLCAnX2V2ZW50cycsICdfdGFnTmFtZSddO1xyXG52YXIgQUREID0gJ0FERCc7XHJcbnZhciBERUxFVEUgPSAnREVMRVRFJztcclxudmFyIFJFUExBQ0UgPSAnUkVQTEFDRSc7XHJcblxyXG5mdW5jdGlvbiBEaWZmZXIocHJldkRvbSwgY3VyRG9tLCByZXN1bHQpe1xyXG5cclxuICAgIGlmKHR5cGVvZiBwcmV2RG9tID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY3VyRG9tID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLyoq5re75Yqg5pON5L2cICovXHJcbiAgICBpZih0eXBlb2YgcHJldkRvbSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGN1ckRvbSA9PT0gJ29iamVjdCcpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHsgdHlwZTogQURELCBjdXJEb206IGN1ckRvbSwgcHJldkRvbTogcHJldkRvbSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yig6Zmk5pON5L2cICovXHJcbiAgICBpZih0eXBlb2YgY3VyRG9tID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJldkRvbSA9PT0gJ29iamVjdCcpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHsgdHlwZTogREVMRVRFLCBjdXJEb206IGN1ckRvbSwgcHJldkRvbTogcHJldkRvbSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5L+u5pS55pON5L2cICovXHJcbiAgICB2YXIgZGlmZkluZm8gPSB7IHR5cGU6IFJFUExBQ0UsIGN1ckRvbTogY3VyRG9tLCBwcmV2RG9tOiBwcmV2RG9tfTtcclxuXHJcbiAgICAvKipUZXh0IG5vZGUgKi9cclxuICAgIGlmKHByZXZEb20gaW5zdGFuY2VvZiBUZXh0Tm9kZSAmJiBjdXJEb20gaW5zdGFuY2VvZiBUZXh0Tm9kZSl7XHJcbiAgICAgICAgaWYocHJldkRvbS5fdmFsdWUudHJpbSgpICE9PSBjdXJEb20uX3ZhbHVlLnRyaW0oKSl7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRpZmZJbmZvKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9ZWxzZSBpZihwcmV2RG9tIGluc3RhbmNlb2YgVGV4dE5vZGUgfHwgY3VyRG9tIGluc3RhbmNlb2YgVGV4dE5vZGUpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKGRpZmZJbmZvKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5qCH562+5ZCNICovXHJcbiAgICB2YXIgcHJldlRhZ05hbWUgPSBwcmV2RG9tLl90YWdOYW1lLFxyXG4gICAgICAgIGN1clRhZ05hbWUgPSBjdXJEb20uX3RhZ05hbWU7XHJcbiAgICBcclxuICAgIGlmKGRpZmYocHJldlRhZ05hbWUsIGN1clRhZ05hbWUpKXtcclxuICAgICAgICByZXN1bHQucHVzaChkaWZmSW5mbyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuWxnuaAp2RpZmYgKi9cclxuICAgIHZhciBwcmV2QXR0cnMgPSBwcmV2RG9tLl9hdHRycyxcclxuICAgICAgICBjdXJBdHRycyA9IGN1ckRvbS5fYXR0cnM7XHJcblxyXG4gICAgaWYoZGlmZihwcmV2QXR0cnMsIGN1ckF0dHJzKSl7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goZGlmZkluZm8pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvKipjaGlsZHJlbiBkaWZmICovXHJcbiAgICBpZihwcmV2RG9tLl9jaGlsZHJlbiAmJiBjdXJEb20uX2NoaWxkcmVuKXtcclxuICAgICAgICB2YXIgcHJldkNoaWxkcmVuID0gcHJldkRvbS5fY2hpbGRyZW4sXHJcbiAgICAgICAgICAgIGN1ckNoaWxkcmVuID0gY3VyRG9tLl9jaGlsZHJlbixcclxuICAgICAgICAgICAgbWF4TGVuZ3RoID0gcHJldkNoaWxkcmVuLmxlbmd0aCA+IGN1ckNoaWxkcmVuLmxlbmd0aCA/IHByZXZDaGlsZHJlbi5sZW5ndGggOiBjdXJDaGlsZHJlbi5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bWF4TGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBwcmV2Q2hpbGQgPSBwcmV2Q2hpbGRyZW5baV0sXHJcbiAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkcmVuW2ldO1xyXG5cclxuICAgICAgICAgICAgRGlmZmVyKHByZXZDaGlsZCwgY3VyQ2hpbGQsIHJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfWVsc2UgaWYoKHByZXZEb20uX2NoaWxkcmVuICYmICFjdXJEb20uX2NoaWxkcmVuKSB8fCAoIXByZXZEb20uX2NoaWxkcmVuICYmIGN1ckRvbS5fY2hpbGRyZW4pKXtcclxuICAgICAgICByZXN1bHQucHVzaChkaWZmSW5mbyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm47XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1lcmdlRGlmZihkaWZmcyl7XHJcbiAgICB2YXIgbGlzdE1hcCA9IHt9LFxyXG4gICAgICAgIHJlc3VsdCA9IFtdO1xyXG4gICAgZm9yKHZhciBpPTA7aTxkaWZmcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgbGlzdE5hbWUgPSAoZGlmZnNbaV0ucHJldkRvbSAmJiBkaWZmc1tpXS5wcmV2RG9tLl9saXN0TmFtZSkgfHwgKGRpZmZzW2ldLmN1ckRvbSAmJiBkaWZmc1tpXS5jdXJEb20uX2xpc3ROYW1lKSxcclxuICAgICAgICAgICAgaXNDb250YWluZXIgPSAoZGlmZnNbaV0ucHJldkRvbSAmJiBkaWZmc1tpXS5wcmV2RG9tLl9jb250YWluZXIpIHx8IChkaWZmc1tpXS5jdXJEb20gJiYgZGlmZnNbaV0uY3VyRG9tLl9jb250YWluZXIpO1xyXG4gICAgICAgIGlmKGxpc3ROYW1lICYmICFpc0NvbnRhaW5lcil7XHJcbiAgICAgICAgICAgIGlmKCFsaXN0TWFwW2xpc3ROYW1lXSl7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChkaWZmc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBsaXN0TWFwW2xpc3ROYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goZGlmZnNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNvcnREaWZmKGRpZmZzKXtcclxuICAgIGRpZmZzLnNvcnQoZnVuY3Rpb24odmFsMSwgdmFsMil7XHJcbiAgICAgICAgdmFyIHBhdGgxID0gdmFsMS5wcmV2RG9tICYmIHZhbDEucHJldkRvbS5fcGF0aCB8fCB2YWwxLmN1ckRvbS5fcGF0aCxcclxuICAgICAgICAgICAgcGF0aDIgPSB2YWwyLnByZXZEb20gJiYgdmFsMi5wcmV2RG9tLl9wYXRoIHx8IHZhbDIuY3VyRG9tLl9wYXRoLFxyXG4gICAgICAgICAgICBwYXRoMXMgPSBwYXRoMS50cmltKCkuc3BsaXQoJyAnKSxcclxuICAgICAgICAgICAgcGF0aDJzID0gcGF0aDIudHJpbSgpLnNwbGl0KCcgJyksXHJcbiAgICAgICAgICAgIGN1ckluZGV4MSA9IHBhdGgxc1twYXRoMXMubGVuZ3RoLTFdLFxyXG4gICAgICAgICAgICBjdXJJbmRleDIgPSBwYXRoMnNbcGF0aDJzLmxlbmd0aC0xXSxcclxuICAgICAgICAgICAgcm9vdFBhdGgxID0gcGF0aDFzLnNsaWNlKDAsIC0xKS5qb2luKCcgJyksXHJcbiAgICAgICAgICAgIHJvb3RQYXRoMiA9IHBhdGgycy5zbGljZSgwLCAtMSkuam9pbignICcpO1xyXG5cclxuICAgICAgICBpZihyb290UGF0aDEgPT09IHJvb3RQYXRoMil7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJJbmRleDIgLSBjdXJJbmRleDE7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGlmZnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW5EaWZmKHByZXZSb290LCBjdXJSb290KXtcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIERpZmZlcihwcmV2Um9vdC5fY2hpbGRyZW5bMF0sIGN1clJvb3QuX2NoaWxkcmVuWzBdLCByZXN1bHQpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gc29ydERpZmYobWVyZ2VEaWZmKHJlc3VsdCkpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5EaWZmO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRGlmZmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xyXG5cclxuZnVuY3Rpb24gZGlmZihpdGVtMSwgaXRlbTIpe1xyXG4gICAgaWYoIWlzU2FtZVR5cGUoaXRlbTEsIGl0ZW0yKSl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICB2YXIgYm9vbDtcclxuICAgIHN3aXRjaCh0eXBlT2YoaXRlbTEpKXtcclxuICAgICAgICBjYXNlICdBcnJheSc6IFxyXG4gICAgICAgICAgICBib29sID0gZGlmZkFycmF5KGl0ZW0xLCBpdGVtMik7IFxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdPYmplY3QnOlxyXG4gICAgICAgICAgICBib29sID0gZGlmZk9iaihpdGVtMSwgaXRlbTIpOyBcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgYm9vbCA9IGl0ZW0xICE9PSBpdGVtMjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYm9vbDtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlmZk9iaihvYmoxLCBvYmoyKXtcclxuICAgIGlmKG9iajE9PT1vYmoyKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGtleXMxID0gT2JqZWN0LmtleXMob2JqMSksXHJcbiAgICAgICAga2V5czIgPSBPYmplY3Qua2V5cyhvYmoyKTtcclxuXHJcbiAgICAvKirmo4DmtYtrZXnmlbDph48gKi9cclxuICAgIGlmKGtleXMxLmxlbmd0aCAhPT0ga2V5czIubGVuZ3RoKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKirmo4DmtYt2YWx1ZSAqL1xyXG4gICAgZm9yKHZhciBpPTA7aTxrZXlzMS5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgdmFsdWUxID0gb2JqMVtrZXlzMVtpXV0sXHJcbiAgICAgICAgICAgIHZhbHVlMiA9IG9iajJba2V5czFbaV1dO1xyXG5cclxuICAgICAgICBpZighaXNTYW1lVHlwZSh2YWx1ZTEsIHZhbHVlMikpIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICB2YXIgYm9vbDtcclxuICAgICAgICBzd2l0Y2ggKHR5cGVPZih2YWx1ZTEpKXtcclxuICAgICAgICAgICAgY2FzZSAnQXJyYXknOiBcclxuICAgICAgICAgICAgICAgIGJvb2wgPSBkaWZmQXJyYXkodmFsdWUxLCB2YWx1ZTIpOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdPYmplY3QnOlxyXG4gICAgICAgICAgICAgICAgYm9vbCA9IGRpZmZPYmoodmFsdWUxLCB2YWx1ZTIpOyBcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgYm9vbCA9IHZhbHVlMSAhPT0gdmFsdWUyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihib29sKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGlmZkFycmF5KGFycmF5MSwgYXJyYXkyKXtcclxuICAgIGlmKGFycmF5MSA9PT0gYXJyYXkyKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZihhcnJheTEubGVuZ3RoICE9PSBhcnJheTIubGVuZ3RoKXtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGZvcih2YXIgaT0wO2k8YXJyYXkxLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGlmKCFpc1NhbWVUeXBlKGFycmF5MVtpXSwgYXJyYXkyW2ldKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGJvb2w7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlT2YoYXJyYXkxW2ldKSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ0FycmF5JzogXHJcbiAgICAgICAgICAgICAgICBib29sID0gZGlmZkFycmF5KGFycmF5MVtpXSwgYXJyYXkyW2ldKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnT2JqZWN0JzpcclxuICAgICAgICAgICAgICAgIGJvb2wgPSBkaWZmT2JqKGFycmF5MVtpXSwgYXJyYXkyW2ldKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDogXHJcbiAgICAgICAgICAgICAgICBib29sID0gYXJyYXkxW2ldICE9PSBhcnJheTJbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGJvb2wpIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNTYW1lVHlwZShpdGVtMSwgaXRlbTIpe1xyXG4gICAgcmV0dXJuIHR5cGVPZihpdGVtMSkgPT09IHR5cGVPZihpdGVtMik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHR5cGVPZihpdGVtKXtcclxuICAgIFxyXG4gICAgaWYodHlwZW9mIGl0ZW0gIT09ICdvYmplY3QnKXtcclxuICAgICAgICByZXR1cm4gdHlwZW9mIGl0ZW07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdGVtKS5zbGljZSg4LCAtMSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZGlmZjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91dGlscy9kaWZmLmpzXG4vLyBtb2R1bGUgaWQgPSAzNFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwic291cmNlUm9vdCI6IiJ9