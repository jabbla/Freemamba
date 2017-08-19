var MessageBus = require('./messageBus/MessageBus_worker.js');
var WKRenderStore = require('./store/WKRenderStore.js');

var myMessageBus = new MessageBus();

myMessageBus.addEvent('render', function(data){
    var store = new WKRenderStore(data);
    store.render();
    this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
});