const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const { id } = require('../../src/customTypes/id')
const assert = require('assert')

describe('ids static getter', () => {
    it('should return the ids fields metadata from the entity', () => {
        const MyEntity = entity('MyEntity', {
            first: id(String),
            second: field(Number, { isId: true }),
            third: field(Number),
        })

        const fields = MyEntity.schema.ids

        assert.deepEqual(fields, [
            { ...id(String), name: 'first' },
            { ...field(Number), name: 'second', options: { isId: true } }
        ])
    })
})
