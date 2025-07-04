import axios, { AxiosResponse } from 'axios'

const API_BASE_URL = 'https://localhost:7219/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor para manejo de errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ Response error:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
