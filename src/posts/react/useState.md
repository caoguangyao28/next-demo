---
title: "通过 useState 一窥 hook 的运行原理"
description: " 简化模拟 react 的执行上下文，模拟实现 useState 函数，实现 hook.queue 环状链表，从而理解 hook 更新渲染的大体机制"
date: "2025-02-07"
---

#### 示例代码
原理展示的简化性代码，只考虑 App 这一个函数组件，主要是理解 hook 的形成以及其更新机制是如何的
```javascript
let isFirstMonted = true; // 是否首次渲染
let workInProgressHook = null;// 当前正在工作的hook
let debouced;

// 模拟react 上下文环境
const fiber = {
  stateNode: App,// 根页面组件
  memorizedState: null,// 存储 hook 链表 这是一个 普通的链表
  props: {},
  alternate: {
    memorizedState: [],
  }
}
// 调度器
function schedule(){
  // 首次构建组件渲染 当然也执行了 useState 相关的逻辑
  const app = fiber.stateNode();
  // 首次渲染之后就是更新逻辑了
  isFirstMonted = false;
  // app 初始化之后或者更新之后 重置了 workInProgressHook
  workInProgressHook = fiber.memorizedState;
  return app;
}

// hooks
function useState(initialState){
  let hook;
  if(isFirstMonted){
    // 创建时形成 hooks 链表
    hook = {
      memorizedState: initialState,
      next: null,
      queue: {
        pending: null,
      }
    }
    // 当前node hook链表为空时 创建首个 hook 挂在 fiber.memorizedState 上
    if(!fiber.memorizedState){
      fiber.memorizedState = hook;
      console.log('首个hook对象')
    } else {
      // 同一时间创建多个 hook 非首个 放入 next
      // console.log('创建追加多个hook')
      // 这里其实 workInProgressHook 与 fiber.memorizedState 指向同一个引用，
      // 所以同步修改了 fiber.memorizedState.next
      workInProgressHook.next = hook;
    }
    // 第一次执行时即第一个hook创建完成， 指向 第一个 hook 指向 fiber.memorizedState
    // 后续执行时 指向 fiber.memorizedState.next !!! 形成链表 fisrthook.next.next.next
    workInProgressHook = hook;
  }else {
    // 更新时 取已经存在的 并 创建时的顺序
    // 执行 set 时 且每次更新时 workInProgressHook 都是从 fiber.memorizedState 开始
    hook = workInProgressHook;

    console.log('执行某个set时', workInProgressHook)
    // 组件内多个 hook 是连续执行的 所以当前hook 确定后，
    // workInProgressHook 按顺序取 下一个 ，这样才能对上号，多个 hook 执行的顺序 是按照创建顺序
    workInProgressHook = workInProgressHook.next
  }
   
  // 当前 hook 的初始值
  let basestate = hook.memorizedState;

  // 当前 hook 是否有 set 更新
  // 循环执行更新队列 循环执行的是 queue的 环状 链表
  if(hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;
    console.log(hook.queue.pending,'触发更新');
    do {
      const action = firstUpdate.action;
      basestate = action(basestate);// 进行值更新
      firstUpdate = firstUpdate.next;
      console.log(hook.queue, '更新执行');
    } while (firstUpdate !== hook.queue.pending.next); // 控制单一 一次循环

    hook.queue.pending = null;// 完成循环 重置为 null 等待set 更新触发
  }

  // 每个hook的初始值 进行缓存 或者 进行值更新
  hook.memorizedState = basestate;

  const setFun = dispatchAction.bind(null, hook.queue)
  // 这里其实返回了最新的值 以及 新的 setFun 只是这个 setFun 和之前的其实是一样的
  // 且持有的 hook.queue 是同一个，但 queue.pending 会被重置为 null
  // 等待新的 setFun 调用形成新的 环形链表 更新
  return [basestate, setFun];
}
/**
 * 
 * @param {object} queue 
 * @param {function} action 
 * 
 * 连续触发 这里是没有控制的 react 内部肯定有优化处理的
 */
function dispatchAction(queue, action) {

  // 创建一个更新队列
  const update = {
    action,
    next: null,
  }
  // 如果有 pending 就说明有更新
  if(queue.pending === null){
    // 环状链表
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }

  queue.pending = update;
  // console.log('hook 执行栈',queue.pending)
  // 这里防抖 防的是一个 hook 本身的 queue 环状链表 多次调用 dispatchAction 时完成
  if(debouced){
    clearTimeout(debouced);
  }
  // 触发/生成 组件函数更新执行任务
  debouced = setTimeout(schedule, 1000);
}

// 模拟一个页面进行使用
function App() {
  // 调用了四次 useState 产生4个hook
  const [num, setNum] = useState(1);
  const [num2, setNum2] = useState(2);
  const [num3, setNum3] = useState(3);
  const [num4, setNum4] = useState(4);

  console.log('workInProgressHook', workInProgressHook);

  // const [state, setState] = useState(0);
  console.log('isFirstMount', isFirstMonted)
  console.log('num', num);
  console.log('num2', num2);
  console.log('num3', num3);
  console.log('num4', num4);
  // 用返回对象代替 jsx 
  return {
    onClick: () => {
      setNum((num) => num + 1);
      setNum((num) => num + 2);
      setNum((num) => num + 3);
      setNum((num) => num + 4);
      // setNum2((num2) => num2 + 2);
      // setNum2((num2) => num2 + 1);
      // setNum3((num3) => num3 + 1);
      // setNum4((num4) => num4 + 1);
    },
    changeNum2: () => {
      setNum2((num2) => num2 + 1);
      setNum2((num2) => num2 + 2);
    },
  }
}

window.app = schedule();
```

#### 1. 初始化阶段
- **首次渲染**：当组件首次渲染时，`isFirstMonted` 为 `true`。此时会创建并初始化每个 `useState` 的 hook 对象，并将这些 hook 对象链接成一个链表结构。
- **hook 链表的构建**：
  - 每个 hook 对象包含三个主要属性：`memorizedState`（存储状态值）、`next`（指向下一个 hook）和 `queue`（用于管理更新队列）。
  - 第一个 hook 直接挂载到 `fiber.memorizedState` 上，后续的 hook 则通过 `next` 属性链接起来。

```javascript
if (isFirstMonted) {
  hook = {
    memorizedState: initialState,
    next: null,
    queue: {
      pending: null,
    }
  };
  
  if (!fiber.memorizedState) {
    fiber.memorizedState = hook;
  } else {
    workInProgressHook.next = hook;
  }
  
  workInProgressHook = hook;
}
```

#### 2. 更新阶段
- **状态更新**：当调用 `setState` 函数时，会触发更新逻辑。此时 `isFirstMonted` 已经变为 `false`，因此会从 `fiber.memorizedState` 开始遍历已有的 hook 链表。
- **更新队列处理**：每个 hook 的 `queue` 属性维护了一个环状链表，用于存储待处理的状态更新操作。每次调用 `setState` 时，都会向这个环状链表中添加一个新的更新节点。
- **循环执行更新队列**：在调度器 `schedule` 中，会遍历并执行所有待处理的更新操作，直到所有更新都被应用完毕。

```javascript
if (hook.queue.pending) {
  let firstUpdate = hook.queue.pending.next;
  do {
    const action = firstUpdate.action;
    basestate = action(basestate);
    firstUpdate = firstUpdate.next;
  } while (firstUpdate !== hook.queue.pending.next);

  hook.queue.pending = null;
}
```

#### 3. 调度与防抖
- **调度器**：`schedule` 函数负责重新渲染组件。它会根据最新的状态值重新执行组件函数，并将结果返回给用户界面。
- **防抖机制**：为了避免频繁触发更新导致性能问题，使用了 `setTimeout` 和 `clearTimeout` 来实现简单的防抖功能。只有当所有更新操作都完成后，才会触发一次重新渲染。

```javascript
if (debouced) {
  clearTimeout(debouced);
}
debouced = setTimeout(schedule, 1000);
```

#### 4. 示例分析
在提供的代码示例中，`App` 组件调用了四次 `useState`，分别创建了四个 hook。点击按钮时，会连续调用 `setNum` 四次，但由于防抖机制的存在，这四次更新会被合并为一次批量更新，在下次渲染时生效。

```javascript
return {
  onClick: () => {
    setNum((num) => num + 1);
    setNum((num) => num + 2);
    setNum((num) => num + 3);
    setNum((num) => num + 4);
  },
};
```

#### 总结
React 的 `useState` Hook 通过链表结构管理和维护多个状态变量，并利用环状链表来高效地处理状态更新。调度器和防抖机制确保了即使短时间内多次调用 `setState`，也能合理地进行批量更新，从而提高性能。