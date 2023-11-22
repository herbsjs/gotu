const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')
const { id } = require('../../src/customTypes/id')

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

    describe('with ID validation', () => {
        it('should ignore errors on IDs', () => {
            //given
            const AnEntity = entity('A entity', {
                field1: id(Number, { validation: { presence: true } }),
                field2: field(String, { validation: { presence: true } }),
                field3: field(Number, { validation: { presence: true } }),
            })
            const instance = new AnEntity()

            //when
            instance.field1 = undefined
            instance.field2 = 'value2'
            instance.field3 = 3
            instance.validate({ exceptIDs: true })

            //then
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate errors only on IDs', () => {
            //given
            const AnEntity = entity('A entity', {
                field1: id(Number, { validation: { presence: true } }),
                field2: field(String, { validation: { presence: true } }),
                field3: field(Number, { validation: { presence: true } }),
            })
            const instance = new AnEntity()

            //when
            instance.field1 = undefined
            instance.field2 = undefined
            instance.field3 = undefined
            instance.validate({ onlyIDs: true })

            //then
            assert.deepStrictEqual(instance.errors, { field1: [{ cantBeEmpty: true }] })
        })
    })

    describe('with reference validation', () => {
        it('should validate errors on references', () => {
            //given
            const AnEntity1 = entity('A entity', {
                id1: id(Number, { validation: { presence: true } }),
                field1: field(String, { validation: { presence: true } })
            })
            const AnEntity2 = entity('A entity', {
                id2: id(Number, { validation: { presence: true } }),
                field2: field(String, { validation: { presence: true } }),
                fieldEntity2: field(AnEntity1, { validation: { presence: true } }),
                fieldEntities2: field([AnEntity1], { validation: { presence: true } })
            })
            const AnEntity3 = entity('A entity', {
                id3: id(Number, { validation: { presence: true } }),
                field3: field(String, { validation: { presence: true } }),
                fieldEntity3: field(AnEntity2, { validation: { presence: true } })
            })
            const instance = AnEntity3.fromJSON({
                id3: '3',
                field3: undefined,
                fieldEntity3: {
                    id2: 2,
                    field2: 'value2',
                    fieldEntity2: { id1: undefined, field1: 'value1' },
                    fieldEntities2: [
                        { id1: '1', field1: undefined },
                        { id1: undefined, field1: 'value1' }]
                }
            })

            //when
            instance.validate()

            //then
            assert.deepStrictEqual(instance.errors, {
                id3: [{ wrongType: 'Number' }],
                field3: [{ cantBeEmpty: true }],
                fieldEntity3: {
                    fieldEntities2: [
                        { field1: [{ cantBeEmpty: true }], id1: [{ wrongType: 'Number' }] },
                        { id1: [{ cantBeEmpty: true }] }
                    ],
                    fieldEntity2: { id1: [{ cantBeEmpty: true }] }
                }
            })
        })

        it('should validate errors on references with option onlyIDs', () => {
            //given
            const AnEntity1 = entity('A entity', {
                id1: id(Number, { validation: { presence: true } }),
                field1: field(String, { validation: { presence: true } })
            })
            const AnEntity2 = entity('A entity', {
                id21: id(Number, { validation: { presence: true } }),
                id22: id(String, { validation: { presence: true } }),
                field2: field(String, { validation: { presence: true } }),
                fieldEntity2: field(AnEntity1, { validation: { presence: true } }),
                fieldEntities2: field([AnEntity1], { validation: { presence: true } })
            })
            const AnEntity3 = entity('A entity', {
                id3: id(Number, { validation: { presence: true } }),
                field3: field(String, { validation: { presence: true } }),
                fieldEntity3: field(AnEntity2, { validation: { presence: true } })
            })
            const instance = AnEntity3.fromJSON({
                id3: '3',
                field3: undefined,
                fieldEntity3: {
                    id21: '2',
                    id22: 2,
                    field2: 'value2',
                    fieldEntity2: { id1: undefined, field1: 'value1' },
                    fieldEntities2: [
                        { id1: '1', field1: undefined },
                        { id1: undefined, field1: 'value1' }]
                }
            })

            //when
            instance.validate({ references: { onlyIDs: true } })

            //then
            assert.deepStrictEqual(instance.errors, {
                id3: [{ wrongType: 'Number' }],
                field3: [{ cantBeEmpty: true }],
                fieldEntity3: {
                    id21: [{ wrongType: 'Number' }],
                    id22: [{ wrongType: 'String' }],
                }
            })
        })

        it('should validate errors on references with option exceptIDs', () => {
            //given
            const AnEntity1 = entity('A entity', {
                id1: id(Number, { validation: { presence: true } }),
                field1: field(String, { validation: { presence: true } })
            })
            const AnEntity2 = entity('A entity', {
                id21: id(Number, { validation: { presence: true } }),
                id22: id(String, { validation: { presence: true } }),
                field2: field(String, { validation: { presence: true } }),
                fieldEntity2: field(AnEntity1, { validation: { presence: true } }),
                fieldEntities2: field([AnEntity1], { validation: { presence: true } })
            })
            const AnEntity3 = entity('A entity', {
                id3: id(Number, { validation: { presence: true } }),
                field3: field(String, { validation: { presence: true } }),
                fieldEntity3: field(AnEntity2, { validation: { presence: true } })
            })
            const instance = AnEntity3.fromJSON({
                id3: '3',
                field3: undefined,
                fieldEntity3: {
                    id21: '2',
                    id22: 2,
                    field2: 2,
                    fieldEntity2: { id1: undefined, field1: 2 },
                    fieldEntities2: [
                        { id1: '1', field1: 'value1' },
                        { id1: undefined, field1: undefined }]
                }
            })

            //when
            instance.validate({ references: { exceptIDs: true } })

            //then
            assert.deepStrictEqual(instance.errors, {
                id3: [{ wrongType: 'Number' }],
                field3: [{ cantBeEmpty: true }],
                fieldEntity3: {
                    field2: [{ wrongType: 'String' }],
                    fieldEntity2: { field1: [{ wrongType: 'String' }] },
                    fieldEntities2: [null, { field1: [{ cantBeEmpty: true }] }]
                }
            })
        })

        it('should validate errors with exceptIDs and on references with option onlyIDs', () => {
            //given
            const AnEntity1 = entity('A entity', {
                id1: id(Number, { validation: { presence: true } }),
                field1: field(String, { validation: { presence: true } })
            })
            const AnEntity2 = entity('A entity', {
                id21: id(Number, { validation: { presence: true } }),
                id22: id(String, { validation: { presence: true } }),
                field2: field(String, { validation: { presence: true } }),
                fieldEntity2: field(AnEntity1, { validation: { presence: true } }),
                fieldEntities2: field([AnEntity1], { validation: { presence: true } })
            })
            const AnEntity3 = entity('A entity', {
                id3: id(Number, { validation: { presence: true } }),
                field3: field(String, { validation: { presence: true } }),
                fieldEntity3: field(AnEntity2, { validation: { presence: true } })
            })
            const instance = AnEntity3.fromJSON({
                id3: '3',
                field3: undefined,
                fieldEntity3: {
                    id21: '2',
                    id22: 2,
                    field2: 2,
                    fieldEntity2: { id1: undefined, field1: 2 },
                    fieldEntities2: [
                        { id1: '1', field1: 'value1' },
                        { id1: undefined, field1: undefined }]
                }
            })

            //when
            instance.validate({ exceptIDs: true, references: { onlyIDs: true } })

            //then
            assert.deepStrictEqual(instance.errors, {
                field3: [{ cantBeEmpty: true }],
                fieldEntity3: {
                    id21: [{ wrongType: 'Number' }],
                    id22: [{ wrongType: 'String' }],
                }
            })
        })
    })
})
