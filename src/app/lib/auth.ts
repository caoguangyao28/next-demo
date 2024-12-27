/**
 * Check user role
 * @returns {string} user role
 */
// 导出类型声明
export type UserRole = 'admin' | 'user';
// 导出模块的声明
export const UserRole = {
  admin: 'admin',
  user: 'user'
}
export function checkUserRole(): UserRole {
  return 'admin'
}