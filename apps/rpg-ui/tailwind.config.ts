import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 16px 34px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(232, 221, 198, 0.035)',
        inset: 'inset 0 1px 0 rgba(232, 221, 198, 0.04)'
      },
      backgroundImage: {
        mesh:
          'radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 36%), radial-gradient(circle at bottom right, rgba(255,255,255,0.04), transparent 24%)'
      }
    }
  },
  plugins: []
} satisfies Config;
