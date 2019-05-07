const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')
const router = require('express').Router()

router.post('/register',  (req, res) => {
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


router.post('/login', (req, res) => {
	let {username, password} = req.body
	Users.findBy({username})
	.first()
	.then( user => {
		if(user){
			if(!username || !password || !bcrypt.compareSync(password, user.password)){
				return res.status('401').json({error:  'Incorrect credentials'})
			}

			req.session.username = user.username
			res.status('201').json({message: `Welcome back, ${user.username}!`})


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

router.get('/logout', (req, res) => {
	if(req.session){
		req.session.destroy(err => {
			if(err){
				res.status(401).json({ error: 'There was an error' });
			}else{
				res.status(200).json({ message: 'session destroyed'})
			}
		})
	}
})

module.exports = router