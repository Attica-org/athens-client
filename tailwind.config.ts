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
  "0.5rem": "9px",
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
      borderWidth: {
        "1": "1px", // 1px 단위 추가
      },
      colors: {
        "athens-main": "#10AE5D",
        "athens-gray": "#F1F3F5",
        "athens-button": "#21d2a1",
        "athens-sub": "#FEAC3E",
        "athens-gray-500": "#A9A5A5",
      },
    },
    screens: {
      "under-mobile": { max: "389px" },
      mobile: "360px",
      "under-foldable": { max: "522px", min: "410" },
      foldable: "523px",
      sm: "640px",
      "under-tablet": { max: "767px", min: "640px" },
      tablet: "768px",
      md: "768px",
      "under-large": { max: "1023px", min: "821px" },
      lg: "1024px",
      "under-xl": { max: "1279px", min: "1024px" },
      xl: "1280px",
      "2xl": { min: "1536px" },
    },
    spacing: {
      ...value,
    },
  },
  plugins: [
    ({ addUtilities }: any) => {
      addUtilities({
        ".scrollbar-hide": {
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
export default config;
