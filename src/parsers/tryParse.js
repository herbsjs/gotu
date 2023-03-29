const { checker } = require("@herbsjs/suma")
const { isPotentialDate } = require("./isPotentialDate")


function tryParse(entity, BaseEntity) {
    // try to parse all the fields values to the correct type
    // in case of error, the field will be set to the original value
    for (const [name, definition] of Object.entries(entity.meta.schema)) {
        const value = entity[name]
        const type = definition.type

        // ignore null or undefined values
        if (value === null || value === undefined) continue

        // ignore if the value is already the correct type
        if (value instanceof type) continue

        // ignore functions
        if (checker.isFunction(value)) continue

        // for entity types (deep validation)
        if (value instanceof BaseEntity) {
            value.tryParse()
            continue
        }

        // for array of entity types
        if (Array.isArray(value) && definition.type[0] && definition.type[0].prototype instanceof BaseEntity) {
            value.map((item) => item.tryParse())
            continue
        }

        // try to parse the value to the correct type
        entity[name] = parse(type, value)
    }


    function parse(type, value) {
        const parsers = {
            String: String,
            Number: (value) => {
                // check if the value is a string and is empty
                if (typeof value === 'string' && value.trim() === '') return value
                const tryParse = Number(value)
                if (isNaN(tryParse)) return value
                return tryParse
            },
            Boolean: Boolean,
            Date: (value) => {
                if (!isPotentialDate(value)) return value
                const tryParse = new Date(value)
                if (isNaN(tryParse)) return value // 'Invalid Date'
                return tryParse
            },
            Object: (value) => {
                const tryParse = Object(value)
                if ([String, Number, Boolean, Object, Array].find(T => tryParse instanceof T))
                    return tryParse.valueOf()
                return tryParse
            },
            Array: (value) => Array.of(value),
        }
        const parser = parsers[type.name]
        try {
            return parser(value)
        } catch (error) {
            return value
        }
    }
}

module.exports = { tryParse }