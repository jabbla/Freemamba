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
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
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
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(27);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 07:41:43
 */

var MessageBus = __webpack_require__(28);
var WKRenderStore = __webpack_require__(29);
var Differ = __webpack_require__(32);

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
    //console.log('Worker 收到', DIFF_DETECT);
    //console.log(VdomStore[mambaID], store.vDom);
    var differs = Differ(VdomStore[mambaID], store.vDom);
    VdomStore[mambaID] = store.vDom;
    this.receive({ type: DIFF_DETECT, data: differs, id: id });
});
/**消息Log */
myMessageBus.onSend(function(){
    //console.log('Worker 已发送：', message);
});



/***/ }),
/* 28 */
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:44 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:21:24
 */

var BaseRenderStore = __webpack_require__(5);
var Extend = __webpack_require__(1);
var Compiler = __webpack_require__(30);

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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-24 23:43:18
 */
var attrResolver = __webpack_require__(31);

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
            
            if(child.type === 'list'){
                nextIndex += (childNode._length-1);
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

    return node;
}


module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list
};

/***/ }),
/* 31 */
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
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(33);
var TextNode = __webpack_require__(16);
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

    var prevTagName = prevDom._tagName,
        curTagName = curDom._tagName;
    
    if(diff(prevTagName, curTagName)){
        result.push(diffInfo);
        return;
    }

    /**Text node */
    if(prevDom instanceof TextNode){
        if(prevDom._value !== curDom._value){
            result.push(diffInfo);
            return;
        }
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
            curChildren = curDom._children;

        for(var i=0;i<prevChildren.length;i++){
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
        var listName = diffs[i].prevDom._listName || diffs[i].curDom._listName;
        if(listName){
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

function mainDiff(prevRoot, curRoot){
    var result = [];
    Differ(prevRoot._children[0], curRoot._children[0], result);
    return mergeDiff(result);
}

module.exports = mainDiff;

/***/ }),
/* 33 */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2FmMTdiNThlOTc0N2EzY2E5ZDIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnRGcmFnbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvY29uZmlnLmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9UZXh0Tm9kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy93a19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9Xb3JrZXJNc2dCdXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL1dLUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2F0dHJSZXNvbHZlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9EaWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RpZmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQzs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Qjs7Ozs7OzREQ2RBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSx5QkFBeUIsNkNBQTZDLDBDQUEwQzs7O0FBR2hIO0FBQ0E7QUFDQSxrREFBa0QsU0FBUztBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRSwwQkFBMEI7QUFDMUIsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpQ0FBaUM7QUFDakMsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTO0FBQzlDOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQSx3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCO0FBQ0EsR0FBRztBQUNIOzs7QUFHQSwrRkFBK0Y7O0FBRS9GOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTyxNQUFNO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCLGFBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQ0FBcUMsU0FBUztBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBTTs7QUFFYjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDemhCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNuQkE7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsQzs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGFBQWE7QUFDakM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUM7Ozs7OztBQ25FQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsT0FBTztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixNQUFNLFVBQVUsV0FBVyxNQUFNLE9BQU8sYUFBYTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxVQUFVO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixxRUFBcUUsS0FBSztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQsT0FBTztBQUNQLGtCQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7OztBQ3ZMdEM7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxTQUFTO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUEsMkI7Ozs7OztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7O0FDeERBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsRUFBRSxLQUFLLFlBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQWUsWUFBWTs7QUFFM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtDQUFrQyxPQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLG9CQUFvQjtBQUNwQixvQ0FBb0MsVUFBVTtBQUM5QztBQUNBO0FBQ0EsaUNBQWlDLG1CQUFtQjtBQUNwRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDLE9BQU87QUFDNUMsc0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQixPQUFPO0FBQ2xDLHlDO0FBQ0EsMEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNkJBQTZCLE1BQU07QUFDbkM7QUFDQSxvQkFBb0I7QUFDcEIsR0FBRzs7QUFFSDtBQUNBLDZCQUE2QixNQUFNO0FBQ25DO0FBQ0Esb0JBQW9CO0FBQ3BCLEdBQUc7O0FBRUgsc0Q7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQixHQUFHOztBQUVIOztBQUVBO0FBQ0E7QUFDQSxlQUFlLEtBQUs7QUFDcEIsd0JBQXdCOztBQUV4QixpQkFBaUIsS0FBSywwQkFBMEI7QUFDaEQsWUFBWTtBQUNaLEdBQUc7QUFDSCxvQkFBb0IsS0FBSztBQUN6QjtBQUNBLFlBQVk7QUFDWixHQUFHOztBQUVIO0FBQ0EsdUJBQXVCLE1BQU07QUFDN0I7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0EsWUFBWTtBQUNaLEdBQUc7QUFDSCx3RTtBQUNBOztBQUVBLFlBQVk7QUFDWixHQUFHOztBQUVILGdCQUFnQixNQUFNO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQSxlQUFlLE1BQU0sRUFBRSxNQUFNLEdBQUcsTUFBTTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxnQkFBZ0IsSUFBSTtBQUNwQix3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLEtBQUs7QUFDTDtBQUNBLGNBQWM7QUFDZDtBQUNBLEdBQUc7QUFDSCxnQkFBZ0IsTUFBTSxPQUFPLE1BQU0sS0FBSyxJQUFJO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsa0JBQWtCLE1BQU0sZ0JBQWdCLElBQUk7QUFDNUM7QUFDQSxHQUFHO0FBQ0gsb0JBQW9CLE1BQU07QUFDMUI7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsZ0JBQWdCLE1BQU07QUFDdEI7QUFDQSwrRUFBK0U7QUFDL0UsWUFBWTtBQUNaLEdBQUc7O0FBRUgsZ0VBQWdFO0FBQ2hFLFlBQVk7QUFDWixHQUFHO0FBQ0g7QUFDQSxZQUFZO0FBQ1osR0FBRztBQUNIOzs7QUFHQTtBQUNBOzs7O0FBSUEsdUI7Ozs7OztBQzlWQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUI7Ozs7OztBQ2xCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSxzQkFBc0IsaUNBQWlDO0FBQ3ZEOztBQUVBO0FBQ0EsdUJBQXVCLHlFQUF5RTtBQUNoRzs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLHdCQUF3QjtBQUM1QyxtRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEseUI7Ozs7OztBQy9CQTtBQUNBO0FBQ0E7O0FBRUEsMEI7Ozs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1o7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQSw4Q0FBOEMsUUFBUTtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsMkNBQTJDO0FBQzdELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztBQzdERDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQ0FBcUMscUNBQXFDO0FBQzFFLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLDhCOzs7Ozs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsa0JBQWtCO0FBQ3JDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2Qjs7Ozs7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixlQUFlO0FBQy9COztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNERBQTREO0FBQzVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLHNCQUFzQjtBQUN2RDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxnQkFBZ0IsbUJBQW1CO0FBQ25DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsY0FBYztBQUNsQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEU7Ozs7OztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEO0FBQ0EsMEZBQTBGO0FBQzFGO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RSw0QkFBNEI7O0FBRTFHO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0M7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDhDQUE4QztBQUNuRTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIsaURBQWlEO0FBQ3RFO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0I7O0FBRXBCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQixzQkFBc0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsZ0JBQWdCLGVBQWU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwwQjs7Ozs7O0FDM0ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkM7QUFDQTtBQUNBO0FBQ0EseUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IsZUFBZTtBQUMvQjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlEO0FBQ0E7QUFDQTtBQUNBLCtDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixnQkFBZ0I7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVEO0FBQ0E7QUFDQTtBQUNBLHFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0IiLCJmaWxlIjoiV29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjYpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDdhZjE3YjU4ZTk3NDdhM2NhOWQyIiwiZnVuY3Rpb24gZG9jdW1lbnRGcmFnbWVudCgpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5kb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50RnJhZ21lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTQ6NTQ6MzMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMTkgMTQ6NTk6NDBcclxuICovXHJcblxyXG5mdW5jdGlvbiBleHRlbmQoY2hpbGRDbGFzcywgYmFzZUNsYXNzKXtcclxuICAgIHZhciBmbiA9IGZ1bmN0aW9uKCl7fTtcclxuICAgIGZuLnByb3RvdHlwZSA9IGJhc2VDbGFzcy5wcm90b3R5cGU7XHJcbiAgICBjaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBmbigpO1xyXG4gICAgY2hpbGRDbGFzcy5wcm90b3R5cGUuc3VwZXIgPSBiYXNlQ2xhc3M7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3V0aWxzL2V4dGVuZC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInJlcXVpcmUoJy4vaGVscGVyL3NoaW0uanMnKSgpO1xyXG5cclxuXHJcblxyXG52YXIgXyAgPSBtb2R1bGUuZXhwb3J0cztcclxudmFyIGVudGl0aWVzID0gcmVxdWlyZSgnLi9oZWxwZXIvZW50aXRpZXMuanMnKTtcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciBvMnN0ciA9ICh7fSkudG9TdHJpbmc7XHJcbnZhciB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSd1bmRlZmluZWQnPyB3aW5kb3c6IGdsb2JhbDtcclxudmFyIE1BWF9QUklPUklUWSA9IDk5OTk7XHJcblxyXG5cclxuXy5ub29wID0gZnVuY3Rpb24oKXt9O1xyXG5fLnVpZCA9IChmdW5jdGlvbigpe1xyXG4gIHZhciBfdWlkPTA7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gX3VpZCsrO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uZXh0ZW5kID0gZnVuY3Rpb24oIG8xLCBvMiwgb3ZlcnJpZGUgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCB8fCBvdmVycmlkZSA9PT0gdHJ1ZSApe1xyXG4gICAgICBvMVtpXSA9IG8yW2ldXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvMTtcclxufVxyXG5cclxuXy5rZXlzID0gT2JqZWN0LmtleXM/IE9iamVjdC5rZXlzOiBmdW5jdGlvbihvYmope1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgcmVzLnB1c2goaSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbl8uc29tZSA9IGZ1bmN0aW9uKGxpc3QsIGZuKXtcclxuICBmb3IodmFyIGkgPTAsbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICBpZihmbihsaXN0W2ldKSkgcmV0dXJuIHRydWVcclxuICB9XHJcbn1cclxuXHJcbl8udmFyTmFtZSA9ICdkJztcclxuXy5zZXROYW1lID0gJ3BfJztcclxuXy5jdHhOYW1lID0gJ2MnO1xyXG5fLmV4dE5hbWUgPSAnZSc7XHJcblxyXG5fLnJXb3JkID0gL15bXFwkXFx3XSskLztcclxuXy5yU2ltcGxlQWNjZXNzb3IgPSAvXltcXCRcXHddKyhcXC5bXFwkXFx3XSspKiQvO1xyXG5cclxuXy5uZXh0VGljayA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbic/IFxyXG4gIHNldEltbWVkaWF0ZS5iaW5kKHdpbikgOiBcclxuICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgMCkgXHJcbiAgfVxyXG5cclxuXHJcblxyXG5fLnByZWZpeCA9IFwiJ3VzZSBzdHJpY3QnO3ZhciBcIiArIF8udmFyTmFtZSArIFwiPVwiICsgXy5jdHhOYW1lICsgXCIuZGF0YTtcIiArICBfLmV4dE5hbWUgICsgXCI9XCIgKyBfLmV4dE5hbWUgKyBcInx8Jyc7XCI7XHJcblxyXG5cclxuXy5zbGljZSA9IGZ1bmN0aW9uKG9iaiwgc3RhcnQsIGVuZCl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSA9IHN0YXJ0IHx8IDAsIGxlbiA9IGVuZCB8fCBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgcmVzLnB1c2gob2JqW2ldKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyBiZWFjdXNlIHNsaWNlIGFuZCB0b0xvd2VyQ2FzZSBpcyBleHBlbnNpdmUuIHdlIGhhbmRsZSB1bmRlZmluZWQgYW5kIG51bGwgaW4gYW5vdGhlciB3YXlcclxuXy50eXBlT2YgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBvID09IG51bGwgPyBTdHJpbmcobykgOm8yc3RyLmNhbGwobykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbl8ubWFrZVByZWRpY2F0ZSA9IGZ1bmN0aW9uIG1ha2VQcmVkaWNhdGUod29yZHMsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiB3b3JkcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHdvcmRzID0gd29yZHMuc3BsaXQoXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgdmFyIGYgPSBcIlwiLFxyXG4gICAgY2F0cyA9IFtdO1xyXG4gICAgb3V0OiBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXRzLmxlbmd0aDsgKytqKXtcclxuICAgICAgICAgIGlmIChjYXRzW2pdWzBdLmxlbmd0aCA9PT0gd29yZHNbaV0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgY2F0c1tqXS5wdXNoKHdvcmRzW2ldKTtcclxuICAgICAgICAgICAgICBjb250aW51ZSBvdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdHMucHVzaChbd29yZHNbaV1dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmVUbyhhcnIpIHtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGYgKz0gXCJyZXR1cm4gc3RyID09PSAnXCIgKyBhcnJbMF0gKyBcIic7XCI7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKXtcclxuICAgICAgICAgICBmICs9IFwiY2FzZSAnXCIgKyBhcnJbaV0gKyBcIic6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgKz0gXCJyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2U7XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHRocmVlIGxlbmd0aCBjYXRlZ29yaWVzLCBhbiBvdXRlclxyXG4gICAgLy8gc3dpdGNoIGZpcnN0IGRpc3BhdGNoZXMgb24gdGhlIGxlbmd0aHMsIHRvIHNhdmUgb24gY29tcGFyaXNvbnMuXHJcbiAgICBpZiAoY2F0cy5sZW5ndGggPiAzKSB7XHJcbiAgICAgICAgY2F0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIubGVuZ3RoKXtcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNhdCA9IGNhdHNbaV07XHJcbiAgICAgICAgICAgIGYgKz0gXCJjYXNlIFwiICsgY2F0WzBdLmxlbmd0aCArIFwiOlwiO1xyXG4gICAgICAgICAgICBjb21wYXJlVG8oY2F0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcIn1cIjtcclxuXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzaW1wbHkgZ2VuZXJhdGUgYSBmbGF0IGBzd2l0Y2hgIHN0YXRlbWVudC5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGFyZVRvKHdvcmRzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCJzdHJcIiwgZik7XHJcbn1cclxuXHJcblxyXG5fLnRyYWNrRXJyb3JQb3MgPSAoZnVuY3Rpb24gKCl7XHJcbiAgLy8gbGluZWJyZWFrXHJcbiAgdmFyIGxiID0gL1xcclxcbnxbXFxuXFxyXFx1MjAyOFxcdTIwMjldL2c7XHJcbiAgdmFyIG1pblJhbmdlID0gMjAsIG1heFJhbmdlID0gMjA7XHJcbiAgZnVuY3Rpb24gZmluZExpbmUobGluZXMsIHBvcyl7XHJcbiAgICB2YXIgdG1wTGVuID0gMDtcclxuICAgIGZvcih2YXIgaSA9IDAsbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgICB2YXIgbGluZUxlbiA9IChsaW5lc1tpXSB8fCBcIlwiKS5sZW5ndGg7XHJcblxyXG4gICAgICBpZih0bXBMZW4gKyBsaW5lTGVuID4gcG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIHtudW06IGksIGxpbmU6IGxpbmVzW2ldLCBzdGFydDogcG9zIC0gaSAtIHRtcExlbiAsIHByZXY6bGluZXNbaS0xXSwgbmV4dDogbGluZXNbaSsxXSB9O1xyXG4gICAgICB9XHJcbiAgICAgIC8vIDEgaXMgZm9yIHRoZSBsaW5lYnJlYWtcclxuICAgICAgdG1wTGVuID0gdG1wTGVuICsgbGluZUxlbiA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGZvcm1hdExpbmUoc3RyLCAgc3RhcnQsIG51bSwgdGFyZ2V0KXtcclxuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgdmFyIG1pbiA9IHN0YXJ0IC0gbWluUmFuZ2U7XHJcbiAgICBpZihtaW4gPCAwKSBtaW4gPSAwO1xyXG4gICAgdmFyIG1heCA9IHN0YXJ0ICsgbWF4UmFuZ2U7XHJcbiAgICBpZihtYXggPiBsZW4pIG1heCA9IGxlbjtcclxuXHJcbiAgICB2YXIgcmVtYWluID0gc3RyLnNsaWNlKG1pbiwgbWF4KTtcclxuICAgIHZhciBwcmVmaXggPSBcIltcIiArKG51bSsxKSArIFwiXSBcIiArIChtaW4gPiAwPyBcIi4uXCIgOiBcIlwiKVxyXG4gICAgdmFyIHBvc3RmaXggPSBtYXggPCBsZW4gPyBcIi4uXCI6IFwiXCI7XHJcbiAgICB2YXIgcmVzID0gcHJlZml4ICsgcmVtYWluICsgcG9zdGZpeDtcclxuICAgIGlmKHRhcmdldCkgcmVzICs9IFwiXFxuXCIgKyBuZXcgQXJyYXkoc3RhcnQtbWluICsgcHJlZml4Lmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpICsgXCJeXl5cIjtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG4gIHJldHVybiBmdW5jdGlvbihpbnB1dCwgcG9zKXtcclxuICAgIGlmKHBvcyA+IGlucHV0Lmxlbmd0aC0xKSBwb3MgPSBpbnB1dC5sZW5ndGgtMTtcclxuICAgIGxiLmxhc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgbGluZXMgPSBpbnB1dC5zcGxpdChsYik7XHJcbiAgICB2YXIgbGluZSA9IGZpbmRMaW5lKGxpbmVzLHBvcyk7XHJcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0LCBudW0gPSBsaW5lLm51bTtcclxuXHJcbiAgICByZXR1cm4gKGxpbmUucHJldj8gZm9ybWF0TGluZShsaW5lLnByZXYsIHN0YXJ0LCBudW0tMSApICsgJ1xcbic6ICcnICkgKyBcclxuICAgICAgZm9ybWF0TGluZShsaW5lLmxpbmUsIHN0YXJ0LCBudW0sIHRydWUpICsgJ1xcbicgKyBcclxuICAgICAgKGxpbmUubmV4dD8gZm9ybWF0TGluZShsaW5lLm5leHQsIHN0YXJ0LCBudW0rMSApICsgJ1xcbic6ICcnICk7XHJcblxyXG4gIH1cclxufSkoKTtcclxuXHJcblxyXG52YXIgaWdub3JlZFJlZiA9IC9cXCgoXFw/XFwhfFxcP1xcOnxcXD9cXD0pL2c7XHJcbl8uZmluZFN1YkNhcHR1cmUgPSBmdW5jdGlvbiAocmVnU3RyKSB7XHJcbiAgdmFyIGxlZnQgPSAwLFxyXG4gICAgcmlnaHQgPSAwLFxyXG4gICAgbGVuID0gcmVnU3RyLmxlbmd0aCxcclxuICAgIGlnbm9yZWQgPSByZWdTdHIubWF0Y2goaWdub3JlZFJlZik7IC8vIGlnbm9yZWQgdW5jYXB0dXJlXHJcbiAgaWYoaWdub3JlZCkgaWdub3JlZCA9IGlnbm9yZWQubGVuZ3RoXHJcbiAgZWxzZSBpZ25vcmVkID0gMDtcclxuICBmb3IgKDsgbGVuLS07KSB7XHJcbiAgICB2YXIgbGV0dGVyID0gcmVnU3RyLmNoYXJBdChsZW4pO1xyXG4gICAgaWYgKGxlbiA9PT0gMCB8fCByZWdTdHIuY2hhckF0KGxlbiAtIDEpICE9PSBcIlxcXFxcIiApIHsgXHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKFwiKSBsZWZ0Kys7XHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKVwiKSByaWdodCsrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobGVmdCAhPT0gcmlnaHQpIHRocm93IFwiUmVnRXhwOiBcIisgcmVnU3RyICsgXCIncyBicmFja2V0IGlzIG5vdCBtYXJjaGVkXCI7XHJcbiAgZWxzZSByZXR1cm4gbGVmdCAtIGlnbm9yZWQ7XHJcbn07XHJcblxyXG5cclxuXy5lc2NhcGVSZWdFeHAgPSBmdW5jdGlvbiggc3RyKXsvLyBDcmVkaXQ6IFhSZWdFeHAgMC42LjEgKGMpIDIwMDctMjAwOCBTdGV2ZW4gTGV2aXRoYW4gPGh0dHA6Ly9zdGV2ZW5sZXZpdGhhbi5jb20vcmVnZXgveHJlZ2V4cC8+IE1JVCBMaWNlbnNlXHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLVtcXF17fSgpKis/LlxcXFxeJHwsI1xcc10vZywgZnVuY3Rpb24obWF0Y2gpe1xyXG4gICAgcmV0dXJuICdcXFxcJyArIG1hdGNoO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbnZhciByRW50aXR5ID0gbmV3IFJlZ0V4cChcIiYoPzooI3hbMC05YS1mQS1GXSspfCgjWzAtOV0rKXwoXCIgKyBfLmtleXMoZW50aXRpZXMpLmpvaW4oJ3wnKSArICcpKTsnLCAnZ2knKTtcclxuXHJcbl8uY29udmVydEVudGl0eSA9IGZ1bmN0aW9uKGNocil7XHJcblxyXG4gIHJldHVybiAoXCJcIiArIGNocikucmVwbGFjZShyRW50aXR5LCBmdW5jdGlvbihhbGwsIGhleCwgZGVjLCBjYXB0dXJlKXtcclxuICAgIHZhciBjaGFyQ29kZTtcclxuICAgIGlmKCBkZWMgKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBkZWMuc2xpY2UoMSksIDEwICk7XHJcbiAgICBlbHNlIGlmKCBoZXggKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBoZXguc2xpY2UoMiksIDE2ICk7XHJcbiAgICBlbHNlIGNoYXJDb2RlID0gZW50aXRpZXNbY2FwdHVyZV1cclxuXHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSggY2hhckNvZGUgKVxyXG4gIH0pO1xyXG5cclxufVxyXG5cclxuXHJcbi8vIHNpbXBsZSBnZXQgYWNjZXNzb3JcclxuXHJcbl8uY3JlYXRlT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZT8gZnVuY3Rpb24obyl7XHJcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUobyB8fCBudWxsKVxyXG59OiAoZnVuY3Rpb24oKXtcclxuICAgIGZ1bmN0aW9uIFRlbXAoKSB7fVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG8pe1xyXG4gICAgICBpZighbykgcmV0dXJuIHt9XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbztcclxuICAgICAgdmFyIG9iaiA9IG5ldyBUZW1wKCk7XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbnVsbDsgLy8g5LiN6KaB5L+d5oyB5LiA5LiqIE8g55qE5p2C5pWj5byV55So77yIYSBzdHJheSByZWZlcmVuY2XvvIkuLi5cclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXy5jcmVhdGVQcm90byA9IGZ1bmN0aW9uKGZuLCBvKXtcclxuICAgIGZ1bmN0aW9uIEZvbygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGZuO31cclxuICAgIEZvby5wcm90b3R5cGUgPSBvO1xyXG4gICAgcmV0dXJuIChmbi5wcm90b3R5cGUgPSBuZXcgRm9vKCkpO1xyXG59XHJcblxyXG5cclxuXy5yZW1vdmVPbmUgPSBmdW5jdGlvbihsaXN0ICwgZmlsdGVyKXtcclxuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XHJcbiAgZm9yKDtsZW4tLTspe1xyXG4gICAgaWYoZmlsdGVyKGxpc3RbbGVuXSkpIHtcclxuICAgICAgbGlzdC5zcGxpY2UobGVuLCAxKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbmNsb25lXHJcbiovXHJcbl8uY2xvbmUgPSBmdW5jdGlvbiBjbG9uZShvYmope1xyXG4gIGlmKCFvYmogfHwgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICkpIHJldHVybiBvYmo7XHJcbiAgaWYoQXJyYXkuaXNBcnJheShvYmopKXtcclxuICAgIHZhciBjbG9uZWQgPSBbXTtcclxuICAgIGZvcih2YXIgaT0wLGxlbiA9IG9iai5sZW5ndGg7IGk8IGxlbjtpKyspe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV1cclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfWVsc2V7XHJcbiAgICB2YXIgY2xvbmVkID0ge307XHJcbiAgICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG4gIH1cclxufVxyXG5cclxuXy5lcXVhbHMgPSBmdW5jdGlvbihub3csIG9sZCl7XHJcbiAgdmFyIHR5cGUgPSB0eXBlb2Ygbm93O1xyXG4gIGlmKHR5cGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBvbGQgPT09ICdudW1iZXInJiYgaXNOYU4obm93KSAmJiBpc05hTihvbGQpKSByZXR1cm4gdHJ1ZVxyXG4gIHJldHVybiBub3cgPT09IG9sZDtcclxufVxyXG5cclxudmFyIGRhc2ggPSAvLShbYS16XSkvZztcclxuXy5jYW1lbENhc2UgPSBmdW5jdGlvbihzdHIpe1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShkYXNoLCBmdW5jdGlvbihhbGwsIGNhcHR1cmUpe1xyXG4gICAgcmV0dXJuIGNhcHR1cmUudG9VcHBlckNhc2UoKTtcclxuICB9KVxyXG59XHJcblxyXG5cclxuXHJcbl8udGhyb3R0bGUgPSBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0KXtcclxuICB2YXIgd2FpdCA9IHdhaXQgfHwgMTAwO1xyXG4gIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XHJcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xyXG4gIHZhciBwcmV2aW91cyA9IDA7XHJcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBwcmV2aW91cyA9ICtuZXcgRGF0ZTtcclxuICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICB9O1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBub3cgPSArIG5ldyBEYXRlO1xyXG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xyXG4gICAgY29udGV4dCA9IHRoaXM7XHJcbiAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgcHJldmlvdXMgPSBub3c7XHJcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn07XHJcblxyXG4vLyBob2dhbiBlc2NhcGVcclxuLy8gPT09PT09PT09PT09PT1cclxuXy5lc2NhcGUgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgckFtcCA9IC8mL2csXHJcbiAgICAgIHJMdCA9IC88L2csXHJcbiAgICAgIHJHdCA9IC8+L2csXHJcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxyXG4gICAgICByUXVvdCA9IC9cXFwiL2csXHJcbiAgICAgIGhDaGFycyA9IC9bJjw+XFxcIlxcJ10vO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XHJcbiAgICAgIHN0clxyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXHJcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2Uockd0LCAnJmd0OycpXHJcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXHJcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XHJcbiAgICAgIHN0cjtcclxuICB9XHJcbn0pKCk7XHJcblxyXG5fLmNhY2hlID0gZnVuY3Rpb24obWF4KXtcclxuICBtYXggPSBtYXggfHwgMTAwMDtcclxuICB2YXIga2V5cyA9IFtdLFxyXG4gICAgICBjYWNoZSA9IHt9O1xyXG4gIHJldHVybiB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgaWYgKGtleXMubGVuZ3RoID4gdGhpcy5tYXgpIHtcclxuICAgICAgICBjYWNoZVtrZXlzLnNoaWZ0KCldID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFxyXG4gICAgICBpZihjYWNoZVtrZXldID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhY2hlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlO1xyXG4gICAgICByZXR1cm4gY2FjaGVba2V5XTtcclxuICAgIH0sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIGxlbjpmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ga2V5cy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLy8gLy8gc2V0dXAgdGhlIHJhdyBFeHByZXNzaW9uXHJcblxyXG5cclxuLy8gaGFuZGxlIHRoZSBzYW1lIGxvZ2ljIG9uIGNvbXBvbmVudCdzIGBvbi0qYCBhbmQgZWxlbWVudCdzIGBvbi0qYFxyXG4vLyByZXR1cm4gdGhlIGZpcmUgb2JqZWN0XHJcbl8uaGFuZGxlRXZlbnQgPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSApe1xyXG4gIHZhciBzZWxmID0gdGhpcywgZXZhbHVhdGU7XHJcbiAgaWYodmFsdWUudHlwZSA9PT0gJ2V4cHJlc3Npb24nKXsgLy8gaWYgaXMgZXhwcmVzc2lvbiwgZ28gZXZhbHVhdGVkIHdheVxyXG4gICAgZXZhbHVhdGUgPSB2YWx1ZS5nZXQ7XHJcbiAgfVxyXG4gIGlmKGV2YWx1YXRlKXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKG9iail7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gb2JqO1xyXG4gICAgICAgIHZhciByZXMgPSBldmFsdWF0ZShzZWxmKTtcclxuICAgICAgICBpZihyZXMgPT09IGZhbHNlICYmIG9iaiAmJiBvYmoucHJldmVudERlZmF1bHQpIG9iai5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9KVxyXG5cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKCl7XHJcbiAgICAgIHZhciBhcmdzID0gXy5zbGljZShhcmd1bWVudHMpO1xyXG4gICAgICBhcmdzLnVuc2hpZnQodmFsdWUpO1xyXG4gICAgICBzZWxmLiR1cGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgICBzZWxmLiRlbWl0LmFwcGx5KHNlbGYsIGFyZ3MpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gb25seSBjYWxsIG9uY2VcclxuXy5vbmNlID0gZnVuY3Rpb24oZm4pe1xyXG4gIHZhciB0aW1lID0gMDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGlmKCB0aW1lKysgPT09IDApIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG59XHJcblxyXG5fLmZpeE9ialN0ciA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgaWYoc3RyLnRyaW0oKS5pbmRleE9mKCd7JykgIT09IDApe1xyXG4gICAgcmV0dXJuICd7JyArIHN0ciArICd9JztcclxuICB9XHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbl8ubWFwPSBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2spe1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIHJlcy5wdXNoKGNhbGxiYWNrKGFycmF5W2ldLCBpKSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZyhtc2csIHR5cGUpe1xyXG4gIGlmKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSAgY29uc29sZVt0eXBlIHx8IFwibG9nXCJdKG1zZyk7XHJcbn1cclxuXHJcbl8ubG9nID0gbG9nO1xyXG5cclxuXHJcbl8ubm9ybUxpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50cyAgKXtcclxuICAgIHZhciBldmVudExpc3RlbmVycyA9IFtdO1xyXG4gICAgdmFyIHBUeXBlID0gXy50eXBlT2YoIGV2ZW50cyApO1xyXG4gICAgaWYoIHBUeXBlID09PSAnYXJyYXknICl7XHJcbiAgICAgIHJldHVybiBldmVudHM7XHJcbiAgICB9ZWxzZSBpZiAoIHBUeXBlID09PSAnb2JqZWN0JyApe1xyXG4gICAgICBmb3IoIHZhciBpIGluIGV2ZW50cyApIGlmICggZXZlbnRzLmhhc093blByb3BlcnR5KGkpICl7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBpLFxyXG4gICAgICAgICAgbGlzdGVuZXI6IGV2ZW50c1tpXVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBldmVudExpc3RlbmVycztcclxufVxyXG5cclxuXHJcbi8vaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvc2luZ2xlLXBhZ2UuaHRtbCN2b2lkLWVsZW1lbnRzXHJcbl8uaXNWb2lkVGFnID0gXy5tYWtlUHJlZGljYXRlKFwiYXJlYSBiYXNlIGJyIGNvbCBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWVudWl0ZW0gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyIHItY29udGVudFwiKTtcclxuXy5pc0Jvb2xlYW5BdHRyID0gXy5tYWtlUHJlZGljYXRlKCdzZWxlY3RlZCBjaGVja2VkIGRpc2FibGVkIHJlYWRvbmx5IHJlcXVpcmVkIG9wZW4gYXV0b2ZvY3VzIGNvbnRyb2xzIGF1dG9wbGF5IGNvbXBhY3QgbG9vcCBkZWZlciBtdWx0aXBsZScpO1xyXG5cclxuXHJcbl8uaXNFeHByID0gZnVuY3Rpb24oZXhwcil7XHJcbiAgcmV0dXJuIGV4cHIgJiYgZXhwci50eXBlID09PSAnZXhwcmVzc2lvbic7XHJcbn1cclxuLy8gQFRPRE86IG1ha2UgaXQgbW9yZSBzdHJpY3RcclxuXy5pc0dyb3VwID0gZnVuY3Rpb24oZ3JvdXApe1xyXG4gIHJldHVybiBncm91cC5pbmplY3QgfHwgZ3JvdXAuJGluamVjdDtcclxufVxyXG5cclxuXy5nZXRDb21waWxlRm4gPSBmdW5jdGlvbihzb3VyY2UsIGN0eCwgb3B0aW9ucyl7XHJcbiAgcmV0dXJuIGN0eC4kY29tcGlsZS5iaW5kKGN0eCxzb3VyY2UsIG9wdGlvbnMpXHJcbn1cclxuXHJcbi8vIHJlbW92ZSBkaXJlY3RpdmUgcGFyYW0gZnJvbSBBU1RcclxuXy5maXhUYWdBU1QgPSBmdW5jdGlvbiggdGFnQVNULCBDb21wb25lbnQgKXtcclxuXHJcbiAgaWYoIHRhZ0FTVC50b3VjaGVkICkgcmV0dXJuO1xyXG5cclxuICB2YXIgYXR0cnMgPSB0YWdBU1QuYXR0cnM7XHJcblxyXG4gIGlmKCAhYXR0cnMgKSByZXR1cm47XHJcblxyXG4gIC8vIE1heWJlIG11bHRpcGxlIGRpcmVjdGl2ZSBuZWVkIHNhbWUgcGFyYW0sIFxyXG4gIC8vIFdlIHBsYWNlIGFsbCBwYXJhbSBpbiB0b3RhbFBhcmFtTWFwXHJcbiAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcclxuICBpZighbGVuKSByZXR1cm47XHJcbiAgdmFyIGRpcmVjdGl2ZXM9W10sIG90aGVyQXR0ck1hcCA9IHt9O1xyXG4gIGZvcig7bGVuLS07KXtcclxuXHJcbiAgICB2YXIgYXR0ciA9IGF0dHJzWyBsZW4gXTtcclxuXHJcblxyXG4gICAgLy8gQElFIGZpeCBJRTktIGlucHV0IHR5cGUgY2FuJ3QgYXNzaWduIGFmdGVyIHZhbHVlXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICd0eXBlJykgYXR0ci5wcmlvcml0eSA9IE1BWF9QUklPUklUWSsxO1xyXG5cclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKCBhdHRyLm5hbWUgKTtcclxuICAgIGlmKCBkaXJlY3RpdmUgKSB7XHJcblxyXG4gICAgICBhdHRyLnByaW9yaXR5ID0gZGlyZWN0aXZlLnByaW9yaXR5IHx8IDE7XHJcbiAgICAgIGF0dHIuZGlyZWN0aXZlID0gdHJ1ZTtcclxuICAgICAgZGlyZWN0aXZlcy5wdXNoKGF0dHIpO1xyXG5cclxuICAgIH1lbHNlIGlmKGF0dHIudHlwZSA9PT0gJ2F0dHJpYnV0ZScpe1xyXG4gICAgICBvdGhlckF0dHJNYXBbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXJlY3RpdmVzLmZvckVhY2goIGZ1bmN0aW9uKCBhdHRyICl7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0gQ29tcG9uZW50LmRpcmVjdGl2ZShhdHRyLm5hbWUpO1xyXG4gICAgdmFyIHBhcmFtID0gZGlyZWN0aXZlLnBhcmFtO1xyXG4gICAgaWYocGFyYW0gJiYgcGFyYW0ubGVuZ3RoKXtcclxuICAgICAgYXR0ci5wYXJhbSA9IHt9O1xyXG4gICAgICBwYXJhbS5mb3JFYWNoKGZ1bmN0aW9uKCBuYW1lICl7XHJcbiAgICAgICAgaWYoIG5hbWUgaW4gb3RoZXJBdHRyTWFwICl7XHJcbiAgICAgICAgICBhdHRyLnBhcmFtW25hbWVdID0gb3RoZXJBdHRyTWFwW25hbWVdID09PSB1bmRlZmluZWQ/IHRydWU6IG90aGVyQXR0ck1hcFtuYW1lXVxyXG4gICAgICAgICAgXy5yZW1vdmVPbmUoYXR0cnMsIGZ1bmN0aW9uKGF0dHIpe1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0ci5uYW1lID09PSBuYW1lXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXR0cnMuc29ydChmdW5jdGlvbihhMSwgYTIpe1xyXG4gICAgXHJcbiAgICB2YXIgcDEgPSBhMS5wcmlvcml0eTtcclxuICAgIHZhciBwMiA9IGEyLnByaW9yaXR5O1xyXG5cclxuICAgIGlmKCBwMSA9PSBudWxsICkgcDEgPSBNQVhfUFJJT1JJVFk7XHJcbiAgICBpZiggcDIgPT0gbnVsbCApIHAyID0gTUFYX1BSSU9SSVRZO1xyXG5cclxuICAgIHJldHVybiBwMiAtIHAxO1xyXG5cclxuICB9KVxyXG5cclxuICB0YWdBU1QudG91Y2hlZCA9IHRydWU7XHJcbn1cclxuXHJcbl8uZmluZEl0ZW0gPSBmdW5jdGlvbihsaXN0LCBmaWx0ZXIpe1xyXG4gIGlmKCFsaXN0IHx8ICFsaXN0Lmxlbmd0aCkgcmV0dXJuO1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICB3aGlsZShsZW4tLSl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkgcmV0dXJuIGxpc3RbbGVuXVxyXG4gIH1cclxufVxyXG5cclxuXy5nZXRQYXJhbU9iaiA9IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFyYW0pe1xyXG4gIHZhciBwYXJhbU9iaiA9IHt9O1xyXG4gIGlmKHBhcmFtKSB7XHJcbiAgICBmb3IodmFyIGkgaW4gcGFyYW0pIGlmKHBhcmFtLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgdmFyIHZhbHVlID0gcGFyYW1baV07XHJcbiAgICAgIHBhcmFtT2JqW2ldID0gIHZhbHVlICYmIHZhbHVlLnR5cGU9PT0nZXhwcmVzc2lvbic/IGNvbXBvbmVudC4kZ2V0KHZhbHVlKTogdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBwYXJhbU9iajtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdCRUdJTic6ICd7JyxcclxuICAnRU5EJzogJ30nLFxyXG4gICdQUkVDT01QSUxFJzogZmFsc2VcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNTowNTowMSBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNCAyMzozMzozNFxyXG4gKi9cclxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uLy9wYXJzZXIvc3JjL1BhcnNlci5qcycpO1xyXG5cclxuaWYoIXRoaXMuZG9jdW1lbnQpe1xyXG4gICAgLyplc2xpbnQtZGlzYWJsZSovXHJcbiAgICBkb2N1bWVudCA9IHJlcXVpcmUoJy4uL3Zkb20vRG9jdW1lbnQuanMnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQmFzZVJlbmRlclN0b3JlKG9iail7XHJcblxyXG4gICAgdGhpcy5fYmVmb3JlQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9jb25maWdNb2RlbChvYmopO1xyXG4gICAgdGhpcy5fYWZ0ZXJDb25maWcoKTtcclxuICAgIHRoaXMuX3BhcnNlKCk7XHJcbn1cclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2JlZm9yZUNvbmZpZyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9hZnRlckNvbmZpZyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZyh0aGlzLmRhdGEpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fY29uZmlnTW9kZWwgPSBmdW5jdGlvbihtb2RlbCl7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG1vZGVsKTtcclxuXHJcbiAgICBpZighbW9kZWwuZGF0YSkgdGhpcy5kYXRhID0ge307XHJcbiAgICB0aGlzLl9saXN0ID0ge307XHJcbiAgICB0aGlzLiRsaXN0ID0ge307XHJcbiAgICB0aGlzLiRyZWZzID0ge307XHJcblxyXG4gICAgdGhpcy5fZGVmaW5lciA9IG1vZGVsO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fY29tcGlsZSA9IGZ1bmN0aW9uKGFzdCwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGN1ckluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpe1xyXG4gICAgaWYoYXN0IGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8YXN0Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZCh0aGlzLl9jb21waWxlKGFzdFtpXSwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGksIHJvb3RQYXRoLCBsaXN0TmFtZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21waWxlclthc3QudHlwZV0oYXN0LCB0aGlzLCBsaXN0SW5mbywgbGlzdEJ1ZmZlciwgY3VySW5kZXgsIHJvb3RQYXRoLCBsaXN0TmFtZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9wYXJzZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLkFTVCA9IG5ldyBQYXJzZXIodGhpcy50ZW1wbGF0ZSkucGFyc2UoKTtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3JlbmRlciA9IGZ1bmN0aW9uKCl7fTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3NnXyA9IGZ1bmN0aW9uIChwYXRoLCBkYXRhKSB7XHJcbiAgICB2YXIgcmVzdWx0O1xyXG4gICAgaWYgKHBhdGggaW5zdGFuY2VvZiBFdmVudCkge1xyXG4gICAgICAgIHJlc3VsdCA9IHBhdGg7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IGRhdGFbcGF0aF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNlUmVuZGVyU3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RvcmUvQmFzZVJlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vdXRpbC5qc1wiKTtcclxuXHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzXCIpO1xyXG52YXIgbm9kZSA9IHJlcXVpcmUoXCIuL25vZGUuanNcIik7XHJcbnZhciBMZXhlciA9IHJlcXVpcmUoXCIuL0xleGVyLmpzXCIpO1xyXG52YXIgdmFyTmFtZSA9IF8udmFyTmFtZTtcclxudmFyIGN0eE5hbWUgPSBfLmN0eE5hbWU7XHJcbnZhciBleHROYW1lID0gXy5leHROYW1lO1xyXG52YXIgaXNQYXRoID0gXy5tYWtlUHJlZGljYXRlKFwiU1RSSU5HIElERU5UIE5VTUJFUlwiKTtcclxudmFyIGlzS2V5V29yZCA9IF8ubWFrZVByZWRpY2F0ZShcInRydWUgZmFsc2UgdW5kZWZpbmVkIG51bGwgdGhpcyBBcnJheSBEYXRlIEpTT04gTWF0aCBOYU4gUmVnRXhwIGRlY29kZVVSSSBkZWNvZGVVUklDb21wb25lbnQgZW5jb2RlVVJJIGVuY29kZVVSSUNvbXBvbmVudCBwYXJzZUZsb2F0IHBhcnNlSW50IE9iamVjdFwiKTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIFBhcnNlcihpbnB1dCwgb3B0cyl7XHJcbiAgb3B0cyA9IG9wdHMgfHwge307XHJcblxyXG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICB0aGlzLnRva2VucyA9IG5ldyBMZXhlcihpbnB1dCwgb3B0cykubGV4KCk7XHJcbiAgdGhpcy5wb3MgPSAwO1xyXG4gIHRoaXMubGVuZ3RoID0gdGhpcy50b2tlbnMubGVuZ3RoO1xyXG59XHJcblxyXG5cclxudmFyIG9wID0gUGFyc2VyLnByb3RvdHlwZTtcclxuXHJcblxyXG5vcC5wYXJzZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5wb3MgPSAwO1xyXG4gIHZhciByZXM9IHRoaXMucHJvZ3JhbSgpO1xyXG4gIGlmKHRoaXMubGwoKS50eXBlID09PSAnVEFHX0NMT1NFJyl7XHJcbiAgICB0aGlzLmVycm9yKFwiWW91IG1heSBnb3QgYSB1bmNsb3NlZCBUYWdcIilcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxub3AubGwgPSAgZnVuY3Rpb24oayl7XHJcbiAgayA9IGsgfHwgMTtcclxuICBpZihrIDwgMCkgayA9IGsgKyAxO1xyXG4gIHZhciBwb3MgPSB0aGlzLnBvcyArIGsgLSAxO1xyXG4gIGlmKHBvcyA+IHRoaXMubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmxlbmd0aC0xXTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3Bvc107XHJcbn1cclxuICAvLyBsb29rYWhlYWRcclxub3AubGEgPSBmdW5jdGlvbihrKXtcclxuICByZXR1cm4gKHRoaXMubGwoaykgfHwgJycpLnR5cGU7XHJcbn1cclxuXHJcbm9wLm1hdGNoID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbDtcclxuICBpZighKGxsID0gdGhpcy5lYXQodHlwZSwgdmFsdWUpKSl7XHJcbiAgICBsbCAgPSB0aGlzLmxsKCk7XHJcbiAgICB0aGlzLmVycm9yKCdleHBlY3QgWycgKyB0eXBlICsgKHZhbHVlID09IG51bGw/ICcnOic6JysgdmFsdWUpICsgJ11cIiAtPiBnb3QgXCJbJyArIGxsLnR5cGUgKyAodmFsdWU9PW51bGw/ICcnOic6JytsbC52YWx1ZSkgKyAnXScsIGxsLnBvcylcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBsbDtcclxuICB9XHJcbn1cclxuXHJcbm9wLmVycm9yID0gZnVuY3Rpb24obXNnLCBwb3Mpe1xyXG4gIG1zZyA9ICBcIlxcbuOAkCBwYXJzZSBmYWlsZWQg44CRIFwiICsgbXNnICsgICc6XFxuXFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0eXBlb2YgcG9zID09PSAnbnVtYmVyJz8gcG9zOiB0aGlzLmxsKCkucG9zfHwwKTtcclxuICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcclxufVxyXG5cclxub3AubmV4dCA9IGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgdGhpcy5wb3MgKz0gaztcclxufVxyXG5vcC5lYXQgPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIGlmKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJyl7XHJcbiAgICBmb3IodmFyIGxlbiA9IHR5cGUubGVuZ3RoIDsgbGVuLS07KXtcclxuICAgICAgaWYobGwudHlwZSA9PT0gdHlwZVtsZW5dKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIGxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbGwudHlwZSA9PT0gdHlwZSAmJiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBsbC52YWx1ZSA9PT0gdmFsdWUpICl7XHJcbiAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgIHJldHVybiBsbDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vLyBwcm9ncmFtXHJcbi8vICA6RU9GXHJcbi8vICB8IChzdGF0ZW1lbnQpKiBFT0Zcclxub3AucHJvZ3JhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlbWVudHMgPSBbXSwgIGxsID0gdGhpcy5sbCgpO1xyXG4gIHdoaWxlKGxsLnR5cGUgIT09ICdFT0YnICYmIGxsLnR5cGUgIT09J1RBR19DTE9TRScpe1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLnN0YXRlbWVudCgpKTtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gIH1cclxuICAvLyBpZihsbC50eXBlID09PSAnVEFHX0NMT1NFJykgdGhpcy5lcnJvcihcIllvdSBtYXkgaGF2ZSB1bm1hdGNoZWQgVGFnXCIpXHJcbiAgcmV0dXJuIHN0YXRlbWVudHM7XHJcbn1cclxuXHJcbi8vIHN0YXRlbWVudFxyXG4vLyAgOiB4bWxcclxuLy8gIHwganN0XHJcbi8vICB8IHRleHRcclxub3Auc3RhdGVtZW50ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSAnTkFNRSc6XHJcbiAgICBjYXNlICdURVhUJzpcclxuICAgICAgdmFyIHRleHQgPSBsbC52YWx1ZTtcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHdoaWxlKGxsID0gdGhpcy5lYXQoWydOQU1FJywgJ1RFWFQnXSkpe1xyXG4gICAgICAgIHRleHQgKz0gbGwudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5vZGUudGV4dCh0ZXh0KTtcclxuICAgIGNhc2UgJ1RBR19PUEVOJzpcclxuICAgICAgcmV0dXJuIHRoaXMueG1sKCk7XHJcbiAgICBjYXNlICdPUEVOJzogXHJcbiAgICAgIHJldHVybiB0aGlzLmRpcmVjdGl2ZSgpO1xyXG4gICAgY2FzZSAnRVhQUl9PUEVOJzpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHRva2VuOiAnKyB0aGlzLmxhKCkpXHJcbiAgfVxyXG59XHJcblxyXG4vLyB4bWwgXHJcbi8vIHN0YWcgc3RhdGVtZW50KiBUQUdfQ0xPU0U/KGlmIHNlbGYtY2xvc2VkIHRhZylcclxub3AueG1sID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbmFtZSwgYXR0cnMsIGNoaWxkcmVuLCBzZWxmQ2xvc2VkO1xyXG4gIG5hbWUgPSB0aGlzLm1hdGNoKCdUQUdfT1BFTicpLnZhbHVlO1xyXG4gIGF0dHJzID0gdGhpcy5hdHRycygpO1xyXG4gIHNlbGZDbG9zZWQgPSB0aGlzLmVhdCgnLycpXHJcbiAgdGhpcy5tYXRjaCgnPicpO1xyXG4gIGlmKCAhc2VsZkNsb3NlZCAmJiAhXy5pc1ZvaWRUYWcobmFtZSkgKXtcclxuICAgIGNoaWxkcmVuID0gdGhpcy5wcm9ncmFtKCk7XHJcbiAgICBpZighdGhpcy5lYXQoJ1RBR19DTE9TRScsIG5hbWUpKSB0aGlzLmVycm9yKCdleHBlY3QgPC8nK25hbWUrJz4gZ290JysgJ25vIG1hdGNoZWQgY2xvc2VUYWcnKVxyXG4gIH1cclxuICByZXR1cm4gbm9kZS5lbGVtZW50KG5hbWUsIGF0dHJzLCBjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8vIHhlbnRpdHlcclxuLy8gIC1ydWxlKHdyYXAgYXR0cmlidXRlKVxyXG4vLyAgLWF0dHJpYnV0ZVxyXG4vL1xyXG4vLyBfX2V4YW1wbGVfX1xyXG4vLyAgbmFtZSA9IDEgfCAgXHJcbi8vICBuZy1oaWRlIHxcclxuLy8gIG9uLWNsaWNrPXt7fX0gfCBcclxuLy8gIHt7I2lmIG5hbWV9fW9uLWNsaWNrPXt7eHh9fXt7I2Vsc2V9fW9uLXRhcD17e319e3svaWZ9fVxyXG5cclxub3AueGVudGl0eSA9IGZ1bmN0aW9uKGxsKXtcclxuICB2YXIgbmFtZSA9IGxsLnZhbHVlLCB2YWx1ZSwgbW9kaWZpZXI7XHJcbiAgaWYobGwudHlwZSA9PT0gJ05BTUUnKXtcclxuICAgIC8vQCBvbmx5IGZvciB0ZXN0XHJcbiAgICBpZih+bmFtZS5pbmRleE9mKCcuJykpe1xyXG4gICAgICB2YXIgdG1wID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICBuYW1lID0gdG1wWzBdO1xyXG4gICAgICBtb2RpZmllciA9IHRtcFsxXVxyXG5cclxuICAgIH1cclxuICAgIGlmKCB0aGlzLmVhdChcIj1cIikgKSB2YWx1ZSA9IHRoaXMuYXR0dmFsdWUobW9kaWZpZXIpO1xyXG4gICAgcmV0dXJuIG5vZGUuYXR0cmlidXRlKCBuYW1lLCB2YWx1ZSwgbW9kaWZpZXIgKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCBuYW1lICE9PSAnaWYnKSB0aGlzLmVycm9yKFwiY3VycmVudCB2ZXJzaW9uLiBPTkxZIFJVTEUgI2lmICNlbHNlICNlbHNlaWYgaXMgdmFsaWQgaW4gdGFnLCB0aGUgcnVsZSAjXCIgKyBuYW1lICsgJyBpcyBpbnZhbGlkJyk7XHJcbiAgICByZXR1cm4gdGhpc1snaWYnXSh0cnVlKTtcclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBzdGFnICAgICA6Oj0gICAgJzwnIE5hbWUgKFMgYXR0cikqIFM/ICc+JyAgXHJcbi8vIGF0dHIgICAgOjo9ICAgICBOYW1lIEVxIGF0dHZhbHVlXHJcbm9wLmF0dHJzID0gZnVuY3Rpb24oaXNBdHRyaWJ1dGUpe1xyXG4gIHZhciBlYXRcclxuICBpZighaXNBdHRyaWJ1dGUpe1xyXG4gICAgZWF0ID0gW1wiTkFNRVwiLCBcIk9QRU5cIl1cclxuICB9ZWxzZXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIl1cclxuICB9XHJcblxyXG4gIHZhciBhdHRycyA9IFtdLCBsbDtcclxuICB3aGlsZSAobGwgPSB0aGlzLmVhdChlYXQpKXtcclxuICAgIGF0dHJzLnB1c2godGhpcy54ZW50aXR5KCBsbCApKVxyXG4gIH1cclxuICByZXR1cm4gYXR0cnM7XHJcbn1cclxuXHJcbi8vIGF0dHZhbHVlXHJcbi8vICA6IFNUUklORyAgXHJcbi8vICB8IE5BTUVcclxub3AuYXR0dmFsdWUgPSBmdW5jdGlvbihtZGYpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwiTkFNRVwiOlxyXG4gICAgY2FzZSBcIlVOUVwiOlxyXG4gICAgY2FzZSBcIlNUUklOR1wiOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgdmFyIHZhbHVlID0gbGwudmFsdWU7XHJcbiAgICAgIGlmKH52YWx1ZS5pbmRleE9mKGNvbmZpZy5CRUdJTikgJiYgfnZhbHVlLmluZGV4T2YoY29uZmlnLkVORCkgJiYgbWRmIT09J2NtcGwnKXtcclxuICAgICAgICB2YXIgY29uc3RhbnQgPSB0cnVlO1xyXG4gICAgICAgIHZhciBwYXJzZWQgPSBuZXcgUGFyc2VyKHZhbHVlLCB7IG1vZGU6IDIgfSkucGFyc2UoKTtcclxuICAgICAgICBpZihwYXJzZWQubGVuZ3RoID09PSAxICYmIHBhcnNlZFswXS50eXBlID09PSAnZXhwcmVzc2lvbicpIHJldHVybiBwYXJzZWRbMF07XHJcbiAgICAgICAgdmFyIGJvZHkgPSBbXTtcclxuICAgICAgICBwYXJzZWQuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgIGlmKCFpdGVtLmNvbnN0YW50KSBjb25zdGFudD1mYWxzZTtcclxuICAgICAgICAgIC8vIHNpbGVudCB0aGUgbXV0aXBsZSBpbnRlcGxhdGlvblxyXG4gICAgICAgICAgICBib2R5LnB1c2goaXRlbS5ib2R5IHx8IFwiJ1wiICsgaXRlbS50ZXh0LnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKSArIFwiJ1wiKTsgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJvZHkgPSBcIltcIiArIGJvZHkuam9pbihcIixcIikgKyBcIl0uam9pbignJylcIjtcclxuICAgICAgICB2YWx1ZSA9IG5vZGUuZXhwcmVzc2lvbihib2R5LCBudWxsLCBjb25zdGFudCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgY2FzZSBcIkVYUFJfT1BFTlwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcclxuICAgIC8vIGNhc2UgXCJPUEVOXCI6XHJcbiAgICAvLyAgIGlmKGxsLnZhbHVlID09PSAnaW5jJyB8fCBsbC52YWx1ZSA9PT0gJ2luY2x1ZGUnKXtcclxuICAgIC8vICAgICB0aGlzLm5leHQoKTtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5pbmMoKTtcclxuICAgIC8vICAgfWVsc2V7XHJcbiAgICAvLyAgICAgdGhpcy5lcnJvcignYXR0cmlidXRlIHZhbHVlIG9ubHkgc3VwcG9ydCBpbnRlcGxhdGlvbiBhbmQgeyNpbmN9IHN0YXRlbWVudCcpXHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHRva2VuOiAnKyB0aGlzLmxhKCkpXHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8ge3sjfX1cclxub3AuZGlyZWN0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbmFtZSA9IHRoaXMubGwoKS52YWx1ZTtcclxuICB0aGlzLm5leHQoKTtcclxuICBpZih0eXBlb2YgdGhpc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICByZXR1cm4gdGhpc1tuYW1lXSgpXHJcbiAgfWVsc2V7XHJcbiAgICB0aGlzLmVycm9yKCdVbmRlZmluZWQgZGlyZWN0aXZlWycrIG5hbWUgKyddJyk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8ge3t9fVxyXG5vcC5pbnRlcnBsYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMubWF0Y2goJ0VYUFJfT1BFTicpO1xyXG4gIHZhciByZXMgPSB0aGlzLmV4cHJlc3Npb24odHJ1ZSk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLy8ge3t+fX1cclxub3AuaW5jID0gb3AuaW5jbHVkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvbnRlbnQgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICByZXR1cm4gbm9kZS50ZW1wbGF0ZShjb250ZW50KTtcclxufVxyXG5cclxuLy8ge3sjaWZ9fVxyXG5vcFtcImlmXCJdID0gZnVuY3Rpb24odGFnKXtcclxuICB2YXIgdGVzdCA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gIHZhciBjb25zZXF1ZW50ID0gW10sIGFsdGVybmF0ZT1bXTtcclxuXHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcbiAgdmFyIHN0YXRlbWVudCA9ICF0YWc/IFwic3RhdGVtZW50XCIgOiBcImF0dHJzXCI7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG5cclxuICB2YXIgbGwsIGNsb3NlO1xyXG4gIHdoaWxlKCAhIChjbG9zZSA9IHRoaXMuZWF0KCdDTE9TRScpKSApe1xyXG4gICAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgICBpZiggbGwudHlwZSA9PT0gJ09QRU4nICl7XHJcbiAgICAgIHN3aXRjaCggbGwudmFsdWUgKXtcclxuICAgICAgICBjYXNlICdlbHNlJzpcclxuICAgICAgICAgIGNvbnRhaW5lciA9IGFsdGVybmF0ZTtcclxuICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgdGhpcy5tYXRjaCggJ0VORCcgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Vsc2VpZic6XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIGFsdGVybmF0ZS5wdXNoKCB0aGlzW1wiaWZcIl0odGFnKSApO1xyXG4gICAgICAgICAgcmV0dXJuIG5vZGVbJ2lmJ10oIHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSApO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjb250YWluZXIucHVzaCggdGhpc1tzdGF0ZW1lbnRdKHRydWUpICk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBjb250YWluZXIucHVzaCh0aGlzW3N0YXRlbWVudF0odHJ1ZSkpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBpZiBzdGF0ZW1lbnQgbm90IG1hdGNoZWRcclxuICBpZihjbG9zZS52YWx1ZSAhPT0gXCJpZlwiKSB0aGlzLmVycm9yKCdVbm1hdGNoZWQgaWYgZGlyZWN0aXZlJylcclxuICByZXR1cm4gbm9kZVtcImlmXCJdKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XHJcbn1cclxuXHJcblxyXG4vLyBAbWFyayAgIG11c3RhY2hlIHN5bnRheCBoYXZlIG5hdHJ1cmUgZGlzLCBjYW5vdCB3aXRoIGV4cHJlc3Npb25cclxuLy8ge3sjbGlzdH19XHJcbm9wLmxpc3QgPSBmdW5jdGlvbigpe1xyXG4gIC8vIHNlcXVlbmNlIGNhbiBiZSBhIGxpc3Qgb3IgaGFzaFxyXG4gIHZhciBzZXF1ZW5jZSA9IHRoaXMuZXhwcmVzc2lvbigpLCB2YXJpYWJsZSwgbGwsIHRyYWNrO1xyXG4gIHZhciBjb25zZXF1ZW50ID0gW10sIGFsdGVybmF0ZT1bXTtcclxuICB2YXIgY29udGFpbmVyID0gY29uc2VxdWVudDtcclxuXHJcbiAgdGhpcy5tYXRjaCgnSURFTlQnLCAnYXMnKTtcclxuXHJcbiAgdmFyaWFibGUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG5cclxuICBpZih0aGlzLmVhdCgnSURFTlQnLCAnYnknKSl7XHJcbiAgICBpZih0aGlzLmVhdCgnSURFTlQnLHZhcmlhYmxlICsgJ19pbmRleCcpKXtcclxuICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRyYWNrID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICAgIGlmKHRyYWNrLmNvbnN0YW50KXtcclxuICAgICAgICAvLyB0cnVlIGlzIG1lYW5zIGNvbnN0YW50LCB3ZSBoYW5kbGUgaXQganVzdCBsaWtlIHh4eF9pbmRleC5cclxuICAgICAgICB0cmFjayA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG5cclxuICB3aGlsZSggIShsbCA9IHRoaXMuZWF0KCdDTE9TRScpKSApe1xyXG4gICAgaWYodGhpcy5lYXQoJ09QRU4nLCAnZWxzZScpKXtcclxuICAgICAgY29udGFpbmVyID0gIGFsdGVybmF0ZTtcclxuICAgICAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGlmKGxsLnZhbHVlICE9PSAnbGlzdCcpIHRoaXMuZXJyb3IoJ2V4cGVjdCAnICsgJ2xpc3QgZ290ICcgKyAnLycgKyBsbC52YWx1ZSArICcgJywgbGwucG9zICk7XHJcbiAgcmV0dXJuIG5vZGUubGlzdChzZXF1ZW5jZSwgdmFyaWFibGUsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSwgdHJhY2spO1xyXG59XHJcblxyXG5cclxub3AuZXhwcmVzc2lvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGV4cHJlc3Npb247XHJcbiAgaWYodGhpcy5lYXQoJ0AoJykpeyAvL29uY2UgYmluZFxyXG4gICAgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcigpO1xyXG4gICAgZXhwcmVzc2lvbi5vbmNlID0gdHJ1ZTtcclxuICAgIHRoaXMubWF0Y2goJyknKVxyXG4gIH1lbHNle1xyXG4gICAgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcigpO1xyXG4gIH1cclxuICByZXR1cm4gZXhwcmVzc2lvbjtcclxufVxyXG5cclxub3AuZXhwciA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5kZXBlbmQgPSBbXTtcclxuXHJcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuZmlsdGVyKClcclxuXHJcbiAgdmFyIGJvZHkgPSBidWZmZXIuZ2V0IHx8IGJ1ZmZlcjtcclxuICB2YXIgc2V0Ym9keSA9IGJ1ZmZlci5zZXQ7XHJcbiAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbihib2R5LCBzZXRib2R5LCAhdGhpcy5kZXBlbmQubGVuZ3RoLCBidWZmZXIuZmlsdGVycyk7XHJcbn1cclxuXHJcblxyXG4vLyBmaWx0ZXJcclxuLy8gYXNzaWduICgnfCcgZmlsdGVybmFtZVsnOicgYXJnc10pICogXHJcbm9wLmZpbHRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFzc2lnbigpO1xyXG4gIHZhciBsbCA9IHRoaXMuZWF0KCd8Jyk7XHJcbiAgdmFyIGJ1ZmZlciA9IFtdLCBmaWx0ZXJzLHNldEJ1ZmZlciwgcHJlZml4LFxyXG4gICAgYXR0ciA9IFwidFwiLCBcclxuICAgIHNldCA9IGxlZnQuc2V0LCBnZXQsIFxyXG4gICAgdG1wID0gXCJcIjtcclxuXHJcbiAgaWYobGwpe1xyXG4gICAgaWYoc2V0KSB7XHJcbiAgICAgIHNldEJ1ZmZlciA9IFtdO1xyXG4gICAgICBmaWx0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJlZml4ID0gXCIoZnVuY3Rpb24oXCIgKyBhdHRyICsgXCIpe1wiO1xyXG5cclxuICAgIGRve1xyXG4gICAgICB2YXIgZmlsdGVyTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgIHRtcCA9IGF0dHIgKyBcIiA9IFwiICsgY3R4TmFtZSArIFwiLl9mXygnXCIgKyBmaWx0ZXJOYW1lICsgXCInICkuZ2V0LmNhbGwoIFwiK18uY3R4TmFtZSArXCIsXCIgKyBhdHRyIDtcclxuICAgICAgaWYodGhpcy5lYXQoJzonKSl7XHJcbiAgICAgICAgdG1wICs9XCIsIFwiKyB0aGlzLmFyZ3VtZW50cyhcInxcIikuam9pbihcIixcIikgKyBcIik7XCJcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdG1wICs9ICcpOydcclxuICAgICAgfVxyXG4gICAgICBidWZmZXIucHVzaCh0bXApO1xyXG4gICAgICBcclxuICAgICAgaWYoc2V0KXtcclxuICAgICAgICAvLyBvbmx5IGluIHJ1bnRpbWUgLHdlIGNhbiBkZXRlY3QgIHdoZXRoZXIgIHRoZSBmaWx0ZXIgaGFzIGEgc2V0IGZ1bmN0aW9uLiBcclxuICAgICAgICBmaWx0ZXJzLnB1c2goZmlsdGVyTmFtZSk7XHJcbiAgICAgICAgc2V0QnVmZmVyLnVuc2hpZnQoIHRtcC5yZXBsYWNlKFwiICkuZ2V0LmNhbGxcIiwgXCIgKS5zZXQuY2FsbFwiKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgfXdoaWxlKGxsID0gdGhpcy5lYXQoJ3wnKSk7XHJcbiAgICBidWZmZXIucHVzaChcInJldHVybiBcIiArIGF0dHIgKTtcclxuICAgIHNldEJ1ZmZlciAmJiBzZXRCdWZmZXIucHVzaChcInJldHVybiBcIiArIGF0dHIpO1xyXG5cclxuICAgIGdldCA9ICBwcmVmaXggKyBidWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIrbGVmdC5nZXQrXCIpXCI7XHJcbiAgICAvLyB3ZSBjYWxsIGJhY2sgdG8gdmFsdWUuXHJcbiAgICBpZihzZXRCdWZmZXIpe1xyXG4gICAgICAvLyBjaGFuZ2UgX3NzX18obmFtZSwgX3BfKSB0byBfc19fKG5hbWUsIGZpbHRlckZuKF9wXykpO1xyXG4gICAgICBzZXQgPSBzZXQucmVwbGFjZShfLnNldE5hbWUsIFxyXG4gICAgICAgIHByZWZpeCArIHNldEJ1ZmZlci5qb2luKFwiXCIpICsgXCJ9KShcIivjgIBfLnNldE5hbWXjgIArXCIpXCIgKTtcclxuXHJcbiAgICB9XHJcbiAgICAvLyB0aGUgc2V0IGZ1bmN0aW9uIGlzIGRlcGVuZCBvbiB0aGUgZmlsdGVyIGRlZmluaXRpb24uIGlmIGl0IGhhdmUgc2V0IG1ldGhvZCwgdGhlIHNldCB3aWxsIHdvcmtcclxuICAgIHZhciByZXQgPSBnZXRzZXQoZ2V0LCBzZXQpO1xyXG4gICAgcmV0LmZpbHRlcnMgPSBmaWx0ZXJzO1xyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbi8vIGFzc2lnblxyXG4vLyBsZWZ0LWhhbmQtZXhwciA9IGNvbmRpdGlvblxyXG5vcC5hc3NpZ24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5jb25kaXRpb24oKSwgbGw7XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJz0nLCAnKz0nLCAnLT0nLCAnKj0nLCAnLz0nLCAnJT0nXSkpe1xyXG4gICAgaWYoIWxlZnQuc2V0KSB0aGlzLmVycm9yKCdpbnZhbGlkIGxlZnRoYW5kIGV4cHJlc3Npb24gaW4gYXNzaWdubWVudCBleHByZXNzaW9uJyk7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCBsZWZ0LnNldC5yZXBsYWNlKCBcIixcIiArIF8uc2V0TmFtZSwgXCIsXCIgKyB0aGlzLmNvbmRpdGlvbigpLmdldCApLnJlcGxhY2UoXCInPSdcIiwgXCInXCIrbGwudHlwZStcIidcIiksIGxlZnQuc2V0KTtcclxuICAgIC8vIHJldHVybiBnZXRzZXQoJygnICsgbGVmdC5nZXQgKyBsbC50eXBlICArIHRoaXMuY29uZGl0aW9uKCkuZ2V0ICsgJyknLCBsZWZ0LnNldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBvclxyXG4vLyBvciA/IGFzc2lnbiA6IGFzc2lnblxyXG5vcC5jb25kaXRpb24gPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgdGVzdCA9IHRoaXMub3IoKTtcclxuICBpZih0aGlzLmVhdCgnPycpKXtcclxuICAgIHJldHVybiBnZXRzZXQoW3Rlc3QuZ2V0ICsgXCI/XCIsIFxyXG4gICAgICB0aGlzLmFzc2lnbigpLmdldCwgXHJcbiAgICAgIHRoaXMubWF0Y2goXCI6XCIpLnR5cGUsIFxyXG4gICAgICB0aGlzLmFzc2lnbigpLmdldF0uam9pbihcIlwiKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGVzdDtcclxufVxyXG5cclxuLy8gYW5kXHJcbi8vIGFuZCAmJiBvclxyXG5vcC5vciA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBsZWZ0ID0gdGhpcy5hbmQoKTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ3x8Jykpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArICd8fCcgKyB0aGlzLm9yKCkuZ2V0KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcbi8vIGVxdWFsXHJcbi8vIGVxdWFsICYmIGFuZFxyXG5vcC5hbmQgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuZXF1YWwoKTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJyYmJykpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArICcmJicgKyB0aGlzLmFuZCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcbi8vIHJlbGF0aW9uXHJcbi8vIFxyXG4vLyBlcXVhbCA9PSByZWxhdGlvblxyXG4vLyBlcXVhbCAhPSByZWxhdGlvblxyXG4vLyBlcXVhbCA9PT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT09IHJlbGF0aW9uXHJcbm9wLmVxdWFsID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMucmVsYXRpb24oKSwgbGw7XHJcbiAgLy8gQHBlcmY7XHJcbiAgaWYoIGxsID0gdGhpcy5lYXQoWyc9PScsJyE9JywgJz09PScsICchPT0nXSkpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnR5cGUgKyB0aGlzLmVxdWFsKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyByZWxhdGlvbiA8IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID4gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPD0gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPj0gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gaW4gYWRkaXRpdmVcclxub3AucmVsYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hZGRpdGl2ZSgpLCBsbDtcclxuICAvLyBAcGVyZlxyXG4gIGlmKGxsID0gKHRoaXMuZWF0KFsnPCcsICc+JywgJz49JywgJzw9J10pIHx8IHRoaXMuZWF0KCdJREVOVCcsICdpbicpICkpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5yZWxhdGlvbigpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gYWRkaXRpdmUgOlxyXG4vLyBtdWx0aXZlXHJcbi8vIGFkZGl0aXZlICsgbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSAtIG11bHRpdmVcclxub3AuYWRkaXRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5tdWx0aXZlKCkgLGxsO1xyXG4gIGlmKGxsPSB0aGlzLmVhdChbJysnLCctJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudmFsdWUgKyB0aGlzLmFkZGl0aXZlKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyBtdWx0aXZlIDpcclxuLy8gdW5hcnlcclxuLy8gbXVsdGl2ZSAqIHVuYXJ5XHJcbi8vIG11bHRpdmUgLyB1bmFyeVxyXG4vLyBtdWx0aXZlICUgdW5hcnlcclxub3AubXVsdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJhbmdlKCkgLGxsO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnKicsICcvJyAsJyUnXSkgKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5tdWx0aXZlKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbm9wLnJhbmdlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMudW5hcnkoKSwgbGwsIHJpZ2h0O1xyXG5cclxuICBpZihsbCA9IHRoaXMuZWF0KCcuLicpKXtcclxuICAgIHJpZ2h0ID0gdGhpcy51bmFyeSgpO1xyXG4gICAgdmFyIGJvZHkgPSBcclxuICAgICAgXCIoZnVuY3Rpb24oc3RhcnQsZW5kKXt2YXIgcmVzID0gW10sc3RlcD1lbmQ+c3RhcnQ/MTotMTsgZm9yKHZhciBpID0gc3RhcnQ7IGVuZD5zdGFydD9pIDw9IGVuZDogaT49ZW5kOyBpPWkrc3RlcCl7cmVzLnB1c2goaSk7IH0gcmV0dXJuIHJlcyB9KShcIitsZWZ0LmdldCtcIixcIityaWdodC5nZXQrXCIpXCJcclxuICAgIHJldHVybiBnZXRzZXQoYm9keSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuXHJcblxyXG4vLyBsZWZ0aGFuZFxyXG4vLyArIHVuYXJ5XHJcbi8vIC0gdW5hcnlcclxuLy8gfiB1bmFyeVxyXG4vLyAhIHVuYXJ5XHJcbm9wLnVuYXJ5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGw7XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJysnLCctJywnficsICchJ10pKXtcclxuICAgIHJldHVybiBnZXRzZXQoJygnICsgbGwudHlwZSArIHRoaXMudW5hcnkoKS5nZXQgKyAnKScpIDtcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiB0aGlzLm1lbWJlcigpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBjYWxsW2xlZnRoYW5kXSA6XHJcbi8vIG1lbWJlciBhcmdzXHJcbi8vIG1lbWJlciBbIGV4cHJlc3Npb24gXVxyXG4vLyBtZW1iZXIgLiBpZGVudCAgXHJcblxyXG5vcC5tZW1iZXIgPSBmdW5jdGlvbihiYXNlLCBsYXN0LCBwYXRoZXMsIHByZXZCYXNlKXtcclxuICB2YXIgbGwsIHBhdGgsIGV4dFZhbHVlO1xyXG5cclxuXHJcbiAgdmFyIG9ubHlTaW1wbGVBY2Nlc3NvciA9IGZhbHNlO1xyXG4gIGlmKCFiYXNlKXsgLy9maXJzdFxyXG4gICAgcGF0aCA9IHRoaXMucHJpbWFyeSgpO1xyXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgcGF0aDtcclxuICAgIGlmKHR5cGUgPT09ICdzdHJpbmcnKXsgXHJcbiAgICAgIHBhdGhlcyA9IFtdO1xyXG4gICAgICBwYXRoZXMucHVzaCggcGF0aCApO1xyXG4gICAgICBsYXN0ID0gcGF0aDtcclxuICAgICAgZXh0VmFsdWUgPSBleHROYW1lICsgXCIuXCIgKyBwYXRoXHJcbiAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXygnXCIgKyBwYXRoICsgXCInLCBcIiArIHZhck5hbWUgKyBcIiwgXCIgKyBleHROYW1lICsgXCIpXCI7XHJcbiAgICAgIG9ubHlTaW1wbGVBY2Nlc3NvciA9IHRydWU7XHJcbiAgICB9ZWxzZXsgLy9QcmltYXRpdmUgVHlwZVxyXG4gICAgICBpZihwYXRoLmdldCA9PT0gJ3RoaXMnKXtcclxuICAgICAgICBiYXNlID0gY3R4TmFtZTtcclxuICAgICAgICBwYXRoZXMgPSBbJ3RoaXMnXTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcGF0aGVzID0gbnVsbDtcclxuICAgICAgICBiYXNlID0gcGF0aC5nZXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ZWxzZXsgLy8gbm90IGZpcnN0IGVudGVyXHJcbiAgICBpZih0eXBlb2YgbGFzdCA9PT0gJ3N0cmluZycgJiYgaXNQYXRoKCBsYXN0KSApeyAvLyBpcyB2YWxpZCBwYXRoXHJcbiAgICAgIHBhdGhlcy5wdXNoKGxhc3QpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGlmKHBhdGhlcyAmJiBwYXRoZXMubGVuZ3RoKSB0aGlzLmRlcGVuZC5wdXNoKHBhdGhlcyk7XHJcbiAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKGxsID0gdGhpcy5lYXQoWydbJywgJy4nLCAnKCddKSl7XHJcbiAgICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICAgIGNhc2UgJy4nOlxyXG4gICAgICAgICAgLy8gbWVtYmVyKG9iamVjdCwgcHJvcGVydHksIGNvbXB1dGVkKVxyXG4gICAgICAgIHZhciB0bXBOYW1lID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuICAgICAgICBwcmV2QmFzZSA9IGJhc2U7XHJcbiAgICAgICAgaWYoIHRoaXMubGEoKSAhPT0gXCIoXCIgKXsgXHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgdG1wTmFtZSArIFwiJywgXCIgKyBiYXNlICsgXCIpXCI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiYXNlICs9IFwiWydcIiArIHRtcE5hbWUgKyBcIiddXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlciggYmFzZSwgdG1wTmFtZSwgcGF0aGVzLCAgcHJldkJhc2UpO1xyXG4gICAgICBjYXNlICdbJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICBwYXRoID0gdGhpcy5hc3NpZ24oKTtcclxuICAgICAgICBwcmV2QmFzZSA9IGJhc2U7XHJcbiAgICAgICAgaWYoIHRoaXMubGEoKSAhPT0gXCIoXCIgKXsgXHJcbiAgICAgICAgLy8gbWVhbnMgZnVuY3Rpb24gY2FsbCwgd2UgbmVlZCB0aHJvdyB1bmRlZmluZWQgZXJyb3Igd2hlbiBjYWxsIGZ1bmN0aW9uXHJcbiAgICAgICAgLy8gYW5kIGNvbmZpcm0gdGhhdCB0aGUgZnVuY3Rpb24gY2FsbCB3b250IGxvc2UgaXRzIGNvbnRleHRcclxuICAgICAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXyhcIiArIHBhdGguZ2V0ICsgXCIsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIltcIiArIHBhdGguZ2V0ICsgXCJdXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWF0Y2goJ10nKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcihiYXNlLCBwYXRoLCBwYXRoZXMsIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnKCc6XHJcbiAgICAgICAgLy8gY2FsbChjYWxsZWUsIGFyZ3MpXHJcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cygpLmpvaW4oJywnKTtcclxuICAgICAgICBiYXNlID0gIGJhc2UrXCIoXCIgKyBhcmdzICtcIilcIjtcclxuICAgICAgICB0aGlzLm1hdGNoKCcpJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgbnVsbCwgcGF0aGVzKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYoIHBhdGhlcyAmJiBwYXRoZXMubGVuZ3RoICkgdGhpcy5kZXBlbmQucHVzaCggcGF0aGVzICk7XHJcbiAgdmFyIHJlcyA9ICB7Z2V0OiBiYXNlfTtcclxuICBpZihsYXN0KXtcclxuICAgIHJlcy5zZXQgPSBjdHhOYW1lICsgXCIuX3NzXyhcIiArIFxyXG4gICAgICAgIChsYXN0LmdldD8gbGFzdC5nZXQgOiBcIidcIisgbGFzdCArIFwiJ1wiKSArIFxyXG4gICAgICAgIFwiLFwiKyBfLnNldE5hbWUgKyBcIixcIisgXHJcbiAgICAgICAgKHByZXZCYXNlP3ByZXZCYXNlOl8udmFyTmFtZSkgKyBcclxuICAgICAgICBcIiwgJz0nLCBcIisgKCBvbmx5U2ltcGxlQWNjZXNzb3I/IDEgOiAwICkgKyBcIilcIjtcclxuICBcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxub3AuYXJndW1lbnRzID0gZnVuY3Rpb24oZW5kKXtcclxuICBlbmQgPSBlbmQgfHwgJyknXHJcbiAgdmFyIGFyZ3MgPSBbXTtcclxuICBkb3tcclxuICAgIGlmKHRoaXMubGEoKSAhPT0gZW5kKXtcclxuICAgICAgYXJncy5wdXNoKHRoaXMuYXNzaWduKCkuZ2V0KVxyXG4gICAgfVxyXG4gIH13aGlsZSggdGhpcy5lYXQoJywnKSk7XHJcbiAgcmV0dXJuIGFyZ3NcclxufVxyXG5cclxuXHJcbi8vIHByaW1hcnkgOlxyXG4vLyB0aGlzIFxyXG4vLyBpZGVudFxyXG4vLyBsaXRlcmFsXHJcbi8vIGFycmF5XHJcbi8vIG9iamVjdFxyXG4vLyAoIGV4cHJlc3Npb24gKVxyXG5cclxub3AucHJpbWFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgXCJ7XCI6XHJcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xyXG4gICAgY2FzZSBcIltcIjpcclxuICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcclxuICAgIGNhc2UgXCIoXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLnBhcmVuKCk7XHJcbiAgICAvLyBsaXRlcmFsIG9yIGlkZW50XHJcbiAgICBjYXNlICdTVFJJTkcnOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgdmFyIHZhbHVlID0gXCJcIiArIGxsLnZhbHVlO1xyXG4gICAgICB2YXIgcXVvdGEgPSB+dmFsdWUuaW5kZXhPZihcIidcIik/IFwiXFxcIlwiOiBcIidcIiA7XHJcbiAgICAgIHJldHVybiBnZXRzZXQocXVvdGEgKyB2YWx1ZSArIHF1b3RhKTtcclxuICAgIGNhc2UgJ05VTUJFUic6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KCBcIlwiICsgbGwudmFsdWUgKTtcclxuICAgIGNhc2UgXCJJREVOVFwiOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgaWYoaXNLZXlXb3JkKGxsLnZhbHVlKSl7XHJcbiAgICAgICAgcmV0dXJuIGdldHNldCggbGwudmFsdWUgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGwudmFsdWU7XHJcbiAgICBkZWZhdWx0OiBcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCBUb2tlbjogJyArIGxsLnR5cGUpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gb2JqZWN0XHJcbi8vICB7cHJvcEFzc2lnbiBbLCBwcm9wQXNzaWduXSAqIFssXX1cclxuXHJcbi8vIHByb3BBc3NpZ25cclxuLy8gIHByb3AgOiBhc3NpZ25cclxuXHJcbi8vIHByb3BcclxuLy8gIFNUUklOR1xyXG4vLyAgSURFTlRcclxuLy8gIE5VTUJFUlxyXG5cclxub3Aub2JqZWN0ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29kZSA9IFt0aGlzLm1hdGNoKCd7JykudHlwZV07XHJcblxyXG4gIHZhciBsbCA9IHRoaXMuZWF0KCBbJ1NUUklORycsICdJREVOVCcsICdOVU1CRVInXSApO1xyXG4gIHdoaWxlKGxsKXtcclxuICAgIGNvZGUucHVzaChcIidcIiArIGxsLnZhbHVlICsgXCInXCIgKyB0aGlzLm1hdGNoKCc6JykudHlwZSk7XHJcbiAgICB2YXIgZ2V0ID0gdGhpcy5hc3NpZ24oKS5nZXQ7XHJcbiAgICBjb2RlLnB1c2goZ2V0KTtcclxuICAgIGxsID0gbnVsbDtcclxuICAgIGlmKHRoaXMuZWF0KFwiLFwiKSAmJiAobGwgPSB0aGlzLmVhdChbJ1NUUklORycsICdJREVOVCcsICdOVU1CRVInXSkpICkgY29kZS5wdXNoKFwiLFwiKTtcclxuICB9XHJcbiAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ30nKS50eXBlKTtcclxuICByZXR1cm4ge2dldDogY29kZS5qb2luKFwiXCIpfVxyXG59XHJcblxyXG4vLyBhcnJheVxyXG4vLyBbIGFzc2lnblssYXNzaWduXSpdXHJcbm9wLmFycmF5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29kZSA9IFt0aGlzLm1hdGNoKCdbJykudHlwZV0sIGl0ZW07XHJcbiAgaWYoIHRoaXMuZWF0KFwiXVwiKSApe1xyXG5cclxuICAgICBjb2RlLnB1c2goXCJdXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZShpdGVtID0gdGhpcy5hc3NpZ24oKSl7XHJcbiAgICAgIGNvZGUucHVzaChpdGVtLmdldCk7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCcsJykpIGNvZGUucHVzaChcIixcIik7XHJcbiAgICAgIGVsc2UgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBjb2RlLnB1c2godGhpcy5tYXRjaCgnXScpLnR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4ge2dldDogY29kZS5qb2luKFwiXCIpfTtcclxufVxyXG5cclxuLy8gJygnIGV4cHJlc3Npb24gJyknXHJcbm9wLnBhcmVuID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCcoJyk7XHJcbiAgdmFyIHJlcyA9IHRoaXMuZmlsdGVyKClcclxuICByZXMuZ2V0ID0gJygnICsgcmVzLmdldCArICcpJztcclxuICByZXMuc2V0ID0gcmVzLnNldDtcclxuICB0aGlzLm1hdGNoKCcpJyk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0c2V0KGdldCwgc2V0KXtcclxuICByZXR1cm4ge1xyXG4gICAgZ2V0OiBnZXQsXHJcbiAgICBzZXQ6IHNldFxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL1BhcnNlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3RpbWVycy1icm93c2VyaWZ5QDIuMC40QHRpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fc2V0aW1tZWRpYXRlQDEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvX3Byb2Nlc3NAMC4xMS4xMEBwcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBzaGltIGZvciBlczVcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciB0c3RyID0gKHt9KS50b1N0cmluZztcclxuXHJcbmZ1bmN0aW9uIGV4dGVuZChvMSwgbzIgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgIG8xW2ldID0gbzJbaV1cclxuICB9XHJcbiAgcmV0dXJuIG8yO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIC8vIFN0cmluZyBwcm90byA7XHJcbiAgZXh0ZW5kKFN0cmluZy5wcm90b3R5cGUsIHtcclxuICAgIHRyaW06IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG4gIC8vIEFycmF5IHByb3RvO1xyXG4gIGV4dGVuZChBcnJheS5wcm90b3R5cGUsIHtcclxuICAgIGluZGV4T2Y6IGZ1bmN0aW9uKG9iaiwgZnJvbSl7XHJcbiAgICAgIGZyb20gPSBmcm9tIHx8IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSBmcm9tLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikgcmV0dXJuIGk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuICAgIC8vIHBvbHlmaWxsIGZyb20gTUROIFxyXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaFxyXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIGN0eCl7XHJcbiAgICAgIHZhciBrID0gMDtcclxuXHJcbiAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCBwYXNzaW5nIHRoZSB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcclxuXHJcbiAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDsgXHJcblxyXG4gICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoIGNhbGxiYWNrICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIiApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgICAgd2hpbGUoIGsgPCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBrVmFsdWU7XHJcblxyXG4gICAgICAgIGlmICggayBpbiBPICkge1xyXG5cclxuICAgICAgICAgIGtWYWx1ZSA9IE9bIGsgXTtcclxuXHJcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKCBjdHgsIGtWYWx1ZSwgaywgTyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBrKys7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBAZGVwcmVjYXRlZFxyXG4gICAgLy8gIHdpbGwgYmUgcmVtb3ZlZCBhdCAwLjUuMFxyXG4gICAgZmlsdGVyOiBmdW5jdGlvbihmdW4sIGNvbnRleHQpe1xyXG5cclxuICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XHJcbiAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcclxuICAgICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcblxyXG4gICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXHJcbiAgICAgIHtcclxuICAgICAgICBpZiAoaSBpbiB0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhciB2YWwgPSB0W2ldO1xyXG4gICAgICAgICAgaWYgKGZ1bi5jYWxsKGNvbnRleHQsIHZhbCwgaSwgdCkpXHJcbiAgICAgICAgICAgIHJlcy5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBGdW5jdGlvbiBwcm90bztcclxuICBleHRlbmQoRnVuY3Rpb24ucHJvdG90eXBlLCB7XHJcbiAgICBiaW5kOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgdmFyIGZuID0gdGhpcztcclxuICAgICAgdmFyIHByZUFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBhcmdzID0gcHJlQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIFxyXG4gIC8vIEFycmF5XHJcbiAgZXh0ZW5kKEFycmF5LCB7XHJcbiAgICBpc0FycmF5OiBmdW5jdGlvbihhcnIpe1xyXG4gICAgICByZXR1cm4gdHN0ci5jYWxsKGFycikgPT09IFwiW29iamVjdCBBcnJheV1cIjtcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvaGVscGVyL3NoaW0uanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzU0MDY0L2hvdy10by1jb252ZXJ0LWNoYXJhY3RlcnMtdG8taHRtbC1lbnRpdGllcy11c2luZy1wbGFpbi1qYXZhc2NyaXB0XHJcbnZhciBlbnRpdGllcyA9IHtcclxuICAncXVvdCc6MzQsIFxyXG4gICdhbXAnOjM4LCBcclxuICAnYXBvcyc6MzksIFxyXG4gICdsdCc6NjAsIFxyXG4gICdndCc6NjIsIFxyXG4gICduYnNwJzoxNjAsIFxyXG4gICdpZXhjbCc6MTYxLCBcclxuICAnY2VudCc6MTYyLCBcclxuICAncG91bmQnOjE2MywgXHJcbiAgJ2N1cnJlbic6MTY0LCBcclxuICAneWVuJzoxNjUsIFxyXG4gICdicnZiYXInOjE2NiwgXHJcbiAgJ3NlY3QnOjE2NywgXHJcbiAgJ3VtbCc6MTY4LCBcclxuICAnY29weSc6MTY5LCBcclxuICAnb3JkZic6MTcwLCBcclxuICAnbGFxdW8nOjE3MSwgXHJcbiAgJ25vdCc6MTcyLCBcclxuICAnc2h5JzoxNzMsIFxyXG4gICdyZWcnOjE3NCwgXHJcbiAgJ21hY3InOjE3NSwgXHJcbiAgJ2RlZyc6MTc2LCBcclxuICAncGx1c21uJzoxNzcsIFxyXG4gICdzdXAyJzoxNzgsIFxyXG4gICdzdXAzJzoxNzksIFxyXG4gICdhY3V0ZSc6MTgwLCBcclxuICAnbWljcm8nOjE4MSwgXHJcbiAgJ3BhcmEnOjE4MiwgXHJcbiAgJ21pZGRvdCc6MTgzLCBcclxuICAnY2VkaWwnOjE4NCwgXHJcbiAgJ3N1cDEnOjE4NSwgXHJcbiAgJ29yZG0nOjE4NiwgXHJcbiAgJ3JhcXVvJzoxODcsIFxyXG4gICdmcmFjMTQnOjE4OCwgXHJcbiAgJ2ZyYWMxMic6MTg5LCBcclxuICAnZnJhYzM0JzoxOTAsIFxyXG4gICdpcXVlc3QnOjE5MSwgXHJcbiAgJ0FncmF2ZSc6MTkyLCBcclxuICAnQWFjdXRlJzoxOTMsIFxyXG4gICdBY2lyYyc6MTk0LCBcclxuICAnQXRpbGRlJzoxOTUsIFxyXG4gICdBdW1sJzoxOTYsIFxyXG4gICdBcmluZyc6MTk3LCBcclxuICAnQUVsaWcnOjE5OCwgXHJcbiAgJ0NjZWRpbCc6MTk5LCBcclxuICAnRWdyYXZlJzoyMDAsIFxyXG4gICdFYWN1dGUnOjIwMSwgXHJcbiAgJ0VjaXJjJzoyMDIsIFxyXG4gICdFdW1sJzoyMDMsIFxyXG4gICdJZ3JhdmUnOjIwNCwgXHJcbiAgJ0lhY3V0ZSc6MjA1LCBcclxuICAnSWNpcmMnOjIwNiwgXHJcbiAgJ0l1bWwnOjIwNywgXHJcbiAgJ0VUSCc6MjA4LCBcclxuICAnTnRpbGRlJzoyMDksIFxyXG4gICdPZ3JhdmUnOjIxMCwgXHJcbiAgJ09hY3V0ZSc6MjExLCBcclxuICAnT2NpcmMnOjIxMiwgXHJcbiAgJ090aWxkZSc6MjEzLCBcclxuICAnT3VtbCc6MjE0LCBcclxuICAndGltZXMnOjIxNSwgXHJcbiAgJ09zbGFzaCc6MjE2LCBcclxuICAnVWdyYXZlJzoyMTcsIFxyXG4gICdVYWN1dGUnOjIxOCwgXHJcbiAgJ1VjaXJjJzoyMTksIFxyXG4gICdVdW1sJzoyMjAsIFxyXG4gICdZYWN1dGUnOjIyMSwgXHJcbiAgJ1RIT1JOJzoyMjIsIFxyXG4gICdzemxpZyc6MjIzLCBcclxuICAnYWdyYXZlJzoyMjQsIFxyXG4gICdhYWN1dGUnOjIyNSwgXHJcbiAgJ2FjaXJjJzoyMjYsIFxyXG4gICdhdGlsZGUnOjIyNywgXHJcbiAgJ2F1bWwnOjIyOCwgXHJcbiAgJ2FyaW5nJzoyMjksIFxyXG4gICdhZWxpZyc6MjMwLCBcclxuICAnY2NlZGlsJzoyMzEsIFxyXG4gICdlZ3JhdmUnOjIzMiwgXHJcbiAgJ2VhY3V0ZSc6MjMzLCBcclxuICAnZWNpcmMnOjIzNCwgXHJcbiAgJ2V1bWwnOjIzNSwgXHJcbiAgJ2lncmF2ZSc6MjM2LCBcclxuICAnaWFjdXRlJzoyMzcsIFxyXG4gICdpY2lyYyc6MjM4LCBcclxuICAnaXVtbCc6MjM5LCBcclxuICAnZXRoJzoyNDAsIFxyXG4gICdudGlsZGUnOjI0MSwgXHJcbiAgJ29ncmF2ZSc6MjQyLCBcclxuICAnb2FjdXRlJzoyNDMsIFxyXG4gICdvY2lyYyc6MjQ0LCBcclxuICAnb3RpbGRlJzoyNDUsIFxyXG4gICdvdW1sJzoyNDYsIFxyXG4gICdkaXZpZGUnOjI0NywgXHJcbiAgJ29zbGFzaCc6MjQ4LCBcclxuICAndWdyYXZlJzoyNDksIFxyXG4gICd1YWN1dGUnOjI1MCwgXHJcbiAgJ3VjaXJjJzoyNTEsIFxyXG4gICd1dW1sJzoyNTIsIFxyXG4gICd5YWN1dGUnOjI1MywgXHJcbiAgJ3Rob3JuJzoyNTQsIFxyXG4gICd5dW1sJzoyNTUsIFxyXG4gICdmbm9mJzo0MDIsIFxyXG4gICdBbHBoYSc6OTEzLCBcclxuICAnQmV0YSc6OTE0LCBcclxuICAnR2FtbWEnOjkxNSwgXHJcbiAgJ0RlbHRhJzo5MTYsIFxyXG4gICdFcHNpbG9uJzo5MTcsIFxyXG4gICdaZXRhJzo5MTgsIFxyXG4gICdFdGEnOjkxOSwgXHJcbiAgJ1RoZXRhJzo5MjAsIFxyXG4gICdJb3RhJzo5MjEsIFxyXG4gICdLYXBwYSc6OTIyLCBcclxuICAnTGFtYmRhJzo5MjMsIFxyXG4gICdNdSc6OTI0LCBcclxuICAnTnUnOjkyNSwgXHJcbiAgJ1hpJzo5MjYsIFxyXG4gICdPbWljcm9uJzo5MjcsIFxyXG4gICdQaSc6OTI4LCBcclxuICAnUmhvJzo5MjksIFxyXG4gICdTaWdtYSc6OTMxLCBcclxuICAnVGF1Jzo5MzIsIFxyXG4gICdVcHNpbG9uJzo5MzMsIFxyXG4gICdQaGknOjkzNCwgXHJcbiAgJ0NoaSc6OTM1LCBcclxuICAnUHNpJzo5MzYsIFxyXG4gICdPbWVnYSc6OTM3LCBcclxuICAnYWxwaGEnOjk0NSwgXHJcbiAgJ2JldGEnOjk0NiwgXHJcbiAgJ2dhbW1hJzo5NDcsIFxyXG4gICdkZWx0YSc6OTQ4LCBcclxuICAnZXBzaWxvbic6OTQ5LCBcclxuICAnemV0YSc6OTUwLCBcclxuICAnZXRhJzo5NTEsIFxyXG4gICd0aGV0YSc6OTUyLCBcclxuICAnaW90YSc6OTUzLCBcclxuICAna2FwcGEnOjk1NCwgXHJcbiAgJ2xhbWJkYSc6OTU1LCBcclxuICAnbXUnOjk1NiwgXHJcbiAgJ251Jzo5NTcsIFxyXG4gICd4aSc6OTU4LCBcclxuICAnb21pY3Jvbic6OTU5LCBcclxuICAncGknOjk2MCwgXHJcbiAgJ3Jobyc6OTYxLCBcclxuICAnc2lnbWFmJzo5NjIsIFxyXG4gICdzaWdtYSc6OTYzLCBcclxuICAndGF1Jzo5NjQsIFxyXG4gICd1cHNpbG9uJzo5NjUsIFxyXG4gICdwaGknOjk2NiwgXHJcbiAgJ2NoaSc6OTY3LCBcclxuICAncHNpJzo5NjgsIFxyXG4gICdvbWVnYSc6OTY5LCBcclxuICAndGhldGFzeW0nOjk3NywgXHJcbiAgJ3Vwc2loJzo5NzgsIFxyXG4gICdwaXYnOjk4MiwgXHJcbiAgJ2J1bGwnOjgyMjYsIFxyXG4gICdoZWxsaXAnOjgyMzAsIFxyXG4gICdwcmltZSc6ODI0MiwgXHJcbiAgJ1ByaW1lJzo4MjQzLCBcclxuICAnb2xpbmUnOjgyNTQsIFxyXG4gICdmcmFzbCc6ODI2MCwgXHJcbiAgJ3dlaWVycCc6ODQ3MiwgXHJcbiAgJ2ltYWdlJzo4NDY1LCBcclxuICAncmVhbCc6ODQ3NiwgXHJcbiAgJ3RyYWRlJzo4NDgyLCBcclxuICAnYWxlZnN5bSc6ODUwMSwgXHJcbiAgJ2xhcnInOjg1OTIsIFxyXG4gICd1YXJyJzo4NTkzLCBcclxuICAncmFycic6ODU5NCwgXHJcbiAgJ2RhcnInOjg1OTUsIFxyXG4gICdoYXJyJzo4NTk2LCBcclxuICAnY3JhcnInOjg2MjksIFxyXG4gICdsQXJyJzo4NjU2LCBcclxuICAndUFycic6ODY1NywgXHJcbiAgJ3JBcnInOjg2NTgsIFxyXG4gICdkQXJyJzo4NjU5LCBcclxuICAnaEFycic6ODY2MCwgXHJcbiAgJ2ZvcmFsbCc6ODcwNCwgXHJcbiAgJ3BhcnQnOjg3MDYsIFxyXG4gICdleGlzdCc6ODcwNywgXHJcbiAgJ2VtcHR5Jzo4NzA5LCBcclxuICAnbmFibGEnOjg3MTEsIFxyXG4gICdpc2luJzo4NzEyLCBcclxuICAnbm90aW4nOjg3MTMsIFxyXG4gICduaSc6ODcxNSwgXHJcbiAgJ3Byb2QnOjg3MTksIFxyXG4gICdzdW0nOjg3MjEsIFxyXG4gICdtaW51cyc6ODcyMiwgXHJcbiAgJ2xvd2FzdCc6ODcyNywgXHJcbiAgJ3JhZGljJzo4NzMwLCBcclxuICAncHJvcCc6ODczMywgXHJcbiAgJ2luZmluJzo4NzM0LCBcclxuICAnYW5nJzo4NzM2LCBcclxuICAnYW5kJzo4NzQzLCBcclxuICAnb3InOjg3NDQsIFxyXG4gICdjYXAnOjg3NDUsIFxyXG4gICdjdXAnOjg3NDYsIFxyXG4gICdpbnQnOjg3NDcsIFxyXG4gICd0aGVyZTQnOjg3NTYsIFxyXG4gICdzaW0nOjg3NjQsIFxyXG4gICdjb25nJzo4NzczLCBcclxuICAnYXN5bXAnOjg3NzYsIFxyXG4gICduZSc6ODgwMCwgXHJcbiAgJ2VxdWl2Jzo4ODAxLCBcclxuICAnbGUnOjg4MDQsIFxyXG4gICdnZSc6ODgwNSwgXHJcbiAgJ3N1Yic6ODgzNCwgXHJcbiAgJ3N1cCc6ODgzNSwgXHJcbiAgJ25zdWInOjg4MzYsIFxyXG4gICdzdWJlJzo4ODM4LCBcclxuICAnc3VwZSc6ODgzOSwgXHJcbiAgJ29wbHVzJzo4ODUzLCBcclxuICAnb3RpbWVzJzo4ODU1LCBcclxuICAncGVycCc6ODg2OSwgXHJcbiAgJ3Nkb3QnOjg5MDEsIFxyXG4gICdsY2VpbCc6ODk2OCwgXHJcbiAgJ3JjZWlsJzo4OTY5LCBcclxuICAnbGZsb29yJzo4OTcwLCBcclxuICAncmZsb29yJzo4OTcxLCBcclxuICAnbGFuZyc6OTAwMSwgXHJcbiAgJ3JhbmcnOjkwMDIsIFxyXG4gICdsb3onOjk2NzQsIFxyXG4gICdzcGFkZXMnOjk4MjQsIFxyXG4gICdjbHVicyc6OTgyNywgXHJcbiAgJ2hlYXJ0cyc6OTgyOSwgXHJcbiAgJ2RpYW1zJzo5ODMwLCBcclxuICAnT0VsaWcnOjMzOCwgXHJcbiAgJ29lbGlnJzozMzksIFxyXG4gICdTY2Fyb24nOjM1MiwgXHJcbiAgJ3NjYXJvbic6MzUzLCBcclxuICAnWXVtbCc6Mzc2LCBcclxuICAnY2lyYyc6NzEwLCBcclxuICAndGlsZGUnOjczMiwgXHJcbiAgJ2Vuc3AnOjgxOTQsIFxyXG4gICdlbXNwJzo4MTk1LCBcclxuICAndGhpbnNwJzo4MjAxLCBcclxuICAnenduaic6ODIwNCwgXHJcbiAgJ3p3aic6ODIwNSwgXHJcbiAgJ2xybSc6ODIwNiwgXHJcbiAgJ3JsbSc6ODIwNywgXHJcbiAgJ25kYXNoJzo4MjExLCBcclxuICAnbWRhc2gnOjgyMTIsIFxyXG4gICdsc3F1byc6ODIxNiwgXHJcbiAgJ3JzcXVvJzo4MjE3LCBcclxuICAnc2JxdW8nOjgyMTgsIFxyXG4gICdsZHF1byc6ODIyMCwgXHJcbiAgJ3JkcXVvJzo4MjIxLCBcclxuICAnYmRxdW8nOjgyMjIsIFxyXG4gICdkYWdnZXInOjgyMjQsIFxyXG4gICdEYWdnZXInOjgyMjUsIFxyXG4gICdwZXJtaWwnOjgyNDAsIFxyXG4gICdsc2FxdW8nOjgyNDksIFxyXG4gICdyc2FxdW8nOjgyNTAsIFxyXG4gICdldXJvJzo4MzY0XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgID0gZW50aXRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2hlbHBlci9lbnRpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBlbGVtZW50OiBmdW5jdGlvbihuYW1lLCBhdHRycywgY2hpbGRyZW4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2VsZW1lbnQnLFxyXG4gICAgICB0YWc6IG5hbWUsXHJcbiAgICAgIGF0dHJzOiBhdHRycyxcclxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXHJcbiAgICB9XHJcbiAgfSxcclxuICBhdHRyaWJ1dGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtZGYpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgbWRmOiBtZGZcclxuICAgIH1cclxuICB9LFxyXG4gIFwiaWZcIjogZnVuY3Rpb24odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdpZicsXHJcbiAgICAgIHRlc3Q6IHRlc3QsXHJcbiAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnQsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlXHJcbiAgICB9XHJcbiAgfSxcclxuICBsaXN0OiBmdW5jdGlvbihzZXF1ZW5jZSwgdmFyaWFibGUsIGJvZHksIGFsdGVybmF0ZSwgdHJhY2spe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2xpc3QnLFxyXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlLFxyXG4gICAgICB2YXJpYWJsZTogdmFyaWFibGUsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIHRyYWNrOiB0cmFja1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZXhwcmVzc2lvbjogZnVuY3Rpb24oIGJvZHksIHNldGJvZHksIGNvbnN0YW50LCBmaWx0ZXJzICl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcImV4cHJlc3Npb25cIixcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgY29uc3RhbnQ6IGNvbnN0YW50IHx8IGZhbHNlLFxyXG4gICAgICBzZXRib2R5OiBzZXRib2R5IHx8IGZhbHNlLFxyXG4gICAgICBmaWx0ZXJzOiBmaWx0ZXJzXHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICB0ZXh0OiB0ZXh0XHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ3RlbXBsYXRlJyxcclxuICAgICAgY29udGVudDogdGVtcGxhdGVcclxuICAgIH1cclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL25vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vdXRpbC5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcuanNcIik7XHJcblxyXG4vLyBzb21lIGN1c3RvbSB0YWcgIHdpbGwgY29uZmxpY3Qgd2l0aCB0aGUgTGV4ZXIgcHJvZ3Jlc3NcclxudmFyIGNvbmZsaWN0VGFnID0ge1wifVwiOiBcIntcIiwgXCJdXCI6IFwiW1wifSwgbWFwMSwgbWFwMjtcclxuLy8gc29tZSBtYWNybyBmb3IgbGV4ZXJcclxudmFyIG1hY3JvID0ge1xyXG4gICdOQU1FJzogLyg/Ols6X0EtWmEtel1bLVxcLjpfMC05QS1aYS16XSopLyxcclxuICAnSURFTlQnOiAvW1xcJF9BLVphLXpdW18wLTlBLVphLXpcXCRdKi8sXHJcbiAgJ1NQQUNFJzogL1tcXHJcXG5cXHRcXGYgXS9cclxufVxyXG5cclxuXHJcbnZhciB0ZXN0ID0gL2F8KGIpLy5leGVjKFwiYVwiKTtcclxudmFyIHRlc3RTdWJDYXB1cmUgPSB0ZXN0ICYmIHRlc3RbMV0gPT09IHVuZGVmaW5lZD8gXHJcbiAgZnVuY3Rpb24oc3RyKXsgcmV0dXJuIHN0ciAhPT0gdW5kZWZpbmVkIH1cclxuICA6ZnVuY3Rpb24oc3RyKXtyZXR1cm4gISFzdHJ9O1xyXG5cclxuZnVuY3Rpb24gd3JhcEhhbmRlcihoYW5kbGVyKXtcclxuICByZXR1cm4gZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7dHlwZTogaGFuZGxlciwgdmFsdWU6IGFsbCB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBMZXhlcihpbnB1dCwgb3B0cyl7XHJcbiAgaWYoY29uZmxpY3RUYWdbY29uZmlnLkVORF0pe1xyXG4gICAgdGhpcy5tYXJrU3RhcnQgPSBjb25mbGljdFRhZ1tjb25maWcuRU5EXTtcclxuICAgIHRoaXMubWFya0VuZCA9IGNvbmZpZy5FTkQ7XHJcbiAgfVxyXG5cclxuICB0aGlzLmlucHV0ID0gKGlucHV0fHxcIlwiKS50cmltKCk7XHJcbiAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fTtcclxuICB0aGlzLm1hcCA9IHRoaXMub3B0cy5tb2RlICE9PSAyPyAgbWFwMTogbWFwMjtcclxuICB0aGlzLnN0YXRlcyA9IFtcIklOSVRcIl07XHJcbiAgaWYob3B0cyAmJiBvcHRzLmV4cHJlc3Npb24pe1xyXG4gICAgIHRoaXMuc3RhdGVzLnB1c2goXCJKU1RcIik7XHJcbiAgICAgdGhpcy5leHByZXNzaW9uID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbnZhciBsbyA9IExleGVyLnByb3RvdHlwZVxyXG5cclxuXHJcbmxvLmxleCA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgc3RyID0gKHN0ciB8fCB0aGlzLmlucHV0KS50cmltKCk7XHJcbiAgdmFyIHRva2VucyA9IFtdLCBzcGxpdCwgdGVzdCxtbGVuLCB0b2tlbiwgc3RhdGU7XHJcbiAgdGhpcy5pbnB1dCA9IHN0ciwgXHJcbiAgdGhpcy5tYXJrcyA9IDA7XHJcbiAgLy8gaW5pdCB0aGUgcG9zIGluZGV4XHJcbiAgdGhpcy5pbmRleD0wO1xyXG4gIHZhciBpID0gMDtcclxuICB3aGlsZShzdHIpe1xyXG4gICAgaSsrXHJcbiAgICBzdGF0ZSA9IHRoaXMuc3RhdGUoKTtcclxuICAgIHNwbGl0ID0gdGhpcy5tYXBbc3RhdGVdIFxyXG4gICAgdGVzdCA9IHNwbGl0LlRSVU5LLmV4ZWMoc3RyKTtcclxuICAgIGlmKCF0ZXN0KXtcclxuICAgICAgdGhpcy5lcnJvcignVW5yZWNvZ2luaXplZCBUb2tlbicpO1xyXG4gICAgfVxyXG4gICAgbWxlbiA9IHRlc3RbMF0ubGVuZ3RoO1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKG1sZW4pXHJcbiAgICB0b2tlbiA9IHRoaXMuX3Byb2Nlc3MuY2FsbCh0aGlzLCB0ZXN0LCBzcGxpdCwgc3RyKVxyXG4gICAgaWYodG9rZW4pIHRva2Vucy5wdXNoKHRva2VuKVxyXG4gICAgdGhpcy5pbmRleCArPSBtbGVuO1xyXG4gICAgLy8gaWYoc3RhdGUgPT0gJ1RBRycgfHwgc3RhdGUgPT0gJ0pTVCcpIHN0ciA9IHRoaXMuc2tpcHNwYWNlKHN0cik7XHJcbiAgfVxyXG5cclxuICB0b2tlbnMucHVzaCh7dHlwZTogJ0VPRid9KTtcclxuXHJcbiAgcmV0dXJuIHRva2VucztcclxufVxyXG5cclxubG8uZXJyb3IgPSBmdW5jdGlvbihtc2cpe1xyXG4gIHRocm93ICBFcnJvcihcIlBhcnNlIEVycm9yOiBcIiArIG1zZyArICAnOlxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdGhpcy5pbmRleCkpO1xyXG59XHJcblxyXG5sby5fcHJvY2VzcyA9IGZ1bmN0aW9uKGFyZ3MsIHNwbGl0LHN0cil7XHJcbiAgLy8gY29uc29sZS5sb2coYXJncy5qb2luKFwiLFwiKSwgdGhpcy5zdGF0ZSgpKVxyXG4gIHZhciBsaW5rcyA9IHNwbGl0LmxpbmtzLCBtYXJjaGVkID0gZmFsc2UsIHRva2VuO1xyXG5cclxuICBmb3IodmFyIGxlbiA9IGxpbmtzLmxlbmd0aCwgaT0wO2k8bGVuIDtpKyspe1xyXG4gICAgdmFyIGxpbmsgPSBsaW5rc1tpXSxcclxuICAgICAgaGFuZGxlciA9IGxpbmtbMl0sXHJcbiAgICAgIGluZGV4ID0gbGlua1swXTtcclxuICAgIC8vIGlmKGFyZ3NbNl0gPT09ICc+JyAmJiBpbmRleCA9PT0gNikgY29uc29sZS5sb2coJ2hhaGEnKVxyXG4gICAgaWYodGVzdFN1YkNhcHVyZShhcmdzW2luZGV4XSkpIHtcclxuICAgICAgbWFyY2hlZCA9IHRydWU7XHJcbiAgICAgIGlmKGhhbmRsZXIpe1xyXG4gICAgICAgIHRva2VuID0gaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzLnNsaWNlKGluZGV4LCBpbmRleCArIGxpbmtbMV0pKVxyXG4gICAgICAgIGlmKHRva2VuKSAgdG9rZW4ucG9zID0gdGhpcy5pbmRleDtcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgaWYoIW1hcmNoZWQpeyAvLyBpbiBpZSBsdDggLiBzdWIgY2FwdHVyZSBpcyBcIlwiIGJ1dCBvbnQgXHJcbiAgICBzd2l0Y2goc3RyLmNoYXJBdCgwKSl7XHJcbiAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgdGhpcy5lbnRlcihcIlRBR1wiKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aGlzLmVudGVyKFwiSlNUXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdG9rZW47XHJcbn1cclxubG8uZW50ZXIgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdGhpcy5zdGF0ZXMucHVzaChzdGF0ZSlcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubG8uc3RhdGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcclxuICByZXR1cm4gc3RhdGVzW3N0YXRlcy5sZW5ndGgtMV07XHJcbn1cclxuXHJcbmxvLmxlYXZlID0gZnVuY3Rpb24oc3RhdGUpe1xyXG4gIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcclxuICBpZighc3RhdGUgfHwgc3RhdGVzW3N0YXRlcy5sZW5ndGgtMV0gPT09IHN0YXRlKSBzdGF0ZXMucG9wKClcclxufVxyXG5cclxuXHJcbkxleGVyLnNldHVwID0gZnVuY3Rpb24oKXtcclxuICBtYWNyby5FTkQgPSBjb25maWcuRU5EO1xyXG4gIG1hY3JvLkJFR0lOID0gY29uZmlnLkJFR0lOO1xyXG4gIC8vXHJcbiAgbWFwMSA9IGdlbk1hcChbXHJcbiAgICAvLyBJTklUXHJcbiAgICBydWxlcy5FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5FTlRFUl9UQUcsXHJcbiAgICBydWxlcy5URVhULFxyXG5cclxuICAgIC8vVEFHXHJcbiAgICBydWxlcy5UQUdfTkFNRSxcclxuICAgIHJ1bGVzLlRBR19PUEVOLFxyXG4gICAgcnVsZXMuVEFHX0NMT1NFLFxyXG4gICAgcnVsZXMuVEFHX1BVTkNIT1IsXHJcbiAgICBydWxlcy5UQUdfRU5URVJfSlNULFxyXG4gICAgcnVsZXMuVEFHX1VOUV9WQUxVRSxcclxuICAgIHJ1bGVzLlRBR19TVFJJTkcsXHJcbiAgICBydWxlcy5UQUdfU1BBQ0UsXHJcbiAgICBydWxlcy5UQUdfQ09NTUVOVCxcclxuXHJcbiAgICAvLyBKU1RcclxuICAgIHJ1bGVzLkpTVF9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0NMT1NFLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfRVhQUl9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0lERU5ULFxyXG4gICAgcnVsZXMuSlNUX1NQQUNFLFxyXG4gICAgcnVsZXMuSlNUX0xFQVZFLFxyXG4gICAgcnVsZXMuSlNUX05VTUJFUixcclxuICAgIHJ1bGVzLkpTVF9QVU5DSE9SLFxyXG4gICAgcnVsZXMuSlNUX1NUUklORyxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5UXHJcbiAgICBdKVxyXG5cclxuICAvLyBpZ25vcmVkIHRoZSB0YWctcmVsYXRpdmUgdG9rZW5cclxuICBtYXAyID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVQgbm8gPCByZXN0cmljdFxyXG4gICAgcnVsZXMuRU5URVJfSlNUMixcclxuICAgIHJ1bGVzLlRFWFQsXHJcbiAgICAvLyBKU1RcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5ULFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfRVhQUl9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0lERU5ULFxyXG4gICAgcnVsZXMuSlNUX1NQQUNFLFxyXG4gICAgcnVsZXMuSlNUX0xFQVZFLFxyXG4gICAgcnVsZXMuSlNUX05VTUJFUixcclxuICAgIHJ1bGVzLkpTVF9QVU5DSE9SLFxyXG4gICAgcnVsZXMuSlNUX1NUUklORyxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5UXHJcbiAgICBdKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2VuTWFwKHJ1bGVzKXtcclxuICB2YXIgcnVsZSwgbWFwID0ge30sIHNpZ247XHJcbiAgZm9yKHZhciBpID0gMCwgbGVuID0gcnVsZXMubGVuZ3RoOyBpIDwgbGVuIDsgaSsrKXtcclxuICAgIHJ1bGUgPSBydWxlc1tpXTtcclxuICAgIHNpZ24gPSBydWxlWzJdIHx8ICdJTklUJztcclxuICAgICggbWFwW3NpZ25dIHx8IChtYXBbc2lnbl0gPSB7cnVsZXM6W10sIGxpbmtzOltdfSkgKS5ydWxlcy5wdXNoKHJ1bGUpO1xyXG4gIH1cclxuICByZXR1cm4gc2V0dXAobWFwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXAobWFwKXtcclxuICB2YXIgc3BsaXQsIHJ1bGVzLCB0cnVua3MsIGhhbmRsZXIsIHJlZywgcmV0YWluLCBydWxlO1xyXG4gIGZ1bmN0aW9uIHJlcGxhY2VGbihhbGwsIG9uZSl7XHJcbiAgICByZXR1cm4gdHlwZW9mIG1hY3JvW29uZV0gPT09ICdzdHJpbmcnPyBcclxuICAgICAgXy5lc2NhcGVSZWdFeHAobWFjcm9bb25lXSkgXHJcbiAgICAgIDogU3RyaW5nKG1hY3JvW29uZV0pLnNsaWNlKDEsLTEpO1xyXG4gIH1cclxuXHJcbiAgZm9yKHZhciBpIGluIG1hcCl7XHJcblxyXG4gICAgc3BsaXQgPSBtYXBbaV07XHJcbiAgICBzcGxpdC5jdXJJbmRleCA9IDE7XHJcbiAgICBydWxlcyA9IHNwbGl0LnJ1bGVzO1xyXG4gICAgdHJ1bmtzID0gW107XHJcblxyXG4gICAgZm9yKHZhciBqID0gMCxsZW4gPSBydWxlcy5sZW5ndGg7IGo8bGVuOyBqKyspe1xyXG4gICAgICBydWxlID0gcnVsZXNbal07IFxyXG4gICAgICByZWcgPSBydWxlWzBdO1xyXG4gICAgICBoYW5kbGVyID0gcnVsZVsxXTtcclxuXHJcbiAgICAgIGlmKHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgaGFuZGxlciA9IHdyYXBIYW5kZXIoaGFuZGxlcik7XHJcbiAgICAgIH1cclxuICAgICAgaWYoXy50eXBlT2YocmVnKSA9PT0gJ3JlZ2V4cCcpIHJlZyA9IHJlZy50b1N0cmluZygpLnNsaWNlKDEsIC0xKTtcclxuXHJcbiAgICAgIHJlZyA9IHJlZy5yZXBsYWNlKC9cXHsoXFx3KylcXH0vZywgcmVwbGFjZUZuKVxyXG4gICAgICByZXRhaW4gPSBfLmZpbmRTdWJDYXB0dXJlKHJlZykgKyAxOyBcclxuICAgICAgc3BsaXQubGlua3MucHVzaChbc3BsaXQuY3VySW5kZXgsIHJldGFpbiwgaGFuZGxlcl0pOyBcclxuICAgICAgc3BsaXQuY3VySW5kZXggKz0gcmV0YWluO1xyXG4gICAgICB0cnVua3MucHVzaChyZWcpO1xyXG4gICAgfVxyXG4gICAgc3BsaXQuVFJVTksgPSBuZXcgUmVnRXhwKFwiXig/OihcIiArIHRydW5rcy5qb2luKFwiKXwoXCIpICsgXCIpKVwiKVxyXG4gIH1cclxuICByZXR1cm4gbWFwO1xyXG59XHJcblxyXG52YXIgcnVsZXMgPSB7XHJcblxyXG4gIC8vIDEuIElOSVRcclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLy8gbW9kZTEncyBKU1QgRU5URVIgUlVMRVxyXG4gIEVOVEVSX0pTVDogWy9bXlxceDAwPF0qPyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIEVOVEVSX0pTVDI6IFsvW15cXHgwMF0qPyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgRU5URVJfVEFHOiBbL1teXFx4MDBdKj8oPz08W1xcd1xcL1xcIV0pLywgZnVuY3Rpb24oYWxsKXsgXHJcbiAgICB0aGlzLmVudGVyKCdUQUcnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIFRFWFQ6IFsvW15cXHgwMF0rLywgJ1RFWFQnIF0sXHJcblxyXG4gIC8vIDIuIFRBR1xyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgVEFHX05BTUU6IFsve05BTUV9LywgJ05BTUUnLCAnVEFHJ10sXHJcbiAgVEFHX1VOUV9WQUxVRTogWy9bXlxce30mXCInPT48YFxcclxcblxcZlxcdCBdKy8sICdVTlEnLCAnVEFHJ10sXHJcblxyXG4gIFRBR19PUEVOOiBbLzwoe05BTUV9KVxccyovLCBmdW5jdGlvbihhbGwsIG9uZSl7IC8vXCJcclxuICAgIHJldHVybiB7dHlwZTogJ1RBR19PUEVOJywgdmFsdWU6IG9uZX1cclxuICB9LCAnVEFHJ10sXHJcbiAgVEFHX0NMT1NFOiBbLzxcXC8oe05BTUV9KVtcXHJcXG5cXGZcXHQgXSo+LywgZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX0NMT1NFJywgdmFsdWU6IG9uZSB9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICAgIC8vIG1vZGUyJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBUQUdfRU5URVJfSlNUOiBbLyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gIH0sICdUQUcnXSxcclxuXHJcblxyXG4gIFRBR19QVU5DSE9SOiBbL1tcXD5cXC89Jl0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgaWYoYWxsID09PSAnPicpIHRoaXMubGVhdmUoKTtcclxuICAgIHJldHVybiB7dHlwZTogYWxsLCB2YWx1ZTogYWxsIH1cclxuICB9LCAnVEFHJ10sXHJcbiAgVEFHX1NUUklORzogIFsgLycoW14nXSopJ3xcIihbXlwiXSopXFxcIi8sIC8qJyovICBmdW5jdGlvbihhbGwsIG9uZSwgdHdvKXsgXHJcbiAgICB2YXIgdmFsdWUgPSBvbmUgfHwgdHdvIHx8IFwiXCI7XHJcblxyXG4gICAgcmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IHZhbHVlfVxyXG4gIH0sICdUQUcnXSxcclxuXHJcbiAgVEFHX1NQQUNFOiBbL3tTUEFDRX0rLywgbnVsbCwgJ1RBRyddLFxyXG4gIFRBR19DT01NRU5UOiBbLzxcXCEtLShbXlxceDAwXSo/KS0tXFw+LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMubGVhdmUoKVxyXG4gICAgLy8gdGhpcy5sZWF2ZSgnVEFHJylcclxuICB9ICwnVEFHJ10sXHJcblxyXG4gIC8vIDMuIEpTVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgSlNUX09QRU46IFsne0JFR0lOfSN7U1BBQ0V9Kih7SURFTlR9KScsIGZ1bmN0aW9uKGFsbCwgbmFtZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnT1BFTicsXHJcbiAgICAgIHZhbHVlOiBuYW1lXHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9MRUFWRTogWy97RU5EfS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZih0aGlzLm1hcmtFbmQgPT09IGFsbCAmJiB0aGlzLmV4cHJlc3Npb24pIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfTtcclxuICAgIGlmKCF0aGlzLm1hcmtFbmQgfHwgIXRoaXMubWFya3MgKXtcclxuICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5sZWF2ZSgnSlNUJyk7XHJcbiAgICAgIHJldHVybiB7dHlwZTogJ0VORCd9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5tYXJrcy0tO1xyXG4gICAgICByZXR1cm4ge3R5cGU6IHRoaXMubWFya0VuZCwgdmFsdWU6IHRoaXMubWFya0VuZH1cclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NMT1NFOiBbL3tCRUdJTn1cXHMqXFwvKHtJREVOVH0pXFxzKntFTkR9LywgZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgdGhpcy5sZWF2ZSgnSlNUJyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnQ0xPU0UnLFxyXG4gICAgICB2YWx1ZTogb25lXHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9DT01NRU5UOiBbL3tCRUdJTn1cXCEoW15cXHgwMF0qPylcXCF7RU5EfS8sIGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9FWFBSX09QRU46IFsne0JFR0lOfScsZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgaWYoYWxsID09PSB0aGlzLm1hcmtTdGFydCl7XHJcbiAgICAgIGlmKHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICBpZih0aGlzLmZpcnN0RW50ZXJTdGFydCB8fCB0aGlzLm1hcmtzKXtcclxuICAgICAgICB0aGlzLm1hcmtzKytcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6IHRoaXMubWFya1N0YXJ0LCB2YWx1ZTogdGhpcy5tYXJrU3RhcnQgfTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnRVhQUl9PUEVOJyxcclxuICAgICAgZXNjYXBlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0lERU5UOiBbJ3tJREVOVH0nLCAnSURFTlQnLCAnSlNUJ10sXHJcbiAgSlNUX1NQQUNFOiBbL1sgXFxyXFxuXFxmXSsvLCBudWxsLCAnSlNUJ10sXHJcbiAgSlNUX1BVTkNIT1I6IFsvWz0hXT89PXxbLT0+PCsqXFwvJVxcIV0/XFw9fFxcfFxcfHwmJnxcXEBcXCh8XFwuXFwufFs8XFw+XFxbXFxdXFwoXFwpXFwtXFx8XFx7fVxcK1xcKlxcLyU/OlxcLiEsXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4geyB0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sJ0pTVCddLFxyXG5cclxuICBKU1RfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcIi8sIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyAvL1wiJ1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IG9uZSB8fCB0d28gfHwgXCJcIn1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX05VTUJFUjogWy8oPzpbMC05XSpcXC5bMC05XSt8WzAtOV0rKShlXFxkKyk/LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7dHlwZTogJ05VTUJFUicsIHZhbHVlOiBwYXJzZUZsb2F0KGFsbCwgMTApfTtcclxuICB9LCAnSlNUJ11cclxufVxyXG5cclxuXHJcbi8vIHNldHVwIHdoZW4gZmlyc3QgY29uZmlnXHJcbkxleGVyLnNldHVwKCk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV4ZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9MZXhlci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoJy4vRG9jdW1lbnRGcmFnbWVudC5qcycpO1xyXG52YXIgRWxlbWVudCA9IHJlcXVpcmUoJy4vRWxlbWVudC5qcycpO1xyXG52YXIgVGV4dE5vZGUgPSByZXF1aXJlKCcuL1RleHROb2RlLmpzJyk7XHJcblxyXG52YXIgcHJvdG8gPSB7XHJcbiAgICBjcmVhdGVEb2N1bWVudEZyYWdtZW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgZG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhZ05hbWUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVUZXh0Tm9kZTogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBUZXh0Tm9kZSh0ZXh0KTtcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBkb2MgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9jO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRG9jdW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKCcuL0RvY3VtZW50RnJhZ21lbnQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIEVsZW1lbnQodGFnTmFtZSl7XHJcbiAgICB0aGlzLl90YWdOYW1lID0gdGFnTmFtZTtcclxuICAgIHRoaXMuX2F0dHJzID0gW107XHJcbiAgICB0aGlzLl9ldmVudHMgPSBbXTtcclxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGF0dHJOYW1lLCBhdHRyVmFsdWUpe1xyXG4gICAgdmFyIGV2ZW50UGF0dGVybiA9IC9vbi0vO1xyXG5cclxuICAgIGlmKGV2ZW50UGF0dGVybi50ZXN0KGF0dHJOYW1lKSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuX2F0dHJzLnB1c2goe25hbWU6IGF0dHJOYW1lLCB2YWx1ZTogYXR0clZhbHVlfSk7XHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnROYW1lLCBoYW5kbGVyLCBpc1BvcCwgYXJnQ29udGV4dCl7XHJcbiAgICB0aGlzLl9ldmVudHMucHVzaCh7bmFtZTogZXZlbnROYW1lLnJlcGxhY2UoLy0vLCAnJyksIHZhbHVlOiBoYW5kbGVyKycnLCBjb250ZXh0OiBhcmdDb250ZXh0fSk7XHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudEZyYWdtZW50KXtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPG5vZGUuX2NoaWxkcmVuLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKG5vZGUuX2NoaWxkcmVuW2ldKTsgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJmdW5jdGlvbiBUZXh0Tm9kZSh0ZXh0KXtcclxuICAgIHRoaXMuX3ZhbHVlID0gdGV4dDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBUZXh0Tm9kZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL1RleHROb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjUxOjUzIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTI1IDA3OjQxOjEyXHJcbiAqL1xyXG5mdW5jdGlvbiBNZXNzYWdlQnVzKCkge1xyXG4gICAgdGhpcy5fb25TZW5kV29ya2VyID0gW107XHJcbiAgICB0aGlzLl9iYXNlSWQgPSAwO1xyXG4gICAgdGhpcy5faW5pdFdvcmtlcigpO1xyXG4gICAgdGhpcy5fY3JlYXRlRXZlbnRzU3RvcmUoKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NyZWF0ZUV2ZW50c1N0b3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fZXZlbnRzU3RvcmUgPSB7fTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB2YXIgSW5mbyA9IHRoaXMuX2Rlc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5fcmVjZWl2ZUJ1c1Jlc29sdmVyKEluZm8pO1xyXG4gICAgdGhpcy5fZW1pdChJbmZvLmlkLCBJbmZvLnR5cGUsIEluZm8uZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVjZWl2ZUJ1c1Jlc29sdmVyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB0aGlzLl9idWZmZXIgPSBtZXNzYWdlO1xyXG4gICAgdGhpcy5fc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uIChldmVudFR5cGUsIGZuKSB7XHJcbiAgICB0aGlzLl9yZWdpc3RlcihldmVudFR5cGUsIGZuLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciB0eXBlID0gbWVzc2FnZS5kYXRhLnR5cGUsXHJcbiAgICAgICAgZGF0YSA9IG1lc3NhZ2UuZGF0YS5kYXRhLFxyXG4gICAgICAgIGlkID0gbWVzc2FnZS5kYXRhLmlkLFxyXG4gICAgICAgIG1hbWJhSUQgPSBtZXNzYWdlLmRhdGEubWFtYmFJRDtcclxuXHJcbiAgICByZXR1cm4geyBtYW1iYUlEOiBtYW1iYUlEICwgaWQ6IGlkLCB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH07XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3NlbmRJbmZvVG9Xb3JrZXIgPSBmdW5jdGlvbiAoSW5mbykge1xyXG4gICAgdmFyIF9vblNlbmRXb3JrZXIgPSB0aGlzLl9vblNlbmRXb3JrZXI7XHJcblxyXG4gICAgdGhpcy5fcG9zdE1lc3NhZ2UoSW5mbyk7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKF9vblNlbmRXb3JrZXIubGVuZ3RoKSB0aGlzLl9jaGVja1dhdGNoZXJzKF9vblNlbmRXb3JrZXIsIEluZm8pO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9jaGVja1dhdGNoZXJzID0gZnVuY3Rpb24gKHdhdGNoZXJzLCBJbmZvKSB7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IHdhdGNoZXJzLmxlbmd0aCAtIDEsIHdhdGNoZXI7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgd2F0Y2hlciA9IHdhdGNoZXJzW2ldO1xyXG4gICAgICAgIHdhdGNoZXIoSW5mbyk7XHJcbiAgICAgICAgd2F0Y2hlcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUub25TZW5kID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIucHVzaChmbik7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2J1ZmZlcjtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKG1lc3NhZ2UuaWQsIG1lc3NhZ2UudHlwZSwgZm4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3JlZ2lzdGVyID0gZnVuY3Rpb24gKGlkLCBldmVudE5hbWUsIGZuKSB7XHJcbiAgICB2YXIgX2V2ZW50c1N0b3JlID0gdGhpcy5fZXZlbnRzU3RvcmU7XHJcblxyXG4gICAgaWYoIV9ldmVudHNTdG9yZVtpZF0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXSA9IHt9O1xyXG5cclxuICAgIGlmIChfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdLndhdGNoZXJzLnB1c2goZm4pO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSA9IHsgd2F0Y2hlcnM6IFtmbl0gfTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9lbWl0ID0gZnVuY3Rpb24gKGlkLCBldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZiAoX2V2ZW50c1N0b3JlW2lkXSAmJiBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0gJiYgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdLndhdGNoZXJzLmxlbmd0aClcclxuICAgICAgICB0aGlzLl9leGVjdXRlV2F0Y2hlcnMoX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdLndhdGNoZXJzLCBldmVudE5hbWUsIGRhdGEpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2V4ZWN1dGVXYXRjaGVycyA9IGZ1bmN0aW9uICh3YXRjaGVycywgZXZlbnROYW1lLCBkYXRhKSB7XHJcbiAgICBmb3IgKHZhciBpID0gd2F0Y2hlcnMubGVuZ3RoIC0gMSwgd2F0Y2hlcjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlcihldmVudE5hbWUsIGRhdGEpO1xyXG4gICAgICAgIHdhdGNoZXJzLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUJ1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZXNzYWdlQnVzL01lc3NhZ2VCdXMuanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NDk6MDMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjUgMDc6NDE6NDNcclxuICovXHJcblxyXG52YXIgTWVzc2FnZUJ1cyA9IHJlcXVpcmUoJy4vbWVzc2FnZUJ1cy9Xb3JrZXJNc2dCdXMuanMnKTtcclxudmFyIFdLUmVuZGVyU3RvcmUgPSByZXF1aXJlKCcuL3N0b3JlL1dLUmVuZGVyU3RvcmUuanMnKTtcclxudmFyIERpZmZlciA9IHJlcXVpcmUoJy4vdmRvbS9EaWZmZXIuanMnKTtcclxuXHJcbnZhciBteU1lc3NhZ2VCdXMgPSBuZXcgTWVzc2FnZUJ1cygpO1xyXG5cclxuLyoqdi1kb21TdG9yZSAqL1xyXG52YXIgVmRvbVN0b3JlID0ge307XHJcblxyXG4vKirnirbmgIHmnprkuL4gKi9cclxudmFyIElOSVRJQUxfUkVOREVSID0gJ0lOSVRJQUxfUkVOREVSJztcclxudmFyIFVQREFURV9SRU5ERVIgPSAnVVBEQVRFX1JFTkRFUic7XHJcbnZhciBESUZGX0RFVEVDVCA9ICdESUZGX0RFVEVDVCc7XHJcblxyXG4vKipJTklUSUFMX1JFTkRFUiAqL1xyXG5teU1lc3NhZ2VCdXMuYnVpbGRSZWNlaXZlRGlzcGF0Y2hlcihJTklUSUFMX1JFTkRFUiwgZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB2YXIgZGF0YSA9IG1lc3NhZ2UuZGF0YSxcclxuICAgICAgICBtYW1iYUlEID0gbWVzc2FnZS5tYW1iYUlELFxyXG4gICAgICAgIHN0b3JlID0gbmV3IFdLUmVuZGVyU3RvcmUoZGF0YSk7XHJcblxyXG4gICAgc3RvcmUucmVuZGVyKCk7XHJcbiAgICBWZG9tU3RvcmVbbWFtYmFJRF0gPSBzdG9yZS52RG9tO1xyXG4gICAgLy9jb25zb2xlLmxvZygnV29ya2VyIOaUtuWIsCcsIElOSVRJQUxfUkVOREVSKTtcclxuICAgIC8vY29uc29sZS5sb2coc3RvcmUudkRvbSk7XHJcbn0pO1xyXG5cclxuLyoqVVBEQVRFX1JFTkRFUiAqL1xyXG5teU1lc3NhZ2VCdXMuYnVpbGRSZWNlaXZlRGlzcGF0Y2hlcihVUERBVEVfUkVOREVSLCBmdW5jdGlvbihtZXNzYWdlKXtcclxuICAgIHZhciBkYXRhID0gbWVzc2FnZS5kYXRhLFxyXG4gICAgICAgIG1hbWJhSUQgPSBtZXNzYWdlLm1hbWJhSUQsXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgV0tSZW5kZXJTdG9yZShkYXRhKTtcclxuXHJcbiAgICBzdG9yZS5yZW5kZXIoKTtcclxuICAgIC8vY29uc29sZS5sb2coJ1dvcmtlciDmlLbliLAnLCBVUERBVEVfUkVOREVSKTtcclxuICAgIFZkb21TdG9yZVttYW1iYUlEXSA9IHN0b3JlLnZEb207XHJcbn0pO1xyXG5cclxuLyoqRElGRl9ERVRFQ1QgKi9cclxubXlNZXNzYWdlQnVzLmJ1aWxkUmVjZWl2ZURpc3BhdGNoZXIoRElGRl9ERVRFQ1QsIGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdmFyIGRhdGEgPSBtZXNzYWdlLmRhdGEsXHJcbiAgICAgICAgbWFtYmFJRCA9IG1lc3NhZ2UubWFtYmFJRCxcclxuICAgICAgICBpZCA9IG1lc3NhZ2UuaWQsXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgV0tSZW5kZXJTdG9yZShkYXRhKTtcclxuXHJcbiAgICBzdG9yZS5yZW5kZXIoKTtcclxuICAgIC8vY29uc29sZS5sb2coJ1dvcmtlciDmlLbliLAnLCBESUZGX0RFVEVDVCk7XHJcbiAgICAvL2NvbnNvbGUubG9nKFZkb21TdG9yZVttYW1iYUlEXSwgc3RvcmUudkRvbSk7XHJcbiAgICB2YXIgZGlmZmVycyA9IERpZmZlcihWZG9tU3RvcmVbbWFtYmFJRF0sIHN0b3JlLnZEb20pO1xyXG4gICAgVmRvbVN0b3JlW21hbWJhSURdID0gc3RvcmUudkRvbTtcclxuICAgIHRoaXMucmVjZWl2ZSh7IHR5cGU6IERJRkZfREVURUNULCBkYXRhOiBkaWZmZXJzLCBpZDogaWQgfSk7XHJcbn0pO1xyXG4vKirmtojmga9Mb2cgKi9cclxubXlNZXNzYWdlQnVzLm9uU2VuZChmdW5jdGlvbigpe1xyXG4gICAgLy9jb25zb2xlLmxvZygnV29ya2VyIOW3suWPkemAge+8micsIG1lc3NhZ2UpO1xyXG59KTtcclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3drX2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo1MDoyNyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNSAwMDo0MzowMFxyXG4gKi9cclxudmFyIE1lc3NhZ2VCdXMgPSByZXF1aXJlKCcuL01lc3NhZ2VCdXMuanMnKTtcclxudmFyIEV4dGVuZCA9IHJlcXVpcmUoJy4uL3V0aWxzL2V4dGVuZC5qcycpO1xyXG5cclxuZnVuY3Rpb24gV29ya2VyTXNnQnVzKCl7XHJcbiAgICB0aGlzLnN1cGVyKCk7XHJcbiAgICB0aGlzLl9yZWNlaXZlQnVzRGlzcGF0Y2hlciA9IHt9O1xyXG59XHJcblxyXG5FeHRlbmQoV29ya2VyTXNnQnVzLCBNZXNzYWdlQnVzKTtcclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUuX2luaXRXb3JrZXIgPSBmdW5jdGlvbigpe1xyXG4gICAgLyplc2xpbnQtZGlzYWJsZSovXHJcbiAgICBvbm1lc3NhZ2UgPSB0aGlzLl9vbk1lc3NhZ2UuYmluZCh0aGlzKTtcclxufVxyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5fcG9zdE1lc3NhZ2UgPSBmdW5jdGlvbihJbmZvKXtcclxuICAgIC8qZXNsaW50LWRpc2FibGUqL1xyXG4gICAgcG9zdE1lc3NhZ2UoSW5mbyk7XHJcbn1cclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUuYnVpbGRSZWNlaXZlRGlzcGF0Y2hlciA9IGZ1bmN0aW9uKHR5cGUsIGZuKXtcclxuICAgIHZhciBkaXNwYXRjaGVyID0gdGhpcy5fcmVjZWl2ZUJ1c0Rpc3BhdGNoZXI7XHJcbiAgICBcclxuICAgIGRpc3BhdGNoZXJbdHlwZV0gPSBmbjtcclxufVxyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB0aGlzLl9zZW5kSW5mb1RvV29ya2VyKG1lc3NhZ2UpO1xyXG59O1xyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5fcmVjZWl2ZUJ1c1Jlc29sdmVyID0gZnVuY3Rpb24oSW5mbyl7XHJcbiAgICB2YXIgdHlwZSA9IEluZm8udHlwZSxcclxuICAgICAgICBkYXRhID0gSW5mby5kYXRhLFxyXG4gICAgICAgIG1hbWJhSUQgPSBJbmZvLm1hbWJhSUQsXHJcbiAgICAgICAgaWQgPSBJbmZvLmlkLFxyXG4gICAgICAgIGRpc3BhdGNoZXIgPSB0aGlzLl9yZWNlaXZlQnVzRGlzcGF0Y2hlcjtcclxuXHJcbiAgICBpZihkaXNwYXRjaGVyW3R5cGVdKXtcclxuICAgICAgICAvKipfdmRvbVN0b3JlICovXHJcbiAgICAgICAgZGlzcGF0Y2hlclt0eXBlXS5jYWxsKHRoaXMsIHtkYXRhOiBkYXRhLCBtYW1iYUlEOiBtYW1iYUlELCBpZDogaWR9KTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignd29ya2VyIE1lc3NnYWVCdXMgaGF2ZW5cXCd0IHJlZ2lzdGVyZWQgdHlwZTogJyt0eXBlKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLm9uUmVjZWl2ZU1lc3NhZ2UgPSBmdW5jdGlvbihmbil7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtlck1zZ0J1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZXNzYWdlQnVzL1dvcmtlck1zZ0J1cy5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NDg6NDQgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MjE6MjRcclxuICovXHJcblxyXG52YXIgQmFzZVJlbmRlclN0b3JlID0gcmVxdWlyZSgnLi9CYXNlUmVuZGVyU3RvcmUuanMnKTtcclxudmFyIEV4dGVuZCA9IHJlcXVpcmUoJy4uL3V0aWxzL2V4dGVuZC5qcycpO1xyXG52YXIgQ29tcGlsZXIgPSByZXF1aXJlKCcuLi9jb21waWxlci93b3JrZXJUaHJlYWQvY29tcGlsZXIuanMnKTtcclxuXHJcbnZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi4vdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJTdG9yZShvYmopIHtcclxuICAgIHRoaXMuc3VwZXIob2JqKTtcclxuICAgIHRoaXMuZXZlbnRzID0ge307XHJcbiAgICB0aGlzLm5vZGVJZCA9IDA7XHJcbn1cclxuXHJcbkV4dGVuZChSZW5kZXJTdG9yZSwgQmFzZVJlbmRlclN0b3JlKTtcclxuXHJcblJlbmRlclN0b3JlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9jb21waWxlciA9IENvbXBpbGVyO1xyXG4gICAgdGhpcy5fdHlwZWRGbGF0ZXIgPSBSZW5kZXJTdG9yZS50eXBlZEZsYXRlcjtcclxuICAgIHRoaXMudkRvbSA9IHRoaXMuX2NvbXBpbGUodGhpcy5BU1QsIHRoaXMuZGF0YSwgbnVsbCwgMCwgJycpO1xyXG5cclxufTtcclxuXHJcblJlbmRlclN0b3JlLnByb3RvdHlwZS5mbGF0VG9TdHJpbmcgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZmxhdFRvU3RyaW5nKG5vZGVbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuZmxhdE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIHRhZ05hbWUgPSBub2RlLl90YWdOYW1lLFxyXG4gICAgICAgIGF0dHJzID0gbm9kZS5fYXR0cnMsXHJcbiAgICAgICAgZXZlbnRzID0gbm9kZS5fZXZlbnRzLFxyXG4gICAgICAgIGNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW4sXHJcbiAgICAgICAgYm9keSA9ICcnLCBhdHRyU3RyID0gJycsIGV2ZW50U3RyID0gJycsXHJcbiAgICAgICAgbm9kZUlkID0gdGhpcy5ub2RlSWQ7XHJcblxyXG4gICAgLyoq5paH5pys6IqC54K55aSE55CGICovXHJcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5o+S5YWl5a2Q6IqC54K5ICovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9keSArPSB0aGlzLmZsYXROb2RlKGNoaWxkcmVuW2ldKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipmcmFnTWVudCAqL1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq55Sf5oiQ5bGe5oCn5a2X56ym5LiyICovXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgYXR0clN0ciArPSAoYXR0cnNbal0ubmFtZSArICc9XCInICsgYXR0cnNbal0udmFsdWUgKyAnXCIgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu25aSE55CGICovXHJcbiAgICBpZiAoZXZlbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGF0dHJTdHIgKz0gJ2RhdGEtbm9kZWlkPVwiJyArIG5vZGVJZCArICdcIic7XHJcbiAgICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCBldmVudHMubGVuZ3RoOyBoKyspIHtcclxuICAgICAgICAgICAgZXZlbnRzW2hdLnZhbHVlICs9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50c1tub2RlSWRdID0gZXZlbnRzO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlSWQrKztcclxuICAgIHJldHVybiAnPCcgKyB0YWdOYW1lICsgJyAnICsgYXR0clN0ciArIGV2ZW50U3RyICsgJz4nICsgYm9keSArICc8LycgKyB0YWdOYW1lICsgJz4nO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJTdG9yZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9XS1JlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNzoxMjozNiBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yNCAyMzo0MzoxOFxyXG4gKi9cclxudmFyIGF0dHJSZXNvbHZlciA9IHJlcXVpcmUoJy4vYXR0clJlc29sdmVyLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBlbGVtZW50KGFzdCwgY29udGV4dCwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGN1ckluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpe1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGFzdC50YWcpO1xyXG5cclxuICAgIHZhciBhdHRycyA9IGFzdC5hdHRycztcclxuICAgIC8qKuWkhOeQhuWxnuaApyAqL1xyXG4gICAgZm9yKHZhciBpPTA7aTxhdHRycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG5cclxuICAgICAgICBpZihhdHRyLm5hbWUgPT09ICdsaXN0JyAmJiBhdHRyLnZhbHVlKXtcclxuICAgICAgICAgICAgbm9kZS5fbGlzdE5hbWUgPSBhdHRyLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoKGF0dHIudHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ2F0dHJpYnV0ZSc6IFxyXG4gICAgICAgICAgICAgICAgYXR0clJlc29sdmVyKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKTsgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJvb3RQYXRoID0gcm9vdFBhdGgrJyAnK2N1ckluZGV4O1xyXG4gICAgLyoq5aSE55CG5a2Q6IqC54K5ICovXHJcbiAgICBpZihhc3QuY2hpbGRyZW4pe1xyXG5cclxuICAgICAgICBmb3IodmFyIGo9MCwgbmV4dEluZGV4PTA7ajxhc3QuY2hpbGRyZW4ubGVuZ3RoO2orKywgbmV4dEluZGV4Kyspe1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhc3QuY2hpbGRyZW5bal0sXHJcbiAgICAgICAgICAgICAgICBjaGlsZE5vZGUgPSBjb250ZXh0Ll9jb21waWxlKGNoaWxkLCBsaXN0SW5mbywgbnVsbCwgbmV4dEluZGV4LCByb290UGF0aCwgbm9kZS5fbGlzdE5hbWUgfHwgbGlzdE5hbWUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYoY2hpbGQudHlwZSA9PT0gJ2xpc3QnKXtcclxuICAgICAgICAgICAgICAgIG5leHRJbmRleCArPSAoY2hpbGROb2RlLl9sZW5ndGgtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoY2hpbGROb2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG5vZGUuX3BhdGggPSByb290UGF0aDtcclxuICAgIGlmKGxpc3ROYW1lKSBub2RlLl9saXN0TmFtZSA9IGxpc3ROYW1lO1xyXG4gICAgXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGV4dChhc3QsIGNvbnRleHQsIGxpc3RJbmZvLCBsaXN0QnVmZmVyLCBjdXJJbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKXtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXN0LnRleHQpO1xyXG5cclxuICAgIG5vZGUuX3BhdGggPSAocm9vdFBhdGgrJyAnK2N1ckluZGV4KTtcclxuICAgIGlmKGxpc3ROYW1lKSBub2RlLl9saXN0TmFtZSA9IGxpc3ROYW1lO1xyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBleHByZXNzaW9uKGFzdCwgY29udGV4dCwgbGlzdEluZm8sIGxpc3RCdWZmZXIsIGN1ckluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpe1xyXG4gICAgdmFyIHRleHQgPSAnJywgZ2V0VmFsdWU7XHJcbiAgICBcclxuICAgIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywgJ2QnLCAnZScsICdyZXR1cm4gKCcgKyBhc3QuYm9keSArICcpJyk7XHJcbiAgICB0ZXh0ID0gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyk7XHJcblxyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHJcbiAgICBub2RlLl9wYXRoID0gKHJvb3RQYXRoKycgJytjdXJJbmRleCk7XHJcbiAgICBpZihsaXN0TmFtZSkgbm9kZS5fbGlzdE5hbWUgPSBsaXN0TmFtZTtcclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdChhc3QsIGNvbnRleHQsIGxpc3RJbmZvLCBsaXN0QnVmZmVyLCBjdXJJbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKXtcclxuICAgIHZhciBsaXN0Qm9keSA9IGFzdC5ib2R5O1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3Quc2VxdWVuY2UuYm9keSsnKScpO1xyXG4gICAgdmFyIGFycmF5RGF0YSA9IGdldFZhbHVlKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgdmFyIHZhcmlhYmxlID0gYXN0LnZhcmlhYmxlO1xyXG5cclxuICAgIC8qKuiuoeeul+WIl+ihqOaAu+mVv+W6piAqL1xyXG4gICAgbm9kZS5fbGVuZ3RoID0gYXJyYXlEYXRhLmxlbmd0aCAqIGxpc3RCb2R5Lmxlbmd0aDtcclxuXHJcbiAgICBmb3IodmFyIGo9MDtqPGFycmF5RGF0YS5sZW5ndGg7aisrKXtcclxuICAgICAgICBub2RlLmFwcGVuZChpdGVtTm9kZShsaXN0Qm9keSwgYXJyYXlEYXRhW2pdLCBqLCByb290UGF0aCwgbGlzdE5hbWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpdGVtTm9kZShib2R5LCBpdGVtLCBpbmRleCwgcm9vdFBhdGgsIGxpc3ROYW1lKXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICB2YXIgbGlzdEluZm8gPSB7fTtcclxuXHJcbiAgICAgICAgbGlzdEluZm9bdmFyaWFibGVdID0gaXRlbTtcclxuICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZSsnX2luZGV4J10gPSBpbmRleDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGJvZHkubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIHZhciBpdGVtSW5kZXggPSBjdXJJbmRleCArIChqKmFycmF5RGF0YS5sZW5ndGgpICsgaTtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoY29udGV4dC5fY29tcGlsZShib2R5W2ldLCBsaXN0SW5mbywgbnVsbCwgaXRlbUluZGV4LCByb290UGF0aCwgbGlzdE5hbWUpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGxpc3ROYW1lKSBub2RlLl9saXN0TmFtZSA9IGxpc3ROYW1lO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgaWYobGlzdE5hbWUpIG5vZGUuX2xpc3ROYW1lID0gbGlzdE5hbWU7XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICdlbGVtZW50JzogZWxlbWVudCxcclxuICAgICd0ZXh0JzogdGV4dCxcclxuICAgICdleHByZXNzaW9uJzogZXhwcmVzc2lvbixcclxuICAgICdsaXN0JzogbGlzdFxyXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTc6MTQ6MzcgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MzQ6MTZcclxuICovXHJcblxyXG5mdW5jdGlvbiByZXNvbHZlQXR0cmlidXRlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgYXR0ci52YWx1ZTtcclxuXHJcbiAgICBzd2l0Y2godmFsdWVUeXBlKXtcclxuICAgICAgICBjYXNlICdzdHJpbmcnOiBcclxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnb2JqZWN0JzogXHJcbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgcmVzb2x2ZUF0dHJWYWx1ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbykpOyBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICdsaXN0LWNvbnRhaW5lcicpe1xyXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdsaXN0LWNvbnRhaW5lcicsIHRydWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciBpc0V2ZW50ID0gYXR0ci5uYW1lLnNsaWNlKDAsMikgPT09ICdvbic7XHJcblxyXG4gICAgaWYoaXNFdmVudCl7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zbGljZSgzKTtcclxuICAgICAgICBhdHRyLnZhbHVlLmJvZHkgPSBhdHRyLnZhbHVlLmJvZHkucmVwbGFjZSgvJ1xcJGV2ZW50Jy9nLCAnJGV2ZW50Jyk7XHJcbiAgICAgICAgdmFyIGdldEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiBmdW5jdGlvbigkZXZlbnQpe3JldHVybiAnK2F0dHIudmFsdWUuYm9keSsnO30nKTtcclxuXHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZ2V0SGFuZGxlcihjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKSwgZmFsc2UsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSk7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXR0ci52YWx1ZS5ib2R5KycpJyk7XHJcbiAgICAgICAgcmV0dXJuIGdldFZhbHVlKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlc29sdmVBdHRyaWJ1dGU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2F0dHJSZXNvbHZlci5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGRpZmYgPSByZXF1aXJlKCcuLi91dGlscy9kaWZmLmpzJyk7XHJcbnZhciBUZXh0Tm9kZSA9IHJlcXVpcmUoJy4vVGV4dE5vZGUuanMnKTtcclxuLy92YXIgQ09NUEFSRV9GSUVMRCA9IFsnX2F0dHJzJywgJ19ldmVudHMnLCAnX3RhZ05hbWUnXTtcclxudmFyIEFERCA9ICdBREQnO1xyXG52YXIgREVMRVRFID0gJ0RFTEVURSc7XHJcbnZhciBSRVBMQUNFID0gJ1JFUExBQ0UnO1xyXG5cclxuZnVuY3Rpb24gRGlmZmVyKHByZXZEb20sIGN1ckRvbSwgcmVzdWx0KXtcclxuICAgIGlmKHR5cGVvZiBwcmV2RG9tID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY3VyRG9tID09PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLyoq5re75Yqg5pON5L2cICovXHJcbiAgICBpZih0eXBlb2YgcHJldkRvbSA9PT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGN1ckRvbSA9PT0gJ29iamVjdCcpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHsgdHlwZTogQURELCBjdXJEb206IGN1ckRvbSwgcHJldkRvbTogcHJldkRvbSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5Yig6Zmk5pON5L2cICovXHJcbiAgICBpZih0eXBlb2YgY3VyRG9tID09PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgcHJldkRvbSA9PT0gJ29iamVjdCcpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKHsgdHlwZTogREVMRVRFLCBjdXJEb206IGN1ckRvbSwgcHJldkRvbTogcHJldkRvbSB9KTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5L+u5pS55pON5L2cICovXHJcbiAgICB2YXIgZGlmZkluZm8gPSB7IHR5cGU6IFJFUExBQ0UsIGN1ckRvbTogY3VyRG9tLCBwcmV2RG9tOiBwcmV2RG9tfTtcclxuXHJcbiAgICB2YXIgcHJldlRhZ05hbWUgPSBwcmV2RG9tLl90YWdOYW1lLFxyXG4gICAgICAgIGN1clRhZ05hbWUgPSBjdXJEb20uX3RhZ05hbWU7XHJcbiAgICBcclxuICAgIGlmKGRpZmYocHJldlRhZ05hbWUsIGN1clRhZ05hbWUpKXtcclxuICAgICAgICByZXN1bHQucHVzaChkaWZmSW5mbyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlRleHQgbm9kZSAqL1xyXG4gICAgaWYocHJldkRvbSBpbnN0YW5jZW9mIFRleHROb2RlKXtcclxuICAgICAgICBpZihwcmV2RG9tLl92YWx1ZSAhPT0gY3VyRG9tLl92YWx1ZSl7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRpZmZJbmZvKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirlsZ7mgKdkaWZmICovXHJcbiAgICB2YXIgcHJldkF0dHJzID0gcHJldkRvbS5fYXR0cnMsXHJcbiAgICAgICAgY3VyQXR0cnMgPSBjdXJEb20uX2F0dHJzO1xyXG5cclxuICAgIGlmKGRpZmYocHJldkF0dHJzLCBjdXJBdHRycykpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKGRpZmZJbmZvKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqY2hpbGRyZW4gZGlmZiAqL1xyXG4gICAgaWYocHJldkRvbS5fY2hpbGRyZW4gJiYgY3VyRG9tLl9jaGlsZHJlbil7XHJcbiAgICAgICAgdmFyIHByZXZDaGlsZHJlbiA9IHByZXZEb20uX2NoaWxkcmVuLFxyXG4gICAgICAgICAgICBjdXJDaGlsZHJlbiA9IGN1ckRvbS5fY2hpbGRyZW47XHJcblxyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8cHJldkNoaWxkcmVuLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICB2YXIgcHJldkNoaWxkID0gcHJldkNoaWxkcmVuW2ldLFxyXG4gICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZHJlbltpXTtcclxuIFxyXG4gICAgICAgICAgICBEaWZmZXIocHJldkNoaWxkLCBjdXJDaGlsZCwgcmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9ZWxzZSBpZigocHJldkRvbS5fY2hpbGRyZW4gJiYgIWN1ckRvbS5fY2hpbGRyZW4pIHx8ICghcHJldkRvbS5fY2hpbGRyZW4gJiYgY3VyRG9tLl9jaGlsZHJlbikpe1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKGRpZmZJbmZvKTtcclxuICAgIH1cclxuICAgIHJldHVybjtcclxufVxyXG5cclxuZnVuY3Rpb24gbWVyZ2VEaWZmKGRpZmZzKXtcclxuICAgIHZhciBsaXN0TWFwID0ge30sXHJcbiAgICAgICAgcmVzdWx0ID0gW107XHJcbiAgICBmb3IodmFyIGk9MDtpPGRpZmZzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIHZhciBsaXN0TmFtZSA9IGRpZmZzW2ldLnByZXZEb20uX2xpc3ROYW1lIHx8IGRpZmZzW2ldLmN1ckRvbS5fbGlzdE5hbWU7XHJcbiAgICAgICAgaWYobGlzdE5hbWUpe1xyXG4gICAgICAgICAgICBpZighbGlzdE1hcFtsaXN0TmFtZV0pe1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZGlmZnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgbGlzdE1hcFtsaXN0TmFtZV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGRpZmZzW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluRGlmZihwcmV2Um9vdCwgY3VyUm9vdCl7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICBEaWZmZXIocHJldlJvb3QuX2NoaWxkcmVuWzBdLCBjdXJSb290Ll9jaGlsZHJlblswXSwgcmVzdWx0KTtcclxuICAgIHJldHVybiBtZXJnZURpZmYocmVzdWx0KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluRGlmZjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RpZmZlci5qc1xuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuXHJcbmZ1bmN0aW9uIGRpZmYoaXRlbTEsIGl0ZW0yKXtcclxuICAgIGlmKCFpc1NhbWVUeXBlKGl0ZW0xLCBpdGVtMikpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgdmFyIGJvb2w7XHJcbiAgICBzd2l0Y2godHlwZU9mKGl0ZW0xKSl7XHJcbiAgICAgICAgY2FzZSAnQXJyYXknOiBcclxuICAgICAgICAgICAgYm9vbCA9IGRpZmZBcnJheShpdGVtMSwgaXRlbTIpOyBcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT2JqZWN0JzpcclxuICAgICAgICAgICAgYm9vbCA9IGRpZmZPYmooaXRlbTEsIGl0ZW0yKTsgXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJvb2wgPSBpdGVtMSAhPT0gaXRlbTI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJvb2w7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpZmZPYmoob2JqMSwgb2JqMil7XHJcbiAgICBpZihvYmoxPT09b2JqMil7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBrZXlzMSA9IE9iamVjdC5rZXlzKG9iajEpLFxyXG4gICAgICAgIGtleXMyID0gT2JqZWN0LmtleXMob2JqMik7XHJcblxyXG4gICAgLyoq5qOA5rWLa2V55pWw6YePICovXHJcbiAgICBpZihrZXlzMS5sZW5ndGggIT09IGtleXMyLmxlbmd0aCl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5qOA5rWLdmFsdWUgKi9cclxuICAgIGZvcih2YXIgaT0wO2k8a2V5czEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgdmFyIHZhbHVlMSA9IG9iajFba2V5czFbaV1dLFxyXG4gICAgICAgICAgICB2YWx1ZTIgPSBvYmoyW2tleXMxW2ldXTtcclxuXHJcbiAgICAgICAgaWYoIWlzU2FtZVR5cGUodmFsdWUxLCB2YWx1ZTIpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGJvb2w7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlT2YodmFsdWUxKSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ0FycmF5JzogXHJcbiAgICAgICAgICAgICAgICBib29sID0gZGlmZkFycmF5KHZhbHVlMSwgdmFsdWUyKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnT2JqZWN0JzpcclxuICAgICAgICAgICAgICAgIGJvb2wgPSBkaWZmT2JqKHZhbHVlMSwgdmFsdWUyKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJvb2wgPSB2YWx1ZTEgIT09IHZhbHVlMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYm9vbCkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpZmZBcnJheShhcnJheTEsIGFycmF5Mil7XHJcbiAgICBpZihhcnJheTEgPT09IGFycmF5Mil7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYoYXJyYXkxLmxlbmd0aCAhPT0gYXJyYXkyLmxlbmd0aCl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBmb3IodmFyIGk9MDtpPGFycmF5MS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZighaXNTYW1lVHlwZShhcnJheTFbaV0sIGFycmF5MltpXSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBib29sO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZU9mKGFycmF5MVtpXSkpe1xyXG4gICAgICAgICAgICBjYXNlICdBcnJheSc6IFxyXG4gICAgICAgICAgICAgICAgYm9vbCA9IGRpZmZBcnJheShhcnJheTFbaV0sIGFycmF5MltpXSk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ09iamVjdCc6XHJcbiAgICAgICAgICAgICAgICBib29sID0gZGlmZk9iaihhcnJheTFbaV0sIGFycmF5MltpXSk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgYm9vbCA9IGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihib29sKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU2FtZVR5cGUoaXRlbTEsIGl0ZW0yKXtcclxuICAgIHJldHVybiB0eXBlT2YoaXRlbTEpID09PSB0eXBlT2YoaXRlbTIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0eXBlT2YoaXRlbSl7XHJcbiAgICBcclxuICAgIGlmKHR5cGVvZiBpdGVtICE9PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXRlbSkuc2xpY2UoOCwgLTEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmY7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdXRpbHMvZGlmZi5qc1xuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==