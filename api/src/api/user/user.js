const sequelize = require('sequelize')
const connection = require('../../config/database')


const User = connection.define('user', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [[6, 20]],
                msg: 'Senha deve estar entre 6 e 12 digitos'
            }
        }
    }
})


User.sync({ force: false }).then(() => { })

module.exports = User