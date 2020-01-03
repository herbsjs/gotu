const { Field } = require('./field')
const { BaseEntity } = require('./baseEntity')

class EntityBuilder {
    constructor(name, body) {
        this.name = name
        this.body = body
    }

    build() {
        class Entity extends BaseEntity { }
        Entity.prototype.meta = {
            name: this.name,
            validations: {},
            schema: {}
        }
        Entity.prototype.errors = {}

        const validations = {}
        for (const [name, info] of Object.entries(this.body)) {
            if (!(info instanceof Field)) {
                Entity.prototype[name] = info
                Entity.prototype.meta.schema[name] = Function
                continue
            }
            info.name = name
            Entity.prototype[name] = info.defaultValue
            Entity.prototype.meta.schema[name] = info
            const validation = info.validation
            Object.assign(validations, validation)
        }
        Entity.prototype.meta.validations = validations
        return Entity
    }
}

const entity = (name, body) => {
    const builder = new EntityBuilder(name, body)
    return builder.build()
}

module.exports = { entity }