'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _middleware = require('../middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

var _stores = require('../controller/stores');

var _stores2 = _interopRequireDefault(_stores);

var _users = require('../controller/users');

var _users2 = _interopRequireDefault(_users);

var _account = require('../controller/account');

var _account2 = _interopRequireDefault(_account);

var _promos = require('../controller/promos');

var _promos2 = _interopRequireDefault(_promos);

var _cards = require('../controller/cards');

var _cards2 = _interopRequireDefault(_cards);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express2.default)();

//connect DB
(0, _db2.default)(function (db) {

  //internal middleware
  router.use((0, _middleware2.default)({ config: _config2.default, db: db }));
  //api routes
  router.use('/store', (0, _stores2.default)({ config: _config2.default, db: db }));
  router.use('/user', (0, _users2.default)({ config: _config2.default, db: db }));
  router.use('/account', (0, _account2.default)({ config: _config2.default, db: db }));
  router.use('/promo', (0, _promos2.default)({ config: _config2.default, db: db }));
  router.use('/card', (0, _cards2.default)({ config: _config2.default, db: db }));
});

exports.default = router;
//# sourceMappingURL=index.js.map