const { BaseEntity } = require('./baseEntity')

class Field {
    constructor(type, options = {}) {
        this.name = ""
        this.type = type
        this.options = options
    }

    get defaultValue() {

        if (this.options.default !== undefined) {
            if (typeof this.options.default === "function") return this.options.default()
            return this.options.default
        }

        const type = this.type
        if (type === Number) return 0
        if (type === String) return ""
        if (type === Date) return null
        if (type === Boolean) return false
        if (type.prototype instanceof BaseEntity) return new type()
        return undefined
    }

    get validation() {

        function typeValidationString(type) {
            if (type === Number) return "number"
            if (type === String) return "string"
            if (type === Date) return "date"
            if (type === Boolean) return "boolean"
            if (type.prototype instanceof BaseEntity) return "entity"
            return undefined
        }

        const validation = {}
        validation[this.name] = { type: typeValidationString(this.type) }
        if (this.options.validation)
            Object.assign(validation[this.name], this.options.validation)

        return validation
    }

}

const field = (type, options) => {
    return new Field(type, options)
}

module.exports = { field, Field }