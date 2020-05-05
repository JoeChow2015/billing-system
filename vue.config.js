module.exports = {
  devServer: {
    port: 9000,
    open: true,
    proxy: {
      '/api': {
        target: '***',
        changeOrigin: true,
      }
    }
  }
}