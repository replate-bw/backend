const db = require('./dbConfig');

const findAll = () => {
  return db('appointments');
}

const findById = id => {
  return db('appointments').where('id', id);
}

const findByBusiness = id => {
  return db('appointments').where('business_id', id);
}

const findByVolunteer = id => {
  return db('appointments').where('volunteer_id', id);
}

const update = (id, newAppointment) => {
  return db('appointments').where('id', id).update(newAppointment);
}

const insert = appointment => {
  return db('appointments').insert(appointment);
}

const deleteById = id => {
  return db('appointments').where('id', id).delete();
}

module.exports = {
  findAll,
  findById,
  findByBusiness,
  findByVolunteer,
  update,
  insert,
  deleteById
}