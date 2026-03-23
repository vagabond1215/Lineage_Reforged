import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 22px 60px rgba(0, 0, 0, 0.35)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 36%), radial-gradient(circle at bottom right, rgba(255,255,255,0.04), transparent 24%)'
      }
    }
  },
  plugins: []
} satisfies Config;
