/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('reset_tokens', {
        reset_token_id: 'id',
        email: {
            type: 'text',
            notNull: true
        },
        token: {
            type: 'varchar(300)',
            notNull: true
        },
        expiry_date: {
            type: 'timestamp',
            notNull: true
        }
    })

    pgm.addConstraint('reset_tokens', 'reset_tokens_token_key', {
        unique: ['token'],
        constraintType: 'UNIQUE',
      })
}

exports.down = pgm => {
    pgm.dropConstraint('reset_tokens', 'reset_tokens_token_key')
    pgm.dropTable('reset_tokens')
}
