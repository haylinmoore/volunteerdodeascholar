const Work = require("../models/Work");
const sendSupervisorEmail = require("../src/supervisor.js");

module.exports = {};
module.exports.GET = function(req, res) {
	let body = {
		userid: req.session.user.userid,
		job: req.body.job,
		location: req.body.location,
		description: req.body.description,
		start: new Date(req.body.date).valueOf() / 1000,
		time: Number(req.body.hours) * 3600 + Number(req.body.minutes) * 60,
		supervisor: req.body.supervisor,
		dateAdded: Math.round(new Date().valueOf() / 1000)
	};

	Work.create(body)
		.then(function(data) {
			sendSupervisorEmail({
				name: req.session.user.name,
				job: req.body.job,
				location: req.body.location,
				description: req.body.description,
				date: req.body.date,
				id: data.id,
				time: `${req.body.hours} hour(s) and ${req.body.minutes} minute(s)`,
				supervisor: req.body.supervisor
			});
			res.redirect("/");
		})
		.catch(function(err) {
			res.json(err);
		});
};
