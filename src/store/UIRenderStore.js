/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:21 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 22:07:20
 */

var Extend = require('../utils/extend.js');
var BaseRenderStore = require('./BaseRenderStore.js');
var Compiler = require('../compiler/mainThread/compiler.js');

function Freemamba(config) {
    this.super(config);
    this._compiler = Compiler;
}

Extend(Freemamba, BaseRenderStore);

Freemamba.replaceList = function (oldList, newList) {
    for (var i = oldList.length - 1; i >= 0; i--) {
        if (typeof newList[i] === 'undefined') {
            oldList.splice(i, 1);
        } else {
            oldList[i] = newList[i];
        }
    }
};

Freemamba.prototype.$inject = function (node) {
    this.containerNode = node;

    this.$render();
    node.append(this.domTree);
};

Freemamba.prototype.$render = function (workerRender) {
    workerRender? this._renderAsync(workerRender) : this._renderSync();
};

Freemamba.prototype._renderSync = function () {
    var newRoot = this.domTree = this._compile(this.AST),
        containerNode = this.containerNode,
        rootNode = this.rootNode;

    this.rootNode = newRoot.children[0];
    if (rootNode) {
        containerNode.replaceChild(newRoot, rootNode);
    }
};

Freemamba.prototype._renderAsync = function (workerRender) {

    workerRender.receive({ type: 'render', data: { template: this.template, data: this.data } })
        .then(function (data) {
            this.containerNode.innerHTML = data.html;
            this.rootNode = this.containerNode.children[0];

            Freemamba.addAsyncEvents.call(this, this.rootNode, data.events);
        }.bind(this));
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