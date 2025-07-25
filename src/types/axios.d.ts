export interface IResponseData<T = any, E = any> {
  code: string
  message: string
  data: T
  extend: E
}
