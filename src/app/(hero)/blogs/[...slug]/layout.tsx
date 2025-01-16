import BreadCrumb from '@/components/BreadCrumb'

export default function BlogsLayout({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'container mx-auto pt-[130px] h-full flex gap-2 '}>
      <BreadCrumb />
      <section className={"w-[300px] h-[500px] bg-amber-100 rounded-2xl bg-opacity-35 flex flex-col items-center"}>
        <h2>logo 最新文章推荐</h2>
      </section>
      <section className={"w-full min-w-min h-full rounded-2xl bg-amber-50 bg-opacity-40 overflow-auto p-5"}>
        {children}
      </section>
    </div>
  );
}
