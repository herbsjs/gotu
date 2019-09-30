const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    describe('the simplest entity', () => {

        const givenTheSimplestEntity = () => {
            const entity_ = entity('A entity', {
                aField: field(Number)
            })
            return entity_
        }

        it('should initiate', () => {
            //given
            const entity_ = givenTheSimplestEntity()
            //then
            assert.equal(entity_.description, 'A entity')
        })
    })
})