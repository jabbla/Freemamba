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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
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
    if(node instanceof documentFragment){
        for(var i=0;i<node._children.length;i++){
            this._children.push(node._children[i]);     
        }
        return;
    }
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:56 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 20:11:31
 */

var Freemamba = __webpack_require__(21);
var MessageBus = __webpack_require__(26);

(function(root){
    if(root.NEJ && NEJ.define){
        NEJ.define([], function(){
            return {
                Freemamba: Freemamba,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(window && window.define){
        window.define([], function(){
            return {
                Freemamba: Freemamba,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(document && document.nodeType){
        window.Freemamba = {
            Freemamba: Freemamba,
            MessageBus: MessageBus
        };
    }

    if(module && module.exports){
        module.exports = {
            Freemamba: Freemamba,
            MessageBus: MessageBus
        };
    }

})(this);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(20)(module)))

/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:21 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 07:42:29
 */

var Extend = __webpack_require__(1);
var BaseRenderStore = __webpack_require__(6);
var Compiler = __webpack_require__(22);
var VdomCompiler = __webpack_require__(25);

/**状态枚举 */
var INITIAL_RENDER = 'INITIAL_RENDER';
var UPDATE_RENDER = 'UPDATE_RENDER';
var DIFF_DETECT = 'DIFF_DETECT';

/**操作类型 */
var REPLACE = 'REPLACE';
var DELETE = 'DELETE';
var ADD = 'ADD';

function Freemamba(config) {
    this.super(config);
    this._compiler = Compiler;
    this._id = Freemamba.generateID();
    this._renderState = INITIAL_RENDER;
}

Extend(Freemamba, BaseRenderStore);

Freemamba.prototype.$inject = function (node) {
    this.containerNode = node;
    this.$render();
    this._renderState = DIFF_DETECT;
};

Freemamba.prototype.$render = function () {
    var self = this;
    if(this._timer){
        clearTimeout(this._timer);
    }
    
    self._render(self._renderState);
};

Freemamba.prototype._render = function(RENDER_STATE){
    switch(RENDER_STATE){
        case 'INITIAL_RENDER': 
            this._initialRender(); break;
        case 'DIFF_DETECT':
            this._diffRender(); break;
        default:
    }
};

Freemamba.prototype._updateWorkerDom = function(){
    this.msgBus.receive({ mambaID: this._id, type: UPDATE_RENDER, data: { template: this.template, data: this.data }});
};

Freemamba.prototype._diffRender = function(){
    var self = this;
    this.msgBus.receive({ mambaID: this._id, type: this._renderState, data: { template: this.template, data: this.data }})
        .then(function(type, message){
            self._diff(message);
        });
};

Freemamba.prototype._diff = function(diffs){
    for(var i=0;i<diffs.length;i++){
        var oprateType = diffs[i].type,
            prevDom = diffs[i].prevDom,
            curDom = diffs[i].curDom;

        switch(oprateType){
            case 'REPLACE':
                this._replaceOperate(prevDom, curDom); break;
            case 'DELETE':
                this._deleteOperate(prevDom); break;
            default:
        }
    }
    
};

Freemamba.prototype._addOperate = function(prevDom, curDom){
    var targetDom, path = curDom._path,
        listName = curDom._listName,
        rootNode = this.rootNode,
        source, lastIndex;

    if(listName){
        this.$list[listName].render();
        return;
    }

    /**寻找父节点&&生成新节点 */
    targetDom = this._findTargetDom(rootNode, path, true);
    source = new VdomCompiler(curDom, this).compile(null, ADD);

    /**插入操作 */
    lastIndex = targetDom._lastIndex;
    if(lastIndex >= targetDom.childNodes.length-1){
        targetDom.append(source);
    }else{
        targetDom.insertBefore(source, targetDom.childNodes[lastIndex]);
    }
};

Freemamba.prototype._deleteOperate = function(prevDom){
    var path = prevDom._path, targetDom,
        rootNode = this.rootNode,
        listName = prevDom._listName;
    
    /**检测元素是否存在List中 */
    if(listName){
        this.$list[listName].render();
        return;
    }

    targetDom = this._findTargetDom(rootNode, path);
    targetDom.parentNode.remove(targetDom);
};

Freemamba.prototype._findTargetDom = function(root, path, isAdd){
    var targetDom = root,
        lastIndex;

    path = path.trim().split(' ');
    path.shift();
    lastIndex = isAdd && path.pop();

    while(path.length){
        targetDom = getNode(targetDom, path.shift());
    }

    function getNode(root, childIndex){
        return root.childNodes[childIndex];
    }

    if(lastIndex){
        targetDom._lastIndex = lastIndex;
    }

    return targetDom;
};

Freemamba.prototype._replaceOperate = function(prevDom, curDom){
    var path = prevDom._path, 
        targetDom, source,
        rootNode = this.rootNode;

    targetDom = this._findTargetDom(rootNode, path);

    /**替换操作 */
    source = new VdomCompiler(curDom, this).compile(targetDom, REPLACE);
    source && targetDom.parentNode.replaceChild(source, targetDom);

};



Freemamba.prototype._initialRender = function(){
    var newRoot = this.domTree = this._compile(this.AST),
        containerNode = this.containerNode,
        rootNode = this.rootNode;

    this.rootNode = newRoot.children[0];
    rootNode? containerNode.replaceChild(newRoot, rootNode) : containerNode.append(newRoot);

    this.msgBus.receive({ mambaID: this._id, type: this._renderState, data: { template: this.template, data: this.data }});
};

/**生成组件实例的唯一id*/
Freemamba.generateID = function(){
    if(this.currentID){
        return ++this.currentID;
    }else{
        return this.currentID = 1;
    }
};

Freemamba.addAsyncEvents = function (node, events) {
    if (node.getAttribute('list-container')) {
        this._list.container = node;
    }
    if (typeof node.dataset === 'undefined' || typeof node.dataset.nodeID === 'undefined') {
        if (!node.children) return;
        for (var i = 0; i < node.children.length; i++) {
            Freemamba.addAsyncEvents.call(this, node.children[i], events);
        }
    }
    var nodeId = node.dataset.nodeid;

    for (var id in events) {
        if (id == nodeId) {
            var eventHub = events[id];
            for (var j = 0; j < eventHub.length; j++) {
                var context = eventHub[j].context;
                var getHandler = new Function('c', 'd', 'e', 'return ' + eventHub[j].value + ';');
                var handler = getHandler(this, context || this.data, '');

                node.addEventListener(eventHub[j].name, handler, false);
            }
            break;
        }
    }

    delete events[nodeId];
};

module.exports = Freemamba;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:44:12 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-21 01:52:44
 */
var attrResolver = __webpack_require__(23);
var List = __webpack_require__(24);

function element(ast, context, listInfo) {
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs, listBuffer;
    /**处理属性 */
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        if(attr.name === 'list' && attr.value){
            listBuffer = context.$list[attr.value] = new List({data: listInfo, node: node});
        }

        switch (attr.type) {
            case 'attribute': attrResolver(attr, node, context, listInfo); break;
            default:
        }
    }

    /**处理子节点 */
    if (ast.children) {
        for (var j = 0; j < ast.children.length; j++) {
            var child = ast.children[j];

            var childDom = context._compile(child, listInfo, listBuffer);

            if(child.type === 'list'){
                listBuffer.setAst(ast);
            }

            node.append(childDom);
        }
    }
    return node;
}

function text(ast) {
    var node = document.createTextNode(ast.text);
    return node;
}

function expression(ast, context, listInfo) {
    var text = '', getValue;
    
    getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
    text = getValue(context, listInfo || context.data, '');

    var node = document.createTextNode(text);

    return node;
}

function list(ast, context, listInfo, listBuffer) {
    var listBody = ast.body,
        node = document.createDocumentFragment(),
        getValue = new Function('c', 'd', 'e', 'return (' + ast.sequence.body + ')'),
        arrayData = getValue(context, listInfo || context.data, ''),
        variable = ast.variable;

    if(listBuffer){
        listBuffer.setData(arrayData);
        listBuffer.setParent(context);
        listBuffer.setName({item: variable, index: variable + '_index'});
        listBuffer.setItemBody(listBody);
    }

    for (var j = 0; j < arrayData.length; j++) {
        var listItem = itemNode(listBody, arrayData[j], j);

        listBuffer && listBuffer.addListItem(listItem.children[0]);

        node.append(listItem);
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

    return node;
}

module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:51:33 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-21 01:47:27
 */
function resolveAttribute(attr, node, context, listInfo) {
    var valueType = typeof attr.value,
        attrValue;
    switch (valueType) {
        case 'string': 
            attrValue = attr.value; break;
        case 'object': 
            attrValue = resolveAttrValue(attr, node, context, listInfo); break;
        default:
    }
    /**ref拦截 */
    if(attr.name === 'ref'){
        context.$refs[attrValue] = node;
        node._refName = attrValue;
    }

    node.setAttribute(attr.name, attrValue);
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

        return getValue(context, listInfo || context.data, '');
    }
}

module.exports = resolveAttribute;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-20 17:38:15 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-21 01:52:24
 */
function List(config){
    this.node = config.node;
    this.data = config.data;
    this.parent = config.parent;
    this.listItems = [];
}

List.prototype.insert = function(index, model){
    var data = this.data;

    data.splice(index, 0, model);
    this.render();
};

List.prototype.setData = function(array){
    this.data = array;
};

List.prototype.setAst = function(ast){
    this.ast = ast;
};

List.prototype.setParent = function(parent){
    this.parent = parent;
};

List.prototype.addListItem = function(node){
    this.listItems.push(node);
};

List.prototype.setItemBody = function(body){
    this.itemAst = body;
};

List.prototype.getNode = function(){
    return this.node;
};

List.prototype.setName = function(config){
    this.itemName = config.item;
    this.indexName = config.index;
};

List.prototype.modify = function(index, model){
    var targetDom = this.listItems[index],
        itemAst = this.itemAst, itemName = this.itemName,
        indexName = this.indexName, tempListData = {};
    
    tempListData[itemName] = model;
    tempListData[indexName] = index;

    var newChild = this.parent._compile(itemAst, tempListData);

    this.listItems[index] = newChild.children[0];
    this.data[index] = model;

    this.node.replaceChild(newChild, targetDom);
    this.parent._updateWorkerDom();
};

List.prototype.delete = function(index){
    this.data.splice(index, 1);
    this.render();
};

List.prototype.replace = function(newListData){
    List.replaceList(this.data, newListData);
    this.render();
};

List.prototype.render = function(){
    var self = this;
    if(this._timer){
        clearTimeout(this._timer);
    }
    this._timer = setTimeout(function(){
        self._render();
    }, 0);
};

List.prototype._render = function(){
    this.listItems = [];
    this.node.innerHTML = '';

    var newBody = this.parent._compile(this.ast.children, null, this);
    this.node.append(newBody);
    this.parent._updateWorkerDom();
};

List.replaceList = function (oldList, newList) {
    for (var i = oldList.length - 1; i >= 0; i--) {
        if (typeof newList[i] === 'undefined') {
            oldList.splice(i, 1);
        } else {
            oldList[i] = newList[i];
        }
    }
};

module.exports = List;

/***/ }),
/* 25 */
/***/ (function(module, exports) {



function vdomCompiler(vdom, context){
    this._vdom = vdom;
    this._context = context;
}

vdomCompiler.prototype.compile = function(targetDom, type){
    var vdom = this._vdom;
    
    return this['_'+this._typeof(vdom)](vdom, targetDom, type);
};

vdomCompiler.prototype._typeof = function(vdom){
    var result;

    if(typeof vdom._value === 'string'){
        result = 'TextNode';
    }else if(typeof vdom._tagName === 'string'){
        result = 'Element';
    }else{
        result = 'DocumentFragment';
    }

    return result;
};

vdomCompiler.prototype._TextNode = function(vdom){
    return document.createTextNode(vdom._value);
};

vdomCompiler.prototype._Element = function(vdom, targetDom, type){
    var context = this._context;

    if(vdom._listName){
        context.$list[vdom._listName].render();
        return;
    }
    var node = document.createElement(vdom._tagName);

    /**设置属性 */
    for(var i=0;i<vdom._attrs.length;i++){
        node.setAttribute(vdom._attrs[i].name, vdom._attrs[i].value);
    }

    /**设置事件 */
    for(var j=0;j<vdom._events.length;j++){
        var handlerStr = vdom._events[j].value;
        var handler = new Function('c', 'd', 'e', 'return ' + handlerStr + ';');
        node.addEventListener(vdom._events[j].name, handler(context, context.data, ''), false);
    }

    /**替换子节点 */
    if(type === 'REPLACE'){
        var children = document.createDocumentFragment();
        for(var k=0;k<targetDom.childNodes.length;k++){ 
            children.append(targetDom.childNodes[k]);
        }
        node.append(children);
    }
    

    /**绑定ref */
    if(targetDom && targetDom._refName){
        context.$refs[targetDom._refName] = node;
    }

    if(type === 'ADD'){
        var childBody = document.createDocumentFragment();
        for(var h=0;h<vdom._children.length;h++){
            childBody.append(new vdomCompiler(vdom._children[h]).compile(null, 'ADD'));
        }
        node.append(childBody);
    }

    return node;
};

vdomCompiler.prototype._DocumentFragment = function(){
    
};

module.exports = vdomCompiler;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:38 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 16:40:38
 */
var MessageBus = __webpack_require__(17);
var Extend = __webpack_require__(1);

function UIMsgBus(worker){
    this._worker = worker;
    this.super();
}

Extend(UIMsgBus, MessageBus);

UIMsgBus.prototype._initWorker = function(){
    var _worker = this._worker;

    _worker.addEventListener('message', this._onMessage.bind(this));
};

UIMsgBus.prototype._serialize = function (message) {
    var Info = {},
        _baseId = message.id = this._baseId;

    Info.id = _baseId;
    Info.type = message.type;
    Info.data = message.data;
    Info.mambaID = message.mambaID;

    this._sendInfoToWorker(Info);
    this._baseId++;
    return this;
};

UIMsgBus.prototype._postMessage = function(Info){
    var _worker = this._worker;

    _worker.postMessage(Info);
};

module.exports = UIMsgBus;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTQwYThjYzM2YTE4MzM0MzI2NTIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL1RleHROb2RlLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy91aV9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9VSVJlbmRlclN0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2NvbXBpbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2F0dHJSZXNvbHZlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGlzdC9MaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL1Zkb21Db21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9VSU1zZ0J1cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCOzs7Ozs7NERDZEE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsTUFBTSxVQUFVLFdBQVcsTUFBTSxPQUFPLGFBQWE7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsVUFBVTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0U7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YscUVBQXFFLEtBQUs7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELE9BQU87QUFDUCxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixpQ0FBaUMsbUJBQW1CLDRCQUE0QixXQUFXLFlBQVksRUFBRSxhQUFhO0FBQ2xKO0FBQ0E7O0FBRUE7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLDBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSyxLQUFLO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRyxLQUFLO0FBQ1IsbURBQW1EO0FBQ25EO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0M7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QixVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUEsd0I7Ozs7OztBQ2x1QkE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3BEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsaUJBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDekxEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7QUN2THRDO0FBQ0E7QUFDQSxjQUFjOztBQUVkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsU0FBUztBQUNwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7OztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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OEJBQThCLEs7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isd0JBQXdCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsOEI7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMEIiLCJmaWxlIjoiRnJlZW1hbWJhLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTgpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk0MGE4Y2MzNmExODMzNDMyNjUyIiwiZnVuY3Rpb24gZG9jdW1lbnRGcmFnbWVudCgpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5kb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50RnJhZ21lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTQ6NTQ6MzMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMTkgMTQ6NTk6NDBcclxuICovXHJcblxyXG5mdW5jdGlvbiBleHRlbmQoY2hpbGRDbGFzcywgYmFzZUNsYXNzKXtcclxuICAgIHZhciBmbiA9IGZ1bmN0aW9uKCl7fTtcclxuICAgIGZuLnByb3RvdHlwZSA9IGJhc2VDbGFzcy5wcm90b3R5cGU7XHJcbiAgICBjaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBmbigpO1xyXG4gICAgY2hpbGRDbGFzcy5wcm90b3R5cGUuc3VwZXIgPSBiYXNlQ2xhc3M7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3V0aWxzL2V4dGVuZC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInJlcXVpcmUoJy4vaGVscGVyL3NoaW0uanMnKSgpO1xyXG5cclxuXHJcblxyXG52YXIgXyAgPSBtb2R1bGUuZXhwb3J0cztcclxudmFyIGVudGl0aWVzID0gcmVxdWlyZSgnLi9oZWxwZXIvZW50aXRpZXMuanMnKTtcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciBvMnN0ciA9ICh7fSkudG9TdHJpbmc7XHJcbnZhciB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSd1bmRlZmluZWQnPyB3aW5kb3c6IGdsb2JhbDtcclxudmFyIE1BWF9QUklPUklUWSA9IDk5OTk7XHJcblxyXG5cclxuXy5ub29wID0gZnVuY3Rpb24oKXt9O1xyXG5fLnVpZCA9IChmdW5jdGlvbigpe1xyXG4gIHZhciBfdWlkPTA7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gX3VpZCsrO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uZXh0ZW5kID0gZnVuY3Rpb24oIG8xLCBvMiwgb3ZlcnJpZGUgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCB8fCBvdmVycmlkZSA9PT0gdHJ1ZSApe1xyXG4gICAgICBvMVtpXSA9IG8yW2ldXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvMTtcclxufVxyXG5cclxuXy5rZXlzID0gT2JqZWN0LmtleXM/IE9iamVjdC5rZXlzOiBmdW5jdGlvbihvYmope1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgcmVzLnB1c2goaSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbl8uc29tZSA9IGZ1bmN0aW9uKGxpc3QsIGZuKXtcclxuICBmb3IodmFyIGkgPTAsbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICBpZihmbihsaXN0W2ldKSkgcmV0dXJuIHRydWVcclxuICB9XHJcbn1cclxuXHJcbl8udmFyTmFtZSA9ICdkJztcclxuXy5zZXROYW1lID0gJ3BfJztcclxuXy5jdHhOYW1lID0gJ2MnO1xyXG5fLmV4dE5hbWUgPSAnZSc7XHJcblxyXG5fLnJXb3JkID0gL15bXFwkXFx3XSskLztcclxuXy5yU2ltcGxlQWNjZXNzb3IgPSAvXltcXCRcXHddKyhcXC5bXFwkXFx3XSspKiQvO1xyXG5cclxuXy5uZXh0VGljayA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbic/IFxyXG4gIHNldEltbWVkaWF0ZS5iaW5kKHdpbikgOiBcclxuICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgMCkgXHJcbiAgfVxyXG5cclxuXHJcblxyXG5fLnByZWZpeCA9IFwiJ3VzZSBzdHJpY3QnO3ZhciBcIiArIF8udmFyTmFtZSArIFwiPVwiICsgXy5jdHhOYW1lICsgXCIuZGF0YTtcIiArICBfLmV4dE5hbWUgICsgXCI9XCIgKyBfLmV4dE5hbWUgKyBcInx8Jyc7XCI7XHJcblxyXG5cclxuXy5zbGljZSA9IGZ1bmN0aW9uKG9iaiwgc3RhcnQsIGVuZCl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSA9IHN0YXJ0IHx8IDAsIGxlbiA9IGVuZCB8fCBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgcmVzLnB1c2gob2JqW2ldKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyBiZWFjdXNlIHNsaWNlIGFuZCB0b0xvd2VyQ2FzZSBpcyBleHBlbnNpdmUuIHdlIGhhbmRsZSB1bmRlZmluZWQgYW5kIG51bGwgaW4gYW5vdGhlciB3YXlcclxuXy50eXBlT2YgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBvID09IG51bGwgPyBTdHJpbmcobykgOm8yc3RyLmNhbGwobykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbl8ubWFrZVByZWRpY2F0ZSA9IGZ1bmN0aW9uIG1ha2VQcmVkaWNhdGUod29yZHMsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiB3b3JkcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHdvcmRzID0gd29yZHMuc3BsaXQoXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgdmFyIGYgPSBcIlwiLFxyXG4gICAgY2F0cyA9IFtdO1xyXG4gICAgb3V0OiBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXRzLmxlbmd0aDsgKytqKXtcclxuICAgICAgICAgIGlmIChjYXRzW2pdWzBdLmxlbmd0aCA9PT0gd29yZHNbaV0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgY2F0c1tqXS5wdXNoKHdvcmRzW2ldKTtcclxuICAgICAgICAgICAgICBjb250aW51ZSBvdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdHMucHVzaChbd29yZHNbaV1dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmVUbyhhcnIpIHtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGYgKz0gXCJyZXR1cm4gc3RyID09PSAnXCIgKyBhcnJbMF0gKyBcIic7XCI7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKXtcclxuICAgICAgICAgICBmICs9IFwiY2FzZSAnXCIgKyBhcnJbaV0gKyBcIic6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgKz0gXCJyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2U7XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHRocmVlIGxlbmd0aCBjYXRlZ29yaWVzLCBhbiBvdXRlclxyXG4gICAgLy8gc3dpdGNoIGZpcnN0IGRpc3BhdGNoZXMgb24gdGhlIGxlbmd0aHMsIHRvIHNhdmUgb24gY29tcGFyaXNvbnMuXHJcbiAgICBpZiAoY2F0cy5sZW5ndGggPiAzKSB7XHJcbiAgICAgICAgY2F0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIubGVuZ3RoKXtcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNhdCA9IGNhdHNbaV07XHJcbiAgICAgICAgICAgIGYgKz0gXCJjYXNlIFwiICsgY2F0WzBdLmxlbmd0aCArIFwiOlwiO1xyXG4gICAgICAgICAgICBjb21wYXJlVG8oY2F0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcIn1cIjtcclxuXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzaW1wbHkgZ2VuZXJhdGUgYSBmbGF0IGBzd2l0Y2hgIHN0YXRlbWVudC5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGFyZVRvKHdvcmRzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCJzdHJcIiwgZik7XHJcbn1cclxuXHJcblxyXG5fLnRyYWNrRXJyb3JQb3MgPSAoZnVuY3Rpb24gKCl7XHJcbiAgLy8gbGluZWJyZWFrXHJcbiAgdmFyIGxiID0gL1xcclxcbnxbXFxuXFxyXFx1MjAyOFxcdTIwMjldL2c7XHJcbiAgdmFyIG1pblJhbmdlID0gMjAsIG1heFJhbmdlID0gMjA7XHJcbiAgZnVuY3Rpb24gZmluZExpbmUobGluZXMsIHBvcyl7XHJcbiAgICB2YXIgdG1wTGVuID0gMDtcclxuICAgIGZvcih2YXIgaSA9IDAsbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgICB2YXIgbGluZUxlbiA9IChsaW5lc1tpXSB8fCBcIlwiKS5sZW5ndGg7XHJcblxyXG4gICAgICBpZih0bXBMZW4gKyBsaW5lTGVuID4gcG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIHtudW06IGksIGxpbmU6IGxpbmVzW2ldLCBzdGFydDogcG9zIC0gaSAtIHRtcExlbiAsIHByZXY6bGluZXNbaS0xXSwgbmV4dDogbGluZXNbaSsxXSB9O1xyXG4gICAgICB9XHJcbiAgICAgIC8vIDEgaXMgZm9yIHRoZSBsaW5lYnJlYWtcclxuICAgICAgdG1wTGVuID0gdG1wTGVuICsgbGluZUxlbiA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGZvcm1hdExpbmUoc3RyLCAgc3RhcnQsIG51bSwgdGFyZ2V0KXtcclxuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgdmFyIG1pbiA9IHN0YXJ0IC0gbWluUmFuZ2U7XHJcbiAgICBpZihtaW4gPCAwKSBtaW4gPSAwO1xyXG4gICAgdmFyIG1heCA9IHN0YXJ0ICsgbWF4UmFuZ2U7XHJcbiAgICBpZihtYXggPiBsZW4pIG1heCA9IGxlbjtcclxuXHJcbiAgICB2YXIgcmVtYWluID0gc3RyLnNsaWNlKG1pbiwgbWF4KTtcclxuICAgIHZhciBwcmVmaXggPSBcIltcIiArKG51bSsxKSArIFwiXSBcIiArIChtaW4gPiAwPyBcIi4uXCIgOiBcIlwiKVxyXG4gICAgdmFyIHBvc3RmaXggPSBtYXggPCBsZW4gPyBcIi4uXCI6IFwiXCI7XHJcbiAgICB2YXIgcmVzID0gcHJlZml4ICsgcmVtYWluICsgcG9zdGZpeDtcclxuICAgIGlmKHRhcmdldCkgcmVzICs9IFwiXFxuXCIgKyBuZXcgQXJyYXkoc3RhcnQtbWluICsgcHJlZml4Lmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpICsgXCJeXl5cIjtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG4gIHJldHVybiBmdW5jdGlvbihpbnB1dCwgcG9zKXtcclxuICAgIGlmKHBvcyA+IGlucHV0Lmxlbmd0aC0xKSBwb3MgPSBpbnB1dC5sZW5ndGgtMTtcclxuICAgIGxiLmxhc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgbGluZXMgPSBpbnB1dC5zcGxpdChsYik7XHJcbiAgICB2YXIgbGluZSA9IGZpbmRMaW5lKGxpbmVzLHBvcyk7XHJcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0LCBudW0gPSBsaW5lLm51bTtcclxuXHJcbiAgICByZXR1cm4gKGxpbmUucHJldj8gZm9ybWF0TGluZShsaW5lLnByZXYsIHN0YXJ0LCBudW0tMSApICsgJ1xcbic6ICcnICkgKyBcclxuICAgICAgZm9ybWF0TGluZShsaW5lLmxpbmUsIHN0YXJ0LCBudW0sIHRydWUpICsgJ1xcbicgKyBcclxuICAgICAgKGxpbmUubmV4dD8gZm9ybWF0TGluZShsaW5lLm5leHQsIHN0YXJ0LCBudW0rMSApICsgJ1xcbic6ICcnICk7XHJcblxyXG4gIH1cclxufSkoKTtcclxuXHJcblxyXG52YXIgaWdub3JlZFJlZiA9IC9cXCgoXFw/XFwhfFxcP1xcOnxcXD9cXD0pL2c7XHJcbl8uZmluZFN1YkNhcHR1cmUgPSBmdW5jdGlvbiAocmVnU3RyKSB7XHJcbiAgdmFyIGxlZnQgPSAwLFxyXG4gICAgcmlnaHQgPSAwLFxyXG4gICAgbGVuID0gcmVnU3RyLmxlbmd0aCxcclxuICAgIGlnbm9yZWQgPSByZWdTdHIubWF0Y2goaWdub3JlZFJlZik7IC8vIGlnbm9yZWQgdW5jYXB0dXJlXHJcbiAgaWYoaWdub3JlZCkgaWdub3JlZCA9IGlnbm9yZWQubGVuZ3RoXHJcbiAgZWxzZSBpZ25vcmVkID0gMDtcclxuICBmb3IgKDsgbGVuLS07KSB7XHJcbiAgICB2YXIgbGV0dGVyID0gcmVnU3RyLmNoYXJBdChsZW4pO1xyXG4gICAgaWYgKGxlbiA9PT0gMCB8fCByZWdTdHIuY2hhckF0KGxlbiAtIDEpICE9PSBcIlxcXFxcIiApIHsgXHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKFwiKSBsZWZ0Kys7XHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKVwiKSByaWdodCsrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobGVmdCAhPT0gcmlnaHQpIHRocm93IFwiUmVnRXhwOiBcIisgcmVnU3RyICsgXCIncyBicmFja2V0IGlzIG5vdCBtYXJjaGVkXCI7XHJcbiAgZWxzZSByZXR1cm4gbGVmdCAtIGlnbm9yZWQ7XHJcbn07XHJcblxyXG5cclxuXy5lc2NhcGVSZWdFeHAgPSBmdW5jdGlvbiggc3RyKXsvLyBDcmVkaXQ6IFhSZWdFeHAgMC42LjEgKGMpIDIwMDctMjAwOCBTdGV2ZW4gTGV2aXRoYW4gPGh0dHA6Ly9zdGV2ZW5sZXZpdGhhbi5jb20vcmVnZXgveHJlZ2V4cC8+IE1JVCBMaWNlbnNlXHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLVtcXF17fSgpKis/LlxcXFxeJHwsI1xcc10vZywgZnVuY3Rpb24obWF0Y2gpe1xyXG4gICAgcmV0dXJuICdcXFxcJyArIG1hdGNoO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbnZhciByRW50aXR5ID0gbmV3IFJlZ0V4cChcIiYoPzooI3hbMC05YS1mQS1GXSspfCgjWzAtOV0rKXwoXCIgKyBfLmtleXMoZW50aXRpZXMpLmpvaW4oJ3wnKSArICcpKTsnLCAnZ2knKTtcclxuXHJcbl8uY29udmVydEVudGl0eSA9IGZ1bmN0aW9uKGNocil7XHJcblxyXG4gIHJldHVybiAoXCJcIiArIGNocikucmVwbGFjZShyRW50aXR5LCBmdW5jdGlvbihhbGwsIGhleCwgZGVjLCBjYXB0dXJlKXtcclxuICAgIHZhciBjaGFyQ29kZTtcclxuICAgIGlmKCBkZWMgKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBkZWMuc2xpY2UoMSksIDEwICk7XHJcbiAgICBlbHNlIGlmKCBoZXggKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBoZXguc2xpY2UoMiksIDE2ICk7XHJcbiAgICBlbHNlIGNoYXJDb2RlID0gZW50aXRpZXNbY2FwdHVyZV1cclxuXHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSggY2hhckNvZGUgKVxyXG4gIH0pO1xyXG5cclxufVxyXG5cclxuXHJcbi8vIHNpbXBsZSBnZXQgYWNjZXNzb3JcclxuXHJcbl8uY3JlYXRlT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZT8gZnVuY3Rpb24obyl7XHJcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUobyB8fCBudWxsKVxyXG59OiAoZnVuY3Rpb24oKXtcclxuICAgIGZ1bmN0aW9uIFRlbXAoKSB7fVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG8pe1xyXG4gICAgICBpZighbykgcmV0dXJuIHt9XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbztcclxuICAgICAgdmFyIG9iaiA9IG5ldyBUZW1wKCk7XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbnVsbDsgLy8g5LiN6KaB5L+d5oyB5LiA5LiqIE8g55qE5p2C5pWj5byV55So77yIYSBzdHJheSByZWZlcmVuY2XvvIkuLi5cclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXy5jcmVhdGVQcm90byA9IGZ1bmN0aW9uKGZuLCBvKXtcclxuICAgIGZ1bmN0aW9uIEZvbygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGZuO31cclxuICAgIEZvby5wcm90b3R5cGUgPSBvO1xyXG4gICAgcmV0dXJuIChmbi5wcm90b3R5cGUgPSBuZXcgRm9vKCkpO1xyXG59XHJcblxyXG5cclxuXy5yZW1vdmVPbmUgPSBmdW5jdGlvbihsaXN0ICwgZmlsdGVyKXtcclxuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XHJcbiAgZm9yKDtsZW4tLTspe1xyXG4gICAgaWYoZmlsdGVyKGxpc3RbbGVuXSkpIHtcclxuICAgICAgbGlzdC5zcGxpY2UobGVuLCAxKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbmNsb25lXHJcbiovXHJcbl8uY2xvbmUgPSBmdW5jdGlvbiBjbG9uZShvYmope1xyXG4gIGlmKCFvYmogfHwgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICkpIHJldHVybiBvYmo7XHJcbiAgaWYoQXJyYXkuaXNBcnJheShvYmopKXtcclxuICAgIHZhciBjbG9uZWQgPSBbXTtcclxuICAgIGZvcih2YXIgaT0wLGxlbiA9IG9iai5sZW5ndGg7IGk8IGxlbjtpKyspe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV1cclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfWVsc2V7XHJcbiAgICB2YXIgY2xvbmVkID0ge307XHJcbiAgICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG4gIH1cclxufVxyXG5cclxuXy5lcXVhbHMgPSBmdW5jdGlvbihub3csIG9sZCl7XHJcbiAgdmFyIHR5cGUgPSB0eXBlb2Ygbm93O1xyXG4gIGlmKHR5cGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBvbGQgPT09ICdudW1iZXInJiYgaXNOYU4obm93KSAmJiBpc05hTihvbGQpKSByZXR1cm4gdHJ1ZVxyXG4gIHJldHVybiBub3cgPT09IG9sZDtcclxufVxyXG5cclxudmFyIGRhc2ggPSAvLShbYS16XSkvZztcclxuXy5jYW1lbENhc2UgPSBmdW5jdGlvbihzdHIpe1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShkYXNoLCBmdW5jdGlvbihhbGwsIGNhcHR1cmUpe1xyXG4gICAgcmV0dXJuIGNhcHR1cmUudG9VcHBlckNhc2UoKTtcclxuICB9KVxyXG59XHJcblxyXG5cclxuXHJcbl8udGhyb3R0bGUgPSBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0KXtcclxuICB2YXIgd2FpdCA9IHdhaXQgfHwgMTAwO1xyXG4gIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XHJcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xyXG4gIHZhciBwcmV2aW91cyA9IDA7XHJcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBwcmV2aW91cyA9ICtuZXcgRGF0ZTtcclxuICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICB9O1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBub3cgPSArIG5ldyBEYXRlO1xyXG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xyXG4gICAgY29udGV4dCA9IHRoaXM7XHJcbiAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgcHJldmlvdXMgPSBub3c7XHJcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn07XHJcblxyXG4vLyBob2dhbiBlc2NhcGVcclxuLy8gPT09PT09PT09PT09PT1cclxuXy5lc2NhcGUgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgckFtcCA9IC8mL2csXHJcbiAgICAgIHJMdCA9IC88L2csXHJcbiAgICAgIHJHdCA9IC8+L2csXHJcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxyXG4gICAgICByUXVvdCA9IC9cXFwiL2csXHJcbiAgICAgIGhDaGFycyA9IC9bJjw+XFxcIlxcJ10vO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XHJcbiAgICAgIHN0clxyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXHJcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2Uockd0LCAnJmd0OycpXHJcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXHJcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XHJcbiAgICAgIHN0cjtcclxuICB9XHJcbn0pKCk7XHJcblxyXG5fLmNhY2hlID0gZnVuY3Rpb24obWF4KXtcclxuICBtYXggPSBtYXggfHwgMTAwMDtcclxuICB2YXIga2V5cyA9IFtdLFxyXG4gICAgICBjYWNoZSA9IHt9O1xyXG4gIHJldHVybiB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgaWYgKGtleXMubGVuZ3RoID4gdGhpcy5tYXgpIHtcclxuICAgICAgICBjYWNoZVtrZXlzLnNoaWZ0KCldID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFxyXG4gICAgICBpZihjYWNoZVtrZXldID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhY2hlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlO1xyXG4gICAgICByZXR1cm4gY2FjaGVba2V5XTtcclxuICAgIH0sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIGxlbjpmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ga2V5cy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLy8gLy8gc2V0dXAgdGhlIHJhdyBFeHByZXNzaW9uXHJcblxyXG5cclxuLy8gaGFuZGxlIHRoZSBzYW1lIGxvZ2ljIG9uIGNvbXBvbmVudCdzIGBvbi0qYCBhbmQgZWxlbWVudCdzIGBvbi0qYFxyXG4vLyByZXR1cm4gdGhlIGZpcmUgb2JqZWN0XHJcbl8uaGFuZGxlRXZlbnQgPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSApe1xyXG4gIHZhciBzZWxmID0gdGhpcywgZXZhbHVhdGU7XHJcbiAgaWYodmFsdWUudHlwZSA9PT0gJ2V4cHJlc3Npb24nKXsgLy8gaWYgaXMgZXhwcmVzc2lvbiwgZ28gZXZhbHVhdGVkIHdheVxyXG4gICAgZXZhbHVhdGUgPSB2YWx1ZS5nZXQ7XHJcbiAgfVxyXG4gIGlmKGV2YWx1YXRlKXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKG9iail7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gb2JqO1xyXG4gICAgICAgIHZhciByZXMgPSBldmFsdWF0ZShzZWxmKTtcclxuICAgICAgICBpZihyZXMgPT09IGZhbHNlICYmIG9iaiAmJiBvYmoucHJldmVudERlZmF1bHQpIG9iai5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9KVxyXG5cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKCl7XHJcbiAgICAgIHZhciBhcmdzID0gXy5zbGljZShhcmd1bWVudHMpO1xyXG4gICAgICBhcmdzLnVuc2hpZnQodmFsdWUpO1xyXG4gICAgICBzZWxmLiR1cGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgICBzZWxmLiRlbWl0LmFwcGx5KHNlbGYsIGFyZ3MpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gb25seSBjYWxsIG9uY2VcclxuXy5vbmNlID0gZnVuY3Rpb24oZm4pe1xyXG4gIHZhciB0aW1lID0gMDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGlmKCB0aW1lKysgPT09IDApIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG59XHJcblxyXG5fLmZpeE9ialN0ciA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgaWYoc3RyLnRyaW0oKS5pbmRleE9mKCd7JykgIT09IDApe1xyXG4gICAgcmV0dXJuICd7JyArIHN0ciArICd9JztcclxuICB9XHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbl8ubWFwPSBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2spe1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIHJlcy5wdXNoKGNhbGxiYWNrKGFycmF5W2ldLCBpKSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZyhtc2csIHR5cGUpe1xyXG4gIGlmKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSAgY29uc29sZVt0eXBlIHx8IFwibG9nXCJdKG1zZyk7XHJcbn1cclxuXHJcbl8ubG9nID0gbG9nO1xyXG5cclxuXHJcbl8ubm9ybUxpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50cyAgKXtcclxuICAgIHZhciBldmVudExpc3RlbmVycyA9IFtdO1xyXG4gICAgdmFyIHBUeXBlID0gXy50eXBlT2YoIGV2ZW50cyApO1xyXG4gICAgaWYoIHBUeXBlID09PSAnYXJyYXknICl7XHJcbiAgICAgIHJldHVybiBldmVudHM7XHJcbiAgICB9ZWxzZSBpZiAoIHBUeXBlID09PSAnb2JqZWN0JyApe1xyXG4gICAgICBmb3IoIHZhciBpIGluIGV2ZW50cyApIGlmICggZXZlbnRzLmhhc093blByb3BlcnR5KGkpICl7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBpLFxyXG4gICAgICAgICAgbGlzdGVuZXI6IGV2ZW50c1tpXVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBldmVudExpc3RlbmVycztcclxufVxyXG5cclxuXHJcbi8vaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvc2luZ2xlLXBhZ2UuaHRtbCN2b2lkLWVsZW1lbnRzXHJcbl8uaXNWb2lkVGFnID0gXy5tYWtlUHJlZGljYXRlKFwiYXJlYSBiYXNlIGJyIGNvbCBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWVudWl0ZW0gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyIHItY29udGVudFwiKTtcclxuXy5pc0Jvb2xlYW5BdHRyID0gXy5tYWtlUHJlZGljYXRlKCdzZWxlY3RlZCBjaGVja2VkIGRpc2FibGVkIHJlYWRvbmx5IHJlcXVpcmVkIG9wZW4gYXV0b2ZvY3VzIGNvbnRyb2xzIGF1dG9wbGF5IGNvbXBhY3QgbG9vcCBkZWZlciBtdWx0aXBsZScpO1xyXG5cclxuXHJcbl8uaXNFeHByID0gZnVuY3Rpb24oZXhwcil7XHJcbiAgcmV0dXJuIGV4cHIgJiYgZXhwci50eXBlID09PSAnZXhwcmVzc2lvbic7XHJcbn1cclxuLy8gQFRPRE86IG1ha2UgaXQgbW9yZSBzdHJpY3RcclxuXy5pc0dyb3VwID0gZnVuY3Rpb24oZ3JvdXApe1xyXG4gIHJldHVybiBncm91cC5pbmplY3QgfHwgZ3JvdXAuJGluamVjdDtcclxufVxyXG5cclxuXy5nZXRDb21waWxlRm4gPSBmdW5jdGlvbihzb3VyY2UsIGN0eCwgb3B0aW9ucyl7XHJcbiAgcmV0dXJuIGN0eC4kY29tcGlsZS5iaW5kKGN0eCxzb3VyY2UsIG9wdGlvbnMpXHJcbn1cclxuXHJcbi8vIHJlbW92ZSBkaXJlY3RpdmUgcGFyYW0gZnJvbSBBU1RcclxuXy5maXhUYWdBU1QgPSBmdW5jdGlvbiggdGFnQVNULCBDb21wb25lbnQgKXtcclxuXHJcbiAgaWYoIHRhZ0FTVC50b3VjaGVkICkgcmV0dXJuO1xyXG5cclxuICB2YXIgYXR0cnMgPSB0YWdBU1QuYXR0cnM7XHJcblxyXG4gIGlmKCAhYXR0cnMgKSByZXR1cm47XHJcblxyXG4gIC8vIE1heWJlIG11bHRpcGxlIGRpcmVjdGl2ZSBuZWVkIHNhbWUgcGFyYW0sIFxyXG4gIC8vIFdlIHBsYWNlIGFsbCBwYXJhbSBpbiB0b3RhbFBhcmFtTWFwXHJcbiAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcclxuICBpZighbGVuKSByZXR1cm47XHJcbiAgdmFyIGRpcmVjdGl2ZXM9W10sIG90aGVyQXR0ck1hcCA9IHt9O1xyXG4gIGZvcig7bGVuLS07KXtcclxuXHJcbiAgICB2YXIgYXR0ciA9IGF0dHJzWyBsZW4gXTtcclxuXHJcblxyXG4gICAgLy8gQElFIGZpeCBJRTktIGlucHV0IHR5cGUgY2FuJ3QgYXNzaWduIGFmdGVyIHZhbHVlXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICd0eXBlJykgYXR0ci5wcmlvcml0eSA9IE1BWF9QUklPUklUWSsxO1xyXG5cclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKCBhdHRyLm5hbWUgKTtcclxuICAgIGlmKCBkaXJlY3RpdmUgKSB7XHJcblxyXG4gICAgICBhdHRyLnByaW9yaXR5ID0gZGlyZWN0aXZlLnByaW9yaXR5IHx8IDE7XHJcbiAgICAgIGF0dHIuZGlyZWN0aXZlID0gdHJ1ZTtcclxuICAgICAgZGlyZWN0aXZlcy5wdXNoKGF0dHIpO1xyXG5cclxuICAgIH1lbHNlIGlmKGF0dHIudHlwZSA9PT0gJ2F0dHJpYnV0ZScpe1xyXG4gICAgICBvdGhlckF0dHJNYXBbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXJlY3RpdmVzLmZvckVhY2goIGZ1bmN0aW9uKCBhdHRyICl7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0gQ29tcG9uZW50LmRpcmVjdGl2ZShhdHRyLm5hbWUpO1xyXG4gICAgdmFyIHBhcmFtID0gZGlyZWN0aXZlLnBhcmFtO1xyXG4gICAgaWYocGFyYW0gJiYgcGFyYW0ubGVuZ3RoKXtcclxuICAgICAgYXR0ci5wYXJhbSA9IHt9O1xyXG4gICAgICBwYXJhbS5mb3JFYWNoKGZ1bmN0aW9uKCBuYW1lICl7XHJcbiAgICAgICAgaWYoIG5hbWUgaW4gb3RoZXJBdHRyTWFwICl7XHJcbiAgICAgICAgICBhdHRyLnBhcmFtW25hbWVdID0gb3RoZXJBdHRyTWFwW25hbWVdID09PSB1bmRlZmluZWQ/IHRydWU6IG90aGVyQXR0ck1hcFtuYW1lXVxyXG4gICAgICAgICAgXy5yZW1vdmVPbmUoYXR0cnMsIGZ1bmN0aW9uKGF0dHIpe1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0ci5uYW1lID09PSBuYW1lXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXR0cnMuc29ydChmdW5jdGlvbihhMSwgYTIpe1xyXG4gICAgXHJcbiAgICB2YXIgcDEgPSBhMS5wcmlvcml0eTtcclxuICAgIHZhciBwMiA9IGEyLnByaW9yaXR5O1xyXG5cclxuICAgIGlmKCBwMSA9PSBudWxsICkgcDEgPSBNQVhfUFJJT1JJVFk7XHJcbiAgICBpZiggcDIgPT0gbnVsbCApIHAyID0gTUFYX1BSSU9SSVRZO1xyXG5cclxuICAgIHJldHVybiBwMiAtIHAxO1xyXG5cclxuICB9KVxyXG5cclxuICB0YWdBU1QudG91Y2hlZCA9IHRydWU7XHJcbn1cclxuXHJcbl8uZmluZEl0ZW0gPSBmdW5jdGlvbihsaXN0LCBmaWx0ZXIpe1xyXG4gIGlmKCFsaXN0IHx8ICFsaXN0Lmxlbmd0aCkgcmV0dXJuO1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICB3aGlsZShsZW4tLSl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkgcmV0dXJuIGxpc3RbbGVuXVxyXG4gIH1cclxufVxyXG5cclxuXy5nZXRQYXJhbU9iaiA9IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFyYW0pe1xyXG4gIHZhciBwYXJhbU9iaiA9IHt9O1xyXG4gIGlmKHBhcmFtKSB7XHJcbiAgICBmb3IodmFyIGkgaW4gcGFyYW0pIGlmKHBhcmFtLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgdmFyIHZhbHVlID0gcGFyYW1baV07XHJcbiAgICAgIHBhcmFtT2JqW2ldID0gIHZhbHVlICYmIHZhbHVlLnR5cGU9PT0nZXhwcmVzc2lvbic/IGNvbXBvbmVudC4kZ2V0KHZhbHVlKTogdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBwYXJhbU9iajtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdCRUdJTic6ICd7JyxcclxuICAnRU5EJzogJ30nLFxyXG4gICdQUkVDT01QSUxFJzogZmFsc2VcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJmdW5jdGlvbiBUZXh0Tm9kZSh0ZXh0KXtcclxuICAgIHRoaXMuX3ZhbHVlID0gdGV4dDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0Tm9kZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL1RleHROb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTU6MDU6MDEgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjQgMjM6MzM6MzRcclxuICovXHJcbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuLi8vcGFyc2VyL3NyYy9QYXJzZXIuanMnKTtcclxuXHJcbmlmKCF0aGlzLmRvY3VtZW50KXtcclxuICAgIC8qZXNsaW50LWRpc2FibGUqL1xyXG4gICAgZG9jdW1lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50LmpzJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEJhc2VSZW5kZXJTdG9yZShvYmope1xyXG5cclxuICAgIHRoaXMuX2JlZm9yZUNvbmZpZygpO1xyXG4gICAgdGhpcy5fY29uZmlnTW9kZWwob2JqKTtcclxuICAgIHRoaXMuX2FmdGVyQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9wYXJzZSgpO1xyXG59XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9iZWZvcmVDb25maWcgPSBmdW5jdGlvbigpe1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fYWZ0ZXJDb25maWcgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcodGhpcy5kYXRhKTtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbmZpZ01vZGVsID0gZnVuY3Rpb24obW9kZWwpe1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBtb2RlbCk7XHJcblxyXG4gICAgaWYoIW1vZGVsLmRhdGEpIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgdGhpcy5fbGlzdCA9IHt9O1xyXG4gICAgdGhpcy4kbGlzdCA9IHt9O1xyXG4gICAgdGhpcy4kcmVmcyA9IHt9O1xyXG5cclxuICAgIHRoaXMuX2RlZmluZXIgPSBtb2RlbDtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbihhc3QsIGxpc3RJbmZvLCBsaXN0QnVmZmVyLCBjdXJJbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKXtcclxuICAgIGlmKGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQodGhpcy5fY29tcGlsZShhc3RbaV0sIGxpc3RJbmZvLCBsaXN0QnVmZmVyLCBpLCByb290UGF0aCwgbGlzdE5hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcGlsZXJbYXN0LnR5cGVdKGFzdCwgdGhpcywgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGN1ckluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fcGFyc2UgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5BU1QgPSBuZXcgUGFyc2VyKHRoaXMudGVtcGxhdGUpLnBhcnNlKCk7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbigpe307XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9zZ18gPSBmdW5jdGlvbiAocGF0aCwgZGF0YSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmIChwYXRoIGluc3RhbmNlb2YgRXZlbnQpIHtcclxuICAgICAgICByZXN1bHQgPSBwYXRoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBkYXRhW3BhdGhdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZVJlbmRlclN0b3JlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0b3JlL0Jhc2VSZW5kZXJTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcblxyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxudmFyIG5vZGUgPSByZXF1aXJlKFwiLi9ub2RlLmpzXCIpO1xyXG52YXIgTGV4ZXIgPSByZXF1aXJlKFwiLi9MZXhlci5qc1wiKTtcclxudmFyIHZhck5hbWUgPSBfLnZhck5hbWU7XHJcbnZhciBjdHhOYW1lID0gXy5jdHhOYW1lO1xyXG52YXIgZXh0TmFtZSA9IF8uZXh0TmFtZTtcclxudmFyIGlzUGF0aCA9IF8ubWFrZVByZWRpY2F0ZShcIlNUUklORyBJREVOVCBOVU1CRVJcIik7XHJcbnZhciBpc0tleVdvcmQgPSBfLm1ha2VQcmVkaWNhdGUoXCJ0cnVlIGZhbHNlIHVuZGVmaW5lZCBudWxsIHRoaXMgQXJyYXkgRGF0ZSBKU09OIE1hdGggTmFOIFJlZ0V4cCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50IGVuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgcGFyc2VGbG9hdCBwYXJzZUludCBPYmplY3RcIik7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBQYXJzZXIoaW5wdXQsIG9wdHMpe1xyXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgdGhpcy50b2tlbnMgPSBuZXcgTGV4ZXIoaW5wdXQsIG9wdHMpLmxleCgpO1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB0aGlzLmxlbmd0aCA9IHRoaXMudG9rZW5zLmxlbmd0aDtcclxufVxyXG5cclxuXHJcbnZhciBvcCA9IFBhcnNlci5wcm90b3R5cGU7XHJcblxyXG5cclxub3AucGFyc2UgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB2YXIgcmVzPSB0aGlzLnByb2dyYW0oKTtcclxuICBpZih0aGlzLmxsKCkudHlwZSA9PT0gJ1RBR19DTE9TRScpe1xyXG4gICAgdGhpcy5lcnJvcihcIllvdSBtYXkgZ290IGEgdW5jbG9zZWQgVGFnXCIpXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbm9wLmxsID0gIGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgaWYoayA8IDApIGsgPSBrICsgMTtcclxuICB2YXIgcG9zID0gdGhpcy5wb3MgKyBrIC0gMTtcclxuICBpZihwb3MgPiB0aGlzLmxlbmd0aCAtIDEpe1xyXG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5sZW5ndGgtMV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLnRva2Vuc1twb3NdO1xyXG59XHJcbiAgLy8gbG9va2FoZWFkXHJcbm9wLmxhID0gZnVuY3Rpb24oayl7XHJcbiAgcmV0dXJuICh0aGlzLmxsKGspIHx8ICcnKS50eXBlO1xyXG59XHJcblxyXG5vcC5tYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGw7XHJcbiAgaWYoIShsbCA9IHRoaXMuZWF0KHR5cGUsIHZhbHVlKSkpe1xyXG4gICAgbGwgID0gdGhpcy5sbCgpO1xyXG4gICAgdGhpcy5lcnJvcignZXhwZWN0IFsnICsgdHlwZSArICh2YWx1ZSA9PSBudWxsPyAnJzonOicrIHZhbHVlKSArICddXCIgLT4gZ290IFwiWycgKyBsbC50eXBlICsgKHZhbHVlPT1udWxsPyAnJzonOicrbGwudmFsdWUpICsgJ10nLCBsbC5wb3MpXHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gbGw7XHJcbiAgfVxyXG59XHJcblxyXG5vcC5lcnJvciA9IGZ1bmN0aW9uKG1zZywgcG9zKXtcclxuICBtc2cgPSAgXCJcXG7jgJAgcGFyc2UgZmFpbGVkIOOAkSBcIiArIG1zZyArICAnOlxcblxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdHlwZW9mIHBvcyA9PT0gJ251bWJlcic/IHBvczogdGhpcy5sbCgpLnBvc3x8MCk7XHJcbiAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XHJcbn1cclxuXHJcbm9wLm5leHQgPSBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIHRoaXMucG9zICs9IGs7XHJcbn1cclxub3AuZWF0ID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBpZih0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpe1xyXG4gICAgZm9yKHZhciBsZW4gPSB0eXBlLmxlbmd0aCA7IGxlbi0tOyl7XHJcbiAgICAgIGlmKGxsLnR5cGUgPT09IHR5cGVbbGVuXSkge1xyXG4gICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIHJldHVybiBsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgaWYoIGxsLnR5cGUgPT09IHR5cGUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbGwudmFsdWUgPT09IHZhbHVlKSApe1xyXG4gICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICByZXR1cm4gbGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gcHJvZ3JhbVxyXG4vLyAgOkVPRlxyXG4vLyAgfCAoc3RhdGVtZW50KSogRU9GXHJcbm9wLnByb2dyYW0gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZW1lbnRzID0gW10sICBsbCA9IHRoaXMubGwoKTtcclxuICB3aGlsZShsbC50eXBlICE9PSAnRU9GJyAmJiBsbC50eXBlICE9PSdUQUdfQ0xPU0UnKXtcclxuXHJcbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICB9XHJcbiAgLy8gaWYobGwudHlwZSA9PT0gJ1RBR19DTE9TRScpIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGhhdmUgdW5tYXRjaGVkIFRhZ1wiKVxyXG4gIHJldHVybiBzdGF0ZW1lbnRzO1xyXG59XHJcblxyXG4vLyBzdGF0ZW1lbnRcclxuLy8gIDogeG1sXHJcbi8vICB8IGpzdFxyXG4vLyAgfCB0ZXh0XHJcbm9wLnN0YXRlbWVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgJ05BTUUnOlxyXG4gICAgY2FzZSAnVEVYVCc6XHJcbiAgICAgIHZhciB0ZXh0ID0gbGwudmFsdWU7XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB3aGlsZShsbCA9IHRoaXMuZWF0KFsnTkFNRScsICdURVhUJ10pKXtcclxuICAgICAgICB0ZXh0ICs9IGxsLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBub2RlLnRleHQodGV4dCk7XHJcbiAgICBjYXNlICdUQUdfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLnhtbCgpO1xyXG4gICAgY2FzZSAnT1BFTic6IFxyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlY3RpdmUoKTtcclxuICAgIGNhc2UgJ0VYUFJfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuLy8geG1sIFxyXG4vLyBzdGFnIHN0YXRlbWVudCogVEFHX0NMT1NFPyhpZiBzZWxmLWNsb3NlZCB0YWcpXHJcbm9wLnhtbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUsIGF0dHJzLCBjaGlsZHJlbiwgc2VsZkNsb3NlZDtcclxuICBuYW1lID0gdGhpcy5tYXRjaCgnVEFHX09QRU4nKS52YWx1ZTtcclxuICBhdHRycyA9IHRoaXMuYXR0cnMoKTtcclxuICBzZWxmQ2xvc2VkID0gdGhpcy5lYXQoJy8nKVxyXG4gIHRoaXMubWF0Y2goJz4nKTtcclxuICBpZiggIXNlbGZDbG9zZWQgJiYgIV8uaXNWb2lkVGFnKG5hbWUpICl7XHJcbiAgICBjaGlsZHJlbiA9IHRoaXMucHJvZ3JhbSgpO1xyXG4gICAgaWYoIXRoaXMuZWF0KCdUQUdfQ0xPU0UnLCBuYW1lKSkgdGhpcy5lcnJvcignZXhwZWN0IDwvJytuYW1lKyc+IGdvdCcrICdubyBtYXRjaGVkIGNsb3NlVGFnJylcclxuICB9XHJcbiAgcmV0dXJuIG5vZGUuZWxlbWVudChuYW1lLCBhdHRycywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vLyB4ZW50aXR5XHJcbi8vICAtcnVsZSh3cmFwIGF0dHJpYnV0ZSlcclxuLy8gIC1hdHRyaWJ1dGVcclxuLy9cclxuLy8gX19leGFtcGxlX19cclxuLy8gIG5hbWUgPSAxIHwgIFxyXG4vLyAgbmctaGlkZSB8XHJcbi8vICBvbi1jbGljaz17e319IHwgXHJcbi8vICB7eyNpZiBuYW1lfX1vbi1jbGljaz17e3h4fX17eyNlbHNlfX1vbi10YXA9e3t9fXt7L2lmfX1cclxuXHJcbm9wLnhlbnRpdHkgPSBmdW5jdGlvbihsbCl7XHJcbiAgdmFyIG5hbWUgPSBsbC52YWx1ZSwgdmFsdWUsIG1vZGlmaWVyO1xyXG4gIGlmKGxsLnR5cGUgPT09ICdOQU1FJyl7XHJcbiAgICAvL0Agb25seSBmb3IgdGVzdFxyXG4gICAgaWYofm5hbWUuaW5kZXhPZignLicpKXtcclxuICAgICAgdmFyIHRtcCA9IG5hbWUuc3BsaXQoJy4nKTtcclxuICAgICAgbmFtZSA9IHRtcFswXTtcclxuICAgICAgbW9kaWZpZXIgPSB0bXBbMV1cclxuXHJcbiAgICB9XHJcbiAgICBpZiggdGhpcy5lYXQoXCI9XCIpICkgdmFsdWUgPSB0aGlzLmF0dHZhbHVlKG1vZGlmaWVyKTtcclxuICAgIHJldHVybiBub2RlLmF0dHJpYnV0ZSggbmFtZSwgdmFsdWUsIG1vZGlmaWVyICk7XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbmFtZSAhPT0gJ2lmJykgdGhpcy5lcnJvcihcImN1cnJlbnQgdmVyc2lvbi4gT05MWSBSVUxFICNpZiAjZWxzZSAjZWxzZWlmIGlzIHZhbGlkIGluIHRhZywgdGhlIHJ1bGUgI1wiICsgbmFtZSArICcgaXMgaW52YWxpZCcpO1xyXG4gICAgcmV0dXJuIHRoaXNbJ2lmJ10odHJ1ZSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gc3RhZyAgICAgOjo9ICAgICc8JyBOYW1lIChTIGF0dHIpKiBTPyAnPicgIFxyXG4vLyBhdHRyICAgIDo6PSAgICAgTmFtZSBFcSBhdHR2YWx1ZVxyXG5vcC5hdHRycyA9IGZ1bmN0aW9uKGlzQXR0cmlidXRlKXtcclxuICB2YXIgZWF0XHJcbiAgaWYoIWlzQXR0cmlidXRlKXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIiwgXCJPUEVOXCJdXHJcbiAgfWVsc2V7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCJdXHJcbiAgfVxyXG5cclxuICB2YXIgYXR0cnMgPSBbXSwgbGw7XHJcbiAgd2hpbGUgKGxsID0gdGhpcy5lYXQoZWF0KSl7XHJcbiAgICBhdHRycy5wdXNoKHRoaXMueGVudGl0eSggbGwgKSlcclxuICB9XHJcbiAgcmV0dXJuIGF0dHJzO1xyXG59XHJcblxyXG4vLyBhdHR2YWx1ZVxyXG4vLyAgOiBTVFJJTkcgIFxyXG4vLyAgfCBOQU1FXHJcbm9wLmF0dHZhbHVlID0gZnVuY3Rpb24obWRmKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIk5BTUVcIjpcclxuICAgIGNhc2UgXCJVTlFcIjpcclxuICAgIGNhc2UgXCJTVFJJTkdcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IGxsLnZhbHVlO1xyXG4gICAgICBpZih+dmFsdWUuaW5kZXhPZihjb25maWcuQkVHSU4pICYmIH52YWx1ZS5pbmRleE9mKGNvbmZpZy5FTkQpICYmIG1kZiE9PSdjbXBsJyl7XHJcbiAgICAgICAgdmFyIGNvbnN0YW50ID0gdHJ1ZTtcclxuICAgICAgICB2YXIgcGFyc2VkID0gbmV3IFBhcnNlcih2YWx1ZSwgeyBtb2RlOiAyIH0pLnBhcnNlKCk7XHJcbiAgICAgICAgaWYocGFyc2VkLmxlbmd0aCA9PT0gMSAmJiBwYXJzZWRbMF0udHlwZSA9PT0gJ2V4cHJlc3Npb24nKSByZXR1cm4gcGFyc2VkWzBdO1xyXG4gICAgICAgIHZhciBib2R5ID0gW107XHJcbiAgICAgICAgcGFyc2VkLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICBpZighaXRlbS5jb25zdGFudCkgY29uc3RhbnQ9ZmFsc2U7XHJcbiAgICAgICAgICAvLyBzaWxlbnQgdGhlIG11dGlwbGUgaW50ZXBsYXRpb25cclxuICAgICAgICAgICAgYm9keS5wdXNoKGl0ZW0uYm9keSB8fCBcIidcIiArIGl0ZW0udGV4dC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIikgKyBcIidcIik7ICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBib2R5ID0gXCJbXCIgKyBib2R5LmpvaW4oXCIsXCIpICsgXCJdLmpvaW4oJycpXCI7XHJcbiAgICAgICAgdmFsdWUgPSBub2RlLmV4cHJlc3Npb24oYm9keSwgbnVsbCwgY29uc3RhbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIGNhc2UgXCJFWFBSX09QRU5cIjpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICAvLyBjYXNlIFwiT1BFTlwiOlxyXG4gICAgLy8gICBpZihsbC52YWx1ZSA9PT0gJ2luYycgfHwgbGwudmFsdWUgPT09ICdpbmNsdWRlJyl7XHJcbiAgICAvLyAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaW5jKCk7XHJcbiAgICAvLyAgIH1lbHNle1xyXG4gICAgLy8gICAgIHRoaXMuZXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBvbmx5IHN1cHBvcnQgaW50ZXBsYXRpb24gYW5kIHsjaW5jfSBzdGF0ZW1lbnQnKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7I319XHJcbm9wLmRpcmVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUgPSB0aGlzLmxsKCkudmFsdWU7XHJcbiAgdGhpcy5uZXh0KCk7XHJcbiAgaWYodHlwZW9mIHRoaXNbbmFtZV0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV0oKVxyXG4gIH1lbHNle1xyXG4gICAgdGhpcy5lcnJvcignVW5kZWZpbmVkIGRpcmVjdGl2ZVsnKyBuYW1lICsnXScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7fX1cclxub3AuaW50ZXJwbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCdFWFBSX09QRU4nKTtcclxuICB2YXIgcmVzID0gdGhpcy5leHByZXNzaW9uKHRydWUpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIHt7fn19XHJcbm9wLmluYyA9IG9wLmluY2x1ZGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb250ZW50ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIG5vZGUudGVtcGxhdGUoY29udGVudCk7XHJcbn1cclxuXHJcbi8vIHt7I2lmfX1cclxub3BbXCJpZlwiXSA9IGZ1bmN0aW9uKHRhZyl7XHJcbiAgdmFyIHRlc3QgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcblxyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG4gIHZhciBzdGF0ZW1lbnQgPSAhdGFnPyBcInN0YXRlbWVudFwiIDogXCJhdHRyc1wiO1xyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgdmFyIGxsLCBjbG9zZTtcclxuICB3aGlsZSggISAoY2xvc2UgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gICAgaWYoIGxsLnR5cGUgPT09ICdPUEVOJyApe1xyXG4gICAgICBzd2l0Y2goIGxsLnZhbHVlICl7XHJcbiAgICAgICAgY2FzZSAnZWxzZSc6XHJcbiAgICAgICAgICBjb250YWluZXIgPSBhbHRlcm5hdGU7XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIHRoaXMubWF0Y2goICdFTkQnICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdlbHNlaWYnOlxyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICBhbHRlcm5hdGUucHVzaCggdGhpc1tcImlmXCJdKHRhZykgKTtcclxuICAgICAgICAgIHJldHVybiBub2RlWydpZiddKCB0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUgKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29udGFpbmVyLnB1c2goIHRoaXNbc3RhdGVtZW50XSh0cnVlKSApO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpc1tzdGF0ZW1lbnRdKHRydWUpKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gaWYgc3RhdGVtZW50IG5vdCBtYXRjaGVkXHJcbiAgaWYoY2xvc2UudmFsdWUgIT09IFwiaWZcIikgdGhpcy5lcnJvcignVW5tYXRjaGVkIGlmIGRpcmVjdGl2ZScpXHJcbiAgcmV0dXJuIG5vZGVbXCJpZlwiXSh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xyXG59XHJcblxyXG5cclxuLy8gQG1hcmsgICBtdXN0YWNoZSBzeW50YXggaGF2ZSBuYXRydXJlIGRpcywgY2Fub3Qgd2l0aCBleHByZXNzaW9uXHJcbi8vIHt7I2xpc3R9fVxyXG5vcC5saXN0ID0gZnVuY3Rpb24oKXtcclxuICAvLyBzZXF1ZW5jZSBjYW4gYmUgYSBsaXN0IG9yIGhhc2hcclxuICB2YXIgc2VxdWVuY2UgPSB0aGlzLmV4cHJlc3Npb24oKSwgdmFyaWFibGUsIGxsLCB0cmFjaztcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0lERU5UJywgJ2FzJyk7XHJcblxyXG4gIHZhcmlhYmxlID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ0lERU5UJywgJ2J5Jykpe1xyXG4gICAgaWYodGhpcy5lYXQoJ0lERU5UJyx2YXJpYWJsZSArICdfaW5kZXgnKSl7XHJcbiAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICB0cmFjayA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gICAgICBpZih0cmFjay5jb25zdGFudCl7XHJcbiAgICAgICAgLy8gdHJ1ZSBpcyBtZWFucyBjb25zdGFudCwgd2UgaGFuZGxlIGl0IGp1c3QgbGlrZSB4eHhfaW5kZXguXHJcbiAgICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgd2hpbGUoICEobGwgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGlmKHRoaXMuZWF0KCdPUEVOJywgJ2Vsc2UnKSl7XHJcbiAgICAgIGNvbnRhaW5lciA9ICBhbHRlcm5hdGU7XHJcbiAgICAgIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBpZihsbC52YWx1ZSAhPT0gJ2xpc3QnKSB0aGlzLmVycm9yKCdleHBlY3QgJyArICdsaXN0IGdvdCAnICsgJy8nICsgbGwudmFsdWUgKyAnICcsIGxsLnBvcyApO1xyXG4gIHJldHVybiBub2RlLmxpc3Qoc2VxdWVuY2UsIHZhcmlhYmxlLCBjb25zZXF1ZW50LCBhbHRlcm5hdGUsIHRyYWNrKTtcclxufVxyXG5cclxuXHJcbm9wLmV4cHJlc3Npb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBleHByZXNzaW9uO1xyXG4gIGlmKHRoaXMuZWF0KCdAKCcpKXsgLy9vbmNlIGJpbmRcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICAgIGV4cHJlc3Npb24ub25jZSA9IHRydWU7XHJcbiAgICB0aGlzLm1hdGNoKCcpJylcclxuICB9ZWxzZXtcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICB9XHJcbiAgcmV0dXJuIGV4cHJlc3Npb247XHJcbn1cclxuXHJcbm9wLmV4cHIgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZGVwZW5kID0gW107XHJcblxyXG4gIHZhciBidWZmZXIgPSB0aGlzLmZpbHRlcigpXHJcblxyXG4gIHZhciBib2R5ID0gYnVmZmVyLmdldCB8fCBidWZmZXI7XHJcbiAgdmFyIHNldGJvZHkgPSBidWZmZXIuc2V0O1xyXG4gIHJldHVybiBub2RlLmV4cHJlc3Npb24oYm9keSwgc2V0Ym9keSwgIXRoaXMuZGVwZW5kLmxlbmd0aCwgYnVmZmVyLmZpbHRlcnMpO1xyXG59XHJcblxyXG5cclxuLy8gZmlsdGVyXHJcbi8vIGFzc2lnbiAoJ3wnIGZpbHRlcm5hbWVbJzonIGFyZ3NdKSAqIFxyXG5vcC5maWx0ZXIgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hc3NpZ24oKTtcclxuICB2YXIgbGwgPSB0aGlzLmVhdCgnfCcpO1xyXG4gIHZhciBidWZmZXIgPSBbXSwgZmlsdGVycyxzZXRCdWZmZXIsIHByZWZpeCxcclxuICAgIGF0dHIgPSBcInRcIiwgXHJcbiAgICBzZXQgPSBsZWZ0LnNldCwgZ2V0LCBcclxuICAgIHRtcCA9IFwiXCI7XHJcblxyXG4gIGlmKGxsKXtcclxuICAgIGlmKHNldCkge1xyXG4gICAgICBzZXRCdWZmZXIgPSBbXTtcclxuICAgICAgZmlsdGVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeCA9IFwiKGZ1bmN0aW9uKFwiICsgYXR0ciArIFwiKXtcIjtcclxuXHJcbiAgICBkb3tcclxuICAgICAgdmFyIGZpbHRlck5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICB0bXAgPSBhdHRyICsgXCIgPSBcIiArIGN0eE5hbWUgKyBcIi5fZl8oJ1wiICsgZmlsdGVyTmFtZSArIFwiJyApLmdldC5jYWxsKCBcIitfLmN0eE5hbWUgK1wiLFwiICsgYXR0ciA7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCc6Jykpe1xyXG4gICAgICAgIHRtcCArPVwiLCBcIisgdGhpcy5hcmd1bWVudHMoXCJ8XCIpLmpvaW4oXCIsXCIpICsgXCIpO1wiXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRtcCArPSAnKTsnXHJcbiAgICAgIH1cclxuICAgICAgYnVmZmVyLnB1c2godG1wKTtcclxuICAgICAgXHJcbiAgICAgIGlmKHNldCl7XHJcbiAgICAgICAgLy8gb25seSBpbiBydW50aW1lICx3ZSBjYW4gZGV0ZWN0ICB3aGV0aGVyICB0aGUgZmlsdGVyIGhhcyBhIHNldCBmdW5jdGlvbi4gXHJcbiAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlck5hbWUpO1xyXG4gICAgICAgIHNldEJ1ZmZlci51bnNoaWZ0KCB0bXAucmVwbGFjZShcIiApLmdldC5jYWxsXCIsIFwiICkuc2V0LmNhbGxcIikgKTtcclxuICAgICAgfVxyXG5cclxuICAgIH13aGlsZShsbCA9IHRoaXMuZWF0KCd8JykpO1xyXG4gICAgYnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyICk7XHJcbiAgICBzZXRCdWZmZXIgJiYgc2V0QnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyKTtcclxuXHJcbiAgICBnZXQgPSAgcHJlZml4ICsgYnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK2xlZnQuZ2V0K1wiKVwiO1xyXG4gICAgLy8gd2UgY2FsbCBiYWNrIHRvIHZhbHVlLlxyXG4gICAgaWYoc2V0QnVmZmVyKXtcclxuICAgICAgLy8gY2hhbmdlIF9zc19fKG5hbWUsIF9wXykgdG8gX3NfXyhuYW1lLCBmaWx0ZXJGbihfcF8pKTtcclxuICAgICAgc2V0ID0gc2V0LnJlcGxhY2UoXy5zZXROYW1lLCBcclxuICAgICAgICBwcmVmaXggKyBzZXRCdWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIr44CAXy5zZXROYW1l44CAK1wiKVwiICk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gdGhlIHNldCBmdW5jdGlvbiBpcyBkZXBlbmQgb24gdGhlIGZpbHRlciBkZWZpbml0aW9uLiBpZiBpdCBoYXZlIHNldCBtZXRob2QsIHRoZSBzZXQgd2lsbCB3b3JrXHJcbiAgICB2YXIgcmV0ID0gZ2V0c2V0KGdldCwgc2V0KTtcclxuICAgIHJldC5maWx0ZXJzID0gZmlsdGVycztcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBhc3NpZ25cclxuLy8gbGVmdC1oYW5kLWV4cHIgPSBjb25kaXRpb25cclxub3AuYXNzaWduID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuY29uZGl0aW9uKCksIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWyc9JywgJys9JywgJy09JywgJyo9JywgJy89JywgJyU9J10pKXtcclxuICAgIGlmKCFsZWZ0LnNldCkgdGhpcy5lcnJvcignaW52YWxpZCBsZWZ0aGFuZCBleHByZXNzaW9uIGluIGFzc2lnbm1lbnQgZXhwcmVzc2lvbicpO1xyXG4gICAgcmV0dXJuIGdldHNldCggbGVmdC5zZXQucmVwbGFjZSggXCIsXCIgKyBfLnNldE5hbWUsIFwiLFwiICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKS5yZXBsYWNlKFwiJz0nXCIsIFwiJ1wiK2xsLnR5cGUrXCInXCIpLCBsZWZ0LnNldCk7XHJcbiAgICAvLyByZXR1cm4gZ2V0c2V0KCcoJyArIGxlZnQuZ2V0ICsgbGwudHlwZSAgKyB0aGlzLmNvbmRpdGlvbigpLmdldCArICcpJywgbGVmdC5zZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gb3JcclxuLy8gb3IgPyBhc3NpZ24gOiBhc3NpZ25cclxub3AuY29uZGl0aW9uID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHRlc3QgPSB0aGlzLm9yKCk7XHJcbiAgaWYodGhpcy5lYXQoJz8nKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KFt0ZXN0LmdldCArIFwiP1wiLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXQsIFxyXG4gICAgICB0aGlzLm1hdGNoKFwiOlwiKS50eXBlLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXRdLmpvaW4oXCJcIikpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRlc3Q7XHJcbn1cclxuXHJcbi8vIGFuZFxyXG4vLyBhbmQgJiYgb3Jcclxub3Aub3IgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuYW5kKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCd8fCcpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnfHwnICsgdGhpcy5vcigpLmdldCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyBlcXVhbFxyXG4vLyBlcXVhbCAmJiBhbmRcclxub3AuYW5kID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmVxdWFsKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCcmJicpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnJiYnICsgdGhpcy5hbmQoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyByZWxhdGlvblxyXG4vLyBcclxuLy8gZXF1YWwgPT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT0gcmVsYXRpb25cclxuLy8gZXF1YWwgPT09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9PSByZWxhdGlvblxyXG5vcC5lcXVhbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJlbGF0aW9uKCksIGxsO1xyXG4gIC8vIEBwZXJmO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnPT0nLCchPScsICc9PT0nLCAnIT09J10pKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5lcXVhbCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gcmVsYXRpb24gPCBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIDw9IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID49IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIGluIGFkZGl0aXZlXHJcbm9wLnJlbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYWRkaXRpdmUoKSwgbGw7XHJcbiAgLy8gQHBlcmZcclxuICBpZihsbCA9ICh0aGlzLmVhdChbJzwnLCAnPicsICc+PScsICc8PSddKSB8fCB0aGlzLmVhdCgnSURFTlQnLCAnaW4nKSApKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMucmVsYXRpb24oKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIGFkZGl0aXZlIDpcclxuLy8gbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSArIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgLSBtdWx0aXZlXHJcbm9wLmFkZGl0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMubXVsdGl2ZSgpICxsbDtcclxuICBpZihsbD0gdGhpcy5lYXQoWycrJywnLSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5hZGRpdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gbXVsdGl2ZSA6XHJcbi8vIHVuYXJ5XHJcbi8vIG11bHRpdmUgKiB1bmFyeVxyXG4vLyBtdWx0aXZlIC8gdW5hcnlcclxuLy8gbXVsdGl2ZSAlIHVuYXJ5XHJcbm9wLm11bHRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yYW5nZSgpICxsbDtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJyonLCAnLycgLCclJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMubXVsdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5vcC5yYW5nZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnVuYXJ5KCksIGxsLCByaWdodDtcclxuXHJcbiAgaWYobGwgPSB0aGlzLmVhdCgnLi4nKSl7XHJcbiAgICByaWdodCA9IHRoaXMudW5hcnkoKTtcclxuICAgIHZhciBib2R5ID0gXHJcbiAgICAgIFwiKGZ1bmN0aW9uKHN0YXJ0LGVuZCl7dmFyIHJlcyA9IFtdLHN0ZXA9ZW5kPnN0YXJ0PzE6LTE7IGZvcih2YXIgaSA9IHN0YXJ0OyBlbmQ+c3RhcnQ/aSA8PSBlbmQ6IGk+PWVuZDsgaT1pK3N0ZXApe3Jlcy5wdXNoKGkpOyB9IHJldHVybiByZXMgfSkoXCIrbGVmdC5nZXQrXCIsXCIrcmlnaHQuZ2V0K1wiKVwiXHJcbiAgICByZXR1cm4gZ2V0c2V0KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gbGVmdGhhbmRcclxuLy8gKyB1bmFyeVxyXG4vLyAtIHVuYXJ5XHJcbi8vIH4gdW5hcnlcclxuLy8gISB1bmFyeVxyXG5vcC51bmFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWycrJywnLScsJ34nLCAnISddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCcoJyArIGxsLnR5cGUgKyB0aGlzLnVuYXJ5KCkuZ2V0ICsgJyknKSA7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gdGhpcy5tZW1iZXIoKVxyXG4gIH1cclxufVxyXG5cclxuLy8gY2FsbFtsZWZ0aGFuZF0gOlxyXG4vLyBtZW1iZXIgYXJnc1xyXG4vLyBtZW1iZXIgWyBleHByZXNzaW9uIF1cclxuLy8gbWVtYmVyIC4gaWRlbnQgIFxyXG5cclxub3AubWVtYmVyID0gZnVuY3Rpb24oYmFzZSwgbGFzdCwgcGF0aGVzLCBwcmV2QmFzZSl7XHJcbiAgdmFyIGxsLCBwYXRoLCBleHRWYWx1ZTtcclxuXHJcblxyXG4gIHZhciBvbmx5U2ltcGxlQWNjZXNzb3IgPSBmYWxzZTtcclxuICBpZighYmFzZSl7IC8vZmlyc3RcclxuICAgIHBhdGggPSB0aGlzLnByaW1hcnkoKTtcclxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhdGg7XHJcbiAgICBpZih0eXBlID09PSAnc3RyaW5nJyl7IFxyXG4gICAgICBwYXRoZXMgPSBbXTtcclxuICAgICAgcGF0aGVzLnB1c2goIHBhdGggKTtcclxuICAgICAgbGFzdCA9IHBhdGg7XHJcbiAgICAgIGV4dFZhbHVlID0gZXh0TmFtZSArIFwiLlwiICsgcGF0aFxyXG4gICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgcGF0aCArIFwiJywgXCIgKyB2YXJOYW1lICsgXCIsIFwiICsgZXh0TmFtZSArIFwiKVwiO1xyXG4gICAgICBvbmx5U2ltcGxlQWNjZXNzb3IgPSB0cnVlO1xyXG4gICAgfWVsc2V7IC8vUHJpbWF0aXZlIFR5cGVcclxuICAgICAgaWYocGF0aC5nZXQgPT09ICd0aGlzJyl7XHJcbiAgICAgICAgYmFzZSA9IGN0eE5hbWU7XHJcbiAgICAgICAgcGF0aGVzID0gWyd0aGlzJ107XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICAgICAgYmFzZSA9IHBhdGguZ2V0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7IC8vIG5vdCBmaXJzdCBlbnRlclxyXG4gICAgaWYodHlwZW9mIGxhc3QgPT09ICdzdHJpbmcnICYmIGlzUGF0aCggbGFzdCkgKXsgLy8gaXMgdmFsaWQgcGF0aFxyXG4gICAgICBwYXRoZXMucHVzaChsYXN0KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBpZihwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCkgdGhpcy5kZXBlbmQucHVzaChwYXRoZXMpO1xyXG4gICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZihsbCA9IHRoaXMuZWF0KFsnWycsICcuJywgJygnXSkpe1xyXG4gICAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgICBjYXNlICcuJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICB2YXIgdG1wTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHRtcE5hbWUgKyBcIicsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIlsnXCIgKyB0bXBOYW1lICsgXCInXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoIGJhc2UsIHRtcE5hbWUsIHBhdGhlcywgIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnWyc6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgcGF0aCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgIC8vIG1lYW5zIGZ1bmN0aW9uIGNhbGwsIHdlIG5lZWQgdGhyb3cgdW5kZWZpbmVkIGVycm9yIHdoZW4gY2FsbCBmdW5jdGlvblxyXG4gICAgICAgIC8vIGFuZCBjb25maXJtIHRoYXQgdGhlIGZ1bmN0aW9uIGNhbGwgd29udCBsb3NlIGl0cyBjb250ZXh0XHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oXCIgKyBwYXRoLmdldCArIFwiLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbXCIgKyBwYXRoLmdldCArIFwiXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1hdGNoKCddJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgcGF0aCwgcGF0aGVzLCBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJygnOlxyXG4gICAgICAgIC8vIGNhbGwoY2FsbGVlLCBhcmdzKVxyXG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHMoKS5qb2luKCcsJyk7XHJcbiAgICAgICAgYmFzZSA9ICBiYXNlK1wiKFwiICsgYXJncyArXCIpXCI7XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIG51bGwsIHBhdGhlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCBwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCApIHRoaXMuZGVwZW5kLnB1c2goIHBhdGhlcyApO1xyXG4gIHZhciByZXMgPSAge2dldDogYmFzZX07XHJcbiAgaWYobGFzdCl7XHJcbiAgICByZXMuc2V0ID0gY3R4TmFtZSArIFwiLl9zc18oXCIgKyBcclxuICAgICAgICAobGFzdC5nZXQ/IGxhc3QuZ2V0IDogXCInXCIrIGxhc3QgKyBcIidcIikgKyBcclxuICAgICAgICBcIixcIisgXy5zZXROYW1lICsgXCIsXCIrIFxyXG4gICAgICAgIChwcmV2QmFzZT9wcmV2QmFzZTpfLnZhck5hbWUpICsgXHJcbiAgICAgICAgXCIsICc9JywgXCIrICggb25seVNpbXBsZUFjY2Vzc29yPyAxIDogMCApICsgXCIpXCI7XHJcbiAgXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcbm9wLmFyZ3VtZW50cyA9IGZ1bmN0aW9uKGVuZCl7XHJcbiAgZW5kID0gZW5kIHx8ICcpJ1xyXG4gIHZhciBhcmdzID0gW107XHJcbiAgZG97XHJcbiAgICBpZih0aGlzLmxhKCkgIT09IGVuZCl7XHJcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmFzc2lnbigpLmdldClcclxuICAgIH1cclxuICB9d2hpbGUoIHRoaXMuZWF0KCcsJykpO1xyXG4gIHJldHVybiBhcmdzXHJcbn1cclxuXHJcblxyXG4vLyBwcmltYXJ5IDpcclxuLy8gdGhpcyBcclxuLy8gaWRlbnRcclxuLy8gbGl0ZXJhbFxyXG4vLyBhcnJheVxyXG4vLyBvYmplY3RcclxuLy8gKCBleHByZXNzaW9uIClcclxuXHJcbm9wLnByaW1hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwie1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcclxuICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XHJcbiAgICBjYXNlIFwiKFwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbigpO1xyXG4gICAgLy8gbGl0ZXJhbCBvciBpZGVudFxyXG4gICAgY2FzZSAnU1RSSU5HJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IFwiXCIgKyBsbC52YWx1ZTtcclxuICAgICAgdmFyIHF1b3RhID0gfnZhbHVlLmluZGV4T2YoXCInXCIpPyBcIlxcXCJcIjogXCInXCIgO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KHF1b3RhICsgdmFsdWUgKyBxdW90YSk7XHJcbiAgICBjYXNlICdOVU1CRVInOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgcmV0dXJuIGdldHNldCggXCJcIiArIGxsLnZhbHVlICk7XHJcbiAgICBjYXNlIFwiSURFTlRcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIGlmKGlzS2V5V29yZChsbC52YWx1ZSkpe1xyXG4gICAgICAgIHJldHVybiBnZXRzZXQoIGxsLnZhbHVlICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxsLnZhbHVlO1xyXG4gICAgZGVmYXVsdDogXHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgVG9rZW46ICcgKyBsbC50eXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIG9iamVjdFxyXG4vLyAge3Byb3BBc3NpZ24gWywgcHJvcEFzc2lnbl0gKiBbLF19XHJcblxyXG4vLyBwcm9wQXNzaWduXHJcbi8vICBwcm9wIDogYXNzaWduXHJcblxyXG4vLyBwcm9wXHJcbi8vICBTVFJJTkdcclxuLy8gIElERU5UXHJcbi8vICBOVU1CRVJcclxuXHJcbm9wLm9iamVjdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgneycpLnR5cGVdO1xyXG5cclxuICB2YXIgbGwgPSB0aGlzLmVhdCggWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10gKTtcclxuICB3aGlsZShsbCl7XHJcbiAgICBjb2RlLnB1c2goXCInXCIgKyBsbC52YWx1ZSArIFwiJ1wiICsgdGhpcy5tYXRjaCgnOicpLnR5cGUpO1xyXG4gICAgdmFyIGdldCA9IHRoaXMuYXNzaWduKCkuZ2V0O1xyXG4gICAgY29kZS5wdXNoKGdldCk7XHJcbiAgICBsbCA9IG51bGw7XHJcbiAgICBpZih0aGlzLmVhdChcIixcIikgJiYgKGxsID0gdGhpcy5lYXQoWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10pKSApIGNvZGUucHVzaChcIixcIik7XHJcbiAgfVxyXG4gIGNvZGUucHVzaCh0aGlzLm1hdGNoKCd9JykudHlwZSk7XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX1cclxufVxyXG5cclxuLy8gYXJyYXlcclxuLy8gWyBhc3NpZ25bLGFzc2lnbl0qXVxyXG5vcC5hcnJheSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgnWycpLnR5cGVdLCBpdGVtO1xyXG4gIGlmKCB0aGlzLmVhdChcIl1cIikgKXtcclxuXHJcbiAgICAgY29kZS5wdXNoKFwiXVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUoaXRlbSA9IHRoaXMuYXNzaWduKCkpe1xyXG4gICAgICBjb2RlLnB1c2goaXRlbS5nZXQpO1xyXG4gICAgICBpZih0aGlzLmVhdCgnLCcpKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gICAgICBlbHNlIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ10nKS50eXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX07XHJcbn1cclxuXHJcbi8vICcoJyBleHByZXNzaW9uICcpJ1xyXG5vcC5wYXJlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnKCcpO1xyXG4gIHZhciByZXMgPSB0aGlzLmZpbHRlcigpXHJcbiAgcmVzLmdldCA9ICcoJyArIHJlcy5nZXQgKyAnKSc7XHJcbiAgcmVzLnNldCA9IHJlcy5zZXQ7XHJcbiAgdGhpcy5tYXRjaCgnKScpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldHNldChnZXQsIHNldCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGdldDogZ2V0LFxyXG4gICAgc2V0OiBzZXRcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9QYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL190aW1lcnMtYnJvd3NlcmlmeUAyLjAuNEB0aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL19wcm9jZXNzQDAuMTEuMTBAcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHNoaW0gZm9yIGVzNVxyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIHRzdHIgPSAoe30pLnRvU3RyaW5nO1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKG8xLCBvMiApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYoIG8xW2ldID09PSB1bmRlZmluZWQpe1xyXG4gICAgbzFbaV0gPSBvMltpXVxyXG4gIH1cclxuICByZXR1cm4gbzI7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gU3RyaW5nIHByb3RvIDtcclxuICBleHRlbmQoU3RyaW5nLnByb3RvdHlwZSwge1xyXG4gICAgdHJpbTogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbiAgLy8gQXJyYXkgcHJvdG87XHJcbiAgZXh0ZW5kKEFycmF5LnByb3RvdHlwZSwge1xyXG4gICAgaW5kZXhPZjogZnVuY3Rpb24ob2JqLCBmcm9tKXtcclxuICAgICAgZnJvbSA9IGZyb20gfHwgMDtcclxuICAgICAgZm9yICh2YXIgaSA9IGZyb20sIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSByZXR1cm4gaTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9LFxyXG4gICAgLy8gcG9seWZpbGwgZnJvbSBNRE4gXHJcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgY3R4KXtcclxuICAgICAgdmFyIGsgPSAwO1xyXG5cclxuICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXHJcbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG5cclxuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwOyBcclxuXHJcbiAgICAgIGlmICggdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggY2FsbGJhY2sgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxyXG4gICAgICB3aGlsZSggayA8IGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGtWYWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKCBrIGluIE8gKSB7XHJcblxyXG4gICAgICAgICAga1ZhbHVlID0gT1sgayBdO1xyXG5cclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoIGN0eCwga1ZhbHVlLCBrLCBPICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGsrKztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEBkZXByZWNhdGVkXHJcbiAgICAvLyAgd2lsbCBiZSByZW1vdmVkIGF0IDAuNS4wXHJcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGZ1biwgY29udGV4dCl7XHJcblxyXG4gICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcclxuICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xyXG4gICAgICBpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuXHJcbiAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuICAgICAge1xyXG4gICAgICAgIGlmIChpIGluIHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIHZhbCA9IHRbaV07XHJcbiAgICAgICAgICBpZiAoZnVuLmNhbGwoY29udGV4dCwgdmFsLCBpLCB0KSlcclxuICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIEZ1bmN0aW9uIHByb3RvO1xyXG4gIGV4dGVuZChGdW5jdGlvbi5wcm90b3R5cGUsIHtcclxuICAgIGJpbmQ6IGZ1bmN0aW9uKGNvbnRleHQpe1xyXG4gICAgICB2YXIgZm4gPSB0aGlzO1xyXG4gICAgICB2YXIgcHJlQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBwcmVBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgXHJcbiAgLy8gQXJyYXlcclxuICBleHRlbmQoQXJyYXksIHtcclxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKGFycil7XHJcbiAgICAgIHJldHVybiB0c3RyLmNhbGwoYXJyKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9oZWxwZXIvc2hpbS5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNTQwNjQvaG93LXRvLWNvbnZlcnQtY2hhcmFjdGVycy10by1odG1sLWVudGl0aWVzLXVzaW5nLXBsYWluLWphdmFzY3JpcHRcclxudmFyIGVudGl0aWVzID0ge1xyXG4gICdxdW90JzozNCwgXHJcbiAgJ2FtcCc6MzgsIFxyXG4gICdhcG9zJzozOSwgXHJcbiAgJ2x0Jzo2MCwgXHJcbiAgJ2d0Jzo2MiwgXHJcbiAgJ25ic3AnOjE2MCwgXHJcbiAgJ2lleGNsJzoxNjEsIFxyXG4gICdjZW50JzoxNjIsIFxyXG4gICdwb3VuZCc6MTYzLCBcclxuICAnY3VycmVuJzoxNjQsIFxyXG4gICd5ZW4nOjE2NSwgXHJcbiAgJ2JydmJhcic6MTY2LCBcclxuICAnc2VjdCc6MTY3LCBcclxuICAndW1sJzoxNjgsIFxyXG4gICdjb3B5JzoxNjksIFxyXG4gICdvcmRmJzoxNzAsIFxyXG4gICdsYXF1byc6MTcxLCBcclxuICAnbm90JzoxNzIsIFxyXG4gICdzaHknOjE3MywgXHJcbiAgJ3JlZyc6MTc0LCBcclxuICAnbWFjcic6MTc1LCBcclxuICAnZGVnJzoxNzYsIFxyXG4gICdwbHVzbW4nOjE3NywgXHJcbiAgJ3N1cDInOjE3OCwgXHJcbiAgJ3N1cDMnOjE3OSwgXHJcbiAgJ2FjdXRlJzoxODAsIFxyXG4gICdtaWNybyc6MTgxLCBcclxuICAncGFyYSc6MTgyLCBcclxuICAnbWlkZG90JzoxODMsIFxyXG4gICdjZWRpbCc6MTg0LCBcclxuICAnc3VwMSc6MTg1LCBcclxuICAnb3JkbSc6MTg2LCBcclxuICAncmFxdW8nOjE4NywgXHJcbiAgJ2ZyYWMxNCc6MTg4LCBcclxuICAnZnJhYzEyJzoxODksIFxyXG4gICdmcmFjMzQnOjE5MCwgXHJcbiAgJ2lxdWVzdCc6MTkxLCBcclxuICAnQWdyYXZlJzoxOTIsIFxyXG4gICdBYWN1dGUnOjE5MywgXHJcbiAgJ0FjaXJjJzoxOTQsIFxyXG4gICdBdGlsZGUnOjE5NSwgXHJcbiAgJ0F1bWwnOjE5NiwgXHJcbiAgJ0FyaW5nJzoxOTcsIFxyXG4gICdBRWxpZyc6MTk4LCBcclxuICAnQ2NlZGlsJzoxOTksIFxyXG4gICdFZ3JhdmUnOjIwMCwgXHJcbiAgJ0VhY3V0ZSc6MjAxLCBcclxuICAnRWNpcmMnOjIwMiwgXHJcbiAgJ0V1bWwnOjIwMywgXHJcbiAgJ0lncmF2ZSc6MjA0LCBcclxuICAnSWFjdXRlJzoyMDUsIFxyXG4gICdJY2lyYyc6MjA2LCBcclxuICAnSXVtbCc6MjA3LCBcclxuICAnRVRIJzoyMDgsIFxyXG4gICdOdGlsZGUnOjIwOSwgXHJcbiAgJ09ncmF2ZSc6MjEwLCBcclxuICAnT2FjdXRlJzoyMTEsIFxyXG4gICdPY2lyYyc6MjEyLCBcclxuICAnT3RpbGRlJzoyMTMsIFxyXG4gICdPdW1sJzoyMTQsIFxyXG4gICd0aW1lcyc6MjE1LCBcclxuICAnT3NsYXNoJzoyMTYsIFxyXG4gICdVZ3JhdmUnOjIxNywgXHJcbiAgJ1VhY3V0ZSc6MjE4LCBcclxuICAnVWNpcmMnOjIxOSwgXHJcbiAgJ1V1bWwnOjIyMCwgXHJcbiAgJ1lhY3V0ZSc6MjIxLCBcclxuICAnVEhPUk4nOjIyMiwgXHJcbiAgJ3N6bGlnJzoyMjMsIFxyXG4gICdhZ3JhdmUnOjIyNCwgXHJcbiAgJ2FhY3V0ZSc6MjI1LCBcclxuICAnYWNpcmMnOjIyNiwgXHJcbiAgJ2F0aWxkZSc6MjI3LCBcclxuICAnYXVtbCc6MjI4LCBcclxuICAnYXJpbmcnOjIyOSwgXHJcbiAgJ2FlbGlnJzoyMzAsIFxyXG4gICdjY2VkaWwnOjIzMSwgXHJcbiAgJ2VncmF2ZSc6MjMyLCBcclxuICAnZWFjdXRlJzoyMzMsIFxyXG4gICdlY2lyYyc6MjM0LCBcclxuICAnZXVtbCc6MjM1LCBcclxuICAnaWdyYXZlJzoyMzYsIFxyXG4gICdpYWN1dGUnOjIzNywgXHJcbiAgJ2ljaXJjJzoyMzgsIFxyXG4gICdpdW1sJzoyMzksIFxyXG4gICdldGgnOjI0MCwgXHJcbiAgJ250aWxkZSc6MjQxLCBcclxuICAnb2dyYXZlJzoyNDIsIFxyXG4gICdvYWN1dGUnOjI0MywgXHJcbiAgJ29jaXJjJzoyNDQsIFxyXG4gICdvdGlsZGUnOjI0NSwgXHJcbiAgJ291bWwnOjI0NiwgXHJcbiAgJ2RpdmlkZSc6MjQ3LCBcclxuICAnb3NsYXNoJzoyNDgsIFxyXG4gICd1Z3JhdmUnOjI0OSwgXHJcbiAgJ3VhY3V0ZSc6MjUwLCBcclxuICAndWNpcmMnOjI1MSwgXHJcbiAgJ3V1bWwnOjI1MiwgXHJcbiAgJ3lhY3V0ZSc6MjUzLCBcclxuICAndGhvcm4nOjI1NCwgXHJcbiAgJ3l1bWwnOjI1NSwgXHJcbiAgJ2Zub2YnOjQwMiwgXHJcbiAgJ0FscGhhJzo5MTMsIFxyXG4gICdCZXRhJzo5MTQsIFxyXG4gICdHYW1tYSc6OTE1LCBcclxuICAnRGVsdGEnOjkxNiwgXHJcbiAgJ0Vwc2lsb24nOjkxNywgXHJcbiAgJ1pldGEnOjkxOCwgXHJcbiAgJ0V0YSc6OTE5LCBcclxuICAnVGhldGEnOjkyMCwgXHJcbiAgJ0lvdGEnOjkyMSwgXHJcbiAgJ0thcHBhJzo5MjIsIFxyXG4gICdMYW1iZGEnOjkyMywgXHJcbiAgJ011Jzo5MjQsIFxyXG4gICdOdSc6OTI1LCBcclxuICAnWGknOjkyNiwgXHJcbiAgJ09taWNyb24nOjkyNywgXHJcbiAgJ1BpJzo5MjgsIFxyXG4gICdSaG8nOjkyOSwgXHJcbiAgJ1NpZ21hJzo5MzEsIFxyXG4gICdUYXUnOjkzMiwgXHJcbiAgJ1Vwc2lsb24nOjkzMywgXHJcbiAgJ1BoaSc6OTM0LCBcclxuICAnQ2hpJzo5MzUsIFxyXG4gICdQc2knOjkzNiwgXHJcbiAgJ09tZWdhJzo5MzcsIFxyXG4gICdhbHBoYSc6OTQ1LCBcclxuICAnYmV0YSc6OTQ2LCBcclxuICAnZ2FtbWEnOjk0NywgXHJcbiAgJ2RlbHRhJzo5NDgsIFxyXG4gICdlcHNpbG9uJzo5NDksIFxyXG4gICd6ZXRhJzo5NTAsIFxyXG4gICdldGEnOjk1MSwgXHJcbiAgJ3RoZXRhJzo5NTIsIFxyXG4gICdpb3RhJzo5NTMsIFxyXG4gICdrYXBwYSc6OTU0LCBcclxuICAnbGFtYmRhJzo5NTUsIFxyXG4gICdtdSc6OTU2LCBcclxuICAnbnUnOjk1NywgXHJcbiAgJ3hpJzo5NTgsIFxyXG4gICdvbWljcm9uJzo5NTksIFxyXG4gICdwaSc6OTYwLCBcclxuICAncmhvJzo5NjEsIFxyXG4gICdzaWdtYWYnOjk2MiwgXHJcbiAgJ3NpZ21hJzo5NjMsIFxyXG4gICd0YXUnOjk2NCwgXHJcbiAgJ3Vwc2lsb24nOjk2NSwgXHJcbiAgJ3BoaSc6OTY2LCBcclxuICAnY2hpJzo5NjcsIFxyXG4gICdwc2knOjk2OCwgXHJcbiAgJ29tZWdhJzo5NjksIFxyXG4gICd0aGV0YXN5bSc6OTc3LCBcclxuICAndXBzaWgnOjk3OCwgXHJcbiAgJ3Bpdic6OTgyLCBcclxuICAnYnVsbCc6ODIyNiwgXHJcbiAgJ2hlbGxpcCc6ODIzMCwgXHJcbiAgJ3ByaW1lJzo4MjQyLCBcclxuICAnUHJpbWUnOjgyNDMsIFxyXG4gICdvbGluZSc6ODI1NCwgXHJcbiAgJ2ZyYXNsJzo4MjYwLCBcclxuICAnd2VpZXJwJzo4NDcyLCBcclxuICAnaW1hZ2UnOjg0NjUsIFxyXG4gICdyZWFsJzo4NDc2LCBcclxuICAndHJhZGUnOjg0ODIsIFxyXG4gICdhbGVmc3ltJzo4NTAxLCBcclxuICAnbGFycic6ODU5MiwgXHJcbiAgJ3VhcnInOjg1OTMsIFxyXG4gICdyYXJyJzo4NTk0LCBcclxuICAnZGFycic6ODU5NSwgXHJcbiAgJ2hhcnInOjg1OTYsIFxyXG4gICdjcmFycic6ODYyOSwgXHJcbiAgJ2xBcnInOjg2NTYsIFxyXG4gICd1QXJyJzo4NjU3LCBcclxuICAnckFycic6ODY1OCwgXHJcbiAgJ2RBcnInOjg2NTksIFxyXG4gICdoQXJyJzo4NjYwLCBcclxuICAnZm9yYWxsJzo4NzA0LCBcclxuICAncGFydCc6ODcwNiwgXHJcbiAgJ2V4aXN0Jzo4NzA3LCBcclxuICAnZW1wdHknOjg3MDksIFxyXG4gICduYWJsYSc6ODcxMSwgXHJcbiAgJ2lzaW4nOjg3MTIsIFxyXG4gICdub3Rpbic6ODcxMywgXHJcbiAgJ25pJzo4NzE1LCBcclxuICAncHJvZCc6ODcxOSwgXHJcbiAgJ3N1bSc6ODcyMSwgXHJcbiAgJ21pbnVzJzo4NzIyLCBcclxuICAnbG93YXN0Jzo4NzI3LCBcclxuICAncmFkaWMnOjg3MzAsIFxyXG4gICdwcm9wJzo4NzMzLCBcclxuICAnaW5maW4nOjg3MzQsIFxyXG4gICdhbmcnOjg3MzYsIFxyXG4gICdhbmQnOjg3NDMsIFxyXG4gICdvcic6ODc0NCwgXHJcbiAgJ2NhcCc6ODc0NSwgXHJcbiAgJ2N1cCc6ODc0NiwgXHJcbiAgJ2ludCc6ODc0NywgXHJcbiAgJ3RoZXJlNCc6ODc1NiwgXHJcbiAgJ3NpbSc6ODc2NCwgXHJcbiAgJ2NvbmcnOjg3NzMsIFxyXG4gICdhc3ltcCc6ODc3NiwgXHJcbiAgJ25lJzo4ODAwLCBcclxuICAnZXF1aXYnOjg4MDEsIFxyXG4gICdsZSc6ODgwNCwgXHJcbiAgJ2dlJzo4ODA1LCBcclxuICAnc3ViJzo4ODM0LCBcclxuICAnc3VwJzo4ODM1LCBcclxuICAnbnN1Yic6ODgzNiwgXHJcbiAgJ3N1YmUnOjg4MzgsIFxyXG4gICdzdXBlJzo4ODM5LCBcclxuICAnb3BsdXMnOjg4NTMsIFxyXG4gICdvdGltZXMnOjg4NTUsIFxyXG4gICdwZXJwJzo4ODY5LCBcclxuICAnc2RvdCc6ODkwMSwgXHJcbiAgJ2xjZWlsJzo4OTY4LCBcclxuICAncmNlaWwnOjg5NjksIFxyXG4gICdsZmxvb3InOjg5NzAsIFxyXG4gICdyZmxvb3InOjg5NzEsIFxyXG4gICdsYW5nJzo5MDAxLCBcclxuICAncmFuZyc6OTAwMiwgXHJcbiAgJ2xveic6OTY3NCwgXHJcbiAgJ3NwYWRlcyc6OTgyNCwgXHJcbiAgJ2NsdWJzJzo5ODI3LCBcclxuICAnaGVhcnRzJzo5ODI5LCBcclxuICAnZGlhbXMnOjk4MzAsIFxyXG4gICdPRWxpZyc6MzM4LCBcclxuICAnb2VsaWcnOjMzOSwgXHJcbiAgJ1NjYXJvbic6MzUyLCBcclxuICAnc2Nhcm9uJzozNTMsIFxyXG4gICdZdW1sJzozNzYsIFxyXG4gICdjaXJjJzo3MTAsIFxyXG4gICd0aWxkZSc6NzMyLCBcclxuICAnZW5zcCc6ODE5NCwgXHJcbiAgJ2Vtc3AnOjgxOTUsIFxyXG4gICd0aGluc3AnOjgyMDEsIFxyXG4gICd6d25qJzo4MjA0LCBcclxuICAnendqJzo4MjA1LCBcclxuICAnbHJtJzo4MjA2LCBcclxuICAncmxtJzo4MjA3LCBcclxuICAnbmRhc2gnOjgyMTEsIFxyXG4gICdtZGFzaCc6ODIxMiwgXHJcbiAgJ2xzcXVvJzo4MjE2LCBcclxuICAncnNxdW8nOjgyMTcsIFxyXG4gICdzYnF1byc6ODIxOCwgXHJcbiAgJ2xkcXVvJzo4MjIwLCBcclxuICAncmRxdW8nOjgyMjEsIFxyXG4gICdiZHF1byc6ODIyMiwgXHJcbiAgJ2RhZ2dlcic6ODIyNCwgXHJcbiAgJ0RhZ2dlcic6ODIyNSwgXHJcbiAgJ3Blcm1pbCc6ODI0MCwgXHJcbiAgJ2xzYXF1byc6ODI0OSwgXHJcbiAgJ3JzYXF1byc6ODI1MCwgXHJcbiAgJ2V1cm8nOjgzNjRcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgPSBlbnRpdGllcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGVsZW1lbnQ6IGZ1bmN0aW9uKG5hbWUsIGF0dHJzLCBjaGlsZHJlbil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnZWxlbWVudCcsXHJcbiAgICAgIHRhZzogbmFtZSxcclxuICAgICAgYXR0cnM6IGF0dHJzLFxyXG4gICAgICBjaGlsZHJlbjogY2hpbGRyZW5cclxuICAgIH1cclxuICB9LFxyXG4gIGF0dHJpYnV0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIG1kZil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBtZGY6IG1kZlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJpZlwiOiBmdW5jdGlvbih0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2lmJyxcclxuICAgICAgdGVzdDogdGVzdCxcclxuICAgICAgY29uc2VxdWVudDogY29uc2VxdWVudCxcclxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGVcclxuICAgIH1cclxuICB9LFxyXG4gIGxpc3Q6IGZ1bmN0aW9uKHNlcXVlbmNlLCB2YXJpYWJsZSwgYm9keSwgYWx0ZXJuYXRlLCB0cmFjayl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnbGlzdCcsXHJcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcclxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGUsXHJcbiAgICAgIHZhcmlhYmxlOiB2YXJpYWJsZSxcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgdHJhY2s6IHRyYWNrXHJcbiAgICB9XHJcbiAgfSxcclxuICBleHByZXNzaW9uOiBmdW5jdGlvbiggYm9keSwgc2V0Ym9keSwgY29uc3RhbnQsIGZpbHRlcnMgKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwiZXhwcmVzc2lvblwiLFxyXG4gICAgICBib2R5OiBib2R5LFxyXG4gICAgICBjb25zdGFudDogY29uc3RhbnQgfHwgZmFsc2UsXHJcbiAgICAgIHNldGJvZHk6IHNldGJvZHkgfHwgZmFsc2UsXHJcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnNcclxuICAgIH1cclxuICB9LFxyXG4gIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgIHRleHQ6IHRleHRcclxuICAgIH1cclxuICB9LFxyXG4gIHRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAndGVtcGxhdGUnLFxyXG4gICAgICBjb250ZW50OiB0ZW1wbGF0ZVxyXG4gICAgfVxyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvbm9kZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxuXHJcbi8vIHNvbWUgY3VzdG9tIHRhZyAgd2lsbCBjb25mbGljdCB3aXRoIHRoZSBMZXhlciBwcm9ncmVzc1xyXG52YXIgY29uZmxpY3RUYWcgPSB7XCJ9XCI6IFwie1wiLCBcIl1cIjogXCJbXCJ9LCBtYXAxLCBtYXAyO1xyXG4vLyBzb21lIG1hY3JvIGZvciBsZXhlclxyXG52YXIgbWFjcm8gPSB7XHJcbiAgJ05BTUUnOiAvKD86WzpfQS1aYS16XVstXFwuOl8wLTlBLVphLXpdKikvLFxyXG4gICdJREVOVCc6IC9bXFwkX0EtWmEtel1bXzAtOUEtWmEtelxcJF0qLyxcclxuICAnU1BBQ0UnOiAvW1xcclxcblxcdFxcZiBdL1xyXG59XHJcblxyXG5cclxudmFyIHRlc3QgPSAvYXwoYikvLmV4ZWMoXCJhXCIpO1xyXG52YXIgdGVzdFN1YkNhcHVyZSA9IHRlc3QgJiYgdGVzdFsxXSA9PT0gdW5kZWZpbmVkPyBcclxuICBmdW5jdGlvbihzdHIpeyByZXR1cm4gc3RyICE9PSB1bmRlZmluZWQgfVxyXG4gIDpmdW5jdGlvbihzdHIpe3JldHVybiAhIXN0cn07XHJcblxyXG5mdW5jdGlvbiB3cmFwSGFuZGVyKGhhbmRsZXIpe1xyXG4gIHJldHVybiBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiBoYW5kbGVyLCB2YWx1ZTogYWxsIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExleGVyKGlucHV0LCBvcHRzKXtcclxuICBpZihjb25mbGljdFRhZ1tjb25maWcuRU5EXSl7XHJcbiAgICB0aGlzLm1hcmtTdGFydCA9IGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdO1xyXG4gICAgdGhpcy5tYXJrRW5kID0gY29uZmlnLkVORDtcclxuICB9XHJcblxyXG4gIHRoaXMuaW5wdXQgPSAoaW5wdXR8fFwiXCIpLnRyaW0oKTtcclxuICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gIHRoaXMubWFwID0gdGhpcy5vcHRzLm1vZGUgIT09IDI/ICBtYXAxOiBtYXAyO1xyXG4gIHRoaXMuc3RhdGVzID0gW1wiSU5JVFwiXTtcclxuICBpZihvcHRzICYmIG9wdHMuZXhwcmVzc2lvbil7XHJcbiAgICAgdGhpcy5zdGF0ZXMucHVzaChcIkpTVFwiKTtcclxuICAgICB0aGlzLmV4cHJlc3Npb24gPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGxvID0gTGV4ZXIucHJvdG90eXBlXHJcblxyXG5cclxubG8ubGV4ID0gZnVuY3Rpb24oc3RyKXtcclxuICBzdHIgPSAoc3RyIHx8IHRoaXMuaW5wdXQpLnRyaW0oKTtcclxuICB2YXIgdG9rZW5zID0gW10sIHNwbGl0LCB0ZXN0LG1sZW4sIHRva2VuLCBzdGF0ZTtcclxuICB0aGlzLmlucHV0ID0gc3RyLCBcclxuICB0aGlzLm1hcmtzID0gMDtcclxuICAvLyBpbml0IHRoZSBwb3MgaW5kZXhcclxuICB0aGlzLmluZGV4PTA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlKHN0cil7XHJcbiAgICBpKytcclxuICAgIHN0YXRlID0gdGhpcy5zdGF0ZSgpO1xyXG4gICAgc3BsaXQgPSB0aGlzLm1hcFtzdGF0ZV0gXHJcbiAgICB0ZXN0ID0gc3BsaXQuVFJVTksuZXhlYyhzdHIpO1xyXG4gICAgaWYoIXRlc3Qpe1xyXG4gICAgICB0aGlzLmVycm9yKCdVbnJlY29naW5pemVkIFRva2VuJyk7XHJcbiAgICB9XHJcbiAgICBtbGVuID0gdGVzdFswXS5sZW5ndGg7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UobWxlbilcclxuICAgIHRva2VuID0gdGhpcy5fcHJvY2Vzcy5jYWxsKHRoaXMsIHRlc3QsIHNwbGl0LCBzdHIpXHJcbiAgICBpZih0b2tlbikgdG9rZW5zLnB1c2godG9rZW4pXHJcbiAgICB0aGlzLmluZGV4ICs9IG1sZW47XHJcbiAgICAvLyBpZihzdGF0ZSA9PSAnVEFHJyB8fCBzdGF0ZSA9PSAnSlNUJykgc3RyID0gdGhpcy5za2lwc3BhY2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIHRva2Vucy5wdXNoKHt0eXBlOiAnRU9GJ30pO1xyXG5cclxuICByZXR1cm4gdG9rZW5zO1xyXG59XHJcblxyXG5sby5lcnJvciA9IGZ1bmN0aW9uKG1zZyl7XHJcbiAgdGhyb3cgIEVycm9yKFwiUGFyc2UgRXJyb3I6IFwiICsgbXNnICsgICc6XFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0aGlzLmluZGV4KSk7XHJcbn1cclxuXHJcbmxvLl9wcm9jZXNzID0gZnVuY3Rpb24oYXJncywgc3BsaXQsc3RyKXtcclxuICAvLyBjb25zb2xlLmxvZyhhcmdzLmpvaW4oXCIsXCIpLCB0aGlzLnN0YXRlKCkpXHJcbiAgdmFyIGxpbmtzID0gc3BsaXQubGlua3MsIG1hcmNoZWQgPSBmYWxzZSwgdG9rZW47XHJcblxyXG4gIGZvcih2YXIgbGVuID0gbGlua3MubGVuZ3RoLCBpPTA7aTxsZW4gO2krKyl7XHJcbiAgICB2YXIgbGluayA9IGxpbmtzW2ldLFxyXG4gICAgICBoYW5kbGVyID0gbGlua1syXSxcclxuICAgICAgaW5kZXggPSBsaW5rWzBdO1xyXG4gICAgLy8gaWYoYXJnc1s2XSA9PT0gJz4nICYmIGluZGV4ID09PSA2KSBjb25zb2xlLmxvZygnaGFoYScpXHJcbiAgICBpZih0ZXN0U3ViQ2FwdXJlKGFyZ3NbaW5kZXhdKSkge1xyXG4gICAgICBtYXJjaGVkID0gdHJ1ZTtcclxuICAgICAgaWYoaGFuZGxlcil7XHJcbiAgICAgICAgdG9rZW4gPSBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3Muc2xpY2UoaW5kZXgsIGluZGV4ICsgbGlua1sxXSkpXHJcbiAgICAgICAgaWYodG9rZW4pICB0b2tlbi5wb3MgPSB0aGlzLmluZGV4O1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZighbWFyY2hlZCl7IC8vIGluIGllIGx0OCAuIHN1YiBjYXB0dXJlIGlzIFwiXCIgYnV0IG9udCBcclxuICAgIHN3aXRjaChzdHIuY2hhckF0KDApKXtcclxuICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICB0aGlzLmVudGVyKFwiVEFHXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJKU1RcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbjtcclxufVxyXG5sby5lbnRlciA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKVxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5sby5zdGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIHJldHVybiBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXTtcclxufVxyXG5cclxubG8ubGVhdmUgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIGlmKCFzdGF0ZSB8fCBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXSA9PT0gc3RhdGUpIHN0YXRlcy5wb3AoKVxyXG59XHJcblxyXG5cclxuTGV4ZXIuc2V0dXAgPSBmdW5jdGlvbigpe1xyXG4gIG1hY3JvLkVORCA9IGNvbmZpZy5FTkQ7XHJcbiAgbWFjcm8uQkVHSU4gPSBjb25maWcuQkVHSU47XHJcbiAgLy9cclxuICBtYXAxID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVRcclxuICAgIHJ1bGVzLkVOVEVSX0pTVCxcclxuICAgIHJ1bGVzLkVOVEVSX1RBRyxcclxuICAgIHJ1bGVzLlRFWFQsXHJcblxyXG4gICAgLy9UQUdcclxuICAgIHJ1bGVzLlRBR19OQU1FLFxyXG4gICAgcnVsZXMuVEFHX09QRU4sXHJcbiAgICBydWxlcy5UQUdfQ0xPU0UsXHJcbiAgICBydWxlcy5UQUdfUFVOQ0hPUixcclxuICAgIHJ1bGVzLlRBR19FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5UQUdfVU5RX1ZBTFVFLFxyXG4gICAgcnVsZXMuVEFHX1NUUklORyxcclxuICAgIHJ1bGVzLlRBR19TUEFDRSxcclxuICAgIHJ1bGVzLlRBR19DT01NRU5ULFxyXG5cclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcblxyXG4gIC8vIGlnbm9yZWQgdGhlIHRhZy1yZWxhdGl2ZSB0b2tlblxyXG4gIG1hcDIgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVCBubyA8IHJlc3RyaWN0XHJcbiAgICBydWxlcy5FTlRFUl9KU1QyLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZW5NYXAocnVsZXMpe1xyXG4gIHZhciBydWxlLCBtYXAgPSB7fSwgc2lnbjtcclxuICBmb3IodmFyIGkgPSAwLCBsZW4gPSBydWxlcy5sZW5ndGg7IGkgPCBsZW4gOyBpKyspe1xyXG4gICAgcnVsZSA9IHJ1bGVzW2ldO1xyXG4gICAgc2lnbiA9IHJ1bGVbMl0gfHwgJ0lOSVQnO1xyXG4gICAgKCBtYXBbc2lnbl0gfHwgKG1hcFtzaWduXSA9IHtydWxlczpbXSwgbGlua3M6W119KSApLnJ1bGVzLnB1c2gocnVsZSk7XHJcbiAgfVxyXG4gIHJldHVybiBzZXR1cChtYXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cChtYXApe1xyXG4gIHZhciBzcGxpdCwgcnVsZXMsIHRydW5rcywgaGFuZGxlciwgcmVnLCByZXRhaW4sIHJ1bGU7XHJcbiAgZnVuY3Rpb24gcmVwbGFjZUZuKGFsbCwgb25lKXtcclxuICAgIHJldHVybiB0eXBlb2YgbWFjcm9bb25lXSA9PT0gJ3N0cmluZyc/IFxyXG4gICAgICBfLmVzY2FwZVJlZ0V4cChtYWNyb1tvbmVdKSBcclxuICAgICAgOiBTdHJpbmcobWFjcm9bb25lXSkuc2xpY2UoMSwtMSk7XHJcbiAgfVxyXG5cclxuICBmb3IodmFyIGkgaW4gbWFwKXtcclxuXHJcbiAgICBzcGxpdCA9IG1hcFtpXTtcclxuICAgIHNwbGl0LmN1ckluZGV4ID0gMTtcclxuICAgIHJ1bGVzID0gc3BsaXQucnVsZXM7XHJcbiAgICB0cnVua3MgPSBbXTtcclxuXHJcbiAgICBmb3IodmFyIGogPSAwLGxlbiA9IHJ1bGVzLmxlbmd0aDsgajxsZW47IGorKyl7XHJcbiAgICAgIHJ1bGUgPSBydWxlc1tqXTsgXHJcbiAgICAgIHJlZyA9IHJ1bGVbMF07XHJcbiAgICAgIGhhbmRsZXIgPSBydWxlWzFdO1xyXG5cclxuICAgICAgaWYodHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICBoYW5kbGVyID0gd3JhcEhhbmRlcihoYW5kbGVyKTtcclxuICAgICAgfVxyXG4gICAgICBpZihfLnR5cGVPZihyZWcpID09PSAncmVnZXhwJykgcmVnID0gcmVnLnRvU3RyaW5nKCkuc2xpY2UoMSwgLTEpO1xyXG5cclxuICAgICAgcmVnID0gcmVnLnJlcGxhY2UoL1xceyhcXHcrKVxcfS9nLCByZXBsYWNlRm4pXHJcbiAgICAgIHJldGFpbiA9IF8uZmluZFN1YkNhcHR1cmUocmVnKSArIDE7IFxyXG4gICAgICBzcGxpdC5saW5rcy5wdXNoKFtzcGxpdC5jdXJJbmRleCwgcmV0YWluLCBoYW5kbGVyXSk7IFxyXG4gICAgICBzcGxpdC5jdXJJbmRleCArPSByZXRhaW47XHJcbiAgICAgIHRydW5rcy5wdXNoKHJlZyk7XHJcbiAgICB9XHJcbiAgICBzcGxpdC5UUlVOSyA9IG5ldyBSZWdFeHAoXCJeKD86KFwiICsgdHJ1bmtzLmpvaW4oXCIpfChcIikgKyBcIikpXCIpXHJcbiAgfVxyXG4gIHJldHVybiBtYXA7XHJcbn1cclxuXHJcbnZhciBydWxlcyA9IHtcclxuXHJcbiAgLy8gMS4gSU5JVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvLyBtb2RlMSdzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUOiBbL1teXFx4MDA8XSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUMjogWy9bXlxceDAwXSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBFTlRFUl9UQUc6IFsvW15cXHgwMF0qPyg/PTxbXFx3XFwvXFwhXSkvLCBmdW5jdGlvbihhbGwpeyBcclxuICAgIHRoaXMuZW50ZXIoJ1RBRycpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgVEVYVDogWy9bXlxceDAwXSsvLCAnVEVYVCcgXSxcclxuXHJcbiAgLy8gMi4gVEFHXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUQUdfTkFNRTogWy97TkFNRX0vLCAnTkFNRScsICdUQUcnXSxcclxuICBUQUdfVU5RX1ZBTFVFOiBbL1teXFx7fSZcIic9PjxgXFxyXFxuXFxmXFx0IF0rLywgJ1VOUScsICdUQUcnXSxcclxuXHJcbiAgVEFHX09QRU46IFsvPCh7TkFNRX0pXFxzKi8sIGZ1bmN0aW9uKGFsbCwgb25lKXsgLy9cIlxyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX09QRU4nLCB2YWx1ZTogb25lfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfQ0xPU0U6IFsvPFxcLyh7TkFNRX0pW1xcclxcblxcZlxcdCBdKj4vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfQ0xPU0UnLCB2YWx1ZTogb25lIH1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gICAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIFRBR19FTlRFUl9KU1Q6IFsvKD89e0JFR0lOfSkvLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuXHJcbiAgVEFHX1BVTkNIT1I6IFsvW1xcPlxcLz0mXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZihhbGwgPT09ICc+JykgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcXFwiLywgLyonKi8gIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyBcclxuICAgIHZhciB2YWx1ZSA9IG9uZSB8fCB0d28gfHwgXCJcIjtcclxuXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogdmFsdWV9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICBUQUdfU1BBQ0U6IFsve1NQQUNFfSsvLCBudWxsLCAnVEFHJ10sXHJcbiAgVEFHX0NPTU1FTlQ6IFsvPFxcIS0tKFteXFx4MDBdKj8pLS1cXD4vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5sZWF2ZSgpXHJcbiAgICAvLyB0aGlzLmxlYXZlKCdUQUcnKVxyXG4gIH0gLCdUQUcnXSxcclxuXHJcbiAgLy8gMy4gSlNUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBKU1RfT1BFTjogWyd7QkVHSU59I3tTUEFDRX0qKHtJREVOVH0pJywgZnVuY3Rpb24oYWxsLCBuYW1lKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdPUEVOJyxcclxuICAgICAgdmFsdWU6IG5hbWVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0xFQVZFOiBbL3tFTkR9LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKHRoaXMubWFya0VuZCA9PT0gYWxsICYmIHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9O1xyXG4gICAgaWYoIXRoaXMubWFya0VuZCB8fCAhdGhpcy5tYXJrcyApe1xyXG4gICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiAnRU5EJ31cclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLm1hcmtzLS07XHJcbiAgICAgIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ0xPU0U6IFsve0JFR0lOfVxccypcXC8oe0lERU5UfSlcXHMqe0VORH0vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdDTE9TRScsXHJcbiAgICAgIHZhbHVlOiBvbmVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NPTU1FTlQ6IFsve0JFR0lOfVxcIShbXlxceDAwXSo/KVxcIXtFTkR9LywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0VYUFJfT1BFTjogWyd7QkVHSU59JyxmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICBpZihhbGwgPT09IHRoaXMubWFya1N0YXJ0KXtcclxuICAgICAgaWYodGhpcy5leHByZXNzaW9uKSByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIGlmKHRoaXMuZmlyc3RFbnRlclN0YXJ0IHx8IHRoaXMubWFya3Mpe1xyXG4gICAgICAgIHRoaXMubWFya3MrK1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdFWFBSX09QRU4nLFxyXG4gICAgICBlc2NhcGU6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfSURFTlQ6IFsne0lERU5UfScsICdJREVOVCcsICdKU1QnXSxcclxuICBKU1RfU1BBQ0U6IFsvWyBcXHJcXG5cXGZdKy8sIG51bGwsICdKU1QnXSxcclxuICBKU1RfUFVOQ0hPUjogWy9bPSFdPz09fFstPT48KypcXC8lXFwhXT9cXD18XFx8XFx8fCYmfFxcQFxcKHxcXC5cXC58WzxcXD5cXFtcXF1cXChcXClcXC1cXHxcXHt9XFwrXFwqXFwvJT86XFwuISxdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7IHR5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwnSlNUJ10sXHJcblxyXG4gIEpTVF9TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVwiLywgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IC8vXCInXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogb25lIHx8IHR3byB8fCBcIlwifVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTlVNQkVSOiBbLyg/OlswLTldKlxcLlswLTldK3xbMC05XSspKGVcXGQrKT8vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnTlVNQkVSJywgdmFsdWU6IHBhcnNlRmxvYXQoYWxsLCAxMCl9O1xyXG4gIH0sICdKU1QnXVxyXG59XHJcblxyXG5cclxuLy8gc2V0dXAgd2hlbiBmaXJzdCBjb25maWdcclxuTGV4ZXIuc2V0dXAoKTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXhlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL0xleGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcbnZhciBFbGVtZW50ID0gcmVxdWlyZSgnLi9FbGVtZW50LmpzJyk7XHJcbnZhciBUZXh0Tm9kZSA9IHJlcXVpcmUoJy4vVGV4dE5vZGUuanMnKTtcclxuXHJcbnZhciBwcm90byA9IHtcclxuICAgIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBkb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24odGFnTmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50KHRhZ05hbWUpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZVRleHROb2RlOiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gbmV3IFRleHROb2RlKHRleHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGRvYyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkb2M7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoJy4vRG9jdW1lbnRGcmFnbWVudC5qcycpO1xyXG5cclxuZnVuY3Rpb24gRWxlbWVudCh0YWdOYW1lKXtcclxuICAgIHRoaXMuX3RhZ05hbWUgPSB0YWdOYW1lO1xyXG4gICAgdGhpcy5fYXR0cnMgPSBbXTtcclxuICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24oYXR0ck5hbWUsIGF0dHJWYWx1ZSl7XHJcbiAgICB2YXIgZXZlbnRQYXR0ZXJuID0gL29uLS87XHJcblxyXG4gICAgaWYoZXZlbnRQYXR0ZXJuLnRlc3QoYXR0ck5hbWUpKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5fYXR0cnMucHVzaCh7bmFtZTogYXR0ck5hbWUsIHZhbHVlOiBhdHRyVmFsdWV9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIsIGlzUG9wLCBhcmdDb250ZXh0KXtcclxuICAgIHRoaXMuX2V2ZW50cy5wdXNoKHtuYW1lOiBldmVudE5hbWUucmVwbGFjZSgvLS8sICcnKSwgdmFsdWU6IGhhbmRsZXIrJycsIGNvbnRleHQ6IGFyZ0NvbnRleHR9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgaWYobm9kZSBpbnN0YW5jZW9mIGRvY3VtZW50RnJhZ21lbnQpe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bm9kZS5fY2hpbGRyZW4ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZS5fY2hpbGRyZW5baV0pOyAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9FbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjUxOjUzIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTI1IDA3OjQxOjEyXHJcbiAqL1xyXG5mdW5jdGlvbiBNZXNzYWdlQnVzKCkge1xyXG4gICAgdGhpcy5fb25TZW5kV29ya2VyID0gW107XHJcbiAgICB0aGlzLl9iYXNlSWQgPSAwO1xyXG4gICAgdGhpcy5faW5pdFdvcmtlcigpO1xyXG4gICAgdGhpcy5fY3JlYXRlRXZlbnRzU3RvcmUoKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NyZWF0ZUV2ZW50c1N0b3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fZXZlbnRzU3RvcmUgPSB7fTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB2YXIgSW5mbyA9IHRoaXMuX2Rlc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5fcmVjZWl2ZUJ1c1Jlc29sdmVyKEluZm8pO1xyXG4gICAgdGhpcy5fZW1pdChJbmZvLmlkLCBJbmZvLnR5cGUsIEluZm8uZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVjZWl2ZUJ1c1Jlc29sdmVyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB0aGlzLl9idWZmZXIgPSBtZXNzYWdlO1xyXG4gICAgdGhpcy5fc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uIChldmVudFR5cGUsIGZuKSB7XHJcbiAgICB0aGlzLl9yZWdpc3RlcihldmVudFR5cGUsIGZuLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciB0eXBlID0gbWVzc2FnZS5kYXRhLnR5cGUsXHJcbiAgICAgICAgZGF0YSA9IG1lc3NhZ2UuZGF0YS5kYXRhLFxyXG4gICAgICAgIGlkID0gbWVzc2FnZS5kYXRhLmlkLFxyXG4gICAgICAgIG1hbWJhSUQgPSBtZXNzYWdlLmRhdGEubWFtYmFJRDtcclxuXHJcbiAgICByZXR1cm4geyBtYW1iYUlEOiBtYW1iYUlEICwgaWQ6IGlkLCB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH07XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3NlbmRJbmZvVG9Xb3JrZXIgPSBmdW5jdGlvbiAoSW5mbykge1xyXG4gICAgdmFyIF9vblNlbmRXb3JrZXIgPSB0aGlzLl9vblNlbmRXb3JrZXI7XHJcblxyXG4gICAgdGhpcy5fcG9zdE1lc3NhZ2UoSW5mbyk7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKF9vblNlbmRXb3JrZXIubGVuZ3RoKSB0aGlzLl9jaGVja1dhdGNoZXJzKF9vblNlbmRXb3JrZXIsIEluZm8pO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9jaGVja1dhdGNoZXJzID0gZnVuY3Rpb24gKHdhdGNoZXJzLCBJbmZvKSB7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IHdhdGNoZXJzLmxlbmd0aCAtIDEsIHdhdGNoZXI7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgd2F0Y2hlciA9IHdhdGNoZXJzW2ldO1xyXG4gICAgICAgIHdhdGNoZXIoSW5mbyk7XHJcbiAgICAgICAgd2F0Y2hlcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUub25TZW5kID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIucHVzaChmbik7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2J1ZmZlcjtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKG1lc3NhZ2UuaWQsIG1lc3NhZ2UudHlwZSwgZm4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3JlZ2lzdGVyID0gZnVuY3Rpb24gKGlkLCBldmVudE5hbWUsIGZuKSB7XHJcbiAgICB2YXIgX2V2ZW50c1N0b3JlID0gdGhpcy5fZXZlbnRzU3RvcmU7XHJcblxyXG4gICAgaWYoIV9ldmVudHNTdG9yZVtpZF0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXSA9IHt9O1xyXG5cclxuICAgIGlmIChfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdLndhdGNoZXJzLnB1c2goZm4pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSA9IHsgd2F0Y2hlcnM6IFtmbl0gfTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9lbWl0ID0gZnVuY3Rpb24gKGlkLCBldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZiAoX2V2ZW50c1N0b3JlW2lkXSAmJiBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0gJiYgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdLndhdGNoZXJzLmxlbmd0aClcclxuICAgICAgICB0aGlzLl9leGVjdXRlV2F0Y2hlcnMoX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdLndhdGNoZXJzLCBldmVudE5hbWUsIGRhdGEpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2V4ZWN1dGVXYXRjaGVycyA9IGZ1bmN0aW9uICh3YXRjaGVycywgZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICBmb3IgKHZhciBpID0gd2F0Y2hlcnMubGVuZ3RoIC0gMSwgd2F0Y2hlcjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlcihldmVudE5hbWUsIGRhdGEpO1xyXG4gICAgICAgIHdhdGNoZXJzLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUJ1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZXNzYWdlQnVzL01lc3NhZ2VCdXMuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NDg6NTYgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMTkgMjA6MTE6MzFcclxuICovXHJcblxyXG52YXIgRnJlZW1hbWJhID0gcmVxdWlyZSgnLi9zdG9yZS9VSVJlbmRlclN0b3JlLmpzJyk7XHJcbnZhciBNZXNzYWdlQnVzID0gcmVxdWlyZSgnLi9tZXNzYWdlQnVzL1VJTXNnQnVzLmpzJyk7XHJcblxyXG4oZnVuY3Rpb24ocm9vdCl7XHJcbiAgICBpZihyb290Lk5FSiAmJiBORUouZGVmaW5lKXtcclxuICAgICAgICBORUouZGVmaW5lKFtdLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgRnJlZW1hbWJhOiBGcmVlbWFtYmEsXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlQnVzOiBNZXNzYWdlQnVzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHdpbmRvdyAmJiB3aW5kb3cuZGVmaW5lKXtcclxuICAgICAgICB3aW5kb3cuZGVmaW5lKFtdLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgRnJlZW1hbWJhOiBGcmVlbWFtYmEsXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlQnVzOiBNZXNzYWdlQnVzXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGRvY3VtZW50ICYmIGRvY3VtZW50Lm5vZGVUeXBlKXtcclxuICAgICAgICB3aW5kb3cuRnJlZW1hbWJhID0ge1xyXG4gICAgICAgICAgICBGcmVlbWFtYmE6IEZyZWVtYW1iYSxcclxuICAgICAgICAgICAgTWVzc2FnZUJ1czogTWVzc2FnZUJ1c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYobW9kdWxlICYmIG1vZHVsZS5leHBvcnRzKXtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICAgICAgICAgRnJlZW1hbWJhOiBGcmVlbWFtYmEsXHJcbiAgICAgICAgICAgIE1lc3NhZ2VCdXM6IE1lc3NhZ2VCdXNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxufSkodGhpcyk7XHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdWlfaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obW9kdWxlKSB7XHJcblx0aWYoIW1vZHVsZS53ZWJwYWNrUG9seWZpbGwpIHtcclxuXHRcdG1vZHVsZS5kZXByZWNhdGUgPSBmdW5jdGlvbigpIHt9O1xyXG5cdFx0bW9kdWxlLnBhdGhzID0gW107XHJcblx0XHQvLyBtb2R1bGUucGFyZW50ID0gdW5kZWZpbmVkIGJ5IGRlZmF1bHRcclxuXHRcdGlmKCFtb2R1bGUuY2hpbGRyZW4pIG1vZHVsZS5jaGlsZHJlbiA9IFtdO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG1vZHVsZSwgXCJsb2FkZWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUubDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImlkXCIsIHtcclxuXHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlLmk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0bW9kdWxlLndlYnBhY2tQb2x5ZmlsbCA9IDE7XHJcblx0fVxyXG5cdHJldHVybiBtb2R1bGU7XHJcbn07XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL21vZHVsZS5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NDg6MjEgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjUgMDc6NDI6MjlcclxuICovXHJcblxyXG52YXIgRXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbHMvZXh0ZW5kLmpzJyk7XHJcbnZhciBCYXNlUmVuZGVyU3RvcmUgPSByZXF1aXJlKCcuL0Jhc2VSZW5kZXJTdG9yZS5qcycpO1xyXG52YXIgQ29tcGlsZXIgPSByZXF1aXJlKCcuLi9jb21waWxlci9tYWluVGhyZWFkL2NvbXBpbGVyLmpzJyk7XHJcbnZhciBWZG9tQ29tcGlsZXIgPSByZXF1aXJlKCcuLi92ZG9tL1Zkb21Db21waWxlci5qcycpO1xyXG5cclxuLyoq54q25oCB5p6a5Li+ICovXHJcbnZhciBJTklUSUFMX1JFTkRFUiA9ICdJTklUSUFMX1JFTkRFUic7XHJcbnZhciBVUERBVEVfUkVOREVSID0gJ1VQREFURV9SRU5ERVInO1xyXG52YXIgRElGRl9ERVRFQ1QgPSAnRElGRl9ERVRFQ1QnO1xyXG5cclxuLyoq5pON5L2c57G75Z6LICovXHJcbnZhciBSRVBMQUNFID0gJ1JFUExBQ0UnO1xyXG52YXIgREVMRVRFID0gJ0RFTEVURSc7XHJcbnZhciBBREQgPSAnQUREJztcclxuXHJcbmZ1bmN0aW9uIEZyZWVtYW1iYShjb25maWcpIHtcclxuICAgIHRoaXMuc3VwZXIoY29uZmlnKTtcclxuICAgIHRoaXMuX2NvbXBpbGVyID0gQ29tcGlsZXI7XHJcbiAgICB0aGlzLl9pZCA9IEZyZWVtYW1iYS5nZW5lcmF0ZUlEKCk7XHJcbiAgICB0aGlzLl9yZW5kZXJTdGF0ZSA9IElOSVRJQUxfUkVOREVSO1xyXG59XHJcblxyXG5FeHRlbmQoRnJlZW1hbWJhLCBCYXNlUmVuZGVyU3RvcmUpO1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS4kaW5qZWN0ID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIHRoaXMuY29udGFpbmVyTm9kZSA9IG5vZGU7XHJcbiAgICB0aGlzLiRyZW5kZXIoKTtcclxuICAgIHRoaXMuX3JlbmRlclN0YXRlID0gRElGRl9ERVRFQ1Q7XHJcbn07XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLiRyZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBpZih0aGlzLl90aW1lcil7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgc2VsZi5fcmVuZGVyKHNlbGYuX3JlbmRlclN0YXRlKTtcclxufTtcclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKFJFTkRFUl9TVEFURSl7XHJcbiAgICBzd2l0Y2goUkVOREVSX1NUQVRFKXtcclxuICAgICAgICBjYXNlICdJTklUSUFMX1JFTkRFUic6IFxyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsUmVuZGVyKCk7IGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0RJRkZfREVURUNUJzpcclxuICAgICAgICAgICAgdGhpcy5fZGlmZlJlbmRlcigpOyBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgfVxyXG59O1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5fdXBkYXRlV29ya2VyRG9tID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMubXNnQnVzLnJlY2VpdmUoeyBtYW1iYUlEOiB0aGlzLl9pZCwgdHlwZTogVVBEQVRFX1JFTkRFUiwgZGF0YTogeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSwgZGF0YTogdGhpcy5kYXRhIH19KTtcclxufTtcclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuX2RpZmZSZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgdGhpcy5tc2dCdXMucmVjZWl2ZSh7IG1hbWJhSUQ6IHRoaXMuX2lkLCB0eXBlOiB0aGlzLl9yZW5kZXJTdGF0ZSwgZGF0YTogeyB0ZW1wbGF0ZTogdGhpcy50ZW1wbGF0ZSwgZGF0YTogdGhpcy5kYXRhIH19KVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHR5cGUsIG1lc3NhZ2Upe1xyXG4gICAgICAgICAgICBzZWxmLl9kaWZmKG1lc3NhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG59O1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5fZGlmZiA9IGZ1bmN0aW9uKGRpZmZzKXtcclxuICAgIGZvcih2YXIgaT0wO2k8ZGlmZnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgdmFyIG9wcmF0ZVR5cGUgPSBkaWZmc1tpXS50eXBlLFxyXG4gICAgICAgICAgICBwcmV2RG9tID0gZGlmZnNbaV0ucHJldkRvbSxcclxuICAgICAgICAgICAgY3VyRG9tID0gZGlmZnNbaV0uY3VyRG9tO1xyXG5cclxuICAgICAgICBzd2l0Y2gob3ByYXRlVHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ1JFUExBQ0UnOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVwbGFjZU9wZXJhdGUocHJldkRvbSwgY3VyRG9tKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ0RFTEVURSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZWxldGVPcGVyYXRlKHByZXZEb20pOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxufTtcclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuX2FkZE9wZXJhdGUgPSBmdW5jdGlvbihwcmV2RG9tLCBjdXJEb20pe1xyXG4gICAgdmFyIHRhcmdldERvbSwgcGF0aCA9IGN1ckRvbS5fcGF0aCxcclxuICAgICAgICBsaXN0TmFtZSA9IGN1ckRvbS5fbGlzdE5hbWUsXHJcbiAgICAgICAgcm9vdE5vZGUgPSB0aGlzLnJvb3ROb2RlLFxyXG4gICAgICAgIHNvdXJjZSwgbGFzdEluZGV4O1xyXG5cclxuICAgIGlmKGxpc3ROYW1lKXtcclxuICAgICAgICB0aGlzLiRsaXN0W2xpc3ROYW1lXS5yZW5kZXIoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5a+75om+54i26IqC54K5JibnlJ/miJDmlrDoioLngrkgKi9cclxuICAgIHRhcmdldERvbSA9IHRoaXMuX2ZpbmRUYXJnZXREb20ocm9vdE5vZGUsIHBhdGgsIHRydWUpO1xyXG4gICAgc291cmNlID0gbmV3IFZkb21Db21waWxlcihjdXJEb20sIHRoaXMpLmNvbXBpbGUobnVsbCwgQUREKTtcclxuXHJcbiAgICAvKirmj5LlhaXmk43kvZwgKi9cclxuICAgIGxhc3RJbmRleCA9IHRhcmdldERvbS5fbGFzdEluZGV4O1xyXG4gICAgaWYobGFzdEluZGV4ID49IHRhcmdldERvbS5jaGlsZE5vZGVzLmxlbmd0aC0xKXtcclxuICAgICAgICB0YXJnZXREb20uYXBwZW5kKHNvdXJjZSk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB0YXJnZXREb20uaW5zZXJ0QmVmb3JlKHNvdXJjZSwgdGFyZ2V0RG9tLmNoaWxkTm9kZXNbbGFzdEluZGV4XSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLl9kZWxldGVPcGVyYXRlID0gZnVuY3Rpb24ocHJldkRvbSl7XHJcbiAgICB2YXIgcGF0aCA9IHByZXZEb20uX3BhdGgsIHRhcmdldERvbSxcclxuICAgICAgICByb290Tm9kZSA9IHRoaXMucm9vdE5vZGUsXHJcbiAgICAgICAgbGlzdE5hbWUgPSBwcmV2RG9tLl9saXN0TmFtZTtcclxuICAgIFxyXG4gICAgLyoq5qOA5rWL5YWD57Sg5piv5ZCm5a2Y5ZyoTGlzdOS4rSAqL1xyXG4gICAgaWYobGlzdE5hbWUpe1xyXG4gICAgICAgIHRoaXMuJGxpc3RbbGlzdE5hbWVdLnJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0YXJnZXREb20gPSB0aGlzLl9maW5kVGFyZ2V0RG9tKHJvb3ROb2RlLCBwYXRoKTtcclxuICAgIHRhcmdldERvbS5wYXJlbnROb2RlLnJlbW92ZSh0YXJnZXREb20pO1xyXG59O1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5fZmluZFRhcmdldERvbSA9IGZ1bmN0aW9uKHJvb3QsIHBhdGgsIGlzQWRkKXtcclxuICAgIHZhciB0YXJnZXREb20gPSByb290LFxyXG4gICAgICAgIGxhc3RJbmRleDtcclxuXHJcbiAgICBwYXRoID0gcGF0aC50cmltKCkuc3BsaXQoJyAnKTtcclxuICAgIHBhdGguc2hpZnQoKTtcclxuICAgIGxhc3RJbmRleCA9IGlzQWRkICYmIHBhdGgucG9wKCk7XHJcblxyXG4gICAgd2hpbGUocGF0aC5sZW5ndGgpe1xyXG4gICAgICAgIHRhcmdldERvbSA9IGdldE5vZGUodGFyZ2V0RG9tLCBwYXRoLnNoaWZ0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldE5vZGUocm9vdCwgY2hpbGRJbmRleCl7XHJcbiAgICAgICAgcmV0dXJuIHJvb3QuY2hpbGROb2Rlc1tjaGlsZEluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICBpZihsYXN0SW5kZXgpe1xyXG4gICAgICAgIHRhcmdldERvbS5fbGFzdEluZGV4ID0gbGFzdEluZGV4O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YXJnZXREb207XHJcbn07XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLl9yZXBsYWNlT3BlcmF0ZSA9IGZ1bmN0aW9uKHByZXZEb20sIGN1ckRvbSl7XHJcbiAgICB2YXIgcGF0aCA9IHByZXZEb20uX3BhdGgsIFxyXG4gICAgICAgIHRhcmdldERvbSwgc291cmNlLFxyXG4gICAgICAgIHJvb3ROb2RlID0gdGhpcy5yb290Tm9kZTtcclxuXHJcbiAgICB0YXJnZXREb20gPSB0aGlzLl9maW5kVGFyZ2V0RG9tKHJvb3ROb2RlLCBwYXRoKTtcclxuXHJcbiAgICAvKirmm7/mjaLmk43kvZwgKi9cclxuICAgIHNvdXJjZSA9IG5ldyBWZG9tQ29tcGlsZXIoY3VyRG9tLCB0aGlzKS5jb21waWxlKHRhcmdldERvbSwgUkVQTEFDRSk7XHJcbiAgICBzb3VyY2UgJiYgdGFyZ2V0RG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHNvdXJjZSwgdGFyZ2V0RG9tKTtcclxuXHJcbn07XHJcblxyXG5cclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuX2luaXRpYWxSZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIG5ld1Jvb3QgPSB0aGlzLmRvbVRyZWUgPSB0aGlzLl9jb21waWxlKHRoaXMuQVNUKSxcclxuICAgICAgICBjb250YWluZXJOb2RlID0gdGhpcy5jb250YWluZXJOb2RlLFxyXG4gICAgICAgIHJvb3ROb2RlID0gdGhpcy5yb290Tm9kZTtcclxuXHJcbiAgICB0aGlzLnJvb3ROb2RlID0gbmV3Um9vdC5jaGlsZHJlblswXTtcclxuICAgIHJvb3ROb2RlPyBjb250YWluZXJOb2RlLnJlcGxhY2VDaGlsZChuZXdSb290LCByb290Tm9kZSkgOiBjb250YWluZXJOb2RlLmFwcGVuZChuZXdSb290KTtcclxuXHJcbiAgICB0aGlzLm1zZ0J1cy5yZWNlaXZlKHsgbWFtYmFJRDogdGhpcy5faWQsIHR5cGU6IHRoaXMuX3JlbmRlclN0YXRlLCBkYXRhOiB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlLCBkYXRhOiB0aGlzLmRhdGEgfX0pO1xyXG59O1xyXG5cclxuLyoq55Sf5oiQ57uE5Lu25a6e5L6L55qE5ZSv5LiAaWQqL1xyXG5GcmVlbWFtYmEuZ2VuZXJhdGVJRCA9IGZ1bmN0aW9uKCl7XHJcbiAgICBpZih0aGlzLmN1cnJlbnRJRCl7XHJcbiAgICAgICAgcmV0dXJuICsrdGhpcy5jdXJyZW50SUQ7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SUQgPSAxO1xyXG4gICAgfVxyXG59O1xyXG5cclxuRnJlZW1hbWJhLmFkZEFzeW5jRXZlbnRzID0gZnVuY3Rpb24gKG5vZGUsIGV2ZW50cykge1xyXG4gICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKCdsaXN0LWNvbnRhaW5lcicpKSB7XHJcbiAgICAgICAgdGhpcy5fbGlzdC5jb250YWluZXIgPSBub2RlO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBub2RlLmRhdGFzZXQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBub2RlLmRhdGFzZXQubm9kZUlEID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGlmICghbm9kZS5jaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBGcmVlbWFtYmEuYWRkQXN5bmNFdmVudHMuY2FsbCh0aGlzLCBub2RlLmNoaWxkcmVuW2ldLCBldmVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHZhciBub2RlSWQgPSBub2RlLmRhdGFzZXQubm9kZWlkO1xyXG5cclxuICAgIGZvciAodmFyIGlkIGluIGV2ZW50cykge1xyXG4gICAgICAgIGlmIChpZCA9PSBub2RlSWQpIHtcclxuICAgICAgICAgICAgdmFyIGV2ZW50SHViID0gZXZlbnRzW2lkXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBldmVudEh1Yi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRleHQgPSBldmVudEh1YltqXS5jb250ZXh0O1xyXG4gICAgICAgICAgICAgICAgdmFyIGdldEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAnICsgZXZlbnRIdWJbal0udmFsdWUgKyAnOycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhhbmRsZXIgPSBnZXRIYW5kbGVyKHRoaXMsIGNvbnRleHQgfHwgdGhpcy5kYXRhLCAnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50SHViW2pdLm5hbWUsIGhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlIGV2ZW50c1tub2RlSWRdO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGcmVlbWFtYmE7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RvcmUvVUlSZW5kZXJTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTY6NDQ6MTIgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjEgMDE6NTI6NDRcclxuICovXHJcbnZhciBhdHRyUmVzb2x2ZXIgPSByZXF1aXJlKCcuL2F0dHJSZXNvbHZlci5qcycpO1xyXG52YXIgTGlzdCA9IHJlcXVpcmUoJy4uLy4uL2xpc3QvTGlzdC5qcycpO1xyXG5cclxuZnVuY3Rpb24gZWxlbWVudChhc3QsIGNvbnRleHQsIGxpc3RJbmZvKSB7XHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYXN0LnRhZyk7XHJcblxyXG4gICAgdmFyIGF0dHJzID0gYXN0LmF0dHJzLCBsaXN0QnVmZmVyO1xyXG4gICAgLyoq5aSE55CG5bGe5oCnICovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcclxuXHJcbiAgICAgICAgaWYoYXR0ci5uYW1lID09PSAnbGlzdCcgJiYgYXR0ci52YWx1ZSl7XHJcbiAgICAgICAgICAgIGxpc3RCdWZmZXIgPSBjb250ZXh0LiRsaXN0W2F0dHIudmFsdWVdID0gbmV3IExpc3Qoe2RhdGE6IGxpc3RJbmZvLCBub2RlOiBub2RlfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2ggKGF0dHIudHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlICdhdHRyaWJ1dGUnOiBhdHRyUmVzb2x2ZXIoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5aSE55CG5a2Q6IqC54K5ICovXHJcbiAgICBpZiAoYXN0LmNoaWxkcmVuKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhc3QuY2hpbGRyZW4ubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gYXN0LmNoaWxkcmVuW2pdO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNoaWxkRG9tID0gY29udGV4dC5fY29tcGlsZShjaGlsZCwgbGlzdEluZm8sIGxpc3RCdWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgaWYoY2hpbGQudHlwZSA9PT0gJ2xpc3QnKXtcclxuICAgICAgICAgICAgICAgIGxpc3RCdWZmZXIuc2V0QXN0KGFzdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNoaWxkRG9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGV4dChhc3QpIHtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXN0LnRleHQpO1xyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4cHJlc3Npb24oYXN0LCBjb250ZXh0LCBsaXN0SW5mbykge1xyXG4gICAgdmFyIHRleHQgPSAnJywgZ2V0VmFsdWU7XHJcbiAgICBcclxuICAgIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gKCcgKyBhc3QuYm9keSArICcpJyk7XHJcbiAgICB0ZXh0ID0gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyk7XHJcblxyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdChhc3QsIGNvbnRleHQsIGxpc3RJbmZvLCBsaXN0QnVmZmVyKSB7XHJcbiAgICB2YXIgbGlzdEJvZHkgPSBhc3QuYm9keSxcclxuICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpLFxyXG4gICAgICAgIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gKCcgKyBhc3Quc2VxdWVuY2UuYm9keSArICcpJyksXHJcbiAgICAgICAgYXJyYXlEYXRhID0gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyksXHJcbiAgICAgICAgdmFyaWFibGUgPSBhc3QudmFyaWFibGU7XHJcblxyXG4gICAgaWYobGlzdEJ1ZmZlcil7XHJcbiAgICAgICAgbGlzdEJ1ZmZlci5zZXREYXRhKGFycmF5RGF0YSk7XHJcbiAgICAgICAgbGlzdEJ1ZmZlci5zZXRQYXJlbnQoY29udGV4dCk7XHJcbiAgICAgICAgbGlzdEJ1ZmZlci5zZXROYW1lKHtpdGVtOiB2YXJpYWJsZSwgaW5kZXg6IHZhcmlhYmxlICsgJ19pbmRleCd9KTtcclxuICAgICAgICBsaXN0QnVmZmVyLnNldEl0ZW1Cb2R5KGxpc3RCb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFycmF5RGF0YS5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIHZhciBsaXN0SXRlbSA9IGl0ZW1Ob2RlKGxpc3RCb2R5LCBhcnJheURhdGFbal0sIGopO1xyXG5cclxuICAgICAgICBsaXN0QnVmZmVyICYmIGxpc3RCdWZmZXIuYWRkTGlzdEl0ZW0obGlzdEl0ZW0uY2hpbGRyZW5bMF0pO1xyXG5cclxuICAgICAgICBub2RlLmFwcGVuZChsaXN0SXRlbSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXRlbU5vZGUoYm9keSwgaXRlbSwgaW5kZXgpIHtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICB2YXIgbGlzdEluZm8gPSB7fTtcclxuXHJcbiAgICAgICAgbGlzdEluZm9bdmFyaWFibGVdID0gaXRlbTtcclxuICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZSArICdfaW5kZXgnXSA9IGluZGV4O1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvZHkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoY29udGV4dC5fY29tcGlsZShib2R5W2ldLCBsaXN0SW5mbykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgJ2VsZW1lbnQnOiBlbGVtZW50LFxyXG4gICAgJ3RleHQnOiB0ZXh0LFxyXG4gICAgJ2V4cHJlc3Npb24nOiBleHByZXNzaW9uLFxyXG4gICAgJ2xpc3QnOiBsaXN0XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcGlsZXIvbWFpblRocmVhZC9jb21waWxlci5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTY6NTE6MzMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjEgMDE6NDc6MjdcclxuICovXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyaWJ1dGUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pIHtcclxuICAgIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgYXR0ci52YWx1ZSxcclxuICAgICAgICBhdHRyVmFsdWU7XHJcbiAgICBzd2l0Y2ggKHZhbHVlVHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6IFxyXG4gICAgICAgICAgICBhdHRyVmFsdWUgPSBhdHRyLnZhbHVlOyBicmVhaztcclxuICAgICAgICBjYXNlICdvYmplY3QnOiBcclxuICAgICAgICAgICAgYXR0clZhbHVlID0gcmVzb2x2ZUF0dHJWYWx1ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbyk7IGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICB9XHJcbiAgICAvKipyZWbmi6bmiKogKi9cclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ3JlZicpe1xyXG4gICAgICAgIGNvbnRleHQuJHJlZnNbYXR0clZhbHVlXSA9IG5vZGU7XHJcbiAgICAgICAgbm9kZS5fcmVmTmFtZSA9IGF0dHJWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHJWYWx1ZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pIHtcclxuICAgIHZhciBpc0V2ZW50ID0gYXR0ci5uYW1lLnNsaWNlKDAsIDIpID09PSAnb24nO1xyXG5cclxuICAgIGlmIChpc0V2ZW50KSB7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zbGljZSgzKTtcclxuICAgICAgICBhdHRyLnZhbHVlLmJvZHkgPSBhdHRyLnZhbHVlLmJvZHkucmVwbGFjZSgvJ1xcJGV2ZW50Jy9nLCAnJGV2ZW50Jyk7XHJcbiAgICAgICAgdmFyIGdldEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiBmdW5jdGlvbigkZXZlbnQpe3JldHVybiAnICsgYXR0ci52YWx1ZS5ib2R5ICsgJzt9Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZ2V0SGFuZGxlcihjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKSwgZmFsc2UpO1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gKCcgKyBhdHRyLnZhbHVlLmJvZHkgKyAnKScpO1xyXG5cclxuICAgICAgICByZXR1cm4gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUF0dHJpYnV0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2F0dHJSZXNvbHZlci5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMjAgMTc6Mzg6MTUgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjEgMDE6NTI6MjRcclxuICovXHJcbmZ1bmN0aW9uIExpc3QoY29uZmlnKXtcclxuICAgIHRoaXMubm9kZSA9IGNvbmZpZy5ub2RlO1xyXG4gICAgdGhpcy5kYXRhID0gY29uZmlnLmRhdGE7XHJcbiAgICB0aGlzLnBhcmVudCA9IGNvbmZpZy5wYXJlbnQ7XHJcbiAgICB0aGlzLmxpc3RJdGVtcyA9IFtdO1xyXG59XHJcblxyXG5MaXN0LnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihpbmRleCwgbW9kZWwpe1xyXG4gICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG4gICAgZGF0YS5zcGxpY2UoaW5kZXgsIDAsIG1vZGVsKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5zZXREYXRhID0gZnVuY3Rpb24oYXJyYXkpe1xyXG4gICAgdGhpcy5kYXRhID0gYXJyYXk7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5zZXRBc3QgPSBmdW5jdGlvbihhc3Qpe1xyXG4gICAgdGhpcy5hc3QgPSBhc3Q7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5zZXRQYXJlbnQgPSBmdW5jdGlvbihwYXJlbnQpe1xyXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5hZGRMaXN0SXRlbSA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5saXN0SXRlbXMucHVzaChub2RlKTtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLnNldEl0ZW1Cb2R5ID0gZnVuY3Rpb24oYm9keSl7XHJcbiAgICB0aGlzLml0ZW1Bc3QgPSBib2R5O1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUuZ2V0Tm9kZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpcy5ub2RlO1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUuc2V0TmFtZSA9IGZ1bmN0aW9uKGNvbmZpZyl7XHJcbiAgICB0aGlzLml0ZW1OYW1lID0gY29uZmlnLml0ZW07XHJcbiAgICB0aGlzLmluZGV4TmFtZSA9IGNvbmZpZy5pbmRleDtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLm1vZGlmeSA9IGZ1bmN0aW9uKGluZGV4LCBtb2RlbCl7XHJcbiAgICB2YXIgdGFyZ2V0RG9tID0gdGhpcy5saXN0SXRlbXNbaW5kZXhdLFxyXG4gICAgICAgIGl0ZW1Bc3QgPSB0aGlzLml0ZW1Bc3QsIGl0ZW1OYW1lID0gdGhpcy5pdGVtTmFtZSxcclxuICAgICAgICBpbmRleE5hbWUgPSB0aGlzLmluZGV4TmFtZSwgdGVtcExpc3REYXRhID0ge307XHJcbiAgICBcclxuICAgIHRlbXBMaXN0RGF0YVtpdGVtTmFtZV0gPSBtb2RlbDtcclxuICAgIHRlbXBMaXN0RGF0YVtpbmRleE5hbWVdID0gaW5kZXg7XHJcblxyXG4gICAgdmFyIG5ld0NoaWxkID0gdGhpcy5wYXJlbnQuX2NvbXBpbGUoaXRlbUFzdCwgdGVtcExpc3REYXRhKTtcclxuXHJcbiAgICB0aGlzLmxpc3RJdGVtc1tpbmRleF0gPSBuZXdDaGlsZC5jaGlsZHJlblswXTtcclxuICAgIHRoaXMuZGF0YVtpbmRleF0gPSBtb2RlbDtcclxuXHJcbiAgICB0aGlzLm5vZGUucmVwbGFjZUNoaWxkKG5ld0NoaWxkLCB0YXJnZXREb20pO1xyXG4gICAgdGhpcy5wYXJlbnQuX3VwZGF0ZVdvcmtlckRvbSgpO1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24oaW5kZXgpe1xyXG4gICAgdGhpcy5kYXRhLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUucmVwbGFjZSA9IGZ1bmN0aW9uKG5ld0xpc3REYXRhKXtcclxuICAgIExpc3QucmVwbGFjZUxpc3QodGhpcy5kYXRhLCBuZXdMaXN0RGF0YSk7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIGlmKHRoaXMuX3RpbWVyKXtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc2VsZi5fcmVuZGVyKCk7XHJcbiAgICB9LCAwKTtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5saXN0SXRlbXMgPSBbXTtcclxuICAgIHRoaXMubm9kZS5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgICB2YXIgbmV3Qm9keSA9IHRoaXMucGFyZW50Ll9jb21waWxlKHRoaXMuYXN0LmNoaWxkcmVuLCBudWxsLCB0aGlzKTtcclxuICAgIHRoaXMubm9kZS5hcHBlbmQobmV3Qm9keSk7XHJcbiAgICB0aGlzLnBhcmVudC5fdXBkYXRlV29ya2VyRG9tKCk7XHJcbn07XHJcblxyXG5MaXN0LnJlcGxhY2VMaXN0ID0gZnVuY3Rpb24gKG9sZExpc3QsIG5ld0xpc3QpIHtcclxuICAgIGZvciAodmFyIGkgPSBvbGRMaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBuZXdMaXN0W2ldID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBvbGRMaXN0LnNwbGljZShpLCAxKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvbGRMaXN0W2ldID0gbmV3TGlzdFtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExpc3Q7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbGlzdC9MaXN0LmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJcclxuXHJcbmZ1bmN0aW9uIHZkb21Db21waWxlcih2ZG9tLCBjb250ZXh0KXtcclxuICAgIHRoaXMuX3Zkb20gPSB2ZG9tO1xyXG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XHJcbn1cclxuXHJcbnZkb21Db21waWxlci5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uKHRhcmdldERvbSwgdHlwZSl7XHJcbiAgICB2YXIgdmRvbSA9IHRoaXMuX3Zkb207XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzWydfJyt0aGlzLl90eXBlb2YodmRvbSldKHZkb20sIHRhcmdldERvbSwgdHlwZSk7XHJcbn07XHJcblxyXG52ZG9tQ29tcGlsZXIucHJvdG90eXBlLl90eXBlb2YgPSBmdW5jdGlvbih2ZG9tKXtcclxuICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgaWYodHlwZW9mIHZkb20uX3ZhbHVlID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmVzdWx0ID0gJ1RleHROb2RlJztcclxuICAgIH1lbHNlIGlmKHR5cGVvZiB2ZG9tLl90YWdOYW1lID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmVzdWx0ID0gJ0VsZW1lbnQnO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmVzdWx0ID0gJ0RvY3VtZW50RnJhZ21lbnQnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG52ZG9tQ29tcGlsZXIucHJvdG90eXBlLl9UZXh0Tm9kZSA9IGZ1bmN0aW9uKHZkb20pe1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZkb20uX3ZhbHVlKTtcclxufTtcclxuXHJcbnZkb21Db21waWxlci5wcm90b3R5cGUuX0VsZW1lbnQgPSBmdW5jdGlvbih2ZG9tLCB0YXJnZXREb20sIHR5cGUpe1xyXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLl9jb250ZXh0O1xyXG5cclxuICAgIGlmKHZkb20uX2xpc3ROYW1lKXtcclxuICAgICAgICBjb250ZXh0LiRsaXN0W3Zkb20uX2xpc3ROYW1lXS5yZW5kZXIoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodmRvbS5fdGFnTmFtZSk7XHJcblxyXG4gICAgLyoq6K6+572u5bGe5oCnICovXHJcbiAgICBmb3IodmFyIGk9MDtpPHZkb20uX2F0dHJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHZkb20uX2F0dHJzW2ldLm5hbWUsIHZkb20uX2F0dHJzW2ldLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirorr7nva7kuovku7YgKi9cclxuICAgIGZvcih2YXIgaj0wO2o8dmRvbS5fZXZlbnRzLmxlbmd0aDtqKyspe1xyXG4gICAgICAgIHZhciBoYW5kbGVyU3RyID0gdmRvbS5fZXZlbnRzW2pdLnZhbHVlO1xyXG4gICAgICAgIHZhciBoYW5kbGVyID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gJyArIGhhbmRsZXJTdHIgKyAnOycpO1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcih2ZG9tLl9ldmVudHNbal0ubmFtZSwgaGFuZGxlcihjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuabv+aNouWtkOiKgueCuSAqL1xyXG4gICAgaWYodHlwZSA9PT0gJ1JFUExBQ0UnKXtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgZm9yKHZhciBrPTA7azx0YXJnZXREb20uY2hpbGROb2Rlcy5sZW5ndGg7aysrKXsgXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLmFwcGVuZCh0YXJnZXREb20uY2hpbGROb2Rlc1trXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuYXBwZW5kKGNoaWxkcmVuKTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIC8qKue7keWumnJlZiAqL1xyXG4gICAgaWYodGFyZ2V0RG9tICYmIHRhcmdldERvbS5fcmVmTmFtZSl7XHJcbiAgICAgICAgY29udGV4dC4kcmVmc1t0YXJnZXREb20uX3JlZk5hbWVdID0gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0eXBlID09PSAnQUREJyl7XHJcbiAgICAgICAgdmFyIGNoaWxkQm9keSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGg9MDtoPHZkb20uX2NoaWxkcmVuLmxlbmd0aDtoKyspe1xyXG4gICAgICAgICAgICBjaGlsZEJvZHkuYXBwZW5kKG5ldyB2ZG9tQ29tcGlsZXIodmRvbS5fY2hpbGRyZW5baF0pLmNvbXBpbGUobnVsbCwgJ0FERCcpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5hcHBlbmQoY2hpbGRCb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbnZkb21Db21waWxlci5wcm90b3R5cGUuX0RvY3VtZW50RnJhZ21lbnQgPSBmdW5jdGlvbigpe1xyXG4gICAgXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZkb21Db21waWxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL1Zkb21Db21waWxlci5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NTA6MzggXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTY6NDA6MzhcclxuICovXHJcbnZhciBNZXNzYWdlQnVzID0gcmVxdWlyZSgnLi9NZXNzYWdlQnVzLmpzJyk7XHJcbnZhciBFeHRlbmQgPSByZXF1aXJlKCcuLi91dGlscy9leHRlbmQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIFVJTXNnQnVzKHdvcmtlcil7XHJcbiAgICB0aGlzLl93b3JrZXIgPSB3b3JrZXI7XHJcbiAgICB0aGlzLnN1cGVyKCk7XHJcbn1cclxuXHJcbkV4dGVuZChVSU1zZ0J1cywgTWVzc2FnZUJ1cyk7XHJcblxyXG5VSU1zZ0J1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIF93b3JrZXIgPSB0aGlzLl93b3JrZXI7XHJcblxyXG4gICAgX3dvcmtlci5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuVUlNc2dCdXMucHJvdG90eXBlLl9zZXJpYWxpemUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdmFyIEluZm8gPSB7fSxcclxuICAgICAgICBfYmFzZUlkID0gbWVzc2FnZS5pZCA9IHRoaXMuX2Jhc2VJZDtcclxuXHJcbiAgICBJbmZvLmlkID0gX2Jhc2VJZDtcclxuICAgIEluZm8udHlwZSA9IG1lc3NhZ2UudHlwZTtcclxuICAgIEluZm8uZGF0YSA9IG1lc3NhZ2UuZGF0YTtcclxuICAgIEluZm8ubWFtYmFJRCA9IG1lc3NhZ2UubWFtYmFJRDtcclxuXHJcbiAgICB0aGlzLl9zZW5kSW5mb1RvV29ya2VyKEluZm8pO1xyXG4gICAgdGhpcy5fYmFzZUlkKys7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcblVJTXNnQnVzLnByb3RvdHlwZS5fcG9zdE1lc3NhZ2UgPSBmdW5jdGlvbihJbmZvKXtcclxuICAgIHZhciBfd29ya2VyID0gdGhpcy5fd29ya2VyO1xyXG5cclxuICAgIF93b3JrZXIucG9zdE1lc3NhZ2UoSW5mbyk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFVJTXNnQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvVUlNc2dCdXMuanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=