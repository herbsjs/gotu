const { BaseEntity } = require("./baseEntity")

/**
 * Entity's field
 * @property {string} name Field's name
 * @property {type} type Field's type
 * @property {object} options Field's options: e.g. { default: false }
 * @property {any} defaultValue returns the field's default value if it isn't undefined
 * @property {object} validation returns a validation object
 */
class Field {
  /**
   * @param {type} type Field's type
   * @param {object} options Field's options: e.g. { default: false }
   */
  constructor(type, options = {}) {
    this.name = ""
    this.type = type
    this.options = options
    this._validations = null
  }

  get defaultValue() {
    if (this.options.default !== undefined) {
      if (typeof this.options.default === "function")
        return this.options.default()
      return this.options.default
    }

    const type = this.type
    if (type === Number) return 0
    if (type === String) return ""
    if (type === Date) return null
    if (type === Boolean) return false
    if (Array.isArray(type)) return []
    if (type.prototype instanceof BaseEntity) return new type()

    return undefined
  }

  get validation() {
    if (this._validations) return this._validations

    const validation = { type: this.type }
    if (this.options.validation)
      Object.assign(validation, this.options.validation)

    return (this._validations = validation)
  }
}

/**
 * Field's factory
 * @params {type} type Field's type
 * @params {object} options Field's options: e.g. { default: false }
 */
const field = (type, options) => {
  return new Field(type, options)
}

module.exports = { field, Field }
