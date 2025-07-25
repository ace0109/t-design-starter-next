import type { UserInfo } from '@/types/interface'

export interface IUserStore {
  token: string
  userInfo: UserInfo
}
