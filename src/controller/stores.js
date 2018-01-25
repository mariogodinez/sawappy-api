import mongoose from 'mongoose';
import { Router } from 'express';
import Store from '../model/store';
import Promo from '../model/promo';
import StoreReview from '../model/storeReview';
import User from '../model/user';
import {authenticate} from '../middleware/authMiddleware';
var nodemailer = require('nodemailer');
import cnkt from '../middleware/conektaManager';

export default({config,db})=>{
  let api = Router();

  //v1/store/add
  api.post('/add', authenticate, (req, res)=>{
    let newStore = Store();
    newStore.name = req.body.name;
    newStore.address = req.body.address;
    newStore.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newStore.geometry.coordinates.long = req.body.geometry.coordinates.long;
    newStore.userType = req.body.userType;
    newStore.storePhoneNumber = req.body.storePhoneNumber;
    newStore.about = req.body.about;
    newStore.comments = req.body.comments;
    newStore.status = req.body.status;

    newStore.save(err => {
      if(err){
        res.send(err);
      }
      res.json({message: 'Store added!!!'});
    });
  });

//GET 'v1/store'
  api.get('/', (req, res)=>{
    res.send({mesage: 'hola'})
    Store.find({}, (err, stores)=>{
      if(err){
        res.send(err);
      }      
      //Test to create client, delete this before right implementation.
      //let dataObj = '{"name":"David","email":"david.sahagun@outlook.com","phone":"3332008159","token":"tok_2hDz5msKwrNgbG55M","phone2":"3332008159","receiver":"Celia Mayorga","streets":"esq con Librado M. Diaz","address":"San Isidro #49","address2":"##","city":"Ocotlan","state":"JAL","zip":"47900"}';
      //cnkt.cnktExecute('clienteNuevo',dataObj);
      //let dataObj = '{"customerID":"cus_2hY9X4hvQmEtnC2VX","product":"testPurchase","price":"30000","quantity":"1","cardToken":"tok_2hYAwiqYQ8aGDNyU4"}'
      //cnkt.cnktExecute('processPayment',dataObj);
      //let dataObj = '{"customerCnktID":"cus_2hY9X4hvQmEtnC2VX","cardToken":"tok_2hYAwiqYQ8aGDNyU4"}';
      //cnkt.cnktExecute('addCardToClient',dataObj);
      res.json({stores});
    });
  });

//GET by id 'v1/store/:id'
api.get('/:id', authenticate, (req, res)=>{
  Store.findById(req.params.id, (err, store)=>{
    if(err){
      res.send(err);
    }
    res.json({store});
  });
});

//UPDATE 'v1/store/'
api.put('/:id', authenticate, (req, res)=>{
  Store.findById(req.params.id, (err, store)=>{
    if(err){
      res.send(err);
    }
    store.name = req.body.name;
    store.address = req.body.address;
    store.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    store.geometry.coordinates.long = req.body.geometry.coordinates.long;
    store.status = req.body.status;
    store.save(function (err){
      if(err){
        res.send(err);
      }
      res.json({message:"Store info updated"});
    });
  });
});

//DELETE 'v1/store/:id'
api.delete('/:id', authenticate,(req, res) => {
  Store.findById(req.params.id, (err, store) => {
    if(err){
      res.json({message:"NO DELETED BAD ID"});
      return;
    }
    if (store === null){
      res.json({message:"STORE NOT FOUND"});
      return;
    }
    Store.remove({
      _id: req.params.id
    },(err, store) => {
      if(err){
        res.send(err);
      }
      res.json({message:"Store removed"});
    });
  });
});

//add a promo to an specific store id 'v1/store/promo/add/:id'
api.post('/promo/add/:id', authenticate, (req, res)=>{
  Store.findById(req.params.id, (err, store)=>{
    if(err){
      res.send(err);
    }
    var myDate = new Date();
    let newPromo = new Promo();
    newPromo.title = req.body.title;
    newPromo.description = req.body.description;    
    newPromo.startDate = req.body.startDate;//Date();
    newPromo.endDate = req.body.endDate;//myDate.setDate(myDate.getDate()+30);    
    newPromo.price = req.body.price;
    newPromo.restriction = req.body.restriction;
    newPromo.category = req.body.category;
    newPromo.images = req.body.images;
    newPromo.store = store._id;

    newPromo.save((err, promo) =>{
      if(err){
        res.send(err);
      }
      store.promos.push(newPromo);
      store.save(err => {
        if(err){
          res.send(err);
        }
        res.json({message: 'Promo added to the store'});
      });
    });
  });
});

//get promos for an specific store id
// 'v1/store/promos/:id'
api.get('/promos/:id', authenticate,(req, res) => {
  Promo.find({store: req.params.id}, (err, promos)=>{
    if(err){
      res.send(err);
    }
    res.json(promos);
  });
});

//update a promo 'v1/store/promos/:id'
api.put('/promos/:id', authenticate, (req, res)=>{
  Promo.find({promos: req.params.id}, (err, promos)=>{
    if(err){
      res.send(err);
    }
    promos.title = req.body.title;
    promos.text = req.body.text;
    promos.price = req.body.price;
  });
});

//add a review to an specific store 'v1/store/add/review/:id'
api.post('/add/review/:id', authenticate, (req, res)=>{
  Store.findById(req.params.id, (err,store)=>{
    if(err){
      res.send(err);
    }
    User.findById(req.body.userID, (err, user)=>{
      if(err){
        res.send(err);
      }
      let newReview = StoreReview();
      newReview.review = req.body.review;
      newReview.users = user._id;
      newReview.save(err=>{
        if(err){
          res.send(err);
        }
        store.reviews.push(newReview._id);
        user.reviews.push(newReview._id);
        store.save(err=>{
          if(err){
            res.send(err);
          }
          user.save(err=>{
            if(err){
              res.send(err);
            }
          });
        });
        res.json({message:'Review added to an store'});
      });
    });
  });
});
// v1/store/review/:id
api.get('/review/:id', authenticate, (req, res)=>{
  var insideItem;
  var reviewsArray = [];
  var storeReviews = [];
  var counter = 0;
  Store.findById(req.params.id, (err, store)=>{
    if(err){
      res.send(err);
    }         
    reviewsArray = store.reviews;    
    function callback () {
    res.json({storeReviews});
  }
      reviewsArray.forEach(element => {
        StoreReview.findById(element, (err, review)=>{
          if(err){
            res.send(err);
          }          
          insideItem = review.review+"*"+review.users;              
          storeReviews.push(insideItem);
          counter = counter +1;
          if(counter === reviewsArray.length) {
            callback();
          }

        });
      });
  });
});

  return api;
}
