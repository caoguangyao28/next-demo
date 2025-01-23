"use client"

import { Session } from 'next-auth';
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const UserButton = ({user} : Session) => {
  return (
    <div className={'pl-3 flex items-center'}>
      <div>
        <Button onClick = {() => signOut() }>
          sign out
        </Button>
      </div>
    </div>
  )
}
