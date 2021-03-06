import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const TOKENTIME = 60*60*24*30; //30 DAYS
const SECRET = "S4W4PPY 1S TH3 B3ST";

let authenticate = expressJwt({secret: SECRET});

let generateAccessToken = (req, res, next) => {
  req.token = req.token || {};
  req.token  = jwt.sign({
    id: req.user.id,
  }, SECRET, {
    expiresIn: TOKENTIME
  });
  next();
}

let respond = (req, res) => {
  res.status(200).json({
    user: req.user.username,
    token: req.token,
    accountID: req.user.id,
    userType: req.user.userType
  });
}

module.exports = {
  authenticate,
  generateAccessToken,
  respond
}
