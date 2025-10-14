# Team Setup Guide - Cloudinary Credentials

## 🚨 Important: Each Team Member Needs This!

The `.env` file is **NOT in the GitHub repository** for security reasons. Each developer must create their own `.env` file locally.

## 📋 Quick Setup for New Team Members

### Step 1: Create `.env` File

In the project root directory, create a new file named exactly `.env`:

```bash
# On Mac/Linux
touch .env

# On Windows (in Command Prompt)
type nul > .env
```

### Step 2: Add Cloudinary Credentials

Copy these lines into your `.env` file:

```
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=dgxcslmvp
EXPO_PUBLIC_CLOUDINARY_API_KEY=689395617789454
EXPO_PUBLIC_CLOUDINARY_API_SECRET=SmvtTcy7Bm1yWhZnzioHAwDNgo8
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=learn_local_uploads
```

**Note:** Get the actual credentials from your team lead or project manager via secure channel (Slack/Email).

### Step 3: Verify Setup

After creating `.env`, restart your development server:

```bash
npx expo start --clear
```

Check the console logs. You should see:
```
✅ Cloudinary configuration loaded successfully!
Cloud Name: dgxcslmvp
```

If you see `Cloud Name: your-cloud-name`, the `.env` file is not loaded correctly.

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file local only
- Share credentials via secure channels (encrypted)
- Add `.env` to `.gitignore` (already done)
- Use the same Cloudinary account for the team

### ❌ DON'T:
- **Never commit `.env` to git**
- **Never share credentials in public channels**
- **Never push to GitHub, Discord, Slack channels**
- **Never screenshot credentials and post publicly**

## 🆘 Troubleshooting

### Problem: "Cloudinary not configured"
**Solution:** 
1. Make sure `.env` file exists in project root (same folder as `package.json`)
2. Check file is named exactly `.env` (not `.env.txt` or `env`)
3. Restart Expo with `--clear` flag

### Problem: "Upload failed" 
**Solution:**
1. Verify credentials are correct (no extra spaces)
2. Check internet connection
3. Verify Cloudinary account is active

### Problem: File upload works on one device but not another
**Solution:** The new device doesn't have `.env` file. Create it following Step 1-2 above.

## 📱 Multiple Devices (Same Developer)

If you work on multiple devices (laptop + desktop), you need to create `.env` on **each device**:

1. **Laptop:** Create `.env` with credentials
2. **Desktop:** Create `.env` with **same** credentials
3. **Tablet:** Create `.env` with **same** credentials

The `.env` file never syncs via git (it's ignored), so you must manually create it on each device.

## 🔄 Alternative: Use Development vs Production

For advanced teams, you can use different Cloudinary accounts:

- **Development:** Team shared account (dev uploads)
- **Production:** Separate account (production uploads)

Create different `.env` files:
- `.env.development` 
- `.env.production`

Then use: `EXPO_PUBLIC_ENV=development` to switch.

## ✅ Verification Checklist

- [ ] `.env` file created in project root
- [ ] All 4 environment variables added
- [ ] Expo restarted with `--clear`
- [ ] Console shows correct cloud name (not "your-cloud-name")
- [ ] PDF upload test successful

---

**Need Help?** Check `Guides/CLOUDINARY_SETUP.md` for full setup instructions.

