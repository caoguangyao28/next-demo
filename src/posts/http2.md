---
title: 'HTTP/2 与 HTTP/1.x 对比'
date: '2021-07-04'
description: 'HTTP/2 与 HTTP/1.x 对比, 性能提升的核心相关概念, 与 webSocket 简单对比'
---
## 核心技术概念

1. 二进制分帧
2. 多路复用
3. 服务器推送
4. 头部压缩

### 二进制分帧

**帧：** HTTP/2 数据通信的最小单位消息：指 HTTP/2 中逻辑上的 HTTP 消息。例如请求和响应等，消息由一个或多个帧组成。

**流：**存在于连接中的一个虚拟通道。流可以承载双向消息，每个流都有一个唯一的整数ID。

HTTP/2 采用二进制格式传输数据，而非 HTTP 1.x 的文本格式，二进制协议解析起来更高效。 HTTP / 1 的请求和响应报文，都是由起始行，首部和实体正文（可选）组成，各部分之间以文本换行符分隔。HTTP/2 将请求和响应数据分割为更小的帧，并且它们采用二进制编码。

**HTTP/2 中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流。**每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装。

### 多路复用

多路复用，代替原来的序列和阻塞机制。所有请求都是通过一个 TCP连接并发完成。 HTTP 1.x 中，如果想并发多个请求，必须使用多个 TCP 链接，且浏览器为了控制资源，还会对单个域名有 6-8个的TCP链接请求限制，如下图，红色圈出来的请求就因域名链接数已超过限制，而被挂起等待了一段时间：

![https://pic1.zhimg.com/80/v2-b66be1a979ff666463a71c0eb4160c1c_1440w.jpg](https://pic1.zhimg.com/80/v2-b66be1a979ff666463a71c0eb4160c1c_1440w.jpg)

在 HTTP/2 中，有了二进制分帧之后，HTTP /2 不再依赖 TCP 链接去实现多流并行了，在 HTTP/2中：

- 同域名下所有通信都在单个连接上完成。
- 单个连接可以承载任意数量的双向数据流。
- 数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送，因为根据帧首部的流标识可以重新组装。

这一特性，使性能有了极大提升：

- **同个域名只需要占用一个 TCP 连接**，消除了因多个 TCP 连接而带来的延时和内存消耗。
- 单个连接上可以并行交错的请求和响应，之间互不干扰。
- 在HTTP/2中，每个请求都可以带一个31bit的优先值，0表示最高优先级， 数值越大优先级越低。有了这个优先值，客户端和服务器就可以在处理不同的流时采取不同的策略，以最优的方式发送流、消息和帧。

## **服务器推送**

服务端可以在发送页面HTML时主动推送其它资源，而不用等到浏览器解析到相应位置，发起请求再响应。例如服务端可以主动把JS和CSS文件推送给客户端，而不需要客户端解析HTML时再发送这些请求。

服务端可以主动推送，客户端也有权利选择是否接收。如果服务端推送的资源已经被浏览器缓存过，浏览器可以通过发送RST_STREAM帧来拒收。主动推送也遵守同源策略，服务器不会随便推送第三方资源给客户端。

[**了解更多 Server Push 特性**](https://link.zhihu.com/?target=https%3A//tech.upyun.com/article/294/1.html%3Futm_source%3Dzhihu%26utm_medium%3Dreferral%26utm_campaign%3D26559480%26utm_term%3Dhttp2)

## **头部压缩**

HTTP 1.1请求的大小变得越来越大，有时甚至会大于TCP窗口的初始大小，因为它们需要等待带着ACK的响应回来以后才能继续被发送。HTTP/2对消息头采用HPACK（专为http/2头部设计的压缩格式）进行压缩传输，能够节省消息头占用的网络的流量。而HTTP/1.x每次请求，都会携带大量冗余头信息，浪费了很多带宽资源。

HTTP每一次通信都会携带一组头部，用于描述这次通信的的资源、浏览器属性、cookie等，例如

![https://pic2.zhimg.com/v2-282eb9ed0d8dfd42f730784367dcf43d_r.jpg](https://pic2.zhimg.com/v2-282eb9ed0d8dfd42f730784367dcf43d_r.jpg)

为了减少这块的资源消耗并提升性能， **HTTP/2对这些首部采取了压缩策略**：

- HTTP/2在客户端和服务器端使用“首部表”来跟踪和存储之前发送的键－值对，对于相同的数据，不再通过每次请求和响应发送；
- 首部表在HTTP/2的连接存续期内始终存在，由客户端和服务器共同渐进地更新;
- 每个新的首部键－值对要么被追加到当前表的末尾，要么替换表中之前的值。

例如：下图中的两个请求， 请求一发送了所有的头部字段，第二个请求则只需要发送差异数据，这样可以减少冗余数据，降低开销。

![https://pic3.zhimg.com/80/v2-1573194744d005dd110bbeac3a9b5246_1440w.jpg](https://pic3.zhimg.com/80/v2-1573194744d005dd110bbeac3a9b5246_1440w.jpg)

## 本质上还是 请求 响应模式

不具备对等沟通方式，在实时性上也达不到要求，更多的用于传输 2 进制分帧数据，用于传输文档 静态资源，且对比与websoket 定义传输数据方面也存在差异，无法自定义，以及实现 数据格式转换

## 与 webSocket 对比

### **原理区别**

- **HTTP2.0 长连接原理**：
    - **基于请求 - 响应模型改进**：HTTP2.0 依然遵循基本的请求 - 响应模式，客户端发起请求，服务器给出响应。不过它在 HTTP1.1 基础上进行了优化，采用二进制分帧层，将所有传输的信息分割为更小的帧进行传输，多个请求和响应的帧可以在同一个连接上交错发送、并行传输，以此提升传输效率。
    - **复用连接**：可以在一条已经建立的长连接上同时承载多个不同的请求和响应流，通过帧头部的流标识符来区分不同的请求和响应所属的流，减少了频繁建立和拆除连接的开销，达到长连接复用的效果，常用于网页中加载多个资源（如脚本、图片、样式表等）同时进行数据交互的场景。
    - **服务器推送机制**：服务器能够主动向客户端推送一些资源，比如当客户端请求一个网页的 HTML 文档时，服务器预测客户端后续可能还需要相关的 CSS、JavaScript 文件等，就可以不经客户端明确请求而主动推送这些资源，进一步优化网页加载性能，但本质上还是围绕请求 - 响应的交互逻辑展开。
- **WebSocket 长连接原理**：
    - **全双工通信协议**：WebSocket 建立起连接后，通信双方（客户端和服务器）可以实现双向、实时的数据交互，即客户端可以随时向服务器发送消息，服务器也能随时向客户端推送消息，不受请求 - 响应模式的限制，更类似于一种对等的通信方式，双方都有主动发起通信的能力。
    - **基于 HTTP 协议升级握手**：它起初是通过 HTTP 协议发起一个特殊的升级请求，服务器响应并完成握手过程后，就将连接从 HTTP 协议升级为 WebSocket 协议，此后该连接就保持打开状态，专门用于双向的数据传输，常用于需要实时更新数据的场景，比如在线聊天、实时股价显示、多人协作编辑等应用中实时获取服务器推送的最新信息。
    - **自定义消息格式**：有自己一套定义好的消息帧格式，用来区分文本消息、二进制消息等不同类型的数据，方便在长连接上进行各种类型的数据交换。

### **是否可替代使用**

一般情况下不能简单替代，二者适用于不同的应用场景：

- **HTTP2.0 长连接**：更适合于传统的客户端从服务器获取资源，像网页浏览中获取各种网页元素（图片、脚本等）以及常规的、有一定先后顺序且基于请求 - 响应模式的 API 调用场景，重点在于复用连接提升资源获取效率以及服务器主动推送辅助优化加载体验等方面，对于大部分普通的网站和常规的网络应用中数据交互需求能够很好地满足。
- **WebSocket 长连接**：专门针对需要实时、双向互动通信的场景设计，例如实时聊天系统中实时收发消息、实时的游戏对战中玩家与服务器之间频繁的数据同步、金融交易平台实时推送股价等行情数据等，这些场景要求双方随时可以主动推送消息，而 HTTP2.0 长连接受限于请求 - 响应机制，很难满足这种实时性和双向主动推送的高要求。

所以，虽然二者都是长连接相关技术，但基于原理特点和适用场景的不同，在实际应用中往往需要根据具体业务需求来选择使用，而不是直接相互替代。