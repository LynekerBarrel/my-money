const restful = require('node-restful')
const mongoose = restful.mongoose

const creditSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Nome do crédito é obrigatório!'] },
    value: { type: Number, min: 0, required: [true, 'Valor do crédito é obrigatório!'] }
})

const debtSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Nome do débito é obrigatório!'] },
    value: { type: Number, min: 0, required: [true, 'Valor do débito é obrigatório!'] },
    status: {
        type: String, required: false, uppercase: true,
        enum: ['PAGO', 'PENDENTE', 'AGENDADO']
    }
})

const billingCycleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    month: { type: Number, min: 1, max: 12, required: true },
    year: { type: Number, min: 1970, max: 2100, required: true },
    credits: [creditSchema],
    debts: [debtSchema]
})

module.exports = restful.model('BillingCycle', billingCycleSchema)