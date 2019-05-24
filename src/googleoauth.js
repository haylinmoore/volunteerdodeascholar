var { google } = require("googleapis");
var { googleConfig } = require("../config.js");
var scopes = [
	"https://www.googleapis.com/auth/userinfo.email",
	"https://www.googleapis.com/auth/userinfo.profile"
];

var oauth2Client = new google.auth.OAuth2(
	googleConfig.clientId,
	googleConfig.clientSecret,
	googleConfig.redirect
);

function getGooglePlusApi(auth) {
	return google.plus({ version: "v1", auth });
}

function createConnection() {
	return new google.auth.OAuth2(
		googleConfig.clientId,
		googleConfig.clientSecret,
		googleConfig.redirect
	);
}

var oauth = {};

oauth.loginUrl = function() {
	return oauth2Client.generateAuthUrl({
		// 'online' (default) or 'offline' (gets refresh_token)
		access_type: "offline",

		// If you only need one scope you can pass it as a string
		scope: scopes
	});
};

oauth.getUserData = async function(code) {
	var auth = createConnection();
	var data = await auth.getToken(code);
	var tokens = data.tokens;
	auth.setCredentials(tokens);
	var plus = getGooglePlusApi(auth);
	var me = await plus.people.get({ userId: "me" });
	var userGoogleId = me.data.id;
	var userGoogleEmail =
		me.data.emails && me.data.emails.length && me.data.emails[0].value;
	var userName = me.data.displayName;
	//console.log(me.data);
	return {
		id: userGoogleId,
		name: userName,
		email: userGoogleEmail,
		tokens: tokens
	};
};

module.exports = oauth;
