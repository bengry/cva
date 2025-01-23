An extended version of `cva`, making it more type-safe, and adding a few features and which were missing from the original

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

---

![CVA](/docs/latest/public/assets/img/wallpaper-hd.jpg)

<h1 align="center">cva-extended</h1>

<p align="center">
  <strong>C</strong>lass <strong>V</strong>ariance <strong>A</strong>uthority - Extended
</p>

<p align="center">
  <a href="https://cva.style"><strong>Read the Docs 📖</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/class-variance-authority">
    <img alt="NPM Version" src="https://badgen.net/npm/v/class-variance-authority" />
  </a>
  <a href="https://www.npmjs.com/package/class-variance-authority">
    <img alt="Types Included" src="https://badgen.net/npm/types/class-variance-authority" />
  </a>
  <a href="https://bundlephobia.com/result?p=class-variance-authority">
    <img alt="Minizipped Size" src="https://img.shields.io/bundlephobia/minzip/class-variance-authority" />
  </a>
  <a href="https://github.com/bengry/cva-extended/blob/main/LICENSE">
    <img alt="Apache-2.0 License" src="https://badgen.net/github/license/bengry/cva-extended" />
  </a>
  <a href="https://www.npmjs.com/package/class-variance-authority">
    <img alt="NPM Downloads" src="https://badgen.net/npm/dm/class-variance-authority" />
  </a>
  <a href="https://joebell.studio/bluesky">
    <img alt="Follow Joe Bell on Bluesky" src="https://img.shields.io/badge/Bluesky-@joebell.studio-1285FE?logo=bluesky&logoColor=1285FE" />
  </a>
</p>

<br />

<a href="https://polar.sh/cva"><picture><source media="(prefers-color-scheme: dark)" srcset="https://polar.sh/embed/tiers.svg?org=cva&darkmode"><img alt="Subscription Tiers on Polar" src="https://polar.sh/embed/tiers.svg?org=cva"></picture></a>

<p align="center">
  <a href="https://raw.githubusercontent.com/bengry/cva-extended/refs/heads/main/.github/static/sponsorkit/sponsors.svg">
    <img src='./.github/static/sponsorkit/sponsors.svg'/>
  </a>
</p>

## Documentation

Visit [**cva.style**](https://cva.style) to get started.

## License

[Apache-2.0 License](/LICENSE) © [Joe Bell](https://joebell.studio)
