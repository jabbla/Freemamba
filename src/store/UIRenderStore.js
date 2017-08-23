/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:21 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 22:07:20
 */

var Extend = require('../utils/extend.js');
var BaseRenderStore = require('./BaseRenderStore.js');
var Compiler = require('../compiler/mainThread/compiler.js');

/**状态枚举 */
var INITIAL_RENDER = 'INITIAL_RENDER';
var UPDATE_RENDER = 'UPDATE_RENDER';

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
    this._renderState = UPDATE_RENDER;
};

Freemamba.prototype.$render = function () {
    var self = this;
    if(this._timer){
        clearTimeout(this._timer);
    }
    
    self._render(self._renderState);
};

Freemamba.prototype._render = function(RENDER_STATE){
    this._renderSync(RENDER_STATE);
};

Freemamba.prototype._renderSync = function (RENDER_STATE) {
    var newRoot = this.domTree = this._compile(this.AST),
        containerNode = this.containerNode,
        rootNode = this.rootNode;

    this.rootNode = newRoot.children[0];
    rootNode? containerNode.replaceChild(newRoot, rootNode) : containerNode.append(newRoot);

    this.msgBus.receive({ mambaID: this._id, type: RENDER_STATE, data: { template: this.template, data: this.data }});
    this.msgBus.onSend(function(Info){
        console.log('UIbus已发送:', Info);
    });
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