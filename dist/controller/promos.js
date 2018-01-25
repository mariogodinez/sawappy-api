'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _promo = require('../model/promo');

var _promo2 = _interopRequireDefault(_promo);

var _offerComment = require('../model/offerComment');

var _offerComment2 = _interopRequireDefault(_offerComment);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _authMiddleware = require('../middleware/authMiddleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  //GET 'v1/promo'
  api.get('/', function (req, res) {
    _promo2.default.find({}, function (err, promos) {
      if (err) {
        res.send(err);
      }
      res.json({ promos: promos });
    });
  });

  //GET by id 'v1/promo/:id'
  api.get('/:id', _authMiddleware.authenticate, function (req, res) {
    _promo2.default.findById(req.params.id, function (err, promo) {
      if (err) {
        res.send(err);
      }
      res.json({ promo: promo });
    });
  });

  //UPDATE 'v1/promo/:id'
  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _promo2.default.findById(req.params.id, function (err, promo) {
      if (err) {
        res.send(err);
      }
      promo.title = req.body.title;
      promo.text = req.body.text;
      promo.status = req.body.status;
      promo.startDate = req.body.startDate;
      promo.endDate = req.body.endDate;
      promo.price = req.body.price;

      promo.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Promo info updated" });
      });
    });
  });
  //Add a comment for a promo 'v1/promo/add/comment/:id'
  api.post('/add/comment/:id', _authMiddleware.authenticate, function (req, res) {
    var userID = "";
    _promo2.default.findById(req.params.id, function (err, promo) {
      if (err) {
        res.send(err);
      }
      _user2.default.findById(req.body.userID, function (err, user) {
        if (err) {
          res.json({ message: 'No user found' });
        }
        userID = user._id;

        var newComment = (0, _offerComment2.default)();
        newComment.comment = req.body.comment;
        newComment.users.push(userID);
        newComment.promos.push(req.params.id);
        newComment.save(function (err) {
          if (err) {
            res.send(err);
          }
          user.comments.push(newComment);
          user.save(function (err) {
            if (err) {
              res.send(err);
            }
            promo.comments.push(newComment._id);
            promo.save(function (err) {
              if (err) {
                res.send(err);
              }
            });
            res.json({ message: 'Comment added to a promo' });
          });
        });
      });
    });
  });

  //get an specific promo review 'v1/promo/comment/:id'
  api.get('/comment/:id', _authMiddleware.authenticate, function (req, res) {
    var insideItem;
    var commentsArray = [];
    var promoComments = [];
    var counter = 0;
    _promo2.default.findById(req.params.id, function (err, promo) {
      if (err) {
        res.send(err);
      }
      commentsArray = promo.comments;
      function callback() {
        res.json({ promoComments: promoComments });
      }
      commentsArray.forEach(function (element) {
        _offerComment2.default.findById(element, function (err, comment) {
          if (err) {
            res.send(err);
          }
          insideItem = comment.comment + "*" + comment.users;
          promoComments.push(insideItem);
          console.log(promoComments);
          counter = counter + 1;
          if (counter === commentsArray.length) {
            callback();
          }
        });
      });
    });
  });

  return api;
};
//# sourceMappingURL=promos.js.map