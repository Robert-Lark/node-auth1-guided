const bcrypt = require("bcryptjs")
const Users = require("./users-Model")

function restrict() {
	return async (req,res,next) => {
		try {
			const { username, password } = req.headers
			if (!username || !password) {
				return res.status(401).json({
					message: "Invalid Credentials"
				})
			}
			const user = await Users.findBy({ username }).first()
			if (!user) {
				return res.status(401).json({
					message: "Invalid Credentials"
				})
			}

			const passwordValid = await bcrypt.compare(password, user.password)
			if (!passwordValid) {
				return res.status(401).json({
					message: "Invalid Credentials",
				})
			}
			next()
		} catch (err) {
		next(err)
		}
	}
}

module.exports = {
	restrict,
}