
class Field {
    constructor(type) {
        this.name = ""
        this.type = type
    }

    get defaultValue() {
        return 0
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

module.exports = { field }