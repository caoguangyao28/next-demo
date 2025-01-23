"use client"

import { Session } from 'next-auth';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import avatroSrc from '/public/avator.png';
import {signOut} from "next-auth/react";

export const UserButton = ({user} : Session) => {
  return (
    <div className={'pl-3 flex items-center'}>
      {/*<Avatar className={'w-[40px] h-[40px]'}>*/}
      {/*  <AvatarImage src={avatroSrc.src} />*/}
      {/*  <AvatarFallback>CGY</AvatarFallback>*/}
      {/*</Avatar>*/}
      <div>
        <button onClick = {() => signOut() }>
          sign out
        </button>
      </div>
    </div>
  )
}
