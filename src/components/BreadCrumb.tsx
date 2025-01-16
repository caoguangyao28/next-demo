'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";

export default function BreadCrumb () {
  const pathname = usePathname();
  // 根据 pathname 生成面包屑
  // console.log(pathname);
  if (pathname === '/') {
    return null;
  }
  if (pathname.includes('/blogs/')) {
    return (
      <Breadcrumb className={'absolute top-24'}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/blogs">Blogs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {/* split 后 取最后一个元素 */}
            <BreadcrumbPage>{pathname.split('/').pop()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
}