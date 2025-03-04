# 简介
这是一个用 ["create-next-app"](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) 
的[Next.js](https://nextjs.org/) 项目，使用 ["next/font"](https://nextjs.org/docs/basic-features/font-optimization)
自动优化

# 项目结构
```plaintext
├── src/
│   ├── app/                # Next.js 应用路由
│   ├── components/         # 可复用组件
│   ├── posts/              # 技术博客文章
│   ├── books/              # 书籍阅读笔记
│   ├── life/               # 生活记录
│   ├── server/             # 服务端相关代码
│   ├── types/              # 类型定义
│   └── lib/                # 工具函数
├── public/                 # 静态资源
├── drizzle.config.ts       # Drizzle ORM 配置
├── next.config.mjs         # Next.js 配置
└── tailwind.config.ts      # Tailwind CSS 配置
```

## 快速开始
1. 安装依赖
```bash
pnpm install
```

2. 启动开发服务器
```bash
pnpm dev
```

基于 markdown 的博客系统

- src/posts 目录下存放 markdown 文件，为技术博客博文
- src/books 目录下存放 markdown 文件，为书籍阅读
- src/life 目录下存放 markdown 文件，为生活记录
# 技术栈
- 框架 : Next.js 14 (App Router)
- UI : Tailwind CSS + Radix UI
- 数据库 : PostgreSQL + Drizzle ORM
- 认证 : NextAuth.js
- 部署 : Vercel

# 贡献指南
1. 添加新文章：
   
   - 技术博客：在 src/posts/ 下创建 .md 文件
   - 读书笔记：在 src/books/ 下创建 .md 文件
   - 生活记录：在 src/life/ 下创建 .md 文件

``` markdown
---
date: '2025-02-03'
title: '文章标题'
description: '文章描述'
---
```
# 部署
1. 配置 Vercel 项目
2. 设置环境变量
3. 连接 GitHub 仓库自动部署