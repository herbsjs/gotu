const validateJS = require("validate.js")
const dayJS = require('dayjs')
const { Field } = require('./field')

class BaseEntity {

    validate() {
        this.__proto__.errors = validateJS(this, this.meta.validations) || {}
    }

    isValid() {
        this.validate()
        return Object.keys(this.errors).length === 0
    }

    static fromJSON(json) {
        let data = json
        if (typeof json === "string") data = JSON.parse(json)

        const instance = new this()

        for (const field in instance.meta.schema) {
            const fieldMeta = instance.meta.schema[field]
            if (!(fieldMeta instanceof Field)) continue
            instance[field] = Field.parse(fieldMeta.type, data[field])
        }

        return instance
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

// Date time parser - https://validatejs.org/#validators-datetime
validateJS.extend(validateJS.validators.datetime, {
    parse: function (value, options) {
        return +dayJS(value);
    },
    format: function (value, options) {
        var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
        return dayJS(value).format(format);
    }
})


const entity = (name, body) => {
    const builder = new EntityBuilder(name, body)
    return builder.build()
}

module.exports = { entity }