const express = require('express')
const router = express.Router()
const User = require('./user')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('../../.env')


const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const Login = (email, password) => {
    User.findOne({ where: { email } }).then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, env.authSecret, { expiresIn: "1 day" })
            const { name, email } = user
            res.json({ name, email, token })
        } else {
            return res.status(400).send('Usuário/Senha inválidos')
        }
    }).catch(msgErro => {
        res.status(500).send(`Erro encontado: ${msgErro}`)
    })
}

router.post('/login', (req, res) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    User.findOne({ where: { email: email } }).then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
            //res.json({ user })
            const token = jwt.sign(user.toJSON(), env.authSecret, { expiresIn: "1 day" })
            const { name, email } = user
            res.json({ name, email, token })
        } else {
            return res.status(400).send('Usuário/Senha inválidos')
        }
    }).catch(msgErro => {
        res.status(500).send(`Erro encontado: ${msgErro}`)
    })
})

router.post('/validatetoken', (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
})


router.post('/signup', (req, res) => {
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

    if (!email.match(emailRegex)) {
        res.status(400).send('Email informado etá errado.')
    }

    if (!password.match(passwordRegex)) {
        res.status(400).send('A senha precisa ter 1 letra maíscula, 1 número, 1 caracter especial e o tamanho tem que ser de 6 e 20.')
    }

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)
    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        res.status(400).send('Senhas não conferem.')
    }

    User.findOne({ where: { email } }).then(async user => {
        if (user) {
            res.status(400).send('Usuário já cadastrado.')
        } else {
            try {
                var userBuilded = User.build({
                    name,
                    email,
                    password: passwordHash,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })

                await userBuilded.validate()
                const user = await User.create({
                    name,
                    email,
                    password: passwordHash,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                })
                if (user != undefined) {
                    res.status(200).send(user)
                } else {
                    //TODO: Implementar login após cadastrar
                    return Login(email, password)
                    //res.status(500).send('Não foi possível criar usuário, tente novamente mais tarde.')
                }
            } catch (msgErro) {
                res.status(500).send(`Erro encontrado: ${msgErro}`)
            }
        }
    }).catch(msgErro => {
        res.status(500).send(`Erro encontrado: ${msgErro}`)
    })
})



module.exports = router