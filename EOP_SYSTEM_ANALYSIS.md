# EOP Generation System Analysis
Generated: 2025-08-11

## INVESTIGATION FINDINGS

### 1. MAIN GENERATION FILE
**Location:** `app/api/generate-eop-ai/route.js`

**Complete Code Structure:**
- Uses Google Gemini AI (Gemini 2.5 Pro model)
- Imports all section instructions from `lib/eop-sections/`
- Builds prompt dynamically by concatenating all section files
- Sends single prompt to AI with all instructions and form data
- Post-processes AI response to clean HTML
- Saves to Vercel Blob storage

### 2. WEB SEARCH / EXTERNAL APIs
**Finding:** NO web search or external data fetching found

- ✅ Only external API used is Google Gemini AI for generation
- ❌ NO web search capabilities
- ❌ NO external equipment databases accessed
- ❌ NO manufacturer API calls
- Uses only Vercel Blob for storage

### 3. EQUIPMENT KNOWLEDGE BASE
**Finding:** NO dedicated equipment knowledge base files found

- ❌ No `equipment-database.js`
- ❌ No `manufacturer-specs.js`
- ❌ No `eop-knowledge.js`
- ✅ Found `lib/mop-knowledge.js` (for MOPs, not EOPs)

**Equipment specs are HARDCODED in the prompt:**
```javascript
// Lines 240-286 in route.js
${formData.component?.toLowerCase().includes('chiller') ? `
CHILLER SPECIFIC - ${formData.manufacturer} ${formData.modelNumber}:
- Main Power: ${formData.manufacturer === 'Carrier' ? '480VAC 3-phase...' : ...}
- Control Power: ${formData.manufacturer === 'Carrier' ? '120VAC...' : ...}
...
```

### 4. PROMPT CONSTRUCTION PROCESS

**Step-by-Step Process:**

1. **Section Files Loading (Lines 6-15):**
   - Imports 10 section functions from `lib/eop-sections/`
   - Each exports a function returning instruction text

2. **Build Instructions (Lines 21-43):**
   ```javascript
   function buildProjectInstructions() {
     return [
       getEOPHeader(),
       getSection01Identification(),
       getSection02PurposeScope(),
       // ... all sections
       getFormattingInstructions()
     ].join('\n');
   }
   ```

3. **Prompt Assembly (Lines 227-321):**
   - Concatenates PROJECT_INSTRUCTIONS
   - Adds equipment-specific hardcoded specs
   - Includes form data values
   - Total prompt is ~300 lines of instructions

### 5. AI MODEL CONFIGURATION

**Model:** Google Gemini 2.5 Pro
**Configuration:**
```javascript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-pro'
});
```

**Settings:**
- ❌ No temperature setting (uses default)
- ❌ No max tokens specified (uses default)
- ❌ No system prompt (instructions embedded in user prompt)
- ❌ No response format specified

### 6. DATA FLOW

```
Frontend Form (EOPGenerationModal.js)
    ↓
POST /api/generate-eop-ai
    ↓
Validate required fields
    ↓
Build prompt from:
  - Section instructions (lib/eop-sections/)
  - Hardcoded equipment specs
  - Form data values
    ↓
Send to Gemini AI
    ↓
Clean HTML response
    ↓
Save to Vercel Blob
    ↓
Return success/failure
```

### 7. ISSUES IDENTIFIED

## 🔴 CRITICAL ISSUES

### Issue #1: NO REAL EQUIPMENT DATABASE
**Problem:** Equipment specifications are hardcoded in conditional statements
**Impact:** Limited to 5-6 manufacturers with basic specs
**Lines:** 240-286 in route.js

### Issue #2: EMERGENCY TYPE NOT PROPERLY PASSED
**Problem:** Instructions say to adapt but emergency type is only mentioned, not enforced
**Impact:** AI may generate generic content instead of emergency-specific
**Evidence:** Line 232 just mentions emergency type in text

### Issue #3: NO KNOWLEDGE VALIDATION
**Problem:** AI has no access to real equipment specs
**Impact:** May generate incorrect voltages, refrigerants, procedures
**Solution Needed:** Equipment knowledge base

### Issue #4: SECTION INSTRUCTIONS NOT USING EMERGENCY TYPE
**Problem:** Section files have hardcoded "power failure" references
**Impact:** Non-power emergencies get wrong content
**Example:** `header.js` line 4: "This is for POWER FAILURE emergency response"

### Issue #5: NO MODEL CONFIGURATION
**Problem:** Using default Gemini settings
**Impact:** Inconsistent output quality
**Missing:** Temperature, max_tokens, response format

## 🟡 MODERATE ISSUES

### Issue #6: SINGLE MONOLITHIC PROMPT
**Problem:** Sending 300+ lines in one prompt
**Impact:** Token inefficiency, harder to debug
**Better:** Modular generation per section

### Issue #7: HTML CLEANING IS FRAGILE
**Problem:** Using regex to strip HTML tags (lines 333-345)
**Impact:** May fail with complex HTML
**Better:** Use proper HTML parser

### Issue #8: NO CACHING
**Problem:** Regenerates same content repeatedly
**Impact:** Wastes API calls and money
**Solution:** Cache by equipment + emergency type

## HOW THE SYSTEM ACTUALLY WORKS

1. **User fills form** with equipment details and emergency type
2. **Frontend sends POST** to `/api/generate-eop-ai`
3. **Backend validates** required fields
4. **Prompt built** by concatenating:
   - All section instructions (unchanged regardless of emergency)
   - Hardcoded equipment specs (5-6 manufacturers only)
   - Form values inserted as variables
5. **Single API call** to Gemini 2.5 Pro with entire prompt
6. **AI generates** complete HTML document
7. **Response cleaned** with regex to remove wrapper tags
8. **Saved to Blob** storage with generated filename
9. **Success returned** to frontend

## WHERE EQUIPMENT KNOWLEDGE COMES FROM

**Current Source:** HARDCODED in prompt string (lines 240-286)
- Only 5 manufacturers: Carrier, Trane, York, Liebert, Caterpillar
- Basic specs only (voltage, refrigerant)
- No model-specific details
- No real database

**What AI Uses:** 
- Its training data (may be outdated/incorrect)
- The hardcoded hints in the prompt
- Generic assumptions

## RECOMMENDATIONS FOR IMPROVEMENT

### Priority 1: Create Equipment Database
```javascript
// lib/equipment-database.js
export const equipmentDatabase = {
  'Carrier': {
    '19XRV': {
      voltage: '480VAC',
      refrigerant: 'R-134a',
      compressors: 2,
      // ... full specs
    }
  }
}
```

### Priority 2: Fix Emergency Type Handling
- Pass emergency type to each section function
- Adapt instructions based on emergency
- Remove hardcoded "power failure" text

### Priority 3: Add AI Configuration
```javascript
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0.3,  // Lower for consistency
    maxOutputTokens: 8000,
    responseFormat: 'text/html'
  }
});
```

### Priority 4: Modular Generation
- Generate sections individually
- Combine after generation
- Better error handling per section

### Priority 5: Add Knowledge Validation
- Verify equipment exists in database
- Validate emergency type compatibility
- Check for required specifications

## SUMMARY

The EOP generation system is functional but relies entirely on:
1. **Hardcoded equipment hints** (very limited)
2. **AI's general knowledge** (may be incorrect)
3. **Static instructions** (don't adapt to emergency type properly)

The system has **no real equipment database**, **no web search**, and **no external data sources**. All adaptations are supposed to come from the AI interpreting text instructions, but the instructions themselves have issues (hardcoded "power failure" references, etc.).

The emergency type selection is passed but not properly utilized - the section instructions don't dynamically change based on it, leading to potentially incorrect procedures for non-power emergencies.