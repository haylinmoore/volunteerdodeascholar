const { mailgun } = require("../config.js");
const mg = require("mailgun-js")({
	apiKey: mailgun.apiKey,
	domain: mailgun.domain
});

module.exports = mg;
