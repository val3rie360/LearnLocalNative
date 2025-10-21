# Saved Opportunities System

## Overview
The Saved Opportunities System allows students to bookmark/save opportunities for later viewing. It includes automatic cleanup of deleted or archived opportunities and provides a dedicated "Saved" category in the student home feed.

## Architecture

### Data Storage
Saved opportunities are stored in the user's profile document in Firestore:

```javascript
// profiles/{userId}
{
  bookmarkedOpportunities: [
    {
      opportunityId: "abc123",
      specificCollection: "scholarships",
      bookmarkedAt: Timestamp
    },
    {
      opportunityId: "def456",
      specificCollection: "competitions",
      bookmarkedAt: Timestamp
    }
    // ... more bookmarks
  ]
}
```

### Key Features

#### 1. **Student-Centric Storage**
- Each student's bookmarks are stored in their profile document
- Fast access to saved opportunities without cross-collection queries
- Bookmarks include collection type for proper retrieval

#### 2. **Automatic Cleanup**
The system includes several cleanup mechanisms:

- **On Fetch**: Dead bookmarks are cleaned up when loading the saved opportunities page
- **On Delete**: When an opportunity is deleted by an organization, all bookmarks for that opportunity are removed across all users
- **Manual Cleanup**: The `cleanupDeadBookmarks()` function can be called anytime to remove invalid references

#### 3. **Multi-Collection Support**
- Works across all opportunity types: scholarships, competitions, workshops, study spots, etc.
- Each bookmark stores the specific collection name for proper retrieval

## API Functions

### Core Bookmark Functions

#### `addOpportunityBookmark(userId, opportunityId, specificCollection)`
Adds an opportunity to the user's bookmarks.

```javascript
await addOpportunityBookmark(
  "user123",
  "scholarship456",
  "scholarships"
);
```

**Parameters:**
- `userId` (string): Student's user ID
- `opportunityId` (string): ID of the opportunity to bookmark
- `specificCollection` (string): Collection name (scholarships, competitions, etc.)

**Behavior:**
- Checks if opportunity is already bookmarked
- Adds timestamp when bookmarked
- Prevents duplicate bookmarks

---

#### `removeOpportunityBookmark(userId, opportunityId, specificCollection)`
Removes an opportunity from the user's bookmarks.

```javascript
await removeOpportunityBookmark(
  "user123",
  "scholarship456",
  "scholarships"
);
```

**Parameters:**
- `userId` (string): Student's user ID
- `opportunityId` (string): ID of the opportunity to unbookmark
- `specificCollection` (string): Collection name

---

#### `getBookmarkedOpportunities(userId)`
Retrieves all bookmarked opportunities for a user.

```javascript
const savedOpportunities = await getBookmarkedOpportunities("user123");
// Returns: Array of opportunity objects with full details
```

**Returns:** Array of opportunity objects

**Behavior:**
- Fetches each bookmarked opportunity from its specific collection
- Only returns opportunities with status === "active"
- Automatically filters out deleted or inactive opportunities
- Includes the `specificCollection` field in each opportunity object

---

#### `isOpportunityBookmarked(userId, opportunityId, specificCollection)`
Checks if a specific opportunity is bookmarked by a user.

```javascript
const isBookmarked = await isOpportunityBookmarked(
  "user123",
  "scholarship456",
  "scholarships"
);
// Returns: true or false
```

**Returns:** Boolean

---

### Cleanup Functions

#### `cleanupDeadBookmarks(userId)`
Removes bookmarks for opportunities that no longer exist or are inactive.

```javascript
const removedCount = await cleanupDeadBookmarks("user123");
console.log(`Cleaned up ${removedCount} dead bookmarks`);
```

**Returns:** Number of bookmarks removed

**When to use:**
- Called automatically when fetching bookmarked opportunities in Home.tsx
- Can be called manually for user maintenance
- Useful for periodic cleanup jobs

---

#### `removeAllBookmarksForOpportunity(opportunityId, specificCollection)`
Removes a specific opportunity from ALL users' bookmarks.

```javascript
await removeAllBookmarksForOpportunity(
  "scholarship456",
  "scholarships"
);
```

**Parameters:**
- `opportunityId` (string): ID of the opportunity
- `specificCollection` (string): Collection name

**Returns:** Number of users whose bookmarks were updated

**When called:**
- Automatically called when an opportunity is deleted via `deleteOpportunity()`
- Ensures no orphaned bookmarks remain in the system

---

## UI Integration

### Student Home Page (`app/studentPages/(tabs)/Home.tsx`)

#### Saved Category
The home page includes a "Saved" category filter:

```typescript
{
  icon: "bookmark",
  label: "Saved",
  bg: "#F59E0B",
  value: "saved",
}
```

When selected, it displays all bookmarked opportunities.

#### Bookmark Toggle
Each opportunity card has a bookmark button:

```typescript
<OpportunityCard
  bookmarked={isOpportunityBookmarked(op.id, op.specificCollection)}
  onBookmarkToggle={() => handleBookmarkToggle(op.id, op.specificCollection)}
  // ... other props
/>
```

#### State Management
```typescript
const [bookmarkedOpportunities, setBookmarkedOpportunities] = useState<any[]>([]);

// Fetch bookmarked opportunities on load
useEffect(() => {
  fetchBookmarkedOpportunities();
}, [user?.uid]);

// Display saved opportunities when "Saved" category is selected
const getDisplayedOpportunities = () => {
  if (selectedCategory === "saved") {
    return sortOpportunities(bookmarkedOpportunities);
  }
  // ... handle other categories
};
```

---

### Opportunity Detail Page (`app/studentPages/opportunity.tsx`)

The opportunity detail page includes a bookmark button in the header:

```typescript
// State
const [isBookmarked, setIsBookmarked] = useState(false);
const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

// Check bookmark status on load
useEffect(() => {
  if (user?.uid) {
    const bookmarked = await isOpportunityBookmarked(
      user.uid,
      id,
      specificCollection
    );
    setIsBookmarked(bookmarked);
  }
}, [id, specificCollection, user?.uid]);

// Toggle bookmark
const handleToggleBookmark = async () => {
  if (isBookmarked) {
    await removeOpportunityBookmark(user.uid, id, specificCollection);
    setIsBookmarked(false);
  } else {
    await addOpportunityBookmark(user.uid, id, specificCollection);
    setIsBookmarked(true);
  }
};
```

**UI Location:**
- Top right of the header, next to the calendar icon
- Yellow color when bookmarked, white outline when not bookmarked
- Shows loading indicator during toggle

---

## Cleanup Workflow

### Scenario 1: Student Unsaves an Opportunity
```
User clicks bookmark button
  ↓
handleBookmarkToggle() called
  ↓
removeOpportunityBookmark() removes from user's profile
  ↓
UI updates immediately
  ↓
fetchBookmarkedOpportunities() refreshes the list
```

### Scenario 2: Organization Deletes an Opportunity
```
Organization deletes opportunity
  ↓
deleteOpportunity() called
  ↓
removeAllBookmarksForOpportunity() called
  ↓
Iterates through all user profiles
  ↓
Removes bookmark from each user's profile
  ↓
Deletes opportunity from specific collection
  ↓
Deletes opportunity from opportunities collection
```

### Scenario 3: Student Views Saved Opportunities
```
Student clicks "Saved" category
  ↓
fetchBookmarkedOpportunities() called
  ↓
cleanupDeadBookmarks() called first
  ↓
Checks each bookmark to see if opportunity still exists
  ↓
Removes invalid bookmarks from user's profile
  ↓
getBookmarkedOpportunities() fetches valid opportunities
  ↓
Only returns opportunities with status === "active"
  ↓
Display to user
```

---

## Error Handling

### Invalid Opportunities
If a bookmarked opportunity is deleted or archived:
- `getBookmarkedOpportunities()` automatically filters it out
- `cleanupDeadBookmarks()` removes the dead reference
- No error is shown to the user
- Empty state message displayed if no valid bookmarks remain

### Missing User Profile
If user profile doesn't exist:
- All bookmark functions return gracefully
- `getBookmarkedOpportunities()` returns empty array
- `isOpportunityBookmarked()` returns false
- No errors thrown

### Network Errors
Network errors during bookmark operations:
- Alert shown to user
- State remains unchanged
- User can retry the operation

---

## Performance Considerations

### Efficient Fetching
- Bookmarks are stored as an array in the user's profile (single document read)
- Each bookmarked opportunity is fetched individually (parallel reads)
- Dead bookmarks are removed during fetch to prevent future waste

### Batch Operations
When deleting an opportunity:
- `removeAllBookmarksForOpportunity()` iterates through all profiles
- Only updates profiles that actually have the bookmark
- Uses batch writes for efficiency (could be enhanced with batching)

### Caching
The Home page maintains bookmarked opportunities in state:
- Reduces redundant fetches
- Updates immediately after bookmark toggle
- Refreshes on pull-to-refresh

---

## Best Practices

### For Students
1. **Save opportunities you're interested in** - Use the bookmark feature to build your own collection
2. **Review saved opportunities regularly** - Check your "Saved" tab to track opportunities you're considering
3. **Unsave when no longer interested** - Keep your saved list clean and relevant

### For Developers
1. **Always pass specificCollection** - Required for proper opportunity retrieval
2. **Handle loading states** - Show loading indicators during bookmark operations
3. **Clean up on fetch** - Call `cleanupDeadBookmarks()` before displaying saved opportunities
4. **Provide feedback** - Update UI immediately after bookmark toggle

### For Organizations
1. **Archive instead of delete** - When possible, set status to "inactive" instead of deleting
2. **Understand impact** - Deleting an opportunity removes it from all students' saved lists
3. **Notify users** - Consider notifying students before deleting popular opportunities

---

## Testing Checklist

- [ ] Bookmark an opportunity from the home feed
- [ ] Unbookmark an opportunity from the home feed
- [ ] View all saved opportunities in the "Saved" category
- [ ] Bookmark an opportunity from the detail page
- [ ] Unbookmark an opportunity from the detail page
- [ ] Delete an opportunity and verify bookmarks are removed
- [ ] Archive an opportunity (status = "inactive") and verify it doesn't appear in saved list
- [ ] Test with no bookmarks - verify empty state message
- [ ] Test cleanup function - manually create dead bookmarks and verify they're removed
- [ ] Test across different opportunity types (scholarships, competitions, etc.)
- [ ] Test refresh on saved page - verify dead bookmarks are cleaned up

---

## Future Enhancements

### Potential Improvements
1. **Bookmark Collections/Folders** - Allow students to organize bookmarks into categories
2. **Bookmark Notes** - Let students add private notes to bookmarked opportunities
3. **Bookmark Notifications** - Notify students when bookmarked opportunities are expiring soon
4. **Bookmark Export** - Allow students to export their saved opportunities
5. **Bookmark Sharing** - Let students share collections with friends
6. **Batch Cleanup Job** - Scheduled cleanup of dead bookmarks across all users
7. **Bookmark Analytics** - Track which opportunities are most bookmarked

### Database Optimization
- Consider using Firestore array queries if scaling becomes an issue
- Implement caching layer for frequently accessed bookmarks
- Add indexes for faster bookmark retrieval

---

## Related Systems

- **Opportunity System**: Core system for managing opportunities
- **Registration/Tracking System**: Related but separate - students can bookmark without registering
- **Calendar System**: Registered opportunities appear in calendar, bookmarked ones don't
- **Notification System**: Could be extended to notify about bookmarked opportunities

---

## Troubleshooting

### Issue: Bookmarks not appearing
**Solution:** Check that the opportunity status is "active" and the document exists in the specific collection.

### Issue: Dead bookmarks not being cleaned up
**Solution:** Verify `cleanupDeadBookmarks()` is being called in `fetchBookmarkedOpportunities()`.

### Issue: Bookmark toggle not working
**Solution:** Ensure user is logged in and has a profile document. Check console for errors.

### Issue: Organization can't delete opportunity
**Solution:** Check that `removeAllBookmarksForOpportunity()` isn't failing due to permissions.

---

## Summary

The Saved Opportunities System provides a robust, user-friendly way for students to bookmark and manage opportunities of interest. With automatic cleanup, multi-collection support, and seamless UI integration, it enhances the student experience while maintaining data integrity.

**Key Takeaways:**
- ✅ Bookmarks stored in user profiles for fast access
- ✅ Automatic cleanup of deleted/archived opportunities
- ✅ Works across all opportunity types
- ✅ Immediate UI feedback on bookmark toggle
- ✅ Dedicated "Saved" category in home feed
- ✅ Available on both list and detail views


