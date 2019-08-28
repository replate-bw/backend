
exports.up = function(knex) {
  return knex.schema.table('appointments', tbl => {
    knex.schema.hasColumn('appointments', 'business_id').then(itdoes => {
      if(!itdoes) {
        tbl.integer('business_id');
      }
    })
    knex.schema.hasColumn('appointments', 'volunteer_id').then(itdoes => {
      if(!itdoes) {
        tbl.integer('volunteer_id');
      }
    })
    
    
  }).dropTableIfExists('user_appointments');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_appointments').createTable('user_appointments', tbl => {
    tbl.increments();
    tbl.string("time").notNullable();
    tbl.string("quantity").notNullable();
    tbl.string("type");
    tbl.string("status").notNullable();
  }).table('appointments', tbl => {
    knex.schema.hasColumn('appointments', 'business_id').then(itdoes => {
      if(itdoes) {
        tbl.dropColumn('business_id');
      }
    })
    knex.schema.hasColumn('appointments', 'volunteer_id').then(itdoes => {
      if(itdoes) {
        tbl.dropColumn('volunteer_id');
      }
    })
  })
};
