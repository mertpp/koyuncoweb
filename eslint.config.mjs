import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated from the koyun-api OpenAPI (task api:generate). Never edited by hand.
    "src/shared/api/generated/**",
  ]),
  // Design system guard (doc/design-system.md): pages compose src/shared/components/koyun/
  // and tokens, never loose values. Warning for now; becomes an error once the existing
  // screens are migrated.
  {
    files: ["src/app/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/-\\[/], TemplateElement[value.raw=/-\\[/]",
          message:
            "Arbitrary Tailwind value (`*-[…]`). Use a design token or a koyun piece (doc/design-system.md).",
        },
        {
          selector:
            "Literal[value=/(^|\\s)\\S*rounded(-[a-z]{1,2})?-(2xl|3xl|4xl)\\b/], TemplateElement[value.raw=/(^|\\s)\\S*rounded(-[a-z]{1,2})?-(2xl|3xl|4xl)\\b/]",
          message:
            "Radius above xl. The scale stops at rounded-xl (modals only); cards and buttons use rounded-lg (doc/DESIGN.md).",
        },
        {
          selector: "JSXAttribute[name.name='className'] Literal[value=/#[0-9a-fA-F]{3,8}\\b/]",
          message: "Hex colour in className. Use a colour token (bg-primary, text-ink…).",
        },
      ],
    },
  },
]);

export default eslintConfig;
