module.exports = {};
module.exports.GET = function(req, res) {
	if (req.session.user.type == 0) {
		res.redirect("/profile/" + req.session.user.email);
	} else if (req.session.user.type == 1) {
		res.redirect("/overview");
	} else {
		res.redirect("/profile/" + req.session.user.email);
	}
};
