import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F2937',
          light: '#374151',
          dark: '#111827',
        },
        accent: {
          DEFAULT: '#FFF4F0',
          warm: '#FFF4F0',
          peach: '#FFE5DC',
        },
        surface: {
          DEFAULT: '#FAFAF8',
          alt: '#F5F5F5',
          dark: '#1E1E1E',
          muted: '#2D2D2D',
        },
        text: {
          primary: '#1F1F1F',
          secondary: '#6B6B6B',
          muted: '#8E8E8E',
          inverse: '#FAFAF8',
        },
        border: {
          DEFAULT: '#E5E5E5',
          subtle: '#EEEEEE',
        },
        success: '#5A8F6B',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-ibm-plex)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
