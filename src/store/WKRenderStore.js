/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:44 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 11:50:10
 */

var BaseRenderStore = require('./BaseRenderStore.js');
var Extend = require('../utils/extend.js');
var Compiler = require('../compiler/workerThread/compiler.js');

var documentFragment = require('../vdom/DocumentFragment.js');
var Element = require('../vdom/DocumentFragment.js');

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