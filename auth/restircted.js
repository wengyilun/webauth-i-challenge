
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')

function restricted (req, res, next){
	const {username, password} = req.headers
		// check if thee user exist
		// and the password is correct
		Users.findBy({username: username})
			.first()
			.then( user => {
				if(user && bcrypt.compareSync(password, user.password)){
					next()
				}else{
					return res.status('401').json({message: 'You shall not pass'})
				}
			})
			.catch(e => {
				res.status('401').json({error: 'You are not authorized to access this page'})
			})
}


module.exports = {
	restricted,
}
