---
title: '自己实现Promise MyPromise'
date: '2024-08-01'
description: '按照ES6 promise 规范，兼容promise+ 规范,实现MyPromise'
---
## 什么是Promise

- promise A+ 规范
- ES promise 规范， 兼容 promise+ 规范

promise A+ 规范，明间社区规范，带有 then 方法的对象，[链接地址](https://promisesaplus.com/)。
ES6 promise 规范，new Promise() 创建的promise 对象是符合 promise A+ 规范的对象，同时追加了一些 拓展方法，例如 catch finaly 静态方法  ··· 。[mdn 地址](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
#### 手撸一遍代码
完整的代码
```js
// Mypromise.js 
const PENDING = 'pending';  
const FULFILLED = 'fulfilled';  
const REJECTED = 'rejected';  
class MyPromise {  
  // 私有属性  
  #state = PENDING;  
  #result = undefined;  
  handlers = [];  
  constructor(executor){  
    this.onlykey = Symbol('MyPromise');  
    const resolve = (value) => {  
      // 状态值 存在 hard code
	  this.#changeState(FULFILLED, value);  
    }  
    const reject = (reason) => {  
      // 改变状态  
      this.#changeState(REJECTED, reason);  
    }  
    // 异常处理 -- 只能捕获同步错误  
    try {  
      executor(resolve, reject);  
    } catch (error) {  
      // 捕获异常  
      reject(error);  
    }  
  } 
  #changeState(state, result){
	// 状态只有一次变更
    if(this.#state === PENDING){  
      this.#state = state;  
      this.#result = result;  
      // 状态变跟要出发点 then 方法的 逻辑  
      this.#run();  
    }  
  }
  // 符合 promise A+ 规范即是  
  #isPromise(value){  
    return value && typeof value.then === 'function';  
  }
  // 创建微任务 利用 MutationObserver 创建   
  #runMicroTask(func) {  
    if(typeof MutationObserver !== 'undefined'){  
      // 创建一个dom 节点  
      const textNode = document.createTextNode(1);  
      // 创建一个观察者，触发时执行 func
      const observer = new MutationObserver(func);  
      // 观察这个节点  
      observer.observe(textNode, {  
        characterData: true  
      })  
      // 改变节点的值 触发回调  
      textNode.data = 2;  
    } else { // 很老的浏览器  
      setTimeout(func, 0);  
    }  
  }  
  #runOne(callback, resolve, reject){  
    this.#runMicroTask(() => {
	 if(typeof callback !== 'function') {
	   const setted = this.#state === FULFILLED? resolve: reject;  
	   setted(this.#result)  
	   return;
	 }
	 try {
	   const data = callback(this.#result);
	   if(this.isPromise(data)){
	   // promise 状态吸收处理 分为 准备 以及 吸收 连个微任务动作， 这里通过 2个then 模拟
	     data.then().then(resolve,reject)
	   } else {
	   // data 可能是 undefined callback 可能没有返回值
	     resolve(data);
	   }
	 } catch(error) {
	   reject(error);
	 }
    });  
  }  
  #run(){  
    // 当前状态是挂起什么都不用做    
    if(this.#state === PENDING){  
      return;  
    }  
    // 查看 #handlers 队列 是否有需要执行的 
    // this.#handlers
    while(this.handlers.length > 0){  
      // 一个一个依次执行  
      const {onFulfilled, onRejected, resolve, reject} = this.handlers.shift();  
      if(this.#state === FULFILLED){  
        // 获取 then 方法的参数  
        // debugger          
		 this.#runOne(onFulfilled, resolve, reject)  
      }else{  
        this.#runOne(onRejected, resolve, reject)  
      }  
    }  
  }  
  then(onFulfilled, onRejected){    
    // then 方法的返回值是一个promise  
    // console.log(this.handlers, 'then 订阅产生 新的 promise')
    return new MyPromise((resolve, reject) => {  
      this.handlers.push({  
        onFulfilled,  
        onRejected,  
        resolve,  
        reject  
      })  
      // console.log(this.handlers, 
      // '其实是链式调用的上一个mypromise 实例的 handlers 会加一')  
      this.#run();  
    })  
  }
  catch(onRejected){  
   return this.then(null, onRejected)  
  }   
  all(promises){  
    return new MyPromise((resolve, reject) => {   
      let count = 0;  
      let results = [];  
      promises.forEach((promise, index) => {  
        if(!this.#isPromise(promise)){  
          results[index] = promise;  
          count++;  
          if(count === promises.length){  
            resolve(results)  
            console.log('all 状态切换')  
          }  
        }  
        promise.then(res => {  
          count++;  
          if(count === promises.length){  
            resolve(res)  
            console.log('all 状态切换')  
          }  
        },  
        err => {  
          reject(err)  
          console.log('all 状态切换 err', err)  
        })  
        console.log(promise, index, 'promise')  
  
      })  
    })  
  }  
  static resolve(value){  
    return new MyPromise((resolve) => {  
      resolve(value)  
    })  
  }  
  getStates(){  
    console.log(this.#state)  
    return this.#state;  
  }  
}
```


#### 独属于每个实例的 resolve reject 方法
只改遍历实列的 状态，且只能从 pending 变更 为 fulfilled 或者 rejected。因为 resolve reject 都是用作回掉函数传给 使用者的，所以这里无需作为 实例方法，而是直接 将内部函数 作为闭包 传出

``` js
constructor(executor){  
    this.onlykey = Symbol('MyPromise');  
    const resolve = (value) => {  
      // 状态值 存在 hard code
	  this.#changeState(FULFILLED, value);  
    }  
    const reject = (reason) => {  
      // 改变状态  
      this.#changeState(REJECTED, reason);  
    }  
    // 异常处理 -- 只能捕获同步错误  
    try {  
      executor(resolve, reject);  
    } catch (error) {  
      // 捕获异常  
      reject(error);  
    }  
}
```


**抽象复用状态变更方法 - changeState**  

这里使用私有方法，避免外部(只能在实列内部代码调用，实例无法调用)调用串改。同时 对状态可变做控制

```js
#changeState(states, value){
// 状态只有一次变更
    if(this.#state === PENDING){  
      this.#state = state;  
      this.#result = result;  
      // 状态变跟要出发点 then 方法的 逻辑  
      this.#run();  
    } 
}
```

状态完成变更后 出发任务队列 检查，看是否有订阅的微任务需要放入待执行微任务队列。即内部私有方法 run。
改方法主要判断状态是否成立，同时如果存在待执行任务，则依次构建 微任务 
```js
#run(){
	// 当前状态是挂起什么都不用做    
    if(this.#state === PENDING){  
      return;  
    }  
    // 查看 #handlers 队列 是否有需要执行的 
    // this.#handlers
    while(this.handlers.length > 0){  
      // 一个一个依次执行  
      const {onFulfilled, onRejected, resolve, reject} = this.handlers.shift();  
      if(this.#state === FULFILLED){  
        // 获取 then 方法的参数  
        // debugger          
		 this.#runOne(onFulfilled, resolve, reject)  
      }else{  
        this.#runOne(onRejected, resolve, reject)  
      }  
    } 
}
```

`#runone`  私有方法 用于生成 微任务 即将 成功或失败回调放入当前微任务队列，处理判断 当前回调处理的情况，如遇到返回值不是函数，或者 是promise 时需要特殊处理，尤其是 返回promise 时
存在 状态塌陷吸收问题

```js
#runOne(callback, resolve, reject){  
  this.#runMicroTask(() => {  
    // 如果不是函数 默认调用 resolve 或者 reject
    if(typeof callback !== 'function') {  
      const setted = this.#state === FULFILLED? resolve: reject;  
      setted(this.#result)  
      return;  
    }  
    try {  
      const data = callback(this.#result);   
      if(this.#isPromise(data)) {  
        // MyPromise.resolve(data).then(resolve,reject)  
        // promise 状态吸收处理 分为 准备 以及 吸收 连个微任务动作
        // 这里通过 2个then 模拟  
        data.then().then(resolve,reject)  
      }else {
        // 默认调用 触发订阅者的（即then 创建的promise） resolve
        // data 可能为 undefined ,因为 callback 不一定有返回值  
        // 且无论 当前的状态是fulfilled 还是 rejected 下一个 promise 的状态 
        // 都是 fulfilled （通过 resolve(data) 触发的）  
        resolve(data)
     }  
    } catch (error) {  
      reject(error);  
    }  
  });  
}
```

**通过`#runMicroTask(taskFn)`** 完成微任务生成，并放入微任务队列
使用MutationObserver创建微任务，观察textNode 节点变化从而响应 func，即 传入的 taskFn

```js
#runMicroTask(func) {
 if(typeof MutationObserver !== 'undefined'){  
    // 创建一个dom 节点  
    const textNode = document.createTextNode(1);  
    // 创建一个观察者  
    const observer = new MutationObserver(func);  
    // 观察这个节点  
    observer.observe(textNode, {  
      characterData: true  
    })  
    // 改变节点的值 触发回调  
    textNode.data = 2;  
  } else { // 很老的浏览器  
    setTimeout(func, 0);  
  }  
}
```

**catch** 方法本质上是then的快捷方式，只接受 rejected 

```js
  catch(onRejected){  
   return this.then(null, onRejected)  
  }   
```
