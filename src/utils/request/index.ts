import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { IResponseData } from '@/types/axios'
import axios from 'axios'
import { ContentTypeEnum } from '@/constants'
import { useUserStore } from '@/store'

const env = import.meta.env.MODE || 'development'

// 如果是mock模式 或 没启用直连代理 就不配置host 会走本地Mock拦截 或 Vite 代理
const host = env === 'mock' || import.meta.env.VITE_IS_REQUEST_PROXY !== 'true' ? '' : import.meta.env.VITE_API_URL

const urlPrefix = import.meta.env.VITE_API_URL_PREFIX

/**
 * 创建axios实例
 * https://axios-http.com/zh/docs/instance
 */
const instance = axios.create({
  baseURL: host + urlPrefix,
  timeout: 10 * 1000,
  headers: { 'Content-Type': ContentTypeEnum.Json },
})

instance.interceptors.request.use((config) => {
  const userStore = useUserStore()
  const { token } = userStore

  if (token) {
    // jwt token
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

instance.interceptors.response.use(async (response: AxiosResponse<IResponseData>) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么

  return response
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

async function transformResponse(response: AxiosResponse<IResponseData>): Promise<IResponseData> {
  const { data } = response
  if (data.code !== '200') {
    // 业务错误
    const error = new Error(data.message || '请求失败')
    error.name = 'BusinessError'
    error.stack = data.extend?.stack || ''
    return Promise.reject(error)
  }
  // 成功响应
  return data
}

const request = {

  async get<T = any, E = any>(url: string, config?: AxiosRequestConfig): Promise<IResponseData<T, E>> {
    const response = await instance.get(url, { ...config })
    return transformResponse(response)
  },

  async post<T = any, E = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<IResponseData<T, E>> {
    const response = await instance.post(url, data, { ...config })
    return transformResponse(response)
  },

  async put<T = any, E = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<IResponseData<T, E>> {
    const response = await instance.put(url, data, { ...config })
    return transformResponse(response)
  },

  async delete<T = any, E = any>(url: string, config?: AxiosRequestConfig): Promise<IResponseData<T, E>> {
    const response = await instance.delete(url, { ...config })
    return transformResponse(response)
  },

  async patch<T = any, E = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<IResponseData<T, E>> {
    const response = await instance.patch(url, data, { ...config })
    return transformResponse(response)
  },

  /**
   * 上传文件封装
   * @param key 文件所属的key
   * @param file 文件
   * @param config 请求配置
   */
  upload<T = any>(key: string, file: File, config: AxiosRequestConfig): Promise<T> {
    const params: FormData = config.params ?? new FormData()
    params.append(key, file)

    return instance.request(
      {
        ...config,
        method: 'POST',
        headers: {
          'Content-Type': ContentTypeEnum.FormData,
        },
        params,
      },
    )
  },
}

export default request
