'use strict';

const Controller = require('egg').Controller;
const jwt = require('jsonwebtoken')
const SECRET = 'asdgjkksdajfhsahsafjd'

class HomeController extends Controller {

  async index() {
    //测试redis
    // await this.app.redis.set('username', '1234');
    // let user = await this.app.redis.get('username')
    // console.log(user)
    await this.ctx.render('page.ejs')
  }

  //登录
  async login(){
    // 登录成功则给当前domain下的cookie设置token
    const {username, password} = this.ctx.request.body
    try{
      //通过username取出数据库中的用户
      const user = await this.app.mysql.get('users',{username:username})
      const lastToken = user.token
      // 此处生成token，使用jwt
      const newToken = jwt.sign({
        username, id: user.id
      }, SECRET)

      // this.ctx.session.token= newToken

      //将token保存到redis中,填入一个空的数组，后续需要用到这个数组
      await this.app.redis.set(newToken, JSON.stringify([]))

      //生成新的token后，要清除子系统的session
      if(lastToken){
        //根据token查询redis，并把子系统的sesseion清除
        let val = await this.app.redis.get(lastToken)
        if(val){
          for(let item of JSON.parse(val)) this.app.redis.del(item.sid)
        }
        await this.app.redis.del(lastToken)
      }

      this.ctx.body={
        code: 0,
        msg: 'success'
      }
    }catch(e){
      next(new Error(e))
    }
  }

  //检验token的有效性
  async authenticate(){
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

      this.ctx.body = ({
        code: 0,
        msg: 'login success',
        data: {username, id}
      })
    }catch(e){
      next(new Error(e))
    }
  }

  //用户退出登录，将所有子系统退出
  async logout(){
    //这里需要做的就是把token对应的子系统的sessionID清除
    try{
      let cookies = this.ctx.helper.splitCookies(this.request.headers.cookie)
      let token = cookies['token']
      if(token){
        let val = await this.app.redis.get(token)
        if(val){
          for(let item of JSON.parse(val)) this.app.redis.del(item.sid)
        }
        await this.app.redis.del(token)
      }
      this.ctx.body = {
        code: 0,
        msg: 'logout success'
      }
    }catch(e){
      next(new Error(e))
    }
  }

  async users(){
    this.ctx.body="users"
  }

  //注册子系统
  async register(token,sid,name){
    try {
      // 保存到redis里
      let value = await this.app.redis.get(token)
      if (!value) {
        value = [{ name, sid }]
      } else {
        value = JSON.parse(value)
        value.push({ name, sid })
      }
      await this.app.redis.set(token, JSON.stringify(value))
    } catch (err) {
      throw err
    }
  }
}

module.exports = HomeController;
