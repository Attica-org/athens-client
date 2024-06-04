import type { Config } from 'tailwindcss';

type Acc = {
  [key: string]: string;
};

const range = (start: number, end: number) => Array.from({
  length: end - start + 1,
}, (_, i) => start + i);

const pxToRem = (px: number, base = 16) => `${px / base}rem`;
const remToPx = (rem: number, base = 16) => `${rem * base}px`;

const value = {
  ...range(0, 300).reduce((acc: Acc, rem: number) => {
    acc[`${rem}rem`] = remToPx(rem);
    acc[`${rem}`] = pxToRem(rem);
    return acc;
  }, {}),
  '0.5rem': '9px',
  '1.5rem': '27px',
  '2.5rem': '45px',
};

const config: Config = {
  mode: 'jit',
  darkMode: 'class',
  content: [
    './src/app/_components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // fontWeight: {
    //   normal: '400',
    //   bold: '700',
    // },
    extend: {
      // fontFamily: {
      //   noto: ['var(--noto_sans_kr)', 'sans-serif'],
      // },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderWidth: {
        1: '1px', // 1px 단위 추가
      },
      colors: {
        'toast-bg': '#6a6a6c',
        'athens-main': '#10AE5D',
        'athens-gray': '#F1F3F5',
        'athens-button': '#21d2a1',
        'athens-sub': '#FEAC3E',
        'athens-gray-thick': '#666666',
        'agora-point-color1': '#00ADAC',
        'agora-point-color2': '#79E0D9',
        'agora-point-color3': '#E1C5B9',
        'agora-point-color4': '#FAC171',
        'agora-point-color5': '#FFBEC1',
        'agora-point-color6': '#35627B',

        'dark-bg-light': '#262626',
        'dark-bg-dark': '#191919',
        'dark-line': '#D0CDCD',
        'dark-line-light': '#E9E9E9',
        'dark-line-semilight': '#ADADAD',
        'dark-light-500': '#636366',
        'dark-light-400': '#A6A6A6',
        'dark-light-300': '#3A3A3B',
        'dark-light-200': '#404040',
        'dark-light-100': '#383838',
        'dark-pro-color': '#73BBFF',
        'dark-con-color': '#FF9685',
      },
    },
    screens: {
      'under-mobile': { max: '359px' },
      mobile: '360px',
      'under-foldable': { max: '522px', min: '410px' },
      foldable: '523px',
      sm: '640px',
      'under-tablet': { max: '767px', min: '695px' },
      tablet: '768px',
      md: '768px',
      'under-large': { max: '1023px', min: '865px' },
      lg: '1024px',
      'under-xl': { max: '1279px', min: '1024px' },
      xl: '1280px',
      '2xl': { min: '1536px' },
    },
    spacing: {
      ...value,
    },
  },
  plugins: [
    ({ addUtilities }: any) => {
      addUtilities({
        '.scrollbar-hide': {
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.text-xxs': {
          fontSize: '0.625rem',
        },
        '.max-width-screen': {
          maxWidth: '1580px',
        },
        '.input-number-hide': {
          '&::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
          '&::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
          '-moz-appearance': {
            appearance: 'textfield',
          },
          appearance: 'textfield',
        },
      });
    },
  ],
};
export default config;
