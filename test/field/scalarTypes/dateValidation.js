const { entity } = require('../../../src/entity')
const { field } = require('../../../src/field')
const assert = require('assert')

describe('A field', () => {

    describe('with a date type', () => {

        const givenAnEntityWithADateField = () => {
            const entity_ = entity('A entity', {
                field1: field(Date)
            })
            return entity_
        }

        it('should validate type and have valid value', () => {
            //given
            const entity_ = givenAnEntityWithADateField()
            entity_.field1 = new Date('2019-09-30T23:45:34.324Z')
            //then
            assert.strictEqual(entity_.isValid(), true)
            assert.deepStrictEqual(entity_.errors, {})
        })

        it('should validate type and have invalid value', () => {
            //given
            const entity_ = givenAnEntityWithADateField()
            entity_.field1 = Date('2019-09-30T23:45:34.324Z')
            //then
            assert.strictEqual(entity_.isValid(), false)
            assert.deepStrictEqual(entity_.errors, { field1: ["Field1 must be of type date"] })
        })

    })
})