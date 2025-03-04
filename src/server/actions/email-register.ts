'use server'
import {createSafeActionClient} from 'next-safe-action';
import {db} from "@/server";
import {registerSchema} from "@/types/login-schema";
import bcrypt from 'bcrypt'
import {generateEmailVerificationToken} from "@/server/actions/tokens";
import {users} from "@/server/schema";

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
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        // await sentVerificationEmail(email, verificationToken);
        return {
          success: "email confirmation resent",
        }
      }
      return {error: "email already in use"}
    }

    await db.insert(users).values({
      email,
      name,
      password: passwordHash,
    })

    const verificationToken = await generateEmailVerificationToken(email);
    // 发送邮件 确认
    // await sentVerificationEmail(email, verificationToken);

    return {
      success: "confirmation email sent",
    }
  })
