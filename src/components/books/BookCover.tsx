/**
 * 书籍封面组件
 *
 */
import Image from 'next/image'

// 补充完善 props

export default function BookCover({imgSrc, desc, author}: {imgSrc: string, desc?: string, author?: string}) {
  return (
    <div className={'pt-2.5 flex'}>
      <Image width={135} height={200} alt={'图书封面'} src={imgSrc} />
      <section className={'pl-2'}>
        <h3>作者：{author ?? '网络'}</h3>
        <p className={'text-sm text-xl'}>
          {desc}
        </p>
      </section>
    </div>
  );
}
