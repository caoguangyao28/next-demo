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
}
export function getSortedPostsData() : PostData[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData : PostData[] = fileNames.map(fileName => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data
    } as PostData;
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map(fileName => {
    return {
      slug: fileName.replace(/\.md$/, '')
    }
  })
}

type PostDataWithContent = PostData & { contentHtml: string }
export async function getPostData(id: string) : Promise<PostDataWithContent> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
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
