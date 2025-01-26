'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from "next/link";
import {linkData} from "@/app/lib/staticData";

interface CategoryCardProps {
  title: string;
  description: string;
  latestPosts?: string[];
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, latestPosts }) => {
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
                <li key={index}>{post}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard;