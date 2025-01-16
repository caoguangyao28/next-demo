'use client'
import Link from 'next/link';
import {usePathname} from "next/navigation";
import Image from "next/image";
import LogoSrc from '/public/my-logo.svg';
const linkData = [
  {name: '前沿观察', href: '/performance'},
  {name: 'blogs', href: '/blogs'},
  // {name: 'scale', href: '/scale'},
  {name: '关于我', href: '/about'}
]
export default function Header() {
  // 匹配路径高亮
  const pathname = usePathname();

  return (
    <div className= 'fixed w-full z-10'>
      <header className={'container flex items-center justify-between text-white mx-auto pl-3 pr-3 pt-5 pb-5'}>
        <div className={'flex min-w-10 space-x-2 items-center'}>
          <Link className={'flex items-center justify-center w-[50px] h-[50px] bg-amber-100 rounded-2xl'} href="/">
            <Image className={'w-[40px]'} src={LogoSrc} alt={'logo'}/>
          </Link>
          <span className={'text-3xl'}> Shinecgy coding</span>
        </div>
        <div className={'text-xl space-x-4 '}>
          {linkData.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${pathname.includes(item.href) ? 'text-purple-700' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </header>
    </div>
  );
}
