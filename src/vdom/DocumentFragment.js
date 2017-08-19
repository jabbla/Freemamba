function documentFragment(){
    this._children = [];
}
documentFragment.prototype.append = function(node){
    this._children.push(node);
};

module.exports = documentFragment;