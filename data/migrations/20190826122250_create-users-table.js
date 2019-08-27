
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string("name", 128)
      .notNullable();
    tbl.string("first_name", 128)
      .notNullable();
    tbl.string("last_name", 128)
      .notNullable();
    tbl.string("phone");
    tbl.string("address");
    tbl.string("account_type")
      .notNullable();
  }).createTable('appointments', tbl => {
    tbl.increments();
    tbl.string("time").notNullable();
    tbl.string("quantity").notNullable();
    tbl.string("type");
    tbl.string("status").notNullable();
  })
  .createTable('user_appointments', tbl => {
    tbl.increments();
    tbl.integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users');
    tbl.integer('appointment_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('appointments');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("appointments")
  .dropTableIfExists("users");
};