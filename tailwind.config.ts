import type { Config } from "tailwindcss";

type Acc = {
  [key: string]: string;
};

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const pxToRem = (px: number, base = 16) => `${px / base}rem`;
const remToPx = (rem: number, base = 16) => `${rem * base}px`;

const value = {
  ...range(0, 300).reduce((acc: Acc, rem: number) => {
    acc[`${rem}rem`] = remToPx(rem);
    acc[`${rem}`] = pxToRem(rem);
    return acc;
  }, {}),
  "1.5rem": "27px",
  "2.5rem": "45px",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "athens-main": "#10AE5D",
        "athens-gray": "#F1F3F5",
        "athens-button": "#21d2a1",
      },
    },
    spacing: {
      ...value,
    },
  },
  plugins: [],
};
export default config;
