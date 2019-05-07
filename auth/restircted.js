
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

function restricted (req, res, next){
	const {username, password} = req.headers
		// check if thee user exist
		// and the password is correct
		if(req.session && req.session.username){
			next()
		}else{
			res.status('401').json({error: 'You are not authorized to access this page'})
		}
}


module.exports = {
	restricted,
}
