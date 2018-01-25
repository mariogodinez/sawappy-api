'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _promo = require('./promo');

var _promo2 = _interopRequireDefault(_promo);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var offerCommentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  promos: [{ type: Schema.Types.ObjectId, ref: 'Promo' }]
});

module.exports = _mongoose2.default.model('OfferComent', offerCommentSchema);
//# sourceMappingURL=offerComment.js.map