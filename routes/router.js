const express = require("express");
const router = express.Router();
const sessionChecker = require("./sessionCheckerMiddleman");

router.get("/", sessionChecker.all, require("./index").GET);

router.get("/overview", sessionChecker.teacher, require("./overview").GET);

router.get("/profile/:id", require("./profile").GET);
router.get("/exportProfile/:id", require("./exportProfile").GET);

router.get("/verify/:id/:userid/:dateAdded", require("./verify").GET);

router.post("/verify/:id/:userid/:dateAdded", require("./verify").POST);

router.get(
	"/removeClass/:id",
	sessionChecker.teacher,
	require("./removeClass").GET
);

router.get("/massAdd", sessionChecker.teacher, require("./massAdd").GET);

router.get("/delete/:id", sessionChecker.student, require("./delete").GET);

router.get("/err/:id", require("./err").GET);

router.get("/logout", sessionChecker.all, require("./logout").GET);

router.post(
	"/addStudent",
	sessionChecker.teacher,
	require("./addStudent").POST
);

router.post("/addJob", sessionChecker.student, require("./addJob").POST);

router.get("/login", require("./login").GET);

router.get("/auth", require("./auth").GET);

router.post("/auth", require("./auth").POST);

module.exports = router;
