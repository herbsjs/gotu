const validateJS = require("validate.js")
const { Field } = require('./field')

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
        for (const [name, info] of Object.entries(this.body)) {
            if (!(info instanceof Field)) {
                newEntity[name] = info
                info.bind(newEntity)
                continue    
            }
            info.name = name
            newEntity[name] = info.defaultValue
            const validation = newEntity.meta.validations[name] = info.validation
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