# DOME Platform Style Guide

## 🎨 Color Palette

### Primary Colors - Navy
```css
navy-900: #0A1628  /* Primary navy - main brand color */
navy-800: #0F1E36  /* Hover state for navy-900 */
navy-700: #142544
navy-600: #1A2C52
navy-500: #1E3A5F  /* Subtle accent blue */
navy-400: #2A456C
navy-300: #36507A
navy-200: #425B88
navy-100: #E8EBF0
```

### Secondary Colors - Slate
```css
slate-900: #1A202C  /* Dark text */
slate-800: #2D3748
slate-700: #4A5568  /* Secondary gray */
slate-600: #718096
slate-500: #A0AEB8
slate-400: #CBD5E0
slate-300: #E2E8F0  /* Borders and dividers */
slate-200: #EDF2F7
slate-100: #F7FAFC
slate-50:  #FAFBFC
```

### Enterprise Colors
```css
enterprise-text:    #1A202C
enterprise-border:  #E2E8F0
enterprise-muted:   #718096
enterprise-surface: #FFFFFF
enterprise-hover:   #F7FAFC
```

### Accent Colors
```css
red-100: #FEE2E2  /* Error/warning background */
red-600: #DC2626  /* Error/warning text */

white: #FFFFFF
gray-50: #F9FAFB
gray-100: #F3F4F6
gray-200: #E5E7EB
gray-300: #D1D5DB
gray-400: #9CA3AF
gray-500: #6B7280
gray-600: #4B5563
gray-700: #374151
```

### CSS Variables
```css
--background: #FFFFFF
--foreground: #1A202C
--navy-primary: #0A1628
--slate-secondary: #4A5568
--border: #E2E8F0
```

## 📝 Typography

### Font Family
```css
font-sans: 'Century Gothic', 'Questrial', '-apple-system', 'sans-serif'
```

**Note:** Questrial is imported from Google Fonts

### Font Sizes
```css
text-xs:   0.75rem  /* 12px */
text-sm:   0.875rem /* 14px */
text-base: 1rem     /* 16px */
text-lg:   1.125rem /* 18px */
text-xl:   1.25rem  /* 20px */
text-2xl:  1.5rem   /* 24px */
text-3xl:  1.875rem /* 30px */
text-4xl:  2.25rem  /* 36px */
text-5xl:  3rem     /* 48px */
text-6xl:  3.75rem  /* 60px */
```

### Font Weights
```css
font-light:    300
font-normal:   400
font-medium:   500
font-semibold: 600
font-bold:     700
```

### Line Heights
```css
leading-tight:   1.25
leading-snug:    1.375
leading-normal:  1.5
leading-relaxed: 1.625
leading-loose:   2
```

## 📐 Spacing

### Common Padding/Margin Values
```css
p-1/m-1:   0.25rem  /* 4px */
p-2/m-2:   0.5rem   /* 8px */
p-3/m-3:   0.75rem  /* 12px */
p-4/m-4:   1rem     /* 16px */
p-5/m-5:   1.25rem  /* 20px */
p-6/m-6:   1.5rem   /* 24px */
p-8/m-8:   2rem     /* 32px */
p-10/m-10: 2.5rem   /* 40px */
p-12/m-12: 3rem     /* 48px */
p-16/m-16: 4rem     /* 64px */
p-20/m-20: 5rem     /* 80px */
```

### Common Spacing Patterns
```css
px-4 sm:px-6 lg:px-8  /* Responsive horizontal padding */
py-12                 /* Section vertical padding */
py-2 px-3            /* Button padding */
py-2 px-5            /* CTA button padding */
space-x-4            /* Horizontal spacing between items */
space-y-1            /* Vertical spacing between items */
gap-4                /* Grid/flex gap */
gap-8                /* Larger grid gap */
```

## 🎯 Border Radius

```css
rounded:     0.25rem  /* 4px */
rounded-md:  0.375rem /* 6px */
rounded-lg:  0.5rem   /* 8px */
rounded-xl:  0.75rem  /* 12px */
rounded-2xl: 1rem     /* 16px */
rounded-full: 9999px  /* Full circle */
```

## 🌟 Effects

### Shadows
```css
shadow-sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow:      0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md:   0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg:   0 10px 15px -3px rgb(0 0 0 / 0.1)
shadow-xl:   0 20px 25px -5px rgb(0 0 0 / 0.1)
shadow-2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25)
drop-shadow-md: filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))

/* Custom enterprise shadows */
enterprise-shadow:    0 4px 6px -1px rgba(26, 32, 44, 0.1)
enterprise-shadow-lg: 0 10px 15px -3px rgba(26, 32, 44, 0.1)
```

### Blur Effects
```css
backdrop-blur: blur(8px)
-webkit-backdrop-filter: blur(8px)
```

### Borders
```css
border:           1px solid
border-2:         2px solid
border-b-2:       2px bottom border
border-gray-200:  #E5E7EB
border-navy-900:  #0A1628
enterprise-border: 1px solid #E2E8F0
```

### Opacity
```css
opacity-70: 0.7
opacity-80: 0.8
opacity-90: 0.9
bg-white/10: rgba(255, 255, 255, 0.1)
bg-navy-900/60: rgba(10, 22, 40, 0.6)
```

## 🎭 Transitions & Animations

### Transitions
```css
transition-colors duration-200
transition-all duration-300
transition-opacity
transition-shadow
```

### Hover States
```css
hover:scale-105
hover:shadow-xl
hover:shadow-2xl
hover:bg-navy-800
hover:text-navy-900
hover:bg-slate-50
hover:opacity-80
```

### Custom Animations
```css
/* Carousel scroll animation */
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-scroll: animation: scroll 20s linear infinite;
```

## 🏗️ Layout

### Container
```css
max-w-7xl mx-auto
max-w-5xl mx-auto
max-w-6xl mx-auto
max-w-3xl mx-auto
max-w-md mx-auto
```

### Grid Systems
```css
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
grid-cols-1 md:grid-cols-4
grid-cols-1 md:grid-cols-2 lg:grid-cols-5
```

### Flexbox
```css
flex items-center justify-between
flex items-baseline space-x-4
flex flex-col sm:flex-row gap-4
```

## 🎯 Component Patterns

### Navigation Header
- Fixed positioning with blur background
- Semi-transparent white: `rgba(255, 255, 255, 0.9)`
- Height: `h-16`
- Z-index: `z-50`

### Cards
```css
bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105
```

### Buttons

**Primary Button (Navy)**
```css
bg-navy-900 text-white px-5 py-2 rounded-lg hover:bg-navy-800 transition-colors duration-200 font-medium
```

**Secondary Button (White with Border)**
```css
bg-white text-navy-900 px-8 py-3 rounded-lg font-semibold border-2 border-navy-900 shadow-lg hover:bg-navy-900 hover:text-white
```

### Hero Sections
```css
relative h-[400px] overflow-hidden bg-navy-900
/* With video background overlay */
bg-navy-900/60 z-10
```

### Gradient Backgrounds
```css
bg-gradient-to-b from-white to-gray-50
enterprise-gradient: linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)
```

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Common Responsive Patterns
```css
hidden md:block        /* Hide on mobile, show on desktop */
md:hidden             /* Show on mobile, hide on desktop */
px-4 sm:px-6 lg:px-8  /* Responsive padding */
text-sm md:text-base  /* Responsive text size */
```

## 🔧 Special Effects

### Glass Morphism (Navigation)
```css
backgroundColor: 'rgba(255, 255, 255, 0.9)'
backdropFilter: 'blur(8px)'
WebkitBackdropFilter: 'blur(8px)'
borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
```

### Background Pattern
Enterprise circuit board pattern with subtle opacity (0.02-0.05) overlay

### Custom Scrollbar
```css
/* Width */
scrollbar-width: thin (Firefox)
::-webkit-scrollbar width: 8px

/* Colors */
Track: #e2e8f0
Thumb: #4a5568
Thumb hover: #2d3748
```

## 🚀 Usage Tips

1. **Consistency**: Always use the defined color palette and spacing values
2. **Hierarchy**: Use navy-900 for primary actions, slate colors for secondary elements
3. **Accessibility**: Maintain proper contrast ratios (navy-900 on white, white on navy-900)
4. **Responsive**: Always consider mobile-first design with proper breakpoints
5. **Performance**: Use transitions sparingly and with appropriate durations (200-300ms)
6. **Hover States**: Always provide hover feedback for interactive elements
7. **Focus States**: Include focus rings for keyboard navigation

## 📦 Required Dependencies

```json
{
  "tailwindcss": "^3.x",
  "next": "^14.x",
  "@tailwindcss/forms": "optional",
  "Google Fonts": "Questrial"
}
```

## 🎯 Brand Guidelines

- **Primary Action Color**: navy-900 (#0A1628)
- **Text Color**: slate-900 (#1A202C)
- **Background**: White (#FFFFFF)
- **Borders**: slate-300 (#E2E8F0)
- **Error/Warning**: red-600 (#DC2626)
- **Success**: Not defined (consider adding green palette)

This style guide represents the complete design system used in the DOME platform frontend.