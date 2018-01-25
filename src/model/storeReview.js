import mongoose from  'mongoose';
import Store from './store';
import User from './user';
let Schema = mongoose.Schema;

let storeReview = new Schema({
    review:{
        type: String,
        required: true
    },
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('StoreReview', storeReview);