import {Metadata} from "next";
import { getAllPostIds, getPostData } from '@/app/lib/post'

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  // 根据slug 获取 数据
  const postData = await getPostData(slug);

  return (
    <div className={'w-full flex items-center justify-center'}>
      <article>
        <h1 className={'text-2xl'}>{postData.title}</h1>
        <div className={'text-sm'}>
          <span>{postData.date}</span>
        </div>
        <div className={'pt-2.5'} dangerouslySetInnerHTML={{__html: postData.contentHtml}}/>
      </article>
    </div>
  )
}


export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const data = await getAllPostIds();
  return data;
}

export async function generateMetadata({params}: { params: { slug: string } }): Promise<Metadata> {
  const {slug} = params
  return {
    title: `blog ${slug}`,
    description: `blog ${slug} detail`,
  }
}
