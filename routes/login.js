const oauth = require("../src/googleoauth.js");

module.exports = {};
module.exports.GET = function(req, res) {
	res.redirect(oauth.loginUrl());
};
