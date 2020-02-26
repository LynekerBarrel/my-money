// const mongoose = require('mongoose')
// mongoose.Promise = global.Promise
// module.exports = mongoose.connect('mongodb://localhost/mymoney')

// mongoose.Error.messages.general.required = "O atributo {PATH} é obrigatório."
// mongoose.Error.messages.Number.min = "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'."
// mongoose.Error.messages.Number.max = "O '{VALUE}' informado é maior que o limite máximo de '{MAX}'."
// mongoose.Error.messages.String.enum = "'{VALUE}' não é válido para o atributo '{PATH}'."


const sequelize = require('sequelize')


const connection = new sequelize('mymoney','root','LinkxD@12',{
    host:'localhost',
    dialect: 'mysql'
})

connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com banco de dados")
    })
    .catch((msgErro) => {
        console.log(`Erro ocorrido: ${msgErro}`)
    })


module.exports = connection