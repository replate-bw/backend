
exports.up = function(knex) {
  return knex.schema.createTable('locations', tbl => {
    tbl.increments();
    tbl.string('address').notNullable();
    tbl.integer('business_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users');
  }).dropTableIfExists('appointments')
  .createTable('appointments', tbl => {
    tbl.increments();
    tbl.string("time").notNullable();
    tbl.string("quantity").notNullable();
    tbl.string("type");
    tbl.string("status").notNullable();
    tbl.integer("business_id")
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    tbl.integer("volunteer_id")
      .unsigned()
      .references('id')
      .inTable('users');
    tbl.integer('location_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('locations');
  })
};

exports.down = function(knex) {
  return knex.schema.table('appointments', tbl => {
    tbl.dropColumn('location_id');
  }).dropTableIfExists('locations');
};
