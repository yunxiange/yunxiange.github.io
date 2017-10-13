---
title: Web开发演化
date: 2017-10-11 20:40:53
tags: project
---

随着时间推移，web开发带来了戏剧性变化，现代化web开发包含了一系列的工具、方法和概念。这些工具可能很复杂，但可以创建以前不可能实现的具有更快的开发速度和更好的可维护性的强大的应用程序。

## Web开发简史

### Web 1.0（1991-2001）

这段时期典型的站点是由静态的html页面构成，在全球的城市或大学页面上托管，采用FrontPage、DreamWeaver或Notepad写成。

![2017-10-11-web1.0](/assets/201710/2017-10-11-web1.0.png)

#### Web 1.0：技术

CGI-BIN和Perl
PHP和ASP

#### Web 1.0：交互

HTML表单
Java applets
ActiveX controls
动态HTML（DHTML）

![2017-10-11-web1.0-interactivity](/assets/201710/2017-10-11-web1.0-interactivity.png)

#### Web 1.0：浏览器

Mosaic
Netscape
Internet Explorer

![2017-10-11-web1.0-browsers](/assets/201710/2017-10-11-web1.0-browsers.png)

#### Web 1.0：代码共享

脚本网站

![2017-10-11-web1.0-code-sharing](/assets/201710/2017-10-11-web1.0-code-sharing.png)

#### Web 1.0：里程碑

HTML、CSS和JavaScript发明
Java和Flash发明
采用img和iframe标签实现的多媒体
blink和marquee标签

### Web 2.0（2001-2010）

这个阶段的网站采用服务端渲染页面，MySQL数据库，运行在J2EE、Rails或者PHP上。

![2017-10-11-web2.0](/assets/201710/2017-10-11-web2.0.png)

#### Web 2.0：服务端技术

J2EE、ASP.NET、Rails、Django、LAMP
单独架构

![2017-10-11-web2.0-server-technologies](/assets/201710/2017-10-11-web2.0-server-technologies.png)

#### Web 2.0：客户端技术

Ajax（Asynchronous JavaScript And XML）
MOOTOOLS（A COMPACT JAVASCRIPT FRAMEWORK）
prototype
jQuery

![2017-10-11-web2.0-client-technologies](/assets/201710/2017-10-11-web2.0-client-technologies.png)

#### Web 2.0：浏览器

IE6
Mozilla（Firefox）
IE6 → IE8
ACID测试

![2017-10-11-web2.0-browsers](/assets/201710/2017-10-11-web2.0-browsers.png)

#### Web 2.0：富应用

插件：Flash、Silverlight
Web组件框架：GWT、EXT、YUI

![2017-10-11-web2.0-rich-interactive-applications](/assets/201710/2017-10-11-web2.0-rich-interactive-applications.png)

#### Web 2.0：代码共享

Sourceforge
Google Code

![2017-10-11-web2.0-code-sharing](/assets/201710/2017-10-11-web2.0-code-sharing.png)

#### Web 2.0：数据传输

XML
SOAP/WS-*

![2017-10-11-web2.0-data-transfer](/assets/201710/2017-10-11-web2.0-data-transfer.gif)

#### Web 2.0：里程碑

AJAX, JSON
Mobile
Stack Overflow!

### 现代时期（2010-至今）

这个时期网站典型的特点是客户端JS、JSON API、跑在云服务上基于Node构建的微服务、NoSQL数据库。

![2017-10-11-modern-era](/assets/201710/2017-10-11-modern-era.png)

#### 现代时期：服务端技术

express+node+mongodb
Play Framework（build web applications with Java & Scala）

amazon web services
HEROKU
Microsoft Azure

Flask
Dropwizard

![2017-10-11-modern-era-server-technologies](/assets/201710/2017-10-11-modern-era-server-technologies.png)

#### 现代时期：客户端技术

BACKBONE.JS、ANGULARJS
ember.js、React
Bootstrap、Foundation、Semantic UI

![2017-10-11-modern-era-client-technologies](/assets/201710/2017-10-11-modern-era-client-technologies.png)

#### 现代时期：浏览器

Chrome、IE → Edge、Firefox、Safari
长青版本（Can I use）

![2017-10-11-modern-era-browsers](/assets/201710/2017-10-11-modern-era-browsers.png)

#### 现代时期：HTML5

Web Workers
HTML(5)、CSS(3)、Websockets、WebGL、FLEX

![2017-10-11-modern-era-html5](/assets/201710/2017-10-11-modern-era-html5.png)

#### 现代时期：代码共享

github
npm

![2017-10-11-modern-era-code-sharing](/assets/201710/2017-10-11-modern-era-code-sharing.png)

#### 现代时期：数据传输

JSON over HTTP

![2017-10-11-modern-era-data-transfer](/assets/201710/2017-10-11-modern-era-data-transfer.png)

#### 现代时期：里程碑

Node.js
插件之死（Flash）

![2017-10-11-modern-era-milestones](/assets/201710/2017-10-11-modern-era-milestones.png)

## Web技术时间线

![Timeline of Web Technologies](/assets/201710/2017-10-11-timeline-of-web-technologies.png)

## JavaScript简史

- 1995：网景公司Brendan Eich发明JavaScript语言
- 1999：ES3规范敲定；微软发明XMLHttpRequest
- 2001：Douglas Crockford推广JSON格式
- 2005：推广“AJAX”术语
- 2006：John Resig发明jQuery
- 2008：Douglas Crockford出版《JavaScript：the Good Parts》
- 2009：ES5规范敲定；Ryan Dahl发明Node.js
- 2010：Underscore.js、Backbone.js、由Jeremy Ashkenas发明CoffeeScript
- 2015：ES6规范敲定

![2017-10-11-ecmascript-releases](/assets/201710/2017-10-11-ecmascript-releases.png)

## 现代Web开发景观

### 现代Web开发：这是什么？

![2017-10-11-modern-web-devlopment-wat-is-this](/assets/201710/2017-10-11-modern-web-devlopment-wat-is-this.png)

### JavaScript/Client挑战

>JavaScript设计的目的是当你放在页面上能让它跳动起来。脚本通常是一行。我们认为10行脚本是非常正常的，100行脚本是巨大的，1000行脚本闻所未闻。这门语言最初绝不是用来搞大型的编程，我们的实现方案、性能指标都是未知的。
前微软IE/JS开发者Eric Lippert
[http://programmers.stackexchange.com/a/221658/214387](http://programmers.stackexchange.com/a/221658/214387)

- 无内置的模块定义系统
- 无封装
- 与大多数语言不同的采用原型继承系统
- 无静态类型的声明或编译
- 动态修改的对象和数据
- 最小标准库
- 浏览器功能变化
- 文档布局模型应用在应用程序布局

### JavaScript/Client开发目标

- 网络字节最小化
- 处理浏览器兼容性问题
- 填补JS标准库与语言规范间的空白
- 在应用程序之间重用和共享代码
- 构建越来越复杂的大型浏览器端应用程序

>人们认为写客户端应用程序很容易，这就是人们出现混乱、没有组合、成千上万条意大利面条式丑陋代码境况的原因。在浏览器中编写应用程序应该与建立数据或者创建一个服务层一样受尊重。对前端代码缺乏尊重是前端项目出现糟糕代码的最大原因。
是的，你将需要使用工具webpack、jspm、browserify配合babel、typescript以及postcss、less、scss来开发。就像你为桌面应用程序编写代码一样，你可能至少需要安装一个IDE并且可能需要几个库。···得到一个Java应用程序需要些什么呢？Maven，一些构建工具，一些其他的工具，理解组件/类的层级？使用任何新的工具都不容易。
[https://news.ycombinator.com/item?id=11782234](https://news.ycombinator.com/item?id=11782234)

### 现代工具：语言/编译器

- ES6/ES2015(+)
 - 当前版本语言规范
 - 浏览器和JS引擎跟进实现
 - 分阶段发展未来提议的语言特性
- Babel
 - 基于插件的JavaScript混合编译器
 - 广泛用于编译ES6等语言功能成向后兼容的ES5
- TypeScript
 - 来自微软的静态类型ES6超集
- SASS/LESS
 - 具有变量、控制流程、选择器嵌套能编译成css的语言

### 现代工具：代码共享

- 模块格式
 - AMD（异步模块定义）：用于异步浏览器加载
 - CommonJS：用于Node从文件系统中加载内容
 - ES6：用于静态分析用于构建优化
- 包装和执行
 - Node.js
    - 浏览器外的JavaScript运行环境
    - V8引擎，来自Chrome，添加了一些额外的系统交互交口（文件系统、套接字...）
    - 所有的服务端/构建工具都用JavaScript编写
 - NPM
    - 采用Node的包管理器
    - 创建、安装、管理JavaScript包和依赖

### 现代工具：构建工具

- 构建步骤
 - 编译：将ES6/TypeScript转成兼容性好的ES5
 - 合并：把多个文件合成一个输出文件
 - 压缩：移除空白/注释，重命名变量长度
 - 代码分块：将功能块分成单独的包以便按需加载
- 任务运行器
 - Grunt：通过插件配置分开独立的任务
 - Gulp：通过一系列转换步骤得到的管道数据
- 模块构建器
 - Browserify：将CommonJS格式模块转成浏览器可用的代码
 - Webpack：将任何内容转成模块，主要用于浏览器（AMD/CJS/ES6 modules, CSS, images, ...）

### 现代工具：开发体验

- File watching / live reloading
 - 监听源文件的改变，重新编译，可能重新加载页面内容
- Sourcemaps
 - 调试信息将源文件的行与构建输出文件的行相关联。允许在浏览器中调试“原始”代码
- Browser dev tools
 - 元素检查，样式检查，脚本调试，网络流量监控
- Hot reloading
 - 快速交换重新编译的代码模块
 - 实时编辑/所见即所得的开发体验
 - 适合函数式编程技术

### 现代工具：测试

- Test runners
 - Mocha, Jasmine, Tape, Jest（主要用于浏览器以外环境）
 - Karma（在真实的浏览器环境里）
- Mocking and test behavior
 - Chai, Expect（测试断言）
 - Sinon, JSDOM（网络/功能/DOM模拟）
- Integration testing
 - Selenium（通过驱动浏览器进行集成测试）
 - PhantomJS（采用虚拟浏览器进行浏览器环境自动单元测试）
- Linting: ESLint
- Static typing: Flow

### 现代工具：核心类库

- Express
 - node环境HTTP服务端框架
 - 中间件管道允许灵活处理请求/响应生命周期
- jQuery
 - DOM处理和AJAX请求；抽象各浏览间的差异
 - 单一广泛使用的JS类库
 - `$('#someId').toogleClass('active')`
- Underscore/Lodash
 - 非常有用的功能函数类库
 - Loadsh是Underscore的一个优化分支，额外添加了许多函数
 - 数组（\_.first），集合（\_.forEach），对象（\_.pick），字符串（\_.camelCase），函数（\_.debounce）等功能函数

### JavaScript框架

>每个框架都可以被看作是试图说“编写webapp的最困难的部分是$X，所以这里有一些代码让它更容易”。
当一个开发者“编写webapp最难的部分是实现双向数据绑定”，你可以使用knonchout.js，这个框架基本上能做90%的工作。···同样，Backbone感觉就是用来实现从一个REST API中获取并且持久化数据模型、客户端路由的产物，它基本上能做所有事。知道怎么将你获取的数据编程html内容（显然）容易，但是数据模型模型很难，所以这个工具能够帮助你。
如果您认为编写webapps的最大问题是Javascript不是Java、Ember不是Ruby，那么Angular就是你所需要的。（开玩笑了，我对这些框架并不熟悉）。等等，每个人都对最难处理的问题有自己的看法。
写webapp最难的是非确定的表现和不清晰的数据流动，React+Flux就是用来解决这些问题的。如果你已经在一个大型的Knockout或者Backbone项目上工作，你可能会倾向于同意。
[Reddit /u/Cody_Chaos](https://www.reddit.com/r/reactjs/comments/39wsfi/what_are_pros_and_cons_of_using_reactjsflux/cs7msvp)

![2017-10-11-javascript-frameworks](/assets/201710/2017-10-11-javascript-frameworks.jpg)

#### JavaScript框架？！？

- 为什么会存在框架
 - 将状态移出DOM结构
 - 高度抽象
 - 代码组织
- 优点
 - 可以在应用程序和开发人员之间共用常见概念
 - 大型社区，共享知识，文档，错误修复
 - 通过工具和指南达成更好的应用程序结构
- 缺点
 - 学习曲线
 - 项目大小最低要求
 - 体系和基础设施

#### JavaScript框架

- BACKBONE.JS
- ember
- ANGULARJS
- React

### 客户端路由（Client-Side Routing）

- “路由”：将URL映射到页面行为，包括从URL提取数据参数
- 最初是一个服务端概念
- 现代Web应用程序使用客户端上的路由能够快速更新和“深度链接”
 - UI渲染
 - 数据获取
- 所有主流框架生态系统都包含路由器

### 状态/数据管理（State/Data Management）

- 内置
 - Backbone：Models/Collections
 - Ember：Ember Data
 - Angular 1: Services/Controllers
- React
 - 局部组件状态
 - “Flux”模式（单向数据流）
 - Redux（单状态树，不可变更新；采用Flux的逻辑理论）
 - MobX（依赖可观察进行跟踪）
- Angular 2
 - Services/Controllers
 - Redux; Observables

### 开发趋势：后端

- “X即服务”
- “无服务器”后端
- 微服务（Microservices）
- 容器（Containers）

### 开发趋势：客户端/服务端

- 大规模的数据传输模式/工具
 - GraphQL，Falcor
- “同构”/“通用”Javascript应用程序
 - 服务端渲染
- 随处可见JavaScript
 - 跨平台工具包（Cordova，Ionic）
 - 桌面应用（Electron）
 - 移动应用（React Native）

### 开发趋势：客户端

- 基于组件的架构
- “虚拟DOM”
- CSS-in-JS
- WebGL，Web Workers，Service Workers
- 替代语言（Elm，Clojurescript）

### 开发趋势：概念

- 函数式编程（Functional Programming）
- 不变数据(Immutable Data)
- 响应式编程/观测（Reactive Programming / Observables）
- 静态类型

## 打造一款现代Web App

### 当前App

- 用于内部使用的地理空间可视化工具
- Version 1
 - GWT+SmartGWT
 - Google Earth Plugin
 - Play Framework

### 重写计划

- GWT关注
 - 升级问题和框架的未来（可能即将到来的不兼容版本）
 - 低能的开发工具
 - GWT特定的客户端-服务器通信与耦合
- v2原型/分析目标
 - 不被弃用的现代化工具技术栈
 - 改进的开发体验（快速重建，热重新加载，易于测试）
 - 更好的可维护性（代码结构，调试，数据流/跟踪）
- v2原型技术栈
 - 语言：ES6
 - UI框架：React
 - 数据管理：Redux
 - 构建工具：Webpack+Babel
 - 测试：Mocha
 - 3D地球：Cesium
 - 风格：Semantic-UI
- 为什么使用React和Redux？
 - 函数式编程原则，而且带有可靠的用法
 - 状态/数据/更新的显式跟踪；单向数据流使得跟踪更容易
 - 高度推荐使用的UI和逻辑
 - 开发能力，如time-travel调试和热重载加快开发

### 原型进展

- v2原型demo
 - File watching and recompiling
 - UI hot reloading
 - Data editing
 - Redux DevTools and time travel debugging
 - Test running

## 进一步阅读

- Web历史
 - [The Deep Roots of Javascript Fatigue](https://segment.com/blog/the-deep-roots-of-js-fatigue/)
 - [A Brief History of the Web](http://www.keepsite.com/a-brief-history-of-the-web/)
 - [The Golden Age of Javascript](https://mgadams.com/modern-javascript-development-part-1-d271f3790c1c)
- 现代Web技术
 - [State of the Javascript Landscape: A Map for Newcomers](https://www.infoq.com/articles/state-of-javascript-2016)
 - [The Hitchhiker's Guide to the Modern Front End Development Workflow](http://marcobotto.com/the-hitchhikers-guide-to-the-modern-front-end-development-workflow/)
 - [Simplified Javascript Jargon](http://jargon.js.org/)
 - [State of the Art Javascript in 2016](https://medium.com/javascript-and-opinions/state-of-the-art-javascript-in-2016-ab67fc68eb0b)
 - [On Being Overwhelmed With Our Fast-Paced Industry](http://wesbos.com/overwhelmed-with-web-development/)
 - [The State of Javascript in 2016: Survey Results](http://stateofjs.com/)

这篇文章整理翻译自一篇讲稿，出处链接地址：[http://blog.isquaredsoftware.com/presentations/2016-10-revolution-of-web-dev/](http://blog.isquaredsoftware.com/presentations/2016-10-revolution-of-web-dev/)
