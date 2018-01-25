'use strict';

var _conekta = require('conekta');

var _conekta2 = _interopRequireDefault(_conekta);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//var conekta = require('conekta');

var cprvKey = _config2.default.conektaPrivateKey;
var cpubKey = _config2.default.conektaPublicKey;

//console.log(cKey);

function cnktExecute(methodName, data) {

  switch (methodName) {
    case 'clienteNuevo':
      createCNKTClient(data);
      console.log('neee');
      break;
    case 'actualizarCliente':
      updateCNKTClient(data);
      break;
    case 'processPayment':
      processPayment(data);
      break;
    case 'addCardToClient':
      addCardToExistingClient(data);
      break;
    default:
      console.log('puto');

  }
};

function addCardToExistingClient(data) {
  _conekta2.default.api_key = cpubKey;

  var newCardObject = JSON.parse(data);

  _conekta2.default.Customer.find(newCardObject.customerCnktID, function (err, customer) {
    customer.createPaymentSource({
      type: "card",
      token_id: newCardObject.cardToken
    }, function (err, res) {
      console.log(res);
    });
  });
};
function createCNKTClient(data) {
  _conekta2.default.api_key = cpubKey;
  var clientObject = data; //JSON.parse(data);

  _conekta2.default.Customer.create({
    name: clientObject.name,
    email: clientObject.email,
    phone: clientObject.phone,
    //plan_id: 'gold-plan',
    corporate: true,
    payment_sources: [{
      token_id: clientObject.token, //cardToken
      type: 'card'
    }],
    shipping_contacts: [{
      phone: clientObject.phone2,
      receiver: clientObject.name,
      between_streets: clientObject.streets,
      address: {
        street1: clientObject.address,
        street2: clientObject.address2,
        city: clientObject.city,
        state: clientObject.state,
        country: "MX",
        postal_code: clientObject.zip,
        residential: true
      }
    }]
  }, function (err, customer) {
    if (err) {
      console.log(err.object + ' mostly the token has been used before');
    } else {
      console.log(customer._json.id + ' ' + customer._json.email);
    }
  });

  console.log(clientObject.name);
};

function updateCNKTClient(data) {
  _conekta2.default.api_key = cpubKey;
  var clientObject = JSON.parse(data);
  _conekta2.default.Customer.find('custToken', function (err, customer) {
    customer.update({
      name: clientObject.name,
      email: clientObject.email,
      payment_sources: {
        token_id: clientObject.token,
        type: "card"
      }
    }, function (err, res) {
      console.log(res);
    });
  });
};

function processPayment(data) {
  var _conekta$Order$create;

  _conekta2.default.api_key = cpubKey;
  var paymentObject = JSON.parse(data);

  _conekta2.default.Order.create((_conekta$Order$create = {
    "currency": "MXN",
    "customer_info": {
      "customer_id": paymentObject.customerID
    },
    "shipping_contact": {
      "address": {
        "street1": "Calle 123, int 2",
        "postal_code": "06100",
        "country": "MX"
      }
    },
    "line_items": [{
      "name": paymentObject.product,
      "unitPrice": paymentObject.price,
      "quantity": paymentObject.quantity
    }]
  }, _defineProperty(_conekta$Order$create, 'line_items', [{
    "name": "Tacos",
    "unit_price": 1000,
    "quantity": 12
  }]), _defineProperty(_conekta$Order$create, "shipping_lines", [{
    "amount": 1500,
    "carrier": "FEDEX"
  }]), _defineProperty(_conekta$Order$create, "charges", [{
    "payment_method": {
      "type": "card",
      "payment_source_id": paymentObject.cardToken
    }
  }]), _conekta$Order$create), function (err, order) {
    console.log(order);
    if (err) {
      console.log(err);
    }
  });
};

module.exports = {
  cnktExecute: cnktExecute
};
//# sourceMappingURL=conektaManager.js.map