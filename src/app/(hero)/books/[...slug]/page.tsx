import { getAllPostIds, getPostData } from '@/app/lib/post'
import {Metadata} from "next";
import BookCover from '@/components/books/BookCover'
export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const slugStr = slug.join('/');
  // 根据slug 获取 数据
  // console.log(slug, 'slug 路径');
  const postData = await getPostData(slugStr, 'books');

  return (
    <div className={''}>
      <h1 className={'text-2xl'}>{postData.title}</h1>
      <div className={'text-sm'}>
        <span>{postData.date}</span>
      </div>
      <BookCover author={postData.author} desc = {postData.description} imgSrc = {postData.bookimage?? ''} />
      <div className={'pt-2.5'} dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
    </div>
  )
}

/**
 * 生成静态路径
 * @returns string[] 匹配动态路由[...slug]
 * @description 根据博文路径生成静态路径
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const data = await getAllPostIds('books');
  return data.map(({slug}) => ({ slug: Array.isArray(slug) ? slug : [slug] }));
}

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const { slug } = params;
  const slugStr = slug.join('/');
  return {
    title: `book ${slugStr}`,
    description: `books reading ${slugStr} detail`,
  };
}
