import Link from "next/link";
import {Metadata} from "next";

export default async function Page() {
  const staticData = await generateStaticProps();
  const { blogs } = staticData.props;
  return (
      <div className={'absolute inset-0 flex items-center justify-around flex-wrap p-4'}>
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md p-6 m-4 w-full max-w-sm hover:shadow-lg transition-shadow duration-300">
            <h1 className="text-2xl font-bold mb-2">
              <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:text-blue-800">
                {blog.title}
              </Link>
            </h1>
            <p className="text-gray-700">
              {blog.content}
            </p>
          </div>
        ))}
      </div>
  )
}

export const metadata: Metadata = {
  description: "Blogs list page",
  title: "Blogs list"
}

async function generateStaticProps() {
  return {
    props: {
      blogs: [
        {
          id: 1,
          title: 'blog 1',
          slug: 'blog-1',
          content: 'blog 1 content',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'blog 2',
          slug: 'blog-2',
          content: 'blog 2 content',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]
    }
  }
}