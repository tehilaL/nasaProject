const router = require('express').Router()
const user = require('../controllers/user')
const picture = require('../controllers/picture')
const authentication = require('../middelwares/authentication')

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

router.post('/singUp', user.singUp);
router.get('/login/:name/:password', user.login);
router.get('/returnPictures',authentication, picture.returnPictures)
router.get('/getAllPictures', picture.getAllPictures)
router.post('/saveUsersPicture',authentication, picture.saveUsersPicture);
router.delete('/deletePictureFromUser/:pictureId',authentication, picture.deletePictureFromUser);
router.get('/forgatPassword/:email', user.forgatPassword);

module.exports = router