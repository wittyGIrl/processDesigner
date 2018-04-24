# Event List

## contentchange

* 架构搭建
* 自动布局
* 双击节点文字编辑
* 节点之间的连线（子节点向父节点）
* 导入和导出（JSON格式）
* 基本键盘导航：基于位置的选择导航；Tab插入子级；Enter插入同级

## docchange

* 自由布局
* 拖动修改子级

## beforeExecCommand
* 命令执行前触发
* 返回false可以取消命令的执行
* 参数：
    ** command 命令对象本身
    ** commandName  命令名
    ** commandArgs  命令执行参数

## preExecCommand
* 命令执行前触发，在beforeExecCommand之后
* 参数：
    ** command 命令对象本身
    ** commandName  命令名
    ** commandArgs  命令执行参数

## execCommand
* 命令执行前触发，在beforeExecCommand之后
* 参数：
    ** command 命令对象本身
    ** commandName  命令名
    ** commandArgs  命令执行参数

### 事件机制

#### 事件分类

KityMinder 的事件分为：

* 交互事件: `click`, `dblclick`, `mousedown`, `mousemove`, `mouseup`, `keydown`, `keyup`, `keypress`, `touchstart`, `touchend`, `touchmove`

* Command 事件: `beforecommand`, `precommand`, `aftercommand`

* 交互事件：`selectionchange`, `contentchange`, `interactchange`

* 模块事件：模块自行触发与上述不同名的事件

#### 事件接口

`.on(event, callback)` 侦听指定事件

`.once(event, callback)` 侦听指定事件一次，当 callback 被调用之后，后面再发生该事件不再被调用

`.off(event, callback)` 取消对事件的侦听

`.fire(event, params)` 触发指定的事件，params 是自定义的 JSON 数据，会合并到事件对象


#### 回调函数接口

回调函数接收唯一的参数 e

对于交互事件，e 是原生 event 对象的一个拓展；对于需要坐标的事件，用 e.getPosition() 可以获得在 Kity Paper 上的坐标值

对 command 事件：

* `e.commandName` 获取执行的命令的类型
* `e.commandArgs` 获取命令执行的参数列表

对 import 事件：

* `e.getImportData()` 获取导入的数据

对 selectionchange 事件：

* `e.currentSelection` 获取当前选择的节点列表
* `e.additionNodes` 添加到选择节点列表的那部分节点
* `e.removalNodes` 从选择节点列表移除的那部分节点

#### 事件触发时机

`command` 事件只在顶级 command 执行的时候触发（Command 里调用 Command 不触发）

`contentchange` 事件在顶级 command 之后会查询是否发生了内容的变化，如果发生了变化，则会触发；

`selectionchange` 事件在顶级 command 之后会查询是否发生了选区的变化，如果发生了变化，则会触发

`interactchange` 事件会在所有的鼠标、键盘、触摸操作后发生，并且会进行稀释；command 可以手动触发该事件，此时不会被稀释
