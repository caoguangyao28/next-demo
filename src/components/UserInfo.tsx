import { getUsers } from '@/server/actions/get-users'


export default async function UserInfo() {
  const users = await getUsers();
  return (
    <div className={'flex flex-col items-center'}>
      <div className={'w-[100px] h-[100px] rounded-full bg-amber-100'}>
        { users.sucess && <span> { users.data[0].name } </span> }
      </div>
      <div className={'text-center'}></div>
    </div>
  )
}