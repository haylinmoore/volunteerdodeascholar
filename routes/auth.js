const oauth = require("../src/googleoauth.js");
const User = require("../models/User");

module.exports = {};
module.exports.GET = function(req, res, next) {
	oauth
		.getUserData(req.query.code)
		.then(function(googleData) {
			User.findAll({ where: { email: googleData.email } }).then(function(data) {
				if (data.length === 1) {
					req.session.user = data[0];
					req.session.valid = true;
					res.redirect("/");
				} else {
					if (googleData.email.replace(/.*@/, "") != "student.dodea.edu") {
						res.redirect("/err/0");
					} else {
						req.session.user = {
							email: googleData.email,
							name: googleData.name
						};
						req.session.valid = false;
						res.render("register", {
							layout: "default",
							user: req.session.user,
							session: req.session.user
						});
					}
				}
			});
		})
		.catch(function(err) {
			res.redirect("/err/1");
		});
};

module.exports.POST = function(req, res, next) {
	User.findAll({ where: { email: req.session.user.email } }).then(function(
		data
	) {
		if (data.length === 1) {
			res.redirect("/err/2");
		} else {
			User.create({
				name: req.session.user.name,
				email: req.session.user.email,
				type: 0,
				schoolid: req.body.schoolid
			}).then(function(user) {
				req.session.user = user;
				req.session.valid = true;
				res.redirect("/");
			});
		}
	});
};
