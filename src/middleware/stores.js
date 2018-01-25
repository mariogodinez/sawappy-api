import mongoose from 'mongoose';
import { Router } from 'express';
import Store from '../model/store';
import Promo from '../model/promo';
import {authenticate} from '../middleware/authMiddleware';
var nodemailer = require('nodemailer');

export default({config,db})=>{
  let api = Router();

  //v1/store/add
  api.post('/add', authenticate, (req, res)=>{
    let newStore = Store();
    newStore.name = req.body.name;
    newStore.address = req.body.address;
    newStore.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newStore.geometry.coordinates.long = req.body.geometry.coordinates.long;

    newStore.save(err => {
      if(err){
        res.send(err);
      }
      res.json({message: 'Store added!!!'});
    });
  });

//GET 'v1/store'
  api.get('/', (req, res)=>{
    Store.find({}, (err, stores)=>{
      if(err){
        res.send(err);
      }
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
    newPromo.text = req.body.text;
    newPromo.active = req.body.active;
    newPromo.startDate = Date();
    newPromo.endDate = myDate.setDate(myDate.getDate()+30);
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
  });
});

  return api;
}
