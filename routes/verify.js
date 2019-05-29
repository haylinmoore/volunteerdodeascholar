const Work = require("../models/Work");
const User = require("../models/User");
const processJobs = require("../src/processJobs.js");

module.exports = {};
module.exports.POST = function(req, res) {
	Work.findAll({
		where: {
			id: req.params.id,
			userid: req.params.userid,
			dateAdded: req.params.dateAdded,
			verified: false
		}
	}).then(function(work) {
		if (work.length == 0) {
			res.redirect("/err/4");
			return;
		}
		work = processJobs(work).jobs[0];
		User.findAll({ where: { userid: work.userid } }).then(function(user) {
			if (req.body.verify) {
				user = user[0];
				let body = {
					userid: user.userid,
					job: req.body.job,
					location: req.body.location,
					description: req.body.description,
					start: new Date(req.body.date).valueOf() / 1000,
					time: Number(req.body.hours) * 3600 + Number(req.body.minutes) * 60,
					supervisor: req.body.supervisor,
					dateAdded: Math.round(new Date().valueOf() / 1000),
					verified: true
				};
				Work.update(body, {
					where: { id: req.params.id, verified: false }
				}).then(function(data) {
					res.redirect("/profile/" + user.email);
				});
			} else if (req.body.reject) {
				Work.destroy({ where: { id: req.params.id } }).then(function(data) {
					res.redirect("/profile/" + user.email);
				});
			}
		});
	});
};

module.exports.GET = function(req, res) {
	Work.findAll({
		where: {
			id: req.params.id,
			userid: req.params.userid,
			dateAdded: req.params.dateAdded,
			verified: false
		}
	}).then(function(work) {
		if (work.length == 0) {
			res.redirect("/err/4");
			return;
		}
		work = processJobs(work).jobs[0];
		User.findAll({ where: { userid: work.userid } }).then(function(user) {
			user = user[0];
			res.render("verify", {
				layout: "default",
				work: work,
				user: user
			});
		});
	});
};
