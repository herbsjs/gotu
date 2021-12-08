const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const { id } = require('../../src/customTypes/id')
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
                field6: field([NewEntity]),
                field7: id(Number),
                field8: id(Date),
                field9: field(Number, { isId: true }),
                field10: id(Number, { validation: { length: { is: 10 }  }})
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

        it('should have multiple instances with isolated valued from each other', () => {
            //given
            const instance1 = givenAnEntityWithMultipleFields()
            const instance2 = givenAnEntityWithMultipleFields()

            //when
            instance1.field1 = 1
            instance1.field2 = "1"
            instance1.field3 = new Date('2019-09-30T23:45:34.324Z')
            instance1.field4 = true
            const newEntity = new NewEntity()
            newEntity.f1 = "abc"
            instance1.field5 = newEntity
            instance1.field6 = [newEntity]

            const instance3 = givenAnEntityWithMultipleFields()

            //then
            assert.strictEqual(instance1['field1'], 1)
            assert.strictEqual(instance1['field2'], "1")
            assert.deepStrictEqual(instance1['field3'], new Date('2019-09-30T23:45:34.324Z'))
            assert.strictEqual(instance1['field4'], true)
            assert.deepStrictEqual(instance1['field5'], newEntity)
            assert.deepStrictEqual(instance1['field5'].f1, "abc")
            assert.deepStrictEqual(instance1['field6'][0], newEntity)
            assert.deepStrictEqual(instance1['field6'][0].f1, "abc")

            assert.strictEqual(instance2['field1'], undefined)
            assert.strictEqual(instance2['field2'], undefined)
            assert.deepStrictEqual(instance2['field3'], undefined)
            assert.strictEqual(instance2['field4'], undefined)
            assert.deepStrictEqual(instance2['field5'], undefined)
            assert.deepStrictEqual(instance2['field6'], undefined)

            assert.strictEqual(instance3['field1'], undefined)
            assert.strictEqual(instance3['field2'], undefined)
            assert.deepStrictEqual(instance3['field3'], undefined)
            assert.strictEqual(instance3['field4'], undefined)
            assert.deepStrictEqual(instance3['field5'], undefined)
            assert.deepStrictEqual(instance3['field6'], undefined)
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

        it('should set a field as ID and have valid entity', () => {
            //given
            const instance = givenAnEntityWithMultipleFields()
            instance.field7 = 1
            instance.field8 = new Date('2021-12-12')

            //then
            assert.strictEqual(instance.__proto__.meta.schema.field7.options.isId, true)
            assert.strictEqual(instance.__proto__.meta.schema.field8.options.isId, true)
            assert.strictEqual(instance['field7'], 1)
            assert.strictEqual(instance['field8'].getTime(), new Date('2021-12-12').getTime())
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })


        it('should set a field as ID using field with isId option', () => {
          //given
          const instance = givenAnEntityWithMultipleFields()
          instance.field9 = 1

          //then
          assert.strictEqual(instance.__proto__.meta.schema.field9.options.isId, true)
          assert.strictEqual(instance['field9'], 1)
          assert.strictEqual(instance.isValid(), true)
          assert.deepStrictEqual(instance.errors, {})
      })

        it('should validate types with invalid ID value', () => {
          //given
          const instance = givenAnEntityWithMultipleFields()
          instance.field7 = '1'
          //then
          assert.strictEqual(instance.isValid(), false)
          assert.strictEqual(instance['field7'], '1')
          assert.deepStrictEqual(instance.errors, {
            "field7": [{wrongType:'Number'}]
        })
      })

        it('should validate types with invalid ID value, but ignore errors using isValid({exceptIDs: true})', () => {
          //given
          const instance = givenAnEntityWithMultipleFields()
          instance.field7 = '1'
          //then
          assert.strictEqual(instance.isValid({exceptIDs: true}), true)
          assert.strictEqual(instance['field7'], '1')
          assert.deepStrictEqual(instance.errors, {})
      })

      it('should validate types with valid ID value but with wrong length validation', () => {
        //given
        const instance = givenAnEntityWithMultipleFields()
        instance.field10 = 12345678
        //then
        assert.strictEqual(instance.isValid(), false)
        assert.strictEqual(instance['field10'], 12345678)
        assert.deepStrictEqual(instance.errors, {
          "field10": [{wrongLength:10}]
      })
    })

    })
})
