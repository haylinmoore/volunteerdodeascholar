const User = require("../models/User");
const Class = require("../models/Class");
module.exports = {};
module.exports.POST = function(req, res) {
	User.findAll({ where: { email: req.body.email } }).then(student => {
		if (student.length == 1) {
			let body = {
				teacherID: req.session.user.userid,
				studentID: student[0].userid
			};
			Class.create(body).then(function(data) {
				if (req.query.redir) {
					res.redirect("/" + req.query.redir);
				} else {
					res.redirect("/overview");
				}
			});
		} else {
			res.render("error", {
				layout: "default",
				err: "I'm sorry it appears " + req.body.email + " is not in our system",
				session: req.session.user
			});
		}
	});
};
