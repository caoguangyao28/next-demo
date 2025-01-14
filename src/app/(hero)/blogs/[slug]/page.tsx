import {Metadata} from "next";

export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params
  return (
    <div className={'absolute inset-0 flex items-center justify-center'}>
      <h1>blog {slug} detail </h1>
    </div>
  )
}


export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return [{ slug: '1' },{  slug: '2' }];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  return {
    title: `blog ${slug}`,
    description: `blog ${slug} detail`,
  }
}