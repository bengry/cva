import { describe, expect, test } from "vitest";
import { cva } from "../index";
import { getSchema } from "./getSchema";

describe("getSchema", () => {
  test("should return the schema of a component", () => {
    const button = cva({
      variants: {
        intent: {
          primary: "bg-blue-500",
          secondary: "bg-white",
        },
      },
    });

    const buttonSchema = getSchema(button);
    expect(buttonSchema).toEqual({
      intent: ["primary", "secondary"],
    });

    expectTypeOf(buttonSchema).toEqualTypeOf<{
      intent: ReadonlyArray<"primary" | "secondary">;
    }>();
  });
});
