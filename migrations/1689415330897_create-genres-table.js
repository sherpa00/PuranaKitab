/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('genres', {
    genre_id: 'id',
    genre_name: {
      type: 'varchar(250)',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('genres')
}
