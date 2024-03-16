const createError = require('http-errors');
const {OAuth2Client} = require('google-auth-library');
// eslint-disable-next-line max-len
const client = new OAuth2Client('867050742854-r7flcg41b730dv3anknua88abascchl6.apps.googleusercontent.com');
const User = require('../models/User.js');

async function login(req, res, next){
  if (!req.body.token) {
    next(createError(401, 'no token'));
  }
  const {token} = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: '867050742854-r7flcg41b730dv3anknua88abascchl6.apps.googleusercontent.com'
  });
  if (!ticket) {
    next(createError(401, 'invalid token'));
  }
  const { name, email, picture } = ticket.getPayload();
  
  let user = await User.findOne({$or: [{ username: email }, { email: email }]});
  if(!user){
    user = new User({
      username: email, email: email, profileImageURI: picture, name: name
    });
    user = await user.save();
  }
  req.session.regenerate(function(err) {
    if (err) {
      next(createError(500));
    }
    req.session.user = user;
    res.json({user: user});
  });
}

function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      next(createError(500));
    }
    res.clearCookie('id');
    res.sendStatus(200);
  });
}

function session(req, res){
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(404).json({ message: 'Session not found' });
  }
}

function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    next(createError(401, 'Unauthorized'));
  }
  next();
}


module.exports = {isAuthenticated, login, logout, session};
