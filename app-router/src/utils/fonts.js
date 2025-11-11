import { Poppins } from 'next/font/google';

// Configure Poppins font with optimal settings for performance
export const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap', // Prevents layout shift
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  preload: true, // Preload the font for better performance
  fallback: ['system-ui', 'arial'], // Fallback fonts
});

// Export font class name for use in components
export const fontClass = poppins.className;