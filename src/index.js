import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

//OWN MODULES
import config from './config';
import routes from './routes';

let app = express();
app.server = http.createServer(app);

//middleware
//parse  app/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));
//passport config
app.use(passport.initialize());
let Account = require('./model/account');
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
Account.authenticate()
));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
//api routes v1
app.use('/v1', routes);

app.get('/', function(req,res){
	res.send('hello api')
})

app.server.listen(config.port);
console.log(`Started at port ${app.server.address().port}`);
console.log(Date());

export default app;
