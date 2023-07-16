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
        qauntity: {
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
            onDelete: 'NO ACTION',
            onUPDATE: 'NO ACTION'
        }
    })

    pgm.createConstraint('carts', 'fk_cart_userid', {
        foreignKeys: {
            columns: 'userid',
            references: 'users(userid)',
            onDelete: 'NO ACTION',
            onUPDATE: 'NO ACTION'
        }
    })
}

exports.down = pgm => {
    pgm.dropConstrain('fk_cart_bookid')
    pgm.dropTable('carts')
}
