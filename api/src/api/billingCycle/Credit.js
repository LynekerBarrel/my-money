const sequelize = require('sequelize')
const connection = require('../../config/database')


const Credit = connection.define('credit', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    value: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: "Valor do crédito é obrigatório"
            }
        }
    },
    bc_Id: {
        type: sequelize.INTEGER,
        allowNull: false
    }
})


Credit.sync({ force: false }).then(() => { })

module.exports = Credit