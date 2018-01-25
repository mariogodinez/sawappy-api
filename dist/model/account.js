'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _passportLocalMongoose = require('passport-local-mongoose');

var _passportLocalMongoose2 = _interopRequireDefault(_passportLocalMongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;


var Account = new Schema({
  email: String,
  password: String,
  userType: String,
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }]
});

Account.plugin(_passportLocalMongoose2.default);
module.exports = _mongoose2.default.model('Account', Account);
//# sourceMappingURL=account.js.map