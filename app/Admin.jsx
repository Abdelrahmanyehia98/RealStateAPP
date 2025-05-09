import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  FlatList,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = () => {
  // State management
  const [properties, setProperties] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('properties');
  
  // Default property template
  const defaultProperty = {
    id: '',
    title: '',
    location: '',
    price: 0,
    type: 'buy',
    propertyType: 'apartment',
    bedrooms: 0,
    bathrooms: 0,
    area: '',
    description: '',
    features: '',
    image: 'https://via.placeholder.com/300',
    images: []
  };

  const [formData, setFormData] = useState({...defaultProperty});

  // Load both properties and posts
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedProperties, storedPosts] = await Promise.all([
          AsyncStorage.getItem('properties'),
          AsyncStorage.getItem('posts')
        ]);

        if (storedProperties) {
          const parsed = JSON.parse(storedProperties);
          setProperties(Array.isArray(parsed) ? parsed : []);
        }

        if (storedPosts) {
          const parsed = JSON.parse(storedPosts);
          setPosts(Array.isArray(parsed) ? parsed : []);
        }
      } catch (err) {
        console.error('Load error:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save properties and posts
  const saveData = async (updatedProperties, updatedPosts) => {
    try {
      if (!Array.isArray(updatedProperties)) {
        throw new Error('Invalid data format');
      }
      await AsyncStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);

      if (updatedPosts) {
        await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
        setPosts(updatedPosts);
      }
      return true;
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save data');
      return false;
    }
  };

  // Property actions
  const handleAddProperty = () => {
    setFormData({
      ...defaultProperty,
      id: Date.now().toString()
    });
    setShowAddModal(true);
    setError(null);
  };

  const handleEditProperty = (property) => {
    if (!property) return;
    
    setCurrentProperty(property);
    setFormData({
      ...property,
      features: Array.isArray(property.features) ? 
        property.features.join(', ') : 
        String(property.features || '')
    });
    setShowEditModal(true);
  };

  const handleDeleteProperty = async (id) => {
    if (!id) return;

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updated = properties.filter(p => p?.id !== id);
              const success = await saveData(updated, null);
              if (!success) throw new Error('Delete failed');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete property');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Handle post deletion
  const handleDeletePost = async (id) => {
    if (!id) return;

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const updated = posts.filter(p => p?.id !== id);
              const success = await saveData(null, updated);
              if (!success) throw new Error('Delete failed');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete post');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Form submission with validation
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData?.title?.trim()) {
        throw new Error('Title is required');
      }
      if (!formData?.location?.trim()) {
        throw new Error('Location is required');
      }
      if (isNaN(formData.price) || formData.price < 0) {
        throw new Error('Please enter a valid price');
      }

      // Prepare data
      const propertyData = {
        ...formData,
        title: formData.title.trim(),
        location: formData.location.trim(),
        price: Math.max(0, Number(formData.price)),
        bedrooms: Math.max(0, Number(formData.bedrooms)),
        bathrooms: Math.max(0, Number(formData.bathrooms)),
        features: typeof formData.features === 'string' ? 
          formData.features.split(',').map(f => f.trim()).filter(f => f) : 
          [],
        images: Array.isArray(formData.images) ? 
          formData.images.filter(img => img) : 
          [formData.image].filter(Boolean)
      };

      // Save data
      let updatedProperties;
      if (showAddModal) {
        updatedProperties = [...properties, propertyData];
      } else {
        updatedProperties = properties.map(p => 
          p?.id === currentProperty?.id ? propertyData : p
        );
      }

      const success = await saveData(updatedProperties, null);
      if (success) {
        setShowAddModal(false);
        setShowEditModal(false);
      }
    } catch (err) {
      setError(err.message || 'Submission failed');
    }
  };

  // Property item component
  const PropertyItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.propertyItem}>
        <Image 
          source={{ uri: item.image || defaultProperty.image }} 
          style={styles.propertyImage}
          onError={() => console.log('Image load failed')}
        />
        <View style={styles.propertyContent}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title || 'Untitled Property'}
          </Text>
          
          <View style={styles.propertyMeta}>
            <Text style={styles.propertyLocation} numberOfLines={1}>
              <Ionicons name="location-sharp" size={14} color="#666" /> 
              {item.location || 'No location'}
            </Text>
            <Text style={styles.propertyPrice}>
              ${(item.price || 0).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.propertyDetails}>
            <DetailItem icon="king-bed" value={`${item.bedrooms || 0} Beds`} />
            <DetailItem icon="bathtub" value={`${item.bathrooms || 0} Baths`} />
            <DetailItem icon="aspect-ratio" value={item.area || 'N/A'} />
          </View>
          
          <View style={styles.propertyActions}>
            <ActionButton 
              icon="edit" 
              label="Edit" 
              color="#29A132"
              onPress={() => handleEditProperty(item)}
            />
            <ActionButton 
              icon="trash-2" 
              label="Delete" 
              color="#ff4444"
              onPress={() => handleDeleteProperty(item.id)}
            />
          </View>
        </View>
      </View>
    );
  };

  // Post item component
  const PostItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.propertyItem}>
        {item.image && (
          <Image 
            source={{ uri: item.image }} 
            style={styles.propertyImage}
            onError={() => console.log('Image load failed')}
          />
        )}
        <View style={styles.propertyContent}>
          <Text style={styles.propertyTitle} numberOfLines={1}>
            {item.title || 'Untitled Post'}
          </Text>
          
          <View style={styles.propertyMeta}>
            <Text style={styles.propertyLocation} numberOfLines={1}>
              <Ionicons name="location-sharp" size={14} color="#666" /> 
              {item.location || 'No location'}
            </Text>
            <Text style={styles.propertyPrice}>
              {item.price || 'No price'}
            </Text>
          </View>
          
          <Text style={styles.postDescription} numberOfLines={2}>
            {item.description || 'No description'}
          </Text>
          
          <Text style={styles.postDate}>
            Posted on: {item.date || 'Unknown date'}
          </Text>
          
          <View style={styles.propertyActions}>
            <ActionButton 
              icon="trash-2" 
              label="Delete" 
              color="#ff4444"
              onPress={() => handleDeletePost(item.id)}
            />
          </View>
        </View>
      </View>
    );
  };

  // Reusable components
  const DetailItem = ({ icon, value }) => (
    <View style={styles.detailItem}>
      <MaterialIcons name={icon} size={16} color="#29A132" />
      <Text style={styles.detailText}>{value}</Text>
    </View>
  );

  const ActionButton = ({ icon, label, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.actionButton, { backgroundColor: `${color}20` }]}
      onPress={onPress}
    >
      <Feather name={icon} size={18} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#29A132" />
      </View>
    );
  }

  // Error state
  if (error && properties.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => window.location.reload()}
        >
          <Text style={styles.buttonText}>Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage Properties and Posts</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
          onPress={() => setActiveTab('properties')}
        >
          <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
            Properties
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'properties' ? (
        <>
          {/* Stats Cards */}
          <View style={styles.cardRow}>
            <StatCard 
              value={properties.length} 
              label="Total Properties" 
              icon="home"
            />
            <StatCard 
              value={properties.filter(p => p?.type === 'buy').length} 
              label="For Sale" 
              icon="tag"
            />
            <StatCard 
              value={properties.filter(p => p?.type === 'rent').length} 
              label="For Rent" 
              icon="key"
            />
          </View>

          {/* Properties List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Properties</Text>
              <Text style={styles.sectionSubtitle}>
                {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              </Text>
            </View>

            {properties.length > 0 ? (
              <FlatList
                data={properties}
                renderItem={({ item }) => <PropertyItem item={item} />}
                keyExtractor={item => item?.id || Math.random().toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <EmptyState onAddProperty={handleAddProperty} />
            )}
          </View>
        </>
      ) : (
        <>
          {/* Posts Stats */}
          <View style={styles.cardRow}>
            <StatCard 
              value={posts.length} 
              label="Total Posts" 
              icon="file-text"
            />
          </View>

          {/* Posts List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Posts</Text>
              <Text style={styles.sectionSubtitle}>
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </Text>
            </View>

            {posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={({ item }) => <PostItem item={item} />}
                keyExtractor={item => item?.id || Math.random().toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="file-text" size={48} color="#bdc3c7" />
                <Text style={styles.emptyText}>No posts found</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Property Form Modal */}
      <PropertyFormModal
        visible={showAddModal || showEditModal}
        mode={showAddModal ? 'add' : 'edit'}
        formData={formData}
        setFormData={setFormData}
        error={error}
        onSubmit={handleSubmit}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setError(null);
        }}
      />
    </ScrollView>
  );
};

// Additional Components
const StatCard = ({ value, label, icon }) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>
      <Feather name={icon} size={20} color="#29A132" />
    </View>
    <Text style={styles.statValue}>{value || 0}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ActionButtonLarge = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.largeActionButton} onPress={onPress}>
    <Feather name={icon} size={24} color="#29A132" />
    <Text style={styles.largeActionText}>{label}</Text>
  </TouchableOpacity>
);

const EmptyState = ({ onAddProperty }) => (
  <View style={styles.emptyState}>
    <Feather name="home" size={48} color="#bdc3c7" />
    <Text style={styles.emptyText}>No properties found</Text>
    <TouchableOpacity style={styles.primaryButton} onPress={onAddProperty}>
      <Text style={styles.buttonText}>Add Property</Text>
    </TouchableOpacity>
  </View>
);

const PropertyFormModal = ({ visible, mode, formData, setFormData, error, onSubmit, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {mode === 'add' ? 'Add New Property' : 'Edit Property'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {error && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          )}

          <FormField
            label="Title*"
            value={formData.title}
            onChangeText={text => setFormData({...formData, title: text})}
            placeholder="Property title"
          />

          <FormField
            label="Location*"
            value={formData.location}
            onChangeText={text => setFormData({...formData, location: text})}
            placeholder="Property location"
          />

          <FormField
            label="Price*"
            value={String(formData.price)}
            onChangeText={text => setFormData({...formData, price: text.replace(/[^0-9]/g, '')})}
            placeholder="0"
            keyboardType="numeric"
          />

          <View style={styles.formRow}>
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.toggleGroup}>
                <ToggleButton
                  label="Buy"
                  active={formData.type === 'buy'}
                  onPress={() => setFormData({...formData, type: 'buy'})}
                />
                <ToggleButton
                  label="Rent"
                  active={formData.type === 'rent'}
                  onPress={() => setFormData({...formData, type: 'rent'})}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Property Type</Text>
              <View style={styles.toggleGroup}>
                <ToggleButton
                  label="Apartment"
                  active={formData.propertyType === 'apartment'}
                  onPress={() => setFormData({...formData, propertyType: 'apartment'})}
                />
                <ToggleButton
                  label="Villa"
                  active={formData.propertyType === 'villa'}
                  onPress={() => setFormData({...formData, propertyType: 'villa'})}
                />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <FormField
              label="Bedrooms"
              value={String(formData.bedrooms)}
              onChangeText={text => setFormData({...formData, bedrooms: text.replace(/[^0-9]/g, '')})}
              placeholder="0"
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
            <FormField
              label="Bathrooms"
              value={String(formData.bathrooms)}
              onChangeText={text => setFormData({...formData, bathrooms: text.replace(/[^0-9]/g, '')})}
              placeholder="0"
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
            />
            <FormField
              label="Area"
              value={formData.area}
              onChangeText={text => setFormData({...formData, area: text})}
              placeholder="Sq ft"
              containerStyle={{ flex: 1 }}
            />
          </View>

          <FormField
            label="Main Image URL"
            value={formData.image}
            onChangeText={text => setFormData({...formData, image: text})}
            placeholder="https://example.com/image.jpg"
          />

          <FormField
            label="Additional Images (comma separated)"
            value={formData.images.join(', ')}
            onChangeText={text => setFormData({...formData, images: text.split(',').map(url => url.trim())})}
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            multiline
          />

          <FormField
            label="Description"
            value={formData.description}
            onChangeText={text => setFormData({...formData, description: text})}
            placeholder="Property description"
            multiline
            numberOfLines={4}
          />

          <FormField
            label="Features (comma separated)"
            value={formData.features}
            onChangeText={text => setFormData({...formData, features: text})}
            placeholder="Swimming pool, Garden, Parking"
            multiline
          />

          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>
              {mode === 'add' ? 'Add Property' : 'Update Property'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const FormField = ({ label, value, onChangeText, placeholder, multiline, numberOfLines, keyboardType, containerStyle }) => (
  <View style={[styles.inputContainer, containerStyle]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.textArea]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      multiline={multiline}
      numberOfLines={numberOfLines || 1}
      keyboardType={keyboardType}
    />
  </View>
);

const ToggleButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.toggleButton, active && styles.toggleButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.toggleButtonText, active && styles.toggleButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  statIcon: {
    backgroundColor: '#e8f5e9',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#29A132',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largeActionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#29A132',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  largeActionText: {
    color: '#29A132',
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 8,
  },
  propertyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
  },
  propertyImage: {
    width: '100%',
    height: 180,
  },
  propertyContent: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  propertyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#29A132',
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  propertyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#29A132',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  modalContent: {
    padding: 16,
  },
  errorBanner: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    color: '#ff4444',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  formGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  toggleGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  toggleButtonActive: {
    backgroundColor: '#29A132',
  },
  toggleButtonText: {
    color: '#666',
  },
  toggleButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#29A132',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#29A132',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  postDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
});

export default AdminDashboard;
