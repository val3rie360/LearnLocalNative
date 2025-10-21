# Cloudinary PDF Access Issue - Fix Guide

## Problem

Users getting **401/403 errors** when trying to access/download PDF files uploaded to Cloudinary.

```
Error: Failed to fetch PDF
Status: 401 Unauthorized
or
Status: 403 Forbidden
```

## Root Cause

The Cloudinary **upload preset** has **Access Mode** set to something other than "Public", which means:
- ✅ PDFs upload successfully
- ✅ URLs are saved to Firestore
- ❌ But URLs require authentication to access
- ❌ Mobile app can't provide Cloudinary credentials
- ❌ Users get 401/403 errors when downloading

## Solution

### Step 1: Fix Your Cloudinary Upload Preset

1. **Go to:** [Cloudinary Dashboard](https://console.cloudinary.com/)
2. **Navigate to:** Settings → Upload → Upload presets
3. **Find:** Your `learn_local_uploads` preset (or whatever name you used)
4. **Click:** Edit

**Required Settings:**
```
✅ Signing Mode: Unsigned
✅ Access mode: Public          ⬅️ CRITICAL!
✅ Resource type: Raw
✅ Delivery type: upload
✅ Allowed formats: pdf
✅ Folder: uploads (optional but recommended)
```

5. **Save** the preset

### Step 2: Verify Changes

**Test a Direct URL:**
1. Upload a new PDF through your app
2. Check Firestore → `uploads` collection → grab `cloudinarySecureUrl`
3. Paste URL in incognito browser
4. PDF should download/open immediately with no login required

**Expected URL Format:**
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/v1234567890/uploads/orgId/filename.pdf
```

### Step 3: Handle Existing PDFs

If you already have PDFs uploaded with wrong access mode:

**Option A: Re-upload** (easiest for small numbers)
- Organizations delete old PDFs
- Re-upload with fixed preset
- New PDFs will be publicly accessible

**Option B: Bulk Update Access Mode** (requires backend)
```javascript
// Server-side only (needs API secret)
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Update a single resource
cloudinary.api.update(publicId, {
  resource_type: 'raw',
  access_mode: 'public'
}, (error, result) => {
  console.log(result);
});
```

**Option C: Leave them and notify users**
- Add a notice that older PDFs need to be re-uploaded
- New uploads will work fine

### Step 4: Test the Fix

The app now includes debugging to help identify access issues:

```
[Library] Attempting download for: Math Notes.pdf
[Library] Resource ID: abc123
[Library] Got download URL: https://res.cloudinary.com/...
[Library] URL status check: 200 ✅ 
```

If you see:
```
[Library] URL status check: 401
[Library] ❌ PDF Access Blocked - Cloudinary preset might not be Public
```

That means the preset still isn't Public or the PDF was uploaded with the old settings.

## Common Mistakes

### ❌ Wrong: Access Mode = "Authenticated"
This requires signed URLs with authentication tokens. Mobile apps can't generate these without exposing API secrets.

### ❌ Wrong: Signing Mode = "Signed"
This requires server-side signature generation. Use "Unsigned" for mobile uploads.

### ❌ Wrong: Delivery Type = "Private"
Private delivery blocks public access entirely.

### ✅ Correct: Access Mode = "Public" + Signing Mode = "Unsigned"
PDFs are publicly accessible via CDN, but only through URLs your app generates. Users still need to use your app to discover/access PDFs.

## Security Considerations

**"But won't Public access let anyone download my PDFs?"**

Yes and no:
- ✅ URLs are long and unpredictable (hard to guess)
- ✅ Files aren't indexed/listed publicly
- ✅ Only users with the exact URL can access
- ✅ Your app controls who sees upload listings
- ✅ Firestore security rules prevent unauthorized users from getting URLs

**If you need true private files:**
You'll need a backend service that:
1. Authenticates users
2. Generates signed Cloudinary URLs with expiration
3. Returns temporary access URLs to authenticated users

For most educational content sharing, public access mode is appropriate and secure enough.

## Environment Variables

Make sure your `.env` is correct:

```bash
# Cloudinary Configuration
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=learn_local_uploads

# Optional: Separate preset for avatars
EXPO_PUBLIC_CLOUDINARY_AVATAR_UPLOAD_PRESET=learn_local_avatars
EXPO_PUBLIC_CLOUDINARY_AVATAR_FOLDER=avatars
```

After changing `.env`, restart:
```bash
npx expo start --clear
```

## Verification Checklist

- [ ] Upload preset exists in Cloudinary Dashboard
- [ ] Access mode is set to **Public**
- [ ] Signing mode is set to **Unsigned**
- [ ] Resource type is set to **Raw**
- [ ] Allowed formats includes **pdf**
- [ ] `.env` has correct cloud name and preset name
- [ ] App restarted with `--clear` flag
- [ ] Test upload completes successfully
- [ ] Test download URL in incognito browser (should work)
- [ ] Test download from app (should open PDF)
- [ ] Console shows status 200 (not 401/403)

## Still Having Issues?

1. **Check the console logs** - they'll show the exact URL and status code
2. **Test the URL directly** - paste in browser to see exact error
3. **Verify preset settings** - screenshot and compare with this guide
4. **Check Cloudinary usage** - might hit free tier limits
5. **Try a fresh upload** - old files might have wrong access mode

## Summary

The fix is simple: **Set Access Mode to Public** in your Cloudinary upload preset. This allows your app to serve PDFs through public CDN URLs while still controlling access through your app's Firestore security rules.

---

**Related Files:**
- `services/cloudinaryUploadService.js` - Upload logic
- `app/studentPages/(tabs)/Library.tsx` - Download with debugging
- `Guides/CLOUDINARY_SETUP.md` - Full setup guide
- `cloudinaryConfig.js` - Config file


