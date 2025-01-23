import { auth } from '@/server/auth'
import Image from "next/image";
import type { Session } from 'next-auth';
export default function UserInfo() {
  console.log(process.env.POSTGRES_URL);
  // const session: Session | null = await auth();
  // const users = session?.user;
  // if (!users) {
  //   return <div>加载中...</div>; // 或者其他合适的占位内容
  // }
  return (
    <nav>
      <ul>
        <li>logo</li>
        {/*<li>{users?.name}</li>*/}
        {/*<li>{users?.email}</li>*/}
        <li>
          {/*<Image width={50} src={users?.image || ''} alt={'avatar'} />*/}
        </li>
      </ul>
    </nav>
  )
}
