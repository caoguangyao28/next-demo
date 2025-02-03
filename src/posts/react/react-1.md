---
date: '2025-02-03'
title: react中虚拟dom，fiber架构，渲染器原理说明
description: react中虚拟dom，fiber架构，渲染器原理简化，代码模拟说明
---

## React 核心概念与实现解析

文件：js/react.js
### 一、虚拟 DOM 结构

React 使用虚拟 DOM（Virtual DOM）来提高渲染效率。虚拟 DOM 是一个轻量级的 JavaScript 对象，它描述了实际 DOM 的结构。通过比较新旧虚拟 DOM 的差异，React 可以最小化对实际 DOM 的操作。

#### 1. 创建虚拟 DOM

```javascript
const React = {
  createElement(type, props = {}, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child => typeof child === 'object' ? child : React.createTextElement(child))
      }
    }
  },

  createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: []
      }
    }
  }
}
```


- `createElement` 方法用于创建虚拟 DOM 节点。
- `createTextElement` 方法用于创建文本节点。

#### 示例：

```javascript
console.log('start: 虚拟dom结构 demo')
const vdom = React.createElement('div', { id: 'a' }, 'hello world');
console.log(vdom, 'vdom1');
// 嵌套
const vdom2 = React.createElement('div', { id: 'b' }, React.createElement('span', null, 'hello world'));
console.log(vdom2, 'vdom2');
console.log('end: 虚拟dom结构 demo')
```
### 二、Fiber 架构与调度器


Fiber 是 React 内部用于管理任务和优化渲染的核心机制。它将渲染任务拆分为多个小的工作单元，以便在主线程空闲时逐步完成这些任务，从而避免阻塞用户交互。

#### 1. Fiber 渲染入口

```javascript
function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    alternate: currentRoot
  }

  nextUnitOfWork = wipRoot;
  deletions = [];
}
```


- `render` 函数是 Fiber 渲染的入口，负责初始化新的 Fiber 树（`wipRoot = {...}` ）并启动工作循环，同时如果非首次构建则将其上一次进行缓存通过 `alternate: currentRoot` 进行关联。
-  `currentRoot` 将在 `commitRoot` 提交DOM变化 时进行当时Fiber的缓存赋值

#### 2. 创建 Fiber

```javascript
function createFiber(vdom, parent) {
  return {
    type: vdom.type,
    props: vdom.props,
    parent,
    dom: null,
    child: null,
    sibling: null,
    alternate: null,
    effectTag: null
  }
}
```


- `createFiber` 函数用于创建一个新的 Fiber 节点 常见属性具体见代码，主要为 节点类型、节点props、父节点对象、本节点对应的dom、子节点、兄弟节点、对应的旧节点、更新类型（新增 删除 更新）。

#### 3. 创建 DOM

```javascript
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}
```


- `createDom` 函数根据 Fiber 节点创建对应的 DOM 元素，这里实现的简单主要区分是否是文本节点。非文本节点，先根据节点类型常见元素，然后通过 `updateDom(dom, {}, fiber.props)` 更新元素属性为具体的 `fiber.props`

#### 4. 更新 DOM 属性

```javascript
function updateDom(dom, prevProps, nextProps) {
  Object.keys(prevProps)
    .filter(name => name !== 'children')
    .filter(name => prevProps[name] !== nextProps[name])
    .forEach(name => dom[name] = '');

  Object.keys(nextProps)
    .filter(name => name !== 'children')
    .filter(name => prevProps[name] !== nextProps[name])
    .forEach(name => {
      dom[name] = nextProps[name];
      console.log(dom[name], 'dom属性更新', name)
    });
}
```


- `updateDom` 函数用于更新 DOM 元素的属性, 这里需要元素节点属性更新时，新旧属性的一个比对过程，即 非子节点属性，新旧不同的属性，先将元素对应属性设置为空，然后通过循环新属性，差不多的逻辑 排除子元素，与旧属性不一致的元素属性设置为新属性。

#### 5. 工作循环

```javascript
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
```


- `workLoop` 函数是 React 的核心调度器，它使用 `requestIdleCallback` 来分帧执行任务，看代码可知，函数定义后 通过 `requestIdleCallback(workLoop)`。进行了注册初次触发，`workLoop` 函数中每执行完一次将重复进行 `requestIdleCallback(workLoop)`, 分帧功能借助了 浏览器API `requestIdleCallback` , 真实场景下react 本身封装了相关调度器，原因是，原生的api存在兼容性问题，同时 任务的调度存在颗粒度可控问题，优先级调整控制问题

#### 6. 执行工作单元

```javascript
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
    console.log(fiber.dom, 'fiber.dom', 'vdom 与 dom 进行初次绑定');
  }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
}
```


- `performUnitOfWork` 函数负责处理单个工作单元，这里的单个工作单元是处理生成新的fiber 节点，同时与祖先节点进行关联，在上层函数workLoop中一帧内是可能处理多个单元的，所以返回的是子节点或者兄弟节点（兄弟节点会依次从当前的往上逐层查找）。

#### 7. 简化 Diff 算法

对比的是子节点（因为全局的Fiber 是从 `#root` 元素开始的，react 生成部分从 `root` 的子元素开始--简化板逻辑），根据子节点类型以及新旧props进行判断，重新组合

```javascript
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }

    if (element && !sameType) {
      newFiber = createFiber(element, wipFiber);
      newFiber.effectTag = 'PLACEMENT';
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```


- `reconcileChildren` 函数实现了简化的 Diff 算法，用于比较新旧 子节点fiber并生成或更新新的 Fiber 树。

#### 8. 提交更新

```javascript
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  const domParent = fiber.parent.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
    return // 需要进行，否则继续往下执行存在重复调研删除逻辑，导致报错
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```


- `commitRoot` 和 `commitWork` 函数负责将新的 Fiber 树应用到实际 DOM 中，前者为一次完整提交入口，执行过程中会对当前的 `wipRoot` 进行缓存关联到 `currentRoot` 便于下次新生成时关联就节点使用。
- `commitWork` 本身存在递归调用，一次提交所有子节点 兄弟节点的变动，这里需要注意的是若果是 删除节点操作 需要 `return` 否则会出现重复删除已删除元素的情况 原因是，删除元素一方面是通过 `deletions` 数组循环完成删除的，但每一个 `commitWork` 中又联动递归删除兄弟元素了，如果元素存在兄弟元素删除操纵将多执行一次会发生错误 。

### 三、测试用例

模拟了初始化时创建元素，2s 后进行元素更新

```javascript
// 
render(
    React.createElement(
        'div',
        { id: 'ceshi', title: 'hello' },
        React.createElement('span', null, '初始化元素')
    ),
    document.getElementById('root')
);
// 模拟2s后更新子节点
setTimeout(() => {
    render(
        React.createElement(
            'div',
            { id: 'ceshi', title: 'hello2' },
            React.createElement('p', null, '新元素')),
        document.getElementById('root')
    );
}, 2000)
```


- 上述代码展示了如何使用自定义的 React 实现来渲染虚拟 DOM，并在 2 秒后更新 DOM。

### html 代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>reactjs 核心概念 技术实现</title>
</head>
<body>
  <div id="root"></div>
  <script src="./js/react.js"></script>
</body>
</html>
```

### 完整的模拟react.js(js/react.js) 代码

```javascript
/**
 * 模拟 React对象方法
 * 创建 vdom 方法 createElement
 * 创建文本节点方法 createTextElement
 * 
 * fiber 节点对象 ｛ type， props: {...props, children }｝
 */
const React = {
  createElement(type, props = {}, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map(child => typeof child === 'object' ? child : React.createTextElement(child))
      }
    }
  },

  // 创建文本节点
  createTextElement(text) {
    return {
      type: 'TEXT_ELEMENT',
      props: {
        nodeValue: text,
        children: []
      }
    }
  }
}

console.log('start: 虚拟dom结构 demo')
const vdom = React.createElement('div', { id: 'a' }, 'hello world');
console.log(vdom, 'vdom1');
// 嵌套
const vdom2 = React.createElement('div', { id: 'b' }, React.createElement('span', null, 'hello world'));
console.log(vdom2, 'vdom2');
console.log('end: 虚拟dom结构 demo')


// 调度器 Fiber

let currentRoot = null; // 旧的Fiber 树
let nextUnitOfWork = null; // 下一个工作单元
let wipRoot = null; // 当前正在工作的 Fiber
let deletions = null; // 需要删除的 Fiber

// fiber 渲染入口
/**
 * 
 * @param {object} element 虚拟dom
 * @param {dom} container 根组件dom容器
 */
function render(element, container) {
  //wipRoot 表示“正在进行的工作根”，它是 Fiber 架构中渲染任务的起点
  wipRoot = {
    dom: container, // 渲染目标的 DOM 容器
    props: {
      children: [element] // 要渲染的元素（例如 React 元素）
    },
    alternate: currentRoot
  }

  //nextUnitOfWork 是下一个要执行的工作单元（即 Fiber 节点）。
  // 在这里，将其设置为 wipRoot，表示渲染工作从根节点开始
  nextUnitOfWork = wipRoot;

  // 专门用于存放在更新过程中需要删除的节点。
  // 在 Fiber 更新机制中，如果某些节点不再需要，就会将它们放入 deletions，
  // 最后在 commitRoot 阶段将它们从 DOM 中删除
  deletions = [];
}

// 创建 Fiber
function createFiber(vdom, parent) {
  return {
    type: vdom.type,
    props: vdom.props,
    parent,
    dom: null, // 关联的 DOM 元素
    child: null, // 子节点
    sibling: null, // 兄弟节点
    alternate: null, // 对应前一次的Fiber 节点
    effectTag: null // 'PLACEMENT' , "UPDATE", 'DELETION'
  }
}

// 创建 DOM
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  // 更新dom 节点的属性
  updateDom(dom, {}, fiber.props);
  return dom;
}

// 更新dom节点属性
function updateDom(dom, prevProps, nextProps) {
  // 清除变动部分的旧属性
  Object.keys(prevProps)
    .filter(name => name !== 'children')
    .filter(name => prevProps[name] !== nextProps[name]) // 缺失的过滤 
    .forEach(name => dom[name] = ''); // 相当于删除所有属性了，而下面的更新只操作了 有差异的部分

  // 添加新属性-只是变动或者新增部分
  Object.keys(nextProps)
    .filter(name => name !== 'children') // 排除 children dom 无此属性
    .filter(name => prevProps[name] !== nextProps[name]) // 差异的进行处理
    .forEach(name => {
      dom[name] = nextProps[name];
      console.log(dom[name], 'dom属性更新', name)
    });
  // console.log(dom, 'dom', '更新dom', prevProps, nextProps)
}

// Fiber 渲染器单元 调度器
// 实现将耗时任务拆分成多个小的工作单元
function workLoop(deadline) {

  // 是一个标志，用来指示是否需要让出控制权给浏览器。
  // 如果时间快用完了，则设为 true，以便及时暂停任务，避免阻塞主线程
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    // 处理当前工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 判断是否需要让出控制权
    shouldYield = deadline.timeRemaining() < 1; // 小于 1ms 则让出控制权
  }

  // 没有工作单元，并且有 wipRoot 待提交的工作根，则提交更新
  if (!nextUnitOfWork && wipRoot) {
    // 提交更新
    console.log('提交更新', wipRoot);
    commitRoot();
  }

  // 重复循环 这里直接使用的 requestIdleCallback 
  // 存在兼容性问题 执行时机 颗粒度控制 等问题
  requestIdleCallback(workLoop);

}

// 分 帧 渲染
// 浏览器一帧的过程大体如下
//1.处理时间的回调click...事件
//2.处理计时器的回调
//3.开始帧
//4.执行requestAnimationFrame 动画的回调
//5.计算机页面布局计算 合并到主线程
//6.绘制
//7.如果此时还有空闲时间，执行requestIdleCallback

// 开始循环 requestIdleCallback 机制注意
requestIdleCallback(workLoop);

// 执行一个单元
function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
    console.log(fiber.dom, 'fiber.dom', 'vdom 与 dom 进行初次绑定');
  }

  // const vdom = React.createElement('div', { id: 1 }, React.createElement('span', null, '小满zs'));
  // 子节点在children中
  // 创建子节点 fiber
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);


  if (fiber.child) {
    return fiber.child
  }
  // 遍历 fiber 相邻的 fiber 树
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
  return null;
}

/**
 * Diff 算法: 将子节点与之前的 Fiber 树进行比较
 * @param {object} wipFiber 根节点 fiber
 * @param {object} elements 子节点
 */
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    console.log(oldFiber, 'oldFiber')
    // 比较旧 Fiber 和新元素
    const sameType = oldFiber && element && element.type === oldFiber.type;
    // 同类型节点复用
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      }
    }
    // 如果新节点存在，但类型不同，新增fiber节点
    if (element && !sameType) {
      newFiber = createFiber(element, wipFiber);
      newFiber.effectTag = 'PLACEMENT';
    }
    //如果旧节点存在，但新节点不存在，删除旧节点
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    //移动旧fiber指针到下一个兄弟节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 将新fiber节点插入到DOM树中
    if (index === 0) {
      //将第一个子节点设置为父节点的子节点
      wipFiber.child = newFiber;
    } else if (element) {
      //将后续子节点作为前一个兄弟节点的兄弟
      prevSibling.sibling = newFiber;
    }

    // 更新可能兄弟节点，如果有下次循环中将进行标识
    prevSibling = newFiber;
    index++;
  }
}

// 提交更新
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 提交单个节点
function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  // debugger
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
    return;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

//测试

// render(React.createElement('h1', null, 'hello world'), document.getElementById('root'));

// 测试用例diff

render(
    React.createElement(
        'div',
        { id: 'ceshi', title: 'hello' },
        React.createElement('span', null, '初始化元素')
    ),
    document.getElementById('root')
);

setTimeout(() => {
  render(
      React.createElement(
          'div',
          { id: 'ceshi', title: 'hello2' },
          React.createElement('p', null, '新元素')),
      document.getElementById('root')
  );
}, 2000)
```

### 总结

本文详细介绍了 React 的核心概念和技术实现，包括虚拟 DOM、Fiber 架构、Diff 算法以及调度器的工作原理。通过这些内容，读者可以更深入地理解 React 的内部机制，从而更好地进行开发和优化。