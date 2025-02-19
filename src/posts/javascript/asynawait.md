---
title: "async/await 核心原理"
date: "2025-02-17"
description: "async/await 语法糖的工作原理是怎么样的"
---

- 基于 Promise：所有异步操作最终转换为 Promise。
- 生成器控制流程：利用生成器的 yield 暂停和 next() 恢复机制。
- 微任务调度：通过事件循环的微任务队列实现非阻塞等待。
- 语法糖简化：隐藏了 Promise 链式调用和生成器的复杂性，提供更直观的同步式代码风格。

### 1. async 函数的本质
- 返回 Promise：任何 async 函数都会隐式返回一个 Promise 对象。
```JAVASCRIPT
async function foo() { return 42; }
// 等价于：
function foo() { return Promise.resolve(42); }
```
- 错误处理：若函数内抛出错误（如 throw new Error），会返回一个 rejected 状态的 Promise。

### 2. await 的行为
- 暂停与恢复：await 会暂停当前 async 函数的执行，等待其后的 Promise 完成（resolve 或 reject）。
- 非阻塞：暂停期间，JavaScript 主线程可以处理其他任务（如 UI 渲染、事件响应），不会阻塞整个线程。

### 3. 底层实现：生成器 + 自动执行器

`async/await` 的实现可视为 生成器函数 + 自动执行器 的语法糖。

例如，以下代码：

```javascript
async function example() {
  let a = await PromiseA();
  let b = await PromiseB(a);
  return b;
}
```
会被转译为类似：

```javascript
function example() {
  return spawn(function* () {
    let a = yield PromiseA(); // 暂停，等待 PromiseA 完成
    let b = yield PromiseB(a); // 再次暂停，等待 PromiseB 完成
    return b;
  });
}
```
其中，spawn 是一个自动执行生成器的工具函数，负责处理 Promise 的解析和恢复执行。

### 4. 自动执行器（spawn）的作用

自动执行器的伪代码逻辑：

```javascript
function spawn(generator) {
  return new Promise((resolve, reject) => {
    const gen = generator(); // 启动生成器
    function step(nextFn) {
      let next;
      try {
        next = nextFn(); // 执行下一步（可能抛出错误）
      } catch (e) {
        return reject(e); // 捕获错误，Promise 变为 rejected
      }

      if (next.done) {
        return resolve(next.value); // 生成器执行完毕，返回最终值
      }

      // 将 next.value 视为 Promise，等待其完成
      Promise.resolve(next.value).then(
        (v) => step(() => gen.next(v)), // 成功：恢复生成器并传入结果
        (e) => step(() => gen.throw(e)) // 失败：向生成器抛出错误
      );
    }

    step(() => gen.next()); // 启动生成器
  });
}

```

### 5. 事件循环中的行为
- **微任务（Microtask）**：await 后的代码会被包装为微任务，在当前宏任务完成后、下一轮事件循环前执行。

```javascript
async function demo() {
  console.log(1);
  await Promise.resolve(); // 微任务入队
  console.log(2);
}
demo();
console.log(3);
// 输出顺序：1 → 3 → 2

```

### 6. 错误处理机制
- **try/catch 支持**：await 允许使用 try/catch 捕获异步错误：
```javascript
async function fetchData() {
  try {
    let data = await fetch(url);
  } catch (e) {
    console.error("请求失败:", e);
  }
}
```
底层是 Promise 的 .catch()，错误会被传递到最近的 catch 块。


