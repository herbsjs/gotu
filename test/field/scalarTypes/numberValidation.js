const { entity } = require('../../../src/entity')
const { field } = require('../../../src/field')
const assert = require('assert')

describe('A field', () => {

    describe('with a number type', () => {

        const givenAnEntityWithANumberField = () => {
            const entity_ = entity('A entity', {
                field1: field(Number)
            })
            return entity_
        }

        it('should set a default value to a field', () => {
            //given
            const entity_ = givenAnEntityWithANumberField()
            //then
            assert.strictEqual(entity_['field1'], 0)
        })

        it('should validate type and have valid value', () => {
            //given
            const entity_ = givenAnEntityWithANumberField()
            entity_.field1 = 1
            //then
            assert.strictEqual(entity_.isValid(), true)
            assert.deepStrictEqual(entity_.errors, {})
        })

        it('should validate type and have invalid value', () => {
            //given
            const entity_ = givenAnEntityWithANumberField()
            entity_.field1 = "1"
            //then
            assert.strictEqual(entity_.isValid(), false)
            assert.deepStrictEqual(entity_.errors, { field1: ["Field1 must be of type number"] })
        })

    })
})