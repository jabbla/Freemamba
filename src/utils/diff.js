var toString = Object.prototype.toString;

function diff(item1, item2){
    if(!isSameType(item1, item2)){
        return true;
    }
    var bool;
    switch(typeOf(item1)){
        case 'Array': 
            bool = diffArray(item1, item2); 
            break;
        case 'Object':
            bool = diffObj(item1, item2); 
            break;
        default:
            bool = item1 !== item2;
    }

    return bool;
}

function diffObj(obj1, obj2){
    if(obj1===obj2){
        return false;
    }

    var keys1 = Object.keys(obj1),
        keys2 = Object.keys(obj2);

    /**检测key数量 */
    if(keys1.length !== keys2.length){
        return true;
    }

    /**检测value */
    for(var i=0;i<keys1.length;i++){
        var value1 = obj1[keys1[i]],
            value2 = obj2[keys1[i]];

        if(!isSameType(value1, value2)) return true;

        var bool;
        switch (typeOf(value1)){
            case 'Array': 
                bool = diffArray(value1, value2); 
                break;
            case 'Object':
                bool = diffObj(value1, value2); 
                break;
            default:
                bool = value1 !== value2;
        }
        if(bool) return true;
    }
    return false;
}

function diffArray(array1, array2){
    if(array1 === array2){
        return false;
    }
    if(array1.length !== array2.length){
        return true;
    }
    for(var i=0;i<array1.length;i++){
        if(!isSameType(array1[i], array2[i])){
            return true;
        }

        var bool;
        switch (typeOf(array1[i])){
            case 'Array': 
                bool = diffArray(array1[i], array2[i]); 
                break;
            case 'Object':
                bool = diffObj(array1[i], array2[i]); 
                break;
            default: 
                bool = array1[i] !== array2[i];
        }
        if(bool) return true;
    }

    return false;
}

function isSameType(item1, item2){
    return typeOf(item1) === typeOf(item2);
}

function typeOf(item){
    
    if(typeof item !== 'object'){
        return typeof item;
    }
    return toString.call(item).slice(8, -1);
}

module.exports = diff;