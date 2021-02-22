const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('./auth-model')

router.post('/register', async (req, res) => {
  const credentials = req.body
  if(credentials) {
    const rounds = process.env.ROUNDS || 12;
    const hash = bcrypt.hashSync(credentials.password, rounds)
    credentials.password = hash;
    Users.add(credentials)
      .then(user => {
        res.status(201).json({
          data: user
        })
      })
      .catch(error => {
        res.json(500).json({
          message: error.message
        })
      })

  } else {
    res.status(400).json({
      message: "please provide a username and password that meets our guidelines"
    })
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if({ username, password }) {
    Users.findBy({ username: username })
    .then(([user]) => {
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = createToken(user)
            res.status(200).json({
                message: 'You have successfully logged in', token //sends the token back in the response
            })
        } else {
            res.status(401).json({
                message: 'Invalid Credentials'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: error.message
        })
    })
  } else {
      res.status(400).json({
          message: ' please provide an exisiting username and password combination'
      })
  }
});

function createToken(user) {
  const payload = {
      subject: user.id,
      username: user.username,
  }
  const options = {
      expiresIn: '60 seconds'
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
