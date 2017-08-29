var List = require('../list/List.js');

function vdomCompiler(vdom, context){
    this._vdom = vdom;
    this._context = context;
}

vdomCompiler.prototype.compile = function(vdom){
    vdom = vdom || this._vdom;
    return this['_'+this._typeof(vdom)](vdom);
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

vdomCompiler.prototype._Element = function(vdom, listInfo){
    var context = this._context;
    var self = this;
    /**处理List */
    if(vdom._container){
        var listNode;
        if(context.$list[vdom._listName]){
            listNode = context.$list[vdom._listName].node;
        }else{
            listNode = document.createElement(vdom._tagName);
            console.log(vdom);
            var getListData = new Function('c','d','e','return ('+vdom._getListData+')');
            var arrayData = getListData(context, context.data, '');
            var ListComponent = new List({
                node: listNode,
                data: arrayData,
                parent: context
            });
            ListComponent.setAst(vdom._ast);

            vdom._children.forEach(function(item){
                var child = self.compile(item, arrayData);
                ListComponent.addListItem(child);
                listNode.append(child);
            });

            context.$list[vdom._listName] = ListComponent;
        }
        return listNode;
    }

    var node = document.createElement(vdom._tagName);

    /**设置属性 */
    for(var i=0;i<vdom._attrs.length;i++){
        if(vdom._attrs[i].name === 'ref'){
            context.$refs[vdom._attrs[i].value] = node;
        }
        node.setAttribute(vdom._attrs[i].name, vdom._attrs[i].value);
    }

    /**设置事件 */
    for(var j=0;j<vdom._events.length;j++){
        var handlerStr = vdom._events[j].value;
        var handler = new Function('c', 'd', 'e', 'return ' + handlerStr + ';');
        node.addEventListener(vdom._events[j].name, handler(context, listInfo || context.data, ''), false);
    }

    /**生成子节点 */
    var children = document.createDocumentFragment();
    for(var k=0;k<vdom._children.length;k++){ 
        children.append(this.compile(vdom._children[k]));
    }
    node.append(children);

    return node;
};

vdomCompiler.prototype._DocumentFragment = function(vdom){
    var node = document.createDocumentFragment();
    var self = this;

    if(vdom._ast && vdom._ast.type === 'list'){
        console.log(vdom._ast);
    }
    vdom._children.forEach(function(item){
        node.append(self.compile(item));
    });
    return node;
};

vdomCompiler.prototype._ListElement = function(vdom){

};

module.exports = vdomCompiler;