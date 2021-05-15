const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    describe('with validation', () => {

        const givenAnEntityWithValidation = (type, validation) => {
            const AnEntity = entity('A entity', {
                field1: field(type, { validation }),
                field2: field(String, { default: "value2" })
            })
            return new AnEntity()
        }

        const examples =
            [
                { type: String, value: "1234", validation: { custom: { invalidCardNumber: (value) => value.length === 16 } }, errors: { field1: [{ invalidCardNumber: true }] } },
                { type: Number, value: 1, validation: { numericality: { greaterThan: 10 } }, errors: { field1: [{ notGreaterThan: 10 }] } },
                { type: String, value: '', validation: { presence: true }, errors: { field1: [{ cantBeEmpty: true }] } },
                { type: String, value: null, validation: { presence: true }, errors: { field1: [{ cantBeEmpty: true }] } },
                { type: String, value: "1", validation: { length: { minimum: 10 } }, errors: { field1: [{ isTooShort: 10 }] } },
                { type: String, value: "http://##", validation: { url: true }, errors: { field1: [{ invalidURL: true }] } },
                { type: String, value: "abc.example.com", validation: { email: true }, errors: { field1: [{ invalidEmail: true }] } },
                { type: String, value: "xlarge", validation: { contains: { allowed: ["small", "medium", "large"] } }, errors: { field1: [{ notContains: ["small", "medium", "large"] }] } },
                { type: String, value: "small", validation: { contains: { notAllowed: ["small", "medium", "large"] } }, errors: { field1: [{ contains: ["small", "medium", "large"] }] } },
                { type: String, value: "05547-022", validation: { format: /^[0-9]{8}$/ }, errors: { field1: [{ invalidFormat: true }] } },
                { type: Boolean, value: null, validation: { presence: true }, errors: { field1: [{ cantBeEmpty: true }] } },
                { type: Date, value: new Date('2040-01-01'), validation: { datetime: { before: new Date('2020-01-01') } }, errors: { field1: [{ tooLate: new Date('2020-01-01') }] } },
                { type: Date, value: new Date('2020-01-01'), validation: { datetime: { after: new Date('2040-01-01') } }, errors: { field1: [{ tooEarly: new Date('2040-01-01') }] } },
            ]

        examples.forEach(example => {
            it(`should validate a ${example.type.name} type field`, () => {
                //given
                const instance = givenAnEntityWithValidation(example.type, example.validation)
                //when
                instance.field1 = example.value
                //then
                assert.strictEqual(instance.isValid(), false)
                assert.deepStrictEqual(instance.errors, example.errors)
            })
        })

    })

    describe('with multiple entities', () => {

        it('should return errors isoleted from each instances', () => {

            //given
            const AnEntity =
                entity('A entity', {
                    field1: field(Number, { validation: { presence: true } }),
                })
            const instance1 = new AnEntity()
            const instance2 = new AnEntity()
            
            //when
            instance1.field1 = 1
            instance1.validate()
            instance2.validate()

            //then
            assert.deepStrictEqual(instance1.errors, {})
            assert.deepStrictEqual(instance2.errors, { field1: [{ cantBeEmpty: true }] })

        })
    })
})
