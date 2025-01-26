---
title: "通过webRTC获取真实外网IP"
date: "2021-05-05"
description: "可靠的仅通过前端，webRTC获取真实外网IP，以及其他常见IP获取方式"
---

## 一般情况下是不需要前端获取
因为服务的，网关层面是具备较为详细的请求信息的，其中就有请求设备的ip地址相关信息，
但可能因为种种原因（例如 后端采用 微服务架构，网关套了一层又一层无法获取到ip地址），一问后端或者运维，为啥ip地址传输过程丢了？···
而你又得不到有价值的信息～ 且ip地址一直用的前端手动传递，那没办法了只能前端先搞起来了

## 常用的第三方接口解析服务
1. https://ip.cn/
2. https://api.ipify.org (不可用了)

第三方终归的是不稳定，如果你的系统是几十万的用户，那么你肯定不能每次都去请求这些接口，而且这些接口的响应时间也并不稳定。
所以，我们得自己写一个，而且尽量只需要前端开发的（如果后端愿意反而完全没必要 前端获取了）。

## webRTC 获取真实外网IP
创建一个RTCPeerConnection对象，并设置一个ICE candidate事件监听器。  
需要注意的是，需要可用的STUN或TURN服务器来获取相关信息，幸运的是有大量的公开的STUN服务可用

```js
const iceServers = [
  // { urls: 'stun:stun.l.google.com:19302' }, // 备用
  { urls: 'stun:stun1.l.google.com:19302' }, // 返回2次，一个 加密的local，一个ip4
  // {urls: 'stun:stun.xten.com'},// 备用
];
// getUserIPs function
function getUserIPs(callback) {
  const myPeerConnection = new RTCPeerConnection({ iceServers });
  myPeerConnection.createDataChannel("");
  myPeerConnection.createOffer().then(offer => myPeerConnection.setLocalDescription(offer));

  myPeerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      // console.log(event.candidate)
      const parts = event.candidate.candidate.split(' ');
      const ip = parts[4];
      callback(ip);
    }
  };
}

getUserIPs((ip) => {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}(([0-9a-fA-F]{1,4}:){1,4}|((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  if(ipv4Regex.test(ip) || ipv6Regex.test(ip)){
    console.log(ip)
  }
});
```
### 一个很大的公共STUN服务器列表：
http://enumer.org/public-stun.txt，你可以使用其中的任何一个
```md
// 常见的STUN或TURN服务
# 894 public STUN-servers. Tested 2024-02-19
#
# Part of Emercoin/ENUMER projects.
# Please, use free ENUMER service for your VOIP PBX. It is cool, free, and reduces your telecom costs.
# Visit: http://enumer.org/
#
# Author: Oleg Khovayko (olegarch)
# Distributes under the Creative Common License:
# https://en.wikipedia.org/wiki/Creative_Commons_license

freestun.net:3478
relay.webwormhole.io:3478
stun-01.schulen-fulda.de:3478
stun-02.schulen-fulda.de:3478
stun-03.schulen-fulda.de:3478
stun-1.server.yesing.com:3478
stun-2nd.relaix.net:3478
stun-a01.isp.t-ipnet.de:3478
stun-americas-01.s73cloud.com:3478
stun-americas-02.s73cloud.com:3478
stun-azure.47billion.com:3478
stun-b1.qq.com:3478
stun-de.files.fm:3478
stun-dev.gozeppelin.com:3478
stun-neu.levigo.net:3478
stun-one.mabe.at:3478
stun-staging.videovisit.io:3478
stun-test.sip5060.net:3478
stun-turn.4realstudio.com:3478
stun-turn.alta.neopath.com.br:3478
stun-turn.demo.ikonixtechnology.com.au:3478
stun-turn.federowicz.de:3478
stun-v2.mdtalk.io:3478
stun.1-voip.com:3478
stun.12connect.com:3478
stun.12voip.com:3478
stun.1und1.de:3478
stun.3deluxe.de:3478
stun.3wayint.com:3478
stun.5222.de:3478
stun.5sn.com:3478
.......
```
### 也可以自己搭建一个STUN服务器
nodejs 参考
https://github.com/enobufs/stun
