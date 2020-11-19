'use strict';

const Service = require('egg').Service;

class AuthserviceService extends Service {
  async authservice() {
    const {token, sid, name} = this.ctx.body
    try{
      // 检查请求的真实IP是否为授权系统
      // nginx会将真实IP传过来，伪造x-forward-for是无效的
      if (!this.ctx.helper.checkSecurityIP(this.ctx.request.headers['x-real-ip'])) {
        throw new Error('ip is invalid')
      }
      // 判断token是否还存在于redis中并验证token是否有效, 取得用户名和用户id
      const tokenExists = await this.app.redis.exists(token)
      if(!tokenExists) throw new Error('token is invalid.')
      const {username, id} = await jwt.verify(token, SECRET)
      //校验成功注册子系统
      let value = await this.app.redis.get(token)
      if(!value) value = [{name, sid}]
      else{
        value = JSON.parse(value)
        value.push({name, sid})
      }
      await this.app.redis.set(token, JSON.stringify(value))

      return {
        code: 0,
        msg: 'login success',
        data: {username, id}
      }
    }catch(e){
      return new Error(e)
    }
  }
}

module.exports = AuthserviceService;
