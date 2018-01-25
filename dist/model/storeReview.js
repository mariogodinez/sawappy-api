'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var storeReview = new Schema({
    review: {
        type: String,
        required: true
    },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = _mongoose2.default.model('StoreReview', storeReview);
//# sourceMappingURL=storeReview.js.map