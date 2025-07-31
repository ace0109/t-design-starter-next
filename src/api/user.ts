import type { IUserLoginParams } from './model/user'
import request from '@/utils/request'

const Api = {
  Login: '/auth/login',
  UserInfo: '/auth/user-info',
  UpdatePassword: '/auth/update-password',
}

export function Login(_loginParams: IUserLoginParams) {
  // return request.post(Api.Login, loginParams)
  return {
    data: 'mocked-token', // Mocked response for demonstration
  }
}

export function GetUserInfo() {
  return {
    data: {
      username: 'mocked-username',
      realname: 'mocked-realname',
    },
  }
}

export function UpdatePassword(oldPassword: string, newPassword: string) {
  return request.post(Api.UpdatePassword, { oldPassword, newPassword })
}
