const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('An entity', () => {
    describe('try to parse', () => {
        const testCases = [
            {
                sourceType: Number,
                targetTypes: [
                    { targetType: String, samples: [[1, '1'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [[1, true], [0, false], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [[1, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Date, samples: [[1, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Object, samples: [[1, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [[1, [1]], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [[1, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
            {
                sourceType: String,
                targetTypes: [
                    { targetType: String, samples: [['1', 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [['1', true], ['0', true], ['', false], ['true', true], ['false', true], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [['1', 1], ['0', 0], ['', 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    {
                        targetType: Date, samples: [
                            ['1', 'EQUAL'],
                            ['99-02-01', new Date('99-02-01')], ['1999-02-01', new Date('1999-02-01')],
                            ['99/02/01', new Date('99/02/01')], ['1999/02/01', new Date('1999/02/01')],
                            ['Jan 2, 99', new Date('Jan 2, 99')], ['January 2, 99', new Date('January 2, 99')],
                            ['2 Jan 99', new Date('2 Jan 99')], ['2 January 99', new Date('2 January 99')],
                            ['1999-02-01T01:02:03.004Z', new Date('1999-02-01T01:02:03.004Z')], ['1999-02-01T01:02:03Z', new Date('1999-02-01T01:02:03Z')],
                            [null, 'EQUAL'], [undefined, 'EQUAL']],
                    },
                    { targetType: Object, samples: [['1', 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [['1', ['1']], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [['1', 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
            {
                sourceType: Boolean,
                targetTypes: [
                    { targetType: String, samples: [[true, 'true'], [false, 'false'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [[true, 'EQUAL'], [false, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [[true, 1], [false, 0], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Date, samples: [[true, 'EQUAL'], [false, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Object, samples: [[true, 'EQUAL'], [false, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [[true, [true]], [false, [false]], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [[true, 'EQUAL'], [false, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
            {
                sourceType: Date,
                targetTypes: [
                    { targetType: String, samples: [[new Date(1), String(new Date(1))], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [[new Date(1), Boolean(new Date(1))], [new Date(0), Boolean(new Date(0))], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [[new Date(1), 1], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Date, samples: [[new Date(1), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Object, samples: [[new Date(1), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [[new Date(1), [new Date(1)]], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [[new Date(1), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
            {
                sourceType: Object,
                targetTypes: [
                    { targetType: String, samples: [[{ a: 1 }, '[object Object]'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [[{ a: 1 }, true], [{}, true], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [[{ a: 1 }, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Date, samples: [[{ a: 1 }, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Object, samples: [[{ a: 1 }, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [[{ a: 1 }, [{ a: 1 }]], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [[{ a: 1 }, 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
            {
                sourceType: Array,
                targetTypes: [
                    { targetType: String, samples: [[[1], '1'], [[], ''], [[1, 2], '1,2'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [[[1], true], [[], true], [[1, 2], true], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [[[1], 1], [[], 0], [[1, 2], 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Date, samples: [[[1], 'EQUAL'], [[], 'EQUAL'], [[1, 2], 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Object, samples: [[[1], 'EQUAL'], [[], 'EQUAL'], [[1, 2], 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [[[1], 'EQUAL'], [[], 'EQUAL'], [[1, 2], 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [[[1], 'EQUAL'], [[], 'EQUAL'], [[1, 2], 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
            {
                sourceType: entity('An entity', { field1: field(String) }),
                targetTypes: [
                    { targetType: String, samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Boolean, samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Number, samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Date, samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Object, samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: Array, samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                    { targetType: entity('An entity', { field1: field(String) }), samples: [[(() => { const AnEntity = entity('An entity', { field1: field(String) }); return new AnEntity() })(), 'EQUAL'], [null, 'EQUAL'], [undefined, 'EQUAL']], },
                ],
            },
        ]

        testCases.forEach(({ sourceType, targetTypes }) => {
            describe(`From ${sourceType.name}`, () => {
                targetTypes.forEach(({ targetType, samples }) => {
                    describe(`To ${targetType.name}`, () => {
                        samples.forEach(([inputValue, expectedValue]) => {
                            it(`value: "${inputValue}"`, () => {

                                if (expectedValue === 'EQUAL') expectedValue = inputValue

                                //given
                                const AnEntity = entity('An entity', { field1: field(targetType) })
                                const instance = new AnEntity()
                                instance.field1 = inputValue

                                //when
                                instance.tryParse()

                                //then
                                assert.deepEqual(instance.field1, expectedValue)
                            })
                        })
                    })
                })
            })
        })
    })
})
