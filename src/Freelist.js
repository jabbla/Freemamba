var Parser = require('./parser/parser.js');

function Freelist(config){
    var tpl = config.template;
    var data = config.data;
    
    /**配置数据模型 */
    Freelist.config(config, this);

    /**执行config */
    typeof this.config === 'function' && this.config(this.data);

    /**解析字符串--->AST树 */
    this.AST = Freelist.parse(tpl)
    
}

Freelist.parse = function(str){
    return new Parser(str).parse();
}

Freelist.config = function(config, context){
    var keys = Object.keys(config);
    for(var i=0;i<keys.length;i++){
        var value = config[keys[i]];
        context[keys[i]] = value;
    }
    /**设置列表 */
    context._list = {};

    /**设置默认data */
    context.data = config.data || {};

    /**保存设置 */
    context.define = config;
}

Freelist.compiler = {
    'element': function(ast, context, listInfo){
        var node = document.createElement(ast.tag);

        var attrs = ast.attrs;
        /**处理属性 */
        for(var i=0;i<attrs.length;i++){
            var attr = attrs[i];
            
            switch(attr.type){
                case 'attribute': Freelist.resolveAttribute(attr, node, context, listInfo); break;
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


Freelist.resolveAttribute = function(attr, node, context, listInfo){
    var valueType = typeof attr.value;
    switch(valueType){
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, Freelist.resolveAttrValue(attr, node, context, listInfo)); break;
    }

    if(attr.name === 'list-container'){
        context._list.container = node;
    }
    
}

Freelist.resolveAttrValue = function(attr, node, context, listInfo){
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

Freelist.prototype._compile = function(ast, listInfo){
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

Freelist.prototype.$inject = function(node){
    this.containerNode = node;

    this.$render()
    node.append(this.domTree);
}

Freelist.prototype.$modify = function(index, model){
    var _list = this._list,
        _listContainer = _list.container,
        _body = _list.body;

    /**设置数据模型 */
    _list.data[index] = model;

    /**Dom精确更新 */
    var targetDom = _listContainer.children[index];
    var node = this._compile(_body, {item: model, item_index: index});

    _listContainer.replaceChild(node, targetDom);
}

Freelist.prototype.$insert = function(index, model){
    var _list = this._list,
        _listContainer = _list.container,
        _body = _list.body;

    /**设置数据模型 */
    _list.data.splice(index, 0, model);

    this.$render();
}

Freelist.prototype.$delete = function(index){
     var _list = this._list,
        _listContainer = _list.container;

    /**设置数据模型 */
    _list.data.splice(index, 1);
    this.$render();
}

Freelist.prototype.$render = function(messageBus){
    if(messageBus){
        this._renderAsync(messageBus);
    }else{
        this._renderSync();
    }
}

Freelist.prototype._renderSync = function(){
    /**获得编译器 */
    this._compiler = Freelist.compiler;

    /**编译AST树--->DOM树 */
    var newRoot = this.domTree = this._compile(this.AST),
        containerNode = this.containerNode,
        rootNode = this.rootNode;

    
    this.rootNode = newRoot.children[0];
    if(rootNode){
        containerNode.replaceChild(newRoot, rootNode);
    }
}

Freelist.prototype._renderAsync = function(messageBus){
    var data = this.data,
        ast = this.AST;

    
    messageBus.receive({type: 'render', data: {ast: ast, data: data, events: Freelist.cloneEvents(this)}})
        .then(function(htmlStr){
            this.containerNode.innerHTML = htmlStr;
            console.log(htmlStr);
        }.bind(this));
}

Freelist.cloneEvents = function(freelist){
    var result = {}, define = freelist.define;

    for(var str in define){
       if(typeof define[str] === 'function'){
           result[str] = define[str]+'';
       }
    }

    return result;
}

Freelist.prototype._sg_ = function(path, data){
    var result;
    if(path instanceof Event){
        result = path;
    }else{
        result = data[path];
    }
    return result;
}
module.exports = Freelist;