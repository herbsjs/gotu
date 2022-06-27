const { entity } = require('../../src/entity')
const { field } = require('../../src/field')
const assert = require('assert')

describe('Shallow copy entity', () => {

    it('should copy entity', () => {
        // given
        const User = entity('User', {
            name: field(String),
            age: field(Number),
        })

        // when
        const user1 = User.fromJSON({ name: 'John', age: 20 })

        const user2 = User.fromJSON(user1)

        // then
        assert.notEqual(user1, user2)

    })

    it('should copy the entity with desestructuring', () => {
        // given
        const User = entity('User', {
            name: field(String),
            age: field(Number)          
        })

        // when
        const user1 = User.fromJSON({ name: 'John', age: 20 })

        const user2 = User.fromJSON({ ...user1, name: 'Billy' })

        // then
        assert.deepEqual(user1, {
            name: 'John',
            age: 20
        })

        assert.deepEqual(user2, {
            name: 'Billy',
            age: 20
        })

    })

    it('should clone nested properties and change name property', () => {
         // given
         const Feature = entity('Feature', {
            name: field(String)
         })

         const User = entity('User', {
            name: field(String),
            age: field(Number),
            nestedProperty: field(Feature)
        })

        const user1 = User.fromJSON({ name: 'John', age: 20, nestedProperty: { name: 'feature1' }})

        // when
        const user2 = User.fromJSON({ ...user1, name: 'Billy', nestedProperty: { name: 'feature2'} })

        // then
        assert.notStrictEqual(user1.nestedProperty, user2.nestedProperty)

    })
})