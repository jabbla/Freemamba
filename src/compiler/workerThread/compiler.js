/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-20 13:34:07
 */
var attrResolver = require('./attrResolver.js');

function element(ast, context, listInfo, listBuffer, curIndex, rootPath){
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

    rootPath = rootPath+' '+curIndex;
    /**处理子节点 */
    if(ast.children){
        for(var j=0;j<ast.children.length;j++){
            var child = ast.children[j];
            node.append(context._compile(child, listInfo, null, j, rootPath));
        }
    }
    
    node._path = rootPath;

    return node;
}

function text(ast, context, listInfo, listBuffer, curIndex, rootPath){
    var node = document.createTextNode(ast.text);

    node._path = (rootPath+' '+curIndex);
    return node;
}

function expression(ast, context, listInfo, listBuffer, curIndex, rootPath){
    var text = '', getValue;
    
    getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
    text = getValue(context, listInfo || context.data, '');

    var node = document.createTextNode(text);

    node._path = (rootPath+' '+curIndex);

    return node;
}

function list(ast, context, listInfo, listBuffer, curIndex, rootPath){
    var listBody = ast.body;
    var node = document.createDocumentFragment();
    var getValue = new Function('c','d','e','return ('+ast.sequence.body+')');
    var arrayData = getValue(context, listInfo || context.data, '');
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
            node.append(context._compile(body[i], listInfo, null, index*body.length+i, rootPath+' '+curIndex));
        }

        return node;
    }

    return node;
}


module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list
};