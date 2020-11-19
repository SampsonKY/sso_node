const axios = require('axios')

module.exports = (options,app) => {
    return async function authenticate(ctx, next) {
      const cookies = ctx.helper.splitCookies(ctx.request.headers.cookie);
      //判断是否有token，如果没有，则返回失败
      const token = cookies['token']
      if(!token) throw new Error('token is required.')

      const sid = cookies['sid']

      //如果获取到user,则说明该用户已经登录
      if (ctx.session.user) {
        await next();
      }

      try{
        let res = await axios({
          method: "POST",
          url: 'http://127.0.0.1/authenticate',
          data:{
            token,
            sid: ctx.request.sessionID,
            name:'xxx'
          }
        })
        if(res.data.code !==0) throw new Error(res.data.msg)
        this.ctx.session.user = res.data.data
        
      }catch(e){
        
      }
      
      // else {
      //   ctx.body = {
      //     data: '没有登录',
      //   };
      // }
    };
  };