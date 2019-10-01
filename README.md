# yard

Entities are the first natural place we should aim to place business logic in domain-driven applications.

Yard helps you define your business entities in your code.

### Installing
    $ npm install yard

### Using

```javascript
const user = 
    entity('User', {
        name: field(String),
        lastAccess: field(Date),
        accessCount: field(Number),
        hasAccess: field(Boolean)
    })
```

## Validation

```javascript
const user = 
    entity('User', {
        name: field(String)
    })

user.name = 1
user.validate() 
user.errors // { name: ["name must be of type string"] }
user.isValid // false
```


## Field definition

A entity field type has a name, type and validation.

### Scalar types

A field in an entity can be of basic types, the same as those used by JavaScript:

`Number`: Number type is double-precision 64-bit binary format IEEE 754 value

`String`: A UTF‐16 character sequence

`Boolean`: true or false

`Date`: represents a single moment in time in a platform-independent format. 

```javascript
const user = 
    entity('User', {
        name: field(String),
        lastAccess: field(Date),
        accessCount: field(Number),
        hasAccess: field(Boolean)
    })
```

## Method definition

A method can be defined to create custom behaviour in an entity:

```javascript
const user = 
    entity('User', {
        name: field(String),
        role: field(String),
        hasAccess() { return this.role === "admin" },
    })

const access = user.hasAccess()
```

## TODO

- [X] Field basic JS type definition and validation (ex: "name": String)
- [ ] Field entity type definition and validation (ex: "user": User)
- [ ] Field enum type definition and validation (ex: "paymentType": ['CC', 'Check'])
- [ ] Field list type definition and validation (ex: "users": [User])
- [X] Entity custom methods (ex: payment.calculate())
- [ ] Default values 
- [ ] Entity (complex) validation (ex: payment.validate() )
- [ ] Field validation error message (ex: payment.errors )
- [ ] Entity hidrate (ex: fromJson)
- [ ] Entity serialize (ex: toJson)
- [ ] Extend / Custom field validation (ex: email, greater than, etc)
- [ ] Valitation contexts (ex: Payment validation for [1] credit card or [2] check)
- [ ] Conditional Validation (ex: if email is present, emailConfirmation must be present)
- [ ] Entities Inheritance (schema and validations inheritance)

