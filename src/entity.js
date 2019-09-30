class Entity {
    constructor(description, body) {
        this.description = description
        this.body = body
    }
}

const entity = (description, body) => {
    return new Entity(description, body)
}

module.exports = { entity }