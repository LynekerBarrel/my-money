const sequelize = require('sequelize')
const connection = require('../../config/database')


const Debt = connection.define('debt', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    value: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: sequelize.STRING,
        allowNull: true
    },
    bc_Id:{
        type: sequelize.INTEGER,
        allowNull: false
    }
})


Debt.sync({ force: false }).then(() => { })

module.exports = Debt