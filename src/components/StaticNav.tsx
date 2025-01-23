'use client'
import Link from "next/link";
import {usePathname} from "next/navigation";

const linkData = [
  {name: '前沿观察', href: '/performance'},
  {name: 'blogs', href: '/blogs'},
  // {name: 'scale', href: '/scale'},
  {name: '关于我', href: '/about'}
]
export default function StaticNav() {
  const pathname = usePathname();

  return (
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
  )
}
