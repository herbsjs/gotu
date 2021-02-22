const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('An entity', () => {

    describe('with multiple fields', () => {

        const NewEntity = entity('New Entity', {
            f1: field(String)
        })
        
        const givenAnEntityWithMultipleFields = () => {
            const AnEntity = entity('An entity', {
                field1: field(Number),
                field2: field(String),
                field3: field(Date),
                field4: field(Boolean),
                field5: field(NewEntity),
                field6: field([NewEntity])
            })
            return new AnEntity()
        }

        it('should initiate', () => {
            //given
            const instance = givenAnEntityWithMultipleFields()
            //then
            assert.equal(instance.meta.name, 'An entity')
        })

        it('should set a value to multiple fields', () => {
            //given
            const instance = givenAnEntityWithMultipleFields()
            //when
            instance.field1 = 1
            instance.field2 = "1"
            instance.field3 = new Date('2019-09-30T23:45:34.324Z')
            instance.field4 = true
            const newEntity = new NewEntity()
            newEntity.f1 = "abc"
            instance.field5 = newEntity
            instance.field6 = [newEntity]
            //then
            assert.strictEqual(instance['field1'], 1)
            assert.strictEqual(instance['field2'], "1")
            assert.deepStrictEqual(instance['field3'], new Date('2019-09-30T23:45:34.324Z'))
            assert.strictEqual(instance['field4'], true)
            assert.deepStrictEqual(instance['field5'], newEntity)
            assert.deepStrictEqual(instance['field5'].f1, "abc")
            assert.deepStrictEqual(instance['field6'][0], newEntity)
            assert.deepStrictEqual(instance['field6'][0].f1, "abc")
        })

        it('should validate types and have valid value', () => {
            //given
            const instance = givenAnEntityWithMultipleFields()
            instance.field1 = 1
            instance.field2 = "1"
            instance.field3 = new Date('2019-09-30T23:45:34.324Z')
            instance.field4 = true
            const newEntity = new NewEntity()
            newEntity.f1 = "abc"
            instance.field5 = newEntity
            instance.field6 = [newEntity]
            //then
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate types and have invalid value', () => {
            //given
            const instance = givenAnEntityWithMultipleFields()
            instance.field1 = "1"
            instance.field2 = 1
            instance.field3 = Date('2019-09-30T23:45:34.324Z')
            instance.field4 = 1
            instance.field5 = "text"
            instance.field6 = ["false"]
            //then
            assert.strictEqual(instance.isValid(), false)
            assert.deepStrictEqual(instance.errors, {
                "field1": [{wrongType: 'Number'}],
                "field2": [{wrongType: 'String'}],
                "field3": [{wrongType: 'Date'}],
                "field4": [{wrongType: 'Boolean'}],
                "field5": [{wrongType: 'New Entity'}],
                "field6": [{wrongType: ['New Entity']}]
            })
        })

    })
})