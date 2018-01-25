'use strict';

var FCM = require('fcm-node');
var serverKey = 'AAAALZTctko:APA91bHZz_O8Qfg4usjTs4OeUZVMswq1WNwkTRBQDS17C-r687yZdTDrXZwkh3SCqOtil5A1wfZC_vg10fkd6bosm8KY18ZUFookzviEYYQJCUAPL_LKImhlz8B65oX7JTPnMFFE_olJ';
var fcm = new FCM(serverKey);
//SAWAPPY - AAAALZTctko:APA91bHZz_O8Qfg4usjTs4OeUZVMswq1WNwkTRBQDS17C-r687yZdTDrXZwkh3SCqOtil5A1wfZC_vg10fkd6bosm8KY18ZUFookzviEYYQJCUAPL_LKImhlz8B65oX7JTPnMFFE_olJ
//SAWAPPY TEST- AAAAO9PFs9o:APA91bF-IJTBLfN47gWzkRi_xD6KPZ6Sb-7HB7oJtWjhTC6w18ZZafM6nulUlIxpgwn8pa4aC_g-4B7JsNXXWKqR6kZBB2l2ChDlHApcAcNjJqc6Bd8-CcB3IU1hojEqyZEbCB4GRKHd
function firebaseExect() {
  var message = {
    to: 'registration token here',
    collapse_key: 'callapse key',

    notification: {
      title: 'SAWAPPY',
      body: 'Nuevas ofertas agregadas!'
    },

    data: {
      my_key: 'my value',
      my_another_key: 'another value'
    }
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Aquí hay pedo FCM");
    } else {
      console.log("SENT!", response);
    }
  });

  var firebase = require('firebase-admin');
  var serviceAccount = require('./FirebaseModules/google-services.json');

  //Connection to firebase
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://Sawappy.firebaseio.com"
  });
}

module.exports = {
  firebaseExect: firebaseExect
};
//# sourceMappingURL=firebaseOps.js.map