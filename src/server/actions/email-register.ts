'use server'
import {createSafeActionClient} from 'next-safe-action';
import {db} from "@/server";
import {registerSchema} from "@/types/login-schema";
import bcrypt from 'bcrypt'

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
  .schema(registerSchema)
  .action(async ({parsedInput: {email, password, name}}) => {
    const passwordHash = await bcrypt.hash(password, 10);
    // 判断是否已存在用户
    const existingUser = await db.query.users.findFirst({
      where: (users, {eq}) => eq(users.email, email),
    })
    if (existingUser) {
      return {
        error: "email already in use"
      }
    }

    return {success: true, email, passwordHash, name}
  })
