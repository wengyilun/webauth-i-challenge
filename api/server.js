
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const Users = require('../users/users-model')
const userRouter = require('../users/users-router')
const authRouter = require('../auth/auth-router')
const bcrypt = require('bcryptjs')
const {restricted} = require('../auth/restircted')
const session = require('express-session')

const sessionConfig = {
    name: "gatekeeper",
    secret: "Another day, another hope. But keep trying",
    cookie:{
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: false
    },
    resave: false,
    saveUninitialized: true
}

const app = express()
app.use(session(sessionConfig))
app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.get('/api/restricted', restricted, (req, res) => {
	res.status(200).json({message:'Welcome to the restricted area!!!'})
})

app.get('/', (req, res) => {
    const username = req.session.username || 'stranger'
	res.status(200).send(`Hello ${username}`)
})


module.exports = app