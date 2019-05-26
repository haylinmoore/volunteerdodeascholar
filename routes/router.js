const express = require("express");
const router = express.Router();

// middleware function to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.valid && req.session.user) {
		next();
	} else {
		res.redirect("/login");
	}
};

router.get("/", sessionChecker, require("./index.js").GET);

router.get("/overview", sessionChecker, require("./overview.js").GET);

router.get("/profile/:id", require("./profile.js").GET);

router.get("/verify/:id", require("./verify.js").GET);

router.post("/verify/:id", require("./verify.js").POST);

router.get("/removeClass/:id", sessionChecker, require("./removeClass.js").GET);

router.get("/delete/:id", sessionChecker, require("./delete.js").GET);

router.get("/err/:id", require("./err.js").GET);

router.get("/logout", sessionChecker, require("./logout.js").GET);

router.post("/addStudent", sessionChecker, require("./addStudent.js").POST);

router.post("/addJob", sessionChecker, require("./addJob.js").GET);

router.get("/login", require("./login.js").GET);

router.get("/auth", require("./auth.js").GET);

router.post("/auth", require("./auth.js").POST);

module.exports = router;
