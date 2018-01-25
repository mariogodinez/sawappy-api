import mongoose from 'mongoose';
import User from './user';
import Store from './store';
const Schema = mongoose.Schema;
import passportLocalMongoose from 'passport-local-mongoose';

let Account = new Schema({
  email: String,
  password: String,
  userType: String,
  users: [{type: Schema.Types.ObjectId, ref: 'User'}],
  stores: [{type: Schema.Types.ObjectId, ref: 'Store'}]
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account',Account);
