const CustomAPIError = require('../errors/custom-error')
const notFound = (req, res) => {
    throw new CustomAPIError('Route not found', 500)
}
module.exports = notFound