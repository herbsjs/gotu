const { entity } = require('../../../src/entity')
const { field } = require('../../../src/field')
const { BaseEntity } = require('../../../src/baseEntity')
const assert = require('assert')

describe('A field', () => {

    describe('with an array of entity type', () => {

        const EntityType = entity('A entity type', {
            f1: field(Boolean),
            f2: field(Boolean)
        })

        const givenAnEntityWithAEntityField = (fieldOptions) => {

            const AnEntity = entity('A entity', {
                field1: field([EntityType], fieldOptions),
                isEmpty() {
                    return this.field1.length === 0
                },
            })
            return new AnEntity()
        }

        it('should set undefined as default value to a field', () => {
            //given
            const instance = givenAnEntityWithAEntityField()
            //then
            assert.deepStrictEqual(instance.field1, undefined)
        })

        it('should set null as a default value to a field', () => {
            //given
            const instance = givenAnEntityWithAEntityField({ default: null })
            //then
            assert.deepStrictEqual(instance.field1, null)
        })

        it('should set a function as a default value to a field', () => {
            //given
            const instanceOfEntityType = new EntityType()
            const instance = givenAnEntityWithAEntityField({
                default: () => {
                    return instanceOfEntityType
                }
            })
            //then
            assert(instance.field1 instanceof BaseEntity)
            assert.deepStrictEqual(instance.field1.constructor.name, instanceOfEntityType.constructor.name)
        })

        it('should validate type and have valid value', () => {
            //given
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = []
            instance.field1[0] = new EntityType()

            //then
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate type and have invalid value', () => {
            //given
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = [""]

            //then
            assert.strictEqual(instance.isValid(), false)
            assert.deepStrictEqual(instance.errors, { field1: [{ wrongType: ['A entity type'] }] })
        })

        it('should validate type and have valid deep value', () => {
            //given
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = []
            instance.field1[0] = EntityType.fromJSON({ f1: true, f2: false })

            //then
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate type and have invalid deep value', () => {
            //given
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = [0]
            instance.field1[0] = EntityType.fromJSON({ f1: "true", f2: "false" })

            //then
            assert.strictEqual(instance.isValid(), false)
            assert.deepStrictEqual(instance.errors, { field1: [{ f1: [{ wrongType: "Boolean" }], f2: [{ wrongType: "Boolean" }] }] })
        })

        it('should have multiple instances with isolated valued from each other', () => {
            //given
            const AnEntity = entity('A entity', {
                field1: field([EntityType], { default: [] }),
                isEmpty() {
                    return this.field1.length === 0
                },
            })

            const instance1 = new AnEntity()
            instance1.field1 = [new EntityType()]

            const instance2 = new AnEntity()

            //then
            assert.strictEqual(instance1.isEmpty(), false)
            assert.strictEqual(instance2.isEmpty(), true)
        })

    })
})