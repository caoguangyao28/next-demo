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
    <div className= 'absolute w-full z-10'>
      <header className={'container flex items-center justify-between text-white mx-auto p-8'}>
        <Link className={'flex items-center justify-center w-[4.5rem] h-[4.5rem] bg-amber-100 rounded-2xl'} href="/">
          <Image className={'w-[60px]'} src={LogoSrc} alt={'logo'} />
        </Link>
        <div className={'text-xl space-x-4 '}>
          {linkData.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${item.href === pathname ? 'text-purple-700' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </header>
    </div>
  );
}
