var workerText = encodeURIComponent(document.getElementById('worker').innerHTML);
var myWorker = new Worker('data:text/javascript,'+workerText);


var myMsgBus = new MessageBus(myWorker);

// myMsgBus.receive({type: 'render', data: {ast: {}, data: {}}}).then(function(data){
//     alert('收到worker向主线程发送数据');
// });

// myMsgBus.onSend(function(info){
//     alert('已向worker发送 '+info.type);
// });
