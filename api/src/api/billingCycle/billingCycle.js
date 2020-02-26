const sequelize = require('sequelize')
const connection = require('../../config/database')
const Credit = require('./Credit')
const Debt = require('./Debt')

const billingCycle = connection.define('billingcycle', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    month: {
        type: sequelize.INTEGER,
        validate: {
            len: [1, 12]
        }
    },
    year: {
        type: sequelize.INTEGER
    }
})


billingCycle.hasMany(Credit, { foreignKey: 'bc_Id', sourceKey: 'id' })
Credit.belongsTo(billingCycle, { foreignKey: 'id' })

billingCycle.hasMany(Debt, { foreignKey: 'bc_Id', sourceKey: 'id' })
Debt.belongsTo(billingCycle, { foreignKey: 'id' })

billingCycle.sync({ force: false }).then(() => { })

module.exports = billingCycle