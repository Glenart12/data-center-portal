# Frontend to Backend Merge Plan
## Data Center Operations Portal Integration

**CRITICAL**: This is a production system worth tens of thousands of dollars. Follow this plan exactly.

---

## 1. Files to Bring from Frontend Project

### A. Components (from frontend src/components/)
- `Hero.jsx` → `components/marketing/Hero.js`
- `Features.jsx` → `components/marketing/Features.js`
- `Services.jsx` → `components/marketing/Services.js`
- `About.jsx` → `components/marketing/About.js`
- `Contact.jsx` → `components/marketing/Contact.js`
- `Footer.jsx` → `components/marketing/Footer.js`
- `Navigation.jsx` → `components/marketing/Navigation.js`
- `Stats.jsx` → `components/marketing/Stats.js`
- `Testimonials.jsx` → `components/marketing/Testimonials.js`
- `CTA.jsx` → `components/marketing/CTA.js`

### B. Assets (from frontend public/)
- All images → `public/images/`
- Any custom fonts → `public/fonts/`
- Any icons/svgs → `public/images/icons/`

### C. Styles (from frontend src/)
- `index.css` or `globals.css` → Review and merge with existing styles
- Any component-specific CSS modules → Convert to inline styles to match backend pattern

### D. Configuration Files
- Review `package.json` dependencies → Merge required deps only
- DO NOT override backend configurations

---

## 2. File Placement Strategy

### New Directory Structure:
```
data-center-portal/
├── app/
│   ├── (public)/                    # NEW: Public routes group
│   │   ├── layout.js                # NEW: Public layout without auth
│   │   ├── page.js                  # NEW: Marketing landing page
│   │   ├── about/page.js            # NEW: About page
│   │   ├── services/page.js         # NEW: Services page
│   │   └── contact/page.js          # NEW: Contact page
│   │
│   ├── (protected)/                 # NEW: Protected routes group
│   │   ├── layout.js                # NEW: Auth-required layout
│   │   ├── dashboard/page.js        # EXISTING: Move here
│   │   ├── mop/page.js             # EXISTING: Move here
│   │   ├── sop/page.js             # EXISTING: Move here
│   │   └── eop/page.js             # EXISTING: Move here
│   │
│   ├── api/                        # EXISTING: No changes
│   ├── components/                 # EXISTING: Backend components
│   └── layout.js                   # EXISTING: Root layout
│
├── components/
│   └── marketing/                  # NEW: Marketing components
│       ├── Hero.js
│       ├── Features.js
│       ├── Services.js
│       ├── About.js
│       ├── Contact.js
│       ├── Footer.js
│       ├── Navigation.js
│       ├── Stats.js
│       ├── Testimonials.js
│       └── CTA.js
│
├── public/
│   ├── images/                     # NEW: Marketing images
│   │   └── icons/                  # NEW: Icon assets
│   ├── mops/                       # EXISTING: Document storage
│   ├── sops/                       # EXISTING: Document storage
│   └── eops/                       # EXISTING: Document storage
│
└── lib/                            # EXISTING: No changes
```

---

## 3. Required Changes

### A. Component Conversions (JSX → JS)
1. **File Extensions**: Change all `.jsx` to `.js`
2. **Remove TypeScript**: Strip any TypeScript annotations
3. **Style Conversion**: 
   - Convert CSS modules to inline styles
   - Match existing Century Gothic font family
   - Maintain glass-morphism effects from backend
4. **Import Updates**:
   ```javascript
   // FROM (React 18 style)
   import React from 'react';
   
   // TO (Next.js 15 style)
   'use client'; // Add where needed
   ```

### B. Routing Updates
1. **Navigation Links**:
   ```javascript
   // FROM
   <a href="/about">About</a>
   
   // TO
   import Link from 'next/link';
   <Link href="/about">About</Link>
   ```

2. **Protected Route Logic**:
   ```javascript
   // Add to marketing Navigation component
   const session = await getSession();
   const showPortalButton = !!session;
   ```

### C. Auth0 Integration Points
1. **Public Pages**: No auth required
2. **Portal Access Button**: 
   - If logged in → Link to `/dashboard`
   - If not logged in → Link to `/api/auth/login`
3. **Marketing Nav vs Portal Header**:
   - Marketing pages use `Navigation.js`
   - Portal pages use existing `Header.js`

### D. Image Optimization
```javascript
// FROM
<img src="/images/hero.jpg" alt="Hero" />

// TO
import Image from 'next/image';
<Image src="/images/hero.jpg" alt="Hero" width={1920} height={1080} />
```

---

## 4. Potential Breaking Points

### CRITICAL RISKS:
1. **Auth0 Session Conflicts**
   - Risk: Marketing pages checking auth when they shouldn't
   - Solution: Use route groups to separate auth logic

2. **Style Conflicts**
   - Risk: Global CSS overriding portal styles
   - Solution: Scope all marketing styles to specific components

3. **Navigation Confusion**
   - Risk: Two different navigation systems
   - Solution: Clear separation - Marketing Nav for public, Header for portal

4. **Package Conflicts**
   - Risk: Frontend deps breaking backend functionality
   - Solution: Carefully review each dependency before adding

5. **API Route Exposure**
   - Risk: Marketing site exposing protected APIs
   - Solution: Keep all API auth checks intact

6. **File Upload Paths**
   - Risk: Marketing assets interfering with document storage
   - Solution: Strict folder separation in /public

---

## 5. Testing Plan

### Phase 1: Pre-Merge Backup
```bash
# 1. Create full backup
git add .
git commit -m "Pre-merge backup"
git branch backup-pre-merge

# 2. Create merge branch
git checkout -b frontend-merge
```

### Phase 2: Component Testing
1. **Test each marketing component in isolation**:
   ```bash
   npm run dev
   # Visit each route manually
   ```

2. **Check for console errors**:
   - No React hydration errors
   - No missing dependencies
   - No 404s for assets

### Phase 3: Auth Flow Testing
1. **Unauthenticated User Path**:
   - [ ] Can view marketing site
   - [ ] Cannot access /dashboard
   - [ ] Login button works
   - [ ] Redirects to dashboard after login

2. **Authenticated User Path**:
   - [ ] Can access dashboard
   - [ ] Can navigate between portal pages
   - [ ] Logout works correctly
   - [ ] Returns to marketing site

### Phase 4: Portal Functionality Testing
1. **Document Operations**:
   - [ ] MOP generation still works
   - [ ] SOP generation still works
   - [ ] EOP generation still works
   - [ ] File upload/download works
   - [ ] Preview functionality intact

2. **AI Integration**:
   - [ ] Gemini API still connects
   - [ ] Generation endpoints respond
   - [ ] Knowledge base accessible

### Phase 5: Performance Testing
1. **Load Times**:
   ```bash
   npm run build
   npm start
   # Measure TTFB and FCP
   ```

2. **Bundle Size Check**:
   ```bash
   # Check .next folder size
   # Should not exceed 2x current size
   ```

### Phase 6: Production Readiness
1. **Environment Variables**:
   - [ ] All Auth0 vars set
   - [ ] Google AI key present
   - [ ] Vercel Blob configured

2. **Error Handling**:
   - [ ] 404 page works
   - [ ] 500 errors handled gracefully
   - [ ] API errors return proper status codes

---

## 6. Rollback Plan

If ANY critical issue occurs:

```bash
# 1. Stop the dev server
# 2. Rollback to backup
git checkout backup-pre-merge
git branch -D frontend-merge

# 3. Force reinstall deps
rm -rf node_modules package-lock.json
npm install

# 4. Verify portal works
npm run dev
```

---

## 7. Merge Execution Checklist

### Pre-Merge:
- [ ] Full backup created
- [ ] All team members notified
- [ ] Test environment ready
- [ ] Frontend code reviewed

### During Merge:
- [ ] Create route groups structure
- [ ] Move existing protected pages
- [ ] Add marketing components
- [ ] Update navigation logic
- [ ] Test each component addition

### Post-Merge:
- [ ] Run full test suite
- [ ] Check all portal functions
- [ ] Verify auth flows
- [ ] Performance benchmarks
- [ ] Document any issues

### Sign-off:
- [ ] Developer tested
- [ ] Stakeholder review
- [ ] Production deployment approved

---

## 8. Emergency Contacts

- **Lead Developer**: [Your contact]
- **DevOps**: [DevOps contact]
- **Auth0 Support**: support@auth0.com
- **Vercel Support**: support@vercel.com

---

**REMEMBER**: This is a production system. Take no shortcuts. Test everything twice.