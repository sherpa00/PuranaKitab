/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createExtension('pg_trgm')

  pgm.createType('condition_of_book', ['GOOD', 'ACCEPTABLE', 'OLD'])

  pgm.createTable('books', {
    bookid: 'id',
    title: {
      type: 'varchar(250)',
      notNull: true
    },
    description: {
      type: 'text',
      notNull: true
    },
    book_type: {
      type: 'varchar(250)',
      notNull: true
    },
    price: {
      type: 'integer',
      notNull: true
    },
    publication_date: {
      type: 'date',
      notNull: true
    },
    available_quantity: {
      type: 'integer',
      notNull: true
    },
    book_condition: {
      type: 'condition_of_book'
    },
    isbn: {
      type: 'varchar(300)',
      notNull: true
    },
    createdat: {
      type: 'date',
      notNull: true,
      default: pgm.func('current_date')
    },
    authorid: {
      type: 'integer'
    },
    genre_id: {
      type: 'integer'
    }
  })

  pgm.createConstraint('books', 'fk_book_author', {
    foreignKeys: {
      columns: 'authorid',
      references: 'authors(authorid)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  })

  pgm.createConstraint('books', 'fk_book_genre', {
    foreignKeys: {
      columns: 'genre_id',
      references: 'genres(genre_id)',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  })

  pgm.createIndex('books', ['description'], {
    name: 'book_desc_search_idx',
    method: 'GIN',
    expression: "to_tsvector('simple'::regconfig, description)",
    tablespace: 'pg_default',
    opclass: 'gin_trgm_ops'
  })
}

exports.down = pgm => {
  pgm.dropIndex('books', ['description'], {
    name: 'book_desc_search_idx'
  })
  pgm.dropConstraint('books', 'fk_book_author')
  pgm.dropConstraint('books', 'fk_book_genre')
  pgm.dropTable('books')
  pgm.dropExtension('pg_trgm')
  pgm.dropType('condition_of_book')
}
