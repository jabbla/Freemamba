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

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {__webpack_require__(10)();



var _  = module.exports;
var entities = __webpack_require__(11);
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






/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(7).setImmediate))

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
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 15:05:01 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-24 23:33:34
 */
var Parser = __webpack_require__(6);

if(!this.document){
    /*eslint-disable*/
    document = __webpack_require__(14);
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var _ = __webpack_require__(2);

var config = __webpack_require__(4);
var node = __webpack_require__(12);
var Lexer = __webpack_require__(13);
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
/* 7 */
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
__webpack_require__(8);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ }),
/* 8 */
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(9)))

/***/ }),
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var documentFragment = __webpack_require__(0);
var Element = __webpack_require__(15);
var TextNode = __webpack_require__(16);

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
/* 15 */
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
/* 16 */
/***/ (function(module, exports) {

function TextNode(text){
    this._value = text;
}

module.exports = TextNode;

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
var MessageBus = __webpack_require__(25);

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
var BaseRenderStore = __webpack_require__(5);
var Compiler = __webpack_require__(22);
var VdomCompiler = __webpack_require__(34);

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

/***/ }),
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNWJhODg0ZWM5NmIxMDZlYjFmMWQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9UZXh0Tm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy91aV9pbmRleC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9VSVJlbmRlclN0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2NvbXBpbGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2F0dHJSZXNvbHZlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGlzdC9MaXN0LmpzIiwid2VicGFjazovLy8uL3NyYy9tZXNzYWdlQnVzL1VJTXNnQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy92ZG9tL1Zkb21Db21waWxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCOzs7Ozs7NERDZEE7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE1BQU0sVUFBVSxXQUFXLE1BQU0sT0FBTyxhQUFhOztBQUVyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFVBQVU7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtFO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHFFQUFxRSxLQUFLO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0NBQXNDOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxPQUFPO0FBQ1Asa0JBQWtCO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaUNBQWlDLG1CQUFtQiw0QkFBNEIsV0FBVyxZQUFZLEVBQUUsYUFBYTtBQUNsSjtBQUNBOztBQUVBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSwwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUssS0FBSztBQUNWO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUcsS0FBSztBQUNSLG1EQUFtRDtBQUNuRDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLHdCOzs7Ozs7QUNsdUJBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLHNCQUFzQixFQUFFO0FBQ2xFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQ3pMRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7O0FDdkx0QztBQUNBO0FBQ0EsY0FBYzs7QUFFZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFNBQVM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsK0I7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSwyQjs7Ozs7O0FDblFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7QUN4REE7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixFQUFFLEtBQUssWUFBWTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZUFBZSxZQUFZOztBQUUzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDLE9BQU87QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0Esb0JBQW9CO0FBQ3BCLG9DQUFvQyxVQUFVO0FBQzlDO0FBQ0E7QUFDQSxpQ0FBaUMsbUJBQW1CO0FBQ3BEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUMsT0FBTztBQUM1QyxzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCLE9BQU87QUFDbEMseUM7QUFDQSwwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsTUFBTTtBQUNuQztBQUNBLG9CQUFvQjtBQUNwQixHQUFHOztBQUVIO0FBQ0EsNkJBQTZCLE1BQU07QUFDbkM7QUFDQSxvQkFBb0I7QUFDcEIsR0FBRzs7QUFFSCxzRDtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLEdBQUc7O0FBRUg7O0FBRUE7QUFDQTtBQUNBLGVBQWUsS0FBSztBQUNwQix3QkFBd0I7O0FBRXhCLGlCQUFpQixLQUFLLDBCQUEwQjtBQUNoRCxZQUFZO0FBQ1osR0FBRztBQUNILG9CQUFvQixLQUFLO0FBQ3pCO0FBQ0EsWUFBWTtBQUNaLEdBQUc7O0FBRUg7QUFDQSx1QkFBdUIsTUFBTTtBQUM3QjtBQUNBLEdBQUc7OztBQUdIO0FBQ0E7QUFDQSxZQUFZO0FBQ1osR0FBRztBQUNILHdFO0FBQ0E7O0FBRUEsWUFBWTtBQUNaLEdBQUc7O0FBRUgsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBLGVBQWUsTUFBTSxFQUFFLE1BQU0sR0FBRyxNQUFNO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGdCQUFnQixJQUFJO0FBQ3BCLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2QsS0FBSztBQUNMO0FBQ0EsY0FBYztBQUNkO0FBQ0EsR0FBRztBQUNILGdCQUFnQixNQUFNLE9BQU8sTUFBTSxLQUFLLElBQUk7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxrQkFBa0IsTUFBTSxnQkFBZ0IsSUFBSTtBQUM1QztBQUNBLEdBQUc7QUFDSCxvQkFBb0IsTUFBTTtBQUMxQjtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxnQkFBZ0IsTUFBTTtBQUN0QjtBQUNBLCtFQUErRTtBQUMvRSxZQUFZO0FBQ1osR0FBRzs7QUFFSCxnRUFBZ0U7QUFDaEUsWUFBWTtBQUNaLEdBQUc7QUFDSDtBQUNBLFlBQVk7QUFDWixHQUFHO0FBQ0g7OztBQUdBO0FBQ0E7Ozs7QUFJQSx1Qjs7Ozs7O0FDOVZBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxxQjs7Ozs7O0FDbEJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBLHNCQUFzQixpQ0FBaUM7QUFDdkQ7O0FBRUE7QUFDQSx1QkFBdUIseUVBQXlFO0FBQ2hHOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0Isd0JBQXdCO0FBQzVDLG1EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx5Qjs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTs7QUFFQSwwQjs7Ozs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFlBQVk7QUFDWjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBOztBQUVBOztBQUVBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCOzs7Ozs7Ozs7Ozs7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxDQUFDOzs7Ozs7Ozs7O0FDN0NEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsZ0RBQWdELDRDQUE0QztBQUNySDs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLG9EQUFvRCw0Q0FBNEM7QUFDekg7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBLGdCQUFnQixlQUFlO0FBQy9CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEseUJBQXlCLG9EQUFvRCw0Q0FBNEM7QUFDekg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QiwwQkFBMEI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLHFCQUFxQjtBQUNoRDtBQUNBLCtGQUErRjtBQUMvRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMkI7Ozs7OztBQ25OQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7O0FBRUE7QUFDQSwrREFBK0QsMkJBQTJCO0FBQzFGOztBQUVBO0FBQ0EsMEVBQTBFO0FBQzFFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHlCQUF5QjtBQUNoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLDJDQUEyQztBQUN2RTtBQUNBOztBQUVBLG1CQUFtQixzQkFBc0I7QUFDekM7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRTs7Ozs7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSxnQ0FBZ0M7O0FBRTlHO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0NBQW9DLFFBQVE7QUFDNUM7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQjs7Ozs7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCO0FBQ2pCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwwQjs7Ozs7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHFCQUFxQjtBQUNyQztBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHNCQUFzQjtBQUN0QztBQUNBLDZFQUE2RTtBQUM3RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw4QkFBOEIsSztBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQix3QkFBd0I7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQSw4QiIsImZpbGUiOiJGcmVlbWFtYmEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxOCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNWJhODg0ZWM5NmIxMDZlYjFmMWQiLCJmdW5jdGlvbiBkb2N1bWVudEZyYWdtZW50KCl7XHJcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG59XHJcbmRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnRGcmFnbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RvY3VtZW50RnJhZ21lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNDo1NDozMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxNDo1OTo0MFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGV4dGVuZChjaGlsZENsYXNzLCBiYXNlQ2xhc3Mpe1xyXG4gICAgdmFyIGZuID0gZnVuY3Rpb24oKXt9O1xyXG4gICAgZm4ucHJvdG90eXBlID0gYmFzZUNsYXNzLnByb3RvdHlwZTtcclxuICAgIGNoaWxkQ2xhc3MucHJvdG90eXBlID0gbmV3IGZuKCk7XHJcbiAgICBjaGlsZENsYXNzLnByb3RvdHlwZS5zdXBlciA9IGJhc2VDbGFzcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdXRpbHMvZXh0ZW5kLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwicmVxdWlyZSgnLi9oZWxwZXIvc2hpbS5qcycpKCk7XHJcblxyXG5cclxuXHJcbnZhciBfICA9IG1vZHVsZS5leHBvcnRzO1xyXG52YXIgZW50aXRpZXMgPSByZXF1aXJlKCcuL2hlbHBlci9lbnRpdGllcy5qcycpO1xyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIG8yc3RyID0gKHt9KS50b1N0cmluZztcclxudmFyIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09J3VuZGVmaW5lZCc/IHdpbmRvdzogZ2xvYmFsO1xyXG52YXIgTUFYX1BSSU9SSVRZID0gOTk5OTtcclxuXHJcblxyXG5fLm5vb3AgPSBmdW5jdGlvbigpe307XHJcbl8udWlkID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIF91aWQ9MDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBfdWlkKys7XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXy5leHRlbmQgPSBmdW5jdGlvbiggbzEsIG8yLCBvdmVycmlkZSApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYgKG8yLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkIHx8IG92ZXJyaWRlID09PSB0cnVlICl7XHJcbiAgICAgIG8xW2ldID0gbzJbaV1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG8xO1xyXG59XHJcblxyXG5fLmtleXMgPSBPYmplY3Qua2V5cz8gT2JqZWN0LmtleXM6IGZ1bmN0aW9uKG9iail7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICByZXMucHVzaChpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuXy5zb21lID0gZnVuY3Rpb24obGlzdCwgZm4pe1xyXG4gIGZvcih2YXIgaSA9MCxsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgIGlmKGZuKGxpc3RbaV0pKSByZXR1cm4gdHJ1ZVxyXG4gIH1cclxufVxyXG5cclxuXy52YXJOYW1lID0gJ2QnO1xyXG5fLnNldE5hbWUgPSAncF8nO1xyXG5fLmN0eE5hbWUgPSAnYyc7XHJcbl8uZXh0TmFtZSA9ICdlJztcclxuXHJcbl8ucldvcmQgPSAvXltcXCRcXHddKyQvO1xyXG5fLnJTaW1wbGVBY2Nlc3NvciA9IC9eW1xcJFxcd10rKFxcLltcXCRcXHddKykqJC87XHJcblxyXG5fLm5leHRUaWNrID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJz8gXHJcbiAgc2V0SW1tZWRpYXRlLmJpbmQod2luKSA6IFxyXG4gIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKSBcclxuICB9XHJcblxyXG5cclxuXHJcbl8ucHJlZml4ID0gXCIndXNlIHN0cmljdCc7dmFyIFwiICsgXy52YXJOYW1lICsgXCI9XCIgKyBfLmN0eE5hbWUgKyBcIi5kYXRhO1wiICsgIF8uZXh0TmFtZSAgKyBcIj1cIiArIF8uZXh0TmFtZSArIFwifHwnJztcIjtcclxuXHJcblxyXG5fLnNsaWNlID0gZnVuY3Rpb24ob2JqLCBzdGFydCwgZW5kKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yKHZhciBpID0gc3RhcnQgfHwgMCwgbGVuID0gZW5kIHx8IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICByZXMucHVzaChvYmpbaV0pXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIGJlYWN1c2Ugc2xpY2UgYW5kIHRvTG93ZXJDYXNlIGlzIGV4cGVuc2l2ZS4gd2UgaGFuZGxlIHVuZGVmaW5lZCBhbmQgbnVsbCBpbiBhbm90aGVyIHdheVxyXG5fLnR5cGVPZiA9IGZ1bmN0aW9uIChvKSB7XHJcbiAgcmV0dXJuIG8gPT0gbnVsbCA/IFN0cmluZyhvKSA6bzJzdHIuY2FsbChvKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXy5tYWtlUHJlZGljYXRlID0gZnVuY3Rpb24gbWFrZVByZWRpY2F0ZSh3b3JkcywgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIHdvcmRzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgd29yZHMgPSB3b3Jkcy5zcGxpdChcIiBcIik7XHJcbiAgICB9XHJcbiAgICB2YXIgZiA9IFwiXCIsXHJcbiAgICBjYXRzID0gW107XHJcbiAgICBvdXQ6IGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNhdHMubGVuZ3RoOyArK2ope1xyXG4gICAgICAgICAgaWYgKGNhdHNbal1bMF0ubGVuZ3RoID09PSB3b3Jkc1tpXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBjYXRzW2pdLnB1c2god29yZHNbaV0pO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlIG91dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0cy5wdXNoKFt3b3Jkc1tpXV0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY29tcGFyZVRvKGFycikge1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAxKSByZXR1cm4gZiArPSBcInJldHVybiBzdHIgPT09ICdcIiArIGFyclswXSArIFwiJztcIjtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0cil7XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpe1xyXG4gICAgICAgICAgIGYgKz0gXCJjYXNlICdcIiArIGFycltpXSArIFwiJzpcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcInJldHVybiB0cnVlfXJldHVybiBmYWxzZTtcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gdGhyZWUgbGVuZ3RoIGNhdGVnb3JpZXMsIGFuIG91dGVyXHJcbiAgICAvLyBzd2l0Y2ggZmlyc3QgZGlzcGF0Y2hlcyBvbiB0aGUgbGVuZ3RocywgdG8gc2F2ZSBvbiBjb21wYXJpc29ucy5cclxuICAgIGlmIChjYXRzLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICBjYXRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0ci5sZW5ndGgpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY2F0ID0gY2F0c1tpXTtcclxuICAgICAgICAgICAgZiArPSBcImNhc2UgXCIgKyBjYXRbMF0ubGVuZ3RoICsgXCI6XCI7XHJcbiAgICAgICAgICAgIGNvbXBhcmVUbyhjYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmICs9IFwifVwiO1xyXG5cclxuICAgICAgICAvLyBPdGhlcndpc2UsIHNpbXBseSBnZW5lcmF0ZSBhIGZsYXQgYHN3aXRjaGAgc3RhdGVtZW50LlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb21wYXJlVG8od29yZHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcInN0clwiLCBmKTtcclxufVxyXG5cclxuXHJcbl8udHJhY2tFcnJvclBvcyA9IChmdW5jdGlvbiAoKXtcclxuICAvLyBsaW5lYnJlYWtcclxuICB2YXIgbGIgPSAvXFxyXFxufFtcXG5cXHJcXHUyMDI4XFx1MjAyOV0vZztcclxuICB2YXIgbWluUmFuZ2UgPSAyMCwgbWF4UmFuZ2UgPSAyMDtcclxuICBmdW5jdGlvbiBmaW5kTGluZShsaW5lcywgcG9zKXtcclxuICAgIHZhciB0bXBMZW4gPSAwO1xyXG4gICAgZm9yKHZhciBpID0gMCxsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICAgIHZhciBsaW5lTGVuID0gKGxpbmVzW2ldIHx8IFwiXCIpLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmKHRtcExlbiArIGxpbmVMZW4gPiBwb3MpIHtcclxuICAgICAgICByZXR1cm4ge251bTogaSwgbGluZTogbGluZXNbaV0sIHN0YXJ0OiBwb3MgLSBpIC0gdG1wTGVuICwgcHJldjpsaW5lc1tpLTFdLCBuZXh0OiBsaW5lc1tpKzFdIH07XHJcbiAgICAgIH1cclxuICAgICAgLy8gMSBpcyBmb3IgdGhlIGxpbmVicmVha1xyXG4gICAgICB0bXBMZW4gPSB0bXBMZW4gKyBsaW5lTGVuIDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZm9ybWF0TGluZShzdHIsICBzdGFydCwgbnVtLCB0YXJnZXQpe1xyXG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICB2YXIgbWluID0gc3RhcnQgLSBtaW5SYW5nZTtcclxuICAgIGlmKG1pbiA8IDApIG1pbiA9IDA7XHJcbiAgICB2YXIgbWF4ID0gc3RhcnQgKyBtYXhSYW5nZTtcclxuICAgIGlmKG1heCA+IGxlbikgbWF4ID0gbGVuO1xyXG5cclxuICAgIHZhciByZW1haW4gPSBzdHIuc2xpY2UobWluLCBtYXgpO1xyXG4gICAgdmFyIHByZWZpeCA9IFwiW1wiICsobnVtKzEpICsgXCJdIFwiICsgKG1pbiA+IDA/IFwiLi5cIiA6IFwiXCIpXHJcbiAgICB2YXIgcG9zdGZpeCA9IG1heCA8IGxlbiA/IFwiLi5cIjogXCJcIjtcclxuICAgIHZhciByZXMgPSBwcmVmaXggKyByZW1haW4gKyBwb3N0Zml4O1xyXG4gICAgaWYodGFyZ2V0KSByZXMgKz0gXCJcXG5cIiArIG5ldyBBcnJheShzdGFydC1taW4gKyBwcmVmaXgubGVuZ3RoICsgMSkuam9pbihcIiBcIikgKyBcIl5eXlwiO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBwb3Mpe1xyXG4gICAgaWYocG9zID4gaW5wdXQubGVuZ3RoLTEpIHBvcyA9IGlucHV0Lmxlbmd0aC0xO1xyXG4gICAgbGIubGFzdEluZGV4ID0gMDtcclxuICAgIHZhciBsaW5lcyA9IGlucHV0LnNwbGl0KGxiKTtcclxuICAgIHZhciBsaW5lID0gZmluZExpbmUobGluZXMscG9zKTtcclxuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnQsIG51bSA9IGxpbmUubnVtO1xyXG5cclxuICAgIHJldHVybiAobGluZS5wcmV2PyBmb3JtYXRMaW5lKGxpbmUucHJldiwgc3RhcnQsIG51bS0xICkgKyAnXFxuJzogJycgKSArIFxyXG4gICAgICBmb3JtYXRMaW5lKGxpbmUubGluZSwgc3RhcnQsIG51bSwgdHJ1ZSkgKyAnXFxuJyArIFxyXG4gICAgICAobGluZS5uZXh0PyBmb3JtYXRMaW5lKGxpbmUubmV4dCwgc3RhcnQsIG51bSsxICkgKyAnXFxuJzogJycgKTtcclxuXHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXHJcbnZhciBpZ25vcmVkUmVmID0gL1xcKChcXD9cXCF8XFw/XFw6fFxcP1xcPSkvZztcclxuXy5maW5kU3ViQ2FwdHVyZSA9IGZ1bmN0aW9uIChyZWdTdHIpIHtcclxuICB2YXIgbGVmdCA9IDAsXHJcbiAgICByaWdodCA9IDAsXHJcbiAgICBsZW4gPSByZWdTdHIubGVuZ3RoLFxyXG4gICAgaWdub3JlZCA9IHJlZ1N0ci5tYXRjaChpZ25vcmVkUmVmKTsgLy8gaWdub3JlZCB1bmNhcHR1cmVcclxuICBpZihpZ25vcmVkKSBpZ25vcmVkID0gaWdub3JlZC5sZW5ndGhcclxuICBlbHNlIGlnbm9yZWQgPSAwO1xyXG4gIGZvciAoOyBsZW4tLTspIHtcclxuICAgIHZhciBsZXR0ZXIgPSByZWdTdHIuY2hhckF0KGxlbik7XHJcbiAgICBpZiAobGVuID09PSAwIHx8IHJlZ1N0ci5jaGFyQXQobGVuIC0gMSkgIT09IFwiXFxcXFwiICkgeyBcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIoXCIpIGxlZnQrKztcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIpXCIpIHJpZ2h0Kys7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChsZWZ0ICE9PSByaWdodCkgdGhyb3cgXCJSZWdFeHA6IFwiKyByZWdTdHIgKyBcIidzIGJyYWNrZXQgaXMgbm90IG1hcmNoZWRcIjtcclxuICBlbHNlIHJldHVybiBsZWZ0IC0gaWdub3JlZDtcclxufTtcclxuXHJcblxyXG5fLmVzY2FwZVJlZ0V4cCA9IGZ1bmN0aW9uKCBzdHIpey8vIENyZWRpdDogWFJlZ0V4cCAwLjYuMSAoYykgMjAwNy0yMDA4IFN0ZXZlbiBMZXZpdGhhbiA8aHR0cDovL3N0ZXZlbmxldml0aGFuLmNvbS9yZWdleC94cmVnZXhwLz4gTUlUIExpY2Vuc2VcclxuICByZXR1cm4gc3RyLnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uXFxcXF4kfCwjXFxzXS9nLCBmdW5jdGlvbihtYXRjaCl7XHJcbiAgICByZXR1cm4gJ1xcXFwnICsgbWF0Y2g7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxudmFyIHJFbnRpdHkgPSBuZXcgUmVnRXhwKFwiJig/OigjeFswLTlhLWZBLUZdKyl8KCNbMC05XSspfChcIiArIF8ua2V5cyhlbnRpdGllcykuam9pbignfCcpICsgJykpOycsICdnaScpO1xyXG5cclxuXy5jb252ZXJ0RW50aXR5ID0gZnVuY3Rpb24oY2hyKXtcclxuXHJcbiAgcmV0dXJuIChcIlwiICsgY2hyKS5yZXBsYWNlKHJFbnRpdHksIGZ1bmN0aW9uKGFsbCwgaGV4LCBkZWMsIGNhcHR1cmUpe1xyXG4gICAgdmFyIGNoYXJDb2RlO1xyXG4gICAgaWYoIGRlYyApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGRlYy5zbGljZSgxKSwgMTAgKTtcclxuICAgIGVsc2UgaWYoIGhleCApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGhleC5zbGljZSgyKSwgMTYgKTtcclxuICAgIGVsc2UgY2hhckNvZGUgPSBlbnRpdGllc1tjYXB0dXJlXVxyXG5cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCBjaGFyQ29kZSApXHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5cclxuLy8gc2ltcGxlIGdldCBhY2Nlc3NvclxyXG5cclxuXy5jcmVhdGVPYmplY3QgPSBPYmplY3QuY3JlYXRlPyBmdW5jdGlvbihvKXtcclxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShvIHx8IG51bGwpXHJcbn06IChmdW5jdGlvbigpe1xyXG4gICAgZnVuY3Rpb24gVGVtcCgpIHt9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24obyl7XHJcbiAgICAgIGlmKCFvKSByZXR1cm4ge31cclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBvO1xyXG4gICAgICB2YXIgb2JqID0gbmV3IFRlbXAoKTtcclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBudWxsOyAvLyDkuI3opoHkv53mjIHkuIDkuKogTyDnmoTmnYLmlaPlvJXnlKjvvIhhIHN0cmF5IHJlZmVyZW5jZe+8iS4uLlxyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5fLmNyZWF0ZVByb3RvID0gZnVuY3Rpb24oZm4sIG8pe1xyXG4gICAgZnVuY3Rpb24gRm9vKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZm47fVxyXG4gICAgRm9vLnByb3RvdHlwZSA9IG87XHJcbiAgICByZXR1cm4gKGZuLnByb3RvdHlwZSA9IG5ldyBGb28oKSk7XHJcbn1cclxuXHJcblxyXG5fLnJlbW92ZU9uZSA9IGZ1bmN0aW9uKGxpc3QgLCBmaWx0ZXIpe1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICBmb3IoO2xlbi0tOyl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkge1xyXG4gICAgICBsaXN0LnNwbGljZShsZW4sIDEpXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuY2xvbmVcclxuKi9cclxuXy5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKG9iail7XHJcbiAgaWYoIW9iaiB8fCAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgKSkgcmV0dXJuIG9iajtcclxuICBpZihBcnJheS5pc0FycmF5KG9iaikpe1xyXG4gICAgdmFyIGNsb25lZCA9IFtdO1xyXG4gICAgZm9yKHZhciBpPTAsbGVuID0gb2JqLmxlbmd0aDsgaTwgbGVuO2krKyl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lZDtcclxuICB9ZWxzZXtcclxuICAgIHZhciBjbG9uZWQgPSB7fTtcclxuICAgIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5fLmVxdWFscyA9IGZ1bmN0aW9uKG5vdywgb2xkKXtcclxuICB2YXIgdHlwZSA9IHR5cGVvZiBub3c7XHJcbiAgaWYodHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIG9sZCA9PT0gJ251bWJlcicmJiBpc05hTihub3cpICYmIGlzTmFOKG9sZCkpIHJldHVybiB0cnVlXHJcbiAgcmV0dXJuIG5vdyA9PT0gb2xkO1xyXG59XHJcblxyXG52YXIgZGFzaCA9IC8tKFthLXpdKS9nO1xyXG5fLmNhbWVsQ2FzZSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGRhc2gsIGZ1bmN0aW9uKGFsbCwgY2FwdHVyZSl7XHJcbiAgICByZXR1cm4gY2FwdHVyZS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cclxuXy50aHJvdHRsZSA9IGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQpe1xyXG4gIHZhciB3YWl0ID0gd2FpdCB8fCAxMDA7XHJcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcclxuICB2YXIgdGltZW91dCA9IG51bGw7XHJcbiAgdmFyIHByZXZpb3VzID0gMDtcclxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHByZXZpb3VzID0gK25ldyBEYXRlO1xyXG4gICAgdGltZW91dCA9IG51bGw7XHJcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gIH07XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG5vdyA9ICsgbmV3IERhdGU7XHJcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XHJcbiAgICBjb250ZXh0ID0gdGhpcztcclxuICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICBwcmV2aW91cyA9IG5vdztcclxuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICghdGltZW91dCkge1xyXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIGhvZ2FuIGVzY2FwZVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5fLmVzY2FwZSA9IChmdW5jdGlvbigpe1xyXG4gIHZhciByQW1wID0gLyYvZyxcclxuICAgICAgckx0ID0gLzwvZyxcclxuICAgICAgckd0ID0gLz4vZyxcclxuICAgICAgckFwb3MgPSAvXFwnL2csXHJcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcclxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihzdHIpIHtcclxuICAgIHJldHVybiBoQ2hhcnMudGVzdChzdHIpID9cclxuICAgICAgc3RyXHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZShyTHQsICcmbHQ7JylcclxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcclxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZShyUXVvdCwgJyZxdW90OycpIDpcclxuICAgICAgc3RyO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uY2FjaGUgPSBmdW5jdGlvbihtYXgpe1xyXG4gIG1heCA9IG1heCB8fCAxMDAwO1xyXG4gIHZhciBrZXlzID0gW10sXHJcbiAgICAgIGNhY2hlID0ge307XHJcbiAgcmV0dXJuIHtcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiB0aGlzLm1heCkge1xyXG4gICAgICAgIGNhY2hlW2tleXMuc2hpZnQoKV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgLy8gXHJcbiAgICAgIGlmKGNhY2hlW2tleV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgICAgY2FjaGVba2V5XSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGU7XHJcbiAgICAgIHJldHVybiBjYWNoZVtrZXldO1xyXG4gICAgfSxcclxuICAgIG1heDogbWF4LFxyXG4gICAgbGVuOmZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBrZXlzLmxlbmd0aDtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vLyAvLyBzZXR1cCB0aGUgcmF3IEV4cHJlc3Npb25cclxuXHJcblxyXG4vLyBoYW5kbGUgdGhlIHNhbWUgbG9naWMgb24gY29tcG9uZW50J3MgYG9uLSpgIGFuZCBlbGVtZW50J3MgYG9uLSpgXHJcbi8vIHJldHVybiB0aGUgZmlyZSBvYmplY3RcclxuXy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKHZhbHVlLCB0eXBlICl7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLCBldmFsdWF0ZTtcclxuICBpZih2YWx1ZS50eXBlID09PSAnZXhwcmVzc2lvbicpeyAvLyBpZiBpcyBleHByZXNzaW9uLCBnbyBldmFsdWF0ZWQgd2F5XHJcbiAgICBldmFsdWF0ZSA9IHZhbHVlLmdldDtcclxuICB9XHJcbiAgaWYoZXZhbHVhdGUpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUob2JqKXtcclxuICAgICAgc2VsZi4kdXBkYXRlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSBvYmo7XHJcbiAgICAgICAgdmFyIHJlcyA9IGV2YWx1YXRlKHNlbGYpO1xyXG4gICAgICAgIGlmKHJlcyA9PT0gZmFsc2UgJiYgb2JqICYmIG9iai5wcmV2ZW50RGVmYXVsdCkgb2JqLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUoKXtcclxuICAgICAgdmFyIGFyZ3MgPSBfLnNsaWNlKGFyZ3VtZW50cyk7XHJcbiAgICAgIGFyZ3MudW5zaGlmdCh2YWx1ZSk7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHNlbGYuJGVtaXQuYXBwbHkoc2VsZiwgYXJncyk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvbmx5IGNhbGwgb25jZVxyXG5fLm9uY2UgPSBmdW5jdGlvbihmbil7XHJcbiAgdmFyIHRpbWUgPSAwO1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgaWYoIHRpbWUrKyA9PT0gMCkgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcbn1cclxuXHJcbl8uZml4T2JqU3RyID0gZnVuY3Rpb24oc3RyKXtcclxuICBpZihzdHIudHJpbSgpLmluZGV4T2YoJ3snKSAhPT0gMCl7XHJcbiAgICByZXR1cm4gJ3snICsgc3RyICsgJ30nO1xyXG4gIH1cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG5cclxuXy5tYXA9IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjayl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgcmVzLnB1c2goY2FsbGJhY2soYXJyYXlbaV0sIGkpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gbG9nKG1zZywgdHlwZSl7XHJcbiAgaWYodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpICBjb25zb2xlW3R5cGUgfHwgXCJsb2dcIl0obXNnKTtcclxufVxyXG5cclxuXy5sb2cgPSBsb2c7XHJcblxyXG5cclxuXy5ub3JtTGlzdGVuZXIgPSBmdW5jdGlvbiggZXZlbnRzICApe1xyXG4gICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW107XHJcbiAgICB2YXIgcFR5cGUgPSBfLnR5cGVPZiggZXZlbnRzICk7XHJcbiAgICBpZiggcFR5cGUgPT09ICdhcnJheScgKXtcclxuICAgICAgcmV0dXJuIGV2ZW50cztcclxuICAgIH1lbHNlIGlmICggcFR5cGUgPT09ICdvYmplY3QnICl7XHJcbiAgICAgIGZvciggdmFyIGkgaW4gZXZlbnRzICkgaWYgKCBldmVudHMuaGFzT3duUHJvcGVydHkoaSkgKXtcclxuICAgICAgICBldmVudExpc3RlbmVycy5wdXNoKHtcclxuICAgICAgICAgIHR5cGU6IGksXHJcbiAgICAgICAgICBsaXN0ZW5lcjogZXZlbnRzW2ldXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV2ZW50TGlzdGVuZXJzO1xyXG59XHJcblxyXG5cclxuLy9odHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9zaW5nbGUtcGFnZS5odG1sI3ZvaWQtZWxlbWVudHNcclxuXy5pc1ZvaWRUYWcgPSBfLm1ha2VQcmVkaWNhdGUoXCJhcmVhIGJhc2UgYnIgY29sIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZW51aXRlbSBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnIgci1jb250ZW50XCIpO1xyXG5fLmlzQm9vbGVhbkF0dHIgPSBfLm1ha2VQcmVkaWNhdGUoJ3NlbGVjdGVkIGNoZWNrZWQgZGlzYWJsZWQgcmVhZG9ubHkgcmVxdWlyZWQgb3BlbiBhdXRvZm9jdXMgY29udHJvbHMgYXV0b3BsYXkgY29tcGFjdCBsb29wIGRlZmVyIG11bHRpcGxlJyk7XHJcblxyXG5cclxuXy5pc0V4cHIgPSBmdW5jdGlvbihleHByKXtcclxuICByZXR1cm4gZXhwciAmJiBleHByLnR5cGUgPT09ICdleHByZXNzaW9uJztcclxufVxyXG4vLyBAVE9ETzogbWFrZSBpdCBtb3JlIHN0cmljdFxyXG5fLmlzR3JvdXAgPSBmdW5jdGlvbihncm91cCl7XHJcbiAgcmV0dXJuIGdyb3VwLmluamVjdCB8fCBncm91cC4kaW5qZWN0O1xyXG59XHJcblxyXG5fLmdldENvbXBpbGVGbiA9IGZ1bmN0aW9uKHNvdXJjZSwgY3R4LCBvcHRpb25zKXtcclxuICByZXR1cm4gY3R4LiRjb21waWxlLmJpbmQoY3R4LHNvdXJjZSwgb3B0aW9ucylcclxufVxyXG5cclxuLy8gcmVtb3ZlIGRpcmVjdGl2ZSBwYXJhbSBmcm9tIEFTVFxyXG5fLmZpeFRhZ0FTVCA9IGZ1bmN0aW9uKCB0YWdBU1QsIENvbXBvbmVudCApe1xyXG5cclxuICBpZiggdGFnQVNULnRvdWNoZWQgKSByZXR1cm47XHJcblxyXG4gIHZhciBhdHRycyA9IHRhZ0FTVC5hdHRycztcclxuXHJcbiAgaWYoICFhdHRycyApIHJldHVybjtcclxuXHJcbiAgLy8gTWF5YmUgbXVsdGlwbGUgZGlyZWN0aXZlIG5lZWQgc2FtZSBwYXJhbSwgXHJcbiAgLy8gV2UgcGxhY2UgYWxsIHBhcmFtIGluIHRvdGFsUGFyYW1NYXBcclxuICB2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xyXG4gIGlmKCFsZW4pIHJldHVybjtcclxuICB2YXIgZGlyZWN0aXZlcz1bXSwgb3RoZXJBdHRyTWFwID0ge307XHJcbiAgZm9yKDtsZW4tLTspe1xyXG5cclxuICAgIHZhciBhdHRyID0gYXR0cnNbIGxlbiBdO1xyXG5cclxuXHJcbiAgICAvLyBASUUgZml4IElFOS0gaW5wdXQgdHlwZSBjYW4ndCBhc3NpZ24gYWZ0ZXIgdmFsdWVcclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ3R5cGUnKSBhdHRyLnByaW9yaXR5ID0gTUFYX1BSSU9SSVRZKzE7XHJcblxyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IENvbXBvbmVudC5kaXJlY3RpdmUoIGF0dHIubmFtZSApO1xyXG4gICAgaWYoIGRpcmVjdGl2ZSApIHtcclxuXHJcbiAgICAgIGF0dHIucHJpb3JpdHkgPSBkaXJlY3RpdmUucHJpb3JpdHkgfHwgMTtcclxuICAgICAgYXR0ci5kaXJlY3RpdmUgPSB0cnVlO1xyXG4gICAgICBkaXJlY3RpdmVzLnB1c2goYXR0cik7XHJcblxyXG4gICAgfWVsc2UgaWYoYXR0ci50eXBlID09PSAnYXR0cmlidXRlJyl7XHJcbiAgICAgIG90aGVyQXR0ck1hcFthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaCggZnVuY3Rpb24oIGF0dHIgKXtcclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKGF0dHIubmFtZSk7XHJcbiAgICB2YXIgcGFyYW0gPSBkaXJlY3RpdmUucGFyYW07XHJcbiAgICBpZihwYXJhbSAmJiBwYXJhbS5sZW5ndGgpe1xyXG4gICAgICBhdHRyLnBhcmFtID0ge307XHJcbiAgICAgIHBhcmFtLmZvckVhY2goZnVuY3Rpb24oIG5hbWUgKXtcclxuICAgICAgICBpZiggbmFtZSBpbiBvdGhlckF0dHJNYXAgKXtcclxuICAgICAgICAgIGF0dHIucGFyYW1bbmFtZV0gPSBvdGhlckF0dHJNYXBbbmFtZV0gPT09IHVuZGVmaW5lZD8gdHJ1ZTogb3RoZXJBdHRyTWFwW25hbWVdXHJcbiAgICAgICAgICBfLnJlbW92ZU9uZShhdHRycywgZnVuY3Rpb24oYXR0cil7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyLm5hbWUgPT09IG5hbWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhdHRycy5zb3J0KGZ1bmN0aW9uKGExLCBhMil7XHJcbiAgICBcclxuICAgIHZhciBwMSA9IGExLnByaW9yaXR5O1xyXG4gICAgdmFyIHAyID0gYTIucHJpb3JpdHk7XHJcblxyXG4gICAgaWYoIHAxID09IG51bGwgKSBwMSA9IE1BWF9QUklPUklUWTtcclxuICAgIGlmKCBwMiA9PSBudWxsICkgcDIgPSBNQVhfUFJJT1JJVFk7XHJcblxyXG4gICAgcmV0dXJuIHAyIC0gcDE7XHJcblxyXG4gIH0pXHJcblxyXG4gIHRhZ0FTVC50b3VjaGVkID0gdHJ1ZTtcclxufVxyXG5cclxuXy5maW5kSXRlbSA9IGZ1bmN0aW9uKGxpc3QsIGZpbHRlcil7XHJcbiAgaWYoIWxpc3QgfHwgIWxpc3QubGVuZ3RoKSByZXR1cm47XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIHdoaWxlKGxlbi0tKXtcclxuICAgIGlmKGZpbHRlcihsaXN0W2xlbl0pKSByZXR1cm4gbGlzdFtsZW5dXHJcbiAgfVxyXG59XHJcblxyXG5fLmdldFBhcmFtT2JqID0gZnVuY3Rpb24oY29tcG9uZW50LCBwYXJhbSl7XHJcbiAgdmFyIHBhcmFtT2JqID0ge307XHJcbiAgaWYocGFyYW0pIHtcclxuICAgIGZvcih2YXIgaSBpbiBwYXJhbSkgaWYocGFyYW0uaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbVtpXTtcclxuICAgICAgcGFyYW1PYmpbaV0gPSAgdmFsdWUgJiYgdmFsdWUudHlwZT09PSdleHByZXNzaW9uJz8gY29tcG9uZW50LiRnZXQodmFsdWUpOiB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHBhcmFtT2JqO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ0JFR0lOJzogJ3snLFxyXG4gICdFTkQnOiAnfScsXHJcbiAgJ1BSRUNPTVBJTEUnOiBmYWxzZVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE1OjA1OjAxIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTI0IDIzOjMzOjM0XHJcbiAqL1xyXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi4vL3BhcnNlci9zcmMvUGFyc2VyLmpzJyk7XHJcblxyXG5pZighdGhpcy5kb2N1bWVudCl7XHJcbiAgICAvKmVzbGludC1kaXNhYmxlKi9cclxuICAgIGRvY3VtZW50ID0gcmVxdWlyZSgnLi4vdmRvbS9Eb2N1bWVudC5qcycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBCYXNlUmVuZGVyU3RvcmUob2JqKXtcclxuXHJcbiAgICB0aGlzLl9iZWZvcmVDb25maWcoKTtcclxuICAgIHRoaXMuX2NvbmZpZ01vZGVsKG9iaik7XHJcbiAgICB0aGlzLl9hZnRlckNvbmZpZygpO1xyXG4gICAgdGhpcy5fcGFyc2UoKTtcclxufVxyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fYmVmb3JlQ29uZmlnID0gZnVuY3Rpb24oKXtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2FmdGVyQ29uZmlnID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuY29uZmlnICYmIHRoaXMuY29uZmlnKHRoaXMuZGF0YSk7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9jb25maWdNb2RlbCA9IGZ1bmN0aW9uKG1vZGVsKXtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcywgbW9kZWwpO1xyXG5cclxuICAgIGlmKCFtb2RlbC5kYXRhKSB0aGlzLmRhdGEgPSB7fTtcclxuICAgIHRoaXMuX2xpc3QgPSB7fTtcclxuICAgIHRoaXMuJGxpc3QgPSB7fTtcclxuICAgIHRoaXMuJHJlZnMgPSB7fTtcclxuXHJcbiAgICB0aGlzLl9kZWZpbmVyID0gbW9kZWw7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9jb21waWxlID0gZnVuY3Rpb24oYXN0LCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgY3VySW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSl7XHJcbiAgICBpZihhc3QgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKHRoaXMuX2NvbXBpbGUoYXN0W2ldLCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgaSwgcm9vdFBhdGgsIGxpc3ROYW1lKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyW2FzdC50eXBlXShhc3QsIHRoaXMsIGxpc3RJbmZvLCBsaXN0QnVmZmVyLCBjdXJJbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKTtcclxuICAgIH1cclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3BhcnNlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuQVNUID0gbmV3IFBhcnNlcih0aGlzLnRlbXBsYXRlKS5wYXJzZSgpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fc2dfID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEV2ZW50KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZGF0YVtwYXRoXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VSZW5kZXJTdG9yZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcuanNcIik7XHJcbnZhciBub2RlID0gcmVxdWlyZShcIi4vbm9kZS5qc1wiKTtcclxudmFyIExleGVyID0gcmVxdWlyZShcIi4vTGV4ZXIuanNcIik7XHJcbnZhciB2YXJOYW1lID0gXy52YXJOYW1lO1xyXG52YXIgY3R4TmFtZSA9IF8uY3R4TmFtZTtcclxudmFyIGV4dE5hbWUgPSBfLmV4dE5hbWU7XHJcbnZhciBpc1BhdGggPSBfLm1ha2VQcmVkaWNhdGUoXCJTVFJJTkcgSURFTlQgTlVNQkVSXCIpO1xyXG52YXIgaXNLZXlXb3JkID0gXy5tYWtlUHJlZGljYXRlKFwidHJ1ZSBmYWxzZSB1bmRlZmluZWQgbnVsbCB0aGlzIEFycmF5IERhdGUgSlNPTiBNYXRoIE5hTiBSZWdFeHAgZGVjb2RlVVJJIGRlY29kZVVSSUNvbXBvbmVudCBlbmNvZGVVUkkgZW5jb2RlVVJJQ29tcG9uZW50IHBhcnNlRmxvYXQgcGFyc2VJbnQgT2JqZWN0XCIpO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gUGFyc2VyKGlucHV0LCBvcHRzKXtcclxuICBvcHRzID0gb3B0cyB8fCB7fTtcclxuXHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIHRoaXMudG9rZW5zID0gbmV3IExleGVyKGlucHV0LCBvcHRzKS5sZXgoKTtcclxuICB0aGlzLnBvcyA9IDA7XHJcbiAgdGhpcy5sZW5ndGggPSB0aGlzLnRva2Vucy5sZW5ndGg7XHJcbn1cclxuXHJcblxyXG52YXIgb3AgPSBQYXJzZXIucHJvdG90eXBlO1xyXG5cclxuXHJcbm9wLnBhcnNlID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLnBvcyA9IDA7XHJcbiAgdmFyIHJlcz0gdGhpcy5wcm9ncmFtKCk7XHJcbiAgaWYodGhpcy5sbCgpLnR5cGUgPT09ICdUQUdfQ0xPU0UnKXtcclxuICAgIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGdvdCBhIHVuY2xvc2VkIFRhZ1wiKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5vcC5sbCA9ICBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIGlmKGsgPCAwKSBrID0gayArIDE7XHJcbiAgdmFyIHBvcyA9IHRoaXMucG9zICsgayAtIDE7XHJcbiAgaWYocG9zID4gdGhpcy5sZW5ndGggLSAxKXtcclxuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMubGVuZ3RoLTFdO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy50b2tlbnNbcG9zXTtcclxufVxyXG4gIC8vIGxvb2thaGVhZFxyXG5vcC5sYSA9IGZ1bmN0aW9uKGspe1xyXG4gIHJldHVybiAodGhpcy5sbChrKSB8fCAnJykudHlwZTtcclxufVxyXG5cclxub3AubWF0Y2ggPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKCEobGwgPSB0aGlzLmVhdCh0eXBlLCB2YWx1ZSkpKXtcclxuICAgIGxsICA9IHRoaXMubGwoKTtcclxuICAgIHRoaXMuZXJyb3IoJ2V4cGVjdCBbJyArIHR5cGUgKyAodmFsdWUgPT0gbnVsbD8gJyc6JzonKyB2YWx1ZSkgKyAnXVwiIC0+IGdvdCBcIlsnICsgbGwudHlwZSArICh2YWx1ZT09bnVsbD8gJyc6JzonK2xsLnZhbHVlKSArICddJywgbGwucG9zKVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGxsO1xyXG4gIH1cclxufVxyXG5cclxub3AuZXJyb3IgPSBmdW5jdGlvbihtc2csIHBvcyl7XHJcbiAgbXNnID0gIFwiXFxu44CQIHBhcnNlIGZhaWxlZCDjgJEgXCIgKyBtc2cgKyAgJzpcXG5cXG4nICsgXy50cmFja0Vycm9yUG9zKHRoaXMuaW5wdXQsIHR5cGVvZiBwb3MgPT09ICdudW1iZXInPyBwb3M6IHRoaXMubGwoKS5wb3N8fDApO1xyXG4gIHRocm93IG5ldyBFcnJvcihtc2cpO1xyXG59XHJcblxyXG5vcC5uZXh0ID0gZnVuY3Rpb24oayl7XHJcbiAgayA9IGsgfHwgMTtcclxuICB0aGlzLnBvcyArPSBrO1xyXG59XHJcbm9wLmVhdCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgaWYodHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKXtcclxuICAgIGZvcih2YXIgbGVuID0gdHlwZS5sZW5ndGggOyBsZW4tLTspe1xyXG4gICAgICBpZihsbC50eXBlID09PSB0eXBlW2xlbl0pIHtcclxuICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICByZXR1cm4gbGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIGlmKCBsbC50eXBlID09PSB0eXBlICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IGxsLnZhbHVlID09PSB2YWx1ZSkgKXtcclxuICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgcmV0dXJuIGxsO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIHByb2dyYW1cclxuLy8gIDpFT0ZcclxuLy8gIHwgKHN0YXRlbWVudCkqIEVPRlxyXG5vcC5wcm9ncmFtID0gZnVuY3Rpb24oKXtcclxuICB2YXIgc3RhdGVtZW50cyA9IFtdLCAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgd2hpbGUobGwudHlwZSAhPT0gJ0VPRicgJiYgbGwudHlwZSAhPT0nVEFHX0NMT1NFJyl7XHJcblxyXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgfVxyXG4gIC8vIGlmKGxsLnR5cGUgPT09ICdUQUdfQ0xPU0UnKSB0aGlzLmVycm9yKFwiWW91IG1heSBoYXZlIHVubWF0Y2hlZCBUYWdcIilcclxuICByZXR1cm4gc3RhdGVtZW50cztcclxufVxyXG5cclxuLy8gc3RhdGVtZW50XHJcbi8vICA6IHhtbFxyXG4vLyAgfCBqc3RcclxuLy8gIHwgdGV4dFxyXG5vcC5zdGF0ZW1lbnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlICdOQU1FJzpcclxuICAgIGNhc2UgJ1RFWFQnOlxyXG4gICAgICB2YXIgdGV4dCA9IGxsLnZhbHVlO1xyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgd2hpbGUobGwgPSB0aGlzLmVhdChbJ05BTUUnLCAnVEVYVCddKSl7XHJcbiAgICAgICAgdGV4dCArPSBsbC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbm9kZS50ZXh0KHRleHQpO1xyXG4gICAgY2FzZSAnVEFHX09QRU4nOlxyXG4gICAgICByZXR1cm4gdGhpcy54bWwoKTtcclxuICAgIGNhc2UgJ09QRU4nOiBcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aXZlKCk7XHJcbiAgICBjYXNlICdFWFBSX09QRU4nOlxyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgdG9rZW46ICcrIHRoaXMubGEoKSlcclxuICB9XHJcbn1cclxuXHJcbi8vIHhtbCBcclxuLy8gc3RhZyBzdGF0ZW1lbnQqIFRBR19DTE9TRT8oaWYgc2VsZi1jbG9zZWQgdGFnKVxyXG5vcC54bWwgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBuYW1lLCBhdHRycywgY2hpbGRyZW4sIHNlbGZDbG9zZWQ7XHJcbiAgbmFtZSA9IHRoaXMubWF0Y2goJ1RBR19PUEVOJykudmFsdWU7XHJcbiAgYXR0cnMgPSB0aGlzLmF0dHJzKCk7XHJcbiAgc2VsZkNsb3NlZCA9IHRoaXMuZWF0KCcvJylcclxuICB0aGlzLm1hdGNoKCc+Jyk7XHJcbiAgaWYoICFzZWxmQ2xvc2VkICYmICFfLmlzVm9pZFRhZyhuYW1lKSApe1xyXG4gICAgY2hpbGRyZW4gPSB0aGlzLnByb2dyYW0oKTtcclxuICAgIGlmKCF0aGlzLmVhdCgnVEFHX0NMT1NFJywgbmFtZSkpIHRoaXMuZXJyb3IoJ2V4cGVjdCA8LycrbmFtZSsnPiBnb3QnKyAnbm8gbWF0Y2hlZCBjbG9zZVRhZycpXHJcbiAgfVxyXG4gIHJldHVybiBub2RlLmVsZW1lbnQobmFtZSwgYXR0cnMsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLy8geGVudGl0eVxyXG4vLyAgLXJ1bGUod3JhcCBhdHRyaWJ1dGUpXHJcbi8vICAtYXR0cmlidXRlXHJcbi8vXHJcbi8vIF9fZXhhbXBsZV9fXHJcbi8vICBuYW1lID0gMSB8ICBcclxuLy8gIG5nLWhpZGUgfFxyXG4vLyAgb24tY2xpY2s9e3t9fSB8IFxyXG4vLyAge3sjaWYgbmFtZX19b24tY2xpY2s9e3t4eH19e3sjZWxzZX19b24tdGFwPXt7fX17ey9pZn19XHJcblxyXG5vcC54ZW50aXR5ID0gZnVuY3Rpb24obGwpe1xyXG4gIHZhciBuYW1lID0gbGwudmFsdWUsIHZhbHVlLCBtb2RpZmllcjtcclxuICBpZihsbC50eXBlID09PSAnTkFNRScpe1xyXG4gICAgLy9AIG9ubHkgZm9yIHRlc3RcclxuICAgIGlmKH5uYW1lLmluZGV4T2YoJy4nKSl7XHJcbiAgICAgIHZhciB0bXAgPSBuYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgIG5hbWUgPSB0bXBbMF07XHJcbiAgICAgIG1vZGlmaWVyID0gdG1wWzFdXHJcblxyXG4gICAgfVxyXG4gICAgaWYoIHRoaXMuZWF0KFwiPVwiKSApIHZhbHVlID0gdGhpcy5hdHR2YWx1ZShtb2RpZmllcik7XHJcbiAgICByZXR1cm4gbm9kZS5hdHRyaWJ1dGUoIG5hbWUsIHZhbHVlLCBtb2RpZmllciApO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoIG5hbWUgIT09ICdpZicpIHRoaXMuZXJyb3IoXCJjdXJyZW50IHZlcnNpb24uIE9OTFkgUlVMRSAjaWYgI2Vsc2UgI2Vsc2VpZiBpcyB2YWxpZCBpbiB0YWcsIHRoZSBydWxlICNcIiArIG5hbWUgKyAnIGlzIGludmFsaWQnKTtcclxuICAgIHJldHVybiB0aGlzWydpZiddKHRydWUpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIHN0YWcgICAgIDo6PSAgICAnPCcgTmFtZSAoUyBhdHRyKSogUz8gJz4nICBcclxuLy8gYXR0ciAgICA6Oj0gICAgIE5hbWUgRXEgYXR0dmFsdWVcclxub3AuYXR0cnMgPSBmdW5jdGlvbihpc0F0dHJpYnV0ZSl7XHJcbiAgdmFyIGVhdFxyXG4gIGlmKCFpc0F0dHJpYnV0ZSl7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCIsIFwiT1BFTlwiXVxyXG4gIH1lbHNle1xyXG4gICAgZWF0ID0gW1wiTkFNRVwiXVxyXG4gIH1cclxuXHJcbiAgdmFyIGF0dHJzID0gW10sIGxsO1xyXG4gIHdoaWxlIChsbCA9IHRoaXMuZWF0KGVhdCkpe1xyXG4gICAgYXR0cnMucHVzaCh0aGlzLnhlbnRpdHkoIGxsICkpXHJcbiAgfVxyXG4gIHJldHVybiBhdHRycztcclxufVxyXG5cclxuLy8gYXR0dmFsdWVcclxuLy8gIDogU1RSSU5HICBcclxuLy8gIHwgTkFNRVxyXG5vcC5hdHR2YWx1ZSA9IGZ1bmN0aW9uKG1kZil7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgXCJOQU1FXCI6XHJcbiAgICBjYXNlIFwiVU5RXCI6XHJcbiAgICBjYXNlIFwiU1RSSU5HXCI6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB2YXIgdmFsdWUgPSBsbC52YWx1ZTtcclxuICAgICAgaWYofnZhbHVlLmluZGV4T2YoY29uZmlnLkJFR0lOKSAmJiB+dmFsdWUuaW5kZXhPZihjb25maWcuRU5EKSAmJiBtZGYhPT0nY21wbCcpe1xyXG4gICAgICAgIHZhciBjb25zdGFudCA9IHRydWU7XHJcbiAgICAgICAgdmFyIHBhcnNlZCA9IG5ldyBQYXJzZXIodmFsdWUsIHsgbW9kZTogMiB9KS5wYXJzZSgpO1xyXG4gICAgICAgIGlmKHBhcnNlZC5sZW5ndGggPT09IDEgJiYgcGFyc2VkWzBdLnR5cGUgPT09ICdleHByZXNzaW9uJykgcmV0dXJuIHBhcnNlZFswXTtcclxuICAgICAgICB2YXIgYm9keSA9IFtdO1xyXG4gICAgICAgIHBhcnNlZC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgaWYoIWl0ZW0uY29uc3RhbnQpIGNvbnN0YW50PWZhbHNlO1xyXG4gICAgICAgICAgLy8gc2lsZW50IHRoZSBtdXRpcGxlIGludGVwbGF0aW9uXHJcbiAgICAgICAgICAgIGJvZHkucHVzaChpdGVtLmJvZHkgfHwgXCInXCIgKyBpdGVtLnRleHQucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpICsgXCInXCIpOyAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYm9keSA9IFwiW1wiICsgYm9keS5qb2luKFwiLFwiKSArIFwiXS5qb2luKCcnKVwiO1xyXG4gICAgICAgIHZhbHVlID0gbm9kZS5leHByZXNzaW9uKGJvZHksIG51bGwsIGNvbnN0YW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICBjYXNlIFwiRVhQUl9PUEVOXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgLy8gY2FzZSBcIk9QRU5cIjpcclxuICAgIC8vICAgaWYobGwudmFsdWUgPT09ICdpbmMnIHx8IGxsLnZhbHVlID09PSAnaW5jbHVkZScpe1xyXG4gICAgLy8gICAgIHRoaXMubmV4dCgpO1xyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLmluYygpO1xyXG4gICAgLy8gICB9ZWxzZXtcclxuICAgIC8vICAgICB0aGlzLmVycm9yKCdhdHRyaWJ1dGUgdmFsdWUgb25seSBzdXBwb3J0IGludGVwbGF0aW9uIGFuZCB7I2luY30gc3RhdGVtZW50JylcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgdG9rZW46ICcrIHRoaXMubGEoKSlcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyB7eyN9fVxyXG5vcC5kaXJlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBuYW1lID0gdGhpcy5sbCgpLnZhbHVlO1xyXG4gIHRoaXMubmV4dCgpO1xyXG4gIGlmKHR5cGVvZiB0aGlzW25hbWVdID09PSAnZnVuY3Rpb24nKXtcclxuICAgIHJldHVybiB0aGlzW25hbWVdKClcclxuICB9ZWxzZXtcclxuICAgIHRoaXMuZXJyb3IoJ1VuZGVmaW5lZCBkaXJlY3RpdmVbJysgbmFtZSArJ10nKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyB7e319XHJcbm9wLmludGVycGxhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnRVhQUl9PUEVOJyk7XHJcbiAgdmFyIHJlcyA9IHRoaXMuZXhwcmVzc2lvbih0cnVlKTtcclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyB7e359fVxyXG5vcC5pbmMgPSBvcC5pbmNsdWRlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29udGVudCA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiBub2RlLnRlbXBsYXRlKGNvbnRlbnQpO1xyXG59XHJcblxyXG4vLyB7eyNpZn19XHJcbm9wW1wiaWZcIl0gPSBmdW5jdGlvbih0YWcpe1xyXG4gIHZhciB0ZXN0ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdmFyIGNvbnNlcXVlbnQgPSBbXSwgYWx0ZXJuYXRlPVtdO1xyXG5cclxuICB2YXIgY29udGFpbmVyID0gY29uc2VxdWVudDtcclxuICB2YXIgc3RhdGVtZW50ID0gIXRhZz8gXCJzdGF0ZW1lbnRcIiA6IFwiYXR0cnNcIjtcclxuXHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcblxyXG4gIHZhciBsbCwgY2xvc2U7XHJcbiAgd2hpbGUoICEgKGNsb3NlID0gdGhpcy5lYXQoJ0NMT1NFJykpICl7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICAgIGlmKCBsbC50eXBlID09PSAnT1BFTicgKXtcclxuICAgICAgc3dpdGNoKCBsbC52YWx1ZSApe1xyXG4gICAgICAgIGNhc2UgJ2Vsc2UnOlxyXG4gICAgICAgICAgY29udGFpbmVyID0gYWx0ZXJuYXRlO1xyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICB0aGlzLm1hdGNoKCAnRU5EJyApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZWxzZWlmJzpcclxuICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgYWx0ZXJuYXRlLnB1c2goIHRoaXNbXCJpZlwiXSh0YWcpICk7XHJcbiAgICAgICAgICByZXR1cm4gbm9kZVsnaWYnXSggdGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlICk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbnRhaW5lci5wdXNoKCB0aGlzW3N0YXRlbWVudF0odHJ1ZSkgKTtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXNbc3RhdGVtZW50XSh0cnVlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGlmIHN0YXRlbWVudCBub3QgbWF0Y2hlZFxyXG4gIGlmKGNsb3NlLnZhbHVlICE9PSBcImlmXCIpIHRoaXMuZXJyb3IoJ1VubWF0Y2hlZCBpZiBkaXJlY3RpdmUnKVxyXG4gIHJldHVybiBub2RlW1wiaWZcIl0odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKTtcclxufVxyXG5cclxuXHJcbi8vIEBtYXJrICAgbXVzdGFjaGUgc3ludGF4IGhhdmUgbmF0cnVyZSBkaXMsIGNhbm90IHdpdGggZXhwcmVzc2lvblxyXG4vLyB7eyNsaXN0fX1cclxub3AubGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gc2VxdWVuY2UgY2FuIGJlIGEgbGlzdCBvciBoYXNoXHJcbiAgdmFyIHNlcXVlbmNlID0gdGhpcy5leHByZXNzaW9uKCksIHZhcmlhYmxlLCBsbCwgdHJhY2s7XHJcbiAgdmFyIGNvbnNlcXVlbnQgPSBbXSwgYWx0ZXJuYXRlPVtdO1xyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG5cclxuICB0aGlzLm1hdGNoKCdJREVOVCcsICdhcycpO1xyXG5cclxuICB2YXJpYWJsZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCdJREVOVCcsICdieScpKXtcclxuICAgIGlmKHRoaXMuZWF0KCdJREVOVCcsdmFyaWFibGUgKyAnX2luZGV4Jykpe1xyXG4gICAgICB0cmFjayA9IHRydWU7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdHJhY2sgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICAgICAgaWYodHJhY2suY29uc3RhbnQpe1xyXG4gICAgICAgIC8vIHRydWUgaXMgbWVhbnMgY29uc3RhbnQsIHdlIGhhbmRsZSBpdCBqdXN0IGxpa2UgeHh4X2luZGV4LlxyXG4gICAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcblxyXG4gIHdoaWxlKCAhKGxsID0gdGhpcy5lYXQoJ0NMT1NFJykpICl7XHJcbiAgICBpZih0aGlzLmVhdCgnT1BFTicsICdlbHNlJykpe1xyXG4gICAgICBjb250YWluZXIgPSAgYWx0ZXJuYXRlO1xyXG4gICAgICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBjb250YWluZXIucHVzaCh0aGlzLnN0YXRlbWVudCgpKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgaWYobGwudmFsdWUgIT09ICdsaXN0JykgdGhpcy5lcnJvcignZXhwZWN0ICcgKyAnbGlzdCBnb3QgJyArICcvJyArIGxsLnZhbHVlICsgJyAnLCBsbC5wb3MgKTtcclxuICByZXR1cm4gbm9kZS5saXN0KHNlcXVlbmNlLCB2YXJpYWJsZSwgY29uc2VxdWVudCwgYWx0ZXJuYXRlLCB0cmFjayk7XHJcbn1cclxuXHJcblxyXG5vcC5leHByZXNzaW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgZXhwcmVzc2lvbjtcclxuICBpZih0aGlzLmVhdCgnQCgnKSl7IC8vb25jZSBiaW5kXHJcbiAgICBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XHJcbiAgICBleHByZXNzaW9uLm9uY2UgPSB0cnVlO1xyXG4gICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgfWVsc2V7XHJcbiAgICBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XHJcbiAgfVxyXG4gIHJldHVybiBleHByZXNzaW9uO1xyXG59XHJcblxyXG5vcC5leHByID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmRlcGVuZCA9IFtdO1xyXG5cclxuICB2YXIgYnVmZmVyID0gdGhpcy5maWx0ZXIoKVxyXG5cclxuICB2YXIgYm9keSA9IGJ1ZmZlci5nZXQgfHwgYnVmZmVyO1xyXG4gIHZhciBzZXRib2R5ID0gYnVmZmVyLnNldDtcclxuICByZXR1cm4gbm9kZS5leHByZXNzaW9uKGJvZHksIHNldGJvZHksICF0aGlzLmRlcGVuZC5sZW5ndGgsIGJ1ZmZlci5maWx0ZXJzKTtcclxufVxyXG5cclxuXHJcbi8vIGZpbHRlclxyXG4vLyBhc3NpZ24gKCd8JyBmaWx0ZXJuYW1lWyc6JyBhcmdzXSkgKiBcclxub3AuZmlsdGVyID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgdmFyIGxsID0gdGhpcy5lYXQoJ3wnKTtcclxuICB2YXIgYnVmZmVyID0gW10sIGZpbHRlcnMsc2V0QnVmZmVyLCBwcmVmaXgsXHJcbiAgICBhdHRyID0gXCJ0XCIsIFxyXG4gICAgc2V0ID0gbGVmdC5zZXQsIGdldCwgXHJcbiAgICB0bXAgPSBcIlwiO1xyXG5cclxuICBpZihsbCl7XHJcbiAgICBpZihzZXQpIHtcclxuICAgICAgc2V0QnVmZmVyID0gW107XHJcbiAgICAgIGZpbHRlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXggPSBcIihmdW5jdGlvbihcIiArIGF0dHIgKyBcIil7XCI7XHJcblxyXG4gICAgZG97XHJcbiAgICAgIHZhciBmaWx0ZXJOYW1lID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuICAgICAgdG1wID0gYXR0ciArIFwiID0gXCIgKyBjdHhOYW1lICsgXCIuX2ZfKCdcIiArIGZpbHRlck5hbWUgKyBcIicgKS5nZXQuY2FsbCggXCIrXy5jdHhOYW1lICtcIixcIiArIGF0dHIgO1xyXG4gICAgICBpZih0aGlzLmVhdCgnOicpKXtcclxuICAgICAgICB0bXAgKz1cIiwgXCIrIHRoaXMuYXJndW1lbnRzKFwifFwiKS5qb2luKFwiLFwiKSArIFwiKTtcIlxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0bXAgKz0gJyk7J1xyXG4gICAgICB9XHJcbiAgICAgIGJ1ZmZlci5wdXNoKHRtcCk7XHJcbiAgICAgIFxyXG4gICAgICBpZihzZXQpe1xyXG4gICAgICAgIC8vIG9ubHkgaW4gcnVudGltZSAsd2UgY2FuIGRldGVjdCAgd2hldGhlciAgdGhlIGZpbHRlciBoYXMgYSBzZXQgZnVuY3Rpb24uIFxyXG4gICAgICAgIGZpbHRlcnMucHVzaChmaWx0ZXJOYW1lKTtcclxuICAgICAgICBzZXRCdWZmZXIudW5zaGlmdCggdG1wLnJlcGxhY2UoXCIgKS5nZXQuY2FsbFwiLCBcIiApLnNldC5jYWxsXCIpICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9d2hpbGUobGwgPSB0aGlzLmVhdCgnfCcpKTtcclxuICAgIGJ1ZmZlci5wdXNoKFwicmV0dXJuIFwiICsgYXR0ciApO1xyXG4gICAgc2V0QnVmZmVyICYmIHNldEJ1ZmZlci5wdXNoKFwicmV0dXJuIFwiICsgYXR0cik7XHJcblxyXG4gICAgZ2V0ID0gIHByZWZpeCArIGJ1ZmZlci5qb2luKFwiXCIpICsgXCJ9KShcIitsZWZ0LmdldCtcIilcIjtcclxuICAgIC8vIHdlIGNhbGwgYmFjayB0byB2YWx1ZS5cclxuICAgIGlmKHNldEJ1ZmZlcil7XHJcbiAgICAgIC8vIGNoYW5nZSBfc3NfXyhuYW1lLCBfcF8pIHRvIF9zX18obmFtZSwgZmlsdGVyRm4oX3BfKSk7XHJcbiAgICAgIHNldCA9IHNldC5yZXBsYWNlKF8uc2V0TmFtZSwgXHJcbiAgICAgICAgcHJlZml4ICsgc2V0QnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK+OAgF8uc2V0TmFtZeOAgCtcIilcIiApO1xyXG5cclxuICAgIH1cclxuICAgIC8vIHRoZSBzZXQgZnVuY3Rpb24gaXMgZGVwZW5kIG9uIHRoZSBmaWx0ZXIgZGVmaW5pdGlvbi4gaWYgaXQgaGF2ZSBzZXQgbWV0aG9kLCB0aGUgc2V0IHdpbGwgd29ya1xyXG4gICAgdmFyIHJldCA9IGdldHNldChnZXQsIHNldCk7XHJcbiAgICByZXQuZmlsdGVycyA9IGZpbHRlcnM7XHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gYXNzaWduXHJcbi8vIGxlZnQtaGFuZC1leHByID0gY29uZGl0aW9uXHJcbm9wLmFzc2lnbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmNvbmRpdGlvbigpLCBsbDtcclxuICBpZihsbCA9IHRoaXMuZWF0KFsnPScsICcrPScsICctPScsICcqPScsICcvPScsICclPSddKSl7XHJcbiAgICBpZighbGVmdC5zZXQpIHRoaXMuZXJyb3IoJ2ludmFsaWQgbGVmdGhhbmQgZXhwcmVzc2lvbiBpbiBhc3NpZ25tZW50IGV4cHJlc3Npb24nKTtcclxuICAgIHJldHVybiBnZXRzZXQoIGxlZnQuc2V0LnJlcGxhY2UoIFwiLFwiICsgXy5zZXROYW1lLCBcIixcIiArIHRoaXMuY29uZGl0aW9uKCkuZ2V0ICkucmVwbGFjZShcIic9J1wiLCBcIidcIitsbC50eXBlK1wiJ1wiKSwgbGVmdC5zZXQpO1xyXG4gICAgLy8gcmV0dXJuIGdldHNldCgnKCcgKyBsZWZ0LmdldCArIGxsLnR5cGUgICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKyAnKScsIGxlZnQuc2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbi8vIG9yXHJcbi8vIG9yID8gYXNzaWduIDogYXNzaWduXHJcbm9wLmNvbmRpdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciB0ZXN0ID0gdGhpcy5vcigpO1xyXG4gIGlmKHRoaXMuZWF0KCc/Jykpe1xyXG4gICAgcmV0dXJuIGdldHNldChbdGVzdC5nZXQgKyBcIj9cIiwgXHJcbiAgICAgIHRoaXMuYXNzaWduKCkuZ2V0LCBcclxuICAgICAgdGhpcy5tYXRjaChcIjpcIikudHlwZSwgXHJcbiAgICAgIHRoaXMuYXNzaWduKCkuZ2V0XS5qb2luKFwiXCIpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0ZXN0O1xyXG59XHJcblxyXG4vLyBhbmRcclxuLy8gYW5kICYmIG9yXHJcbm9wLm9yID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFuZCgpO1xyXG5cclxuICBpZih0aGlzLmVhdCgnfHwnKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgJ3x8JyArIHRoaXMub3IoKS5nZXQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuLy8gZXF1YWxcclxuLy8gZXF1YWwgJiYgYW5kXHJcbm9wLmFuZCA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBsZWZ0ID0gdGhpcy5lcXVhbCgpO1xyXG5cclxuICBpZih0aGlzLmVhdCgnJiYnKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgJyYmJyArIHRoaXMuYW5kKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuLy8gcmVsYXRpb25cclxuLy8gXHJcbi8vIGVxdWFsID09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9IHJlbGF0aW9uXHJcbi8vIGVxdWFsID09PSByZWxhdGlvblxyXG4vLyBlcXVhbCAhPT0gcmVsYXRpb25cclxub3AuZXF1YWwgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yZWxhdGlvbigpLCBsbDtcclxuICAvLyBAcGVyZjtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJz09JywnIT0nLCAnPT09JywgJyE9PSddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMuZXF1YWwoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIHJlbGF0aW9uIDwgYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPiBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA8PSBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+PSBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiBpbiBhZGRpdGl2ZVxyXG5vcC5yZWxhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFkZGl0aXZlKCksIGxsO1xyXG4gIC8vIEBwZXJmXHJcbiAgaWYobGwgPSAodGhpcy5lYXQoWyc8JywgJz4nLCAnPj0nLCAnPD0nXSkgfHwgdGhpcy5lYXQoJ0lERU5UJywgJ2luJykgKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudmFsdWUgKyB0aGlzLnJlbGF0aW9uKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyBhZGRpdGl2ZSA6XHJcbi8vIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgKyBtdWx0aXZlXHJcbi8vIGFkZGl0aXZlIC0gbXVsdGl2ZVxyXG5vcC5hZGRpdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLm11bHRpdmUoKSAsbGw7XHJcbiAgaWYobGw9IHRoaXMuZWF0KFsnKycsJy0nXSkgKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMuYWRkaXRpdmUoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIG11bHRpdmUgOlxyXG4vLyB1bmFyeVxyXG4vLyBtdWx0aXZlICogdW5hcnlcclxuLy8gbXVsdGl2ZSAvIHVuYXJ5XHJcbi8vIG11bHRpdmUgJSB1bmFyeVxyXG5vcC5tdWx0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMucmFuZ2UoKSAsbGw7XHJcbiAgaWYoIGxsID0gdGhpcy5lYXQoWycqJywgJy8nICwnJSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnR5cGUgKyB0aGlzLm11bHRpdmUoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxub3AucmFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy51bmFyeSgpLCBsbCwgcmlnaHQ7XHJcblxyXG4gIGlmKGxsID0gdGhpcy5lYXQoJy4uJykpe1xyXG4gICAgcmlnaHQgPSB0aGlzLnVuYXJ5KCk7XHJcbiAgICB2YXIgYm9keSA9IFxyXG4gICAgICBcIihmdW5jdGlvbihzdGFydCxlbmQpe3ZhciByZXMgPSBbXSxzdGVwPWVuZD5zdGFydD8xOi0xOyBmb3IodmFyIGkgPSBzdGFydDsgZW5kPnN0YXJ0P2kgPD0gZW5kOiBpPj1lbmQ7IGk9aStzdGVwKXtyZXMucHVzaChpKTsgfSByZXR1cm4gcmVzIH0pKFwiK2xlZnQuZ2V0K1wiLFwiK3JpZ2h0LmdldCtcIilcIlxyXG4gICAgcmV0dXJuIGdldHNldChib2R5KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5cclxuXHJcbi8vIGxlZnRoYW5kXHJcbi8vICsgdW5hcnlcclxuLy8gLSB1bmFyeVxyXG4vLyB+IHVuYXJ5XHJcbi8vICEgdW5hcnlcclxub3AudW5hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbDtcclxuICBpZihsbCA9IHRoaXMuZWF0KFsnKycsJy0nLCd+JywgJyEnXSkpe1xyXG4gICAgcmV0dXJuIGdldHNldCgnKCcgKyBsbC50eXBlICsgdGhpcy51bmFyeSgpLmdldCArICcpJykgO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIHRoaXMubWVtYmVyKClcclxuICB9XHJcbn1cclxuXHJcbi8vIGNhbGxbbGVmdGhhbmRdIDpcclxuLy8gbWVtYmVyIGFyZ3NcclxuLy8gbWVtYmVyIFsgZXhwcmVzc2lvbiBdXHJcbi8vIG1lbWJlciAuIGlkZW50ICBcclxuXHJcbm9wLm1lbWJlciA9IGZ1bmN0aW9uKGJhc2UsIGxhc3QsIHBhdGhlcywgcHJldkJhc2Upe1xyXG4gIHZhciBsbCwgcGF0aCwgZXh0VmFsdWU7XHJcblxyXG5cclxuICB2YXIgb25seVNpbXBsZUFjY2Vzc29yID0gZmFsc2U7XHJcbiAgaWYoIWJhc2UpeyAvL2ZpcnN0XHJcbiAgICBwYXRoID0gdGhpcy5wcmltYXJ5KCk7XHJcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBwYXRoO1xyXG4gICAgaWYodHlwZSA9PT0gJ3N0cmluZycpeyBcclxuICAgICAgcGF0aGVzID0gW107XHJcbiAgICAgIHBhdGhlcy5wdXNoKCBwYXRoICk7XHJcbiAgICAgIGxhc3QgPSBwYXRoO1xyXG4gICAgICBleHRWYWx1ZSA9IGV4dE5hbWUgKyBcIi5cIiArIHBhdGhcclxuICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHBhdGggKyBcIicsIFwiICsgdmFyTmFtZSArIFwiLCBcIiArIGV4dE5hbWUgKyBcIilcIjtcclxuICAgICAgb25seVNpbXBsZUFjY2Vzc29yID0gdHJ1ZTtcclxuICAgIH1lbHNleyAvL1ByaW1hdGl2ZSBUeXBlXHJcbiAgICAgIGlmKHBhdGguZ2V0ID09PSAndGhpcycpe1xyXG4gICAgICAgIGJhc2UgPSBjdHhOYW1lO1xyXG4gICAgICAgIHBhdGhlcyA9IFsndGhpcyddO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgICAgIGJhc2UgPSBwYXRoLmdldDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNleyAvLyBub3QgZmlyc3QgZW50ZXJcclxuICAgIGlmKHR5cGVvZiBsYXN0ID09PSAnc3RyaW5nJyAmJiBpc1BhdGgoIGxhc3QpICl7IC8vIGlzIHZhbGlkIHBhdGhcclxuICAgICAgcGF0aGVzLnB1c2gobGFzdCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYocGF0aGVzICYmIHBhdGhlcy5sZW5ndGgpIHRoaXMuZGVwZW5kLnB1c2gocGF0aGVzKTtcclxuICAgICAgcGF0aGVzID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJ1snLCAnLicsICcoJ10pKXtcclxuICAgIHN3aXRjaChsbC50eXBlKXtcclxuICAgICAgY2FzZSAnLic6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgdmFyIHRtcE5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICAgIHByZXZCYXNlID0gYmFzZTtcclxuICAgICAgICBpZiggdGhpcy5sYSgpICE9PSBcIihcIiApeyBcclxuICAgICAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXygnXCIgKyB0bXBOYW1lICsgXCInLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbJ1wiICsgdG1wTmFtZSArIFwiJ11cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKCBiYXNlLCB0bXBOYW1lLCBwYXRoZXMsICBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJ1snOlxyXG4gICAgICAgICAgLy8gbWVtYmVyKG9iamVjdCwgcHJvcGVydHksIGNvbXB1dGVkKVxyXG4gICAgICAgIHBhdGggPSB0aGlzLmFzc2lnbigpO1xyXG4gICAgICAgIHByZXZCYXNlID0gYmFzZTtcclxuICAgICAgICBpZiggdGhpcy5sYSgpICE9PSBcIihcIiApeyBcclxuICAgICAgICAvLyBtZWFucyBmdW5jdGlvbiBjYWxsLCB3ZSBuZWVkIHRocm93IHVuZGVmaW5lZCBlcnJvciB3aGVuIGNhbGwgZnVuY3Rpb25cclxuICAgICAgICAvLyBhbmQgY29uZmlybSB0aGF0IHRoZSBmdW5jdGlvbiBjYWxsIHdvbnQgbG9zZSBpdHMgY29udGV4dFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKFwiICsgcGF0aC5nZXQgKyBcIiwgXCIgKyBiYXNlICsgXCIpXCI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiYXNlICs9IFwiW1wiICsgcGF0aC5nZXQgKyBcIl1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnXScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIHBhdGgsIHBhdGhlcywgcHJldkJhc2UpO1xyXG4gICAgICBjYXNlICcoJzpcclxuICAgICAgICAvLyBjYWxsKGNhbGxlZSwgYXJncylcclxuICAgICAgICB2YXIgYXJncyA9IHRoaXMuYXJndW1lbnRzKCkuam9pbignLCcpO1xyXG4gICAgICAgIGJhc2UgPSAgYmFzZStcIihcIiArIGFyZ3MgK1wiKVwiO1xyXG4gICAgICAgIHRoaXMubWF0Y2goJyknKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcihiYXNlLCBudWxsLCBwYXRoZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiggcGF0aGVzICYmIHBhdGhlcy5sZW5ndGggKSB0aGlzLmRlcGVuZC5wdXNoKCBwYXRoZXMgKTtcclxuICB2YXIgcmVzID0gIHtnZXQ6IGJhc2V9O1xyXG4gIGlmKGxhc3Qpe1xyXG4gICAgcmVzLnNldCA9IGN0eE5hbWUgKyBcIi5fc3NfKFwiICsgXHJcbiAgICAgICAgKGxhc3QuZ2V0PyBsYXN0LmdldCA6IFwiJ1wiKyBsYXN0ICsgXCInXCIpICsgXHJcbiAgICAgICAgXCIsXCIrIF8uc2V0TmFtZSArIFwiLFwiKyBcclxuICAgICAgICAocHJldkJhc2U/cHJldkJhc2U6Xy52YXJOYW1lKSArIFxyXG4gICAgICAgIFwiLCAnPScsIFwiKyAoIG9ubHlTaW1wbGVBY2Nlc3Nvcj8gMSA6IDAgKSArIFwiKVwiO1xyXG4gIFxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5vcC5hcmd1bWVudHMgPSBmdW5jdGlvbihlbmQpe1xyXG4gIGVuZCA9IGVuZCB8fCAnKSdcclxuICB2YXIgYXJncyA9IFtdO1xyXG4gIGRve1xyXG4gICAgaWYodGhpcy5sYSgpICE9PSBlbmQpe1xyXG4gICAgICBhcmdzLnB1c2godGhpcy5hc3NpZ24oKS5nZXQpXHJcbiAgICB9XHJcbiAgfXdoaWxlKCB0aGlzLmVhdCgnLCcpKTtcclxuICByZXR1cm4gYXJnc1xyXG59XHJcblxyXG5cclxuLy8gcHJpbWFyeSA6XHJcbi8vIHRoaXMgXHJcbi8vIGlkZW50XHJcbi8vIGxpdGVyYWxcclxuLy8gYXJyYXlcclxuLy8gb2JqZWN0XHJcbi8vICggZXhwcmVzc2lvbiApXHJcblxyXG5vcC5wcmltYXJ5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIntcIjpcclxuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0KCk7XHJcbiAgICBjYXNlIFwiW1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xyXG4gICAgY2FzZSBcIihcIjpcclxuICAgICAgcmV0dXJuIHRoaXMucGFyZW4oKTtcclxuICAgIC8vIGxpdGVyYWwgb3IgaWRlbnRcclxuICAgIGNhc2UgJ1NUUklORyc6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB2YXIgdmFsdWUgPSBcIlwiICsgbGwudmFsdWU7XHJcbiAgICAgIHZhciBxdW90YSA9IH52YWx1ZS5pbmRleE9mKFwiJ1wiKT8gXCJcXFwiXCI6IFwiJ1wiIDtcclxuICAgICAgcmV0dXJuIGdldHNldChxdW90YSArIHZhbHVlICsgcXVvdGEpO1xyXG4gICAgY2FzZSAnTlVNQkVSJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHJldHVybiBnZXRzZXQoIFwiXCIgKyBsbC52YWx1ZSApO1xyXG4gICAgY2FzZSBcIklERU5UXCI6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICBpZihpc0tleVdvcmQobGwudmFsdWUpKXtcclxuICAgICAgICByZXR1cm4gZ2V0c2V0KCBsbC52YWx1ZSApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBsbC52YWx1ZTtcclxuICAgIGRlZmF1bHQ6IFxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIFRva2VuOiAnICsgbGwudHlwZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvYmplY3RcclxuLy8gIHtwcm9wQXNzaWduIFssIHByb3BBc3NpZ25dICogWyxdfVxyXG5cclxuLy8gcHJvcEFzc2lnblxyXG4vLyAgcHJvcCA6IGFzc2lnblxyXG5cclxuLy8gcHJvcFxyXG4vLyAgU1RSSU5HXHJcbi8vICBJREVOVFxyXG4vLyAgTlVNQkVSXHJcblxyXG5vcC5vYmplY3QgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb2RlID0gW3RoaXMubWF0Y2goJ3snKS50eXBlXTtcclxuXHJcbiAgdmFyIGxsID0gdGhpcy5lYXQoIFsnU1RSSU5HJywgJ0lERU5UJywgJ05VTUJFUiddICk7XHJcbiAgd2hpbGUobGwpe1xyXG4gICAgY29kZS5wdXNoKFwiJ1wiICsgbGwudmFsdWUgKyBcIidcIiArIHRoaXMubWF0Y2goJzonKS50eXBlKTtcclxuICAgIHZhciBnZXQgPSB0aGlzLmFzc2lnbigpLmdldDtcclxuICAgIGNvZGUucHVzaChnZXQpO1xyXG4gICAgbGwgPSBudWxsO1xyXG4gICAgaWYodGhpcy5lYXQoXCIsXCIpICYmIChsbCA9IHRoaXMuZWF0KFsnU1RSSU5HJywgJ0lERU5UJywgJ05VTUJFUiddKSkgKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gIH1cclxuICBjb2RlLnB1c2godGhpcy5tYXRjaCgnfScpLnR5cGUpO1xyXG4gIHJldHVybiB7Z2V0OiBjb2RlLmpvaW4oXCJcIil9XHJcbn1cclxuXHJcbi8vIGFycmF5XHJcbi8vIFsgYXNzaWduWyxhc3NpZ25dKl1cclxub3AuYXJyYXkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb2RlID0gW3RoaXMubWF0Y2goJ1snKS50eXBlXSwgaXRlbTtcclxuICBpZiggdGhpcy5lYXQoXCJdXCIpICl7XHJcblxyXG4gICAgIGNvZGUucHVzaChcIl1cIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlKGl0ZW0gPSB0aGlzLmFzc2lnbigpKXtcclxuICAgICAgY29kZS5wdXNoKGl0ZW0uZ2V0KTtcclxuICAgICAgaWYodGhpcy5lYXQoJywnKSkgY29kZS5wdXNoKFwiLFwiKTtcclxuICAgICAgZWxzZSBicmVhaztcclxuICAgIH1cclxuICAgIGNvZGUucHVzaCh0aGlzLm1hdGNoKCddJykudHlwZSk7XHJcbiAgfVxyXG4gIHJldHVybiB7Z2V0OiBjb2RlLmpvaW4oXCJcIil9O1xyXG59XHJcblxyXG4vLyAnKCcgZXhwcmVzc2lvbiAnKSdcclxub3AucGFyZW4gPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMubWF0Y2goJygnKTtcclxuICB2YXIgcmVzID0gdGhpcy5maWx0ZXIoKVxyXG4gIHJlcy5nZXQgPSAnKCcgKyByZXMuZ2V0ICsgJyknO1xyXG4gIHJlcy5zZXQgPSByZXMuc2V0O1xyXG4gIHRoaXMubWF0Y2goJyknKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRzZXQoZ2V0LCBzZXQpe1xyXG4gIHJldHVybiB7XHJcbiAgICBnZXQ6IGdldCxcclxuICAgIHNldDogc2V0XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL19zZXRpbW1lZGlhdGVAMS4wLjVAc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHNoaW0gZm9yIGVzNVxyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIHRzdHIgPSAoe30pLnRvU3RyaW5nO1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKG8xLCBvMiApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYoIG8xW2ldID09PSB1bmRlZmluZWQpe1xyXG4gICAgbzFbaV0gPSBvMltpXVxyXG4gIH1cclxuICByZXR1cm4gbzI7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gU3RyaW5nIHByb3RvIDtcclxuICBleHRlbmQoU3RyaW5nLnByb3RvdHlwZSwge1xyXG4gICAgdHJpbTogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbiAgLy8gQXJyYXkgcHJvdG87XHJcbiAgZXh0ZW5kKEFycmF5LnByb3RvdHlwZSwge1xyXG4gICAgaW5kZXhPZjogZnVuY3Rpb24ob2JqLCBmcm9tKXtcclxuICAgICAgZnJvbSA9IGZyb20gfHwgMDtcclxuICAgICAgZm9yICh2YXIgaSA9IGZyb20sIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSByZXR1cm4gaTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9LFxyXG4gICAgLy8gcG9seWZpbGwgZnJvbSBNRE4gXHJcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgY3R4KXtcclxuICAgICAgdmFyIGsgPSAwO1xyXG5cclxuICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXHJcbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG5cclxuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwOyBcclxuXHJcbiAgICAgIGlmICggdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggY2FsbGJhY2sgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxyXG4gICAgICB3aGlsZSggayA8IGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGtWYWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKCBrIGluIE8gKSB7XHJcblxyXG4gICAgICAgICAga1ZhbHVlID0gT1sgayBdO1xyXG5cclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoIGN0eCwga1ZhbHVlLCBrLCBPICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGsrKztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEBkZXByZWNhdGVkXHJcbiAgICAvLyAgd2lsbCBiZSByZW1vdmVkIGF0IDAuNS4wXHJcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGZ1biwgY29udGV4dCl7XHJcblxyXG4gICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcclxuICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xyXG4gICAgICBpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuXHJcbiAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuICAgICAge1xyXG4gICAgICAgIGlmIChpIGluIHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIHZhbCA9IHRbaV07XHJcbiAgICAgICAgICBpZiAoZnVuLmNhbGwoY29udGV4dCwgdmFsLCBpLCB0KSlcclxuICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIEZ1bmN0aW9uIHByb3RvO1xyXG4gIGV4dGVuZChGdW5jdGlvbi5wcm90b3R5cGUsIHtcclxuICAgIGJpbmQ6IGZ1bmN0aW9uKGNvbnRleHQpe1xyXG4gICAgICB2YXIgZm4gPSB0aGlzO1xyXG4gICAgICB2YXIgcHJlQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBwcmVBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgXHJcbiAgLy8gQXJyYXlcclxuICBleHRlbmQoQXJyYXksIHtcclxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKGFycil7XHJcbiAgICAgIHJldHVybiB0c3RyLmNhbGwoYXJyKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9oZWxwZXIvc2hpbS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNTQwNjQvaG93LXRvLWNvbnZlcnQtY2hhcmFjdGVycy10by1odG1sLWVudGl0aWVzLXVzaW5nLXBsYWluLWphdmFzY3JpcHRcclxudmFyIGVudGl0aWVzID0ge1xyXG4gICdxdW90JzozNCwgXHJcbiAgJ2FtcCc6MzgsIFxyXG4gICdhcG9zJzozOSwgXHJcbiAgJ2x0Jzo2MCwgXHJcbiAgJ2d0Jzo2MiwgXHJcbiAgJ25ic3AnOjE2MCwgXHJcbiAgJ2lleGNsJzoxNjEsIFxyXG4gICdjZW50JzoxNjIsIFxyXG4gICdwb3VuZCc6MTYzLCBcclxuICAnY3VycmVuJzoxNjQsIFxyXG4gICd5ZW4nOjE2NSwgXHJcbiAgJ2JydmJhcic6MTY2LCBcclxuICAnc2VjdCc6MTY3LCBcclxuICAndW1sJzoxNjgsIFxyXG4gICdjb3B5JzoxNjksIFxyXG4gICdvcmRmJzoxNzAsIFxyXG4gICdsYXF1byc6MTcxLCBcclxuICAnbm90JzoxNzIsIFxyXG4gICdzaHknOjE3MywgXHJcbiAgJ3JlZyc6MTc0LCBcclxuICAnbWFjcic6MTc1LCBcclxuICAnZGVnJzoxNzYsIFxyXG4gICdwbHVzbW4nOjE3NywgXHJcbiAgJ3N1cDInOjE3OCwgXHJcbiAgJ3N1cDMnOjE3OSwgXHJcbiAgJ2FjdXRlJzoxODAsIFxyXG4gICdtaWNybyc6MTgxLCBcclxuICAncGFyYSc6MTgyLCBcclxuICAnbWlkZG90JzoxODMsIFxyXG4gICdjZWRpbCc6MTg0LCBcclxuICAnc3VwMSc6MTg1LCBcclxuICAnb3JkbSc6MTg2LCBcclxuICAncmFxdW8nOjE4NywgXHJcbiAgJ2ZyYWMxNCc6MTg4LCBcclxuICAnZnJhYzEyJzoxODksIFxyXG4gICdmcmFjMzQnOjE5MCwgXHJcbiAgJ2lxdWVzdCc6MTkxLCBcclxuICAnQWdyYXZlJzoxOTIsIFxyXG4gICdBYWN1dGUnOjE5MywgXHJcbiAgJ0FjaXJjJzoxOTQsIFxyXG4gICdBdGlsZGUnOjE5NSwgXHJcbiAgJ0F1bWwnOjE5NiwgXHJcbiAgJ0FyaW5nJzoxOTcsIFxyXG4gICdBRWxpZyc6MTk4LCBcclxuICAnQ2NlZGlsJzoxOTksIFxyXG4gICdFZ3JhdmUnOjIwMCwgXHJcbiAgJ0VhY3V0ZSc6MjAxLCBcclxuICAnRWNpcmMnOjIwMiwgXHJcbiAgJ0V1bWwnOjIwMywgXHJcbiAgJ0lncmF2ZSc6MjA0LCBcclxuICAnSWFjdXRlJzoyMDUsIFxyXG4gICdJY2lyYyc6MjA2LCBcclxuICAnSXVtbCc6MjA3LCBcclxuICAnRVRIJzoyMDgsIFxyXG4gICdOdGlsZGUnOjIwOSwgXHJcbiAgJ09ncmF2ZSc6MjEwLCBcclxuICAnT2FjdXRlJzoyMTEsIFxyXG4gICdPY2lyYyc6MjEyLCBcclxuICAnT3RpbGRlJzoyMTMsIFxyXG4gICdPdW1sJzoyMTQsIFxyXG4gICd0aW1lcyc6MjE1LCBcclxuICAnT3NsYXNoJzoyMTYsIFxyXG4gICdVZ3JhdmUnOjIxNywgXHJcbiAgJ1VhY3V0ZSc6MjE4LCBcclxuICAnVWNpcmMnOjIxOSwgXHJcbiAgJ1V1bWwnOjIyMCwgXHJcbiAgJ1lhY3V0ZSc6MjIxLCBcclxuICAnVEhPUk4nOjIyMiwgXHJcbiAgJ3N6bGlnJzoyMjMsIFxyXG4gICdhZ3JhdmUnOjIyNCwgXHJcbiAgJ2FhY3V0ZSc6MjI1LCBcclxuICAnYWNpcmMnOjIyNiwgXHJcbiAgJ2F0aWxkZSc6MjI3LCBcclxuICAnYXVtbCc6MjI4LCBcclxuICAnYXJpbmcnOjIyOSwgXHJcbiAgJ2FlbGlnJzoyMzAsIFxyXG4gICdjY2VkaWwnOjIzMSwgXHJcbiAgJ2VncmF2ZSc6MjMyLCBcclxuICAnZWFjdXRlJzoyMzMsIFxyXG4gICdlY2lyYyc6MjM0LCBcclxuICAnZXVtbCc6MjM1LCBcclxuICAnaWdyYXZlJzoyMzYsIFxyXG4gICdpYWN1dGUnOjIzNywgXHJcbiAgJ2ljaXJjJzoyMzgsIFxyXG4gICdpdW1sJzoyMzksIFxyXG4gICdldGgnOjI0MCwgXHJcbiAgJ250aWxkZSc6MjQxLCBcclxuICAnb2dyYXZlJzoyNDIsIFxyXG4gICdvYWN1dGUnOjI0MywgXHJcbiAgJ29jaXJjJzoyNDQsIFxyXG4gICdvdGlsZGUnOjI0NSwgXHJcbiAgJ291bWwnOjI0NiwgXHJcbiAgJ2RpdmlkZSc6MjQ3LCBcclxuICAnb3NsYXNoJzoyNDgsIFxyXG4gICd1Z3JhdmUnOjI0OSwgXHJcbiAgJ3VhY3V0ZSc6MjUwLCBcclxuICAndWNpcmMnOjI1MSwgXHJcbiAgJ3V1bWwnOjI1MiwgXHJcbiAgJ3lhY3V0ZSc6MjUzLCBcclxuICAndGhvcm4nOjI1NCwgXHJcbiAgJ3l1bWwnOjI1NSwgXHJcbiAgJ2Zub2YnOjQwMiwgXHJcbiAgJ0FscGhhJzo5MTMsIFxyXG4gICdCZXRhJzo5MTQsIFxyXG4gICdHYW1tYSc6OTE1LCBcclxuICAnRGVsdGEnOjkxNiwgXHJcbiAgJ0Vwc2lsb24nOjkxNywgXHJcbiAgJ1pldGEnOjkxOCwgXHJcbiAgJ0V0YSc6OTE5LCBcclxuICAnVGhldGEnOjkyMCwgXHJcbiAgJ0lvdGEnOjkyMSwgXHJcbiAgJ0thcHBhJzo5MjIsIFxyXG4gICdMYW1iZGEnOjkyMywgXHJcbiAgJ011Jzo5MjQsIFxyXG4gICdOdSc6OTI1LCBcclxuICAnWGknOjkyNiwgXHJcbiAgJ09taWNyb24nOjkyNywgXHJcbiAgJ1BpJzo5MjgsIFxyXG4gICdSaG8nOjkyOSwgXHJcbiAgJ1NpZ21hJzo5MzEsIFxyXG4gICdUYXUnOjkzMiwgXHJcbiAgJ1Vwc2lsb24nOjkzMywgXHJcbiAgJ1BoaSc6OTM0LCBcclxuICAnQ2hpJzo5MzUsIFxyXG4gICdQc2knOjkzNiwgXHJcbiAgJ09tZWdhJzo5MzcsIFxyXG4gICdhbHBoYSc6OTQ1LCBcclxuICAnYmV0YSc6OTQ2LCBcclxuICAnZ2FtbWEnOjk0NywgXHJcbiAgJ2RlbHRhJzo5NDgsIFxyXG4gICdlcHNpbG9uJzo5NDksIFxyXG4gICd6ZXRhJzo5NTAsIFxyXG4gICdldGEnOjk1MSwgXHJcbiAgJ3RoZXRhJzo5NTIsIFxyXG4gICdpb3RhJzo5NTMsIFxyXG4gICdrYXBwYSc6OTU0LCBcclxuICAnbGFtYmRhJzo5NTUsIFxyXG4gICdtdSc6OTU2LCBcclxuICAnbnUnOjk1NywgXHJcbiAgJ3hpJzo5NTgsIFxyXG4gICdvbWljcm9uJzo5NTksIFxyXG4gICdwaSc6OTYwLCBcclxuICAncmhvJzo5NjEsIFxyXG4gICdzaWdtYWYnOjk2MiwgXHJcbiAgJ3NpZ21hJzo5NjMsIFxyXG4gICd0YXUnOjk2NCwgXHJcbiAgJ3Vwc2lsb24nOjk2NSwgXHJcbiAgJ3BoaSc6OTY2LCBcclxuICAnY2hpJzo5NjcsIFxyXG4gICdwc2knOjk2OCwgXHJcbiAgJ29tZWdhJzo5NjksIFxyXG4gICd0aGV0YXN5bSc6OTc3LCBcclxuICAndXBzaWgnOjk3OCwgXHJcbiAgJ3Bpdic6OTgyLCBcclxuICAnYnVsbCc6ODIyNiwgXHJcbiAgJ2hlbGxpcCc6ODIzMCwgXHJcbiAgJ3ByaW1lJzo4MjQyLCBcclxuICAnUHJpbWUnOjgyNDMsIFxyXG4gICdvbGluZSc6ODI1NCwgXHJcbiAgJ2ZyYXNsJzo4MjYwLCBcclxuICAnd2VpZXJwJzo4NDcyLCBcclxuICAnaW1hZ2UnOjg0NjUsIFxyXG4gICdyZWFsJzo4NDc2LCBcclxuICAndHJhZGUnOjg0ODIsIFxyXG4gICdhbGVmc3ltJzo4NTAxLCBcclxuICAnbGFycic6ODU5MiwgXHJcbiAgJ3VhcnInOjg1OTMsIFxyXG4gICdyYXJyJzo4NTk0LCBcclxuICAnZGFycic6ODU5NSwgXHJcbiAgJ2hhcnInOjg1OTYsIFxyXG4gICdjcmFycic6ODYyOSwgXHJcbiAgJ2xBcnInOjg2NTYsIFxyXG4gICd1QXJyJzo4NjU3LCBcclxuICAnckFycic6ODY1OCwgXHJcbiAgJ2RBcnInOjg2NTksIFxyXG4gICdoQXJyJzo4NjYwLCBcclxuICAnZm9yYWxsJzo4NzA0LCBcclxuICAncGFydCc6ODcwNiwgXHJcbiAgJ2V4aXN0Jzo4NzA3LCBcclxuICAnZW1wdHknOjg3MDksIFxyXG4gICduYWJsYSc6ODcxMSwgXHJcbiAgJ2lzaW4nOjg3MTIsIFxyXG4gICdub3Rpbic6ODcxMywgXHJcbiAgJ25pJzo4NzE1LCBcclxuICAncHJvZCc6ODcxOSwgXHJcbiAgJ3N1bSc6ODcyMSwgXHJcbiAgJ21pbnVzJzo4NzIyLCBcclxuICAnbG93YXN0Jzo4NzI3LCBcclxuICAncmFkaWMnOjg3MzAsIFxyXG4gICdwcm9wJzo4NzMzLCBcclxuICAnaW5maW4nOjg3MzQsIFxyXG4gICdhbmcnOjg3MzYsIFxyXG4gICdhbmQnOjg3NDMsIFxyXG4gICdvcic6ODc0NCwgXHJcbiAgJ2NhcCc6ODc0NSwgXHJcbiAgJ2N1cCc6ODc0NiwgXHJcbiAgJ2ludCc6ODc0NywgXHJcbiAgJ3RoZXJlNCc6ODc1NiwgXHJcbiAgJ3NpbSc6ODc2NCwgXHJcbiAgJ2NvbmcnOjg3NzMsIFxyXG4gICdhc3ltcCc6ODc3NiwgXHJcbiAgJ25lJzo4ODAwLCBcclxuICAnZXF1aXYnOjg4MDEsIFxyXG4gICdsZSc6ODgwNCwgXHJcbiAgJ2dlJzo4ODA1LCBcclxuICAnc3ViJzo4ODM0LCBcclxuICAnc3VwJzo4ODM1LCBcclxuICAnbnN1Yic6ODgzNiwgXHJcbiAgJ3N1YmUnOjg4MzgsIFxyXG4gICdzdXBlJzo4ODM5LCBcclxuICAnb3BsdXMnOjg4NTMsIFxyXG4gICdvdGltZXMnOjg4NTUsIFxyXG4gICdwZXJwJzo4ODY5LCBcclxuICAnc2RvdCc6ODkwMSwgXHJcbiAgJ2xjZWlsJzo4OTY4LCBcclxuICAncmNlaWwnOjg5NjksIFxyXG4gICdsZmxvb3InOjg5NzAsIFxyXG4gICdyZmxvb3InOjg5NzEsIFxyXG4gICdsYW5nJzo5MDAxLCBcclxuICAncmFuZyc6OTAwMiwgXHJcbiAgJ2xveic6OTY3NCwgXHJcbiAgJ3NwYWRlcyc6OTgyNCwgXHJcbiAgJ2NsdWJzJzo5ODI3LCBcclxuICAnaGVhcnRzJzo5ODI5LCBcclxuICAnZGlhbXMnOjk4MzAsIFxyXG4gICdPRWxpZyc6MzM4LCBcclxuICAnb2VsaWcnOjMzOSwgXHJcbiAgJ1NjYXJvbic6MzUyLCBcclxuICAnc2Nhcm9uJzozNTMsIFxyXG4gICdZdW1sJzozNzYsIFxyXG4gICdjaXJjJzo3MTAsIFxyXG4gICd0aWxkZSc6NzMyLCBcclxuICAnZW5zcCc6ODE5NCwgXHJcbiAgJ2Vtc3AnOjgxOTUsIFxyXG4gICd0aGluc3AnOjgyMDEsIFxyXG4gICd6d25qJzo4MjA0LCBcclxuICAnendqJzo4MjA1LCBcclxuICAnbHJtJzo4MjA2LCBcclxuICAncmxtJzo4MjA3LCBcclxuICAnbmRhc2gnOjgyMTEsIFxyXG4gICdtZGFzaCc6ODIxMiwgXHJcbiAgJ2xzcXVvJzo4MjE2LCBcclxuICAncnNxdW8nOjgyMTcsIFxyXG4gICdzYnF1byc6ODIxOCwgXHJcbiAgJ2xkcXVvJzo4MjIwLCBcclxuICAncmRxdW8nOjgyMjEsIFxyXG4gICdiZHF1byc6ODIyMiwgXHJcbiAgJ2RhZ2dlcic6ODIyNCwgXHJcbiAgJ0RhZ2dlcic6ODIyNSwgXHJcbiAgJ3Blcm1pbCc6ODI0MCwgXHJcbiAgJ2xzYXF1byc6ODI0OSwgXHJcbiAgJ3JzYXF1byc6ODI1MCwgXHJcbiAgJ2V1cm8nOjgzNjRcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgPSBlbnRpdGllcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGVsZW1lbnQ6IGZ1bmN0aW9uKG5hbWUsIGF0dHJzLCBjaGlsZHJlbil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnZWxlbWVudCcsXHJcbiAgICAgIHRhZzogbmFtZSxcclxuICAgICAgYXR0cnM6IGF0dHJzLFxyXG4gICAgICBjaGlsZHJlbjogY2hpbGRyZW5cclxuICAgIH1cclxuICB9LFxyXG4gIGF0dHJpYnV0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIG1kZil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBtZGY6IG1kZlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJpZlwiOiBmdW5jdGlvbih0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2lmJyxcclxuICAgICAgdGVzdDogdGVzdCxcclxuICAgICAgY29uc2VxdWVudDogY29uc2VxdWVudCxcclxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGVcclxuICAgIH1cclxuICB9LFxyXG4gIGxpc3Q6IGZ1bmN0aW9uKHNlcXVlbmNlLCB2YXJpYWJsZSwgYm9keSwgYWx0ZXJuYXRlLCB0cmFjayl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnbGlzdCcsXHJcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcclxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGUsXHJcbiAgICAgIHZhcmlhYmxlOiB2YXJpYWJsZSxcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgdHJhY2s6IHRyYWNrXHJcbiAgICB9XHJcbiAgfSxcclxuICBleHByZXNzaW9uOiBmdW5jdGlvbiggYm9keSwgc2V0Ym9keSwgY29uc3RhbnQsIGZpbHRlcnMgKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwiZXhwcmVzc2lvblwiLFxyXG4gICAgICBib2R5OiBib2R5LFxyXG4gICAgICBjb25zdGFudDogY29uc3RhbnQgfHwgZmFsc2UsXHJcbiAgICAgIHNldGJvZHk6IHNldGJvZHkgfHwgZmFsc2UsXHJcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnNcclxuICAgIH1cclxuICB9LFxyXG4gIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgIHRleHQ6IHRleHRcclxuICAgIH1cclxuICB9LFxyXG4gIHRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAndGVtcGxhdGUnLFxyXG4gICAgICBjb250ZW50OiB0ZW1wbGF0ZVxyXG4gICAgfVxyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvbm9kZS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxuXHJcbi8vIHNvbWUgY3VzdG9tIHRhZyAgd2lsbCBjb25mbGljdCB3aXRoIHRoZSBMZXhlciBwcm9ncmVzc1xyXG52YXIgY29uZmxpY3RUYWcgPSB7XCJ9XCI6IFwie1wiLCBcIl1cIjogXCJbXCJ9LCBtYXAxLCBtYXAyO1xyXG4vLyBzb21lIG1hY3JvIGZvciBsZXhlclxyXG52YXIgbWFjcm8gPSB7XHJcbiAgJ05BTUUnOiAvKD86WzpfQS1aYS16XVstXFwuOl8wLTlBLVphLXpdKikvLFxyXG4gICdJREVOVCc6IC9bXFwkX0EtWmEtel1bXzAtOUEtWmEtelxcJF0qLyxcclxuICAnU1BBQ0UnOiAvW1xcclxcblxcdFxcZiBdL1xyXG59XHJcblxyXG5cclxudmFyIHRlc3QgPSAvYXwoYikvLmV4ZWMoXCJhXCIpO1xyXG52YXIgdGVzdFN1YkNhcHVyZSA9IHRlc3QgJiYgdGVzdFsxXSA9PT0gdW5kZWZpbmVkPyBcclxuICBmdW5jdGlvbihzdHIpeyByZXR1cm4gc3RyICE9PSB1bmRlZmluZWQgfVxyXG4gIDpmdW5jdGlvbihzdHIpe3JldHVybiAhIXN0cn07XHJcblxyXG5mdW5jdGlvbiB3cmFwSGFuZGVyKGhhbmRsZXIpe1xyXG4gIHJldHVybiBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiBoYW5kbGVyLCB2YWx1ZTogYWxsIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExleGVyKGlucHV0LCBvcHRzKXtcclxuICBpZihjb25mbGljdFRhZ1tjb25maWcuRU5EXSl7XHJcbiAgICB0aGlzLm1hcmtTdGFydCA9IGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdO1xyXG4gICAgdGhpcy5tYXJrRW5kID0gY29uZmlnLkVORDtcclxuICB9XHJcblxyXG4gIHRoaXMuaW5wdXQgPSAoaW5wdXR8fFwiXCIpLnRyaW0oKTtcclxuICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gIHRoaXMubWFwID0gdGhpcy5vcHRzLm1vZGUgIT09IDI/ICBtYXAxOiBtYXAyO1xyXG4gIHRoaXMuc3RhdGVzID0gW1wiSU5JVFwiXTtcclxuICBpZihvcHRzICYmIG9wdHMuZXhwcmVzc2lvbil7XHJcbiAgICAgdGhpcy5zdGF0ZXMucHVzaChcIkpTVFwiKTtcclxuICAgICB0aGlzLmV4cHJlc3Npb24gPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGxvID0gTGV4ZXIucHJvdG90eXBlXHJcblxyXG5cclxubG8ubGV4ID0gZnVuY3Rpb24oc3RyKXtcclxuICBzdHIgPSAoc3RyIHx8IHRoaXMuaW5wdXQpLnRyaW0oKTtcclxuICB2YXIgdG9rZW5zID0gW10sIHNwbGl0LCB0ZXN0LG1sZW4sIHRva2VuLCBzdGF0ZTtcclxuICB0aGlzLmlucHV0ID0gc3RyLCBcclxuICB0aGlzLm1hcmtzID0gMDtcclxuICAvLyBpbml0IHRoZSBwb3MgaW5kZXhcclxuICB0aGlzLmluZGV4PTA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlKHN0cil7XHJcbiAgICBpKytcclxuICAgIHN0YXRlID0gdGhpcy5zdGF0ZSgpO1xyXG4gICAgc3BsaXQgPSB0aGlzLm1hcFtzdGF0ZV0gXHJcbiAgICB0ZXN0ID0gc3BsaXQuVFJVTksuZXhlYyhzdHIpO1xyXG4gICAgaWYoIXRlc3Qpe1xyXG4gICAgICB0aGlzLmVycm9yKCdVbnJlY29naW5pemVkIFRva2VuJyk7XHJcbiAgICB9XHJcbiAgICBtbGVuID0gdGVzdFswXS5sZW5ndGg7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UobWxlbilcclxuICAgIHRva2VuID0gdGhpcy5fcHJvY2Vzcy5jYWxsKHRoaXMsIHRlc3QsIHNwbGl0LCBzdHIpXHJcbiAgICBpZih0b2tlbikgdG9rZW5zLnB1c2godG9rZW4pXHJcbiAgICB0aGlzLmluZGV4ICs9IG1sZW47XHJcbiAgICAvLyBpZihzdGF0ZSA9PSAnVEFHJyB8fCBzdGF0ZSA9PSAnSlNUJykgc3RyID0gdGhpcy5za2lwc3BhY2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIHRva2Vucy5wdXNoKHt0eXBlOiAnRU9GJ30pO1xyXG5cclxuICByZXR1cm4gdG9rZW5zO1xyXG59XHJcblxyXG5sby5lcnJvciA9IGZ1bmN0aW9uKG1zZyl7XHJcbiAgdGhyb3cgIEVycm9yKFwiUGFyc2UgRXJyb3I6IFwiICsgbXNnICsgICc6XFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0aGlzLmluZGV4KSk7XHJcbn1cclxuXHJcbmxvLl9wcm9jZXNzID0gZnVuY3Rpb24oYXJncywgc3BsaXQsc3RyKXtcclxuICAvLyBjb25zb2xlLmxvZyhhcmdzLmpvaW4oXCIsXCIpLCB0aGlzLnN0YXRlKCkpXHJcbiAgdmFyIGxpbmtzID0gc3BsaXQubGlua3MsIG1hcmNoZWQgPSBmYWxzZSwgdG9rZW47XHJcblxyXG4gIGZvcih2YXIgbGVuID0gbGlua3MubGVuZ3RoLCBpPTA7aTxsZW4gO2krKyl7XHJcbiAgICB2YXIgbGluayA9IGxpbmtzW2ldLFxyXG4gICAgICBoYW5kbGVyID0gbGlua1syXSxcclxuICAgICAgaW5kZXggPSBsaW5rWzBdO1xyXG4gICAgLy8gaWYoYXJnc1s2XSA9PT0gJz4nICYmIGluZGV4ID09PSA2KSBjb25zb2xlLmxvZygnaGFoYScpXHJcbiAgICBpZih0ZXN0U3ViQ2FwdXJlKGFyZ3NbaW5kZXhdKSkge1xyXG4gICAgICBtYXJjaGVkID0gdHJ1ZTtcclxuICAgICAgaWYoaGFuZGxlcil7XHJcbiAgICAgICAgdG9rZW4gPSBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3Muc2xpY2UoaW5kZXgsIGluZGV4ICsgbGlua1sxXSkpXHJcbiAgICAgICAgaWYodG9rZW4pICB0b2tlbi5wb3MgPSB0aGlzLmluZGV4O1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZighbWFyY2hlZCl7IC8vIGluIGllIGx0OCAuIHN1YiBjYXB0dXJlIGlzIFwiXCIgYnV0IG9udCBcclxuICAgIHN3aXRjaChzdHIuY2hhckF0KDApKXtcclxuICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICB0aGlzLmVudGVyKFwiVEFHXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJKU1RcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbjtcclxufVxyXG5sby5lbnRlciA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKVxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5sby5zdGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIHJldHVybiBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXTtcclxufVxyXG5cclxubG8ubGVhdmUgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIGlmKCFzdGF0ZSB8fCBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXSA9PT0gc3RhdGUpIHN0YXRlcy5wb3AoKVxyXG59XHJcblxyXG5cclxuTGV4ZXIuc2V0dXAgPSBmdW5jdGlvbigpe1xyXG4gIG1hY3JvLkVORCA9IGNvbmZpZy5FTkQ7XHJcbiAgbWFjcm8uQkVHSU4gPSBjb25maWcuQkVHSU47XHJcbiAgLy9cclxuICBtYXAxID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVRcclxuICAgIHJ1bGVzLkVOVEVSX0pTVCxcclxuICAgIHJ1bGVzLkVOVEVSX1RBRyxcclxuICAgIHJ1bGVzLlRFWFQsXHJcblxyXG4gICAgLy9UQUdcclxuICAgIHJ1bGVzLlRBR19OQU1FLFxyXG4gICAgcnVsZXMuVEFHX09QRU4sXHJcbiAgICBydWxlcy5UQUdfQ0xPU0UsXHJcbiAgICBydWxlcy5UQUdfUFVOQ0hPUixcclxuICAgIHJ1bGVzLlRBR19FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5UQUdfVU5RX1ZBTFVFLFxyXG4gICAgcnVsZXMuVEFHX1NUUklORyxcclxuICAgIHJ1bGVzLlRBR19TUEFDRSxcclxuICAgIHJ1bGVzLlRBR19DT01NRU5ULFxyXG5cclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcblxyXG4gIC8vIGlnbm9yZWQgdGhlIHRhZy1yZWxhdGl2ZSB0b2tlblxyXG4gIG1hcDIgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVCBubyA8IHJlc3RyaWN0XHJcbiAgICBydWxlcy5FTlRFUl9KU1QyLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZW5NYXAocnVsZXMpe1xyXG4gIHZhciBydWxlLCBtYXAgPSB7fSwgc2lnbjtcclxuICBmb3IodmFyIGkgPSAwLCBsZW4gPSBydWxlcy5sZW5ndGg7IGkgPCBsZW4gOyBpKyspe1xyXG4gICAgcnVsZSA9IHJ1bGVzW2ldO1xyXG4gICAgc2lnbiA9IHJ1bGVbMl0gfHwgJ0lOSVQnO1xyXG4gICAgKCBtYXBbc2lnbl0gfHwgKG1hcFtzaWduXSA9IHtydWxlczpbXSwgbGlua3M6W119KSApLnJ1bGVzLnB1c2gocnVsZSk7XHJcbiAgfVxyXG4gIHJldHVybiBzZXR1cChtYXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cChtYXApe1xyXG4gIHZhciBzcGxpdCwgcnVsZXMsIHRydW5rcywgaGFuZGxlciwgcmVnLCByZXRhaW4sIHJ1bGU7XHJcbiAgZnVuY3Rpb24gcmVwbGFjZUZuKGFsbCwgb25lKXtcclxuICAgIHJldHVybiB0eXBlb2YgbWFjcm9bb25lXSA9PT0gJ3N0cmluZyc/IFxyXG4gICAgICBfLmVzY2FwZVJlZ0V4cChtYWNyb1tvbmVdKSBcclxuICAgICAgOiBTdHJpbmcobWFjcm9bb25lXSkuc2xpY2UoMSwtMSk7XHJcbiAgfVxyXG5cclxuICBmb3IodmFyIGkgaW4gbWFwKXtcclxuXHJcbiAgICBzcGxpdCA9IG1hcFtpXTtcclxuICAgIHNwbGl0LmN1ckluZGV4ID0gMTtcclxuICAgIHJ1bGVzID0gc3BsaXQucnVsZXM7XHJcbiAgICB0cnVua3MgPSBbXTtcclxuXHJcbiAgICBmb3IodmFyIGogPSAwLGxlbiA9IHJ1bGVzLmxlbmd0aDsgajxsZW47IGorKyl7XHJcbiAgICAgIHJ1bGUgPSBydWxlc1tqXTsgXHJcbiAgICAgIHJlZyA9IHJ1bGVbMF07XHJcbiAgICAgIGhhbmRsZXIgPSBydWxlWzFdO1xyXG5cclxuICAgICAgaWYodHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICBoYW5kbGVyID0gd3JhcEhhbmRlcihoYW5kbGVyKTtcclxuICAgICAgfVxyXG4gICAgICBpZihfLnR5cGVPZihyZWcpID09PSAncmVnZXhwJykgcmVnID0gcmVnLnRvU3RyaW5nKCkuc2xpY2UoMSwgLTEpO1xyXG5cclxuICAgICAgcmVnID0gcmVnLnJlcGxhY2UoL1xceyhcXHcrKVxcfS9nLCByZXBsYWNlRm4pXHJcbiAgICAgIHJldGFpbiA9IF8uZmluZFN1YkNhcHR1cmUocmVnKSArIDE7IFxyXG4gICAgICBzcGxpdC5saW5rcy5wdXNoKFtzcGxpdC5jdXJJbmRleCwgcmV0YWluLCBoYW5kbGVyXSk7IFxyXG4gICAgICBzcGxpdC5jdXJJbmRleCArPSByZXRhaW47XHJcbiAgICAgIHRydW5rcy5wdXNoKHJlZyk7XHJcbiAgICB9XHJcbiAgICBzcGxpdC5UUlVOSyA9IG5ldyBSZWdFeHAoXCJeKD86KFwiICsgdHJ1bmtzLmpvaW4oXCIpfChcIikgKyBcIikpXCIpXHJcbiAgfVxyXG4gIHJldHVybiBtYXA7XHJcbn1cclxuXHJcbnZhciBydWxlcyA9IHtcclxuXHJcbiAgLy8gMS4gSU5JVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvLyBtb2RlMSdzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUOiBbL1teXFx4MDA8XSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUMjogWy9bXlxceDAwXSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBFTlRFUl9UQUc6IFsvW15cXHgwMF0qPyg/PTxbXFx3XFwvXFwhXSkvLCBmdW5jdGlvbihhbGwpeyBcclxuICAgIHRoaXMuZW50ZXIoJ1RBRycpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgVEVYVDogWy9bXlxceDAwXSsvLCAnVEVYVCcgXSxcclxuXHJcbiAgLy8gMi4gVEFHXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUQUdfTkFNRTogWy97TkFNRX0vLCAnTkFNRScsICdUQUcnXSxcclxuICBUQUdfVU5RX1ZBTFVFOiBbL1teXFx7fSZcIic9PjxgXFxyXFxuXFxmXFx0IF0rLywgJ1VOUScsICdUQUcnXSxcclxuXHJcbiAgVEFHX09QRU46IFsvPCh7TkFNRX0pXFxzKi8sIGZ1bmN0aW9uKGFsbCwgb25lKXsgLy9cIlxyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX09QRU4nLCB2YWx1ZTogb25lfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfQ0xPU0U6IFsvPFxcLyh7TkFNRX0pW1xcclxcblxcZlxcdCBdKj4vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfQ0xPU0UnLCB2YWx1ZTogb25lIH1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gICAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIFRBR19FTlRFUl9KU1Q6IFsvKD89e0JFR0lOfSkvLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuXHJcbiAgVEFHX1BVTkNIT1I6IFsvW1xcPlxcLz0mXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZihhbGwgPT09ICc+JykgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcXFwiLywgLyonKi8gIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyBcclxuICAgIHZhciB2YWx1ZSA9IG9uZSB8fCB0d28gfHwgXCJcIjtcclxuXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogdmFsdWV9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICBUQUdfU1BBQ0U6IFsve1NQQUNFfSsvLCBudWxsLCAnVEFHJ10sXHJcbiAgVEFHX0NPTU1FTlQ6IFsvPFxcIS0tKFteXFx4MDBdKj8pLS1cXD4vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5sZWF2ZSgpXHJcbiAgICAvLyB0aGlzLmxlYXZlKCdUQUcnKVxyXG4gIH0gLCdUQUcnXSxcclxuXHJcbiAgLy8gMy4gSlNUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBKU1RfT1BFTjogWyd7QkVHSU59I3tTUEFDRX0qKHtJREVOVH0pJywgZnVuY3Rpb24oYWxsLCBuYW1lKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdPUEVOJyxcclxuICAgICAgdmFsdWU6IG5hbWVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0xFQVZFOiBbL3tFTkR9LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKHRoaXMubWFya0VuZCA9PT0gYWxsICYmIHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9O1xyXG4gICAgaWYoIXRoaXMubWFya0VuZCB8fCAhdGhpcy5tYXJrcyApe1xyXG4gICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiAnRU5EJ31cclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLm1hcmtzLS07XHJcbiAgICAgIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ0xPU0U6IFsve0JFR0lOfVxccypcXC8oe0lERU5UfSlcXHMqe0VORH0vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdDTE9TRScsXHJcbiAgICAgIHZhbHVlOiBvbmVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NPTU1FTlQ6IFsve0JFR0lOfVxcIShbXlxceDAwXSo/KVxcIXtFTkR9LywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0VYUFJfT1BFTjogWyd7QkVHSU59JyxmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICBpZihhbGwgPT09IHRoaXMubWFya1N0YXJ0KXtcclxuICAgICAgaWYodGhpcy5leHByZXNzaW9uKSByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIGlmKHRoaXMuZmlyc3RFbnRlclN0YXJ0IHx8IHRoaXMubWFya3Mpe1xyXG4gICAgICAgIHRoaXMubWFya3MrK1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdFWFBSX09QRU4nLFxyXG4gICAgICBlc2NhcGU6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfSURFTlQ6IFsne0lERU5UfScsICdJREVOVCcsICdKU1QnXSxcclxuICBKU1RfU1BBQ0U6IFsvWyBcXHJcXG5cXGZdKy8sIG51bGwsICdKU1QnXSxcclxuICBKU1RfUFVOQ0hPUjogWy9bPSFdPz09fFstPT48KypcXC8lXFwhXT9cXD18XFx8XFx8fCYmfFxcQFxcKHxcXC5cXC58WzxcXD5cXFtcXF1cXChcXClcXC1cXHxcXHt9XFwrXFwqXFwvJT86XFwuISxdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7IHR5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwnSlNUJ10sXHJcblxyXG4gIEpTVF9TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVwiLywgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IC8vXCInXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogb25lIHx8IHR3byB8fCBcIlwifVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTlVNQkVSOiBbLyg/OlswLTldKlxcLlswLTldK3xbMC05XSspKGVcXGQrKT8vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnTlVNQkVSJywgdmFsdWU6IHBhcnNlRmxvYXQoYWxsLCAxMCl9O1xyXG4gIH0sICdKU1QnXVxyXG59XHJcblxyXG5cclxuLy8gc2V0dXAgd2hlbiBmaXJzdCBjb25maWdcclxuTGV4ZXIuc2V0dXAoKTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXhlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL0xleGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcbnZhciBFbGVtZW50ID0gcmVxdWlyZSgnLi9FbGVtZW50LmpzJyk7XHJcbnZhciBUZXh0Tm9kZSA9IHJlcXVpcmUoJy4vVGV4dE5vZGUuanMnKTtcclxuXHJcbnZhciBwcm90byA9IHtcclxuICAgIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBkb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24odGFnTmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50KHRhZ05hbWUpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZVRleHROb2RlOiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gbmV3IFRleHROb2RlKHRleHQpO1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGRvYyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkb2M7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoJy4vRG9jdW1lbnRGcmFnbWVudC5qcycpO1xyXG5cclxuZnVuY3Rpb24gRWxlbWVudCh0YWdOYW1lKXtcclxuICAgIHRoaXMuX3RhZ05hbWUgPSB0YWdOYW1lO1xyXG4gICAgdGhpcy5fYXR0cnMgPSBbXTtcclxuICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24oYXR0ck5hbWUsIGF0dHJWYWx1ZSl7XHJcbiAgICB2YXIgZXZlbnRQYXR0ZXJuID0gL29uLS87XHJcblxyXG4gICAgaWYoZXZlbnRQYXR0ZXJuLnRlc3QoYXR0ck5hbWUpKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5fYXR0cnMucHVzaCh7bmFtZTogYXR0ck5hbWUsIHZhbHVlOiBhdHRyVmFsdWV9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIsIGlzUG9wLCBhcmdDb250ZXh0KXtcclxuICAgIHRoaXMuX2V2ZW50cy5wdXNoKHtuYW1lOiBldmVudE5hbWUucmVwbGFjZSgvLS8sICcnKSwgdmFsdWU6IGhhbmRsZXIrJycsIGNvbnRleHQ6IGFyZ0NvbnRleHR9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgaWYobm9kZSBpbnN0YW5jZW9mIGRvY3VtZW50RnJhZ21lbnQpe1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8bm9kZS5fY2hpbGRyZW4ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZS5fY2hpbGRyZW5baV0pOyAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9FbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsImZ1bmN0aW9uIFRleHROb2RlKHRleHQpe1xyXG4gICAgdGhpcy5fdmFsdWUgPSB0ZXh0O1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRleHROb2RlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vVGV4dE5vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NTE6NTMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjUgMDc6NDE6MTJcclxuICovXHJcbmZ1bmN0aW9uIE1lc3NhZ2VCdXMoKSB7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIgPSBbXTtcclxuICAgIHRoaXMuX2Jhc2VJZCA9IDA7XHJcbiAgICB0aGlzLl9pbml0V29ya2VyKCk7XHJcbiAgICB0aGlzLl9jcmVhdGVFdmVudHNTdG9yZSgpO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fY3JlYXRlRXZlbnRzU3RvcmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9ldmVudHNTdG9yZSA9IHt9O1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fb25NZXNzYWdlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciBJbmZvID0gdGhpcy5fZGVzZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICB0aGlzLl9yZWNlaXZlQnVzUmVzb2x2ZXIoSW5mbyk7XHJcbiAgICB0aGlzLl9lbWl0KEluZm8uaWQsIEluZm8udHlwZSwgSW5mby5kYXRhKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9yZWNlaXZlQnVzUmVzb2x2ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5yZWNlaXZlID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHRoaXMuX2J1ZmZlciA9IG1lc3NhZ2U7XHJcbiAgICB0aGlzLl9zZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLmFkZEV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50VHlwZSwgZm4pIHtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKGV2ZW50VHlwZSwgZm4uYmluZCh0aGlzKSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZGVzZXJpYWxpemUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdmFyIHR5cGUgPSBtZXNzYWdlLmRhdGEudHlwZSxcclxuICAgICAgICBkYXRhID0gbWVzc2FnZS5kYXRhLmRhdGEsXHJcbiAgICAgICAgaWQgPSBtZXNzYWdlLmRhdGEuaWQsXHJcbiAgICAgICAgbWFtYmFJRCA9IG1lc3NhZ2UuZGF0YS5tYW1iYUlEO1xyXG5cclxuICAgIHJldHVybiB7IG1hbWJhSUQ6IG1hbWJhSUQgLCBpZDogaWQsIHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9zZXJpYWxpemUgPSBmdW5jdGlvbiAoKSB7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VuZEluZm9Ub1dvcmtlciA9IGZ1bmN0aW9uIChJbmZvKSB7XHJcbiAgICB2YXIgX29uU2VuZFdvcmtlciA9IHRoaXMuX29uU2VuZFdvcmtlcjtcclxuXHJcbiAgICB0aGlzLl9wb3N0TWVzc2FnZShJbmZvKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoX29uU2VuZFdvcmtlci5sZW5ndGgpIHRoaXMuX2NoZWNrV2F0Y2hlcnMoX29uU2VuZFdvcmtlciwgSW5mbyk7XHJcbiAgICB9LmJpbmQodGhpcyksIDApO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3Bvc3RNZXNzYWdlID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NoZWNrV2F0Y2hlcnMgPSBmdW5jdGlvbiAod2F0Y2hlcnMsIEluZm8pIHtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gd2F0Y2hlcnMubGVuZ3RoIC0gMSwgd2F0Y2hlcjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlcihJbmZvKTtcclxuICAgICAgICB3YXRjaGVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgIHRoaXMuX29uU2VuZFdvcmtlci5wdXNoKGZuKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5fYnVmZmVyO1xyXG4gICAgdGhpcy5fcmVnaXN0ZXIobWVzc2FnZS5pZCwgbWVzc2FnZS50eXBlLCBmbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVnaXN0ZXIgPSBmdW5jdGlvbiAoaWQsIGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZighX2V2ZW50c1N0b3JlW2lkXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbaWRdID0ge307XHJcblxyXG4gICAgaWYgKF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMucHVzaChmbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdID0geyB3YXRjaGVyczogW2ZuXSB9O1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoaWQsIGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgdmFyIF9ldmVudHNTdG9yZSA9IHRoaXMuX2V2ZW50c1N0b3JlO1xyXG5cclxuICAgIGlmIChfZXZlbnRzU3RvcmVbaWRdICYmIF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSAmJiBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGVXYXRjaGVycyhfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMsIGV2ZW50TmFtZSwgZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZXhlY3V0ZVdhdGNoZXJzID0gZnVuY3Rpb24gKHdhdGNoZXJzLCBldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIGZvciAodmFyIGkgPSB3YXRjaGVycy5sZW5ndGggLSAxLCB3YXRjaGVyOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKGV2ZW50TmFtZSwgZGF0YSk7XHJcbiAgICAgICAgd2F0Y2hlcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0ODo1NiBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAyMDoxMTozMVxyXG4gKi9cclxuXHJcbnZhciBGcmVlbWFtYmEgPSByZXF1aXJlKCcuL3N0b3JlL1VJUmVuZGVyU3RvcmUuanMnKTtcclxudmFyIE1lc3NhZ2VCdXMgPSByZXF1aXJlKCcuL21lc3NhZ2VCdXMvVUlNc2dCdXMuanMnKTtcclxuXHJcbihmdW5jdGlvbihyb290KXtcclxuICAgIGlmKHJvb3QuTkVKICYmIE5FSi5kZWZpbmUpe1xyXG4gICAgICAgIE5FSi5kZWZpbmUoW10sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBGcmVlbWFtYmE6IEZyZWVtYW1iYSxcclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VCdXM6IE1lc3NhZ2VCdXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYod2luZG93ICYmIHdpbmRvdy5kZWZpbmUpe1xyXG4gICAgICAgIHdpbmRvdy5kZWZpbmUoW10sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBGcmVlbWFtYmE6IEZyZWVtYW1iYSxcclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VCdXM6IE1lc3NhZ2VCdXNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYoZG9jdW1lbnQgJiYgZG9jdW1lbnQubm9kZVR5cGUpe1xyXG4gICAgICAgIHdpbmRvdy5GcmVlbWFtYmEgPSB7XHJcbiAgICAgICAgICAgIEZyZWVtYW1iYTogRnJlZW1hbWJhLFxyXG4gICAgICAgICAgICBNZXNzYWdlQnVzOiBNZXNzYWdlQnVzXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZihtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpe1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgICAgICAgICBGcmVlbWFtYmE6IEZyZWVtYW1iYSxcclxuICAgICAgICAgICAgTWVzc2FnZUJ1czogTWVzc2FnZUJ1c1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG59KSh0aGlzKTtcclxuXHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91aV9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtb2R1bGUpIHtcclxuXHRpZighbW9kdWxlLndlYnBhY2tQb2x5ZmlsbCkge1xyXG5cdFx0bW9kdWxlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKCkge307XHJcblx0XHRtb2R1bGUucGF0aHMgPSBbXTtcclxuXHRcdC8vIG1vZHVsZS5wYXJlbnQgPSB1bmRlZmluZWQgYnkgZGVmYXVsdFxyXG5cdFx0aWYoIW1vZHVsZS5jaGlsZHJlbikgbW9kdWxlLmNoaWxkcmVuID0gW107XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobW9kdWxlLCBcImxvYWRlZFwiLCB7XHJcblx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZS5sO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShtb2R1bGUsIFwiaWRcIiwge1xyXG5cdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBtb2R1bGUuaTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRtb2R1bGUud2VicGFja1BvbHlmaWxsID0gMTtcclxuXHR9XHJcblx0cmV0dXJuIG1vZHVsZTtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vbW9kdWxlLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0ODoyMSBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNSAwNzo0MjoyOVxyXG4gKi9cclxuXHJcbnZhciBFeHRlbmQgPSByZXF1aXJlKCcuLi91dGlscy9leHRlbmQuanMnKTtcclxudmFyIEJhc2VSZW5kZXJTdG9yZSA9IHJlcXVpcmUoJy4vQmFzZVJlbmRlclN0b3JlLmpzJyk7XHJcbnZhciBDb21waWxlciA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL21haW5UaHJlYWQvY29tcGlsZXIuanMnKTtcclxudmFyIFZkb21Db21waWxlciA9IHJlcXVpcmUoJy4uL3Zkb20vVmRvbUNvbXBpbGVyLmpzJyk7XHJcblxyXG4vKirnirbmgIHmnprkuL4gKi9cclxudmFyIElOSVRJQUxfUkVOREVSID0gJ0lOSVRJQUxfUkVOREVSJztcclxudmFyIFVQREFURV9SRU5ERVIgPSAnVVBEQVRFX1JFTkRFUic7XHJcbnZhciBESUZGX0RFVEVDVCA9ICdESUZGX0RFVEVDVCc7XHJcblxyXG4vKirmk43kvZznsbvlnosgKi9cclxudmFyIFJFUExBQ0UgPSAnUkVQTEFDRSc7XHJcbnZhciBERUxFVEUgPSAnREVMRVRFJztcclxudmFyIEFERCA9ICdBREQnO1xyXG5cclxuZnVuY3Rpb24gRnJlZW1hbWJhKGNvbmZpZykge1xyXG4gICAgdGhpcy5zdXBlcihjb25maWcpO1xyXG4gICAgdGhpcy5fY29tcGlsZXIgPSBDb21waWxlcjtcclxuICAgIHRoaXMuX2lkID0gRnJlZW1hbWJhLmdlbmVyYXRlSUQoKTtcclxuICAgIHRoaXMuX3JlbmRlclN0YXRlID0gSU5JVElBTF9SRU5ERVI7XHJcbn1cclxuXHJcbkV4dGVuZChGcmVlbWFtYmEsIEJhc2VSZW5kZXJTdG9yZSk7XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLiRpbmplY3QgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdGhpcy5jb250YWluZXJOb2RlID0gbm9kZTtcclxuICAgIHRoaXMuJHJlbmRlcigpO1xyXG4gICAgdGhpcy5fcmVuZGVyU3RhdGUgPSBESUZGX0RFVEVDVDtcclxufTtcclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuJHJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIGlmKHRoaXMuX3RpbWVyKXtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzZWxmLl9yZW5kZXIoc2VsZi5fcmVuZGVyU3RhdGUpO1xyXG59O1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oUkVOREVSX1NUQVRFKXtcclxuICAgIHN3aXRjaChSRU5ERVJfU1RBVEUpe1xyXG4gICAgICAgIGNhc2UgJ0lOSVRJQUxfUkVOREVSJzogXHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRpYWxSZW5kZXIoKTsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnRElGRl9ERVRFQ1QnOlxyXG4gICAgICAgICAgICB0aGlzLl9kaWZmUmVuZGVyKCk7IGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICB9XHJcbn07XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLl91cGRhdGVXb3JrZXJEb20gPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5tc2dCdXMucmVjZWl2ZSh7IG1hbWJhSUQ6IHRoaXMuX2lkLCB0eXBlOiBVUERBVEVfUkVOREVSLCBkYXRhOiB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlLCBkYXRhOiB0aGlzLmRhdGEgfX0pO1xyXG59O1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5fZGlmZlJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB0aGlzLm1zZ0J1cy5yZWNlaXZlKHsgbWFtYmFJRDogdGhpcy5faWQsIHR5cGU6IHRoaXMuX3JlbmRlclN0YXRlLCBkYXRhOiB7IHRlbXBsYXRlOiB0aGlzLnRlbXBsYXRlLCBkYXRhOiB0aGlzLmRhdGEgfX0pXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odHlwZSwgbWVzc2FnZSl7XHJcbiAgICAgICAgICAgIHNlbGYuX2RpZmYobWVzc2FnZSk7XHJcbiAgICAgICAgfSk7XHJcbn07XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLl9kaWZmID0gZnVuY3Rpb24oZGlmZnMpe1xyXG4gICAgZm9yKHZhciBpPTA7aTxkaWZmcy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgb3ByYXRlVHlwZSA9IGRpZmZzW2ldLnR5cGUsXHJcbiAgICAgICAgICAgIHByZXZEb20gPSBkaWZmc1tpXS5wcmV2RG9tLFxyXG4gICAgICAgICAgICBjdXJEb20gPSBkaWZmc1tpXS5jdXJEb207XHJcblxyXG4gICAgICAgIHN3aXRjaChvcHJhdGVUeXBlKXtcclxuICAgICAgICAgICAgY2FzZSAnUkVQTEFDRSc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXBsYWNlT3BlcmF0ZShwcmV2RG9tLCBjdXJEb20pOyBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnREVMRVRFJzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlbGV0ZU9wZXJhdGUocHJldkRvbSk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG59O1xyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5fYWRkT3BlcmF0ZSA9IGZ1bmN0aW9uKHByZXZEb20sIGN1ckRvbSl7XHJcbiAgICB2YXIgdGFyZ2V0RG9tLCBwYXRoID0gY3VyRG9tLl9wYXRoLFxyXG4gICAgICAgIGxpc3ROYW1lID0gY3VyRG9tLl9saXN0TmFtZSxcclxuICAgICAgICByb290Tm9kZSA9IHRoaXMucm9vdE5vZGUsXHJcbiAgICAgICAgc291cmNlLCBsYXN0SW5kZXg7XHJcblxyXG4gICAgaWYobGlzdE5hbWUpe1xyXG4gICAgICAgIHRoaXMuJGxpc3RbbGlzdE5hbWVdLnJlbmRlcigpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvKirlr7vmib7niLboioLngrkmJueUn+aIkOaWsOiKgueCuSAqL1xyXG4gICAgdGFyZ2V0RG9tID0gdGhpcy5fZmluZFRhcmdldERvbShyb290Tm9kZSwgcGF0aCwgdHJ1ZSk7XHJcbiAgICBzb3VyY2UgPSBuZXcgVmRvbUNvbXBpbGVyKGN1ckRvbSwgdGhpcykuY29tcGlsZShudWxsLCBBREQpO1xyXG5cclxuICAgIC8qKuaPkuWFpeaTjeS9nCAqL1xyXG4gICAgbGFzdEluZGV4ID0gdGFyZ2V0RG9tLl9sYXN0SW5kZXg7XHJcbiAgICBpZihsYXN0SW5kZXggPj0gdGFyZ2V0RG9tLmNoaWxkTm9kZXMubGVuZ3RoLTEpe1xyXG4gICAgICAgIHRhcmdldERvbS5hcHBlbmQoc291cmNlKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRhcmdldERvbS5pbnNlcnRCZWZvcmUoc291cmNlLCB0YXJnZXREb20uY2hpbGROb2Rlc1tsYXN0SW5kZXhdKTtcclxuICAgIH1cclxufTtcclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuX2RlbGV0ZU9wZXJhdGUgPSBmdW5jdGlvbihwcmV2RG9tKXtcclxuICAgIHZhciBwYXRoID0gcHJldkRvbS5fcGF0aCwgdGFyZ2V0RG9tLFxyXG4gICAgICAgIHJvb3ROb2RlID0gdGhpcy5yb290Tm9kZSxcclxuICAgICAgICBsaXN0TmFtZSA9IHByZXZEb20uX2xpc3ROYW1lO1xyXG4gICAgXHJcbiAgICAvKirmo4DmtYvlhYPntKDmmK/lkKblrZjlnKhMaXN05LitICovXHJcbiAgICBpZihsaXN0TmFtZSl7XHJcbiAgICAgICAgdGhpcy4kbGlzdFtsaXN0TmFtZV0ucmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRhcmdldERvbSA9IHRoaXMuX2ZpbmRUYXJnZXREb20ocm9vdE5vZGUsIHBhdGgpO1xyXG4gICAgdGFyZ2V0RG9tLnBhcmVudE5vZGUucmVtb3ZlKHRhcmdldERvbSk7XHJcbn07XHJcblxyXG5GcmVlbWFtYmEucHJvdG90eXBlLl9maW5kVGFyZ2V0RG9tID0gZnVuY3Rpb24ocm9vdCwgcGF0aCwgaXNBZGQpe1xyXG4gICAgdmFyIHRhcmdldERvbSA9IHJvb3QsXHJcbiAgICAgICAgbGFzdEluZGV4O1xyXG5cclxuICAgIHBhdGggPSBwYXRoLnRyaW0oKS5zcGxpdCgnICcpO1xyXG4gICAgcGF0aC5zaGlmdCgpO1xyXG4gICAgbGFzdEluZGV4ID0gaXNBZGQgJiYgcGF0aC5wb3AoKTtcclxuXHJcbiAgICB3aGlsZShwYXRoLmxlbmd0aCl7XHJcbiAgICAgICAgdGFyZ2V0RG9tID0gZ2V0Tm9kZSh0YXJnZXREb20sIHBhdGguc2hpZnQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Tm9kZShyb290LCBjaGlsZEluZGV4KXtcclxuICAgICAgICByZXR1cm4gcm9vdC5jaGlsZE5vZGVzW2NoaWxkSW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGxhc3RJbmRleCl7XHJcbiAgICAgICAgdGFyZ2V0RG9tLl9sYXN0SW5kZXggPSBsYXN0SW5kZXg7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhcmdldERvbTtcclxufTtcclxuXHJcbkZyZWVtYW1iYS5wcm90b3R5cGUuX3JlcGxhY2VPcGVyYXRlID0gZnVuY3Rpb24ocHJldkRvbSwgY3VyRG9tKXtcclxuICAgIHZhciBwYXRoID0gcHJldkRvbS5fcGF0aCwgXHJcbiAgICAgICAgdGFyZ2V0RG9tLCBzb3VyY2UsXHJcbiAgICAgICAgcm9vdE5vZGUgPSB0aGlzLnJvb3ROb2RlO1xyXG5cclxuICAgIHRhcmdldERvbSA9IHRoaXMuX2ZpbmRUYXJnZXREb20ocm9vdE5vZGUsIHBhdGgpO1xyXG5cclxuICAgIC8qKuabv+aNouaTjeS9nCAqL1xyXG4gICAgc291cmNlID0gbmV3IFZkb21Db21waWxlcihjdXJEb20sIHRoaXMpLmNvbXBpbGUodGFyZ2V0RG9tLCBSRVBMQUNFKTtcclxuICAgIHNvdXJjZSAmJiB0YXJnZXREb20ucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc291cmNlLCB0YXJnZXREb20pO1xyXG5cclxufTtcclxuXHJcblxyXG5cclxuRnJlZW1hbWJhLnByb3RvdHlwZS5faW5pdGlhbFJlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgbmV3Um9vdCA9IHRoaXMuZG9tVHJlZSA9IHRoaXMuX2NvbXBpbGUodGhpcy5BU1QpLFxyXG4gICAgICAgIGNvbnRhaW5lck5vZGUgPSB0aGlzLmNvbnRhaW5lck5vZGUsXHJcbiAgICAgICAgcm9vdE5vZGUgPSB0aGlzLnJvb3ROb2RlO1xyXG5cclxuICAgIHRoaXMucm9vdE5vZGUgPSBuZXdSb290LmNoaWxkcmVuWzBdO1xyXG4gICAgcm9vdE5vZGU/IGNvbnRhaW5lck5vZGUucmVwbGFjZUNoaWxkKG5ld1Jvb3QsIHJvb3ROb2RlKSA6IGNvbnRhaW5lck5vZGUuYXBwZW5kKG5ld1Jvb3QpO1xyXG5cclxuICAgIHRoaXMubXNnQnVzLnJlY2VpdmUoeyBtYW1iYUlEOiB0aGlzLl9pZCwgdHlwZTogdGhpcy5fcmVuZGVyU3RhdGUsIGRhdGE6IHsgdGVtcGxhdGU6IHRoaXMudGVtcGxhdGUsIGRhdGE6IHRoaXMuZGF0YSB9fSk7XHJcbn07XHJcblxyXG4vKirnlJ/miJDnu4Tku7blrp7kvovnmoTllK/kuIBpZCovXHJcbkZyZWVtYW1iYS5nZW5lcmF0ZUlEID0gZnVuY3Rpb24oKXtcclxuICAgIGlmKHRoaXMuY3VycmVudElEKXtcclxuICAgICAgICByZXR1cm4gKyt0aGlzLmN1cnJlbnRJRDtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRJRCA9IDE7XHJcbiAgICB9XHJcbn07XHJcblxyXG5GcmVlbWFtYmEuYWRkQXN5bmNFdmVudHMgPSBmdW5jdGlvbiAobm9kZSwgZXZlbnRzKSB7XHJcbiAgICBpZiAobm9kZS5nZXRBdHRyaWJ1dGUoJ2xpc3QtY29udGFpbmVyJykpIHtcclxuICAgICAgICB0aGlzLl9saXN0LmNvbnRhaW5lciA9IG5vZGU7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIG5vZGUuZGF0YXNldCA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIG5vZGUuZGF0YXNldC5ub2RlSUQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgaWYgKCFub2RlLmNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIEZyZWVtYW1iYS5hZGRBc3luY0V2ZW50cy5jYWxsKHRoaXMsIG5vZGUuY2hpbGRyZW5baV0sIGV2ZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdmFyIG5vZGVJZCA9IG5vZGUuZGF0YXNldC5ub2RlaWQ7XHJcblxyXG4gICAgZm9yICh2YXIgaWQgaW4gZXZlbnRzKSB7XHJcbiAgICAgICAgaWYgKGlkID09IG5vZGVJZCkge1xyXG4gICAgICAgICAgICB2YXIgZXZlbnRIdWIgPSBldmVudHNbaWRdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGV2ZW50SHViLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGV4dCA9IGV2ZW50SHViW2pdLmNvbnRleHQ7XHJcbiAgICAgICAgICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuICcgKyBldmVudEh1YltqXS52YWx1ZSArICc7Jyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaGFuZGxlciA9IGdldEhhbmRsZXIodGhpcywgY29udGV4dCB8fCB0aGlzLmRhdGEsICcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRIdWJbal0ubmFtZSwgaGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUgZXZlbnRzW25vZGVJZF07XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEZyZWVtYW1iYTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9VSVJlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNjo0NDoxMiBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMSAwMTo1Mjo0NFxyXG4gKi9cclxudmFyIGF0dHJSZXNvbHZlciA9IHJlcXVpcmUoJy4vYXR0clJlc29sdmVyLmpzJyk7XHJcbnZhciBMaXN0ID0gcmVxdWlyZSgnLi4vLi4vbGlzdC9MaXN0LmpzJyk7XHJcblxyXG5mdW5jdGlvbiBlbGVtZW50KGFzdCwgY29udGV4dCwgbGlzdEluZm8pIHtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhc3QudGFnKTtcclxuXHJcbiAgICB2YXIgYXR0cnMgPSBhc3QuYXR0cnMsIGxpc3RCdWZmZXI7XHJcbiAgICAvKirlpITnkIblsZ7mgKcgKi9cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXR0cnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG5cclxuICAgICAgICBpZihhdHRyLm5hbWUgPT09ICdsaXN0JyAmJiBhdHRyLnZhbHVlKXtcclxuICAgICAgICAgICAgbGlzdEJ1ZmZlciA9IGNvbnRleHQuJGxpc3RbYXR0ci52YWx1ZV0gPSBuZXcgTGlzdCh7ZGF0YTogbGlzdEluZm8sIG5vZGU6IG5vZGV9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN3aXRjaCAoYXR0ci50eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IGF0dHJSZXNvbHZlcihhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirlpITnkIblrZDoioLngrkgKi9cclxuICAgIGlmIChhc3QuY2hpbGRyZW4pIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFzdC5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhc3QuY2hpbGRyZW5bal07XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hpbGREb20gPSBjb250ZXh0Ll9jb21waWxlKGNoaWxkLCBsaXN0SW5mbywgbGlzdEJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICBpZihjaGlsZC50eXBlID09PSAnbGlzdCcpe1xyXG4gICAgICAgICAgICAgICAgbGlzdEJ1ZmZlci5zZXRBc3QoYXN0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoY2hpbGREb20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXh0KGFzdCkge1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhc3QudGV4dCk7XHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwcmVzc2lvbihhc3QsIGNvbnRleHQsIGxpc3RJbmZvKSB7XHJcbiAgICB2YXIgdGV4dCA9ICcnLCBnZXRWYWx1ZTtcclxuICAgIFxyXG4gICAgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAoJyArIGFzdC5ib2R5ICsgJyknKTtcclxuICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKTtcclxuXHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0KGFzdCwgY29udGV4dCwgbGlzdEluZm8sIGxpc3RCdWZmZXIpIHtcclxuICAgIHZhciBsaXN0Qm9keSA9IGFzdC5ib2R5LFxyXG4gICAgICAgIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAoJyArIGFzdC5zZXF1ZW5jZS5ib2R5ICsgJyknKSxcclxuICAgICAgICBhcnJheURhdGEgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKSxcclxuICAgICAgICB2YXJpYWJsZSA9IGFzdC52YXJpYWJsZTtcclxuXHJcbiAgICBpZihsaXN0QnVmZmVyKXtcclxuICAgICAgICBsaXN0QnVmZmVyLnNldERhdGEoYXJyYXlEYXRhKTtcclxuICAgICAgICBsaXN0QnVmZmVyLnNldFBhcmVudChjb250ZXh0KTtcclxuICAgICAgICBsaXN0QnVmZmVyLnNldE5hbWUoe2l0ZW06IHZhcmlhYmxlLCBpbmRleDogdmFyaWFibGUgKyAnX2luZGV4J30pO1xyXG4gICAgICAgIGxpc3RCdWZmZXIuc2V0SXRlbUJvZHkobGlzdEJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyYXlEYXRhLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgdmFyIGxpc3RJdGVtID0gaXRlbU5vZGUobGlzdEJvZHksIGFycmF5RGF0YVtqXSwgaik7XHJcblxyXG4gICAgICAgIGxpc3RCdWZmZXIgJiYgbGlzdEJ1ZmZlci5hZGRMaXN0SXRlbShsaXN0SXRlbS5jaGlsZHJlblswXSk7XHJcblxyXG4gICAgICAgIG5vZGUuYXBwZW5kKGxpc3RJdGVtKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpdGVtTm9kZShib2R5LCBpdGVtLCBpbmRleCkge1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIHZhciBsaXN0SW5mbyA9IHt9O1xyXG5cclxuICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZV0gPSBpdGVtO1xyXG4gICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlICsgJ19pbmRleCddID0gaW5kZXg7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYm9keS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZChjb250ZXh0Ll9jb21waWxlKGJvZHlbaV0sIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICAnZWxlbWVudCc6IGVsZW1lbnQsXHJcbiAgICAndGV4dCc6IHRleHQsXHJcbiAgICAnZXhwcmVzc2lvbic6IGV4cHJlc3Npb24sXHJcbiAgICAnbGlzdCc6IGxpc3RcclxufTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci9tYWluVGhyZWFkL2NvbXBpbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNjo1MTozMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMSAwMTo0NzoyN1xyXG4gKi9cclxuZnVuY3Rpb24gcmVzb2x2ZUF0dHJpYnV0ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbykge1xyXG4gICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiBhdHRyLnZhbHVlLFxyXG4gICAgICAgIGF0dHJWYWx1ZTtcclxuICAgIHN3aXRjaCAodmFsdWVUeXBlKSB7XHJcbiAgICAgICAgY2FzZSAnc3RyaW5nJzogXHJcbiAgICAgICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7IGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ29iamVjdCc6IFxyXG4gICAgICAgICAgICBhdHRyVmFsdWUgPSByZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKTsgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgIH1cclxuICAgIC8qKnJlZuaLpuaIqiAqL1xyXG4gICAgaWYoYXR0ci5uYW1lID09PSAncmVmJyl7XHJcbiAgICAgICAgY29udGV4dC4kcmVmc1thdHRyVmFsdWVdID0gbm9kZTtcclxuICAgICAgICBub2RlLl9yZWZOYW1lID0gYXR0clZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgYXR0clZhbHVlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVzb2x2ZUF0dHJWYWx1ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbykge1xyXG4gICAgdmFyIGlzRXZlbnQgPSBhdHRyLm5hbWUuc2xpY2UoMCwgMikgPT09ICdvbic7XHJcblxyXG4gICAgaWYgKGlzRXZlbnQpIHtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5uYW1lLnNsaWNlKDMpO1xyXG4gICAgICAgIGF0dHIudmFsdWUuYm9keSA9IGF0dHIudmFsdWUuYm9keS5yZXBsYWNlKC8nXFwkZXZlbnQnL2csICckZXZlbnQnKTtcclxuICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuIGZ1bmN0aW9uKCRldmVudCl7cmV0dXJuICcgKyBhdHRyLnZhbHVlLmJvZHkgKyAnO30nKTtcclxuICAgICAgICBcclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBnZXRIYW5kbGVyKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpLCBmYWxzZSk7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAoJyArIGF0dHIudmFsdWUuYm9keSArICcpJyk7XHJcblxyXG4gICAgICAgIHJldHVybiBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZXNvbHZlQXR0cmlidXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBpbGVyL21haW5UaHJlYWQvYXR0clJlc29sdmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0yMCAxNzozODoxNSBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMSAwMTo1MjoyNFxyXG4gKi9cclxuZnVuY3Rpb24gTGlzdChjb25maWcpe1xyXG4gICAgdGhpcy5ub2RlID0gY29uZmlnLm5vZGU7XHJcbiAgICB0aGlzLmRhdGEgPSBjb25maWcuZGF0YTtcclxuICAgIHRoaXMucGFyZW50ID0gY29uZmlnLnBhcmVudDtcclxuICAgIHRoaXMubGlzdEl0ZW1zID0gW107XHJcbn1cclxuXHJcbkxpc3QucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGluZGV4LCBtb2RlbCl7XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICBkYXRhLnNwbGljZShpbmRleCwgMCwgbW9kZWwpO1xyXG4gICAgdGhpcy5yZW5kZXIoKTtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLnNldERhdGEgPSBmdW5jdGlvbihhcnJheSl7XHJcbiAgICB0aGlzLmRhdGEgPSBhcnJheTtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLnNldEFzdCA9IGZ1bmN0aW9uKGFzdCl7XHJcbiAgICB0aGlzLmFzdCA9IGFzdDtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLnNldFBhcmVudCA9IGZ1bmN0aW9uKHBhcmVudCl7XHJcbiAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxufTtcclxuXHJcbkxpc3QucHJvdG90eXBlLmFkZExpc3RJdGVtID0gZnVuY3Rpb24obm9kZSl7XHJcbiAgICB0aGlzLmxpc3RJdGVtcy5wdXNoKG5vZGUpO1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUuc2V0SXRlbUJvZHkgPSBmdW5jdGlvbihib2R5KXtcclxuICAgIHRoaXMuaXRlbUFzdCA9IGJvZHk7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5nZXROb2RlID0gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzLm5vZGU7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5zZXROYW1lID0gZnVuY3Rpb24oY29uZmlnKXtcclxuICAgIHRoaXMuaXRlbU5hbWUgPSBjb25maWcuaXRlbTtcclxuICAgIHRoaXMuaW5kZXhOYW1lID0gY29uZmlnLmluZGV4O1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUubW9kaWZ5ID0gZnVuY3Rpb24oaW5kZXgsIG1vZGVsKXtcclxuICAgIHZhciB0YXJnZXREb20gPSB0aGlzLmxpc3RJdGVtc1tpbmRleF0sXHJcbiAgICAgICAgaXRlbUFzdCA9IHRoaXMuaXRlbUFzdCwgaXRlbU5hbWUgPSB0aGlzLml0ZW1OYW1lLFxyXG4gICAgICAgIGluZGV4TmFtZSA9IHRoaXMuaW5kZXhOYW1lLCB0ZW1wTGlzdERhdGEgPSB7fTtcclxuICAgIFxyXG4gICAgdGVtcExpc3REYXRhW2l0ZW1OYW1lXSA9IG1vZGVsO1xyXG4gICAgdGVtcExpc3REYXRhW2luZGV4TmFtZV0gPSBpbmRleDtcclxuXHJcbiAgICB2YXIgbmV3Q2hpbGQgPSB0aGlzLnBhcmVudC5fY29tcGlsZShpdGVtQXN0LCB0ZW1wTGlzdERhdGEpO1xyXG5cclxuICAgIHRoaXMubGlzdEl0ZW1zW2luZGV4XSA9IG5ld0NoaWxkLmNoaWxkcmVuWzBdO1xyXG4gICAgdGhpcy5kYXRhW2luZGV4XSA9IG1vZGVsO1xyXG5cclxuICAgIHRoaXMubm9kZS5yZXBsYWNlQ2hpbGQobmV3Q2hpbGQsIHRhcmdldERvbSk7XHJcbiAgICB0aGlzLnBhcmVudC5fdXBkYXRlV29ya2VyRG9tKCk7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbihpbmRleCl7XHJcbiAgICB0aGlzLmRhdGEuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5yZXBsYWNlID0gZnVuY3Rpb24obmV3TGlzdERhdGEpe1xyXG4gICAgTGlzdC5yZXBsYWNlTGlzdCh0aGlzLmRhdGEsIG5ld0xpc3REYXRhKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbn07XHJcblxyXG5MaXN0LnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgaWYodGhpcy5fdGltZXIpe1xyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lcik7XHJcbiAgICB9XHJcbiAgICB0aGlzLl90aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICBzZWxmLl9yZW5kZXIoKTtcclxuICAgIH0sIDApO1xyXG59O1xyXG5cclxuTGlzdC5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmxpc3RJdGVtcyA9IFtdO1xyXG4gICAgdGhpcy5ub2RlLmlubmVySFRNTCA9ICcnO1xyXG5cclxuICAgIHZhciBuZXdCb2R5ID0gdGhpcy5wYXJlbnQuX2NvbXBpbGUodGhpcy5hc3QuY2hpbGRyZW4sIG51bGwsIHRoaXMpO1xyXG4gICAgdGhpcy5ub2RlLmFwcGVuZChuZXdCb2R5KTtcclxuICAgIHRoaXMucGFyZW50Ll91cGRhdGVXb3JrZXJEb20oKTtcclxufTtcclxuXHJcbkxpc3QucmVwbGFjZUxpc3QgPSBmdW5jdGlvbiAob2xkTGlzdCwgbmV3TGlzdCkge1xyXG4gICAgZm9yICh2YXIgaSA9IG9sZExpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICBpZiAodHlwZW9mIG5ld0xpc3RbaV0gPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIG9sZExpc3Quc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9sZExpc3RbaV0gPSBuZXdMaXN0W2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGlzdDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9saXN0L0xpc3QuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjUwOjM4IFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTIwIDE2OjQwOjM4XHJcbiAqL1xyXG52YXIgTWVzc2FnZUJ1cyA9IHJlcXVpcmUoJy4vTWVzc2FnZUJ1cy5qcycpO1xyXG52YXIgRXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbHMvZXh0ZW5kLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBVSU1zZ0J1cyh3b3JrZXIpe1xyXG4gICAgdGhpcy5fd29ya2VyID0gd29ya2VyO1xyXG4gICAgdGhpcy5zdXBlcigpO1xyXG59XHJcblxyXG5FeHRlbmQoVUlNc2dCdXMsIE1lc3NhZ2VCdXMpO1xyXG5cclxuVUlNc2dCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24oKXtcclxuICAgIHZhciBfd29ya2VyID0gdGhpcy5fd29ya2VyO1xyXG5cclxuICAgIF93b3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpKTtcclxufTtcclxuXHJcblVJTXNnQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciBJbmZvID0ge30sXHJcbiAgICAgICAgX2Jhc2VJZCA9IG1lc3NhZ2UuaWQgPSB0aGlzLl9iYXNlSWQ7XHJcblxyXG4gICAgSW5mby5pZCA9IF9iYXNlSWQ7XHJcbiAgICBJbmZvLnR5cGUgPSBtZXNzYWdlLnR5cGU7XHJcbiAgICBJbmZvLmRhdGEgPSBtZXNzYWdlLmRhdGE7XHJcbiAgICBJbmZvLm1hbWJhSUQgPSBtZXNzYWdlLm1hbWJhSUQ7XHJcblxyXG4gICAgdGhpcy5fc2VuZEluZm9Ub1dvcmtlcihJbmZvKTtcclxuICAgIHRoaXMuX2Jhc2VJZCsrO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5VSU1zZ0J1cy5wcm90b3R5cGUuX3Bvc3RNZXNzYWdlID0gZnVuY3Rpb24oSW5mbyl7XHJcbiAgICB2YXIgX3dvcmtlciA9IHRoaXMuX3dvcmtlcjtcclxuXHJcbiAgICBfd29ya2VyLnBvc3RNZXNzYWdlKEluZm8pO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBVSU1zZ0J1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZXNzYWdlQnVzL1VJTXNnQnVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJcclxuXHJcbmZ1bmN0aW9uIHZkb21Db21waWxlcih2ZG9tLCBjb250ZXh0KXtcclxuICAgIHRoaXMuX3Zkb20gPSB2ZG9tO1xyXG4gICAgdGhpcy5fY29udGV4dCA9IGNvbnRleHQ7XHJcbn1cclxuXHJcbnZkb21Db21waWxlci5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uKHRhcmdldERvbSwgdHlwZSl7XHJcbiAgICB2YXIgdmRvbSA9IHRoaXMuX3Zkb207XHJcbiAgICBcclxuICAgIHJldHVybiB0aGlzWydfJyt0aGlzLl90eXBlb2YodmRvbSldKHZkb20sIHRhcmdldERvbSwgdHlwZSk7XHJcbn07XHJcblxyXG52ZG9tQ29tcGlsZXIucHJvdG90eXBlLl90eXBlb2YgPSBmdW5jdGlvbih2ZG9tKXtcclxuICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgaWYodHlwZW9mIHZkb20uX3ZhbHVlID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmVzdWx0ID0gJ1RleHROb2RlJztcclxuICAgIH1lbHNlIGlmKHR5cGVvZiB2ZG9tLl90YWdOYW1lID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmVzdWx0ID0gJ0VsZW1lbnQnO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmVzdWx0ID0gJ0RvY3VtZW50RnJhZ21lbnQnO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG52ZG9tQ29tcGlsZXIucHJvdG90eXBlLl9UZXh0Tm9kZSA9IGZ1bmN0aW9uKHZkb20pe1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZkb20uX3ZhbHVlKTtcclxufTtcclxuXHJcbnZkb21Db21waWxlci5wcm90b3R5cGUuX0VsZW1lbnQgPSBmdW5jdGlvbih2ZG9tLCB0YXJnZXREb20sIHR5cGUpe1xyXG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLl9jb250ZXh0O1xyXG5cclxuICAgIGlmKHZkb20uX2xpc3ROYW1lKXtcclxuICAgICAgICBjb250ZXh0LiRsaXN0W3Zkb20uX2xpc3ROYW1lXS5yZW5kZXIoKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodmRvbS5fdGFnTmFtZSk7XHJcblxyXG4gICAgLyoq6K6+572u5bGe5oCnICovXHJcbiAgICBmb3IodmFyIGk9MDtpPHZkb20uX2F0dHJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKHZkb20uX2F0dHJzW2ldLm5hbWUsIHZkb20uX2F0dHJzW2ldLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKirorr7nva7kuovku7YgKi9cclxuICAgIGZvcih2YXIgaj0wO2o8dmRvbS5fZXZlbnRzLmxlbmd0aDtqKyspe1xyXG4gICAgICAgIHZhciBoYW5kbGVyU3RyID0gdmRvbS5fZXZlbnRzW2pdLnZhbHVlO1xyXG4gICAgICAgIHZhciBoYW5kbGVyID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gJyArIGhhbmRsZXJTdHIgKyAnOycpO1xyXG4gICAgICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcih2ZG9tLl9ldmVudHNbal0ubmFtZSwgaGFuZGxlcihjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuabv+aNouWtkOiKgueCuSAqL1xyXG4gICAgaWYodHlwZSA9PT0gJ1JFUExBQ0UnKXtcclxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgZm9yKHZhciBrPTA7azx0YXJnZXREb20uY2hpbGROb2Rlcy5sZW5ndGg7aysrKXsgXHJcbiAgICAgICAgICAgIGNoaWxkcmVuLmFwcGVuZCh0YXJnZXREb20uY2hpbGROb2Rlc1trXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5vZGUuYXBwZW5kKGNoaWxkcmVuKTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIC8qKue7keWumnJlZiAqL1xyXG4gICAgaWYodGFyZ2V0RG9tICYmIHRhcmdldERvbS5fcmVmTmFtZSl7XHJcbiAgICAgICAgY29udGV4dC4kcmVmc1t0YXJnZXREb20uX3JlZk5hbWVdID0gbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBpZih0eXBlID09PSAnQUREJyl7XHJcbiAgICAgICAgdmFyIGNoaWxkQm9keSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGg9MDtoPHZkb20uX2NoaWxkcmVuLmxlbmd0aDtoKyspe1xyXG4gICAgICAgICAgICBjaGlsZEJvZHkuYXBwZW5kKG5ldyB2ZG9tQ29tcGlsZXIodmRvbS5fY2hpbGRyZW5baF0pLmNvbXBpbGUobnVsbCwgJ0FERCcpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS5hcHBlbmQoY2hpbGRCb2R5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufTtcclxuXHJcbnZkb21Db21waWxlci5wcm90b3R5cGUuX0RvY3VtZW50RnJhZ21lbnQgPSBmdW5jdGlvbigpe1xyXG4gICAgXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHZkb21Db21waWxlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL1Zkb21Db21waWxlci5qc1xuLy8gbW9kdWxlIGlkID0gMzRcbi8vIG1vZHVsZSBjaHVua3MgPSAxIl0sInNvdXJjZVJvb3QiOiIifQ==