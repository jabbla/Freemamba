# Freemamba

使用方式如有不明白，可以参见example中的todoList源码

## beta-0.3.0更新日志

## 修改日志
1. Worker中Diff算法，精确更新Dom,缩小了Dom更新范围.
2. 列表单独渲染，组件渲染进行diff操作
3. 增加ref功能
4. 由于主线程与Worker的数据传递限制，性能受影响，暂时取消Worker渲染。
5. MessageBus连接池
6. 支持多列表

## 功能拓展计划
1. 多次render合并实现Batch update
2. 增加条件渲染，和嵌套列表


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
this.$list.list1.insert(index, item);
```

### 修改
> 修改指定index的列表项

```js
this.$list.list1.modify(index, item);
```

### 删除
> 删除指定index的列表项

```js
this.$list.list1.delete(index);
```

### 替换
> 替换整个列表数组

```js
this.$list.list1.replace(newArray)
```

### 手动渲染
整个组件渲染会在Worker中进行Diff探查，列表渲染为同步更新

```js
this.$render()          //渲染整个组件
this.$list.list1.render()     //渲染列表实例
```

## 例子
进入/examples查看效果以及代码




