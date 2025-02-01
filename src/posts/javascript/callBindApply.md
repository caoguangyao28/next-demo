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
  if (typeof this !== 'function') {  
    throw new TypeError('myCall can only be called on functions');  
  }
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

1. `globalThis`，通过它来区别不同平台，默认上下文对象为全局（浏览器/node），`Object()`直接调用如果参数是对象，那么返回对象本身，非对象会转为对象，确保 context 是对象
2. 其实实现变更 this，就是通过对象方法的调用 `obj.fn() / obj[fn]()`。这样以来只需要 在 `context` 对象上添加方法且方法即为原函数（调用call函数的那个对象）。
3. 使用 `Symbol()` 产生唯一 key，确保不会和原对象上属性相同冲突
4. `defineProperty()` 通过 `Object` 的该方法 添加属性描述，限制临时添加的 `key` 枚举性，防止万一对原对象进行枚举，从而暴露 临时的属性
5. `delete context[key]` 用完即删除

## 手写apply

```js
Function.prototype.myApply = function (context, args) {  
  if (typeof this !== 'function') {  
    throw new TypeError('myApply can only be called on functions');  
  }
  // apply 传参与 call 不同的地方   
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

大体与 `myCall` 方法是一致的 差别在与第二个参数（除this指向参数，其余参数传递方式不同），apply 只有两个参数，第二个参数是 array
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

bind 函数返回的是一个函数，函数内部进行了 `this` 的改变 代码中借助 apply 进行变动，主要是方便参数进行整合（缺失则补，多传忽略，参数数据看原函数定义时形参数量）
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