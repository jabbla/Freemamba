/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 17:12:36 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-24 23:43:18
 */
var attrResolver = require('./attrResolver.js');

function element(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs;
    /**处理属性 */
    for(var i=0;i<attrs.length;i++){
        var attr = attrs[i];

        if(attr.name === 'list' && attr.value){
            node._listName = attr.value;
        }

        switch(attr.type){
            case 'attribute': 
                attrResolver(attr, node, context, listInfo); break;
            default:
        }
    }

    rootPath = rootPath+' '+curIndex;
    /**处理子节点 */
    if(ast.children){

        for(var j=0, nextIndex=0;j<ast.children.length;j++, nextIndex++){
            var child = ast.children[j],
                childNode = context._compile(child, listInfo, null, nextIndex, rootPath, node._listName || listName);
            
            if(child.type === 'list' || child.type === 'if'){
                nextIndex += (childNode._length-1);
            }

            if(child.type === 'list'){
                node._container = 'true';
                node._getListData = child.sequence.body;
                node._ast = ast;
            }

            node.append(childNode);
        }
    }
    
    node._path = rootPath;
    if(listName) node._listName = listName;
    
    return node;
}

function text(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var node = document.createTextNode(ast.text);

    node._path = (rootPath+' '+curIndex);
    if(listName) node._listName = listName;

    return node;
}

function expression(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var text = '', getValue;
    
    getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
    text = getValue(context, listInfo || context.data, '');

    var node = document.createTextNode(text);

    node._path = (rootPath+' '+curIndex);
    if(listName) node._listName = listName;

    return node;
}

function list(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var listBody = ast.body;
    var node = document.createDocumentFragment();
    var getValue = new Function('c','d','e','return ('+ast.sequence.body+')');
    var arrayData = getValue(context, listInfo || context.data, '');
    var variable = ast.variable;

    /**计算列表总长度 */
    node._length = arrayData.length * listBody.length;

    for(var j=0;j<arrayData.length;j++){
        node.append(itemNode(listBody, arrayData[j], j, rootPath, listName));
    }

    function itemNode(body, item, index, rootPath, listName){
        var node = document.createDocumentFragment();
        var listInfo = {};

        listInfo[variable] = item;
        listInfo[variable+'_index'] = index;
        for(var i=0;i<body.length;i++){
            var itemIndex = curIndex + (j*arrayData.length) + i;
            node.append(context._compile(body[i], listInfo, null, itemIndex, rootPath, listName));
        }

        if(listName) node._listName = listName;
        return node;
    }
    if(listName) node._listName = listName;

    return node;
}

function condition(ast, context, listInfo, listBuffer, curIndex, rootPath, listName){
    var test = ast.test, node = document.createDocumentFragment();
    var getValue = new Function('c', 'd', 'e', 'return (' + test.body + ')');
    var consequent = ast.consequent, length;

    if(getValue(context, listInfo || context.data, '')){
        for(var i=0;i<consequent.length;i++){
            var itemIndex = curIndex + i;
            node.append(context._compile(consequent[i], listInfo || context.data, listBuffer, itemIndex, rootPath, listName));
        }
        length = consequent.length;
    }else{
        length = 0;
    }
    node._length = length;

    return node;
}

module.exports = {
    'element': element,
    'text': text,
    'expression': expression,
    'list': list,
    'if': condition
};