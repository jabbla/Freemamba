var document = require('./vDom/document.js');
var documentFragment = require('./vDom/documentFragment.js');
var Element = require('./vDom/Element.js');

function RenderStore(obj){
    this.ast = obj.ast;
    this.data = obj.data;
    this.events = {};
    this.nodeId = 0;

    this._list = {};
}

RenderStore.prototype.render = function(){
    var ast = this.ast,
        data = this.data;
    
    this._compiler = RenderStore.compiler;
    this._typedFlater = RenderStore.typedFlater;
    this.vDom = this._compile(ast, data);
    this.renderedStr = this.flatToString(this.vDom._children);
}

RenderStore.compiler = {
    'element': function(ast, context, listInfo){
        var node = document.createElement(ast.tag);

        var attrs = ast.attrs;
        /**处理属性 */
        for(var i=0;i<attrs.length;i++){
            var attr = attrs[i];
            
            switch(attr.type){
                case 'attribute': RenderStore.resolveAttribute(attr, node, context, listInfo); break;
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
    },
    'text': function(ast){
        var node = document.createTextNode(ast.text);
        return node;
    },
    'expression': function(ast, context, listInfo){
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
    },
    'list': function(ast, context){
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
};

RenderStore.resolveAttribute = function(attr, node, context, listInfo){
    var valueType = typeof attr.value;
    switch(valueType){
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, RenderStore.resolveAttrValue(attr, node, context, listInfo)); break;
    }

    if(attr.name === 'list-container'){
        node.setAttribute('list-container', true);
    }
    
}

RenderStore.resolveAttrValue = function(attr, node, context, listInfo){
    var isEvent = attr.name.slice(0,2) === 'on';

    if(isEvent){
        var eventName = attr.name.slice(3);
        attr.value.body = attr.value.body.replace(/'\$event'/g, '$event');
        var getHandler = new Function('c', 'd', 'e', 'return function($event){return '+attr.value.body+';}');

        node.addEventListener(eventName, getHandler(context, listInfo || context.data, ''), false);
        return '';
    }else{
        var getValue = new Function('c','d','e','return ('+attr.value.body+')');
        return getValue(context, context.data, '');
    }
}

RenderStore.prototype._compile = function(ast, listInfo){
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

RenderStore.prototype._sg_ = function(path, data){
    var result;
    if(path instanceof Event){
        result = path;
    }else{
        result = data[path];
    }
    return result;
}

module.exports = RenderStore;