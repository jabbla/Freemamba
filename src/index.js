var Freelist = require('./Freelist.js');

if(window.define){
    window.define([], function(){
        console.log('define');
        return Freelist;
    });
}
if(document && document.nodeType){
    window.Freelist = Freelist;
}
module.exports = Freelist