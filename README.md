<p align="center"><img src="https://raw.githubusercontent.com/herbsjs/gotu/master/docs/logo.png" height="220"></p>

![Node.js CI](https://github.com/herbsjs/gotu/workflows/Node.js%20CI/badge.svg?branch=master) [![codecov](https://codecov.io/gh/herbsjs/gotu/branch/master/graph/badge.svg)](https://codecov.io/gh/herbsjs/gotu)

# Gotu Kola

Gotu Kola helps define your business entities (*)

(*) Entities: they are the first natural place we should aim to place business logic in domain-driven applications.

### Installing

```$ npm install @herbsjs/gotu```

### Using

```javascript
const { entity, field } = require('@herbsjs/gotu')

const Feature =
        entity('Feature', {
            name: field(String),
            hasAccess: field(Boolean)
        })

const Plan =
    entity('Plan', {
        name: field(String),
        monthlyCost: field(Number)
    })

const User =
    entity('User', {
        name: field(String),
        lastAccess: field(Date),
        accessCount: field(Number),
        features: field([Feature]),
        plan: field(Plan),
    })

const user = new User()
user.name = "Beth"
user.plan.monthlyCost = 10
user.features = [
    new Feature(),
    new Feature(),
    new Feature()
]
user.validate()
```

## Deep copy entity

To clone the entity, we can use `entity.fromJSON()`, like the example below:

```js
const Customer =
    entity('Customer', {
        name: field(String),
        age: field(Number),
        gender: field(String)
    })
const customer1 = new Customer()
customer1.name = 'John Doe'
customer1.age = 20
customer1.gender = 'Male'
const customer2 = Customer.fromJSON(customer1)
//customer1.name = 'John Doe'
//customer1.age = 20
//customer1.gender = 'Male'
```

To do a clone changing original entity, you can use desestructuring method, like this:

```js
const Customer =
    entity('Customer', {
        name: field(String),
        age: field(Number),
        gender: field(String)
    })
const customer1 = new Customer()
customer1.name = 'John Doe'
customer1.age = 20
customer1.gender = 'Male'
const customer2 = Customer.fromJSON({ ...customer1, name: 'Billy Jean' })
//customer1.name = 'Billy Jean'
//customer1.age = 20
//customer1.gender = 'Male'
```

## Validation

A value of an field can be validated against the field type or its custom validation.

### Type Validation

```javascript

const Plan =
    entity('Plan', {
        ...
        monthlyCost: field(Number),
    })

const User =
    entity('User', {
        name: field(String),
        plan: field(Plan)
    })

const user = new User()
user.name = 42
user.plan.monthlyCost = true
user.validate()
user.errors // { name: [ wrongType: 'String' ], plan: { monthlyCost: [ wrongType: 'Number' ] } }
user.isValid() // false
```

You can also simplify you validation method using `isValid()` method that execute validate implicit for you entity and return true/false in a single execution and also you can check the errors.

```javascript

const Plan =
    entity('Plan', {
        ...
        monthlyCost: field(Number),
    })

const plan = new Plan()
plan.plan.monthlyCost = true
plan.isValid() // false
plan.errors // { monthlyCost: [ wrongType: 'Number' ] }

```

You can ignore id field validation using `isValid({exceptIDs: true})`. Example: Imagine that your id should not be null, but sometimes, in an insertion case, the ID only exists after an insertion in the database, so you can validate the hole entity, except the id field.

```javascript

const Plan =
    entity('Plan', {
        ...
        myId: id(Number),
        monthlyCost: field(Number),
    })

const plan = new Plan()
plan.plan.myId = '123'
plan.plan.monthlyCost = 500
plan.isValid({exceptIDs: true}) // true

plan.isValid() // false
plan.errors // { myId: [ wrongType: 'Number' ] }

```


### Custom Validation

For custom validation Gotu uses Herbs JS [Suma](https://github.com/herbsjs/suma) library under the hood. It has no message defined, only error codes.

Use `{ validation: ... }` to specify a valid Suma validation (sorry) on the field definition.

```javascript
const User =
    entity('User', {
        ...
        password: field(String, { validation: {
            presence: true,
            length: { minimum: 6 } }
        }),
        cardNumber: field(String, { validation: {
          custom: { invalidCardNumber: (value) => value.length === 16 } }
        })
    })

const user = new User()
user.password = '1234'
user.cardNumber = '1234456'
user.validate()
user.errors // [{ password: [ { isTooShort: 6 } ] , { "invalidCardNumber": true }]
user.isValid // false
```

## Serialization

### `fromJSON(value)`

Returns a new instance of a entity

```javascript
const User =
    entity('User', {
        name: field(String)
    })

// from object
const user = User.fromJSON({ name: 'Beth'})
// or string
const user = User.fromJSON(`{ "name": "Beth"}`)
```

By default `fromJSON` serializes only keys that have been defined in the entity. If you want to add other keys during serialization, use `.fromJSON(data, { allowExtraKeys: true })`.

By default, `fromJSON` **default field** values will be applied for keys not present in `value`.

### `JSON.stringify(entity)`

To serialize an entity to JSON string use `JSON.stringify` or `entity.toJSON` function.

```javascript
const json = JSON.stringify(user) // { "name": "Beth" }
```

By default `toJSON` serializes only keys that have been defined in the entity. If you want to add other keys during serialization, use `entity.toJSON({ allowExtraKeys: true })`.

## Field definition

A entity field type has a name, type, default value, validation and more.

### Scalar types

A field in an entity can be of basic types, the same as those used by JavaScript:

`Number`: double-precision 64-bit binary format IEEE 754 value

`String`: a UTF‐16 character sequence

`Boolean`: true or false

`Date`: represents a single moment in time in a platform-independent format.

```javascript
const User =
    entity('User', {
        name: field(String),
        lastAccess: field(Date),
        accessCount: field(Number),
        hasAccess: field(Boolean)
    })
```

### Entity type

For complex types, with deep relationship between entities, a field can be of entity type:

```javascript
const Plan =
    entity('Plan', {
        ...
        monthlyCost: field(Number),
    })

const User =
    entity('User', {
        ...
        plan: field(Plan)
    })
```

### List of Entity type

For complex types, with deep relationship between entities, a field can contain a list of entity type:

```javascript
const Plan =
    entity('Plan', {
        ...
        monthlyCost: field(Number),
    })

const User =
    entity('User', {
        ...
        plan: field([Plan])
    })
```

### ID Fields

It is possible to declare a field as an ID. This metadata will be used by glues to enrich the infrastructure interfaces (Database, REST, GraphQL, etc).

We can do it in two ways:

```javascript
// The explicit way
const User =
    entity('User', {
        id: field(Number, { isId: true }),
        ...
    })

// The short way
const User =
    entity('User', {
        id: id(Number),
        ...
    })
```

You can check if a field isId accessing the options of the field, like this:

```javascript

const user = new User()

//should be equals ```true```
user.__proto__.meta.schema.id.options.isId
```

### Default value

It is possible to define a default value when an entity instance is initiate.

```javascript
const User =
    entity('User', {
        ...
        hasAccess: field(Boolean, { default: false })
    })


const user = new User()
user.hasAccess // false
```

If the default value is a `function` it will call the function and return the value as default value:

```javascript
const User =
    entity('User', {
        ...
        hasAccess: field(Boolean, { default: () => false })
    })


const user = new User()
user.hasAccess // false
```

For scalar types a default value is assumed if a default value is not given:


| Type | Default Value |
| - | - |
| `Number` | 0 |
| `String` | "" |
| `Boolean` | false |
| `Date` | null |

For entity types the default value is a new instance of that type. It is possible to use `null` as default:

```javascript
const User =
    entity('User', {
        ...
        plan: field(Plan, { default: null })
    })

const user = new User()
user.plan // null
```

## Method definition

A method can be defined to create custom behaviour in an entity:

```javascript
const User =
    entity('User', {
        ...
        role: field(String),
        hasAccess() { return this.role === "admin" },
    })

const user = new User()
const access = user.hasAccess()
```

## Instance Type Check - `Entity.parentOf`

Check if a instance is the same type from its parent entity class (similar to `instanceOf`)

```javascript
        const AnEntity = entity('A entity', {})
        const AnSecondEntity = entity('A second entity', {})

        const instance1 = new AnEntity()
        const instance2 = new AnSecondEntity()

        AnEntity.parentOf(instance1) // true
        AnEntity.parentOf(instance2) // false
```

## Entity Type Check - `entity.isEntity`

Check if an object is a Gotu Entity class

```javascript
        const AnEntity = entity('A entity', {})

        const instance1 = new AnEntity()

        entity.isEntity(AnEntity) // true
        entity.isEntity(Object) // false
```

## TODO

- [X] Field basic JS type definition and validation (ex: "name": String)
- [X] Field entity type definition and validation (ex: "user": User)
- [ ] Field enum type definition and validation (ex: "paymentType": ['CC', 'Check'])
- [X] Field list type definition and validation (ex: "users": [User])
- [X] Entity custom methods (ex: payment.calculate())
- [X] Default values
- [ ] Entity (complex) validation (ex: payment.validate() )
- [X] Field validation error message (ex: payment.errors )
- [X] Field validation error code (ex: payment.errors )
- [X] Entity hidrate (ex: fromJson)
- [X] Entity serialize (ex: toJson)
- [X] Extend / Custom field validation (ex: email, greater than, etc)
- [ ] Valitation contexts (ex: Payment validation for [1] credit card or [2] check)
- [X] Conditional Validation (ex: if email is present, emailConfirmation must be present)
- [ ] Entities Inheritance (schema and validations inheritance)

### Contribute

Come with us to make an awesome *Gotu*.

Now, if you do not have technical knowledge and also have intend to help us, do not feel shy, [click here](https://github.com/herbsjs/gotu/issues) to open an issue and collaborate their ideas, the contribution may be a criticism or a compliment (why not?)

If you would like to help contribute to this repository, please see [CONTRIBUTING](https://github.com/herbsjs/gotu/blob/master/.github/CONTRIBUTING.md)

### The Herb

Gotu Kola has been used historically to relieve congestion from upper respiratory infections and colds and for wound healing. It is very popular for treating varicose veins and memory loss.

https://www.herbslist.net/

https://en.wikipedia.org/wiki/Centella_asiatica

### License

**Gotu** is released under the
[MIT license](https://github.com/herbsjs/gotu/blob/master/LICENSE).
