const express = require('express')

module.exports = function(server){

    //Definir URL base para Todas as ROTAS
    const router = express.Router()
    server.use('/api', router)

    // Rotas de Ciclo de Pagamento
    const BillingCycle = require('../api/billingCycle/billinCycleService')
    BillingCycle.register(router, '/billingCycles')
    
}