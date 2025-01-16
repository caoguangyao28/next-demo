---
title: '立即执行函数妙用'
date: '2019-04-09'
description: '利用IIFE立即执行函数提升性能'
---
## 利用IIFE立即执行函数提升性能

例如一下通用的添加事件的函数

```js
function addEvent(el, eventName, handler) {  
  if (el.addEventListener) {  
    el.addEventListener(eventName, handler, false)  
  } else if (el.attachEvent) { // 低版本 ie 兼容  
    el.attachEvent('on' + eventName, handler)  
  } else { // 旧浏览器  
    el['on' + eventName] = handler  
  }  
}
```

每次调用都会进行兼容性判断，但真实场景是 平台型兼容性 只在首次处理即可，利用立即执行函数可以优化为：

```js
const addEvent = (function () {  
  if (window.addEventListener) {  
    return function (el, eventName, handler) {  
      el.addEventListener(eventName, handler, false)  
    }  
  } else if (window.attachEvent) {  
    return function (el, eventName, handler) {  
      el.attachEvent('on' + eventName, handler)  
    }  
  } else {  
    return function (el, eventName, handler) {  
      el['on' + eventName] = handler  
    }  
  }  
})();

```

如此一来 addEvent 在同一个场景下就是 同一个函数了 且无兼容性处理！

类似的场景比如还有 ajax 库，考虑node 浏览器 环境 等等也可以如此处理，还有一些代码，例如正则对象复用，比如如下代码：

```js
function removeSpace(str) {
	return str.replace(/\S/g, '');
}
```

上面代码每次调用时 都会创建 一个 正则对象 `/\S/g` , 调用这个函数 完全可以 就使用 一个 这样的对象，那么可以 用IIFE 包裹一下：

```js
const removeSpace = (function () {  
  const reg = /\s+/g;// 实现正则复用  
  return function (str) {  
    return str.replace(reg, '');  
  }  
})();
```

