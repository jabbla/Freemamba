var diff = require('../utils/diff.js');

var COMPARE_FIELD = ['_attrs', '_events', '_tagName'];

function Differ(prevDom, curDom){
    /**属性diff */
    var prevAttrs = prevDom._attrs,
        curAttrs = curDom._attrs;
    if(diff(prevAttrs, curAttrs)) return { diff: true, target: prevDom, source: curDom, type: 'attribute' };

    /**events */
    var prevEvents = prevDom._events,
        curEvents = curDom._events;
    if(diff(prevAttrs, curAttrs)) return { diff: true, target: prevDom, source: curDom, type: 'events' };

}

var prevDom = {
    _attrs: [
        {name: 'class', value: 'wraper'}
    ],
};

var curDom = {
    _attrs: [
        {name: 'class', value: 'wraper1'}
    ]
};

console.log(Differ(prevDom, curDom));

