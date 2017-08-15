var tpl = document.getElementById('text').innerHTML;
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
            ]
        });
    },
    test: function(e){
        console.log(e);
    },
    deleteTask: function(index){
        this.$delete(index);
    },
    addTask: function(e){
        alert('add task');
    },
    render: function(){
        this.$render();
    }
});

myList.$inject(document.getElementById('container'));