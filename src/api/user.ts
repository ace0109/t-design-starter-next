import type { IUserLoginParams } from './model/user'
import request from '@/utils/request'

const Api = {
  Login: '/auth/login',
  UserInfo: '/auth/user-info',
}

export function Login(loginParams: IUserLoginParams) {
  return request.post(Api.Login, loginParams)
}

export function GetUserInfo() {
  return request.get(Api.UserInfo)
}
