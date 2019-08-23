const dotenv = require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

const port = process.env.PORT;

server.use(helmet());
server.use(cors());
server.use(express.json());

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
