const express = require('express')
const router = express.Router()
const billingCycles = require('./billingCycle')
const Credit = require('./Credit')
const Debt = require('./Debt')

router.get('/billingCycles', (req, res) => {
    billingCycles.findAll({
        include: [{
            model: Credit
        }, {
            model: Debt
        }],
        order: [['id', 'DESC']]
    }).then(billingcycles => {
        if (billingcycles != undefined) {
            res.status(200).send(billingcycles)
        } else {
            res.status(404).send('Registro não encontrado')
        }
    }).catch(msgErro => {
        res.status(100).send(`Erro encontrado: ${msgErro}`)
    })
})

router.get('/billingCycles/:id', (req, res) => {
    billingCycles.findByPk(req.params.id, {
        include: [{
            model: Credit
        }, {
            model: Debt
        }]
    }).then(billingcycles => {
        if (billingcycles != undefined) {
            res.status(200).send(billingcycles)
        } else {
            res.status(404).send('Registro não encontrado')
        }
    }).catch(msgErro => {
        res.status(100).send(`Erro encontrado: ${msgErro}`)
    })
})

router.post('/billingCycles', (req, res) => {

    let credit = req.body.credit
    let debt = req.body.debt

    billingCycles.create({
        name: req.body.name,
        month: req.body.month,
        year: req.body.year,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }).then(billingcycles => {
        if (billingcycles != undefined) {
            if (credit != undefined) {
                CreateCredits(credit, billingcycles.id)
            }
            if (debt != undefined) {
                CreateDebts(debt, billingcycles.id)
            }
            res.status(200).send(billingcycles)
        } else {
            res.status(404).send('Não foi possível criar, tente novamente mais tarde.')
        }
    }).catch(msgErro => {
        res.status(100).send(`Erro encontrado: ${msgErro}`)
    })
})

function CreateCredits(credit, bc_Id) {
    let newCredit = []
    credit.forEach(c => {
        let creditModified = {
            name: c.name,
            value: c.value,
            bc_Id
        }
        newCredit.push(creditModified)
    })
    Credit.bulkCreate(newCredit).then(credit => {
        if (credit == undefined) {
            return false
            // res.status(200).send('BillingCycle criada porém credit não foi.')
        }
    })
    return true
}

function CreateDebts(debt, bc_Id) {
    let newDebt = []
    debt.forEach(d => {
        let debtModified = {
            name: d.name,
            value: d.value,
            status: d.status,
            bc_Id
        }
        newDebt.push(debtModified)
    })
    Debt.bulkCreate(newDebt).then(debt => {
        if (debt == undefined) {
            return false
            // res.status(200).send('BillingCycle criada porém debt não foi.')
        }
    })
    return true
}

router.put('/billingCycles/:id', (req, res) => {
    let credit = req.body.credit
    let debt = req.body.debt
    if (req.params.id != undefined) {
        billingCycles.update({
            name: req.body.name,
            month: req.body.month,
            year: req.body.year,
            updatedAt: Date.now()
        }, {
            where: {
                id: req.params.id
            }
        }).then(billingcycles => {
            if (billingcycles != undefined) {
                if (credit != undefined) {
                    UpdateCredits(credit)
                }
                if (debt != undefined) {
                    UpdateDebts(debt)
                }
                res.status(200).send('BillingCycle alterado com sucesso!')
            } else {
                res.status(404).send('Não foi possível alterar billingCycle, tente novamente mais tarde.')
            }
        }).catch(msgErro => {
            res.status(100).send(`Erro encontrado: ${msgErro}`)
        })
    } else {
        res.status(404).send('Id não foi informado no body da requisição.')
    }
})

function UpdateCredits(credit) {
    credit.forEach(c => {
        Credit.update(c, { where: { id: c.id } }).then(credit => {
            if (credit == undefined) {
                return false
                // res.status(200).send('BillingCycle criada porém credit não foi.')
            }

        })
    })
    return true
}

function UpdateDebts(debt) {
    debt.forEach(d => {
        Debt.update(d, { where: { id: d.id } }).then(debt => {
            if (debt == undefined) {
                return false
                // res.status(200).send('BillingCycle criada porém debt não foi.')
            }
        })
    })
    return true
}

router.delete('/billingCycles/:id', async (req, res) => {
    let id = req.params.id
    if (id != undefined) {
        if (!isNaN(id)) {
            await DeleteCredits(id)
            await DeleteDebts(id)
            billingCycles.destroy({
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.status(200).send('BillingCycle deletado com sucesso!')
            }).catch(msgErro => {
                res.status(100).send(`Erro encontrado: ${msgErro}`)
            })
        } else {
            res.status(100).send('Id informado não é apenas números.')
        }
    } else {
        res.status(100).send('Id não foi informado no body da requisição.')
    }
})

function DeleteCredits(bc_Id) {
    Credit.findAll({ where: { bc_Id: bc_Id } }).then(credit => {
        if (credit != undefined) {
            Credit.destroy({ where: { id: credit.map(a => a.id) } }).then(data => {
                return true
            })
        }
    })
    return true
}

function DeleteDebts(bc_Id) {
    Debt.findAll({ where: { bc_Id: bc_Id } }).then(debt => {
        if (debt != undefined) {
            Debt.destroy({ where: { id: debt.map(a => a.id) } }).then(data => {
                return true
            })
        }
    })
    return true
}

module.exports = router