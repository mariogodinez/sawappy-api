import mongoose from 'mongoose';
import { Router } from 'express';
import User from '../model/user';
import {authenticate} from '../middleware/authMiddleware';
import Account from '../model/account';
import Card from '../model/card';
import Promo from '../model/promo';
import Comment from '../model/offerComment';
import cnkt from '../middleware/conektaManager';

export default({config,db})=>{
  let api = Router();

  //v1/user/add
  api.post('/add', authenticate,(req, res)=>{
      let newUser = User();
      newUser.userName = req.body.userName;
      newUser.uEmail = req.body.uEmail;
      newUser.uPwd = req.body.uPwd;
      newUser.uAddress = req.body.uAddress;
      newUser.uPhoneNumber = req.body.uPhoneNumber;
      newUser.uProfilePic = req.body.uProfilePic;
      newUser.status = 0;
      newUser.userType = req.body.userType;

      newUser.save(err => {
        if(err){
          res.send(err);
        }
        res.json({message: 'User created successfully!'});
      });
    });


  //v1/user/ -> GET all users
  api.get('/', (req, res)=>{
    User.find({}, (err, users)=>{
      if(err){
        res.send(err);
      }
      res.json({users});
    });
  });

  //v1/user/:id -> GET user by id
  api.get('/:id', authenticate, (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
      if(err){
        res.send(err);
      }
      res.json({user});
    });
  });

  //v1/user/id
  api.put('/:id', authenticate, (req, res)=>{
    User.findById(req.params.id, (err, user)=>{
      if(err){
        res.send(err);
      }
      user.userName = req.body.userName;
      user.uEmail = req.body.uEmail;
      user.uPwd = req.body.uPwd;
      user.uAddress = req.body.uAddress;
      user.uPhoneNumber = req.body.uPhoneNumber;
      user.uProfilePic = req.body.uProfilePic;
      user.status = 0;
      user.userType = req.body.userType;
      user.save(function (err){
        if(err){
          res.send(err);
        }
        res.json({message:"User info updated"});
      });
    });
  });

//add a card to an specific user id 'v1/user/card/add/:id'
api.post('/card/add/:id', authenticate,(req, res)=>{
  User.findById(req.params.id, (err, user)=>{
    if(err){
      res.send(err);
    }

    let newCard = new Card();
    newCard.cardLastFour = req.body.last4;
    newCard.cardToken = req.body.token;
    newCard.cardStatus = 1;
    newCard.userID = user.id;

    newCard.save((err, card) =>{
      if(err){
        res.send(err);
      }
      user.cards.push(newCard);
      user.save(err => {
        if(err){
          res.send(err);
        }
        res.json({message: 'Card added to the user'});
      });
    });
  });
});

//add a liked promo to an speceific user id 'v1/user/promo/add/:id'
api.post('/promo/add/:id', (req, res)=>{
  User.findById(req.params.id, (err, user)=>{
    if(err){
      res.send(err);
    }
    let promoID = req.body.promoID;    
    if(user.promos.indexOf(promoID) > -1){
      res.json({message:'already liked by this user'});
    }else{
      user.promos.push(promoID);
      user.save(err => {
        if(err){
          res.send(err);
        }
        console.log(user._id);
        res.json({message:'promo liked by user'});
      });
    }
  });
});
//promos liked by user id 'v1/user/promos/likedByUser/:id'
api.get('/promos/likedByUser/:id', (req,res)=>{
  User.findById(req.params.id, (err, user)=>{
    if(err){
      res.send(err);
    }
    if(user != null){
      res.json({promos: user.promos});
    }else{
      res.json({message:'User not found'});
    }
  });
});
//Show user ID for a logged in user/account --- v1/user/account/id
api.get('/account/:id', (req,res)=>{
  console.log("entro aquí");
  Account.findById(req.params.id, (err,accnt)=>{
    if(err){
      res.send(err);
      console.log(accnt);
    }
    if(accnt != null){
      console.log(accnt);
      let accountUsersArray = accnt.users;
      let accountStoreArray = accnt.stores;
      if(accountUsersArray.length != 0){
        res.json({userID:accnt.users});
      }else if(accountStoreArray.length != 0){
        res.json({storeID:accnt.stores});
      }else{
        res.json({message:"No user found"})
      }
    }else{
      res.json({message:"No user found"})
    }
  });
});
//add a comment to a promo bu user ID 'v1/user/promo/add/comment:id'
api.post('/promo/add/comment/:id', (req, res)=>{
  User.findById(req.params.id, (err, user)=>{
    if(err){
      res.send(err);
    }
    let newComment = new Comment();
    newComment.comment = req.body.comment;

    newComment.save((err,res)=>{
      if(err){
        res.send(err)
      }
      user.comments.push(newComment);
      user.save(err => {
        if(err){
          res.send(err);
        }
        res.json({message: 'Comment added to the offer'});
      });
    });  
  });
});

//Create conekta user
api.post('/createConektaUser/:id', authenticate, (req,res)=>{
  User.findById(req.params.id, (err,user)=>{
    if(err){
      res.json({message:'No user found'});
    }
    let userJSON ={
      name:req.body.userName,
      email:req.body.userEmail,
      phone:req.body.userPhone,
      token:req.body.cardToken,
      phone2:req.body.userPhone,
      receiver:'NA',
      address:req.body.userAddress,
      address2:'NA',
      city:'NA',
      state:'NA',
      zip:req.body.zip
    }
    console.log(user.cards[0])
    res.json(user);
    //cnkt.cnktExecute('clienteNuevo',userJSON);
  });
});

  return api;
}
