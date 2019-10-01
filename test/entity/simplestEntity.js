const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    describe('the simplest entity', () => {

        const givenTheSimplestEntity = () => {
            const entity_ = entity('A entity', {
                field1: field(Number)
            })
            return entity_
        }

        it('should initiate', () => {
            //given
            const entity_ = givenTheSimplestEntity()
            //then
            assert.equal(entity_.meta.name, 'A entity')
        })

        it('should set a value to a field', () => {
            //given
            const entity_ = givenTheSimplestEntity()
            entity_.field1 = 1
            //then
            assert.strictEqual(entity_['field1'], 1)
        })

        it('should set a value to a field', () => {
            //given
            const entity_ = givenTheSimplestEntity()
            entity_.field1 = 1
            //then
            assert.strictEqual(entity_['field1'], 1)
        })
    })
})