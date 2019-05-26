const Work = require("../models/Work");

module.exports = {};
module.exports.GET = function(req, res) {
	Work.findAll({
		where: { id: req.params.id, userid: req.session.user.userid }
	}).then(function(work) {
		if (work.length == 1) {
			Work.destroy({
				where: { id: req.params.id, userid: req.session.user.userid }
			}).then(function(data) {
				res.redirect("/profile/" + req.session.user.email);
			});
		} else {
			res.redirect("/err/5");
		}
	});
};
