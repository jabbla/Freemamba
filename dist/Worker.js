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
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
/* 1 */
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






/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(7).setImmediate))

/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports) {


module.exports = {
  'BEGIN': '{',
  'END': '}',
  'PRECOMPILE': false
}

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
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 15:05:01 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 21:10:42
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

BaseRenderStore.prototype._compile = function(ast, listInfo, listBuffer){
    if(ast instanceof Array){
        var node = document.createDocumentFragment();
        for(var i=0;i<ast.length;i++){
            node.append(this._compile(ast[i], listInfo, listBuffer));
        }
        return node;
    }else{
        return this._compiler[ast.type](ast, this, listInfo, listBuffer);
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

var _ = __webpack_require__(1);

var config = __webpack_require__(3);
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

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2), __webpack_require__(9)))

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

var _ = __webpack_require__(1);
var config = __webpack_require__(3);

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

var documentFragment = __webpack_require__(4);
var Element = __webpack_require__(15);

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
/* 15 */
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

Element.prototype.addEventListener = function(eventName, handler, isPop, argContext){
    this._events.push({name: eventName.replace(/-/, ''), value: handler, context: argContext});
};

Element.prototype.append = function(node){
    this._children.push(node);
};

module.exports = Element;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:51:53 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 17:07:21
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

MessageBus.prototype._serialize = function (message) {
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
        this._executeWatchers(_eventsStore[id][eventName].watchers, data);
};

MessageBus.prototype._executeWatchers = function (watchers, data) {
    for (var i = watchers.length - 1, watcher; i >= 0; i--) {
        watcher = watchers[i];
        watcher(data);
        watchers.splice(i, 1);
    }
};

module.exports = MessageBus;

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(26);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 12:54:49
 */

var MessageBus = __webpack_require__(27);
var WKRenderStore = __webpack_require__(28);
var Differ = __webpack_require__(32);

var myMessageBus = new MessageBus();

/**v-domStore */
var VdomStore = {};

/**状态枚举 */
var INITIAL_RENDER = 'INITIAL_RENDER';
var UPDATE_RENDER = 'UPDATE_RENDER';

/**INITIAL_RENDER */
myMessageBus.buildReceiveDispatcher(INITIAL_RENDER, function(data){
    var data = data.data,
        mambaID = data.mambaID,
        store = new WKRenderStore(data);
    store.render();
    VdomStore[mambaID] = store.vDom;
    //store.render();
    //this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
});

/**UPDATE_RENDER */
myMessageBus.buildReceiveDispatcher(UPDATE_RENDER, function(data){
    var data = data.data,
        mambaID = data.mambaID,
        store = new WKRenderStore(data);
    
    store.render();
    Diff(VdomStore[mambaID], store.vDom);
});



/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:27 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:11:05
 */
var MessageBus = __webpack_require__(16);
var Extend = __webpack_require__(0);

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

WorkerMsgBus.prototype._receiveBusResolver = function(Info){
    var type = Info.type,
        data = Info.data,
        mambaID = Info.mambaID,
        dispatcher = this._receiveBusDispatcher;

    if(dispatcher[type]){
        /**_vdomStore */
        dispatcher[type].call(this, {data: data, mambaID: mambaID});
    }else{
        throw new Error('worker MessgaeBus haven\'t registered type: '+type);
    }
    
}

WorkerMsgBus.prototype.onReceiveMessage = function(fn){

}

module.exports = WorkerMsgBus;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:44 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:21:24
 */

var BaseRenderStore = __webpack_require__(5);
var Extend = __webpack_require__(0);
var Compiler = __webpack_require__(29);

var documentFragment = __webpack_require__(4);

function RenderStore(obj) {
    this.super(obj);
    this.events = {};
    this.nodeId = 0;
}

Extend(RenderStore, BaseRenderStore);

RenderStore.prototype.render = function () {
    this._compiler = Compiler;
    this._typedFlater = RenderStore.typedFlater;
    this.vDom = this._compile(this.AST, this.data);
    this.renderedStr = this.flatToString(this.vDom._children);
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:34:07
 */
var attrResolver = __webpack_require__(30);

function element(ast, context, listInfo){
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs;
    /**处理属性 */
    for(var i=0;i<attrs.length;i++){
        var attr = attrs[i];
        
        switch(attr.type){
            case 'attribute': 
                attrResolver(attr, node, context, listInfo); break;
            default:
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
}

function text(ast){
    var node = document.createTextNode(ast.text);
    return node;
}

function expression(ast, context, listInfo){
    var text = '', getValue;
    
    getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
    text = getValue(context, listInfo || context.data, '');

    var node = document.createTextNode(text);

    return node;
}

function list(ast, context, listInfo){
    var listBody = ast.body;
    var node = document.createDocumentFragment();
    var getValue = new Function('c','d','e','return ('+ast.sequence.body+')');
    var arrayData = getValue(context, listInfo || context.data, '');
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
    return node;
}

module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list
};

/***/ }),
/* 30 */
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
/* 31 */,
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(33);

var COMPARE_FIELD = ['_attrs', '_events', '_tagName'];

function Differ(prevDom, curDom){
    /**属性diff */
    var prevAttrs = prevDom._attrs,
        curAttrs = curDom._attrs;
    if(diff(prevAttrs, curAttrs)) return { diff: true, target: prevDom, source: curDom, type: 'attribute' };

    /**events */
    var prevEvents = prevDom._events,
        curEvents = curDom._events;
    if(diff(prevAttrs, curAttrs)) return { diff: true, target: prevDom, source: curDom, type: 'events' };

}

var prevDom = {
    _attrs: [
        {name: 'class', value: 'wraper'}
    ],
};

var curDom = {
    _attrs: [
        {name: 'class', value: 'wraper1'}
    ]
};

console.log(Differ(prevDom, curDom));



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGNjYmNjNGQ0YzA3NTQ1NzQ3MDQiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvX3NldGltbWVkaWF0ZUAxLjAuNUBzZXRpbW1lZGlhdGUvc2V0SW1tZWRpYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy93a19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9Xb3JrZXJNc2dCdXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL1dLUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2F0dHJSZXNvbHZlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9EaWZmZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2RpZmYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0I7Ozs7Ozs0RENkQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUMsU0FBUztBQUMxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFF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QUNiLFdBQVc7QUFDWDtBQUNBLEM7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrQzs7Ozs7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGFBQWE7QUFDakM7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUM7Ozs7OztBQ25FQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsT0FBTztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixNQUFNLFVBQVUsV0FBVyxNQUFNLE9BQU8sYUFBYTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxVQUFVO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixxRUFBcUUsS0FBSztBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQsT0FBTztBQUNQLGtCQUFrQjtBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDOztBQUV4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDBDQUEwQyxzQkFBc0IsRUFBRTtBQUNsRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7O0FBRUEsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7QUN6TEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsVUFBVTs7Ozs7OztBQ3ZMdEM7QUFDQTtBQUNBLGNBQWM7O0FBRWQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxTQUFTO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7Ozs7Ozs7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FBSUEsMkI7Ozs7OztBQ25RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LHNCIiwiZmlsZSI6Ildvcmtlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDI1KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwY2NiY2M0ZDRjMDc1NDU3NDcwNCIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE0OjU0OjMzIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTE5IDE0OjU5OjQwXHJcbiAqL1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKGNoaWxkQ2xhc3MsIGJhc2VDbGFzcyl7XHJcbiAgICB2YXIgZm4gPSBmdW5jdGlvbigpe307XHJcbiAgICBmbi5wcm90b3R5cGUgPSBiYXNlQ2xhc3MucHJvdG90eXBlO1xyXG4gICAgY2hpbGRDbGFzcy5wcm90b3R5cGUgPSBuZXcgZm4oKTtcclxuICAgIGNoaWxkQ2xhc3MucHJvdG90eXBlLnN1cGVyID0gYmFzZUNsYXNzO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91dGlscy9leHRlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJyZXF1aXJlKCcuL2hlbHBlci9zaGltLmpzJykoKTtcclxuXHJcblxyXG5cclxudmFyIF8gID0gbW9kdWxlLmV4cG9ydHM7XHJcbnZhciBlbnRpdGllcyA9IHJlcXVpcmUoJy4vaGVscGVyL2VudGl0aWVzLmpzJyk7XHJcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xyXG52YXIgbzJzdHIgPSAoe30pLnRvU3RyaW5nO1xyXG52YXIgd2luID0gdHlwZW9mIHdpbmRvdyAhPT0ndW5kZWZpbmVkJz8gd2luZG93OiBnbG9iYWw7XHJcbnZhciBNQVhfUFJJT1JJVFkgPSA5OTk5O1xyXG5cclxuXHJcbl8ubm9vcCA9IGZ1bmN0aW9uKCl7fTtcclxuXy51aWQgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgX3VpZD0wO1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIF91aWQrKztcclxuICB9XHJcbn0pKCk7XHJcblxyXG5fLmV4dGVuZCA9IGZ1bmN0aW9uKCBvMSwgbzIsIG92ZXJyaWRlICl7XHJcbiAgZm9yKHZhciBpIGluIG8yKSBpZiAobzIuaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgaWYoIG8xW2ldID09PSB1bmRlZmluZWQgfHwgb3ZlcnJpZGUgPT09IHRydWUgKXtcclxuICAgICAgbzFbaV0gPSBvMltpXVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbzE7XHJcbn1cclxuXHJcbl8ua2V5cyA9IE9iamVjdC5rZXlzPyBPYmplY3Qua2V5czogZnVuY3Rpb24ob2JqKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yKHZhciBpIGluIG9iaikgaWYob2JqLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgIHJlcy5wdXNoKGkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5fLnNvbWUgPSBmdW5jdGlvbihsaXN0LCBmbil7XHJcbiAgZm9yKHZhciBpID0wLGxlbiA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgaWYoZm4obGlzdFtpXSkpIHJldHVybiB0cnVlXHJcbiAgfVxyXG59XHJcblxyXG5fLnZhck5hbWUgPSAnZCc7XHJcbl8uc2V0TmFtZSA9ICdwXyc7XHJcbl8uY3R4TmFtZSA9ICdjJztcclxuXy5leHROYW1lID0gJ2UnO1xyXG5cclxuXy5yV29yZCA9IC9eW1xcJFxcd10rJC87XHJcbl8uclNpbXBsZUFjY2Vzc29yID0gL15bXFwkXFx3XSsoXFwuW1xcJFxcd10rKSokLztcclxuXHJcbl8ubmV4dFRpY2sgPSB0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSAnZnVuY3Rpb24nPyBcclxuICBzZXRJbW1lZGlhdGUuYmluZCh3aW4pIDogXHJcbiAgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApIFxyXG4gIH1cclxuXHJcblxyXG5cclxuXy5wcmVmaXggPSBcIid1c2Ugc3RyaWN0Jzt2YXIgXCIgKyBfLnZhck5hbWUgKyBcIj1cIiArIF8uY3R4TmFtZSArIFwiLmRhdGE7XCIgKyAgXy5leHROYW1lICArIFwiPVwiICsgXy5leHROYW1lICsgXCJ8fCcnO1wiO1xyXG5cclxuXHJcbl8uc2xpY2UgPSBmdW5jdGlvbihvYmosIHN0YXJ0LCBlbmQpe1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IodmFyIGkgPSBzdGFydCB8fCAwLCBsZW4gPSBlbmQgfHwgb2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgIHJlcy5wdXNoKG9ialtpXSlcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLy8gYmVhY3VzZSBzbGljZSBhbmQgdG9Mb3dlckNhc2UgaXMgZXhwZW5zaXZlLiB3ZSBoYW5kbGUgdW5kZWZpbmVkIGFuZCBudWxsIGluIGFub3RoZXIgd2F5XHJcbl8udHlwZU9mID0gZnVuY3Rpb24gKG8pIHtcclxuICByZXR1cm4gbyA9PSBudWxsID8gU3RyaW5nKG8pIDpvMnN0ci5jYWxsKG8pLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5fLm1ha2VQcmVkaWNhdGUgPSBmdW5jdGlvbiBtYWtlUHJlZGljYXRlKHdvcmRzLCBwcmVmaXgpIHtcclxuICAgIGlmICh0eXBlb2Ygd29yZHMgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICB3b3JkcyA9IHdvcmRzLnNwbGl0KFwiIFwiKTtcclxuICAgIH1cclxuICAgIHZhciBmID0gXCJcIixcclxuICAgIGNhdHMgPSBbXTtcclxuICAgIG91dDogZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2F0cy5sZW5ndGg7ICsrail7XHJcbiAgICAgICAgICBpZiAoY2F0c1tqXVswXS5sZW5ndGggPT09IHdvcmRzW2ldLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGNhdHNbal0ucHVzaCh3b3Jkc1tpXSk7XHJcbiAgICAgICAgICAgICAgY29udGludWUgb3V0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRzLnB1c2goW3dvcmRzW2ldXSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjb21wYXJlVG8oYXJyKSB7XHJcbiAgICAgICAgaWYgKGFyci5sZW5ndGggPT09IDEpIHJldHVybiBmICs9IFwicmV0dXJuIHN0ciA9PT0gJ1wiICsgYXJyWzBdICsgXCInO1wiO1xyXG4gICAgICAgIGYgKz0gXCJzd2l0Y2goc3RyKXtcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyci5sZW5ndGg7ICsraSl7XHJcbiAgICAgICAgICAgZiArPSBcImNhc2UgJ1wiICsgYXJyW2ldICsgXCInOlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmICs9IFwicmV0dXJuIHRydWV9cmV0dXJuIGZhbHNlO1wiO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFdoZW4gdGhlcmUgYXJlIG1vcmUgdGhhbiB0aHJlZSBsZW5ndGggY2F0ZWdvcmllcywgYW4gb3V0ZXJcclxuICAgIC8vIHN3aXRjaCBmaXJzdCBkaXNwYXRjaGVzIG9uIHRoZSBsZW5ndGhzLCB0byBzYXZlIG9uIGNvbXBhcmlzb25zLlxyXG4gICAgaWYgKGNhdHMubGVuZ3RoID4gMykge1xyXG4gICAgICAgIGNhdHMuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiLmxlbmd0aCAtIGEubGVuZ3RoO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGYgKz0gXCJzd2l0Y2goc3RyLmxlbmd0aCl7XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHZhciBjYXQgPSBjYXRzW2ldO1xyXG4gICAgICAgICAgICBmICs9IFwiY2FzZSBcIiArIGNhdFswXS5sZW5ndGggKyBcIjpcIjtcclxuICAgICAgICAgICAgY29tcGFyZVRvKGNhdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgKz0gXCJ9XCI7XHJcblxyXG4gICAgICAgIC8vIE90aGVyd2lzZSwgc2ltcGx5IGdlbmVyYXRlIGEgZmxhdCBgc3dpdGNoYCBzdGF0ZW1lbnQuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbXBhcmVUbyh3b3Jkcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwic3RyXCIsIGYpO1xyXG59XHJcblxyXG5cclxuXy50cmFja0Vycm9yUG9zID0gKGZ1bmN0aW9uICgpe1xyXG4gIC8vIGxpbmVicmVha1xyXG4gIHZhciBsYiA9IC9cXHJcXG58W1xcblxcclxcdTIwMjhcXHUyMDI5XS9nO1xyXG4gIHZhciBtaW5SYW5nZSA9IDIwLCBtYXhSYW5nZSA9IDIwO1xyXG4gIGZ1bmN0aW9uIGZpbmRMaW5lKGxpbmVzLCBwb3Mpe1xyXG4gICAgdmFyIHRtcExlbiA9IDA7XHJcbiAgICBmb3IodmFyIGkgPSAwLGxlbiA9IGxpbmVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgICAgdmFyIGxpbmVMZW4gPSAobGluZXNbaV0gfHwgXCJcIikubGVuZ3RoO1xyXG5cclxuICAgICAgaWYodG1wTGVuICsgbGluZUxlbiA+IHBvcykge1xyXG4gICAgICAgIHJldHVybiB7bnVtOiBpLCBsaW5lOiBsaW5lc1tpXSwgc3RhcnQ6IHBvcyAtIGkgLSB0bXBMZW4gLCBwcmV2OmxpbmVzW2ktMV0sIG5leHQ6IGxpbmVzW2krMV0gfTtcclxuICAgICAgfVxyXG4gICAgICAvLyAxIGlzIGZvciB0aGUgbGluZWJyZWFrXHJcbiAgICAgIHRtcExlbiA9IHRtcExlbiArIGxpbmVMZW4gO1xyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBmb3JtYXRMaW5lKHN0ciwgIHN0YXJ0LCBudW0sIHRhcmdldCl7XHJcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aDtcclxuICAgIHZhciBtaW4gPSBzdGFydCAtIG1pblJhbmdlO1xyXG4gICAgaWYobWluIDwgMCkgbWluID0gMDtcclxuICAgIHZhciBtYXggPSBzdGFydCArIG1heFJhbmdlO1xyXG4gICAgaWYobWF4ID4gbGVuKSBtYXggPSBsZW47XHJcblxyXG4gICAgdmFyIHJlbWFpbiA9IHN0ci5zbGljZShtaW4sIG1heCk7XHJcbiAgICB2YXIgcHJlZml4ID0gXCJbXCIgKyhudW0rMSkgKyBcIl0gXCIgKyAobWluID4gMD8gXCIuLlwiIDogXCJcIilcclxuICAgIHZhciBwb3N0Zml4ID0gbWF4IDwgbGVuID8gXCIuLlwiOiBcIlwiO1xyXG4gICAgdmFyIHJlcyA9IHByZWZpeCArIHJlbWFpbiArIHBvc3RmaXg7XHJcbiAgICBpZih0YXJnZXQpIHJlcyArPSBcIlxcblwiICsgbmV3IEFycmF5KHN0YXJ0LW1pbiArIHByZWZpeC5sZW5ndGggKyAxKS5qb2luKFwiIFwiKSArIFwiXl5eXCI7XHJcbiAgICByZXR1cm4gcmVzO1xyXG4gIH1cclxuICByZXR1cm4gZnVuY3Rpb24oaW5wdXQsIHBvcyl7XHJcbiAgICBpZihwb3MgPiBpbnB1dC5sZW5ndGgtMSkgcG9zID0gaW5wdXQubGVuZ3RoLTE7XHJcbiAgICBsYi5sYXN0SW5kZXggPSAwO1xyXG4gICAgdmFyIGxpbmVzID0gaW5wdXQuc3BsaXQobGIpO1xyXG4gICAgdmFyIGxpbmUgPSBmaW5kTGluZShsaW5lcyxwb3MpO1xyXG4gICAgdmFyIHN0YXJ0ID0gbGluZS5zdGFydCwgbnVtID0gbGluZS5udW07XHJcblxyXG4gICAgcmV0dXJuIChsaW5lLnByZXY/IGZvcm1hdExpbmUobGluZS5wcmV2LCBzdGFydCwgbnVtLTEgKSArICdcXG4nOiAnJyApICsgXHJcbiAgICAgIGZvcm1hdExpbmUobGluZS5saW5lLCBzdGFydCwgbnVtLCB0cnVlKSArICdcXG4nICsgXHJcbiAgICAgIChsaW5lLm5leHQ/IGZvcm1hdExpbmUobGluZS5uZXh0LCBzdGFydCwgbnVtKzEgKSArICdcXG4nOiAnJyApO1xyXG5cclxuICB9XHJcbn0pKCk7XHJcblxyXG5cclxudmFyIGlnbm9yZWRSZWYgPSAvXFwoKFxcP1xcIXxcXD9cXDp8XFw/XFw9KS9nO1xyXG5fLmZpbmRTdWJDYXB0dXJlID0gZnVuY3Rpb24gKHJlZ1N0cikge1xyXG4gIHZhciBsZWZ0ID0gMCxcclxuICAgIHJpZ2h0ID0gMCxcclxuICAgIGxlbiA9IHJlZ1N0ci5sZW5ndGgsXHJcbiAgICBpZ25vcmVkID0gcmVnU3RyLm1hdGNoKGlnbm9yZWRSZWYpOyAvLyBpZ25vcmVkIHVuY2FwdHVyZVxyXG4gIGlmKGlnbm9yZWQpIGlnbm9yZWQgPSBpZ25vcmVkLmxlbmd0aFxyXG4gIGVsc2UgaWdub3JlZCA9IDA7XHJcbiAgZm9yICg7IGxlbi0tOykge1xyXG4gICAgdmFyIGxldHRlciA9IHJlZ1N0ci5jaGFyQXQobGVuKTtcclxuICAgIGlmIChsZW4gPT09IDAgfHwgcmVnU3RyLmNoYXJBdChsZW4gLSAxKSAhPT0gXCJcXFxcXCIgKSB7IFxyXG4gICAgICBpZiAobGV0dGVyID09PSBcIihcIikgbGVmdCsrO1xyXG4gICAgICBpZiAobGV0dGVyID09PSBcIilcIikgcmlnaHQrKztcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGxlZnQgIT09IHJpZ2h0KSB0aHJvdyBcIlJlZ0V4cDogXCIrIHJlZ1N0ciArIFwiJ3MgYnJhY2tldCBpcyBub3QgbWFyY2hlZFwiO1xyXG4gIGVsc2UgcmV0dXJuIGxlZnQgLSBpZ25vcmVkO1xyXG59O1xyXG5cclxuXHJcbl8uZXNjYXBlUmVnRXhwID0gZnVuY3Rpb24oIHN0cil7Ly8gQ3JlZGl0OiBYUmVnRXhwIDAuNi4xIChjKSAyMDA3LTIwMDggU3RldmVuIExldml0aGFuIDxodHRwOi8vc3RldmVubGV2aXRoYW4uY29tL3JlZ2V4L3hyZWdleHAvPiBNSVQgTGljZW5zZVxyXG4gIHJldHVybiBzdHIucmVwbGFjZSgvWy1bXFxde30oKSorPy5cXFxcXiR8LCNcXHNdL2csIGZ1bmN0aW9uKG1hdGNoKXtcclxuICAgIHJldHVybiAnXFxcXCcgKyBtYXRjaDtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG52YXIgckVudGl0eSA9IG5ldyBSZWdFeHAoXCImKD86KCN4WzAtOWEtZkEtRl0rKXwoI1swLTldKyl8KFwiICsgXy5rZXlzKGVudGl0aWVzKS5qb2luKCd8JykgKyAnKSk7JywgJ2dpJyk7XHJcblxyXG5fLmNvbnZlcnRFbnRpdHkgPSBmdW5jdGlvbihjaHIpe1xyXG5cclxuICByZXR1cm4gKFwiXCIgKyBjaHIpLnJlcGxhY2UockVudGl0eSwgZnVuY3Rpb24oYWxsLCBoZXgsIGRlYywgY2FwdHVyZSl7XHJcbiAgICB2YXIgY2hhckNvZGU7XHJcbiAgICBpZiggZGVjICkgY2hhckNvZGUgPSBwYXJzZUludCggZGVjLnNsaWNlKDEpLCAxMCApO1xyXG4gICAgZWxzZSBpZiggaGV4ICkgY2hhckNvZGUgPSBwYXJzZUludCggaGV4LnNsaWNlKDIpLCAxNiApO1xyXG4gICAgZWxzZSBjaGFyQ29kZSA9IGVudGl0aWVzW2NhcHR1cmVdXHJcblxyXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoIGNoYXJDb2RlIClcclxuICB9KTtcclxuXHJcbn1cclxuXHJcblxyXG4vLyBzaW1wbGUgZ2V0IGFjY2Vzc29yXHJcblxyXG5fLmNyZWF0ZU9iamVjdCA9IE9iamVjdC5jcmVhdGU/IGZ1bmN0aW9uKG8pe1xyXG4gIHJldHVybiBPYmplY3QuY3JlYXRlKG8gfHwgbnVsbClcclxufTogKGZ1bmN0aW9uKCl7XHJcbiAgICBmdW5jdGlvbiBUZW1wKCkge31cclxuICAgIHJldHVybiBmdW5jdGlvbihvKXtcclxuICAgICAgaWYoIW8pIHJldHVybiB7fVxyXG4gICAgICBUZW1wLnByb3RvdHlwZSA9IG87XHJcbiAgICAgIHZhciBvYmogPSBuZXcgVGVtcCgpO1xyXG4gICAgICBUZW1wLnByb3RvdHlwZSA9IG51bGw7IC8vIOS4jeimgeS/neaMgeS4gOS4qiBPIOeahOadguaVo+W8leeUqO+8iGEgc3RyYXkgcmVmZXJlbmNl77yJLi4uXHJcbiAgICAgIHJldHVybiBvYmpcclxuICAgIH1cclxufSkoKTtcclxuXHJcbl8uY3JlYXRlUHJvdG8gPSBmdW5jdGlvbihmbiwgbyl7XHJcbiAgICBmdW5jdGlvbiBGb28oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBmbjt9XHJcbiAgICBGb28ucHJvdG90eXBlID0gbztcclxuICAgIHJldHVybiAoZm4ucHJvdG90eXBlID0gbmV3IEZvbygpKTtcclxufVxyXG5cclxuXHJcbl8ucmVtb3ZlT25lID0gZnVuY3Rpb24obGlzdCAsIGZpbHRlcil7XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIGZvcig7bGVuLS07KXtcclxuICAgIGlmKGZpbHRlcihsaXN0W2xlbl0pKSB7XHJcbiAgICAgIGxpc3Quc3BsaWNlKGxlbiwgMSlcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8qKlxyXG5jbG9uZVxyXG4qL1xyXG5fLmNsb25lID0gZnVuY3Rpb24gY2xvbmUob2JqKXtcclxuICBpZighb2JqIHx8ICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyApKSByZXR1cm4gb2JqO1xyXG4gIGlmKEFycmF5LmlzQXJyYXkob2JqKSl7XHJcbiAgICB2YXIgY2xvbmVkID0gW107XHJcbiAgICBmb3IodmFyIGk9MCxsZW4gPSBvYmoubGVuZ3RoOyBpPCBsZW47aSsrKXtcclxuICAgICAgY2xvbmVkW2ldID0gb2JqW2ldXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG4gIH1lbHNle1xyXG4gICAgdmFyIGNsb25lZCA9IHt9O1xyXG4gICAgZm9yKHZhciBpIGluIG9iaikgaWYob2JqLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgY2xvbmVkW2ldID0gb2JqW2ldO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lZDtcclxuICB9XHJcbn1cclxuXHJcbl8uZXF1YWxzID0gZnVuY3Rpb24obm93LCBvbGQpe1xyXG4gIHZhciB0eXBlID0gdHlwZW9mIG5vdztcclxuICBpZih0eXBlID09PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb2xkID09PSAnbnVtYmVyJyYmIGlzTmFOKG5vdykgJiYgaXNOYU4ob2xkKSkgcmV0dXJuIHRydWVcclxuICByZXR1cm4gbm93ID09PSBvbGQ7XHJcbn1cclxuXHJcbnZhciBkYXNoID0gLy0oW2Etel0pL2c7XHJcbl8uY2FtZWxDYXNlID0gZnVuY3Rpb24oc3RyKXtcclxuICByZXR1cm4gc3RyLnJlcGxhY2UoZGFzaCwgZnVuY3Rpb24oYWxsLCBjYXB0dXJlKXtcclxuICAgIHJldHVybiBjYXB0dXJlLnRvVXBwZXJDYXNlKCk7XHJcbiAgfSlcclxufVxyXG5cclxuXHJcblxyXG5fLnRocm90dGxlID0gZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCl7XHJcbiAgdmFyIHdhaXQgPSB3YWl0IHx8IDEwMDtcclxuICB2YXIgY29udGV4dCwgYXJncywgcmVzdWx0O1xyXG4gIHZhciB0aW1lb3V0ID0gbnVsbDtcclxuICB2YXIgcHJldmlvdXMgPSAwO1xyXG4gIHZhciBsYXRlciA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcHJldmlvdXMgPSArbmV3IERhdGU7XHJcbiAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XHJcbiAgfTtcclxuICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgbm93ID0gKyBuZXcgRGF0ZTtcclxuICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcclxuICAgIGNvbnRleHQgPSB0aGlzO1xyXG4gICAgYXJncyA9IGFyZ3VtZW50cztcclxuICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgdGltZW91dCA9IG51bGw7XHJcbiAgICAgIHByZXZpb3VzID0gbm93O1xyXG4gICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICBjb250ZXh0ID0gYXJncyA9IG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKCF0aW1lb3V0KSB7XHJcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG59O1xyXG5cclxuLy8gaG9nYW4gZXNjYXBlXHJcbi8vID09PT09PT09PT09PT09XHJcbl8uZXNjYXBlID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHJBbXAgPSAvJi9nLFxyXG4gICAgICByTHQgPSAvPC9nLFxyXG4gICAgICByR3QgPSAvPi9nLFxyXG4gICAgICByQXBvcyA9IC9cXCcvZyxcclxuICAgICAgclF1b3QgPSAvXFxcIi9nLFxyXG4gICAgICBoQ2hhcnMgPSAvWyY8PlxcXCJcXCddLztcclxuXHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xyXG4gICAgcmV0dXJuIGhDaGFycy50ZXN0KHN0cikgP1xyXG4gICAgICBzdHJcclxuICAgICAgICAucmVwbGFjZShyQW1wLCAnJmFtcDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJMdCwgJyZsdDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJHdCwgJyZndDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJBcG9zLCAnJiMzOTsnKVxyXG4gICAgICAgIC5yZXBsYWNlKHJRdW90LCAnJnF1b3Q7JykgOlxyXG4gICAgICBzdHI7XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXy5jYWNoZSA9IGZ1bmN0aW9uKG1heCl7XHJcbiAgbWF4ID0gbWF4IHx8IDEwMDA7XHJcbiAgdmFyIGtleXMgPSBbXSxcclxuICAgICAgY2FjaGUgPSB7fTtcclxuICByZXR1cm4ge1xyXG4gICAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgIGlmIChrZXlzLmxlbmd0aCA+IHRoaXMubWF4KSB7XHJcbiAgICAgICAgY2FjaGVba2V5cy5zaGlmdCgpXSA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICAvLyBcclxuICAgICAgaWYoY2FjaGVba2V5XSA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBrZXlzLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgICBjYWNoZVtrZXldID0gdmFsdWU7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH0sXHJcbiAgICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xyXG4gICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHJldHVybiBjYWNoZTtcclxuICAgICAgcmV0dXJuIGNhY2hlW2tleV07XHJcbiAgICB9LFxyXG4gICAgbWF4OiBtYXgsXHJcbiAgICBsZW46ZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIGtleXMubGVuZ3RoO1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxuXHJcbi8vIC8vIHNldHVwIHRoZSByYXcgRXhwcmVzc2lvblxyXG5cclxuXHJcbi8vIGhhbmRsZSB0aGUgc2FtZSBsb2dpYyBvbiBjb21wb25lbnQncyBgb24tKmAgYW5kIGVsZW1lbnQncyBgb24tKmBcclxuLy8gcmV0dXJuIHRoZSBmaXJlIG9iamVjdFxyXG5fLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24odmFsdWUsIHR5cGUgKXtcclxuICB2YXIgc2VsZiA9IHRoaXMsIGV2YWx1YXRlO1xyXG4gIGlmKHZhbHVlLnR5cGUgPT09ICdleHByZXNzaW9uJyl7IC8vIGlmIGlzIGV4cHJlc3Npb24sIGdvIGV2YWx1YXRlZCB3YXlcclxuICAgIGV2YWx1YXRlID0gdmFsdWUuZ2V0O1xyXG4gIH1cclxuICBpZihldmFsdWF0ZSl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gZmlyZShvYmope1xyXG4gICAgICBzZWxmLiR1cGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgICAgICBkYXRhLiRldmVudCA9IG9iajtcclxuICAgICAgICB2YXIgcmVzID0gZXZhbHVhdGUoc2VsZik7XHJcbiAgICAgICAgaWYocmVzID09PSBmYWxzZSAmJiBvYmogJiYgb2JqLnByZXZlbnREZWZhdWx0KSBvYmoucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBkYXRhLiRldmVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gZmlyZSgpe1xyXG4gICAgICB2YXIgYXJncyA9IF8uc2xpY2UoYXJndW1lbnRzKTtcclxuICAgICAgYXJncy51bnNoaWZ0KHZhbHVlKTtcclxuICAgICAgc2VsZi4kdXBkYXRlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgc2VsZi4kZW1pdC5hcHBseShzZWxmLCBhcmdzKTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vIG9ubHkgY2FsbCBvbmNlXHJcbl8ub25jZSA9IGZ1bmN0aW9uKGZuKXtcclxuICB2YXIgdGltZSA9IDA7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICBpZiggdGltZSsrID09PSAwKSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gIH1cclxufVxyXG5cclxuXy5maXhPYmpTdHIgPSBmdW5jdGlvbihzdHIpe1xyXG4gIGlmKHN0ci50cmltKCkuaW5kZXhPZigneycpICE9PSAwKXtcclxuICAgIHJldHVybiAneycgKyBzdHIgKyAnfSc7XHJcbiAgfVxyXG4gIHJldHVybiBzdHI7XHJcbn1cclxuXHJcblxyXG5fLm1hcD0gZnVuY3Rpb24oYXJyYXksIGNhbGxiYWNrKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICByZXMucHVzaChjYWxsYmFjayhhcnJheVtpXSwgaSkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsb2cobXNnLCB0eXBlKXtcclxuICBpZih0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIikgIGNvbnNvbGVbdHlwZSB8fCBcImxvZ1wiXShtc2cpO1xyXG59XHJcblxyXG5fLmxvZyA9IGxvZztcclxuXHJcblxyXG5fLm5vcm1MaXN0ZW5lciA9IGZ1bmN0aW9uKCBldmVudHMgICl7XHJcbiAgICB2YXIgZXZlbnRMaXN0ZW5lcnMgPSBbXTtcclxuICAgIHZhciBwVHlwZSA9IF8udHlwZU9mKCBldmVudHMgKTtcclxuICAgIGlmKCBwVHlwZSA9PT0gJ2FycmF5JyApe1xyXG4gICAgICByZXR1cm4gZXZlbnRzO1xyXG4gICAgfWVsc2UgaWYgKCBwVHlwZSA9PT0gJ29iamVjdCcgKXtcclxuICAgICAgZm9yKCB2YXIgaSBpbiBldmVudHMgKSBpZiAoIGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShpKSApe1xyXG4gICAgICAgIGV2ZW50TGlzdGVuZXJzLnB1c2goe1xyXG4gICAgICAgICAgdHlwZTogaSxcclxuICAgICAgICAgIGxpc3RlbmVyOiBldmVudHNbaV1cclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZXZlbnRMaXN0ZW5lcnM7XHJcbn1cclxuXHJcblxyXG4vL2h0dHA6Ly93d3cudzMub3JnL2h0bWwvd2cvZHJhZnRzL2h0bWwvbWFzdGVyL3NpbmdsZS1wYWdlLmh0bWwjdm9pZC1lbGVtZW50c1xyXG5fLmlzVm9pZFRhZyA9IF8ubWFrZVByZWRpY2F0ZShcImFyZWEgYmFzZSBiciBjb2wgZW1iZWQgaHIgaW1nIGlucHV0IGtleWdlbiBsaW5rIG1lbnVpdGVtIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdiciByLWNvbnRlbnRcIik7XHJcbl8uaXNCb29sZWFuQXR0ciA9IF8ubWFrZVByZWRpY2F0ZSgnc2VsZWN0ZWQgY2hlY2tlZCBkaXNhYmxlZCByZWFkb25seSByZXF1aXJlZCBvcGVuIGF1dG9mb2N1cyBjb250cm9scyBhdXRvcGxheSBjb21wYWN0IGxvb3AgZGVmZXIgbXVsdGlwbGUnKTtcclxuXHJcblxyXG5fLmlzRXhwciA9IGZ1bmN0aW9uKGV4cHIpe1xyXG4gIHJldHVybiBleHByICYmIGV4cHIudHlwZSA9PT0gJ2V4cHJlc3Npb24nO1xyXG59XHJcbi8vIEBUT0RPOiBtYWtlIGl0IG1vcmUgc3RyaWN0XHJcbl8uaXNHcm91cCA9IGZ1bmN0aW9uKGdyb3VwKXtcclxuICByZXR1cm4gZ3JvdXAuaW5qZWN0IHx8IGdyb3VwLiRpbmplY3Q7XHJcbn1cclxuXHJcbl8uZ2V0Q29tcGlsZUZuID0gZnVuY3Rpb24oc291cmNlLCBjdHgsIG9wdGlvbnMpe1xyXG4gIHJldHVybiBjdHguJGNvbXBpbGUuYmluZChjdHgsc291cmNlLCBvcHRpb25zKVxyXG59XHJcblxyXG4vLyByZW1vdmUgZGlyZWN0aXZlIHBhcmFtIGZyb20gQVNUXHJcbl8uZml4VGFnQVNUID0gZnVuY3Rpb24oIHRhZ0FTVCwgQ29tcG9uZW50ICl7XHJcblxyXG4gIGlmKCB0YWdBU1QudG91Y2hlZCApIHJldHVybjtcclxuXHJcbiAgdmFyIGF0dHJzID0gdGFnQVNULmF0dHJzO1xyXG5cclxuICBpZiggIWF0dHJzICkgcmV0dXJuO1xyXG5cclxuICAvLyBNYXliZSBtdWx0aXBsZSBkaXJlY3RpdmUgbmVlZCBzYW1lIHBhcmFtLCBcclxuICAvLyBXZSBwbGFjZSBhbGwgcGFyYW0gaW4gdG90YWxQYXJhbU1hcFxyXG4gIHZhciBsZW4gPSBhdHRycy5sZW5ndGg7XHJcbiAgaWYoIWxlbikgcmV0dXJuO1xyXG4gIHZhciBkaXJlY3RpdmVzPVtdLCBvdGhlckF0dHJNYXAgPSB7fTtcclxuICBmb3IoO2xlbi0tOyl7XHJcblxyXG4gICAgdmFyIGF0dHIgPSBhdHRyc1sgbGVuIF07XHJcblxyXG5cclxuICAgIC8vIEBJRSBmaXggSUU5LSBpbnB1dCB0eXBlIGNhbid0IGFzc2lnbiBhZnRlciB2YWx1ZVxyXG4gICAgaWYoYXR0ci5uYW1lID09PSAndHlwZScpIGF0dHIucHJpb3JpdHkgPSBNQVhfUFJJT1JJVFkrMTtcclxuXHJcbiAgICB2YXIgZGlyZWN0aXZlID0gQ29tcG9uZW50LmRpcmVjdGl2ZSggYXR0ci5uYW1lICk7XHJcbiAgICBpZiggZGlyZWN0aXZlICkge1xyXG5cclxuICAgICAgYXR0ci5wcmlvcml0eSA9IGRpcmVjdGl2ZS5wcmlvcml0eSB8fCAxO1xyXG4gICAgICBhdHRyLmRpcmVjdGl2ZSA9IHRydWU7XHJcbiAgICAgIGRpcmVjdGl2ZXMucHVzaChhdHRyKTtcclxuXHJcbiAgICB9ZWxzZSBpZihhdHRyLnR5cGUgPT09ICdhdHRyaWJ1dGUnKXtcclxuICAgICAgb3RoZXJBdHRyTWFwW2F0dHIubmFtZV0gPSBhdHRyLnZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZGlyZWN0aXZlcy5mb3JFYWNoKCBmdW5jdGlvbiggYXR0ciApe1xyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IENvbXBvbmVudC5kaXJlY3RpdmUoYXR0ci5uYW1lKTtcclxuICAgIHZhciBwYXJhbSA9IGRpcmVjdGl2ZS5wYXJhbTtcclxuICAgIGlmKHBhcmFtICYmIHBhcmFtLmxlbmd0aCl7XHJcbiAgICAgIGF0dHIucGFyYW0gPSB7fTtcclxuICAgICAgcGFyYW0uZm9yRWFjaChmdW5jdGlvbiggbmFtZSApe1xyXG4gICAgICAgIGlmKCBuYW1lIGluIG90aGVyQXR0ck1hcCApe1xyXG4gICAgICAgICAgYXR0ci5wYXJhbVtuYW1lXSA9IG90aGVyQXR0ck1hcFtuYW1lXSA9PT0gdW5kZWZpbmVkPyB0cnVlOiBvdGhlckF0dHJNYXBbbmFtZV1cclxuICAgICAgICAgIF8ucmVtb3ZlT25lKGF0dHJzLCBmdW5jdGlvbihhdHRyKXtcclxuICAgICAgICAgICAgcmV0dXJuIGF0dHIubmFtZSA9PT0gbmFtZVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGF0dHJzLnNvcnQoZnVuY3Rpb24oYTEsIGEyKXtcclxuICAgIFxyXG4gICAgdmFyIHAxID0gYTEucHJpb3JpdHk7XHJcbiAgICB2YXIgcDIgPSBhMi5wcmlvcml0eTtcclxuXHJcbiAgICBpZiggcDEgPT0gbnVsbCApIHAxID0gTUFYX1BSSU9SSVRZO1xyXG4gICAgaWYoIHAyID09IG51bGwgKSBwMiA9IE1BWF9QUklPUklUWTtcclxuXHJcbiAgICByZXR1cm4gcDIgLSBwMTtcclxuXHJcbiAgfSlcclxuXHJcbiAgdGFnQVNULnRvdWNoZWQgPSB0cnVlO1xyXG59XHJcblxyXG5fLmZpbmRJdGVtID0gZnVuY3Rpb24obGlzdCwgZmlsdGVyKXtcclxuICBpZighbGlzdCB8fCAhbGlzdC5sZW5ndGgpIHJldHVybjtcclxuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XHJcbiAgd2hpbGUobGVuLS0pe1xyXG4gICAgaWYoZmlsdGVyKGxpc3RbbGVuXSkpIHJldHVybiBsaXN0W2xlbl1cclxuICB9XHJcbn1cclxuXHJcbl8uZ2V0UGFyYW1PYmogPSBmdW5jdGlvbihjb21wb25lbnQsIHBhcmFtKXtcclxuICB2YXIgcGFyYW1PYmogPSB7fTtcclxuICBpZihwYXJhbSkge1xyXG4gICAgZm9yKHZhciBpIGluIHBhcmFtKSBpZihwYXJhbS5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICAgIHZhciB2YWx1ZSA9IHBhcmFtW2ldO1xyXG4gICAgICBwYXJhbU9ialtpXSA9ICB2YWx1ZSAmJiB2YWx1ZS50eXBlPT09J2V4cHJlc3Npb24nPyBjb21wb25lbnQuJGdldCh2YWx1ZSk6IHZhbHVlO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcGFyYW1PYmo7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvdXRpbC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAnQkVHSU4nOiAneycsXHJcbiAgJ0VORCc6ICd9JyxcclxuICAnUFJFQ09NUElMRSc6IGZhbHNlXHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvY29uZmlnLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiZnVuY3Rpb24gZG9jdW1lbnRGcmFnbWVudCgpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5kb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50RnJhZ21lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTU6MDU6MDEgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMjE6MTA6NDJcclxuICovXHJcbnZhciBQYXJzZXIgPSByZXF1aXJlKCcuLi8vcGFyc2VyL3NyYy9QYXJzZXIuanMnKTtcclxuXHJcbmlmKCF0aGlzLmRvY3VtZW50KXtcclxuICAgIC8qZXNsaW50LWRpc2FibGUqL1xyXG4gICAgZG9jdW1lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50LmpzJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEJhc2VSZW5kZXJTdG9yZShvYmope1xyXG5cclxuICAgIHRoaXMuX2JlZm9yZUNvbmZpZygpO1xyXG4gICAgdGhpcy5fY29uZmlnTW9kZWwob2JqKTtcclxuICAgIHRoaXMuX2FmdGVyQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9wYXJzZSgpO1xyXG59XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9iZWZvcmVDb25maWcgPSBmdW5jdGlvbigpe1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fYWZ0ZXJDb25maWcgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcodGhpcy5kYXRhKTtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbmZpZ01vZGVsID0gZnVuY3Rpb24obW9kZWwpe1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBtb2RlbCk7XHJcblxyXG4gICAgaWYoIW1vZGVsLmRhdGEpIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgdGhpcy5fbGlzdCA9IHt9O1xyXG4gICAgdGhpcy4kbGlzdCA9IHt9O1xyXG4gICAgdGhpcy4kcmVmcyA9IHt9O1xyXG5cclxuICAgIHRoaXMuX2RlZmluZXIgPSBtb2RlbDtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbihhc3QsIGxpc3RJbmZvLCBsaXN0QnVmZmVyKXtcclxuICAgIGlmKGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQodGhpcy5fY29tcGlsZShhc3RbaV0sIGxpc3RJbmZvLCBsaXN0QnVmZmVyKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyW2FzdC50eXBlXShhc3QsIHRoaXMsIGxpc3RJbmZvLCBsaXN0QnVmZmVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3BhcnNlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuQVNUID0gbmV3IFBhcnNlcih0aGlzLnRlbXBsYXRlKS5wYXJzZSgpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fc2dfID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEV2ZW50KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZGF0YVtwYXRoXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2VSZW5kZXJTdG9yZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG5cclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcuanNcIik7XHJcbnZhciBub2RlID0gcmVxdWlyZShcIi4vbm9kZS5qc1wiKTtcclxudmFyIExleGVyID0gcmVxdWlyZShcIi4vTGV4ZXIuanNcIik7XHJcbnZhciB2YXJOYW1lID0gXy52YXJOYW1lO1xyXG52YXIgY3R4TmFtZSA9IF8uY3R4TmFtZTtcclxudmFyIGV4dE5hbWUgPSBfLmV4dE5hbWU7XHJcbnZhciBpc1BhdGggPSBfLm1ha2VQcmVkaWNhdGUoXCJTVFJJTkcgSURFTlQgTlVNQkVSXCIpO1xyXG52YXIgaXNLZXlXb3JkID0gXy5tYWtlUHJlZGljYXRlKFwidHJ1ZSBmYWxzZSB1bmRlZmluZWQgbnVsbCB0aGlzIEFycmF5IERhdGUgSlNPTiBNYXRoIE5hTiBSZWdFeHAgZGVjb2RlVVJJIGRlY29kZVVSSUNvbXBvbmVudCBlbmNvZGVVUkkgZW5jb2RlVVJJQ29tcG9uZW50IHBhcnNlRmxvYXQgcGFyc2VJbnQgT2JqZWN0XCIpO1xyXG5cclxuXHJcblxyXG5cclxuZnVuY3Rpb24gUGFyc2VyKGlucHV0LCBvcHRzKXtcclxuICBvcHRzID0gb3B0cyB8fCB7fTtcclxuXHJcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xyXG4gIHRoaXMudG9rZW5zID0gbmV3IExleGVyKGlucHV0LCBvcHRzKS5sZXgoKTtcclxuICB0aGlzLnBvcyA9IDA7XHJcbiAgdGhpcy5sZW5ndGggPSB0aGlzLnRva2Vucy5sZW5ndGg7XHJcbn1cclxuXHJcblxyXG52YXIgb3AgPSBQYXJzZXIucHJvdG90eXBlO1xyXG5cclxuXHJcbm9wLnBhcnNlID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLnBvcyA9IDA7XHJcbiAgdmFyIHJlcz0gdGhpcy5wcm9ncmFtKCk7XHJcbiAgaWYodGhpcy5sbCgpLnR5cGUgPT09ICdUQUdfQ0xPU0UnKXtcclxuICAgIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGdvdCBhIHVuY2xvc2VkIFRhZ1wiKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5vcC5sbCA9ICBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIGlmKGsgPCAwKSBrID0gayArIDE7XHJcbiAgdmFyIHBvcyA9IHRoaXMucG9zICsgayAtIDE7XHJcbiAgaWYocG9zID4gdGhpcy5sZW5ndGggLSAxKXtcclxuICAgICAgcmV0dXJuIHRoaXMudG9rZW5zW3RoaXMubGVuZ3RoLTFdO1xyXG4gIH1cclxuICByZXR1cm4gdGhpcy50b2tlbnNbcG9zXTtcclxufVxyXG4gIC8vIGxvb2thaGVhZFxyXG5vcC5sYSA9IGZ1bmN0aW9uKGspe1xyXG4gIHJldHVybiAodGhpcy5sbChrKSB8fCAnJykudHlwZTtcclxufVxyXG5cclxub3AubWF0Y2ggPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKCEobGwgPSB0aGlzLmVhdCh0eXBlLCB2YWx1ZSkpKXtcclxuICAgIGxsICA9IHRoaXMubGwoKTtcclxuICAgIHRoaXMuZXJyb3IoJ2V4cGVjdCBbJyArIHR5cGUgKyAodmFsdWUgPT0gbnVsbD8gJyc6JzonKyB2YWx1ZSkgKyAnXVwiIC0+IGdvdCBcIlsnICsgbGwudHlwZSArICh2YWx1ZT09bnVsbD8gJyc6JzonK2xsLnZhbHVlKSArICddJywgbGwucG9zKVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGxsO1xyXG4gIH1cclxufVxyXG5cclxub3AuZXJyb3IgPSBmdW5jdGlvbihtc2csIHBvcyl7XHJcbiAgbXNnID0gIFwiXFxu44CQIHBhcnNlIGZhaWxlZCDjgJEgXCIgKyBtc2cgKyAgJzpcXG5cXG4nICsgXy50cmFja0Vycm9yUG9zKHRoaXMuaW5wdXQsIHR5cGVvZiBwb3MgPT09ICdudW1iZXInPyBwb3M6IHRoaXMubGwoKS5wb3N8fDApO1xyXG4gIHRocm93IG5ldyBFcnJvcihtc2cpO1xyXG59XHJcblxyXG5vcC5uZXh0ID0gZnVuY3Rpb24oayl7XHJcbiAgayA9IGsgfHwgMTtcclxuICB0aGlzLnBvcyArPSBrO1xyXG59XHJcbm9wLmVhdCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgaWYodHlwZW9mIHR5cGUgIT09ICdzdHJpbmcnKXtcclxuICAgIGZvcih2YXIgbGVuID0gdHlwZS5sZW5ndGggOyBsZW4tLTspe1xyXG4gICAgICBpZihsbC50eXBlID09PSB0eXBlW2xlbl0pIHtcclxuICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICByZXR1cm4gbGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIGlmKCBsbC50eXBlID09PSB0eXBlICYmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnIHx8IGxsLnZhbHVlID09PSB2YWx1ZSkgKXtcclxuICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgcmV0dXJuIGxsO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbi8vIHByb2dyYW1cclxuLy8gIDpFT0ZcclxuLy8gIHwgKHN0YXRlbWVudCkqIEVPRlxyXG5vcC5wcm9ncmFtID0gZnVuY3Rpb24oKXtcclxuICB2YXIgc3RhdGVtZW50cyA9IFtdLCAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgd2hpbGUobGwudHlwZSAhPT0gJ0VPRicgJiYgbGwudHlwZSAhPT0nVEFHX0NMT1NFJyl7XHJcblxyXG4gICAgc3RhdGVtZW50cy5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgfVxyXG4gIC8vIGlmKGxsLnR5cGUgPT09ICdUQUdfQ0xPU0UnKSB0aGlzLmVycm9yKFwiWW91IG1heSBoYXZlIHVubWF0Y2hlZCBUYWdcIilcclxuICByZXR1cm4gc3RhdGVtZW50cztcclxufVxyXG5cclxuLy8gc3RhdGVtZW50XHJcbi8vICA6IHhtbFxyXG4vLyAgfCBqc3RcclxuLy8gIHwgdGV4dFxyXG5vcC5zdGF0ZW1lbnQgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlICdOQU1FJzpcclxuICAgIGNhc2UgJ1RFWFQnOlxyXG4gICAgICB2YXIgdGV4dCA9IGxsLnZhbHVlO1xyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgd2hpbGUobGwgPSB0aGlzLmVhdChbJ05BTUUnLCAnVEVYVCddKSl7XHJcbiAgICAgICAgdGV4dCArPSBsbC52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbm9kZS50ZXh0KHRleHQpO1xyXG4gICAgY2FzZSAnVEFHX09QRU4nOlxyXG4gICAgICByZXR1cm4gdGhpcy54bWwoKTtcclxuICAgIGNhc2UgJ09QRU4nOiBcclxuICAgICAgcmV0dXJuIHRoaXMuZGlyZWN0aXZlKCk7XHJcbiAgICBjYXNlICdFWFBSX09QRU4nOlxyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgdG9rZW46ICcrIHRoaXMubGEoKSlcclxuICB9XHJcbn1cclxuXHJcbi8vIHhtbCBcclxuLy8gc3RhZyBzdGF0ZW1lbnQqIFRBR19DTE9TRT8oaWYgc2VsZi1jbG9zZWQgdGFnKVxyXG5vcC54bWwgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBuYW1lLCBhdHRycywgY2hpbGRyZW4sIHNlbGZDbG9zZWQ7XHJcbiAgbmFtZSA9IHRoaXMubWF0Y2goJ1RBR19PUEVOJykudmFsdWU7XHJcbiAgYXR0cnMgPSB0aGlzLmF0dHJzKCk7XHJcbiAgc2VsZkNsb3NlZCA9IHRoaXMuZWF0KCcvJylcclxuICB0aGlzLm1hdGNoKCc+Jyk7XHJcbiAgaWYoICFzZWxmQ2xvc2VkICYmICFfLmlzVm9pZFRhZyhuYW1lKSApe1xyXG4gICAgY2hpbGRyZW4gPSB0aGlzLnByb2dyYW0oKTtcclxuICAgIGlmKCF0aGlzLmVhdCgnVEFHX0NMT1NFJywgbmFtZSkpIHRoaXMuZXJyb3IoJ2V4cGVjdCA8LycrbmFtZSsnPiBnb3QnKyAnbm8gbWF0Y2hlZCBjbG9zZVRhZycpXHJcbiAgfVxyXG4gIHJldHVybiBub2RlLmVsZW1lbnQobmFtZSwgYXR0cnMsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLy8geGVudGl0eVxyXG4vLyAgLXJ1bGUod3JhcCBhdHRyaWJ1dGUpXHJcbi8vICAtYXR0cmlidXRlXHJcbi8vXHJcbi8vIF9fZXhhbXBsZV9fXHJcbi8vICBuYW1lID0gMSB8ICBcclxuLy8gIG5nLWhpZGUgfFxyXG4vLyAgb24tY2xpY2s9e3t9fSB8IFxyXG4vLyAge3sjaWYgbmFtZX19b24tY2xpY2s9e3t4eH19e3sjZWxzZX19b24tdGFwPXt7fX17ey9pZn19XHJcblxyXG5vcC54ZW50aXR5ID0gZnVuY3Rpb24obGwpe1xyXG4gIHZhciBuYW1lID0gbGwudmFsdWUsIHZhbHVlLCBtb2RpZmllcjtcclxuICBpZihsbC50eXBlID09PSAnTkFNRScpe1xyXG4gICAgLy9AIG9ubHkgZm9yIHRlc3RcclxuICAgIGlmKH5uYW1lLmluZGV4T2YoJy4nKSl7XHJcbiAgICAgIHZhciB0bXAgPSBuYW1lLnNwbGl0KCcuJyk7XHJcbiAgICAgIG5hbWUgPSB0bXBbMF07XHJcbiAgICAgIG1vZGlmaWVyID0gdG1wWzFdXHJcblxyXG4gICAgfVxyXG4gICAgaWYoIHRoaXMuZWF0KFwiPVwiKSApIHZhbHVlID0gdGhpcy5hdHR2YWx1ZShtb2RpZmllcik7XHJcbiAgICByZXR1cm4gbm9kZS5hdHRyaWJ1dGUoIG5hbWUsIHZhbHVlLCBtb2RpZmllciApO1xyXG4gIH1lbHNle1xyXG4gICAgaWYoIG5hbWUgIT09ICdpZicpIHRoaXMuZXJyb3IoXCJjdXJyZW50IHZlcnNpb24uIE9OTFkgUlVMRSAjaWYgI2Vsc2UgI2Vsc2VpZiBpcyB2YWxpZCBpbiB0YWcsIHRoZSBydWxlICNcIiArIG5hbWUgKyAnIGlzIGludmFsaWQnKTtcclxuICAgIHJldHVybiB0aGlzWydpZiddKHRydWUpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbi8vIHN0YWcgICAgIDo6PSAgICAnPCcgTmFtZSAoUyBhdHRyKSogUz8gJz4nICBcclxuLy8gYXR0ciAgICA6Oj0gICAgIE5hbWUgRXEgYXR0dmFsdWVcclxub3AuYXR0cnMgPSBmdW5jdGlvbihpc0F0dHJpYnV0ZSl7XHJcbiAgdmFyIGVhdFxyXG4gIGlmKCFpc0F0dHJpYnV0ZSl7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCIsIFwiT1BFTlwiXVxyXG4gIH1lbHNle1xyXG4gICAgZWF0ID0gW1wiTkFNRVwiXVxyXG4gIH1cclxuXHJcbiAgdmFyIGF0dHJzID0gW10sIGxsO1xyXG4gIHdoaWxlIChsbCA9IHRoaXMuZWF0KGVhdCkpe1xyXG4gICAgYXR0cnMucHVzaCh0aGlzLnhlbnRpdHkoIGxsICkpXHJcbiAgfVxyXG4gIHJldHVybiBhdHRycztcclxufVxyXG5cclxuLy8gYXR0dmFsdWVcclxuLy8gIDogU1RSSU5HICBcclxuLy8gIHwgTkFNRVxyXG5vcC5hdHR2YWx1ZSA9IGZ1bmN0aW9uKG1kZil7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgXCJOQU1FXCI6XHJcbiAgICBjYXNlIFwiVU5RXCI6XHJcbiAgICBjYXNlIFwiU1RSSU5HXCI6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB2YXIgdmFsdWUgPSBsbC52YWx1ZTtcclxuICAgICAgaWYofnZhbHVlLmluZGV4T2YoY29uZmlnLkJFR0lOKSAmJiB+dmFsdWUuaW5kZXhPZihjb25maWcuRU5EKSAmJiBtZGYhPT0nY21wbCcpe1xyXG4gICAgICAgIHZhciBjb25zdGFudCA9IHRydWU7XHJcbiAgICAgICAgdmFyIHBhcnNlZCA9IG5ldyBQYXJzZXIodmFsdWUsIHsgbW9kZTogMiB9KS5wYXJzZSgpO1xyXG4gICAgICAgIGlmKHBhcnNlZC5sZW5ndGggPT09IDEgJiYgcGFyc2VkWzBdLnR5cGUgPT09ICdleHByZXNzaW9uJykgcmV0dXJuIHBhcnNlZFswXTtcclxuICAgICAgICB2YXIgYm9keSA9IFtdO1xyXG4gICAgICAgIHBhcnNlZC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgaWYoIWl0ZW0uY29uc3RhbnQpIGNvbnN0YW50PWZhbHNlO1xyXG4gICAgICAgICAgLy8gc2lsZW50IHRoZSBtdXRpcGxlIGludGVwbGF0aW9uXHJcbiAgICAgICAgICAgIGJvZHkucHVzaChpdGVtLmJvZHkgfHwgXCInXCIgKyBpdGVtLnRleHQucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpICsgXCInXCIpOyAgICAgICAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYm9keSA9IFwiW1wiICsgYm9keS5qb2luKFwiLFwiKSArIFwiXS5qb2luKCcnKVwiO1xyXG4gICAgICAgIHZhbHVlID0gbm9kZS5leHByZXNzaW9uKGJvZHksIG51bGwsIGNvbnN0YW50KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICBjYXNlIFwiRVhQUl9PUEVOXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgLy8gY2FzZSBcIk9QRU5cIjpcclxuICAgIC8vICAgaWYobGwudmFsdWUgPT09ICdpbmMnIHx8IGxsLnZhbHVlID09PSAnaW5jbHVkZScpe1xyXG4gICAgLy8gICAgIHRoaXMubmV4dCgpO1xyXG4gICAgLy8gICAgIHJldHVybiB0aGlzLmluYygpO1xyXG4gICAgLy8gICB9ZWxzZXtcclxuICAgIC8vICAgICB0aGlzLmVycm9yKCdhdHRyaWJ1dGUgdmFsdWUgb25seSBzdXBwb3J0IGludGVwbGF0aW9uIGFuZCB7I2luY30gc3RhdGVtZW50JylcclxuICAgIC8vICAgfVxyXG4gICAgLy8gICBicmVhaztcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgdG9rZW46ICcrIHRoaXMubGEoKSlcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyB7eyN9fVxyXG5vcC5kaXJlY3RpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBuYW1lID0gdGhpcy5sbCgpLnZhbHVlO1xyXG4gIHRoaXMubmV4dCgpO1xyXG4gIGlmKHR5cGVvZiB0aGlzW25hbWVdID09PSAnZnVuY3Rpb24nKXtcclxuICAgIHJldHVybiB0aGlzW25hbWVdKClcclxuICB9ZWxzZXtcclxuICAgIHRoaXMuZXJyb3IoJ1VuZGVmaW5lZCBkaXJlY3RpdmVbJysgbmFtZSArJ10nKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG4vLyB7e319XHJcbm9wLmludGVycGxhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnRVhQUl9PUEVOJyk7XHJcbiAgdmFyIHJlcyA9IHRoaXMuZXhwcmVzc2lvbih0cnVlKTtcclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyB7e359fVxyXG5vcC5pbmMgPSBvcC5pbmNsdWRlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29udGVudCA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiBub2RlLnRlbXBsYXRlKGNvbnRlbnQpO1xyXG59XHJcblxyXG4vLyB7eyNpZn19XHJcbm9wW1wiaWZcIl0gPSBmdW5jdGlvbih0YWcpe1xyXG4gIHZhciB0ZXN0ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdmFyIGNvbnNlcXVlbnQgPSBbXSwgYWx0ZXJuYXRlPVtdO1xyXG5cclxuICB2YXIgY29udGFpbmVyID0gY29uc2VxdWVudDtcclxuICB2YXIgc3RhdGVtZW50ID0gIXRhZz8gXCJzdGF0ZW1lbnRcIiA6IFwiYXR0cnNcIjtcclxuXHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcblxyXG4gIHZhciBsbCwgY2xvc2U7XHJcbiAgd2hpbGUoICEgKGNsb3NlID0gdGhpcy5lYXQoJ0NMT1NFJykpICl7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICAgIGlmKCBsbC50eXBlID09PSAnT1BFTicgKXtcclxuICAgICAgc3dpdGNoKCBsbC52YWx1ZSApe1xyXG4gICAgICAgIGNhc2UgJ2Vsc2UnOlxyXG4gICAgICAgICAgY29udGFpbmVyID0gYWx0ZXJuYXRlO1xyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICB0aGlzLm1hdGNoKCAnRU5EJyApO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnZWxzZWlmJzpcclxuICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgYWx0ZXJuYXRlLnB1c2goIHRoaXNbXCJpZlwiXSh0YWcpICk7XHJcbiAgICAgICAgICByZXR1cm4gbm9kZVsnaWYnXSggdGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlICk7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIGNvbnRhaW5lci5wdXNoKCB0aGlzW3N0YXRlbWVudF0odHJ1ZSkgKTtcclxuICAgICAgfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXNbc3RhdGVtZW50XSh0cnVlKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIGlmIHN0YXRlbWVudCBub3QgbWF0Y2hlZFxyXG4gIGlmKGNsb3NlLnZhbHVlICE9PSBcImlmXCIpIHRoaXMuZXJyb3IoJ1VubWF0Y2hlZCBpZiBkaXJlY3RpdmUnKVxyXG4gIHJldHVybiBub2RlW1wiaWZcIl0odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKTtcclxufVxyXG5cclxuXHJcbi8vIEBtYXJrICAgbXVzdGFjaGUgc3ludGF4IGhhdmUgbmF0cnVyZSBkaXMsIGNhbm90IHdpdGggZXhwcmVzc2lvblxyXG4vLyB7eyNsaXN0fX1cclxub3AubGlzdCA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gc2VxdWVuY2UgY2FuIGJlIGEgbGlzdCBvciBoYXNoXHJcbiAgdmFyIHNlcXVlbmNlID0gdGhpcy5leHByZXNzaW9uKCksIHZhcmlhYmxlLCBsbCwgdHJhY2s7XHJcbiAgdmFyIGNvbnNlcXVlbnQgPSBbXSwgYWx0ZXJuYXRlPVtdO1xyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG5cclxuICB0aGlzLm1hdGNoKCdJREVOVCcsICdhcycpO1xyXG5cclxuICB2YXJpYWJsZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCdJREVOVCcsICdieScpKXtcclxuICAgIGlmKHRoaXMuZWF0KCdJREVOVCcsdmFyaWFibGUgKyAnX2luZGV4Jykpe1xyXG4gICAgICB0cmFjayA9IHRydWU7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdHJhY2sgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICAgICAgaWYodHJhY2suY29uc3RhbnQpe1xyXG4gICAgICAgIC8vIHRydWUgaXMgbWVhbnMgY29uc3RhbnQsIHdlIGhhbmRsZSBpdCBqdXN0IGxpa2UgeHh4X2luZGV4LlxyXG4gICAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcblxyXG4gIHdoaWxlKCAhKGxsID0gdGhpcy5lYXQoJ0NMT1NFJykpICl7XHJcbiAgICBpZih0aGlzLmVhdCgnT1BFTicsICdlbHNlJykpe1xyXG4gICAgICBjb250YWluZXIgPSAgYWx0ZXJuYXRlO1xyXG4gICAgICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICAgIH1lbHNle1xyXG4gICAgICBjb250YWluZXIucHVzaCh0aGlzLnN0YXRlbWVudCgpKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgaWYobGwudmFsdWUgIT09ICdsaXN0JykgdGhpcy5lcnJvcignZXhwZWN0ICcgKyAnbGlzdCBnb3QgJyArICcvJyArIGxsLnZhbHVlICsgJyAnLCBsbC5wb3MgKTtcclxuICByZXR1cm4gbm9kZS5saXN0KHNlcXVlbmNlLCB2YXJpYWJsZSwgY29uc2VxdWVudCwgYWx0ZXJuYXRlLCB0cmFjayk7XHJcbn1cclxuXHJcblxyXG5vcC5leHByZXNzaW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgZXhwcmVzc2lvbjtcclxuICBpZih0aGlzLmVhdCgnQCgnKSl7IC8vb25jZSBiaW5kXHJcbiAgICBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XHJcbiAgICBleHByZXNzaW9uLm9uY2UgPSB0cnVlO1xyXG4gICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgfWVsc2V7XHJcbiAgICBleHByZXNzaW9uID0gdGhpcy5leHByKCk7XHJcbiAgfVxyXG4gIHJldHVybiBleHByZXNzaW9uO1xyXG59XHJcblxyXG5vcC5leHByID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLmRlcGVuZCA9IFtdO1xyXG5cclxuICB2YXIgYnVmZmVyID0gdGhpcy5maWx0ZXIoKVxyXG5cclxuICB2YXIgYm9keSA9IGJ1ZmZlci5nZXQgfHwgYnVmZmVyO1xyXG4gIHZhciBzZXRib2R5ID0gYnVmZmVyLnNldDtcclxuICByZXR1cm4gbm9kZS5leHByZXNzaW9uKGJvZHksIHNldGJvZHksICF0aGlzLmRlcGVuZC5sZW5ndGgsIGJ1ZmZlci5maWx0ZXJzKTtcclxufVxyXG5cclxuXHJcbi8vIGZpbHRlclxyXG4vLyBhc3NpZ24gKCd8JyBmaWx0ZXJuYW1lWyc6JyBhcmdzXSkgKiBcclxub3AuZmlsdGVyID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgdmFyIGxsID0gdGhpcy5lYXQoJ3wnKTtcclxuICB2YXIgYnVmZmVyID0gW10sIGZpbHRlcnMsc2V0QnVmZmVyLCBwcmVmaXgsXHJcbiAgICBhdHRyID0gXCJ0XCIsIFxyXG4gICAgc2V0ID0gbGVmdC5zZXQsIGdldCwgXHJcbiAgICB0bXAgPSBcIlwiO1xyXG5cclxuICBpZihsbCl7XHJcbiAgICBpZihzZXQpIHtcclxuICAgICAgc2V0QnVmZmVyID0gW107XHJcbiAgICAgIGZpbHRlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwcmVmaXggPSBcIihmdW5jdGlvbihcIiArIGF0dHIgKyBcIil7XCI7XHJcblxyXG4gICAgZG97XHJcbiAgICAgIHZhciBmaWx0ZXJOYW1lID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuICAgICAgdG1wID0gYXR0ciArIFwiID0gXCIgKyBjdHhOYW1lICsgXCIuX2ZfKCdcIiArIGZpbHRlck5hbWUgKyBcIicgKS5nZXQuY2FsbCggXCIrXy5jdHhOYW1lICtcIixcIiArIGF0dHIgO1xyXG4gICAgICBpZih0aGlzLmVhdCgnOicpKXtcclxuICAgICAgICB0bXAgKz1cIiwgXCIrIHRoaXMuYXJndW1lbnRzKFwifFwiKS5qb2luKFwiLFwiKSArIFwiKTtcIlxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0bXAgKz0gJyk7J1xyXG4gICAgICB9XHJcbiAgICAgIGJ1ZmZlci5wdXNoKHRtcCk7XHJcbiAgICAgIFxyXG4gICAgICBpZihzZXQpe1xyXG4gICAgICAgIC8vIG9ubHkgaW4gcnVudGltZSAsd2UgY2FuIGRldGVjdCAgd2hldGhlciAgdGhlIGZpbHRlciBoYXMgYSBzZXQgZnVuY3Rpb24uIFxyXG4gICAgICAgIGZpbHRlcnMucHVzaChmaWx0ZXJOYW1lKTtcclxuICAgICAgICBzZXRCdWZmZXIudW5zaGlmdCggdG1wLnJlcGxhY2UoXCIgKS5nZXQuY2FsbFwiLCBcIiApLnNldC5jYWxsXCIpICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9d2hpbGUobGwgPSB0aGlzLmVhdCgnfCcpKTtcclxuICAgIGJ1ZmZlci5wdXNoKFwicmV0dXJuIFwiICsgYXR0ciApO1xyXG4gICAgc2V0QnVmZmVyICYmIHNldEJ1ZmZlci5wdXNoKFwicmV0dXJuIFwiICsgYXR0cik7XHJcblxyXG4gICAgZ2V0ID0gIHByZWZpeCArIGJ1ZmZlci5qb2luKFwiXCIpICsgXCJ9KShcIitsZWZ0LmdldCtcIilcIjtcclxuICAgIC8vIHdlIGNhbGwgYmFjayB0byB2YWx1ZS5cclxuICAgIGlmKHNldEJ1ZmZlcil7XHJcbiAgICAgIC8vIGNoYW5nZSBfc3NfXyhuYW1lLCBfcF8pIHRvIF9zX18obmFtZSwgZmlsdGVyRm4oX3BfKSk7XHJcbiAgICAgIHNldCA9IHNldC5yZXBsYWNlKF8uc2V0TmFtZSwgXHJcbiAgICAgICAgcHJlZml4ICsgc2V0QnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK+OAgF8uc2V0TmFtZeOAgCtcIilcIiApO1xyXG5cclxuICAgIH1cclxuICAgIC8vIHRoZSBzZXQgZnVuY3Rpb24gaXMgZGVwZW5kIG9uIHRoZSBmaWx0ZXIgZGVmaW5pdGlvbi4gaWYgaXQgaGF2ZSBzZXQgbWV0aG9kLCB0aGUgc2V0IHdpbGwgd29ya1xyXG4gICAgdmFyIHJldCA9IGdldHNldChnZXQsIHNldCk7XHJcbiAgICByZXQuZmlsdGVycyA9IGZpbHRlcnM7XHJcbiAgICByZXR1cm4gcmV0O1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gYXNzaWduXHJcbi8vIGxlZnQtaGFuZC1leHByID0gY29uZGl0aW9uXHJcbm9wLmFzc2lnbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmNvbmRpdGlvbigpLCBsbDtcclxuICBpZihsbCA9IHRoaXMuZWF0KFsnPScsICcrPScsICctPScsICcqPScsICcvPScsICclPSddKSl7XHJcbiAgICBpZighbGVmdC5zZXQpIHRoaXMuZXJyb3IoJ2ludmFsaWQgbGVmdGhhbmQgZXhwcmVzc2lvbiBpbiBhc3NpZ25tZW50IGV4cHJlc3Npb24nKTtcclxuICAgIHJldHVybiBnZXRzZXQoIGxlZnQuc2V0LnJlcGxhY2UoIFwiLFwiICsgXy5zZXROYW1lLCBcIixcIiArIHRoaXMuY29uZGl0aW9uKCkuZ2V0ICkucmVwbGFjZShcIic9J1wiLCBcIidcIitsbC50eXBlK1wiJ1wiKSwgbGVmdC5zZXQpO1xyXG4gICAgLy8gcmV0dXJuIGdldHNldCgnKCcgKyBsZWZ0LmdldCArIGxsLnR5cGUgICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKyAnKScsIGxlZnQuc2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbi8vIG9yXHJcbi8vIG9yID8gYXNzaWduIDogYXNzaWduXHJcbm9wLmNvbmRpdGlvbiA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciB0ZXN0ID0gdGhpcy5vcigpO1xyXG4gIGlmKHRoaXMuZWF0KCc/Jykpe1xyXG4gICAgcmV0dXJuIGdldHNldChbdGVzdC5nZXQgKyBcIj9cIiwgXHJcbiAgICAgIHRoaXMuYXNzaWduKCkuZ2V0LCBcclxuICAgICAgdGhpcy5tYXRjaChcIjpcIikudHlwZSwgXHJcbiAgICAgIHRoaXMuYXNzaWduKCkuZ2V0XS5qb2luKFwiXCIpKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0ZXN0O1xyXG59XHJcblxyXG4vLyBhbmRcclxuLy8gYW5kICYmIG9yXHJcbm9wLm9yID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFuZCgpO1xyXG5cclxuICBpZih0aGlzLmVhdCgnfHwnKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgJ3x8JyArIHRoaXMub3IoKS5nZXQpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuLy8gZXF1YWxcclxuLy8gZXF1YWwgJiYgYW5kXHJcbm9wLmFuZCA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBsZWZ0ID0gdGhpcy5lcXVhbCgpO1xyXG5cclxuICBpZih0aGlzLmVhdCgnJiYnKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgJyYmJyArIHRoaXMuYW5kKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuLy8gcmVsYXRpb25cclxuLy8gXHJcbi8vIGVxdWFsID09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9IHJlbGF0aW9uXHJcbi8vIGVxdWFsID09PSByZWxhdGlvblxyXG4vLyBlcXVhbCAhPT0gcmVsYXRpb25cclxub3AuZXF1YWwgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yZWxhdGlvbigpLCBsbDtcclxuICAvLyBAcGVyZjtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJz09JywnIT0nLCAnPT09JywgJyE9PSddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMuZXF1YWwoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIHJlbGF0aW9uIDwgYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPiBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA8PSBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+PSBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiBpbiBhZGRpdGl2ZVxyXG5vcC5yZWxhdGlvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFkZGl0aXZlKCksIGxsO1xyXG4gIC8vIEBwZXJmXHJcbiAgaWYobGwgPSAodGhpcy5lYXQoWyc8JywgJz4nLCAnPj0nLCAnPD0nXSkgfHwgdGhpcy5lYXQoJ0lERU5UJywgJ2luJykgKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudmFsdWUgKyB0aGlzLnJlbGF0aW9uKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyBhZGRpdGl2ZSA6XHJcbi8vIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgKyBtdWx0aXZlXHJcbi8vIGFkZGl0aXZlIC0gbXVsdGl2ZVxyXG5vcC5hZGRpdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLm11bHRpdmUoKSAsbGw7XHJcbiAgaWYobGw9IHRoaXMuZWF0KFsnKycsJy0nXSkgKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMuYWRkaXRpdmUoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIG11bHRpdmUgOlxyXG4vLyB1bmFyeVxyXG4vLyBtdWx0aXZlICogdW5hcnlcclxuLy8gbXVsdGl2ZSAvIHVuYXJ5XHJcbi8vIG11bHRpdmUgJSB1bmFyeVxyXG5vcC5tdWx0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMucmFuZ2UoKSAsbGw7XHJcbiAgaWYoIGxsID0gdGhpcy5lYXQoWycqJywgJy8nICwnJSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnR5cGUgKyB0aGlzLm11bHRpdmUoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxub3AucmFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy51bmFyeSgpLCBsbCwgcmlnaHQ7XHJcblxyXG4gIGlmKGxsID0gdGhpcy5lYXQoJy4uJykpe1xyXG4gICAgcmlnaHQgPSB0aGlzLnVuYXJ5KCk7XHJcbiAgICB2YXIgYm9keSA9IFxyXG4gICAgICBcIihmdW5jdGlvbihzdGFydCxlbmQpe3ZhciByZXMgPSBbXSxzdGVwPWVuZD5zdGFydD8xOi0xOyBmb3IodmFyIGkgPSBzdGFydDsgZW5kPnN0YXJ0P2kgPD0gZW5kOiBpPj1lbmQ7IGk9aStzdGVwKXtyZXMucHVzaChpKTsgfSByZXR1cm4gcmVzIH0pKFwiK2xlZnQuZ2V0K1wiLFwiK3JpZ2h0LmdldCtcIilcIlxyXG4gICAgcmV0dXJuIGdldHNldChib2R5KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5cclxuXHJcbi8vIGxlZnRoYW5kXHJcbi8vICsgdW5hcnlcclxuLy8gLSB1bmFyeVxyXG4vLyB+IHVuYXJ5XHJcbi8vICEgdW5hcnlcclxub3AudW5hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbDtcclxuICBpZihsbCA9IHRoaXMuZWF0KFsnKycsJy0nLCd+JywgJyEnXSkpe1xyXG4gICAgcmV0dXJuIGdldHNldCgnKCcgKyBsbC50eXBlICsgdGhpcy51bmFyeSgpLmdldCArICcpJykgO1xyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIHRoaXMubWVtYmVyKClcclxuICB9XHJcbn1cclxuXHJcbi8vIGNhbGxbbGVmdGhhbmRdIDpcclxuLy8gbWVtYmVyIGFyZ3NcclxuLy8gbWVtYmVyIFsgZXhwcmVzc2lvbiBdXHJcbi8vIG1lbWJlciAuIGlkZW50ICBcclxuXHJcbm9wLm1lbWJlciA9IGZ1bmN0aW9uKGJhc2UsIGxhc3QsIHBhdGhlcywgcHJldkJhc2Upe1xyXG4gIHZhciBsbCwgcGF0aCwgZXh0VmFsdWU7XHJcblxyXG5cclxuICB2YXIgb25seVNpbXBsZUFjY2Vzc29yID0gZmFsc2U7XHJcbiAgaWYoIWJhc2UpeyAvL2ZpcnN0XHJcbiAgICBwYXRoID0gdGhpcy5wcmltYXJ5KCk7XHJcbiAgICB2YXIgdHlwZSA9IHR5cGVvZiBwYXRoO1xyXG4gICAgaWYodHlwZSA9PT0gJ3N0cmluZycpeyBcclxuICAgICAgcGF0aGVzID0gW107XHJcbiAgICAgIHBhdGhlcy5wdXNoKCBwYXRoICk7XHJcbiAgICAgIGxhc3QgPSBwYXRoO1xyXG4gICAgICBleHRWYWx1ZSA9IGV4dE5hbWUgKyBcIi5cIiArIHBhdGhcclxuICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHBhdGggKyBcIicsIFwiICsgdmFyTmFtZSArIFwiLCBcIiArIGV4dE5hbWUgKyBcIilcIjtcclxuICAgICAgb25seVNpbXBsZUFjY2Vzc29yID0gdHJ1ZTtcclxuICAgIH1lbHNleyAvL1ByaW1hdGl2ZSBUeXBlXHJcbiAgICAgIGlmKHBhdGguZ2V0ID09PSAndGhpcycpe1xyXG4gICAgICAgIGJhc2UgPSBjdHhOYW1lO1xyXG4gICAgICAgIHBhdGhlcyA9IFsndGhpcyddO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgICAgIGJhc2UgPSBwYXRoLmdldDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNleyAvLyBub3QgZmlyc3QgZW50ZXJcclxuICAgIGlmKHR5cGVvZiBsYXN0ID09PSAnc3RyaW5nJyAmJiBpc1BhdGgoIGxhc3QpICl7IC8vIGlzIHZhbGlkIHBhdGhcclxuICAgICAgcGF0aGVzLnB1c2gobGFzdCk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgaWYocGF0aGVzICYmIHBhdGhlcy5sZW5ndGgpIHRoaXMuZGVwZW5kLnB1c2gocGF0aGVzKTtcclxuICAgICAgcGF0aGVzID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJ1snLCAnLicsICcoJ10pKXtcclxuICAgIHN3aXRjaChsbC50eXBlKXtcclxuICAgICAgY2FzZSAnLic6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgdmFyIHRtcE5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICAgIHByZXZCYXNlID0gYmFzZTtcclxuICAgICAgICBpZiggdGhpcy5sYSgpICE9PSBcIihcIiApeyBcclxuICAgICAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXygnXCIgKyB0bXBOYW1lICsgXCInLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbJ1wiICsgdG1wTmFtZSArIFwiJ11cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKCBiYXNlLCB0bXBOYW1lLCBwYXRoZXMsICBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJ1snOlxyXG4gICAgICAgICAgLy8gbWVtYmVyKG9iamVjdCwgcHJvcGVydHksIGNvbXB1dGVkKVxyXG4gICAgICAgIHBhdGggPSB0aGlzLmFzc2lnbigpO1xyXG4gICAgICAgIHByZXZCYXNlID0gYmFzZTtcclxuICAgICAgICBpZiggdGhpcy5sYSgpICE9PSBcIihcIiApeyBcclxuICAgICAgICAvLyBtZWFucyBmdW5jdGlvbiBjYWxsLCB3ZSBuZWVkIHRocm93IHVuZGVmaW5lZCBlcnJvciB3aGVuIGNhbGwgZnVuY3Rpb25cclxuICAgICAgICAvLyBhbmQgY29uZmlybSB0aGF0IHRoZSBmdW5jdGlvbiBjYWxsIHdvbnQgbG9zZSBpdHMgY29udGV4dFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKFwiICsgcGF0aC5nZXQgKyBcIiwgXCIgKyBiYXNlICsgXCIpXCI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiYXNlICs9IFwiW1wiICsgcGF0aC5nZXQgKyBcIl1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnXScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIHBhdGgsIHBhdGhlcywgcHJldkJhc2UpO1xyXG4gICAgICBjYXNlICcoJzpcclxuICAgICAgICAvLyBjYWxsKGNhbGxlZSwgYXJncylcclxuICAgICAgICB2YXIgYXJncyA9IHRoaXMuYXJndW1lbnRzKCkuam9pbignLCcpO1xyXG4gICAgICAgIGJhc2UgPSAgYmFzZStcIihcIiArIGFyZ3MgK1wiKVwiO1xyXG4gICAgICAgIHRoaXMubWF0Y2goJyknKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcihiYXNlLCBudWxsLCBwYXRoZXMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiggcGF0aGVzICYmIHBhdGhlcy5sZW5ndGggKSB0aGlzLmRlcGVuZC5wdXNoKCBwYXRoZXMgKTtcclxuICB2YXIgcmVzID0gIHtnZXQ6IGJhc2V9O1xyXG4gIGlmKGxhc3Qpe1xyXG4gICAgcmVzLnNldCA9IGN0eE5hbWUgKyBcIi5fc3NfKFwiICsgXHJcbiAgICAgICAgKGxhc3QuZ2V0PyBsYXN0LmdldCA6IFwiJ1wiKyBsYXN0ICsgXCInXCIpICsgXHJcbiAgICAgICAgXCIsXCIrIF8uc2V0TmFtZSArIFwiLFwiKyBcclxuICAgICAgICAocHJldkJhc2U/cHJldkJhc2U6Xy52YXJOYW1lKSArIFxyXG4gICAgICAgIFwiLCAnPScsIFwiKyAoIG9ubHlTaW1wbGVBY2Nlc3Nvcj8gMSA6IDAgKSArIFwiKVwiO1xyXG4gIFxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vKipcclxuICogXHJcbiAqL1xyXG5vcC5hcmd1bWVudHMgPSBmdW5jdGlvbihlbmQpe1xyXG4gIGVuZCA9IGVuZCB8fCAnKSdcclxuICB2YXIgYXJncyA9IFtdO1xyXG4gIGRve1xyXG4gICAgaWYodGhpcy5sYSgpICE9PSBlbmQpe1xyXG4gICAgICBhcmdzLnB1c2godGhpcy5hc3NpZ24oKS5nZXQpXHJcbiAgICB9XHJcbiAgfXdoaWxlKCB0aGlzLmVhdCgnLCcpKTtcclxuICByZXR1cm4gYXJnc1xyXG59XHJcblxyXG5cclxuLy8gcHJpbWFyeSA6XHJcbi8vIHRoaXMgXHJcbi8vIGlkZW50XHJcbi8vIGxpdGVyYWxcclxuLy8gYXJyYXlcclxuLy8gb2JqZWN0XHJcbi8vICggZXhwcmVzc2lvbiApXHJcblxyXG5vcC5wcmltYXJ5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIntcIjpcclxuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0KCk7XHJcbiAgICBjYXNlIFwiW1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xyXG4gICAgY2FzZSBcIihcIjpcclxuICAgICAgcmV0dXJuIHRoaXMucGFyZW4oKTtcclxuICAgIC8vIGxpdGVyYWwgb3IgaWRlbnRcclxuICAgIGNhc2UgJ1NUUklORyc6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB2YXIgdmFsdWUgPSBcIlwiICsgbGwudmFsdWU7XHJcbiAgICAgIHZhciBxdW90YSA9IH52YWx1ZS5pbmRleE9mKFwiJ1wiKT8gXCJcXFwiXCI6IFwiJ1wiIDtcclxuICAgICAgcmV0dXJuIGdldHNldChxdW90YSArIHZhbHVlICsgcXVvdGEpO1xyXG4gICAgY2FzZSAnTlVNQkVSJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHJldHVybiBnZXRzZXQoIFwiXCIgKyBsbC52YWx1ZSApO1xyXG4gICAgY2FzZSBcIklERU5UXCI6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICBpZihpc0tleVdvcmQobGwudmFsdWUpKXtcclxuICAgICAgICByZXR1cm4gZ2V0c2V0KCBsbC52YWx1ZSApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBsbC52YWx1ZTtcclxuICAgIGRlZmF1bHQ6IFxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIFRva2VuOiAnICsgbGwudHlwZSk7XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvYmplY3RcclxuLy8gIHtwcm9wQXNzaWduIFssIHByb3BBc3NpZ25dICogWyxdfVxyXG5cclxuLy8gcHJvcEFzc2lnblxyXG4vLyAgcHJvcCA6IGFzc2lnblxyXG5cclxuLy8gcHJvcFxyXG4vLyAgU1RSSU5HXHJcbi8vICBJREVOVFxyXG4vLyAgTlVNQkVSXHJcblxyXG5vcC5vYmplY3QgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb2RlID0gW3RoaXMubWF0Y2goJ3snKS50eXBlXTtcclxuXHJcbiAgdmFyIGxsID0gdGhpcy5lYXQoIFsnU1RSSU5HJywgJ0lERU5UJywgJ05VTUJFUiddICk7XHJcbiAgd2hpbGUobGwpe1xyXG4gICAgY29kZS5wdXNoKFwiJ1wiICsgbGwudmFsdWUgKyBcIidcIiArIHRoaXMubWF0Y2goJzonKS50eXBlKTtcclxuICAgIHZhciBnZXQgPSB0aGlzLmFzc2lnbigpLmdldDtcclxuICAgIGNvZGUucHVzaChnZXQpO1xyXG4gICAgbGwgPSBudWxsO1xyXG4gICAgaWYodGhpcy5lYXQoXCIsXCIpICYmIChsbCA9IHRoaXMuZWF0KFsnU1RSSU5HJywgJ0lERU5UJywgJ05VTUJFUiddKSkgKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gIH1cclxuICBjb2RlLnB1c2godGhpcy5tYXRjaCgnfScpLnR5cGUpO1xyXG4gIHJldHVybiB7Z2V0OiBjb2RlLmpvaW4oXCJcIil9XHJcbn1cclxuXHJcbi8vIGFycmF5XHJcbi8vIFsgYXNzaWduWyxhc3NpZ25dKl1cclxub3AuYXJyYXkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb2RlID0gW3RoaXMubWF0Y2goJ1snKS50eXBlXSwgaXRlbTtcclxuICBpZiggdGhpcy5lYXQoXCJdXCIpICl7XHJcblxyXG4gICAgIGNvZGUucHVzaChcIl1cIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdoaWxlKGl0ZW0gPSB0aGlzLmFzc2lnbigpKXtcclxuICAgICAgY29kZS5wdXNoKGl0ZW0uZ2V0KTtcclxuICAgICAgaWYodGhpcy5lYXQoJywnKSkgY29kZS5wdXNoKFwiLFwiKTtcclxuICAgICAgZWxzZSBicmVhaztcclxuICAgIH1cclxuICAgIGNvZGUucHVzaCh0aGlzLm1hdGNoKCddJykudHlwZSk7XHJcbiAgfVxyXG4gIHJldHVybiB7Z2V0OiBjb2RlLmpvaW4oXCJcIil9O1xyXG59XHJcblxyXG4vLyAnKCcgZXhwcmVzc2lvbiAnKSdcclxub3AucGFyZW4gPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMubWF0Y2goJygnKTtcclxuICB2YXIgcmVzID0gdGhpcy5maWx0ZXIoKVxyXG4gIHJlcy5nZXQgPSAnKCcgKyByZXMuZ2V0ICsgJyknO1xyXG4gIHJlcy5zZXQgPSByZXMuc2V0O1xyXG4gIHRoaXMubWF0Y2goJyknKTtcclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRzZXQoZ2V0LCBzZXQpe1xyXG4gIHJldHVybiB7XHJcbiAgICBnZXQ6IGdldCxcclxuICAgIHNldDogc2V0XHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUGFyc2VyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkge1xuICBpZiAodGltZW91dCkge1xuICAgIHRpbWVvdXQuY2xvc2UoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBzZXRpbW1lZGlhdGUgYXR0YWNoZXMgaXRzZWxmIHRvIHRoZSBnbG9iYWwgb2JqZWN0XG5yZXF1aXJlKFwic2V0aW1tZWRpYXRlXCIpO1xuZXhwb3J0cy5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fdGltZXJzLWJyb3dzZXJpZnlAMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIihmdW5jdGlvbiAoZ2xvYmFsLCB1bmRlZmluZWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIGlmIChnbG9iYWwuc2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgbmV4dEhhbmRsZSA9IDE7IC8vIFNwZWMgc2F5cyBncmVhdGVyIHRoYW4gemVyb1xuICAgIHZhciB0YXNrc0J5SGFuZGxlID0ge307XG4gICAgdmFyIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgIHZhciBkb2MgPSBnbG9iYWwuZG9jdW1lbnQ7XG4gICAgdmFyIHJlZ2lzdGVySW1tZWRpYXRlO1xuXG4gICAgZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGNhbGxiYWNrKSB7XG4gICAgICAvLyBDYWxsYmFjayBjYW4gZWl0aGVyIGJlIGEgZnVuY3Rpb24gb3IgYSBzdHJpbmdcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjYWxsYmFjayA9IG5ldyBGdW5jdGlvbihcIlwiICsgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgLy8gQ29weSBmdW5jdGlvbiBhcmd1bWVudHNcbiAgICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdO1xuICAgICAgfVxuICAgICAgLy8gU3RvcmUgYW5kIHJlZ2lzdGVyIHRoZSB0YXNrXG4gICAgICB2YXIgdGFzayA9IHsgY2FsbGJhY2s6IGNhbGxiYWNrLCBhcmdzOiBhcmdzIH07XG4gICAgICB0YXNrc0J5SGFuZGxlW25leHRIYW5kbGVdID0gdGFzaztcbiAgICAgIHJlZ2lzdGVySW1tZWRpYXRlKG5leHRIYW5kbGUpO1xuICAgICAgcmV0dXJuIG5leHRIYW5kbGUrKztcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW4odGFzaykge1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSB0YXNrLmNhbGxiYWNrO1xuICAgICAgICB2YXIgYXJncyA9IHRhc2suYXJncztcbiAgICAgICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIGNhbGxiYWNrKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBydW5JZlByZXNlbnQoaGFuZGxlKSB7XG4gICAgICAgIC8vIEZyb20gdGhlIHNwZWM6IFwiV2FpdCB1bnRpbCBhbnkgaW52b2NhdGlvbnMgb2YgdGhpcyBhbGdvcml0aG0gc3RhcnRlZCBiZWZvcmUgdGhpcyBvbmUgaGF2ZSBjb21wbGV0ZWQuXCJcbiAgICAgICAgLy8gU28gaWYgd2UncmUgY3VycmVudGx5IHJ1bm5pbmcgYSB0YXNrLCB3ZSdsbCBuZWVkIHRvIGRlbGF5IHRoaXMgaW52b2NhdGlvbi5cbiAgICAgICAgaWYgKGN1cnJlbnRseVJ1bm5pbmdBVGFzaykge1xuICAgICAgICAgICAgLy8gRGVsYXkgYnkgZG9pbmcgYSBzZXRUaW1lb3V0LiBzZXRJbW1lZGlhdGUgd2FzIHRyaWVkIGluc3RlYWQsIGJ1dCBpbiBGaXJlZm94IDcgaXQgZ2VuZXJhdGVkIGFcbiAgICAgICAgICAgIC8vIFwidG9vIG11Y2ggcmVjdXJzaW9uXCIgZXJyb3IuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciB0YXNrID0gdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJ1bih0YXNrKTtcbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpO1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZnVuY3Rpb24gKCkgeyBydW5JZlByZXNlbnQoaGFuZGxlKTsgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2FuVXNlUG9zdE1lc3NhZ2UoKSB7XG4gICAgICAgIC8vIFRoZSB0ZXN0IGFnYWluc3QgYGltcG9ydFNjcmlwdHNgIHByZXZlbnRzIHRoaXMgaW1wbGVtZW50YXRpb24gZnJvbSBiZWluZyBpbnN0YWxsZWQgaW5zaWRlIGEgd2ViIHdvcmtlcixcbiAgICAgICAgLy8gd2hlcmUgYGdsb2JhbC5wb3N0TWVzc2FnZWAgbWVhbnMgc29tZXRoaW5nIGNvbXBsZXRlbHkgZGlmZmVyZW50IGFuZCBjYW4ndCBiZSB1c2VkIGZvciB0aGlzIHB1cnBvc2UuXG4gICAgICAgIGlmIChnbG9iYWwucG9zdE1lc3NhZ2UgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgICAgICAgICB2YXIgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgb2xkT25NZXNzYWdlID0gZ2xvYmFsLm9ubWVzc2FnZTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gZmFsc2U7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKFwiXCIsIFwiKlwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5vbm1lc3NhZ2UgPSBvbGRPbk1lc3NhZ2U7XG4gICAgICAgICAgICByZXR1cm4gcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICAvLyBJbnN0YWxscyBhbiBldmVudCBoYW5kbGVyIG9uIGBnbG9iYWxgIGZvciB0aGUgYG1lc3NhZ2VgIGV2ZW50OiBzZWVcbiAgICAgICAgLy8gKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9ET00vd2luZG93LnBvc3RNZXNzYWdlXG4gICAgICAgIC8vICogaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay9tdWx0aXBhZ2UvY29tbXMuaHRtbCNjcm9zc0RvY3VtZW50TWVzc2FnZXNcblxuICAgICAgICB2YXIgbWVzc2FnZVByZWZpeCA9IFwic2V0SW1tZWRpYXRlJFwiICsgTWF0aC5yYW5kb20oKSArIFwiJFwiO1xuICAgICAgICB2YXIgb25HbG9iYWxNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UgPT09IGdsb2JhbCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBldmVudC5kYXRhID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YS5pbmRleE9mKG1lc3NhZ2VQcmVmaXgpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KCtldmVudC5kYXRhLnNsaWNlKG1lc3NhZ2VQcmVmaXgubGVuZ3RoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBnbG9iYWwuYXR0YWNoRXZlbnQoXCJvbm1lc3NhZ2VcIiwgb25HbG9iYWxNZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UobWVzc2FnZVByZWZpeCArIGhhbmRsZSwgXCIqXCIpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaGFuZGxlID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGh0bWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgPHNjcmlwdD4gZWxlbWVudDsgaXRzIHJlYWR5c3RhdGVjaGFuZ2UgZXZlbnQgd2lsbCBiZSBmaXJlZCBhc3luY2hyb25vdXNseSBvbmNlIGl0IGlzIGluc2VydGVkXG4gICAgICAgICAgICAvLyBpbnRvIHRoZSBkb2N1bWVudC4gRG8gc28sIHRodXMgcXVldWluZyB1cCB0aGUgdGFzay4gUmVtZW1iZXIgdG8gY2xlYW4gdXAgb25jZSBpdCdzIGJlZW4gY2FsbGVkLlxuICAgICAgICAgICAgdmFyIHNjcmlwdCA9IGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgICAgc2NyaXB0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBodG1sLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIElmIHN1cHBvcnRlZCwgd2Ugc2hvdWxkIGF0dGFjaCB0byB0aGUgcHJvdG90eXBlIG9mIGdsb2JhbCwgc2luY2UgdGhhdCBpcyB3aGVyZSBzZXRUaW1lb3V0IGV0IGFsLiBsaXZlLlxuICAgIHZhciBhdHRhY2hUbyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2xvYmFsKTtcbiAgICBhdHRhY2hUbyA9IGF0dGFjaFRvICYmIGF0dGFjaFRvLnNldFRpbWVvdXQgPyBhdHRhY2hUbyA6IGdsb2JhbDtcblxuICAgIC8vIERvbid0IGdldCBmb29sZWQgYnkgZS5nLiBicm93c2VyaWZ5IGVudmlyb25tZW50cy5cbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChnbG9iYWwucHJvY2VzcykgPT09IFwiW29iamVjdCBwcm9jZXNzXVwiKSB7XG4gICAgICAgIC8vIEZvciBOb2RlLmpzIGJlZm9yZSAwLjlcbiAgICAgICAgaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoY2FuVXNlUG9zdE1lc3NhZ2UoKSkge1xuICAgICAgICAvLyBGb3Igbm9uLUlFMTAgbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxQb3N0TWVzc2FnZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGdsb2JhbC5NZXNzYWdlQ2hhbm5lbCkge1xuICAgICAgICAvLyBGb3Igd2ViIHdvcmtlcnMsIHdoZXJlIHN1cHBvcnRlZFxuICAgICAgICBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChkb2MgJiYgXCJvbnJlYWR5c3RhdGVjaGFuZ2VcIiBpbiBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSkge1xuICAgICAgICAvLyBGb3IgSUUgNuKAkzhcbiAgICAgICAgaW5zdGFsbFJlYWR5U3RhdGVDaGFuZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gRm9yIG9sZGVyIGJyb3dzZXJzXG4gICAgICAgIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKTtcbiAgICB9XG5cbiAgICBhdHRhY2hUby5zZXRJbW1lZGlhdGUgPSBzZXRJbW1lZGlhdGU7XG4gICAgYXR0YWNoVG8uY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcbn0odHlwZW9mIHNlbGYgPT09IFwidW5kZWZpbmVkXCIgPyB0eXBlb2YgZ2xvYmFsID09PSBcInVuZGVmaW5lZFwiID8gdGhpcyA6IGdsb2JhbCA6IHNlbGYpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL19zZXRpbW1lZGlhdGVAMS4wLjVAc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9fcHJvY2Vzc0AwLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHNoaW0gZm9yIGVzNVxyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIHRzdHIgPSAoe30pLnRvU3RyaW5nO1xyXG5cclxuZnVuY3Rpb24gZXh0ZW5kKG8xLCBvMiApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYoIG8xW2ldID09PSB1bmRlZmluZWQpe1xyXG4gICAgbzFbaV0gPSBvMltpXVxyXG4gIH1cclxuICByZXR1cm4gbzI7XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgLy8gU3RyaW5nIHByb3RvIDtcclxuICBleHRlbmQoU3RyaW5nLnByb3RvdHlwZSwge1xyXG4gICAgdHJpbTogZnVuY3Rpb24oKXtcclxuICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbiAgLy8gQXJyYXkgcHJvdG87XHJcbiAgZXh0ZW5kKEFycmF5LnByb3RvdHlwZSwge1xyXG4gICAgaW5kZXhPZjogZnVuY3Rpb24ob2JqLCBmcm9tKXtcclxuICAgICAgZnJvbSA9IGZyb20gfHwgMDtcclxuICAgICAgZm9yICh2YXIgaSA9IGZyb20sIGxlbiA9IHRoaXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAodGhpc1tpXSA9PT0gb2JqKSByZXR1cm4gaTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9LFxyXG4gICAgLy8gcG9seWZpbGwgZnJvbSBNRE4gXHJcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoXHJcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjYWxsYmFjaywgY3R4KXtcclxuICAgICAgdmFyIGsgPSAwO1xyXG5cclxuICAgICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmcgdGhlIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXHJcbiAgICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG5cclxuICAgICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwOyBcclxuXHJcbiAgICAgIGlmICggdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggY2FsbGJhY2sgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxyXG4gICAgICB3aGlsZSggayA8IGxlbiApIHtcclxuXHJcbiAgICAgICAgdmFyIGtWYWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKCBrIGluIE8gKSB7XHJcblxyXG4gICAgICAgICAga1ZhbHVlID0gT1sgayBdO1xyXG5cclxuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoIGN0eCwga1ZhbHVlLCBrLCBPICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGsrKztcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIEBkZXByZWNhdGVkXHJcbiAgICAvLyAgd2lsbCBiZSByZW1vdmVkIGF0IDAuNS4wXHJcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGZ1biwgY29udGV4dCl7XHJcblxyXG4gICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcclxuICAgICAgdmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xyXG4gICAgICBpZiAodHlwZW9mIGZ1biAhPT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcclxuXHJcbiAgICAgIHZhciByZXMgPSBbXTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcclxuICAgICAge1xyXG4gICAgICAgIGlmIChpIGluIHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIHZhbCA9IHRbaV07XHJcbiAgICAgICAgICBpZiAoZnVuLmNhbGwoY29udGV4dCwgdmFsLCBpLCB0KSlcclxuICAgICAgICAgICAgcmVzLnB1c2godmFsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIC8vIEZ1bmN0aW9uIHByb3RvO1xyXG4gIGV4dGVuZChGdW5jdGlvbi5wcm90b3R5cGUsIHtcclxuICAgIGJpbmQ6IGZ1bmN0aW9uKGNvbnRleHQpe1xyXG4gICAgICB2YXIgZm4gPSB0aGlzO1xyXG4gICAgICB2YXIgcHJlQXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGFyZ3MgPSBwcmVBcmdzLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xyXG4gICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgXHJcbiAgLy8gQXJyYXlcclxuICBleHRlbmQoQXJyYXksIHtcclxuICAgIGlzQXJyYXk6IGZ1bmN0aW9uKGFycil7XHJcbiAgICAgIHJldHVybiB0c3RyLmNhbGwoYXJyKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xyXG4gICAgfVxyXG4gIH0pXHJcbn1cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9oZWxwZXIvc2hpbS5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEzNTQwNjQvaG93LXRvLWNvbnZlcnQtY2hhcmFjdGVycy10by1odG1sLWVudGl0aWVzLXVzaW5nLXBsYWluLWphdmFzY3JpcHRcclxudmFyIGVudGl0aWVzID0ge1xyXG4gICdxdW90JzozNCwgXHJcbiAgJ2FtcCc6MzgsIFxyXG4gICdhcG9zJzozOSwgXHJcbiAgJ2x0Jzo2MCwgXHJcbiAgJ2d0Jzo2MiwgXHJcbiAgJ25ic3AnOjE2MCwgXHJcbiAgJ2lleGNsJzoxNjEsIFxyXG4gICdjZW50JzoxNjIsIFxyXG4gICdwb3VuZCc6MTYzLCBcclxuICAnY3VycmVuJzoxNjQsIFxyXG4gICd5ZW4nOjE2NSwgXHJcbiAgJ2JydmJhcic6MTY2LCBcclxuICAnc2VjdCc6MTY3LCBcclxuICAndW1sJzoxNjgsIFxyXG4gICdjb3B5JzoxNjksIFxyXG4gICdvcmRmJzoxNzAsIFxyXG4gICdsYXF1byc6MTcxLCBcclxuICAnbm90JzoxNzIsIFxyXG4gICdzaHknOjE3MywgXHJcbiAgJ3JlZyc6MTc0LCBcclxuICAnbWFjcic6MTc1LCBcclxuICAnZGVnJzoxNzYsIFxyXG4gICdwbHVzbW4nOjE3NywgXHJcbiAgJ3N1cDInOjE3OCwgXHJcbiAgJ3N1cDMnOjE3OSwgXHJcbiAgJ2FjdXRlJzoxODAsIFxyXG4gICdtaWNybyc6MTgxLCBcclxuICAncGFyYSc6MTgyLCBcclxuICAnbWlkZG90JzoxODMsIFxyXG4gICdjZWRpbCc6MTg0LCBcclxuICAnc3VwMSc6MTg1LCBcclxuICAnb3JkbSc6MTg2LCBcclxuICAncmFxdW8nOjE4NywgXHJcbiAgJ2ZyYWMxNCc6MTg4LCBcclxuICAnZnJhYzEyJzoxODksIFxyXG4gICdmcmFjMzQnOjE5MCwgXHJcbiAgJ2lxdWVzdCc6MTkxLCBcclxuICAnQWdyYXZlJzoxOTIsIFxyXG4gICdBYWN1dGUnOjE5MywgXHJcbiAgJ0FjaXJjJzoxOTQsIFxyXG4gICdBdGlsZGUnOjE5NSwgXHJcbiAgJ0F1bWwnOjE5NiwgXHJcbiAgJ0FyaW5nJzoxOTcsIFxyXG4gICdBRWxpZyc6MTk4LCBcclxuICAnQ2NlZGlsJzoxOTksIFxyXG4gICdFZ3JhdmUnOjIwMCwgXHJcbiAgJ0VhY3V0ZSc6MjAxLCBcclxuICAnRWNpcmMnOjIwMiwgXHJcbiAgJ0V1bWwnOjIwMywgXHJcbiAgJ0lncmF2ZSc6MjA0LCBcclxuICAnSWFjdXRlJzoyMDUsIFxyXG4gICdJY2lyYyc6MjA2LCBcclxuICAnSXVtbCc6MjA3LCBcclxuICAnRVRIJzoyMDgsIFxyXG4gICdOdGlsZGUnOjIwOSwgXHJcbiAgJ09ncmF2ZSc6MjEwLCBcclxuICAnT2FjdXRlJzoyMTEsIFxyXG4gICdPY2lyYyc6MjEyLCBcclxuICAnT3RpbGRlJzoyMTMsIFxyXG4gICdPdW1sJzoyMTQsIFxyXG4gICd0aW1lcyc6MjE1LCBcclxuICAnT3NsYXNoJzoyMTYsIFxyXG4gICdVZ3JhdmUnOjIxNywgXHJcbiAgJ1VhY3V0ZSc6MjE4LCBcclxuICAnVWNpcmMnOjIxOSwgXHJcbiAgJ1V1bWwnOjIyMCwgXHJcbiAgJ1lhY3V0ZSc6MjIxLCBcclxuICAnVEhPUk4nOjIyMiwgXHJcbiAgJ3N6bGlnJzoyMjMsIFxyXG4gICdhZ3JhdmUnOjIyNCwgXHJcbiAgJ2FhY3V0ZSc6MjI1LCBcclxuICAnYWNpcmMnOjIyNiwgXHJcbiAgJ2F0aWxkZSc6MjI3LCBcclxuICAnYXVtbCc6MjI4LCBcclxuICAnYXJpbmcnOjIyOSwgXHJcbiAgJ2FlbGlnJzoyMzAsIFxyXG4gICdjY2VkaWwnOjIzMSwgXHJcbiAgJ2VncmF2ZSc6MjMyLCBcclxuICAnZWFjdXRlJzoyMzMsIFxyXG4gICdlY2lyYyc6MjM0LCBcclxuICAnZXVtbCc6MjM1LCBcclxuICAnaWdyYXZlJzoyMzYsIFxyXG4gICdpYWN1dGUnOjIzNywgXHJcbiAgJ2ljaXJjJzoyMzgsIFxyXG4gICdpdW1sJzoyMzksIFxyXG4gICdldGgnOjI0MCwgXHJcbiAgJ250aWxkZSc6MjQxLCBcclxuICAnb2dyYXZlJzoyNDIsIFxyXG4gICdvYWN1dGUnOjI0MywgXHJcbiAgJ29jaXJjJzoyNDQsIFxyXG4gICdvdGlsZGUnOjI0NSwgXHJcbiAgJ291bWwnOjI0NiwgXHJcbiAgJ2RpdmlkZSc6MjQ3LCBcclxuICAnb3NsYXNoJzoyNDgsIFxyXG4gICd1Z3JhdmUnOjI0OSwgXHJcbiAgJ3VhY3V0ZSc6MjUwLCBcclxuICAndWNpcmMnOjI1MSwgXHJcbiAgJ3V1bWwnOjI1MiwgXHJcbiAgJ3lhY3V0ZSc6MjUzLCBcclxuICAndGhvcm4nOjI1NCwgXHJcbiAgJ3l1bWwnOjI1NSwgXHJcbiAgJ2Zub2YnOjQwMiwgXHJcbiAgJ0FscGhhJzo5MTMsIFxyXG4gICdCZXRhJzo5MTQsIFxyXG4gICdHYW1tYSc6OTE1LCBcclxuICAnRGVsdGEnOjkxNiwgXHJcbiAgJ0Vwc2lsb24nOjkxNywgXHJcbiAgJ1pldGEnOjkxOCwgXHJcbiAgJ0V0YSc6OTE5LCBcclxuICAnVGhldGEnOjkyMCwgXHJcbiAgJ0lvdGEnOjkyMSwgXHJcbiAgJ0thcHBhJzo5MjIsIFxyXG4gICdMYW1iZGEnOjkyMywgXHJcbiAgJ011Jzo5MjQsIFxyXG4gICdOdSc6OTI1LCBcclxuICAnWGknOjkyNiwgXHJcbiAgJ09taWNyb24nOjkyNywgXHJcbiAgJ1BpJzo5MjgsIFxyXG4gICdSaG8nOjkyOSwgXHJcbiAgJ1NpZ21hJzo5MzEsIFxyXG4gICdUYXUnOjkzMiwgXHJcbiAgJ1Vwc2lsb24nOjkzMywgXHJcbiAgJ1BoaSc6OTM0LCBcclxuICAnQ2hpJzo5MzUsIFxyXG4gICdQc2knOjkzNiwgXHJcbiAgJ09tZWdhJzo5MzcsIFxyXG4gICdhbHBoYSc6OTQ1LCBcclxuICAnYmV0YSc6OTQ2LCBcclxuICAnZ2FtbWEnOjk0NywgXHJcbiAgJ2RlbHRhJzo5NDgsIFxyXG4gICdlcHNpbG9uJzo5NDksIFxyXG4gICd6ZXRhJzo5NTAsIFxyXG4gICdldGEnOjk1MSwgXHJcbiAgJ3RoZXRhJzo5NTIsIFxyXG4gICdpb3RhJzo5NTMsIFxyXG4gICdrYXBwYSc6OTU0LCBcclxuICAnbGFtYmRhJzo5NTUsIFxyXG4gICdtdSc6OTU2LCBcclxuICAnbnUnOjk1NywgXHJcbiAgJ3hpJzo5NTgsIFxyXG4gICdvbWljcm9uJzo5NTksIFxyXG4gICdwaSc6OTYwLCBcclxuICAncmhvJzo5NjEsIFxyXG4gICdzaWdtYWYnOjk2MiwgXHJcbiAgJ3NpZ21hJzo5NjMsIFxyXG4gICd0YXUnOjk2NCwgXHJcbiAgJ3Vwc2lsb24nOjk2NSwgXHJcbiAgJ3BoaSc6OTY2LCBcclxuICAnY2hpJzo5NjcsIFxyXG4gICdwc2knOjk2OCwgXHJcbiAgJ29tZWdhJzo5NjksIFxyXG4gICd0aGV0YXN5bSc6OTc3LCBcclxuICAndXBzaWgnOjk3OCwgXHJcbiAgJ3Bpdic6OTgyLCBcclxuICAnYnVsbCc6ODIyNiwgXHJcbiAgJ2hlbGxpcCc6ODIzMCwgXHJcbiAgJ3ByaW1lJzo4MjQyLCBcclxuICAnUHJpbWUnOjgyNDMsIFxyXG4gICdvbGluZSc6ODI1NCwgXHJcbiAgJ2ZyYXNsJzo4MjYwLCBcclxuICAnd2VpZXJwJzo4NDcyLCBcclxuICAnaW1hZ2UnOjg0NjUsIFxyXG4gICdyZWFsJzo4NDc2LCBcclxuICAndHJhZGUnOjg0ODIsIFxyXG4gICdhbGVmc3ltJzo4NTAxLCBcclxuICAnbGFycic6ODU5MiwgXHJcbiAgJ3VhcnInOjg1OTMsIFxyXG4gICdyYXJyJzo4NTk0LCBcclxuICAnZGFycic6ODU5NSwgXHJcbiAgJ2hhcnInOjg1OTYsIFxyXG4gICdjcmFycic6ODYyOSwgXHJcbiAgJ2xBcnInOjg2NTYsIFxyXG4gICd1QXJyJzo4NjU3LCBcclxuICAnckFycic6ODY1OCwgXHJcbiAgJ2RBcnInOjg2NTksIFxyXG4gICdoQXJyJzo4NjYwLCBcclxuICAnZm9yYWxsJzo4NzA0LCBcclxuICAncGFydCc6ODcwNiwgXHJcbiAgJ2V4aXN0Jzo4NzA3LCBcclxuICAnZW1wdHknOjg3MDksIFxyXG4gICduYWJsYSc6ODcxMSwgXHJcbiAgJ2lzaW4nOjg3MTIsIFxyXG4gICdub3Rpbic6ODcxMywgXHJcbiAgJ25pJzo4NzE1LCBcclxuICAncHJvZCc6ODcxOSwgXHJcbiAgJ3N1bSc6ODcyMSwgXHJcbiAgJ21pbnVzJzo4NzIyLCBcclxuICAnbG93YXN0Jzo4NzI3LCBcclxuICAncmFkaWMnOjg3MzAsIFxyXG4gICdwcm9wJzo4NzMzLCBcclxuICAnaW5maW4nOjg3MzQsIFxyXG4gICdhbmcnOjg3MzYsIFxyXG4gICdhbmQnOjg3NDMsIFxyXG4gICdvcic6ODc0NCwgXHJcbiAgJ2NhcCc6ODc0NSwgXHJcbiAgJ2N1cCc6ODc0NiwgXHJcbiAgJ2ludCc6ODc0NywgXHJcbiAgJ3RoZXJlNCc6ODc1NiwgXHJcbiAgJ3NpbSc6ODc2NCwgXHJcbiAgJ2NvbmcnOjg3NzMsIFxyXG4gICdhc3ltcCc6ODc3NiwgXHJcbiAgJ25lJzo4ODAwLCBcclxuICAnZXF1aXYnOjg4MDEsIFxyXG4gICdsZSc6ODgwNCwgXHJcbiAgJ2dlJzo4ODA1LCBcclxuICAnc3ViJzo4ODM0LCBcclxuICAnc3VwJzo4ODM1LCBcclxuICAnbnN1Yic6ODgzNiwgXHJcbiAgJ3N1YmUnOjg4MzgsIFxyXG4gICdzdXBlJzo4ODM5LCBcclxuICAnb3BsdXMnOjg4NTMsIFxyXG4gICdvdGltZXMnOjg4NTUsIFxyXG4gICdwZXJwJzo4ODY5LCBcclxuICAnc2RvdCc6ODkwMSwgXHJcbiAgJ2xjZWlsJzo4OTY4LCBcclxuICAncmNlaWwnOjg5NjksIFxyXG4gICdsZmxvb3InOjg5NzAsIFxyXG4gICdyZmxvb3InOjg5NzEsIFxyXG4gICdsYW5nJzo5MDAxLCBcclxuICAncmFuZyc6OTAwMiwgXHJcbiAgJ2xveic6OTY3NCwgXHJcbiAgJ3NwYWRlcyc6OTgyNCwgXHJcbiAgJ2NsdWJzJzo5ODI3LCBcclxuICAnaGVhcnRzJzo5ODI5LCBcclxuICAnZGlhbXMnOjk4MzAsIFxyXG4gICdPRWxpZyc6MzM4LCBcclxuICAnb2VsaWcnOjMzOSwgXHJcbiAgJ1NjYXJvbic6MzUyLCBcclxuICAnc2Nhcm9uJzozNTMsIFxyXG4gICdZdW1sJzozNzYsIFxyXG4gICdjaXJjJzo3MTAsIFxyXG4gICd0aWxkZSc6NzMyLCBcclxuICAnZW5zcCc6ODE5NCwgXHJcbiAgJ2Vtc3AnOjgxOTUsIFxyXG4gICd0aGluc3AnOjgyMDEsIFxyXG4gICd6d25qJzo4MjA0LCBcclxuICAnendqJzo4MjA1LCBcclxuICAnbHJtJzo4MjA2LCBcclxuICAncmxtJzo4MjA3LCBcclxuICAnbmRhc2gnOjgyMTEsIFxyXG4gICdtZGFzaCc6ODIxMiwgXHJcbiAgJ2xzcXVvJzo4MjE2LCBcclxuICAncnNxdW8nOjgyMTcsIFxyXG4gICdzYnF1byc6ODIxOCwgXHJcbiAgJ2xkcXVvJzo4MjIwLCBcclxuICAncmRxdW8nOjgyMjEsIFxyXG4gICdiZHF1byc6ODIyMiwgXHJcbiAgJ2RhZ2dlcic6ODIyNCwgXHJcbiAgJ0RhZ2dlcic6ODIyNSwgXHJcbiAgJ3Blcm1pbCc6ODI0MCwgXHJcbiAgJ2xzYXF1byc6ODI0OSwgXHJcbiAgJ3JzYXF1byc6ODI1MCwgXHJcbiAgJ2V1cm8nOjgzNjRcclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyAgPSBlbnRpdGllcztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGVsZW1lbnQ6IGZ1bmN0aW9uKG5hbWUsIGF0dHJzLCBjaGlsZHJlbil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnZWxlbWVudCcsXHJcbiAgICAgIHRhZzogbmFtZSxcclxuICAgICAgYXR0cnM6IGF0dHJzLFxyXG4gICAgICBjaGlsZHJlbjogY2hpbGRyZW5cclxuICAgIH1cclxuICB9LFxyXG4gIGF0dHJpYnV0ZTogZnVuY3Rpb24obmFtZSwgdmFsdWUsIG1kZil7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgICBtZGY6IG1kZlxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXCJpZlwiOiBmdW5jdGlvbih0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2lmJyxcclxuICAgICAgdGVzdDogdGVzdCxcclxuICAgICAgY29uc2VxdWVudDogY29uc2VxdWVudCxcclxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGVcclxuICAgIH1cclxuICB9LFxyXG4gIGxpc3Q6IGZ1bmN0aW9uKHNlcXVlbmNlLCB2YXJpYWJsZSwgYm9keSwgYWx0ZXJuYXRlLCB0cmFjayl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnbGlzdCcsXHJcbiAgICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcclxuICAgICAgYWx0ZXJuYXRlOiBhbHRlcm5hdGUsXHJcbiAgICAgIHZhcmlhYmxlOiB2YXJpYWJsZSxcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgdHJhY2s6IHRyYWNrXHJcbiAgICB9XHJcbiAgfSxcclxuICBleHByZXNzaW9uOiBmdW5jdGlvbiggYm9keSwgc2V0Ym9keSwgY29uc3RhbnQsIGZpbHRlcnMgKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwiZXhwcmVzc2lvblwiLFxyXG4gICAgICBib2R5OiBib2R5LFxyXG4gICAgICBjb25zdGFudDogY29uc3RhbnQgfHwgZmFsc2UsXHJcbiAgICAgIHNldGJvZHk6IHNldGJvZHkgfHwgZmFsc2UsXHJcbiAgICAgIGZpbHRlcnM6IGZpbHRlcnNcclxuICAgIH1cclxuICB9LFxyXG4gIHRleHQ6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgIHRleHQ6IHRleHRcclxuICAgIH1cclxuICB9LFxyXG4gIHRlbXBsYXRlOiBmdW5jdGlvbih0ZW1wbGF0ZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAndGVtcGxhdGUnLFxyXG4gICAgICBjb250ZW50OiB0ZW1wbGF0ZVxyXG4gICAgfVxyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvbm9kZS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgXyA9IHJlcXVpcmUoXCIuLi91dGlsLmpzXCIpO1xyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxuXHJcbi8vIHNvbWUgY3VzdG9tIHRhZyAgd2lsbCBjb25mbGljdCB3aXRoIHRoZSBMZXhlciBwcm9ncmVzc1xyXG52YXIgY29uZmxpY3RUYWcgPSB7XCJ9XCI6IFwie1wiLCBcIl1cIjogXCJbXCJ9LCBtYXAxLCBtYXAyO1xyXG4vLyBzb21lIG1hY3JvIGZvciBsZXhlclxyXG52YXIgbWFjcm8gPSB7XHJcbiAgJ05BTUUnOiAvKD86WzpfQS1aYS16XVstXFwuOl8wLTlBLVphLXpdKikvLFxyXG4gICdJREVOVCc6IC9bXFwkX0EtWmEtel1bXzAtOUEtWmEtelxcJF0qLyxcclxuICAnU1BBQ0UnOiAvW1xcclxcblxcdFxcZiBdL1xyXG59XHJcblxyXG5cclxudmFyIHRlc3QgPSAvYXwoYikvLmV4ZWMoXCJhXCIpO1xyXG52YXIgdGVzdFN1YkNhcHVyZSA9IHRlc3QgJiYgdGVzdFsxXSA9PT0gdW5kZWZpbmVkPyBcclxuICBmdW5jdGlvbihzdHIpeyByZXR1cm4gc3RyICE9PSB1bmRlZmluZWQgfVxyXG4gIDpmdW5jdGlvbihzdHIpe3JldHVybiAhIXN0cn07XHJcblxyXG5mdW5jdGlvbiB3cmFwSGFuZGVyKGhhbmRsZXIpe1xyXG4gIHJldHVybiBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiBoYW5kbGVyLCB2YWx1ZTogYWxsIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIExleGVyKGlucHV0LCBvcHRzKXtcclxuICBpZihjb25mbGljdFRhZ1tjb25maWcuRU5EXSl7XHJcbiAgICB0aGlzLm1hcmtTdGFydCA9IGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdO1xyXG4gICAgdGhpcy5tYXJrRW5kID0gY29uZmlnLkVORDtcclxuICB9XHJcblxyXG4gIHRoaXMuaW5wdXQgPSAoaW5wdXR8fFwiXCIpLnRyaW0oKTtcclxuICB0aGlzLm9wdHMgPSBvcHRzIHx8IHt9O1xyXG4gIHRoaXMubWFwID0gdGhpcy5vcHRzLm1vZGUgIT09IDI/ICBtYXAxOiBtYXAyO1xyXG4gIHRoaXMuc3RhdGVzID0gW1wiSU5JVFwiXTtcclxuICBpZihvcHRzICYmIG9wdHMuZXhwcmVzc2lvbil7XHJcbiAgICAgdGhpcy5zdGF0ZXMucHVzaChcIkpTVFwiKTtcclxuICAgICB0aGlzLmV4cHJlc3Npb24gPSB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxudmFyIGxvID0gTGV4ZXIucHJvdG90eXBlXHJcblxyXG5cclxubG8ubGV4ID0gZnVuY3Rpb24oc3RyKXtcclxuICBzdHIgPSAoc3RyIHx8IHRoaXMuaW5wdXQpLnRyaW0oKTtcclxuICB2YXIgdG9rZW5zID0gW10sIHNwbGl0LCB0ZXN0LG1sZW4sIHRva2VuLCBzdGF0ZTtcclxuICB0aGlzLmlucHV0ID0gc3RyLCBcclxuICB0aGlzLm1hcmtzID0gMDtcclxuICAvLyBpbml0IHRoZSBwb3MgaW5kZXhcclxuICB0aGlzLmluZGV4PTA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHdoaWxlKHN0cil7XHJcbiAgICBpKytcclxuICAgIHN0YXRlID0gdGhpcy5zdGF0ZSgpO1xyXG4gICAgc3BsaXQgPSB0aGlzLm1hcFtzdGF0ZV0gXHJcbiAgICB0ZXN0ID0gc3BsaXQuVFJVTksuZXhlYyhzdHIpO1xyXG4gICAgaWYoIXRlc3Qpe1xyXG4gICAgICB0aGlzLmVycm9yKCdVbnJlY29naW5pemVkIFRva2VuJyk7XHJcbiAgICB9XHJcbiAgICBtbGVuID0gdGVzdFswXS5sZW5ndGg7XHJcbiAgICBzdHIgPSBzdHIuc2xpY2UobWxlbilcclxuICAgIHRva2VuID0gdGhpcy5fcHJvY2Vzcy5jYWxsKHRoaXMsIHRlc3QsIHNwbGl0LCBzdHIpXHJcbiAgICBpZih0b2tlbikgdG9rZW5zLnB1c2godG9rZW4pXHJcbiAgICB0aGlzLmluZGV4ICs9IG1sZW47XHJcbiAgICAvLyBpZihzdGF0ZSA9PSAnVEFHJyB8fCBzdGF0ZSA9PSAnSlNUJykgc3RyID0gdGhpcy5za2lwc3BhY2Uoc3RyKTtcclxuICB9XHJcblxyXG4gIHRva2Vucy5wdXNoKHt0eXBlOiAnRU9GJ30pO1xyXG5cclxuICByZXR1cm4gdG9rZW5zO1xyXG59XHJcblxyXG5sby5lcnJvciA9IGZ1bmN0aW9uKG1zZyl7XHJcbiAgdGhyb3cgIEVycm9yKFwiUGFyc2UgRXJyb3I6IFwiICsgbXNnICsgICc6XFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0aGlzLmluZGV4KSk7XHJcbn1cclxuXHJcbmxvLl9wcm9jZXNzID0gZnVuY3Rpb24oYXJncywgc3BsaXQsc3RyKXtcclxuICAvLyBjb25zb2xlLmxvZyhhcmdzLmpvaW4oXCIsXCIpLCB0aGlzLnN0YXRlKCkpXHJcbiAgdmFyIGxpbmtzID0gc3BsaXQubGlua3MsIG1hcmNoZWQgPSBmYWxzZSwgdG9rZW47XHJcblxyXG4gIGZvcih2YXIgbGVuID0gbGlua3MubGVuZ3RoLCBpPTA7aTxsZW4gO2krKyl7XHJcbiAgICB2YXIgbGluayA9IGxpbmtzW2ldLFxyXG4gICAgICBoYW5kbGVyID0gbGlua1syXSxcclxuICAgICAgaW5kZXggPSBsaW5rWzBdO1xyXG4gICAgLy8gaWYoYXJnc1s2XSA9PT0gJz4nICYmIGluZGV4ID09PSA2KSBjb25zb2xlLmxvZygnaGFoYScpXHJcbiAgICBpZih0ZXN0U3ViQ2FwdXJlKGFyZ3NbaW5kZXhdKSkge1xyXG4gICAgICBtYXJjaGVkID0gdHJ1ZTtcclxuICAgICAgaWYoaGFuZGxlcil7XHJcbiAgICAgICAgdG9rZW4gPSBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3Muc2xpY2UoaW5kZXgsIGluZGV4ICsgbGlua1sxXSkpXHJcbiAgICAgICAgaWYodG9rZW4pICB0b2tlbi5wb3MgPSB0aGlzLmluZGV4O1xyXG4gICAgICB9XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZighbWFyY2hlZCl7IC8vIGluIGllIGx0OCAuIHN1YiBjYXB0dXJlIGlzIFwiXCIgYnV0IG9udCBcclxuICAgIHN3aXRjaChzdHIuY2hhckF0KDApKXtcclxuICAgICAgY2FzZSBcIjxcIjpcclxuICAgICAgICB0aGlzLmVudGVyKFwiVEFHXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJKU1RcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0b2tlbjtcclxufVxyXG5sby5lbnRlciA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB0aGlzLnN0YXRlcy5wdXNoKHN0YXRlKVxyXG4gIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5sby5zdGF0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIHJldHVybiBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXTtcclxufVxyXG5cclxubG8ubGVhdmUgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdmFyIHN0YXRlcyA9IHRoaXMuc3RhdGVzO1xyXG4gIGlmKCFzdGF0ZSB8fCBzdGF0ZXNbc3RhdGVzLmxlbmd0aC0xXSA9PT0gc3RhdGUpIHN0YXRlcy5wb3AoKVxyXG59XHJcblxyXG5cclxuTGV4ZXIuc2V0dXAgPSBmdW5jdGlvbigpe1xyXG4gIG1hY3JvLkVORCA9IGNvbmZpZy5FTkQ7XHJcbiAgbWFjcm8uQkVHSU4gPSBjb25maWcuQkVHSU47XHJcbiAgLy9cclxuICBtYXAxID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVRcclxuICAgIHJ1bGVzLkVOVEVSX0pTVCxcclxuICAgIHJ1bGVzLkVOVEVSX1RBRyxcclxuICAgIHJ1bGVzLlRFWFQsXHJcblxyXG4gICAgLy9UQUdcclxuICAgIHJ1bGVzLlRBR19OQU1FLFxyXG4gICAgcnVsZXMuVEFHX09QRU4sXHJcbiAgICBydWxlcy5UQUdfQ0xPU0UsXHJcbiAgICBydWxlcy5UQUdfUFVOQ0hPUixcclxuICAgIHJ1bGVzLlRBR19FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5UQUdfVU5RX1ZBTFVFLFxyXG4gICAgcnVsZXMuVEFHX1NUUklORyxcclxuICAgIHJ1bGVzLlRBR19TUEFDRSxcclxuICAgIHJ1bGVzLlRBR19DT01NRU5ULFxyXG5cclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcblxyXG4gIC8vIGlnbm9yZWQgdGhlIHRhZy1yZWxhdGl2ZSB0b2tlblxyXG4gIG1hcDIgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVCBubyA8IHJlc3RyaWN0XHJcbiAgICBydWxlcy5FTlRFUl9KU1QyLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuICAgIC8vIEpTVFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9FWFBSX09QRU4sXHJcbiAgICBydWxlcy5KU1RfSURFTlQsXHJcbiAgICBydWxlcy5KU1RfU1BBQ0UsXHJcbiAgICBydWxlcy5KU1RfTEVBVkUsXHJcbiAgICBydWxlcy5KU1RfTlVNQkVSLFxyXG4gICAgcnVsZXMuSlNUX1BVTkNIT1IsXHJcbiAgICBydWxlcy5KU1RfU1RSSU5HLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlRcclxuICAgIF0pXHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZW5NYXAocnVsZXMpe1xyXG4gIHZhciBydWxlLCBtYXAgPSB7fSwgc2lnbjtcclxuICBmb3IodmFyIGkgPSAwLCBsZW4gPSBydWxlcy5sZW5ndGg7IGkgPCBsZW4gOyBpKyspe1xyXG4gICAgcnVsZSA9IHJ1bGVzW2ldO1xyXG4gICAgc2lnbiA9IHJ1bGVbMl0gfHwgJ0lOSVQnO1xyXG4gICAgKCBtYXBbc2lnbl0gfHwgKG1hcFtzaWduXSA9IHtydWxlczpbXSwgbGlua3M6W119KSApLnJ1bGVzLnB1c2gocnVsZSk7XHJcbiAgfVxyXG4gIHJldHVybiBzZXR1cChtYXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXR1cChtYXApe1xyXG4gIHZhciBzcGxpdCwgcnVsZXMsIHRydW5rcywgaGFuZGxlciwgcmVnLCByZXRhaW4sIHJ1bGU7XHJcbiAgZnVuY3Rpb24gcmVwbGFjZUZuKGFsbCwgb25lKXtcclxuICAgIHJldHVybiB0eXBlb2YgbWFjcm9bb25lXSA9PT0gJ3N0cmluZyc/IFxyXG4gICAgICBfLmVzY2FwZVJlZ0V4cChtYWNyb1tvbmVdKSBcclxuICAgICAgOiBTdHJpbmcobWFjcm9bb25lXSkuc2xpY2UoMSwtMSk7XHJcbiAgfVxyXG5cclxuICBmb3IodmFyIGkgaW4gbWFwKXtcclxuXHJcbiAgICBzcGxpdCA9IG1hcFtpXTtcclxuICAgIHNwbGl0LmN1ckluZGV4ID0gMTtcclxuICAgIHJ1bGVzID0gc3BsaXQucnVsZXM7XHJcbiAgICB0cnVua3MgPSBbXTtcclxuXHJcbiAgICBmb3IodmFyIGogPSAwLGxlbiA9IHJ1bGVzLmxlbmd0aDsgajxsZW47IGorKyl7XHJcbiAgICAgIHJ1bGUgPSBydWxlc1tqXTsgXHJcbiAgICAgIHJlZyA9IHJ1bGVbMF07XHJcbiAgICAgIGhhbmRsZXIgPSBydWxlWzFdO1xyXG5cclxuICAgICAgaWYodHlwZW9mIGhhbmRsZXIgPT09ICdzdHJpbmcnKXtcclxuICAgICAgICBoYW5kbGVyID0gd3JhcEhhbmRlcihoYW5kbGVyKTtcclxuICAgICAgfVxyXG4gICAgICBpZihfLnR5cGVPZihyZWcpID09PSAncmVnZXhwJykgcmVnID0gcmVnLnRvU3RyaW5nKCkuc2xpY2UoMSwgLTEpO1xyXG5cclxuICAgICAgcmVnID0gcmVnLnJlcGxhY2UoL1xceyhcXHcrKVxcfS9nLCByZXBsYWNlRm4pXHJcbiAgICAgIHJldGFpbiA9IF8uZmluZFN1YkNhcHR1cmUocmVnKSArIDE7IFxyXG4gICAgICBzcGxpdC5saW5rcy5wdXNoKFtzcGxpdC5jdXJJbmRleCwgcmV0YWluLCBoYW5kbGVyXSk7IFxyXG4gICAgICBzcGxpdC5jdXJJbmRleCArPSByZXRhaW47XHJcbiAgICAgIHRydW5rcy5wdXNoKHJlZyk7XHJcbiAgICB9XHJcbiAgICBzcGxpdC5UUlVOSyA9IG5ldyBSZWdFeHAoXCJeKD86KFwiICsgdHJ1bmtzLmpvaW4oXCIpfChcIikgKyBcIikpXCIpXHJcbiAgfVxyXG4gIHJldHVybiBtYXA7XHJcbn1cclxuXHJcbnZhciBydWxlcyA9IHtcclxuXHJcbiAgLy8gMS4gSU5JVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAvLyBtb2RlMSdzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUOiBbL1teXFx4MDA8XSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgRU5URVJfSlNUMjogWy9bXlxceDAwXSo/KD89e0JFR0lOfSkvLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBFTlRFUl9UQUc6IFsvW15cXHgwMF0qPyg/PTxbXFx3XFwvXFwhXSkvLCBmdW5jdGlvbihhbGwpeyBcclxuICAgIHRoaXMuZW50ZXIoJ1RBRycpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgVEVYVDogWy9bXlxceDAwXSsvLCAnVEVYVCcgXSxcclxuXHJcbiAgLy8gMi4gVEFHXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICBUQUdfTkFNRTogWy97TkFNRX0vLCAnTkFNRScsICdUQUcnXSxcclxuICBUQUdfVU5RX1ZBTFVFOiBbL1teXFx7fSZcIic9PjxgXFxyXFxuXFxmXFx0IF0rLywgJ1VOUScsICdUQUcnXSxcclxuXHJcbiAgVEFHX09QRU46IFsvPCh7TkFNRX0pXFxzKi8sIGZ1bmN0aW9uKGFsbCwgb25lKXsgLy9cIlxyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX09QRU4nLCB2YWx1ZTogb25lfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfQ0xPU0U6IFsvPFxcLyh7TkFNRX0pW1xcclxcblxcZlxcdCBdKj4vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfQ0xPU0UnLCB2YWx1ZTogb25lIH1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gICAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIFRBR19FTlRFUl9KU1Q6IFsvKD89e0JFR0lOfSkvLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5lbnRlcignSlNUJyk7XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuXHJcbiAgVEFHX1BVTkNIT1I6IFsvW1xcPlxcLz0mXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZihhbGwgPT09ICc+JykgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sICdUQUcnXSxcclxuICBUQUdfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcXFwiLywgLyonKi8gIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyBcclxuICAgIHZhciB2YWx1ZSA9IG9uZSB8fCB0d28gfHwgXCJcIjtcclxuXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogdmFsdWV9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICBUQUdfU1BBQ0U6IFsve1NQQUNFfSsvLCBudWxsLCAnVEFHJ10sXHJcbiAgVEFHX0NPTU1FTlQ6IFsvPFxcIS0tKFteXFx4MDBdKj8pLS1cXD4vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgdGhpcy5sZWF2ZSgpXHJcbiAgICAvLyB0aGlzLmxlYXZlKCdUQUcnKVxyXG4gIH0gLCdUQUcnXSxcclxuXHJcbiAgLy8gMy4gSlNUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICBKU1RfT1BFTjogWyd7QkVHSU59I3tTUEFDRX0qKHtJREVOVH0pJywgZnVuY3Rpb24oYWxsLCBuYW1lKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdPUEVOJyxcclxuICAgICAgdmFsdWU6IG5hbWVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0xFQVZFOiBbL3tFTkR9LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKHRoaXMubWFya0VuZCA9PT0gYWxsICYmIHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9O1xyXG4gICAgaWYoIXRoaXMubWFya0VuZCB8fCAhdGhpcy5tYXJrcyApe1xyXG4gICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiAnRU5EJ31cclxuICAgIH1lbHNle1xyXG4gICAgICB0aGlzLm1hcmtzLS07XHJcbiAgICAgIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ0xPU0U6IFsve0JFR0lOfVxccypcXC8oe0lERU5UfSlcXHMqe0VORH0vLCBmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICB0aGlzLmxlYXZlKCdKU1QnKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdDTE9TRScsXHJcbiAgICAgIHZhbHVlOiBvbmVcclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NPTU1FTlQ6IFsve0JFR0lOfVxcIShbXlxceDAwXSo/KVxcIXtFTkR9LywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0VYUFJfT1BFTjogWyd7QkVHSU59JyxmdW5jdGlvbihhbGwsIG9uZSl7XHJcbiAgICBpZihhbGwgPT09IHRoaXMubWFya1N0YXJ0KXtcclxuICAgICAgaWYodGhpcy5leHByZXNzaW9uKSByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIGlmKHRoaXMuZmlyc3RFbnRlclN0YXJ0IHx8IHRoaXMubWFya3Mpe1xyXG4gICAgICAgIHRoaXMubWFya3MrK1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdFWFBSX09QRU4nLFxyXG4gICAgICBlc2NhcGU6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfSURFTlQ6IFsne0lERU5UfScsICdJREVOVCcsICdKU1QnXSxcclxuICBKU1RfU1BBQ0U6IFsvWyBcXHJcXG5cXGZdKy8sIG51bGwsICdKU1QnXSxcclxuICBKU1RfUFVOQ0hPUjogWy9bPSFdPz09fFstPT48KypcXC8lXFwhXT9cXD18XFx8XFx8fCYmfFxcQFxcKHxcXC5cXC58WzxcXD5cXFtcXF1cXChcXClcXC1cXHxcXHt9XFwrXFwqXFwvJT86XFwuISxdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7IHR5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwnSlNUJ10sXHJcblxyXG4gIEpTVF9TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVwiLywgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IC8vXCInXHJcbiAgICByZXR1cm4ge3R5cGU6ICdTVFJJTkcnLCB2YWx1ZTogb25lIHx8IHR3byB8fCBcIlwifVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTlVNQkVSOiBbLyg/OlswLTldKlxcLlswLTldK3xbMC05XSspKGVcXGQrKT8vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnTlVNQkVSJywgdmFsdWU6IHBhcnNlRmxvYXQoYWxsLCAxMCl9O1xyXG4gIH0sICdKU1QnXVxyXG59XHJcblxyXG5cclxuLy8gc2V0dXAgd2hlbiBmaXJzdCBjb25maWdcclxuTGV4ZXIuc2V0dXAoKTtcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBMZXhlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL0xleGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcbnZhciBFbGVtZW50ID0gcmVxdWlyZSgnLi9FbGVtZW50LmpzJyk7XHJcblxyXG52YXIgcHJvdG8gPSB7XHJcbiAgICBjcmVhdGVEb2N1bWVudEZyYWdtZW50OiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHJldHVybiBuZXcgZG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZUVsZW1lbnQ6IGZ1bmN0aW9uKHRhZ05hbWUpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRWxlbWVudCh0YWdOYW1lKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVUZXh0Tm9kZTogZnVuY3Rpb24odGV4dCl7XHJcbiAgICAgICAgcmV0dXJuIHRleHQ7XHJcbiAgICB9XHJcbn07XHJcblxyXG52YXIgZG9jID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRvYztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RvY3VtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsImZ1bmN0aW9uIEVsZW1lbnQodGFnTmFtZSl7XHJcbiAgICB0aGlzLl90YWdOYW1lID0gdGFnTmFtZTtcclxuICAgIHRoaXMuX2F0dHJzID0gW107XHJcbiAgICB0aGlzLl9ldmVudHMgPSBbXTtcclxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbn1cclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLnNldEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKGF0dHJOYW1lLCBhdHRyVmFsdWUpe1xyXG4gICAgdmFyIGV2ZW50UGF0dGVybiA9IC9vbi0vO1xyXG5cclxuICAgIGlmKGV2ZW50UGF0dGVybi50ZXN0KGF0dHJOYW1lKSkgcmV0dXJuO1xyXG5cclxuICAgIHRoaXMuX2F0dHJzLnB1c2goe25hbWU6IGF0dHJOYW1lLCB2YWx1ZTogYXR0clZhbHVlfSk7XHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnROYW1lLCBoYW5kbGVyLCBpc1BvcCwgYXJnQ29udGV4dCl7XHJcbiAgICB0aGlzLl9ldmVudHMucHVzaCh7bmFtZTogZXZlbnROYW1lLnJlcGxhY2UoLy0vLCAnJyksIHZhbHVlOiBoYW5kbGVyLCBjb250ZXh0OiBhcmdDb250ZXh0fSk7XHJcbn07XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuLnB1c2gobm9kZSk7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEVsZW1lbnQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9FbGVtZW50LmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjUxOjUzIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTIwIDE3OjA3OjIxXHJcbiAqL1xyXG5mdW5jdGlvbiBNZXNzYWdlQnVzKCkge1xyXG4gICAgdGhpcy5fb25TZW5kV29ya2VyID0gW107XHJcbiAgICB0aGlzLl9iYXNlSWQgPSAwO1xyXG4gICAgdGhpcy5faW5pdFdvcmtlcigpO1xyXG4gICAgdGhpcy5fY3JlYXRlRXZlbnRzU3RvcmUoKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NyZWF0ZUV2ZW50c1N0b3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fZXZlbnRzU3RvcmUgPSB7fTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB2YXIgSW5mbyA9IHRoaXMuX2Rlc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5fcmVjZWl2ZUJ1c1Jlc29sdmVyKEluZm8pO1xyXG4gICAgdGhpcy5fZW1pdChJbmZvLmlkLCBJbmZvLnR5cGUsIEluZm8uZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVjZWl2ZUJ1c1Jlc29sdmVyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB0aGlzLl9idWZmZXIgPSBtZXNzYWdlO1xyXG4gICAgdGhpcy5fc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uIChldmVudFR5cGUsIGZuKSB7XHJcbiAgICB0aGlzLl9yZWdpc3RlcihldmVudFR5cGUsIGZuLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciB0eXBlID0gbWVzc2FnZS5kYXRhLnR5cGUsXHJcbiAgICAgICAgZGF0YSA9IG1lc3NhZ2UuZGF0YS5kYXRhLFxyXG4gICAgICAgIGlkID0gbWVzc2FnZS5kYXRhLmlkLFxyXG4gICAgICAgIG1hbWJhSUQgPSBtZXNzYWdlLmRhdGEubWFtYmFJRDtcclxuXHJcbiAgICByZXR1cm4geyBtYW1iYUlEOiBtYW1iYUlEICwgaWQ6IGlkLCB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH07XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VyaWFsaXplID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciBJbmZvID0ge30sXHJcbiAgICAgICAgX2Jhc2VJZCA9IG1lc3NhZ2UuaWQgPSB0aGlzLl9iYXNlSWQ7XHJcblxyXG4gICAgSW5mby5pZCA9IF9iYXNlSWQ7XHJcbiAgICBJbmZvLnR5cGUgPSBtZXNzYWdlLnR5cGU7XHJcbiAgICBJbmZvLmRhdGEgPSBtZXNzYWdlLmRhdGE7XHJcbiAgICBJbmZvLm1hbWJhSUQgPSBtZXNzYWdlLm1hbWJhSUQ7XHJcblxyXG4gICAgdGhpcy5fc2VuZEluZm9Ub1dvcmtlcihJbmZvKTtcclxuICAgIHRoaXMuX2Jhc2VJZCsrO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fc2VuZEluZm9Ub1dvcmtlciA9IGZ1bmN0aW9uIChJbmZvKSB7XHJcbiAgICB2YXIgX29uU2VuZFdvcmtlciA9IHRoaXMuX29uU2VuZFdvcmtlcjtcclxuXHJcbiAgICB0aGlzLl9wb3N0TWVzc2FnZShJbmZvKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoX29uU2VuZFdvcmtlci5sZW5ndGgpIHRoaXMuX2NoZWNrV2F0Y2hlcnMoX29uU2VuZFdvcmtlciwgSW5mbyk7XHJcbiAgICB9LmJpbmQodGhpcyksIDApO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3Bvc3RNZXNzYWdlID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NoZWNrV2F0Y2hlcnMgPSBmdW5jdGlvbiAod2F0Y2hlcnMsIEluZm8pIHtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gd2F0Y2hlcnMubGVuZ3RoIC0gMSwgd2F0Y2hlcjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlcihJbmZvKTtcclxuICAgICAgICB3YXRjaGVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgIHRoaXMuX29uU2VuZFdvcmtlci5wdXNoKGZuKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoZm4pIHtcclxuICAgIHZhciBtZXNzYWdlID0gdGhpcy5fYnVmZmVyO1xyXG4gICAgdGhpcy5fcmVnaXN0ZXIobWVzc2FnZS5pZCwgbWVzc2FnZS50eXBlLCBmbik7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVnaXN0ZXIgPSBmdW5jdGlvbiAoaWQsIGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZighX2V2ZW50c1N0b3JlW2lkXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbaWRdID0ge307XHJcblxyXG4gICAgaWYgKF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSlcclxuICAgICAgICBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMucHVzaChmbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2lkXVtldmVudE5hbWVdID0geyB3YXRjaGVyczogW2ZuXSB9O1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2VtaXQgPSBmdW5jdGlvbiAoaWQsIGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgdmFyIF9ldmVudHNTdG9yZSA9IHRoaXMuX2V2ZW50c1N0b3JlO1xyXG5cclxuICAgIGlmIChfZXZlbnRzU3RvcmVbaWRdICYmIF9ldmVudHNTdG9yZVtpZF1bZXZlbnROYW1lXSAmJiBfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGVXYXRjaGVycyhfZXZlbnRzU3RvcmVbaWRdW2V2ZW50TmFtZV0ud2F0Y2hlcnMsIGRhdGEpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2V4ZWN1dGVXYXRjaGVycyA9IGZ1bmN0aW9uICh3YXRjaGVycywgZGF0YSkge1xyXG4gICAgZm9yICh2YXIgaSA9IHdhdGNoZXJzLmxlbmd0aCAtIDEsIHdhdGNoZXI7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgd2F0Y2hlciA9IHdhdGNoZXJzW2ldO1xyXG4gICAgICAgIHdhdGNoZXIoZGF0YSk7XHJcbiAgICAgICAgd2F0Y2hlcnMuc3BsaWNlKGksIDEpO1xyXG4gICAgfVxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0OTowMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMjo1NDo0OVxyXG4gKi9cclxuXHJcbnZhciBNZXNzYWdlQnVzID0gcmVxdWlyZSgnLi9tZXNzYWdlQnVzL1dvcmtlck1zZ0J1cy5qcycpO1xyXG52YXIgV0tSZW5kZXJTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUvV0tSZW5kZXJTdG9yZS5qcycpO1xyXG52YXIgRGlmZmVyID0gcmVxdWlyZSgnLi92ZG9tL0RpZmZlci5qcycpO1xyXG5cclxudmFyIG15TWVzc2FnZUJ1cyA9IG5ldyBNZXNzYWdlQnVzKCk7XHJcblxyXG4vKip2LWRvbVN0b3JlICovXHJcbnZhciBWZG9tU3RvcmUgPSB7fTtcclxuXHJcbi8qKueKtuaAgeaemuS4viAqL1xyXG52YXIgSU5JVElBTF9SRU5ERVIgPSAnSU5JVElBTF9SRU5ERVInO1xyXG52YXIgVVBEQVRFX1JFTkRFUiA9ICdVUERBVEVfUkVOREVSJztcclxuXHJcbi8qKklOSVRJQUxfUkVOREVSICovXHJcbm15TWVzc2FnZUJ1cy5idWlsZFJlY2VpdmVEaXNwYXRjaGVyKElOSVRJQUxfUkVOREVSLCBmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciBkYXRhID0gZGF0YS5kYXRhLFxyXG4gICAgICAgIG1hbWJhSUQgPSBkYXRhLm1hbWJhSUQsXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgV0tSZW5kZXJTdG9yZShkYXRhKTtcclxuICAgIHN0b3JlLnJlbmRlcigpO1xyXG4gICAgVmRvbVN0b3JlW21hbWJhSURdID0gc3RvcmUudkRvbTtcclxuICAgIC8vc3RvcmUucmVuZGVyKCk7XHJcbiAgICAvL3RoaXMucmVjZWl2ZSh7dHlwZTogJ3JlbmRlcicsIGRhdGE6IHtodG1sOiBzdG9yZS5yZW5kZXJlZFN0ciwgZXZlbnRzOiBzdG9yZS5ldmVudHN9fSk7XHJcbn0pO1xyXG5cclxuLyoqVVBEQVRFX1JFTkRFUiAqL1xyXG5teU1lc3NhZ2VCdXMuYnVpbGRSZWNlaXZlRGlzcGF0Y2hlcihVUERBVEVfUkVOREVSLCBmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciBkYXRhID0gZGF0YS5kYXRhLFxyXG4gICAgICAgIG1hbWJhSUQgPSBkYXRhLm1hbWJhSUQsXHJcbiAgICAgICAgc3RvcmUgPSBuZXcgV0tSZW5kZXJTdG9yZShkYXRhKTtcclxuICAgIFxyXG4gICAgc3RvcmUucmVuZGVyKCk7XHJcbiAgICBEaWZmKFZkb21TdG9yZVttYW1iYUlEXSwgc3RvcmUudkRvbSk7XHJcbn0pO1xyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvd2tfaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDI2XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjUwOjI3IFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTIwIDEzOjExOjA1XHJcbiAqL1xyXG52YXIgTWVzc2FnZUJ1cyA9IHJlcXVpcmUoJy4vTWVzc2FnZUJ1cy5qcycpO1xyXG52YXIgRXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbHMvZXh0ZW5kLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBXb3JrZXJNc2dCdXMoKXtcclxuICAgIHRoaXMuc3VwZXIoKTtcclxuICAgIHRoaXMuX3JlY2VpdmVCdXNEaXNwYXRjaGVyID0ge307XHJcbn1cclxuXHJcbkV4dGVuZChXb3JrZXJNc2dCdXMsIE1lc3NhZ2VCdXMpO1xyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5faW5pdFdvcmtlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAvKmVzbGludC1kaXNhYmxlKi9cclxuICAgIG9ubWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLl9wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uKEluZm8pe1xyXG4gICAgLyplc2xpbnQtZGlzYWJsZSovXHJcbiAgICBwb3N0TWVzc2FnZShJbmZvKTtcclxufVxyXG5cclxuV29ya2VyTXNnQnVzLnByb3RvdHlwZS5idWlsZFJlY2VpdmVEaXNwYXRjaGVyID0gZnVuY3Rpb24odHlwZSwgZm4pe1xyXG4gICAgdmFyIGRpc3BhdGNoZXIgPSB0aGlzLl9yZWNlaXZlQnVzRGlzcGF0Y2hlcjtcclxuICAgIFxyXG4gICAgZGlzcGF0Y2hlclt0eXBlXSA9IGZuO1xyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLl9yZWNlaXZlQnVzUmVzb2x2ZXIgPSBmdW5jdGlvbihJbmZvKXtcclxuICAgIHZhciB0eXBlID0gSW5mby50eXBlLFxyXG4gICAgICAgIGRhdGEgPSBJbmZvLmRhdGEsXHJcbiAgICAgICAgbWFtYmFJRCA9IEluZm8ubWFtYmFJRCxcclxuICAgICAgICBkaXNwYXRjaGVyID0gdGhpcy5fcmVjZWl2ZUJ1c0Rpc3BhdGNoZXI7XHJcblxyXG4gICAgaWYoZGlzcGF0Y2hlclt0eXBlXSl7XHJcbiAgICAgICAgLyoqX3Zkb21TdG9yZSAqL1xyXG4gICAgICAgIGRpc3BhdGNoZXJbdHlwZV0uY2FsbCh0aGlzLCB7ZGF0YTogZGF0YSwgbWFtYmFJRDogbWFtYmFJRH0pO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd3b3JrZXIgTWVzc2dhZUJ1cyBoYXZlblxcJ3QgcmVnaXN0ZXJlZCB0eXBlOiAnK3R5cGUpO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUub25SZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKGZuKXtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV29ya2VyTXNnQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvV29ya2VyTXNnQnVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0ODo0NCBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMzoyMToyNFxyXG4gKi9cclxuXHJcbnZhciBCYXNlUmVuZGVyU3RvcmUgPSByZXF1aXJlKCcuL0Jhc2VSZW5kZXJTdG9yZS5qcycpO1xyXG52YXIgRXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbHMvZXh0ZW5kLmpzJyk7XHJcbnZhciBDb21waWxlciA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcycpO1xyXG5cclxudmFyIGRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50RnJhZ21lbnQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlclN0b3JlKG9iaikge1xyXG4gICAgdGhpcy5zdXBlcihvYmopO1xyXG4gICAgdGhpcy5ldmVudHMgPSB7fTtcclxuICAgIHRoaXMubm9kZUlkID0gMDtcclxufVxyXG5cclxuRXh0ZW5kKFJlbmRlclN0b3JlLCBCYXNlUmVuZGVyU3RvcmUpO1xyXG5cclxuUmVuZGVyU3RvcmUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX2NvbXBpbGVyID0gQ29tcGlsZXI7XHJcbiAgICB0aGlzLl90eXBlZEZsYXRlciA9IFJlbmRlclN0b3JlLnR5cGVkRmxhdGVyO1xyXG4gICAgdGhpcy52RG9tID0gdGhpcy5fY29tcGlsZSh0aGlzLkFTVCwgdGhpcy5kYXRhKTtcclxuICAgIHRoaXMucmVuZGVyZWRTdHIgPSB0aGlzLmZsYXRUb1N0cmluZyh0aGlzLnZEb20uX2NoaWxkcmVuKTtcclxufTtcclxuXHJcblJlbmRlclN0b3JlLnByb3RvdHlwZS5mbGF0VG9TdHJpbmcgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSAnJztcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IHRoaXMuZmxhdFRvU3RyaW5nKG5vZGVbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0Tm9kZShub2RlKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuZmxhdE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgdmFyIHRhZ05hbWUgPSBub2RlLl90YWdOYW1lLFxyXG4gICAgICAgIGF0dHJzID0gbm9kZS5fYXR0cnMsXHJcbiAgICAgICAgZXZlbnRzID0gbm9kZS5fZXZlbnRzLFxyXG4gICAgICAgIGNoaWxkcmVuID0gbm9kZS5fY2hpbGRyZW4sXHJcbiAgICAgICAgYm9keSA9ICcnLCBhdHRyU3RyID0gJycsIGV2ZW50U3RyID0gJycsXHJcbiAgICAgICAgbm9kZUlkID0gdGhpcy5ub2RlSWQ7XHJcblxyXG4gICAgLyoq5paH5pys6IqC54K55aSE55CGICovXHJcbiAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5o+S5YWl5a2Q6IqC54K5ICovXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgYm9keSArPSB0aGlzLmZsYXROb2RlKGNoaWxkcmVuW2ldKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipmcmFnTWVudCAqL1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudEZyYWdtZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq55Sf5oiQ5bGe5oCn5a2X56ym5LiyICovXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGF0dHJzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgYXR0clN0ciArPSAoYXR0cnNbal0ubmFtZSArICc9XCInICsgYXR0cnNbal0udmFsdWUgKyAnXCIgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu25aSE55CGICovXHJcbiAgICBpZiAoZXZlbnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGF0dHJTdHIgKz0gJ2RhdGEtbm9kZWlkPVwiJyArIG5vZGVJZCArICdcIic7XHJcbiAgICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCBldmVudHMubGVuZ3RoOyBoKyspIHtcclxuICAgICAgICAgICAgZXZlbnRzW2hdLnZhbHVlICs9ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmV2ZW50c1tub2RlSWRdID0gZXZlbnRzO1xyXG4gICAgfVxyXG4gICAgdGhpcy5ub2RlSWQrKztcclxuICAgIHJldHVybiAnPCcgKyB0YWdOYW1lICsgJyAnICsgYXR0clN0ciArIGV2ZW50U3RyICsgJz4nICsgYm9keSArICc8LycgKyB0YWdOYW1lICsgJz4nO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZW5kZXJTdG9yZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdG9yZS9XS1JlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNzoxMjozNiBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMzozNDowN1xyXG4gKi9cclxudmFyIGF0dHJSZXNvbHZlciA9IHJlcXVpcmUoJy4vYXR0clJlc29sdmVyLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBlbGVtZW50KGFzdCwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGFzdC50YWcpO1xyXG5cclxuICAgIHZhciBhdHRycyA9IGFzdC5hdHRycztcclxuICAgIC8qKuWkhOeQhuWxnuaApyAqL1xyXG4gICAgZm9yKHZhciBpPTA7aTxhdHRycy5sZW5ndGg7aSsrKXtcclxuICAgICAgICB2YXIgYXR0ciA9IGF0dHJzW2ldO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN3aXRjaChhdHRyLnR5cGUpe1xyXG4gICAgICAgICAgICBjYXNlICdhdHRyaWJ1dGUnOiBcclxuICAgICAgICAgICAgICAgIGF0dHJSZXNvbHZlcihhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbyk7IGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKirlpITnkIblrZDoioLngrkgKi9cclxuICAgIGlmKGFzdC5jaGlsZHJlbil7XHJcbiAgICAgICAgZm9yKHZhciBqPTA7ajxhc3QuY2hpbGRyZW4ubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGFzdC5jaGlsZHJlbltqXTtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoY29udGV4dC5fY29tcGlsZShjaGlsZCwgbGlzdEluZm8pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRleHQoYXN0KXtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYXN0LnRleHQpO1xyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV4cHJlc3Npb24oYXN0LCBjb250ZXh0LCBsaXN0SW5mbyl7XHJcbiAgICB2YXIgdGV4dCA9ICcnLCBnZXRWYWx1ZTtcclxuICAgIFxyXG4gICAgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiAoJyArIGFzdC5ib2R5ICsgJyknKTtcclxuICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbyB8fCBjb250ZXh0LmRhdGEsICcnKTtcclxuXHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0KGFzdCwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIGxpc3RCb2R5ID0gYXN0LmJvZHk7XHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsJ2QnLCdlJywncmV0dXJuICgnK2FzdC5zZXF1ZW5jZS5ib2R5KycpJyk7XHJcbiAgICB2YXIgYXJyYXlEYXRhID0gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB2YXIgdmFyaWFibGUgPSBhc3QudmFyaWFibGU7XHJcblxyXG4gICAgZm9yKHZhciBqPTA7ajxhcnJheURhdGEubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgbm9kZS5hcHBlbmQoaXRlbU5vZGUobGlzdEJvZHksIGFycmF5RGF0YVtqXSwgaikpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGl0ZW1Ob2RlKGJvZHksIGl0ZW0sIGluZGV4KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICB2YXIgbGlzdEluZm8gPSB7fTtcclxuXHJcbiAgICAgICAgbGlzdEluZm9bdmFyaWFibGVdID0gaXRlbTtcclxuICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZSsnX2luZGV4J10gPSBpbmRleDtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGJvZHkubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoYm9keVtpXSwgbGlzdEluZm8pKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgJ2VsZW1lbnQnOiBlbGVtZW50LFxyXG4gICAgJ3RleHQnOiB0ZXh0LFxyXG4gICAgJ2V4cHJlc3Npb24nOiBleHByZXNzaW9uLFxyXG4gICAgJ2xpc3QnOiBsaXN0XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2NvbXBpbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNzoxNDozNyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMzozNDoxNlxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyaWJ1dGUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiBhdHRyLnZhbHVlO1xyXG5cclxuICAgIHN3aXRjaCh2YWx1ZVR5cGUpe1xyXG4gICAgICAgIGNhc2UgJ3N0cmluZyc6IFxyXG4gICAgICAgICAgICBub2RlLnNldEF0dHJpYnV0ZShhdHRyLm5hbWUsIGF0dHIudmFsdWUpOyBicmVhaztcclxuICAgICAgICBjYXNlICdvYmplY3QnOiBcclxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCByZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKSk7IGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICB9XHJcbiAgICBcclxuICAgIFxyXG5cclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ2xpc3QtY29udGFpbmVyJyl7XHJcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2xpc3QtY29udGFpbmVyJywgdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIGlzRXZlbnQgPSBhdHRyLm5hbWUuc2xpY2UoMCwyKSA9PT0gJ29uJztcclxuXHJcbiAgICBpZihpc0V2ZW50KXtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5uYW1lLnNsaWNlKDMpO1xyXG4gICAgICAgIGF0dHIudmFsdWUuYm9keSA9IGF0dHIudmFsdWUuYm9keS5yZXBsYWNlKC8nXFwkZXZlbnQnL2csICckZXZlbnQnKTtcclxuICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuIGZ1bmN0aW9uKCRldmVudCl7cmV0dXJuICcrYXR0ci52YWx1ZS5ib2R5Kyc7fScpO1xyXG5cclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBnZXRIYW5kbGVyKGNvbnRleHQsIGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YSwgJycpLCBmYWxzZSwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhKTtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythdHRyLnZhbHVlLmJvZHkrJyknKTtcclxuICAgICAgICByZXR1cm4gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8gfHwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUF0dHJpYnV0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci93b3JrZXJUaHJlYWQvYXR0clJlc29sdmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCJ2YXIgZGlmZiA9IHJlcXVpcmUoJy4uL3V0aWxzL2RpZmYuanMnKTtcclxuXHJcbnZhciBDT01QQVJFX0ZJRUxEID0gWydfYXR0cnMnLCAnX2V2ZW50cycsICdfdGFnTmFtZSddO1xyXG5cclxuZnVuY3Rpb24gRGlmZmVyKHByZXZEb20sIGN1ckRvbSl7XHJcbiAgICAvKirlsZ7mgKdkaWZmICovXHJcbiAgICB2YXIgcHJldkF0dHJzID0gcHJldkRvbS5fYXR0cnMsXHJcbiAgICAgICAgY3VyQXR0cnMgPSBjdXJEb20uX2F0dHJzO1xyXG4gICAgaWYoZGlmZihwcmV2QXR0cnMsIGN1ckF0dHJzKSkgcmV0dXJuIHsgZGlmZjogdHJ1ZSwgdGFyZ2V0OiBwcmV2RG9tLCBzb3VyY2U6IGN1ckRvbSwgdHlwZTogJ2F0dHJpYnV0ZScgfTtcclxuXHJcbiAgICAvKipldmVudHMgKi9cclxuICAgIHZhciBwcmV2RXZlbnRzID0gcHJldkRvbS5fZXZlbnRzLFxyXG4gICAgICAgIGN1ckV2ZW50cyA9IGN1ckRvbS5fZXZlbnRzO1xyXG4gICAgaWYoZGlmZihwcmV2QXR0cnMsIGN1ckF0dHJzKSkgcmV0dXJuIHsgZGlmZjogdHJ1ZSwgdGFyZ2V0OiBwcmV2RG9tLCBzb3VyY2U6IGN1ckRvbSwgdHlwZTogJ2V2ZW50cycgfTtcclxuXHJcbn1cclxuXHJcbnZhciBwcmV2RG9tID0ge1xyXG4gICAgX2F0dHJzOiBbXHJcbiAgICAgICAge25hbWU6ICdjbGFzcycsIHZhbHVlOiAnd3JhcGVyJ31cclxuICAgIF0sXHJcbn07XHJcblxyXG52YXIgY3VyRG9tID0ge1xyXG4gICAgX2F0dHJzOiBbXHJcbiAgICAgICAge25hbWU6ICdjbGFzcycsIHZhbHVlOiAnd3JhcGVyMSd9XHJcbiAgICBdXHJcbn07XHJcblxyXG5jb25zb2xlLmxvZyhEaWZmZXIocHJldkRvbSwgY3VyRG9tKSk7XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RpZmZlci5qc1xuLy8gbW9kdWxlIGlkID0gMzJcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuXHJcbmZ1bmN0aW9uIGRpZmYoaXRlbTEsIGl0ZW0yKXtcclxuICAgIGlmKCFpc1NhbWVUeXBlKGl0ZW0xLCBpdGVtMikpe1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgdmFyIGJvb2w7XHJcbiAgICBzd2l0Y2godHlwZU9mKGl0ZW0xKSl7XHJcbiAgICAgICAgY2FzZSAnQXJyYXknOiBcclxuICAgICAgICAgICAgYm9vbCA9IGRpZmZBcnJheShpdGVtMSwgaXRlbTIpOyBcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT2JqZWN0JzpcclxuICAgICAgICAgICAgYm9vbCA9IGRpZmZPYmooaXRlbTEsIGl0ZW0yKTsgXHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGJvb2wgPSBpdGVtMSAhPT0gaXRlbTI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJvb2w7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpZmZPYmoob2JqMSwgb2JqMil7XHJcbiAgICBpZihvYmoxPT09b2JqMil7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBrZXlzMSA9IE9iamVjdC5rZXlzKG9iajEpLFxyXG4gICAgICAgIGtleXMyID0gT2JqZWN0LmtleXMob2JqMik7XHJcblxyXG4gICAgLyoq5qOA5rWLa2V55pWw6YePICovXHJcbiAgICBpZihrZXlzMS5sZW5ndGggIT09IGtleXMyLmxlbmd0aCl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5qOA5rWLdmFsdWUgKi9cclxuICAgIGZvcih2YXIgaT0wO2k8a2V5czEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgdmFyIHZhbHVlMSA9IG9iajFba2V5czFbaV1dLFxyXG4gICAgICAgICAgICB2YWx1ZTIgPSBvYmoyW2tleXMxW2ldXTtcclxuXHJcbiAgICAgICAgaWYoIWlzU2FtZVR5cGUodmFsdWUxLCB2YWx1ZTIpKSByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgdmFyIGJvb2w7XHJcbiAgICAgICAgc3dpdGNoICh0eXBlT2YodmFsdWUxKSl7XHJcbiAgICAgICAgICAgIGNhc2UgJ0FycmF5JzogXHJcbiAgICAgICAgICAgICAgICBib29sID0gZGlmZkFycmF5KHZhbHVlMSwgdmFsdWUyKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnT2JqZWN0JzpcclxuICAgICAgICAgICAgICAgIGJvb2wgPSBkaWZmT2JqKHZhbHVlMSwgdmFsdWUyKTsgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGJvb2wgPSB2YWx1ZTEgIT09IHZhbHVlMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoYm9vbCkgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRpZmZBcnJheShhcnJheTEsIGFycmF5Mil7XHJcbiAgICBpZihhcnJheTEgPT09IGFycmF5Mil7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYoYXJyYXkxLmxlbmd0aCAhPT0gYXJyYXkyLmxlbmd0aCl7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBmb3IodmFyIGk9MDtpPGFycmF5MS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBpZighaXNTYW1lVHlwZShhcnJheTFbaV0sIGFycmF5MltpXSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBib29sO1xyXG4gICAgICAgIHN3aXRjaCAodHlwZU9mKGFycmF5MVtpXSkpe1xyXG4gICAgICAgICAgICBjYXNlICdBcnJheSc6IFxyXG4gICAgICAgICAgICAgICAgYm9vbCA9IGRpZmZBcnJheShhcnJheTFbaV0sIGFycmF5MltpXSk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ09iamVjdCc6XHJcbiAgICAgICAgICAgICAgICBib29sID0gZGlmZk9iaihhcnJheTFbaV0sIGFycmF5MltpXSk7IFxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IFxyXG4gICAgICAgICAgICAgICAgYm9vbCA9IGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihib29sKSByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU2FtZVR5cGUoaXRlbTEsIGl0ZW0yKXtcclxuICAgIHJldHVybiB0eXBlT2YoaXRlbTEpID09PSB0eXBlT2YoaXRlbTIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0eXBlT2YoaXRlbSl7XHJcbiAgICBcclxuICAgIGlmKHR5cGVvZiBpdGVtICE9PSAnb2JqZWN0Jyl7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpdGVtO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXRlbSkuc2xpY2UoOCwgLTEpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGRpZmY7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdXRpbHMvZGlmZi5qc1xuLy8gbW9kdWxlIGlkID0gMzNcbi8vIG1vZHVsZSBjaHVua3MgPSAxIl0sInNvdXJjZVJvb3QiOiIifQ==