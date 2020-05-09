import axios from 'axios'

const baseUrl = process.env.NODE_ENV == 'development' ? '' : window.location.origin
const instance = axios.create({
  headers: {
    baseURL: baseUrl,
    'Content-Type': 'application/json',
    'post': {
      Accept: '*/*'
    }
  }
})

instance.interceptors.response.use(r => Promise.resolve(r.data), err => Promise.reject(err.message))

export default instance