/*
 * @Description: 配置文件
 */
module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/': {
        target: 'https://h3w3053111.oicp.vip/', // 本地后端地址
        // target: 'http://101.132.181.9:3000/', // 线上后端地址
        changeOrigin: true, //允许跨域
        pathRewrite: {
          '^/': ''
        }
      }
    }
  }
}