module.exports = {
  devServer: {
    port: 9000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://47.93.254.72:9007/',
        changeOrigin: true,
      }
    }
  }
}