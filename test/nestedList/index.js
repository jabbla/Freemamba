var MessageBus = Freemamba.MessageBus;
var freemamba = Freemamba.Freemamba;

var myWorker = new Worker('../../dist/Worker.js');
var tpl = document.getElementById('text').innerHTML;

var myMsgBus = new MessageBus(myWorker);

var myList = new freemamba({
    template: tpl,
    config: function(data){
        Object.assign(data, {
            title: 'Freemamba 多级列表',
            user: {
                name: 'zhuxiaoran'
            },
            today: [
                {name: '手机', list: [{name: '锤子M1'}, {name: '小米6'}, {name: '果7'}]},
                {name: '电脑', list: [{name: '联想Y410p'}, {name: 'Dell'}, {name: 'MacBook Pro'}]},
                {name: '平板', list: [{name: 'ipad'}, {name: 'ipad pro'}, {name: 'surface'}]}
            ],
            completed: [
                {name: '实现MessageBus继承'},
                {name: '实现RenderStore继承'},
                {name: '完善工程目录'}
            ],
            inputText: '',
            msgBus: myMsgBus
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
        this.$list.cate.delete(index);
    },
    editTask: function(index){
        this.$list.completed.modify(index, {name: '朱潇然'});
    },
    addCate: function(e){
        var data = this.data,
            inputText = data.inputText,
            array = data.today;

        this.$list.cate.insert(array.length, {name: inputText, list: [{name: '1111'}, {name: '2222'}]});
    },
    render: function(){
        var data = this.data;

        this.$list.cate.replace([{name: '朱潇然'}]);
    }
});

myList.$inject(document.getElementById('container'));