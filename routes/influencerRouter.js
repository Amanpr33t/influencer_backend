const express = require('express')
const router = express.Router()
const { addInfluencer, getInfluencers, deleteInfluencer, editInfluencer, sortInfluencers, searchInfluencers } = require('../controllers/influencers')

router.post('/add', addInfluencer)
router.get('/all_influencers', getInfluencers)
router.get('/sort', sortInfluencers)
router.delete('/delete/:id', deleteInfluencer)
router.patch('/edit/:id', editInfluencer)
router.get('/search_influencer', searchInfluencers)

module.exports = router