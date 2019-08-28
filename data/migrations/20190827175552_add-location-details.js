
exports.up = function(knex) {
  return knex.schema.table('locations', table => {
    table.string('city')
    table.string('state')
    table.integer('zip');
  })
};

exports.down = function(knex) {
  return knex.schema.table('locations', table => {
    table.dropColumn('city');
    table.dropColumn('state');
    table.dropColumn('zip');
  })
};
