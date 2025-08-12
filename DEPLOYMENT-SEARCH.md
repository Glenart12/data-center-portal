# Search Integration Deployment Guide

## Overview
This guide covers the deployment of the SerpAPI search integration for enhanced EOP generation with real-time manufacturer specifications.

---

## 📋 Pre-Deployment Checklist

### 1. Obtain SerpAPI Credentials
- [ ] Sign up at https://serpapi.com
- [ ] Get your API key from the dashboard
- [ ] Note your monthly search quota (100 searches free tier)

### 2. Add Environment Variables to Vercel

Navigate to your Vercel project → Settings → Environment Variables and add:

- [ ] **SERP_API_KEY**
  - Value: `your_actual_api_key_from_serpapi`
  - Environment: Production, Preview, Development
  
- [ ] **SEARCH_ENABLED**
  - Value: `false` (start disabled for safety)
  - Environment: Production, Preview, Development
  
- [ ] **SEARCH_CACHE_TTL**
  - Value: `3600` (1 hour cache in seconds)
  - Environment: Production, Preview, Development
  
- [ ] **SEARCH_TIMEOUT**
  - Value: `5000` (5 second timeout in milliseconds)
  - Environment: Production, Preview, Development

### 3. Code Verification
- [ ] Verify all search-related files are committed to git
- [ ] Run `npm install` locally to ensure serpapi package is installed
- [ ] Test locally with `SEARCH_ENABLED=false` to ensure no breaking changes

---

## 🚀 Deployment Steps

### Phase 1: Safe Deployment (Search Disabled)

1. **Deploy with search disabled**
   ```bash
   git add .
   git commit -m "Add search integration (disabled by default)"
   git push origin main
   ```

2. **Verify deployment in Vercel**
   - [ ] Check deployment logs for any errors
   - [ ] Confirm all environment variables are set
   - [ ] Verify SEARCH_ENABLED is `false`

3. **Test existing functionality**
   - [ ] Generate a test EOP with known equipment
   - [ ] Verify generation works exactly as before
   - [ ] Check Vercel function logs for any errors

### Phase 2: Test Search Enhancement

1. **Enable search in Vercel**
   - [ ] Change SEARCH_ENABLED to `true` in Vercel dashboard
   - [ ] Redeploy or wait for environment variable to propagate

2. **Test with known model numbers**
   
   Test these specific models that should return good results:
   - [ ] Carrier 30XA080 (Chiller)
   - [ ] Trane RTAC140 (Chiller)
   - [ ] York YCAL0080 (Chiller)
   - [ ] Caterpillar 3512C (Generator)
   - [ ] Liebert NX-200 (UPS)

3. **Verify enhancement is working**
   - [ ] Check Vercel function logs for "Search enhancement applied successfully"
   - [ ] Compare generated EOPs with/without search enabled
   - [ ] Verify specifications appear more accurate with search enabled

### Phase 3: Production Verification

1. **Monitor initial usage**
   - [ ] Check SerpAPI dashboard for API calls
   - [ ] Monitor Vercel function execution time
   - [ ] Review cache hit rates in logs

2. **Test edge cases**
   - [ ] Test with invalid model numbers
   - [ ] Test with network timeout scenarios
   - [ ] Verify fallback to original behavior works

---

## 🔄 Rollback Plan

If issues occur, follow these steps to immediately disable search:

### Immediate Rollback (< 1 minute)
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Set `SEARCH_ENABLED` to `false`
3. Redeploy latest deployment or trigger new deployment
4. Verify EOP generation works without search

### Complete Removal (if needed)
```bash
# Revert the search integration commit
git revert <commit-hash>
git push origin main
```

---

## 📊 Monitoring

### Vercel Function Logs
Monitor these log messages in Vercel Functions tab:

**Success indicators:**
- `"Search enhancement applied successfully"`
- `"[EquipmentSearchService] Returning cached result"`
- `"[EquipmentSearchService] Result cached for: <model>"`

**Warning indicators:**
- `"Search enhancement skipped: <reason>"`
- `"[EquipmentSearchService] Search is disabled"`
- `"[SerpAPIClient] No API key configured"`

**Error indicators:**
- `"[SerpAPIClient] Circuit breaker returned null"`
- `"[CircuitBreaker] Circuit OPENED"`
- `"[EquipmentSearchService] Unexpected error during search"`

### SerpAPI Dashboard
Check daily at https://serpapi.com/dashboard:
- [ ] API usage count vs quota
- [ ] Average response time
- [ ] Error rate
- [ ] Geographic distribution of searches

### Performance Metrics
Track in Vercel Analytics:
- [ ] Function execution time (should remain < 10s)
- [ ] Memory usage (should remain stable)
- [ ] Error rate (should remain low)

---

## 🧪 Testing Commands

### Local Testing
```bash
# Test with search disabled (default)
npm run dev
# Visit http://localhost:3000/api/test-equipment-search?modelNumber=30XA080&manufacturer=Carrier

# Test with search enabled
SEARCH_ENABLED=true npm run dev
# Visit same URL - should see real search results

# Run integration tests
node test/test-search-integration.js
```

### Production Testing
```bash
# Test the search endpoint directly
curl "https://your-app.vercel.app/api/test-equipment-search?modelNumber=30XA080&manufacturer=Carrier"

# Should return JSON with search results or mock data depending on SEARCH_ENABLED
```

---

## 📈 Success Criteria

The deployment is successful when:
- ✅ EOP generation continues to work with SEARCH_ENABLED=false
- ✅ No errors in Vercel function logs
- ✅ With SEARCH_ENABLED=true, logs show "Search enhancement applied successfully"
- ✅ Generated EOPs show more accurate specifications for known models
- ✅ Search failures gracefully fallback to original behavior
- ✅ API usage remains within quota limits
- ✅ Function execution time remains reasonable (< 10 seconds)

---

## 🔒 Security Considerations

- **API Key Protection**: Never commit SERP_API_KEY to git
- **Rate Limiting**: Circuit breaker prevents API abuse
- **Input Validation**: All user inputs are sanitized
- **Error Handling**: No sensitive information exposed in errors
- **Cache Security**: Cache is in-memory only, not persistent

---

## 📚 Troubleshooting

### Search not working
1. Verify SEARCH_ENABLED=true in Vercel
2. Check SERP_API_KEY is correctly set
3. Review Vercel function logs for specific errors
4. Test the endpoint at `/api/test-equipment-search`

### High API usage
1. Increase SEARCH_CACHE_TTL to cache longer (e.g., 7200 for 2 hours)
2. Monitor for duplicate searches
3. Consider upgrading SerpAPI plan if needed

### Slow performance
1. Check SEARCH_TIMEOUT setting (default 5000ms)
2. Monitor circuit breaker status in logs
3. Verify cache is working (look for cache hit messages)

### Circuit breaker open
1. Check SerpAPI service status
2. Review recent error logs
3. Circuit breaker auto-resets after 60 seconds
4. Can manually reset by redeploying

---

## 📝 Post-Deployment Notes

After successful deployment:
1. Document actual API usage patterns
2. Adjust cache TTL based on usage
3. Consider implementing user-facing search status indicator
4. Plan for API quota increases if needed

---

## 🤝 Support

For issues or questions:
- Check Vercel function logs first
- Review this deployment guide
- Check SerpAPI documentation at https://serpapi.com/docs
- Contact support with specific error messages and logs

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Ready for Deployment