const { field } = require('../field')

const id = (type, options) => {
  return field(type, { ...options, isId: true })
}

module.exports = { id }
