/**
 * 标题 背景图 组件
 *
 */
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/app/lib/staticData"

interface IProps {
  title: string;
}

export default function Hero({ title }: IProps) {

  return (
    <div className='h-screen relative'>
      <div className='absolute inset-0 -z-10 dark:bg-gray-900'>
        <div className='absolute inset-0 bg-gradient-to-r from-gray-950'></div>
      </div>
      <div className='flex justify-center pt-48'>
        <h1 className='text-purple-700 dark:text-white text-6xl'>{ title }</h1>
      </div>
      <div className='flex w-full mx-auto flex-wrap justify-center gap-4 mt-12'>
        {categories.map((category, index) => (
          <CategoryCard key={index} title={category.title} description={category.description} latestPosts={category.latestPosts} />
        ))}
      </div>
    </div>
  );
}
