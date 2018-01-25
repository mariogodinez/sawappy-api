import mongoose from 'mongoose';
import Promo from './promo';
import Store from './storeReview';
let Schema = mongoose.Schema;

let StoreSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  geometry:{
    type: {type: String, default: 'Point'},
    coordinates: {
      "lat": Number,
      "long": Number
    }
  },
  status:{
    type: Number,
    required: false
  },
  userType:{
    type: String,
    required: false
  },
  storePhoneNumber:{
    type:String,
    required: true
  },
  about:{
    type:String,
    required: false
  },
  comments:{
    type: String,
    required: false
  },
  promos: [{type: Schema.Types.ObjectId, ref: 'Promo'}],
  reviews: [{type: Schema.Types.ObjectId, ref: 'StoreReview'}]
})

module.exports = mongoose.model('Store', StoreSchema);
