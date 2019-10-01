const { entity } = require('../../../src/entity')
const { field } = require('../../../src/field')
const assert = require('assert')

describe('A field', () => {

    describe('with a boolean type', () => {

        const givenAnEntityWithABooleanField = () => {
            const entity_ = entity('A entity', {
                field1: field(Boolean)
            })
            return entity_
        }

        it('should validate type and have valid value', () => {
            //given
            const entity_ = givenAnEntityWithABooleanField()
            entity_.field1 = true
            //then
            assert.strictEqual(entity_.isValid(), true)
            assert.deepStrictEqual(entity_.errors, {})
        })

        it('should validate type and have invalid value', () => {
            //given
            const entity_ = givenAnEntityWithABooleanField()
            entity_.field1 = 1
            //then
            assert.strictEqual(entity_.isValid(), false)
            assert.deepStrictEqual(entity_.errors, { field1: ["Field1 must be of type boolean"] })
        })

    })
})