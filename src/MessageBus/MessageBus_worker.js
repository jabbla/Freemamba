var MessageBS, RenderSt, document, documentFg, Elementt;

        /*MessageBus类*/
        !(function(){
            MessageBS = MessageBus;
            function MessageBus(){
                this._onSendWorker = [];
                this._initWorker();
                this._createEventsStore();
            }

            MessageBus.prototype._createEventsStore = function(){
                this._eventsStore = {};
            }

            MessageBus.prototype._initWorker = function(){
                var _worker = this._worker;

                onmessage = this._onWorkerMessage.bind(this);
            }

            MessageBus.prototype._onWorkerMessage = function(message){

                this._deserialize(message);
            }

            MessageBus.prototype.receive = function(message){
                this._buffer = message;

                this._serialize(message);
                return this;
            }

            MessageBus.prototype._deserialize = function(message){
                var type = message.data.type,
                    data = message.data.data;

                this._emit(type, data);
            }

            MessageBus.prototype._serialize = function(message){
                var Info = {};

                Info.type = message.type;
                Info.data = message.data;

                this._sendInfoToMain(Info);
                return this;
            }

            MessageBus.prototype.addEvent = function(eventType, fn){
                this._register(eventType, fn.bind(this));
            }

            MessageBus.prototype._sendInfoToMain = function(Info){
                var _onSendWorker = this._onSendWorker;
                postMessage(Info);

                setTimeout(function(){
                    if(_onSendWorker.length) this._checkWatchers(_onSendWorker, Info);
                }.bind(this), 0);
            }

            MessageBus.prototype._checkWatchers = function(watchers, Info){
                for(var i=0, watcher;i<watchers.length;i++){
                    watcher = watchers[i];
                    watcher.call(this, Info);
                }
            }

            MessageBus.prototype.onSend = function(fn){
                this._onSendWorker.push(fn.bind(this));
            }

            MessageBus.prototype.then = function(fn){
                var message = this._buffer;
                this._register(message.type, fn);
                
                return this;
            }

            MessageBus.prototype._register = function(eventName, fn){
                var _eventsStore = this._eventsStore;

                if(_eventsStore[eventName])
                    _eventsStore[eventName].watchers.push(fn);
                else
                    _eventsStore[eventName] = {watchers: [fn]};
            }

            MessageBus.prototype._emit = function(eventName, data){
                var _eventsStore = this._eventsStore;

                if(_eventsStore[eventName] && _eventsStore[eventName].watchers.length)
                    this._executeWatchers(_eventsStore[eventName].watchers, data);
            }

            MessageBus.prototype._executeWatchers = function(watchers, data){
                for(var i=0, watcher;i<watchers.length;i++){
                    watcher = watchers[i];
                    watcher.call(this, data);
                }
            }
        })();

        /**document方法 */
        !(function(){
            var proto = {
                createDocumentFragment: function(){
                    return new documentFg();
                },
                createElement: function(tagName){
                    return new Elementt(tagName);
                },
                createTextNode: function(text){
                    return text;
                }
            };

            document = Object.create(proto);
        })();

        /**documentFragment类 */
        !(function(){
            documentFg = documentFragment;

            function documentFragment(){
                this._children = [];
            }
            documentFragment.prototype.append = function(node){
                this._children.push(node);
            };
        })();

        /**Element类 */
        !(function(){
            Elementt = Element;
 
            function Element(tagName){
                this._tagName = tagName;
                this._attrs = [];
                this._events = [];
                this._children = [];
            }

            Element.prototype.setAttribute = function(attrName, attrValue){
                this._attrs.push({name: attrName, value: attrValue});
            };

            Element.prototype.addEventListener = function(eventName, handler){
                this._events.push({name: eventName.replace(/-/, ''), value: handler});
            };

            Element.prototype.append = function(node){
                this._children.push(node);
            };
        })();

        /*RenderStore类*/
        !(function(){
            RenderSt = RenderStore;

            function RenderStore(obj){
                this.ast = obj.ast;
                this.data = obj.data;
                this._list = {};
            }

            RenderStore.prototype.render = function(){
                var ast = this.ast,
                    data = this.data;
                
                this._compiler = RenderStore.compiler;
                this._typedFlater = RenderStore.typedFlater;
                this.vDom = this._compile(ast, data);
                this.renderedStr = this.flatToString(this.vDom._children);
            }

            RenderStore.compiler = {
                'element': function(ast, context, listInfo){
                    var node = document.createElement(ast.tag);

                    var attrs = ast.attrs;
                    /**处理属性 */
                    for(var i=0;i<attrs.length;i++){
                        var attr = attrs[i];
                        
                        switch(attr.type){
                            case 'attribute': RenderStore.resolveAttribute(attr, node, context, listInfo); break;
                        }
                    }

                    /**处理子节点 */
                    if(ast.children){
                        for(var j=0;j<ast.children.length;j++){
                            var child = ast.children[j];
                            node.append(context._compile(child, listInfo));
                        }
                    }

                    return node;
                },
                'text': function(ast){
                    var node = document.createTextNode(ast.text);
                    return node;
                },
                'expression': function(ast, context, listInfo){
                    var text = '';
                    if(listInfo){
                        var getValue = new Function('c','d','e','return ('+ast.body+')');
                        text = getValue(context, listInfo, '');
                    }else{
                        var getValue = new Function('c','d','e','return ('+ast.body+')');
                        text = getValue(context, context.data, '');
                    }

                    var node = document.createTextNode(text);

                    return node;
                },
                'list': function(ast, context){
                    var listBody = ast.body;
                    var node = document.createDocumentFragment();
                    var getValue = new Function('c','d','e','return ('+ast.sequence.body+')');
                    var arrayData = getValue(context, context.data, '');
                    var variable = ast.variable;

                    for(var j=0;j<arrayData.length;j++){
                        node.append(itemNode(listBody, arrayData[j], j));
                    }

                    function itemNode(body, item, index){
                        var node = document.createDocumentFragment();
                        var listInfo = {};

                        listInfo[variable] = item;
                        listInfo[variable+'_index'] = index;
                        for(var i=0;i<body.length;i++){
                            node.append(context._compile(body[i], listInfo));
                        }
                        return node;
                    }
                    context._list.data = arrayData;
                    context._list.body = listBody;

                    return node;
                }
            };

            RenderStore.resolveAttribute = function(attr, node, context, listInfo){
                var valueType = typeof attr.value;
                switch(valueType){
                    case 'string': node.setAttribute(attr.name, attr.value); break;
                    case 'object': node.setAttribute(attr.name, RenderStore.resolveAttrValue(attr, node, context, listInfo)); break;
                }

                if(attr.name === 'list-container'){
                    context._list.container = node;
                }
                
            }

            RenderStore.resolveAttrValue = function(attr, node, context, listInfo){
                var isEvent = attr.name.slice(0,2) === 'on';

                if(isEvent){
                    var eventName = attr.name.slice(3);
                    attr.value.body = attr.value.body.replace(/'\$event'/g, '$event');
                    var getHandler = new Function('c', 'd', 'e', 'return function($event){return '+attr.value.body+';}');

                    node.addEventListener(eventName, getHandler(context, listInfo || context.data, ''), false);
                    return '';
                }else{
                    var getValue = new Function('c','d','e','return ('+attr.value.body+')');
                    return getValue(context, context.data, '');
                }
            }

            RenderStore.prototype._compile = function(ast, listInfo){
                if(ast instanceof Array){
                    var node = document.createDocumentFragment();
                    for(var i=0;i<ast.length;i++){
                        node.append(this._compile(ast[i], listInfo));
                    }
                    return node;
                }else{
                    return this._compiler[ast.type](ast, this, listInfo);
                }
            }

            RenderStore.prototype.flatToString = function(node){
                if(node instanceof Array){
                    var result = '';
                    for(var i=0;i<node.length;i++){
                        result += this.flatToString(node[i]);
                    }
                    return result;
                }else{
                    return this.flatNode(node);
                }
                
            }

            RenderStore.prototype.flatNode = function(node){
                var tagName = node._tagName,
                    attrs = node._attrs,
                    events = node._events,
                    children = node._children,
                    body = '', attrStr = '', eventStr = '';
                
                /**文本节点处理 */
                if(typeof node === 'string'){
                    return node;
                }

                /**插入子节点 */
                for(var i=0;i<children.length;i++){
                    body += this.flatNode(children[i]);
                }

                /**fragMent */
                if(node instanceof documentFg){
                    return body;
                }
                /**生成属性字符串 */
                for(var j=0;j<attrs.length;j++){
                    attrStr += (attrs[j].name+'="'+attrs[j].value+'" ');
                }

                /**生成事件字符串 */
                for(var k=0;k<events.length;k++){
                    eventStr += ('on'+events[k].name+'='+'"'+events[k].value+'" ');
                }

                return '<'+tagName+' '+attrStr+eventStr+'>'+body+'<'+tagName+'/>';
            }   

            RenderStore.prototype._sg_ = function(path, data){
                var result;
                if(path instanceof Event){
                    result = path;
                }else{
                    result = data[path];
                }
                return result;
            }
        })();

        /**执行线程 */
        !(function(){
            var messageBus = new MessageBS();

            /*监听render*/
            messageBus.addEvent('render', function(data){
                var rd = new RenderSt(data);
                rd.render();
                console.log(rd.vDom);
                console.log(rd.renderedStr);
                this.receive({type: 'render', data: '<div></div>'});
            });

        })();