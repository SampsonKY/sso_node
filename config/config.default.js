/* eslint valid-jsdoc: "off" */

'use strict';

const { sessionRedis } = require("./plugin");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1605768566685_1193';

  //配置ejs
  config.view = {
    mapping: {
      '.ejs': 'ejs'
    }
  };
    //连接数据库操作
    config.mysql = {
      // 单数据库信息配置
      client: {
        // host
        host: 'localhost',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '0305kk..',
        // 数据库名
        database: 'sso',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    };

  //配置redis
  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 1
    }
  };
  
  //配置egg-session-redis
  // config.sessionRedis = {
  //   name: 'session'
  // };

  //配置session
  config.session={
    key: 'SESSION_ID',
    maxAge: 24 * 3600 * 1000,
    httpOnly: true,
    encrypt: true,
    renew: true //延长会话有效期
  }

  // add your middleware config here
  config.middleware = ['csrf'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
