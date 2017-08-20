/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:44:12 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-21 01:52:44
 */
var attrResolver = require('./attrResolver.js');

function element(ast, context, listInfo) {
    var node = document.createElement(ast.tag);

    var attrs = ast.attrs;
    /**处理属性 */
    for (var i = 0; i < attrs.length; i++) {
        var attr = attrs[i];

        switch (attr.type) {
            case 'attribute': attrResolver(attr, node, context, listInfo); break;
            default:
        }
    }

    /**处理子节点 */
    if (ast.children) {
        for (var j = 0; j < ast.children.length; j++) {
            var child = ast.children[j];
            var childDom = context._compile(child, listInfo);

            if(child.type === 'list'){
                context._listBuffer.setAst(ast);
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
    if (listInfo) {
        getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
        text = getValue(context, listInfo, '');
    } else {
        getValue = new Function('c', 'd', 'e', 'return (' + ast.body + ')');
        text = getValue(context, context.data, '');
    }

    var node = document.createTextNode(text);

    return node;
}

function list(ast, context) {
    var listBody = ast.body;
    var node = document.createDocumentFragment();
    var getValue = new Function('c', 'd', 'e', 'return (' + ast.sequence.body + ')');
    var arrayData = getValue(context, context.data, '');
    var variable = ast.variable;

    context._listBuffer.setData(arrayData);
    context._listBuffer.setParent(context);
    context._listBuffer.setName({item: variable, index: variable + '_index'});
    context._listBuffer.setItemBody(listBody);

    for (var j = 0; j < arrayData.length; j++) {
        var listItem = itemNode(listBody, arrayData[j], j);
        context._listBuffer.addListItem(listItem.children[0]);

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