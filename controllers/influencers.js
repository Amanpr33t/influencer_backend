const CustomAPIError = require('../errors/custom-error')
const Influencer = require('../models/influencer')
const { StatusCodes } = require('http-status-codes')


const addInfluencer = async (req, res, next) => {
    try {
        const { name, socialMedia } = req.body
        let totalFollowers = 0

        socialMedia && socialMedia.length > 0 && socialMedia.map(social => {
            return totalFollowers += +social.followers
        })
        if (!name) {
            throw new CustomAPIError('Influencer name not added', 204)
        }
        await Influencer.create({ ...req.body, totalFollowers })
        return res.status(StatusCodes.CREATED).json({ status: 'ok', msg: 'Influencer data has been added successfully' })
    } catch (error) {
        next(error)
    }
}


const getInfluencers = async (req, res, next) => {
    try {
        const allInfluencers = await Influencer.find({})
        return res.status(StatusCodes.OK).json({ status: 'ok', count: allInfluencers.length, influencers: allInfluencers })
    } catch (error) {
        next(error)
    }
}


const searchInfluencers = async (req, res, next) => {
    try {
        const allInfluencers = await Influencer.find({})
        if (!req.query.search) {
            throw new CustomAPIError('No search data given', 204)
        }
        let searchedInfluencers = []
        allInfluencers.map((influencer) => {
            if (influencer.name.toLowerCase().includes(req.query.search.toLowerCase())) {
                return searchedInfluencers.push(influencer)
            }
            if (influencer.socialMedia.length > 0) {
                influencer.socialMedia.forEach((social) => {
                    if (social.handle.toLowerCase() === req.query.search.toLowerCase()) {
                        searchedInfluencers = []
                        searchedInfluencers.push(influencer)
                    }
                })
            }
            return
        })
        return res.status(StatusCodes.OK).json({ status: 'ok', count: searchedInfluencers.length, influencers: searchedInfluencers })

    } catch (error) {
        next(error)
    }
}



const sortInfluencers = async (req, res, next) => {
    try {
        const { sortByName, sortByFollowers } = req.query
        if (sortByName === 'true' && sortByFollowers === 'true') {
            throw new CustomAPIError('Cannot sort by both name and followers', 403)
        }
        const allInfluencers = await Influencer.find({})
        let sortedInfluencers = []

        if (sortByName && sortByName === 'true') {
            sortedInfluencers = allInfluencers.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        }
        if (sortByFollowers && sortByFollowers === 'true') {
            sortedInfluencers = allInfluencers.sort(function (a, b) {
                if (a.totalFollowers < b.totalFollowers) {
                    return 1;
                }
                if (a.totalFollowers > b.totalFollowers) {
                    return -1;
                }
                return 0;
            });
        }

        return res.status(StatusCodes.OK).json({ status: 'ok', count: sortedInfluencers.length, influencers: sortedInfluencers })

    } catch (error) {
        next(error)
    }
}


const deleteInfluencer = async (req, res, next) => {
    try {
        const influencer = await Influencer.findOneAndDelete({
            _id: req.params.id
        })
        if (!influencer) {
            throw new CustomAPIError('Influencer not found', 204)
        }
        return res.status(StatusCodes.OK).send({ status: 'ok', msg: 'Influencer has been removed' })
    } catch (error) {
        next(error)
    }
}

const editInfluencer = async (req, res) => {
    try {
        const influencer = await Influencer.findOne({ _id: req.params.id })

        const { socialMedia } = req.body
        let totalFollowers = 0
        socialMedia && socialMedia.length > 0 && socialMedia.map(social => {
            return totalFollowers += +social.followers
        })

        if (!influencer) {
            throw new CustomAPIError('Influencer not found', 204)
        }
        const updatedInfluencer = await Influencer.findOneAndUpdate({
            _id: req.params.id
        },
            { ...req.body, totalFollowers },
            { new: true, runValidators: true })
        return res.status(StatusCodes.OK).json({ status: 'ok', msg: 'Influencer has been updated' })
    } catch (error) {
        next(error)
    }

}

module.exports = {
    addInfluencer,
    getInfluencers,
    deleteInfluencer,
    editInfluencer,
    sortInfluencers,
    searchInfluencers
}
