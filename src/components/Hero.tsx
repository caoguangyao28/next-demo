/**
 * 标题 背景图 组件
 *
 */
import CategoryCard from "@/components/CategoryCard";
import {categories} from "@/app/lib/staticData"
import {getLatestPosts} from "@/app/lib/post";

interface IProps {
  title: string;
  categoriesWithPosts?: typeof categories;
}


export default async function Hero({title}: IProps) {
  // 根据 categories 数据中的 dirType 获取不同分类下 最新的 文章
  // 获取所有分类的最新文章
  const categoriesWithPosts = await Promise.all(
    categories.map(async (category) => {
      if (category.dirType) {
        category.latestPosts = await getLatestPosts(category.dirType);
      }
      return category;
    })
  );

  return (
    <div className='h-full pb-5 overflow-y-auto'>
      <div className='flex justify-center pt-48'>
        <h1 className='text-purple-700 dark:text-white text-6xl font-bold drop-shadow-lg'>{title}</h1>
      </div>
      <div className='flex w-full mx-auto flex-wrap justify-center gap-4 mt-12'>
        {categoriesWithPosts.map((category, index) => (
          <CategoryCard key={index} dirType={category.dirType === 'posts' ? 'blogs' : category.dirType}
                        title={category.title} description={category.description} latestPosts={category.latestPosts}/>
        ))}
      </div>
    </div>
  );
}
