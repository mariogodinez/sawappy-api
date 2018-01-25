'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _offerComment = require('./offerComment');

var _offerComment2 = _interopRequireDefault(_offerComment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var promoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  startDate: Date,
  endDate: Date,
  price: {
    type: Number,
    required: true
  },
  restriction: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  images: {
    type: [String],
    required: false
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = _mongoose2.default.model('Promo', promoSchema);
//# sourceMappingURL=promo.js.map