const express = require('express')
const sequelize = require('sequelize')
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
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    })
})


router.get('/billingCycles/:id', (req, res, next) => {
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
            next()
        }
    }).catch(msgErro => {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    })
})

//#region Create 
router.post('/billingCycles', (req, res) => {

    let credit = req.body.credit
    let debt = req.body.debt

    var bc = billingCycles.build({
        name: req.body.name,
        month: req.body.month,
        year: req.body.year,
        createdAt: Date.now(),
        updatedAt: Date.now()
    })

    bc.validate().then(() => {
        bc.save().then(billingcycles => {
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
        })
    }).catch(sequelize.ValidationError, (msgErroValidation) => {
        res.status(500).send(`Erro encontrado: ${msgErroValidation}`)
    }).catch(msgErro => {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    })


    // billingCycles.create({
    //     name: req.body.name,
    //     month: req.body.month,
    //     year: req.body.year,
    //     createdAt: Date.now(),
    //     updatedAt: Date.now()
    // }).then(billingcycles => {
    //     if (billingcycles != undefined) {
    //         if (credit != undefined) {
    //             CreateCredits(credit, billingcycles.id)
    //         }
    //         if (debt != undefined) {
    //             CreateDebts(debt, billingcycles.id)
    //         }
    //         res.status(200).send(billingcycles)
    //     } else {
    //         res.status(404).send('Não foi possível criar, tente novamente mais tarde.')
    //     }
    // }).catch(sequelize.ValidationError, (msgErroValidation) => {
    //     res.status(500).send(`Erro encontrado: ${msgErro}`)
    // }).catch(msgErro => {
    //     res.status(500).send(`Erro encontrado: ${msgErro}`)
    // })

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
//#endregion

//#region Update
router.put('/billingCycles/:id', async (req, res) => {

    let credit = req.body.credit
    let debt = req.body.debt
    if (req.params.id != undefined) {

        try {
            var bc = billingCycles.build({
                id: req.params.id,
                name: req.body.name,
                month: req.body.month,
                year: req.body.year,
                updatedAt: Date.now()
            })
            await bc.validate()

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
                res.status(500).send(`Erro encontrado: ${msgErro}`)
            })
        } catch (erro) {
            res.status(500).send(`Erro encontrado: ${erro}`)
        }
    } else {
        res.status(404).send('Id não foi informado no body da requisição.')
    }


    // let credit = req.body.credit
    // let debt = req.body.debt
    // if (req.params.id != undefined) {
    //     billingCycles.update({
    //         name: req.body.name,
    //         month: req.body.month,
    //         year: req.body.year,
    //         updatedAt: Date.now()
    //     }, {
    //         where: {
    //             id: req.params.id
    //         }
    //     }).then(billingcycles => {
    //         if (billingcycles != undefined) {
    //             if (credit != undefined) {
    //                 UpdateCredits(credit)
    //             }
    //             if (debt != undefined) {
    //                 UpdateDebts(debt)
    //             }
    //             res.status(200).send('BillingCycle alterado com sucesso!')
    //         } else {
    //             res.status(404).send('Não foi possível alterar billingCycle, tente novamente mais tarde.')
    //         }
    //     }).catch(msgErro => {
    //         res.status(500).send(`Erro encontrado: ${msgErro}`)
    //     })
    // } else {
    //     res.status(404).send('Id não foi informado no body da requisição.')
    // }
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
//#endregion

//#region Delete
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
                res.status(500).send(`Erro encontrado: ${msgErro}`)
            })
        } else {
            res.status(500).send('Id informado não é apenas números.')
        }
    } else {
        res.status(500).send('Id não foi informado no body da requisição.')
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
//#endregion


router.get('/billingCycles/count', (req, res) => {
    billingCycles.findAll({
        attributes: [[sequelize.fn('count', sequelize.col('id')), 'count']]
    }).then(bccount => {
        res.status(200).send(bccount)
    }).catch(msgErro => {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    })
})

router.get('/billingCycles/summary', async (req, res) => {
    let CreditSum = 0
    let DebtSum = 0
    try {
        CreditSum = await Credit.findAll({
            attributes: [[sequelize.fn('sum', sequelize.col('value')), 'sum']],
            raw: true
        }).then(sum => {
            return sum[0].sum
        })

        DebtSum = await Debt.findAll({
            attributes: [[sequelize.fn('sum', sequelize.col('value')), 'sum']],
            raw: true
        }).then(sum => {
            return sum[0].sum
        })

    } catch (err) {
        console.log('There was an error!', err);
    }

    res.status(200).json({ CreditSum, DebtSum: DebtSum })
})
function SumCredits() {
    Credit.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('value')), 'sum']]
    }).then(sum => {
        return 10
    }).catch(msgErro => {
        return 0
    })
}

function SumDebts() {
    Debt.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('value')), 'sum']]
    }).then(sum => {
        return sum
    }).catch(msgErro => {
        return 0
    })
}



module.exports = router