module.exports = {};

const sessionChecker = (allowed, req, res, next) => {
	if (req.session.valid && req.session.user) {
		if (allowed.includes(req.session.user.type)) {
			next();
		} else {
			res.redirect("/");
		}
	} else {
		res.redirect("/login");
	}
};

module.exports.all = (req, res, next) => {
	sessionChecker([0, 1], req, res, next);
};

module.exports.student = (req, res, next) => {
	sessionChecker([0], req, res, next);
};

module.exports.teacher = (req, res, next) => {
	sessionChecker([1], req, res, next);
};
