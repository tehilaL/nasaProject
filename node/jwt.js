const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();

function returnToken(user) {
    const token = jwt.sign(user.password, process.env.SECRET)
    return token
}

function returnUser(token) {
    return jwt.verify(token, process.env.SECRET)
}
module.exports = { returnToken, returnUser }