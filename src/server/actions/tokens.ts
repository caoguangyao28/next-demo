'use server'

import {db} from "@/server";
import {emailTokens} from "@/server/schema";
import {eq} from "drizzle-orm";

export const getVerificationToken = async (email: string) => {
  try {
    const token = await db.query.emailTokens.findFirst({
      where: (emailTokens, {eq}) => eq(emailTokens.token, email),
    })
    return token
  }catch (e) {
    return null
  }
}
export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID()
  const expires = new Date(new Date().getTime() + 3600 * 1000)
  // expires.setDate(expires.getDate() + 1)

  // 判断是否存在
  const existingToken = await getVerificationToken(email)

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id))
  }

  const verificationToken = await db.insert(emailTokens).values({
    email,
    token,
    expires,
  })

  return verificationToken
}
