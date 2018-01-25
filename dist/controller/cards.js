'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = require('express');

var _authMiddleware = require('../middleware/authMiddleware');

var _card = require('../model/card');

var _card2 = _interopRequireDefault(_card);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
    var config = _ref.config,
        db = _ref.db;

    var api = (0, _express.Router)();

    //v1/card/:id
    api.put('/:id', _authMiddleware.authenticate, function (req, res) {
        _card2.default.findById(req.params.id, function (err, card) {
            if (err) {
                res.send(err);
            }
            card.cardToken = req.body.token;
            card.status = 0;
        });
    });

    return api;
};
//# sourceMappingURL=cards.js.map