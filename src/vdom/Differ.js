var diff = require('../utils/diff.js');
var TextNode = require('./TextNode.js');
//var COMPARE_FIELD = ['_attrs', '_events', '_tagName'];
var ADD = 'ADD';
var DELETE = 'DELETE';
var REPLACE = 'REPLACE';

function Differ(prevDom, curDom, result){
    if(typeof prevDom === 'undefined' && typeof curDom === 'undefined'){
        return;
    }
    /**添加操作 */
    if(typeof prevDom === 'undefined' && typeof curDom === 'object'){
        result.push({ type: ADD, curDom: curDom, prevDom: prevDom });
        return;
    }

    /**删除操作 */
    if(typeof curDom === 'undefined' && typeof prevDom === 'object'){
        result.push({ type: DELETE, curDom: curDom, prevDom: prevDom });
        return;
    }

    /**修改操作 */
    var diffInfo = { type: REPLACE, curDom: curDom, prevDom: prevDom};

    var prevTagName = prevDom._tagName,
        curTagName = curDom._tagName;
    
    if(diff(prevTagName, curTagName)){
        console.log(diffInfo);
        result.push(diffInfo);
        return;
    }

    /**Text node */
    if(prevDom instanceof TextNode){
        if(prevDom._value.trim() !== curDom._value.trim()){
            result.push(diffInfo);
            return;
        }
    }

    /**属性diff */
    var prevAttrs = prevDom._attrs,
        curAttrs = curDom._attrs;

    if(diff(prevAttrs, curAttrs)){
        result.push(diffInfo);
        return;
    }

    /**children diff */
    if(prevDom._children && curDom._children){
        var prevChildren = prevDom._children,
            curChildren = curDom._children;

        for(var i=0;i<prevChildren.length;i++){
            var prevChild = prevChildren[i],
                curChild = curChildren[i];
 
            Differ(prevChild, curChild, result);
        }
    }else if((prevDom._children && !curDom._children) || (!prevDom._children && curDom._children)){
        result.push(diffInfo);
    }
    return;
}

function mergeDiff(diffs){
    var listMap = {},
        result = [];
    for(var i=0;i<diffs.length;i++){
        var listName = diffs[i].prevDom._listName || diffs[i].curDom._listName,
            isContainer = diffs[i].prevDom._container || diffs[i].curDom._container;
        if(listName && !isContainer){
            if(!listMap[listName]){
                result.push(diffs[i]);
                listMap[listName] = true;
            }
        }else{
            result.push(diffs[i]);
        }
    }
    return result;
}

function mainDiff(prevRoot, curRoot){
    var result = [];
    Differ(prevRoot._children[0], curRoot._children[0], result);
    return mergeDiff(result);
}

module.exports = mainDiff;