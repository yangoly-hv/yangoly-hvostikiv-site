import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  {
    // Payment/WayForPay code is intentionally handled in a separate migration.
    ignores: [
      "src/app/api/wayforpay/**",
      "src/modules/Hero/Donation/**",
      "src/modules/SupportFundraising/**",
      "src/shared/components/DonateModal/**",
      "src/shared/components/KeepingModal/**",
      "src/shared/components/Sliders/FundraisingSlider.tsx",
      "src/shared/components/PaymentReturnHandler/**",
      "src/shared/lib/donate.ts",
    ],
  },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "react-hooks/immutability": "error",
      "react-hooks/purity": "error",
      "react-hooks/set-state-in-effect": "error",
      "react-hooks/static-components": "error",
    },
  },
  {
    files: ["src/shared/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**", "@/modules/**", "@/app/**"],
              message: "shared may not depend on features, widgets/modules, or app",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/**",
                "@/modules/**",
                "@/widgets/**",
                "@/app/**",
              ],
              message: "features may only depend on their own relative modules and shared",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
