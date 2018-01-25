import mongoose from 'mongoose';
import Store from './promo';
import User from './user';
let Schema = mongoose.Schema;

let offerCommentSchema = new Schema({
  comment:{
    type: String,
    required: true
  },
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
  promos:[{type: Schema.Types.ObjectId, ref:'Promo'}]
});

module.exports = mongoose.model('OfferComent', offerCommentSchema);
