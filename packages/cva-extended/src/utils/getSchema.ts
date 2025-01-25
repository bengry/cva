import { variantsKey } from "../_internal/symbols";
import type {
  AnyCVABuilderFunction,
  AnyFunction,
  ClassValue,
  VariantProps,
} from "../index";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

type CVAVariantShape = Record<string, Record<string, ClassValue>>;
type StringToBoolean<T> = T extends "true" | "false" ? boolean : T;

export type SchemaOf<TComponent> = TComponent extends AnyFunction
  ? Simplify<{
      [Variant in keyof VariantProps<TComponent>]: ReadonlyArray<
        StringToBoolean<VariantProps<TComponent>[Variant]>
      >;
    }>
  : never;

export function getSchema<TComponent extends ReturnType<AnyCVABuilderFunction>>(
  component: NonNullable<TComponent>,
): SchemaOf<TComponent> {
  const variants = (typeof component === "object" &&
    variantsKey in component &&
    component[variantsKey]) as CVAVariantShape | undefined;

  if (variants == null) return {} as SchemaOf<TComponent>;

  return Object.fromEntries(
    Object.entries(variants)
      // filter out private variants
      .filter(([variantKey]) => !variantKey.startsWith("$"))
      .map(([key, value]) => [
        key,
        Object.keys(value).map((propertyKey) =>
          normalizeVariantKey(propertyKey),
        ),
      ]),
  ) as unknown as SchemaOf<TComponent>;
}

const normalizeVariantKey = <T extends string>(value: T) => {
  if (value === "true") return true;
  if (value === "false") return false;

  const maybeNumber = Number(value);
  if (!Number.isNaN(maybeNumber)) return maybeNumber;

  return value;
};
