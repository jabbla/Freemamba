var MessageBus = require('./MessageBus/MessageBus_worker.js');
var RenderStore = require('./RenderStore.js');

var myMessageBus = new MessageBus();

myMessageBus.addEvent('render', function(data){
    var store = new RenderStore(data);
    store.render();
    this.receive({type: 'render', data: {html: store.renderedStr, events: store.events}});
});