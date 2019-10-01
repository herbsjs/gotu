const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('A entity', () => {

    describe('with custom method', () => {

        const givenAnEntityWithCustomMethod = () => {
            const entity_ = entity('A entity', {
                field1: field(Number),
                method1: function () { return this.field1 + 1 },
                method2() { return this.field1 + 2 },
                async method3() { return await this.field1 + 3 }
            })
            return entity_
        }

        it('should initiate', () => {
            //given
            const entity_ = givenAnEntityWithCustomMethod()
            //then
            assert.equal(entity_.meta.name, 'A entity')
        })

        it('should set a value to a field', () => {
            //given
            const entity_ = givenAnEntityWithCustomMethod()
            entity_.field1 = 1
            //then
            assert.strictEqual(entity_['field1'], 1)
        })

        it('should execute a method with a function definition', () => {
            //given
            const entity_ = givenAnEntityWithCustomMethod()
            entity_.field1 = 2
            //when
            const ret = entity_.method1()
            //then
            assert.strictEqual(ret, 3)
        })

        it('should execute a method defined on the object body', () => {
            //given
            const entity_ = givenAnEntityWithCustomMethod()
            entity_.field1 = 3
            //when
            const ret = entity_.method2()
            //then
            assert.strictEqual(ret, 5)
        })

        it('should execute a async method defined on the object body', async () => {
            //given
            const entity_ = givenAnEntityWithCustomMethod()
            entity_.field1 = 4
            //when
            const ret = await entity_.method3()
            //then
            assert.strictEqual(ret, 7)
        })
    })
})