const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    describe('with multiple fields', () => {

        const givenAnEntityWithMultipleFields = () => {
            const entity_ = entity('A entity', {
                field1: field(Number),
                field2: field(String),
                field3: field(Date),
                field4: field(Boolean)
            })
            return entity_
        }

        it('should initiate', () => {
            //given
            const entity_ = givenAnEntityWithMultipleFields()
            //then
            assert.equal(entity_.meta.name, 'A entity')
        })

        it('should set a value to multiple fields', () => {
            //given
            const entity_ = givenAnEntityWithMultipleFields()
            entity_.field1 = 1
            entity_.field2 = "1"
            entity_.field3 = new Date('2019-09-30T23:45:34.324Z')
            entity_.field4 = true
            //then
            assert.strictEqual(entity_['field1'], 1)
            assert.strictEqual(entity_['field2'], "1")
            assert.deepStrictEqual(entity_['field3'], new Date('2019-09-30T23:45:34.324Z'))
            assert.strictEqual(entity_['field4'], true)
        })

        it('should validate types and have valid value', () => {
            //given
            const entity_ = givenAnEntityWithMultipleFields()
            entity_.field1 = 1
            entity_.field2 = "1"
            entity_.field3 = new Date('2019-09-30T23:45:34.324Z')
            entity_.field4 = true
            //then
            assert.strictEqual(entity_.isValid(), true)
            assert.deepStrictEqual(entity_.errors, {})
        })

        it('should validate types and have invalid value', () => {
            //given
            const entity_ = givenAnEntityWithMultipleFields()
            entity_.field1 = "1"
            entity_.field2 = 1
            entity_.field3 = Date('2019-09-30T23:45:34.324Z')
            entity_.field4 = 1
            //then
            assert.strictEqual(entity_.isValid(), false)
            assert.deepStrictEqual(entity_.errors, {
                "field1": ["Field1 must be of type number"],
                "field2": ["Field2 must be of type string"],
                "field3": ["Field3 must be of type date"],
                "field4": ["Field4 must be of type boolean"]
            })
        })

    })
})