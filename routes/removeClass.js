const Class = require("../models/Class");

module.exports = {};
module.exports.GET = function(req, res) {
	Class.destroy({
		where: { studentID: req.params.id, teacherID: req.session.user.userid }
	}).then(function(data) {
		res.redirect("/overview");
	});
};
