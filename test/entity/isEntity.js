const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    it('should validate if a class instance or an object instance is a Gotu entity ', () => {
        //given
        const AnEntity = entity('A entity', {
            field1: field(Number)
        })
        const ASecondEntity = entity('A second entity', {
            field1: field(Number)
        })
        const instance1 = new AnEntity()
        const instance2 = new AnEntity()
        const instance3 = new ASecondEntity()
        //then
        assert.ok(entity.isEntity(AnEntity))
        assert.ok(entity.isEntity(ASecondEntity))

        assert.ok(entity.isEntity(instance1))
        assert.ok(entity.isEntity(instance2))
        assert.ok(entity.isEntity(instance3))

        assert.ok(!entity.isEntity(""))
        assert.ok(!entity.isEntity([]))
        assert.ok(!entity.isEntity(Object))
        assert.ok(!entity.isEntity(String))
        assert.ok(!entity.isEntity(Array))
    })
})