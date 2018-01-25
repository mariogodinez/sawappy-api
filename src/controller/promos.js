import mongoose from 'mongoose';
import { Router } from 'express';
import Promo from '../model/promo';
import OfferComment from '../model/offerComment';
import User from '../model/user';
import Comment from '../model/offerComment';
import {authenticate} from '../middleware/authMiddleware';

export default({config,db})=>{
  let api = Router();

  //GET 'v1/promo'
    api.get('/', (req, res)=>{
      Promo.find({}, (err, promos)=>{
        if(err){
          res.send(err);
        }
        res.json({promos});
      });
    });

    //GET by id 'v1/promo/:id'
    api.get('/:id', authenticate, (req, res)=>{
      Promo.findById(req.params.id, (err, promo)=>{
        if(err){
          res.send(err);
        }
        res.json({promo});
      });
    });

    //UPDATE 'v1/promo/:id'
    api.put('/:id', authenticate, (req, res)=>{
      Promo.findById(req.params.id, (err, promo)=>{
        if(err){
          res.send(err);
        }
        promo.title = req.body.title;
        promo.text = req.body.text;
        promo.status = req.body.status;
        promo.startDate = req.body.startDate;
        promo.endDate = req.body.endDate;
        promo.price = req.body.price;
        
        promo.save(function (err){
          if(err){
            res.send(err);
          }
          res.json({message:"Promo info updated"});
        });
      });
    });
    //Add a comment for a promo 'v1/promo/add/comment/:id'
    api.post('/add/comment/:id', authenticate, (req, res)=>{
      var userID = "";
      Promo.findById(req.params.id, (err, promo)=>{
        if(err){
          res.send(err);
        }
        User.findById(req.body.userID, (err, user)=>{
          if(err){
            res.json({message:'No user found'})
          }
          userID = user._id;
        
        let newComment = OfferComment();
        newComment.comment = req.body.comment;
        newComment.users.push(userID);
        newComment.promos.push(req.params.id);
        newComment.save(err =>{
          if(err){
            res.send(err);
          }
          user.comments.push(newComment);
          user.save(err=>{
            if(err){
              res.send(err);
            }
            promo.comments.push(newComment._id);
            promo.save(err=>{
              if(err){
                res.send(err);
              }
            });
            res.json({message:'Comment added to a promo'});
          });
        });
      });
      });
    });

    //get an specific promo review 'v1/promo/comment/:id'
    api.get('/comment/:id', authenticate, (req, res)=>{
      var insideItem;
      var commentsArray = [];
      var promoComments = [];
      var counter = 0;
      Promo.findById(req.params.id, (err, promo)=>{
        if(err){
          res.send(err);
        }     
        commentsArray = promo.comments;
        function callback () {
        res.json({promoComments});
      }
          commentsArray.forEach(element => {
            Comment.findById(element, (err, comment)=>{
              if(err){
                res.send(err);
              }
              insideItem = comment.comment+"*"+comment.users;              
              promoComments.push(insideItem);
              console.log(promoComments); 
              counter = counter +1;
              if(counter === commentsArray.length) {
                callback();
              }

            });
          });
      });
    });

    return api;
}
