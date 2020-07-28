const {Router} = require('express')
const router = Router()

router.get('/', (req, resp) => {
    resp.render('main', {
        title: 'Main page',
        isHome: true
    })
})

module.exports = router