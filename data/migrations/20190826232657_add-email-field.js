
exports.up = function(knex) {
  return knex.schema.table('users', tbl => {
    tbl.string('email');
  })
};

exports.down = function(knex) {
  return knex.schema.table('users', tbl => {
    tbl.dropColumn('email');
  })
};
