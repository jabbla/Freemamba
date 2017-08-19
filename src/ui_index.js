var Freelist = require('./store/UIRenderStore.js');
var MessageBus = require('./messageBus/MessageBus.js');

(function(root){
    if(root.NEJ && NEJ.define){
        NEJ.define([], function(){
            return {
                Freelist: Freelist,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(window && window.define){
        window.define([], function(){
            return {
                Freelist: Freelist,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(document && document.nodeType){
        window.Freelist = {
            Freelist: Freelist,
            MessageBus: MessageBus
        };
    }

    if(module && module.exports){
        module.exports = {
            Freelist: Freelist,
            MessageBus: MessageBus
        };
    }

})(this);


