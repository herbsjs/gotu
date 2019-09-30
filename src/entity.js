const validateJS = require("validate.js")

class Entity {
    constructor(name) {
        this.meta = {}
        this.meta.name = name
        this.meta.validations = {}
        this.errors = {}
    }

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
        const newEntity = new Entity(this.name)
        const validations = {}
        for (const [key, field] of Object.entries(this.body)) {
            field.name = key
            newEntity[key] = field.defaultValue
            const validation = newEntity.meta.validations[key] = field.validation
            Object.assign(validations, validation)
        }
        newEntity.meta.validations = validations
        return newEntity
    }
}

const entity = (name, body) => {
    const builder = new EntityBuilder(name, body)
    return builder.build()
}

module.exports = { entity }