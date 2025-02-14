---
title: "React简易调度器实现"
date: "2025-02-08"
description: "参考requestIdleCallback执行机制，以及为了实现优先级可控，模拟实现一个简单版本的调度器，帮助理解react任务调度的基本原理。"
---

![思维导图](https://front-end-share-1257122416.cos.ap-shanghai.myqcloud.com/cgy/upic/OIZ4Pe.jpg)

## 一、简介
在React中，调度器（Scheduler）是其核心组件之一，负责协调和优化UI更新的时机。本文通过模拟实现一个简化版的调度器分装类——`SimpleScheduler`类，帮助理解任务调度的基本原理。

## 二、代码结构与功能解析

### 1. 任务优先级枚举常量
```javascript
const ImmediatePriority = 1,
  UserBlockingPriority = 2,
  NormalPriority = 3,
  LowPriority = 4,
  IdlePriority = 5;
```
定义了五种不同级别的任务优先级，用于计算每个任务的超时时间。数值越小表示优先级越高。

### 2. 获取当前精确时间
```javascript
function getCurrentTime() {
  return performance.now(); 
}
```
使用`performance.now()`方法获取当前时间，精度可达微秒级别，为后续计算任务的过期时间提供准确的时间戳。

### 3. SimpleScheduler 类
#### 构造函数
```javascript
constructor() {
  this.taskQueue = []; // 任务队列
  this.isPerformingWork = false; // 当前是否执行任务

  const channel = new MessageChannel();
  this.port = channel.port2;
  channel.port1.onmessage = this.performWorkUntilDeadline.bind(this);
}
```
- `taskQueue`：存储待处理的任务。
- `isPerformingWork`：标识当前是否有任务正在执行。
- 使用`MessageChannel`创建了一个消息通道，通过`port1`监听消息事件来触发任务执行，并绑定`performWorkUntilDeadline`方法。

#### 为什么使用的是 `MessageChannel` 
使用 `MessageChannel` 来触发任务执行有以下几个优点：

- **更短的时间间隔和更高的精度**：相比于传统的定时器（如 `setTimeout` 或 `setInterval`），`MessageChannel` 提供了更短的时间间隔和更高的精度。这是因为 `MessageChannel` 是基于宏任务的消息机制，可以“立即执行”，而不需要等待浏览器的事件循环周期。

- **避免阻塞主线程**：通过 `MessageChannel` 创建的消息通道可以在不阻塞主线程的情况下异步执行任务。这有助于提高应用的响应性和流畅度，特别是在处理大量或复杂任务时。

- **更好的控制任务调度**：`MessageChannel` 允许开发者更好地控制任务的调度和执行顺序。在 `SimpleScheduler` 类中，当没有任务正在执行时，通过 `postMessage` 发送消息给 `port2`，触发 `performWorkUntilDeadline` 方法执行任务。这种方式确保了任务按照设定的优先级和时间顺序执行，同时不会影响其他任务的正常运行。

- **模拟浏览器空闲时间**：`MessageChannel` 的消息传递机制可以帮助模拟浏览器的空闲时间（idle time）。这意味着当浏览器处于空闲状态时，可以利用这段时间来执行低优先级的任务，从而优化资源利用率并提升用户体验。

#### 为什么不用微任务？

在`SimpleScheduler`类中选择使用`MessageChannel`而不是微任务（如`Promise`或`MutationObserver`）来触发任务执行，主要基于以下几个原因：

1. **避免阻塞主线程**：
   - **微任务**：微任务会在当前同步代码执行完毕后立即执行，这意味着它们会优先于宏任务（如事件处理程序、`setTimeout`等），但仍然会阻塞后续的渲染和用户交互。如果微任务队列中有大量任务，可能会导致页面卡顿。
   - **宏任务（`MessageChannel`）**：`MessageChannel`创建的消息通道属于宏任务，它不会阻塞主线程，允许浏览器有机会进行渲染和其他必要的操作，从而提高应用的响应性和流畅度。

2. **更好的控制任务调度**：
   - **微任务**：微任务的执行时机是固定的，即在当前同步代码执行完毕后立即执行，无法灵活地控制其执行时间。
   - **宏任务（`MessageChannel`）**：通过`MessageChannel`可以更灵活地控制任务的调度和执行顺序。例如，在`SimpleScheduler`中，当没有任务正在执行时，可以通过`postMessage`发送消息给`port2`，触发`performWorkUntilDeadline`方法执行任务。这种方式确保了任务按照设定的优先级和时间顺序执行，同时不会影响其他任务的正常运行。

3. **模拟浏览器空闲时间**：
   - **微任务**：微任务无法很好地模拟浏览器的空闲时间，因为它们总是会在当前同步代码执行完毕后立即执行。
   - **宏任务（`MessageChannel`）**：`MessageChannel`的消息传递机制可以帮助模拟浏览器的空闲时间（idle time）。这意味着当浏览器处于空闲状态时，可以利用这段时间来执行低优先级的任务，从而优化资源利用率并提升用户体验。

4. **与React调度器的一致性**：
   - React调度器本身也使用了类似的机制来管理任务调度。`MessageChannel`的使用使得`SimpleScheduler`的行为更加接近真实的React调度器，有助于开发者更好地理解和模拟其工作原理。

综上所述，`MessageChannel`为任务调度提供了一种高效、灵活且非阻塞的方式，特别适合用于实现类似React调度器这样的复杂任务管理系统。相比之下，微任务虽然有其优势，但在这种场景下并不如`MessageChannel`合适。

#### scheduleCallback 方法
```javascript
scheduleCallback(priortyLevel, callback) {
  const curTime = getCurrentTime();
  let timeout;

  switch (priortyLevel) {
    case ImmediatePriority:
      timeout = -1;
      break;
    case UserBlockingPriority:
      timeout = 250;
      break;
    case NormalPriority:
      timeout = 5000;
      break;
    case LowPriority:
      timeout = 1073741823;
      break;
    case IdlePriority:
      timeout = 10000;
      break;
    default:
      timeout = 5000;
      break;
  }

  const task = {
    callback,
    priortyLevel,
    expirationTime: curTime + timeout
  };

  this.push(this.taskQueue, task);
  this.schedulePerformWorkUntilDeadline();
}
```
根据传入的优先级设置任务的超时时间，并创建任务对象加入到任务队列中，最后调用`schedulerPerformWorkUntilDeadline`方法通知开始执行任务。

#### schedulePerformWorkUntilDeadline 方法
```javascript
schedulePerformWorkUntilDeadline() {
  if (!this.isPerformingWork) {
    this.port.postMessage(null);
  }
}
```
当没有任务正在执行时，通过`postMessage`发送消息给`port1`，触发`performWorkUntilDeadline`方法执行任务。

#### performWorkUntilDeadline 方法
```javascript
performWorkUntilDeadline() {
  this.isPerformingWork = true;
  this.workLoop();
  this.isPerformingWork = false;
}
```
标记任务开始执行，调用`workLoop`方法循环执行任务队列中的任务，完成后取消标记。

#### workLoop 方法
```javascript
workLoop() {
  let curTask = this.peek(this.taskQueue);
  while (curTask !== null) {
    const callback = curTask.callback;
    if (typeof callback === 'function') {
      callback();
    }
    this.pop(this.taskQueue);
    curTask = this.peek(this.taskQueue);
  }
}
```
从任务队列中取出任务并执行其回调函数，直到所有任务执行完毕。

#### 辅助方法
```javascript
peek(queue) {
  return queue[0] || null;
}

pop(queue) {
  return queue.shift();
}

push(queue, task) {
  queue.push(task);
  queue.sort((a, b) => a.expirationTime - b.expirationTime);
}
```
提供了对任务队列的基本操作，包括查看队首元素、移除队首元素以及按优先级插入新任务。

## 三、测试示例
```javascript
const scheduler = new SimpleScheduler();

scheduler.scheduleCallback(LowPriority, () => {
  console.log('Task 1: Low Priority');
});

scheduler.scheduleCallback(ImmediatePriority, () => {
  console.log('Task 2: Immediate Priority');
});

scheduler.scheduleCallback(IdlePriority, () => {
  console.log('Task 3: Idle Priority');
});

scheduler.scheduleCallback(UserBlockingPriority, () => {
  console.log('Task 4: User Blocking Priority');
});

scheduler.scheduleCallback(NormalPriority, () => {
  console.log('Task 5: Normal Priority');
});
```
通过创建`SimpleScheduler`实例并安排多个不同优先级的任务，可以观察到它们按照设定的优先级顺序依次执行。

## 四、总结
本篇文章介绍了`SimpleScheduler`类的设计思路及其主要功能模块，它模拟了React调度器的工作机制，能够根据任务的优先级合理安排执行顺序，确保高优先级的任务得到及时响应。这对于理解前端框架内部如何高效管理异步任务具有重要意义。