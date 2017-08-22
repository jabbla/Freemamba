var MessageBus = Freemamba.MessageBus;
var freemamba = Freemamba.Freemamba;

var myWorker = new Worker('../../dist/Worker.js');
var tpl = document.getElementById('text').innerHTML;

var myMsgBus = new MessageBus(myWorker);

var myList = new freemamba({
    template: tpl,
    config: function(data){
        Object.assign(data, {
            tasks: [
                {name: '多次render合并'},
                {name: 'diff探查，最小化更新'},
                {name: '批量添加列表项（如果1.实现，是不是就没有必要）'}
            ],
            completed: [],
            inputText: ''
        });
    },
    onInput: function($event){
        var data = this.data;

        data.inputText = $event.target.value;
    },
    toggleCheck: function(index, item){
        var checkBox = this.$refs['check'+index];

        item.checked = !item.checked
        checkBox.checked = item.checked;

    },
    completeTask: function(index, item){
        var data = this.data,
            completed = data.completed,
            tasks = data.tasks,
            $today = this.$list.today,
            $completed = this.$list.completed;
        
        tasks.splice(index, 1);
        completed.splice(index, 0, {name: item.name, completed: true});
        
        $today.render();
        $completed.render();
    },
    batchComplete: function(){
        var data = this.data,
            tasks = data.tasks,
            completed = data.completed,
            $today = this.$list.today,
            $completed = this.$list.completed;
        
        for(var j=tasks.length-1;j>=0;j--){
            if(tasks[j].checked){
                tasks[j].completed = true;
                completed.unshift(tasks[j]);
                tasks.splice(j, 1);
            }
        }
        $today.render();
        $completed.render();
    },
    deleteTask: function(index){
        this.$list.today.delete(index);
    },
    editTask: function(index){
        var input = this.$refs['info'+index];
        input.disabled = '';
        input.focus();
    },
    onInfoEdit: function(e, task, taskIndex){
        task.name = e.target.value;
        this.$list.today.modify(taskIndex, task);
    },
    disableInfo: function(index){
        var input = this.$refs['info'+index];
        input.disabled = 'disabled';
    },
    addTask: function(e){
        var data = this.data,
            inputText = data.inputText,
            tasks = data.tasks;

        this.$list.today.insert(tasks.length, {name: inputText, checked: false, completed: false});
    },
    render: function(){
        var data = this.data;

        this.replace([{name: '朱潇然'}]);
    }
});

myList.$inject(document.getElementById('container'));