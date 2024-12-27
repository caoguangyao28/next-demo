'use client'
import Link from 'next/link';
import {usePathname} from "next/navigation";
const linkData = [
  {name: 'Performance', href: '/performance'},
  {name: 'Reliability', href: '/reliability'},
  {name: 'Scale', href: '/scale'},
]
export default function Header() {
  // 匹配路径高亮
  const pathname = usePathname();

  return (
    <div className= 'absolute w-full z-10'>
      <header className={'container flex justify-between text-white mx-auto p-8'}>
        <Link className={'text-3xl font-bold'} href="/">Home</Link>
        <div className={'text-xl space-x-4 '}>
          {linkData.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${item.href === pathname ? 'text-blue-500' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </header>
    </div>
  );
}
