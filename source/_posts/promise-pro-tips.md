---
title: Promise有哪些使用技巧？
date: 2017-09-30 10:14:58

tags: JavaScript
---

### Promise.all

这个方法用来一次执行多个promise非常有用。

```javascript
Promise.all([
    promise1,
    promise2
]);
```

### Promise.resolve

这个方法用来包装同步代码，使之成为一个promise。

```javascript
Promise.resolve().then(function () {
    if (somethingNotRight()) {
        throw new Error('I will be rejected asynchronously!');
    } else {
        return 'This string will be resolved asynchronously!';
    }
});
```

### Promise执行链

有时候需要一个一个promise顺序执行，下面的技巧可以实现这个想法。

```javascript
function sequentialize(promiseFactories) {
    var chain = Promise.resolve();
    promiseFactorires.forEach(function (promiseFactory) {
        chain = chain.then(promiseFactory);
    });
    return chain;
}
```

### Promise.race

这个擅长处理一个定时任务。

```javascript
Promise.race([
    new Promise(function (resolve, reject) {
        setTimeout(reject, 1000);
    }),
    doSomethingThatMayTakeAwhile()
]);
```

### Promise.finally

这个方法类似Q.finally，像这样使用：`promise.then(...).catch(...).finally(...)`
```javascript
function finally(promise, cb) {
   return promise.then(function (res) {
       var promies2 = cb();
       if (typeof promise2.then === 'function') {
           return promise2.then(function () {
               return res;
           });
       }
       return res;
    }, function (reason) {
        var promise2 = cb();
        if (typeof promise2.then === 'function') {
            return promise2.then(function () {
                return reason;
            });
        }
        return reason;
    });
}
```
