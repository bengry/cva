/**
 * Copyright 2022 Joe Bell. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR REPRESENTATIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
import { clsx } from "clsx";

/* Types
  ============================================ */

/* clsx
  ---------------------------------- */

// When compiling with `declaration: true`, many projects experience the dreaded
// TS2742 error. To combat this, we copy clsx's types manually.
// Should this project move to JSDoc, this workaround would no longer be needed.

export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = ClassValue[];

/* Utils
  ---------------------------------- */

type OmitUndefined<T> = T extends undefined ? never : T;
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;
type AnyFunction = (...args: any[]) => any;
type RequiredKeys<O extends object, K extends keyof O> = Omit<O, K> &
  Required<Pick<O, K>>;

/**
 * A private variant is a variant that is not meant to be used by the consumer, and is not exposed via `VariantProps`.
 * Any variant that starts with a `$` is considered a private variant.
 */
type PrivateVariant<TVariantName extends string = string> = `$${TVariantName}`;

export type VariantProps<Component extends AnyFunction> = Omit<
  InternalVariantProps<Component>,
  PrivateVariant
>;

type InternalVariantProps<Component extends (...args: any) => any> = Omit<
  OmitUndefined<Parameters<Component>[0]>,
  "class" | "className"
>;

const falsyToString = <T extends unknown>(value: T) =>
  typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;

/* compose
  ---------------------------------- */

type AnyCVABuilderFunction = AnyFunction & {
  variants: never | Record<string, readonly VariantValue[]>;
};
export interface Compose {
  <T extends AnyCVABuilderFunction[]>(
    ...components: [...T]
  ): ((
    props: UnionToIntersection<
      {
        // for every component, get its props
        [K in keyof T]: InternalVariantProps<T[K]>;
      }[number]
    > &
      CVAClassProp,
  ) => string) & {
    variants: UnionToIntersection<Exclude<T[number]["variants"], never>>;
  };
}

/* cx
  ---------------------------------- */

export interface CX {
  (...inputs: ClassValue[]): string;
}

export type CXOptions = Parameters<CX>;
export type CXReturn = ReturnType<CX>;

/* cva
  ============================================ */

type CVAConfigBase = { base?: ClassValue };
type CVAVariantShape = Record<string, Record<string, ClassValue>>;
type CVAVariantSchema<V extends CVAVariantShape> = {
  [Variant in keyof V]?: StringToBoolean<keyof V[Variant]> | undefined;
};
type CVAClassProp =
  | {
      class?: ClassValue;
      className?: never;
    }
  | {
      class?: never;
      className?: ClassValue;
    };

type CVAVariantSchemaProps<V extends CVAVariantSchema<any>, D> = RequiredKeys<
  V,
  // Everything that doesn't have a default value declared
  Exclude<keyof V, keyof D>
>;

export interface CVA {
  <
    _ extends "cva's generic parameters are restricted to internal use only.",
    TVariants,
    TDefaultVariants,
  >(
    config: TVariants extends CVAVariantShape
      ? CVAConfigBase & {
          variants?: TVariants;
          compoundVariants?: (TVariants extends CVAVariantShape
            ? (
                | CVAVariantSchema<TVariants>
                | {
                    [Variant in keyof TVariants]?:
                      | StringToBoolean<keyof TVariants[Variant]>
                      | readonly StringToBoolean<keyof TVariants[Variant]>[]
                      | undefined;
                  }
              ) &
                CVAClassProp
            : CVAClassProp)[];
          /**
           * The default values that will be used when a variant is not provided.
           * To mark a property as optional without specifying a value, use `undefined`.
           *
           * @example
           * ```ts
           * const box = cva({
           *   variants: {
           *     border: {
           *       true: '...'
           *     }
           *   },
           *   defaultVariants: {
           *     border: undefined
           *   }
           * })
           * ```
           */
          defaultVariants?: CVAVariantSchema<TVariants> & TDefaultVariants;
        }
      : CVAConfigBase & {
          variants?: never;
          compoundVariants?: never;
          defaultVariants?: never;
        },
  ): OptionalizeParameter<
    (
      props: CVAClassProp &
        (TVariants extends CVAVariantShape
          ? CVAVariantSchemaProps<CVAVariantSchema<TVariants>, TDefaultVariants>
          : {}),
    ) => string
  > & {
    variants: TVariants extends CVAVariantShape
      ? {
          [K in Exclude<keyof TVariants, `$${string}`>]: ReadonlyArray<
            StringToBoolean<Extract<keyof TVariants[K], VariantValue>>
          >;
        }
      : never;
  };
}

/**
 * A function that accepts one parameter `T` and returns another parameter `R`.
 */
type UnaryFunction<in T, R> = (arg: T) => R;

/**
 * Takes in an unary function and returns the same function, with the first parameter being optional, if the original function's first parameter is an
 * object with all of its keys being optional.
 */
type OptionalizeParameter<F extends UnaryFunction<any, any>> = F extends (
  // the single parameter of the function is equal to itself when all of its keys are optional (i.e. `T == Partial<T>`)
  arg: Partial<Parameters<F>[0]>,
) => infer R
  ? (arg?: Parameters<F>[0]) => R
  : F;

type VariantValue = string | number | boolean;

/* defineConfig
  ---------------------------------- */

export interface DefineConfigOptions {
  hooks?: {
    /**
     * @deprecated please use `onComplete`
     */
    "cx:done"?: (className: string) => string;
    /**
     * Returns the completed string of concatenated classes/classNames.
     */
    onComplete?: (className: string) => string;
  };
}

export interface DefineConfig {
  (options?: DefineConfigOptions): {
    compose: Compose;
    cx: CX;
    cva: CVA;
  };
}

/* Exports
  ============================================ */

export const defineConfig: DefineConfig = (options) => {
  const cx: CX = (...inputs) => {
    if (options?.hooks?.["cx:done"] !== undefined)
      return options?.hooks["cx:done"](clsx(inputs));

    if (options?.hooks?.onComplete !== undefined)
      return options?.hooks.onComplete(clsx(inputs));

    return clsx(inputs);
  };

  const cva: CVA = (config) => {
    const { variants, defaultVariants } = config ?? {};

    const cvaClassBuilder = ((props) => {
      if (variants == null)
        return cx(config?.base, props?.class, props?.className);

      const getVariantClassNames = Object.keys(variants).map(
        (variant: keyof typeof variants) => {
          const variantProp = props?.[variant as keyof typeof props];
          const defaultVariantProp = defaultVariants?.[variant];

          const variantKey = (falsyToString(variantProp) ||
            falsyToString(
              defaultVariantProp,
            )) as keyof (typeof variants)[typeof variant];

          return variants[variant]![variantKey];
        },
      );

      const defaultsAndProps = {
        ...defaultVariants,
        // remove `undefined` props
        ...(props &&
          Object.entries(props).reduce<typeof props>(
            (acc, [key, value]) => {
              if (value !== undefined) {
                Object.assign(acc, { [key]: value });
              }

              return acc;
            },
            {} as typeof props,
          )),
      };

      const getCompoundVariantClassNames = config?.compoundVariants?.reduce(
        (acc, { class: cvClass, className: cvClassName, ...cvConfig }) =>
          Object.entries(cvConfig).every(([cvKey, cvSelector]) => {
            const selector =
              defaultsAndProps[cvKey as keyof typeof defaultsAndProps];

            return Array.isArray(cvSelector)
              ? cvSelector.includes(selector)
              : selector === cvSelector;
          })
            ? [...acc, cvClass, cvClassName]
            : acc,
        [] as ClassValue[],
      );

      return cx(
        config?.base,
        getVariantClassNames,
        getCompoundVariantClassNames,
        props?.class,
        props?.className,
      );
    }) as ReturnType<CVA>;

    return Object.assign(cvaClassBuilder, {
      variants: variants
        ? Object.fromEntries(
            Object.entries(variants)
              // filter out private variants
              .filter(([variantKey]) => !variantKey.startsWith("$"))
              .map(([key, value]) => [key, Object.keys(value)]),
          )
        : {},
    });
  };

  const compose: Compose = ((...components) => {
    const composeClassBuilder = ((props) => {
      const propsWithoutClass = Object.fromEntries(
        Object.entries(props || {}).filter(
          ([key]) => !["class", "className"].includes(key),
        ),
      );

      return cx(
        components.map((component) => component(propsWithoutClass)),
        props?.class,
        props?.className,
      );
    }) as ReturnType<Compose>;

    return Object.assign(composeClassBuilder, {
      variants: components.reduce(
        (variantsDraft, { variants }) => {
          // eslint-disable-next-line guard-for-in
          for (const variant in variants) {
            // If both have the same values (e.g. size, and both have xsmall, small, ...), you end up with an array like:
            // ['xsmall', 'small', ..., 'xsmall', 'small', ...] instead of just ['xsmall', 'small', ...]
            variantsDraft[variant] = [
              ...new Set([
                ...(variantsDraft[variant] ?? []),
                ...(variants[variant] ?? []),
              ]),
            ];
          }

          return variantsDraft;
        },
        {} as {
          [variant: string]: VariantValue[];
        },
      ),
    });
  }) as Compose;

  return {
    compose,
    cva,
    cx,
  };
};

export const { compose, cva, cx } = defineConfig();
