const User = require("../models/User");
const Class = require("../models/Class");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {};
module.exports.GET = function(req, res) {
	Class.findAll({ where: { teacherID: req.session.user.userid } }).then(
		classIDs => {
			let studentIDs = [];
			for (let i in classIDs) {
				studentIDs.push({ userid: classIDs[i].studentID });
			}

			for (let i in classIDs) {
				studentIDs.push({ userid: classIDs[i].studentID });
			}
			console.log(studentIDs);
			User.findAll({
				where: {
					[Op.not]: { [Op.or]: studentIDs },
					schoolid: req.session.user.schoolid,
					type: 0
				},
				order: [["name", "ASC"]]
			}).then(students => {
				res.render("massAdd", {
					layout: "default",
					session: req.session.user,
					students: students
				});
			});
		}
	);
};
