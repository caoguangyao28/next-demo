/**
 * 标题 背景图 组件
 *
 */
import Image, {StaticImageData} from 'next/image'

interface IProps {
  imgUrl: StaticImageData;
  altTxt: string;
  content: string;
}

export default function Hero(props: IProps){
  return (
    <div className='h-screen relative'>
      {/*图片层级 大小 定位*/}
      <div className='absolute inset-0 -z-10'>
        {/*<Image className={'object-cover'} src={props.imgUrl} fill  alt={props.altTxt}/>*/}
        {/*渐变遮罩*/}
        <div className='absolute inset-0 bg-gradient-to-r from-gray-950'></div>
      </div>
      <div className='flex justify-center pt-48'>
        <h1 className='text-white text-6xl'>{props.content}</h1>
      </div>
    </div>
  )
}