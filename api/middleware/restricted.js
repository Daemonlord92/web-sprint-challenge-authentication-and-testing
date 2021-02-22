const jwt = require('jsonwebtoken')
const secrets = require('../config/secrets');

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if(!token) {
    res.status(401).json({
      message: 'you are not authorized to view this page'
      })
    }
    jwt.verify(token, secrets, (error, decodedToken) => {
      if(error) {
        res.status(401).json({
          message: 'token does not exist'
        })
      }
      console.log('decoded token ->', decodedToken)
      req.decodedJWT = decodedToken
      next()
    })
};
