# Frontend Style Targets
## Reference Guide for Backend Style Updates

---

## 1. Colors to Match

### Primary Colors
```css
/* Brand Colors */
--primary-blue: #0f3456;        /* Deep navy blue */
--primary-blue-light: #1e5f8b;  /* Lighter blue for gradients */
--accent-blue: #2196F3;         /* Bright blue for CTAs */
--accent-light: #64B5F6;        /* Light blue for hover states */

/* Neutral Colors */
--white: #FFFFFF;
--off-white: #F8F9FA;
--light-gray: #E9ECEF;
--medium-gray: #6C757D;
--dark-gray: #343A40;
--black: #000000;

/* Semantic Colors */
--success: #28A745;
--warning: #FFC107;
--danger: #DC3545;
--info: #17A2B8;
```

### Gradient Definitions
```css
/* Primary Gradient */
background: linear-gradient(135deg, #0f3456 0%, #1e5f8b 100%);

/* Button Gradient */
background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);

/* Card Gradient (Glass effect) */
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(10px);
```

### Shadow Definitions
```css
/* Card Shadow */
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

/* Button Shadow */
box-shadow: 0 5px 20px rgba(15, 52, 86, 0.3);

/* Hover Shadow */
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
```

---

## 2. Fonts to Match

### Font Families
```css
/* Primary Font */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Heading Font (if different) */
font-family: 'Poppins', 'Inter', sans-serif;

/* Monospace (for code/data) */
font-family: 'Fira Code', 'Courier New', monospace;

/* Current Backend Font (to update from) */
font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
```

### Font Sizes
```css
/* Typography Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

### Font Weights
```css
--font-thin: 100;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

---

## 3. Component Styles to Match

### Buttons
```css
/* Primary Button */
.btn-primary {
  padding: 12px 32px;
  background: linear-gradient(135deg, #2196F3 0%, #64B5F6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

/* Secondary Button */
.btn-secondary {
  padding: 12px 32px;
  background: transparent;
  color: #0f3456;
  border: 2px solid #0f3456;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #0f3456;
  color: white;
}
```

### Cards
```css
/* Glass Card */
.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}
```

### Navigation
```css
/* Navigation Bar */
.navbar {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  padding: 16px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Nav Links */
.nav-link {
  color: #343A40;
  font-weight: 500;
  padding: 8px 16px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #2196F3;
}

.nav-link.active {
  color: #2196F3;
  font-weight: 600;
}
```

### Forms
```css
/* Input Fields */
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #E9ECEF;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #2196F3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

/* Labels */
.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #343A40;
  font-size: 14px;
}
```

### Modals
```css
/* Modal Overlay */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Modal Content */
.modal-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
```

---

## 4. Spacing & Layout to Match

### Spacing Scale
```css
/* Spacing System (8px base) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
--space-32: 8rem;     /* 128px */
```

### Container Widths
```css
/* Container Sizes */
--container-xs: 475px;
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Max Width for Content */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}
```

### Grid System
```css
/* Grid Layout */
.grid {
  display: grid;
  gap: 24px;
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive Grid */
@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

### Border Radius
```css
/* Border Radius Scale */
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-3xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Pill shape */
```

---

## 5. Animation & Transitions

### Standard Transitions
```css
/* Transition Durations */
--transition-fast: 150ms;
--transition-base: 300ms;
--transition-slow: 500ms;

/* Transition Timing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Default Transition */
transition: all 0.3s ease;
```

### Hover Effects
```css
/* Scale on Hover */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Lift on Hover */
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Glow on Hover */
.hover-glow:hover {
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.4);
}
```

---

## 6. Responsive Breakpoints

```css
/* Breakpoint System */
--screen-xs: 475px;
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;

/* Media Queries */
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## Implementation Priority

1. **High Priority** (Core Brand Identity)
   - Primary colors and gradients
   - Font family update
   - Button styles
   - Card glass effects

2. **Medium Priority** (User Experience)
   - Form styling
   - Navigation updates
   - Spacing consistency
   - Shadow effects

3. **Low Priority** (Polish)
   - Animations
   - Hover states
   - Responsive refinements
   - Additional color variants