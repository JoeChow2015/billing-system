import axios from 'axios'

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'post': {
      Accept: '*/*'
    }
  }
})

instance.interceptors.response.use(r => Promise.resolve(r.data), err => Promise.reject(err.message))

export default instance