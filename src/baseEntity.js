const { validate, checker } = require("@herbsjs/suma")
const validateValue = validate

class BaseEntity {

  constructor() {
    for (const [name, definition] of Object.entries(this.meta.schema)) {
      // ignore functions
      if (checker.isFunction(definition)) continue

      this[name] = definition.defaultValue
    }
  }

  validate(options) {
    const errors = {}
    for (const [name, definition] of Object.entries(this.meta.schema)) {
      const value = this[name]

      // ignore functions
      if (checker.isFunction(value)) continue

      if (options && options.exceptIDs && definition.options.isId) continue

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

    this.errors = errors
  }

  isValid(options) {
    this.validate(options)
    return Object.keys(this.errors).length === 0
  }

  static parentOf(instance) {
    return this.prototype === instance.__proto__
  }

  toJSON(options = { allowExtraKeys: false }) {
    function deepCopy(obj, allowExtraKeys) {
      const copy = {}

     const jsonKeys = allowExtraKeys ? Object.keys(obj) : []
     const entityKeys = Object.keys(obj.meta.schema)

      const mergedKeys = jsonKeys.concat(entityKeys.filter((item) => jsonKeys.indexOf(item) < 0))

      for (const field of mergedKeys) {
        let value = obj[field]
        if (value instanceof BaseEntity) value = deepCopy(value, allowExtraKeys)
        if (Array.isArray(value) && value[0] instanceof BaseEntity)
          value = value.map((i) => deepCopy(i, allowExtraKeys))
        if (value instanceof Function) continue
        copy[field] = value
      }
      return copy
    }
    const obj = deepCopy(this, options.allowExtraKeys)
    return obj
  }

  static fromJSON(json, options = { allowExtraKeys: false }) {

    function parse(type, value) {
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

    const jsonKeys = options.allowExtraKeys ? Object.keys(data) : []
    const entityKeys = Object.keys(instance.meta.schema)
    const mergedKeys = jsonKeys.concat(entityKeys.filter((item) => jsonKeys.indexOf(item) < 0))

    for (const key of mergedKeys) {
      const field = instance.meta.schema[key]
      if (field === undefined) {
        instance[key] = data[key]
        continue
      }
      if (!(field.constructor.name === "Field" && !checker.isFunction(field.definition) && data[key] !== undefined)) continue
      instance[key] = parse(field.type, data[key])
    }

    return instance
  }
}

module.exports = { BaseEntity }
