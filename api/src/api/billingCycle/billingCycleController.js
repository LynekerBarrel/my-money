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
            if (req.query.page != undefined && req.query.limit != undefined) {
                res.status(200).send(Pagination(billingcycles, req.query.page, req.query.limit))
            } else {
                res.status(200).send(billingcycles)
            }
        } else {
            res.status(404).send('Registro não encontrado')
        }
    }).catch(msgErro => {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    })
})

const Pagination = (data, page, limit) => {
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    return data.slice(startIndex, endIndex)
}


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
router.post('/billingCycles', async (req, res) => {

    let credit = req.body.credits
    let debt = req.body.debts
    try {
        var bc = billingCycles.build({
            name: req.body.name,
            month: req.body.month,
            year: req.body.year,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        await bc.validate()
        const billingcycles = await billingCycles.create({
            name: req.body.name,
            month: req.body.month,
            year: req.body.year,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })
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
    } catch (msgErro) {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    }

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

const CreateCredits = (credit, bc_Id) => {
    var promises = []
    try {

        credit.forEach(c => {
            let { name, value } = c
            promises.push(new Promise((resolve, reject) => { Credit.create({ name, value, bc_Id }) }))
        })

        Promise.all(promises).then(() => {
            res.status(200).send('Créditos criados com sucesso!')
        }).catch(msgErro => {
            res.status(500).send(`Erro ocorrido: ${msgErro}`)
        })
    } catch (msgErro) {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    }
}

const CreateDebts = (debt, bc_Id) => {
    var promises = []
    try {

        debt.forEach(d => {
            let { name, value, status } = d
            promises.push(new Promise((resolve, reject) => { Debt.create({ name, value, status, bc_Id }) }))
        })

        Promise.all(promises).then(() => {
            res.status(200).send('Débitos criados com sucesso!')
        }).catch(msgErro => {
            res.status(500).send(`Erro ocorrido: ${msgErro}`)
        })
    } catch (msgErro) {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    }
}

//#endregion

//#region Update
router.put('/billingCycles/:id', async (req, res) => {

    let credit = req.body.credits
    let debt = req.body.debts
    let bc_Id = req.params.id
    if (bc_Id != undefined) {

        try {
            var bc = billingCycles.build({
                id: bc_Id,
                name: req.body.name,
                month: req.body.month,
                year: req.body.year,
                updatedAt: Date.now()
            })
            await bc.validate()
            const bcUpdated = await billingCycles.update({
                name: req.body.name,
                month: req.body.month,
                year: req.body.year,
                updatedAt: Date.now()
            }, {
                where: {
                    id: bc_Id
                }
            })

            if (bcUpdated != undefined) {

                if (credit != undefined) {
                    await DeleteCredits(bc_Id)
                    CreateCredits(credit, bc_Id)
                }
                if (debt != undefined) {
                    await DeleteDebts(bc_Id)
                    CreateDebts(debt, bc_Id)
                }
                res.status(200).send('BillingCycle alterado com sucesso!')
            } else {
                res.status(404).send('Não foi possível alterar billingCycle, tente novamente mais tarde.')
            }

        } catch (msgErro) {
            res.status(500).send(`Erro encontado: ${msgErro}`)
        }
    } else {
        res.status(404).send('Id não foi informado no body da requisição.')
    }


    // let credit = req.body.credits
    // let debt = req.body.debts
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

// const UpdateCredits = (credit) => {

//     var promises = [];
//     credit.forEach(c => {
//         let { id } = c
//         if (id != undefined) {
//             promises.push(new Promise((resolve, reject) => { Credit.update(c, { where: { id } }) }))
//         }
//     })
//     Promise.all(promises).then(() => {
//         res.status(200).send('Credito criado com sucesso!')
//     }, (msgErro) => {
//         res.status(500).send(`Erro encontrado: ${msgErro}`)
//     })
// }

// const UpdateDebts = (debt) => {
//     var promises = [];
//     debt.forEach(d => {
//         if (d.id != undefined) {
//             promises.push(new Promise((resolve, reject) => { Debt.update(d, { where: { id: d.id } }) }))
//         }
//     })
//     Promise.all(promises).then(() => {
//         res.status(200).send('Débitos alterados com sucesso!')
//     }, (msgErro) => {
//         res.status(500).send(`Erro encontrado: ${msgErro}`)
//     })
// }
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