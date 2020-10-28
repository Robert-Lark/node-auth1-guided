const express = require("express");
const Users = require("./users-model");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { restrict } = require("./users-middleware");

router.get("/users", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find());
	} catch (err) {
		next(err);
	}
});

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			});
		}

		const newUser = await Users.add({
			username,
			//hash the password with a time complexity of 10
			password: await bcrypt.hash(password, 13),
		});

		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			});
		}
		// creates a new session and sends it back to the client
		req.session.user = user;
		res.json({
			message: `Welcome ${user.username}!`,
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;
