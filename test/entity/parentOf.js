const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    it('should validate if a object instance is the same entity class ', () => {
        //given
        const AnEntity = entity('A entity', {
            field1: field(Number)
        })
        const AnSecondEntity = entity('A second entity', {
            field1: field(Number)
        })
        const instance1 = new AnEntity()
        const instance2 = new AnEntity()
        const instance3 = new AnSecondEntity()
        //then
        assert.ok(AnEntity.parentOf(instance1))
        assert.ok(AnEntity.parentOf(instance2))
        assert.ok(!AnEntity.parentOf(instance3))
    })
})