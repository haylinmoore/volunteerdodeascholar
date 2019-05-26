module.exports = {};
module.exports.GET = function(req, res) {
	delete req.session.user;
	req.session.valid = false;
	res.render("error", {
		layout: "default",
		err: "Succesfully Logged Out",
		session: req.session.user
	});
};
