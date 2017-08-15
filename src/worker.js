function WorkerT(){

}

WorkerT.prototype.receive = function(info){
    this.onmessage(info);
}

WorkerT.prototype.onmessage = function(opt){
    var type = opt.type;

    switch(type){
        case 'COMPILE': this.compile(opt.ast, opt.model); break;
    }
}

/**解析模版字符串 */
WorkerT.prototype.compile(ast, model){
    var result;
    this.sendMessageCenter('COMPILE', result);
}

/**信息发送中心 */
WorkerT.prototype.sendMessageCenter(type, result){

    switch(type){
        case 'COMPILE': this.postMessage({type: 'COMPILE', data: opt.result})
    }
}