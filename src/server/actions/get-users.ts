'use server'
import { db } from '@/server/index'
import { User } from '@/server/schema'

export async function getUsers(): Promise<{sucess: boolean, data:User[] }> {
  const users = await db.query.users.findMany()
  if (!users) {
    throw new Error('No users found')
  }
  return {sucess: true, data: users}
}