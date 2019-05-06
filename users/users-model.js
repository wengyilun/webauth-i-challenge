const db = require('../data/dataConfig')

function findUsers(){
	return db('users')
			.select('id', 'username', 'password')
}

function findBy(filter){
	return db('users')
			.where(filter)
}


function findById(id){
	return db('users')
			.where({id: id})
			.first()
}


async function addUser(user){
	const [id] = await db('users').insert(user)
	return findById(id)
}

// function updateUser(user){
// 	return db('users')
// 			.where({username:user.username})
// }

async function deleteUser(user){
	const [id] = await db('users')
					.where({username:user.username})
	return findById(id)
}


module.exports = {
	findUsers,
	findBy,
	findById,
	addUser,
	deleteUser
}
