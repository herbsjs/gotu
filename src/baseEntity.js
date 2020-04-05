const validateJS = require("validate.js")
const dayJS = require('dayjs')

class BaseEntity {

    validate() {
        // for scalar and entity types:
        let errors = validateJS(this, this.meta.validations) || {}

        // for entity types only (deep validation):
        for (const field in this.meta.schema) {
            const fieldValue = this[field]
            if (!(fieldValue instanceof BaseEntity)) continue
            if (fieldValue.isValid()) continue
            errors[field] = fieldValue.errors
        }

        this.__proto__.errors = errors
    }

    isValid() {
        this.validate()
        return Object.keys(this.errors).length === 0
    }

    toJSON() {
        function deepCopy(obj) {
            const copy = {}
            for (const field in obj.meta.schema) {
                let value = obj[field]
                if (value instanceof BaseEntity) value = deepCopy(value)
                if (value instanceof Function) continue
                copy[field] = value
            }
            return copy
        }
        const obj = deepCopy(this) 
        return obj
    }

    static fromJSON(json) {

        function parse(type, value) {
            if (type === Date && value) return new Date(value)
            if (type.prototype instanceof BaseEntity) {
                const entity = type.fromJSON(value)
                return entity
            }
            return value
        }

        let data = json
        if (typeof json === "string") data = JSON.parse(json)

        const instance = new this()

        for (const field in instance.meta.schema) {
            const fieldMeta = instance.meta.schema[field]
            if (!(fieldMeta.constructor.name === "Field")) continue
            instance[field] = parse(fieldMeta.type, data[field])
        }

        return instance
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

validateJS.validators.type.types.entity = function (value) {
    return value instanceof BaseEntity
}

module.exports = { BaseEntity }
