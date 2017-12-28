---
title: ES6测试解答
date: 2017-09-24 10:42:53
tags: JavaScript
---

### 第一题

```javascript
let func = function() {};
func.name
```
1. `""`
2. `"func"`
3. `"anonymous"`
4. `undefined`

这道题考察ES6中function的name属性，ES6会返回实际的函数名，而ES5则返回空字符串，因此这道题的结果是 <span style="color:#F92672;">func</span>。

### 第二题

```javascript
var DOLPHIN = "\ud83d\udc2c";
DOLPHIN.length + [...DOLPHIN].length
```
1. 2
2. 3
3. 4

这道题涉及到ES6中Unicode字符，DOLPHIN.length返回长度为2，这是因为JavaScript内部字符以UTF-16的格式存储，每个字符固定为2个字节，因此DOLPHIN被认为为两个字符；[...DOLPHIN]用来解构字符串，结果是一个字符，因此[...DOLPHIN].length值为1。所以这个题的答案是 <span style="color:#F92672;">3</span>。

### 第三题

```javascript
var sym1 = Symbol(),
    sym2 = Symbol();
var o1 = {},
    o2 = {};
Object.defineProperties(o2, {
    [sym1]: {value: 'Sym 1', enumerable: true},
    [sym2]: {value: 'Sym 2'}
});
Object.assign(o1, o2);
Object.getOwnPropertSymbols(o1).lenght + Object.getOwnPropertySymbols(o2).length;
```
1. 1
2. 2
3. 3
4. 4

这道题考察了Object对象三个方法的使用，defineProperties方法用来定义对象的属性以及其特性（是否可写，可配置，可枚举）；assign方法用来拷贝对象的属性，但是不可枚举的属性不会引入新对象中；getOwnPropertSymbols方法用来获取所有Symbol属性，包括不可枚举的Symbol属性。因此o1含有Symbol属性长度为1, o2含有Symbol属性长度为2，程序运行结果为 <span style="color:#F92672;">3</span>。

### 第四题

```javascript
var obj1 = {["__proto__"]: "FOO"};
var obj2 = {__proto__: "FOO"};
var obj3 = {"__proto__": "FOO"};
[
    obj1.hasOwnProperty("__proto__"),
    obj2.hasOwnProperty("__proto__"),
    obj3.hasOwnProperty("__proto__")
]
```
1. `[true, true, true]`
2. `[true, false, false]`
3. `[true, false, false]`
4. `[false, false, false]`
5. `[false, true, true]`
6. thrown `TypeError`

\_\_proto\_\_魔法属性与非计算属性名的关系，可以看这里的运行原理[\_\_proto\_\_ Property Names in Object Initializers](https://tc39.github.io/ecma262/#sec-__proto__-property-names-in-object-initializers)。这道题的运行结果为 <span style="color:#F92672;">[true, false, false]</span>。

### 第五题

```javascript
function foo (a, b) {
    "use strict";
    var arrow = () => { return arguments[0]; };
    return arrow(b);
};
foo("A", "B")
```
1. "A"
2. "B"
3. thrown "TypeError"

这道题考察了arrow函数定义与运行时arguments指向，arrow函数在定义时已经将arguments绑定在词法中，类似this、super和new.target，因此结果为 <span style="color:#F92672;">A</span>。

### 第六题

```javascript
var f = () => { foo: "BAR" };
typeof f();
```
1. "string"
2. "object"
3. "undefined"

箭头函数里面的内容不会被解析成对象字面量，但是会作为区块和标记声明。没有包含return语句，所以return的值为 <span style="color:#F92672;">underfined</span>。

### 第七题

```javascript
[
    String.raw\`Line\nTerminator\` == "Line\\nTerminator",
    \`\u3042\` == "\u3042",
    String.raw\`\u3042\` == "\u3042"
]
```
1. `[true, true, true]`
2. `[false, true, true]`
3. `[true, true, false]`
4. `[false, true, false]`

模板字符串与普通字符串的关系、模板字符串处理String.raw会将没有转义的字符转义。数组的结果为 <span style="color:#F92672;">[true, true, false]</span>。

### 第八题

```javascript
function foo () {
    return "out";
}
var obj = {
    foo(n) {
        if (n) { return "in"; }
        return foo(1) + "side";
    }
};
obj.foo();
```

这道题比较迷惑的是obj.foo函数内的foo函数指向哪个函数，这个foo(1)执行调用的函数是外部定义的foo函数，没有绑定在obj对象上。运行结果为 <span style="color:#F92672;">outside</span>。

### 第九题

```javascript
var f = () => { foo: function() { return "FOO"; } };
typeof f();
```
1. `"object"`
2. `"function"`
3. `"undefined"`
4. thrown `SyntaxError`

箭头函数内部解析成标记声明，但是缺乏function名字，导致了语法错误。结果是 <span style="color:#F92672;">thrown SyntaxError</span>。

### 第十题

```javascript
"use strict";
var f = () => { foo: function foo() { return "FOO" } };
typeof f();
```
1. `"object"`
2. `"function"`
3. `"undefined"`
4. thrown `SyntaxError`

在strict模式下标记函数声明（[Labelled Function Declarations](https://tc39.github.io/ecma262/#sec-labelled-function-declarations)）会出现语法错误。这道题的结果自然为 <span style="color:#F92672;">thrown SyntaxError</span>。

### 第十一题

```javascript
var obj = {
    init() {
        this.name = "obj";
    },
    Foo() {
        this.init();
    }
};
obj.Foo.prototype = {
    init() {
        this.name = "Foo";
    }
};
var foo = new obj.Foo();
[
    obj.name, foo.name
];
```
1. `["obj", undefined]`
2. `["Foo", undefined]`
3. `[undefined, "Foo"]`
4. thrown `SyntaxError`
5. thrown `TypeError`

ES6中对象的属性简洁表示法中，函数作为对象的方法定义不具有[[Construct]]内部方法。obj.Foo()只是一个函数而不是构造函数，不能用new操作，出现 <span style="color:#F92672;">thrown TypeError</span>。

### 第十二题

```javascript
(function(arg1, ...rest) {
    arg1 = 10;
    return arguments[0];
}(1, 2, 3));
```

这道题涉及到[函数声明](https://tc39.github.io/ecma262/#sec-functiondeclarationinstantiation)和函数参数内部机制，当函数参数出现rest参数时argmuments被创建成[UnmappedArgumentsObject](https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject)对象。unmapped argument object意味着函数在传实参后arguments对象值不会再改变。创建成这种参数对象的情况还有以下几种：严格模式下、非严格模式下某些情况（含有rest参数、任何具有初始值的参数、任何具有解构参数）。所以这道题的结果是 <span style="color:#F92672;">1</span>。

### 第十三题

```javascript
console.log([
    1 in Array(3),
    1 in new Array(3),
    1 in Array.from(Array(3)),
    1 in Array(3).fill(),
    1 in [...[,,,]]
]);
```
1. `[false, true, true, false, true]`
2. `[false, false, false, false, false]`
3. `[false ,false, true, true, true]`

这道题考察了稀疏数组和稠密数组的生成与区别，稀疏数组与稠密数组的不同是数组每项元素是否都存在，稀疏数组不存在的元素项不可遍历。ES6的方法会将稀疏数组转化成稠密数组，默认是undefined值。上面的结果是 <span style="color:#F92672;">[false, false, true, true, true]</span>。

### 第十四题

```javascript
var result = [];

function findFirstUndefined(value, index) {
    if (value === undefined) {
        result.push(index);
        return true;
    }
}

[1, , 3].some(findFirstUndefined);
[1, , 3].find(findFirstUndefined);

console.log(result);
```
1. `[1, 1]`
2. `[]`
3. `[1]`
4. thrown `TypeError`

ES5中的遍历方法会忽略空的数组项，ES6会把空的数组项设为undefined。上面的result值为 <span style="color:#F92672;">[1]</span>。

### 第十五题

```javascript
function getPrototypeChainOf(obj) {
    var prototypeChain = [];
    while(obj = Object.getPrototypeOf(obj)) {
        prototypeChain.push(obj);
    }
    return prototypeChain;
}
var g = function *() {};
getPrototypeChainOf(g()).length;
```
1. `2`
2. `3`
3. `4`
4. `5`

这道题涉及到generator函数原型链方面的知识。从generator函数原型一直往上遍历的原型顺序分别为：Genetator、GeneratorFunction、Symbol.iterator、Object。所得到的原型链长度为 <span style="color:#F92672;">4</span>。

### 第十六题

```javascript
var list = ["1", NaN, 3, "a"];
var sum = (c, p) => c + p;
[
    list.map(Number.isNaN).reduce(sum),
    list.map(isNaN).reduce(sum)
]
```
1. `[1, 1]`
2. `[1, 2]`
3. `[2, 1]`
4. `[2, 2]`

这道题需要区分Number.isNaN和isNaN方法，两者的不同点是前者不会对输入数据进行类型转化直接判断结果，只有NaN为true，其他都为false。上面数组的结果是 <span style="color:#F92672;">[1, 2]</span>。

### 第十七题

```javascript
var obj = {
    length: 3,
    *[Symbol.iterator]() {
        yield "A";
        yield "B";
    }
};
Array.from(obj).length;
```
1. `2`
2. `3`
3. thrown `TypeError`

[Array.from](https://tc39.github.io/ecma262/#sec-array.from)会将伪数组和可迭代对象转换成数组对象，判断其长度会先去看迭代器的内容，因此上面的结果是 <span style="color:#F92672;">2</span>。

问题来源：[https://gist.github.com/teramako/858c448cb76cb8d309b0](https://gist.github.com/teramako/858c448cb76cb8d309b0)
