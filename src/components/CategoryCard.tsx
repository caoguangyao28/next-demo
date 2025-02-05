'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from "next/link";
import {linkData} from "@/app/lib/staticData";
// 导入 Shadcn UI 的 Tooltip 组件
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type PostData = {
  id: string
  date: string
  title: string
  description: string
  dirName: string
}
interface CategoryCardProps {
  title: string;
  description: string;
  latestPosts?: PostData[];
  dirType?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, latestPosts, dirType = '' }) => {
  // 根据title 找出 linkData 对象数组中 name == title 的对象
  const linkDataItem = linkData.find((item) => item.name === title);
  return (
    <Card className={'w-[300px] shadow-md dark:bg-gray-800 dark:text-white bg-opacity-65'}>
      <CardHeader>
        <CardTitle>
          <Link className={'text-blue-600'} href={ linkDataItem?.href! }> {title} </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {description}
        {latestPosts && (
          <div className="mt-4">
            <h3 className="font-semibold">最新文章</h3>
            <ul>
              {latestPosts.map((post, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger>
                      <li className="truncate max-w-[270px]">
                        <Link className={'text-primary'} href={`${dirType}/${post.id}`}>
                          {index + 1}. {post.title}
                        </Link>
                      </li>
                    </TooltipTrigger>
                    <TooltipContent>
                      {post.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;