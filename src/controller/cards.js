import mongoose from 'mongoose';
import {Router} from 'express';
import {authenticate} from '../middleware/authMiddleware';
import Card from '../model/card';

export default({config,db}) => {
    let api = Router();

    //v1/card/:id
    api.put('/:id', authenticate, (req,res)=>{
        Card.findById(req.params.id, (err, card)=>{
            if(err){
                res.send(err);
            }
            card.cardToken = req.body.token;
            card.status = 0;
        });        
    });

    return api;
}