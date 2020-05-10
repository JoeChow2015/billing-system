import axios from 'axios'
import { Message } from 'element-ui'

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

instance.interceptors.response.use(
  r => r.data && r.data.code == 1 || r.config.responseType == 'blob' ? Promise.resolve(r.data) : Message({
    message: r.data.message,
    showClose: true,
    type: 'error'
  }),
  err => {
    Message({
      message: err.message,
      showClose: true,
      type: 'error'
    })
  }
)

export default instance