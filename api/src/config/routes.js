const express = require('express')
const auth = require('./auth')


module.exports = function (server) {

    // //Definir URL base para Todas as ROTAS
    // const router = express.Router()
    // server.use('/api', router)

    // // Rotas de Ciclo de Pagamento
    // const BillingCycle = require('../api/billingCycle/billingCycleController')
    // BillingCycle.register(router, '/billingCycles')


    //Rotas protegidas por Token JWT
    const protectedApi = express.Router()
    server.use('/api', protectedApi)

    protectedApi.use(auth)

    const BillingCycles = require('../api/billingCycle/billingCycleController')
    protectedApi.use('', BillingCycles)


    //Rotas publicas
    const openApi = express.Router()
    server.use('/oapi', openApi)

    const User = require('../api/user/authController')
    openApi.use('', User)

}