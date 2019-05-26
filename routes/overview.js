const Work = require("../models/Work");
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
			User.findAll({ where: { [Op.or]: studentIDs } }).then(students => {
				Work.findAll({ where: { [Op.or]: studentIDs } }).then(works => {
					let studentData = {};
					for (let i in students) {
						studentData[students[i].userid] = students[i];
						studentData[students[i].userid].total = 0;
						studentData[students[i].userid].count = 0;
					}
					for (let i in works) {
						studentData[works[i].userid].total += works[i].time;
						studentData[works[i].userid].count++;
					}
					for (let i in studentData) {
						studentData[i].time = [
							Math.floor(studentData[i].total / 3600),
							Math.floor((studentData[i].total % 3600) / 60)
						];
					}
					res.render("overview", {
						layout: "default",
						session: req.session.user,
						students: studentData
					});
				});
			});
		}
	);
};
