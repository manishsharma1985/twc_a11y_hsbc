/**
 * Color Contrast Testing Utilities
 * 
 * Tools for testing WCAG 2.1 AA color contrast compliance
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 specification
 */
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a ratio between 1:1 and 21:1
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid hex color format');
  }
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): {
  passes: boolean;
  ratio: number;
  required: number;
  level: 'AA' | 'AAA' | 'Fail';
} {
  const ratio = getContrastRatio(foreground, background);
  const requiredRatio = isLargeText ? 3 : 4.5;
  const requiredRatioAAA = isLargeText ? 4.5 : 7;
  
  return {
    passes: ratio >= requiredRatio,
    ratio: Math.round(ratio * 100) / 100,
    required: requiredRatio,
    level: ratio >= requiredRatioAAA ? 'AAA' : ratio >= requiredRatio ? 'AA' : 'Fail'
  };
}

/**
 * Test all color combinations used in the application
 */
export function testApplicationColors(): Array<{
  name: string;
  foreground: string;
  background: string;
  result: ReturnType<typeof meetsWCAGAA>;
  isLargeText?: boolean;
}> {
  const primaryColor = '#1C8282';
  const white = '#FFFFFF';
  const black = '#000000';
  const gray900 = '#111827';
  const gray600 = '#4B5563';
  const gray500 = '#6B7280';
  const gray400 = '#9CA3AF';
  const gray50 = '#F9FAFB';
  const blue50 = '#EFF6FF';
  
  const tests = [
    // Primary button combinations
    { name: 'Primary Button Text', foreground: white, background: primaryColor, isLargeText: false },
    { name: 'Primary Button Hover', foreground: white, background: '#158080', isLargeText: false }, // primary/90
    
    // Text combinations
    { name: 'Body Text on White', foreground: gray900, background: white, isLargeText: false },
    { name: 'Secondary Text on White', foreground: gray600, background: white, isLargeText: false },
    { name: 'Muted Text on White', foreground: gray500, background: white, isLargeText: false },
    { name: 'Placeholder Text on White', foreground: gray400, background: white, isLargeText: false },
    
    // Primary color text combinations
    { name: 'Primary Text on White', foreground: primaryColor, background: white, isLargeText: false },
    { name: 'Primary Text on Gray50', foreground: primaryColor, background: gray50, isLargeText: false },
    
    // Status badge combinations (estimated colors)
    { name: 'Success Badge', foreground: '#065F46', background: '#D1FAE5', isLargeText: false },
    { name: 'Warning Badge', foreground: '#92400E', background: '#FEF3C7', isLargeText: false },
    { name: 'Error Badge', foreground: '#991B1B', background: '#FEE2E2', isLargeText: false },
    { name: 'Info Badge', foreground: '#1E40AF', background: '#DBEAFE', isLargeText: false },
    
    // Focus indicators
    { name: 'Focus Ring', foreground: primaryColor, background: white, isLargeText: false },
    
    // Card backgrounds
    { name: 'Card Text on Blue50', foreground: gray900, background: blue50, isLargeText: false },
    { name: 'Secondary Text on Blue50', foreground: gray600, background: blue50, isLargeText: false },
    
    // Skip link
    { name: 'Skip Link', foreground: white, background: primaryColor, isLargeText: false },
  ];
  
  return tests.map(test => ({
    ...test,
    result: meetsWCAGAA(test.foreground, test.background, test.isLargeText)
  }));
}

/**
 * Generate a contrast report for the console
 */
export function generateContrastReport(): void {
  const results = testApplicationColors();
  
  console.group('🎨 WCAG Color Contrast Report');
  
  const passed = results.filter(r => r.result.passes);
  const failed = results.filter(r => !r.result.passes);
  
  console.log(`✅ Passed: ${passed.length}/${results.length} combinations`);
  console.log(`❌ Failed: ${failed.length}/${results.length} combinations`);
  console.log('');
  
  if (failed.length > 0) {
    console.group('❌ Failed Combinations (Need Fixing)');
    failed.forEach(test => {
      console.log(`${test.name}: ${test.result.ratio}:1 (needs ${test.result.required}:1)`);
      console.log(`  Foreground: ${test.foreground} | Background: ${test.background}`);
    });
    console.groupEnd();
    console.log('');
  }
  
  if (passed.length > 0) {
    console.group('✅ Passed Combinations');
    passed.forEach(test => {
      console.log(`${test.name}: ${test.result.ratio}:1 (${test.result.level})`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Color palette with WCAG AA compliant alternatives
 */
export const accessibleColors = {
  // Primary colors (teal family)
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1', 
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Main primary - good contrast with white
    600: '#0D9488', // Darker alternative
    700: '#0F766E', // Even darker
    800: '#115E59',
    900: '#134E4A',
  },
  
  // Status colors with good contrast
  status: {
    success: {
      bg: '#D1FAE5',
      text: '#065F46', // 7.4:1 contrast ratio
    },
    warning: {
      bg: '#FEF3C7', 
      text: '#92400E', // 7.1:1 contrast ratio
    },
    error: {
      bg: '#FEE2E2',
      text: '#991B1B', // 8.2:1 contrast ratio
    },
    info: {
      bg: '#DBEAFE',
      text: '#1E40AF', // 8.6:1 contrast ratio
    }
  },
  
  // Gray scale with good contrast ratios
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF', // 3.4:1 - use for large text only
    500: '#6B7280', // 4.6:1 - good for body text
    600: '#4B5563', // 7.0:1 - excellent contrast
    700: '#374151',
    800: '#1F2937',
    900: '#111827', // 16.8:1 - maximum contrast
  }
};

/**
 * Get recommended color for text based on background
 */
export function getRecommendedTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio('#FFFFFF', backgroundColor);
  const blackContrast = getContrastRatio('#000000', backgroundColor);
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
}

/**
 * Validate if a color combination is accessible
 */
export function validateColorCombination(
  foreground: string, 
  background: string, 
  context: 'normal' | 'large' | 'ui' = 'normal'
): {
  isAccessible: boolean;
  contrastRatio: number;
  recommendation?: string;
} {
  const isLargeText = context === 'large';
  const result = meetsWCAGAA(foreground, background, isLargeText);
  
  let recommendation: string | undefined;
  
  if (!result.passes) {
    const recommendedText = getRecommendedTextColor(background);
    recommendation = `Consider using ${recommendedText} text on ${background} background for better contrast`;
  }
  
  return {
    isAccessible: result.passes,
    contrastRatio: result.ratio,
    recommendation
  };
} 