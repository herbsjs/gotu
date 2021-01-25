const { Field } = require('./field')
const { BaseEntity } = require('./baseEntity')

/**
 * Factory to build a entity 
 * @private
 * @property {string} name Entity's name
 * @property {Object} body Entity's fields 
 */
class EntityBuilder {
    /**
     * @param {string} name Entity's name
     * @param {Object} body Entity's fields
     */
    constructor(name, body) {
        this.name = name
        this.body = body
    }
    /**
     * Build the a entity
     * @returns { Entity }
     */
    build() {
        const Entity = ({[this.name] : class extends BaseEntity {}})[this.name]
        Entity.prototype.meta = {
            name: this.name,
            schema: {}
        }
        Entity.prototype.errors = {}

        for (const [name, info] of Object.entries(this.body)) {
            if (!(info instanceof Field)) {
                Entity.prototype[name] = info
                Entity.prototype.meta.schema[name] = Function
                continue
            }
            info.name = name
            Entity.prototype[name] = info.defaultValue
            Entity.prototype.meta.schema[name] = info
        }
        return Entity
    }
}

/**
 * Build a entity class
 * @returns {Entity}
 */
const entity = (name, body) => {
    const builder = new EntityBuilder(name, body)
    return builder.build()
}

module.exports = { entity }