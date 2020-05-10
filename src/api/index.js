import ins from './axios'
export default {
  // 获取订单列表
  getOrderList (params) {
    return ins.post('/api/list/orders', params)
  },
  // 保存订单
  saveOrder (params) {
    return ins.post('/api/save/orders', params)
  },
  // 根据寄件公司和省份获取客户数据
  getDetailByCC (params = {}) {
    return ins.get('/api/get/order/byName', {
      params
    })
  },
  // 删除订单
  deleteOrderById (orderId) {
    return ins.delete(`/api/del/${orderId}/order`)
  },
  // 下载订单
  downloadBill (params) {
    return ins.post('/api/download', params, {
      responseType: 'blob'
    })
  },
  // // 根据orderId获取订单
  // getDetailByOrderId (orderId) {
  //   return ins.get(`/api/get/${orderId}/order`)
  // },
  // 客户列表
  getUserList () {
    return ins.get('/api/list/users')
  },
  // 保存客户
  saveUser (params) {
    return ins.post('/api/save/users', params)
  },
  // 删除客户
  deleteUserById (userId) {
    return ins.delete(`/api/del/${userId}/user`)
  },
  // 查看统计列表
  getStatisticList (params) {
    return ins.post('/api/get/aggs/page', params)
  },
}