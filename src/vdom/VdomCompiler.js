

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