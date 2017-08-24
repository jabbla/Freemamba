var diff = require('../utils/diff.js');

var COMPARE_FIELD = ['_attrs', '_events', '_tagName'];
var ADD = 'ADD';
var DELETE = 'DELETE';
var REPLACE = 'REPLACE';

var result = [];
function Differ(prevDom, curDom){
    /**添加操作 */
    if(typeof prevDom === 'undefined' && typeof curDom === 'object'){
        return { type: ADD, path: prevDom._path , curDom: curDom, prevDom: prevDom };
    }

    /**删除操作 */
    if(typeof curDom === 'undefined' && typeof prevDom === 'object'){
        return { type: DELETE, path: prevDom._path , curDom: curDom, prevDom: prevDom };
    }

    /**修改操作 */
    var diffInfo = { type: REPLACE, path: curDom._path , curDom: curDom, prevDom: prevDom};

    var prevTagName = prevDom._tagName,
        curTagName = curDom._tagName;
    
    if(diff(prevTagName, curTagName)){
        diffInfo.differ = 'tagName';
        diffInfo.prevTagName = prevTagName;
        diffInfo.curTagName = curTagName;
        return diffInfo;
    }

    /**属性diff */
    var prevAttrs = prevDom._attrs,
        curAttrs = curDom._attrs;

    if(diff(prevAttrs, curAttrs)){
        diffInfo.differ = 'attribute';
        return diffInfo;
    }

    /**children diff */
    if(prevDom._children && curDom._children){
        var prevChildren = prevDom._children,
            curChildren = curDom._children;

        for(var i=0;i<prevChildren.length;i++){
            var prevChild = prevChildren[i],
                curChild = curChildren[i],
                childDiffInfo = Differ(prevChild, curChild);
            if(childDiffInfo){
                result.push(childDiffInfo);
            }
        }
    }else if((prevDom._children && !curDom._children) || (!prevDom._children && curDom._children)){
        result.push(diffInfo);
    }

}

function mainDiff(prevRoot, curRoot){
    var diffInfo = Differ(prevRoot, curRoot);
    if(diffInfo){
        result.push(diffInfo);
        return;
    }

}

function pushChildrenToQueue(node, queue){
    if(!node._children) return;
    for(var i=0;i<node._children.length;i++){
        var child = node._children[i];
        queue.push(child);
    }
}

var prevDom = {
    _attrs: [
        {name: 'class', value: 'wraper'}
    ],
    _children: [
        {
            _attrs: [
                {name: 'list', value: 'child1'}
            ],
            _children: [
                {
                    _attrs: [
                        {name: 'list', value: 'child-child'}
                    ],
                    _children: []
                }
            ]
        },
        {
            _attrs: [
                {name: 'list1', value: 'child2'}
            ],
            _children: [
                {
                    _attrs: [
                        {name: 'list', value: 'child-child'}
                    ],
                    _children: []
                }
            ]
        }
    ]
};

var curDom = {
    _attrs: [
        {name: 'class', value: 'wraper'}
    ],
    _children: [
        {
            _attrs: [
                {name: 'list', value: 'child1'}
            ],
            _children: []
        }
    ]
};

module.exports = mainDiff;