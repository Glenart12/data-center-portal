# DOME Platform Style Implementation Plan
## Backend Portal Style Update Checklist

---

## 📋 PHASE 1 - Colors (CRITICAL - Do First)

### Navy Primary Colors
- [ ] Replace `#0f3456` with navy-900 `#0A1628` in all files
- [ ] Replace `#1e5f8b` with navy-500 `#1E3A5F` for gradients
- [ ] Update all hover states to use navy-800 `#0F1E36`
- [ ] Remove any blue accent colors (`#2196F3`, `#64B5F6`)

### Text Colors
- [ ] Replace `#666` with slate-700 `#4A5568` for secondary text
- [ ] Ensure primary text uses slate-900 `#1A202C`
- [ ] Update muted text to slate-600 `#718096`

### Border Colors
- [ ] Replace all border colors with slate-300 `#E2E8F0`
- [ ] Add subtle border to glass cards: `1px solid rgba(226, 232, 240, 0.5)`

### Files to Update:
- [ ] `app/page.js` - Login page colors
- [ ] `app/layout.js` - Global color variables
- [ ] `app/components/Header.js` - Navigation colors
- [ ] `app/dashboard/page.js` - Dashboard colors
- [ ] `app/components/MOPGenerationModal.js` - Modal colors
- [ ] `app/components/SOPGenerationModal.js` - Modal colors
- [ ] `app/components/EOPGenerationModal.js` - Modal colors
- [ ] `app/components/DocumentPreviewModal.js` - Preview colors
- [ ] `app/components/UploadButton.js` - Button colors
- [ ] `app/mop/page.js` - MOP page colors
- [ ] `app/sop/page.js` - SOP page colors
- [ ] `app/eop/page.js` - EOP page colors

---

## 📋 PHASE 2 - Typography

### Font Family Updates
- [ ] Keep Century Gothic as primary (already matches!)
- [ ] Add Questrial as secondary font option
- [ ] Import Questrial from Google Fonts in `app/layout.js`
- [ ] Update font stack: `'Century Gothic', 'Questrial', -apple-system, sans-serif`

### Font Size Standardization
- [ ] Convert all `em` units to `rem`
- [ ] Update title sizes to use `text-4xl` (2.25rem / 36px)
- [ ] Update subtitle sizes to use `text-xl` (1.25rem / 20px)
- [ ] Update body text to use `text-base` (1rem / 16px)
- [ ] Update button text to use `text-base` (1rem / 16px)

### Font Weight Updates
- [ ] Replace `bold` with `font-semibold` (600)
- [ ] Use `font-medium` (500) for navigation links
- [ ] Use `font-normal` (400) for body text

### Files to Update:
- [ ] `app/layout.js` - Font import and global styles
- [ ] `app/page.js` - Title and subtitle sizes
- [ ] `app/components/Header.js` - Navigation font weights
- [ ] All modal components - Heading and text sizes

---

## 📋 PHASE 3 - Component Updates

### Navigation/Header Glass Morphism
- [ ] Update background to `rgba(255, 255, 255, 0.9)`
- [ ] Add `backdropFilter: 'blur(8px)'`
- [ ] Add `-webkit-backdrop-filter: 'blur(8px)'`
- [ ] Add bottom border: `1px solid rgba(0, 0, 0, 0.1)`
- [ ] Ensure `position: sticky` and `top: 0`
- [ ] Set `z-index: 50`

### Button Styling
#### Primary Buttons (Navy)
- [ ] Background: navy-900 `#0A1628`
- [ ] Hover: navy-800 `#0F1E36`
- [ ] Text: white
- [ ] Padding: `py-2 px-5` (0.5rem 1.25rem)
- [ ] Border radius: `rounded-lg` (0.5rem / 8px)
- [ ] Font weight: `font-medium` (500)
- [ ] Transition: `transition-colors duration-200`
- [ ] Remove text-transform uppercase
- [ ] Remove letter-spacing

#### Secondary Buttons (White with Border)
- [ ] Background: white
- [ ] Text: navy-900 `#0A1628`
- [ ] Border: `2px solid #0A1628`
- [ ] Padding: `py-3 px-8` (0.75rem 2rem)
- [ ] Border radius: `rounded-lg` (0.5rem / 8px)
- [ ] Font weight: `font-semibold` (600)
- [ ] Add shadow: `shadow-lg`
- [ ] Hover: background navy-900, text white

### Card Updates
- [ ] Background: keep `rgba(255, 255, 255, 0.95)`
- [ ] Border radius: `rounded-xl` (0.75rem / 12px)
- [ ] Padding: standardize to `p-8` (2rem / 32px)
- [ ] Border: add `1px solid #E5E7EB`
- [ ] Shadow: `shadow-lg` (0 10px 15px -3px rgba(0, 0, 0, 0.1))
- [ ] Hover shadow: `shadow-2xl`
- [ ] Hover scale: `scale-105`
- [ ] Transition: `transition-all duration-300`

### Modal Updates
- [ ] Overlay background: `rgba(0, 0, 0, 0.5)`
- [ ] Overlay blur: `backdrop-filter: blur(4px)`
- [ ] Content background: white
- [ ] Border radius: `rounded-xl` (0.75rem / 12px)
- [ ] Padding: `p-8` (2rem / 32px)
- [ ] Shadow: `0 20px 60px rgba(0, 0, 0, 0.3)`

### Files to Update:
- [ ] `app/components/Header.js` - Full glass morphism treatment
- [ ] `app/page.js` - Login button styling
- [ ] `app/components/UploadButton.js` - Button updates
- [ ] All modal components - Overlay and content styling
- [ ] Dashboard cards - Card styling updates

---

## 📋 PHASE 4 - Layout & Spacing

### Spacing Standardization (8px Grid)
- [ ] Convert all arbitrary padding/margin to grid system
- [ ] Replace `padding: '60px 40px'` with `p-16 p-10` (4rem 2.5rem)
- [ ] Replace `padding: '18px 40px'` with `py-2 px-5` (0.5rem 1.25rem)
- [ ] Replace `marginTop: '100px'` with `mt-24` (6rem / 96px)
- [ ] Replace `marginBottom: '20px'` with `mb-5` (1.25rem / 20px)
- [ ] Replace `marginBottom: '40px'` with `mb-10` (2.5rem / 40px)

### Container Updates
- [ ] Set max-width to `max-w-7xl` (80rem / 1280px) for main container
- [ ] Set max-width to `max-w-3xl` (48rem / 768px) for modals
- [ ] Add responsive padding: `px-4 sm:px-6 lg:px-8`

### Border Radius Updates
- [ ] Large components: `rounded-xl` (12px)
- [ ] Buttons: `rounded-lg` (8px)
- [ ] Inputs: `rounded-lg` (8px)
- [ ] Small elements: `rounded-md` (6px)

### Files to Update:
- [ ] All page components - spacing updates
- [ ] All modal components - container widths
- [ ] All components - border radius standardization

---

## 📋 PHASE 5 - Effects & Polish

### Shadow Updates
- [ ] Regular cards: `shadow-lg` (0 10px 15px -3px rgba(0, 0, 0, 0.1))
- [ ] Hover state: `shadow-2xl` (0 25px 50px -12px rgba(0, 0, 0, 0.25))
- [ ] Buttons: `shadow-md` (0 4px 6px -1px rgba(0, 0, 0, 0.1))
- [ ] Navigation: `shadow-sm` (0 1px 2px 0 rgba(0, 0, 0, 0.05))
- [ ] Use enterprise shadows with navy tint where appropriate

### Transition Standardization
- [ ] Color transitions: `transition-colors duration-200`
- [ ] All properties: `transition-all duration-300`
- [ ] Shadow transitions: `transition-shadow duration-300`
- [ ] Transform transitions: `transition-transform duration-300`

### Hover States
- [ ] Cards: add `hover:scale-105`
- [ ] Buttons: ensure smooth color transition
- [ ] Links: add `hover:text-navy-500`
- [ ] Add focus states for accessibility

### Background Gradients
- [ ] Update primary gradient to: `linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)`
- [ ] Add subtle background: `bg-gradient-to-b from-white to-gray-50`

### Files to Update:
- [ ] All interactive components - hover states
- [ ] All components - transition timing
- [ ] Background gradients where applicable

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] Colors match DOME platform brand
- [ ] Typography is consistent
- [ ] Spacing follows 8px grid
- [ ] Components have proper shadows
- [ ] Hover states work correctly
- [ ] Glass morphism effects render properly

### Functional Testing
- [ ] All buttons remain clickable
- [ ] Forms submit correctly
- [ ] Modals open/close properly
- [ ] Navigation works
- [ ] File uploads function
- [ ] Auth flow unchanged

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile responsive

### Performance Testing
- [ ] Page load speed acceptable
- [ ] No animation jank
- [ ] Blur effects don't impact performance

---

## 📊 Progress Tracking

### Overall Progress
- Phase 1 (Colors): 0/12 tasks ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
- Phase 2 (Typography): 0/4 tasks ⬜⬜⬜⬜
- Phase 3 (Components): 0/4 tasks ⬜⬜⬜⬜
- Phase 4 (Layout): 0/3 tasks ⬜⬜⬜
- Phase 5 (Effects): 0/4 tasks ⬜⬜⬜⬜

**Total: 0/27 tasks completed**

---

## 🚨 Important Notes

1. **NO FUNCTIONALITY CHANGES** - Only visual updates
2. **TEST AFTER EACH PHASE** - Don't proceed if something breaks
3. **COMMIT AFTER EACH PHASE** - Easy rollback points
4. **KEEP BACKUPS** - Save original styles before modifying
5. **AUTH0 FLOW** - Must remain unchanged

---

## 🔄 Rollback Procedure

If any phase causes issues:
```bash
# Rollback to last working commit
git log --oneline
git checkout [last-working-commit-hash]

# Or if on branch
git reset --hard HEAD~1
```

---

## 📝 Style Reference

Key style values from DOME platform:
- **Primary**: navy-900 (#0A1628)
- **Primary Hover**: navy-800 (#0F1E36)
- **Text**: slate-900 (#1A202C)
- **Secondary Text**: slate-700 (#4A5568)
- **Borders**: slate-300 (#E2E8F0)
- **Font**: Century Gothic, Questrial
- **Border Radius**: rounded-lg (8px) for buttons, rounded-xl (12px) for cards
- **Transitions**: 200ms for colors, 300ms for all

---

## ✅ Sign-off

- [ ] Developer testing complete
- [ ] Stakeholder review complete
- [ ] Production deployment approved
- [ ] Documentation updated