/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('carts', {
    cartid: 'id',
    bookid: {
      type: 'integer'
    },
    userid: {
      type: 'integer'
    },
    quantity: {
      type: 'integer',
      notNull: true
    },
    original_price: {
      type: 'integer',
      notNull: true
    },
    total_price: {
      type: 'integer',
      notNull: true
    }
  })

  pgm.createConstraint('carts', 'fk_cart_bookid', {
    foreignKeys: {
      columns: 'bookid',
      references: 'books(bookid)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  })

  pgm.createConstraint('carts', 'fk_cart_userid', {
    foreignKeys: {
      columns: 'userid',
      references: 'users(userid)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint('carts', 'fk_cart_bookid')
  pgm.dropConstraint('carts', 'fk_cart_userid')
  pgm.dropTable('carts')
}
