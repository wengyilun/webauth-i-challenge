
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const Users = require('./users/users-model')
const bcrypt = require('bcryptjs')
const {restricted, loginCheck} = require('./auth/restircted')
const session = {
}
const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())

app.use('/api/restricted', restricted)



app.get('/', (req, res) => {
	res.status(200).json({message:'Welcome'})
})

app.post('/api/register',  (req, res) => {
	const user = req.body
	const hash = bcrypt.hashSync(user.password, 14)
	user.password = hash
	
	Users.addUser(user)
		.then( user => {
			res.status(201).send(user)
		})
		.catch(e => {
			console.error(e)
			res.status(500).json(e)
		})
})


app.post('/api/login', (req, res) => {
	let {username, password} = req.body
	Users.findBy({username})
		.first()
		.then( user => {
			if(user){
				// username found, but password incorrect
				if(!username || !password || !bcrypt.compareSync(password, user.password)){
					return res.status('401').json({error:  'Incorrect credentials'})
				}
				session.loggedInUser = user.id
				res.status('201').json({message: `Logged in`, loggedInUser:user.id})
				// res.status('201').json({message: `Welcome ${user.username}`})
				
			}else{
				// no username is found
				res.status(401).json({ message: 'Your shall not pass' });
			}
		})
		.catch(e => {
			console.error(e)
			res.status(500).json(e)
		})
})

app.get('/api/restricted', (req, res) => {
	 res.status(200).json({message:	`Welcome to restricted area ${session.loggedInUser}`})
})

app.get('/api/users', restricted, (req, res) => {
	Users.findUsers()
	.then( users => {
		// if(users && restricted())
		res.status(200).send(users)
	})
	.catch(e => {
		console.error(e)
		res.status(500).json({error: "Error retrieving users"})
	})
})

app.delete('/api/users', restricted, (req, res) => {
	Users.findUsers()
	.then( users => {
		// if(users && restricted())
		res.status(200).send(users)
	})
	.catch(e => {
		console.error(e)
		res.status(500).json({error: "Error retrieving users"})
	})
})


app.listen(3000, () => {
	console.log('Server running on port 3000')
})
