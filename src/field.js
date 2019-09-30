class Field {
    constructor(type) {
        this.type = type
    }
}

const field = (type) => {
    return new Field(type)
}

module.exports = { field }