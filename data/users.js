const db = require('./dbConfig');

const findByEmail = email => {
  return db('users').where('email', email);
}

const insert = user => {
  const name = user.name ? user.name : `${user.firstName} ${user.lastName}`;
  const data = {
    name,
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    address: user.address,
    email: user.email,
    account_type: user.accountType,
    password: user.password
  }

  return db('users').insert(data, 'id');
}

module.exports = {
  find,
  findByEmail,
  insert
}