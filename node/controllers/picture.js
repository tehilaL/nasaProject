const request = require('request');
const Picture = require('../models/Picture')
const User = require('../models/User')
const fetch = require('node-fetch')
//get picture
const returnPictures = async (req, res) => {
    try {
        const id = req.params.userId;
        const day = new Date().toISOString().slice(0, 10)
        const checkPicture = await Picture.findOne({ date: day });
        console.log('hhh');
        let newPicture = checkPicture;
        if (!checkPicture) {
            const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=7wHpydb5LAXWZsRnl0g5MYZvHwg3OVLKTfsfbuwA&hd=true')
            const picture = await response.json()
            if (!picture)
                res.status(500).json({ message: "failed" })
            newPicture = new Picture({
                date: new Date().toISOString().slice(0, 10),
                explanation: picture.explanation,
                "media_type": picture.media_type,
                title: picture.title,
                url: picture.url,
                userId: id
            })
            await newPicture.save();
            await User.findByIdAndUpdate(id, { $push: { pictures: newPicture._id } })
        } else {
            const users = newPicture.userId;
            const check = users.forEach(user => {
                if (user == id) {
                    return true;
                }
                return false;
            });
            if (!check) {
                await newPicture.update({ $push: { userId: id } })
                await newPicture.save();
                await User.findByIdAndUpdate(id, { $push: { pictures: newPicture._id } })
            }
        }
        const pictures = await User.findById(id).populate( 'pictures' )
        console.log(pictures);
        // const pictures = await Picture.find().populate({path:'userId',match:{_id:id}})
        // const pictures = await Picture.find()
        res.status(200).json({ message: "Succeeded", newPicture: newPicture, pictures: pictures.pictures })

    } catch (err) {
        res.status(500).json({ message: "failed", error: err })

    }
}

//save users picture
const saveUsersPicture = async (req, res) => {
    try {
        console.log('vx');
        const id = req.params.userId;
        const picture = req.body
        console.log(id);
        const newPicture = new Picture({
            date: picture.date,
            explanation: picture.explanation,
            "media_type": picture.media_type,
            title: picture.title,
            url: picture.url,
            userId: id
        })
        await newPicture.save();
        console.log('newPicture');
        console.log(newPicture);

        await User.findByIdAndUpdate(id, { $push: { pictures: newPicture._id } })
        res.status(200).json({ message: "saved", newPicture: newPicture })
    }
    catch (err) {
        res.status(500).json({ message: "failed" })
    }
}
//delet picture from user
const deletePictureFromUser = async (req, res) => {
    try {
        let user = await User.findById(req.params.userId)
        const picture = await Picture.findById(req.params.pictureId);
        console.log(user);
        if (picture.userId.length == 1) {
            console.log('fgdh');
            await picture.remove();
        }
        else
            await Picture.findByIdAndUpdate(req.params.pictureId, { $pull: { userId: req.params.userId } });
        await User.findByIdAndUpdate(req.params.userId, { $pull: { pictures: req.params.pictureId } })
        user = await User.findById(req.params.userId)
        console.log(user);
        res.status(200).json({ message: "picture deleted!" });
    }
    catch (err) {
        res.status(500).send("failed to delete picture, error:" + err)
    }
}

const getAllPictures = async (req, res) => {
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=vae7AaeOdC3D73amFB3K12TemhIeOlSqHt07kqSq&hd=true&count=30')
        const pictures = await response.json()
        // console.log(response);
        res.status(200).json({ pictures: pictures })
    } catch (err) {
        res.status(500).send(err)
    }
}

module.exports = { returnPictures, saveUsersPicture, deletePictureFromUser, getAllPictures }

