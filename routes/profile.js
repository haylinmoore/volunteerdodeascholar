const Work = require("../models/Work");
const User = require("../models/User");
const processJobs = require("../src/processJobs.js");

module.exports = {};
module.exports.GET = function(req, res) {
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
				where: { userid: user.userid },
				order: [["start", "DESC"]]
			}).then(function(data) {
				let work = processJobs(data);
				if (req.session.user) {
					if (user.userid == req.session.user.userid) {
						res.render("ownProfile", {
							layout: "default",
							user: user,
							session: req.session.user,
							work: work
						});
					} else {
						res.render("profile", {
							layout: "default",
							user: user,
							session: req.session.user,
							work: work
						});
					}
				} else {
					res.render("profile", {
						layout: "default",
						user: user,
						session: req.session.user,
						work: work
					});
				}
			});
		} else {
			res.redirect("/err/3");
		}
	});
};
