import BreadCrumb from '@/components/BreadCrumb'
import { getLatestPosts } from "@/app/lib/post";

export default async function BlogsLayout({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const latestPosts = await getLatestPosts('blogs', 10);
  return (
    <div className={'container mx-auto pt-[130px] h-full flex gap-2 '}>
      <BreadCrumb />
      <section className={"w-[300px] flex-shrink-0 h-[500px] bg-amber-100 rounded-2xl bg-opacity-35 flex flex-col items-center p-4"}>
        <h2 className={"text-xl font-bold mb-4 flex items-center"}>
          <span className="mr-2">
            <i className="fa fa-newspaper" aria-hidden="true"></i>
          </span>
          <span>最新文章推荐</span>
        </h2>
        <div className={"flex flex-col gap-2 w-full"}>
          <ul className={"list-disc pl-5"}>
            {latestPosts.map((post) => (
              <li key={post.id} className={"flex flex-col gap-1"}>
                <a href={`/blogs/${post.id}`} className={"hover:underline truncate overflow-hidden"}>{post.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className={"h-full rounded-2xl bg-amber-50 bg-opacity-40 overflow-auto p-5"}>
        {children}
      </section>
    </div>
  );
}
