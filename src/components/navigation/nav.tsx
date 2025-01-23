import { auth } from '@/server/auth'
import {UserButton} from "@/components/navigation/UserButton";
import Link from "next/link";
import { LogIn } from 'lucide-react'
import {Button} from "@/components/ui/button";

export default async function Nav() {
  const session = await auth()
  return (
   !session ? (
     <Button asChild={true}>
      <Link className={'flex gap-2'} href="/src/app/(hero)/auth/login">
        <LogIn size={16} /><span>Login</span>
      </Link>
     </Button>
   ) : (
     <UserButton expires={session?.expires || '' } user={ session?.user } />
   )
  );
}
