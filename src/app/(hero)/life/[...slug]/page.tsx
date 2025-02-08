import { getAllPostIds, getPostData } from '@/app/lib/post'
import {Metadata} from "next";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const { slug } = params;
  const slugStr = slug.join('/');
  // 根据slug 获取 数据
  // console.log(slug, 'slug 路径');
  const postData = await getPostData(slugStr, 'life');

  return (
    <div className={''}>
      <h1 className={'text-2xl'}>{postData.title}</h1>
      <h3 className="text-slate-900 dark:text-white mt-5 text-base font-medium tracking-tight">Writes Upside-Down</h3>
      <div className={'text-sm'}>
        <span>{postData.date}</span>
      </div>
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
  const data = await getAllPostIds('life');
  // console.log(data, '全部博文路径 slug');
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
