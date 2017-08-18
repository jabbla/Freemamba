var Freelist = require('./Freelist.js');

(function(){
    if(NEJ && NEJ.define){
        NEJ.define([], function(){
            return Freelist;
        });
        return;
    }
    if(window.define){
        window.define([], function(){
            return Freelist;
        });
    }

    if(document && document.nodeType){
        window.Freelist = Freelist;
    }

    if(module && module.exports){
        module.exports = Freelist;
    }

})()


