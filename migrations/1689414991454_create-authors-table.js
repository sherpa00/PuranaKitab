/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('authors', {
    authorid: 'id',
    firstname: {
      type: 'varchar(250)',
      notNull: true
    },
    lastname: {
      type: 'varchar(250)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('authors')
}
