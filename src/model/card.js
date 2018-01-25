import mongoose from 'mongoose';
import User from './user';
let Schema = mongoose.Schema;

let cardSchema = new Schema({
  cardLastFour:{
    type: Number,
    required: true
  },
  cardToken:{
    type: String,
    required: true
  },
  userID:{
    type:Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardStatus:{
    type: Number,
    required: true
  }
})
module.exports = mongoose.model('Card', cardSchema);
