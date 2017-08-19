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

Element.prototype.addEventListener = function(eventName, handler){
    this._events.push({name: eventName.replace(/-/, ''), value: handler});
};

Element.prototype.append = function(node){
    this._children.push(node);
};

module.exports = Element;