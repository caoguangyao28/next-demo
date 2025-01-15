---
title: 'CDN/脚本加载容错处理'
date: '2024-12-01'
---
## script src 脚本加载错误处理

基本上有两种方式， 利用 script 标签的 onerror 事件进行处理，在现代化项目中需要 结合 构建框架实现构建编译处理，替换静态的动态的标签。利用全局事件监听事件进行处理，相对来说可以省去编译构建时额外处理。

```js
// 备选domains
const domains = [
	'localhost:8080',
	'localhost:8081',
	'localhost:8090',
	'localhost:63342'
];
// 错误脚本尝试到那个domain
const retryObj = {};

window.addEventListener('error', (e) => {
  // 非脚本加载错误 直接跳过 所有运行时错误都是 ErrorEvent 的实列，同时排除 其他标签的错误如img link
  if(e instanceof ErrorEvent || e.target.tagName !== 'SCRIPT') {
    return;
  }
  // 需要处理的
  const url = new URL(e.target.src);// 构建URL 对象 方便处理
  const pathname = url.pathname; // 路径部分
  // 获取重那个备选开始
  if(retryObj[pathname] === undefined) {
    retryObj[pathname] = 0;
  }
  // 重试角标
  const index = retryObj[pathname];
  if(index >= domains.length){
    return;
  }
  url.host = domains[index];
  document.wirte(`<script src="${url.toString()}"><\/script>`);
  retryObj[pathname]++;
  e.target.remove();
}, true); // true 捕获模式，script 加载错误不会冒泡

```

