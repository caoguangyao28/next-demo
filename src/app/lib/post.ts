/**
 * 从文件系统获取数据的简单库
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { rehype } from 'rehype'
import rehypePrism from 'rehype-prism-plus';

const postsDirectory = path.join(process.cwd(), 'src/posts')
type PostData = {
  id: string
  date: string
  title: string
  description: string
  dirName: string
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

/**
 * 获取排序后的帖子数据
 * 该函数异步读取帖子目录下的所有Markdown文件，解析文件内容，提取元数据，并根据日期对帖子进行排序
 *
 * @returns {Promise<PostData[]>} 返回一个Promise，解析为PostData对象的数组
 */
export async function getSortedPostsData() : Promise<PostData[]> {
  // 递归读取帖子目录下的所有文件路径
  const filePaths = await readFilesRecursively(postsDirectory);

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
  // 对帖子按日期进行排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}


// 需要考虑嵌套子目录情况 slug 需要注意
export async function getAllPostIds() {
  // const fileNames = fs.readdirSync(postsDirectory)
  const filePaths = await readFilesRecursively(postsDirectory);
  const newslugs = filePaths.map(filePath => {
    // console.log()
    return {
      slug: filePath.split('posts/')[1]
    };
  });
  // console.log(newslugs)
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
export async function getPostData(id: string) : Promise<PostDataWithContent> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  // console.log(fullPath, '读取md文件路径')
  const fileContents = fs.readFileSync(fullPath, 'utf-8')

  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  // 将html中 pre code部分 转换位高亮显示
  const highlightHtml = await rehype().use(rehypePrism).process(processedContent.toString())
  const contentHtml = highlightHtml.toString()
  // console.log(contentHtml);
  return {
    id,
    contentHtml,
    ...matterResult.data
  } as PostDataWithContent
}
