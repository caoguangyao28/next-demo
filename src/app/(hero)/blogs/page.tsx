import Link from "next/link";

export default async function Page() {
  const staticData = await generateStaticProps();
  const { blogs } = staticData.props;
  return (
    <div className={'absolute inset-0 flex items-center justify-around'}>
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h1>
            <Link href={`/blogs/${blog.id}`}>
             {blog.title}
            </Link>
          </h1>
          <p>
            {blog.content}
          </p>
        </div>
      ))}
    </div>
  )
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