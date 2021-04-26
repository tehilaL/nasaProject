const { returnUser } = require("../jwt");
const User = require("../models/User");
const { lock } = require("../routes/api");

const authentication = async (req, res, next) => {
    try {
        console.log('user');
console.log(req.headers.token);
        const password = returnUser(req.headers.token);
        console.log(password);
        const user=await User.findOne({password:password})
        console.log(user);
        if (user) {
            let myUser = await User.findOne({ password: user.password })
            req.params.userId = myUser._id
            return next();
        }
    }
    catch (err) {
        res.status(500).json({ error: err + " failed to find, invalid token." })
    }
}

module.exports = authentication;