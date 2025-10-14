# Organization Uploads System - Implementation Plan

## 📋 Overview

The Organization Uploads feature allows organizations to upload, manage, and share educational resources (PDFs only) with students. This system uses PocketBase for file storage and integrates with the existing Firebase-based opportunities system.

## 🎯 Goals

1. **Upload Files** - Organizations can upload PDF educational materials
2. **Manage Files** - View, edit metadata, delete files
3. **Integration** - Link files to opportunities (Resources category)
4. **Student Access** - Students can browse and download files
5. **Storage Optimization** - Efficient file storage using PocketBase

## 🏗️ Hybrid Architecture

### Backend Split

```
Firebase Backend (Existing)
├── Authentication (users, sessions)
├── Firestore (opportunities, profiles)
└── Real-time updates

PocketBase Backend (New - File Storage)
├── PDF file storage
├── File metadata
├── Download tracking
└── Admin dashboard
```

### Why This Hybrid Approach?

**Firebase Strengths:**
- ✅ Already set up and working
- ✅ Excellent for authentication
- ✅ Real-time Firestore updates
- ✅ Proven scalability

**PocketBase Strengths:**
- ✅ Built specifically for file handling
- ✅ Simple file upload API
- ✅ Visual admin dashboard
- ✅ Self-hosted option (cost-effective)
- ✅ Direct file URLs
- ✅ No complex setup needed

### 1. Storage Layer - PocketBase

**Collection: `uploads`**

Structure in PocketBase:
```javascript
{
  id: string (auto-generated),
  organizationId: string (Firebase UID),
  firebase_uid: string (link to Firebase user),
  displayName: string (user-friendly name),
  description: text (file description),
  category: select (subject category),
  tags: json (search tags array),
  file: file (PDF attachment, max 50MB),
  downloadCount: number (popularity tracking),
  status: select (active/archived),
  created: datetime (auto),
  updated: datetime (auto)
}
```

**Why PocketBase for Files?**
- Simple file upload API
- Built-in file serving
- Admin dashboard included
- Self-hosted or cloud
- Direct file URLs
- No complex configuration

### 2. Authentication & Linking

**Firebase → PocketBase Connection:**

Since Firebase handles user authentication, we link users to PocketBase uploads:

```javascript
{
  // PocketBase record
  organizationId: firebaseUser.uid,  // Firebase UID
  firebase_uid: firebaseUser.uid,    // Explicit link
  // ... other fields
}
```

**Flow:**
1. User logs in with Firebase
2. Firebase UID is used as `organizationId` in PocketBase
3. PocketBase stores files with this ID
4. Queries filter by Firebase UID

### 3. Integration with Opportunities

When creating a "Resources" opportunity:
- Link to uploaded files
- Or upload new file during opportunity creation
- Store file reference in opportunity document

## 🔧 Implementation Steps

### Phase 1: PocketBase Backend Setup ✅ COMPLETE

#### Step 1.1: Install PocketBase SDK ✅
```bash
npm install pocketbase
```

#### Step 1.2: Create PocketBase Configuration ✅
**File: `pocketbaseConfig.js`**
- PocketBase client initialization
- Environment-based URL
- Auto-authentication handling

#### Step 1.3: Create Upload Service ✅
**File: `services/pocketbaseUploadService.js`**

Functions implemented:
- ✅ `uploadPDF(file, organizationId, metadata)` - Upload PDF to PocketBase
- ✅ `getOrganizationUploads(organizationId)` - Fetch org's uploads
- ✅ `getUploadById(uploadId)` - Get single upload
- ✅ `getFileUrl(record)` - Get download URL
- ✅ `updateUploadMetadata(uploadId, metadata)` - Update metadata
- ✅ `deleteUpload(uploadId)` - Delete file & record
- ✅ `incrementDownloadCount(uploadId)` - Track downloads
- ✅ `archiveUpload(uploadId)` - Soft delete
- ✅ `getUploadsByCategory(category)` - Filter by category
- ✅ `searchUploads(searchText)` - Search functionality
- ✅ `getUploadStats(organizationId)` - Analytics
- ✅ `validateFile(file)` - Pre-upload validation
- ✅ `formatFileSize(bytes)` - Format display

#### Step 1.4: PocketBase Server Setup
**Required Actions:**
1. Download PocketBase server
2. Run: `pocketbase serve`
3. Create admin account at http://127.0.0.1:8090/_/
4. Import collection schema (see POCKETBASE_QUICKSTART.md)
5. Configure API rules in PocketBase admin

#### Step 1.5: Environment Configuration ✅
**File: `.env.example`**
- Template for environment variables
- Copy to `.env` for local use
- Update for production deployment

### Phase 2: Upload UI Components (NEXT)

#### Step 2.1: File Picker Component
**Component: `components/FilePicker.tsx`**

Features:
- Select PDF files only
- Show file preview
- Display file size
- Validation (size, type)
- Integration with expo-document-picker

#### Step 2.2: Upload Modal
**Component: `components/UploadModal.tsx`**

Fields:
- File selection button
- Display name input
- Description textarea
- Category dropdown (Math, Science, Arts, etc.)
- Tags input
- Upload progress bar
- Cancel/Upload buttons

#### Step 2.3: Update OrgUploads Screen

Features needed:
1. **Floating Upload Button** - Opens upload modal
2. **Real-time File List** - Fetch from Firestore
3. **Search** - Filter by name, category, tags
4. **Filter** - By category, date, size
5. **Sort** - By date, name, downloads
6. **File Actions** - View, Edit, Delete, Share
7. **Empty State** - "Upload your first file" message
8. **Loading State** - Skeleton loaders
9. **Error Handling** - Upload failures, network errors

### Phase 3: File Management Features

#### Step 3.1: View/Preview Modal
- Display file metadata
- PDF viewer (for PDFs)
- Download button
- Share link
- Edit button
- Delete button
- Download statistics

#### Step 3.2: Edit Modal
Editable fields:
- Display name
- Description
- Category
- Tags
- Status (Active/Archived)

#### Step 3.3: Delete Confirmation
- Confirmation dialog
- Warning about linked opportunities
- Delete from Storage + Firestore

### Phase 4: Integration Features

#### Step 4.1: Link to Opportunities
In OrgCreate (Resources category):
- Option 1: Upload new file
- Option 2: Select from existing uploads
- Display linked file in opportunity

#### Step 4.2: Analytics
Track:
- Total uploads
- Total downloads
- Popular files
- Storage usage

### Phase 5: Student Access

#### Step 5.1: Student Browse Screen
**Screen: `app/studentPages/resources.tsx`**

Features:
- Browse all public uploads
- Filter by category, organization
- Search functionality
- Download files
- View file details

#### Step 5.2: Download Management
- Track downloads per student
- Save to device
- Open in external apps
- Share functionality

## 📱 UI/UX Design

### OrgUploads Screen Layout

```
┌─────────────────────────────────┐
│ My Uploads                      │
│ Manage your uploaded files      │
├─────────────────────────────────┤
│ [Search box]                    │
├─────────────────────────────────┤
│ Filters: [All▼] [Sort▼]        │
├─────────────────────────────────┤
│ ┌──────┐  ┌──────┐             │
│ │ 📄   │  │ 📄   │             │
│ │Math  │  │Sci   │             │
│ │1.2MB │  │2.5MB │             │
│ └──────┘  └──────┘             │
│                                 │
│ ┌──────┐  ┌──────┐             │
│ │ 📄   │  │ 📄   │             │
│ │Arts  │  │Code  │             │
│ │0.8MB │  │3.1MB │             │
│ └──────┘  └──────┘             │
└─────────────────────────────────┘
         [+] Upload
```

### Upload Modal Flow

```
1. Click Upload Button
   ↓
2. Select File (Document Picker)
   ↓
3. Fill Metadata
   - Display Name
   - Description
   - Category
   - Tags
   ↓
4. Upload Progress
   ↓
5. Success/Error Message
```

### File Card Actions

```
┌──────────────────────┐
│ 📄 Math for Kids     │
│ 08/09/25 | 5.2 MB   │
│                      │
│ [👁️View] [✏️Edit]   │
│ [📥Download] [🗑️Del] │
└──────────────────────┘
```

## 🔐 Security Considerations

### 1. File Type Restrictions (PDF Only)
```javascript
const ALLOWED_FILE_TYPES = [
  'application/pdf'  // PDFs only for educational materials
];
```

**PocketBase Configuration:**
- File field MIME types: `["application/pdf"]`
- Enforced at both client and server level
- Additional validation in upload service

### 2. File Size Limits
- Max file size: 50MB
- Warn users about large files
- Consider compression for images

### 3. Access Control
- Only organization can delete their uploads
- Students can only download, not modify
- Admin can moderate if needed

### 4. Malware Protection
- File type validation
- Size validation
- Consider third-party scanning (future)

## 📊 PocketBase Indexes

**Automatic Indexing:**
PocketBase automatically indexes:
- Primary key (`id`)
- All filterable fields
- All sortable fields

**No manual index configuration needed!** Unlike Firestore, PocketBase handles indexing automatically.

**Query Performance:**
```javascript
// This just works - no index creation needed!
pb.collection('uploads').getFullList({
  filter: 'organizationId = "xyz" && status = "active"',
  sort: '-created'
});
```

## 🚀 Technical Implementation

### File Upload Process (PocketBase)

```javascript
// services/pocketbaseUploadService.js

export const uploadPDF = async (file, organizationId, metadata) => {
  try {
    // 1. Validate file (PDF only, max 50MB)
    const validation = validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    // 2. Create FormData
    const formData = new FormData();
    
    // 3. Add file (React Native format)
    formData.append('file', {
      uri: file.uri,
      type: file.mimeType || 'application/pdf',
      name: file.name
    });
    
    // 4. Add metadata
    formData.append('organizationId', organizationId);
    formData.append('firebase_uid', organizationId);
    formData.append('displayName', metadata.displayName || file.name);
    formData.append('description', metadata.description || '');
    formData.append('category', metadata.category || 'Uncategorized');
    formData.append('tags', JSON.stringify(metadata.tags || []));
    formData.append('downloadCount', '0');
    formData.append('status', 'active');
    
    // 5. Upload to PocketBase (one API call!)
    const record = await pb.collection('uploads').create(formData);
    
    console.log('PDF uploaded successfully:', record.id);
    return record;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

### Advantages over Firebase Storage

**Simpler Code:**
- ❌ No separate storage + database operations
- ✅ Single API call uploads file + metadata
- ❌ No manual URL management
- ✅ Automatic file serving

**Built-in Features:**
- ✅ File versioning
- ✅ Automatic cleanup
- ✅ Admin dashboard
- ✅ Real-time subscriptions
- ✅ Built-in backup tools

### File Download Process (PocketBase)

```javascript
export const downloadFile = async (uploadId) => {
  try {
    // 1. Get upload record from PocketBase
    const record = await pb.collection('uploads').getOne(uploadId);
    
    // 2. Get file URL
    const fileUrl = pb.files.getUrl(record, record.file);
    
    // 3. Increment download count
    await incrementDownloadCount(uploadId);
    
    // 4. Open/download file
    await Linking.openURL(fileUrl);
    
    return fileUrl;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
```

**PocketBase File URLs:**
```javascript
// Automatic URL generation
const url = pb.files.getUrl(record, record.file);
// Returns: http://127.0.0.1:8090/api/files/uploads/abc123/file.pdf

// With token for private files (if needed)
const url = pb.files.getUrl(record, record.file, { token: pb.authStore.token });
```

## 📋 Implementation Checklist

### Backend Setup (Phase 1) ✅ COMPLETE
- ✅ Install PocketBase SDK: `npm install pocketbase`
- ✅ Create `pocketbaseConfig.js`
- ✅ Create `services/pocketbaseUploadService.js`
- ✅ Create `.env.example` template
- ⏳ Download PocketBase server
- ⏳ Run PocketBase: `pocketbase serve`
- ⏳ Create admin account
- ⏳ Import `uploads` collection schema
- ⏳ Configure PocketBase API rules
- ⏳ Test connection

### PocketBase Server Setup (USER ACTION REQUIRED)
- [ ] Download PocketBase from GitHub releases
- [ ] Run: `pocketbase.exe serve` (Windows) or `./pocketbase serve` (Mac/Linux)
- [ ] Access admin: http://127.0.0.1:8090/_/
- [ ] Create admin account
- [ ] Import collection schema (see POCKETBASE_QUICKSTART.md)
- [ ] Create `.env` file with EXPO_PUBLIC_POCKETBASE_URL

### UI Components
- [ ] Create `components/FilePicker.tsx`
- [ ] Create `components/UploadModal.tsx`
- [ ] Create `components/FileCard.tsx`
- [ ] Create `components/FilePreviewModal.tsx`
- [ ] Create `components/EditFileModal.tsx`

### OrgUploads Screen
- [ ] Fetch real files from Firestore
- [ ] Implement upload button + modal
- [ ] Add search functionality
- [ ] Add filter/sort options
- [ ] Add view file modal
- [ ] Add edit file modal
- [ ] Add delete confirmation
- [ ] Add empty state
- [ ] Add loading states
- [ ] Add error handling

### Integration
- [ ] Update OrgCreate (Resources category)
- [ ] Link uploads to opportunities
- [ ] Add file selection option
- [ ] Display linked files

### Student Access
- [ ] Create student resources screen
- [ ] Browse uploads by category
- [ ] Search uploads
- [ ] Download functionality
- [ ] Track student downloads

### Testing
- [ ] Test file upload (various types)
- [ ] Test large files (near limit)
- [ ] Test invalid files
- [ ] Test delete functionality
- [ ] Test search/filter
- [ ] Test permissions
- [ ] Test on iOS/Android

## 🎨 Design Assets Needed

### Icons
- Upload icon (cloud upload)
- File type icons (PDF, DOC, etc.)
- Action icons (edit, delete, download, share)

### Empty States
- No uploads yet illustration
- No search results illustration
- Upload error illustration

### Loading States
- Skeleton loaders for file grid
- Upload progress indicator
- Download progress indicator

## 📈 Future Enhancements

### Phase 2 Features
1. **Folders/Collections** - Organize files into folders
2. **Bulk Upload** - Upload multiple files at once
3. **Bulk Delete** - Delete multiple files
4. **Favorites** - Students can favorite files
5. **Comments** - Students can comment on files
6. **Ratings** - Students can rate files
7. **Version Control** - Upload new versions of files
8. **Thumbnails** - Auto-generate for PDFs/images
9. **Preview** - In-app PDF viewer
10. **Offline Access** - Download for offline use

### Analytics Dashboard
- Total storage used
- Most downloaded files
- Downloads per day/week/month
- Popular categories
- File type distribution

### Admin Features
- Content moderation
- Report inappropriate content
- Storage quota management
- Analytics for all organizations

## 💡 Best Practices

### Performance
- Lazy load file list
- Implement pagination (20 files per page)
- Cache download URLs
- Compress images before upload
- Use thumbnails for preview

### User Experience
- Show upload progress
- Clear error messages
- Confirm before delete
- Preview before upload
- Auto-save metadata drafts

### Data Management
- Clean up orphaned files
- Archive old files
- Monitor storage usage
- Implement quotas per organization

## 🔗 Related Systems

### Integration Points
1. **Opportunities System** - Link files to resources
2. **Profile System** - Display organization's uploads
3. **Search System** - Include uploads in global search
4. **Notifications** - Notify when new files uploaded
5. **Analytics** - Track upload/download metrics

## 📚 Resources & Documentation

### PocketBase Documentation
- [PocketBase Main Docs](https://pocketbase.io/docs/)
- [JavaScript SDK](https://github.com/pocketbase/js-sdk)
- [File Handling](https://pocketbase.io/docs/files-handling/)
- [API Rules](https://pocketbase.io/docs/api-rules-and-filters/)
- [Going to Production](https://pocketbase.io/docs/going-to-production/)

### React Native Libraries
- [expo-document-picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)
- [expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [react-native-pdf](https://github.com/wonday/react-native-pdf)

### Firebase (Still Used)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)

## 🎯 Success Metrics

### Key Metrics to Track
1. **Upload Success Rate** - % of successful uploads
2. **Average Upload Time** - Time to complete upload
3. **Total Storage Used** - Monitor costs
4. **Downloads per File** - Measure usefulness
5. **Active Files** - Files downloaded in last 30 days
6. **User Engagement** - Organizations actively uploading

## 🎯 Updated Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│              LearnLocal Native App                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌───────────────┐         ┌──────────────────┐   │
│  │   Firebase    │         │   PocketBase     │   │
│  ├───────────────┤         ├──────────────────┤   │
│  │ Authentication│◄────────┤ File Storage     │   │
│  │ (Login/Signup)│  UID    │ (PDF Uploads)    │   │
│  ├───────────────┤         ├──────────────────┤   │
│  │   Firestore   │         │ uploads          │   │
│  │ - opportunities│        │ collection       │   │
│  │ - scholarships│         │                  │   │
│  │ - workshops   │         │ Admin Dashboard  │   │
│  │ - profiles    │         │ File Management  │   │
│  └───────────────┘         └──────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🆚 Firebase vs PocketBase

### What Uses What

**Firebase:**
- ✅ User Authentication
- ✅ User Profiles
- ✅ Opportunities (all types)
- ✅ Real-time updates
- ✅ Social auth (Google, Facebook)

**PocketBase:**
- ✅ PDF File Storage
- ✅ File Metadata
- ✅ Download Tracking
- ✅ File Management
- ✅ Admin Dashboard

## Summary

This plan provides a comprehensive roadmap for implementing the Organization Uploads system using PocketBase for file storage.

### Current Status: Phase 1 ✅ COMPLETE (Code)

**What's Ready:**
- ✅ PocketBase SDK installed
- ✅ Configuration files created
- ✅ Upload service with 12 functions
- ✅ Environment template
- ✅ Comprehensive guides

**What You Need to Do:**
1. Download PocketBase server
2. Run: `pocketbase serve`
3. Create admin & import schema
4. Create `.env` file
5. Test connection

**See:** `Guides/POCKETBASE_QUICKSTART.md` for 5-minute setup!

### Next: Phase 2 (2-3 days)
Build the upload UI in OrgUploads screen

**Estimated Timeline:**
- Phase 1: ✅ Complete (backend setup)
- Phase 2: 2-3 days (UI components)
- Phase 3: 2-3 days (file management)
- Phase 4: 1-2 days (integration)
- Phase 5: 2-3 days (student access)
- Testing: 2-3 days

**Total: ~2-3 weeks** for full implementation

## 🔗 Quick Links to Guides

- **Setup:** [POCKETBASE_QUICKSTART.md](./POCKETBASE_QUICKSTART.md)
- **Details:** [POCKETBASE_SETUP_GUIDE.md](./POCKETBASE_SETUP_GUIDE.md)
- **Integration:** [POCKETBASE_INTEGRATION.md](./POCKETBASE_INTEGRATION.md)

Ready to set up PocketBase and start Phase 2! 🚀

