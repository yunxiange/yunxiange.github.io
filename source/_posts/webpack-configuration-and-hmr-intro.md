---
title: webpack配置及热更新介绍
date: 2017-10-21 17:55:53
tags: tool
---

### webpack介绍

[webpack官网](https://webpack.js.org/concepts/)是这么介绍的：
>webpack是用于现代JavaScript应用程序的模块打包器。当Webpack处理您的应用程序时，它递归地构建一个包含应用程序所需的每个模块的依赖关系图，然后将所有这些模块打包到少量的捆绑（通常只有一个），由浏览器加载。

webpack打包是基于由一系列规则构成的配置文件生成模块文件，四个核心的配置项分别是入口文件（[Entry](https://webpack.js.org/concepts/entry-points/)）、输出文件（[Output](https://webpack.js.org/concepts/output/)）、加载器（[Loaders](https://webpack.js.org/concepts/loaders/)）、插件（[Plugins](https://webpack.js.org/concepts/plugins/)）。

### webpack基本配置

webpack目前最新版本是3.8.1，分别有三个大版本1.x、2.x、3.x，从1.x升级到2.x有一些相关[配置规则变动](https://webpack.js.org/guides/migrating/)。下面以3.x版本展现一份基本的webpack配置文件内容：
```javascript
// webpack.config.js
let path = require('path');
module.exports = {
    entry: './app/index',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/assets/'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            options: {
                presets: ['env']
            }
        }]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false
            }
        })
    ]
};
```

### webpack热更新介绍

什么是热更新呢？热更新（[HMR](https://webpack.js.org/concepts/hot-module-replacement/)）在应用程序运行时交换，添加或删除模块，而不需要完全重新加载。采用热更新调试程序能够在页面模块更新后保留应用的状态、节省开发时间、更快地调整样式。

热更新可以用来替代LiveReload开发。它们之间的区别是热更新局部刷新，LiveReload页面整体刷新。

热更新是webpack重要的功能特性之一，它允许在运行时更新各种模块，而无需进行全面刷新。用于开发调试应用程序非常便利。

### webpack热更新配置

这里有3种方式用来配置HMR项目，逐个地进行介绍。

#### 1、webpack-dev-server CLI

在命令行中运行webpack-dev-server命令，这种方式不需要改变webpack.config.js文件内容，它是最简单的。

可以访问这个[例子](https://github.com/yunxiange/wepack-hmr-demo/tree/master/webpack-dev-server-cli)，看看具体的配置内容和效果。

#### 2、webpack-dev-server API

从一个node.js脚本中运行WebpackDevServer。要求添加一些内容到你的webpack.config.js文件中。这个适合于采用grunt或者gulp任务流或者从你的node脚本中运行webpack。

具体的配置内容可查看[这里](https://github.com/yunxiange/wepack-hmr-demo/tree/master/webpack-dev-server-api)，有相应的示例效果。

#### 3、webpack-hot-middleware w/express

[webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware)被用来运行一个webpack开发服务内置在express服务的HMR。这个用来集成到你的express服务。

详细的细节配置和运行效果，可以参照[这里](https://github.com/yunxiange/wepack-hmr-demo/tree/master/webpack-hot-middleware-express)。

### 后续

接下来会针对webpack打包原理、热更新、性能优化进行深入的探讨。
