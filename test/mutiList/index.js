var MessageBus = Freemamba.MessageBus;
var freemamba = Freemamba.Freemamba;

var myWorker = new Worker('../../dist/Worker.js');
var tpl = document.getElementById('text').innerHTML;

var myMsgBus = new MessageBus(myWorker);

var myList = new freemamba({
    template: tpl,
    config: function(data){
        Object.assign(data, {
            title: 'Freemamba todoList',
            user: {
                name: 'zhuxiaoran'
            },
            today: [
                {name: 'test1'},
                {name: 'test2'},
                {name: 'test3'}
            ],
            completed: [
                {name: '实现MessageBus继承'},
                {name: '实现RenderStore继承'},
                {name: '完善工程目录'}
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
        this.$list.today.$delete(index);
    },
    edit: function(index){
        this.$list.today.$modify(index, {name: '朱潇然'});
    },
    addTask: function(e){
        var data = this.data,
            inputText = data.inputText,
            array = data.today;

        this.$list.today.$insert(array.length, {name: inputText});
    },
    render: function(){
        var data = this.data;

        this.$replace([{name: '朱潇然'}]);
        this.$render(myMsgBus);
    }
});

myList.$inject(document.getElementById('container'));