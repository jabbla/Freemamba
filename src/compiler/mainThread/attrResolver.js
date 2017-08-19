/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 16:51:33 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 16:53:44
 */
function resolveAttribute(attr, node, context, listInfo) {
    var valueType = typeof attr.value;
    switch (valueType) {
        case 'string': node.setAttribute(attr.name, attr.value); break;
        case 'object': node.setAttribute(attr.name, resolveAttrValue(attr, node, context, listInfo)); break;
    }

    if (attr.name === 'list-container') {
        context._list.container = node;
    }
}

 function resolveAttrValue(attr, node, context, listInfo) {
    var isEvent = attr.name.slice(0, 2) === 'on';

    if (isEvent) {
        var eventName = attr.name.slice(3);
        attr.value.body = attr.value.body.replace(/'\$event'/g, '$event');
        var getHandler = new Function('c', 'd', 'e', 'return function($event){return ' + attr.value.body + ';}');

        node.addEventListener(eventName, getHandler(context, listInfo || context.data, ''), false);
        return '';
    } else {
        var getValue = new Function('c', 'd', 'e', 'return (' + attr.value.body + ')');
        return getValue(context, context.data, '');
    }
}

module.exports = resolveAttribute;