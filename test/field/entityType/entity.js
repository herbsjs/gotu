const { entity } = require('../../../src/entity')
const { field } = require('../../../src/field')
const { BaseEntity } = require('../../../src/baseEntity')
const assert = require('assert')

describe('A field', () => {

    describe('with a entity type', () => {

        const EntityType = entity('A entity type', {
            f1: field(Boolean),
            f2: field(Boolean)
        })

        const EntityTypeWithObjectField = entity('An entity', {
            f1: field(Object)
        })

        const givenAnEntityToBeUsedAsType = () => {
            return EntityType
        }

        const givenAnEntityWithAEntityField = (fieldOptions) => {

            const EntityType = givenAnEntityToBeUsedAsType()

            const AnEntity = entity('A entity', {
                field1: field(EntityType, fieldOptions)
            })
            return new AnEntity()
        }

        it('should set undefined as default value to a field', () => {
            //given
            const EntityType = givenAnEntityToBeUsedAsType()
            const instanceOfEntityType = new EntityType()
            const instance = givenAnEntityWithAEntityField()
            //then
            assert.strictEqual(instance.field1, undefined)
            assert.deepStrictEqual(instanceOfEntityType.constructor.name, instance.meta.schema.field1.type.name)
        })

        it('should set null as a default value to a field', () => {
            //given
            const instance = givenAnEntityWithAEntityField({ default: null })
            //then
            assert.deepStrictEqual(instance.field1, null)
        }) 

        it('should get undefined value to a field without declared structure', () => {
            //given
            const instance = EntityTypeWithObjectField
            //then
            assert.deepStrictEqual(instance.field1, undefined)
        })

        it('should set a function as a default value to a field', () => {
            //given
            const EntityType = givenAnEntityToBeUsedAsType()
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
            const EntityType = givenAnEntityToBeUsedAsType()
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = new EntityType()

            //then
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate type and have invalid value', () => {
            //given
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = 1

            //then
            assert.strictEqual(instance.isValid(), false)
            assert.deepStrictEqual(instance.errors, { field1: [{ wrongType: 'A entity type' }] })
        })

        it('should validate type and have valid deep value', () => {
            //given
            const EntityType = givenAnEntityToBeUsedAsType()
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = new EntityType()
            instance.field1.f1 = true

            //then
            assert.strictEqual(instance.isValid(), true)
            assert.deepStrictEqual(instance.errors, {})
        })

        it('should validate type and have invalid deep value', () => {
            //given
            const EntityType = givenAnEntityToBeUsedAsType()
            const instance = givenAnEntityWithAEntityField()
            instance.field1 = new EntityType()
            instance.field1.f1 = 1

            //then
            assert.strictEqual(instance.isValid(), false)
            assert.deepStrictEqual(instance.errors, { field1: { f1: [{ wrongType: 'Boolean' }] } })
        })

    })
})