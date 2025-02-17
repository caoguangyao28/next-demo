---
title: "js 模块化演进过程"
date: "2025-02-17"
description: "js 模块化演进过程，常见模块化定义说明以及其基本运行原理说明"
---

## js 常见的模块化定义

1. **AMD** 适用于浏览器端，异步模块化，本质上通过script标签引入，然后通过define函数定义模块，通过require函数引入模块。最佳实现者：`requirejs`.
2. **CMD** 类似于 AMD。最佳实现者：`seajs`.
3. **CommonJS/CJS** 适用于服务器端，同步模块化，通过require函数引入模块，通过module.exports导出模块。出现于nodejs中。
4. **ESM** ES Modules 是 ECMAScript 6（ES6）引入的官方模块化标准，**它在浏览器和 Node.js 环境中都得到了支持**。
5. **UMD** 适用于浏览器端和nodejs，通过require函数引入模块，通过module.exports导出模块。 是一种兼容性方案。


### AMD（Asynchronous Module Definition）
AMD（Asynchronous Module Definition）是一种异步模块定义规范，用于在浏览器中加载模块。AMD规范定义了如何加载模块，以及如何定义模块。Requirejs 推行的规范产物。所以最标准的实践就是 RequireJS 库，很多老一点项目 js 的 异步加载都会用到它。
常规的写法如下：

```javascript
//AMD设计出一个简洁的写模块API：
// id: 模块标识，dependencies: 模块依赖 [], factory: 实例化函数 或对象
define(id?, dependencies?, factory)

// 模块加载
// module 要加载的模块， callback
require([module], callback)

```
**AMD** 异步加载的原理主要基于 JavaScript 的异步特性，通常是通过 XMLHttpRequest（XHR）或者动态创建 `<script>` 标签来实现的。

当使用 require 函数请求一个模块时，AMD 模块加载器会检查该模块是否已经被加载过。如果没有，它会创建一个异步请求来获取模块的脚本文件。

在获取到脚本文件后，模块加载器会执行其中的 define 函数来定义模块，并将其注册到内部的模块管理系统中。当所有依赖的模块都加载并执行完成后，回调函数会被触发，从而可以使用这些加载好的模块进行后续的操作。

通过这种方式，页面的加载和渲染不会被模块的加载阻塞，提高了页面的响应性能和用户体验。
以下是一个简单的示例代码，模拟了 AMD 异步加载模块的过程（这只是一个简单的示意，并非完整的 AMD 实现）：

```javascript
function loadModule(moduleName, dependencies, callback) {
  let loadedDependencies = {};
  let remainingDependencies = dependencies.length;

  // 模拟加载依赖模块
  dependencies.forEach(dep => {
    let script = document.createElement('script');
    script.src = `${dep}.js`;
    script.onload = function() {
      loadedDependencies[dep] = true;
      remainingDependencies--;
      if (remainingDependencies === 0) {
        callback();
      }
    };
    document.head.appendChild(script);
  });
}

// 使用示例
loadModule('myModule', ['dep1', 'dep2'], function() {
  // 在这里使用加载好的模块进行操作
});
```

### CMD（Common Module Definition）
CMD是SeaJS 在推广过程中对模块定义的规范化产出

对于依赖的模块AMD是提前执行，CMD是延迟执行。不过RequireJS从2.0开始，也改成可以延迟执行（根据写法不同，处理方式不通过，越往后 AMD CMD 基本趋同）

CMD推崇依赖就近，AMD推崇依赖前置。

``` javascript

//AMD
define(['./a','./b'], function (a, b) {
 
    //依赖一开始就写好
    a.test();
    b.test();
});
 
//CMD  虽然 AMD也支持CMD写法，但依赖前置是官方文档的默认模块定义写法。
define(function (requie, exports, module) {
     
    //依赖可以就近书写
    var a = require('./a');
    a.test();
     
    ...
    //软依赖
    if (status) {
     
        var b = requie('./b');
        b.test();
    }
});
```

### CommonJS/CJS
CommonJS是服务器端模块的规范，Node.js采用了这个规范。根据CommonJS规范，一个单独的文件就是一个模块。加载模块使用require方法，该方法读取一个文件并执行，最后返回文件内部的exports对象。

```javascript
// foobar.js
//私有变量
var test = 123456;
//公有方法
function foobar () {
 
    this.foo = function () {
        // do someing ...
    }
    this.bar = function () {
        //do someing ...
    }
}
//exports对象上的方法和变量是公有的
var foobar = new foobar();
exports.foobar = foobar;
```
CommonJS 加载模块是同步的，所以只有加载完成才能执行后面的操作。像Node.js主要用于服务器的编程，加载的模块文件一般都已经存在本地硬盘，所以加载起来比较快，不用考虑异步加载的方式，所以CommonJS规范比较适用。但如果是浏览器环境，要从服务器加载模块，这是就必须采用异步模式。所以就有了 AMD  CMD 解决方案。

**通过 require** 伪代码来彻底了解

伪代码运行过程，结合下面 `1.js` `2.js`。

模块一 `1.js`

```javascript
const b = require("./2.js");

console.log(b);// {d: 4} 因为模块文件 默认 return 的是 module.exports

```

模块二 `2.js`

``` javascript
console.log(this === exports, exports === module.exports); // true true
this.a = 1
exports.b = 2;
exports = {
	c: 3
}

module.exports = {
	d: 4
}

exports.e = 5;
this.f = 6;

console.log(this, exports, module);// {a: 1, b: 2, f: 6} {c: 3, e: 5} {d: 4}

```

**运行**

```shell
node 1.js
```
运行过程，伪代码执行 大体如下

```javascript
var caches = {};
function require(modulePath) {
  var moduleId = getModuleId(modulePath);
  if(caches[modulePath]) {
    return caches[modulePath]
  }

  function _require(exports, require, module, __filename, __dirname) {
    // 目标模块的代码
    this.a = 1;
    exports.b = 2;
    exports = {
      c: 3
    }
    module.exports = {
      d: 4
    }
    exports.e = 5;
    this.f = 6;
  }

  // 准备运行辅助函数
  var module = {
    exports: {}
  }
  var exports = module.exports;
  var __filename = moduleId;
  var __dirname = getDirname(__filename);
  _require.call(exports, exports, require, module, __filename, __dirname);
  caches[moduleId] = module.exports;

  return module.exports;
}

```

模块内的 `this` `exports` `module.exports` 都是当前模块的实例，所以 `this === exports === module.exports`。都是`require` 函数的入参。

见伪代码中 `_require.call(exports, exports, require, module, __filename, __dirname)`。 通过 call 绑定函数内的 `this` 为 `exports`，同时传入 `exports`， `require` 加载函数， `module` 为 `module` 对象， `__filename` 为模块路径， `__dirname` 为模块路径的目录。

即模块其实就是函数运行环境，一开始： `this`  `exports` `module.exorts`  其实是一个对象 `{}` 都是模块实例。

观察 模块一 `1.js` 模块二 `2.js` 运行过程，可以发现，模块二 `2.js` 运行过程中，手动改变了 `exports` `module.exorts`  指向后， 日志输出会发生改变，但模块默认导出的是 `module.exports` 所以在模块一中 `b`, 日志输出的是 `{d: 4}` 而不是 模块二 的实列 。


### EMS 现在之主流

**静态导入导出**

静态导入、导出指的是在编译阶段（而非运行时）就能确定模块之间的依赖关系和导出内容。也就是说，JavaScript 引擎在代码执行之前，通过扫描 import 和 export 语句，就能知道哪些模块被导入和导出，而不需要执行代码来动态确定。

**带来的优势**

1. **提前优化**：由于在编译阶段就能确定模块依赖关系，JavaScript 引擎和打包工具（如 Webpack、Rollup）可以对代码进行更有效的优化，例如进行 Tree - Shaking（去除未使用的代码）。因为知道哪些模块被实际使用，哪些未被使用，就可以在打包时将未使用的代码剔除，从而减小打包文件的体积。
2. **静态分析**： 便于进行静态代码分析工具（如 ESLint、TypeScript）的工作。这些工具可以在不执行代码的情况下，分析模块之间的依赖关系和导出内容，从而发现潜在的错误，提高代码的质量和可维护性。
3. **模块循环引用检测**： 静态导入导出能够在编译阶段检测出模块之间的循环引用问题，避免在运行时出现难以调试的错误。

EMS 在 node 端已经得到了很好的支持，基本已经开始普遍使用，但在浏览器端使用率可能不是很高，主要是很多项目还在考虑兼容性问题打包结果大都还是 UMD 格式。但原生的 EMS 脚步已经越来越近了。

#### 细说一下EMS在浏览器中的运行
在浏览器运行时，对 ESM（ES Modules）模块的静态分析、静态导入和导出主要是通过浏览器的 JavaScript 引擎来完成的，以下为你详细介绍其具体过程：

1. **解析 HTML 中的 `<script type="module">`** 当浏览器遇到 HTML 文档里带有 `type="module"` 属性的 `<script>` 标签时，会将其识别为 ESM 模块。
例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ES Modules Example</title>
</head>
<body>
    <script type="module" src="main.js"></script>
</body>
</html>
```
浏览器会按照下面的步骤对 main.js 模块进行处理。

2. **静态分析导入和导出语句**

**解析导入语句**

JavaScript 引擎在不执行代码的情况下，扫描模块中的 import 语句，确定该模块依赖的其他模块。例如，对于以下 main.js 文件：

```javascript
import { add } from './math.js';
console.log(add(1, 2));
```
引擎会识别出 main.js 依赖于 ./math.js 模块中的 add 函数。这种静态分析在编译阶段完成，无需执行代码，因此引擎可以提前知道模块间的依赖关系。

**解析导出语句**

引擎同样会扫描模块中的 export 语句，确定该模块向外提供的内容。例如，对于 math.js 文件：

```javascript
export const add = (a, b) => a + b;
```
引擎可以识别出 math.js 模块导出了 add 函数。

**构建模块地图**

基于静态分析的结果，浏览器会构建一个模块图（Module Graph）。模块图是一个有向图，节点表示模块，边表示模块之间的依赖关系。通过模块图，浏览器可以清晰地了解各个模块之间的依赖层级和顺序。

**按需加载模块**
浏览器根据模块图，按照依赖关系依次加载所需的模块。在加载过程中，它会遵循以下规则：

- **异步加载**：ESM 模块默认是异步加载的，这意味着不会阻塞页面的渲染。浏览器会并行地请求依赖的模块，提高加载效率。
- **缓存机制**：如果某个模块已经被加载过，浏览器会使用缓存中的副本，避免重复加载。

**执行模块代码**
当所有依赖的模块都加载完成后，浏览器会按照模块图的顺序依次执行模块代码。在执行过程中，已经通过静态分析确定的导入和导出内容会被正确地解析和使用。

假设我们有三个模块文件：`main.js`、`math.js` 和 `utils.js`。

**`math.js`**

```javascript
export const add = (a, b) => a + b;
```

**`utils.js`**

```javascript
export const square = (num) => num * num;
```

**`main.js`**

```javascript
import { add } from './math.js';
import { square } from './utils.js';

console.log(add(1, 2));
console.log(square(3));
```
浏览器执行流程如下：

1. 解析 HTML 中的 `<script type="module" src="main.js">` 标签，开始处理 `main.js` 模块。
2. 对 `main.js` 进行静态分析，发现它依赖于 `math.js` 和 `utils.js`。
3. 构建模块图，确定 `main.js` 依赖于 `math.js` 和 `utils.js`。
4. 异步加载 `math.js` 和 `utils.js` 模块。
5. 当 `math.js` 和 `utils.js` 加载完成后，执行 `main.js` 代码，正确使用导入的 `add` 和 `square` 函数。

通过这种静态分析和按需加载的方式，浏览器能够高效地处理 ESM 模块，同时利用静态导入和导出的特性进行代码优化。

### UMD 为了兼容兼顾

UMD是AMD和CommonJS的糅合，目前应该不少项目扔在使用，主要是 webpack 或者其他构建工具，构建产物为了兼顾浏览器端和 node端，采用的构建目标格式

AMD模块以浏览器第一的原则发展，异步加载模块。
CommonJS模块以服务器第一原则发展，选择同步加载，它的模块无需包装(unwrapped modules)。
这迫使人们又想出另一个更通用的模式UMD （Universal Module Definition）。希望解决跨平台的解决方案。

UMD先判断是否支持Node.js的模块（exports）是否存在，存在则使用Node.js模块模式。
在判断是否支持AMD（define是否存在），存在则使用AMD方式加载模块。




 


