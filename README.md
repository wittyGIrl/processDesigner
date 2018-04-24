流程设计器
==
# 简介

witdesigner是一款在线的流程图设计工具，除基本的流程设计以外，还提供了复制粘贴，撤销重做，自动保存等功能，同时支持快捷键操作，让使用者可以方便快捷的在浏览器中实现流程图的设计工作。

# 代码

witdesigner一个复杂的单页应用，代码主要分为src和ui两个部分，src是流程设计器的核心部分，主要实现节点和连线的渲染和交互等核心逻辑。而ui主要实现是流程设计器的界面部分。应用的架构是SVG+jQuery+grunt。

下面详细介绍src部分的代码结构（可以综合 doc/ 中的百度脑图的文档看）

暴漏的全局变量为 window.witdesigner，所有需要暴漏给外部的模块全部注册在其上。

### 核心类介绍

#### Designer
应用本身

#### DesignerNode
节点本身，只关注节点的数据以及与其他节点或者线的关系，而不关心显示。一个节点包含children，parent，root，data（数据）。

#### DesignerLine
线本身，只关注线的数据以及与其他节点的关系，而不关心显示。

#### Module
核心的模块系统。

#### Renderer
所有Renderer的抽象基类，用来渲染节点，只关注显示。一个节点包含一个Renderer的集合，该集合决定了一个节点全部的可视元素，每个renderer负责渲染一个节点的一个可见部分。例如，TextRenderer负责渲染节点上的文字。同时类似与html元素的盒模型，一个节点所占据的区域也可以分为，content，padding，border，margin几个部分。这些全部是通过Renderer来实现。

#### Layout
封装节点位置的相关逻辑，并提供对齐的相关方法。

#### Command
命令模式的一个基本实现，通过此类来进行对状态的记录，从而实现撤销重做等功能。设计器中的交互几乎都设置为一种命令，这样用户的整个操作的过程都被记录了下来，应用的状态变得可追溯。

#### Event
事件机制

### 其他

#### 主题
核心功能支持主题的切换，详见 /theme ，但目前只设置了一种主题，所以界面上这个功能没有开放出来。

#### 多语言
核型功能支持切换不同的语言，只需要增加语言文件即可。

#### SVG
SVG的操作通过库[kity.js](https://github.com/fex-team/kity)

#### JsonEditor
为了解决设计器中负责的属性编辑，专门基于 React+Flux 开发的组件，代码在另外一个项目中。

# 开发环境

安装nodejs

```
npm install（npm若被墙，可以用 cnpm install）
npm run release
npm run lib
浏览器中打开 example／demo.html
修改代码后，重新打包生成才能见到效果。
```

# 发布代码

```
npm run release 打包压缩witsigner.js
npm run releaselib 打包压缩lib.js
```

# 语义化版本号
发布代码的版本号遵循[语义化版本号](http://semver.org/lang/zh-CN/)
同时发布日志CHANGELOG.md会记录改动点。

# 兼容性

witdesigner 基于 SVG 技术实现，支持绝大多数的 HTML5 浏览器，包括：

1. Chrome
2. Firefox
3. Safari
4. Internet Explorer 10 或以上
