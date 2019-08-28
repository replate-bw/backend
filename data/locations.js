const db = require('./dbConfig');

const find = () => {
  return db('locations');
}

const findById = id => {
  return db('locations').where('id', id);
}

const findByUser = id => {
  return db('locations').where('business_id', id);
}

const insert = newLocation => {
  return db('locations').insert(newLocation, 'id');
}

const deleteById = id => {
  return db('locations').where('id', id).delete();
}

module.exports = {
  find,
  findById,
  findByUser,
  deleteById,
  insert
}