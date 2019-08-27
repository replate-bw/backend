const dotenv = require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const auth = require('./auth');
const appts = require('./appointments');

const userDb = require('./data/users');

const server = express();

const port = process.env.PORT;

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use('/auth', auth);
server.use('/appointments', appts);

server.get('/users', (req, res) => {
  userDb.find()
  .then(users => {
    return res.status(200).json(users);
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({message: "Unable to retrieve users due to an internal error"});
  })
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
