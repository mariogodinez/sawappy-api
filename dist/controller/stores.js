'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _store = require('../model/store');

var _store2 = _interopRequireDefault(_store);

var _promo = require('../model/promo');

var _promo2 = _interopRequireDefault(_promo);

var _storeReview = require('../model/storeReview');

var _storeReview2 = _interopRequireDefault(_storeReview);

var _user = require('../model/user');

var _user2 = _interopRequireDefault(_user);

var _authMiddleware = require('../middleware/authMiddleware');

var _conektaManager = require('../middleware/conektaManager');

var _conektaManager2 = _interopRequireDefault(_conektaManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodemailer = require('nodemailer');

exports.default = function (_ref) {
  var config = _ref.config,
      db = _ref.db;

  var api = (0, _express.Router)();

  //v1/store/add
  api.post('/add', _authMiddleware.authenticate, function (req, res) {
    var newStore = (0, _store2.default)();
    newStore.name = req.body.name;
    newStore.address = req.body.address;
    newStore.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
    newStore.geometry.coordinates.long = req.body.geometry.coordinates.long;
    newStore.userType = req.body.userType;
    newStore.storePhoneNumber = req.body.storePhoneNumber;
    newStore.about = req.body.about;
    newStore.comments = req.body.comments;
    newStore.status = req.body.status;

    newStore.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Store added!!!' });
    });
  });

  //GET 'v1/store'
  api.get('/', function (req, res) {
    res.send({ mesage: 'hola' });
    _store2.default.find({}, function (err, stores) {
      if (err) {
        res.send(err);
      }
      //Test to create client, delete this before right implementation.
      //let dataObj = '{"name":"David","email":"david.sahagun@outlook.com","phone":"3332008159","token":"tok_2hDz5msKwrNgbG55M","phone2":"3332008159","receiver":"Celia Mayorga","streets":"esq con Librado M. Diaz","address":"San Isidro #49","address2":"##","city":"Ocotlan","state":"JAL","zip":"47900"}';
      //cnkt.cnktExecute('clienteNuevo',dataObj);
      //let dataObj = '{"customerID":"cus_2hY9X4hvQmEtnC2VX","product":"testPurchase","price":"30000","quantity":"1","cardToken":"tok_2hYAwiqYQ8aGDNyU4"}'
      //cnkt.cnktExecute('processPayment',dataObj);
      //let dataObj = '{"customerCnktID":"cus_2hY9X4hvQmEtnC2VX","cardToken":"tok_2hYAwiqYQ8aGDNyU4"}';
      //cnkt.cnktExecute('addCardToClient',dataObj);
      res.json({ stores: stores });
    });
  });

  //GET by id 'v1/store/:id'
  api.get('/:id', _authMiddleware.authenticate, function (req, res) {
    _store2.default.findById(req.params.id, function (err, store) {
      if (err) {
        res.send(err);
      }
      res.json({ store: store });
    });
  });

  //UPDATE 'v1/store/'
  api.put('/:id', _authMiddleware.authenticate, function (req, res) {
    _store2.default.findById(req.params.id, function (err, store) {
      if (err) {
        res.send(err);
      }
      store.name = req.body.name;
      store.address = req.body.address;
      store.geometry.coordinates.lat = req.body.geometry.coordinates.lat;
      store.geometry.coordinates.long = req.body.geometry.coordinates.long;
      store.status = req.body.status;
      store.save(function (err) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Store info updated" });
      });
    });
  });

  //DELETE 'v1/store/:id'
  api.delete('/:id', _authMiddleware.authenticate, function (req, res) {
    _store2.default.findById(req.params.id, function (err, store) {
      if (err) {
        res.json({ message: "NO DELETED BAD ID" });
        return;
      }
      if (store === null) {
        res.json({ message: "STORE NOT FOUND" });
        return;
      }
      _store2.default.remove({
        _id: req.params.id
      }, function (err, store) {
        if (err) {
          res.send(err);
        }
        res.json({ message: "Store removed" });
      });
    });
  });

  //add a promo to an specific store id 'v1/store/promo/add/:id'
  api.post('/promo/add/:id', _authMiddleware.authenticate, function (req, res) {
    _store2.default.findById(req.params.id, function (err, store) {
      if (err) {
        res.send(err);
      }
      var myDate = new Date();
      var newPromo = new _promo2.default();
      newPromo.title = req.body.title;
      newPromo.description = req.body.description;
      newPromo.startDate = req.body.startDate; //Date();
      newPromo.endDate = req.body.endDate; //myDate.setDate(myDate.getDate()+30);    
      newPromo.price = req.body.price;
      newPromo.restriction = req.body.restriction;
      newPromo.category = req.body.category;
      newPromo.images = req.body.images;
      newPromo.store = store._id;

      newPromo.save(function (err, promo) {
        if (err) {
          res.send(err);
        }
        store.promos.push(newPromo);
        store.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Promo added to the store' });
        });
      });
    });
  });

  //get promos for an specific store id
  // 'v1/store/promos/:id'
  api.get('/promos/:id', _authMiddleware.authenticate, function (req, res) {
    _promo2.default.find({ store: req.params.id }, function (err, promos) {
      if (err) {
        res.send(err);
      }
      res.json(promos);
    });
  });

  //update a promo 'v1/store/promos/:id'
  api.put('/promos/:id', _authMiddleware.authenticate, function (req, res) {
    _promo2.default.find({ promos: req.params.id }, function (err, promos) {
      if (err) {
        res.send(err);
      }
      promos.title = req.body.title;
      promos.text = req.body.text;
      promos.price = req.body.price;
    });
  });

  //add a review to an specific store 'v1/store/add/review/:id'
  api.post('/add/review/:id', _authMiddleware.authenticate, function (req, res) {
    _store2.default.findById(req.params.id, function (err, store) {
      if (err) {
        res.send(err);
      }
      _user2.default.findById(req.body.userID, function (err, user) {
        if (err) {
          res.send(err);
        }
        var newReview = (0, _storeReview2.default)();
        newReview.review = req.body.review;
        newReview.users = user._id;
        newReview.save(function (err) {
          if (err) {
            res.send(err);
          }
          store.reviews.push(newReview._id);
          user.reviews.push(newReview._id);
          store.save(function (err) {
            if (err) {
              res.send(err);
            }
            user.save(function (err) {
              if (err) {
                res.send(err);
              }
            });
          });
          res.json({ message: 'Review added to an store' });
        });
      });
    });
  });
  // v1/store/review/:id
  api.get('/review/:id', _authMiddleware.authenticate, function (req, res) {
    var insideItem;
    var reviewsArray = [];
    var storeReviews = [];
    var counter = 0;
    _store2.default.findById(req.params.id, function (err, store) {
      if (err) {
        res.send(err);
      }
      reviewsArray = store.reviews;
      function callback() {
        res.json({ storeReviews: storeReviews });
      }
      reviewsArray.forEach(function (element) {
        _storeReview2.default.findById(element, function (err, review) {
          if (err) {
            res.send(err);
          }
          insideItem = review.review + "*" + review.users;
          storeReviews.push(insideItem);
          counter = counter + 1;
          if (counter === reviewsArray.length) {
            callback();
          }
        });
      });
    });
  });

  return api;
};
//# sourceMappingURL=stores.js.map