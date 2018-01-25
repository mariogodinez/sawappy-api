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

var _authMiddleware = require('../middleware/authMiddleware');

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

    newStore.save(function (err) {
      if (err) {
        res.send(err);
      }
      res.json({ message: 'Store added!!!' });
    });
  });

  //GET 'v1/store'
  api.get('/', function (req, res) {
    _store2.default.find({}, function (err, stores) {
      if (err) {
        res.send(err);
      }
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
      newPromo.text = req.body.text;
      newPromo.active = req.body.active;
      newPromo.startDate = Date();
      newPromo.endDate = myDate.setDate(myDate.getDate() + 30);
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
    });
  });

  return api;
};
//# sourceMappingURL=stores.js.map