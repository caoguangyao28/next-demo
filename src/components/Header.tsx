import Link from 'next/link';
import Image from "next/image";
import LogoSrc from '/public/my-logo.svg';
import StaticNav from '@/components/StaticNav'
import Nav from "@/components/navigation/nav";
export default function Header() {
  // 匹配路径高亮
  return (
    <div className= 'fixed w-full z-10'>
      <header className={'container flex items-center justify-between text-white mx-auto pl-3 pr-3 pt-5 pb-5'}>
        <div className={'flex min-w-40 space-x-2 items-center'}>
          <Link className={'flex items-center justify-center w-[50px] h-[50px] bg-amber-100 rounded-2xl'} href="/">
            <Image className={'w-[40px]'} src={LogoSrc} alt={'logo'}/>
          </Link>
          <span className={'text-3xl'}> Shinecgy coding</span>
        </div>
        {/* 提炼为客户的组件部分*/}
        <div className={'flex items-center pr-3'}>
          <StaticNav />
          <Nav />
        </div>
      </header>
    </div>
  );
}
