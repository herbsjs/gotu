const { entity } = require('../../../src/entity')
const { field } = require('../../../src/field')
const assert = require('assert')

describe('A field', () => {

    describe('with a string type', () => {

        const givenAnEntityWithAStringField = () => {
            const AnEntity = entity('A entity', {
                field1: field(String)
            })
            return new AnEntity()
        }

        it('should set a default value to a field', () => {
            //given
            const instance = givenAnEntityWithAStringField()
            //then
            assert.strictEqual(instance['field1'], "")
        })

        it('should validate type and have valid value', () => {
            //given
            const instance = givenAnEntityWithAStringField()
            instance.field1 = "1"
            //then
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate type and have invalid value', () => {
            //given
            const instance = givenAnEntityWithAStringField()
            instance.field1 = 1
            //then
            assert.strictEqual(instance.isValid(), false)
            assert.deepStrictEqual(instance.errors, { field1: ["Field1 must be of type string"] })
        })

    })
})