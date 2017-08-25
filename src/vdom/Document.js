var documentFragment = require('./DocumentFragment.js');
var Element = require('./Element.js');
var TextNode = require('./TextNode.js');

var proto = {
    createDocumentFragment: function(){
        return new documentFragment();
    },
    createElement: function(tagName){
        return new Element(tagName);
    },
    createTextNode: function(text){
        return new TextNode(text);
    }
};

var doc = Object.create(proto);

module.exports = doc;