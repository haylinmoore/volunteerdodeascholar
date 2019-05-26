const errors = require("../src/errors.js");

module.exports = {};
module.exports.GET = function(req, res) {
	res.render("error", {
		layout: "default",
		err: errors[req.params.id],
		session: req.session.user
	});
};
