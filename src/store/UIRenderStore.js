/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:21 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-25 07:42:29
 */

var Extend = require('../utils/extend.js');
var BaseRenderStore = require('./BaseRenderStore.js');
var Compiler = require('../compiler/mainThread/compiler.js');
var VdomCompiler = require('../vdom/VdomCompiler.js');

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
    console.log(this.AST);
    self._render(self._renderState);
    console.log(this.domTree);
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
    console.log(source, targetDom);
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