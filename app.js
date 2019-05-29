const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const logger = require("morgan");
const crypto = require("crypto");

const indexRouter = require("./routes/router");
const db = require("./src/database.js");
const app = express();

// view engine setup
app.set("view engine", "hbs");

app.engine(
	"hbs",
	hbs({
		extname: "hbs",
		defaultView: "default",
		layoutsDir: __dirname + "/views/layouts/",
		partialsDir: __dirname + "/views/partials/"
	})
);

// Test DB
db.authenticate()
	.then(() => console.log("Database connected..."))
	.catch(err => console.log("Error: " + err));

app.use(logger("dev"));
app.use(
	session({
		key: "user_sid",
		secret: crypto.randomBytes(20).toString("hex"),
		resave: true,
		saveUninitialized: true,
		cookie: {
			expires: 600000
		}
	})
);
app.use(express.static("public/"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

module.exports = app;
