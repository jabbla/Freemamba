var MessageBus = Freemamba.MessageBus;
var freemamba = Freemamba.Freemamba;

var myWorker = new Worker('../../dist/Worker.js');
var tpl = document.getElementById('text').innerHTML;

var myMsgBus = new MessageBus(myWorker);

var myList = new freemamba({
    template: tpl,
    config: function(data){
        Object.assign(data, {
            title: 'Freelist todoList',
            user: {
                name: 'zhuxiaoran'
            },
            array: [
                {name: 'test1'},
                {name: 'test2'},
                {name: 'test3'}
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