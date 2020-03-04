const sequelize = require('sequelize')
const connection = require('../../config/database')
const Credit = require('./Credit')
const Debt = require('./Debt')

const billingCycle = connection.define('billingcycle', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    month: {
        type: sequelize.INTEGER,
        validate: {
            min: {
                args: [1],
                msg: 'O valor do mês deve ser maior ou igual a 1 (Janeiro).'
            },
            max: {
                args: [12],
                msg: 'O valor do mês deve ser menor ou igual a 12 (Dezembro).'
            }
        }
    },
    year: {
        type: sequelize.INTEGER,
        validate: {
            min: {
                args: [1970],
                msg: 'O ano deve ser maior ou igual a 1970.'
            },
            max: {
                args: [2100],
                msg: 'O ano deve ser menor ou igual a 2100.'
            }
        }
    }
})


billingCycle.hasMany(Credit, { foreignKey: 'bc_Id', sourceKey: 'id' })
Credit.belongsTo(billingCycle, { foreignKey: 'id' })

billingCycle.hasMany(Debt, { foreignKey: 'bc_Id', sourceKey: 'id' })
Debt.belongsTo(billingCycle, { foreignKey: 'id' })

billingCycle.sync({ force: false }).then(() => { })

module.exports = billingCycle