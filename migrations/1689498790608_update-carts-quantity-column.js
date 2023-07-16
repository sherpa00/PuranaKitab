/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.renameColumn('carts', 'qauntity', 'quantity')
}

exports.down = pgm => {
  pgm.renameColumn('carts', 'quantity', 'qauntity')
}
