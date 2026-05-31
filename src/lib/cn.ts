import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 条件付き className を安全に連結する。
 * clsx で条件分岐を扱い、tailwind-merge で競合する Tailwind class を後勝ちにするための helper。
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
