const { validate, checker } = require("suma")
const validateValue = validate

class BaseEntity {
  validate() {
    const errors = {}
    for (const [name, definition] of Object.entries(this.meta.schema)) {
      const value = this[name]

      // ignore functions
      if (checker.isFunction(value)) continue

      // types validation
      const validation = definition.validation
      const retErrors = validateValue(value, validation)
      if (retErrors.errors && retErrors.errors.length > 0) {
        errors[name] = retErrors.errors
        continue
      }

      // for entity types (deep validation)
      if (value instanceof BaseEntity) {
        if (value.isValid()) continue
        errors[name] = value.errors
      }
      
      // for array of entity types
      if (Array.isArray(value) && definition.type[0] && definition.type[0].prototype instanceof BaseEntity) {
        const errorList = value.map((item) =>
          !item.isValid() ? item.errors : null
        )
        const errorFound = errorList.filter((error) => !!error)

        if (!errorFound || !errorFound.length) continue
        errors[name] = errorList
      }
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
      if (value === undefined) return undefined
      if (value === null) return null

      if (type === Date) return new Date(value)
      if (type.prototype instanceof BaseEntity) {
        const entity = type.fromJSON(value)
        return entity
      }

      if (Array.isArray(type) && type[0] && type[0].prototype instanceof BaseEntity) {
        return value.map((item) => {
          const entity = type[0].fromJSON(item)
          return entity
        })
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

module.exports = { BaseEntity }
