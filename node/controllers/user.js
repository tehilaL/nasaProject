const User = require('../models/User')
const { returnToken } = require('../jwt');
const Picture = require('../models/Picture');
const nodemailer=require('nodemailer')
const generator=require('generate-password')
//create new user
const singUp = async (req, res) => {
    try {
        const checkUser = await User.findOne({ password: req.body.password })
        if (!checkUser) {
            const newUser = await new User(req.body);
            const token = returnToken(req.body)
            await newUser.save()
            res.status(200).json({ newUser: newUser,token:token })
        }
        else {
            res.status(500).json({ message: "Password already in use Select a different password" })
        }
    }
    catch (err) {
        res.status(500).json({ message: "feiled to create user", error: err })
    }
}
//login
const login = async (req, res) => {
    try {
        const user = await User.findOne({ password: req.params.password})
        const token=returnToken(user);
        res.status(200).json({ message: "login...", user: user,token:token })
    }
    catch (err) {
        res.status(500).json({ message: "user not found", error: err })
    }
}
//update user
const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({ message: "user updated", "updated user": updatedUser })
    }
    catch (err) {
        res.status(500).json({ error: err + " failed to update user" })
    }
}
//delet user
const deleteUser = async (req, res) => {
    //צריך לעבור על כל התמונות ולמחוק את את היוזר מהרשימה של היוזרים
    try {
        await User.findByIdAndRemove(req.params.userId);
        res.status(200).send("user deleted!");
    }
    catch (err) {
        res.status(500).send("failed to delete user, error:" + err)
    }
}
//Brings a new password
const forgatPassword = async(req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email })
        console.log(user);
        if (user) {
            const password = generator.generate({
                length: 8,
                numbers: true
            });
            console.log(password);

            await user.update({ password: password })

            await user.save()
            // let transporter = nodemailer.createTransport({
            //     service: 'gmail',
            //     auth: {
            //         user: 'nasaprojectmail@gmail.com ',
            //         pass: '0548470766'
            //     }
            // });
            // console.log(user.email);
            // let mailOptions = {
            //     to: user.email,
            //     subject: 'your new password',
            //     text: `hi ${user.name}!
            //     your new password is ${password}`
            // };

            // transporter.sendMail(mailOptions, function(error, info) {
            //     if (error) {
            //         console.log(`error ${error}`);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });

            res.status(200).json({ message: "password updated", newPassword: password })
        } else {
            res.status(500).json({ error: err + " user not found" })
        }
    } catch (err) {
        res.status(500).json({ error: err + " failed to update password" })
    }
}


module.exports = { singUp, login, updateUser, deleteUser, forgatPassword }