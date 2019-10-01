
class Field {
    constructor(type) {
        this.name = ""
        this.type = type
    }

    get defaultValue() {
        const type = this.type
        if (type === Number) return 0
        if (type === String) return ""
        if (type === Date) return null
        if (type === Boolean) return null
        return undefined
    }

    get validation() {
        const validation = {}
        validation[this.name] = {type: this._typeValidationString}
        return validation
    }

    get _typeValidationString() {
        const type = this.type
        if (type === Number) return "number"
        if (type === String) return "string"
        if (type === Date) return "date"
        if (type === Boolean) return "boolean"
        return undefined
    }
}

const field = (type) => {
    return new Field(type)
}

module.exports = { field, Field }