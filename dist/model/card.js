'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var cardSchema = new Schema({
  cardLastFour: {
    type: Number,
    required: true
  },
  cardToken: {
    type: String,
    required: true
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardStatus: {
    type: Number,
    required: true
  }
});
module.exports = _mongoose2.default.model('Card', cardSchema);
//# sourceMappingURL=card.js.map