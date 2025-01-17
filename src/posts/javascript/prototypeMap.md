---
title: javascript 原型&原型链
date: '2024-07-17'
description: js原型&原型链的基础知识，通过一张图的形式来记忆与理解
---

## javascript 原型&原型链

### 概念

JavaScript 原型的概念：每个构造函数都有一个原型对象，实例可以共享原型上的属性和方法。原型链则是通过构造函数和原型对象之间的关系形成的链。

原型的好处在于实现属性和方法的共享，减少代码冗余。我们可以使用prototype属性来访问原型。原型上的属性和方法可以被实例访问和使用。 当实例自身没有某个属性时，JavaScript 会沿着原型链查找。原型链也可以用来实现继承。我们还可以修改原型，包括添加、修改或删除原型上的属性和方法。需要注意的是，原型链也有其局限性，例如无法实现多重继承。

### 了解原型，原型链的必要性

1. **实现继承**：通过原型链，可以实现类的继承，使得子类能够继承父类的属性和方法。
2. **代码复用**：减少代码冗余，提高代码的可复用性。
3. **共享属性和方法**：确保所有实例都能访问到共同的属性和方法。
4. **动态扩展**：可以在运行时动态地向原型添加属性和方法，实现功能的扩展。
5. **理解 JavaScript 的特性**：深入理解 JavaScript 的面向对象编程特性。
6. **ES6 的class 定义类**，本质上依旧是基于原型原型链的

### 用一张图来理解

假设有一个 构造函数A ，通过A 创建一个实例，画出相关原型链
```js
function A(name){
	this.name = name;
}

const a = new A('a');
```

本次绘图涉及到 顶级函数对象 Object  Function，同时涉及到 null 

![原型链图](https://front-end-share-1257122416.cos.ap-shanghai.myqcloud.com/cgy/upic/iDwlqR.jpg)

图解说明

1. js 中自定义对象的 `__proto__` 指向构造函数的 `prototype` (同样适用于 class 类的实例)
2. 常规的普通对象，都是`Object` 的实例，普通对象的 `__proto__`都指向 Object 这个顶级函数对象的`prototype`
3. 函数也是对象，也具有`__proto__`属性，自定义函数都是 顶级`Function` 函数对象的实例，即普通函数的`__proto__` 都指向` Function` 的`prototype`
4. 顶级 `Object` 函数对象，也是由`Function` 构造而来, 所以`Object.__proto__` 指向 `Function.prototype`
5. `Function` 不是由谁构造而来，而是浏览器的脚步引擎在启动时添加完成, 所以 `Function.__proto__` 指向自己的原型即 `Function.prototype`
6. `Object` 的`prototype`的`__proto__`是整个原型链的顶端 为 `null`
