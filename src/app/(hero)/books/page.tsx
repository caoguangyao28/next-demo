import Link from "next/link";
import {getSortedPostsData} from '@/app/lib/post'
import {Metadata} from "next";
import BookCover from "@/components/books/BookCover";
import {Book} from 'lucide-react'; // 引入 lucide-react 的 Book 图标

export default async function Page() {
  const staticData = await generateStaticProps('books');
  const {blogs} = staticData.props;

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
  return (
    <div className={'absolute inset-0 top-[70px] flex items-center justify-around flex-wrap p-4 overflow-y-auto'}>
      {sortedGroups.map((group) => (
        <div key={group} className="container">
          <h2 className="text-3xl font-bold mb-4">{group === 'undefined' ? '' : group}</h2>
          <div className="flex justify-between gap-5 flex-wrap ">
            {groupedBlogs[group].map((blog) => (
              <div key={blog.id}
                   className="bg-white bg-opacity-70 p-4 rounded-lg shadow-md sm:w-full md:w-[43%] hover:shadow-lg transition-shadow duration-300">
                <BookCover author={blog.author} desc={blog.description} imgSrc={blog.bookimage ?? ''}/>
                <div className={'flex justify-between items-center'}>
                  <h1
                    className="text-2xl font-bold mb-2 flex items-center overflow-hidden whitespace-nowrap text-ellipsis">
                    <Book className="mr-2" size={24}/> {/* 添加 Book 图标 */}
                    <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                      <Link href={`/books/${blog.id}`}
                            className="">
                        {blog.title}
                      </Link>
                    </span>
                  </h1>
                  <p className="mb-0">
                    {blog.date}
                  </p>
                </div>

                {/*<p className="text-gray-700 m-0">*/}
                {/*  {blog.description}*/}
                {/*</p>*/}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// 获取所有书籍 列表
export const metadata: Metadata = {
  description: "Books list page",
  title: "Books list"
}

// 只是生成书籍目录下的
async function generateStaticProps(dir: string = 'books') {
  const data = await getSortedPostsData(dir);
  return {
    props: {
      blogs: data
    }
  }
}
