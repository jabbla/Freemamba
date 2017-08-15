module.exports = {
    walk: function(List){
        var ast = List.ast;

        this.target = List;

        this.walkIt(ast);
    },
    walkIt: function(ast){
        if(typeof ast === 'undefined') return;
        if(ast instanceof Array){
            for(var i=0,item;i<ast.length;i++){
                item = ast[i];
                if(!this.findListAndItem(item)) this.walkIt(item.children);
            }
            return;
        }
    },
    findListAndItem: function(astItem){
        
        if(astItem.type !== 'element') return false;
        if(astItem.children.length <= 0) return false;

        var list = astItem.children.filter(function(item){return item.type === 'list'});
        if(!list.length) return false;
        
        var listBody = list[0].body;
        

        this.target._container = astItem;
        this.target._listItem = listBody;

        
        return true;
    },
}