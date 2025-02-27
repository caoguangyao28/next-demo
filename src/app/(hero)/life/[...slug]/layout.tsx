import BreadCrumb from '@/components/BreadCrumb'

export default function BlogsLayout({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'container mx-auto pt-[130px] h-full flex gap-2 '}>
      <BreadCrumb />
      <section className={"w-[300px] flex-shrink-0 h-[500px] bg-amber-100 rounded-2xl bg-opacity-35 flex flex-col items-center"}>
        <h2>最新的生活记录</h2>
      </section>
      <section className={"h-full rounded-2xl bg-amber-50 bg-opacity-40 overflow-auto p-5"}>
        {children}
      </section>
    </div>
  );
}
