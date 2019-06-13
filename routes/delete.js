const Work = require("../models/Work");

module.exports = {};
module.exports.GET = function(req, res) {
	Work.findAll({
		where: { id: req.params.id }
	}).then(function(work) {
		if (
			work.length == 1 &&
			(work[0].userid == req.session.user.userid || req.session.user.type == 1)
		) {
			Work.destroy({
				where: { id: req.params.id }
			}).then(function(data) {
				res.redirect("/profile/" + work[0].userid);
			});
		} else {
			res.redirect("/err/5");
		}
	});
};
