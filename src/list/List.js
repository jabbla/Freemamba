/*
 * @Author: zhuxiaoran 
 * @Date: 2017-08-20 17:38:15 
 * @Last Modified by: zhuxiaoran
 * @Last Modified time: 2017-08-21 01:52:24
 */
function List(config){
    this.node = config.node;
    this.data = config.data;
    this.parent = config.parent;
    this.listItems = [];
}

List.prototype.$insert = function(index, model){
    var data = this.data;

    data.splice(index, 0, model);
    this.render();
};

List.prototype.setData = function(array){
    this.data = array;
};

List.prototype.setAst = function(ast){
    this.ast = ast;
};

List.prototype.setParent = function(parent){
    this.parent = parent;
};

List.prototype.addListItem = function(node){
    this.listItems.push(node);
};

List.prototype.setItemBody = function(body){
    this.itemAst = body;
};

List.prototype.getNode = function(){
    return this.node;
};

List.prototype.setName = function(config){
    this.itemName = config.item;
    this.indexName = config.index;
};

List.prototype.$modify = function(index, model){
    var targetDom = this.listItems[index],
        itemAst = this.itemAst, itemName = this.itemName,
        indexName = this.indexName, tempListData = {};
    
    tempListData[itemName] = model;
    tempListData[indexName] = index;

    var newChild = this.parent._compile(itemAst, tempListData);

    this.listItems[index] = newChild.children[0];
    this.data[index] = model;
    this.node.replaceChild(newChild, targetDom);
};

List.prototype.$delete = function(index){
    this.data.splice(index, 1);
    this.render();
};

List.prototype.$replace = function(newListData){
    List.replaceList(this.data, newListData);
    this.render();
};

List.prototype.render = function(){
    this.listItems = [];
    this.node.innerHTML = '';

    var newBody = this.parent._compile(this.ast.children, null, this);
    this.node.append(newBody);
};

List.replaceList = function (oldList, newList) {
    for (var i = oldList.length - 1; i >= 0; i--) {
        if (typeof newList[i] === 'undefined') {
            oldList.splice(i, 1);
        } else {
            oldList[i] = newList[i];
        }
    }
};

module.exports = List;