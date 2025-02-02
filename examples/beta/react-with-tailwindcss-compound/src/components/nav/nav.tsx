import React from "react";
import { cva, type VariantProps } from "cva";

/* Root
  ============================================ */

export const root = cva({
  base: [
    "[--nav-item-py-offset:calc(var(--nav-item-py)*0.5*-1)]",
    "flex flex-col",
    "rounded-[--nav-radius]",
    "border border-zinc-200",
    "shadow-sm",
  ],
  variants: {
    density: {
      compact: [
        "[--nav-radius:theme(borderRadius.lg)]",
        "[--nav-item-px:theme(space.3)]",
        "[--nav-item-py:theme(space.2)]",
      ],
      cozy: [
        "[--nav-radius:theme(borderRadius.xl)]",
        "[--nav-item-px:theme(space.5)]",
        "[--nav-item-py:theme(space.4)]",
      ],
    },
  },
  defaultVariants: {
    density: "compact",
  },
});

export interface RootProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof root> {}

export const Root: React.FC<RootProps> = ({ className, density, ...props }) => (
  <ul
    // note: `data-*`  attributes not required, but useful.
    data-id="nav-root"
    data-density={density}
    className={root({ className, density })}
    {...props}
  />
);

/* Item
  ============================================ */

export const item = cva({
  base: "group/nav-item mt-[--nav-item-py-offset] first:mt-0",
});

export interface ItemProps
  extends React.LiHTMLAttributes<HTMLLIElement>,
    VariantProps<typeof item> {}

export const Item: React.FC<ItemProps> = ({ className, ...props }) => (
  <li data-id="nav-item" className={item({ className })} {...props} />
);

/* Link
  ============================================ */

export const link = cva({
  base: [
    "relative flex bg-transparent font-light text-sm text-zinc-800",
    "px-[--nav-item-px] py-[--nav-item-py]",
    "hover:bg-zinc-50 hover:text-zinc-900 hover:z-20",
    "focus-visible:bg-white focus-visible:z-30 focus-visible:outline-none",
    "focus-visible:ring focus-visible:ring-zinc-600 focus-visible:ring-2",
    "group-first/nav-item:rounded-t-[--nav-radius]",
    "group-last/nav-item:rounded-b-[--nav-radius]",
  ],
});

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof link> {}

export const Link: React.FC<LinkProps> = ({ className, ...props }) => (
  <a data-id="nav-link" className={link({ className })} {...props} />
);
