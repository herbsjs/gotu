
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
        validation[this.name] = {type: "number"}
        return validation
    }
}

const field = (type) => {
    return new Field(type)
}

module.exports = { field }