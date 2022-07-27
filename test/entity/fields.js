const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const { id } = require('../../src/customTypes/id')
const assert = require('assert')

describe('fields static getter', () => {
    it('should return the fields metadata from the entity', () => {
        const MyEntity = entity('MyEntity', {
            first: id(String),
            second: field(Number),
        })

        const fields = MyEntity.schema.fields

        assert.deepEqual(fields, [
            { ...id(String), name: 'first' },
            { ...field(Number), name: 'second' }
        ])
    })
})
