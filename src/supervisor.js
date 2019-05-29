const mailgun = require("./mail.js");

module.exports = function(data) {
	let email = {
		from: "DodeaScholar Volunteer <volunteer@mg.dodeascholar.com>",
		to: data.supervisor,
		subject: data.name + " Recently Volunteered For You",
		template: "supervisor_email",
		"v:name": data.name,
		"v:job": data.job,
		"v:id": data.id + "/" + data.userid + "/" + data.dateAdded,
		"v:date": data.date,
		"v:description": data.description,
		"v:time": data.time
	};
	mailgun.messages().send(email, function(error, body) {});
};
