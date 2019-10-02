# yard

Entities are the first natural place we should aim to place business logic in domain-driven applications.

Yard helps you define your business entities in your code.

### Installing
    $ npm install yard

### Using

```javascript
const User = 
    entity('User', {
        name: field(String),
        lastAccess: field(Date),
        accessCount: field(Number),
        hasAccess: field(Boolean)
    })

const user = new User()
user.name = "Beth"
user.validate()
```

## Validation

```javascript
const User = 
    entity('User', {
        name: field(String)
    })

const user = new User()
user.name = 1
user.validate() 
user.errors // { name: ["name must be of type string"] }
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

`Number`: Number type is double-precision 64-bit binary format IEEE 754 value

`String`: A UTF‐16 character sequence

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

For scalar types a default value is assumed if a default value is not given:

|Type|Default Value|
|---|---|
|`Number`|0|
|`String`|""|
|`Boolean`|false|
|`Date`|null|

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
- [ ] Field entity type definition and validation (ex: "user": User)
- [ ] Field enum type definition and validation (ex: "paymentType": ['CC', 'Check'])
- [ ] Field list type definition and validation (ex: "users": [User])
- [X] Entity custom methods (ex: payment.calculate())
- [X] Default values 
- [ ] Entity (complex) validation (ex: payment.validate() )
- [ ] Field validation error message (ex: payment.errors )
- [ ] I18n field validation error message
- [X] Entity hidrate (ex: fromJson)
- [X] Entity serialize (ex: toJson)
- [ ] Extend / Custom field validation (ex: email, greater than, etc)
- [ ] Valitation contexts (ex: Payment validation for [1] credit card or [2] check)
- [ ] Conditional Validation (ex: if email is present, emailConfirmation must be present)
- [ ] Entities Inheritance (schema and validations inheritance)

