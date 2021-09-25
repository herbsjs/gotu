const { entity } = require('./entity')
const { field } = require('./field')
const { id } = require('./id')

const Customer = entity('Customer', {
  id: id(Number),
  name: field(String),
})

const CustomerTwo = entity('Customer', {
  id: field(Number, { isId: true }),
  name: field(String),
})

const CustomerTree = entity('Customer', {
  id: field(Date, { isId: true }),
  name: field(String),
})

// eslint-disable-next-line no-console
console.log(Customer, CustomerTwo, CustomerTree)
