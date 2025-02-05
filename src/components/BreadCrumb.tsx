'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {usePathname} from "next/navigation";

const breadcrumbMap = {
  '/blogs/': 'Blogs',
  '/books/': 'books',
  '/life/': 'life'
};

const generateBreadcrumb = (category: keyof typeof breadcrumbMap) => {
  return (
    <Breadcrumb className={'absolute top-24'}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={category}>{breadcrumbMap[category]}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{usePathname().split('/').pop()}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default function BreadCrumb () {
  const pathname = usePathname();
  // 根据 pathname 生成面包屑
  // console.log(pathname);
  if (pathname === '/') {
    return null;
  }
  for (const category of Object.keys(breadcrumbMap) as Array<keyof typeof breadcrumbMap>) {
    if (pathname.includes(category)) {
      return generateBreadcrumb(category);
    }
  }
}
