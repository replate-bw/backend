const db = require('./dbConfig');

const findAll = () => {
  return db('appointments');
}

const insert = (appointment) => {
  return db('appointments').insert(appointment);
}

module.exports = {
  findAll,
  insert
}