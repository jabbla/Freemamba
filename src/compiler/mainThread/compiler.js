/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:44:12 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-21 01:52:44
 */
var attrResolver = require('./attrResolver.js');
var List = require('../../list/List.js');

function element(ast, context, listInfo) {
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs, listBuffer;
    /**处理属性 */
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        if(attr.name === 'list' && attr.value){
            listBuffer = context.$list[attr.value] = new List({data: listInfo, node: node});
        }

        switch (attr.type) {
            case 'attribute': attrResolver(attr, node, context, listInfo); break;
            default:
        }
    }

    /**处理子节点 */
    if (ast.children) {
        for (var j = 0; j < ast.children.length; j++) {
            var child = ast.children[j];

            var childDom = context._compile(child, listInfo, listBuffer);

            if(child.type === 'list'){
                listBuffer.setAst(ast);
            }

            node.append(childDom);
        }
    }
    return node;
}

function text(ast) {
    var node = document.createTextNode(ast.text);
    return node;
}

function expression(ast, context, listInfo) {
    var text = '', getValue;
    
    getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
    text = getValue(context, listInfo || context.data, '');

    var node = document.createTextNode(text);

    return node;
}

function list(ast, context, listInfo, listBuffer) {
    var listBody = ast.body,
        node = document.createDocumentFragment(),
        getValue = new Function('c', 'd', 'e', 'return (' + ast.sequence.body + ')'),
        arrayData = getValue(context, listInfo || context.data, ''),
        variable = ast.variable;


    if(listBuffer){
        listBuffer.setData(arrayData);
        listBuffer.setParent(context);
        listBuffer.setName({item: variable, index: variable + '_index'});
        listBuffer.setItemBody(listBody);
    }

    for (var j = 0; j < arrayData.length; j++) {
        var listItem = itemNode(listBody, arrayData[j], j);

        listBuffer && listBuffer.addListItem(listItem.children[0]);

        node.append(listItem);
    }

    function itemNode(body, item, index) {
        var node = document.createDocumentFragment();
        var listInfo = {};

        listInfo[variable] = item;
        listInfo[variable + '_index'] = index;
        

        for (var i = 0; i < body.length; i++) {
            node.append(context._compile(body[i], listInfo));
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