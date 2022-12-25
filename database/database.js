const Sequelize = require('sequelize');
const connection = new Sequelize('guiaperguntas', 'root', '159753', {
    host: 'localhost',
    dialect: 'mysql'
})
module.exports = connection;