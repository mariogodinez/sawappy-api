import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializedDb from '../db';
import store from '../controller/stores';
import user from '../controller/users';
import account from '../controller/account';
import promo from '../controller/promos';
import card from '../controller/cards';

let router = express();

//connect DB
initializedDb(db => {

  //internal middleware
  router.use(middleware({config, db}));
  //api routes
  
  router.use('/store', store({config, db}));
  router.use('/user', user({config,db}));
  router.use('/account', account({config, db}));
  router.use('/promo', promo({config, db}));
  router.use('/card', card({config, db}));
});

export default router;
