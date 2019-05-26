const Sequelize = require("sequelize");
const db = require("../src/database");

const Class = db.define(
	"classes",
	{
		teacherID: {
			type: Sequelize.INTEGER(16)
		},
		studentID: {
			type: Sequelize.INTEGER(16)
		}
	},
	{
		timestamps: false
	}
);

module.exports = Class;
