import mongoose from 'mongoose';
import {Router} from 'express';
import Account from '../model/account';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';
import User from '../model/user';
import Store from '../model/store';
var email = require('../middleware/emailServices');

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

//import {sendWelcomeEmail} from '../middleware/emailServices';

export default ({ config, db}) => {
  let api = Router();

  // 'v1/account'
  api.post('/register', (req,res)=> {
    Account.register(new Account({
      username: req.body.email,
      userType: req.body.userType
    }), req.body.password, function(err, account){
      if(err){
        res.send(err);
      }
      passport.authenticate(
        'local',{
          session: false
        })(req, res, () => {
          email.sendWelcomeEmail('Sawappy user',req.body.email);
          res.json({message:'Successfully account created'});
        });
    });
    //console.log('😓'+email.sendWelcomeEmail());
  });

  // 'v1/account/login'
  api.post('/login', passport.authenticate(
    'local',{
      session: false,
      scope: []
    }), generateAccessToken, respond);

  // 'v1/account/logout'
  api.get('/logout', authenticate, (req, res) => {
    req.logout();
    res.status(200).json({message: 'User logged out'});
  });

  api.get('/me', authenticate, (req,res)=>{
    res.status(200).json(req.user);
  });

  //add an store to an specific account id 'v1/account/store/add/:id
  api.post('/store/add/:id', authenticate, (req, res)=>{
    Account.findById(req.params.id, (err, accnt)=>{
      if(err){
        res.send(err);
      }

      let newStore = new Store();
      newStore.name = req.body.name;
      newStore.address = req.body.address;
      newStore.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      newStore.geometry.coordinates.long = req.body.geometry.coordinates.long;
      newStore.storePhoneNumber = req.body.storePhoneNumber;
      newStore.about = req.body.about;
      newStore.comments = req.body.comments;
      newStore.status = req.body.status;

      newStore.save((err,store)=>{
        if(err){
          res.send(err);
        }
        accnt.stores.push(newStore);
        accnt.save(err => {
          if(err){
            res.send(err);
          }
         res.json({message: 'Account linked to a store',storeID:newStore._id});
        });
      });
    });
  });

  //add a user to an specific account id 'v1/account/user/add/:id'
  api.post('/user/add/:id', authenticate,(req, res)=>{
    Account.findById(req.params.id, (err, accnt)=>{
      if(err){
        res.send(err);
      }
      console.log(accnt);
      let newUser = new User();
      newUser.userName = req.body.userName;
      newUser.uEmail = accnt.username;
      newUser.uPwd = req.body.uPwd;//tests
      newUser.uAddress = req.body.uAddress;
      newUser.uPhoneNumber = req.body.uPhoneNumber;
      newUser.uProfilePic = req.body.uProfilePic;
      newUser.userType = accnt.userType;
      newUser.accounts = accnt._id;

      newUser.save((err, user) =>{
        if(err){
          res.send(err);
        }
        accnt.users.push(newUser);
        accnt.save(err => {
          if(err){
            res.send(err);
          }
          //console.log(newUser);
         res.json({message: 'Account linked to an user',userID:newUser._id});
        });
      });
    });
  });
  return api;
}
