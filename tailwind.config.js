/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#080B10',
          darker: '#0B0F15',
          card: '#10151D',
        },
        navy: {
          950: '#080B10',
          900: '#0B0F15',
          850: '#10151D',
          800: '#151D28',
        },
        electric: {
          DEFAULT: '#3B82F6',
          secondary: '#2563EB',
          bright: '#4F8CFF',
        },
        cyanGlow: {
          DEFAULT: '#22D3EE',
          bright: '#67E8F9',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          disabled: '#64748B',
        },
        status: {
          success: '#34D399',
          warning: '#FBBF24',
          error: '#FB7185',
        }
      },
      borderRadius: {
        'sm-control': '14px',
        'input': '16px',
        'card': '24px',
        'panel': '32px',
        'hero': '40px',
      },
      boxShadow: {
        'tactile-btn': 'inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 8px 24px rgba(59, 130, 246, 0.4)',
        'tactile-light': 'inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 6px 18px rgba(0, 0, 0, 0.3)',
        'glass-depth': '0 20px 60px rgba(0, 0, 0, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
        'cyan-energy': '0 0 25px rgba(34, 211, 238, 0.35)',
        'blue-energy': '0 0 25px rgba(59, 130, 246, 0.35)',
      },
      animation: {
        'pulse-cyan': 'pulseCyan 2.5s ease-in-out infinite',
        'energy-flow': 'energyFlow 2s linear infinite',
      },
      keyframes: {
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(34, 211, 238, 0.25)', borderColor: 'rgba(34, 211, 238, 0.4)' },
          '50%': { boxShadow: '0 0 28px rgba(34, 211, 238, 0.65)', borderColor: 'rgba(34, 211, 238, 0.8)' },
        },
        energyFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
};
