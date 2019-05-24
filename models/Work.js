const Sequelize = require("sequelize");
const db = require("../src/database");

const Work = db.define(
	"work",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		volunteerID: {
			type: Sequelize.INTEGER
		},
		job: {
			type: Sequelize.TEXT("tiny")
		},
		location: {
			type: Sequelize.TEXT("tiny")
		},
		description: {
			type: Sequelize.TEXT
		},
		start: {
			type: Sequelize.INTEGER
		},
		time: {
			type: Sequelize.INTEGER
		},
		supervisor: {
			type: Sequelize.STRING(320)
		},
		verified: {
			type: Sequelize.BOOLEAN
		},
		dateAdded: {
			type: Sequelize.INTEGER
		}
	},
	{
		timestamps: false
	}
);

module.exports = Work;
