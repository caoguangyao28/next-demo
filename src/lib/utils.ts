import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 样式合并
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
