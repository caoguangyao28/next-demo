import { PostData } from './post'

export const linkData = [
  {name: '技术·研究', href: '/blogs'},
  {name: '读书·笔记', href: '/articles'},
  {name: '生活·随笔', href: '/notes'},
  {name: '关于我', href: '/about'}
]

// 给 categories 添加 latestPosts 类型为 PostData[]
export type Category = {
  title: string
  dirType?: string
  description: string
  latestPosts?: PostData[]
}

export const categories: Category[] = [
  {
    title: '技术·研究',
    dirType: 'posts',
    description: '软件开发技术，前端、后端、移动端、小程序、AI',
    latestPosts: []
  },
  {
    title: '读书·笔记',
    dirType: 'books',
    description: '技术、人文、心理、管理、山水、小说',
    latestPosts: []
  },
  {
    title: '生活·随笔',
    dirType: 'life',
    description: '人生需留痕',
    latestPosts: []
  },
  {
    title: '关于我',
    description: '简历：工作履历，个人在线简历， 记录过去，展望未来'
  },
];

// 根据 categories  dirType，获取对应的目录路径下的 文件