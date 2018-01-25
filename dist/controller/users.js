'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _authMiddleware = require('../middleware/authMiddleware');

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

var _card = require('../model/card');

var _card2 = _interopRequireDefault(_card);

var _promo = require('../model/promo');

var _promo2 = _interopRequireDefault(_promo);

var _offerComment = require('../model/offerComment');

var _offerComment2 = _interopRequireDefault(_offerComment);

var _conektaManager = require('../middleware/conektaManager');

var _conektaManager2 = _interopRequireDefault(_conektaManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  //v1/user/add
  api.post('/add', _authMiddleware.authenticate, function (req, res) {
    var newUser = (0, _user2.default)();
    newUser.userName = req.body.userName;
    newUser.uEmail = req.body.uEmail;
    newUser.uPwd = req.body.uPwd;
    newUser.uAddress = req.body.uAddress;
    newUser.uPhoneNumber = req.body.uPhoneNumber;
    newUser.uProfilePic = req.body.uProfilePic;
    newUser.status = 0;
    newUser.userType = req.body.userType;

    newUser.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'User created successfully!' });
    });
  });

  //v1/user/ -> GET all users
  api.get('/', function (req, res) {
    _user2.default.find({}, function (err, users) {
      if (err) {
        res.send(err);
      }
      res.json({ users: users });
    });
  });

  //v1/user/:id -> GET user by id
  api.get('/:id', _authMiddleware.authenticate, function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      }
      res.json({ user: user });
    });
  });

  //v1/user/id
  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      }
      user.userName = req.body.userName;
      user.uEmail = req.body.uEmail;
      user.uPwd = req.body.uPwd;
      user.uAddress = req.body.uAddress;
      user.uPhoneNumber = req.body.uPhoneNumber;
      user.uProfilePic = req.body.uProfilePic;
      user.status = 0;
      user.userType = req.body.userType;
      user.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "User info updated" });
      });
    });
  });

  //add a card to an specific user id 'v1/user/card/add/:id'
  api.post('/card/add/:id', _authMiddleware.authenticate, function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      }

      var newCard = new _card2.default();
      newCard.cardLastFour = req.body.last4;
      newCard.cardToken = req.body.token;
      newCard.cardStatus = 1;
      newCard.userID = user.id;

      newCard.save(function (err, card) {
        if (err) {
          res.send(err);
        }
        user.cards.push(newCard);
        user.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Card added to the user' });
        });
      });
    });
  });

  //add a liked promo to an speceific user id 'v1/user/promo/add/:id'
  api.post('/promo/add/:id', function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      }
      var promoID = req.body.promoID;
      if (user.promos.indexOf(promoID) > -1) {
        res.json({ message: 'already liked by this user' });
      } else {
        user.promos.push(promoID);
        user.save(function (err) {
          if (err) {
            res.send(err);
          }
          console.log(user._id);
          res.json({ message: 'promo liked by user' });
        });
      }
    });
  });
  //promos liked by user id 'v1/user/promos/likedByUser/:id'
  api.get('/promos/likedByUser/:id', function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      }
      if (user != null) {
        res.json({ promos: user.promos });
      } else {
        res.json({ message: 'User not found' });
      }
    });
  });
  //Show user ID for a logged in user/account --- v1/user/account/id
  api.get('/account/:id', function (req, res) {
    console.log("entro aquí");
    _account2.default.findById(req.params.id, function (err, accnt) {
      if (err) {
        res.send(err);
        console.log(accnt);
      }
      if (accnt != null) {
        console.log(accnt);
        var accountUsersArray = accnt.users;
        var accountStoreArray = accnt.stores;
        if (accountUsersArray.length != 0) {
          res.json({ userID: accnt.users });
        } else if (accountStoreArray.length != 0) {
          res.json({ storeID: accnt.stores });
        } else {
          res.json({ message: "No user found" });
        }
      } else {
        res.json({ message: "No user found" });
      }
    });
  });
  //add a comment to a promo bu user ID 'v1/user/promo/add/comment:id'
  api.post('/promo/add/comment/:id', function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.send(err);
      }
      var newComment = new _offerComment2.default();
      newComment.comment = req.body.comment;

      newComment.save(function (err, res) {
        if (err) {
          res.send(err);
        }
        user.comments.push(newComment);
        user.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Comment added to the offer' });
        });
      });
    });
  });

  //Create conekta user
  api.post('/createConektaUser/:id', _authMiddleware.authenticate, function (req, res) {
    _user2.default.findById(req.params.id, function (err, user) {
      if (err) {
        res.json({ message: 'No user found' });
      }
      var userJSON = {
        name: req.body.userName,
        email: req.body.userEmail,
        phone: req.body.userPhone,
        token: req.body.cardToken,
        phone2: req.body.userPhone,
        receiver: 'NA',
        address: req.body.userAddress,
        address2: 'NA',
        city: 'NA',
        state: 'NA',
        zip: req.body.zip
      };
      console.log(user.cards[0]);
      res.json(user);
      //cnkt.cnktExecute('clienteNuevo',userJSON);
    });
  });

  return api;
};
//# sourceMappingURL=users.js.map