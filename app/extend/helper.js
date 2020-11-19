module.exports = {
    //分离cookies
    splitCookies(cookie) {
      // this 是 helper 对象，在其中可以调用其他 helper 方法
      // this.ctx => context 对象
      // this.app => application 对象
      const cookies = {}
      cookie && cookie.split(';').forEach(( item ) => {
        const parts = item.split('=')
        console.log(parts)
        cookies[parts[0].trim()] = (parts[1] || '').trim()
      })
      return cookies;
    },
    //检查请求ip是否为授权ip
    checkSecurityIP(ip){
      // 这里可以去从数据库中读取一份维护的有效IP地址列表
      const securityIP = '127.0.0.1'
      return securityIP === ip
    }
};
