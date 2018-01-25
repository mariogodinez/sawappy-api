'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var email = require('../middleware/emailServices');

//import {sendWelcomeEmail} from '../middleware/emailServices';

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  // 'v1/account'
  api.post('/register', function (req, res) {
    _account2.default.register(new _account2.default({
      username: req.body.email,
      userType: req.body.userType
    }), req.body.password, function (err, account) {
      if (err) {
        res.send(err);
      }
      _passport2.default.authenticate('local', {
        session: false
      })(req, res, function () {
        email.sendWelcomeEmail('Sawappy user', req.body.email);
        res.json({ message: 'Successfully account created' });
      });
    });
    //console.log('😓'+email.sendWelcomeEmail());
  });

  // 'v1/account/login'
  api.post('/login', _passport2.default.authenticate('local', {
    session: false,
    scope: []
  }), _authMiddleware.generateAccessToken, _authMiddleware.respond);

  // 'v1/account/logout'
  api.get('/logout', _authMiddleware.authenticate, function (req, res) {
    req.logout();
    res.status(200).json({ message: 'User logged out' });
  });

  api.get('/me', _authMiddleware.authenticate, function (req, res) {
    res.status(200).json(req.user);
  });

  //add an store to an specific account id 'v1/account/store/add/:id
  api.post('/store/add/:id', _authMiddleware.authenticate, function (req, res) {
    _account2.default.findById(req.params.id, function (err, accnt) {
      if (err) {
        res.send(err);
      }

      var newStore = new _store2.default();
      newStore.name = req.body.name;
      newStore.address = req.body.address;
      newStore.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      newStore.geometry.coordinates.long = req.body.geometry.coordinates.long;
      newStore.storePhoneNumber = req.body.storePhoneNumber;
      newStore.about = req.body.about;
      newStore.comments = req.body.comments;
      newStore.status = req.body.status;

      newStore.save(function (err, store) {
        if (err) {
          res.send(err);
        }
        accnt.stores.push(newStore);
        accnt.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Account linked to a store', storeID: newStore._id });
        });
      });
    });
  });

  //add a user to an specific account id 'v1/account/user/add/:id'
  api.post('/user/add/:id', _authMiddleware.authenticate, function (req, res) {
    _account2.default.findById(req.params.id, function (err, accnt) {
      if (err) {
        res.send(err);
      }
      console.log(accnt);
      var newUser = new _user2.default();
      newUser.userName = req.body.userName;
      newUser.uEmail = accnt.username;
      newUser.uPwd = req.body.uPwd; //tests
      newUser.uAddress = req.body.uAddress;
      newUser.uPhoneNumber = req.body.uPhoneNumber;
      newUser.uProfilePic = req.body.uProfilePic;
      newUser.userType = accnt.userType;
      newUser.accounts = accnt._id;

      newUser.save(function (err, user) {
        if (err) {
          res.send(err);
        }
        accnt.users.push(newUser);
        accnt.save(function (err) {
          if (err) {
            res.send(err);
          }
          //console.log(newUser);
          res.json({ message: 'Account linked to an user', userID: newUser._id });
        });
      });
    });
  });
  return api;
};
//# sourceMappingURL=account.js.map