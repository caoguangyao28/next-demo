---
title: "浏览器事件循环机制"
date: "2025-02-10"
description: "浏览器事件循环机制,是做 web 应用开发的重要基础。尤其对于前端开发来说，了解浏览器事件循环机制对于提高开发效率和提高代码质量具有 crucial 的意义。"
---
## 为什么要了解

事件循环机制是 JavaScript 处理异步操作的核心机制，它允许 JavaScript 在执行异步任务时不会阻塞主线程，从而实现非阻塞 I/O 和多任务处理。通过事件循环，JavaScript 可以在等待异步操作完成的同时，继续执行其他任务，如响应用户输入、更新页面等。这使得 Web 应用能够更加流畅地运行，提高了用户体验。

深入理解浏览器事件循环机制对于 Web 开发者来说具有重要意义。它有助于开发者更好地编写高效、响应迅速的 Web 应用，避免出现性能瓶颈和页面卡顿等问题。同时，掌握事件循环机制也有助于开发者更好地理解 JavaScript 的异步编程模型，从而更熟练地使用 Promise、async/await 等异步编程工具。


## 浏览器事件循环机制基础

###  JavaScript 的单线程特性

####  为何 JavaScript 是单线程

JavaScript 的单线程特性与其设计初衷和应用场景密切相关。作为浏览器脚本语言，JavaScript 主要用于与用户互动以及操作 DOM。如果 JavaScript 允许多线程同时执行，会带来一系列复杂的同步问题。

假设 JavaScript 有两个线程，一个线程在某个 DOM 节点上添加内容，另一个线程同时删除了这个节点，此时浏览器就无法确定该以哪个线程的操作为准，这会导致页面渲染出现混乱。为了避免这种复杂性，JavaScript 从诞生之初就被设计为单线程语言，这一特性也成为了 JavaScript 的核心特征之一。

尽管 HTML5 提出了 Web Worker 标准，允许 JavaScript 脚本创建多个线程，但这些子线程完全受主线程控制，并且不得操作 DOM。因此，Web Worker 并没有改变 JavaScript 单线程的本质，只是在一定程度上利用了多核 CPU 的计算能力。

#### 单线程的优缺点

**优点**：

**编程简单**：单线程模型使得 JavaScript 的编程相对简单，开发者无需处理多线程编程中常见的线程同步、竞态条件等复杂问题。例如，在操作 DOM 时，不用担心多个线程同时修改 DOM 导致的不一致性。

**避免竞态条件和死锁**：由于同一时间只有一个任务在执行，不会出现多个线程竞争资源导致的竞态条件，也不会出现死锁问题，这使得程序的运行更加稳定和可预测。

**缺点**：

**执行效率低**：当遇到耗时较长的任务时，会阻塞主线程，导致后续任务无法及时执行。例如，进行复杂的计算或者发起网络请求时，如果采用同步方式，主线程会被阻塞，页面会出现卡顿，用户体验变差。

**易阻塞**：由于所有任务都在主线程上排队执行，一旦某个任务出现长时间的阻塞（如无限循环），整个程序将无法继续执行，包括用户交互、页面更新等操作都会被暂停。

###  事件循环机制的核心概念
先简单了解一下栈 `Stack` 与 队列 `queue`

####  执行栈（Call Stack）

执行栈是一个后进先出（LIFO，Last In First Out）的数据结构，常用于存储函数调用的执行上下文。当一个函数被调用时，
它的执行上下文会被压入执行栈的顶部；当函数执行完毕后，其执行上下文会从执行栈的顶部弹出。

例如，以下代码：

```javascript
function add(a, b) {
  return a + b;
}

function multiply(c, d) {
  var sum = add(c, d);
  return sum * 2;
}
multiply(3, 4);
```

在执行这段代码时，首先会将全局执行上下文压入执行栈。然后，当调用`multiply`函数时，`multiply`函数的执行上下文被压入执行栈，此时执行栈的顶部是`multiply`函数的执行上下文。
在`multiply`函数内部调用`add`函数时，`add`函数的执行上下文又被压入执行栈，位于`multiply`函数执行上下文的上方。
当`add`函数执行完毕后，其执行上下文从执行栈弹出，控制权返回给`multiply`函数。最后，`multiply`函数执行完毕，其执行上下文也从执行栈弹出，全局执行上下文成为执行栈的顶部。

#### 任务队列（Task Queue）

任务队列是一个先进先出（FIFO，First In First Out）的数据结构，用于存储异步任务的回调函数。
当一个异步任务（如定时器、网络请求、事件监听等）有了结果后，其对应的回调函数会被放入任务队列中。

例如，使用`setTimeout`函数设置一个定时器：

```javascript
console.log('开始');

setTimeout(function() {

  console.log('定时器回调');

}, 1000);

console.log('结束');
```

在这段代码中，`console.log('开始')`和`console.log('结束')`是同步任务，会依次在执行栈中执行。
而`setTimeout`函数是一个异步任务，它会在 1000 毫秒后将其回调函数放入任务队列中。
当执行栈中的同步任务执行完毕后，事件循环会从任务队列中取出这个回调函数，将其压入执行栈中执行，从而输出`定时器回调`。

#### 事件循环（Event Loop）

事件循环是 JavaScript 实现异步编程的核心机制。它的主要作用是不断地检查执行栈和任务队列，当执行栈为空时，事件循环会从任务队列中取出一个任务（回调函数），将其压入执行栈中执行，直到任务队列也为空。

事件循环的过程可以简单描述为：

所有同步任务都在主线程上执行，形成一个执行栈。

主线程之外，存在一个任务队列。异步任务有了运行结果后，会在任务队列中放置一个事件（即回调函数）。

一旦执行栈中所有的同步任务执行完毕，系统就会读取任务队列，将对应的异步任务（回调函数）放入执行栈中执行。

主线程不断重复上述步骤，形成一个循环，这就是事件循环。

**用一张图来理解事件循环：** (ps 图片来自 [阮一峰](https://www.ruanyifeng.com/blog/2014/10/event-loop.html))
![event-loop.jpg](https://www.ruanyifeng.com/blogimg/asset/2014/bg2014100802.png)

## 三、任务队列的类型与执行顺序

### 3.1 宏任务（Macro Task）

#### 3.1.1 宏任务的定义与常见类型

宏任务是指由浏览器或 Node.js 等宿主环境提供的任务，它们会被放入宏任务队列中。
宏任务通常是一些相对较大的任务单元，代表着一组独立的、离散的操作。常见的宏任务类型包括：

**整体脚本执行**：在浏览器环境中，`<script>`标签中的 JavaScript 代码整体可以视为一个宏任务。
当页面加载时，会依次执行`<script>`标签中的代码，这是宏任务的一种常见形式。例如：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script>
      console.log('这是整体脚本执行的宏任务');
  </script>
</body>
</html>
```

**定时器任务**：`setTimeout`和`setInterval`函数用于设置定时器，它们的回调函数会被作为宏任务放入任务队列。
`setTimeout`用于延迟执行一段代码，`setInterval`则用于按固定时间间隔重复执行代码。

**I/O 操作**：包括网络请求（如 `XMLHttpRequest`）、文件读取（在 Node.js 环境中）等 I/O 相关的操作。（网络请求有些特殊，如果实用 `fetch`进行网络请求 它是基于 Promise 属于微任务）
当这些操作完成后，其回调函数会被放入宏任务队列。

**UI 渲染**：浏览器在适当的时候会执行 UI 渲染操作，这也是一个宏任务。
例如，当页面元素的样式发生改变、内容更新或者用户进行了某些交互操作（如滚动、缩放等），可能会触发 UI 渲染宏任务，以确保页面的显示与最新状态一致。

#### 宏任务的执行特点与顺序

一般情况下宏任务的执行特点是按添加顺序依次执行。在事件循环中，每次执行栈为空时，
事件循环会从宏任务队列中取出一个宏任务放入执行栈中执行。
**当一个宏任务执行完毕后，并不会立即执行下一个宏任务，而是会先检查微任务队列，处理完所有微任务后，才会从宏任务队列中取出下一个宏任务继续执行**。

**需要注意的是：目前浏览器已经逐步优化宏任务的执行顺序，宏任务也有着分类区别优先级的趋势**

- Chrome 对任务队列的优先级进行了优化：
    - **用户交互任务**（如 `click` 事件）优先于其他宏任务。
    - `requestIdleCallback` 允许在空闲时段执行低优先级任务。

例如，以下代码展示了宏任务的执行顺序：

```javascript
console.log('同步任务1');
setTimeout(() => {
  console.log('宏任务1');
}, 0);

setTimeout(() => {
  console.log('宏任务2');
}, 0);

console.log('同步任务2');
```

在这段代码中，`console.log('同步任务1')`和`console.log('同步任务2')`是同步任务，会依次在执行栈中执行。两个`setTimeout`的回调函数是宏任务，它们会被放入宏任务队列。
由于`setTimeout`设置的延迟时间为 0，它们会尽快被执行，但仍然要等到执行栈中的同步任务执行完毕。
执行顺序为：首先输出`同步任务1`，然后输出`同步任务2`，接着事件循环从宏任务队列中取出第一个宏任务（即第一个`setTimeout`的回调）执行，
输出`宏任务1`，再取出第二个宏任务（第二个`setTimeout`的回调）执行，输出`宏任务2`。

###  微任务（Micro Task）

#### 微任务的定义与常见类型

微任务是一种比宏任务更小的任务单元，它们会在当前宏任务执行结束后、下一个宏任务开始执行前执行。
微任务通常用于处理一些需要尽快执行的操作，并且不会阻塞主线程。常见的微任务类型包括：

**Promise 的回调**：`Promise`对象的`then`、`catch`和`finally`方法的回调函数属于微任务。
当`Promise`状态发生改变（从`pending`变为`fulfilled`或`rejected`）时，这些回调函数会被放入微任务队列。
例如：

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve('成功结果');
  }, 1000);

});
promise.then(result => {
  console.log('这是Promise的微任务回调', result);
}).catch(error => {
  console.error('Promise出错:', error);
});
```

在这个例子中，`setTimeout`的回调函数是宏任务，而`promise.then`的回调函数是微任务。
当`Promise`被`resolve`后，`then`的回调函数会被放入微任务队列，
等待当前宏任务（即`setTimeout`的回调）执行完毕后执行。

**MutationObserver 的回调**：`MutationObserver`用于监听 DOM 的变化，当 DOM 发生指定的变化时，
其回调函数会被放入微任务队列。例如，监听某个元素的属性变化：

```javascript
const targetNode = document.getElementById('target');
const config = { attributes: true };
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
          console.log('这是MutationObserver的微任务回调，属性已改变:', mutation.attributeName);
      }
  }
});

observer.observe(targetNode, config);
// 模拟属性改变
targetNode.setAttribute('data-test', 'new-value');
```
在这个例子中，当`targetNode`的属性发生改变时，`MutationObserver`的回调函数会被作为微任务执行。

**queueMicrotask**：这是一个可以显式添加微任务的 API。调用`queueMicrotask`函数并传入一个回调函数，
该回调函数会被放入微任务队列。**（需要注意的目前该 api 兼容性上需要注意）**
例如：

```javascript
console.log('同步任务');
queueMicrotask(() => {
  console.log('这是通过queueMicrotask添加的微任务');
});
console.log('同步任务结束');
```
在这段代码中，`queueMicrotask`的回调函数会在当前同步任务执行完毕后，作为微任务执行。

#### 微任务的执行特点与顺序

微任务的执行特点是在当前宏任务执行结束后、下一个宏任务开始执行前执行。
当一个宏任务执行完毕后，事件循环会立即检查微任务队列，如果微任务队列中有任务，
则会依次执行这些微任务，直到微任务队列清空。在执行微任务的过程中，如果又产生了新的微任务，
这些新的微任务也会被添加到微任务队列中，并在当前微任务执行完毕后继续执行。
例如，以下代码展示了微任务的执行顺序：

```javascript
console.log('同步任务1');
Promise.resolve().then(() => {
  console.log('微任务1');
  Promise.resolve().then(() => {
      console.log('微任务2');
  });
});
console.log('同步任务2');
```

在这段代码中，`console.log('同步任务1')`和`console.log('同步任务2')`是同步任务，会依次在执行栈中执行。
`Promise.resolve().then(() => { console.log('微任务1'); })`是一个微任务，会在同步任务执行完毕后执行。
在`微任务1`的回调函数中，又创建了一个新的微任务`Promise.resolve().then(() => { console.log('微任务2'); })`，
这个新的微任务会被添加到微任务队列中，并在`微任务1`执行完毕后执行。
所以执行顺序为：首先输出`同步任务1`，然后输出`同步任务2`，接着执行微任务，输出`微任务1`，最后输出`微任务2`。

#### 事件循环的完成流程
浏览器事件循环的一次迭代（Tick）流程：

1. **执行一个宏任务**（从宏任务队列中选择一个优先级最高的任务，如最早到期的定时器）。
2. **执行所有微任务**（清空微任务队列，包括微任务中触发的新的微任务）。
3. **渲染管道（可选）**：
    - 检查是否需要渲染（`requestAnimationFrame` 回调在此阶段执行）。
    - 执行样式计算、布局（Layout）、绘制（Paint）。
4. 重复上述步骤。

**代码示例与执行顺序**

```js
console.log("Script Start");

setTimeout(() => console.log("Timeout"), 0);
Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

requestAnimationFrame(() => console.log("rAF"));
document.addEventListener("click", () => console.log("Click"));
console.log("Script End");
// 输出顺序：
// Script Start → Script End → Promise 1 → Promise 2 → rAF → Timeout
// （点击页面后输出 Click）

```
**关键点**
- `requestAnimationFrame` 在渲染阶段执行，优先级高于宏任务（如 `setTimeout`）。
- 微任务队列必须在宏任务之间清空。

## 四、浏览器事件循环机制的工作流程

###  初始执行阶段

当浏览器加载一个页面时，首先会解析 HTML 文档，构建 DOM 树。在这个过程中，如果遇到`<script>`标签，浏览器会暂停 DOM 树的构建，转而执行 JavaScript 代码。

JavaScript 代码的执行从全局代码开始，所有的同步任务会依次被放入执行栈中执行。例如，下面的代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script>
      console.log('同步任务1');
      function add(a, b) {
          return a + b;
      }
      var result = add(3, 4);
      console.log('计算结果:', result);
  </script>
</body>
</html>
```

在执行这段代码时，`console.log('同步任务1')`首先被压入执行栈，执行完毕后弹出；接着`add`函数被调用，`add`函数的执行上下文被压入执行栈，在`add`函数内部进行计算并返回结果；最后`console.log('计算结果:', result)`被压入执行栈，输出计算结果。

在执行同步任务的过程中，如果遇到异步任务，比如`setTimeout`、`Promise`等，它们并不会立即执行，而是会被放入相应的任务队列中。以`setTimeout`为例：

```javascript
console.log('同步任务2');

setTimeout(() => {

  console.log('异步任务（setTimeout）');

}, 1000);

console.log('同步任务3');
```

在这段代码中，`console.log('同步任务2')`和`console.log('同步任务3')`是同步任务，会依次在执行栈中执行。而`setTimeout`函数虽然设置了 1000 毫秒的延迟，但它的回调函数会立即被放入宏任务队列中，等待执行栈为空时被执行。

### 事件循环阶段

当执行栈中的所有同步任务执行完毕后，事件循环开始工作。事件循环会不断地检查任务队列，当发现宏任务队列中有任务时，会将其中一个宏任务取出并放入执行栈中执行。

在执行宏任务的过程中，如果产生了新的微任务，比如`Promise`的`then`回调，这些微任务会被放入微任务队列中。当一个宏任务执行完毕后，事件循环并不会立即去执行下一个宏任务，而是会先检查微任务队列。如果微任务队列中有任务，会依次将这些微任务取出并放入执行栈中执行，直到微任务队列清空。

例如，下面的代码：

```javascript
console.log('同步任务4');
setTimeout(() => {
  console.log('宏任务1');
  Promise.resolve().then(() => {
      console.log('宏任务中的微任务1');
  });
}, 0);
Promise.resolve().then(() => {
  console.log('微任务1');
});
console.log('同步任务5');
```

在这段代码中，首先执行同步任务`console.log('同步任务4')`和`console.log('同步任务5')`。接着，`setTimeout`的回调函数被放入宏任务队列，`Promise.resolve().then(() => { console.log('微任务1'); })`被放入微任务队列。由于微任务优先于宏任务执行，所以先执行微任务`console.log('微任务1')`。然后，事件循环从宏任务队列中取出`setTimeout`的回调函数执行，输出`宏任务1`，在这个宏任务的执行过程中，又产生了新的微任务`Promise.resolve().then(() => { console.log('宏任务中的微任务1'); })`，这个微任务会被放入微任务队列并执行，输出`宏任务中的微任务1`。

在完成一个宏任务和所有相关微任务的执行后，事件循环会再次检查宏任务队列，重复上述过程，直到宏任务队列和微任务队列都为空。

