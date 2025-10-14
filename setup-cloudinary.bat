@echo off
echo ========================================
echo Cloudinary Setup Helper
echo ========================================
echo.

echo STEP 1: Create Cloudinary Account
echo ----------------------------------------
echo 1. Visit: https://cloudinary.com/users/register/free
echo 2. Sign up and verify email
echo 3. Login to dashboard
echo.
pause

echo.
echo STEP 2: Get Your Credentials
echo ----------------------------------------
echo In Cloudinary Dashboard, copy:
echo - Cloud name
echo - API Key
echo - API Secret
echo.
pause

echo.
echo STEP 3: Create Upload Preset
echo ----------------------------------------
echo 1. Go to: Settings -^> Upload -^> Upload presets
echo 2. Click "Add upload preset"
echo 3. Name: learn_local_uploads
echo 4. Signing Mode: Unsigned
echo 5. Folder: uploads
echo 6. Resource type: Raw
echo 7. Allowed formats: pdf
echo 8. Save
echo.
pause

echo.
echo STEP 4: Create .env File
echo ----------------------------------------

if not exist .env (
    echo Creating .env file template...
    (
        echo # Cloudinary Configuration
        echo # Get from: https://console.cloudinary.com/
        echo EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
        echo EXPO_PUBLIC_CLOUDINARY_API_KEY=your-api-key
        echo EXPO_PUBLIC_CLOUDINARY_API_SECRET=your-api-secret
        echo EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=learn_local_uploads
    ) > .env
    echo.
    echo ✓ .env file created!
    echo.
    echo NOW: Edit .env file and replace with your actual Cloudinary values
) else (
    echo .env file already exists
    echo Make sure it has Cloudinary configuration
)

echo.
echo STEP 5: Deploy Firestore Rules
echo ----------------------------------------
echo 1. Go to: https://console.firebase.google.com/
echo 2. Select project: learnlocal-nat
echo 3. Firestore Database -^> Rules
echo 4. Copy content from firestore.rules
echo 5. Paste and click Publish
echo.
pause

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your Cloudinary credentials
echo 2. Run: npm start
echo 3. Test file upload in your app
echo.
echo See: Guides\CLOUDINARY_SETUP.md for details
echo ========================================
pause



