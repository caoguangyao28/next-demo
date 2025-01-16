import avatroSrc from '/public/avator.png';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
export default function BlogsLayout({
    children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'container mx-auto pt-[130px] h-full flex gap-2 '}>
      <section className="w-[300px] h-[500px] bg-amber-100 rounded-2xl bg-opacity-35 flex flex-col items-center p-6 shadow-md border border-gray-200">
        <Avatar className={'w-[100px] h-[100px] -mt-2.5 mb-5'}>
          <AvatarImage src={avatroSrc.src} />
          <AvatarFallback>CGY</AvatarFallback>
        </Avatar>
        <ul className="space-y-4 text-gray-700 pl-0">
          <li>姓名：曹光耀</li>
          <li>性别：男</li>
          <li>出生日期：1989年1月6日</li>
          <li>毕业院校：南通大学</li>
          <li>学历：本科</li>
          <li>专业：数字媒体技术</li>
          <li>现住地址：南京市江宁区</li>
          <li>联系方式：
            <a href="mailto:caoguangyao28@163.com" className="text-blue-500 hover:underline">caoguangyao28@163.com</a>,
            QQ:598637427
          </li>
        </ul>
      </section>
      <section className={"w-full min-w-min h-full rounded-2xl bg-amber-50 bg-opacity-40 overflow-auto p-5"}>
        {children}
      </section>
    </div>
  );
}
