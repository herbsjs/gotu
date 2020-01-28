# yard 

Yard helps define your business entities (*)

(*) Entities: they are the first natural place we should aim to place business logic in domain-driven applications.

### Installing
    $ npm install yard

### Using

```javascript
const User = 
    entity('User', {
        name: field(String),
        lastAccess: field(Date),
        accessCount: field(Number),
        hasAccess: field(Boolean),
        plan: field(Plan),
    })

const user = new User()
user.name = "Beth"
user.plan.monthlyCost = 10
user.validate()
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
user.errors // { name: ["name must be of type string"], plan: { monthlyCost: ["monthlyCost must be of type number"] } }
user.isValid // false
```

### Custom Validation

For custom validation yard uses [validate.js](https://validatejs.org/) library under the hood.

Use `{ validation: ... }` to specify a valid validate.js [validation](https://validatejs.org/#validators) (sorry) on the field definition. 

```javascript
const User = 
    entity('User', {
        ...
        password: field(String, { 
            presence: true, 
            length: { minimum: 6 },
            message: "must be at least 6 characters"
        })
    })

const user = new User()
user.password = '1234'
user.validate() 
user.errors // { password: ["Password must be at least 6 characters"] }
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

// from hash
const user = User.fromJSON({ name: 'Beth'})
// or string
const user = User.fromJSON(`{ "name": "Beth"}`)
```

### `JSON.stringify(entity)`

To serialize an entity to JSON string use `JSON.stringify` function.

```javascript
const json = JSON.stringify(user) // { "name": "Beth"}
```

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

|Type|Default Value|
|---|---|
|`Number`|0|
|`String`|""|
|`Boolean`|false|
|`Date`|null|

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

## TODO

- [X] Field basic JS type definition and validation (ex: "name": String)
- [X] Field entity type definition and validation (ex: "user": User)
- [ ] Field enum type definition and validation (ex: "paymentType": ['CC', 'Check'])
- [ ] Field list type definition and validation (ex: "users": [User])
- [X] Entity custom methods (ex: payment.calculate())
- [X] Default values 
- [ ] Entity (complex) validation (ex: payment.validate() )
- [X] Field validation error message (ex: payment.errors )
- [ ] Field validation error code (ex: payment.errors )
- [ ] I18n field validation error message
- [X] Entity hidrate (ex: fromJson)
- [X] Entity serialize (ex: toJson)
- [X] Extend / Custom field validation (ex: email, greater than, etc)
- [ ] Be able to change validation lib (validate.js)
- [ ] Valitation contexts (ex: Payment validation for [1] credit card or [2] check)
- [X] Conditional Validation (ex: if email is present, emailConfirmation must be present)
- [ ] Entities Inheritance (schema and validations inheritance)

