# JSDoc Tags

## Common Tags

- **`@param {Type} paramName`**: Describes a function parameter.
- **`@returns {Type}`**: Describes the return value of a function.
- **`@type {Type}`**: Describes the type of a variable.
- **`@description`**: Provides a detailed description of a function or variable.
- **`@example`**: Provides usage examples.
- **`@memberOf`**: Indicates the parent namespace or class.
- **`@see`**: Provides a reference to related documentation.

## Additional Tags

- **`@class`**: Describes a JavaScript class.
- **`@constructor`**: Describes a constructor function within a class.
- **`@property`**: Describes a property of an object or class.
- **`@namespace`**: Describes a JavaScript namespace.
- **`@typedef`**: Defines a custom type.
- **`@callback`**: Describes a callback function.
- **`@event`**: Describes an event.
- **`@throws`**: Describes an exception thrown by a function.
- **`@deprecated`**: Marks a function, class, or property as deprecated.
- **`@inheritdoc`**: Inherit documentation from a parent element.

# JSDoc Tag Examples

## `@param`, `@returns`

```javascript
/**
 * Adds two numbers together.
 * @param {number} x - The first number
 * @param {number} y - The second number
 * @returns {number} The sum of x and y
 */
function add(x, y) {
  return x + y;
}
```

## `@type`

```javascript
/**
 * @type {number}
 */
let count = 0;
```

## `@description`

Make this a description for the function and each parameter and the return value

```javascript
/**
 * @function add
 * @description Adds two numbers together.
 * @param {number} x - The first number
 * @description The first number to add
 * @param {number} y - The second number
 * @description The second number to add
 * @returns {number} The sum of x and y
 * @description The sum of the two numbers
 * @example add(1, 2) // 3
 */
function add(x, y) {
  return x + y;
}
```
