---
title: '搞懂 call、bind、apply'
date: '2024-12-01'
description: '彻底搞懂 call、bind、apply，自己手写实现'
---
阅读框架源码，封装组件，封装工具时经常需要改变this指向，call、bind、apply都是改变this指向的方法，但是它们有区别，本文主要介绍call、bind、apply的区别以及手写实现。
## 手写call
挂载到Function 原型上
```js
Function.prototype.myCall = function (context, ...args) {  
  // 边界处理 考虑 context null undefined 情况  
  // Object(context) 将传入的非对象转为对象  
  context = context === null || undefined ? globalThis : Object(context);
  // globalThis 关键字 解决不同环境兼容性问题  
  // context.fn = this;// fn 存在与入参数属性同名隐患  
  const key = Symbol();  
  const fn = this; // 临时使用 指向原函数
  // context[key] = fn 保险使用 可以使用 es5 defineProperty 进行替换  
  Object.defineProperty(context, key, {  
    enumerable: false,  
    value: fn  
  });  
  
  const result = context[key](...args);  // 类似object.fn(...args) 
  // 用完 就删掉  
  delete context[key];  
  
  return result;  
}
```

## 手写bind

```js
Function.prototype.myBind = function (context, ...args) {  
  const fn = this;  
  context = context === null || undefined ? globalThis : Object(context);  
  // context.fn = this; resetArgs 接受真实调用时 可能的二次形参 
  return function (...resetArgs) {  
    if(new.target) {  
      return new fn(...args, ...resetArgs);  
    }  
    return fn.apply(context,[...args, ...resetArgs]);// 这里利用了 apply  
  }  
}
```

## 手写apply

```js
Function.prototype.myApply = function (context, args) {  
  if (typeof this !== 'function') {  
    throw new TypeError('myApply can only be called on functions');  
  }  
  if (args === null || args === undefined) {  
    args = [];  
  } else if (!Array.isArray(args)) {  
    throw new TypeError('Second argument to myApply must be an array or null');  
  }  
  
 context = 
 (context !== null && typeof context === 'object') ?  context : globalThis;  
 const key = Symbol();  
 const fn = this;  
 Object.defineProperty(context, key, {  
    enumerable: false,  
    value: fn  
 })  
 const result = context[key](...args);  
  
 delete context[key];  
 return result;  
}
```

### 测试

```js
const obj = {  
  name: 'obj11'  
}  
function fn(a, b, c) {  
  console.log(this.name, a, b, c);  
}  
fn.myCall(obj, 1, 2, 3);  
fn.myApply(obj, [1, 2, 3]);  
const newFn = fn.myBind(obj, 1, 2);  
newFn(4);
```