'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _promo = require('./promo');

var _promo2 = _interopRequireDefault(_promo);

var _storeReview = require('./storeReview');

var _storeReview2 = _interopRequireDefault(_storeReview);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var StoreSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  geometry: {
    type: { type: String, default: 'Point' },
    coordinates: {
      "lat": Number,
      "long": Number
    }
  },
  status: {
    type: Number,
    required: false
  },
  userType: {
    type: String,
    required: false
  },
  storePhoneNumber: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: false
  },
  comments: {
    type: String,
    required: false
  },
  promos: [{ type: Schema.Types.ObjectId, ref: 'Promo' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'StoreReview' }]
});

module.exports = _mongoose2.default.model('Store', StoreSchema);
//# sourceMappingURL=store.js.map