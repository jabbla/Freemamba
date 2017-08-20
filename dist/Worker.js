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
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
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
 * @Last Modified time: 2017-08-19 18:04:46
 */
var Parser = __webpack_require__(6);

if(!this.document){
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
 * @Last Modified time: 2017-08-20 13:20:50
 */
function MessageBus() {
    this._onSendWorker = [];
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
    this._emit(Info.type, Info.data);
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
        data = message.data.data;

    return { type: type, data: data };
};

MessageBus.prototype._serialize = function (message) {
    var Info = {};

    Info.type = message.type;
    Info.data = message.data;

    this._sendInfoToWorker(Info);
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

    for (var i = 0, watcher; i < watchers.length; i++) {
        watcher = watchers[i];
        watcher(Info);
    }
};

MessageBus.prototype.onSend = function (fn) {
    this._onSendWorker.push(fn);
};

MessageBus.prototype.then = function (fn) {
    var message = this._buffer;
    this._register(message.type, fn);

    return this;
};

MessageBus.prototype._register = function (eventName, fn) {
    var _eventsStore = this._eventsStore;

    if (_eventsStore[eventName])
        _eventsStore[eventName].watchers.push(fn);
    else
        _eventsStore[eventName] = { watchers: [fn] };
};

MessageBus.prototype._emit = function (eventName, data) {
    var _eventsStore = this._eventsStore;

    if (_eventsStore[eventName] && _eventsStore[eventName].watchers.length)
        this._executeWatchers(_eventsStore[eventName].watchers, data);
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(25);


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:49:03 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 12:54:49
 */

var MessageBus = __webpack_require__(26);
var WKRenderStore = __webpack_require__(27);

var myMessageBus = new MessageBus();

myMessageBus.buildReceiveDispatcher('render', function(data){
    var store = new WKRenderStore(data);
    store.render();
    this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
});

/***/ }),
/* 26 */
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
        dispatcher = this._receiveBusDispatcher;

    dispatcher[type].call(this, data);
}

WorkerMsgBus.prototype.onReceiveMessage = function(fn){

}

module.exports = WorkerMsgBus;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:44 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:21:24
 */

var BaseRenderStore = __webpack_require__(5);
var Extend = __webpack_require__(0);
var Compiler = __webpack_require__(28);

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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:34:07
 */
var attrResolver = __webpack_require__(29);

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
    if(listInfo){
        getValue = new Function('c','d','e','return ('+ast.body+')');
        text = getValue(context, listInfo, '');
    }else{
        getValue = new Function('c','d','e','return ('+ast.body+')');
        text = getValue(context, context.data, '');
    }

    var node = document.createTextNode(text);

    return node;
}

function list(ast, context){
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

module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list
};

/***/ }),
/* 29 */
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
        var argContext = listInfo || context.data;

        node.addEventListener(eventName, getHandler(context, argContext, ''), false, argContext);
        return '';
    }else{
        var getValue = new Function('c','d','e','return ('+attr.value.body+')');
        return getValue(context, context.data, '');
    }
}

module.exports = resolveAttribute;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODNkMDQzM2FhOWE4ODFmZjQ4YjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy8uMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvLjEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzLy4wLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy93a19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9Xb3JrZXJNc2dCdXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL1dLUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2F0dHJSZXNvbHZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Qjs7Ozs7OzREQ2RBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSx5QkFBeUIsNkNBQTZDLDBDQUEwQzs7O0FBR2hIO0FBQ0E7QUFDQSxrREFBa0QsU0FBUztBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRSwwQkFBMEI7QUFDMUIsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpQ0FBaUM7QUFDakMsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTO0FBQzlDOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQSx3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCO0FBQ0EsR0FBRztBQUNIOzs7QUFHQSwrRkFBK0Y7O0FBRS9GOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTyxNQUFNO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCLGFBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQ0FBcUMsU0FBUztBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBTTs7QUFFYjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDemhCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNuQkE7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsQzs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixhQUFhO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDOzs7Ozs7QUMvREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLE9BQU87QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsTUFBTSxVQUFVLFdBQVcsTUFBTSxPQUFPLGFBQWE7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsVUFBVTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0U7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YscUVBQXFFLEtBQUs7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELE9BQU87QUFDUCxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDekxEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7QUN2THRDO0FBQ0E7QUFDQSxjQUFjOztBQUVkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsU0FBUztBQUNwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7OztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLDJCOzs7Ozs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtB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dCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAyNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODNkMDQzM2FhOWE4ODFmZjQ4YjIiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNDo1NDozMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxNDo1OTo0MFxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIGV4dGVuZChjaGlsZENsYXNzLCBiYXNlQ2xhc3Mpe1xyXG4gICAgdmFyIGZuID0gZnVuY3Rpb24oKXt9O1xyXG4gICAgZm4ucHJvdG90eXBlID0gYmFzZUNsYXNzLnByb3RvdHlwZTtcclxuICAgIGNoaWxkQ2xhc3MucHJvdG90eXBlID0gbmV3IGZuKCk7XHJcbiAgICBjaGlsZENsYXNzLnByb3RvdHlwZS5zdXBlciA9IGJhc2VDbGFzcztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdXRpbHMvZXh0ZW5kLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwicmVxdWlyZSgnLi9oZWxwZXIvc2hpbS5qcycpKCk7XHJcblxyXG5cclxuXHJcbnZhciBfICA9IG1vZHVsZS5leHBvcnRzO1xyXG52YXIgZW50aXRpZXMgPSByZXF1aXJlKCcuL2hlbHBlci9lbnRpdGllcy5qcycpO1xyXG52YXIgc2xpY2UgPSBbXS5zbGljZTtcclxudmFyIG8yc3RyID0gKHt9KS50b1N0cmluZztcclxudmFyIHdpbiA9IHR5cGVvZiB3aW5kb3cgIT09J3VuZGVmaW5lZCc/IHdpbmRvdzogZ2xvYmFsO1xyXG52YXIgTUFYX1BSSU9SSVRZID0gOTk5OTtcclxuXHJcblxyXG5fLm5vb3AgPSBmdW5jdGlvbigpe307XHJcbl8udWlkID0gKGZ1bmN0aW9uKCl7XHJcbiAgdmFyIF91aWQ9MDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBfdWlkKys7XHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXy5leHRlbmQgPSBmdW5jdGlvbiggbzEsIG8yLCBvdmVycmlkZSApe1xyXG4gIGZvcih2YXIgaSBpbiBvMikgaWYgKG8yLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkIHx8IG92ZXJyaWRlID09PSB0cnVlICl7XHJcbiAgICAgIG8xW2ldID0gbzJbaV1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG8xO1xyXG59XHJcblxyXG5fLmtleXMgPSBPYmplY3Qua2V5cz8gT2JqZWN0LmtleXM6IGZ1bmN0aW9uKG9iail7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICByZXMucHVzaChpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuXy5zb21lID0gZnVuY3Rpb24obGlzdCwgZm4pe1xyXG4gIGZvcih2YXIgaSA9MCxsZW4gPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcclxuICAgIGlmKGZuKGxpc3RbaV0pKSByZXR1cm4gdHJ1ZVxyXG4gIH1cclxufVxyXG5cclxuXy52YXJOYW1lID0gJ2QnO1xyXG5fLnNldE5hbWUgPSAncF8nO1xyXG5fLmN0eE5hbWUgPSAnYyc7XHJcbl8uZXh0TmFtZSA9ICdlJztcclxuXHJcbl8ucldvcmQgPSAvXltcXCRcXHddKyQvO1xyXG5fLnJTaW1wbGVBY2Nlc3NvciA9IC9eW1xcJFxcd10rKFxcLltcXCRcXHddKykqJC87XHJcblxyXG5fLm5leHRUaWNrID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gJ2Z1bmN0aW9uJz8gXHJcbiAgc2V0SW1tZWRpYXRlLmJpbmQod2luKSA6IFxyXG4gIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiAgICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKSBcclxuICB9XHJcblxyXG5cclxuXHJcbl8ucHJlZml4ID0gXCIndXNlIHN0cmljdCc7dmFyIFwiICsgXy52YXJOYW1lICsgXCI9XCIgKyBfLmN0eE5hbWUgKyBcIi5kYXRhO1wiICsgIF8uZXh0TmFtZSAgKyBcIj1cIiArIF8uZXh0TmFtZSArIFwifHwnJztcIjtcclxuXHJcblxyXG5fLnNsaWNlID0gZnVuY3Rpb24ob2JqLCBzdGFydCwgZW5kKXtcclxuICB2YXIgcmVzID0gW107XHJcbiAgZm9yKHZhciBpID0gc3RhcnQgfHwgMCwgbGVuID0gZW5kIHx8IG9iai5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICByZXMucHVzaChvYmpbaV0pXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIGJlYWN1c2Ugc2xpY2UgYW5kIHRvTG93ZXJDYXNlIGlzIGV4cGVuc2l2ZS4gd2UgaGFuZGxlIHVuZGVmaW5lZCBhbmQgbnVsbCBpbiBhbm90aGVyIHdheVxyXG5fLnR5cGVPZiA9IGZ1bmN0aW9uIChvKSB7XHJcbiAgcmV0dXJuIG8gPT0gbnVsbCA/IFN0cmluZyhvKSA6bzJzdHIuY2FsbChvKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXy5tYWtlUHJlZGljYXRlID0gZnVuY3Rpb24gbWFrZVByZWRpY2F0ZSh3b3JkcywgcHJlZml4KSB7XHJcbiAgICBpZiAodHlwZW9mIHdvcmRzID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgd29yZHMgPSB3b3Jkcy5zcGxpdChcIiBcIik7XHJcbiAgICB9XHJcbiAgICB2YXIgZiA9IFwiXCIsXHJcbiAgICBjYXRzID0gW107XHJcbiAgICBvdXQ6IGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNhdHMubGVuZ3RoOyArK2ope1xyXG4gICAgICAgICAgaWYgKGNhdHNbal1bMF0ubGVuZ3RoID09PSB3b3Jkc1tpXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBjYXRzW2pdLnB1c2god29yZHNbaV0pO1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlIG91dDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0cy5wdXNoKFt3b3Jkc1tpXV0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY29tcGFyZVRvKGFycikge1xyXG4gICAgICAgIGlmIChhcnIubGVuZ3RoID09PSAxKSByZXR1cm4gZiArPSBcInJldHVybiBzdHIgPT09ICdcIiArIGFyclswXSArIFwiJztcIjtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0cil7XCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyArK2kpe1xyXG4gICAgICAgICAgIGYgKz0gXCJjYXNlICdcIiArIGFycltpXSArIFwiJzpcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcInJldHVybiB0cnVlfXJldHVybiBmYWxzZTtcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaGVuIHRoZXJlIGFyZSBtb3JlIHRoYW4gdGhyZWUgbGVuZ3RoIGNhdGVnb3JpZXMsIGFuIG91dGVyXHJcbiAgICAvLyBzd2l0Y2ggZmlyc3QgZGlzcGF0Y2hlcyBvbiB0aGUgbGVuZ3RocywgdG8gc2F2ZSBvbiBjb21wYXJpc29ucy5cclxuICAgIGlmIChjYXRzLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICBjYXRzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xyXG4gICAgICAgICAgICByZXR1cm4gYi5sZW5ndGggLSBhLmxlbmd0aDtcclxuICAgICAgICB9KTtcclxuICAgICAgICBmICs9IFwic3dpdGNoKHN0ci5sZW5ndGgpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2F0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB2YXIgY2F0ID0gY2F0c1tpXTtcclxuICAgICAgICAgICAgZiArPSBcImNhc2UgXCIgKyBjYXRbMF0ubGVuZ3RoICsgXCI6XCI7XHJcbiAgICAgICAgICAgIGNvbXBhcmVUbyhjYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmICs9IFwifVwiO1xyXG5cclxuICAgICAgICAvLyBPdGhlcndpc2UsIHNpbXBseSBnZW5lcmF0ZSBhIGZsYXQgYHN3aXRjaGAgc3RhdGVtZW50LlxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb21wYXJlVG8od29yZHMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbihcInN0clwiLCBmKTtcclxufVxyXG5cclxuXHJcbl8udHJhY2tFcnJvclBvcyA9IChmdW5jdGlvbiAoKXtcclxuICAvLyBsaW5lYnJlYWtcclxuICB2YXIgbGIgPSAvXFxyXFxufFtcXG5cXHJcXHUyMDI4XFx1MjAyOV0vZztcclxuICB2YXIgbWluUmFuZ2UgPSAyMCwgbWF4UmFuZ2UgPSAyMDtcclxuICBmdW5jdGlvbiBmaW5kTGluZShsaW5lcywgcG9zKXtcclxuICAgIHZhciB0bXBMZW4gPSAwO1xyXG4gICAgZm9yKHZhciBpID0gMCxsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICAgIHZhciBsaW5lTGVuID0gKGxpbmVzW2ldIHx8IFwiXCIpLmxlbmd0aDtcclxuXHJcbiAgICAgIGlmKHRtcExlbiArIGxpbmVMZW4gPiBwb3MpIHtcclxuICAgICAgICByZXR1cm4ge251bTogaSwgbGluZTogbGluZXNbaV0sIHN0YXJ0OiBwb3MgLSBpIC0gdG1wTGVuICwgcHJldjpsaW5lc1tpLTFdLCBuZXh0OiBsaW5lc1tpKzFdIH07XHJcbiAgICAgIH1cclxuICAgICAgLy8gMSBpcyBmb3IgdGhlIGxpbmVicmVha1xyXG4gICAgICB0bXBMZW4gPSB0bXBMZW4gKyBsaW5lTGVuIDtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gZm9ybWF0TGluZShzdHIsICBzdGFydCwgbnVtLCB0YXJnZXQpe1xyXG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGg7XHJcbiAgICB2YXIgbWluID0gc3RhcnQgLSBtaW5SYW5nZTtcclxuICAgIGlmKG1pbiA8IDApIG1pbiA9IDA7XHJcbiAgICB2YXIgbWF4ID0gc3RhcnQgKyBtYXhSYW5nZTtcclxuICAgIGlmKG1heCA+IGxlbikgbWF4ID0gbGVuO1xyXG5cclxuICAgIHZhciByZW1haW4gPSBzdHIuc2xpY2UobWluLCBtYXgpO1xyXG4gICAgdmFyIHByZWZpeCA9IFwiW1wiICsobnVtKzEpICsgXCJdIFwiICsgKG1pbiA+IDA/IFwiLi5cIiA6IFwiXCIpXHJcbiAgICB2YXIgcG9zdGZpeCA9IG1heCA8IGxlbiA/IFwiLi5cIjogXCJcIjtcclxuICAgIHZhciByZXMgPSBwcmVmaXggKyByZW1haW4gKyBwb3N0Zml4O1xyXG4gICAgaWYodGFyZ2V0KSByZXMgKz0gXCJcXG5cIiArIG5ldyBBcnJheShzdGFydC1taW4gKyBwcmVmaXgubGVuZ3RoICsgMSkuam9pbihcIiBcIikgKyBcIl5eXlwiO1xyXG4gICAgcmV0dXJuIHJlcztcclxuICB9XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGlucHV0LCBwb3Mpe1xyXG4gICAgaWYocG9zID4gaW5wdXQubGVuZ3RoLTEpIHBvcyA9IGlucHV0Lmxlbmd0aC0xO1xyXG4gICAgbGIubGFzdEluZGV4ID0gMDtcclxuICAgIHZhciBsaW5lcyA9IGlucHV0LnNwbGl0KGxiKTtcclxuICAgIHZhciBsaW5lID0gZmluZExpbmUobGluZXMscG9zKTtcclxuICAgIHZhciBzdGFydCA9IGxpbmUuc3RhcnQsIG51bSA9IGxpbmUubnVtO1xyXG5cclxuICAgIHJldHVybiAobGluZS5wcmV2PyBmb3JtYXRMaW5lKGxpbmUucHJldiwgc3RhcnQsIG51bS0xICkgKyAnXFxuJzogJycgKSArIFxyXG4gICAgICBmb3JtYXRMaW5lKGxpbmUubGluZSwgc3RhcnQsIG51bSwgdHJ1ZSkgKyAnXFxuJyArIFxyXG4gICAgICAobGluZS5uZXh0PyBmb3JtYXRMaW5lKGxpbmUubmV4dCwgc3RhcnQsIG51bSsxICkgKyAnXFxuJzogJycgKTtcclxuXHJcbiAgfVxyXG59KSgpO1xyXG5cclxuXHJcbnZhciBpZ25vcmVkUmVmID0gL1xcKChcXD9cXCF8XFw/XFw6fFxcP1xcPSkvZztcclxuXy5maW5kU3ViQ2FwdHVyZSA9IGZ1bmN0aW9uIChyZWdTdHIpIHtcclxuICB2YXIgbGVmdCA9IDAsXHJcbiAgICByaWdodCA9IDAsXHJcbiAgICBsZW4gPSByZWdTdHIubGVuZ3RoLFxyXG4gICAgaWdub3JlZCA9IHJlZ1N0ci5tYXRjaChpZ25vcmVkUmVmKTsgLy8gaWdub3JlZCB1bmNhcHR1cmVcclxuICBpZihpZ25vcmVkKSBpZ25vcmVkID0gaWdub3JlZC5sZW5ndGhcclxuICBlbHNlIGlnbm9yZWQgPSAwO1xyXG4gIGZvciAoOyBsZW4tLTspIHtcclxuICAgIHZhciBsZXR0ZXIgPSByZWdTdHIuY2hhckF0KGxlbik7XHJcbiAgICBpZiAobGVuID09PSAwIHx8IHJlZ1N0ci5jaGFyQXQobGVuIC0gMSkgIT09IFwiXFxcXFwiICkgeyBcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIoXCIpIGxlZnQrKztcclxuICAgICAgaWYgKGxldHRlciA9PT0gXCIpXCIpIHJpZ2h0Kys7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChsZWZ0ICE9PSByaWdodCkgdGhyb3cgXCJSZWdFeHA6IFwiKyByZWdTdHIgKyBcIidzIGJyYWNrZXQgaXMgbm90IG1hcmNoZWRcIjtcclxuICBlbHNlIHJldHVybiBsZWZ0IC0gaWdub3JlZDtcclxufTtcclxuXHJcblxyXG5fLmVzY2FwZVJlZ0V4cCA9IGZ1bmN0aW9uKCBzdHIpey8vIENyZWRpdDogWFJlZ0V4cCAwLjYuMSAoYykgMjAwNy0yMDA4IFN0ZXZlbiBMZXZpdGhhbiA8aHR0cDovL3N0ZXZlbmxldml0aGFuLmNvbS9yZWdleC94cmVnZXhwLz4gTUlUIExpY2Vuc2VcclxuICByZXR1cm4gc3RyLnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uXFxcXF4kfCwjXFxzXS9nLCBmdW5jdGlvbihtYXRjaCl7XHJcbiAgICByZXR1cm4gJ1xcXFwnICsgbWF0Y2g7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5cclxudmFyIHJFbnRpdHkgPSBuZXcgUmVnRXhwKFwiJig/OigjeFswLTlhLWZBLUZdKyl8KCNbMC05XSspfChcIiArIF8ua2V5cyhlbnRpdGllcykuam9pbignfCcpICsgJykpOycsICdnaScpO1xyXG5cclxuXy5jb252ZXJ0RW50aXR5ID0gZnVuY3Rpb24oY2hyKXtcclxuXHJcbiAgcmV0dXJuIChcIlwiICsgY2hyKS5yZXBsYWNlKHJFbnRpdHksIGZ1bmN0aW9uKGFsbCwgaGV4LCBkZWMsIGNhcHR1cmUpe1xyXG4gICAgdmFyIGNoYXJDb2RlO1xyXG4gICAgaWYoIGRlYyApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGRlYy5zbGljZSgxKSwgMTAgKTtcclxuICAgIGVsc2UgaWYoIGhleCApIGNoYXJDb2RlID0gcGFyc2VJbnQoIGhleC5zbGljZSgyKSwgMTYgKTtcclxuICAgIGVsc2UgY2hhckNvZGUgPSBlbnRpdGllc1tjYXB0dXJlXVxyXG5cclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKCBjaGFyQ29kZSApXHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5cclxuLy8gc2ltcGxlIGdldCBhY2Nlc3NvclxyXG5cclxuXy5jcmVhdGVPYmplY3QgPSBPYmplY3QuY3JlYXRlPyBmdW5jdGlvbihvKXtcclxuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShvIHx8IG51bGwpXHJcbn06IChmdW5jdGlvbigpe1xyXG4gICAgZnVuY3Rpb24gVGVtcCgpIHt9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24obyl7XHJcbiAgICAgIGlmKCFvKSByZXR1cm4ge31cclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBvO1xyXG4gICAgICB2YXIgb2JqID0gbmV3IFRlbXAoKTtcclxuICAgICAgVGVtcC5wcm90b3R5cGUgPSBudWxsOyAvLyDkuI3opoHkv53mjIHkuIDkuKogTyDnmoTmnYLmlaPlvJXnlKjvvIhhIHN0cmF5IHJlZmVyZW5jZe+8iS4uLlxyXG4gICAgICByZXR1cm4gb2JqXHJcbiAgICB9XHJcbn0pKCk7XHJcblxyXG5fLmNyZWF0ZVByb3RvID0gZnVuY3Rpb24oZm4sIG8pe1xyXG4gICAgZnVuY3Rpb24gRm9vKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZm47fVxyXG4gICAgRm9vLnByb3RvdHlwZSA9IG87XHJcbiAgICByZXR1cm4gKGZuLnByb3RvdHlwZSA9IG5ldyBGb28oKSk7XHJcbn1cclxuXHJcblxyXG5fLnJlbW92ZU9uZSA9IGZ1bmN0aW9uKGxpc3QgLCBmaWx0ZXIpe1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICBmb3IoO2xlbi0tOyl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkge1xyXG4gICAgICBsaXN0LnNwbGljZShsZW4sIDEpXHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcblxyXG4vKipcclxuY2xvbmVcclxuKi9cclxuXy5jbG9uZSA9IGZ1bmN0aW9uIGNsb25lKG9iail7XHJcbiAgaWYoIW9iaiB8fCAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcgKSkgcmV0dXJuIG9iajtcclxuICBpZihBcnJheS5pc0FycmF5KG9iaikpe1xyXG4gICAgdmFyIGNsb25lZCA9IFtdO1xyXG4gICAgZm9yKHZhciBpPTAsbGVuID0gb2JqLmxlbmd0aDsgaTwgbGVuO2krKyl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNsb25lZDtcclxuICB9ZWxzZXtcclxuICAgIHZhciBjbG9uZWQgPSB7fTtcclxuICAgIGZvcih2YXIgaSBpbiBvYmopIGlmKG9iai5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICAgIGNsb25lZFtpXSA9IG9ialtpXTtcclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5fLmVxdWFscyA9IGZ1bmN0aW9uKG5vdywgb2xkKXtcclxuICB2YXIgdHlwZSA9IHR5cGVvZiBub3c7XHJcbiAgaWYodHlwZSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIG9sZCA9PT0gJ251bWJlcicmJiBpc05hTihub3cpICYmIGlzTmFOKG9sZCkpIHJldHVybiB0cnVlXHJcbiAgcmV0dXJuIG5vdyA9PT0gb2xkO1xyXG59XHJcblxyXG52YXIgZGFzaCA9IC8tKFthLXpdKS9nO1xyXG5fLmNhbWVsQ2FzZSA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKGRhc2gsIGZ1bmN0aW9uKGFsbCwgY2FwdHVyZSl7XHJcbiAgICByZXR1cm4gY2FwdHVyZS50b1VwcGVyQ2FzZSgpO1xyXG4gIH0pXHJcbn1cclxuXHJcblxyXG5cclxuXy50aHJvdHRsZSA9IGZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQpe1xyXG4gIHZhciB3YWl0ID0gd2FpdCB8fCAxMDA7XHJcbiAgdmFyIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcclxuICB2YXIgdGltZW91dCA9IG51bGw7XHJcbiAgdmFyIHByZXZpb3VzID0gMDtcclxuICB2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHByZXZpb3VzID0gK25ldyBEYXRlO1xyXG4gICAgdGltZW91dCA9IG51bGw7XHJcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gIH07XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIG5vdyA9ICsgbmV3IERhdGU7XHJcbiAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XHJcbiAgICBjb250ZXh0ID0gdGhpcztcclxuICAgIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xyXG4gICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XHJcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgICBwcmV2aW91cyA9IG5vdztcclxuICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xyXG4gICAgfSBlbHNlIGlmICghdGltZW91dCkge1xyXG4gICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIGhvZ2FuIGVzY2FwZVxyXG4vLyA9PT09PT09PT09PT09PVxyXG5fLmVzY2FwZSA9IChmdW5jdGlvbigpe1xyXG4gIHZhciByQW1wID0gLyYvZyxcclxuICAgICAgckx0ID0gLzwvZyxcclxuICAgICAgckd0ID0gLz4vZyxcclxuICAgICAgckFwb3MgPSAvXFwnL2csXHJcbiAgICAgIHJRdW90ID0gL1xcXCIvZyxcclxuICAgICAgaENoYXJzID0gL1smPD5cXFwiXFwnXS87XHJcblxyXG4gIHJldHVybiBmdW5jdGlvbihzdHIpIHtcclxuICAgIHJldHVybiBoQ2hhcnMudGVzdChzdHIpID9cclxuICAgICAgc3RyXHJcbiAgICAgICAgLnJlcGxhY2UockFtcCwgJyZhbXA7JylcclxuICAgICAgICAucmVwbGFjZShyTHQsICcmbHQ7JylcclxuICAgICAgICAucmVwbGFjZShyR3QsICcmZ3Q7JylcclxuICAgICAgICAucmVwbGFjZShyQXBvcywgJyYjMzk7JylcclxuICAgICAgICAucmVwbGFjZShyUXVvdCwgJyZxdW90OycpIDpcclxuICAgICAgc3RyO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uY2FjaGUgPSBmdW5jdGlvbihtYXgpe1xyXG4gIG1heCA9IG1heCB8fCAxMDAwO1xyXG4gIHZhciBrZXlzID0gW10sXHJcbiAgICAgIGNhY2hlID0ge307XHJcbiAgcmV0dXJuIHtcclxuICAgIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICBpZiAoa2V5cy5sZW5ndGggPiB0aGlzLm1heCkge1xyXG4gICAgICAgIGNhY2hlW2tleXMuc2hpZnQoKV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgLy8gXHJcbiAgICAgIGlmKGNhY2hlW2tleV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAga2V5cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgICAgY2FjaGVba2V5XSA9IHZhbHVlO1xyXG4gICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9LFxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcclxuICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gY2FjaGU7XHJcbiAgICAgIHJldHVybiBjYWNoZVtrZXldO1xyXG4gICAgfSxcclxuICAgIG1heDogbWF4LFxyXG4gICAgbGVuOmZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiBrZXlzLmxlbmd0aDtcclxuICAgIH1cclxuICB9O1xyXG59XHJcblxyXG4vLyAvLyBzZXR1cCB0aGUgcmF3IEV4cHJlc3Npb25cclxuXHJcblxyXG4vLyBoYW5kbGUgdGhlIHNhbWUgbG9naWMgb24gY29tcG9uZW50J3MgYG9uLSpgIGFuZCBlbGVtZW50J3MgYG9uLSpgXHJcbi8vIHJldHVybiB0aGUgZmlyZSBvYmplY3RcclxuXy5oYW5kbGVFdmVudCA9IGZ1bmN0aW9uKHZhbHVlLCB0eXBlICl7XHJcbiAgdmFyIHNlbGYgPSB0aGlzLCBldmFsdWF0ZTtcclxuICBpZih2YWx1ZS50eXBlID09PSAnZXhwcmVzc2lvbicpeyAvLyBpZiBpcyBleHByZXNzaW9uLCBnbyBldmFsdWF0ZWQgd2F5XHJcbiAgICBldmFsdWF0ZSA9IHZhbHVlLmdldDtcclxuICB9XHJcbiAgaWYoZXZhbHVhdGUpe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUob2JqKXtcclxuICAgICAgc2VsZi4kdXBkYXRlKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSBvYmo7XHJcbiAgICAgICAgdmFyIHJlcyA9IGV2YWx1YXRlKHNlbGYpO1xyXG4gICAgICAgIGlmKHJlcyA9PT0gZmFsc2UgJiYgb2JqICYmIG9iai5wcmV2ZW50RGVmYXVsdCkgb2JqLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZGF0YS4kZXZlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGZpcmUoKXtcclxuICAgICAgdmFyIGFyZ3MgPSBfLnNsaWNlKGFyZ3VtZW50cyk7XHJcbiAgICAgIGFyZ3MudW5zaGlmdCh2YWx1ZSk7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHNlbGYuJGVtaXQuYXBwbHkoc2VsZiwgYXJncyk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLyBvbmx5IGNhbGwgb25jZVxyXG5fLm9uY2UgPSBmdW5jdGlvbihmbil7XHJcbiAgdmFyIHRpbWUgPSAwO1xyXG4gIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgaWYoIHRpbWUrKyA9PT0gMCkgZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICB9XHJcbn1cclxuXHJcbl8uZml4T2JqU3RyID0gZnVuY3Rpb24oc3RyKXtcclxuICBpZihzdHIudHJpbSgpLmluZGV4T2YoJ3snKSAhPT0gMCl7XHJcbiAgICByZXR1cm4gJ3snICsgc3RyICsgJ30nO1xyXG4gIH1cclxuICByZXR1cm4gc3RyO1xyXG59XHJcblxyXG5cclxuXy5tYXA9IGZ1bmN0aW9uKGFycmF5LCBjYWxsYmFjayl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnJheS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgcmVzLnB1c2goY2FsbGJhY2soYXJyYXlbaV0sIGkpKTtcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gbG9nKG1zZywgdHlwZSl7XHJcbiAgaWYodHlwZW9mIGNvbnNvbGUgIT09IFwidW5kZWZpbmVkXCIpICBjb25zb2xlW3R5cGUgfHwgXCJsb2dcIl0obXNnKTtcclxufVxyXG5cclxuXy5sb2cgPSBsb2c7XHJcblxyXG5cclxuXy5ub3JtTGlzdGVuZXIgPSBmdW5jdGlvbiggZXZlbnRzICApe1xyXG4gICAgdmFyIGV2ZW50TGlzdGVuZXJzID0gW107XHJcbiAgICB2YXIgcFR5cGUgPSBfLnR5cGVPZiggZXZlbnRzICk7XHJcbiAgICBpZiggcFR5cGUgPT09ICdhcnJheScgKXtcclxuICAgICAgcmV0dXJuIGV2ZW50cztcclxuICAgIH1lbHNlIGlmICggcFR5cGUgPT09ICdvYmplY3QnICl7XHJcbiAgICAgIGZvciggdmFyIGkgaW4gZXZlbnRzICkgaWYgKCBldmVudHMuaGFzT3duUHJvcGVydHkoaSkgKXtcclxuICAgICAgICBldmVudExpc3RlbmVycy5wdXNoKHtcclxuICAgICAgICAgIHR5cGU6IGksXHJcbiAgICAgICAgICBsaXN0ZW5lcjogZXZlbnRzW2ldXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV2ZW50TGlzdGVuZXJzO1xyXG59XHJcblxyXG5cclxuLy9odHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9zaW5nbGUtcGFnZS5odG1sI3ZvaWQtZWxlbWVudHNcclxuXy5pc1ZvaWRUYWcgPSBfLm1ha2VQcmVkaWNhdGUoXCJhcmVhIGJhc2UgYnIgY29sIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZW51aXRlbSBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnIgci1jb250ZW50XCIpO1xyXG5fLmlzQm9vbGVhbkF0dHIgPSBfLm1ha2VQcmVkaWNhdGUoJ3NlbGVjdGVkIGNoZWNrZWQgZGlzYWJsZWQgcmVhZG9ubHkgcmVxdWlyZWQgb3BlbiBhdXRvZm9jdXMgY29udHJvbHMgYXV0b3BsYXkgY29tcGFjdCBsb29wIGRlZmVyIG11bHRpcGxlJyk7XHJcblxyXG5cclxuXy5pc0V4cHIgPSBmdW5jdGlvbihleHByKXtcclxuICByZXR1cm4gZXhwciAmJiBleHByLnR5cGUgPT09ICdleHByZXNzaW9uJztcclxufVxyXG4vLyBAVE9ETzogbWFrZSBpdCBtb3JlIHN0cmljdFxyXG5fLmlzR3JvdXAgPSBmdW5jdGlvbihncm91cCl7XHJcbiAgcmV0dXJuIGdyb3VwLmluamVjdCB8fCBncm91cC4kaW5qZWN0O1xyXG59XHJcblxyXG5fLmdldENvbXBpbGVGbiA9IGZ1bmN0aW9uKHNvdXJjZSwgY3R4LCBvcHRpb25zKXtcclxuICByZXR1cm4gY3R4LiRjb21waWxlLmJpbmQoY3R4LHNvdXJjZSwgb3B0aW9ucylcclxufVxyXG5cclxuLy8gcmVtb3ZlIGRpcmVjdGl2ZSBwYXJhbSBmcm9tIEFTVFxyXG5fLmZpeFRhZ0FTVCA9IGZ1bmN0aW9uKCB0YWdBU1QsIENvbXBvbmVudCApe1xyXG5cclxuICBpZiggdGFnQVNULnRvdWNoZWQgKSByZXR1cm47XHJcblxyXG4gIHZhciBhdHRycyA9IHRhZ0FTVC5hdHRycztcclxuXHJcbiAgaWYoICFhdHRycyApIHJldHVybjtcclxuXHJcbiAgLy8gTWF5YmUgbXVsdGlwbGUgZGlyZWN0aXZlIG5lZWQgc2FtZSBwYXJhbSwgXHJcbiAgLy8gV2UgcGxhY2UgYWxsIHBhcmFtIGluIHRvdGFsUGFyYW1NYXBcclxuICB2YXIgbGVuID0gYXR0cnMubGVuZ3RoO1xyXG4gIGlmKCFsZW4pIHJldHVybjtcclxuICB2YXIgZGlyZWN0aXZlcz1bXSwgb3RoZXJBdHRyTWFwID0ge307XHJcbiAgZm9yKDtsZW4tLTspe1xyXG5cclxuICAgIHZhciBhdHRyID0gYXR0cnNbIGxlbiBdO1xyXG5cclxuXHJcbiAgICAvLyBASUUgZml4IElFOS0gaW5wdXQgdHlwZSBjYW4ndCBhc3NpZ24gYWZ0ZXIgdmFsdWVcclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ3R5cGUnKSBhdHRyLnByaW9yaXR5ID0gTUFYX1BSSU9SSVRZKzE7XHJcblxyXG4gICAgdmFyIGRpcmVjdGl2ZSA9IENvbXBvbmVudC5kaXJlY3RpdmUoIGF0dHIubmFtZSApO1xyXG4gICAgaWYoIGRpcmVjdGl2ZSApIHtcclxuXHJcbiAgICAgIGF0dHIucHJpb3JpdHkgPSBkaXJlY3RpdmUucHJpb3JpdHkgfHwgMTtcclxuICAgICAgYXR0ci5kaXJlY3RpdmUgPSB0cnVlO1xyXG4gICAgICBkaXJlY3RpdmVzLnB1c2goYXR0cik7XHJcblxyXG4gICAgfWVsc2UgaWYoYXR0ci50eXBlID09PSAnYXR0cmlidXRlJyl7XHJcbiAgICAgIG90aGVyQXR0ck1hcFthdHRyLm5hbWVdID0gYXR0ci52YWx1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRpcmVjdGl2ZXMuZm9yRWFjaCggZnVuY3Rpb24oIGF0dHIgKXtcclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKGF0dHIubmFtZSk7XHJcbiAgICB2YXIgcGFyYW0gPSBkaXJlY3RpdmUucGFyYW07XHJcbiAgICBpZihwYXJhbSAmJiBwYXJhbS5sZW5ndGgpe1xyXG4gICAgICBhdHRyLnBhcmFtID0ge307XHJcbiAgICAgIHBhcmFtLmZvckVhY2goZnVuY3Rpb24oIG5hbWUgKXtcclxuICAgICAgICBpZiggbmFtZSBpbiBvdGhlckF0dHJNYXAgKXtcclxuICAgICAgICAgIGF0dHIucGFyYW1bbmFtZV0gPSBvdGhlckF0dHJNYXBbbmFtZV0gPT09IHVuZGVmaW5lZD8gdHJ1ZTogb3RoZXJBdHRyTWFwW25hbWVdXHJcbiAgICAgICAgICBfLnJlbW92ZU9uZShhdHRycywgZnVuY3Rpb24oYXR0cil7XHJcbiAgICAgICAgICAgIHJldHVybiBhdHRyLm5hbWUgPT09IG5hbWVcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBhdHRycy5zb3J0KGZ1bmN0aW9uKGExLCBhMil7XHJcbiAgICBcclxuICAgIHZhciBwMSA9IGExLnByaW9yaXR5O1xyXG4gICAgdmFyIHAyID0gYTIucHJpb3JpdHk7XHJcblxyXG4gICAgaWYoIHAxID09IG51bGwgKSBwMSA9IE1BWF9QUklPUklUWTtcclxuICAgIGlmKCBwMiA9PSBudWxsICkgcDIgPSBNQVhfUFJJT1JJVFk7XHJcblxyXG4gICAgcmV0dXJuIHAyIC0gcDE7XHJcblxyXG4gIH0pXHJcblxyXG4gIHRhZ0FTVC50b3VjaGVkID0gdHJ1ZTtcclxufVxyXG5cclxuXy5maW5kSXRlbSA9IGZ1bmN0aW9uKGxpc3QsIGZpbHRlcil7XHJcbiAgaWYoIWxpc3QgfHwgIWxpc3QubGVuZ3RoKSByZXR1cm47XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIHdoaWxlKGxlbi0tKXtcclxuICAgIGlmKGZpbHRlcihsaXN0W2xlbl0pKSByZXR1cm4gbGlzdFtsZW5dXHJcbiAgfVxyXG59XHJcblxyXG5fLmdldFBhcmFtT2JqID0gZnVuY3Rpb24oY29tcG9uZW50LCBwYXJhbSl7XHJcbiAgdmFyIHBhcmFtT2JqID0ge307XHJcbiAgaWYocGFyYW0pIHtcclxuICAgIGZvcih2YXIgaSBpbiBwYXJhbSkgaWYocGFyYW0uaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICB2YXIgdmFsdWUgPSBwYXJhbVtpXTtcclxuICAgICAgcGFyYW1PYmpbaV0gPSAgdmFsdWUgJiYgdmFsdWUudHlwZT09PSdleHByZXNzaW9uJz8gY29tcG9uZW50LiRnZXQodmFsdWUpOiB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHBhcmFtT2JqO1xyXG59XHJcblxyXG5cclxuXHJcblxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3V0aWwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJcclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgJ0JFR0lOJzogJ3snLFxyXG4gICdFTkQnOiAnfScsXHJcbiAgJ1BSRUNPTVBJTEUnOiBmYWxzZVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2NvbmZpZy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsImZ1bmN0aW9uIGRvY3VtZW50RnJhZ21lbnQoKXtcclxuICAgIHRoaXMuX2NoaWxkcmVuID0gW107XHJcbn1cclxuZG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obm9kZSl7XHJcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudEZyYWdtZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRG9jdW1lbnRGcmFnbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE1OjA1OjAxIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTE5IDE4OjA0OjQ2XHJcbiAqL1xyXG52YXIgUGFyc2VyID0gcmVxdWlyZSgnLi4vL3BhcnNlci9zcmMvUGFyc2VyLmpzJyk7XHJcblxyXG5pZighdGhpcy5kb2N1bWVudCl7XHJcbiAgICBkb2N1bWVudCA9IHJlcXVpcmUoJy4uL3Zkb20vRG9jdW1lbnQuanMnKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQmFzZVJlbmRlclN0b3JlKG9iail7XHJcblxyXG4gICAgdGhpcy5fYmVmb3JlQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9jb25maWdNb2RlbChvYmopO1xyXG4gICAgdGhpcy5fYWZ0ZXJDb25maWcoKTtcclxuICAgIHRoaXMuX3BhcnNlKCk7XHJcbn1cclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2JlZm9yZUNvbmZpZyA9IGZ1bmN0aW9uKCl7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9hZnRlckNvbmZpZyA9IGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmNvbmZpZyAmJiB0aGlzLmNvbmZpZyh0aGlzLmRhdGEpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fY29uZmlnTW9kZWwgPSBmdW5jdGlvbihtb2RlbCl7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMsIG1vZGVsKTtcclxuXHJcbiAgICBpZighbW9kZWwuZGF0YSkgdGhpcy5kYXRhID0ge307XHJcbiAgICB0aGlzLl9saXN0ID0ge307XHJcbiAgICB0aGlzLl9kZWZpbmVyID0gbW9kZWw7XHJcbn1cclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbXBpbGUgPSBmdW5jdGlvbihhc3QsIGxpc3RJbmZvKXtcclxuICAgIGlmKGFzdCBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgICBmb3IodmFyIGk9MDtpPGFzdC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQodGhpcy5fY29tcGlsZShhc3RbaV0sIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBpbGVyW2FzdC50eXBlXShhc3QsIHRoaXMsIGxpc3RJbmZvKTtcclxuICAgIH1cclxufVxyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fcGFyc2UgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5BU1QgPSBuZXcgUGFyc2VyKHRoaXMudGVtcGxhdGUpLnBhcnNlKCk7XHJcbn07XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9yZW5kZXIgPSBmdW5jdGlvbigpe307XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9zZ18gPSBmdW5jdGlvbiAocGF0aCwgZGF0YSkge1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmIChwYXRoIGluc3RhbmNlb2YgRXZlbnQpIHtcclxuICAgICAgICByZXN1bHQgPSBwYXRoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHQgPSBkYXRhW3BhdGhdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCYXNlUmVuZGVyU3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RvcmUvQmFzZVJlbmRlclN0b3JlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vdXRpbC5qc1wiKTtcclxuXHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzXCIpO1xyXG52YXIgbm9kZSA9IHJlcXVpcmUoXCIuL25vZGUuanNcIik7XHJcbnZhciBMZXhlciA9IHJlcXVpcmUoXCIuL0xleGVyLmpzXCIpO1xyXG52YXIgdmFyTmFtZSA9IF8udmFyTmFtZTtcclxudmFyIGN0eE5hbWUgPSBfLmN0eE5hbWU7XHJcbnZhciBleHROYW1lID0gXy5leHROYW1lO1xyXG52YXIgaXNQYXRoID0gXy5tYWtlUHJlZGljYXRlKFwiU1RSSU5HIElERU5UIE5VTUJFUlwiKTtcclxudmFyIGlzS2V5V29yZCA9IF8ubWFrZVByZWRpY2F0ZShcInRydWUgZmFsc2UgdW5kZWZpbmVkIG51bGwgdGhpcyBBcnJheSBEYXRlIEpTT04gTWF0aCBOYU4gUmVnRXhwIGRlY29kZVVSSSBkZWNvZGVVUklDb21wb25lbnQgZW5jb2RlVVJJIGVuY29kZVVSSUNvbXBvbmVudCBwYXJzZUZsb2F0IHBhcnNlSW50IE9iamVjdFwiKTtcclxuXHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIFBhcnNlcihpbnB1dCwgb3B0cyl7XHJcbiAgb3B0cyA9IG9wdHMgfHwge307XHJcblxyXG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcclxuICB0aGlzLnRva2VucyA9IG5ldyBMZXhlcihpbnB1dCwgb3B0cykubGV4KCk7XHJcbiAgdGhpcy5wb3MgPSAwO1xyXG4gIHRoaXMubGVuZ3RoID0gdGhpcy50b2tlbnMubGVuZ3RoO1xyXG59XHJcblxyXG5cclxudmFyIG9wID0gUGFyc2VyLnByb3RvdHlwZTtcclxuXHJcblxyXG5vcC5wYXJzZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5wb3MgPSAwO1xyXG4gIHZhciByZXM9IHRoaXMucHJvZ3JhbSgpO1xyXG4gIGlmKHRoaXMubGwoKS50eXBlID09PSAnVEFHX0NMT1NFJyl7XHJcbiAgICB0aGlzLmVycm9yKFwiWW91IG1heSBnb3QgYSB1bmNsb3NlZCBUYWdcIilcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxub3AubGwgPSAgZnVuY3Rpb24oayl7XHJcbiAgayA9IGsgfHwgMTtcclxuICBpZihrIDwgMCkgayA9IGsgKyAxO1xyXG4gIHZhciBwb3MgPSB0aGlzLnBvcyArIGsgLSAxO1xyXG4gIGlmKHBvcyA+IHRoaXMubGVuZ3RoIC0gMSl7XHJcbiAgICAgIHJldHVybiB0aGlzLnRva2Vuc1t0aGlzLmxlbmd0aC0xXTtcclxuICB9XHJcbiAgcmV0dXJuIHRoaXMudG9rZW5zW3Bvc107XHJcbn1cclxuICAvLyBsb29rYWhlYWRcclxub3AubGEgPSBmdW5jdGlvbihrKXtcclxuICByZXR1cm4gKHRoaXMubGwoaykgfHwgJycpLnR5cGU7XHJcbn1cclxuXHJcbm9wLm1hdGNoID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbDtcclxuICBpZighKGxsID0gdGhpcy5lYXQodHlwZSwgdmFsdWUpKSl7XHJcbiAgICBsbCAgPSB0aGlzLmxsKCk7XHJcbiAgICB0aGlzLmVycm9yKCdleHBlY3QgWycgKyB0eXBlICsgKHZhbHVlID09IG51bGw/ICcnOic6JysgdmFsdWUpICsgJ11cIiAtPiBnb3QgXCJbJyArIGxsLnR5cGUgKyAodmFsdWU9PW51bGw/ICcnOic6JytsbC52YWx1ZSkgKyAnXScsIGxsLnBvcylcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBsbDtcclxuICB9XHJcbn1cclxuXHJcbm9wLmVycm9yID0gZnVuY3Rpb24obXNnLCBwb3Mpe1xyXG4gIG1zZyA9ICBcIlxcbuOAkCBwYXJzZSBmYWlsZWQg44CRIFwiICsgbXNnICsgICc6XFxuXFxuJyArIF8udHJhY2tFcnJvclBvcyh0aGlzLmlucHV0LCB0eXBlb2YgcG9zID09PSAnbnVtYmVyJz8gcG9zOiB0aGlzLmxsKCkucG9zfHwwKTtcclxuICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcclxufVxyXG5cclxub3AubmV4dCA9IGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgdGhpcy5wb3MgKz0gaztcclxufVxyXG5vcC5lYXQgPSBmdW5jdGlvbih0eXBlLCB2YWx1ZSl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIGlmKHR5cGVvZiB0eXBlICE9PSAnc3RyaW5nJyl7XHJcbiAgICBmb3IodmFyIGxlbiA9IHR5cGUubGVuZ3RoIDsgbGVuLS07KXtcclxuICAgICAgaWYobGwudHlwZSA9PT0gdHlwZVtsZW5dKSB7XHJcbiAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgcmV0dXJuIGxsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbGwudHlwZSA9PT0gdHlwZSAmJiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJyB8fCBsbC52YWx1ZSA9PT0gdmFsdWUpICl7XHJcbiAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgIHJldHVybiBsbDtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vLyBwcm9ncmFtXHJcbi8vICA6RU9GXHJcbi8vICB8IChzdGF0ZW1lbnQpKiBFT0Zcclxub3AucHJvZ3JhbSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIHN0YXRlbWVudHMgPSBbXSwgIGxsID0gdGhpcy5sbCgpO1xyXG4gIHdoaWxlKGxsLnR5cGUgIT09ICdFT0YnICYmIGxsLnR5cGUgIT09J1RBR19DTE9TRScpe1xyXG5cclxuICAgIHN0YXRlbWVudHMucHVzaCh0aGlzLnN0YXRlbWVudCgpKTtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gIH1cclxuICAvLyBpZihsbC50eXBlID09PSAnVEFHX0NMT1NFJykgdGhpcy5lcnJvcihcIllvdSBtYXkgaGF2ZSB1bm1hdGNoZWQgVGFnXCIpXHJcbiAgcmV0dXJuIHN0YXRlbWVudHM7XHJcbn1cclxuXHJcbi8vIHN0YXRlbWVudFxyXG4vLyAgOiB4bWxcclxuLy8gIHwganN0XHJcbi8vICB8IHRleHRcclxub3Auc3RhdGVtZW50ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSAnTkFNRSc6XHJcbiAgICBjYXNlICdURVhUJzpcclxuICAgICAgdmFyIHRleHQgPSBsbC52YWx1ZTtcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHdoaWxlKGxsID0gdGhpcy5lYXQoWydOQU1FJywgJ1RFWFQnXSkpe1xyXG4gICAgICAgIHRleHQgKz0gbGwudmFsdWU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5vZGUudGV4dCh0ZXh0KTtcclxuICAgIGNhc2UgJ1RBR19PUEVOJzpcclxuICAgICAgcmV0dXJuIHRoaXMueG1sKCk7XHJcbiAgICBjYXNlICdPUEVOJzogXHJcbiAgICAgIHJldHVybiB0aGlzLmRpcmVjdGl2ZSgpO1xyXG4gICAgY2FzZSAnRVhQUl9PUEVOJzpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHRva2VuOiAnKyB0aGlzLmxhKCkpXHJcbiAgfVxyXG59XHJcblxyXG4vLyB4bWwgXHJcbi8vIHN0YWcgc3RhdGVtZW50KiBUQUdfQ0xPU0U/KGlmIHNlbGYtY2xvc2VkIHRhZylcclxub3AueG1sID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbmFtZSwgYXR0cnMsIGNoaWxkcmVuLCBzZWxmQ2xvc2VkO1xyXG4gIG5hbWUgPSB0aGlzLm1hdGNoKCdUQUdfT1BFTicpLnZhbHVlO1xyXG4gIGF0dHJzID0gdGhpcy5hdHRycygpO1xyXG4gIHNlbGZDbG9zZWQgPSB0aGlzLmVhdCgnLycpXHJcbiAgdGhpcy5tYXRjaCgnPicpO1xyXG4gIGlmKCAhc2VsZkNsb3NlZCAmJiAhXy5pc1ZvaWRUYWcobmFtZSkgKXtcclxuICAgIGNoaWxkcmVuID0gdGhpcy5wcm9ncmFtKCk7XHJcbiAgICBpZighdGhpcy5lYXQoJ1RBR19DTE9TRScsIG5hbWUpKSB0aGlzLmVycm9yKCdleHBlY3QgPC8nK25hbWUrJz4gZ290JysgJ25vIG1hdGNoZWQgY2xvc2VUYWcnKVxyXG4gIH1cclxuICByZXR1cm4gbm9kZS5lbGVtZW50KG5hbWUsIGF0dHJzLCBjaGlsZHJlbik7XHJcbn1cclxuXHJcbi8vIHhlbnRpdHlcclxuLy8gIC1ydWxlKHdyYXAgYXR0cmlidXRlKVxyXG4vLyAgLWF0dHJpYnV0ZVxyXG4vL1xyXG4vLyBfX2V4YW1wbGVfX1xyXG4vLyAgbmFtZSA9IDEgfCAgXHJcbi8vICBuZy1oaWRlIHxcclxuLy8gIG9uLWNsaWNrPXt7fX0gfCBcclxuLy8gIHt7I2lmIG5hbWV9fW9uLWNsaWNrPXt7eHh9fXt7I2Vsc2V9fW9uLXRhcD17e319e3svaWZ9fVxyXG5cclxub3AueGVudGl0eSA9IGZ1bmN0aW9uKGxsKXtcclxuICB2YXIgbmFtZSA9IGxsLnZhbHVlLCB2YWx1ZSwgbW9kaWZpZXI7XHJcbiAgaWYobGwudHlwZSA9PT0gJ05BTUUnKXtcclxuICAgIC8vQCBvbmx5IGZvciB0ZXN0XHJcbiAgICBpZih+bmFtZS5pbmRleE9mKCcuJykpe1xyXG4gICAgICB2YXIgdG1wID0gbmFtZS5zcGxpdCgnLicpO1xyXG4gICAgICBuYW1lID0gdG1wWzBdO1xyXG4gICAgICBtb2RpZmllciA9IHRtcFsxXVxyXG5cclxuICAgIH1cclxuICAgIGlmKCB0aGlzLmVhdChcIj1cIikgKSB2YWx1ZSA9IHRoaXMuYXR0dmFsdWUobW9kaWZpZXIpO1xyXG4gICAgcmV0dXJuIG5vZGUuYXR0cmlidXRlKCBuYW1lLCB2YWx1ZSwgbW9kaWZpZXIgKTtcclxuICB9ZWxzZXtcclxuICAgIGlmKCBuYW1lICE9PSAnaWYnKSB0aGlzLmVycm9yKFwiY3VycmVudCB2ZXJzaW9uLiBPTkxZIFJVTEUgI2lmICNlbHNlICNlbHNlaWYgaXMgdmFsaWQgaW4gdGFnLCB0aGUgcnVsZSAjXCIgKyBuYW1lICsgJyBpcyBpbnZhbGlkJyk7XHJcbiAgICByZXR1cm4gdGhpc1snaWYnXSh0cnVlKTtcclxuICB9XHJcblxyXG59XHJcblxyXG4vLyBzdGFnICAgICA6Oj0gICAgJzwnIE5hbWUgKFMgYXR0cikqIFM/ICc+JyAgXHJcbi8vIGF0dHIgICAgOjo9ICAgICBOYW1lIEVxIGF0dHZhbHVlXHJcbm9wLmF0dHJzID0gZnVuY3Rpb24oaXNBdHRyaWJ1dGUpe1xyXG4gIHZhciBlYXRcclxuICBpZighaXNBdHRyaWJ1dGUpe1xyXG4gICAgZWF0ID0gW1wiTkFNRVwiLCBcIk9QRU5cIl1cclxuICB9ZWxzZXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIl1cclxuICB9XHJcblxyXG4gIHZhciBhdHRycyA9IFtdLCBsbDtcclxuICB3aGlsZSAobGwgPSB0aGlzLmVhdChlYXQpKXtcclxuICAgIGF0dHJzLnB1c2godGhpcy54ZW50aXR5KCBsbCApKVxyXG4gIH1cclxuICByZXR1cm4gYXR0cnM7XHJcbn1cclxuXHJcbi8vIGF0dHZhbHVlXHJcbi8vICA6IFNUUklORyAgXHJcbi8vICB8IE5BTUVcclxub3AuYXR0dmFsdWUgPSBmdW5jdGlvbihtZGYpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwiTkFNRVwiOlxyXG4gICAgY2FzZSBcIlVOUVwiOlxyXG4gICAgY2FzZSBcIlNUUklOR1wiOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgdmFyIHZhbHVlID0gbGwudmFsdWU7XHJcbiAgICAgIGlmKH52YWx1ZS5pbmRleE9mKGNvbmZpZy5CRUdJTikgJiYgfnZhbHVlLmluZGV4T2YoY29uZmlnLkVORCkgJiYgbWRmIT09J2NtcGwnKXtcclxuICAgICAgICB2YXIgY29uc3RhbnQgPSB0cnVlO1xyXG4gICAgICAgIHZhciBwYXJzZWQgPSBuZXcgUGFyc2VyKHZhbHVlLCB7IG1vZGU6IDIgfSkucGFyc2UoKTtcclxuICAgICAgICBpZihwYXJzZWQubGVuZ3RoID09PSAxICYmIHBhcnNlZFswXS50eXBlID09PSAnZXhwcmVzc2lvbicpIHJldHVybiBwYXJzZWRbMF07XHJcbiAgICAgICAgdmFyIGJvZHkgPSBbXTtcclxuICAgICAgICBwYXJzZWQuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgIGlmKCFpdGVtLmNvbnN0YW50KSBjb25zdGFudD1mYWxzZTtcclxuICAgICAgICAgIC8vIHNpbGVudCB0aGUgbXV0aXBsZSBpbnRlcGxhdGlvblxyXG4gICAgICAgICAgICBib2R5LnB1c2goaXRlbS5ib2R5IHx8IFwiJ1wiICsgaXRlbS50ZXh0LnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKSArIFwiJ1wiKTsgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJvZHkgPSBcIltcIiArIGJvZHkuam9pbihcIixcIikgKyBcIl0uam9pbignJylcIjtcclxuICAgICAgICB2YWx1ZSA9IG5vZGUuZXhwcmVzc2lvbihib2R5LCBudWxsLCBjb25zdGFudCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgY2FzZSBcIkVYUFJfT1BFTlwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnBsYXRpb24oKTtcclxuICAgIC8vIGNhc2UgXCJPUEVOXCI6XHJcbiAgICAvLyAgIGlmKGxsLnZhbHVlID09PSAnaW5jJyB8fCBsbC52YWx1ZSA9PT0gJ2luY2x1ZGUnKXtcclxuICAgIC8vICAgICB0aGlzLm5leHQoKTtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5pbmMoKTtcclxuICAgIC8vICAgfWVsc2V7XHJcbiAgICAvLyAgICAgdGhpcy5lcnJvcignYXR0cmlidXRlIHZhbHVlIG9ubHkgc3VwcG9ydCBpbnRlcGxhdGlvbiBhbmQgeyNpbmN9IHN0YXRlbWVudCcpXHJcbiAgICAvLyAgIH1cclxuICAgIC8vICAgYnJlYWs7XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHRva2VuOiAnKyB0aGlzLmxhKCkpXHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8ge3sjfX1cclxub3AuZGlyZWN0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbmFtZSA9IHRoaXMubGwoKS52YWx1ZTtcclxuICB0aGlzLm5leHQoKTtcclxuICBpZih0eXBlb2YgdGhpc1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJyl7XHJcbiAgICByZXR1cm4gdGhpc1tuYW1lXSgpXHJcbiAgfWVsc2V7XHJcbiAgICB0aGlzLmVycm9yKCdVbmRlZmluZWQgZGlyZWN0aXZlWycrIG5hbWUgKyddJyk7XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLy8ge3t9fVxyXG5vcC5pbnRlcnBsYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMubWF0Y2goJ0VYUFJfT1BFTicpO1xyXG4gIHZhciByZXMgPSB0aGlzLmV4cHJlc3Npb24odHJ1ZSk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLy8ge3t+fX1cclxub3AuaW5jID0gb3AuaW5jbHVkZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvbnRlbnQgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuICByZXR1cm4gbm9kZS50ZW1wbGF0ZShjb250ZW50KTtcclxufVxyXG5cclxuLy8ge3sjaWZ9fVxyXG5vcFtcImlmXCJdID0gZnVuY3Rpb24odGFnKXtcclxuICB2YXIgdGVzdCA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gIHZhciBjb25zZXF1ZW50ID0gW10sIGFsdGVybmF0ZT1bXTtcclxuXHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcbiAgdmFyIHN0YXRlbWVudCA9ICF0YWc/IFwic3RhdGVtZW50XCIgOiBcImF0dHJzXCI7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG5cclxuICB2YXIgbGwsIGNsb3NlO1xyXG4gIHdoaWxlKCAhIChjbG9zZSA9IHRoaXMuZWF0KCdDTE9TRScpKSApe1xyXG4gICAgbGwgPSB0aGlzLmxsKCk7XHJcbiAgICBpZiggbGwudHlwZSA9PT0gJ09QRU4nICl7XHJcbiAgICAgIHN3aXRjaCggbGwudmFsdWUgKXtcclxuICAgICAgICBjYXNlICdlbHNlJzpcclxuICAgICAgICAgIGNvbnRhaW5lciA9IGFsdGVybmF0ZTtcclxuICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgdGhpcy5tYXRjaCggJ0VORCcgKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ2Vsc2VpZic6XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIGFsdGVybmF0ZS5wdXNoKCB0aGlzW1wiaWZcIl0odGFnKSApO1xyXG4gICAgICAgICAgcmV0dXJuIG5vZGVbJ2lmJ10oIHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSApO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBjb250YWluZXIucHVzaCggdGhpc1tzdGF0ZW1lbnRdKHRydWUpICk7XHJcbiAgICAgIH1cclxuICAgIH1lbHNle1xyXG4gICAgICBjb250YWluZXIucHVzaCh0aGlzW3N0YXRlbWVudF0odHJ1ZSkpO1xyXG4gICAgfVxyXG4gIH1cclxuICAvLyBpZiBzdGF0ZW1lbnQgbm90IG1hdGNoZWRcclxuICBpZihjbG9zZS52YWx1ZSAhPT0gXCJpZlwiKSB0aGlzLmVycm9yKCdVbm1hdGNoZWQgaWYgZGlyZWN0aXZlJylcclxuICByZXR1cm4gbm9kZVtcImlmXCJdKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSk7XHJcbn1cclxuXHJcblxyXG4vLyBAbWFyayAgIG11c3RhY2hlIHN5bnRheCBoYXZlIG5hdHJ1cmUgZGlzLCBjYW5vdCB3aXRoIGV4cHJlc3Npb25cclxuLy8ge3sjbGlzdH19XHJcbm9wLmxpc3QgPSBmdW5jdGlvbigpe1xyXG4gIC8vIHNlcXVlbmNlIGNhbiBiZSBhIGxpc3Qgb3IgaGFzaFxyXG4gIHZhciBzZXF1ZW5jZSA9IHRoaXMuZXhwcmVzc2lvbigpLCB2YXJpYWJsZSwgbGwsIHRyYWNrO1xyXG4gIHZhciBjb25zZXF1ZW50ID0gW10sIGFsdGVybmF0ZT1bXTtcclxuICB2YXIgY29udGFpbmVyID0gY29uc2VxdWVudDtcclxuXHJcbiAgdGhpcy5tYXRjaCgnSURFTlQnLCAnYXMnKTtcclxuXHJcbiAgdmFyaWFibGUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG5cclxuICBpZih0aGlzLmVhdCgnSURFTlQnLCAnYnknKSl7XHJcbiAgICBpZih0aGlzLmVhdCgnSURFTlQnLHZhcmlhYmxlICsgJ19pbmRleCcpKXtcclxuICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRyYWNrID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgICAgIGlmKHRyYWNrLmNvbnN0YW50KXtcclxuICAgICAgICAvLyB0cnVlIGlzIG1lYW5zIGNvbnN0YW50LCB3ZSBoYW5kbGUgaXQganVzdCBsaWtlIHh4eF9pbmRleC5cclxuICAgICAgICB0cmFjayA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG5cclxuICB3aGlsZSggIShsbCA9IHRoaXMuZWF0KCdDTE9TRScpKSApe1xyXG4gICAgaWYodGhpcy5lYXQoJ09QRU4nLCAnZWxzZScpKXtcclxuICAgICAgY29udGFpbmVyID0gIGFsdGVybmF0ZTtcclxuICAgICAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGlmKGxsLnZhbHVlICE9PSAnbGlzdCcpIHRoaXMuZXJyb3IoJ2V4cGVjdCAnICsgJ2xpc3QgZ290ICcgKyAnLycgKyBsbC52YWx1ZSArICcgJywgbGwucG9zICk7XHJcbiAgcmV0dXJuIG5vZGUubGlzdChzZXF1ZW5jZSwgdmFyaWFibGUsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSwgdHJhY2spO1xyXG59XHJcblxyXG5cclxub3AuZXhwcmVzc2lvbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGV4cHJlc3Npb247XHJcbiAgaWYodGhpcy5lYXQoJ0AoJykpeyAvL29uY2UgYmluZFxyXG4gICAgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcigpO1xyXG4gICAgZXhwcmVzc2lvbi5vbmNlID0gdHJ1ZTtcclxuICAgIHRoaXMubWF0Y2goJyknKVxyXG4gIH1lbHNle1xyXG4gICAgZXhwcmVzc2lvbiA9IHRoaXMuZXhwcigpO1xyXG4gIH1cclxuICByZXR1cm4gZXhwcmVzc2lvbjtcclxufVxyXG5cclxub3AuZXhwciA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5kZXBlbmQgPSBbXTtcclxuXHJcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuZmlsdGVyKClcclxuXHJcbiAgdmFyIGJvZHkgPSBidWZmZXIuZ2V0IHx8IGJ1ZmZlcjtcclxuICB2YXIgc2V0Ym9keSA9IGJ1ZmZlci5zZXQ7XHJcbiAgcmV0dXJuIG5vZGUuZXhwcmVzc2lvbihib2R5LCBzZXRib2R5LCAhdGhpcy5kZXBlbmQubGVuZ3RoLCBidWZmZXIuZmlsdGVycyk7XHJcbn1cclxuXHJcblxyXG4vLyBmaWx0ZXJcclxuLy8gYXNzaWduICgnfCcgZmlsdGVybmFtZVsnOicgYXJnc10pICogXHJcbm9wLmZpbHRlciA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLmFzc2lnbigpO1xyXG4gIHZhciBsbCA9IHRoaXMuZWF0KCd8Jyk7XHJcbiAgdmFyIGJ1ZmZlciA9IFtdLCBmaWx0ZXJzLHNldEJ1ZmZlciwgcHJlZml4LFxyXG4gICAgYXR0ciA9IFwidFwiLCBcclxuICAgIHNldCA9IGxlZnQuc2V0LCBnZXQsIFxyXG4gICAgdG1wID0gXCJcIjtcclxuXHJcbiAgaWYobGwpe1xyXG4gICAgaWYoc2V0KSB7XHJcbiAgICAgIHNldEJ1ZmZlciA9IFtdO1xyXG4gICAgICBmaWx0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHJlZml4ID0gXCIoZnVuY3Rpb24oXCIgKyBhdHRyICsgXCIpe1wiO1xyXG5cclxuICAgIGRve1xyXG4gICAgICB2YXIgZmlsdGVyTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgIHRtcCA9IGF0dHIgKyBcIiA9IFwiICsgY3R4TmFtZSArIFwiLl9mXygnXCIgKyBmaWx0ZXJOYW1lICsgXCInICkuZ2V0LmNhbGwoIFwiK18uY3R4TmFtZSArXCIsXCIgKyBhdHRyIDtcclxuICAgICAgaWYodGhpcy5lYXQoJzonKSl7XHJcbiAgICAgICAgdG1wICs9XCIsIFwiKyB0aGlzLmFyZ3VtZW50cyhcInxcIikuam9pbihcIixcIikgKyBcIik7XCJcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdG1wICs9ICcpOydcclxuICAgICAgfVxyXG4gICAgICBidWZmZXIucHVzaCh0bXApO1xyXG4gICAgICBcclxuICAgICAgaWYoc2V0KXtcclxuICAgICAgICAvLyBvbmx5IGluIHJ1bnRpbWUgLHdlIGNhbiBkZXRlY3QgIHdoZXRoZXIgIHRoZSBmaWx0ZXIgaGFzIGEgc2V0IGZ1bmN0aW9uLiBcclxuICAgICAgICBmaWx0ZXJzLnB1c2goZmlsdGVyTmFtZSk7XHJcbiAgICAgICAgc2V0QnVmZmVyLnVuc2hpZnQoIHRtcC5yZXBsYWNlKFwiICkuZ2V0LmNhbGxcIiwgXCIgKS5zZXQuY2FsbFwiKSApO1xyXG4gICAgICB9XHJcblxyXG4gICAgfXdoaWxlKGxsID0gdGhpcy5lYXQoJ3wnKSk7XHJcbiAgICBidWZmZXIucHVzaChcInJldHVybiBcIiArIGF0dHIgKTtcclxuICAgIHNldEJ1ZmZlciAmJiBzZXRCdWZmZXIucHVzaChcInJldHVybiBcIiArIGF0dHIpO1xyXG5cclxuICAgIGdldCA9ICBwcmVmaXggKyBidWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIrbGVmdC5nZXQrXCIpXCI7XHJcbiAgICAvLyB3ZSBjYWxsIGJhY2sgdG8gdmFsdWUuXHJcbiAgICBpZihzZXRCdWZmZXIpe1xyXG4gICAgICAvLyBjaGFuZ2UgX3NzX18obmFtZSwgX3BfKSB0byBfc19fKG5hbWUsIGZpbHRlckZuKF9wXykpO1xyXG4gICAgICBzZXQgPSBzZXQucmVwbGFjZShfLnNldE5hbWUsIFxyXG4gICAgICAgIHByZWZpeCArIHNldEJ1ZmZlci5qb2luKFwiXCIpICsgXCJ9KShcIivjgIBfLnNldE5hbWXjgIArXCIpXCIgKTtcclxuXHJcbiAgICB9XHJcbiAgICAvLyB0aGUgc2V0IGZ1bmN0aW9uIGlzIGRlcGVuZCBvbiB0aGUgZmlsdGVyIGRlZmluaXRpb24uIGlmIGl0IGhhdmUgc2V0IG1ldGhvZCwgdGhlIHNldCB3aWxsIHdvcmtcclxuICAgIHZhciByZXQgPSBnZXRzZXQoZ2V0LCBzZXQpO1xyXG4gICAgcmV0LmZpbHRlcnMgPSBmaWx0ZXJzO1xyXG4gICAgcmV0dXJuIHJldDtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbi8vIGFzc2lnblxyXG4vLyBsZWZ0LWhhbmQtZXhwciA9IGNvbmRpdGlvblxyXG5vcC5hc3NpZ24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5jb25kaXRpb24oKSwgbGw7XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJz0nLCAnKz0nLCAnLT0nLCAnKj0nLCAnLz0nLCAnJT0nXSkpe1xyXG4gICAgaWYoIWxlZnQuc2V0KSB0aGlzLmVycm9yKCdpbnZhbGlkIGxlZnRoYW5kIGV4cHJlc3Npb24gaW4gYXNzaWdubWVudCBleHByZXNzaW9uJyk7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCBsZWZ0LnNldC5yZXBsYWNlKCBcIixcIiArIF8uc2V0TmFtZSwgXCIsXCIgKyB0aGlzLmNvbmRpdGlvbigpLmdldCApLnJlcGxhY2UoXCInPSdcIiwgXCInXCIrbGwudHlwZStcIidcIiksIGxlZnQuc2V0KTtcclxuICAgIC8vIHJldHVybiBnZXRzZXQoJygnICsgbGVmdC5nZXQgKyBsbC50eXBlICArIHRoaXMuY29uZGl0aW9uKCkuZ2V0ICsgJyknLCBsZWZ0LnNldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBvclxyXG4vLyBvciA/IGFzc2lnbiA6IGFzc2lnblxyXG5vcC5jb25kaXRpb24gPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgdGVzdCA9IHRoaXMub3IoKTtcclxuICBpZih0aGlzLmVhdCgnPycpKXtcclxuICAgIHJldHVybiBnZXRzZXQoW3Rlc3QuZ2V0ICsgXCI/XCIsIFxyXG4gICAgICB0aGlzLmFzc2lnbigpLmdldCwgXHJcbiAgICAgIHRoaXMubWF0Y2goXCI6XCIpLnR5cGUsIFxyXG4gICAgICB0aGlzLmFzc2lnbigpLmdldF0uam9pbihcIlwiKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gdGVzdDtcclxufVxyXG5cclxuLy8gYW5kXHJcbi8vIGFuZCAmJiBvclxyXG5vcC5vciA9IGZ1bmN0aW9uKCl7XHJcblxyXG4gIHZhciBsZWZ0ID0gdGhpcy5hbmQoKTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ3x8Jykpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArICd8fCcgKyB0aGlzLm9yKCkuZ2V0KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcbi8vIGVxdWFsXHJcbi8vIGVxdWFsICYmIGFuZFxyXG5vcC5hbmQgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuZXF1YWwoKTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJyYmJykpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArICcmJicgKyB0aGlzLmFuZCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcbi8vIHJlbGF0aW9uXHJcbi8vIFxyXG4vLyBlcXVhbCA9PSByZWxhdGlvblxyXG4vLyBlcXVhbCAhPSByZWxhdGlvblxyXG4vLyBlcXVhbCA9PT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT09IHJlbGF0aW9uXHJcbm9wLmVxdWFsID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMucmVsYXRpb24oKSwgbGw7XHJcbiAgLy8gQHBlcmY7XHJcbiAgaWYoIGxsID0gdGhpcy5lYXQoWyc9PScsJyE9JywgJz09PScsICchPT0nXSkpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnR5cGUgKyB0aGlzLmVxdWFsKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyByZWxhdGlvbiA8IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID4gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPD0gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gPj0gYWRkaXRpdmVcclxuLy8gcmVsYXRpb24gaW4gYWRkaXRpdmVcclxub3AucmVsYXRpb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hZGRpdGl2ZSgpLCBsbDtcclxuICAvLyBAcGVyZlxyXG4gIGlmKGxsID0gKHRoaXMuZWF0KFsnPCcsICc+JywgJz49JywgJzw9J10pIHx8IHRoaXMuZWF0KCdJREVOVCcsICdpbicpICkpe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5yZWxhdGlvbigpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gYWRkaXRpdmUgOlxyXG4vLyBtdWx0aXZlXHJcbi8vIGFkZGl0aXZlICsgbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSAtIG11bHRpdmVcclxub3AuYWRkaXRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5tdWx0aXZlKCkgLGxsO1xyXG4gIGlmKGxsPSB0aGlzLmVhdChbJysnLCctJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudmFsdWUgKyB0aGlzLmFkZGl0aXZlKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnRcclxufVxyXG4vLyBtdWx0aXZlIDpcclxuLy8gdW5hcnlcclxuLy8gbXVsdGl2ZSAqIHVuYXJ5XHJcbi8vIG11bHRpdmUgLyB1bmFyeVxyXG4vLyBtdWx0aXZlICUgdW5hcnlcclxub3AubXVsdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJhbmdlKCkgLGxsO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnKicsICcvJyAsJyUnXSkgKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5tdWx0aXZlKCkuZ2V0KTtcclxuICB9XHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcbm9wLnJhbmdlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMudW5hcnkoKSwgbGwsIHJpZ2h0O1xyXG5cclxuICBpZihsbCA9IHRoaXMuZWF0KCcuLicpKXtcclxuICAgIHJpZ2h0ID0gdGhpcy51bmFyeSgpO1xyXG4gICAgdmFyIGJvZHkgPSBcclxuICAgICAgXCIoZnVuY3Rpb24oc3RhcnQsZW5kKXt2YXIgcmVzID0gW10sc3RlcD1lbmQ+c3RhcnQ/MTotMTsgZm9yKHZhciBpID0gc3RhcnQ7IGVuZD5zdGFydD9pIDw9IGVuZDogaT49ZW5kOyBpPWkrc3RlcCl7cmVzLnB1c2goaSk7IH0gcmV0dXJuIHJlcyB9KShcIitsZWZ0LmdldCtcIixcIityaWdodC5nZXQrXCIpXCJcclxuICAgIHJldHVybiBnZXRzZXQoYm9keSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuXHJcblxyXG4vLyBsZWZ0aGFuZFxyXG4vLyArIHVuYXJ5XHJcbi8vIC0gdW5hcnlcclxuLy8gfiB1bmFyeVxyXG4vLyAhIHVuYXJ5XHJcbm9wLnVuYXJ5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGw7XHJcbiAgaWYobGwgPSB0aGlzLmVhdChbJysnLCctJywnficsICchJ10pKXtcclxuICAgIHJldHVybiBnZXRzZXQoJygnICsgbGwudHlwZSArIHRoaXMudW5hcnkoKS5nZXQgKyAnKScpIDtcclxuICB9ZWxzZXtcclxuICAgIHJldHVybiB0aGlzLm1lbWJlcigpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBjYWxsW2xlZnRoYW5kXSA6XHJcbi8vIG1lbWJlciBhcmdzXHJcbi8vIG1lbWJlciBbIGV4cHJlc3Npb24gXVxyXG4vLyBtZW1iZXIgLiBpZGVudCAgXHJcblxyXG5vcC5tZW1iZXIgPSBmdW5jdGlvbihiYXNlLCBsYXN0LCBwYXRoZXMsIHByZXZCYXNlKXtcclxuICB2YXIgbGwsIHBhdGgsIGV4dFZhbHVlO1xyXG5cclxuXHJcbiAgdmFyIG9ubHlTaW1wbGVBY2Nlc3NvciA9IGZhbHNlO1xyXG4gIGlmKCFiYXNlKXsgLy9maXJzdFxyXG4gICAgcGF0aCA9IHRoaXMucHJpbWFyeSgpO1xyXG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgcGF0aDtcclxuICAgIGlmKHR5cGUgPT09ICdzdHJpbmcnKXsgXHJcbiAgICAgIHBhdGhlcyA9IFtdO1xyXG4gICAgICBwYXRoZXMucHVzaCggcGF0aCApO1xyXG4gICAgICBsYXN0ID0gcGF0aDtcclxuICAgICAgZXh0VmFsdWUgPSBleHROYW1lICsgXCIuXCIgKyBwYXRoXHJcbiAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXygnXCIgKyBwYXRoICsgXCInLCBcIiArIHZhck5hbWUgKyBcIiwgXCIgKyBleHROYW1lICsgXCIpXCI7XHJcbiAgICAgIG9ubHlTaW1wbGVBY2Nlc3NvciA9IHRydWU7XHJcbiAgICB9ZWxzZXsgLy9QcmltYXRpdmUgVHlwZVxyXG4gICAgICBpZihwYXRoLmdldCA9PT0gJ3RoaXMnKXtcclxuICAgICAgICBiYXNlID0gY3R4TmFtZTtcclxuICAgICAgICBwYXRoZXMgPSBbJ3RoaXMnXTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcGF0aGVzID0gbnVsbDtcclxuICAgICAgICBiYXNlID0gcGF0aC5nZXQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9ZWxzZXsgLy8gbm90IGZpcnN0IGVudGVyXHJcbiAgICBpZih0eXBlb2YgbGFzdCA9PT0gJ3N0cmluZycgJiYgaXNQYXRoKCBsYXN0KSApeyAvLyBpcyB2YWxpZCBwYXRoXHJcbiAgICAgIHBhdGhlcy5wdXNoKGxhc3QpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGlmKHBhdGhlcyAmJiBwYXRoZXMubGVuZ3RoKSB0aGlzLmRlcGVuZC5wdXNoKHBhdGhlcyk7XHJcbiAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKGxsID0gdGhpcy5lYXQoWydbJywgJy4nLCAnKCddKSl7XHJcbiAgICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICAgIGNhc2UgJy4nOlxyXG4gICAgICAgICAgLy8gbWVtYmVyKG9iamVjdCwgcHJvcGVydHksIGNvbXB1dGVkKVxyXG4gICAgICAgIHZhciB0bXBOYW1lID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuICAgICAgICBwcmV2QmFzZSA9IGJhc2U7XHJcbiAgICAgICAgaWYoIHRoaXMubGEoKSAhPT0gXCIoXCIgKXsgXHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgdG1wTmFtZSArIFwiJywgXCIgKyBiYXNlICsgXCIpXCI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICBiYXNlICs9IFwiWydcIiArIHRtcE5hbWUgKyBcIiddXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlciggYmFzZSwgdG1wTmFtZSwgcGF0aGVzLCAgcHJldkJhc2UpO1xyXG4gICAgICBjYXNlICdbJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICBwYXRoID0gdGhpcy5hc3NpZ24oKTtcclxuICAgICAgICBwcmV2QmFzZSA9IGJhc2U7XHJcbiAgICAgICAgaWYoIHRoaXMubGEoKSAhPT0gXCIoXCIgKXsgXHJcbiAgICAgICAgLy8gbWVhbnMgZnVuY3Rpb24gY2FsbCwgd2UgbmVlZCB0aHJvdyB1bmRlZmluZWQgZXJyb3Igd2hlbiBjYWxsIGZ1bmN0aW9uXHJcbiAgICAgICAgLy8gYW5kIGNvbmZpcm0gdGhhdCB0aGUgZnVuY3Rpb24gY2FsbCB3b250IGxvc2UgaXRzIGNvbnRleHRcclxuICAgICAgICAgIGJhc2UgPSBjdHhOYW1lICsgXCIuX3NnXyhcIiArIHBhdGguZ2V0ICsgXCIsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIltcIiArIHBhdGguZ2V0ICsgXCJdXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMubWF0Y2goJ10nKVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1lbWJlcihiYXNlLCBwYXRoLCBwYXRoZXMsIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnKCc6XHJcbiAgICAgICAgLy8gY2FsbChjYWxsZWUsIGFyZ3MpXHJcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3VtZW50cygpLmpvaW4oJywnKTtcclxuICAgICAgICBiYXNlID0gIGJhc2UrXCIoXCIgKyBhcmdzICtcIilcIjtcclxuICAgICAgICB0aGlzLm1hdGNoKCcpJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgbnVsbCwgcGF0aGVzKTtcclxuICAgIH1cclxuICB9XHJcbiAgaWYoIHBhdGhlcyAmJiBwYXRoZXMubGVuZ3RoICkgdGhpcy5kZXBlbmQucHVzaCggcGF0aGVzICk7XHJcbiAgdmFyIHJlcyA9ICB7Z2V0OiBiYXNlfTtcclxuICBpZihsYXN0KXtcclxuICAgIHJlcy5zZXQgPSBjdHhOYW1lICsgXCIuX3NzXyhcIiArIFxyXG4gICAgICAgIChsYXN0LmdldD8gbGFzdC5nZXQgOiBcIidcIisgbGFzdCArIFwiJ1wiKSArIFxyXG4gICAgICAgIFwiLFwiKyBfLnNldE5hbWUgKyBcIixcIisgXHJcbiAgICAgICAgKHByZXZCYXNlP3ByZXZCYXNlOl8udmFyTmFtZSkgKyBcclxuICAgICAgICBcIiwgJz0nLCBcIisgKCBvbmx5U2ltcGxlQWNjZXNzb3I/IDEgOiAwICkgKyBcIilcIjtcclxuICBcclxuICB9XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKi9cclxub3AuYXJndW1lbnRzID0gZnVuY3Rpb24oZW5kKXtcclxuICBlbmQgPSBlbmQgfHwgJyknXHJcbiAgdmFyIGFyZ3MgPSBbXTtcclxuICBkb3tcclxuICAgIGlmKHRoaXMubGEoKSAhPT0gZW5kKXtcclxuICAgICAgYXJncy5wdXNoKHRoaXMuYXNzaWduKCkuZ2V0KVxyXG4gICAgfVxyXG4gIH13aGlsZSggdGhpcy5lYXQoJywnKSk7XHJcbiAgcmV0dXJuIGFyZ3NcclxufVxyXG5cclxuXHJcbi8vIHByaW1hcnkgOlxyXG4vLyB0aGlzIFxyXG4vLyBpZGVudFxyXG4vLyBsaXRlcmFsXHJcbi8vIGFycmF5XHJcbi8vIG9iamVjdFxyXG4vLyAoIGV4cHJlc3Npb24gKVxyXG5cclxub3AucHJpbWFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgXCJ7XCI6XHJcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xyXG4gICAgY2FzZSBcIltcIjpcclxuICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcclxuICAgIGNhc2UgXCIoXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLnBhcmVuKCk7XHJcbiAgICAvLyBsaXRlcmFsIG9yIGlkZW50XHJcbiAgICBjYXNlICdTVFJJTkcnOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgdmFyIHZhbHVlID0gXCJcIiArIGxsLnZhbHVlO1xyXG4gICAgICB2YXIgcXVvdGEgPSB+dmFsdWUuaW5kZXhPZihcIidcIik/IFwiXFxcIlwiOiBcIidcIiA7XHJcbiAgICAgIHJldHVybiBnZXRzZXQocXVvdGEgKyB2YWx1ZSArIHF1b3RhKTtcclxuICAgIGNhc2UgJ05VTUJFUic6XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KCBcIlwiICsgbGwudmFsdWUgKTtcclxuICAgIGNhc2UgXCJJREVOVFwiOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgaWYoaXNLZXlXb3JkKGxsLnZhbHVlKSl7XHJcbiAgICAgICAgcmV0dXJuIGdldHNldCggbGwudmFsdWUgKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGwudmFsdWU7XHJcbiAgICBkZWZhdWx0OiBcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCBUb2tlbjogJyArIGxsLnR5cGUpO1xyXG4gIH1cclxufVxyXG5cclxuLy8gb2JqZWN0XHJcbi8vICB7cHJvcEFzc2lnbiBbLCBwcm9wQXNzaWduXSAqIFssXX1cclxuXHJcbi8vIHByb3BBc3NpZ25cclxuLy8gIHByb3AgOiBhc3NpZ25cclxuXHJcbi8vIHByb3BcclxuLy8gIFNUUklOR1xyXG4vLyAgSURFTlRcclxuLy8gIE5VTUJFUlxyXG5cclxub3Aub2JqZWN0ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29kZSA9IFt0aGlzLm1hdGNoKCd7JykudHlwZV07XHJcblxyXG4gIHZhciBsbCA9IHRoaXMuZWF0KCBbJ1NUUklORycsICdJREVOVCcsICdOVU1CRVInXSApO1xyXG4gIHdoaWxlKGxsKXtcclxuICAgIGNvZGUucHVzaChcIidcIiArIGxsLnZhbHVlICsgXCInXCIgKyB0aGlzLm1hdGNoKCc6JykudHlwZSk7XHJcbiAgICB2YXIgZ2V0ID0gdGhpcy5hc3NpZ24oKS5nZXQ7XHJcbiAgICBjb2RlLnB1c2goZ2V0KTtcclxuICAgIGxsID0gbnVsbDtcclxuICAgIGlmKHRoaXMuZWF0KFwiLFwiKSAmJiAobGwgPSB0aGlzLmVhdChbJ1NUUklORycsICdJREVOVCcsICdOVU1CRVInXSkpICkgY29kZS5wdXNoKFwiLFwiKTtcclxuICB9XHJcbiAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ30nKS50eXBlKTtcclxuICByZXR1cm4ge2dldDogY29kZS5qb2luKFwiXCIpfVxyXG59XHJcblxyXG4vLyBhcnJheVxyXG4vLyBbIGFzc2lnblssYXNzaWduXSpdXHJcbm9wLmFycmF5ID0gZnVuY3Rpb24oKXtcclxuICB2YXIgY29kZSA9IFt0aGlzLm1hdGNoKCdbJykudHlwZV0sIGl0ZW07XHJcbiAgaWYoIHRoaXMuZWF0KFwiXVwiKSApe1xyXG5cclxuICAgICBjb2RlLnB1c2goXCJdXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3aGlsZShpdGVtID0gdGhpcy5hc3NpZ24oKSl7XHJcbiAgICAgIGNvZGUucHVzaChpdGVtLmdldCk7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCcsJykpIGNvZGUucHVzaChcIixcIik7XHJcbiAgICAgIGVsc2UgYnJlYWs7XHJcbiAgICB9XHJcbiAgICBjb2RlLnB1c2godGhpcy5tYXRjaCgnXScpLnR5cGUpO1xyXG4gIH1cclxuICByZXR1cm4ge2dldDogY29kZS5qb2luKFwiXCIpfTtcclxufVxyXG5cclxuLy8gJygnIGV4cHJlc3Npb24gJyknXHJcbm9wLnBhcmVuID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCcoJyk7XHJcbiAgdmFyIHJlcyA9IHRoaXMuZmlsdGVyKClcclxuICByZXMuZ2V0ID0gJygnICsgcmVzLmdldCArICcpJztcclxuICByZXMuc2V0ID0gcmVzLnNldDtcclxuICB0aGlzLm1hdGNoKCcpJyk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0c2V0KGdldCwgc2V0KXtcclxuICByZXR1cm4ge1xyXG4gICAgZ2V0OiBnZXQsXHJcbiAgICBzZXQ6IHNldFxyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlcjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL1BhcnNlci5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcblxuLy8gRE9NIEFQSXMsIGZvciBjb21wbGV0ZW5lc3NcblxuZXhwb3J0cy5zZXRUaW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldFRpbWVvdXQsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJUaW1lb3V0KTtcbn07XG5leHBvcnRzLnNldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGltZW91dChhcHBseS5jYWxsKHNldEludGVydmFsLCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFySW50ZXJ2YWwpO1xufTtcbmV4cG9ydHMuY2xlYXJUaW1lb3V0ID1cbmV4cG9ydHMuY2xlYXJJbnRlcnZhbCA9IGZ1bmN0aW9uKHRpbWVvdXQpIHtcbiAgaWYgKHRpbWVvdXQpIHtcbiAgICB0aW1lb3V0LmNsb3NlKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gc2V0aW1tZWRpYXRlIGF0dGFjaGVzIGl0c2VsZiB0byB0aGUgZ2xvYmFsIG9iamVjdFxucmVxdWlyZShcInNldGltbWVkaWF0ZVwiKTtcbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuZXhwb3J0cy5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvLjIuMC40QHRpbWVycy1icm93c2VyaWZ5L21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIoZnVuY3Rpb24gKGdsb2JhbCwgdW5kZWZpbmVkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAoZ2xvYmFsLnNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG5leHRIYW5kbGUgPSAxOyAvLyBTcGVjIHNheXMgZ3JlYXRlciB0aGFuIHplcm9cbiAgICB2YXIgdGFza3NCeUhhbmRsZSA9IHt9O1xuICAgIHZhciBjdXJyZW50bHlSdW5uaW5nQVRhc2sgPSBmYWxzZTtcbiAgICB2YXIgZG9jID0gZ2xvYmFsLmRvY3VtZW50O1xuICAgIHZhciByZWdpc3RlckltbWVkaWF0ZTtcblxuICAgIGZ1bmN0aW9uIHNldEltbWVkaWF0ZShjYWxsYmFjaykge1xuICAgICAgLy8gQ2FsbGJhY2sgY2FuIGVpdGhlciBiZSBhIGZ1bmN0aW9uIG9yIGEgc3RyaW5nXG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBuZXcgRnVuY3Rpb24oXCJcIiArIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICAgIC8vIENvcHkgZnVuY3Rpb24gYXJndW1lbnRzXG4gICAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXTtcbiAgICAgIH1cbiAgICAgIC8vIFN0b3JlIGFuZCByZWdpc3RlciB0aGUgdGFza1xuICAgICAgdmFyIHRhc2sgPSB7IGNhbGxiYWNrOiBjYWxsYmFjaywgYXJnczogYXJncyB9O1xuICAgICAgdGFza3NCeUhhbmRsZVtuZXh0SGFuZGxlXSA9IHRhc2s7XG4gICAgICByZWdpc3RlckltbWVkaWF0ZShuZXh0SGFuZGxlKTtcbiAgICAgIHJldHVybiBuZXh0SGFuZGxlKys7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGRlbGV0ZSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuKHRhc2spIHtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gdGFzay5jYWxsYmFjaztcbiAgICAgICAgdmFyIGFyZ3MgPSB0YXNrLmFyZ3M7XG4gICAgICAgIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICBjYWxsYmFjayhhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcnVuSWZQcmVzZW50KGhhbmRsZSkge1xuICAgICAgICAvLyBGcm9tIHRoZSBzcGVjOiBcIldhaXQgdW50aWwgYW55IGludm9jYXRpb25zIG9mIHRoaXMgYWxnb3JpdGhtIHN0YXJ0ZWQgYmVmb3JlIHRoaXMgb25lIGhhdmUgY29tcGxldGVkLlwiXG4gICAgICAgIC8vIFNvIGlmIHdlJ3JlIGN1cnJlbnRseSBydW5uaW5nIGEgdGFzaywgd2UnbGwgbmVlZCB0byBkZWxheSB0aGlzIGludm9jYXRpb24uXG4gICAgICAgIGlmIChjdXJyZW50bHlSdW5uaW5nQVRhc2spIHtcbiAgICAgICAgICAgIC8vIERlbGF5IGJ5IGRvaW5nIGEgc2V0VGltZW91dC4gc2V0SW1tZWRpYXRlIHdhcyB0cmllZCBpbnN0ZWFkLCBidXQgaW4gRmlyZWZveCA3IGl0IGdlbmVyYXRlZCBhXG4gICAgICAgICAgICAvLyBcInRvbyBtdWNoIHJlY3Vyc2lvblwiIGVycm9yLlxuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdGFzayA9IHRhc2tzQnlIYW5kbGVbaGFuZGxlXTtcbiAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBydW4odGFzayk7XG4gICAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE5leHRUaWNrSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZ1bmN0aW9uICgpIHsgcnVuSWZQcmVzZW50KGhhbmRsZSk7IH0pO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNhblVzZVBvc3RNZXNzYWdlKCkge1xuICAgICAgICAvLyBUaGUgdGVzdCBhZ2FpbnN0IGBpbXBvcnRTY3JpcHRzYCBwcmV2ZW50cyB0aGlzIGltcGxlbWVudGF0aW9uIGZyb20gYmVpbmcgaW5zdGFsbGVkIGluc2lkZSBhIHdlYiB3b3JrZXIsXG4gICAgICAgIC8vIHdoZXJlIGBnbG9iYWwucG9zdE1lc3NhZ2VgIG1lYW5zIHNvbWV0aGluZyBjb21wbGV0ZWx5IGRpZmZlcmVudCBhbmQgY2FuJ3QgYmUgdXNlZCBmb3IgdGhpcyBwdXJwb3NlLlxuICAgICAgICBpZiAoZ2xvYmFsLnBvc3RNZXNzYWdlICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgICAgICAgICAgdmFyIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIG9sZE9uTWVzc2FnZSA9IGdsb2JhbC5vbm1lc3NhZ2U7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcG9zdE1lc3NhZ2VJc0FzeW5jaHJvbm91cyA9IGZhbHNlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShcIlwiLCBcIipcIik7XG4gICAgICAgICAgICBnbG9iYWwub25tZXNzYWdlID0gb2xkT25NZXNzYWdlO1xuICAgICAgICAgICAgcmV0dXJuIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgLy8gSW5zdGFsbHMgYW4gZXZlbnQgaGFuZGxlciBvbiBgZ2xvYmFsYCBmb3IgdGhlIGBtZXNzYWdlYCBldmVudDogc2VlXG4gICAgICAgIC8vICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vRE9NL3dpbmRvdy5wb3N0TWVzc2FnZVxuICAgICAgICAvLyAqIGh0dHA6Ly93d3cud2hhdHdnLm9yZy9zcGVjcy93ZWItYXBwcy9jdXJyZW50LXdvcmsvbXVsdGlwYWdlL2NvbW1zLmh0bWwjY3Jvc3NEb2N1bWVudE1lc3NhZ2VzXG5cbiAgICAgICAgdmFyIG1lc3NhZ2VQcmVmaXggPSBcInNldEltbWVkaWF0ZSRcIiArIE1hdGgucmFuZG9tKCkgKyBcIiRcIjtcbiAgICAgICAgdmFyIG9uR2xvYmFsTWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQuc291cmNlID09PSBnbG9iYWwgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2YgZXZlbnQuZGF0YSA9PT0gXCJzdHJpbmdcIiAmJlxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGEuaW5kZXhPZihtZXNzYWdlUHJlZml4KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudCgrZXZlbnQuZGF0YS5zbGljZShtZXNzYWdlUHJlZml4Lmxlbmd0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSwgZmFsc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZ2xvYmFsLmF0dGFjaEV2ZW50KFwib25tZXNzYWdlXCIsIG9uR2xvYmFsTWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKG1lc3NhZ2VQcmVmaXggKyBoYW5kbGUsIFwiKlwiKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsTWVzc2FnZUNoYW5uZWxJbXBsZW1lbnRhdGlvbigpIHtcbiAgICAgICAgdmFyIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGhhbmRsZSA9IGV2ZW50LmRhdGE7XG4gICAgICAgICAgICBydW5JZlByZXNlbnQoaGFuZGxlKTtcbiAgICAgICAgfTtcblxuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZShoYW5kbGUpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBodG1sID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIDxzY3JpcHQ+IGVsZW1lbnQ7IGl0cyByZWFkeXN0YXRlY2hhbmdlIGV2ZW50IHdpbGwgYmUgZmlyZWQgYXN5bmNocm9ub3VzbHkgb25jZSBpdCBpcyBpbnNlcnRlZFxuICAgICAgICAgICAgLy8gaW50byB0aGUgZG9jdW1lbnQuIERvIHNvLCB0aHVzIHF1ZXVpbmcgdXAgdGhlIHRhc2suIFJlbWVtYmVyIHRvIGNsZWFuIHVwIG9uY2UgaXQncyBiZWVuIGNhbGxlZC5cbiAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2MuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgc2NyaXB0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaHRtbC5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICAgICAgICAgICAgICAgIHNjcmlwdCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaHRtbC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxTZXRUaW1lb3V0SW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHJ1bklmUHJlc2VudCwgMCwgaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBJZiBzdXBwb3J0ZWQsIHdlIHNob3VsZCBhdHRhY2ggdG8gdGhlIHByb3RvdHlwZSBvZiBnbG9iYWwsIHNpbmNlIHRoYXQgaXMgd2hlcmUgc2V0VGltZW91dCBldCBhbC4gbGl2ZS5cbiAgICB2YXIgYXR0YWNoVG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbCk7XG4gICAgYXR0YWNoVG8gPSBhdHRhY2hUbyAmJiBhdHRhY2hUby5zZXRUaW1lb3V0ID8gYXR0YWNoVG8gOiBnbG9iYWw7XG5cbiAgICAvLyBEb24ndCBnZXQgZm9vbGVkIGJ5IGUuZy4gYnJvd3NlcmlmeSBlbnZpcm9ubWVudHMuXG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIikge1xuICAgICAgICAvLyBGb3IgTm9kZS5qcyBiZWZvcmUgMC45XG4gICAgICAgIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGNhblVzZVBvc3RNZXNzYWdlKCkpIHtcbiAgICAgICAgLy8gRm9yIG5vbi1JRTEwIG1vZGVybiBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsUG9zdE1lc3NhZ2VJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChnbG9iYWwuTWVzc2FnZUNoYW5uZWwpIHtcbiAgICAgICAgLy8gRm9yIHdlYiB3b3JrZXJzLCB3aGVyZSBzdXBwb3J0ZWRcbiAgICAgICAgaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZG9jICYmIFwib25yZWFkeXN0YXRlY2hhbmdlXCIgaW4gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIikpIHtcbiAgICAgICAgLy8gRm9yIElFIDbigJM4XG4gICAgICAgIGluc3RhbGxSZWFkeVN0YXRlQ2hhbmdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvciBvbGRlciBicm93c2Vyc1xuICAgICAgICBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCk7XG4gICAgfVxuXG4gICAgYXR0YWNoVG8uc2V0SW1tZWRpYXRlID0gc2V0SW1tZWRpYXRlO1xuICAgIGF0dGFjaFRvLmNsZWFySW1tZWRpYXRlID0gY2xlYXJJbW1lZGlhdGU7XG59KHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIGdsb2JhbCA9PT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMgOiBnbG9iYWwgOiBzZWxmKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy8uMS4wLjVAc2V0aW1tZWRpYXRlL3NldEltbWVkaWF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy8uMC4xMS4xMEBwcm9jZXNzL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBzaGltIGZvciBlczVcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciB0c3RyID0gKHt9KS50b1N0cmluZztcclxuXHJcbmZ1bmN0aW9uIGV4dGVuZChvMSwgbzIgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmKCBvMVtpXSA9PT0gdW5kZWZpbmVkKXtcclxuICAgIG8xW2ldID0gbzJbaV1cclxuICB9XHJcbiAgcmV0dXJuIG8yO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIC8vIFN0cmluZyBwcm90byA7XHJcbiAgZXh0ZW5kKFN0cmluZy5wcm90b3R5cGUsIHtcclxuICAgIHRyaW06IGZ1bmN0aW9uKCl7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG4gIC8vIEFycmF5IHByb3RvO1xyXG4gIGV4dGVuZChBcnJheS5wcm90b3R5cGUsIHtcclxuICAgIGluZGV4T2Y6IGZ1bmN0aW9uKG9iaiwgZnJvbSl7XHJcbiAgICAgIGZyb20gPSBmcm9tIHx8IDA7XHJcbiAgICAgIGZvciAodmFyIGkgPSBmcm9tLCBsZW4gPSB0aGlzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikgcmV0dXJuIGk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfSxcclxuICAgIC8vIHBvbHlmaWxsIGZyb20gTUROIFxyXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvemgtQ04vZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaFxyXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oY2FsbGJhY2ssIGN0eCl7XHJcbiAgICAgIHZhciBrID0gMDtcclxuXHJcbiAgICAgIC8vIDEuIExldCBPIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyBUb09iamVjdCBwYXNzaW5nIHRoZSB8dGhpc3wgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcclxuXHJcbiAgICAgIHZhciBsZW4gPSBPLmxlbmd0aCA+Pj4gMDsgXHJcblxyXG4gICAgICBpZiAoIHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiICkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoIGNhbGxiYWNrICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIiApO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyA3LiBSZXBlYXQsIHdoaWxlIGsgPCBsZW5cclxuICAgICAgd2hpbGUoIGsgPCBsZW4gKSB7XHJcblxyXG4gICAgICAgIHZhciBrVmFsdWU7XHJcblxyXG4gICAgICAgIGlmICggayBpbiBPICkge1xyXG5cclxuICAgICAgICAgIGtWYWx1ZSA9IE9bIGsgXTtcclxuXHJcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKCBjdHgsIGtWYWx1ZSwgaywgTyApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBrKys7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyBAZGVwcmVjYXRlZFxyXG4gICAgLy8gIHdpbGwgYmUgcmVtb3ZlZCBhdCAwLjUuMFxyXG4gICAgZmlsdGVyOiBmdW5jdGlvbihmdW4sIGNvbnRleHQpe1xyXG5cclxuICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XHJcbiAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcclxuICAgICAgaWYgKHR5cGVvZiBmdW4gIT09IFwiZnVuY3Rpb25cIilcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XHJcblxyXG4gICAgICB2YXIgcmVzID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXHJcbiAgICAgIHtcclxuICAgICAgICBpZiAoaSBpbiB0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhciB2YWwgPSB0W2ldO1xyXG4gICAgICAgICAgaWYgKGZ1bi5jYWxsKGNvbnRleHQsIHZhbCwgaSwgdCkpXHJcbiAgICAgICAgICAgIHJlcy5wdXNoKHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcmVzO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBGdW5jdGlvbiBwcm90bztcclxuICBleHRlbmQoRnVuY3Rpb24ucHJvdG90eXBlLCB7XHJcbiAgICBiaW5kOiBmdW5jdGlvbihjb250ZXh0KXtcclxuICAgICAgdmFyIGZuID0gdGhpcztcclxuICAgICAgdmFyIHByZUFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XHJcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBhcmdzID0gcHJlQXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcclxuICAgICAgICByZXR1cm4gZm4uYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KVxyXG4gIFxyXG4gIC8vIEFycmF5XHJcbiAgZXh0ZW5kKEFycmF5LCB7XHJcbiAgICBpc0FycmF5OiBmdW5jdGlvbihhcnIpe1xyXG4gICAgICByZXR1cm4gdHN0ci5jYWxsKGFycikgPT09IFwiW29iamVjdCBBcnJheV1cIjtcclxuICAgIH1cclxuICB9KVxyXG59XHJcblxyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvaGVscGVyL3NoaW0uanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMzU0MDY0L2hvdy10by1jb252ZXJ0LWNoYXJhY3RlcnMtdG8taHRtbC1lbnRpdGllcy11c2luZy1wbGFpbi1qYXZhc2NyaXB0XHJcbnZhciBlbnRpdGllcyA9IHtcclxuICAncXVvdCc6MzQsIFxyXG4gICdhbXAnOjM4LCBcclxuICAnYXBvcyc6MzksIFxyXG4gICdsdCc6NjAsIFxyXG4gICdndCc6NjIsIFxyXG4gICduYnNwJzoxNjAsIFxyXG4gICdpZXhjbCc6MTYxLCBcclxuICAnY2VudCc6MTYyLCBcclxuICAncG91bmQnOjE2MywgXHJcbiAgJ2N1cnJlbic6MTY0LCBcclxuICAneWVuJzoxNjUsIFxyXG4gICdicnZiYXInOjE2NiwgXHJcbiAgJ3NlY3QnOjE2NywgXHJcbiAgJ3VtbCc6MTY4LCBcclxuICAnY29weSc6MTY5LCBcclxuICAnb3JkZic6MTcwLCBcclxuICAnbGFxdW8nOjE3MSwgXHJcbiAgJ25vdCc6MTcyLCBcclxuICAnc2h5JzoxNzMsIFxyXG4gICdyZWcnOjE3NCwgXHJcbiAgJ21hY3InOjE3NSwgXHJcbiAgJ2RlZyc6MTc2LCBcclxuICAncGx1c21uJzoxNzcsIFxyXG4gICdzdXAyJzoxNzgsIFxyXG4gICdzdXAzJzoxNzksIFxyXG4gICdhY3V0ZSc6MTgwLCBcclxuICAnbWljcm8nOjE4MSwgXHJcbiAgJ3BhcmEnOjE4MiwgXHJcbiAgJ21pZGRvdCc6MTgzLCBcclxuICAnY2VkaWwnOjE4NCwgXHJcbiAgJ3N1cDEnOjE4NSwgXHJcbiAgJ29yZG0nOjE4NiwgXHJcbiAgJ3JhcXVvJzoxODcsIFxyXG4gICdmcmFjMTQnOjE4OCwgXHJcbiAgJ2ZyYWMxMic6MTg5LCBcclxuICAnZnJhYzM0JzoxOTAsIFxyXG4gICdpcXVlc3QnOjE5MSwgXHJcbiAgJ0FncmF2ZSc6MTkyLCBcclxuICAnQWFjdXRlJzoxOTMsIFxyXG4gICdBY2lyYyc6MTk0LCBcclxuICAnQXRpbGRlJzoxOTUsIFxyXG4gICdBdW1sJzoxOTYsIFxyXG4gICdBcmluZyc6MTk3LCBcclxuICAnQUVsaWcnOjE5OCwgXHJcbiAgJ0NjZWRpbCc6MTk5LCBcclxuICAnRWdyYXZlJzoyMDAsIFxyXG4gICdFYWN1dGUnOjIwMSwgXHJcbiAgJ0VjaXJjJzoyMDIsIFxyXG4gICdFdW1sJzoyMDMsIFxyXG4gICdJZ3JhdmUnOjIwNCwgXHJcbiAgJ0lhY3V0ZSc6MjA1LCBcclxuICAnSWNpcmMnOjIwNiwgXHJcbiAgJ0l1bWwnOjIwNywgXHJcbiAgJ0VUSCc6MjA4LCBcclxuICAnTnRpbGRlJzoyMDksIFxyXG4gICdPZ3JhdmUnOjIxMCwgXHJcbiAgJ09hY3V0ZSc6MjExLCBcclxuICAnT2NpcmMnOjIxMiwgXHJcbiAgJ090aWxkZSc6MjEzLCBcclxuICAnT3VtbCc6MjE0LCBcclxuICAndGltZXMnOjIxNSwgXHJcbiAgJ09zbGFzaCc6MjE2LCBcclxuICAnVWdyYXZlJzoyMTcsIFxyXG4gICdVYWN1dGUnOjIxOCwgXHJcbiAgJ1VjaXJjJzoyMTksIFxyXG4gICdVdW1sJzoyMjAsIFxyXG4gICdZYWN1dGUnOjIyMSwgXHJcbiAgJ1RIT1JOJzoyMjIsIFxyXG4gICdzemxpZyc6MjIzLCBcclxuICAnYWdyYXZlJzoyMjQsIFxyXG4gICdhYWN1dGUnOjIyNSwgXHJcbiAgJ2FjaXJjJzoyMjYsIFxyXG4gICdhdGlsZGUnOjIyNywgXHJcbiAgJ2F1bWwnOjIyOCwgXHJcbiAgJ2FyaW5nJzoyMjksIFxyXG4gICdhZWxpZyc6MjMwLCBcclxuICAnY2NlZGlsJzoyMzEsIFxyXG4gICdlZ3JhdmUnOjIzMiwgXHJcbiAgJ2VhY3V0ZSc6MjMzLCBcclxuICAnZWNpcmMnOjIzNCwgXHJcbiAgJ2V1bWwnOjIzNSwgXHJcbiAgJ2lncmF2ZSc6MjM2LCBcclxuICAnaWFjdXRlJzoyMzcsIFxyXG4gICdpY2lyYyc6MjM4LCBcclxuICAnaXVtbCc6MjM5LCBcclxuICAnZXRoJzoyNDAsIFxyXG4gICdudGlsZGUnOjI0MSwgXHJcbiAgJ29ncmF2ZSc6MjQyLCBcclxuICAnb2FjdXRlJzoyNDMsIFxyXG4gICdvY2lyYyc6MjQ0LCBcclxuICAnb3RpbGRlJzoyNDUsIFxyXG4gICdvdW1sJzoyNDYsIFxyXG4gICdkaXZpZGUnOjI0NywgXHJcbiAgJ29zbGFzaCc6MjQ4LCBcclxuICAndWdyYXZlJzoyNDksIFxyXG4gICd1YWN1dGUnOjI1MCwgXHJcbiAgJ3VjaXJjJzoyNTEsIFxyXG4gICd1dW1sJzoyNTIsIFxyXG4gICd5YWN1dGUnOjI1MywgXHJcbiAgJ3Rob3JuJzoyNTQsIFxyXG4gICd5dW1sJzoyNTUsIFxyXG4gICdmbm9mJzo0MDIsIFxyXG4gICdBbHBoYSc6OTEzLCBcclxuICAnQmV0YSc6OTE0LCBcclxuICAnR2FtbWEnOjkxNSwgXHJcbiAgJ0RlbHRhJzo5MTYsIFxyXG4gICdFcHNpbG9uJzo5MTcsIFxyXG4gICdaZXRhJzo5MTgsIFxyXG4gICdFdGEnOjkxOSwgXHJcbiAgJ1RoZXRhJzo5MjAsIFxyXG4gICdJb3RhJzo5MjEsIFxyXG4gICdLYXBwYSc6OTIyLCBcclxuICAnTGFtYmRhJzo5MjMsIFxyXG4gICdNdSc6OTI0LCBcclxuICAnTnUnOjkyNSwgXHJcbiAgJ1hpJzo5MjYsIFxyXG4gICdPbWljcm9uJzo5MjcsIFxyXG4gICdQaSc6OTI4LCBcclxuICAnUmhvJzo5MjksIFxyXG4gICdTaWdtYSc6OTMxLCBcclxuICAnVGF1Jzo5MzIsIFxyXG4gICdVcHNpbG9uJzo5MzMsIFxyXG4gICdQaGknOjkzNCwgXHJcbiAgJ0NoaSc6OTM1LCBcclxuICAnUHNpJzo5MzYsIFxyXG4gICdPbWVnYSc6OTM3LCBcclxuICAnYWxwaGEnOjk0NSwgXHJcbiAgJ2JldGEnOjk0NiwgXHJcbiAgJ2dhbW1hJzo5NDcsIFxyXG4gICdkZWx0YSc6OTQ4LCBcclxuICAnZXBzaWxvbic6OTQ5LCBcclxuICAnemV0YSc6OTUwLCBcclxuICAnZXRhJzo5NTEsIFxyXG4gICd0aGV0YSc6OTUyLCBcclxuICAnaW90YSc6OTUzLCBcclxuICAna2FwcGEnOjk1NCwgXHJcbiAgJ2xhbWJkYSc6OTU1LCBcclxuICAnbXUnOjk1NiwgXHJcbiAgJ251Jzo5NTcsIFxyXG4gICd4aSc6OTU4LCBcclxuICAnb21pY3Jvbic6OTU5LCBcclxuICAncGknOjk2MCwgXHJcbiAgJ3Jobyc6OTYxLCBcclxuICAnc2lnbWFmJzo5NjIsIFxyXG4gICdzaWdtYSc6OTYzLCBcclxuICAndGF1Jzo5NjQsIFxyXG4gICd1cHNpbG9uJzo5NjUsIFxyXG4gICdwaGknOjk2NiwgXHJcbiAgJ2NoaSc6OTY3LCBcclxuICAncHNpJzo5NjgsIFxyXG4gICdvbWVnYSc6OTY5LCBcclxuICAndGhldGFzeW0nOjk3NywgXHJcbiAgJ3Vwc2loJzo5NzgsIFxyXG4gICdwaXYnOjk4MiwgXHJcbiAgJ2J1bGwnOjgyMjYsIFxyXG4gICdoZWxsaXAnOjgyMzAsIFxyXG4gICdwcmltZSc6ODI0MiwgXHJcbiAgJ1ByaW1lJzo4MjQzLCBcclxuICAnb2xpbmUnOjgyNTQsIFxyXG4gICdmcmFzbCc6ODI2MCwgXHJcbiAgJ3dlaWVycCc6ODQ3MiwgXHJcbiAgJ2ltYWdlJzo4NDY1LCBcclxuICAncmVhbCc6ODQ3NiwgXHJcbiAgJ3RyYWRlJzo4NDgyLCBcclxuICAnYWxlZnN5bSc6ODUwMSwgXHJcbiAgJ2xhcnInOjg1OTIsIFxyXG4gICd1YXJyJzo4NTkzLCBcclxuICAncmFycic6ODU5NCwgXHJcbiAgJ2RhcnInOjg1OTUsIFxyXG4gICdoYXJyJzo4NTk2LCBcclxuICAnY3JhcnInOjg2MjksIFxyXG4gICdsQXJyJzo4NjU2LCBcclxuICAndUFycic6ODY1NywgXHJcbiAgJ3JBcnInOjg2NTgsIFxyXG4gICdkQXJyJzo4NjU5LCBcclxuICAnaEFycic6ODY2MCwgXHJcbiAgJ2ZvcmFsbCc6ODcwNCwgXHJcbiAgJ3BhcnQnOjg3MDYsIFxyXG4gICdleGlzdCc6ODcwNywgXHJcbiAgJ2VtcHR5Jzo4NzA5LCBcclxuICAnbmFibGEnOjg3MTEsIFxyXG4gICdpc2luJzo4NzEyLCBcclxuICAnbm90aW4nOjg3MTMsIFxyXG4gICduaSc6ODcxNSwgXHJcbiAgJ3Byb2QnOjg3MTksIFxyXG4gICdzdW0nOjg3MjEsIFxyXG4gICdtaW51cyc6ODcyMiwgXHJcbiAgJ2xvd2FzdCc6ODcyNywgXHJcbiAgJ3JhZGljJzo4NzMwLCBcclxuICAncHJvcCc6ODczMywgXHJcbiAgJ2luZmluJzo4NzM0LCBcclxuICAnYW5nJzo4NzM2LCBcclxuICAnYW5kJzo4NzQzLCBcclxuICAnb3InOjg3NDQsIFxyXG4gICdjYXAnOjg3NDUsIFxyXG4gICdjdXAnOjg3NDYsIFxyXG4gICdpbnQnOjg3NDcsIFxyXG4gICd0aGVyZTQnOjg3NTYsIFxyXG4gICdzaW0nOjg3NjQsIFxyXG4gICdjb25nJzo4NzczLCBcclxuICAnYXN5bXAnOjg3NzYsIFxyXG4gICduZSc6ODgwMCwgXHJcbiAgJ2VxdWl2Jzo4ODAxLCBcclxuICAnbGUnOjg4MDQsIFxyXG4gICdnZSc6ODgwNSwgXHJcbiAgJ3N1Yic6ODgzNCwgXHJcbiAgJ3N1cCc6ODgzNSwgXHJcbiAgJ25zdWInOjg4MzYsIFxyXG4gICdzdWJlJzo4ODM4LCBcclxuICAnc3VwZSc6ODgzOSwgXHJcbiAgJ29wbHVzJzo4ODUzLCBcclxuICAnb3RpbWVzJzo4ODU1LCBcclxuICAncGVycCc6ODg2OSwgXHJcbiAgJ3Nkb3QnOjg5MDEsIFxyXG4gICdsY2VpbCc6ODk2OCwgXHJcbiAgJ3JjZWlsJzo4OTY5LCBcclxuICAnbGZsb29yJzo4OTcwLCBcclxuICAncmZsb29yJzo4OTcxLCBcclxuICAnbGFuZyc6OTAwMSwgXHJcbiAgJ3JhbmcnOjkwMDIsIFxyXG4gICdsb3onOjk2NzQsIFxyXG4gICdzcGFkZXMnOjk4MjQsIFxyXG4gICdjbHVicyc6OTgyNywgXHJcbiAgJ2hlYXJ0cyc6OTgyOSwgXHJcbiAgJ2RpYW1zJzo5ODMwLCBcclxuICAnT0VsaWcnOjMzOCwgXHJcbiAgJ29lbGlnJzozMzksIFxyXG4gICdTY2Fyb24nOjM1MiwgXHJcbiAgJ3NjYXJvbic6MzUzLCBcclxuICAnWXVtbCc6Mzc2LCBcclxuICAnY2lyYyc6NzEwLCBcclxuICAndGlsZGUnOjczMiwgXHJcbiAgJ2Vuc3AnOjgxOTQsIFxyXG4gICdlbXNwJzo4MTk1LCBcclxuICAndGhpbnNwJzo4MjAxLCBcclxuICAnenduaic6ODIwNCwgXHJcbiAgJ3p3aic6ODIwNSwgXHJcbiAgJ2xybSc6ODIwNiwgXHJcbiAgJ3JsbSc6ODIwNywgXHJcbiAgJ25kYXNoJzo4MjExLCBcclxuICAnbWRhc2gnOjgyMTIsIFxyXG4gICdsc3F1byc6ODIxNiwgXHJcbiAgJ3JzcXVvJzo4MjE3LCBcclxuICAnc2JxdW8nOjgyMTgsIFxyXG4gICdsZHF1byc6ODIyMCwgXHJcbiAgJ3JkcXVvJzo4MjIxLCBcclxuICAnYmRxdW8nOjgyMjIsIFxyXG4gICdkYWdnZXInOjgyMjQsIFxyXG4gICdEYWdnZXInOjgyMjUsIFxyXG4gICdwZXJtaWwnOjgyNDAsIFxyXG4gICdsc2FxdW8nOjgyNDksIFxyXG4gICdyc2FxdW8nOjgyNTAsIFxyXG4gICdldXJvJzo4MzY0XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgID0gZW50aXRpZXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2hlbHBlci9lbnRpdGllcy5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICBlbGVtZW50OiBmdW5jdGlvbihuYW1lLCBhdHRycywgY2hpbGRyZW4pe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2VsZW1lbnQnLFxyXG4gICAgICB0YWc6IG5hbWUsXHJcbiAgICAgIGF0dHJzOiBhdHRycyxcclxuICAgICAgY2hpbGRyZW46IGNoaWxkcmVuXHJcbiAgICB9XHJcbiAgfSxcclxuICBhdHRyaWJ1dGU6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBtZGYpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgbWRmOiBtZGZcclxuICAgIH1cclxuICB9LFxyXG4gIFwiaWZcIjogZnVuY3Rpb24odGVzdCwgY29uc2VxdWVudCwgYWx0ZXJuYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdpZicsXHJcbiAgICAgIHRlc3Q6IHRlc3QsXHJcbiAgICAgIGNvbnNlcXVlbnQ6IGNvbnNlcXVlbnQsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlXHJcbiAgICB9XHJcbiAgfSxcclxuICBsaXN0OiBmdW5jdGlvbihzZXF1ZW5jZSwgdmFyaWFibGUsIGJvZHksIGFsdGVybmF0ZSwgdHJhY2spe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ2xpc3QnLFxyXG4gICAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXHJcbiAgICAgIGFsdGVybmF0ZTogYWx0ZXJuYXRlLFxyXG4gICAgICB2YXJpYWJsZTogdmFyaWFibGUsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIHRyYWNrOiB0cmFja1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZXhwcmVzc2lvbjogZnVuY3Rpb24oIGJvZHksIHNldGJvZHksIGNvbnN0YW50LCBmaWx0ZXJzICl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcImV4cHJlc3Npb25cIixcclxuICAgICAgYm9keTogYm9keSxcclxuICAgICAgY29uc3RhbnQ6IGNvbnN0YW50IHx8IGZhbHNlLFxyXG4gICAgICBzZXRib2R5OiBzZXRib2R5IHx8IGZhbHNlLFxyXG4gICAgICBmaWx0ZXJzOiBmaWx0ZXJzXHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZXh0OiBmdW5jdGlvbih0ZXh0KXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICB0ZXh0OiB0ZXh0XHJcbiAgICB9XHJcbiAgfSxcclxuICB0ZW1wbGF0ZTogZnVuY3Rpb24odGVtcGxhdGUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ3RlbXBsYXRlJyxcclxuICAgICAgY29udGVudDogdGVtcGxhdGVcclxuICAgIH1cclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9wYXJzZXIvc3JjL25vZGUuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIF8gPSByZXF1aXJlKFwiLi4vdXRpbC5qc1wiKTtcclxudmFyIGNvbmZpZyA9IHJlcXVpcmUoXCIuLi9jb25maWcuanNcIik7XHJcblxyXG4vLyBzb21lIGN1c3RvbSB0YWcgIHdpbGwgY29uZmxpY3Qgd2l0aCB0aGUgTGV4ZXIgcHJvZ3Jlc3NcclxudmFyIGNvbmZsaWN0VGFnID0ge1wifVwiOiBcIntcIiwgXCJdXCI6IFwiW1wifSwgbWFwMSwgbWFwMjtcclxuLy8gc29tZSBtYWNybyBmb3IgbGV4ZXJcclxudmFyIG1hY3JvID0ge1xyXG4gICdOQU1FJzogLyg/Ols6X0EtWmEtel1bLVxcLjpfMC05QS1aYS16XSopLyxcclxuICAnSURFTlQnOiAvW1xcJF9BLVphLXpdW18wLTlBLVphLXpcXCRdKi8sXHJcbiAgJ1NQQUNFJzogL1tcXHJcXG5cXHRcXGYgXS9cclxufVxyXG5cclxuXHJcbnZhciB0ZXN0ID0gL2F8KGIpLy5leGVjKFwiYVwiKTtcclxudmFyIHRlc3RTdWJDYXB1cmUgPSB0ZXN0ICYmIHRlc3RbMV0gPT09IHVuZGVmaW5lZD8gXHJcbiAgZnVuY3Rpb24oc3RyKXsgcmV0dXJuIHN0ciAhPT0gdW5kZWZpbmVkIH1cclxuICA6ZnVuY3Rpb24oc3RyKXtyZXR1cm4gISFzdHJ9O1xyXG5cclxuZnVuY3Rpb24gd3JhcEhhbmRlcihoYW5kbGVyKXtcclxuICByZXR1cm4gZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7dHlwZTogaGFuZGxlciwgdmFsdWU6IGFsbCB9XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBMZXhlcihpbnB1dCwgb3B0cyl7XHJcbiAgaWYoY29uZmxpY3RUYWdbY29uZmlnLkVORF0pe1xyXG4gICAgdGhpcy5tYXJrU3RhcnQgPSBjb25mbGljdFRhZ1tjb25maWcuRU5EXTtcclxuICAgIHRoaXMubWFya0VuZCA9IGNvbmZpZy5FTkQ7XHJcbiAgfVxyXG5cclxuICB0aGlzLmlucHV0ID0gKGlucHV0fHxcIlwiKS50cmltKCk7XHJcbiAgdGhpcy5vcHRzID0gb3B0cyB8fCB7fTtcclxuICB0aGlzLm1hcCA9IHRoaXMub3B0cy5tb2RlICE9PSAyPyAgbWFwMTogbWFwMjtcclxuICB0aGlzLnN0YXRlcyA9IFtcIklOSVRcIl07XHJcbiAgaWYob3B0cyAmJiBvcHRzLmV4cHJlc3Npb24pe1xyXG4gICAgIHRoaXMuc3RhdGVzLnB1c2goXCJKU1RcIik7XHJcbiAgICAgdGhpcy5leHByZXNzaW9uID0gdHJ1ZTtcclxuICB9XHJcbn1cclxuXHJcbnZhciBsbyA9IExleGVyLnByb3RvdHlwZVxyXG5cclxuXHJcbmxvLmxleCA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgc3RyID0gKHN0ciB8fCB0aGlzLmlucHV0KS50cmltKCk7XHJcbiAgdmFyIHRva2VucyA9IFtdLCBzcGxpdCwgdGVzdCxtbGVuLCB0b2tlbiwgc3RhdGU7XHJcbiAgdGhpcy5pbnB1dCA9IHN0ciwgXHJcbiAgdGhpcy5tYXJrcyA9IDA7XHJcbiAgLy8gaW5pdCB0aGUgcG9zIGluZGV4XHJcbiAgdGhpcy5pbmRleD0wO1xyXG4gIHZhciBpID0gMDtcclxuICB3aGlsZShzdHIpe1xyXG4gICAgaSsrXHJcbiAgICBzdGF0ZSA9IHRoaXMuc3RhdGUoKTtcclxuICAgIHNwbGl0ID0gdGhpcy5tYXBbc3RhdGVdIFxyXG4gICAgdGVzdCA9IHNwbGl0LlRSVU5LLmV4ZWMoc3RyKTtcclxuICAgIGlmKCF0ZXN0KXtcclxuICAgICAgdGhpcy5lcnJvcignVW5yZWNvZ2luaXplZCBUb2tlbicpO1xyXG4gICAgfVxyXG4gICAgbWxlbiA9IHRlc3RbMF0ubGVuZ3RoO1xyXG4gICAgc3RyID0gc3RyLnNsaWNlKG1sZW4pXHJcbiAgICB0b2tlbiA9IHRoaXMuX3Byb2Nlc3MuY2FsbCh0aGlzLCB0ZXN0LCBzcGxpdCwgc3RyKVxyXG4gICAgaWYodG9rZW4pIHRva2Vucy5wdXNoKHRva2VuKVxyXG4gICAgdGhpcy5pbmRleCArPSBtbGVuO1xyXG4gICAgLy8gaWYoc3RhdGUgPT0gJ1RBRycgfHwgc3RhdGUgPT0gJ0pTVCcpIHN0ciA9IHRoaXMuc2tpcHNwYWNlKHN0cik7XHJcbiAgfVxyXG5cclxuICB0b2tlbnMucHVzaCh7dHlwZTogJ0VPRid9KTtcclxuXHJcbiAgcmV0dXJuIHRva2VucztcclxufVxyXG5cclxubG8uZXJyb3IgPSBmdW5jdGlvbihtc2cpe1xyXG4gIHRocm93ICBFcnJvcihcIlBhcnNlIEVycm9yOiBcIiArIG1zZyArICAnOlxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdGhpcy5pbmRleCkpO1xyXG59XHJcblxyXG5sby5fcHJvY2VzcyA9IGZ1bmN0aW9uKGFyZ3MsIHNwbGl0LHN0cil7XHJcbiAgLy8gY29uc29sZS5sb2coYXJncy5qb2luKFwiLFwiKSwgdGhpcy5zdGF0ZSgpKVxyXG4gIHZhciBsaW5rcyA9IHNwbGl0LmxpbmtzLCBtYXJjaGVkID0gZmFsc2UsIHRva2VuO1xyXG5cclxuICBmb3IodmFyIGxlbiA9IGxpbmtzLmxlbmd0aCwgaT0wO2k8bGVuIDtpKyspe1xyXG4gICAgdmFyIGxpbmsgPSBsaW5rc1tpXSxcclxuICAgICAgaGFuZGxlciA9IGxpbmtbMl0sXHJcbiAgICAgIGluZGV4ID0gbGlua1swXTtcclxuICAgIC8vIGlmKGFyZ3NbNl0gPT09ICc+JyAmJiBpbmRleCA9PT0gNikgY29uc29sZS5sb2coJ2hhaGEnKVxyXG4gICAgaWYodGVzdFN1YkNhcHVyZShhcmdzW2luZGV4XSkpIHtcclxuICAgICAgbWFyY2hlZCA9IHRydWU7XHJcbiAgICAgIGlmKGhhbmRsZXIpe1xyXG4gICAgICAgIHRva2VuID0gaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzLnNsaWNlKGluZGV4LCBpbmRleCArIGxpbmtbMV0pKVxyXG4gICAgICAgIGlmKHRva2VuKSAgdG9rZW4ucG9zID0gdGhpcy5pbmRleDtcclxuICAgICAgfVxyXG4gICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgaWYoIW1hcmNoZWQpeyAvLyBpbiBpZSBsdDggLiBzdWIgY2FwdHVyZSBpcyBcIlwiIGJ1dCBvbnQgXHJcbiAgICBzd2l0Y2goc3RyLmNoYXJBdCgwKSl7XHJcbiAgICAgIGNhc2UgXCI8XCI6XHJcbiAgICAgICAgdGhpcy5lbnRlcihcIlRBR1wiKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aGlzLmVudGVyKFwiSlNUXCIpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdG9rZW47XHJcbn1cclxubG8uZW50ZXIgPSBmdW5jdGlvbihzdGF0ZSl7XHJcbiAgdGhpcy5zdGF0ZXMucHVzaChzdGF0ZSlcclxuICByZXR1cm4gdGhpcztcclxufVxyXG5cclxubG8uc3RhdGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcclxuICByZXR1cm4gc3RhdGVzW3N0YXRlcy5sZW5ndGgtMV07XHJcbn1cclxuXHJcbmxvLmxlYXZlID0gZnVuY3Rpb24oc3RhdGUpe1xyXG4gIHZhciBzdGF0ZXMgPSB0aGlzLnN0YXRlcztcclxuICBpZighc3RhdGUgfHwgc3RhdGVzW3N0YXRlcy5sZW5ndGgtMV0gPT09IHN0YXRlKSBzdGF0ZXMucG9wKClcclxufVxyXG5cclxuXHJcbkxleGVyLnNldHVwID0gZnVuY3Rpb24oKXtcclxuICBtYWNyby5FTkQgPSBjb25maWcuRU5EO1xyXG4gIG1hY3JvLkJFR0lOID0gY29uZmlnLkJFR0lOO1xyXG4gIC8vXHJcbiAgbWFwMSA9IGdlbk1hcChbXHJcbiAgICAvLyBJTklUXHJcbiAgICBydWxlcy5FTlRFUl9KU1QsXHJcbiAgICBydWxlcy5FTlRFUl9UQUcsXHJcbiAgICBydWxlcy5URVhULFxyXG5cclxuICAgIC8vVEFHXHJcbiAgICBydWxlcy5UQUdfTkFNRSxcclxuICAgIHJ1bGVzLlRBR19PUEVOLFxyXG4gICAgcnVsZXMuVEFHX0NMT1NFLFxyXG4gICAgcnVsZXMuVEFHX1BVTkNIT1IsXHJcbiAgICBydWxlcy5UQUdfRU5URVJfSlNULFxyXG4gICAgcnVsZXMuVEFHX1VOUV9WQUxVRSxcclxuICAgIHJ1bGVzLlRBR19TVFJJTkcsXHJcbiAgICBydWxlcy5UQUdfU1BBQ0UsXHJcbiAgICBydWxlcy5UQUdfQ09NTUVOVCxcclxuXHJcbiAgICAvLyBKU1RcclxuICAgIHJ1bGVzLkpTVF9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0NMT1NFLFxyXG4gICAgcnVsZXMuSlNUX0NPTU1FTlQsXHJcbiAgICBydWxlcy5KU1RfRVhQUl9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0lERU5ULFxyXG4gICAgcnVsZXMuSlNUX1NQQUNFLFxyXG4gICAgcnVsZXMuSlNUX0xFQVZFLFxyXG4gICAgcnVsZXMuSlNUX05VTUJFUixcclxuICAgIHJ1bGVzLkpTVF9QVU5DSE9SLFxyXG4gICAgcnVsZXMuSlNUX1NUUklORyxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5UXHJcbiAgICBdKVxyXG5cclxuICAvLyBpZ25vcmVkIHRoZSB0YWctcmVsYXRpdmUgdG9rZW5cclxuICBtYXAyID0gZ2VuTWFwKFtcclxuICAgIC8vIElOSVQgbm8gPCByZXN0cmljdFxyXG4gICAgcnVsZXMuRU5URVJfSlNUMixcclxuICAgIHJ1bGVzLlRFWFQsXHJcbiAgICAvLyBKU1RcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5ULFxyXG4gICAgcnVsZXMuSlNUX09QRU4sXHJcbiAgICBydWxlcy5KU1RfQ0xPU0UsXHJcbiAgICBydWxlcy5KU1RfRVhQUl9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0lERU5ULFxyXG4gICAgcnVsZXMuSlNUX1NQQUNFLFxyXG4gICAgcnVsZXMuSlNUX0xFQVZFLFxyXG4gICAgcnVsZXMuSlNUX05VTUJFUixcclxuICAgIHJ1bGVzLkpTVF9QVU5DSE9SLFxyXG4gICAgcnVsZXMuSlNUX1NUUklORyxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5UXHJcbiAgICBdKVxyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2VuTWFwKHJ1bGVzKXtcclxuICB2YXIgcnVsZSwgbWFwID0ge30sIHNpZ247XHJcbiAgZm9yKHZhciBpID0gMCwgbGVuID0gcnVsZXMubGVuZ3RoOyBpIDwgbGVuIDsgaSsrKXtcclxuICAgIHJ1bGUgPSBydWxlc1tpXTtcclxuICAgIHNpZ24gPSBydWxlWzJdIHx8ICdJTklUJztcclxuICAgICggbWFwW3NpZ25dIHx8IChtYXBbc2lnbl0gPSB7cnVsZXM6W10sIGxpbmtzOltdfSkgKS5ydWxlcy5wdXNoKHJ1bGUpO1xyXG4gIH1cclxuICByZXR1cm4gc2V0dXAobWFwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2V0dXAobWFwKXtcclxuICB2YXIgc3BsaXQsIHJ1bGVzLCB0cnVua3MsIGhhbmRsZXIsIHJlZywgcmV0YWluLCBydWxlO1xyXG4gIGZ1bmN0aW9uIHJlcGxhY2VGbihhbGwsIG9uZSl7XHJcbiAgICByZXR1cm4gdHlwZW9mIG1hY3JvW29uZV0gPT09ICdzdHJpbmcnPyBcclxuICAgICAgXy5lc2NhcGVSZWdFeHAobWFjcm9bb25lXSkgXHJcbiAgICAgIDogU3RyaW5nKG1hY3JvW29uZV0pLnNsaWNlKDEsLTEpO1xyXG4gIH1cclxuXHJcbiAgZm9yKHZhciBpIGluIG1hcCl7XHJcblxyXG4gICAgc3BsaXQgPSBtYXBbaV07XHJcbiAgICBzcGxpdC5jdXJJbmRleCA9IDE7XHJcbiAgICBydWxlcyA9IHNwbGl0LnJ1bGVzO1xyXG4gICAgdHJ1bmtzID0gW107XHJcblxyXG4gICAgZm9yKHZhciBqID0gMCxsZW4gPSBydWxlcy5sZW5ndGg7IGo8bGVuOyBqKyspe1xyXG4gICAgICBydWxlID0gcnVsZXNbal07IFxyXG4gICAgICByZWcgPSBydWxlWzBdO1xyXG4gICAgICBoYW5kbGVyID0gcnVsZVsxXTtcclxuXHJcbiAgICAgIGlmKHR5cGVvZiBoYW5kbGVyID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgaGFuZGxlciA9IHdyYXBIYW5kZXIoaGFuZGxlcik7XHJcbiAgICAgIH1cclxuICAgICAgaWYoXy50eXBlT2YocmVnKSA9PT0gJ3JlZ2V4cCcpIHJlZyA9IHJlZy50b1N0cmluZygpLnNsaWNlKDEsIC0xKTtcclxuXHJcbiAgICAgIHJlZyA9IHJlZy5yZXBsYWNlKC9cXHsoXFx3KylcXH0vZywgcmVwbGFjZUZuKVxyXG4gICAgICByZXRhaW4gPSBfLmZpbmRTdWJDYXB0dXJlKHJlZykgKyAxOyBcclxuICAgICAgc3BsaXQubGlua3MucHVzaChbc3BsaXQuY3VySW5kZXgsIHJldGFpbiwgaGFuZGxlcl0pOyBcclxuICAgICAgc3BsaXQuY3VySW5kZXggKz0gcmV0YWluO1xyXG4gICAgICB0cnVua3MucHVzaChyZWcpO1xyXG4gICAgfVxyXG4gICAgc3BsaXQuVFJVTksgPSBuZXcgUmVnRXhwKFwiXig/OihcIiArIHRydW5rcy5qb2luKFwiKXwoXCIpICsgXCIpKVwiKVxyXG4gIH1cclxuICByZXR1cm4gbWFwO1xyXG59XHJcblxyXG52YXIgcnVsZXMgPSB7XHJcblxyXG4gIC8vIDEuIElOSVRcclxuICAvLyAtLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgLy8gbW9kZTEncyBKU1QgRU5URVIgUlVMRVxyXG4gIEVOVEVSX0pTVDogWy9bXlxceDAwPF0qPyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgLy8gbW9kZTIncyBKU1QgRU5URVIgUlVMRVxyXG4gIEVOVEVSX0pTVDI6IFsvW15cXHgwMF0qPyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gICAgaWYoYWxsKSByZXR1cm4ge3R5cGU6ICdURVhUJywgdmFsdWU6IGFsbH1cclxuICB9XSxcclxuXHJcbiAgRU5URVJfVEFHOiBbL1teXFx4MDBdKj8oPz08W1xcd1xcL1xcIV0pLywgZnVuY3Rpb24oYWxsKXsgXHJcbiAgICB0aGlzLmVudGVyKCdUQUcnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIFRFWFQ6IFsvW15cXHgwMF0rLywgJ1RFWFQnIF0sXHJcblxyXG4gIC8vIDIuIFRBR1xyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgVEFHX05BTUU6IFsve05BTUV9LywgJ05BTUUnLCAnVEFHJ10sXHJcbiAgVEFHX1VOUV9WQUxVRTogWy9bXlxce30mXCInPT48YFxcclxcblxcZlxcdCBdKy8sICdVTlEnLCAnVEFHJ10sXHJcblxyXG4gIFRBR19PUEVOOiBbLzwoe05BTUV9KVxccyovLCBmdW5jdGlvbihhbGwsIG9uZSl7IC8vXCJcclxuICAgIHJldHVybiB7dHlwZTogJ1RBR19PUEVOJywgdmFsdWU6IG9uZX1cclxuICB9LCAnVEFHJ10sXHJcbiAgVEFHX0NMT1NFOiBbLzxcXC8oe05BTUV9KVtcXHJcXG5cXGZcXHQgXSo+LywgZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgdGhpcy5sZWF2ZSgpO1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnVEFHX0NMT1NFJywgdmFsdWU6IG9uZSB9XHJcbiAgfSwgJ1RBRyddLFxyXG5cclxuICAgIC8vIG1vZGUyJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBUQUdfRU5URVJfSlNUOiBbLyg/PXtCRUdJTn0pLywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuZW50ZXIoJ0pTVCcpO1xyXG4gIH0sICdUQUcnXSxcclxuXHJcblxyXG4gIFRBR19QVU5DSE9SOiBbL1tcXD5cXC89Jl0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgaWYoYWxsID09PSAnPicpIHRoaXMubGVhdmUoKTtcclxuICAgIHJldHVybiB7dHlwZTogYWxsLCB2YWx1ZTogYWxsIH1cclxuICB9LCAnVEFHJ10sXHJcbiAgVEFHX1NUUklORzogIFsgLycoW14nXSopJ3xcIihbXlwiXSopXFxcIi8sIC8qJyovICBmdW5jdGlvbihhbGwsIG9uZSwgdHdvKXsgXHJcbiAgICB2YXIgdmFsdWUgPSBvbmUgfHwgdHdvIHx8IFwiXCI7XHJcblxyXG4gICAgcmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IHZhbHVlfVxyXG4gIH0sICdUQUcnXSxcclxuXHJcbiAgVEFHX1NQQUNFOiBbL3tTUEFDRX0rLywgbnVsbCwgJ1RBRyddLFxyXG4gIFRBR19DT01NRU5UOiBbLzxcXCEtLShbXlxceDAwXSo/KS0tXFw+LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHRoaXMubGVhdmUoKVxyXG4gICAgLy8gdGhpcy5sZWF2ZSgnVEFHJylcclxuICB9ICwnVEFHJ10sXHJcblxyXG4gIC8vIDMuIEpTVFxyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgSlNUX09QRU46IFsne0JFR0lOfSN7U1BBQ0V9Kih7SURFTlR9KScsIGZ1bmN0aW9uKGFsbCwgbmFtZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnT1BFTicsXHJcbiAgICAgIHZhbHVlOiBuYW1lXHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9MRUFWRTogWy97RU5EfS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICBpZih0aGlzLm1hcmtFbmQgPT09IGFsbCAmJiB0aGlzLmV4cHJlc3Npb24pIHJldHVybiB7dHlwZTogdGhpcy5tYXJrRW5kLCB2YWx1ZTogdGhpcy5tYXJrRW5kfTtcclxuICAgIGlmKCF0aGlzLm1hcmtFbmQgfHwgIXRoaXMubWFya3MgKXtcclxuICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSBmYWxzZTtcclxuICAgICAgdGhpcy5sZWF2ZSgnSlNUJyk7XHJcbiAgICAgIHJldHVybiB7dHlwZTogJ0VORCd9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdGhpcy5tYXJrcy0tO1xyXG4gICAgICByZXR1cm4ge3R5cGU6IHRoaXMubWFya0VuZCwgdmFsdWU6IHRoaXMubWFya0VuZH1cclxuICAgIH1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0NMT1NFOiBbL3tCRUdJTn1cXHMqXFwvKHtJREVOVH0pXFxzKntFTkR9LywgZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgdGhpcy5sZWF2ZSgnSlNUJyk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnQ0xPU0UnLFxyXG4gICAgICB2YWx1ZTogb25lXHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9DT01NRU5UOiBbL3tCRUdJTn1cXCEoW15cXHgwMF0qPylcXCF7RU5EfS8sIGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmxlYXZlKCk7XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9FWFBSX09QRU46IFsne0JFR0lOfScsZnVuY3Rpb24oYWxsLCBvbmUpe1xyXG4gICAgaWYoYWxsID09PSB0aGlzLm1hcmtTdGFydCl7XHJcbiAgICAgIGlmKHRoaXMuZXhwcmVzc2lvbikgcmV0dXJuIHsgdHlwZTogdGhpcy5tYXJrU3RhcnQsIHZhbHVlOiB0aGlzLm1hcmtTdGFydCB9O1xyXG4gICAgICBpZih0aGlzLmZpcnN0RW50ZXJTdGFydCB8fCB0aGlzLm1hcmtzKXtcclxuICAgICAgICB0aGlzLm1hcmtzKytcclxuICAgICAgICB0aGlzLmZpcnN0RW50ZXJTdGFydCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiB7IHR5cGU6IHRoaXMubWFya1N0YXJ0LCB2YWx1ZTogdGhpcy5tYXJrU3RhcnQgfTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnRVhQUl9PUEVOJyxcclxuICAgICAgZXNjYXBlOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX0lERU5UOiBbJ3tJREVOVH0nLCAnSURFTlQnLCAnSlNUJ10sXHJcbiAgSlNUX1NQQUNFOiBbL1sgXFxyXFxuXFxmXSsvLCBudWxsLCAnSlNUJ10sXHJcbiAgSlNUX1BVTkNIT1I6IFsvWz0hXT89PXxbLT0+PCsqXFwvJVxcIV0/XFw9fFxcfFxcfHwmJnxcXEBcXCh8XFwuXFwufFs8XFw+XFxbXFxdXFwoXFwpXFwtXFx8XFx7fVxcK1xcKlxcLyU/OlxcLiEsXS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4geyB0eXBlOiBhbGwsIHZhbHVlOiBhbGwgfVxyXG4gIH0sJ0pTVCddLFxyXG5cclxuICBKU1RfU1RSSU5HOiAgWyAvJyhbXiddKiknfFwiKFteXCJdKilcIi8sIGZ1bmN0aW9uKGFsbCwgb25lLCB0d28peyAvL1wiJ1xyXG4gICAgcmV0dXJuIHt0eXBlOiAnU1RSSU5HJywgdmFsdWU6IG9uZSB8fCB0d28gfHwgXCJcIn1cclxuICB9LCAnSlNUJ10sXHJcbiAgSlNUX05VTUJFUjogWy8oPzpbMC05XSpcXC5bMC05XSt8WzAtOV0rKShlXFxkKyk/LywgZnVuY3Rpb24oYWxsKXtcclxuICAgIHJldHVybiB7dHlwZTogJ05VTUJFUicsIHZhbHVlOiBwYXJzZUZsb2F0KGFsbCwgMTApfTtcclxuICB9LCAnSlNUJ11cclxufVxyXG5cclxuXHJcbi8vIHNldHVwIHdoZW4gZmlyc3QgY29uZmlnXHJcbkxleGVyLnNldHVwKCk7XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV4ZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9MZXhlci5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZG9jdW1lbnRGcmFnbWVudCA9IHJlcXVpcmUoJy4vRG9jdW1lbnRGcmFnbWVudC5qcycpO1xyXG52YXIgRWxlbWVudCA9IHJlcXVpcmUoJy4vRWxlbWVudC5qcycpO1xyXG5cclxudmFyIHByb3RvID0ge1xyXG4gICAgY3JlYXRlRG9jdW1lbnRGcmFnbWVudDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IGRvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgIH0sXHJcbiAgICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbih0YWdOYW1lKXtcclxuICAgICAgICByZXR1cm4gbmV3IEVsZW1lbnQodGFnTmFtZSk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlVGV4dE5vZGU6IGZ1bmN0aW9uKHRleHQpe1xyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG59O1xyXG5cclxudmFyIGRvYyA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkb2M7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdmRvbS9Eb2N1bWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJmdW5jdGlvbiBFbGVtZW50KHRhZ05hbWUpe1xyXG4gICAgdGhpcy5fdGFnTmFtZSA9IHRhZ05hbWU7XHJcbiAgICB0aGlzLl9hdHRycyA9IFtdO1xyXG4gICAgdGhpcy5fZXZlbnRzID0gW107XHJcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG59XHJcblxyXG5FbGVtZW50LnByb3RvdHlwZS5zZXRBdHRyaWJ1dGUgPSBmdW5jdGlvbihhdHRyTmFtZSwgYXR0clZhbHVlKXtcclxuICAgIHZhciBldmVudFBhdHRlcm4gPSAvb24tLztcclxuXHJcbiAgICBpZihldmVudFBhdHRlcm4udGVzdChhdHRyTmFtZSkpIHJldHVybjtcclxuXHJcbiAgICB0aGlzLl9hdHRycy5wdXNoKHtuYW1lOiBhdHRyTmFtZSwgdmFsdWU6IGF0dHJWYWx1ZX0pO1xyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgaGFuZGxlciwgaXNQb3AsIGFyZ0NvbnRleHQpe1xyXG4gICAgdGhpcy5fZXZlbnRzLnB1c2goe25hbWU6IGV2ZW50TmFtZS5yZXBsYWNlKC8tLywgJycpLCB2YWx1ZTogaGFuZGxlciwgY29udGV4dDogYXJnQ29udGV4dH0pO1xyXG59O1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obm9kZSl7XHJcbiAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKG5vZGUpO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBFbGVtZW50O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRWxlbWVudC5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo1MTo1MyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMzoyMDo1MFxyXG4gKi9cclxuZnVuY3Rpb24gTWVzc2FnZUJ1cygpIHtcclxuICAgIHRoaXMuX29uU2VuZFdvcmtlciA9IFtdO1xyXG4gICAgdGhpcy5faW5pdFdvcmtlcigpO1xyXG4gICAgdGhpcy5fY3JlYXRlRXZlbnRzU3RvcmUoKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NyZWF0ZUV2ZW50c1N0b3JlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fZXZlbnRzU3RvcmUgPSB7fTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB2YXIgSW5mbyA9IHRoaXMuX2Rlc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgdGhpcy5fcmVjZWl2ZUJ1c1Jlc29sdmVyKEluZm8pO1xyXG4gICAgdGhpcy5fZW1pdChJbmZvLnR5cGUsIEluZm8uZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fcmVjZWl2ZUJ1c1Jlc29sdmVyID0gZnVuY3Rpb24gKCkge1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICB0aGlzLl9idWZmZXIgPSBtZXNzYWdlO1xyXG4gICAgdGhpcy5fc2VyaWFsaXplKG1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uIChldmVudFR5cGUsIGZuKSB7XHJcbiAgICB0aGlzLl9yZWdpc3RlcihldmVudFR5cGUsIGZuLmJpbmQodGhpcykpO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcclxuICAgIHZhciB0eXBlID0gbWVzc2FnZS5kYXRhLnR5cGUsXHJcbiAgICAgICAgZGF0YSA9IG1lc3NhZ2UuZGF0YS5kYXRhO1xyXG5cclxuICAgIHJldHVybiB7IHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9zZXJpYWxpemUgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgdmFyIEluZm8gPSB7fTtcclxuXHJcbiAgICBJbmZvLnR5cGUgPSBtZXNzYWdlLnR5cGU7XHJcbiAgICBJbmZvLmRhdGEgPSBtZXNzYWdlLmRhdGE7XHJcblxyXG4gICAgdGhpcy5fc2VuZEluZm9Ub1dvcmtlcihJbmZvKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3NlbmRJbmZvVG9Xb3JrZXIgPSBmdW5jdGlvbiAoSW5mbykge1xyXG4gICAgdmFyIF9vblNlbmRXb3JrZXIgPSB0aGlzLl9vblNlbmRXb3JrZXI7XHJcblxyXG4gICAgdGhpcy5fcG9zdE1lc3NhZ2UoSW5mbyk7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKF9vblNlbmRXb3JrZXIubGVuZ3RoKSB0aGlzLl9jaGVja1dhdGNoZXJzKF9vblNlbmRXb3JrZXIsIEluZm8pO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uICgpIHtcclxufTtcclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9jaGVja1dhdGNoZXJzID0gZnVuY3Rpb24gKHdhdGNoZXJzLCBJbmZvKSB7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDAsIHdhdGNoZXI7IGkgPCB3YXRjaGVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKEluZm8pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUub25TZW5kID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIucHVzaChmbik7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24gKGZuKSB7XHJcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2J1ZmZlcjtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKG1lc3NhZ2UudHlwZSwgZm4pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG59O1xyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3JlZ2lzdGVyID0gZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZiAoX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0ud2F0Y2hlcnMucHVzaChmbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0gPSB7IHdhdGNoZXJzOiBbZm5dIH07XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcclxuICAgIHZhciBfZXZlbnRzU3RvcmUgPSB0aGlzLl9ldmVudHNTdG9yZTtcclxuXHJcbiAgICBpZiAoX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0gJiYgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0ud2F0Y2hlcnMubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGVXYXRjaGVycyhfZXZlbnRzU3RvcmVbZXZlbnROYW1lXS53YXRjaGVycywgZGF0YSk7XHJcbn07XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZXhlY3V0ZVdhdGNoZXJzID0gZnVuY3Rpb24gKHdhdGNoZXJzLCBkYXRhKSB7XHJcbiAgICBmb3IgKHZhciBpID0gd2F0Y2hlcnMubGVuZ3RoIC0gMSwgd2F0Y2hlcjsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICB3YXRjaGVyID0gd2F0Y2hlcnNbaV07XHJcbiAgICAgICAgd2F0Y2hlcihkYXRhKTtcclxuICAgICAgICB3YXRjaGVycy5zcGxpY2UoaSwgMSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VCdXM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjQ5OjAzIFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTIwIDEyOjU0OjQ5XHJcbiAqL1xyXG5cclxudmFyIE1lc3NhZ2VCdXMgPSByZXF1aXJlKCcuL21lc3NhZ2VCdXMvV29ya2VyTXNnQnVzLmpzJyk7XHJcbnZhciBXS1JlbmRlclN0b3JlID0gcmVxdWlyZSgnLi9zdG9yZS9XS1JlbmRlclN0b3JlLmpzJyk7XHJcblxyXG52YXIgbXlNZXNzYWdlQnVzID0gbmV3IE1lc3NhZ2VCdXMoKTtcclxuXHJcbm15TWVzc2FnZUJ1cy5idWlsZFJlY2VpdmVEaXNwYXRjaGVyKCdyZW5kZXInLCBmdW5jdGlvbihkYXRhKXtcclxuICAgIHZhciBzdG9yZSA9IG5ldyBXS1JlbmRlclN0b3JlKGRhdGEpO1xyXG4gICAgc3RvcmUucmVuZGVyKCk7XHJcbiAgICB0aGlzLnJlY2VpdmUoe3R5cGU6ICdyZW5kZXInLCBkYXRhOiB7aHRtbDogc3RvcmUucmVuZGVyZWRTdHIsIGV2ZW50czogc3RvcmUuZXZlbnRzfX0pO1xyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy93a19pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NTA6MjcgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MTE6MDVcclxuICovXHJcbnZhciBNZXNzYWdlQnVzID0gcmVxdWlyZSgnLi9NZXNzYWdlQnVzLmpzJyk7XHJcbnZhciBFeHRlbmQgPSByZXF1aXJlKCcuLi91dGlscy9leHRlbmQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIFdvcmtlck1zZ0J1cygpe1xyXG4gICAgdGhpcy5zdXBlcigpO1xyXG4gICAgdGhpcy5fcmVjZWl2ZUJ1c0Rpc3BhdGNoZXIgPSB7fTtcclxufVxyXG5cclxuRXh0ZW5kKFdvcmtlck1zZ0J1cywgTWVzc2FnZUJ1cyk7XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24oKXtcclxuICAgIC8qZXNsaW50LWRpc2FibGUqL1xyXG4gICAgb25tZXNzYWdlID0gdGhpcy5fb25NZXNzYWdlLmJpbmQodGhpcyk7XHJcbn1cclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUuX3Bvc3RNZXNzYWdlID0gZnVuY3Rpb24oSW5mbyl7XHJcbiAgICAvKmVzbGludC1kaXNhYmxlKi9cclxuICAgIHBvc3RNZXNzYWdlKEluZm8pO1xyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLmJ1aWxkUmVjZWl2ZURpc3BhdGNoZXIgPSBmdW5jdGlvbih0eXBlLCBmbil7XHJcbiAgICB2YXIgZGlzcGF0Y2hlciA9IHRoaXMuX3JlY2VpdmVCdXNEaXNwYXRjaGVyO1xyXG4gICAgXHJcbiAgICBkaXNwYXRjaGVyW3R5cGVdID0gZm47XHJcbn1cclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUuX3JlY2VpdmVCdXNSZXNvbHZlciA9IGZ1bmN0aW9uKEluZm8pe1xyXG4gICAgdmFyIHR5cGUgPSBJbmZvLnR5cGUsXHJcbiAgICAgICAgZGF0YSA9IEluZm8uZGF0YSxcclxuICAgICAgICBkaXNwYXRjaGVyID0gdGhpcy5fcmVjZWl2ZUJ1c0Rpc3BhdGNoZXI7XHJcblxyXG4gICAgZGlzcGF0Y2hlclt0eXBlXS5jYWxsKHRoaXMsIGRhdGEpO1xyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLm9uUmVjZWl2ZU1lc3NhZ2UgPSBmdW5jdGlvbihmbil7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFdvcmtlck1zZ0J1cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tZXNzYWdlQnVzL1dvcmtlck1zZ0J1cy5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NDg6NDQgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MjE6MjRcclxuICovXHJcblxyXG52YXIgQmFzZVJlbmRlclN0b3JlID0gcmVxdWlyZSgnLi9CYXNlUmVuZGVyU3RvcmUuanMnKTtcclxudmFyIEV4dGVuZCA9IHJlcXVpcmUoJy4uL3V0aWxzL2V4dGVuZC5qcycpO1xyXG52YXIgQ29tcGlsZXIgPSByZXF1aXJlKCcuLi9jb21waWxlci93b3JrZXJUaHJlYWQvY29tcGlsZXIuanMnKTtcclxuXHJcbnZhciBkb2N1bWVudEZyYWdtZW50ID0gcmVxdWlyZSgnLi4vdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzJyk7XHJcblxyXG5mdW5jdGlvbiBSZW5kZXJTdG9yZShvYmopIHtcclxuICAgIHRoaXMuc3VwZXIob2JqKTtcclxuICAgIHRoaXMuZXZlbnRzID0ge307XHJcbiAgICB0aGlzLm5vZGVJZCA9IDA7XHJcbn1cclxuXHJcbkV4dGVuZChSZW5kZXJTdG9yZSwgQmFzZVJlbmRlclN0b3JlKTtcclxuXHJcblJlbmRlclN0b3JlLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9jb21waWxlciA9IENvbXBpbGVyO1xyXG4gICAgdGhpcy5fdHlwZWRGbGF0ZXIgPSBSZW5kZXJTdG9yZS50eXBlZEZsYXRlcjtcclxuICAgIHRoaXMudkRvbSA9IHRoaXMuX2NvbXBpbGUodGhpcy5BU1QsIHRoaXMuZGF0YSk7XHJcbiAgICB0aGlzLnJlbmRlcmVkU3RyID0gdGhpcy5mbGF0VG9TdHJpbmcodGhpcy52RG9tLl9jaGlsZHJlbik7XHJcbn07XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuZmxhdFRvU3RyaW5nID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSB0aGlzLmZsYXRUb1N0cmluZyhub2RlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZmxhdE5vZGUobm9kZSk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuUmVuZGVyU3RvcmUucHJvdG90eXBlLmZsYXROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcclxuICAgIHZhciB0YWdOYW1lID0gbm9kZS5fdGFnTmFtZSxcclxuICAgICAgICBhdHRycyA9IG5vZGUuX2F0dHJzLFxyXG4gICAgICAgIGV2ZW50cyA9IG5vZGUuX2V2ZW50cyxcclxuICAgICAgICBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuLFxyXG4gICAgICAgIGJvZHkgPSAnJywgYXR0clN0ciA9ICcnLCBldmVudFN0ciA9ICcnLFxyXG4gICAgICAgIG5vZGVJZCA9IHRoaXMubm9kZUlkO1xyXG5cclxuICAgIC8qKuaWh+acrOiKgueCueWkhOeQhiAqL1xyXG4gICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuaPkuWFpeWtkOiKgueCuSAqL1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGJvZHkgKz0gdGhpcy5mbGF0Tm9kZShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqZnJhZ01lbnQgKi9cclxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgZG9jdW1lbnRGcmFnbWVudCkge1xyXG4gICAgICAgIHJldHVybiBib2R5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKueUn+aIkOWxnuaAp+Wtl+espuS4siAqL1xyXG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBhdHRycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIGF0dHJTdHIgKz0gKGF0dHJzW2pdLm5hbWUgKyAnPVwiJyArIGF0dHJzW2pdLnZhbHVlICsgJ1wiICcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKuS6i+S7tuWkhOeQhiAqL1xyXG4gICAgaWYgKGV2ZW50cy5sZW5ndGgpIHtcclxuICAgICAgICBhdHRyU3RyICs9ICdkYXRhLW5vZGVpZD1cIicgKyBub2RlSWQgKyAnXCInO1xyXG4gICAgICAgIGZvciAodmFyIGggPSAwOyBoIDwgZXZlbnRzLmxlbmd0aDsgaCsrKSB7XHJcbiAgICAgICAgICAgIGV2ZW50c1toXS52YWx1ZSArPSAnJztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5ldmVudHNbbm9kZUlkXSA9IGV2ZW50cztcclxuICAgIH1cclxuICAgIHRoaXMubm9kZUlkKys7XHJcbiAgICByZXR1cm4gJzwnICsgdGFnTmFtZSArICcgJyArIGF0dHJTdHIgKyBldmVudFN0ciArICc+JyArIGJvZHkgKyAnPC8nICsgdGFnTmFtZSArICc+JztcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyU3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RvcmUvV0tSZW5kZXJTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTc6MTI6MzYgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MzQ6MDdcclxuICovXHJcbnZhciBhdHRyUmVzb2x2ZXIgPSByZXF1aXJlKCcuL2F0dHJSZXNvbHZlci5qcycpO1xyXG5cclxuZnVuY3Rpb24gZWxlbWVudChhc3QsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhc3QudGFnKTtcclxuXHJcbiAgICB2YXIgYXR0cnMgPSBhc3QuYXR0cnM7XHJcbiAgICAvKirlpITnkIblsZ7mgKcgKi9cclxuICAgIGZvcih2YXIgaT0wO2k8YXR0cnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2goYXR0ci50eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAnYXR0cmlidXRlJzogXHJcbiAgICAgICAgICAgICAgICBhdHRyUmVzb2x2ZXIoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pOyBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5aSE55CG5a2Q6IqC54K5ICovXHJcbiAgICBpZihhc3QuY2hpbGRyZW4pe1xyXG4gICAgICAgIGZvcih2YXIgaj0wO2o8YXN0LmNoaWxkcmVuLmxlbmd0aDtqKyspe1xyXG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBhc3QuY2hpbGRyZW5bal07XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKGNvbnRleHQuX2NvbXBpbGUoY2hpbGQsIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0ZXh0KGFzdCl7XHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGFzdC50ZXh0KTtcclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBleHByZXNzaW9uKGFzdCwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIHRleHQgPSAnJywgZ2V0VmFsdWU7XHJcbiAgICBpZihsaXN0SW5mbyl7XHJcbiAgICAgICAgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3QuYm9keSsnKScpO1xyXG4gICAgICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBsaXN0SW5mbywgJycpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3QuYm9keSsnKScpO1xyXG4gICAgICAgIHRleHQgPSBnZXRWYWx1ZShjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG5cclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBsaXN0KGFzdCwgY29udGV4dCl7XHJcbiAgICB2YXIgbGlzdEJvZHkgPSBhc3QuYm9keTtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXN0LnNlcXVlbmNlLmJvZHkrJyknKTtcclxuICAgIHZhciBhcnJheURhdGEgPSBnZXRWYWx1ZShjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgIHZhciB2YXJpYWJsZSA9IGFzdC52YXJpYWJsZTtcclxuXHJcbiAgICBmb3IodmFyIGo9MDtqPGFycmF5RGF0YS5sZW5ndGg7aisrKXtcclxuICAgICAgICBub2RlLmFwcGVuZChpdGVtTm9kZShsaXN0Qm9keSwgYXJyYXlEYXRhW2pdLCBqKSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXRlbU5vZGUoYm9keSwgaXRlbSwgaW5kZXgpe1xyXG4gICAgICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAgIHZhciBsaXN0SW5mbyA9IHt9O1xyXG5cclxuICAgICAgICBsaXN0SW5mb1t2YXJpYWJsZV0gPSBpdGVtO1xyXG4gICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlKydfaW5kZXgnXSA9IGluZGV4O1xyXG4gICAgICAgIGZvcih2YXIgaT0wO2k8Ym9keS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgbm9kZS5hcHBlbmQoY29udGV4dC5fY29tcGlsZShib2R5W2ldLCBsaXN0SW5mbykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgICBjb250ZXh0Ll9saXN0LmRhdGEgPSBhcnJheURhdGE7XHJcbiAgICBjb250ZXh0Ll9saXN0LmJvZHkgPSBsaXN0Qm9keTtcclxuICAgIHJldHVybiBub2RlO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgICdlbGVtZW50JzogZWxlbWVudCxcclxuICAgICd0ZXh0JzogdGV4dCxcclxuICAgICdleHByZXNzaW9uJzogZXhwcmVzc2lvbixcclxuICAgICdsaXN0JzogbGlzdFxyXG59O1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTc6MTQ6MzcgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTM6MzQ6MTZcclxuICovXHJcblxyXG5mdW5jdGlvbiByZXNvbHZlQXR0cmlidXRlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgYXR0ci52YWx1ZTtcclxuXHJcbiAgICBzd2l0Y2godmFsdWVUeXBlKXtcclxuICAgICAgICBjYXNlICdzdHJpbmcnOiBcclxuICAgICAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnb2JqZWN0JzogXHJcbiAgICAgICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKGF0dHIubmFtZSwgcmVzb2x2ZUF0dHJWYWx1ZShhdHRyLCBub2RlLCBjb250ZXh0LCBsaXN0SW5mbykpOyBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICdsaXN0LWNvbnRhaW5lcicpe1xyXG4gICAgICAgIG5vZGUuc2V0QXR0cmlidXRlKCdsaXN0LWNvbnRhaW5lcicsIHRydWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciBpc0V2ZW50ID0gYXR0ci5uYW1lLnNsaWNlKDAsMikgPT09ICdvbic7XHJcblxyXG4gICAgaWYoaXNFdmVudCl7XHJcbiAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubmFtZS5zbGljZSgzKTtcclxuICAgICAgICBhdHRyLnZhbHVlLmJvZHkgPSBhdHRyLnZhbHVlLmJvZHkucmVwbGFjZSgvJ1xcJGV2ZW50Jy9nLCAnJGV2ZW50Jyk7XHJcbiAgICAgICAgdmFyIGdldEhhbmRsZXIgPSBuZXcgRnVuY3Rpb24oJ2MnLCAnZCcsICdlJywgJ3JldHVybiBmdW5jdGlvbigkZXZlbnQpe3JldHVybiAnK2F0dHIudmFsdWUuYm9keSsnO30nKTtcclxuICAgICAgICB2YXIgYXJnQ29udGV4dCA9IGxpc3RJbmZvIHx8IGNvbnRleHQuZGF0YTtcclxuXHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZ2V0SGFuZGxlcihjb250ZXh0LCBhcmdDb250ZXh0LCAnJyksIGZhbHNlLCBhcmdDb250ZXh0KTtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythdHRyLnZhbHVlLmJvZHkrJyknKTtcclxuICAgICAgICByZXR1cm4gZ2V0VmFsdWUoY29udGV4dCwgY29udGV4dC5kYXRhLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZUF0dHJpYnV0ZTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb21waWxlci93b3JrZXJUaHJlYWQvYXR0clJlc29sdmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDEiXSwic291cmNlUm9vdCI6IiJ9