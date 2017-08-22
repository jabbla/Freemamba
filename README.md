# Freemamba

## beta-0.2.0 Bug修复日志
1. Worker渲染事件绑定上下文undefined
2. MessageBus连接池
3. 增加$list获取列表实例，实现多列表
4. 增加$refs获取dom元素
5. 由于性能问题暂时取消Worker渲染，下个版本引入worker v-dom diff功能
6. 修改列表操作API名称

## 功能拓展计划
1. 多次render合并实现Batch update
2. worker中diff探查，最小化更新

## 引用
模板解析引用Regular中的Parser

## 使用说明
> 在html文件中的script标签下引入

```html
<script src="./dist/Freemamba.js"></script>
```

## Freemamba API说明
### 列表容器标识
> 在模板中的列表项容器元素的属性中添加``list``

```html
<ul list="list1"></ul>
```

```js
this.$list.list1
```

### 插入
> 在index前插入列表项

```js
this.$list.insert(index, item);
```

### 修改
> 修改指定index的列表项

```js
this.$list.modify(index, item);
```

### 删除
> 删除指定index的列表项

```js
this.$list.delete(index);
```

### 替换
> 替换整个列表数组

```js
this.$list.replace(newArray)
```

### 手动渲染

```js
this.$render()          //渲染整个组件
this.$list.render()     //渲染列表实例
```

## 例子
进入/examples查看效果以及代码




