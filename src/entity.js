const validateJS = require("validate.js")
const { Field } = require('./field')

class BaseEntity {

    validate() {
        this.errors = validateJS(this, this.meta.validations) || {}
    }

    isValid() {
        this.validate()
        return Object.keys(this.errors).length === 0
    }
}

class EntityBuilder {
    constructor(name, body) {
        this.name = name
        this.body = body
    }

    build() {
        class Entity extends BaseEntity { }
        Entity.prototype.meta = {
            name: this.name,
            validations: {}
        }
        Entity.prototype.errors = {}
        
        const validations = {}
        for (const [name, info] of Object.entries(this.body)) {
            if (!(info instanceof Field)) {
                Entity.prototype[name] = info
                continue
            }
            info.name = name
            Entity.prototype[name] = info.defaultValue
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