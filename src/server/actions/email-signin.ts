'use server'

import {loginSchema} from '@/types/login-schema';
import {createSafeActionClient} from 'next-safe-action';

const actionClient = createSafeActionClient();

// 构建 emailSignin 登录 action 禁止缓存
export const emailSign = actionClient
  .schema(loginSchema)
  .action(async ({parsedInput: {email, password, code}}) => {
    console.log('emailSignin', email, password, code)
    return {email, password, code}
  });