const Work = require("../models/Work");
const User = require("../models/User");
const processJobs = require("../src/processJobs.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

module.exports = {};
module.exports.GET = function(req, res) {
	let sinceDate = new Date(req.query.since).valueOf() / 1000 || 0;
	let where = {};
	if (req.params.id.includes("@")) {
		where = { email: req.params.id };
	} else if (Number(req.params.id) != null) {
		where = { userid: req.params.id };
	}

	if (where == {}) {
		res.redirect("/err/3");
		return;
	}

	User.findAll({ where: where }).then(user => {
		if (user.length == 1) {
			user = user[0];
			Work.findAll({
				where: { userid: user.userid, start: { [Op.gte]: sinceDate } },
				order: [["start", "DESC"]]
			}).then(function(data) {
				let work = processJobs(data);
				let profile = {
					owner: false,
					teacher: false
				};
				if (req.session.user) {
					if (user.userid == req.session.user.userid) {
						profile.owner = true;
					} else if (req.session.user.type == 1) {
						profile.teacher = true;
					}
				}

				res.render("profile", {
					layout: "default",
					profile: profile,
					user: user,
					session: req.session.user,
					work: work
				});
			});
		} else {
			res.redirect("/err/3");
		}
	});
};
