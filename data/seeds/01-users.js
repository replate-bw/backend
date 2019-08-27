const bcrypt = require('bcrypt');

exports.seed = function(knex) {

  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries

      const password = bcrypt.hashSync('This is my very secret password', 12);

      return knex('users').insert([
        {name: "Mohammad Tourjoman", firstName: "Mohammad", lastName: "Tourjoman", phone: "(949) 449-6122", address: "7458 Maggie Ln", email: "mtourjoman0@gmail.com", accountType: "volunteer", password }
      ]);
    });
};
