---
title: ECMAScript语言对象扩展小结
date: 2017-09-16 20:06:44
tags: JavaScript
---

ECMAScript语言发展越来越迅速，ES5之前好几年才发布一次新的标准规范，从ES6 (ECMAScript 2015)开始，每年发布一次标准规范，基于向后兼容的原则对语言进行功能扩展使得开发效率越来越高。

下面将ECMAScript在数值、字符串、数组、对象、函数、正则表达式上的扩展做一个小结。

### 数值

从ES5开始，在严格模式之中，八进制不在允许使用前缀`0`表示。ES6提供了二进制和八进制数值新的写法，分别用前缀`0b`（或`0B`）和`0o`（或`0O`）表示。

数值对象方法在ES6中有一些变化，将全局方法isFinite()、isNaN()、parseInt()、parseFloat()放在了Number对象下，分别是Number.isFinite()、Number.isNaN()、Number.parseInt()、Number.parseFloat()。全局方法和Number对象下isFinite()、isNaN()的这些方法的主要区别是全局方法在计算时会将参数先进行类型转换，转成数值再进行计算，而Number下的这些方法不会对参数类型转换直接进行计算。parseInt()、parseFloat()两者表现一致。

此外ES6还扩展了Number.EPSILON属性、Number.isInterger()方法、Number.MAX_SAFE_INTEGER属性、Number.MIN_SAFE_INTEGER属性、Number.isSafeInteger()方法。

Number.EPSILON是一个极小的常量，表示1与大于1的最小浮点数之间的差。
```javascript
Number.EPSILON
// 2.220446049250313e-16
```

Number.isInterger()方法用来判断一个值是否为整数。
```javascript
Number.isInteger(23)
// true
Number.isInteger(23.08)
// false
```

Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量与JavaScript能够准确表示的整数范围有关，分别表示这个范围的上限和下限。
```javascript
Number.MAX_SAFE_INTEGER
// 9007199254740991
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
// true
Number.MIN_SAFE_INTEGER
// -9007199254740991
Number.MIN_SAFE_INTEGER === -Math.pow(2, 53) + 1
// true
```

Number.isInterger()和Number.isSafeInteger()方法用来判断一个值是否为整数。它们之间的区别是后者判断一个整数是否落在JavaScript所能精确的数值范围内。
```javascript
Number.isInteger(Number.MIN_SAFE_INTEGER - 1)
// true
Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1)
// false
```

ES6在Math对象上新增了18个与数学相关的方法。所有方法都是静态方法，只能在Math对象上调用。其中包含了4个对数相关的方法，6个双曲函数方法。

ES2016新增了一个指数运算法（**），在V8引擎中指数运算符与Math.pow实现不相同，对于特别大的运算结果两者会有细微的差异。
```javascript
2 ** 64 === Math.pow(2, 64);
// true
```

### 字符串

JavaScript是一组由16位组成的不可变的有序序列，每个字符通常来自于采用UTF-16编码的Unicode字符集。采用`\uxxxx`形式表示一个字符，其中`xxxx`表示字符的Unicode码点，这种表示法只限于码点在`\u0000`~`\uFFFF`之间的字符。超出这个范围的字符必须使用两个双字节的形式表示。

ES6中对直接跟在`\u`后面超过`0xFFFF`的数值做了一点改进，只要将码点放入大括号就能正确解读该字符。

在ES5中对字符串对象扩展了一个实例方法trim()，此方法用来移除字符串两侧的空白。
```javascript
var org = ' example ';
org.trim(); // 'example'
```

ES6中字符串扩展了一些方法，用来更便捷地处理字符串。字符串对象方法新增了：
- 能够识别Unicode编号大于`0xFFFF`的码点返回对应字符 String.fromCodePoint()
- 模板字符串转义处理 String.raw()
- 实例方法新增了正确处理4个字节储存的字符返回其码点 codePointAt()
- 能够识别Unicode编号大于`0xFFFF`字符指定位置的字符 at()
- 字符不同表示方法统一同样形式（Unicode正规化）normalize()
- 确定一个字符串是否包含在另一个字符串中 includes()
- 参数字符串是否在原字符串的头部 startsWith()
- 参数字符串是否在原字符串的尾部 endsWith()
- 将原字符串重复`n`次返回的新字符串 repeat()

ECAMScript 2017添加了两个字符串对象方法：
- 字符串在头部补全长度返回新字符串 padStart()
- 字符串在尾部补全长度返回新字符串 padEnd()

```javascript
String.fromCharCode(0x20BB7)
// "ஷ"
String.raw`Hello\n${2*4}!`
// "Hello\n8!"
let str = '𠮷a'
str.codePointAt(0)
// 134071
str.codePointAt(1)
// 57271
'𠮷'.at(0)
// '𠮷'
'hello'.at(0)
// 'h'
'\u01D1'.normalize() === '\u004F\u030C'.normalize()
// true
let compareStr = 'Hello world!'
compareStr.includes('o')
// true
compareStr.startsWith('world', 6)
// true
compareStr.endsWith('!')
// true
'man'.repeat(4)
// 'manmanmanman'
'x'.padStart(4, 'abc')
// 'abcx'
'x'.padEnd(4, 'abc')
// 'xabc'
```

### 数组

ES5定义了9个新的数组方法来遍历forEach()、映射map()、过滤filter()、检测every()及some()、简化reduce()及reduceRight()和搜索数组indexOf()及lastIndexOf()。这些方法大多数第一次参数是一个函数，并且对数组每个元素调用一次该函数。如果是稀疏数组，对不存在的元素不调用传递的函数。大多数情况下，调用提供的函数使用三个参数：数组元素、元素的索引和数组本身。这些大多数数组方法第二个参数可选，若有第二个参数调用函数可看作是第二参数的方法。
```javascript
var data = [1, 2, 3, 4, 5, 6];
var sum = 0;
data.forEach(function(v) {
    sum += v;
});
// sum = 21
data.forEach(function(v, i, arr) {
    arr[i] = v * 2;
});
// data = [2, 4, 6, 8, 10, 12]
```

需要注意的是forEach()不支持循环break终止语句，需要提前跳出循环只能用try...catch语句。

```javascript
var all = [1, 2, 3];
var allNew = all.map(function(v) {
    return v*v;
});
// allNew = [1, 4, 9]
var allPart = allNew.filter(function(v) {
    return v < 5;
});
// allPart = [1, 4]
allPart.every(function(v) {
    return v < 5;
});
// true
allPart.some(function(v) {
    return v > 5;
});
// false
var sum = all.reduce(function(x, y) {
    return x +y;
}, 0);
// sum = 6
var big = [2, 3, 2].reduceRight(function(accumulator, value) {
    // (2, 3) (9, 2)
    return Math.pow(value, accumulator);
});
// big = 512
[0, 1, 2, 1, 0].indexOf(1);
// 1
[0, 1, 2, 1, 0].lastIndexOf(1);
// 3
[0, 1, 2, 1, 0].indexOf(3);
// -1
```

ES6中新增了扩展运算符（spread），三个点（...），作用是将一个数组转为用逗号分隔的参数序列。可用来复制数组、合并数组、与ES6解构赋值结合起来生成新数组、字符串转真正的数组。
```javascript
const a1 = [1, 2, 3];
const a2 = [...a1]; // const [...a2] = a1;
// a2 = [1, 2, 3]
const a3 = [...a1, 4, 5, 6];
// a3 = [1, 2, 3, 4, 5, 6]
const [first, ...rest] = [1, 2, 3, 4, 5];
// first = 1, rest = [2, 3, 4, 5]
const a4 = [...'hello'];
// a4 = ['h', 'e', 'l', 'l', 'o']
```

此外ES6也新增了一些数组方法：
- 用于将类对象转为真正的数组 Array.from()
- 将一组值转为数组 Array.of()
- 在当前数组内部将指定位置的成员复制到其他位置返回新数组 copyWithin()
- 找出第一个符合条件的数组成员 find()
- 返回第一个符合条件的数组成员的位置 findIndex()
- 使用给定值填充数组返回新数组 fill()
- 遍历数组键名 keys()
- 遍历数组键值 values()
- 遍历数组键值对 entries()

ECMAScript 2016新增了一个数组方法：
- 数组是否包含某个值 includes()

稀疏数组就是包含从0开始的不连续索引的数组，比起稠密数组实现上更慢、内存利用率更高、查找元素时间更长。可通过Array()构造函数或简单指定数组的索引值大于当前的数组长度创建稀疏数组，也可以通过delete操作符生产稀疏数组。数组空位是指数组的某一个位置没有任何值。

ES5对稀疏数组和数组空位处理大多数情况下会忽略空位。ES6则会将其转为undefined。

### 对象

在ES5中属性的值可以是一个getter或setter函数（或两者都有），可以对对象创建的属性特性（property attribute）（可写writable、可枚举enumerable、可配置configurable）进行配置。有getter和setter定义的属性称作“存取器属性”（accessor property），它不同于由一个简单的值构成的数据属性。存取器属性不具有值特性和可写性。

ES5针对Object扩展了以下方法：
- 使用指定的原型对象及其属性去创建一个新的对象 Object.create(proto[, propertiesObject])
- 直接在一个对象上定义一个新属性或者修改现有属性并返回这个对象 Object.defineProperty(obj, prop, descriptor) （descriptor描述符可选键值value, get, set, enumerable, writable, configurable）
- 直接在一个对象上定义新的属性或修改现有属性 Object.defineProperties(obj, props)
- 返回指定对象上一个自由属性对应的属性描述符 Object.getOwnPropertyDescriptor(obj, prop)
- 返回指定对象的所有自身属性（包括不可枚举属性但不包括Symbol值为名称的属性）组成的数组 Object.getOwnPropertyNames(obj)
- 返回指定对象的原型（即内部[[Prototype]]属性的值）Object.getPrototypeOf(object)
- 返回给定对象自身可枚举属性（不包含原型链上的属性）组成的数组 Object.keys(obj)
- 冻结一个对象（即对象永远不可变）Object.freeze(obj)
- 判断一个对象是否被冻结 Object.isFrozen(obj)
- 使一个对象变的不可扩展（即不能添加新的属性）Object.preventExtensions(obj)
- 判断一个对象是否是可扩展（能否在它上面添加新的属性）Object.isExtensible(obj)
- 将一个对象密封并返回被密封后的对象（只有可写属性不受影响）Object.seal(obj)
- 判断一个对象是否被密封 Object.isSealed(obj)

ES6允许直接写入变量和函数作为对象的属性和方法，可在字面量定义对象时使用表达式作为对象的属性名，表达式放在方括号内。

ES6针对Object扩展了以下方法：
- 比较两个值是否严格相等 Object.is(value1, value2)
- 将所有可枚举属性的值从一个或多个源对象复制到目标对象 Object.assign(target, ...source)
- 设置一个指定对象原型到另一个对象或null Object.setPrototypeOf(obj, prototype)

JavaScript语言中生成实例对象的传统方法是通过构造函数。ES6提供了更接近传统语言的写法，引入了Class（类）这个概念作为对象的模板，可通过`class`关键字定义类。

ECMAScript 2017在Object上新增了三个方法：
- 返回一个给定对象自己的所有可枚举属性值的数组 Object.values(obj)
- 返回一个给定对象自身可枚举属性的键值对数组 Object.entries(obj)
- 获取一个对象的所有自身属性描述符 Object.getOwnPropertyDescriptors(obj)

### 函数

在ES5中新增了一个方法，用来改变函数调用时的this指向：fun.bind(thisArg[, arg1, [, arg2[, ...]]])。

在ES6中可以指定函数参数的默认值，指定参数默认值后函数的length属性将返回没有指定默认值的参数个数。引入rest参数（形式为...变量名），用于获取函数多余的参数，rest参数能够将多余的参数放入一个数组中。ES6优化了尾调用性能。

ES6定义了一种新的函数定义方式，使用“箭头”（=>）定义函数，简化了函数的定义，函数体内的this对象是定义时所在的对象而不是使用时所在的对象。针对异步编程提出了一个解决方案为Generator函数。

ES2017引入了async函数，使得异步操作变得更加方便。async函数实为Generator函数的语法糖。

### 正则表达式

ES5中用正则表达式创建的RegExp对象运行时实例独立，ES3则共享同一个实例。

ES6允许用RegExp构造函数第一个参数是正则对象时，第二个参数可指定修饰符，并且会忽略原有正则表达式的修饰符。

字符串对象共有4个方法，可以使用正则表达式：match()、replace()、search()、split()，ES6将这4个方法在语言内部全部调用RegExp的实例方法，从而做到所有正则相关的方法全都定义在RegExp对象上。

ES6对正则表达式添加了u修饰符（Unicode模式）、y修饰符（粘连修饰符）、s修饰符（dotAll模式），同时新增了sticky属性（是否设置y修饰符）、flags属性（返回正则表达式的所有修饰符）、dotAll属性（是否设置s修饰符）。
