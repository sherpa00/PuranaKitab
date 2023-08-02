/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('orders', {
    orderid: 'id',
    userid: {
      type: 'integer'
    },
    phone_number: {
      type: 'bigint',
      notNull: true
    },
    ordered_books: {
      type: 'json[]',
      notNull: true
    },
    total_amount: {
      type: 'integer',
      notNull: true
    },
    payment_intent_id: {
      type: 'text',
      notNull: false
    },
    payment_status: {
      type: 'text'
    },
    payment_method: {
      type: 'text',
      notNull: true
    }
  })

  pgm.createConstraint('orders', 'fk_userid', {
    foreignKeys: {
      columns: 'userid',
      references: 'users(userid)',
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION'
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint('orders', 'fk_userid')
  pgm.dropTable('orders')
}
