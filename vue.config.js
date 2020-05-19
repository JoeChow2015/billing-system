module.exports = {
  productionSourceMap:false,
  devServer: {
    port: 9000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:9007/',
        changeOrigin: true,
      }
    }
  }
}