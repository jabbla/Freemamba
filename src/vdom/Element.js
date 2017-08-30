var documentFragment = require('./DocumentFragment.js');

function Element(tagName){
    this._tagName = tagName;
    this._attrs = [];
    this._events = [];
    this._children = [];
}

Element.prototype.setAttribute = function(attrName, attrValue){
    var eventPattern = /on-/;

    if(eventPattern.test(attrName)) return;

    this._attrs.push({name: attrName, value: attrValue});
};

Element.prototype.addEventListener = function(eventName, handler, isPop, argContext){
    this._events.push({name: eventName.replace(/-/, ''), value: handler+'', context: argContext});
};

Element.prototype.append = function(node){
    // if(node instanceof documentFragment){
    //     for(var i=0;i<node._children.length;i++){
    //         this._children.push(node._children[i]);     
    //     }
    //     return;
    // }
    this._children.push(node);
};

module.exports = Element;