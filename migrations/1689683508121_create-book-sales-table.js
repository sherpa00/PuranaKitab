/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('book_sales', {
    book_sale_id: 'id',
    bookid: {
      type: 'integer'
    },
    sales_count: {
      type: 'integer',
      notNull: true
    }
  })

  pgm.createConstraint('book_sales', 'fk_bookid', {
    foreignKeys: {
      columns: 'bookid',
      references: 'books(bookid)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = pgm => {
  pgm.droptConstraint('books_sales', 'fk_bookid')
  pgm.dropTable('book_sales')
}
