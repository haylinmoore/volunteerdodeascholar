const Work = require("../models/Work");
const User = require("../models/User");
const processJobs = require("../src/processJobs.js");
const arrayToCSV = require("../src/arrayToCSV");

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
				res.setHeader("Content-type", "application/octet-stream");

				res.setHeader(
					"Content-disposition",
					"attachment; filename=profile-" + user.email + ".csv"
				);

				let csvData = [];

				for (let i in work.jobs) {
					let job = work.jobs[i];
					csvData.push({
						job: job.job,
						description: job.description,
						location: job.location,
						date: job.start,
						hours: job.time[0],
						minutes: job.time[1],
						supervisor: job.supervisor,
						verified: job.verified
					});
				}

				res.send(arrayToCSV({ data: csvData }));
			});
		} else {
			res.redirect("/err/3");
		}
	});
};
