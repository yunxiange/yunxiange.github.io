---
title: 你真的搞懂Promise了吗？
date: 2017-10-14 14:10:01
tags: JavaScript
---

JavaScript开发者们，现在得承认：我们有一个关于promise的问题。

不，这不是promise自身问题。采用[A+ 规范](https://promisesaplus.com/)定义的Promise是非常酷的。

在过去一年中我遇到的最大问题，正如我看到许多程序员为PouchDB API和重promise API挣扎，是这个：

我们当中许多人在使用promise没有真正明白它。

如果你很难相信，想想我最近在twitter上发的[内容](https://twitter.com/nolanlawson/status/578948854411878400)：

问题：这四个promise的区别是什么？

```javascript
doSomething().then(function () {
    return doSomethingElse();
});

doSomething().then(function () {
    doSomethingElse();
});

doSomething().then(doSomethingElse());

doSomething().then(doSomethingElse);
```

如果你知道这个答案，恭喜你是一个promise高手。你有权限停止阅读此博文。

相对其他99.99%的人你是在一个好公司。没有人回复我的推文可以解决这个问题。是的，尽管我写了这道谜题。

这个答案在文章的末尾，但是首先，我想开头解释下为什么promise如此诡异和为什么我们当中很多人像新手和专家一样绊倒在这个上。我将会提供我认为是一个奇特的视角，这是一个怪异的技巧，这使得明白promise。是的，看过这些后我真的确信这些不是非常难。

但首先，让我们挑战一些关于promise的常见问题。

### 为什么会出现promise呢？

如果你阅读有关promise的文献，你可能经常会发现这个[糟糕的金字塔](https://medium.com/@wavded/managing-node-js-callback-hell-1fe03ba8baf)参考，一些逐渐出现到你的屏幕右下方的可怕回调代码。

promise确实解决了这个问题，但他不仅仅是缩进。正如在“[回调地域救赎](http://youtu.be/hf1T_AONQJU)”这个精彩的对话中所解释的那样，回调真正地问题是我们不能用return和throw语句。相反，我们程序的整个流程是这样：一个函数接着调用另一个函数。

事实上，回调做的某些事甚至非常的险恶：他夺走了我们在编程语言常见的程序堆栈。编写没有堆栈的代码非常像没有制动踏板的汽车：直到你需要它但它并不在时你会意识到多么的需要它。

promise的整个要点是当我们使用异步编程时将return、throw和堆栈用到了编程中。但是你必须知道如何正确使用promise以便利用它。

### 新手错误

有些人尝试解释promise成[一部漫画](http://andyshora.com/promises-angularjs-explained-as-cartoon.html)，或者一个名词：“噢，它是你可以传递的代表异步值的东西”。

我没有发现那样的解释对我非常有帮助。对我来说，promise都是关于代码结构和流程的。所以我任务最好解决一些常见的错误，并展示如何去解决它们。“你现在是个新手、小孩，很快就会很专业”，在这个意思上我把这些问题称作新手错误。

扯下题外话，“promise”对不同的人意味着许多不同的东西，但是这篇文章的目的仅仅是在讨论官方规范，像现代浏览器中的`window.Promise`。但是不是所有的浏览器都有了`window.Promise`，这里会有一个好的兼容方法（polyfill），看看这个最小的兼容规范库[lie](https://github.com/calvinmetcalf/lie)。

#### 新手错误1：糟糕的promise金字塔

看看这个有很多基于promise API的PouchDB，我看到了很多不好的promise模式。最常见的坏习惯是这个：
```javascript
remotedb.allDocs({
    include_docs: true,
    attachments: true
}).then(function (result) {
    var docs = result.rows;
    docs.forEach(function (element) {
        localdb.put(element.doc).then(function (response) {
            alert('Pulled doc with id ' + element.doc._id + ' and added to local db.');
        }).catch(function (err) {
            if (err.name == 'conflict') {
                localdb.get(element.doc._id).then(function (resp) {
                    localdb.remove(resp._id, resp._rev).then(function ( resp) {
                        // et cetera...
                    });
                });
            }
        });
    });
});
```
是的，事实证明你在用promise好像它是回调，这很像使用电动砂光机在锉你的指甲，但是你可以做到。

如果你认为这类错误仅限于完全的新手，你会惊讶我是从BlackBerry官方的开发者博客上拿到的代码！旧友的回调习惯很难改。（对开发这说声抱歉，但这个例子是有启发性的。）

一种更好的方式是这样：
```javascript
remotedb.allDocs(...).then(function (resultOfAllDocs) {
    return localdb.put(...);
}).then(function (resultOfPut) {
    return localdb.get(...);
}).then(function (resultOfGet) {
    return localdb.put(...);
}).catch(function (err) {
    console.log(err);
});
```
这个称之为组合promise，是promise超级强大的地方之一。每个函数仅在前一个函数运行完后利用其promise的返回结果调用，以此类推。

#### 新手错误2：WTF，我怎么在promise中使用`forEach()`？

这是大多数人对promise了解开始奔溃的地方。一旦他们达到他们熟悉的forEach()循环（或者for循环，或者while循环），他们就不知道怎么与promise结合起来一起工作。所以他们写出像下面的代码：
```javascript
// 移除所有的docs
db.allDocs({include_docs: true}).then(function (result) {
    result.rows.forEach(function (row) {
        db.remove(row.doc);
    });
}).then(function () {
    // 天真的认为现在所有的docs已经移除了
});
```
这段代码有什么问题呢？这个问题是第一个函数实际上返回`undefined`，意味着第二个函数不会等待`db.remove()`在所有docs调用完。事实上，它不会等待任何操作，并且可以在任何数量的docs被删除时执行。

这是一个特别隐密的问题，因为你可能没有注意到有什么错误，假设PouchDB足够快地删除这些docs以便UI被更新。这个问题只能在奇怪的竞争条件下弹出，或者在某些浏览器中这样几乎不可能调试。

所有这些不是你寻找的结构forEach()/for/while的内容不必关注。你仅需要使用Promise.all()：
```javascript
db.allDocs({include_docs: true}).then(function (result) {
    return Promise.all(result.rows.map(function (row) {
        return db.remove(row.doc);
    }));
}).then(function (arrayOfResults) {
    // 现在所有的docs都已经移除了
});
```
这里发生了什么？基础上Promise.all()把一系列的promise作为输入，然后只有当其他promise中的每一个都解决时给出另一个已解决的promise。它与for循环异步等效。

Promise.all()将一个结果数组传递给下一个函数，这非常有用，例如如果您尝试从PouchDB获取多个东西。如果其所有子promise中的任何一个被拒绝，all()承诺也被拒绝，这更为有用。

#### 新手错误3：忘记添加`.catch()`

这是另一个常见错误。很自信他们的promise永远不会抛出错误，许多开发人员忘记在他们的代码中添加一个.catch()。不幸的是，这意味着任何抛出的错误将被吞下，你甚至不会在控制台中看到它们。这可能是一个真正的痛苦调试。

为了避免这种讨厌的情况，我已经习惯了将以下代码添加到我的promise链中:
```javascript
somePromise().then(function () {
    return anotherPromise();
}).then(function () {
    return yetAnotherPromise();
}).catch(console.log.bind(console));
```
即使你从来没预料过错误，添加一个catch()一直是谨慎的。如果你的假设是错误的，这将使你的生活更轻松。

#### 新手错误4：使用`deferred`

这是我一直我看到的错误，我不愿在这里重复一遍，因为担心，像Beetlejuice，只是调用它的名字将出现更多的例子。

简而言之，promise有悠久的历史，并且JavaScript社区花了很长时间才能让他们正确。在早期，jQuery和Angular正在使用这种“延迟”模式，现在已经被ES6 Promise规范所取代，由实现这种规范“好的”库如Q，When，RSVP，Bluebird，Lie等等。

所以如果你在你的代码中写这个词（我不会再重复一遍，第三次了），你做错了。以下是如何避免这种情况。

首先，大多数promise库都为您提供了从第三方库中“引进”了promise。例如，Angular的$ q模块允许您使用$q.when()来包装非$q promise。所以Angular用户可以这样包装PouchDB promise：
```javascript
$q.when(db.put(doc)).then( /* ... */);  // <-- 这是你需要的所有代码
```
另一种方法是使用[揭示构造器模式（revealing constructor pattern）](https://blog.domenic.me/the-revealing-constructor-pattern/)，对包装非promise api有用。比如包装一个像Node的fs.readFile()基于回调的API，你只需要这样做：
```javascript
new Promise(function (resolve, reject) {
    fs.readFile('myfile.txt', function (err, file) {
        if (err) {
            return reject(err);
        }
        resolve(file);
    });
}).then(/* .... */);
```
完成！我们已经击败了可怕的def ... Aha，抓住了自己。:)

>更多的关于为什么这是一个反模式，请查看[Bluebird维基页面关于promise反模式](https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns#the-deferred-anti-pattern)。

#### 新手错误5：不使用`return`的副作用

这段代码出现什么错误呢？
```javascript
somePromise().then(function () {
    someOtherPromise();
}).then(function () {
    // 哎，我希望someOtherPromise（）已经解决了！
    // Spoiler警报：没有。
});
```
好的，这是一个很好的一点，谈论你需要了解promise的一切。真的，这是一个奇怪的伎俩，一旦你明白了，就会阻止我所说的所有错误。你准备好了吗？

正如我之前所说，promise的魔力是他们给我们带回了我们宝贵的return和throw。但这实际上是什么样的呢？

每个promise给你一个then()方法（或者catch()，这只是then(null, ...)的语法糖）。这里我们在一个then()函数里面：
```javascript
somePromise().then(function () {
    // 我在一个then函数里面
});
```
这儿我们该怎么办？有三件事情：

1、return另一个promise
2、return一个同步值（或者undefined）
3、throw一个同步错误

就这些。一旦了解这个特招，你就明白了promise。那么让我们一次一个个地去看每个点。

##### 1、return另一个promise

这是你在promise文献中看到的常见模式，如上面的“组合promise”示例：
```javascript
getUserByName('nolan').then(function (user) {
    return getUserAccountById(user.id);
}).then(function (userAccount) {
    // 我获取了一个用户帐户！
});
```
注意我return了第二个promise——return至关重要。如果我没有返回，那么getUserAccountById（）实际上会是一个副作用，下一个函数将会接收到undefined而不是userAccount。

##### 2、return一个同步值（或者undefined）

返回undefined通常是一个错误，但是返回一个同步值实际上是将同步代码转换为promise代码的好方法。例如，假设我们有一个用户的内存缓存。我们可以做的：
```javascript
getUserByName('nolan').then(function (user) {
    if (inMemoryCache[user.id]) {
        return inMemoryCache[user.id];
    }
    return getUserAccountById(user.id);
}).then(function (userAccount) {
    // 我获取了一个用户帐户！
});
```
不是很棒吗？第二个函数不关心userAccount是同步还是异步地获取，第一个函数可以自由返回同步或异步值。

不幸的是，不方便的事实是JavaScript中的非返回函数在技术上返回undefined，这意味着当您意图返回某些东西时，很容易意外引入副作用。

因此，我将它作为个人习惯，总是从then()函数return或throw。我建议你做同样的事情。

##### 3、throw一个同步错误

说到throw，这是promise可以得到更棒的地方。假设我们要抛出同步错误，以防用户注销。这很容易：
```javascript
getUserByName('nolan').then(function (user) {
    if (user.isLoggedOut()) {
        throw new Error('user logged out!'); //抛出一个同步错误
    }
    if (inMemoryCache[user.id]) {
        return inMemoryCache[user.id]; // 返回一个同步值
    }
    return getUserAccountById(user.id); // 返回一个promise！
}).then(function (userAccount) {
    // 我获得一个用户帐户！
}).catch(function (err) {
    // 嘘，出现错误！
});
```
如果用户注销，我们的catch()将收到同步错误，如果有任何promise被拒绝，它将收到异步错误。同样，该函数不关心其获取的错误是同步还是异步。

这是特别有用的，因为它可以帮助识别开发过程中的编码错误。例如，如果在then()函数内的任何一点，我们做一个JSON.parse()，如果JSON无效，它可能会引发同步错误。使用回调，这个错误会被吞噬，但是有了承诺，我们可以在我们的catch()函数中简单的处理它。

### 高级错误

好吧，现在你已经学会了让promise变得简单的一个技巧，让我们来谈谈边缘案例。当然，总是有边缘的情况。

我把这些错误归类为“高级”，因为我只看过他们已经很熟悉promise的程序员了。但是，如果我们想要解决我在这篇文章开头提出的难题，我们将需要讨论它们。

#### 高级错误1：不知道`Promise.resolve()`

如上所示，promise对于将同步代码作为异步代码来说非常有用。但是，如果您发现自己键入很多：
```javascript
new Promise(function (resolve, reject) {
    resolve(someSynchronousValue);
}).then(/* ... */);
```
这对于捕获任何同步错误也是非常有用的。这是非常有用的，我已经习惯了开始几乎所有的promise-returning的API方法，如下所示：
```javascript
function somePromiseAPI() {
    return Promise.resolve().then(function () {
        doSomethingThatMayThrow();
        return "foo";
    }).then(/* ... */);
}
```
只要记住：对于在某处几乎不可能调试的吞咽错误，任何可能同步throw的代码是一个很好的候选对象。但是如果你把所有内容都包含在Promise.resolve()中，那么你可以随时确定catch()。

同样，有一个Promise.reject()可以用来返回一个立即被拒绝的承诺：
```javascript
Promise.reject(new Error('some awful error'));
```

#### 高级错误2：`catch()`与`then(null, ...)`并不完全一样

我上面说的catch()只是语法糖。所以这两个片段是等价的：
```javascript
somePromise().catch(function (err) {
    // 处理错误
});

somePromise().then(null, function (err) {
    // 处理错误
});
```
但是，这并不意味着以下两个片段是等效的：
```javascript
somePromise().then(function () {
    return someOtherPromise();
}).catch(function (err) {
    // 处理错误
});

somePromise().then(function () {
    return someOtherPromise();
}, function (err) {
    // 处理错误
});
```
如果您想知道为什么它们不相等，请考虑如果第一个函数抛出错误会发生什么：
```javascript
somePromise().then(function () {
    throw new Error('oh noes');
}).catch(function (err) {
    // 捕捉到错误
});

somePromise().then(function () {
    throw new Error('oh noes');
}, function (err) {
    // 没有捕获到错误
});
```
事实证明，当您使用then(resolveHandler, rejectHandler)格式时，如果resolveHandler本身抛出，rejectHandler将不会实际捕获错误。

因此，我已经习惯了不要再使用then()第二个参数，并且总是喜欢catch()。例外情况是当我正在编写异步[Mocha](http://mochajs.org/)测试时，我可以在其中写一个测试来确保抛出错误：
```javascript
it('should throw an error', function () {
    return doSomethingThatThrows().then(function () {
        throw new Error('I except an error!');
    }, function (err) {
        should.exist(err);
    });
});
```
说到这一点，[Mocha](http://mochajs.org/)和[chai](http://chaijs.com/)是一个可爱的组合来测试承诺的API。 [pouchdb-plugin-seed](https://github.com/pouchdb/plugin-seed)项目有一些可以让您开始的[示例测试](https://github.com/pouchdb/plugin-seed/blob/master/test/test.js)。

#### 高级错误3：promise和promise工厂

假设你想按顺序执行一系列的promise。那就是你想要的是Promise.all()，但是并不执行这些承诺。

你可能会天真地写这样的东西：
```javascript
function executeSequentially(promises) {
    var resut = Promise.resolve();
    promises.forEach(function (promise) {
        result = result.then(promise);
    });
    return result;
}
```
不幸的是，这不符合你的意图。您传递给executeSequentially()的promise仍将并行执行。

发生这种情况的原因是，你不想在一系列promise上操作。根据promise规范，一旦promise创建，它将开始执行。所以你真正想要的是一系列的promise工厂：
```javascript
function executeSequentially(promiseFactories) {
    var result = Promise.resolve();
    promiseFactories.forEach(function (promiseFactory) {
        result = result.then(promiseFactory);
    });
}
```
我知道你在想什么：“这个Java程序员究竟是谁，他为什么在谈论工厂？”一个promise工厂很简单，但它只是一个返回promise的功能：
```javascript
function myPromiseFactory() {
    return somethingThatCreatesAPromise();
}
```
为什么这样工作？起作用的是因为一个promise的工厂直到被要求才产生promise。它的工作方式与then的功能相同 - 事实上，它是一回事！

如果你看看上面的executeSequentially()函数，然后想象myPromiseFactory被替换为result.then(...)，那么希望一个灯泡会点醒你的大脑。在那一刻，你将会实现有promise的启示。

#### 高级错误4：好的，如果我想要两个promise的结果呢？

通常情况下，一个promise将取决于另一个promise，但我们希望这两个promise的输出。例如：
```javascript
getUserByName('nolan').then(function (user) {
    return getUserAccountById(user.id);
}).then(function (userAccount) {
    // 危险，我也需要“user”对象！
});
```
想要成为好的JavaScript开发人员，并避免使用金字塔，我们可能只将用户对象存储在更高作用域的变量中：
```javascript
var user;
getUserByName('nolan').then(function (result) {
    user = result;
    return getUserAccountById(user.id);
}).then(function (userAccount) {
    // 好了，我同时拥有“user”和“userAccount”
});
```
这个能够运行，但我个人觉得有点凑巧。我推荐的策略：放开你的先入为主并拥抱金字塔：
```javascript
getUserByName('nolan').then(function (user) {
    return getUerAccountById(user.id).then(function (userAccount) {
        // 好了，我同时拥有“user”和“userAccount”
    });
});
```
...至少，暂时的如果缩进成为一个问题，那么您可以做JavaScript开发人员自古以来一直在做的工作，并将该功能提取到一个命名的函数中：
```javascript
function onGetUserAndUserAccount(user, userAccount) {
    return doSomething(user, userAccount);
}

function onGetUser(user) {
    return getUserAccountById(user.id).then(function (userAccount) {
        return onGetUserAndUserAccount(user, userAccount);
    });
}

getUserByName('nolan')
    .then(onGetUser)
    .then(function () {
        // 在这一点上，doSomething()完成，我们回到0缩进
});
```
随着您的promise代码开始变得越来越复杂，您可能会发现自己将越来越多的函数提取到命名函数中。我发现这会导致非常美观的代码，可能看起来像这样：
```javascript
putYourRightFootIn()
    .then(putYourRightFootOut)
    .then(putYourRightFootIn)
    .then(shakeItAllAbout);
```
这就是promise的一切。

#### 高级错误5：promise破坏

最后，当我介绍上面的promise难题时，这是我提到的错误。这是一个非常深奥的用例，它可能永远不会出现在你的代码中，但它确实让我感到惊讶。

你认为这个代码打印出来什么？
```javascript
Promise.resolve('foo').then(Promise.resolve('bar')).then(function (result) {
    console.log(result);
});
```
如果你认为打印出来bar，你是错误的。它实际上打印出foo！

发生这种情况的原因是因为当你传递then()一个非函数（如承诺）时，它实际上将它解释为then(null)，这导致先前的promise的结果通过。你可以自己测试一下：
```javascript
Promise.resolve('foo').then(null).then(function (result) {
  console.log(result);
});
```
添加尽可能多的then(null)；它仍然会打印foo。

这实际上回到了我说promise vs promise工厂的前一点。简而言之，您可以直接将promise直接传递给then()方法，但不会执行您的想法。那么then()应该是一个函数，所以很可能你打算做：
```javascript
Promise.resolve('foo').then(function () {
  return Promise.resolve('bar');
}).then(function (result) {
  console.log(result);
});
```
这将像我们预期的那样打印bar。

所以只是提醒自己：总是传递一个函数到then()！

### 解决谜题

现在我们已经学到了所有有关promise（或接近它）的知识，我们应该能够解决我最初在这篇文章开始时提出的难题。

这是每道题的答案，以图形格式，所以你可以更好地可视化它：

#### 谜题1

```javascript
doSomething().then(function () {
  return doSomethingElse();
}).then(finalHandler);
```

答案：
```javascript
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```

#### 谜题2

```javascript
doSomething().then(function () {
  doSomethingElse();
}).then(finalHandler);
```

答案：
```javascript
doSomething
|-----------------|
                  doSomethingElse(undefined)
                  |------------------|
                  finalHandler(undefined)
                  |------------------|
```

#### 谜题3

```javascript
doSomething().then(doSomethingElse())
  .then(finalHandler);
```

答案：
```javascript
doSomething
|-----------------|
doSomethingElse(undefined)
|---------------------------------|
                  finalHandler(resultOfDoSomething)
                  |------------------|
```

#### 谜题4

```javascript
doSomething().then(doSomethingElse)
  .then(finalHandler);
```

答案：
```javascript
doSomething
|-----------------|
                  doSomethingElse(resultOfDoSomething)
                  |------------------|
                                     finalHandler(resultOfDoSomethingElse)
                                     |------------------|
```

如果这些答案仍然没有弄明白，那么我建议您重新阅读这篇文章，或者定义doSomething()和doSomethingElse()方法，并在浏览器中自行尝试。

>说明：对于这些例子，我假设doSomething()和doSomethingElse()都返回promise，并且这些promise代表了JavaScript事件循环之外的事情（例如IndexedDB，network，setTimeout），这就是为什么它们在适当时显示为并发。这是一个[JSBin](http://jsbin.com/tuqukakawo/1/edit?js,console,output)来演示。

对于更高级的promise使用，请查看我的[promise提示表](https://gist.github.com/nolanlawson/6ce81186421d2fa109a4)。

### 关于promise的后话

promise是伟大的。如果您仍然使用回调，我强烈建议您切换到承诺。您的代码将变得更小，更优雅，更容易理解。

如果你不相信我，这里就是证明：[PouchDB的map/reduce模块的重构](https://t.co/hRyc6ENYGC)使用promise替代callback。结果：290次插入，555次删除。

顺便说一下，写那个讨厌的回调代码的人是...我！所以这是作为我的promise的原始力量的第一课，我感谢其他PouchDB贡献者一路上教导我。

话虽如此，promise并不完美。这是真的，他们比回调更好，但这是一个很好的说，一个打在肠道比一个踢在牙齿更好。当然，一个比另一个更好，但是如果你有一个选择，你可能会避免它们。

虽然优于回调，promise仍然难以理解和容易出错，这表现在我觉得不得不写这篇博文。新手和专家都会经常混淆这些东西，真的，这不是他们的错。问题在于promise虽然与我们在同步代码中使用的模式类似，但却是一个合适的替代品，但不完全相同。

实际上，你不应该学习一堆神秘的规则和新的API来做这些事情，在同步的世界里，你可以很好地完成熟悉的模式，如return，catch，throw和for-loop。不应该有两个并行的系统，你必须始终保持串行。

### 期待async/await

这就是我在[“用ES7驯服异步野兽”](http://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html)中所做的一点，我在那里探索了ES7 async/await关键字，以及如何将承诺更深入地融入到语言中。 ES7可以让我们使用真正的try / catch / return关键字，就像我们在CS 101中学到一样，而不必编写伪同步代码（使用一种类似于catch的假捕获()方法，但不是真的）。

这是JavaScript作为一种语言的巨大福音。因为最后，只要在我们犯了错误时我们的工具不会告诉我们，这些承诺的反模式仍然会继续发生。

以JavaScript的历史为例，我认为说[JSLint](http://jslint.com/)和[JSHint](http://jshint.com/)比[《JavaScript: The Good Parts》](http://amzn.com/0596517742)更好的服务于社区，即使它们有效地包含了相同的信息。被告知你刚刚在你的代码中所犯的错误，而不是阅读一本你试图了解别人的错误的书。

ES7 aynsc/await的美妙之处在于，在大多数情况下，您的错误会将自己显示为语法/编译器错误，而不是微妙的运行时错误。在此之前，掌握了ES5和ES6中的promise能力，以及如何正确使用它们。

所以，当我认识到，像《JavaScript：The Good Parts》，这个博客文章只能有一个有限的影响，当你看到他们犯同样的错误希望你可以指出。因为我们还有太多人只需要承认：“我有promise的问题！”

>更新：有人指出，Bluebird 3.0将打印出可以防止我在这篇文章中发现的许多错误的警告。所以使用Bluebird是另一个很好的选择，而我们期待ES7！
现在ES 2017已经发布了规范，实现了async/await特性，激动人心！

本篇文章翻译自 [https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)。
