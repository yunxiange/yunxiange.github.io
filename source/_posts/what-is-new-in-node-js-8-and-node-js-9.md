---
title: Node.js 8和Node.js 9的新功能
date: 2017-11-01 13:45:48
tags: Node.js
---

Node.js 8现在处于[长期支持（LTS）](https://www.infoworld.com/article/3001675/javascript/nodejss-release-cycle-hits-the-fast-lane.html)发布状态，LTS旨在表示在企业部署中使用的稳定性水平。随着Node.js 8的这个版本处于稳定状态，Node.js 9的首次登场是异步资源跟踪，作为“当前”发行版。

### Node.js 8特性

[流行的服务器端JavaScript运行环境](https://www.infoworld.com/article/3233190/node-js/nodejs-tutorial-get-started-with-nodejs.html)的LTS发布，这个关注的是安全和稳定性。LTS发布版本活跃维护在18个月。[由Node.js基金会于5月下旬首次推出](https://www.infoworld.com/article/3199186/node-js/nodejs-8-brings-sanity-to-native-module-dependencies.html)的Node.js 8.x功能特点：
- Google V8 6.1 JavaScript引擎。
- NPM 5.0.0客户端。
- 更好的性能——在典型的web应用程序上相比之前Node 6 LTS版本性能提升20%。

两个其他功能——作为本地扩展（native-add-ons）的N-API和保持在实验阶段仍然受到代码变动的HTTP/2。Node.js基金会建议Node.js 6用户开始测试Node.js 8，Node.js 4用户升级到Node.js 8。

【了解Node？不过错过[每个Node开发者必须掌握的10个JavaScript对象](https://www.infoworld.com/article/3196070/node-js/10-javascript-concepts-nodejs-programmers-must-master.html#tk.ifw-infsb). | [构建您的Node应用程序的7个关键点](https://www.infoworld.com/article/3204205/node-js/7-keys-to-structuring-your-nodejs-app.html#tk.ifw-infsb). | 跟上程序热门话题使用Infowold的[应用开发报告通讯](https://www.infoworld.com/newsletters/signup.html#tk.ifw-infsb).】

### Node.js 9新特性

对于Node.js 9，大多数改变主要在API的弃用或删除，并将代码库迁移到新的错误系统。迁移的目标是将唯一的代码与系统抛出的错误相关联，允许更改错误消息，而不会被视为破坏更改。Node.js 9其他特性包括：
- 一个异步钩子模块，提供一个用于注册回调以跟踪应用程序中异步资源的API。此功能也出现在Node.js 8.x行中，在此阶段是实验性的。
- Google V8 6.2 JavaScript引擎。
- 支持HTTP/2和N-API，它们可以在没有命令行标志的情况下使用，但仍然是实验性的。

### 哪里可以下载Node.js

[Node.js网站](https://nodejs.org/en/)上提供了最新的Node.js 8版本和9.x的下载URL。

文章整理翻译自[https://www.infoworld.com/article/3235610/node-js/whats-new-in-nodejs-8-and-nodejs-9.html](https://www.infoworld.com/article/3235610/node-js/whats-new-in-nodejs-8-and-nodejs-9.html)。
