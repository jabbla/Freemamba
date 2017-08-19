/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-19 19:48:56 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-19 20:11:31
 */

var Freemamba = require('./store/UIRenderStore.js');
var MessageBus = require('./messageBus/UIMsgBus.js');

(function(root){
    if(root.NEJ && NEJ.define){
        NEJ.define([], function(){
            return {
                Freemamba: Freemamba,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(window && window.define){
        window.define([], function(){
            return {
                Freemamba: Freemamba,
                MessageBus: MessageBus
            };
        });
        return;
    }

    if(document && document.nodeType){
        window.Freemamba = {
            Freemamba: Freemamba,
            MessageBus: MessageBus
        };
    }

    if(module && module.exports){
        module.exports = {
            Freemamba: Freemamba,
            MessageBus: MessageBus
        };
    }

})(this);


