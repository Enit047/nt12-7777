const {Router} = require('express')
const User = require('../modules/user')
const router = Router()

router.get('/', (req, resp) => {
    resp.render('profile', {
        title: 'Profile of user',
        isProfile: true,
        user: req.user.toObject()
    })
})
router.post('/edit', async (req, resp) => {
    try {
        const user = await User.findById(req.user._id)

        const objToChange = {
            name: req.body.name
        }
        
        if(req.file) {
            objToChange.userAvatar = req.file.path
        }

        Object.assign(user, objToChange)
        await user.save()
        resp.redirect('/profile')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router