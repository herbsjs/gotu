class Field {
    constructor(type, options = {}) {
        this.name = ""
        this.type = type
        this.options = options
    }

    get defaultValue() {

        if (this.options.default) return this.options.default

        const type = this.type
        if (type === Number) return 0
        if (type === String) return ""
        if (type === Date) return null
        if (type === Boolean) return false
        return undefined
    }

    get validation() {

        function typeValidationString(type) {
            if (type === Number) return "number"
            if (type === String) return "string"
            if (type === Date) return "date"
            if (type === Boolean) return "boolean"
            return undefined
        }

        const validation = {}
        validation[this.name] = { type: typeValidationString(this.type) }
        if (this.options.validation) 
            Object.assign(validation[this.name], this.options.validation)

        return validation
    }

    static parse(type, value) {
        if (type === Date) return new Date(value)
        return value
    }
}

const field = (type, options) => {
    return new Field(type, options)
}

module.exports = { field, Field }