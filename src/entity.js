const { Field } = require('./field')
const { BaseEntity } = require('./baseEntity')

class EntityBuilder {
    constructor(name, body) {
        this.name = name
        this.body = body
    }

    build(asValueObject = false) {
        const Entity = ({[this.name] : class extends BaseEntity {}})[this.name]
        Entity.prototype.meta = {
            name: this.name,
            schema: {}
        }

        for (const [name, info] of Object.entries(this.body)) {
            if(asValueObject && (info.options.omitable || info.options.isId)) continue
            if (!(info instanceof Field)) {
                Entity.prototype[name] = info
                Entity.prototype.meta.schema[name] = Function
                continue
            }
            info.name = name
            Entity.prototype.meta.schema[name] = info
        }

        Entity.asValueObject = () => {
            const builder = new EntityBuilder(this.name, this.body)
            return builder.build(true)
        }
        return Entity
    }
}

const entity = (name, body) => {
    const builder = new EntityBuilder(name, body)
    return builder.build()
}

entity.isEntity = (instance) => {
    return (
        instance instanceof BaseEntity || 
        instance.prototype instanceof BaseEntity)
}


module.exports = { entity }