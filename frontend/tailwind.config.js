/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MASTER PROMPT EXACT PALETTE
        teal: {
          DEFAULT: '#109A9B', // Primary Teal
          50: '#EAF6F6',
          100: '#D5EDEE',
          500: '#109A9B',
          600: '#0E8586',
        },
        tealDark: '#123C43',   // Dark Teal
        tealDeep: '#063E46',   // Very Dark Teal
        navyDeep: '#0B1F2A',   // Deep Navy
        cream: {
          DEFAULT: '#FDE7B5', // Pale Beige / Cream
          50: '#FFFDF7',
          100: '#FAF4E1',
          500: '#FDE7B5',
        },
        softYellow: '#FFD85A', // Soft Yellow Accent
        paleYellow: '#FFF4B5', // Warm Yellow Glow
        softCream: '#FFFDF7',  // Soft Cream
        offWhite: '#FFF8E8',   // Warm Off White
        baseCream: '#FDE7B5',  // Base Pale Beige
        ink: '#0B1F2A',        // Text Dark
        navy: '#0B1F2A',       // Deep Navy
        muted: '#53656A',      // Muted Text
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        archivo: ['Archivo Black', 'sans-serif'],
        hero: ['Archivo Black', 'sans-serif'],
        heading: ['Sora', 'Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        display: ['Sora', 'Space Grotesk', 'Plus Jakarta Sans', 'sans-serif'],
        handwritten: ['Caveat', 'Comic Sans MS', 'cursive'],
      },
      boxShadow: {
        'soft-glow': '0 20px 40px -15px rgba(16, 154, 155, 0.15)',
        'floating-bar': '0 20px 60px rgba(11, 31, 42, 0.12)',
        'floating-nav': '0 10px 35px rgba(11, 31, 42, 0.08)',
        'hero-card': '0 25px 70px -15px rgba(11, 31, 42, 0.18)',
        'side-panel': '0 20px 50px rgba(0, 0, 0, 0.22)',
      },
      backgroundImage: {
        'teal-gradient': 'linear-gradient(135deg, #109A9B 0%, #123C43 100%)',
        'btn-teal-gradient': 'linear-gradient(135deg, #0D5960 0%, #063E46 100%)',
        'sidebar-gradient': 'linear-gradient(180deg, rgba(18,60,67,0.95) 0%, rgba(11,31,42,0.95) 100%)',
        'cream-teal-blend': 'linear-gradient(135deg, #FDE7B5 0%, #FFF9E8 45%, #109A9B 140%)',
      }
    },
  },
  plugins: [],
}
