/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = (pgm) => {
    pgm.createExtension('citext')

    pgm.createType('user_role', ['CUSTOMER', 'ADMIN'])

    pgm.createTable('users', {
        userid: 'id',
        username: {
            type: 'varchar(50)',
            notNull: true
        },
        email: {
            type: 'citext',
            notNull:true
        },
        password: {
            type: 'text',
            notNull: true
        },
        salt: {
            type: 'text',
            notNull: true
        },
        createat: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        last_logout: {
            type: 'timestamp'
        },
        role: {
            type: 'user_role',
            notNull: true
        }
    })

    pgm.addConstraint('users', 'users_email_key', {
        unique: 'email',
        constraintType: 'UNIQUE'
    })
}

exports.down = pgm => {
    pgm.dropConstraint('users', 'users_email_key')
    pgm.dropTable('users')
    pgm.dropExtension('citext')
    pgm.dropType('user_role')
}
