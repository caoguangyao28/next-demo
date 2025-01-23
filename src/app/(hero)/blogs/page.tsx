import Link from "next/link";
import { getSortedPostsData } from '@/app/lib/post'
import {Metadata} from "next";

export default async function Page() {
  const staticData = await generateStaticProps();
  const { blogs } = staticData.props;

  // 根据 dirName 对 blogs 进行分组
  const groupedBlogs = blogs.reduce((acc, blog) => {
    const key = blog.dirName || 'undefined';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(blog);
    return acc;
  }, {} as Record<string, typeof blogs>);

  // 将分组值为 undefined 的博客放在其他分组前面
  const sortedGroups = Object.keys(groupedBlogs).sort((a, b) => a === 'undefined' ? -1 : b === 'undefined' ? 1 : 0);

  // console.log( groupedBlogs, sortedGroups);

  return (
    <div className={'absolute inset-0 top-[70px] flex items-center justify-around flex-wrap p-4 overflow-y-auto'}>
      {sortedGroups.map((group) => (
        <div key={group} className="container">
          <h2 className="text-3xl font-bold mb-4">{group === 'undefined' ? '' : group}</h2>
          <div className="flex justify-evenly flex-wrap ">
            {groupedBlogs[group].map((blog) => (
              <div key={blog.id} className="bg-white p-4 rounded-lg shadow-md sm:w-5/12 md:w-[30%] hover:shadow-lg transition-shadow duration-300">
                <h1 className="text-2xl font-bold mb-2">
                  <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:text-blue-800">
                    {blog.title}
                  </Link>
                </h1>
                <p className="text-gray-700">
                  {blog.description}
                </p>
                <p className="text-gray-700">
                  {blog.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// 获取所有博文 列表
export const metadata: Metadata = {
  description: "Blogs list page",
  title: "Blogs list"
}

async function generateStaticProps() {
  const data = await getSortedPostsData();
  return {
    props: {
      blogs: data
    }
  }
}
