# cva-extended

An extended version of [cva](https://github.com/joe-bell/cva), with additional features:

For the main documentation, visit [beta.cva.style](https://beta.cva.style).

## Extended Features

### `variants` object exposed on a cva component

```ts
const button = cva({
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-white",
    },
    disabled: {
      true: "opacity-50",
      false: "opacity-100",
    },
  },
});

button.variants; // { intent: ["primary", "secondary"], disabled: [true, false] }
typeof button.variants;
//            ^?
//            {
//              "intent": ReadonlyArray<'primary' | 'secondary'>,
//              "disabled": readonly boolean[]
//            }
//
```

### Require variants, unless a default is provided in `defaultVariants`

```ts
const button = cva({
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-white",
    },
  },
});

button(); // Error: Missing required variant: intent

const optionalIntent = cva({
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-white",
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

optionalIntent(); // No error
```

### Private variants

```ts
const button = cva({
  variants: {
    intent: {
      primary: "bg-blue-500",
      secondary: "bg-white",
    },
    $private: {
      true: "private",
    },
  },
});

button({ $private: true }); // Error: Variant $private is not exposed
button.variants; // { intent: ["primary", "secondary"] }
typeof button.variants;
//            ^?
//            {
//              "intent": ReadonlyArray<'primary' | 'secondary'>
//            }
//
```
