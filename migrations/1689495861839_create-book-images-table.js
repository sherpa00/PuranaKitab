/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createType('book_image_type', ['FRONT', 'BACK'])

  pgm.createTable('book_images', {
    book_image_id: 'id',
    bookid: {
      type: 'integer'
    },
    img_src: {
      type: 'text'
    },
    img_type: {
      type: 'book_image_type'
    },
    img_public_id: {
      type: 'text'
    }
  })

  pgm.createConstraint('book_images', 'fk_bookid', {
    foreignKeys: {
      columns: 'bookid',
      references: 'books(bookid)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  })
}

exports.down = pgm => {
  pgm.dropConstraint('book_images', 'fk_bookid')
  pgm.dropTable('book_images')
  pgm.dropType('book_image_type')
}
