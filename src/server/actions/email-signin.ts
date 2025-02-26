'use server'

import {loginSchema} from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action';
import {db} from "@/server";

const actionClient = createSafeActionClient();

// 构建 emailSignin 登录 action 禁止缓存
export const emailSign = actionClient
  .schema(loginSchema)
  .action(async ({parsedInput: {email, password, code}}) => {
    const existingUser = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.email, email),
    })

    if (existingUser?.email !== email) {
      return {
        error: "email not found"
      }
    }

    if(!existingUser.emailVerified) {
      return {
        error: "email not verified"
      }
    }

    return {success: email, email, password, code}
  });
