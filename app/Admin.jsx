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
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = () => {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    location: '',
    price: '',
    type: 'buy',
    propertyType: 'apartment',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    features: '',
    image: '',
    images: []
  });

  // Load properties from storage
  useEffect(() => {
    const loadProperties = async () => {
      try {
        const storedProperties = await AsyncStorage.getItem('properties');
        if (storedProperties) {
          setProperties(JSON.parse(storedProperties));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading properties:', error);
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const saveProperties = async (updatedProperties) => {
    try {
      await AsyncStorage.setItem('properties', JSON.stringify(updatedProperties));
      setProperties(updatedProperties);
    } catch (error) {
      console.error('Error saving properties:', error);
    }
  };

  const handleAddProperty = () => {
    setFormData({
      id: Date.now().toString(),
      title: '',
      location: '',
      price: '',
      type: 'buy',
      propertyType: 'apartment',
      bedrooms: '',
      bathrooms: '',
      area: '',
      description: '',
      features: '',
      image: '',
      images: []
    });
    setShowAddModal(true);
  };

  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setFormData({
      ...property,
      features: property.features.join(', ')
    });
    setShowEditModal(true);
  };

  const handleDeleteProperty = async (id) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedProperties = properties.filter(p => p.id !== id);
            await saveProperties(updatedProperties);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const propertyData = {
      ...formData,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      images: formData.images.length > 0 ? formData.images : [formData.image]
    };

    let updatedProperties;
    if (showAddModal) {
      updatedProperties = [...properties, propertyData];
    } else {
      updatedProperties = properties.map(p => 
        p.id === currentProperty.id ? propertyData : p
      );
    }

    await saveProperties(updatedProperties);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  const renderPropertyItem = ({ item }) => (
    <View style={styles.propertyItem}>
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
      <View style={styles.propertyContent}>
        <Text style={styles.propertyTitle}>{item.title}</Text>
        <View style={styles.propertyMeta}>
          <Text style={styles.propertyLocation}>
            <Ionicons name="location-sharp" size={14} color="#666" /> {item.location}
          </Text>
          <Text style={styles.propertyPrice}>${item.price.toLocaleString()}</Text>
        </View>
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <MaterialIcons name="king-bed" size={16} color="#29A132" />
            <Text style={styles.detailText}>{item.bedrooms} Beds</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="bathtub" size={16} color="#29A132" />
            <Text style={styles.detailText}>{item.bathrooms} Baths</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialIcons name="aspect-ratio" size={16} color="#29A132" />
            <Text style={styles.detailText}>{item.area}</Text>
          </View>
        </View>
        <View style={styles.propertyActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditProperty(item)}
          >
            <Feather name="edit" size={18} color="#29A132" />
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteProperty(item.id)}
          >
            <Feather name="trash-2" size={18} color="#ff4444" />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#29A132" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>Admin Dashboard</Text>
          <Text style={styles.tagline}>Manage Properties</Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Overview</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{properties.length}</Text>
            <Text style={styles.statLabel}>Total Properties</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {properties.filter(p => p.type === 'buy').length}
            </Text>
            <Text style={styles.statLabel}>For Sale</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {properties.filter(p => p.type === 'rent').length}
            </Text>
            <Text style={styles.statLabel}>For Rent</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.featureItem}>
          <Feather name="plus" size={24} color="#29A132" style={styles.featureIcon} />
          <View style={styles.featureText}>
            <TouchableOpacity onPress={handleAddProperty}>
              <Text style={styles.featureTitle}>Add New Property</Text>
              <Text style={styles.featureDesc}>Create a new property listing</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="mail" size={24} color="#29A132" style={styles.featureIcon} />
          <View style={styles.featureText}>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@realestate.com')}>
              <Text style={styles.featureTitle}>Contact Support</Text>
              <Text style={styles.featureDesc}>Get help from our support team</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Properties List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Properties</Text>
        <Text style={styles.sectionSubtitle}>Showing {properties.length} properties</Text>
        
        {properties.length > 0 ? (
          <FlatList
            data={properties}
            renderItem={renderPropertyItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.propertyList}
          />
        ) : (
          <View style={styles.emptyState}>
            <Feather name="home" size={48} color="#bdc3c7" />
            <Text style={styles.emptyText}>No properties found</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddProperty}
            >
              <Text style={styles.addButtonText}>Add Your First Property</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add/Edit Property Modal */}
      <Modal
        visible={showAddModal || showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showAddModal ? 'Add New Property' : 'Edit Property'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <Text style={styles.inputLabel}>Title*</Text>
              <TextInput
                style={styles.input}
                placeholder="Beautiful Villa in Maadi"
                placeholderTextColor="#999"
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
              />

              <Text style={styles.inputLabel}>Location*</Text>
              <TextInput
                style={styles.input}
                placeholder="Maadi, Cairo"
                placeholderTextColor="#999"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />

              <Text style={styles.inputLabel}>Price*</Text>
              <TextInput
                style={styles.input}
                placeholder="2000000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={formData.price.toString()}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
              />
              
              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Type</Text>
                  <View style={styles.select}>
                    <TouchableOpacity
                      style={[
                        styles.selectOption,
                        formData.type === 'buy' && styles.selectedOption
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'buy' })}
                    >
                      <Text style={formData.type === 'buy' ? styles.selectedOptionText : styles.optionText}>
                        Buy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.selectOption,
                        formData.type === 'rent' && styles.selectedOption
                      ]}
                      onPress={() => setFormData({ ...formData, type: 'rent' })}
                    >
                      <Text style={formData.type === 'rent' ? styles.selectedOptionText : styles.optionText}>
                        Rent
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Property Type</Text>
                  <View style={styles.select}>
                    <TouchableOpacity
                      style={[
                        styles.selectOption,
                        formData.propertyType === 'apartment' && styles.selectedOption
                      ]}
                      onPress={() => setFormData({ ...formData, propertyType: 'apartment' })}
                    >
                      <Text style={formData.propertyType === 'apartment' ? styles.selectedOptionText : styles.optionText}>
                        Apartment
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.selectOption,
                        formData.propertyType === 'villa' && styles.selectedOption
                      ]}
                      onPress={() => setFormData({ ...formData, propertyType: 'villa' })}
                    >
                      <Text style={formData.propertyType === 'villa' ? styles.selectedOptionText : styles.optionText}>
                        Villa
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bedrooms</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="3"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={formData.bedrooms.toString()}
                    onChangeText={(text) => setFormData({ ...formData, bedrooms: text })}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Bathrooms</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="2"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={formData.bathrooms.toString()}
                    onChangeText={(text) => setFormData({ ...formData, bathrooms: text })}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Area</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="120 sqm"
                    placeholderTextColor="#999"
                    value={formData.area}
                    onChangeText={(text) => setFormData({ ...formData, area: text })}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Main Image URL</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#999"
                value={formData.image}
                onChangeText={(text) => setFormData({ ...formData, image: text })}
              />

              <Text style={styles.inputLabel}>Additional Image URLs (comma separated)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                placeholderTextColor="#999"
                value={formData.images.join(', ')}
                onChangeText={(text) => setFormData({ ...formData, images: text.split(',').map(url => url.trim()) })}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the property..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />

              <Text style={styles.inputLabel}>Features (comma separated)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Swimming Pool, Garden, Parking"
                placeholderTextColor="#999"
                multiline
                numberOfLines={2}
                value={formData.features}
                onChangeText={(text) => setFormData({ ...formData, features: text })}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {showAddModal ? 'Add Property' : 'Update Property'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tagline: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#29A132',
    paddingBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    elevation: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#29A132',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  featureIcon: {
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  propertyList: {
    paddingBottom: 10,
  },
  propertyItem: {
    flexDirection: 'column',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  propertyContent: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  propertyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#29A132',
  },
  propertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  propertyActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#29A132',
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#ff4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 15,
    marginBottom: 25,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#29A132',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 5,
  },
  modalScroll: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  select: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectOption: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  selectedOption: {
    backgroundColor: '#29A132',
  },
  optionText: {
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#29A132',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminDashboard;