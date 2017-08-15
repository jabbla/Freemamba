var tpl = document.getElementById('text').innerHTML;
var myList = new Freelist({
    template: tpl,
    data: {
        user: {
            name: 'zhuxiaoran',
            index: 0
        },
        array: [
            {name: 'test1'},
            {name: 'test2'}
        ]
    },
    test: function(e){
        console.log(e);
    },
    render: function(){
        this.$render();
    }
});

myList.$inject(document.getElementById('container'));