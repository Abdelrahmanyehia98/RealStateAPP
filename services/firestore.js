import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Collections
const PROPERTIES_COLLECTION = 'properties';
const USERS_COLLECTION = 'users';
const FAVORITES_COLLECTION = 'favorites';
const INQUIRIES_COLLECTION = 'inquiries';

// ===== PROPERTY OPERATIONS =====

/**
 * Get all properties
 * @returns {Promise<Array>} Array of property objects
 */
export const getAllProperties = async () => {
  try {
    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const querySnapshot = await getDocs(propertiesRef);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting properties:', error);
    throw error;
  }
};

/**
 * Get properties with filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} Array of filtered property objects
 */
export const getFilteredProperties = async (filters = {}) => {
  try {
    const { type, propertyType, minPrice, maxPrice, bedrooms, location } = filters;

    let q = collection(db, PROPERTIES_COLLECTION);
    const queryConstraints = [];

    if (type && type !== 'any') {
      queryConstraints.push(where('type', '==', type));
    }

    if (propertyType && propertyType !== 'any') {
      queryConstraints.push(where('propertyType', '==', propertyType));
    }

    if (bedrooms && bedrooms !== 'any') {
      queryConstraints.push(where('bedrooms', '==', parseInt(bedrooms)));
    }

    // Apply query constraints
    if (queryConstraints.length > 0) {
      q = query(q, ...queryConstraints);
    }

    const querySnapshot = await getDocs(q);

    // Get all properties and filter client-side for price and location
    // (Firestore doesn't support multiple range queries in a single query)
    let properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply client-side filtering for price and location
    if (minPrice) {
      properties = properties.filter(property => property.price >= parseInt(minPrice));
    }

    if (maxPrice) {
      properties = properties.filter(property => property.price <= parseInt(maxPrice));
    }

    if (location) {
      properties = properties.filter(property =>
        property.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    return properties;
  } catch (error) {
    console.error('Error getting filtered properties:', error);
    throw error;
  }
};

/**
 * Get a property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object>} Property object
 */
export const getPropertyById = async (id) => {
  try {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);
    const propertySnap = await getDoc(propertyRef);

    if (propertySnap.exists()) {
      return {
        id: propertySnap.id,
        ...propertySnap.data()
      };
    } else {
      throw new Error('Property not found');
    }
  } catch (error) {
    console.error('Error getting property:', error);
    throw error;
  }
};

/**
 * Add a new property
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>} Added property with ID
 */
export const addProperty = async (propertyData) => {
  try {
    // Upload image if it's a file URI
    let imageUrl = propertyData.image;
    if (propertyData.image && propertyData.image.startsWith('file://')) {
      imageUrl = await uploadPropertyImage(propertyData.image);
    }

    // Upload additional images if they exist
    let imageUrls = propertyData.images || [];
    if (Array.isArray(imageUrls)) {
      const uploadPromises = imageUrls.map(async (img) => {
        if (img && img.startsWith('file://')) {
          return await uploadPropertyImage(img);
        }
        return img;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    // Prepare property data with timestamps and images
    const property = {
      ...propertyData,
      image: imageUrl,
      images: imageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), property);

    return {
      id: docRef.id,
      ...property
    };
  } catch (error) {
    console.error('Error adding property:', error);
    throw error;
  }
};

/**
 * Update a property
 * @param {string} id - Property ID
 * @param {Object} propertyData - Updated property data
 * @returns {Promise<Object>} Updated property
 */
export const updateProperty = async (id, propertyData) => {
  try {
    // Upload image if it's a file URI
    let imageUrl = propertyData.image;
    if (propertyData.image && propertyData.image.startsWith('file://')) {
      imageUrl = await uploadPropertyImage(propertyData.image);
    }

    // Upload additional images if they exist
    let imageUrls = propertyData.images || [];
    if (Array.isArray(imageUrls)) {
      const uploadPromises = imageUrls.map(async (img) => {
        if (img && img.startsWith('file://')) {
          return await uploadPropertyImage(img);
        }
        return img;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    // Prepare property data with timestamp and images
    const property = {
      ...propertyData,
      image: imageUrl,
      images: imageUrls,
      updatedAt: serverTimestamp()
    };

    // Update in Firestore
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);
    await updateDoc(propertyRef, property);

    return {
      id,
      ...property
    };
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

/**
 * Delete a property
 * @param {string} id - Property ID
 * @returns {Promise<void>}
 */
export const deleteProperty = async (id) => {
  try {
    const propertyRef = doc(db, PROPERTIES_COLLECTION, id);
    await deleteDoc(propertyRef);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};

/**
 * Get properties by user ID
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of property objects added by the user
 */
export const getPropertiesByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    const propertiesRef = collection(db, PROPERTIES_COLLECTION);
    const q = query(propertiesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user properties:', error);
    throw error;
  }
};

/**
 * Upload a property image to Firebase Storage
 * @param {string} uri - Image URI
 * @returns {Promise<string>} Download URL
 */
export const uploadPropertyImage = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `property_images/${Date.now()}_${filename}`);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Initialize sample properties in Firestore
 * @param {Array} sampleProperties - Array of sample property objects
 * @returns {Promise<void>}
 */
export const initializeSampleProperties = async (sampleProperties) => {
  try {
    console.log('Starting sample properties initialization...');

    // Check if properties already exist
    let existingProperties = [];
    try {
      existingProperties = await getAllProperties();
      console.log(`Found ${existingProperties.length} existing properties`);
    } catch (error) {
      console.error('Error checking existing properties:', error);
      // Continue with initialization even if checking fails
      existingProperties = [];
    }

    if (existingProperties.length === 0) {
      console.log('No existing properties found, adding sample properties...');

      // Add sample properties one by one instead of using batch
      // This is more reliable for initialization
      for (const property of sampleProperties) {
        try {
          const propertyWithTimestamps = {
            ...property,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };

          await addDoc(collection(db, PROPERTIES_COLLECTION), propertyWithTimestamps);
          console.log(`Added sample property: ${property.title}`);
        } catch (addError) {
          console.error(`Error adding property ${property.title}:`, addError);
          // Continue with next property even if one fails
        }
      }

      console.log('Sample properties initialization completed');
    } else {
      console.log('Properties already exist, skipping initialization');
    }

    return true;
  } catch (error) {
    console.error('Error in sample properties initialization:', error);
    throw error;
  }
};
