'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _card = require('./card');

var _card2 = _interopRequireDefault(_card);

var _account = require('./account');

var _account2 = _interopRequireDefault(_account);

var _promo = require('./promo');

var _promo2 = _interopRequireDefault(_promo);

var _offerComment = require('./offerComment');

var _offerComment2 = _interopRequireDefault(_offerComment);

var _storeReview = require('./storeReview');

var _storeReview2 = _interopRequireDefault(_storeReview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var userSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  uEmail: {
    type: String,
    required: false
  },
  uPwd: {
    type: String,
    required: false
  },
  uAddress: {
    type: String,
    required: true
  },
  uPhoneNumber: {
    type: String,
    required: true
  },
  uProfilePic: {
    type: String,
    required: false
  },
  userType: {
    type: String,
    required: false
  },
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
  promos: [{ type: Schema.Types.ObjectId, ref: 'Promo' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'StoreReview' }],
  conektaUser: {
    type: String,
    required: false
  }
});
module.exports = _mongoose2.default.model('User', userSchema);
//# sourceMappingURL=user.js.map