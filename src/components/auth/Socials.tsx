'use client'
import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";

export default function Socials() {
  return (
    <div className="flex gap-4">
      <Button onClick={() => signIn('github',{
        redirect: false,
      })}>
        login with github (不稳定老是报错 github 问题)
      </Button>
    </div>
  )
}
