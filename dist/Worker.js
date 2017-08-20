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
 * @Last Modified time: 2017-08-20 12:29:19
 */
function MessageBus(){
    this._onSendWorker = [];
    this._initWorker();
    this._createEventsStore();
}

MessageBus.prototype._createEventsStore = function(){
    this._eventsStore = {};
}

MessageBus.prototype._initWorker = function(){
}

MessageBus.prototype._onMessage = function(message){
    this._deserialize(message);
    this._receiveBusResolver();
}

MessageBus.prototype._receiveBusResolver = function(Info){

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

    this._postMessage(Info);

    setTimeout(function(){
        if(_onSendWorker.length) this._checkWatchers(_onSendWorker, Info);
    }.bind(this), 0);
}

MessageBus.prototype._postMessage = function(Info){
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
 * @Last Modified time: 2017-08-20 12:02:09
 */

var MessageBus = __webpack_require__(26);
var WKRenderStore = __webpack_require__(27);

var myMessageBus = new MessageBus();

myMessageBus.addEvent('render', function(data){
    var store = new WKRenderStore(data);
    store.render();
    this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
    console.log('worker messageBus');
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:50:27 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 12:24:58
 */
var MessageBus = __webpack_require__(16);
var Extend = __webpack_require__(0);

function WorkerMsgBus(){
    this.super();
    this._receiveBus = {};
}

Extend(WorkerMsgBus, MessageBus);

WorkerMsgBus.prototype._initWorker = function(){
    onmessage = this._onMessage.bind(this);
}

WorkerMsgBus.prototype._postMessage = function(Info){
    postMessage(Info);
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
 * @Last Modified time: 2017-08-20 11:50:10
 */

var BaseRenderStore = __webpack_require__(5);
var Extend = __webpack_require__(0);
var Compiler = __webpack_require__(28);

var documentFragment = __webpack_require__(4);
var Element = __webpack_require__(4);

function RenderStore(obj){
    this.super(obj);
    this.events = {};
    this.nodeId = 0;
}

Extend(RenderStore, BaseRenderStore);

RenderStore.prototype.render = function(){
    this._compiler = Compiler;
    this._typedFlater = RenderStore.typedFlater;
    this.vDom = this._compile(this.AST, this.data);
    this.renderedStr = this.flatToString(this.vDom._children);
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

module.exports = RenderStore;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 11:57:31
 */
var attrResolver = __webpack_require__(29);

function element(ast, context, listInfo){
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs;
    /**处理属性 */
    for(var i=0;i<attrs.length;i++){
        var attr = attrs[i];
        
        switch(attr.type){
            case 'attribute': attrResolver(attr, node, context, listInfo); break;
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
 * @Last Modified time: 2017-08-20 11:47:01
 */

function resolveAttribute(attr, node, context, listInfo){
    var valueType = typeof attr.value;
    switch(valueType){
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, resolveAttrValue(attr, node, context, listInfo)); break;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZWU0ZmQ4ZjRhMDcxYThlODlmNDYiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2NvbmZpZy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdmRvbS9Eb2N1bWVudEZyYWdtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9zdG9yZS9CYXNlUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvUGFyc2VyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy8uMi4wLjRAdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvLjEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzLy4wLjExLjEwQHByb2Nlc3MvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvaGVscGVyL2VudGl0aWVzLmpzIiwid2VicGFjazovLy8uL3NyYy9wYXJzZXIvc3JjL25vZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRG9jdW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zkb20vRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9NZXNzYWdlQnVzLmpzIiwid2VicGFjazovLy8uL3NyYy93a19pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbWVzc2FnZUJ1cy9Xb3JrZXJNc2dCdXMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0b3JlL1dLUmVuZGVyU3RvcmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2F0dHJSZXNvbHZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx3Qjs7Ozs7OzREQ2RBOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxTQUFTO0FBQzFDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQSx5QkFBeUIsNkNBQTZDLDBDQUEwQzs7O0FBR2hIO0FBQ0E7QUFDQSxrREFBa0QsU0FBUztBQUMzRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0Isa0JBQWtCO0FBQzFDLHVCQUF1QixpQkFBaUI7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFQUEyRTtBQUMzRSwwQkFBMEI7QUFDMUIsdUJBQXVCLGdCQUFnQjtBQUN2QztBQUNBO0FBQ0EsMEJBQTBCLGFBQWE7QUFDdkM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpQ0FBaUM7QUFDakMsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7O0FBRWY7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxTQUFTO0FBQzlDOztBQUVBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0EsUUFBUSxPQUFPO0FBQ2Y7QUFDQSx3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCO0FBQ0EsR0FBRztBQUNIOzs7QUFHQSwrRkFBK0Y7O0FBRS9GOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIOzs7QUFHQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsT0FBTyxNQUFNO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCO0FBQzFCLGFBQWEsWUFBWTtBQUN6QjtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxxQ0FBcUMsU0FBUztBQUM5QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sTUFBTTs7QUFFYjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDemhCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNuQkE7QUFDQSxhQUFhO0FBQ2IsV0FBVztBQUNYO0FBQ0EsQzs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtDOzs7Ozs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixhQUFhO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDOzs7Ozs7QUMvREE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLE9BQU87QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsTUFBTSxVQUFVLFdBQVcsTUFBTSxPQUFPLGFBQWE7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsVUFBVTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0U7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1YscUVBQXFFLEtBQUs7QUFDMUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELE9BQU87QUFDUCxrQkFBa0I7QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3Qzs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQXNCLEVBQUU7QUFDbEU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O0FDekxEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsc0JBQXNCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQ0FBcUM7O0FBRXJDO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFVBQVU7Ozs7Ozs7QUN2THRDO0FBQ0E7QUFDQSxjQUFjOztBQUVkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7O0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQ0FBMkMsU0FBUztBQUNwRDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSwrQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7OztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQUlBLDJCOzs7Ozs7QUNuUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQixlQUFlO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLGdCQUFnQjtBQUNwQyxrQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOztBQUVBLDZCOzs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLGVBQWU7QUFDL0I7O0FBRUE7QUFDQSwwRUFBMEU7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFzQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGdCQUFnQixtQkFBbUI7QUFDbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixjQUFjO0FBQ2xDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFOzs7Ozs7QUNyRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUFnRTtBQUNoRSxxR0FBcUc7QUFDckc7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEUsNEJBQTRCO0FBQzFHOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0MiLCJmaWxlIjoiV29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMjQpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGVlNGZkOGY0YTA3MWE4ZTg5ZjQ2IiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTQ6NTQ6MzMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMTkgMTQ6NTk6NDBcclxuICovXHJcblxyXG5mdW5jdGlvbiBleHRlbmQoY2hpbGRDbGFzcywgYmFzZUNsYXNzKXtcclxuICAgIHZhciBmbiA9IGZ1bmN0aW9uKCl7fTtcclxuICAgIGZuLnByb3RvdHlwZSA9IGJhc2VDbGFzcy5wcm90b3R5cGU7XHJcbiAgICBjaGlsZENsYXNzLnByb3RvdHlwZSA9IG5ldyBmbigpO1xyXG4gICAgY2hpbGRDbGFzcy5wcm90b3R5cGUuc3VwZXIgPSBiYXNlQ2xhc3M7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3V0aWxzL2V4dGVuZC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInJlcXVpcmUoJy4vaGVscGVyL3NoaW0uanMnKSgpO1xyXG5cclxuXHJcblxyXG52YXIgXyAgPSBtb2R1bGUuZXhwb3J0cztcclxudmFyIGVudGl0aWVzID0gcmVxdWlyZSgnLi9oZWxwZXIvZW50aXRpZXMuanMnKTtcclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciBvMnN0ciA9ICh7fSkudG9TdHJpbmc7XHJcbnZhciB3aW4gPSB0eXBlb2Ygd2luZG93ICE9PSd1bmRlZmluZWQnPyB3aW5kb3c6IGdsb2JhbDtcclxudmFyIE1BWF9QUklPUklUWSA9IDk5OTk7XHJcblxyXG5cclxuXy5ub29wID0gZnVuY3Rpb24oKXt9O1xyXG5fLnVpZCA9IChmdW5jdGlvbigpe1xyXG4gIHZhciBfdWlkPTA7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gX3VpZCsrO1xyXG4gIH1cclxufSkoKTtcclxuXHJcbl8uZXh0ZW5kID0gZnVuY3Rpb24oIG8xLCBvMiwgb3ZlcnJpZGUgKXtcclxuICBmb3IodmFyIGkgaW4gbzIpIGlmIChvMi5oYXNPd25Qcm9wZXJ0eShpKSl7XHJcbiAgICBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCB8fCBvdmVycmlkZSA9PT0gdHJ1ZSApe1xyXG4gICAgICBvMVtpXSA9IG8yW2ldXHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvMTtcclxufVxyXG5cclxuXy5rZXlzID0gT2JqZWN0LmtleXM/IE9iamVjdC5rZXlzOiBmdW5jdGlvbihvYmope1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgcmVzLnB1c2goaSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbl8uc29tZSA9IGZ1bmN0aW9uKGxpc3QsIGZuKXtcclxuICBmb3IodmFyIGkgPTAsbGVuID0gbGlzdC5sZW5ndGg7IGkgPCBsZW47IGkrKyl7XHJcbiAgICBpZihmbihsaXN0W2ldKSkgcmV0dXJuIHRydWVcclxuICB9XHJcbn1cclxuXHJcbl8udmFyTmFtZSA9ICdkJztcclxuXy5zZXROYW1lID0gJ3BfJztcclxuXy5jdHhOYW1lID0gJ2MnO1xyXG5fLmV4dE5hbWUgPSAnZSc7XHJcblxyXG5fLnJXb3JkID0gL15bXFwkXFx3XSskLztcclxuXy5yU2ltcGxlQWNjZXNzb3IgPSAvXltcXCRcXHddKyhcXC5bXFwkXFx3XSspKiQvO1xyXG5cclxuXy5uZXh0VGljayA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbic/IFxyXG4gIHNldEltbWVkaWF0ZS5iaW5kKHdpbikgOiBcclxuICBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgc2V0VGltZW91dChjYWxsYmFjaywgMCkgXHJcbiAgfVxyXG5cclxuXHJcblxyXG5fLnByZWZpeCA9IFwiJ3VzZSBzdHJpY3QnO3ZhciBcIiArIF8udmFyTmFtZSArIFwiPVwiICsgXy5jdHhOYW1lICsgXCIuZGF0YTtcIiArICBfLmV4dE5hbWUgICsgXCI9XCIgKyBfLmV4dE5hbWUgKyBcInx8Jyc7XCI7XHJcblxyXG5cclxuXy5zbGljZSA9IGZ1bmN0aW9uKG9iaiwgc3RhcnQsIGVuZCl7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIGZvcih2YXIgaSA9IHN0YXJ0IHx8IDAsIGxlbiA9IGVuZCB8fCBvYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgcmVzLnB1c2gob2JqW2ldKVxyXG4gIH1cclxuICByZXR1cm4gcmVzO1xyXG59XHJcblxyXG4vLyBiZWFjdXNlIHNsaWNlIGFuZCB0b0xvd2VyQ2FzZSBpcyBleHBlbnNpdmUuIHdlIGhhbmRsZSB1bmRlZmluZWQgYW5kIG51bGwgaW4gYW5vdGhlciB3YXlcclxuXy50eXBlT2YgPSBmdW5jdGlvbiAobykge1xyXG4gIHJldHVybiBvID09IG51bGwgPyBTdHJpbmcobykgOm8yc3RyLmNhbGwobykuc2xpY2UoOCwgLTEpLnRvTG93ZXJDYXNlKCk7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbl8ubWFrZVByZWRpY2F0ZSA9IGZ1bmN0aW9uIG1ha2VQcmVkaWNhdGUod29yZHMsIHByZWZpeCkge1xyXG4gICAgaWYgKHR5cGVvZiB3b3JkcyA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIHdvcmRzID0gd29yZHMuc3BsaXQoXCIgXCIpO1xyXG4gICAgfVxyXG4gICAgdmFyIGYgPSBcIlwiLFxyXG4gICAgY2F0cyA9IFtdO1xyXG4gICAgb3V0OiBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjYXRzLmxlbmd0aDsgKytqKXtcclxuICAgICAgICAgIGlmIChjYXRzW2pdWzBdLmxlbmd0aCA9PT0gd29yZHNbaV0ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgY2F0c1tqXS5wdXNoKHdvcmRzW2ldKTtcclxuICAgICAgICAgICAgICBjb250aW51ZSBvdXQ7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdHMucHVzaChbd29yZHNbaV1dKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNvbXBhcmVUbyhhcnIpIHtcclxuICAgICAgICBpZiAoYXJyLmxlbmd0aCA9PT0gMSkgcmV0dXJuIGYgKz0gXCJyZXR1cm4gc3RyID09PSAnXCIgKyBhcnJbMF0gKyBcIic7XCI7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIpe1wiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgKytpKXtcclxuICAgICAgICAgICBmICs9IFwiY2FzZSAnXCIgKyBhcnJbaV0gKyBcIic6XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGYgKz0gXCJyZXR1cm4gdHJ1ZX1yZXR1cm4gZmFsc2U7XCI7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gV2hlbiB0aGVyZSBhcmUgbW9yZSB0aGFuIHRocmVlIGxlbmd0aCBjYXRlZ29yaWVzLCBhbiBvdXRlclxyXG4gICAgLy8gc3dpdGNoIGZpcnN0IGRpc3BhdGNoZXMgb24gdGhlIGxlbmd0aHMsIHRvIHNhdmUgb24gY29tcGFyaXNvbnMuXHJcbiAgICBpZiAoY2F0cy5sZW5ndGggPiAzKSB7XHJcbiAgICAgICAgY2F0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGIubGVuZ3RoIC0gYS5sZW5ndGg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZiArPSBcInN3aXRjaChzdHIubGVuZ3RoKXtcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdmFyIGNhdCA9IGNhdHNbaV07XHJcbiAgICAgICAgICAgIGYgKz0gXCJjYXNlIFwiICsgY2F0WzBdLmxlbmd0aCArIFwiOlwiO1xyXG4gICAgICAgICAgICBjb21wYXJlVG8oY2F0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZiArPSBcIn1cIjtcclxuXHJcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBzaW1wbHkgZ2VuZXJhdGUgYSBmbGF0IGBzd2l0Y2hgIHN0YXRlbWVudC5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29tcGFyZVRvKHdvcmRzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oXCJzdHJcIiwgZik7XHJcbn1cclxuXHJcblxyXG5fLnRyYWNrRXJyb3JQb3MgPSAoZnVuY3Rpb24gKCl7XHJcbiAgLy8gbGluZWJyZWFrXHJcbiAgdmFyIGxiID0gL1xcclxcbnxbXFxuXFxyXFx1MjAyOFxcdTIwMjldL2c7XHJcbiAgdmFyIG1pblJhbmdlID0gMjAsIG1heFJhbmdlID0gMjA7XHJcbiAgZnVuY3Rpb24gZmluZExpbmUobGluZXMsIHBvcyl7XHJcbiAgICB2YXIgdG1wTGVuID0gMDtcclxuICAgIGZvcih2YXIgaSA9IDAsbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xyXG4gICAgICB2YXIgbGluZUxlbiA9IChsaW5lc1tpXSB8fCBcIlwiKS5sZW5ndGg7XHJcblxyXG4gICAgICBpZih0bXBMZW4gKyBsaW5lTGVuID4gcG9zKSB7XHJcbiAgICAgICAgcmV0dXJuIHtudW06IGksIGxpbmU6IGxpbmVzW2ldLCBzdGFydDogcG9zIC0gaSAtIHRtcExlbiAsIHByZXY6bGluZXNbaS0xXSwgbmV4dDogbGluZXNbaSsxXSB9O1xyXG4gICAgICB9XHJcbiAgICAgIC8vIDEgaXMgZm9yIHRoZSBsaW5lYnJlYWtcclxuICAgICAgdG1wTGVuID0gdG1wTGVuICsgbGluZUxlbiA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGZvcm1hdExpbmUoc3RyLCAgc3RhcnQsIG51bSwgdGFyZ2V0KXtcclxuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoO1xyXG4gICAgdmFyIG1pbiA9IHN0YXJ0IC0gbWluUmFuZ2U7XHJcbiAgICBpZihtaW4gPCAwKSBtaW4gPSAwO1xyXG4gICAgdmFyIG1heCA9IHN0YXJ0ICsgbWF4UmFuZ2U7XHJcbiAgICBpZihtYXggPiBsZW4pIG1heCA9IGxlbjtcclxuXHJcbiAgICB2YXIgcmVtYWluID0gc3RyLnNsaWNlKG1pbiwgbWF4KTtcclxuICAgIHZhciBwcmVmaXggPSBcIltcIiArKG51bSsxKSArIFwiXSBcIiArIChtaW4gPiAwPyBcIi4uXCIgOiBcIlwiKVxyXG4gICAgdmFyIHBvc3RmaXggPSBtYXggPCBsZW4gPyBcIi4uXCI6IFwiXCI7XHJcbiAgICB2YXIgcmVzID0gcHJlZml4ICsgcmVtYWluICsgcG9zdGZpeDtcclxuICAgIGlmKHRhcmdldCkgcmVzICs9IFwiXFxuXCIgKyBuZXcgQXJyYXkoc3RhcnQtbWluICsgcHJlZml4Lmxlbmd0aCArIDEpLmpvaW4oXCIgXCIpICsgXCJeXl5cIjtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG4gIHJldHVybiBmdW5jdGlvbihpbnB1dCwgcG9zKXtcclxuICAgIGlmKHBvcyA+IGlucHV0Lmxlbmd0aC0xKSBwb3MgPSBpbnB1dC5sZW5ndGgtMTtcclxuICAgIGxiLmxhc3RJbmRleCA9IDA7XHJcbiAgICB2YXIgbGluZXMgPSBpbnB1dC5zcGxpdChsYik7XHJcbiAgICB2YXIgbGluZSA9IGZpbmRMaW5lKGxpbmVzLHBvcyk7XHJcbiAgICB2YXIgc3RhcnQgPSBsaW5lLnN0YXJ0LCBudW0gPSBsaW5lLm51bTtcclxuXHJcbiAgICByZXR1cm4gKGxpbmUucHJldj8gZm9ybWF0TGluZShsaW5lLnByZXYsIHN0YXJ0LCBudW0tMSApICsgJ1xcbic6ICcnICkgKyBcclxuICAgICAgZm9ybWF0TGluZShsaW5lLmxpbmUsIHN0YXJ0LCBudW0sIHRydWUpICsgJ1xcbicgKyBcclxuICAgICAgKGxpbmUubmV4dD8gZm9ybWF0TGluZShsaW5lLm5leHQsIHN0YXJ0LCBudW0rMSApICsgJ1xcbic6ICcnICk7XHJcblxyXG4gIH1cclxufSkoKTtcclxuXHJcblxyXG52YXIgaWdub3JlZFJlZiA9IC9cXCgoXFw/XFwhfFxcP1xcOnxcXD9cXD0pL2c7XHJcbl8uZmluZFN1YkNhcHR1cmUgPSBmdW5jdGlvbiAocmVnU3RyKSB7XHJcbiAgdmFyIGxlZnQgPSAwLFxyXG4gICAgcmlnaHQgPSAwLFxyXG4gICAgbGVuID0gcmVnU3RyLmxlbmd0aCxcclxuICAgIGlnbm9yZWQgPSByZWdTdHIubWF0Y2goaWdub3JlZFJlZik7IC8vIGlnbm9yZWQgdW5jYXB0dXJlXHJcbiAgaWYoaWdub3JlZCkgaWdub3JlZCA9IGlnbm9yZWQubGVuZ3RoXHJcbiAgZWxzZSBpZ25vcmVkID0gMDtcclxuICBmb3IgKDsgbGVuLS07KSB7XHJcbiAgICB2YXIgbGV0dGVyID0gcmVnU3RyLmNoYXJBdChsZW4pO1xyXG4gICAgaWYgKGxlbiA9PT0gMCB8fCByZWdTdHIuY2hhckF0KGxlbiAtIDEpICE9PSBcIlxcXFxcIiApIHsgXHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKFwiKSBsZWZ0Kys7XHJcbiAgICAgIGlmIChsZXR0ZXIgPT09IFwiKVwiKSByaWdodCsrO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZiAobGVmdCAhPT0gcmlnaHQpIHRocm93IFwiUmVnRXhwOiBcIisgcmVnU3RyICsgXCIncyBicmFja2V0IGlzIG5vdCBtYXJjaGVkXCI7XHJcbiAgZWxzZSByZXR1cm4gbGVmdCAtIGlnbm9yZWQ7XHJcbn07XHJcblxyXG5cclxuXy5lc2NhcGVSZWdFeHAgPSBmdW5jdGlvbiggc3RyKXsvLyBDcmVkaXQ6IFhSZWdFeHAgMC42LjEgKGMpIDIwMDctMjAwOCBTdGV2ZW4gTGV2aXRoYW4gPGh0dHA6Ly9zdGV2ZW5sZXZpdGhhbi5jb20vcmVnZXgveHJlZ2V4cC8+IE1JVCBMaWNlbnNlXHJcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9bLVtcXF17fSgpKis/LlxcXFxeJHwsI1xcc10vZywgZnVuY3Rpb24obWF0Y2gpe1xyXG4gICAgcmV0dXJuICdcXFxcJyArIG1hdGNoO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuXHJcbnZhciByRW50aXR5ID0gbmV3IFJlZ0V4cChcIiYoPzooI3hbMC05YS1mQS1GXSspfCgjWzAtOV0rKXwoXCIgKyBfLmtleXMoZW50aXRpZXMpLmpvaW4oJ3wnKSArICcpKTsnLCAnZ2knKTtcclxuXHJcbl8uY29udmVydEVudGl0eSA9IGZ1bmN0aW9uKGNocil7XHJcblxyXG4gIHJldHVybiAoXCJcIiArIGNocikucmVwbGFjZShyRW50aXR5LCBmdW5jdGlvbihhbGwsIGhleCwgZGVjLCBjYXB0dXJlKXtcclxuICAgIHZhciBjaGFyQ29kZTtcclxuICAgIGlmKCBkZWMgKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBkZWMuc2xpY2UoMSksIDEwICk7XHJcbiAgICBlbHNlIGlmKCBoZXggKSBjaGFyQ29kZSA9IHBhcnNlSW50KCBoZXguc2xpY2UoMiksIDE2ICk7XHJcbiAgICBlbHNlIGNoYXJDb2RlID0gZW50aXRpZXNbY2FwdHVyZV1cclxuXHJcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSggY2hhckNvZGUgKVxyXG4gIH0pO1xyXG5cclxufVxyXG5cclxuXHJcbi8vIHNpbXBsZSBnZXQgYWNjZXNzb3JcclxuXHJcbl8uY3JlYXRlT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZT8gZnVuY3Rpb24obyl7XHJcbiAgcmV0dXJuIE9iamVjdC5jcmVhdGUobyB8fCBudWxsKVxyXG59OiAoZnVuY3Rpb24oKXtcclxuICAgIGZ1bmN0aW9uIFRlbXAoKSB7fVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG8pe1xyXG4gICAgICBpZighbykgcmV0dXJuIHt9XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbztcclxuICAgICAgdmFyIG9iaiA9IG5ldyBUZW1wKCk7XHJcbiAgICAgIFRlbXAucHJvdG90eXBlID0gbnVsbDsgLy8g5LiN6KaB5L+d5oyB5LiA5LiqIE8g55qE5p2C5pWj5byV55So77yIYSBzdHJheSByZWZlcmVuY2XvvIkuLi5cclxuICAgICAgcmV0dXJuIG9ialxyXG4gICAgfVxyXG59KSgpO1xyXG5cclxuXy5jcmVhdGVQcm90byA9IGZ1bmN0aW9uKGZuLCBvKXtcclxuICAgIGZ1bmN0aW9uIEZvbygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGZuO31cclxuICAgIEZvby5wcm90b3R5cGUgPSBvO1xyXG4gICAgcmV0dXJuIChmbi5wcm90b3R5cGUgPSBuZXcgRm9vKCkpO1xyXG59XHJcblxyXG5cclxuXy5yZW1vdmVPbmUgPSBmdW5jdGlvbihsaXN0ICwgZmlsdGVyKXtcclxuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XHJcbiAgZm9yKDtsZW4tLTspe1xyXG4gICAgaWYoZmlsdGVyKGxpc3RbbGVuXSkpIHtcclxuICAgICAgbGlzdC5zcGxpY2UobGVuLCAxKVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5cclxuLyoqXHJcbmNsb25lXHJcbiovXHJcbl8uY2xvbmUgPSBmdW5jdGlvbiBjbG9uZShvYmope1xyXG4gIGlmKCFvYmogfHwgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICkpIHJldHVybiBvYmo7XHJcbiAgaWYoQXJyYXkuaXNBcnJheShvYmopKXtcclxuICAgIHZhciBjbG9uZWQgPSBbXTtcclxuICAgIGZvcih2YXIgaT0wLGxlbiA9IG9iai5sZW5ndGg7IGk8IGxlbjtpKyspe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV1cclxuICAgIH1cclxuICAgIHJldHVybiBjbG9uZWQ7XHJcbiAgfWVsc2V7XHJcbiAgICB2YXIgY2xvbmVkID0ge307XHJcbiAgICBmb3IodmFyIGkgaW4gb2JqKSBpZihvYmouaGFzT3duUHJvcGVydHkoaSkpe1xyXG4gICAgICBjbG9uZWRbaV0gPSBvYmpbaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG4gIH1cclxufVxyXG5cclxuXy5lcXVhbHMgPSBmdW5jdGlvbihub3csIG9sZCl7XHJcbiAgdmFyIHR5cGUgPSB0eXBlb2Ygbm93O1xyXG4gIGlmKHR5cGUgPT09ICdudW1iZXInICYmIHR5cGVvZiBvbGQgPT09ICdudW1iZXInJiYgaXNOYU4obm93KSAmJiBpc05hTihvbGQpKSByZXR1cm4gdHJ1ZVxyXG4gIHJldHVybiBub3cgPT09IG9sZDtcclxufVxyXG5cclxudmFyIGRhc2ggPSAvLShbYS16XSkvZztcclxuXy5jYW1lbENhc2UgPSBmdW5jdGlvbihzdHIpe1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShkYXNoLCBmdW5jdGlvbihhbGwsIGNhcHR1cmUpe1xyXG4gICAgcmV0dXJuIGNhcHR1cmUudG9VcHBlckNhc2UoKTtcclxuICB9KVxyXG59XHJcblxyXG5cclxuXHJcbl8udGhyb3R0bGUgPSBmdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0KXtcclxuICB2YXIgd2FpdCA9IHdhaXQgfHwgMTAwO1xyXG4gIHZhciBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XHJcbiAgdmFyIHRpbWVvdXQgPSBudWxsO1xyXG4gIHZhciBwcmV2aW91cyA9IDA7XHJcbiAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICBwcmV2aW91cyA9ICtuZXcgRGF0ZTtcclxuICAgIHRpbWVvdXQgPSBudWxsO1xyXG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICB9O1xyXG4gIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgIHZhciBub3cgPSArIG5ldyBEYXRlO1xyXG4gICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xyXG4gICAgY29udGV4dCA9IHRoaXM7XHJcbiAgICBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcclxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB0aW1lb3V0ID0gbnVsbDtcclxuICAgICAgcHJldmlvdXMgPSBub3c7XHJcbiAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcclxuICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQpIHtcclxuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn07XHJcblxyXG4vLyBob2dhbiBlc2NhcGVcclxuLy8gPT09PT09PT09PT09PT1cclxuXy5lc2NhcGUgPSAoZnVuY3Rpb24oKXtcclxuICB2YXIgckFtcCA9IC8mL2csXHJcbiAgICAgIHJMdCA9IC88L2csXHJcbiAgICAgIHJHdCA9IC8+L2csXHJcbiAgICAgIHJBcG9zID0gL1xcJy9nLFxyXG4gICAgICByUXVvdCA9IC9cXFwiL2csXHJcbiAgICAgIGhDaGFycyA9IC9bJjw+XFxcIlxcJ10vO1xyXG5cclxuICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XHJcbiAgICByZXR1cm4gaENoYXJzLnRlc3Qoc3RyKSA/XHJcbiAgICAgIHN0clxyXG4gICAgICAgIC5yZXBsYWNlKHJBbXAsICcmYW1wOycpXHJcbiAgICAgICAgLnJlcGxhY2Uockx0LCAnJmx0OycpXHJcbiAgICAgICAgLnJlcGxhY2Uockd0LCAnJmd0OycpXHJcbiAgICAgICAgLnJlcGxhY2UockFwb3MsICcmIzM5OycpXHJcbiAgICAgICAgLnJlcGxhY2UoclF1b3QsICcmcXVvdDsnKSA6XHJcbiAgICAgIHN0cjtcclxuICB9XHJcbn0pKCk7XHJcblxyXG5fLmNhY2hlID0gZnVuY3Rpb24obWF4KXtcclxuICBtYXggPSBtYXggfHwgMTAwMDtcclxuICB2YXIga2V5cyA9IFtdLFxyXG4gICAgICBjYWNoZSA9IHt9O1xyXG4gIHJldHVybiB7XHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgaWYgKGtleXMubGVuZ3RoID4gdGhpcy5tYXgpIHtcclxuICAgICAgICBjYWNoZVtrZXlzLnNoaWZ0KCldID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIFxyXG4gICAgICBpZihjYWNoZVtrZXldID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhY2hlW2tleV0gPSB2YWx1ZTtcclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfSxcclxuICAgIGdldDogZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNhY2hlO1xyXG4gICAgICByZXR1cm4gY2FjaGVba2V5XTtcclxuICAgIH0sXHJcbiAgICBtYXg6IG1heCxcclxuICAgIGxlbjpmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4ga2V5cy5sZW5ndGg7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuLy8gLy8gc2V0dXAgdGhlIHJhdyBFeHByZXNzaW9uXHJcblxyXG5cclxuLy8gaGFuZGxlIHRoZSBzYW1lIGxvZ2ljIG9uIGNvbXBvbmVudCdzIGBvbi0qYCBhbmQgZWxlbWVudCdzIGBvbi0qYFxyXG4vLyByZXR1cm4gdGhlIGZpcmUgb2JqZWN0XHJcbl8uaGFuZGxlRXZlbnQgPSBmdW5jdGlvbih2YWx1ZSwgdHlwZSApe1xyXG4gIHZhciBzZWxmID0gdGhpcywgZXZhbHVhdGU7XHJcbiAgaWYodmFsdWUudHlwZSA9PT0gJ2V4cHJlc3Npb24nKXsgLy8gaWYgaXMgZXhwcmVzc2lvbiwgZ28gZXZhbHVhdGVkIHdheVxyXG4gICAgZXZhbHVhdGUgPSB2YWx1ZS5nZXQ7XHJcbiAgfVxyXG4gIGlmKGV2YWx1YXRlKXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKG9iail7XHJcbiAgICAgIHNlbGYuJHVwZGF0ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gb2JqO1xyXG4gICAgICAgIHZhciByZXMgPSBldmFsdWF0ZShzZWxmKTtcclxuICAgICAgICBpZihyZXMgPT09IGZhbHNlICYmIG9iaiAmJiBvYmoucHJldmVudERlZmF1bHQpIG9iai5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIGRhdGEuJGV2ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICB9KVxyXG5cclxuICAgIH1cclxuICB9ZWxzZXtcclxuICAgIHJldHVybiBmdW5jdGlvbiBmaXJlKCl7XHJcbiAgICAgIHZhciBhcmdzID0gXy5zbGljZShhcmd1bWVudHMpO1xyXG4gICAgICBhcmdzLnVuc2hpZnQodmFsdWUpO1xyXG4gICAgICBzZWxmLiR1cGRhdGUoZnVuY3Rpb24oKXtcclxuICAgICAgICBzZWxmLiRlbWl0LmFwcGx5KHNlbGYsIGFyZ3MpO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8gb25seSBjYWxsIG9uY2VcclxuXy5vbmNlID0gZnVuY3Rpb24oZm4pe1xyXG4gIHZhciB0aW1lID0gMDtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIGlmKCB0aW1lKysgPT09IDApIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgfVxyXG59XHJcblxyXG5fLmZpeE9ialN0ciA9IGZ1bmN0aW9uKHN0cil7XHJcbiAgaWYoc3RyLnRyaW0oKS5pbmRleE9mKCd7JykgIT09IDApe1xyXG4gICAgcmV0dXJuICd7JyArIHN0ciArICd9JztcclxuICB9XHJcbiAgcmV0dXJuIHN0cjtcclxufVxyXG5cclxuXHJcbl8ubWFwPSBmdW5jdGlvbihhcnJheSwgY2FsbGJhY2spe1xyXG4gIHZhciByZXMgPSBbXTtcclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJyYXkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgIHJlcy5wdXNoKGNhbGxiYWNrKGFycmF5W2ldLCBpKSk7XHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxvZyhtc2csIHR5cGUpe1xyXG4gIGlmKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiKSAgY29uc29sZVt0eXBlIHx8IFwibG9nXCJdKG1zZyk7XHJcbn1cclxuXHJcbl8ubG9nID0gbG9nO1xyXG5cclxuXHJcbl8ubm9ybUxpc3RlbmVyID0gZnVuY3Rpb24oIGV2ZW50cyAgKXtcclxuICAgIHZhciBldmVudExpc3RlbmVycyA9IFtdO1xyXG4gICAgdmFyIHBUeXBlID0gXy50eXBlT2YoIGV2ZW50cyApO1xyXG4gICAgaWYoIHBUeXBlID09PSAnYXJyYXknICl7XHJcbiAgICAgIHJldHVybiBldmVudHM7XHJcbiAgICB9ZWxzZSBpZiAoIHBUeXBlID09PSAnb2JqZWN0JyApe1xyXG4gICAgICBmb3IoIHZhciBpIGluIGV2ZW50cyApIGlmICggZXZlbnRzLmhhc093blByb3BlcnR5KGkpICl7XHJcbiAgICAgICAgZXZlbnRMaXN0ZW5lcnMucHVzaCh7XHJcbiAgICAgICAgICB0eXBlOiBpLFxyXG4gICAgICAgICAgbGlzdGVuZXI6IGV2ZW50c1tpXVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBldmVudExpc3RlbmVycztcclxufVxyXG5cclxuXHJcbi8vaHR0cDovL3d3dy53My5vcmcvaHRtbC93Zy9kcmFmdHMvaHRtbC9tYXN0ZXIvc2luZ2xlLXBhZ2UuaHRtbCN2b2lkLWVsZW1lbnRzXHJcbl8uaXNWb2lkVGFnID0gXy5tYWtlUHJlZGljYXRlKFwiYXJlYSBiYXNlIGJyIGNvbCBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWVudWl0ZW0gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyIHItY29udGVudFwiKTtcclxuXy5pc0Jvb2xlYW5BdHRyID0gXy5tYWtlUHJlZGljYXRlKCdzZWxlY3RlZCBjaGVja2VkIGRpc2FibGVkIHJlYWRvbmx5IHJlcXVpcmVkIG9wZW4gYXV0b2ZvY3VzIGNvbnRyb2xzIGF1dG9wbGF5IGNvbXBhY3QgbG9vcCBkZWZlciBtdWx0aXBsZScpO1xyXG5cclxuXHJcbl8uaXNFeHByID0gZnVuY3Rpb24oZXhwcil7XHJcbiAgcmV0dXJuIGV4cHIgJiYgZXhwci50eXBlID09PSAnZXhwcmVzc2lvbic7XHJcbn1cclxuLy8gQFRPRE86IG1ha2UgaXQgbW9yZSBzdHJpY3RcclxuXy5pc0dyb3VwID0gZnVuY3Rpb24oZ3JvdXApe1xyXG4gIHJldHVybiBncm91cC5pbmplY3QgfHwgZ3JvdXAuJGluamVjdDtcclxufVxyXG5cclxuXy5nZXRDb21waWxlRm4gPSBmdW5jdGlvbihzb3VyY2UsIGN0eCwgb3B0aW9ucyl7XHJcbiAgcmV0dXJuIGN0eC4kY29tcGlsZS5iaW5kKGN0eCxzb3VyY2UsIG9wdGlvbnMpXHJcbn1cclxuXHJcbi8vIHJlbW92ZSBkaXJlY3RpdmUgcGFyYW0gZnJvbSBBU1RcclxuXy5maXhUYWdBU1QgPSBmdW5jdGlvbiggdGFnQVNULCBDb21wb25lbnQgKXtcclxuXHJcbiAgaWYoIHRhZ0FTVC50b3VjaGVkICkgcmV0dXJuO1xyXG5cclxuICB2YXIgYXR0cnMgPSB0YWdBU1QuYXR0cnM7XHJcblxyXG4gIGlmKCAhYXR0cnMgKSByZXR1cm47XHJcblxyXG4gIC8vIE1heWJlIG11bHRpcGxlIGRpcmVjdGl2ZSBuZWVkIHNhbWUgcGFyYW0sIFxyXG4gIC8vIFdlIHBsYWNlIGFsbCBwYXJhbSBpbiB0b3RhbFBhcmFtTWFwXHJcbiAgdmFyIGxlbiA9IGF0dHJzLmxlbmd0aDtcclxuICBpZighbGVuKSByZXR1cm47XHJcbiAgdmFyIGRpcmVjdGl2ZXM9W10sIG90aGVyQXR0ck1hcCA9IHt9O1xyXG4gIGZvcig7bGVuLS07KXtcclxuXHJcbiAgICB2YXIgYXR0ciA9IGF0dHJzWyBsZW4gXTtcclxuXHJcblxyXG4gICAgLy8gQElFIGZpeCBJRTktIGlucHV0IHR5cGUgY2FuJ3QgYXNzaWduIGFmdGVyIHZhbHVlXHJcbiAgICBpZihhdHRyLm5hbWUgPT09ICd0eXBlJykgYXR0ci5wcmlvcml0eSA9IE1BWF9QUklPUklUWSsxO1xyXG5cclxuICAgIHZhciBkaXJlY3RpdmUgPSBDb21wb25lbnQuZGlyZWN0aXZlKCBhdHRyLm5hbWUgKTtcclxuICAgIGlmKCBkaXJlY3RpdmUgKSB7XHJcblxyXG4gICAgICBhdHRyLnByaW9yaXR5ID0gZGlyZWN0aXZlLnByaW9yaXR5IHx8IDE7XHJcbiAgICAgIGF0dHIuZGlyZWN0aXZlID0gdHJ1ZTtcclxuICAgICAgZGlyZWN0aXZlcy5wdXNoKGF0dHIpO1xyXG5cclxuICAgIH1lbHNlIGlmKGF0dHIudHlwZSA9PT0gJ2F0dHJpYnV0ZScpe1xyXG4gICAgICBvdGhlckF0dHJNYXBbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkaXJlY3RpdmVzLmZvckVhY2goIGZ1bmN0aW9uKCBhdHRyICl7XHJcbiAgICB2YXIgZGlyZWN0aXZlID0gQ29tcG9uZW50LmRpcmVjdGl2ZShhdHRyLm5hbWUpO1xyXG4gICAgdmFyIHBhcmFtID0gZGlyZWN0aXZlLnBhcmFtO1xyXG4gICAgaWYocGFyYW0gJiYgcGFyYW0ubGVuZ3RoKXtcclxuICAgICAgYXR0ci5wYXJhbSA9IHt9O1xyXG4gICAgICBwYXJhbS5mb3JFYWNoKGZ1bmN0aW9uKCBuYW1lICl7XHJcbiAgICAgICAgaWYoIG5hbWUgaW4gb3RoZXJBdHRyTWFwICl7XHJcbiAgICAgICAgICBhdHRyLnBhcmFtW25hbWVdID0gb3RoZXJBdHRyTWFwW25hbWVdID09PSB1bmRlZmluZWQ/IHRydWU6IG90aGVyQXR0ck1hcFtuYW1lXVxyXG4gICAgICAgICAgXy5yZW1vdmVPbmUoYXR0cnMsIGZ1bmN0aW9uKGF0dHIpe1xyXG4gICAgICAgICAgICByZXR1cm4gYXR0ci5uYW1lID09PSBuYW1lXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgYXR0cnMuc29ydChmdW5jdGlvbihhMSwgYTIpe1xyXG4gICAgXHJcbiAgICB2YXIgcDEgPSBhMS5wcmlvcml0eTtcclxuICAgIHZhciBwMiA9IGEyLnByaW9yaXR5O1xyXG5cclxuICAgIGlmKCBwMSA9PSBudWxsICkgcDEgPSBNQVhfUFJJT1JJVFk7XHJcbiAgICBpZiggcDIgPT0gbnVsbCApIHAyID0gTUFYX1BSSU9SSVRZO1xyXG5cclxuICAgIHJldHVybiBwMiAtIHAxO1xyXG5cclxuICB9KVxyXG5cclxuICB0YWdBU1QudG91Y2hlZCA9IHRydWU7XHJcbn1cclxuXHJcbl8uZmluZEl0ZW0gPSBmdW5jdGlvbihsaXN0LCBmaWx0ZXIpe1xyXG4gIGlmKCFsaXN0IHx8ICFsaXN0Lmxlbmd0aCkgcmV0dXJuO1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICB3aGlsZShsZW4tLSl7XHJcbiAgICBpZihmaWx0ZXIobGlzdFtsZW5dKSkgcmV0dXJuIGxpc3RbbGVuXVxyXG4gIH1cclxufVxyXG5cclxuXy5nZXRQYXJhbU9iaiA9IGZ1bmN0aW9uKGNvbXBvbmVudCwgcGFyYW0pe1xyXG4gIHZhciBwYXJhbU9iaiA9IHt9O1xyXG4gIGlmKHBhcmFtKSB7XHJcbiAgICBmb3IodmFyIGkgaW4gcGFyYW0pIGlmKHBhcmFtLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgdmFyIHZhbHVlID0gcGFyYW1baV07XHJcbiAgICAgIHBhcmFtT2JqW2ldID0gIHZhbHVlICYmIHZhbHVlLnR5cGU9PT0nZXhwcmVzc2lvbic/IGNvbXBvbmVudC4kZ2V0KHZhbHVlKTogdmFsdWU7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBwYXJhbU9iajtcclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci91dGlsLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICdCRUdJTic6ICd7JyxcclxuICAnRU5EJzogJ30nLFxyXG4gICdQUkVDT01QSUxFJzogZmFsc2VcclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9jb25maWcuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJmdW5jdGlvbiBkb2N1bWVudEZyYWdtZW50KCl7XHJcbiAgICB0aGlzLl9jaGlsZHJlbiA9IFtdO1xyXG59XHJcbmRvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnRGcmFnbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0RvY3VtZW50RnJhZ21lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNTowNTowMSBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0xOSAxODowNDo0NlxyXG4gKi9cclxudmFyIFBhcnNlciA9IHJlcXVpcmUoJy4uLy9wYXJzZXIvc3JjL1BhcnNlci5qcycpO1xyXG5cclxuaWYoIXRoaXMuZG9jdW1lbnQpe1xyXG4gICAgZG9jdW1lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50LmpzJyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEJhc2VSZW5kZXJTdG9yZShvYmope1xyXG5cclxuICAgIHRoaXMuX2JlZm9yZUNvbmZpZygpO1xyXG4gICAgdGhpcy5fY29uZmlnTW9kZWwob2JqKTtcclxuICAgIHRoaXMuX2FmdGVyQ29uZmlnKCk7XHJcbiAgICB0aGlzLl9wYXJzZSgpO1xyXG59XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9iZWZvcmVDb25maWcgPSBmdW5jdGlvbigpe1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fYWZ0ZXJDb25maWcgPSBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5jb25maWcgJiYgdGhpcy5jb25maWcodGhpcy5kYXRhKTtcclxufTtcclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX2NvbmZpZ01vZGVsID0gZnVuY3Rpb24obW9kZWwpe1xyXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLCBtb2RlbCk7XHJcblxyXG4gICAgaWYoIW1vZGVsLmRhdGEpIHRoaXMuZGF0YSA9IHt9O1xyXG4gICAgdGhpcy5fbGlzdCA9IHt9O1xyXG4gICAgdGhpcy5fZGVmaW5lciA9IG1vZGVsO1xyXG59XHJcblxyXG5CYXNlUmVuZGVyU3RvcmUucHJvdG90eXBlLl9jb21waWxlID0gZnVuY3Rpb24oYXN0LCBsaXN0SW5mbyl7XHJcbiAgICBpZihhc3QgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxhc3QubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kKHRoaXMuX2NvbXBpbGUoYXN0W2ldLCBsaXN0SW5mbykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb21waWxlclthc3QudHlwZV0oYXN0LCB0aGlzLCBsaXN0SW5mbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbkJhc2VSZW5kZXJTdG9yZS5wcm90b3R5cGUuX3BhcnNlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuQVNUID0gbmV3IFBhcnNlcih0aGlzLnRlbXBsYXRlKS5wYXJzZSgpO1xyXG59O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24oKXt9O1xyXG5cclxuQmFzZVJlbmRlclN0b3JlLnByb3RvdHlwZS5fc2dfID0gZnVuY3Rpb24gKHBhdGgsIGRhdGEpIHtcclxuICAgIHZhciByZXN1bHQ7XHJcbiAgICBpZiAocGF0aCBpbnN0YW5jZW9mIEV2ZW50KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcGF0aDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gZGF0YVtwYXRoXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQmFzZVJlbmRlclN0b3JlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0b3JlL0Jhc2VSZW5kZXJTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcblxyXG52YXIgY29uZmlnID0gcmVxdWlyZShcIi4uL2NvbmZpZy5qc1wiKTtcclxudmFyIG5vZGUgPSByZXF1aXJlKFwiLi9ub2RlLmpzXCIpO1xyXG52YXIgTGV4ZXIgPSByZXF1aXJlKFwiLi9MZXhlci5qc1wiKTtcclxudmFyIHZhck5hbWUgPSBfLnZhck5hbWU7XHJcbnZhciBjdHhOYW1lID0gXy5jdHhOYW1lO1xyXG52YXIgZXh0TmFtZSA9IF8uZXh0TmFtZTtcclxudmFyIGlzUGF0aCA9IF8ubWFrZVByZWRpY2F0ZShcIlNUUklORyBJREVOVCBOVU1CRVJcIik7XHJcbnZhciBpc0tleVdvcmQgPSBfLm1ha2VQcmVkaWNhdGUoXCJ0cnVlIGZhbHNlIHVuZGVmaW5lZCBudWxsIHRoaXMgQXJyYXkgRGF0ZSBKU09OIE1hdGggTmFOIFJlZ0V4cCBkZWNvZGVVUkkgZGVjb2RlVVJJQ29tcG9uZW50IGVuY29kZVVSSSBlbmNvZGVVUklDb21wb25lbnQgcGFyc2VGbG9hdCBwYXJzZUludCBPYmplY3RcIik7XHJcblxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBQYXJzZXIoaW5wdXQsIG9wdHMpe1xyXG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xyXG5cclxuICB0aGlzLmlucHV0ID0gaW5wdXQ7XHJcbiAgdGhpcy50b2tlbnMgPSBuZXcgTGV4ZXIoaW5wdXQsIG9wdHMpLmxleCgpO1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB0aGlzLmxlbmd0aCA9IHRoaXMudG9rZW5zLmxlbmd0aDtcclxufVxyXG5cclxuXHJcbnZhciBvcCA9IFBhcnNlci5wcm90b3R5cGU7XHJcblxyXG5cclxub3AucGFyc2UgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMucG9zID0gMDtcclxuICB2YXIgcmVzPSB0aGlzLnByb2dyYW0oKTtcclxuICBpZih0aGlzLmxsKCkudHlwZSA9PT0gJ1RBR19DTE9TRScpe1xyXG4gICAgdGhpcy5lcnJvcihcIllvdSBtYXkgZ290IGEgdW5jbG9zZWQgVGFnXCIpXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbm9wLmxsID0gIGZ1bmN0aW9uKGspe1xyXG4gIGsgPSBrIHx8IDE7XHJcbiAgaWYoayA8IDApIGsgPSBrICsgMTtcclxuICB2YXIgcG9zID0gdGhpcy5wb3MgKyBrIC0gMTtcclxuICBpZihwb3MgPiB0aGlzLmxlbmd0aCAtIDEpe1xyXG4gICAgICByZXR1cm4gdGhpcy50b2tlbnNbdGhpcy5sZW5ndGgtMV07XHJcbiAgfVxyXG4gIHJldHVybiB0aGlzLnRva2Vuc1twb3NdO1xyXG59XHJcbiAgLy8gbG9va2FoZWFkXHJcbm9wLmxhID0gZnVuY3Rpb24oayl7XHJcbiAgcmV0dXJuICh0aGlzLmxsKGspIHx8ICcnKS50eXBlO1xyXG59XHJcblxyXG5vcC5tYXRjaCA9IGZ1bmN0aW9uKHR5cGUsIHZhbHVlKXtcclxuICB2YXIgbGw7XHJcbiAgaWYoIShsbCA9IHRoaXMuZWF0KHR5cGUsIHZhbHVlKSkpe1xyXG4gICAgbGwgID0gdGhpcy5sbCgpO1xyXG4gICAgdGhpcy5lcnJvcignZXhwZWN0IFsnICsgdHlwZSArICh2YWx1ZSA9PSBudWxsPyAnJzonOicrIHZhbHVlKSArICddXCIgLT4gZ290IFwiWycgKyBsbC50eXBlICsgKHZhbHVlPT1udWxsPyAnJzonOicrbGwudmFsdWUpICsgJ10nLCBsbC5wb3MpXHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gbGw7XHJcbiAgfVxyXG59XHJcblxyXG5vcC5lcnJvciA9IGZ1bmN0aW9uKG1zZywgcG9zKXtcclxuICBtc2cgPSAgXCJcXG7jgJAgcGFyc2UgZmFpbGVkIOOAkSBcIiArIG1zZyArICAnOlxcblxcbicgKyBfLnRyYWNrRXJyb3JQb3ModGhpcy5pbnB1dCwgdHlwZW9mIHBvcyA9PT0gJ251bWJlcic/IHBvczogdGhpcy5sbCgpLnBvc3x8MCk7XHJcbiAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XHJcbn1cclxuXHJcbm9wLm5leHQgPSBmdW5jdGlvbihrKXtcclxuICBrID0gayB8fCAxO1xyXG4gIHRoaXMucG9zICs9IGs7XHJcbn1cclxub3AuZWF0ID0gZnVuY3Rpb24odHlwZSwgdmFsdWUpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBpZih0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpe1xyXG4gICAgZm9yKHZhciBsZW4gPSB0eXBlLmxlbmd0aCA7IGxlbi0tOyl7XHJcbiAgICAgIGlmKGxsLnR5cGUgPT09IHR5cGVbbGVuXSkge1xyXG4gICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgIHJldHVybiBsbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1lbHNle1xyXG4gICAgaWYoIGxsLnR5cGUgPT09IHR5cGUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbGwudmFsdWUgPT09IHZhbHVlKSApe1xyXG4gICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICByZXR1cm4gbGw7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuLy8gcHJvZ3JhbVxyXG4vLyAgOkVPRlxyXG4vLyAgfCAoc3RhdGVtZW50KSogRU9GXHJcbm9wLnByb2dyYW0gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBzdGF0ZW1lbnRzID0gW10sICBsbCA9IHRoaXMubGwoKTtcclxuICB3aGlsZShsbC50eXBlICE9PSAnRU9GJyAmJiBsbC50eXBlICE9PSdUQUdfQ0xPU0UnKXtcclxuXHJcbiAgICBzdGF0ZW1lbnRzLnB1c2godGhpcy5zdGF0ZW1lbnQoKSk7XHJcbiAgICBsbCA9IHRoaXMubGwoKTtcclxuICB9XHJcbiAgLy8gaWYobGwudHlwZSA9PT0gJ1RBR19DTE9TRScpIHRoaXMuZXJyb3IoXCJZb3UgbWF5IGhhdmUgdW5tYXRjaGVkIFRhZ1wiKVxyXG4gIHJldHVybiBzdGF0ZW1lbnRzO1xyXG59XHJcblxyXG4vLyBzdGF0ZW1lbnRcclxuLy8gIDogeG1sXHJcbi8vICB8IGpzdFxyXG4vLyAgfCB0ZXh0XHJcbm9wLnN0YXRlbWVudCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsID0gdGhpcy5sbCgpO1xyXG4gIHN3aXRjaChsbC50eXBlKXtcclxuICAgIGNhc2UgJ05BTUUnOlxyXG4gICAgY2FzZSAnVEVYVCc6XHJcbiAgICAgIHZhciB0ZXh0ID0gbGwudmFsdWU7XHJcbiAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICB3aGlsZShsbCA9IHRoaXMuZWF0KFsnTkFNRScsICdURVhUJ10pKXtcclxuICAgICAgICB0ZXh0ICs9IGxsLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBub2RlLnRleHQodGV4dCk7XHJcbiAgICBjYXNlICdUQUdfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLnhtbCgpO1xyXG4gICAgY2FzZSAnT1BFTic6IFxyXG4gICAgICByZXR1cm4gdGhpcy5kaXJlY3RpdmUoKTtcclxuICAgIGNhc2UgJ0VYUFJfT1BFTic6XHJcbiAgICAgIHJldHVybiB0aGlzLmludGVycGxhdGlvbigpO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuLy8geG1sIFxyXG4vLyBzdGFnIHN0YXRlbWVudCogVEFHX0NMT1NFPyhpZiBzZWxmLWNsb3NlZCB0YWcpXHJcbm9wLnhtbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUsIGF0dHJzLCBjaGlsZHJlbiwgc2VsZkNsb3NlZDtcclxuICBuYW1lID0gdGhpcy5tYXRjaCgnVEFHX09QRU4nKS52YWx1ZTtcclxuICBhdHRycyA9IHRoaXMuYXR0cnMoKTtcclxuICBzZWxmQ2xvc2VkID0gdGhpcy5lYXQoJy8nKVxyXG4gIHRoaXMubWF0Y2goJz4nKTtcclxuICBpZiggIXNlbGZDbG9zZWQgJiYgIV8uaXNWb2lkVGFnKG5hbWUpICl7XHJcbiAgICBjaGlsZHJlbiA9IHRoaXMucHJvZ3JhbSgpO1xyXG4gICAgaWYoIXRoaXMuZWF0KCdUQUdfQ0xPU0UnLCBuYW1lKSkgdGhpcy5lcnJvcignZXhwZWN0IDwvJytuYW1lKyc+IGdvdCcrICdubyBtYXRjaGVkIGNsb3NlVGFnJylcclxuICB9XHJcbiAgcmV0dXJuIG5vZGUuZWxlbWVudChuYW1lLCBhdHRycywgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vLyB4ZW50aXR5XHJcbi8vICAtcnVsZSh3cmFwIGF0dHJpYnV0ZSlcclxuLy8gIC1hdHRyaWJ1dGVcclxuLy9cclxuLy8gX19leGFtcGxlX19cclxuLy8gIG5hbWUgPSAxIHwgIFxyXG4vLyAgbmctaGlkZSB8XHJcbi8vICBvbi1jbGljaz17e319IHwgXHJcbi8vICB7eyNpZiBuYW1lfX1vbi1jbGljaz17e3h4fX17eyNlbHNlfX1vbi10YXA9e3t9fXt7L2lmfX1cclxuXHJcbm9wLnhlbnRpdHkgPSBmdW5jdGlvbihsbCl7XHJcbiAgdmFyIG5hbWUgPSBsbC52YWx1ZSwgdmFsdWUsIG1vZGlmaWVyO1xyXG4gIGlmKGxsLnR5cGUgPT09ICdOQU1FJyl7XHJcbiAgICAvL0Agb25seSBmb3IgdGVzdFxyXG4gICAgaWYofm5hbWUuaW5kZXhPZignLicpKXtcclxuICAgICAgdmFyIHRtcCA9IG5hbWUuc3BsaXQoJy4nKTtcclxuICAgICAgbmFtZSA9IHRtcFswXTtcclxuICAgICAgbW9kaWZpZXIgPSB0bXBbMV1cclxuXHJcbiAgICB9XHJcbiAgICBpZiggdGhpcy5lYXQoXCI9XCIpICkgdmFsdWUgPSB0aGlzLmF0dHZhbHVlKG1vZGlmaWVyKTtcclxuICAgIHJldHVybiBub2RlLmF0dHJpYnV0ZSggbmFtZSwgdmFsdWUsIG1vZGlmaWVyICk7XHJcbiAgfWVsc2V7XHJcbiAgICBpZiggbmFtZSAhPT0gJ2lmJykgdGhpcy5lcnJvcihcImN1cnJlbnQgdmVyc2lvbi4gT05MWSBSVUxFICNpZiAjZWxzZSAjZWxzZWlmIGlzIHZhbGlkIGluIHRhZywgdGhlIHJ1bGUgI1wiICsgbmFtZSArICcgaXMgaW52YWxpZCcpO1xyXG4gICAgcmV0dXJuIHRoaXNbJ2lmJ10odHJ1ZSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuLy8gc3RhZyAgICAgOjo9ICAgICc8JyBOYW1lIChTIGF0dHIpKiBTPyAnPicgIFxyXG4vLyBhdHRyICAgIDo6PSAgICAgTmFtZSBFcSBhdHR2YWx1ZVxyXG5vcC5hdHRycyA9IGZ1bmN0aW9uKGlzQXR0cmlidXRlKXtcclxuICB2YXIgZWF0XHJcbiAgaWYoIWlzQXR0cmlidXRlKXtcclxuICAgIGVhdCA9IFtcIk5BTUVcIiwgXCJPUEVOXCJdXHJcbiAgfWVsc2V7XHJcbiAgICBlYXQgPSBbXCJOQU1FXCJdXHJcbiAgfVxyXG5cclxuICB2YXIgYXR0cnMgPSBbXSwgbGw7XHJcbiAgd2hpbGUgKGxsID0gdGhpcy5lYXQoZWF0KSl7XHJcbiAgICBhdHRycy5wdXNoKHRoaXMueGVudGl0eSggbGwgKSlcclxuICB9XHJcbiAgcmV0dXJuIGF0dHJzO1xyXG59XHJcblxyXG4vLyBhdHR2YWx1ZVxyXG4vLyAgOiBTVFJJTkcgIFxyXG4vLyAgfCBOQU1FXHJcbm9wLmF0dHZhbHVlID0gZnVuY3Rpb24obWRmKXtcclxuICB2YXIgbGwgPSB0aGlzLmxsKCk7XHJcbiAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgY2FzZSBcIk5BTUVcIjpcclxuICAgIGNhc2UgXCJVTlFcIjpcclxuICAgIGNhc2UgXCJTVFJJTkdcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IGxsLnZhbHVlO1xyXG4gICAgICBpZih+dmFsdWUuaW5kZXhPZihjb25maWcuQkVHSU4pICYmIH52YWx1ZS5pbmRleE9mKGNvbmZpZy5FTkQpICYmIG1kZiE9PSdjbXBsJyl7XHJcbiAgICAgICAgdmFyIGNvbnN0YW50ID0gdHJ1ZTtcclxuICAgICAgICB2YXIgcGFyc2VkID0gbmV3IFBhcnNlcih2YWx1ZSwgeyBtb2RlOiAyIH0pLnBhcnNlKCk7XHJcbiAgICAgICAgaWYocGFyc2VkLmxlbmd0aCA9PT0gMSAmJiBwYXJzZWRbMF0udHlwZSA9PT0gJ2V4cHJlc3Npb24nKSByZXR1cm4gcGFyc2VkWzBdO1xyXG4gICAgICAgIHZhciBib2R5ID0gW107XHJcbiAgICAgICAgcGFyc2VkLmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICBpZighaXRlbS5jb25zdGFudCkgY29uc3RhbnQ9ZmFsc2U7XHJcbiAgICAgICAgICAvLyBzaWxlbnQgdGhlIG11dGlwbGUgaW50ZXBsYXRpb25cclxuICAgICAgICAgICAgYm9keS5wdXNoKGl0ZW0uYm9keSB8fCBcIidcIiArIGl0ZW0udGV4dC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIikgKyBcIidcIik7ICAgICAgICBcclxuICAgICAgICB9KTtcclxuICAgICAgICBib2R5ID0gXCJbXCIgKyBib2R5LmpvaW4oXCIsXCIpICsgXCJdLmpvaW4oJycpXCI7XHJcbiAgICAgICAgdmFsdWUgPSBub2RlLmV4cHJlc3Npb24oYm9keSwgbnVsbCwgY29uc3RhbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIGNhc2UgXCJFWFBSX09QRU5cIjpcclxuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJwbGF0aW9uKCk7XHJcbiAgICAvLyBjYXNlIFwiT1BFTlwiOlxyXG4gICAgLy8gICBpZihsbC52YWx1ZSA9PT0gJ2luYycgfHwgbGwudmFsdWUgPT09ICdpbmNsdWRlJyl7XHJcbiAgICAvLyAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaW5jKCk7XHJcbiAgICAvLyAgIH1lbHNle1xyXG4gICAgLy8gICAgIHRoaXMuZXJyb3IoJ2F0dHJpYnV0ZSB2YWx1ZSBvbmx5IHN1cHBvcnQgaW50ZXBsYXRpb24gYW5kIHsjaW5jfSBzdGF0ZW1lbnQnKVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyAgIGJyZWFrO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB0b2tlbjogJysgdGhpcy5sYSgpKVxyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7I319XHJcbm9wLmRpcmVjdGl2ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIG5hbWUgPSB0aGlzLmxsKCkudmFsdWU7XHJcbiAgdGhpcy5uZXh0KCk7XHJcbiAgaWYodHlwZW9mIHRoaXNbbmFtZV0gPT09ICdmdW5jdGlvbicpe1xyXG4gICAgcmV0dXJuIHRoaXNbbmFtZV0oKVxyXG4gIH1lbHNle1xyXG4gICAgdGhpcy5lcnJvcignVW5kZWZpbmVkIGRpcmVjdGl2ZVsnKyBuYW1lICsnXScpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbi8vIHt7fX1cclxub3AuaW50ZXJwbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB0aGlzLm1hdGNoKCdFWFBSX09QRU4nKTtcclxuICB2YXIgcmVzID0gdGhpcy5leHByZXNzaW9uKHRydWUpO1xyXG4gIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8vIHt7fn19XHJcbm9wLmluYyA9IG9wLmluY2x1ZGUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBjb250ZW50ID0gdGhpcy5leHByZXNzaW9uKCk7XHJcbiAgdGhpcy5tYXRjaCgnRU5EJyk7XHJcbiAgcmV0dXJuIG5vZGUudGVtcGxhdGUoY29udGVudCk7XHJcbn1cclxuXHJcbi8vIHt7I2lmfX1cclxub3BbXCJpZlwiXSA9IGZ1bmN0aW9uKHRhZyl7XHJcbiAgdmFyIHRlc3QgPSB0aGlzLmV4cHJlc3Npb24oKTtcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcblxyXG4gIHZhciBjb250YWluZXIgPSBjb25zZXF1ZW50O1xyXG4gIHZhciBzdGF0ZW1lbnQgPSAhdGFnPyBcInN0YXRlbWVudFwiIDogXCJhdHRyc1wiO1xyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgdmFyIGxsLCBjbG9zZTtcclxuICB3aGlsZSggISAoY2xvc2UgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGxsID0gdGhpcy5sbCgpO1xyXG4gICAgaWYoIGxsLnR5cGUgPT09ICdPUEVOJyApe1xyXG4gICAgICBzd2l0Y2goIGxsLnZhbHVlICl7XHJcbiAgICAgICAgY2FzZSAnZWxzZSc6XHJcbiAgICAgICAgICBjb250YWluZXIgPSBhbHRlcm5hdGU7XHJcbiAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgIHRoaXMubWF0Y2goICdFTkQnICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdlbHNlaWYnOlxyXG4gICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICBhbHRlcm5hdGUucHVzaCggdGhpc1tcImlmXCJdKHRhZykgKTtcclxuICAgICAgICAgIHJldHVybiBub2RlWydpZiddKCB0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUgKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgY29udGFpbmVyLnB1c2goIHRoaXNbc3RhdGVtZW50XSh0cnVlKSApO1xyXG4gICAgICB9XHJcbiAgICB9ZWxzZXtcclxuICAgICAgY29udGFpbmVyLnB1c2godGhpc1tzdGF0ZW1lbnRdKHRydWUpKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy8gaWYgc3RhdGVtZW50IG5vdCBtYXRjaGVkXHJcbiAgaWYoY2xvc2UudmFsdWUgIT09IFwiaWZcIikgdGhpcy5lcnJvcignVW5tYXRjaGVkIGlmIGRpcmVjdGl2ZScpXHJcbiAgcmV0dXJuIG5vZGVbXCJpZlwiXSh0ZXN0LCBjb25zZXF1ZW50LCBhbHRlcm5hdGUpO1xyXG59XHJcblxyXG5cclxuLy8gQG1hcmsgICBtdXN0YWNoZSBzeW50YXggaGF2ZSBuYXRydXJlIGRpcywgY2Fub3Qgd2l0aCBleHByZXNzaW9uXHJcbi8vIHt7I2xpc3R9fVxyXG5vcC5saXN0ID0gZnVuY3Rpb24oKXtcclxuICAvLyBzZXF1ZW5jZSBjYW4gYmUgYSBsaXN0IG9yIGhhc2hcclxuICB2YXIgc2VxdWVuY2UgPSB0aGlzLmV4cHJlc3Npb24oKSwgdmFyaWFibGUsIGxsLCB0cmFjaztcclxuICB2YXIgY29uc2VxdWVudCA9IFtdLCBhbHRlcm5hdGU9W107XHJcbiAgdmFyIGNvbnRhaW5lciA9IGNvbnNlcXVlbnQ7XHJcblxyXG4gIHRoaXMubWF0Y2goJ0lERU5UJywgJ2FzJyk7XHJcblxyXG4gIHZhcmlhYmxlID0gdGhpcy5tYXRjaCgnSURFTlQnKS52YWx1ZTtcclxuXHJcbiAgaWYodGhpcy5lYXQoJ0lERU5UJywgJ2J5Jykpe1xyXG4gICAgaWYodGhpcy5lYXQoJ0lERU5UJyx2YXJpYWJsZSArICdfaW5kZXgnKSl7XHJcbiAgICAgIHRyYWNrID0gdHJ1ZTtcclxuICAgIH1lbHNle1xyXG4gICAgICB0cmFjayA9IHRoaXMuZXhwcmVzc2lvbigpO1xyXG4gICAgICBpZih0cmFjay5jb25zdGFudCl7XHJcbiAgICAgICAgLy8gdHJ1ZSBpcyBtZWFucyBjb25zdGFudCwgd2UgaGFuZGxlIGl0IGp1c3QgbGlrZSB4eHhfaW5kZXguXHJcbiAgICAgICAgdHJhY2sgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB0aGlzLm1hdGNoKCdFTkQnKTtcclxuXHJcbiAgd2hpbGUoICEobGwgPSB0aGlzLmVhdCgnQ0xPU0UnKSkgKXtcclxuICAgIGlmKHRoaXMuZWF0KCdPUEVOJywgJ2Vsc2UnKSl7XHJcbiAgICAgIGNvbnRhaW5lciA9ICBhbHRlcm5hdGU7XHJcbiAgICAgIHRoaXMubWF0Y2goJ0VORCcpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIGNvbnRhaW5lci5wdXNoKHRoaXMuc3RhdGVtZW50KCkpO1xyXG4gICAgfVxyXG4gIH1cclxuICBcclxuICBpZihsbC52YWx1ZSAhPT0gJ2xpc3QnKSB0aGlzLmVycm9yKCdleHBlY3QgJyArICdsaXN0IGdvdCAnICsgJy8nICsgbGwudmFsdWUgKyAnICcsIGxsLnBvcyApO1xyXG4gIHJldHVybiBub2RlLmxpc3Qoc2VxdWVuY2UsIHZhcmlhYmxlLCBjb25zZXF1ZW50LCBhbHRlcm5hdGUsIHRyYWNrKTtcclxufVxyXG5cclxuXHJcbm9wLmV4cHJlc3Npb24gPSBmdW5jdGlvbigpe1xyXG4gIHZhciBleHByZXNzaW9uO1xyXG4gIGlmKHRoaXMuZWF0KCdAKCcpKXsgLy9vbmNlIGJpbmRcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICAgIGV4cHJlc3Npb24ub25jZSA9IHRydWU7XHJcbiAgICB0aGlzLm1hdGNoKCcpJylcclxuICB9ZWxzZXtcclxuICAgIGV4cHJlc3Npb24gPSB0aGlzLmV4cHIoKTtcclxuICB9XHJcbiAgcmV0dXJuIGV4cHJlc3Npb247XHJcbn1cclxuXHJcbm9wLmV4cHIgPSBmdW5jdGlvbigpe1xyXG4gIHRoaXMuZGVwZW5kID0gW107XHJcblxyXG4gIHZhciBidWZmZXIgPSB0aGlzLmZpbHRlcigpXHJcblxyXG4gIHZhciBib2R5ID0gYnVmZmVyLmdldCB8fCBidWZmZXI7XHJcbiAgdmFyIHNldGJvZHkgPSBidWZmZXIuc2V0O1xyXG4gIHJldHVybiBub2RlLmV4cHJlc3Npb24oYm9keSwgc2V0Ym9keSwgIXRoaXMuZGVwZW5kLmxlbmd0aCwgYnVmZmVyLmZpbHRlcnMpO1xyXG59XHJcblxyXG5cclxuLy8gZmlsdGVyXHJcbi8vIGFzc2lnbiAoJ3wnIGZpbHRlcm5hbWVbJzonIGFyZ3NdKSAqIFxyXG5vcC5maWx0ZXIgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5hc3NpZ24oKTtcclxuICB2YXIgbGwgPSB0aGlzLmVhdCgnfCcpO1xyXG4gIHZhciBidWZmZXIgPSBbXSwgZmlsdGVycyxzZXRCdWZmZXIsIHByZWZpeCxcclxuICAgIGF0dHIgPSBcInRcIiwgXHJcbiAgICBzZXQgPSBsZWZ0LnNldCwgZ2V0LCBcclxuICAgIHRtcCA9IFwiXCI7XHJcblxyXG4gIGlmKGxsKXtcclxuICAgIGlmKHNldCkge1xyXG4gICAgICBzZXRCdWZmZXIgPSBbXTtcclxuICAgICAgZmlsdGVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHByZWZpeCA9IFwiKGZ1bmN0aW9uKFwiICsgYXR0ciArIFwiKXtcIjtcclxuXHJcbiAgICBkb3tcclxuICAgICAgdmFyIGZpbHRlck5hbWUgPSB0aGlzLm1hdGNoKCdJREVOVCcpLnZhbHVlO1xyXG4gICAgICB0bXAgPSBhdHRyICsgXCIgPSBcIiArIGN0eE5hbWUgKyBcIi5fZl8oJ1wiICsgZmlsdGVyTmFtZSArIFwiJyApLmdldC5jYWxsKCBcIitfLmN0eE5hbWUgK1wiLFwiICsgYXR0ciA7XHJcbiAgICAgIGlmKHRoaXMuZWF0KCc6Jykpe1xyXG4gICAgICAgIHRtcCArPVwiLCBcIisgdGhpcy5hcmd1bWVudHMoXCJ8XCIpLmpvaW4oXCIsXCIpICsgXCIpO1wiXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRtcCArPSAnKTsnXHJcbiAgICAgIH1cclxuICAgICAgYnVmZmVyLnB1c2godG1wKTtcclxuICAgICAgXHJcbiAgICAgIGlmKHNldCl7XHJcbiAgICAgICAgLy8gb25seSBpbiBydW50aW1lICx3ZSBjYW4gZGV0ZWN0ICB3aGV0aGVyICB0aGUgZmlsdGVyIGhhcyBhIHNldCBmdW5jdGlvbi4gXHJcbiAgICAgICAgZmlsdGVycy5wdXNoKGZpbHRlck5hbWUpO1xyXG4gICAgICAgIHNldEJ1ZmZlci51bnNoaWZ0KCB0bXAucmVwbGFjZShcIiApLmdldC5jYWxsXCIsIFwiICkuc2V0LmNhbGxcIikgKTtcclxuICAgICAgfVxyXG5cclxuICAgIH13aGlsZShsbCA9IHRoaXMuZWF0KCd8JykpO1xyXG4gICAgYnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyICk7XHJcbiAgICBzZXRCdWZmZXIgJiYgc2V0QnVmZmVyLnB1c2goXCJyZXR1cm4gXCIgKyBhdHRyKTtcclxuXHJcbiAgICBnZXQgPSAgcHJlZml4ICsgYnVmZmVyLmpvaW4oXCJcIikgKyBcIn0pKFwiK2xlZnQuZ2V0K1wiKVwiO1xyXG4gICAgLy8gd2UgY2FsbCBiYWNrIHRvIHZhbHVlLlxyXG4gICAgaWYoc2V0QnVmZmVyKXtcclxuICAgICAgLy8gY2hhbmdlIF9zc19fKG5hbWUsIF9wXykgdG8gX3NfXyhuYW1lLCBmaWx0ZXJGbihfcF8pKTtcclxuICAgICAgc2V0ID0gc2V0LnJlcGxhY2UoXy5zZXROYW1lLCBcclxuICAgICAgICBwcmVmaXggKyBzZXRCdWZmZXIuam9pbihcIlwiKSArIFwifSkoXCIr44CAXy5zZXROYW1l44CAK1wiKVwiICk7XHJcblxyXG4gICAgfVxyXG4gICAgLy8gdGhlIHNldCBmdW5jdGlvbiBpcyBkZXBlbmQgb24gdGhlIGZpbHRlciBkZWZpbml0aW9uLiBpZiBpdCBoYXZlIHNldCBtZXRob2QsIHRoZSBzZXQgd2lsbCB3b3JrXHJcbiAgICB2YXIgcmV0ID0gZ2V0c2V0KGdldCwgc2V0KTtcclxuICAgIHJldC5maWx0ZXJzID0gZmlsdGVycztcclxuICAgIHJldHVybiByZXQ7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG4vLyBhc3NpZ25cclxuLy8gbGVmdC1oYW5kLWV4cHIgPSBjb25kaXRpb25cclxub3AuYXNzaWduID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuY29uZGl0aW9uKCksIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWyc9JywgJys9JywgJy09JywgJyo9JywgJy89JywgJyU9J10pKXtcclxuICAgIGlmKCFsZWZ0LnNldCkgdGhpcy5lcnJvcignaW52YWxpZCBsZWZ0aGFuZCBleHByZXNzaW9uIGluIGFzc2lnbm1lbnQgZXhwcmVzc2lvbicpO1xyXG4gICAgcmV0dXJuIGdldHNldCggbGVmdC5zZXQucmVwbGFjZSggXCIsXCIgKyBfLnNldE5hbWUsIFwiLFwiICsgdGhpcy5jb25kaXRpb24oKS5nZXQgKS5yZXBsYWNlKFwiJz0nXCIsIFwiJ1wiK2xsLnR5cGUrXCInXCIpLCBsZWZ0LnNldCk7XHJcbiAgICAvLyByZXR1cm4gZ2V0c2V0KCcoJyArIGxlZnQuZ2V0ICsgbGwudHlwZSAgKyB0aGlzLmNvbmRpdGlvbigpLmdldCArICcpJywgbGVmdC5zZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG5cclxuLy8gb3JcclxuLy8gb3IgPyBhc3NpZ24gOiBhc3NpZ25cclxub3AuY29uZGl0aW9uID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIHRlc3QgPSB0aGlzLm9yKCk7XHJcbiAgaWYodGhpcy5lYXQoJz8nKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KFt0ZXN0LmdldCArIFwiP1wiLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXQsIFxyXG4gICAgICB0aGlzLm1hdGNoKFwiOlwiKS50eXBlLCBcclxuICAgICAgdGhpcy5hc3NpZ24oKS5nZXRdLmpvaW4oXCJcIikpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHRlc3Q7XHJcbn1cclxuXHJcbi8vIGFuZFxyXG4vLyBhbmQgJiYgb3Jcclxub3Aub3IgPSBmdW5jdGlvbigpe1xyXG5cclxuICB2YXIgbGVmdCA9IHRoaXMuYW5kKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCd8fCcpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnfHwnICsgdGhpcy5vcigpLmdldCk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyBlcXVhbFxyXG4vLyBlcXVhbCAmJiBhbmRcclxub3AuYW5kID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgdmFyIGxlZnQgPSB0aGlzLmVxdWFsKCk7XHJcblxyXG4gIGlmKHRoaXMuZWF0KCcmJicpKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyAnJiYnICsgdGhpcy5hbmQoKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdDtcclxufVxyXG4vLyByZWxhdGlvblxyXG4vLyBcclxuLy8gZXF1YWwgPT0gcmVsYXRpb25cclxuLy8gZXF1YWwgIT0gcmVsYXRpb25cclxuLy8gZXF1YWwgPT09IHJlbGF0aW9uXHJcbi8vIGVxdWFsICE9PSByZWxhdGlvblxyXG5vcC5lcXVhbCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnJlbGF0aW9uKCksIGxsO1xyXG4gIC8vIEBwZXJmO1xyXG4gIGlmKCBsbCA9IHRoaXMuZWF0KFsnPT0nLCchPScsICc9PT0nLCAnIT09J10pKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC50eXBlICsgdGhpcy5lcXVhbCgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gcmVsYXRpb24gPCBhZGRpdGl2ZVxyXG4vLyByZWxhdGlvbiA+IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIDw9IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uID49IGFkZGl0aXZlXHJcbi8vIHJlbGF0aW9uIGluIGFkZGl0aXZlXHJcbm9wLnJlbGF0aW9uID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMuYWRkaXRpdmUoKSwgbGw7XHJcbiAgLy8gQHBlcmZcclxuICBpZihsbCA9ICh0aGlzLmVhdChbJzwnLCAnPicsICc+PScsICc8PSddKSB8fCB0aGlzLmVhdCgnSURFTlQnLCAnaW4nKSApKXtcclxuICAgIHJldHVybiBnZXRzZXQobGVmdC5nZXQgKyBsbC52YWx1ZSArIHRoaXMucmVsYXRpb24oKS5nZXQpO1xyXG4gIH1cclxuICByZXR1cm4gbGVmdFxyXG59XHJcbi8vIGFkZGl0aXZlIDpcclxuLy8gbXVsdGl2ZVxyXG4vLyBhZGRpdGl2ZSArIG11bHRpdmVcclxuLy8gYWRkaXRpdmUgLSBtdWx0aXZlXHJcbm9wLmFkZGl0aXZlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgbGVmdCA9IHRoaXMubXVsdGl2ZSgpICxsbDtcclxuICBpZihsbD0gdGhpcy5lYXQoWycrJywnLSddKSApe1xyXG4gICAgcmV0dXJuIGdldHNldChsZWZ0LmdldCArIGxsLnZhbHVlICsgdGhpcy5hZGRpdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0XHJcbn1cclxuLy8gbXVsdGl2ZSA6XHJcbi8vIHVuYXJ5XHJcbi8vIG11bHRpdmUgKiB1bmFyeVxyXG4vLyBtdWx0aXZlIC8gdW5hcnlcclxuLy8gbXVsdGl2ZSAlIHVuYXJ5XHJcbm9wLm11bHRpdmUgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsZWZ0ID0gdGhpcy5yYW5nZSgpICxsbDtcclxuICBpZiggbGwgPSB0aGlzLmVhdChbJyonLCAnLycgLCclJ10pICl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KGxlZnQuZ2V0ICsgbGwudHlwZSArIHRoaXMubXVsdGl2ZSgpLmdldCk7XHJcbiAgfVxyXG4gIHJldHVybiBsZWZ0O1xyXG59XHJcblxyXG5vcC5yYW5nZSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxlZnQgPSB0aGlzLnVuYXJ5KCksIGxsLCByaWdodDtcclxuXHJcbiAgaWYobGwgPSB0aGlzLmVhdCgnLi4nKSl7XHJcbiAgICByaWdodCA9IHRoaXMudW5hcnkoKTtcclxuICAgIHZhciBib2R5ID0gXHJcbiAgICAgIFwiKGZ1bmN0aW9uKHN0YXJ0LGVuZCl7dmFyIHJlcyA9IFtdLHN0ZXA9ZW5kPnN0YXJ0PzE6LTE7IGZvcih2YXIgaSA9IHN0YXJ0OyBlbmQ+c3RhcnQ/aSA8PSBlbmQ6IGk+PWVuZDsgaT1pK3N0ZXApe3Jlcy5wdXNoKGkpOyB9IHJldHVybiByZXMgfSkoXCIrbGVmdC5nZXQrXCIsXCIrcmlnaHQuZ2V0K1wiKVwiXHJcbiAgICByZXR1cm4gZ2V0c2V0KGJvZHkpO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGxlZnQ7XHJcbn1cclxuXHJcblxyXG5cclxuLy8gbGVmdGhhbmRcclxuLy8gKyB1bmFyeVxyXG4vLyAtIHVuYXJ5XHJcbi8vIH4gdW5hcnlcclxuLy8gISB1bmFyeVxyXG5vcC51bmFyeSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGxsO1xyXG4gIGlmKGxsID0gdGhpcy5lYXQoWycrJywnLScsJ34nLCAnISddKSl7XHJcbiAgICByZXR1cm4gZ2V0c2V0KCcoJyArIGxsLnR5cGUgKyB0aGlzLnVuYXJ5KCkuZ2V0ICsgJyknKSA7XHJcbiAgfWVsc2V7XHJcbiAgICByZXR1cm4gdGhpcy5tZW1iZXIoKVxyXG4gIH1cclxufVxyXG5cclxuLy8gY2FsbFtsZWZ0aGFuZF0gOlxyXG4vLyBtZW1iZXIgYXJnc1xyXG4vLyBtZW1iZXIgWyBleHByZXNzaW9uIF1cclxuLy8gbWVtYmVyIC4gaWRlbnQgIFxyXG5cclxub3AubWVtYmVyID0gZnVuY3Rpb24oYmFzZSwgbGFzdCwgcGF0aGVzLCBwcmV2QmFzZSl7XHJcbiAgdmFyIGxsLCBwYXRoLCBleHRWYWx1ZTtcclxuXHJcblxyXG4gIHZhciBvbmx5U2ltcGxlQWNjZXNzb3IgPSBmYWxzZTtcclxuICBpZighYmFzZSl7IC8vZmlyc3RcclxuICAgIHBhdGggPSB0aGlzLnByaW1hcnkoKTtcclxuICAgIHZhciB0eXBlID0gdHlwZW9mIHBhdGg7XHJcbiAgICBpZih0eXBlID09PSAnc3RyaW5nJyl7IFxyXG4gICAgICBwYXRoZXMgPSBbXTtcclxuICAgICAgcGF0aGVzLnB1c2goIHBhdGggKTtcclxuICAgICAgbGFzdCA9IHBhdGg7XHJcbiAgICAgIGV4dFZhbHVlID0gZXh0TmFtZSArIFwiLlwiICsgcGF0aFxyXG4gICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oJ1wiICsgcGF0aCArIFwiJywgXCIgKyB2YXJOYW1lICsgXCIsIFwiICsgZXh0TmFtZSArIFwiKVwiO1xyXG4gICAgICBvbmx5U2ltcGxlQWNjZXNzb3IgPSB0cnVlO1xyXG4gICAgfWVsc2V7IC8vUHJpbWF0aXZlIFR5cGVcclxuICAgICAgaWYocGF0aC5nZXQgPT09ICd0aGlzJyl7XHJcbiAgICAgICAgYmFzZSA9IGN0eE5hbWU7XHJcbiAgICAgICAgcGF0aGVzID0gWyd0aGlzJ107XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHBhdGhlcyA9IG51bGw7XHJcbiAgICAgICAgYmFzZSA9IHBhdGguZ2V0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfWVsc2V7IC8vIG5vdCBmaXJzdCBlbnRlclxyXG4gICAgaWYodHlwZW9mIGxhc3QgPT09ICdzdHJpbmcnICYmIGlzUGF0aCggbGFzdCkgKXsgLy8gaXMgdmFsaWQgcGF0aFxyXG4gICAgICBwYXRoZXMucHVzaChsYXN0KTtcclxuICAgIH1lbHNle1xyXG4gICAgICBpZihwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCkgdGhpcy5kZXBlbmQucHVzaChwYXRoZXMpO1xyXG4gICAgICBwYXRoZXMgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuICBpZihsbCA9IHRoaXMuZWF0KFsnWycsICcuJywgJygnXSkpe1xyXG4gICAgc3dpdGNoKGxsLnR5cGUpe1xyXG4gICAgICBjYXNlICcuJzpcclxuICAgICAgICAgIC8vIG1lbWJlcihvYmplY3QsIHByb3BlcnR5LCBjb21wdXRlZClcclxuICAgICAgICB2YXIgdG1wTmFtZSA9IHRoaXMubWF0Y2goJ0lERU5UJykudmFsdWU7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgICAgYmFzZSA9IGN0eE5hbWUgKyBcIi5fc2dfKCdcIiArIHRtcE5hbWUgKyBcIicsIFwiICsgYmFzZSArIFwiKVwiO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgYmFzZSArPSBcIlsnXCIgKyB0bXBOYW1lICsgXCInXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoIGJhc2UsIHRtcE5hbWUsIHBhdGhlcywgIHByZXZCYXNlKTtcclxuICAgICAgY2FzZSAnWyc6XHJcbiAgICAgICAgICAvLyBtZW1iZXIob2JqZWN0LCBwcm9wZXJ0eSwgY29tcHV0ZWQpXHJcbiAgICAgICAgcGF0aCA9IHRoaXMuYXNzaWduKCk7XHJcbiAgICAgICAgcHJldkJhc2UgPSBiYXNlO1xyXG4gICAgICAgIGlmKCB0aGlzLmxhKCkgIT09IFwiKFwiICl7IFxyXG4gICAgICAgIC8vIG1lYW5zIGZ1bmN0aW9uIGNhbGwsIHdlIG5lZWQgdGhyb3cgdW5kZWZpbmVkIGVycm9yIHdoZW4gY2FsbCBmdW5jdGlvblxyXG4gICAgICAgIC8vIGFuZCBjb25maXJtIHRoYXQgdGhlIGZ1bmN0aW9uIGNhbGwgd29udCBsb3NlIGl0cyBjb250ZXh0XHJcbiAgICAgICAgICBiYXNlID0gY3R4TmFtZSArIFwiLl9zZ18oXCIgKyBwYXRoLmdldCArIFwiLCBcIiArIGJhc2UgKyBcIilcIjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgIGJhc2UgKz0gXCJbXCIgKyBwYXRoLmdldCArIFwiXVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1hdGNoKCddJylcclxuICAgICAgICByZXR1cm4gdGhpcy5tZW1iZXIoYmFzZSwgcGF0aCwgcGF0aGVzLCBwcmV2QmFzZSk7XHJcbiAgICAgIGNhc2UgJygnOlxyXG4gICAgICAgIC8vIGNhbGwoY2FsbGVlLCBhcmdzKVxyXG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5hcmd1bWVudHMoKS5qb2luKCcsJyk7XHJcbiAgICAgICAgYmFzZSA9ICBiYXNlK1wiKFwiICsgYXJncyArXCIpXCI7XHJcbiAgICAgICAgdGhpcy5tYXRjaCgnKScpXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWVtYmVyKGJhc2UsIG51bGwsIHBhdGhlcyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCBwYXRoZXMgJiYgcGF0aGVzLmxlbmd0aCApIHRoaXMuZGVwZW5kLnB1c2goIHBhdGhlcyApO1xyXG4gIHZhciByZXMgPSAge2dldDogYmFzZX07XHJcbiAgaWYobGFzdCl7XHJcbiAgICByZXMuc2V0ID0gY3R4TmFtZSArIFwiLl9zc18oXCIgKyBcclxuICAgICAgICAobGFzdC5nZXQ/IGxhc3QuZ2V0IDogXCInXCIrIGxhc3QgKyBcIidcIikgKyBcclxuICAgICAgICBcIixcIisgXy5zZXROYW1lICsgXCIsXCIrIFxyXG4gICAgICAgIChwcmV2QmFzZT9wcmV2QmFzZTpfLnZhck5hbWUpICsgXHJcbiAgICAgICAgXCIsICc9JywgXCIrICggb25seVNpbXBsZUFjY2Vzc29yPyAxIDogMCApICsgXCIpXCI7XHJcbiAgXHJcbiAgfVxyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBcclxuICovXHJcbm9wLmFyZ3VtZW50cyA9IGZ1bmN0aW9uKGVuZCl7XHJcbiAgZW5kID0gZW5kIHx8ICcpJ1xyXG4gIHZhciBhcmdzID0gW107XHJcbiAgZG97XHJcbiAgICBpZih0aGlzLmxhKCkgIT09IGVuZCl7XHJcbiAgICAgIGFyZ3MucHVzaCh0aGlzLmFzc2lnbigpLmdldClcclxuICAgIH1cclxuICB9d2hpbGUoIHRoaXMuZWF0KCcsJykpO1xyXG4gIHJldHVybiBhcmdzXHJcbn1cclxuXHJcblxyXG4vLyBwcmltYXJ5IDpcclxuLy8gdGhpcyBcclxuLy8gaWRlbnRcclxuLy8gbGl0ZXJhbFxyXG4vLyBhcnJheVxyXG4vLyBvYmplY3RcclxuLy8gKCBleHByZXNzaW9uIClcclxuXHJcbm9wLnByaW1hcnkgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBsbCA9IHRoaXMubGwoKTtcclxuICBzd2l0Y2gobGwudHlwZSl7XHJcbiAgICBjYXNlIFwie1wiOlxyXG4gICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcclxuICAgIGNhc2UgXCJbXCI6XHJcbiAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XHJcbiAgICBjYXNlIFwiKFwiOlxyXG4gICAgICByZXR1cm4gdGhpcy5wYXJlbigpO1xyXG4gICAgLy8gbGl0ZXJhbCBvciBpZGVudFxyXG4gICAgY2FzZSAnU1RSSU5HJzpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIHZhciB2YWx1ZSA9IFwiXCIgKyBsbC52YWx1ZTtcclxuICAgICAgdmFyIHF1b3RhID0gfnZhbHVlLmluZGV4T2YoXCInXCIpPyBcIlxcXCJcIjogXCInXCIgO1xyXG4gICAgICByZXR1cm4gZ2V0c2V0KHF1b3RhICsgdmFsdWUgKyBxdW90YSk7XHJcbiAgICBjYXNlICdOVU1CRVInOlxyXG4gICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgcmV0dXJuIGdldHNldCggXCJcIiArIGxsLnZhbHVlICk7XHJcbiAgICBjYXNlIFwiSURFTlRcIjpcclxuICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgIGlmKGlzS2V5V29yZChsbC52YWx1ZSkpe1xyXG4gICAgICAgIHJldHVybiBnZXRzZXQoIGxsLnZhbHVlICk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGxsLnZhbHVlO1xyXG4gICAgZGVmYXVsdDogXHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgVG9rZW46ICcgKyBsbC50eXBlKTtcclxuICB9XHJcbn1cclxuXHJcbi8vIG9iamVjdFxyXG4vLyAge3Byb3BBc3NpZ24gWywgcHJvcEFzc2lnbl0gKiBbLF19XHJcblxyXG4vLyBwcm9wQXNzaWduXHJcbi8vICBwcm9wIDogYXNzaWduXHJcblxyXG4vLyBwcm9wXHJcbi8vICBTVFJJTkdcclxuLy8gIElERU5UXHJcbi8vICBOVU1CRVJcclxuXHJcbm9wLm9iamVjdCA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgneycpLnR5cGVdO1xyXG5cclxuICB2YXIgbGwgPSB0aGlzLmVhdCggWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10gKTtcclxuICB3aGlsZShsbCl7XHJcbiAgICBjb2RlLnB1c2goXCInXCIgKyBsbC52YWx1ZSArIFwiJ1wiICsgdGhpcy5tYXRjaCgnOicpLnR5cGUpO1xyXG4gICAgdmFyIGdldCA9IHRoaXMuYXNzaWduKCkuZ2V0O1xyXG4gICAgY29kZS5wdXNoKGdldCk7XHJcbiAgICBsbCA9IG51bGw7XHJcbiAgICBpZih0aGlzLmVhdChcIixcIikgJiYgKGxsID0gdGhpcy5lYXQoWydTVFJJTkcnLCAnSURFTlQnLCAnTlVNQkVSJ10pKSApIGNvZGUucHVzaChcIixcIik7XHJcbiAgfVxyXG4gIGNvZGUucHVzaCh0aGlzLm1hdGNoKCd9JykudHlwZSk7XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX1cclxufVxyXG5cclxuLy8gYXJyYXlcclxuLy8gWyBhc3NpZ25bLGFzc2lnbl0qXVxyXG5vcC5hcnJheSA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGNvZGUgPSBbdGhpcy5tYXRjaCgnWycpLnR5cGVdLCBpdGVtO1xyXG4gIGlmKCB0aGlzLmVhdChcIl1cIikgKXtcclxuXHJcbiAgICAgY29kZS5wdXNoKFwiXVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd2hpbGUoaXRlbSA9IHRoaXMuYXNzaWduKCkpe1xyXG4gICAgICBjb2RlLnB1c2goaXRlbS5nZXQpO1xyXG4gICAgICBpZih0aGlzLmVhdCgnLCcpKSBjb2RlLnB1c2goXCIsXCIpO1xyXG4gICAgICBlbHNlIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgY29kZS5wdXNoKHRoaXMubWF0Y2goJ10nKS50eXBlKTtcclxuICB9XHJcbiAgcmV0dXJuIHtnZXQ6IGNvZGUuam9pbihcIlwiKX07XHJcbn1cclxuXHJcbi8vICcoJyBleHByZXNzaW9uICcpJ1xyXG5vcC5wYXJlbiA9IGZ1bmN0aW9uKCl7XHJcbiAgdGhpcy5tYXRjaCgnKCcpO1xyXG4gIHZhciByZXMgPSB0aGlzLmZpbHRlcigpXHJcbiAgcmVzLmdldCA9ICcoJyArIHJlcy5nZXQgKyAnKSc7XHJcbiAgcmVzLnNldCA9IHJlcy5zZXQ7XHJcbiAgdGhpcy5tYXRjaCgnKScpO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldHNldChnZXQsIHNldCl7XHJcbiAgcmV0dXJuIHtcclxuICAgIGdldDogZ2V0LFxyXG4gICAgc2V0OiBzZXRcclxuICB9XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQYXJzZXI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9QYXJzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgYXBwbHkgPSBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHk7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7XG4gIGlmICh0aW1lb3V0KSB7XG4gICAgdGltZW91dC5jbG9zZSgpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBUaW1lb3V0KGlkLCBjbGVhckZuKSB7XG4gIHRoaXMuX2lkID0gaWQ7XG4gIHRoaXMuX2NsZWFyRm4gPSBjbGVhckZuO1xufVxuVGltZW91dC5wcm90b3R5cGUudW5yZWYgPSBUaW1lb3V0LnByb3RvdHlwZS5yZWYgPSBmdW5jdGlvbigpIHt9O1xuVGltZW91dC5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5fY2xlYXJGbi5jYWxsKHdpbmRvdywgdGhpcy5faWQpO1xufTtcblxuLy8gRG9lcyBub3Qgc3RhcnQgdGhlIHRpbWUsIGp1c3Qgc2V0cyB1cCB0aGUgbWVtYmVycyBuZWVkZWQuXG5leHBvcnRzLmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0sIG1zZWNzKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSBtc2Vjcztcbn07XG5cbmV4cG9ydHMudW5lbnJvbGwgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcbiAgaXRlbS5faWRsZVRpbWVvdXQgPSAtMTtcbn07XG5cbmV4cG9ydHMuX3VucmVmQWN0aXZlID0gZXhwb3J0cy5hY3RpdmUgPSBmdW5jdGlvbihpdGVtKSB7XG4gIGNsZWFyVGltZW91dChpdGVtLl9pZGxlVGltZW91dElkKTtcblxuICB2YXIgbXNlY3MgPSBpdGVtLl9pZGxlVGltZW91dDtcbiAgaWYgKG1zZWNzID49IDApIHtcbiAgICBpdGVtLl9pZGxlVGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiBvblRpbWVvdXQoKSB7XG4gICAgICBpZiAoaXRlbS5fb25UaW1lb3V0KVxuICAgICAgICBpdGVtLl9vblRpbWVvdXQoKTtcbiAgICB9LCBtc2Vjcyk7XG4gIH1cbn07XG5cbi8vIHNldGltbWVkaWF0ZSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIGdsb2JhbCBvYmplY3RcbnJlcXVpcmUoXCJzZXRpbW1lZGlhdGVcIik7XG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSBjbGVhckltbWVkaWF0ZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzLy4yLjAuNEB0aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiKGZ1bmN0aW9uIChnbG9iYWwsIHVuZGVmaW5lZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKGdsb2JhbC5zZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBuZXh0SGFuZGxlID0gMTsgLy8gU3BlYyBzYXlzIGdyZWF0ZXIgdGhhbiB6ZXJvXG4gICAgdmFyIHRhc2tzQnlIYW5kbGUgPSB7fTtcbiAgICB2YXIgY3VycmVudGx5UnVubmluZ0FUYXNrID0gZmFsc2U7XG4gICAgdmFyIGRvYyA9IGdsb2JhbC5kb2N1bWVudDtcbiAgICB2YXIgcmVnaXN0ZXJJbW1lZGlhdGU7XG5cbiAgICBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoY2FsbGJhY2spIHtcbiAgICAgIC8vIENhbGxiYWNrIGNhbiBlaXRoZXIgYmUgYSBmdW5jdGlvbiBvciBhIHN0cmluZ1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNhbGxiYWNrID0gbmV3IEZ1bmN0aW9uKFwiXCIgKyBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgICAvLyBDb3B5IGZ1bmN0aW9uIGFyZ3VtZW50c1xuICAgICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV07XG4gICAgICB9XG4gICAgICAvLyBTdG9yZSBhbmQgcmVnaXN0ZXIgdGhlIHRhc2tcbiAgICAgIHZhciB0YXNrID0geyBjYWxsYmFjazogY2FsbGJhY2ssIGFyZ3M6IGFyZ3MgfTtcbiAgICAgIHRhc2tzQnlIYW5kbGVbbmV4dEhhbmRsZV0gPSB0YXNrO1xuICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUobmV4dEhhbmRsZSk7XG4gICAgICByZXR1cm4gbmV4dEhhbmRsZSsrO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGhhbmRsZSkge1xuICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZVtoYW5kbGVdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bih0YXNrKSB7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIHZhciBhcmdzID0gdGFzay5hcmdzO1xuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgY2FsbGJhY2soYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJ1bklmUHJlc2VudChoYW5kbGUpIHtcbiAgICAgICAgLy8gRnJvbSB0aGUgc3BlYzogXCJXYWl0IHVudGlsIGFueSBpbnZvY2F0aW9ucyBvZiB0aGlzIGFsZ29yaXRobSBzdGFydGVkIGJlZm9yZSB0aGlzIG9uZSBoYXZlIGNvbXBsZXRlZC5cIlxuICAgICAgICAvLyBTbyBpZiB3ZSdyZSBjdXJyZW50bHkgcnVubmluZyBhIHRhc2ssIHdlJ2xsIG5lZWQgdG8gZGVsYXkgdGhpcyBpbnZvY2F0aW9uLlxuICAgICAgICBpZiAoY3VycmVudGx5UnVubmluZ0FUYXNrKSB7XG4gICAgICAgICAgICAvLyBEZWxheSBieSBkb2luZyBhIHNldFRpbWVvdXQuIHNldEltbWVkaWF0ZSB3YXMgdHJpZWQgaW5zdGVhZCwgYnV0IGluIEZpcmVmb3ggNyBpdCBnZW5lcmF0ZWQgYVxuICAgICAgICAgICAgLy8gXCJ0b28gbXVjaCByZWN1cnNpb25cIiBlcnJvci5cbiAgICAgICAgICAgIHNldFRpbWVvdXQocnVuSWZQcmVzZW50LCAwLCBoYW5kbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHRhc2sgPSB0YXNrc0J5SGFuZGxlW2hhbmRsZV07XG4gICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IHRydWU7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcnVuKHRhc2spO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW1tZWRpYXRlKGhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRseVJ1bm5pbmdBVGFzayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluc3RhbGxOZXh0VGlja0ltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7IHJ1bklmUHJlc2VudChoYW5kbGUpOyB9KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjYW5Vc2VQb3N0TWVzc2FnZSgpIHtcbiAgICAgICAgLy8gVGhlIHRlc3QgYWdhaW5zdCBgaW1wb3J0U2NyaXB0c2AgcHJldmVudHMgdGhpcyBpbXBsZW1lbnRhdGlvbiBmcm9tIGJlaW5nIGluc3RhbGxlZCBpbnNpZGUgYSB3ZWIgd29ya2VyLFxuICAgICAgICAvLyB3aGVyZSBgZ2xvYmFsLnBvc3RNZXNzYWdlYCBtZWFucyBzb21ldGhpbmcgY29tcGxldGVseSBkaWZmZXJlbnQgYW5kIGNhbid0IGJlIHVzZWQgZm9yIHRoaXMgcHVycG9zZS5cbiAgICAgICAgaWYgKGdsb2JhbC5wb3N0TWVzc2FnZSAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICAgICAgICAgIHZhciBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBvbGRPbk1lc3NhZ2UgPSBnbG9iYWwub25tZXNzYWdlO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHBvc3RNZXNzYWdlSXNBc3luY2hyb25vdXMgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoXCJcIiwgXCIqXCIpO1xuICAgICAgICAgICAgZ2xvYmFsLm9ubWVzc2FnZSA9IG9sZE9uTWVzc2FnZTtcbiAgICAgICAgICAgIHJldHVybiBwb3N0TWVzc2FnZUlzQXN5bmNocm9ub3VzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIC8vIEluc3RhbGxzIGFuIGV2ZW50IGhhbmRsZXIgb24gYGdsb2JhbGAgZm9yIHRoZSBgbWVzc2FnZWAgZXZlbnQ6IHNlZVxuICAgICAgICAvLyAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0RPTS93aW5kb3cucG9zdE1lc3NhZ2VcbiAgICAgICAgLy8gKiBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS9jb21tcy5odG1sI2Nyb3NzRG9jdW1lbnRNZXNzYWdlc1xuXG4gICAgICAgIHZhciBtZXNzYWdlUHJlZml4ID0gXCJzZXRJbW1lZGlhdGUkXCIgKyBNYXRoLnJhbmRvbSgpICsgXCIkXCI7XG4gICAgICAgIHZhciBvbkdsb2JhbE1lc3NhZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnNvdXJjZSA9PT0gZ2xvYmFsICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50LmRhdGEgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICBldmVudC5kYXRhLmluZGV4T2YobWVzc2FnZVByZWZpeCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBydW5JZlByZXNlbnQoK2V2ZW50LmRhdGEuc2xpY2UobWVzc2FnZVByZWZpeC5sZW5ndGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UsIGZhbHNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdsb2JhbC5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBvbkdsb2JhbE1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShtZXNzYWdlUHJlZml4ICsgaGFuZGxlLCBcIipcIik7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5zdGFsbE1lc3NhZ2VDaGFubmVsSW1wbGVtZW50YXRpb24oKSB7XG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBoYW5kbGUgPSBldmVudC5kYXRhO1xuICAgICAgICAgICAgcnVuSWZQcmVzZW50KGhhbmRsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmVnaXN0ZXJJbW1lZGlhdGUgPSBmdW5jdGlvbihoYW5kbGUpIHtcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2UoaGFuZGxlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICB2YXIgaHRtbCA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHJlZ2lzdGVySW1tZWRpYXRlID0gZnVuY3Rpb24oaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSA8c2NyaXB0PiBlbGVtZW50OyBpdHMgcmVhZHlzdGF0ZWNoYW5nZSBldmVudCB3aWxsIGJlIGZpcmVkIGFzeW5jaHJvbm91c2x5IG9uY2UgaXQgaXMgaW5zZXJ0ZWRcbiAgICAgICAgICAgIC8vIGludG8gdGhlIGRvY3VtZW50LiBEbyBzbywgdGh1cyBxdWV1aW5nIHVwIHRoZSB0YXNrLiBSZW1lbWJlciB0byBjbGVhbiB1cCBvbmNlIGl0J3MgYmVlbiBjYWxsZWQuXG4gICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICAgICAgICBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJ1bklmUHJlc2VudChoYW5kbGUpO1xuICAgICAgICAgICAgICAgIHNjcmlwdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgICBzY3JpcHQgPSBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbnN0YWxsU2V0VGltZW91dEltcGxlbWVudGF0aW9uKCkge1xuICAgICAgICByZWdpc3RlckltbWVkaWF0ZSA9IGZ1bmN0aW9uKGhhbmRsZSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChydW5JZlByZXNlbnQsIDAsIGhhbmRsZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gSWYgc3VwcG9ydGVkLCB3ZSBzaG91bGQgYXR0YWNoIHRvIHRoZSBwcm90b3R5cGUgb2YgZ2xvYmFsLCBzaW5jZSB0aGF0IGlzIHdoZXJlIHNldFRpbWVvdXQgZXQgYWwuIGxpdmUuXG4gICAgdmFyIGF0dGFjaFRvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWwpO1xuICAgIGF0dGFjaFRvID0gYXR0YWNoVG8gJiYgYXR0YWNoVG8uc2V0VGltZW91dCA/IGF0dGFjaFRvIDogZ2xvYmFsO1xuXG4gICAgLy8gRG9uJ3QgZ2V0IGZvb2xlZCBieSBlLmcuIGJyb3dzZXJpZnkgZW52aXJvbm1lbnRzLlxuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGdsb2JhbC5wcm9jZXNzKSA9PT0gXCJbb2JqZWN0IHByb2Nlc3NdXCIpIHtcbiAgICAgICAgLy8gRm9yIE5vZGUuanMgYmVmb3JlIDAuOVxuICAgICAgICBpbnN0YWxsTmV4dFRpY2tJbXBsZW1lbnRhdGlvbigpO1xuXG4gICAgfSBlbHNlIGlmIChjYW5Vc2VQb3N0TWVzc2FnZSgpKSB7XG4gICAgICAgIC8vIEZvciBub24tSUUxMCBtb2Rlcm4gYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFBvc3RNZXNzYWdlSW1wbGVtZW50YXRpb24oKTtcblxuICAgIH0gZWxzZSBpZiAoZ2xvYmFsLk1lc3NhZ2VDaGFubmVsKSB7XG4gICAgICAgIC8vIEZvciB3ZWIgd29ya2Vycywgd2hlcmUgc3VwcG9ydGVkXG4gICAgICAgIGluc3RhbGxNZXNzYWdlQ2hhbm5lbEltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2UgaWYgKGRvYyAmJiBcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiIGluIGRvYy5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpKSB7XG4gICAgICAgIC8vIEZvciBJRSA24oCTOFxuICAgICAgICBpbnN0YWxsUmVhZHlTdGF0ZUNoYW5nZUltcGxlbWVudGF0aW9uKCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3Igb2xkZXIgYnJvd3NlcnNcbiAgICAgICAgaW5zdGFsbFNldFRpbWVvdXRJbXBsZW1lbnRhdGlvbigpO1xuICAgIH1cblxuICAgIGF0dGFjaFRvLnNldEltbWVkaWF0ZSA9IHNldEltbWVkaWF0ZTtcbiAgICBhdHRhY2hUby5jbGVhckltbWVkaWF0ZSA9IGNsZWFySW1tZWRpYXRlO1xufSh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIiA/IHR5cGVvZiBnbG9iYWwgPT09IFwidW5kZWZpbmVkXCIgPyB0aGlzIDogZ2xvYmFsIDogc2VsZikpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvLjEuMC41QHNldGltbWVkaWF0ZS9zZXRJbW1lZGlhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuZnVuY3Rpb24gZGVmYXVsdFNldFRpbW91dCgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRDbGVhclRpbWVvdXQgKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2xlYXJUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG4oZnVuY3Rpb24gKCkge1xuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0VGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2xlYXJUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBkZWZhdWx0Q2xlYXJUaW1lb3V0O1xuICAgIH1cbn0gKCkpXG5mdW5jdGlvbiBydW5UaW1lb3V0KGZ1bikge1xuICAgIGlmIChjYWNoZWRTZXRUaW1lb3V0ID09PSBzZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICAvLyBpZiBzZXRUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkU2V0VGltZW91dCA9PT0gZGVmYXVsdFNldFRpbW91dCB8fCAhY2FjaGVkU2V0VGltZW91dCkgJiYgc2V0VGltZW91dCkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dChmdW4sIDApO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwobnVsbCwgZnVuLCAwKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yXG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKHRoaXMsIGZ1biwgMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuZnVuY3Rpb24gcnVuQ2xlYXJUaW1lb3V0KG1hcmtlcikge1xuICAgIGlmIChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGNsZWFyVGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICAvLyBpZiBjbGVhclRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRDbGVhclRpbWVvdXQgPT09IGRlZmF1bHRDbGVhclRpbWVvdXQgfHwgIWNhY2hlZENsZWFyVGltZW91dCkgJiYgY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgcmV0dXJuIGNsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCAgdHJ1c3QgdGhlIGdsb2JhbCBvYmplY3Qgd2hlbiBjYWxsZWQgbm9ybWFsbHlcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbChudWxsLCBtYXJrZXIpO1xuICAgICAgICB9IGNhdGNoIChlKXtcbiAgICAgICAgICAgIC8vIHNhbWUgYXMgYWJvdmUgYnV0IHdoZW4gaXQncyBhIHZlcnNpb24gb2YgSS5FLiB0aGF0IG11c3QgaGF2ZSB0aGUgZ2xvYmFsIG9iamVjdCBmb3IgJ3RoaXMnLCBob3BmdWxseSBvdXIgY29udGV4dCBjb3JyZWN0IG90aGVyd2lzZSBpdCB3aWxsIHRocm93IGEgZ2xvYmFsIGVycm9yLlxuICAgICAgICAgICAgLy8gU29tZSB2ZXJzaW9ucyBvZiBJLkUuIGhhdmUgZGlmZmVyZW50IHJ1bGVzIGZvciBjbGVhclRpbWVvdXQgdnMgc2V0VGltZW91dFxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKHRoaXMsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG59XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBpZiAoIWRyYWluaW5nIHx8ICFjdXJyZW50UXVldWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBydW5UaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBydW5DbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBydW5UaW1lb3V0KGRyYWluUXVldWUpO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnByZXBlbmRPbmNlTGlzdGVuZXIgPSBub29wO1xuXG5wcm9jZXNzLmxpc3RlbmVycyA9IGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBbXSB9XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvLjAuMTEuMTBAcHJvY2Vzcy9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gc2hpbSBmb3IgZXM1XHJcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xyXG52YXIgdHN0ciA9ICh7fSkudG9TdHJpbmc7XHJcblxyXG5mdW5jdGlvbiBleHRlbmQobzEsIG8yICl7XHJcbiAgZm9yKHZhciBpIGluIG8yKSBpZiggbzFbaV0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICBvMVtpXSA9IG8yW2ldXHJcbiAgfVxyXG4gIHJldHVybiBvMjtcclxufVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuICAvLyBTdHJpbmcgcHJvdG8gO1xyXG4gIGV4dGVuZChTdHJpbmcucHJvdG90eXBlLCB7XHJcbiAgICB0cmltOiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICAvLyBBcnJheSBwcm90bztcclxuICBleHRlbmQoQXJyYXkucHJvdG90eXBlLCB7XHJcbiAgICBpbmRleE9mOiBmdW5jdGlvbihvYmosIGZyb20pe1xyXG4gICAgICBmcm9tID0gZnJvbSB8fCAwO1xyXG4gICAgICBmb3IgKHZhciBpID0gZnJvbSwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgIGlmICh0aGlzW2ldID09PSBvYmopIHJldHVybiBpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH0sXHJcbiAgICAvLyBwb2x5ZmlsbCBmcm9tIE1ETiBcclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3poLUNOL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2ZvckVhY2hcclxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrLCBjdHgpe1xyXG4gICAgICB2YXIgayA9IDA7XHJcblxyXG4gICAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZyB0aGUgfHRoaXN8IHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cclxuICAgICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7IFxyXG5cclxuICAgICAgaWYgKCB0eXBlb2YgY2FsbGJhY2sgIT09IFwiZnVuY3Rpb25cIiApIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCBjYWxsYmFjayArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gNy4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICAgIHdoaWxlKCBrIDwgbGVuICkge1xyXG5cclxuICAgICAgICB2YXIga1ZhbHVlO1xyXG5cclxuICAgICAgICBpZiAoIGsgaW4gTyApIHtcclxuXHJcbiAgICAgICAgICBrVmFsdWUgPSBPWyBrIF07XHJcblxyXG4gICAgICAgICAgY2FsbGJhY2suY2FsbCggY3R4LCBrVmFsdWUsIGssIE8gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaysrO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gQGRlcHJlY2F0ZWRcclxuICAgIC8vICB3aWxsIGJlIHJlbW92ZWQgYXQgMC41LjBcclxuICAgIGZpbHRlcjogZnVuY3Rpb24oZnVuLCBjb250ZXh0KXtcclxuXHJcbiAgICAgIHZhciB0ID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgICB2YXIgbGVuID0gdC5sZW5ndGggPj4+IDA7XHJcbiAgICAgIGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xyXG5cclxuICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKGkgaW4gdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICB2YXIgdmFsID0gdFtpXTtcclxuICAgICAgICAgIGlmIChmdW4uY2FsbChjb250ZXh0LCB2YWwsIGksIHQpKVxyXG4gICAgICAgICAgICByZXMucHVzaCh2YWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHJlcztcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gRnVuY3Rpb24gcHJvdG87XHJcbiAgZXh0ZW5kKEZ1bmN0aW9uLnByb3RvdHlwZSwge1xyXG4gICAgYmluZDogZnVuY3Rpb24oY29udGV4dCl7XHJcbiAgICAgIHZhciBmbiA9IHRoaXM7XHJcbiAgICAgIHZhciBwcmVBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgYXJncyA9IHByZUFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XHJcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSlcclxuICBcclxuICAvLyBBcnJheVxyXG4gIGV4dGVuZChBcnJheSwge1xyXG4gICAgaXNBcnJheTogZnVuY3Rpb24oYXJyKXtcclxuICAgICAgcmV0dXJuIHRzdHIuY2FsbChhcnIpID09PSBcIltvYmplY3QgQXJyYXldXCI7XHJcbiAgICB9XHJcbiAgfSlcclxufVxyXG5cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL2hlbHBlci9zaGltLmpzXG4vLyBtb2R1bGUgaWQgPSAxMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTM1NDA2NC9ob3ctdG8tY29udmVydC1jaGFyYWN0ZXJzLXRvLWh0bWwtZW50aXRpZXMtdXNpbmctcGxhaW4tamF2YXNjcmlwdFxyXG52YXIgZW50aXRpZXMgPSB7XHJcbiAgJ3F1b3QnOjM0LCBcclxuICAnYW1wJzozOCwgXHJcbiAgJ2Fwb3MnOjM5LCBcclxuICAnbHQnOjYwLCBcclxuICAnZ3QnOjYyLCBcclxuICAnbmJzcCc6MTYwLCBcclxuICAnaWV4Y2wnOjE2MSwgXHJcbiAgJ2NlbnQnOjE2MiwgXHJcbiAgJ3BvdW5kJzoxNjMsIFxyXG4gICdjdXJyZW4nOjE2NCwgXHJcbiAgJ3llbic6MTY1LCBcclxuICAnYnJ2YmFyJzoxNjYsIFxyXG4gICdzZWN0JzoxNjcsIFxyXG4gICd1bWwnOjE2OCwgXHJcbiAgJ2NvcHknOjE2OSwgXHJcbiAgJ29yZGYnOjE3MCwgXHJcbiAgJ2xhcXVvJzoxNzEsIFxyXG4gICdub3QnOjE3MiwgXHJcbiAgJ3NoeSc6MTczLCBcclxuICAncmVnJzoxNzQsIFxyXG4gICdtYWNyJzoxNzUsIFxyXG4gICdkZWcnOjE3NiwgXHJcbiAgJ3BsdXNtbic6MTc3LCBcclxuICAnc3VwMic6MTc4LCBcclxuICAnc3VwMyc6MTc5LCBcclxuICAnYWN1dGUnOjE4MCwgXHJcbiAgJ21pY3JvJzoxODEsIFxyXG4gICdwYXJhJzoxODIsIFxyXG4gICdtaWRkb3QnOjE4MywgXHJcbiAgJ2NlZGlsJzoxODQsIFxyXG4gICdzdXAxJzoxODUsIFxyXG4gICdvcmRtJzoxODYsIFxyXG4gICdyYXF1byc6MTg3LCBcclxuICAnZnJhYzE0JzoxODgsIFxyXG4gICdmcmFjMTInOjE4OSwgXHJcbiAgJ2ZyYWMzNCc6MTkwLCBcclxuICAnaXF1ZXN0JzoxOTEsIFxyXG4gICdBZ3JhdmUnOjE5MiwgXHJcbiAgJ0FhY3V0ZSc6MTkzLCBcclxuICAnQWNpcmMnOjE5NCwgXHJcbiAgJ0F0aWxkZSc6MTk1LCBcclxuICAnQXVtbCc6MTk2LCBcclxuICAnQXJpbmcnOjE5NywgXHJcbiAgJ0FFbGlnJzoxOTgsIFxyXG4gICdDY2VkaWwnOjE5OSwgXHJcbiAgJ0VncmF2ZSc6MjAwLCBcclxuICAnRWFjdXRlJzoyMDEsIFxyXG4gICdFY2lyYyc6MjAyLCBcclxuICAnRXVtbCc6MjAzLCBcclxuICAnSWdyYXZlJzoyMDQsIFxyXG4gICdJYWN1dGUnOjIwNSwgXHJcbiAgJ0ljaXJjJzoyMDYsIFxyXG4gICdJdW1sJzoyMDcsIFxyXG4gICdFVEgnOjIwOCwgXHJcbiAgJ050aWxkZSc6MjA5LCBcclxuICAnT2dyYXZlJzoyMTAsIFxyXG4gICdPYWN1dGUnOjIxMSwgXHJcbiAgJ09jaXJjJzoyMTIsIFxyXG4gICdPdGlsZGUnOjIxMywgXHJcbiAgJ091bWwnOjIxNCwgXHJcbiAgJ3RpbWVzJzoyMTUsIFxyXG4gICdPc2xhc2gnOjIxNiwgXHJcbiAgJ1VncmF2ZSc6MjE3LCBcclxuICAnVWFjdXRlJzoyMTgsIFxyXG4gICdVY2lyYyc6MjE5LCBcclxuICAnVXVtbCc6MjIwLCBcclxuICAnWWFjdXRlJzoyMjEsIFxyXG4gICdUSE9STic6MjIyLCBcclxuICAnc3psaWcnOjIyMywgXHJcbiAgJ2FncmF2ZSc6MjI0LCBcclxuICAnYWFjdXRlJzoyMjUsIFxyXG4gICdhY2lyYyc6MjI2LCBcclxuICAnYXRpbGRlJzoyMjcsIFxyXG4gICdhdW1sJzoyMjgsIFxyXG4gICdhcmluZyc6MjI5LCBcclxuICAnYWVsaWcnOjIzMCwgXHJcbiAgJ2NjZWRpbCc6MjMxLCBcclxuICAnZWdyYXZlJzoyMzIsIFxyXG4gICdlYWN1dGUnOjIzMywgXHJcbiAgJ2VjaXJjJzoyMzQsIFxyXG4gICdldW1sJzoyMzUsIFxyXG4gICdpZ3JhdmUnOjIzNiwgXHJcbiAgJ2lhY3V0ZSc6MjM3LCBcclxuICAnaWNpcmMnOjIzOCwgXHJcbiAgJ2l1bWwnOjIzOSwgXHJcbiAgJ2V0aCc6MjQwLCBcclxuICAnbnRpbGRlJzoyNDEsIFxyXG4gICdvZ3JhdmUnOjI0MiwgXHJcbiAgJ29hY3V0ZSc6MjQzLCBcclxuICAnb2NpcmMnOjI0NCwgXHJcbiAgJ290aWxkZSc6MjQ1LCBcclxuICAnb3VtbCc6MjQ2LCBcclxuICAnZGl2aWRlJzoyNDcsIFxyXG4gICdvc2xhc2gnOjI0OCwgXHJcbiAgJ3VncmF2ZSc6MjQ5LCBcclxuICAndWFjdXRlJzoyNTAsIFxyXG4gICd1Y2lyYyc6MjUxLCBcclxuICAndXVtbCc6MjUyLCBcclxuICAneWFjdXRlJzoyNTMsIFxyXG4gICd0aG9ybic6MjU0LCBcclxuICAneXVtbCc6MjU1LCBcclxuICAnZm5vZic6NDAyLCBcclxuICAnQWxwaGEnOjkxMywgXHJcbiAgJ0JldGEnOjkxNCwgXHJcbiAgJ0dhbW1hJzo5MTUsIFxyXG4gICdEZWx0YSc6OTE2LCBcclxuICAnRXBzaWxvbic6OTE3LCBcclxuICAnWmV0YSc6OTE4LCBcclxuICAnRXRhJzo5MTksIFxyXG4gICdUaGV0YSc6OTIwLCBcclxuICAnSW90YSc6OTIxLCBcclxuICAnS2FwcGEnOjkyMiwgXHJcbiAgJ0xhbWJkYSc6OTIzLCBcclxuICAnTXUnOjkyNCwgXHJcbiAgJ051Jzo5MjUsIFxyXG4gICdYaSc6OTI2LCBcclxuICAnT21pY3Jvbic6OTI3LCBcclxuICAnUGknOjkyOCwgXHJcbiAgJ1Jobyc6OTI5LCBcclxuICAnU2lnbWEnOjkzMSwgXHJcbiAgJ1RhdSc6OTMyLCBcclxuICAnVXBzaWxvbic6OTMzLCBcclxuICAnUGhpJzo5MzQsIFxyXG4gICdDaGknOjkzNSwgXHJcbiAgJ1BzaSc6OTM2LCBcclxuICAnT21lZ2EnOjkzNywgXHJcbiAgJ2FscGhhJzo5NDUsIFxyXG4gICdiZXRhJzo5NDYsIFxyXG4gICdnYW1tYSc6OTQ3LCBcclxuICAnZGVsdGEnOjk0OCwgXHJcbiAgJ2Vwc2lsb24nOjk0OSwgXHJcbiAgJ3pldGEnOjk1MCwgXHJcbiAgJ2V0YSc6OTUxLCBcclxuICAndGhldGEnOjk1MiwgXHJcbiAgJ2lvdGEnOjk1MywgXHJcbiAgJ2thcHBhJzo5NTQsIFxyXG4gICdsYW1iZGEnOjk1NSwgXHJcbiAgJ211Jzo5NTYsIFxyXG4gICdudSc6OTU3LCBcclxuICAneGknOjk1OCwgXHJcbiAgJ29taWNyb24nOjk1OSwgXHJcbiAgJ3BpJzo5NjAsIFxyXG4gICdyaG8nOjk2MSwgXHJcbiAgJ3NpZ21hZic6OTYyLCBcclxuICAnc2lnbWEnOjk2MywgXHJcbiAgJ3RhdSc6OTY0LCBcclxuICAndXBzaWxvbic6OTY1LCBcclxuICAncGhpJzo5NjYsIFxyXG4gICdjaGknOjk2NywgXHJcbiAgJ3BzaSc6OTY4LCBcclxuICAnb21lZ2EnOjk2OSwgXHJcbiAgJ3RoZXRhc3ltJzo5NzcsIFxyXG4gICd1cHNpaCc6OTc4LCBcclxuICAncGl2Jzo5ODIsIFxyXG4gICdidWxsJzo4MjI2LCBcclxuICAnaGVsbGlwJzo4MjMwLCBcclxuICAncHJpbWUnOjgyNDIsIFxyXG4gICdQcmltZSc6ODI0MywgXHJcbiAgJ29saW5lJzo4MjU0LCBcclxuICAnZnJhc2wnOjgyNjAsIFxyXG4gICd3ZWllcnAnOjg0NzIsIFxyXG4gICdpbWFnZSc6ODQ2NSwgXHJcbiAgJ3JlYWwnOjg0NzYsIFxyXG4gICd0cmFkZSc6ODQ4MiwgXHJcbiAgJ2FsZWZzeW0nOjg1MDEsIFxyXG4gICdsYXJyJzo4NTkyLCBcclxuICAndWFycic6ODU5MywgXHJcbiAgJ3JhcnInOjg1OTQsIFxyXG4gICdkYXJyJzo4NTk1LCBcclxuICAnaGFycic6ODU5NiwgXHJcbiAgJ2NyYXJyJzo4NjI5LCBcclxuICAnbEFycic6ODY1NiwgXHJcbiAgJ3VBcnInOjg2NTcsIFxyXG4gICdyQXJyJzo4NjU4LCBcclxuICAnZEFycic6ODY1OSwgXHJcbiAgJ2hBcnInOjg2NjAsIFxyXG4gICdmb3JhbGwnOjg3MDQsIFxyXG4gICdwYXJ0Jzo4NzA2LCBcclxuICAnZXhpc3QnOjg3MDcsIFxyXG4gICdlbXB0eSc6ODcwOSwgXHJcbiAgJ25hYmxhJzo4NzExLCBcclxuICAnaXNpbic6ODcxMiwgXHJcbiAgJ25vdGluJzo4NzEzLCBcclxuICAnbmknOjg3MTUsIFxyXG4gICdwcm9kJzo4NzE5LCBcclxuICAnc3VtJzo4NzIxLCBcclxuICAnbWludXMnOjg3MjIsIFxyXG4gICdsb3dhc3QnOjg3MjcsIFxyXG4gICdyYWRpYyc6ODczMCwgXHJcbiAgJ3Byb3AnOjg3MzMsIFxyXG4gICdpbmZpbic6ODczNCwgXHJcbiAgJ2FuZyc6ODczNiwgXHJcbiAgJ2FuZCc6ODc0MywgXHJcbiAgJ29yJzo4NzQ0LCBcclxuICAnY2FwJzo4NzQ1LCBcclxuICAnY3VwJzo4NzQ2LCBcclxuICAnaW50Jzo4NzQ3LCBcclxuICAndGhlcmU0Jzo4NzU2LCBcclxuICAnc2ltJzo4NzY0LCBcclxuICAnY29uZyc6ODc3MywgXHJcbiAgJ2FzeW1wJzo4Nzc2LCBcclxuICAnbmUnOjg4MDAsIFxyXG4gICdlcXVpdic6ODgwMSwgXHJcbiAgJ2xlJzo4ODA0LCBcclxuICAnZ2UnOjg4MDUsIFxyXG4gICdzdWInOjg4MzQsIFxyXG4gICdzdXAnOjg4MzUsIFxyXG4gICduc3ViJzo4ODM2LCBcclxuICAnc3ViZSc6ODgzOCwgXHJcbiAgJ3N1cGUnOjg4MzksIFxyXG4gICdvcGx1cyc6ODg1MywgXHJcbiAgJ290aW1lcyc6ODg1NSwgXHJcbiAgJ3BlcnAnOjg4NjksIFxyXG4gICdzZG90Jzo4OTAxLCBcclxuICAnbGNlaWwnOjg5NjgsIFxyXG4gICdyY2VpbCc6ODk2OSwgXHJcbiAgJ2xmbG9vcic6ODk3MCwgXHJcbiAgJ3JmbG9vcic6ODk3MSwgXHJcbiAgJ2xhbmcnOjkwMDEsIFxyXG4gICdyYW5nJzo5MDAyLCBcclxuICAnbG96Jzo5Njc0LCBcclxuICAnc3BhZGVzJzo5ODI0LCBcclxuICAnY2x1YnMnOjk4MjcsIFxyXG4gICdoZWFydHMnOjk4MjksIFxyXG4gICdkaWFtcyc6OTgzMCwgXHJcbiAgJ09FbGlnJzozMzgsIFxyXG4gICdvZWxpZyc6MzM5LCBcclxuICAnU2Nhcm9uJzozNTIsIFxyXG4gICdzY2Fyb24nOjM1MywgXHJcbiAgJ1l1bWwnOjM3NiwgXHJcbiAgJ2NpcmMnOjcxMCwgXHJcbiAgJ3RpbGRlJzo3MzIsIFxyXG4gICdlbnNwJzo4MTk0LCBcclxuICAnZW1zcCc6ODE5NSwgXHJcbiAgJ3RoaW5zcCc6ODIwMSwgXHJcbiAgJ3p3bmonOjgyMDQsIFxyXG4gICd6d2onOjgyMDUsIFxyXG4gICdscm0nOjgyMDYsIFxyXG4gICdybG0nOjgyMDcsIFxyXG4gICduZGFzaCc6ODIxMSwgXHJcbiAgJ21kYXNoJzo4MjEyLCBcclxuICAnbHNxdW8nOjgyMTYsIFxyXG4gICdyc3F1byc6ODIxNywgXHJcbiAgJ3NicXVvJzo4MjE4LCBcclxuICAnbGRxdW8nOjgyMjAsIFxyXG4gICdyZHF1byc6ODIyMSwgXHJcbiAgJ2JkcXVvJzo4MjIyLCBcclxuICAnZGFnZ2VyJzo4MjI0LCBcclxuICAnRGFnZ2VyJzo4MjI1LCBcclxuICAncGVybWlsJzo4MjQwLCBcclxuICAnbHNhcXVvJzo4MjQ5LCBcclxuICAncnNhcXVvJzo4MjUwLCBcclxuICAnZXVybyc6ODM2NFxyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzICA9IGVudGl0aWVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9oZWxwZXIvZW50aXRpZXMuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZWxlbWVudDogZnVuY3Rpb24obmFtZSwgYXR0cnMsIGNoaWxkcmVuKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdlbGVtZW50JyxcclxuICAgICAgdGFnOiBuYW1lLFxyXG4gICAgICBhdHRyczogYXR0cnMsXHJcbiAgICAgIGNoaWxkcmVuOiBjaGlsZHJlblxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYXR0cmlidXRlOiBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgbWRmKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBuYW1lOiBuYW1lLFxyXG4gICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgIG1kZjogbWRmXHJcbiAgICB9XHJcbiAgfSxcclxuICBcImlmXCI6IGZ1bmN0aW9uKHRlc3QsIGNvbnNlcXVlbnQsIGFsdGVybmF0ZSl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiAnaWYnLFxyXG4gICAgICB0ZXN0OiB0ZXN0LFxyXG4gICAgICBjb25zZXF1ZW50OiBjb25zZXF1ZW50LFxyXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgbGlzdDogZnVuY3Rpb24oc2VxdWVuY2UsIHZhcmlhYmxlLCBib2R5LCBhbHRlcm5hdGUsIHRyYWNrKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICdsaXN0JyxcclxuICAgICAgc2VxdWVuY2U6IHNlcXVlbmNlLFxyXG4gICAgICBhbHRlcm5hdGU6IGFsdGVybmF0ZSxcclxuICAgICAgdmFyaWFibGU6IHZhcmlhYmxlLFxyXG4gICAgICBib2R5OiBib2R5LFxyXG4gICAgICB0cmFjazogdHJhY2tcclxuICAgIH1cclxuICB9LFxyXG4gIGV4cHJlc3Npb246IGZ1bmN0aW9uKCBib2R5LCBzZXRib2R5LCBjb25zdGFudCwgZmlsdGVycyApe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogXCJleHByZXNzaW9uXCIsXHJcbiAgICAgIGJvZHk6IGJvZHksXHJcbiAgICAgIGNvbnN0YW50OiBjb25zdGFudCB8fCBmYWxzZSxcclxuICAgICAgc2V0Ym9keTogc2V0Ym9keSB8fCBmYWxzZSxcclxuICAgICAgZmlsdGVyczogZmlsdGVyc1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGV4dDogZnVuY3Rpb24odGV4dCl7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgdGV4dDogdGV4dFxyXG4gICAgfVxyXG4gIH0sXHJcbiAgdGVtcGxhdGU6IGZ1bmN0aW9uKHRlbXBsYXRlKXtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHR5cGU6ICd0ZW1wbGF0ZScsXHJcbiAgICAgIGNvbnRlbnQ6IHRlbXBsYXRlXHJcbiAgICB9XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvcGFyc2VyL3NyYy9ub2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBfID0gcmVxdWlyZShcIi4uL3V0aWwuanNcIik7XHJcbnZhciBjb25maWcgPSByZXF1aXJlKFwiLi4vY29uZmlnLmpzXCIpO1xyXG5cclxuLy8gc29tZSBjdXN0b20gdGFnICB3aWxsIGNvbmZsaWN0IHdpdGggdGhlIExleGVyIHByb2dyZXNzXHJcbnZhciBjb25mbGljdFRhZyA9IHtcIn1cIjogXCJ7XCIsIFwiXVwiOiBcIltcIn0sIG1hcDEsIG1hcDI7XHJcbi8vIHNvbWUgbWFjcm8gZm9yIGxleGVyXHJcbnZhciBtYWNybyA9IHtcclxuICAnTkFNRSc6IC8oPzpbOl9BLVphLXpdWy1cXC46XzAtOUEtWmEtel0qKS8sXHJcbiAgJ0lERU5UJzogL1tcXCRfQS1aYS16XVtfMC05QS1aYS16XFwkXSovLFxyXG4gICdTUEFDRSc6IC9bXFxyXFxuXFx0XFxmIF0vXHJcbn1cclxuXHJcblxyXG52YXIgdGVzdCA9IC9hfChiKS8uZXhlYyhcImFcIik7XHJcbnZhciB0ZXN0U3ViQ2FwdXJlID0gdGVzdCAmJiB0ZXN0WzFdID09PSB1bmRlZmluZWQ/IFxyXG4gIGZ1bmN0aW9uKHN0cil7IHJldHVybiBzdHIgIT09IHVuZGVmaW5lZCB9XHJcbiAgOmZ1bmN0aW9uKHN0cil7cmV0dXJuICEhc3RyfTtcclxuXHJcbmZ1bmN0aW9uIHdyYXBIYW5kZXIoaGFuZGxlcil7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4ge3R5cGU6IGhhbmRsZXIsIHZhbHVlOiBhbGwgfVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gTGV4ZXIoaW5wdXQsIG9wdHMpe1xyXG4gIGlmKGNvbmZsaWN0VGFnW2NvbmZpZy5FTkRdKXtcclxuICAgIHRoaXMubWFya1N0YXJ0ID0gY29uZmxpY3RUYWdbY29uZmlnLkVORF07XHJcbiAgICB0aGlzLm1hcmtFbmQgPSBjb25maWcuRU5EO1xyXG4gIH1cclxuXHJcbiAgdGhpcy5pbnB1dCA9IChpbnB1dHx8XCJcIikudHJpbSgpO1xyXG4gIHRoaXMub3B0cyA9IG9wdHMgfHwge307XHJcbiAgdGhpcy5tYXAgPSB0aGlzLm9wdHMubW9kZSAhPT0gMj8gIG1hcDE6IG1hcDI7XHJcbiAgdGhpcy5zdGF0ZXMgPSBbXCJJTklUXCJdO1xyXG4gIGlmKG9wdHMgJiYgb3B0cy5leHByZXNzaW9uKXtcclxuICAgICB0aGlzLnN0YXRlcy5wdXNoKFwiSlNUXCIpO1xyXG4gICAgIHRoaXMuZXhwcmVzc2lvbiA9IHRydWU7XHJcbiAgfVxyXG59XHJcblxyXG52YXIgbG8gPSBMZXhlci5wcm90b3R5cGVcclxuXHJcblxyXG5sby5sZXggPSBmdW5jdGlvbihzdHIpe1xyXG4gIHN0ciA9IChzdHIgfHwgdGhpcy5pbnB1dCkudHJpbSgpO1xyXG4gIHZhciB0b2tlbnMgPSBbXSwgc3BsaXQsIHRlc3QsbWxlbiwgdG9rZW4sIHN0YXRlO1xyXG4gIHRoaXMuaW5wdXQgPSBzdHIsIFxyXG4gIHRoaXMubWFya3MgPSAwO1xyXG4gIC8vIGluaXQgdGhlIHBvcyBpbmRleFxyXG4gIHRoaXMuaW5kZXg9MDtcclxuICB2YXIgaSA9IDA7XHJcbiAgd2hpbGUoc3RyKXtcclxuICAgIGkrK1xyXG4gICAgc3RhdGUgPSB0aGlzLnN0YXRlKCk7XHJcbiAgICBzcGxpdCA9IHRoaXMubWFwW3N0YXRlXSBcclxuICAgIHRlc3QgPSBzcGxpdC5UUlVOSy5leGVjKHN0cik7XHJcbiAgICBpZighdGVzdCl7XHJcbiAgICAgIHRoaXMuZXJyb3IoJ1VucmVjb2dpbml6ZWQgVG9rZW4nKTtcclxuICAgIH1cclxuICAgIG1sZW4gPSB0ZXN0WzBdLmxlbmd0aDtcclxuICAgIHN0ciA9IHN0ci5zbGljZShtbGVuKVxyXG4gICAgdG9rZW4gPSB0aGlzLl9wcm9jZXNzLmNhbGwodGhpcywgdGVzdCwgc3BsaXQsIHN0cilcclxuICAgIGlmKHRva2VuKSB0b2tlbnMucHVzaCh0b2tlbilcclxuICAgIHRoaXMuaW5kZXggKz0gbWxlbjtcclxuICAgIC8vIGlmKHN0YXRlID09ICdUQUcnIHx8IHN0YXRlID09ICdKU1QnKSBzdHIgPSB0aGlzLnNraXBzcGFjZShzdHIpO1xyXG4gIH1cclxuXHJcbiAgdG9rZW5zLnB1c2goe3R5cGU6ICdFT0YnfSk7XHJcblxyXG4gIHJldHVybiB0b2tlbnM7XHJcbn1cclxuXHJcbmxvLmVycm9yID0gZnVuY3Rpb24obXNnKXtcclxuICB0aHJvdyAgRXJyb3IoXCJQYXJzZSBFcnJvcjogXCIgKyBtc2cgKyAgJzpcXG4nICsgXy50cmFja0Vycm9yUG9zKHRoaXMuaW5wdXQsIHRoaXMuaW5kZXgpKTtcclxufVxyXG5cclxubG8uX3Byb2Nlc3MgPSBmdW5jdGlvbihhcmdzLCBzcGxpdCxzdHIpe1xyXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3Muam9pbihcIixcIiksIHRoaXMuc3RhdGUoKSlcclxuICB2YXIgbGlua3MgPSBzcGxpdC5saW5rcywgbWFyY2hlZCA9IGZhbHNlLCB0b2tlbjtcclxuXHJcbiAgZm9yKHZhciBsZW4gPSBsaW5rcy5sZW5ndGgsIGk9MDtpPGxlbiA7aSsrKXtcclxuICAgIHZhciBsaW5rID0gbGlua3NbaV0sXHJcbiAgICAgIGhhbmRsZXIgPSBsaW5rWzJdLFxyXG4gICAgICBpbmRleCA9IGxpbmtbMF07XHJcbiAgICAvLyBpZihhcmdzWzZdID09PSAnPicgJiYgaW5kZXggPT09IDYpIGNvbnNvbGUubG9nKCdoYWhhJylcclxuICAgIGlmKHRlc3RTdWJDYXB1cmUoYXJnc1tpbmRleF0pKSB7XHJcbiAgICAgIG1hcmNoZWQgPSB0cnVlO1xyXG4gICAgICBpZihoYW5kbGVyKXtcclxuICAgICAgICB0b2tlbiA9IGhhbmRsZXIuYXBwbHkodGhpcywgYXJncy5zbGljZShpbmRleCwgaW5kZXggKyBsaW5rWzFdKSlcclxuICAgICAgICBpZih0b2tlbikgIHRva2VuLnBvcyA9IHRoaXMuaW5kZXg7XHJcbiAgICAgIH1cclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmKCFtYXJjaGVkKXsgLy8gaW4gaWUgbHQ4IC4gc3ViIGNhcHR1cmUgaXMgXCJcIiBidXQgb250IFxyXG4gICAgc3dpdGNoKHN0ci5jaGFyQXQoMCkpe1xyXG4gICAgICBjYXNlIFwiPFwiOlxyXG4gICAgICAgIHRoaXMuZW50ZXIoXCJUQUdcIik7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgdGhpcy5lbnRlcihcIkpTVFwiKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHRva2VuO1xyXG59XHJcbmxvLmVudGVyID0gZnVuY3Rpb24oc3RhdGUpe1xyXG4gIHRoaXMuc3RhdGVzLnB1c2goc3RhdGUpXHJcbiAgcmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbmxvLnN0YXRlID0gZnVuY3Rpb24oKXtcclxuICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgcmV0dXJuIHN0YXRlc1tzdGF0ZXMubGVuZ3RoLTFdO1xyXG59XHJcblxyXG5sby5sZWF2ZSA9IGZ1bmN0aW9uKHN0YXRlKXtcclxuICB2YXIgc3RhdGVzID0gdGhpcy5zdGF0ZXM7XHJcbiAgaWYoIXN0YXRlIHx8IHN0YXRlc1tzdGF0ZXMubGVuZ3RoLTFdID09PSBzdGF0ZSkgc3RhdGVzLnBvcCgpXHJcbn1cclxuXHJcblxyXG5MZXhlci5zZXR1cCA9IGZ1bmN0aW9uKCl7XHJcbiAgbWFjcm8uRU5EID0gY29uZmlnLkVORDtcclxuICBtYWNyby5CRUdJTiA9IGNvbmZpZy5CRUdJTjtcclxuICAvL1xyXG4gIG1hcDEgPSBnZW5NYXAoW1xyXG4gICAgLy8gSU5JVFxyXG4gICAgcnVsZXMuRU5URVJfSlNULFxyXG4gICAgcnVsZXMuRU5URVJfVEFHLFxyXG4gICAgcnVsZXMuVEVYVCxcclxuXHJcbiAgICAvL1RBR1xyXG4gICAgcnVsZXMuVEFHX05BTUUsXHJcbiAgICBydWxlcy5UQUdfT1BFTixcclxuICAgIHJ1bGVzLlRBR19DTE9TRSxcclxuICAgIHJ1bGVzLlRBR19QVU5DSE9SLFxyXG4gICAgcnVsZXMuVEFHX0VOVEVSX0pTVCxcclxuICAgIHJ1bGVzLlRBR19VTlFfVkFMVUUsXHJcbiAgICBydWxlcy5UQUdfU1RSSU5HLFxyXG4gICAgcnVsZXMuVEFHX1NQQUNFLFxyXG4gICAgcnVsZXMuVEFHX0NPTU1FTlQsXHJcblxyXG4gICAgLy8gSlNUXHJcbiAgICBydWxlcy5KU1RfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9DTE9TRSxcclxuICAgIHJ1bGVzLkpTVF9DT01NRU5ULFxyXG4gICAgcnVsZXMuSlNUX0VYUFJfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9JREVOVCxcclxuICAgIHJ1bGVzLkpTVF9TUEFDRSxcclxuICAgIHJ1bGVzLkpTVF9MRUFWRSxcclxuICAgIHJ1bGVzLkpTVF9OVU1CRVIsXHJcbiAgICBydWxlcy5KU1RfUFVOQ0hPUixcclxuICAgIHJ1bGVzLkpTVF9TVFJJTkcsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVFxyXG4gICAgXSlcclxuXHJcbiAgLy8gaWdub3JlZCB0aGUgdGFnLXJlbGF0aXZlIHRva2VuXHJcbiAgbWFwMiA9IGdlbk1hcChbXHJcbiAgICAvLyBJTklUIG5vIDwgcmVzdHJpY3RcclxuICAgIHJ1bGVzLkVOVEVSX0pTVDIsXHJcbiAgICBydWxlcy5URVhULFxyXG4gICAgLy8gSlNUXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVCxcclxuICAgIHJ1bGVzLkpTVF9PUEVOLFxyXG4gICAgcnVsZXMuSlNUX0NMT1NFLFxyXG4gICAgcnVsZXMuSlNUX0VYUFJfT1BFTixcclxuICAgIHJ1bGVzLkpTVF9JREVOVCxcclxuICAgIHJ1bGVzLkpTVF9TUEFDRSxcclxuICAgIHJ1bGVzLkpTVF9MRUFWRSxcclxuICAgIHJ1bGVzLkpTVF9OVU1CRVIsXHJcbiAgICBydWxlcy5KU1RfUFVOQ0hPUixcclxuICAgIHJ1bGVzLkpTVF9TVFJJTkcsXHJcbiAgICBydWxlcy5KU1RfQ09NTUVOVFxyXG4gICAgXSlcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdlbk1hcChydWxlcyl7XHJcbiAgdmFyIHJ1bGUsIG1hcCA9IHt9LCBzaWduO1xyXG4gIGZvcih2YXIgaSA9IDAsIGxlbiA9IHJ1bGVzLmxlbmd0aDsgaSA8IGxlbiA7IGkrKyl7XHJcbiAgICBydWxlID0gcnVsZXNbaV07XHJcbiAgICBzaWduID0gcnVsZVsyXSB8fCAnSU5JVCc7XHJcbiAgICAoIG1hcFtzaWduXSB8fCAobWFwW3NpZ25dID0ge3J1bGVzOltdLCBsaW5rczpbXX0pICkucnVsZXMucHVzaChydWxlKTtcclxuICB9XHJcbiAgcmV0dXJuIHNldHVwKG1hcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldHVwKG1hcCl7XHJcbiAgdmFyIHNwbGl0LCBydWxlcywgdHJ1bmtzLCBoYW5kbGVyLCByZWcsIHJldGFpbiwgcnVsZTtcclxuICBmdW5jdGlvbiByZXBsYWNlRm4oYWxsLCBvbmUpe1xyXG4gICAgcmV0dXJuIHR5cGVvZiBtYWNyb1tvbmVdID09PSAnc3RyaW5nJz8gXHJcbiAgICAgIF8uZXNjYXBlUmVnRXhwKG1hY3JvW29uZV0pIFxyXG4gICAgICA6IFN0cmluZyhtYWNyb1tvbmVdKS5zbGljZSgxLC0xKTtcclxuICB9XHJcblxyXG4gIGZvcih2YXIgaSBpbiBtYXApe1xyXG5cclxuICAgIHNwbGl0ID0gbWFwW2ldO1xyXG4gICAgc3BsaXQuY3VySW5kZXggPSAxO1xyXG4gICAgcnVsZXMgPSBzcGxpdC5ydWxlcztcclxuICAgIHRydW5rcyA9IFtdO1xyXG5cclxuICAgIGZvcih2YXIgaiA9IDAsbGVuID0gcnVsZXMubGVuZ3RoOyBqPGxlbjsgaisrKXtcclxuICAgICAgcnVsZSA9IHJ1bGVzW2pdOyBcclxuICAgICAgcmVnID0gcnVsZVswXTtcclxuICAgICAgaGFuZGxlciA9IHJ1bGVbMV07XHJcblxyXG4gICAgICBpZih0eXBlb2YgaGFuZGxlciA9PT0gJ3N0cmluZycpe1xyXG4gICAgICAgIGhhbmRsZXIgPSB3cmFwSGFuZGVyKGhhbmRsZXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKF8udHlwZU9mKHJlZykgPT09ICdyZWdleHAnKSByZWcgPSByZWcudG9TdHJpbmcoKS5zbGljZSgxLCAtMSk7XHJcblxyXG4gICAgICByZWcgPSByZWcucmVwbGFjZSgvXFx7KFxcdyspXFx9L2csIHJlcGxhY2VGbilcclxuICAgICAgcmV0YWluID0gXy5maW5kU3ViQ2FwdHVyZShyZWcpICsgMTsgXHJcbiAgICAgIHNwbGl0LmxpbmtzLnB1c2goW3NwbGl0LmN1ckluZGV4LCByZXRhaW4sIGhhbmRsZXJdKTsgXHJcbiAgICAgIHNwbGl0LmN1ckluZGV4ICs9IHJldGFpbjtcclxuICAgICAgdHJ1bmtzLnB1c2gocmVnKTtcclxuICAgIH1cclxuICAgIHNwbGl0LlRSVU5LID0gbmV3IFJlZ0V4cChcIl4oPzooXCIgKyB0cnVua3Muam9pbihcIil8KFwiKSArIFwiKSlcIilcclxuICB9XHJcbiAgcmV0dXJuIG1hcDtcclxufVxyXG5cclxudmFyIHJ1bGVzID0ge1xyXG5cclxuICAvLyAxLiBJTklUXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIC8vIG1vZGUxJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBFTlRFUl9KU1Q6IFsvW15cXHgwMDxdKj8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIC8vIG1vZGUyJ3MgSlNUIEVOVEVSIFJVTEVcclxuICBFTlRFUl9KU1QyOiBbL1teXFx4MDBdKj8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICAgIGlmKGFsbCkgcmV0dXJuIHt0eXBlOiAnVEVYVCcsIHZhbHVlOiBhbGx9XHJcbiAgfV0sXHJcblxyXG4gIEVOVEVSX1RBRzogWy9bXlxceDAwXSo/KD89PFtcXHdcXC9cXCFdKS8sIGZ1bmN0aW9uKGFsbCl7IFxyXG4gICAgdGhpcy5lbnRlcignVEFHJyk7XHJcbiAgICBpZihhbGwpIHJldHVybiB7dHlwZTogJ1RFWFQnLCB2YWx1ZTogYWxsfVxyXG4gIH1dLFxyXG5cclxuICBURVhUOiBbL1teXFx4MDBdKy8sICdURVhUJyBdLFxyXG5cclxuICAvLyAyLiBUQUdcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIFRBR19OQU1FOiBbL3tOQU1FfS8sICdOQU1FJywgJ1RBRyddLFxyXG4gIFRBR19VTlFfVkFMVUU6IFsvW15cXHt9JlwiJz0+PGBcXHJcXG5cXGZcXHQgXSsvLCAnVU5RJywgJ1RBRyddLFxyXG5cclxuICBUQUdfT1BFTjogWy88KHtOQU1FfSlcXHMqLywgZnVuY3Rpb24oYWxsLCBvbmUpeyAvL1wiXHJcbiAgICByZXR1cm4ge3R5cGU6ICdUQUdfT1BFTicsIHZhbHVlOiBvbmV9XHJcbiAgfSwgJ1RBRyddLFxyXG4gIFRBR19DTE9TRTogWy88XFwvKHtOQU1FfSlbXFxyXFxuXFxmXFx0IF0qPi8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIHRoaXMubGVhdmUoKTtcclxuICAgIHJldHVybiB7dHlwZTogJ1RBR19DTE9TRScsIHZhbHVlOiBvbmUgfVxyXG4gIH0sICdUQUcnXSxcclxuXHJcbiAgICAvLyBtb2RlMidzIEpTVCBFTlRFUiBSVUxFXHJcbiAgVEFHX0VOVEVSX0pTVDogWy8oPz17QkVHSU59KS8sIGZ1bmN0aW9uKCl7XHJcbiAgICB0aGlzLmVudGVyKCdKU1QnKTtcclxuICB9LCAnVEFHJ10sXHJcblxyXG5cclxuICBUQUdfUFVOQ0hPUjogWy9bXFw+XFwvPSZdLywgZnVuY3Rpb24oYWxsKXtcclxuICAgIGlmKGFsbCA9PT0gJz4nKSB0aGlzLmxlYXZlKCk7XHJcbiAgICByZXR1cm4ge3R5cGU6IGFsbCwgdmFsdWU6IGFsbCB9XHJcbiAgfSwgJ1RBRyddLFxyXG4gIFRBR19TVFJJTkc6ICBbIC8nKFteJ10qKSd8XCIoW15cIl0qKVxcXCIvLCAvKicqLyAgZnVuY3Rpb24oYWxsLCBvbmUsIHR3byl7IFxyXG4gICAgdmFyIHZhbHVlID0gb25lIHx8IHR3byB8fCBcIlwiO1xyXG5cclxuICAgIHJldHVybiB7dHlwZTogJ1NUUklORycsIHZhbHVlOiB2YWx1ZX1cclxuICB9LCAnVEFHJ10sXHJcblxyXG4gIFRBR19TUEFDRTogWy97U1BBQ0V9Ky8sIG51bGwsICdUQUcnXSxcclxuICBUQUdfQ09NTUVOVDogWy88XFwhLS0oW15cXHgwMF0qPyktLVxcPi8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICB0aGlzLmxlYXZlKClcclxuICAgIC8vIHRoaXMubGVhdmUoJ1RBRycpXHJcbiAgfSAsJ1RBRyddLFxyXG5cclxuICAvLyAzLiBKU1RcclxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gIEpTVF9PUEVOOiBbJ3tCRUdJTn0je1NQQUNFfSooe0lERU5UfSknLCBmdW5jdGlvbihhbGwsIG5hbWUpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ09QRU4nLFxyXG4gICAgICB2YWx1ZTogbmFtZVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfTEVBVkU6IFsve0VORH0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgaWYodGhpcy5tYXJrRW5kID09PSBhbGwgJiYgdGhpcy5leHByZXNzaW9uKSByZXR1cm4ge3R5cGU6IHRoaXMubWFya0VuZCwgdmFsdWU6IHRoaXMubWFya0VuZH07XHJcbiAgICBpZighdGhpcy5tYXJrRW5kIHx8ICF0aGlzLm1hcmtzICl7XHJcbiAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubGVhdmUoJ0pTVCcpO1xyXG4gICAgICByZXR1cm4ge3R5cGU6ICdFTkQnfVxyXG4gICAgfWVsc2V7XHJcbiAgICAgIHRoaXMubWFya3MtLTtcclxuICAgICAgcmV0dXJuIHt0eXBlOiB0aGlzLm1hcmtFbmQsIHZhbHVlOiB0aGlzLm1hcmtFbmR9XHJcbiAgICB9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9DTE9TRTogWy97QkVHSU59XFxzKlxcLyh7SURFTlR9KVxccyp7RU5EfS8sIGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIHRoaXMubGVhdmUoJ0pTVCcpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ0NMT1NFJyxcclxuICAgICAgdmFsdWU6IG9uZVxyXG4gICAgfVxyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfQ09NTUVOVDogWy97QkVHSU59XFwhKFteXFx4MDBdKj8pXFwhe0VORH0vLCBmdW5jdGlvbigpe1xyXG4gICAgdGhpcy5sZWF2ZSgpO1xyXG4gIH0sICdKU1QnXSxcclxuICBKU1RfRVhQUl9PUEVOOiBbJ3tCRUdJTn0nLGZ1bmN0aW9uKGFsbCwgb25lKXtcclxuICAgIGlmKGFsbCA9PT0gdGhpcy5tYXJrU3RhcnQpe1xyXG4gICAgICBpZih0aGlzLmV4cHJlc3Npb24pIHJldHVybiB7IHR5cGU6IHRoaXMubWFya1N0YXJ0LCB2YWx1ZTogdGhpcy5tYXJrU3RhcnQgfTtcclxuICAgICAgaWYodGhpcy5maXJzdEVudGVyU3RhcnQgfHwgdGhpcy5tYXJrcyl7XHJcbiAgICAgICAgdGhpcy5tYXJrcysrXHJcbiAgICAgICAgdGhpcy5maXJzdEVudGVyU3RhcnQgPSBmYWxzZTtcclxuICAgICAgICByZXR1cm4geyB0eXBlOiB0aGlzLm1hcmtTdGFydCwgdmFsdWU6IHRoaXMubWFya1N0YXJ0IH07XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgIHRoaXMuZmlyc3RFbnRlclN0YXJ0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdHlwZTogJ0VYUFJfT1BFTicsXHJcbiAgICAgIGVzY2FwZTogZmFsc2VcclxuICAgIH1cclxuXHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9JREVOVDogWyd7SURFTlR9JywgJ0lERU5UJywgJ0pTVCddLFxyXG4gIEpTVF9TUEFDRTogWy9bIFxcclxcblxcZl0rLywgbnVsbCwgJ0pTVCddLFxyXG4gIEpTVF9QVU5DSE9SOiBbL1s9IV0/PT18Wy09PjwrKlxcLyVcXCFdP1xcPXxcXHxcXHx8JiZ8XFxAXFwofFxcLlxcLnxbPFxcPlxcW1xcXVxcKFxcKVxcLVxcfFxce31cXCtcXCpcXC8lPzpcXC4hLF0vLCBmdW5jdGlvbihhbGwpe1xyXG4gICAgcmV0dXJuIHsgdHlwZTogYWxsLCB2YWx1ZTogYWxsIH1cclxuICB9LCdKU1QnXSxcclxuXHJcbiAgSlNUX1NUUklORzogIFsgLycoW14nXSopJ3xcIihbXlwiXSopXCIvLCBmdW5jdGlvbihhbGwsIG9uZSwgdHdvKXsgLy9cIidcclxuICAgIHJldHVybiB7dHlwZTogJ1NUUklORycsIHZhbHVlOiBvbmUgfHwgdHdvIHx8IFwiXCJ9XHJcbiAgfSwgJ0pTVCddLFxyXG4gIEpTVF9OVU1CRVI6IFsvKD86WzAtOV0qXFwuWzAtOV0rfFswLTldKykoZVxcZCspPy8sIGZ1bmN0aW9uKGFsbCl7XHJcbiAgICByZXR1cm4ge3R5cGU6ICdOVU1CRVInLCB2YWx1ZTogcGFyc2VGbG9hdChhbGwsIDEwKX07XHJcbiAgfSwgJ0pTVCddXHJcbn1cclxuXHJcblxyXG4vLyBzZXR1cCB3aGVuIGZpcnN0IGNvbmZpZ1xyXG5MZXhlci5zZXR1cCgpO1xyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IExleGVyO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3BhcnNlci9zcmMvTGV4ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKCcuL0RvY3VtZW50RnJhZ21lbnQuanMnKTtcclxudmFyIEVsZW1lbnQgPSByZXF1aXJlKCcuL0VsZW1lbnQuanMnKTtcclxuXHJcbnZhciBwcm90byA9IHtcclxuICAgIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBkb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICB9LFxyXG4gICAgY3JlYXRlRWxlbWVudDogZnVuY3Rpb24odGFnTmFtZSl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFbGVtZW50KHRhZ05hbWUpO1xyXG4gICAgfSxcclxuICAgIGNyZWF0ZVRleHROb2RlOiBmdW5jdGlvbih0ZXh0KXtcclxuICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgIH1cclxufTtcclxuXHJcbnZhciBkb2MgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZG9jO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3Zkb20vRG9jdW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiZnVuY3Rpb24gRWxlbWVudCh0YWdOYW1lKXtcclxuICAgIHRoaXMuX3RhZ05hbWUgPSB0YWdOYW1lO1xyXG4gICAgdGhpcy5fYXR0cnMgPSBbXTtcclxuICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xyXG4gICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcclxufVxyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuc2V0QXR0cmlidXRlID0gZnVuY3Rpb24oYXR0ck5hbWUsIGF0dHJWYWx1ZSl7XHJcbiAgICB2YXIgZXZlbnRQYXR0ZXJuID0gL29uLS87XHJcblxyXG4gICAgaWYoZXZlbnRQYXR0ZXJuLnRlc3QoYXR0ck5hbWUpKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5fYXR0cnMucHVzaCh7bmFtZTogYXR0ck5hbWUsIHZhbHVlOiBhdHRyVmFsdWV9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihldmVudE5hbWUsIGhhbmRsZXIsIGlzUG9wLCBhcmdDb250ZXh0KXtcclxuICAgIHRoaXMuX2V2ZW50cy5wdXNoKHtuYW1lOiBldmVudE5hbWUucmVwbGFjZSgvLS8sICcnKSwgdmFsdWU6IGhhbmRsZXIsIGNvbnRleHQ6IGFyZ0NvbnRleHR9KTtcclxufTtcclxuXHJcbkVsZW1lbnQucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgdGhpcy5fY2hpbGRyZW4ucHVzaChub2RlKTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRWxlbWVudDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy92ZG9tL0VsZW1lbnQuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTk6NTE6NTMgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTI6Mjk6MTlcclxuICovXHJcbmZ1bmN0aW9uIE1lc3NhZ2VCdXMoKXtcclxuICAgIHRoaXMuX29uU2VuZFdvcmtlciA9IFtdO1xyXG4gICAgdGhpcy5faW5pdFdvcmtlcigpO1xyXG4gICAgdGhpcy5fY3JlYXRlRXZlbnRzU3RvcmUoKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2NyZWF0ZUV2ZW50c1N0b3JlID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuX2V2ZW50c1N0b3JlID0ge307XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24oKXtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX29uTWVzc2FnZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdGhpcy5fZGVzZXJpYWxpemUobWVzc2FnZSk7XHJcbiAgICB0aGlzLl9yZWNlaXZlQnVzUmVzb2x2ZXIoKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3JlY2VpdmVCdXNSZXNvbHZlciA9IGZ1bmN0aW9uKEluZm8pe1xyXG5cclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUucmVjZWl2ZSA9IGZ1bmN0aW9uKG1lc3NhZ2Upe1xyXG4gICAgdGhpcy5fYnVmZmVyID0gbWVzc2FnZTtcclxuICAgIHRoaXMuX3NlcmlhbGl6ZShtZXNzYWdlKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5hZGRFdmVudCA9IGZ1bmN0aW9uKGV2ZW50VHlwZSwgZm4pe1xyXG4gICAgdGhpcy5fcmVnaXN0ZXIoZXZlbnRUeXBlLCBmbi5iaW5kKHRoaXMpKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX2Rlc2VyaWFsaXplID0gZnVuY3Rpb24obWVzc2FnZSl7XHJcbiAgICB2YXIgdHlwZSA9IG1lc3NhZ2UuZGF0YS50eXBlLFxyXG4gICAgICAgIGRhdGEgPSBtZXNzYWdlLmRhdGEuZGF0YTtcclxuICAgIHRoaXMuX2VtaXQodHlwZSwgZGF0YSk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9zZXJpYWxpemUgPSBmdW5jdGlvbihtZXNzYWdlKXtcclxuICAgIHZhciBJbmZvID0ge307XHJcblxyXG4gICAgSW5mby50eXBlID0gbWVzc2FnZS50eXBlO1xyXG4gICAgSW5mby5kYXRhID0gbWVzc2FnZS5kYXRhO1xyXG5cclxuICAgIHRoaXMuX3NlbmRJbmZvVG9Xb3JrZXIoSW5mbyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3NlbmRJbmZvVG9Xb3JrZXIgPSBmdW5jdGlvbihJbmZvKXtcclxuICAgIHZhciBfd29ya2VyID0gdGhpcy5fd29ya2VyLFxyXG4gICAgICAgIF9vblNlbmRXb3JrZXIgPSB0aGlzLl9vblNlbmRXb3JrZXI7XHJcblxyXG4gICAgdGhpcy5fcG9zdE1lc3NhZ2UoSW5mbyk7XHJcblxyXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKF9vblNlbmRXb3JrZXIubGVuZ3RoKSB0aGlzLl9jaGVja1dhdGNoZXJzKF9vblNlbmRXb3JrZXIsIEluZm8pO1xyXG4gICAgfS5iaW5kKHRoaXMpLCAwKTtcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3Bvc3RNZXNzYWdlID0gZnVuY3Rpb24oSW5mbyl7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9jaGVja1dhdGNoZXJzID0gZnVuY3Rpb24od2F0Y2hlcnMsIEluZm8pe1xyXG4gICAgXHJcbiAgICBmb3IodmFyIGk9MCwgd2F0Y2hlcjtpPHdhdGNoZXJzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKEluZm8pO1xyXG4gICAgfVxyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5vblNlbmQgPSBmdW5jdGlvbihmbil7XHJcbiAgICB0aGlzLl9vblNlbmRXb3JrZXIucHVzaChmbik7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihmbil7XHJcbiAgICB2YXIgbWVzc2FnZSA9IHRoaXMuX2J1ZmZlcjtcclxuICAgIHRoaXMuX3JlZ2lzdGVyKG1lc3NhZ2UudHlwZSwgZm4pO1xyXG4gICAgXHJcbiAgICByZXR1cm4gdGhpcztcclxufVxyXG5cclxuTWVzc2FnZUJ1cy5wcm90b3R5cGUuX3JlZ2lzdGVyID0gZnVuY3Rpb24oZXZlbnROYW1lLCBmbil7XHJcbiAgICB2YXIgX2V2ZW50c1N0b3JlID0gdGhpcy5fZXZlbnRzU3RvcmU7XHJcblxyXG4gICAgaWYoX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0pXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0ud2F0Y2hlcnMucHVzaChmbik7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0gPSB7d2F0Y2hlcnM6IFtmbl19O1xyXG59XHJcblxyXG5NZXNzYWdlQnVzLnByb3RvdHlwZS5fZW1pdCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSl7XHJcbiAgICB2YXIgX2V2ZW50c1N0b3JlID0gdGhpcy5fZXZlbnRzU3RvcmU7XHJcblxyXG4gICAgaWYoX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0gJiYgX2V2ZW50c1N0b3JlW2V2ZW50TmFtZV0ud2F0Y2hlcnMubGVuZ3RoKVxyXG4gICAgICAgIHRoaXMuX2V4ZWN1dGVXYXRjaGVycyhfZXZlbnRzU3RvcmVbZXZlbnROYW1lXS53YXRjaGVycywgZGF0YSk7XHJcbn1cclxuXHJcbk1lc3NhZ2VCdXMucHJvdG90eXBlLl9leGVjdXRlV2F0Y2hlcnMgPSBmdW5jdGlvbih3YXRjaGVycywgZGF0YSl7XHJcbiAgICBmb3IodmFyIGk9d2F0Y2hlcnMubGVuZ3RoLTEsIHdhdGNoZXI7aT49MDtpLS0pe1xyXG4gICAgICAgIHdhdGNoZXIgPSB3YXRjaGVyc1tpXTtcclxuICAgICAgICB3YXRjaGVyKGRhdGEpO1xyXG4gICAgICAgIHdhdGNoZXJzLnNwbGljZShpLCAxKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvTWVzc2FnZUJ1cy5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0OTowMyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMjowMjowOVxyXG4gKi9cclxuXHJcbnZhciBNZXNzYWdlQnVzID0gcmVxdWlyZSgnLi9tZXNzYWdlQnVzL1dvcmtlck1zZ0J1cy5qcycpO1xyXG52YXIgV0tSZW5kZXJTdG9yZSA9IHJlcXVpcmUoJy4vc3RvcmUvV0tSZW5kZXJTdG9yZS5qcycpO1xyXG5cclxudmFyIG15TWVzc2FnZUJ1cyA9IG5ldyBNZXNzYWdlQnVzKCk7XHJcblxyXG5teU1lc3NhZ2VCdXMuYWRkRXZlbnQoJ3JlbmRlcicsIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgdmFyIHN0b3JlID0gbmV3IFdLUmVuZGVyU3RvcmUoZGF0YSk7XHJcbiAgICBzdG9yZS5yZW5kZXIoKTtcclxuICAgIHRoaXMucmVjZWl2ZSh7dHlwZTogJ3JlbmRlcicsIGRhdGE6IHtodG1sOiBzdG9yZS5yZW5kZXJlZFN0ciwgZXZlbnRzOiBzdG9yZS5ldmVudHN9fSk7XHJcbiAgICBjb25zb2xlLmxvZygnd29ya2VyIG1lc3NhZ2VCdXMnKTtcclxufSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvd2tfaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMSIsIi8qXHJcbiAqIEBBdXRob3I6IHpodXhpYW9yYW4gXHJcbiAqIEBEYXRlOiAyMDE3LTA4LTE5IDE5OjUwOjI3IFxyXG4gKiBATGFzdCBNb2RpZmllZCBieTogemh1eGlhb3JhblxyXG4gKiBATGFzdCBNb2RpZmllZCB0aW1lOiAyMDE3LTA4LTIwIDEyOjI0OjU4XHJcbiAqL1xyXG52YXIgTWVzc2FnZUJ1cyA9IHJlcXVpcmUoJy4vTWVzc2FnZUJ1cy5qcycpO1xyXG52YXIgRXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbHMvZXh0ZW5kLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBXb3JrZXJNc2dCdXMoKXtcclxuICAgIHRoaXMuc3VwZXIoKTtcclxuICAgIHRoaXMuX3JlY2VpdmVCdXMgPSB7fTtcclxufVxyXG5cclxuRXh0ZW5kKFdvcmtlck1zZ0J1cywgTWVzc2FnZUJ1cyk7XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLl9pbml0V29ya2VyID0gZnVuY3Rpb24oKXtcclxuICAgIG9ubWVzc2FnZSA9IHRoaXMuX29uTWVzc2FnZS5iaW5kKHRoaXMpO1xyXG59XHJcblxyXG5Xb3JrZXJNc2dCdXMucHJvdG90eXBlLl9wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uKEluZm8pe1xyXG4gICAgcG9zdE1lc3NhZ2UoSW5mbyk7XHJcbn1cclxuXHJcbldvcmtlck1zZ0J1cy5wcm90b3R5cGUub25SZWNlaXZlTWVzc2FnZSA9IGZ1bmN0aW9uKGZuKXtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gV29ya2VyTXNnQnVzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL21lc3NhZ2VCdXMvV29ya2VyTXNnQnVzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxOTo0ODo0NCBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMTo1MDoxMFxyXG4gKi9cclxuXHJcbnZhciBCYXNlUmVuZGVyU3RvcmUgPSByZXF1aXJlKCcuL0Jhc2VSZW5kZXJTdG9yZS5qcycpO1xyXG52YXIgRXh0ZW5kID0gcmVxdWlyZSgnLi4vdXRpbHMvZXh0ZW5kLmpzJyk7XHJcbnZhciBDb21waWxlciA9IHJlcXVpcmUoJy4uL2NvbXBpbGVyL3dvcmtlclRocmVhZC9jb21waWxlci5qcycpO1xyXG5cclxudmFyIGRvY3VtZW50RnJhZ21lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50RnJhZ21lbnQuanMnKTtcclxudmFyIEVsZW1lbnQgPSByZXF1aXJlKCcuLi92ZG9tL0RvY3VtZW50RnJhZ21lbnQuanMnKTtcclxuXHJcbmZ1bmN0aW9uIFJlbmRlclN0b3JlKG9iail7XHJcbiAgICB0aGlzLnN1cGVyKG9iaik7XHJcbiAgICB0aGlzLmV2ZW50cyA9IHt9O1xyXG4gICAgdGhpcy5ub2RlSWQgPSAwO1xyXG59XHJcblxyXG5FeHRlbmQoUmVuZGVyU3RvcmUsIEJhc2VSZW5kZXJTdG9yZSk7XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuX2NvbXBpbGVyID0gQ29tcGlsZXI7XHJcbiAgICB0aGlzLl90eXBlZEZsYXRlciA9IFJlbmRlclN0b3JlLnR5cGVkRmxhdGVyO1xyXG4gICAgdGhpcy52RG9tID0gdGhpcy5fY29tcGlsZSh0aGlzLkFTVCwgdGhpcy5kYXRhKTtcclxuICAgIHRoaXMucmVuZGVyZWRTdHIgPSB0aGlzLmZsYXRUb1N0cmluZyh0aGlzLnZEb20uX2NoaWxkcmVuKTtcclxufVxyXG5cclxuUmVuZGVyU3RvcmUucHJvdG90eXBlLmZsYXRUb1N0cmluZyA9IGZ1bmN0aW9uKG5vZGUpe1xyXG4gICAgaWYobm9kZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxub2RlLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gdGhpcy5mbGF0VG9TdHJpbmcobm9kZVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICByZXR1cm4gdGhpcy5mbGF0Tm9kZShub2RlKTtcclxuICAgIH1cclxuICAgIFxyXG59XHJcblxyXG5SZW5kZXJTdG9yZS5wcm90b3R5cGUuZmxhdE5vZGUgPSBmdW5jdGlvbihub2RlKXtcclxuICAgIHZhciB0YWdOYW1lID0gbm9kZS5fdGFnTmFtZSxcclxuICAgICAgICBhdHRycyA9IG5vZGUuX2F0dHJzLFxyXG4gICAgICAgIGV2ZW50cyA9IG5vZGUuX2V2ZW50cyxcclxuICAgICAgICBjaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuLFxyXG4gICAgICAgIGJvZHkgPSAnJywgYXR0clN0ciA9ICcnLCBldmVudFN0ciA9ICcnLFxyXG4gICAgICAgIG5vZGVJZCA9IHRoaXMubm9kZUlkO1xyXG4gICAgXHJcbiAgICAvKirmlofmnKzoioLngrnlpITnkIYgKi9cclxuICAgIGlmKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5o+S5YWl5a2Q6IqC54K5ICovXHJcbiAgICBmb3IodmFyIGk9MDtpPGNoaWxkcmVuLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIGJvZHkgKz0gdGhpcy5mbGF0Tm9kZShjaGlsZHJlbltpXSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqZnJhZ01lbnQgKi9cclxuICAgIGlmKG5vZGUgaW5zdGFuY2VvZiBkb2N1bWVudEZyYWdtZW50KXtcclxuICAgICAgICByZXR1cm4gYm9keTtcclxuICAgIH1cclxuXHJcbiAgICAvKirnlJ/miJDlsZ7mgKflrZfnrKbkuLIgKi9cclxuICAgIGZvcih2YXIgaj0wO2o8YXR0cnMubGVuZ3RoO2orKyl7XHJcbiAgICAgICAgYXR0clN0ciArPSAoYXR0cnNbal0ubmFtZSsnPVwiJythdHRyc1tqXS52YWx1ZSsnXCIgJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoq5LqL5Lu25aSE55CGICovXHJcbiAgICBpZihldmVudHMubGVuZ3RoKXtcclxuICAgICAgICBhdHRyU3RyICs9ICdkYXRhLW5vZGVpZD1cIicrbm9kZUlkKydcIic7XHJcbiAgICAgICAgZm9yKHZhciBoPTA7aDxldmVudHMubGVuZ3RoO2grKyl7XHJcbiAgICAgICAgICAgIGV2ZW50c1toXS52YWx1ZSArPSAnJzsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZXZlbnRzW25vZGVJZF0gPSBldmVudHM7XHJcbiAgICB9XHJcbiAgICB0aGlzLm5vZGVJZCsrO1xyXG4gICAgcmV0dXJuICc8Jyt0YWdOYW1lKycgJythdHRyU3RyK2V2ZW50U3RyKyc+Jytib2R5Kyc8LycrdGFnTmFtZSsnPic7XHJcbn0gICBcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVuZGVyU3RvcmU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RvcmUvV0tSZW5kZXJTdG9yZS5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAxIiwiLypcclxuICogQEF1dGhvcjogemh1eGlhb3JhbiBcclxuICogQERhdGU6IDIwMTctMDgtMTkgMTc6MTI6MzYgXHJcbiAqIEBMYXN0IE1vZGlmaWVkIGJ5OiB6aHV4aWFvcmFuXHJcbiAqIEBMYXN0IE1vZGlmaWVkIHRpbWU6IDIwMTctMDgtMjAgMTE6NTc6MzFcclxuICovXHJcbnZhciBhdHRyUmVzb2x2ZXIgPSByZXF1aXJlKCcuL2F0dHJSZXNvbHZlci5qcycpO1xyXG5cclxuZnVuY3Rpb24gZWxlbWVudChhc3QsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChhc3QudGFnKTtcclxuXHJcbiAgICB2YXIgYXR0cnMgPSBhc3QuYXR0cnM7XHJcbiAgICAvKirlpITnkIblsZ7mgKcgKi9cclxuICAgIGZvcih2YXIgaT0wO2k8YXR0cnMubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcclxuICAgICAgICBcclxuICAgICAgICBzd2l0Y2goYXR0ci50eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAnYXR0cmlidXRlJzogYXR0clJlc29sdmVyKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKTsgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKuWkhOeQhuWtkOiKgueCuSAqL1xyXG4gICAgaWYoYXN0LmNoaWxkcmVuKXtcclxuICAgICAgICBmb3IodmFyIGo9MDtqPGFzdC5jaGlsZHJlbi5sZW5ndGg7aisrKXtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gYXN0LmNoaWxkcmVuW2pdO1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZChjb250ZXh0Ll9jb21waWxlKGNoaWxkLCBsaXN0SW5mbykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdGV4dChhc3Qpe1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShhc3QudGV4dCk7XHJcbiAgICByZXR1cm4gbm9kZTtcclxufVxyXG5cclxuZnVuY3Rpb24gZXhwcmVzc2lvbihhc3QsIGNvbnRleHQsIGxpc3RJbmZvKXtcclxuICAgIHZhciB0ZXh0ID0gJyc7XHJcbiAgICBpZihsaXN0SW5mbyl7XHJcbiAgICAgICAgdmFyIGdldFZhbHVlID0gbmV3IEZ1bmN0aW9uKCdjJywnZCcsJ2UnLCdyZXR1cm4gKCcrYXN0LmJvZHkrJyknKTtcclxuICAgICAgICB0ZXh0ID0gZ2V0VmFsdWUoY29udGV4dCwgbGlzdEluZm8sICcnKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsJ2QnLCdlJywncmV0dXJuICgnK2FzdC5ib2R5KycpJyk7XHJcbiAgICAgICAgdGV4dCA9IGdldFZhbHVlKGNvbnRleHQsIGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGV4dCk7XHJcblxyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxpc3QoYXN0LCBjb250ZXh0KXtcclxuICAgIHZhciBsaXN0Qm9keSA9IGFzdC5ib2R5O1xyXG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICB2YXIgZ2V0VmFsdWUgPSBuZXcgRnVuY3Rpb24oJ2MnLCdkJywnZScsJ3JldHVybiAoJythc3Quc2VxdWVuY2UuYm9keSsnKScpO1xyXG4gICAgdmFyIGFycmF5RGF0YSA9IGdldFZhbHVlKGNvbnRleHQsIGNvbnRleHQuZGF0YSwgJycpO1xyXG4gICAgdmFyIHZhcmlhYmxlID0gYXN0LnZhcmlhYmxlO1xyXG5cclxuICAgIGZvcih2YXIgaj0wO2o8YXJyYXlEYXRhLmxlbmd0aDtqKyspe1xyXG4gICAgICAgIG5vZGUuYXBwZW5kKGl0ZW1Ob2RlKGxpc3RCb2R5LCBhcnJheURhdGFbal0sIGopKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpdGVtTm9kZShib2R5LCBpdGVtLCBpbmRleCl7XHJcbiAgICAgICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcbiAgICAgICAgdmFyIGxpc3RJbmZvID0ge307XHJcblxyXG4gICAgICAgIGxpc3RJbmZvW3ZhcmlhYmxlXSA9IGl0ZW07XHJcbiAgICAgICAgbGlzdEluZm9bdmFyaWFibGUrJ19pbmRleCddID0gaW5kZXg7XHJcbiAgICAgICAgZm9yKHZhciBpPTA7aTxib2R5Lmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZChjb250ZXh0Ll9jb21waWxlKGJvZHlbaV0sIGxpc3RJbmZvKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIGNvbnRleHQuX2xpc3QuZGF0YSA9IGFycmF5RGF0YTtcclxuICAgIGNvbnRleHQuX2xpc3QuYm9keSA9IGxpc3RCb2R5O1xyXG4gICAgcmV0dXJuIG5vZGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgJ2VsZW1lbnQnOiBlbGVtZW50LFxyXG4gICAgJ3RleHQnOiB0ZXh0LFxyXG4gICAgJ2V4cHJlc3Npb24nOiBleHByZXNzaW9uLFxyXG4gICAgJ2xpc3QnOiBsaXN0XHJcbn07XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29tcGlsZXIvd29ya2VyVGhyZWFkL2NvbXBpbGVyLmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDEiLCIvKlxyXG4gKiBAQXV0aG9yOiB6aHV4aWFvcmFuIFxyXG4gKiBARGF0ZTogMjAxNy0wOC0xOSAxNzoxNDozNyBcclxuICogQExhc3QgTW9kaWZpZWQgYnk6IHpodXhpYW9yYW5cclxuICogQExhc3QgTW9kaWZpZWQgdGltZTogMjAxNy0wOC0yMCAxMTo0NzowMVxyXG4gKi9cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyaWJ1dGUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIHZhbHVlVHlwZSA9IHR5cGVvZiBhdHRyLnZhbHVlO1xyXG4gICAgc3dpdGNoKHZhbHVlVHlwZSl7XHJcbiAgICAgICAgY2FzZSAnc3RyaW5nJzogbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCBhdHRyLnZhbHVlKTsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnb2JqZWN0Jzogbm9kZS5zZXRBdHRyaWJ1dGUoYXR0ci5uYW1lLCByZXNvbHZlQXR0clZhbHVlKGF0dHIsIG5vZGUsIGNvbnRleHQsIGxpc3RJbmZvKSk7IGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKGF0dHIubmFtZSA9PT0gJ2xpc3QtY29udGFpbmVyJyl7XHJcbiAgICAgICAgbm9kZS5zZXRBdHRyaWJ1dGUoJ2xpc3QtY29udGFpbmVyJywgdHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc29sdmVBdHRyVmFsdWUoYXR0ciwgbm9kZSwgY29udGV4dCwgbGlzdEluZm8pe1xyXG4gICAgdmFyIGlzRXZlbnQgPSBhdHRyLm5hbWUuc2xpY2UoMCwyKSA9PT0gJ29uJztcclxuXHJcbiAgICBpZihpc0V2ZW50KXtcclxuICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5uYW1lLnNsaWNlKDMpO1xyXG4gICAgICAgIGF0dHIudmFsdWUuYm9keSA9IGF0dHIudmFsdWUuYm9keS5yZXBsYWNlKC8nXFwkZXZlbnQnL2csICckZXZlbnQnKTtcclxuICAgICAgICB2YXIgZ2V0SGFuZGxlciA9IG5ldyBGdW5jdGlvbignYycsICdkJywgJ2UnLCAncmV0dXJuIGZ1bmN0aW9uKCRldmVudCl7cmV0dXJuICcrYXR0ci52YWx1ZS5ib2R5Kyc7fScpO1xyXG4gICAgICAgIHZhciBhcmdDb250ZXh0ID0gbGlzdEluZm8gfHwgY29udGV4dC5kYXRhO1xyXG5cclxuICAgICAgICBub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBnZXRIYW5kbGVyKGNvbnRleHQsIGFyZ0NvbnRleHQsICcnKSwgZmFsc2UsIGFyZ0NvbnRleHQpO1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHZhciBnZXRWYWx1ZSA9IG5ldyBGdW5jdGlvbignYycsJ2QnLCdlJywncmV0dXJuICgnK2F0dHIudmFsdWUuYm9keSsnKScpO1xyXG4gICAgICAgIHJldHVybiBnZXRWYWx1ZShjb250ZXh0LCBjb250ZXh0LmRhdGEsICcnKTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZXNvbHZlQXR0cmlidXRlO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBpbGVyL3dvcmtlclRocmVhZC9hdHRyUmVzb2x2ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMSJdLCJzb3VyY2VSb290IjoiIn0=