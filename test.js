var tpl = document.getElementById('text').innerHTML;

var myWorker = new Worker('./dist/Worker.js');

var myMsgBus = new MessageBus(myWorker);

var myList = new Freelist({
    template: tpl,
    config: function(data){
        Object.assign(data, {
            title: 'Freelist todoList',
            user: {
                name: 'zhuxiaoran'
            },
            array: [
                {name: 'Worker渲染'},
                {name: 'Computed属性实现'},
                {name: '完善文档'},
                {name: 'Worker中diff且render'}
            ],
            inputText: ''
        });
    },
    onInput: function($event){
        var data = this.data;

        data.inputText = $event.target.value;
    },
    onReset: function(e){
        var data = this.data;

        data.inputText = '';
        this.$render();
    },
    deleteTask: function(index){
        this.$delete(index);
    },
    addTask: function(e){
        var data = this.data,
            inputText = data.inputText,
            array = data.array;
        
        this.$insert(array.length, {name: inputText});
    },
    render: function(){
        var data = this.data;

        this.$replace([{name: '朱潇然'}]);
        this.$render(myMsgBus);
    }
});

myList.$inject(document.getElementById('container'));