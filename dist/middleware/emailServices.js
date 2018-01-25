'use strict';

//import nodemailer from 'nodemailer';
var nodemailer = require('nodemailer');
var welcomeMail = '<h2>Bienvenido! 🎊</h2><p>Gracias por elegir Sawappy© {nombre} {email}!!</p><p>Ahora conoceras una nueva forma de ver ofertas y promociones cerca de ti</p><p>Es momento de abrir la app para que puedas comenzar a sawppear ofertas!</p><img src="https://s.aolcdn.com/hss/storage/midas/d08e426575725273f7e6976b898542bd/204459763/appstores-640.jpg" height="100" width="125"></img>';
var sendQR = '';

exports.sendWelcomeEmail = function (name, email) {
  welcomeMail = welcomeMail.replace("{nombre}", name);
  welcomeMail = welcomeMail.replace("{email}", email);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sawappy.mail@gmail.com',
      pass: 'awesome@'
    }
  });

  var mailOptions = {
    from: 'sawappy.mail@gmail.com',
    to: email,
    subject: 'SAWAPPY TE DE LA BIENVENIDA',
    html: welcomeMail
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Aqui valio madre - 😓');
    } else {
      console.log('😎 enviado sin pedos');
    }
  });
};
//# sourceMappingURL=emailServices.js.map