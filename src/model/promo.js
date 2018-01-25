import mongoose from 'mongoose';
import Store from './store';
import User from './user';
import Comment from './offerComment';
let Schema = mongoose.Schema;

let promoSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  description: String,
  store:{
    type:Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  startDate:Date,
  endDate:Date,
  price: {
    type: Number,
    required: true
  },
  restriction:{
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  images:{
    type: [String],
    required: false
  },
  comments:[{type: Schema.Types.ObjectId, ref:'Comment'}]
});

module.exports = mongoose.model('Promo', promoSchema);
