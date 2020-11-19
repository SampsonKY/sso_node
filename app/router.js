'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();

  router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.post('/logout', controller.home.logout);
  router.get('/users',auth, controller.home.users);
  router.post('/authenticate',controller.home.authenticate);
};
