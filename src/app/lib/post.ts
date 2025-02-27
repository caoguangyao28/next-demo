/**
 * 从文件系统获取数据的简单库
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {remark} from 'remark'
import html from 'remark-html'
import {rehype} from 'rehype'
import rehypePrism from 'rehype-prism-plus';
// 引入缓存对象
const fileCache: { [key: string]: any } = {};
// 技术博文缓存变量
let filePathsCache: { [key: string]: string[] | PromiseLike<string[]> } = {};
// 技术博客文章目录
const postsDirectory = path.join(process.cwd(), 'src/posts')
// 读书笔记目录
const booksDirectory = path.join(process.cwd(), 'src/books')
// 生活随笔目录
const lifeDirectory = path.join(process.cwd(), 'src/life')

/**
 * 根据类型获取对应的目录
 * @param {string} type
 * @returns {string}
 */
export const getPostsDirectory = (type: string) => {
  switch (type) {
    case 'posts':
      return postsDirectory;
    case 'books':
      return booksDirectory;
    case 'life':
      return lifeDirectory;
    default:
      return postsDirectory;
  }
}


export type PostData = {
  id: string
  date: string
  title: string
  description: string
  dirName: string
  bookimage?: string
  author?: string

}

/**
 * 递归读取目录中的所有文件
 * 此函数的目的是遍历指定目录下的所有文件，包括子目录中的文件，并筛选出所有以.md结尾的文件
 * 它通过异步方式读取目录内容，并递归调用自身来处理子目录
 *
 * @param dir {string} - 需要读取的目录路径
 * @returns {Promise<string[]>} - 返回一个Promise，解析为所有.md文件的路径数组
 */
async function readFilesRecursively(dir: string): Promise<string[]> {
  // 读取目录内容，包括文件和子目录，并将它们作为文件描述符数组返回
  const files = await fs.promises.readdir(dir, { withFileTypes: true });
  // 初始化一个空数组，用于存储所有.md文件的路径
  const filePaths: string[] = [];

  // 遍历目录中的每个文件或子目录
  for (const file of files) {
    // 将目录路径与文件名连接起来，形成完整的文件路径
    const filePath = path.join(dir, file.name);
    // 如果当前文件描述符指向的是一个子目录，则递归调用readFilesRecursively函数处理该子目录
    if (file.isDirectory()) {
      // 将递归调用的结果（子目录中的.md文件路径）合并到filePaths数组中
      filePaths.push(...await readFilesRecursively(filePath));
    // 如果当前文件描述符指向的是一个以.md结尾的文件，则将其路径添加到filePaths数组中
    } else if (file.name.endsWith('.md')) {
      filePaths.push(filePath);
    }
  }
  // 返回所有.md文件的路径数组
  return filePaths;
}

async function getAllFilePaths(dirPath: string) {
  if (filePathsCache[dirPath]) {
    return filePathsCache[dirPath];
  }
  const filePaths = await readFilesRecursively(dirPath);
  filePathsCache[dirPath] = filePaths;
  return filePaths;
}

// 引入 allPostsData 缓存对象 对技术博文进行缓存
const allPostsDataCache: { [key: string]: PostData[] } = {};

/**
 * 获取排序后的文章数据
 * 该函数异步读取帖子目录下的所有Markdown文件，解析文件内容，提取元数据，并根据日期对帖子进行排序
 *
 * @param {string} type - 博文类型，可选值为'posts'、'books'或'life'
 * @returns {Promise<PostData[]>} 返回一个Promise，解析为PostData对象的数组
 */
export async function getSortedPostsData(type :  string) : Promise<PostData[]> {
  const dirName = getPostsDirectory(type);
  if (allPostsDataCache[dirName]) {
    return allPostsDataCache[dirName];
  }
  // 递归读取帖子目录下的所有文件路径
  const filePaths = await getAllFilePaths(dirName);
  // console.log(filePaths, `${dirName} 下所有的文件`);
  // 读取文件夹下所有md文件，包含子文件夹
  const allPostsData: PostData[] = await Promise.all(filePaths.map(async (filePath) => {
    // 从文件名中移除".md"以获取id
    const id = path.basename(filePath, '.md');
    // 获取目录名
    const dirName = (path.dirname(filePath)).split('posts/')[1];

    // 读取Markdown文件内容为字符串
    const fileContents = await fs.promises.readFile(filePath, 'utf8');
    // 使用gray-matter解析帖子的元数据部分
    const matterResult = matter(fileContents);
    // 组合数据与id
    return {
      id: dirName? dirName + '/' + id : id,
      dirName,
      ...matterResult.data
    } as PostData;
  }));

  // console.log(allPostsData, '所有的posts 数据')
  // 对帖子按日期进行排序
  const sortedPostsData = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  });
  // 将结果存储到缓存中
  allPostsDataCache[dirName] = sortedPostsData;
  return sortedPostsData;
}

// 获取所有技术目录下文章id
export async function getAllPostIds(type: string) {
  // const fileNames = fs.readdirSync
  const dirName = getPostsDirectory(type);
  const filePaths = await getAllFilePaths(dirName);
  const newslugs = filePaths.map(filePath => {
    return {
      slug: filePath.split(`${type}/`)[1]
    };
  });
  // debugger;
  return newslugs.map(({slug}) => {
    if(slug.includes('/')){
      return {
        slug: slug.replace(/\.md$/, '').split('/')
      }
    }
    return {
      slug: slug.replace(/\.md$/, '')
    }
  })
}

/**
 * 读取md文件 转换成 html 并且高亮显示 代码块区域
 * @param {string} id md文件文件路径
 * @returns {Promise<PostDataWithContent>}
 */

type PostDataWithContent = PostData & { contentHtml: string }
export async function getPostData(id: string, postsDirectory: string) : Promise<PostDataWithContent> {
  if (fileCache[id]) {
    return fileCache[id]
  }
  const dirName = getPostsDirectory(postsDirectory)
  const fullPath = path.join(dirName, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  // 将html中 pre code部分 转换位高亮显示
  const highlightHtml = await rehype().use(rehypePrism).process(processedContent.toString())
  const contentHtml = highlightHtml.toString()
  return fileCache[id] = {
    id,
    contentHtml,
    ...matterResult.data
  } as PostDataWithContent;
}

// 获取分类下最新的5篇文章
export async function getLatestPosts(type: string, limit = 5) {
  const allPosts = await getSortedPostsData(type);
  return allPosts.slice(0, limit);
}
