const Sequelize = require("sequelize");
const db = require("../src/database");

const User = db.define(
	"user",
	{
		name: {
			type: Sequelize.STRING
		},
		userid: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		schoolid: {
			type: Sequelize.INTEGER
		},
		type: {
			type: Sequelize.INTEGER
		},
		email: {
			type: Sequelize.STRING(320)
		}
	},
	{
		timestamps: false
	}
);

module.exports = User;
