const mongoose = require('mongoose')
const InfluencerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    socialMedia: {
        type: Array
    },
    totalFollowers: {
        type: Number,
        default: 0
    }
}, { timestamps: true })



module.exports = mongoose.model('Influencer', InfluencerSchema)