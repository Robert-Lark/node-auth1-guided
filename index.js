const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
	resave: false, // avoid creating sessions that have not changed
	saveUninitialized: false, //GDPR laws agains setting cookies automatically
secret: "string" // used to cryptographically sign the cookie
}))
server.use(usersRouter)

server.use((err, req, res, next) => {
	console.log(err)
	
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})
