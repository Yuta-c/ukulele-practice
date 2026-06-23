/**
 * Custom ESLint flat config for Next.js 16 + ESLint 10.
 *
 * eslint-plugin-react v7 uses the removed getFilename() API and crashes under
 * ESLint 10's flat config. We therefore build the config manually from the
 * compatible sub-configs exported by eslint-config-next.
 */
import coreWebVitals from "eslint-config-next/core-web-vitals";

// Index 0 = react / jsx-a11y / import (broken with ESLint 10 due to react plugin)
// Index 1 = @typescript-eslint  (works)
// Index 2 = ignores             (works)
// Index 3 = @next/next          (works)
const [, tsConfig, ignoresConfig, nextConfig] = coreWebVitals;

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  tsConfig,
  ignoresConfig,
  nextConfig,
  {
    // React Hooks rules via standalone plugin (ESLint-10 compatible)
    plugins: {
      "react-hooks": (await import("eslint-plugin-react-hooks")).default,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Project-level rule overrides
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
