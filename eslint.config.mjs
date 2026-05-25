import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next-locked-*/**"]
  },
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off"
    }
  }
];

export default eslintConfig;
