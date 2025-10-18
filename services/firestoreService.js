import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    increment,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebaseconfig";

// Function to add or update user profile
export const createUserProfile = async (userId, profileData) => {
  return setDoc(doc(db, "profiles", userId), profileData);
};

// Function to get user profile data
export const getUserProfile = async (userId) => {
  try {
    const profileDoc = await getDoc(doc(db, "profiles", userId));
    if (profileDoc.exists()) {
      return profileDoc.data();
    } else {
      console.log("No profile document found for user:", userId);
      return null;
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Function to get all community posts
export const getCommunityPosts = async () => {
  try {
    const postsCol = collection(db, "posts");
    const postsSnap = await getDocs(postsCol);
    return postsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        user: data.user,
        date: data.date,
        title: data.title,
        desc: data.desc,
        tag: data.tag,
        upvotes: data.upvotes ?? 0, // <-- ensure upvotes is always present
        upvotedBy: data.upvotedBy || [], // <-- ensure upvotedBy is always an array
      };
    });
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
};

export const getLargestPosts = async () => {
  try {
    const postsCol = collection(db, "posts");
    const q = query(postsCol, orderBy("upvotes", "desc"));
    const postsSnap = await getDocs(q);
    return postsSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        user: data.user,
        date: data.date,
        title: data.title,
        desc: data.desc,
        tag: data.tag,
        upvotes: data.upvotes ?? 0,
        upvotedBy: data.upvotedBy || [],
      };
    });
  } catch (error) {
    console.error("Error fetching largest posts:", error);
    throw error;
  }
};

// Function to add a new community post
export const addCommunityPost = async (postData) => {
  try {
    return await addDoc(collection(db, "posts"), postData);
  } catch (error) {
    console.error("Error adding community post:", error);
    throw error;
  }
};

// Function to update user profile data
export const updateUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, "profiles", userId), profileData, { merge: true });
    console.log("Profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * HYBRID OPPORTUNITIES SYSTEM
 *
 * This system uses two parts:
 * 1. A denormalized 'opportunities' collection with preview data for lists/feeds
 * 2. Specific collections (scholarships, workshops, studySpots) with complete data
 */

// Map category names to collection names
const getCollectionNameForCategory = (category) => {
  const categoryMap = {
    "Scholarship / Grant": "scholarships",
    "Competition / Event": "competitions",
    "Workshop / Seminar": "workshops",
    Resources: "resources",
    "Study Spot": "studySpots",
  };
  return categoryMap[category] || "opportunities";
};

/**
 * Create an opportunity with the hybrid model
 * @param {Object} opportunityData - Complete opportunity data
 * @param {string} category - Category of the opportunity
 * @param {string} organizationId - ID of the organization creating the opportunity
 * @returns {Promise<string>} - The ID of the created opportunity
 */
export const createOpportunity = async (
  opportunityData,
  category,
  organizationId
) => {
  try {
    // Determine the specific collection based on category
    const specificCollection = getCollectionNameForCategory(category);

    // Add metadata
    const timestamp = serverTimestamp();
    const completeData = {
      ...opportunityData,
      category,
      organizationId,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "active",
    };

    // Step 1: Create the document in the specific collection (with full data)
    const specificDocRef = await addDoc(
      collection(db, specificCollection),
      completeData
    );
    const opportunityId = specificDocRef.id;

    // Step 2: Create a denormalized preview document in the 'opportunities' collection
    const previewData = {
      id: opportunityId,
      title: opportunityData.title,
      description: opportunityData.description,
      category,
      organizationId,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: "active",
      // Include key filtering fields
      ...(opportunityData.location && { location: opportunityData.location }),
      ...(opportunityData.amount && { amount: opportunityData.amount }),
      // Add a reference to the specific collection
      specificCollection,
    };

    await setDoc(doc(db, "opportunities", opportunityId), previewData);

    console.log(`Opportunity created successfully with ID: ${opportunityId}`);
    return opportunityId;
  } catch (error) {
    console.error("Error creating opportunity:", error);
    throw error;
  }
};

/**
 * Get the full details of an opportunity from its specific collection
 * @param {string} opportunityId - ID of the opportunity
 * @param {string} specificCollection - Name of the specific collection
 * @returns {Promise<Object>} - Full opportunity data
 */
export const getOpportunityDetails = async (
  opportunityId,
  specificCollection
) => {
  try {
    const docRef = doc(db, specificCollection, opportunityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No opportunity found with ID:", opportunityId);
      return null;
    }
  } catch (error) {
    console.error("Error getting opportunity details:", error);
    throw error;
  }
};

/**
 * Get opportunity preview from the opportunities collection
 * @param {string} opportunityId - ID of the opportunity
 * @returns {Promise<Object>} - Preview data
 */
export const getOpportunityPreview = async (opportunityId) => {
  try {
    const docRef = doc(db, "opportunities", opportunityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No opportunity preview found with ID:", opportunityId);
      return null;
    }
  } catch (error) {
    console.error("Error getting opportunity preview:", error);
    throw error;
  }
};

/**
 * Update an opportunity in both collections
 * @param {string} opportunityId - ID of the opportunity
 * @param {string} specificCollection - Name of the specific collection
 * @param {Object} updateData - Data to update
 */
export const updateOpportunity = async (
  opportunityId,
  specificCollection,
  updateData
) => {
  try {
    const timestamp = serverTimestamp();
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: timestamp,
    };

    // Update in specific collection
    await setDoc(
      doc(db, specificCollection, opportunityId),
      dataWithTimestamp,
      { merge: true }
    );

    // Update preview data in opportunities collection
    const previewUpdateData = {
      updatedAt: timestamp,
      ...(updateData.title && { title: updateData.title }),
      ...(updateData.description && { description: updateData.description }),
      ...(updateData.location && { location: updateData.location }),
      ...(updateData.amount && { amount: updateData.amount }),
      ...(updateData.status && { status: updateData.status }),
    };

    await setDoc(doc(db, "opportunities", opportunityId), previewUpdateData, {
      merge: true,
    });

    console.log("Opportunity updated successfully");
  } catch (error) {
    console.error("Error updating opportunity:", error);
    throw error;
  }
};

/**
 * Get all opportunities for a specific organization
 * @param {string} organizationId - ID of the organization
 * @returns {Promise<Array>} - Array of opportunity previews
 */
export const getOrganizationOpportunities = async (organizationId) => {
  try {
    const { query, where, getDocs, collection, orderBy } = await import(
      "firebase/firestore"
    );

    const q = query(
      collection(db, "opportunities"),
      where("organizationId", "==", organizationId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const opportunities = [];

    querySnapshot.forEach((doc) => {
      opportunities.push({ id: doc.id, ...doc.data() });
    });

    return opportunities;
  } catch (error) {
    console.error("Error getting organization opportunities:", error);
    throw error;
  }
};

/**
 * Delete an opportunity from both collections
 * @param {string} opportunityId - ID of the opportunity
 * @param {string} specificCollection - Name of the specific collection
 */
export const deleteOpportunity = async (opportunityId, specificCollection) => {
  try {
    const { deleteDoc } = await import("firebase/firestore");

    // Delete from specific collection
    await deleteDoc(doc(db, specificCollection, opportunityId));

    // Delete from opportunities collection
    await deleteDoc(doc(db, "opportunities", opportunityId));

    console.log("Opportunity deleted successfully");
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    throw error;
  }
};

/**
 * Get all active opportunities for students (all organizations)
 * @returns {Promise<Array>} - Array of active opportunities sorted by latest first
 */
export const getAllActiveOpportunities = async () => {
  try {
    const q = query(
      collection(db, "opportunities"),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const opportunities = [];

    querySnapshot.forEach((docSnap) => {
      opportunities.push({ id: docSnap.id, ...docSnap.data() });
    });

    const organizationIds = [
      ...new Set(
        opportunities
          .map((op) => op.organizationId)
          .filter((id) => typeof id === "string" && id.length)
      ),
    ];

    let profilesMap = new Map();
    if (organizationIds.length) {
      const profileEntries = await Promise.all(
        organizationIds.map(async (orgId) => {
          const profileSnap = await getDoc(doc(db, "profiles", orgId));
          return [orgId, profileSnap.exists() ? profileSnap.data() : null];
        })
      );
      profilesMap = new Map(profileEntries);
    }

    return opportunities.map((opportunity) => {
      const profile = profilesMap.get(opportunity.organizationId) || null;
      const profileName = profile?.name;

      return {
        ...opportunity,
        organizationProfile: profile
          ? { id: opportunity.organizationId, ...profile }
          : undefined,
        organizationName:
          profileName || opportunity.organizationName || "Organization",
        organizationVerificationStatus:
          profile?.verificationStatus ??
          opportunity.organizationVerificationStatus,
      };
    });
  } catch (error) {
    console.error("Error fetching active opportunities:", error);
    throw error;
  }
};

export async function updateCommunityPostUpvotes(postId, userId) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);
  const post = postSnap.data();
  const hasUpvoted = post.upvotedBy?.includes(userId);

  if (hasUpvoted) {
    // Remove upvote
    await updateDoc(postRef, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(userId),
    });
  } else {
    // Add upvote
    await updateDoc(postRef, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(userId),
    });
  }
}

/**
 * LIBRARY BOOKMARK MANAGEMENT
 * Manages student bookmarks for educational resources
 */

/**
 * Add a resource to user's bookmarks
 * @param {string} userId - Student user ID
 * @param {string} uploadId - Resource upload ID
 * @returns {Promise<void>}
 */
export const addBookmark = async (userId, uploadId) => {
  try {
    const userRef = doc(db, "profiles", userId);
    await updateDoc(userRef, {
      bookmarkedResources: arrayUnion(uploadId),
    });
    console.log("Bookmark added:", uploadId);
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

/**
 * Remove a resource from user's bookmarks
 * @param {string} userId - Student user ID
 * @param {string} uploadId - Resource upload ID
 * @returns {Promise<void>}
 */
export const removeBookmark = async (userId, uploadId) => {
  try {
    const userRef = doc(db, "profiles", userId);
    await updateDoc(userRef, {
      bookmarkedResources: arrayRemove(uploadId),
    });
    console.log("Bookmark removed:", uploadId);
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

/**
 * Get all bookmarked resources for a user
 * @param {string} userId - Student user ID
 * @returns {Promise<Array>} - Array of bookmarked upload documents
 */
export const getBookmarkedResources = async (userId) => {
  try {
    const userRef = doc(db, "profiles", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return [];
    }

    const bookmarkedIds = userSnap.data().bookmarkedResources || [];
    
    if (bookmarkedIds.length === 0) {
      return [];
    }

    // Fetch each bookmarked resource
    const resourcePromises = bookmarkedIds.map(async (uploadId) => {
      try {
        const uploadRef = doc(db, "uploads", uploadId);
        const uploadSnap = await getDoc(uploadRef);
        
        if (uploadSnap.exists() && uploadSnap.data().status === "active") {
          return { id: uploadSnap.id, ...uploadSnap.data() };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching upload ${uploadId}:`, error);
        return null;
      }
    });

    const resources = await Promise.all(resourcePromises);
    
    // Filter out null values (deleted or inactive resources)
    return resources.filter((resource) => resource !== null);
  } catch (error) {
    console.error("Error getting bookmarked resources:", error);
    throw error;
  }
};

/**
 * Check if a resource is bookmarked by a user
 * @param {string} userId - Student user ID
 * @param {string} uploadId - Resource upload ID
 * @returns {Promise<boolean>}
 */
export const isResourceBookmarked = async (userId, uploadId) => {
  try {
    const userRef = doc(db, "profiles", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return false;
    }

    const bookmarkedIds = userSnap.data().bookmarkedResources || [];
    return bookmarkedIds.includes(uploadId);
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};