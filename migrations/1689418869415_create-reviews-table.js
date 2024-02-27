/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('reviews', {
    reviewid: 'id',
    userid: { type: 'integer' },
    bookid: { type: 'integer' },
    username: { type: 'varchar(250)', notNull: true },
    stars: { type: 'integer', notNull: true },
    message: { type: 'text' }
  })

  pgm.addConstraint('reviews', 'fk_review_bookid', {
    foreignKeys: {
      columns: 'bookid',
      references: 'books(bookid)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  })

  pgm.addConstraint('reviews', 'fk_review_userid', {
    foreignKeys: {
      columns: 'userid',
      references: 'users(userid)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  })

  pgm.addConstraint('reviews', 'reviews_stars_check', {
    check: 'stars >= 1 AND stars <= 5'
  })
}

exports.down = pgm => {
  pgm.dropConstraint('reviews', 'fk_review_bookid')
  pgm.dropConstraint('reviews', 'fk_review_userid')
  pgm.dropConstraint('reviews', 'reviews_stars_check')
  pgm.dropTable('reviews')
}
