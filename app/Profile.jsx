import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { updateProfile } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPropertiesByUserId } from '../services/firestore';

const { width } = Dimensions.get('window');

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // User data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    listings: 0,
    savedProperties: 0
  });

  const [posts, setPosts] = useState([]);
  const [userProperties, setUserProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: null
  });

  const [editedData, setEditedData] = useState({ ...userData });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to load profile image from AsyncStorage
        const storedImage = await AsyncStorage.getItem('@profile_image');
        if (storedImage) {
          setProfileImage(storedImage);
        }

        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              name: data.name || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              location: data.location || '',
              bio: data.bio || '',
              listings: data.listings || 0,
              savedProperties: data.savedProperties || 0
            });
            setEditedData({
              name: data.name || '',
              email: data.email || user.email || '',
              phone: data.phone || '',
              location: data.location || '',
              bio: data.bio || ''
            });
          } else {
            // Initialize user data if document doesn't exist
            await setDoc(docRef, {
              name: user.displayName || '',
              email: user.email || '',
              phone: '',
              location: '',
              bio: '',
              listings: 0,
              savedProperties: 0
            });
          }

          // Fetch user's properties from Firestore
          fetchUserProperties(user.uid);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load profile data");
      }
    };

    fetchUserData();
    loadLocalPosts();
  }, []);

  // Fetch user's properties from Firestore
  const fetchUserProperties = async (userId) => {
    if (!userId) return;

    try {
      setLoadingProperties(true);
      const properties = await getPropertiesByUserId(userId);
      setUserProperties(properties);

      // Update the listings count in userData
      setUserData(prevData => ({
        ...prevData,
        listings: properties.length
      }));

    } catch (error) {
      console.error("Error fetching user properties:", error);
      Alert.alert("Error", "Failed to load your properties");
    } finally {
      setLoadingProperties(false);
    }
  };

  // Load posts from local storage
  const loadLocalPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('@user_posts');
      if (savedPosts !== null) {
        setPosts(JSON.parse(savedPosts));
      }
    } catch (error) {
      console.error('Error loading local posts:', error);
    }
  };

  // Save posts to local storage
  const savePostsLocally = async (postsToSave) => {
    try {
      await AsyncStorage.setItem('@user_posts', JSON.stringify(postsToSave));
    } catch (error) {
      console.error('Error saving posts locally:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!editedData.name || !editedData.email) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'Please login to update your profile');
        return;
      }

      // Update Firestore
      await updateDoc(doc(db, "Users", user.uid), {
        name: editedData.name,
        email: editedData.email,
        phone: editedData.phone,
        location: editedData.location,
        bio: editedData.bio
      });

      // Update local state
      setUserData(editedData);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your media to upload profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLoading(true);
      try {
        const imageUri = result.assets[0].uri;

        // Save to AsyncStorage
        await AsyncStorage.setItem('@profile_image', imageUri);

        // Update local state
        setProfileImage(imageUri);

        Alert.alert('Success', 'Profile picture updated successfully!');
      } catch (error) {
        console.error('Error updating profile picture:', error);
        Alert.alert('Error', 'Failed to update profile picture');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePostImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your media to upload post image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      if (editingPost) {
        setEditingPost({ ...editingPost, image: imageUri });
      } else {
        setNewPost({ ...newPost, image: imageUri });
      }
    }
  };

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.description || !newPost.price || !newPost.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const newPostWithId = {
        ...newPost,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Update local state and storage
      const updatedPosts = [newPostWithId, ...posts];
      setPosts(updatedPosts);
      await savePostsLocally(updatedPosts);

      // Update listings count
      const updatedUserData = {
        ...userData,
        listings: updatedPosts.length
      };
      setUserData(updatedUserData);

      // Update Firestore
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, "Users", user.uid), {
          listings: updatedPosts.length
        });
      }

      setNewPost({
        title: '',
        description: '',
        price: '',
        location: '',
        image: null
      });
      setShowAddPostModal(false);

      Alert.alert('Success', 'Post added successfully!');
    } catch (error) {
      console.error('Error adding post:', error);
      Alert.alert('Error', 'Failed to add post');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async () => {
    if (!editingPost?.title || !editingPost?.description || !editingPost?.price || !editingPost?.location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const updatedPosts = posts.map(post =>
        post.id === editingPost.id ? editingPost : post
      );

      setPosts(updatedPosts);
      await savePostsLocally(updatedPosts);

      setEditingPost(null);
      Alert.alert('Success', 'Post updated successfully!');
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setLoading(true);
              // Filter out the post to be deleted
              const updatedPosts = posts.filter(post => post.id !== postId);

              // Update state
              setPosts(updatedPosts);

              // Update AsyncStorage
              await savePostsLocally(updatedPosts);

              // Update listings count in user data
              const updatedUserData = {
                ...userData,
                listings: updatedPosts.length
              };
              setUserData(updatedUserData);

              // Update Firestore if needed
              const user = auth.currentUser;
              if (user) {
                await updateDoc(doc(db, "Users", user.uid), {
                  listings: updatedPosts.length
                });
              }

              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderEditMode = () => (
    <View style={styles.editContainer}>
      <TextInput
        style={styles.input}
        value={editedData.name}
        onChangeText={(text) => setEditedData({ ...editedData, name: text })}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={editedData.email}
        onChangeText={(text) => setEditedData({ ...editedData, email: text })}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={editedData.phone}
        onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={editedData.location}
        onChangeText={(text) => setEditedData({ ...editedData, location: text })}
        placeholder="Location"
      />
      <TextInput
        style={[styles.input, styles.bioInput]}
        value={editedData.bio}
        onChangeText={(text) => setEditedData({ ...editedData, bio: text })}
        placeholder="Bio"
        multiline
        numberOfLines={4}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setEditedData({ ...userData });
            setIsEditing(false);
          }}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderViewMode = () => (
    <View style={styles.viewContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userData.savedProperties}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{userData.name}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{userData.phone}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{userData.location}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Bio</Text>
          <Text style={styles.infoValue}>{userData.bio}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setIsEditing(true)}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddPostModal = () => (
    <Modal
      visible={showAddPostModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowAddPostModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newPost.title}
            onChangeText={(text) => setNewPost({ ...newPost, title: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={newPost.description}
            onChangeText={(text) => setNewPost({ ...newPost, description: text })}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={newPost.price}
            onChangeText={(text) => setNewPost({ ...newPost, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={newPost.location}
            onChangeText={(text) => setNewPost({ ...newPost, location: text })}
          />
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handlePostImagePick}
          >
            <Text style={styles.imagePickerText}>
              {newPost.image ? 'Change Image' : 'Add Image'}
            </Text>
          </TouchableOpacity>
          {newPost.image && (
            <Image
              source={{ uri: newPost.image }}
              style={styles.postImagePreview}
              resizeMode="cover"
            />
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowAddPostModal(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleAddPost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Add Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderEditPostModal = () => (
    <Modal
      visible={!!editingPost}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setEditingPost(null)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Post</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={editingPost?.title}
            onChangeText={(text) => setEditingPost({ ...editingPost, title: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={editingPost?.description}
            onChangeText={(text) => setEditingPost({ ...editingPost, description: text })}
            multiline
            numberOfLines={4}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={editingPost?.price}
            onChangeText={(text) => setEditingPost({ ...editingPost, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={editingPost?.location}
            onChangeText={(text) => setEditingPost({ ...editingPost, location: text })}
          />
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={handlePostImagePick}
          >
            <Text style={styles.imagePickerText}>
              {editingPost?.image ? 'Change Image' : 'Add Image'}
            </Text>
          </TouchableOpacity>
          {editingPost?.image && (
            <Image
              source={{ uri: editingPost.image }}
              style={styles.postImagePreview}
              resizeMode="cover"
            />
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setEditingPost(null)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleEditPost}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderPosts = () => (
    <View style={styles.postsContainer}>
      <View style={styles.postsHeader}>
        <Text style={styles.postsTitle}>My Posts</Text>
        <TouchableOpacity
          style={styles.addPostButton}
          onPress={() => setShowAddPostModal(true)}
        >
          <Text style={styles.addPostButtonText}>Add New Post</Text>
        </TouchableOpacity>
      </View>
      {posts.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>No posts yet. Create your first post!</Text>
        </View>
      ) : (
        posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            {post.image && (
              <Image
                source={{ uri: post.image }}
                style={styles.postImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.postContent}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDescription}>{post.description}</Text>
              <View style={styles.postDetails}>
                <Text style={styles.postPrice}>${post.price}</Text>
                <Text style={styles.postLocation}>{post.location}</Text>
              </View>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString()}
              </Text>
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={[styles.postActionButton, styles.editButton]}
                  onPress={() => setEditingPost(post)}
                >
                  <Text style={styles.postActionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.postActionButton, styles.deleteButton]}
                  onPress={() => handleDeletePost(post.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.postActionButtonText}>Delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );

  // Render user's properties from Firestore
  const renderUserProperties = () => (
    <View style={styles.propertiesContainer}>
      <View style={styles.postsHeader}>
        <Text style={styles.postsTitle}>My Properties</Text>
      </View>

      {loadingProperties ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#29A132" />
          <Text style={styles.loadingText}>Loading your properties...</Text>
        </View>
      ) : userProperties.length === 0 ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>No properties found. Add a property from the Sell tab!</Text>
        </View>
      ) : (
        userProperties.map(property => (
          <View key={property.id} style={styles.propertyCard}>
            {property.image && (
              <Image
                source={{ uri: property.image }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.propertyContent}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <Text style={styles.propertyDescription} numberOfLines={2}>
                {property.description}
              </Text>
              <View style={styles.propertyDetails}>
                <Text style={styles.propertyPrice}>${property.price?.toLocaleString()}</Text>
                <Text style={styles.propertyLocation}>{property.location}</Text>
              </View>
              <View style={styles.propertyFeatures}>
                <Text style={styles.propertyFeature}>{property.type}</Text>
                <Text style={styles.propertyFeature}>{property.propertyType}</Text>
                <Text style={styles.propertyFeature}>{property.bedrooms} BR</Text>
                <Text style={styles.propertyFeature}>{property.area}</Text>
              </View>
              <View style={styles.propertyStatus}>
                <Text style={[
                  styles.statusText,
                  property.status === 'approved' ? styles.statusApproved :
                    property.status === 'pending' ? styles.statusPending :
                      styles.statusRejected
                ]}>
                  {property.status || 'pending'}
                </Text>
                {property.createdAt && (
                  <Text style={styles.propertyDate}>
                    Added: {new Date(property.createdAt.seconds * 1000).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick}>
          <View style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>
            )}
            <View style={styles.editImageButton}>
              <Text style={styles.editImageText}>Edit</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {isEditing ? renderEditMode() : renderViewMode()}
      {renderUserProperties()}
      {renderPosts()}
      {renderAddPostModal()}
      {renderEditPostModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#29A132',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#29A132',
    padding: 8,
    borderRadius: 20,
  },
  editImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  propertiesContainer: {
    padding: 20,
    marginBottom: 20,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propertyImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  propertyContent: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  propertyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#29A132',
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
  },
  propertyFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  propertyFeature: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  propertyStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  statusApproved: {
    backgroundColor: '#e6f7e6',
    color: '#29A132',
  },
  statusPending: {
    backgroundColor: '#fff4e5',
    color: '#f5a623',
  },
  statusRejected: {
    backgroundColor: '#ffe6e6',
    color: '#ff4444',
  },
  propertyDate: {
    fontSize: 12,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#29A132',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 10,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  editButton: {
    backgroundColor: '#29A132',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  editContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  saveButton: {
    backgroundColor: '#29A132',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewContainer: {
    flex: 1,
  },
  postsContainer: {
    padding: 20,
  },
  postsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addPostButton: {
    backgroundColor: '#29A132',
    padding: 10,
    borderRadius: 8,
  },
  addPostButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  noPostsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  noPostsText: {
    fontSize: 16,
    color: '#666',
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  postDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#29A132',
  },
  postLocation: {
    fontSize: 14,
    color: '#666',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  postActionButton: {
    padding: 8,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    opacity: 1,
  },
  postActionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#666',
    fontWeight: '500',
  },
  postImagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
});