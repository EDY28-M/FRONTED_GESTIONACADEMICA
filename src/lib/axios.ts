import axios, { AxiosResponse } from 'axios'

// Usar la variable de entorno para la URL base
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7219/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para logging (solo en desarrollo)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.error('❌ Request error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor para manejo de errores
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.log(`✅ ${response.status} ${response.config.url}`)
      console.log('📊 Response data:', response.data)
    }
    return response
  },
  (error) => {
    if (import.meta.env.VITE_DEV_MODE === 'true') {
      console.error('❌ Response error:', error.response?.data || error.message)
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
