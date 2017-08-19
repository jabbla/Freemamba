# Freemamba


---

## 前言

业务中碰到有4000个左右下拉选项的需求，使用Regular会造成页面卡顿，大部分时间都花费在`this._digest()`方法上，起初想把regular的脏检查放在web worker中，但是修改源码并不是一个很好的解决方案，牵扯的东西太多。

于是，Freemamba诞生了，目前还是一个比较初级的框架，跟React很像，语法类似Regular。

## 实现的特性
1. 渲染模式（除2.中方法外，可手动控制渲染）：同步渲染 、Web Worker渲染
2. 操作列表方法：插入、删除、修改、替换列表
3. Regular模版语法：数据绑定、事件绑定、列表渲染
4. 生命周期：config、init（类似Regular）
5. WebWorker vDom: Worker中的虚拟DOM（可扩展类似React的diff最小化更新）
6. MessageBus: 负责主线程和Worker的消息分发

## 计划拓展功能
1. 条件渲染和computed属性
2. 多列表以及列表嵌套
3. Worker中diff探查
4. MessageBus连接池
5. 自定义组件



## 使用说明
### /dist/Freemamba.js
Nej直接

## Freemamba API说明
### 列表容器标识
> 在模板中的列表项容器元素的属性中添加``list-container``

```html
<ul list-container></ul>
```

### 插入
> 在index前插入列表项

```js
this.$insert(index, item);
```

### 修改
> 修改指定index的列表项

```js
this.$modify(index, item);
```

### 删除
> 删除指定index的列表项

```js
this.$delete(index);
```

### 替换
> 替换整个列表数组

```js
this.$replace(newArray)
```

### 手动渲染
> 根据当前数据模型渲染，可选择是否worker渲染，默认同步渲染

```js
this.$render()          //同步渲染
this.$render(msgBug)      //worker渲染，传入MessageBus实例
```

## MessageBus API说明
> 如果Worker中渲染没必要，可以忽略这部分

你能用到它的地方：创建一个MessageBus实例，然后传给$render方法来进行worker端的渲染。

### MessageBus实例
> 创建MessageBus实例

```js
var myMsgBus = new MessageBus(myWorker);    //传入Worker实例
```

### msg.receive
> MessageBus实例接收消息，返回实例

```js
myMsgBus.receive({type: 'render', data: {}) //MessageBus实例接收消息
```

### msg.then
> 为最近接收的消息绑定回调，执行一次即销毁，一般与receive联用

```js
myMsgBus.receive(info).then()   //建议与receive联用
myMsgBus.then()                 //会在buffer中取到最近一次的消息，且与其绑定
```

### msg.onSend
> MessageBus向Worker发送消息的回调，回调中返回消息对象

```js
myMsgBus.onSend(fn);        //注册MessageBus的消息发送事件
```


## todoList例子
### 模版字符串
```html
<div id="container"></div>
<script id="text" type="text/html">
    <div class="wraper">
        <h2>{title}</h2>
        <h3>Hello,{user.name}</h3>
        <input type="text" 
            value={inputText} 
            on-input={this.onInput($event)}/> 
        <button on-click={this.addTask($event)}>添加</button>
        <button on-click={this.onReset($event)}>清空</button>
        <ul class="test test1" list-container>
            {#list array as option}
                <li>
                    {option.name}
                    <button on-click={this.deleteTask(option_index)}>删除</button>
                </li>
            {/list}
        </ul>
        <button on-click={this.render($event)}>渲染</button>
    </div>
</script>
```
### 创建实例
```js
var tpl = document.getElementById('text').innerHTML;
var myWorker = new Worker('./dist/Worker.js');
var myMsgBus = new MessageBus(myWorker);

var myList = new Freemamba({
    template: tpl,
    config: function(data){
        Object.assign(data, {
            title: 'Freemamba todoList',
            user: {
                name: 'jabbla'
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
```




