const express = require("express");
const oauth = require("../src/googleoauth.js");
const router = express.Router();
const User = require("../models/User");
const Work = require("../models/Work");
const processJobs = require("../src/processJobs.js");
const errors = require("../src/errors.js");
const sendSupervisorEmail = require("../src/supervisor.js");

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.valid) {
		next();
	} else {
		res.redirect("/login");
	}
};

/* GET home page. */
router.get("/", sessionChecker, function(req, res, next) {
	Work.findAll({ where: { volunteerID: req.session.user.userid } }).then(
		function(data) {
			let work = processJobs(data);
			res.render("index", {
				layout: "default",
				session: req.session.user,
				work: work
			});
		}
	);
});

router.get("/profile/:id", function(req, res, next) {
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

	User.findAll({ where: where }).then(function(user) {
		if (user.length == 1) {
			Work.findAll({ where: { volunteerID: user[0].userid } }).then(function(
				data
			) {
				let work = processJobs(data);
				res.render("profile", {
					layout: "default",
					user: user[0],
					session: req.session.user,
					work: work
				});
			});
		} else {
			res.redirect("/err/3");
		}
	});
});

router.get("/verify/:id", function(req, res) {
	Work.findAll({ where: { id: req.params.id } }).then(function(work) {
		work = processJobs(work).jobs[0];
		User.findAll({ where: { userid: work.volunteerID } }).then(function(user) {
			user = user[0];
			res.render("verify", {
				layout: "default",
				work: work,
				user: user
			});
		});
	});
});

router.post("/verify/:id", function(req, res) {
	Work.findAll({ where: { id: req.params.id } }).then(function(work) {
		work = processJobs(work).jobs[0];
		User.findAll({ where: { userid: work.volunteerID } }).then(function(user) {
			if (req.body.verify) {
				user = user[0];
				let body = {
					volunteerID: user.userid,
					job: req.body.job,
					location: req.body.location,
					description: req.body.description,
					start: new Date(req.body.date).valueOf() / 1000,
					time: Number(req.body.hours) * 3600 + Number(req.body.minutes) * 60,
					supervisor: req.body.supervisor,
					dateAdded: Math.round(new Date().valueOf() / 1000),
					verified: true
				};
				Work.update(body, { where: { id: req.params.id } }).then(function(
					data
				) {
					res.redirect("/profile/" + user.email);
				});
			} else if (req.body.reject) {
				Work.destroy({ where: { id: req.params.id } }).then(function(data) {
					res.redirect("/profile/" + user.email);
				});
			}
		});
	});
});

router.get("/err/:id", function(req, res, next) {
	res.render("error", {
		layout: "default",
		err: errors[req.params.id],
		session: req.session.user
	});
});

router.post("/addjob", sessionChecker, function(req, res, next) {
	let body = {
		volunteerID: req.session.user.userid,
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
});

router.get("/login", function(req, res, next) {
	// Redirect to login URL
	res.redirect(oauth.loginUrl());
});

router.get("/auth", function(req, res, next) {
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
			console.log(err);
			res.redirect("/err/1");
		});
});

router.post("/auth", function(req, res, next) {
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
});

module.exports = router;
