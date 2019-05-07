const Users = require('../users/users-model')
const router = require('express').Router()
const {restricted} = require('../auth/restircted')

router.get('/', restricted, (req, res) => {
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


module.exports = router