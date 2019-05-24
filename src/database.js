const Sequelize = require("sequelize");
var { database } = require("../config.js");

module.exports = new Sequelize(
	database.database,
	database.user,
	database.password,
	{
		host: database.host,
		dialect: database.dialect,
		operatorsAliases: false,
		omitNull: true
	}
);
