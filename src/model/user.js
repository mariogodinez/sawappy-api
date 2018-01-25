import mongoose from 'mongoose';
import Card from './card';
import Account from './account';
import Promo from './promo';
import Comment from './offerComment';
import StoreReview from './storeReview';
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  uEmail:{
    type: String,
    required: false
  },
  uPwd:{
    type: String,
    required: false
  },
  uAddress:{
    type: String,
    required: true
  },
  uPhoneNumber:{
    type: String,
    required: true
  },
  uProfilePic:{
    type: String,
    required: false
  },
  userType:{
    type: String,
    required: false
  },
  cards: [{type: Schema.Types.ObjectId, ref: 'Card'}],
  accounts: [{type: Schema.Types.ObjectId, ref: 'Account'}],
  promos:[{type: Schema.Types.ObjectId, ref:'Promo'}],
  comments:[{type: Schema.Types.ObjectId, ref:'Comment'}],
  reviews:[{type: Schema.Types.ObjectId, ref:'StoreReview'}],
  conektaUser:{
    type: String,
    required: false
  }
})
module.exports = mongoose.model('User', userSchema);
