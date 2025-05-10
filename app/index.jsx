import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllProperties, getFilteredProperties } from '../services/firestore';


if (!global.cartItems) {
  global.cartItems = [];
}

export default function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("any");
  const [selectedProperty, setSelectedProperty] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [numColumns, setNumColumns] = useState(getNumColumns());
  const [cartItems, setCartItems] = useState(global.cartItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function getNumColumns() {
    const screenWidth = Dimensions.get("window").width;
    if (screenWidth < 500) return 1;
    if (screenWidth < 900) return 2;
    return 3;
  }

  
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setNumColumns(getNumColumns());
    });
    return () => subscription?.remove();
  }, []);

  
  useEffect(() => {
    setCartItems(global.cartItems);
  }, [global.cartItems]);

  // Load properties from Firestore
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const propertiesData = await getAllProperties();
        setProperties(propertiesData);
        setFilteredProperties(propertiesData);
        setError(null);
      } catch (err) {
        console.error('Error loading properties:', err);
        setError('Failed to load properties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);


  const handleSearch = async () => {
    try {
      setLoading(true);

      // If there's a search query, filter client-side
      if (searchQuery) {
        const filtered = properties.filter((property) => {
          return property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location.toLowerCase().includes(searchQuery.toLowerCase());
        });
        setFilteredProperties(filtered);
      }
      // Otherwise, use Firestore filtering
      else {
        const filters = {
          type: selectedType !== 'any' ? selectedType : null,
          propertyType: selectedProperty !== 'any' ? selectedProperty : null,
          minPrice: minPrice ? parseInt(minPrice) : null,
          maxPrice: maxPrice ? parseInt(maxPrice) : null,
          bedrooms: bedrooms ? parseInt(bedrooms) : null
        };

        const filtered = await getFilteredProperties(filters);
        setFilteredProperties(filtered);
      }
    } catch (err) {
      console.error('Error filtering properties:', err);
      setError('Failed to filter properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when search criteria change
  useEffect(() => {
    if (properties.length > 0) {
      handleSearch();
    }
  }, [
    searchQuery,
    selectedType,
    selectedProperty,
    minPrice,
    maxPrice,
    bedrooms,
    properties.length
  ]);

  const renderProperty = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: "/property/[id]",
        params: { id: item.id }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>

        </View>
        <View style={styles.cardLocation}>
          <Ionicons name="location-sharp" size={16} color="#27ae60" />
          <Text style={styles.cardLocationText}>{item.location}</Text>
        </View>
        <Text style={styles.cardPrice}>${item.price.toLocaleString()}</Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardDetail}>
            <Ionicons name="bed" size={14} color="#7f8c8d" /> {item.bedrooms} {item.bedrooms === 1 ? 'Bed' : 'Beds'}
          </Text>
          <Text style={styles.cardDetail}>
            <Ionicons name="home" size={14} color="#7f8c8d" /> {item.propertyType}
          </Text>
          <Text style={styles.cardDetail}>
            <Ionicons name="cash" size={14} color="#7f8c8d" /> {item.type}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render loading indicator
  if (loading && properties.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.loadingText}>Loading properties...</Text>
      </View>
    );
  }

  // Render error message
  if (error && properties.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={50} color="#e74c3c" />
        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            getAllProperties()
              .then(data => {
                setProperties(data);
                setFilteredProperties(data);
                setLoading(false);
              })
              .catch(err => {
                setError('Failed to load properties. Please try again.');
                setLoading(false);
              });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 10, backgroundColor: '#3498db' }]}
          onPress={async () => {
            try {
              setError(null);
              setLoading(true);

              // Import the sample properties
              const { sampleProperties } = require('../data/sampleProperties');
              const { addProperty } = require('../services/firestore');

              // Add the first sample property
              const result = await addProperty(sampleProperties[0]);
              console.log('Added sample property with ID:', result.id);

              // Refresh the properties list
              const updatedProperties = await getAllProperties();
              setProperties(updatedProperties);
              setFilteredProperties(updatedProperties);
              setLoading(false);

              // Show success message
              Alert.alert('Success', 'Sample property added successfully!');
            } catch (err) {
              console.error('Error adding sample property:', err);
              setError('Failed to add sample property. Please try again.');
              setLoading(false);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Add Sample Property</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Property Listings</Text>
        <Text style={styles.tagline}>Find your dream property</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location or title"
            placeholderTextColor="#7f8c8d"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading && (
        <View style={styles.inlineLoadingContainer}>
          <ActivityIndicator size="small" color="#27ae60" />
          <Text style={styles.inlineLoadingText}>Updating results...</Text>
        </View>
      )}

      <View style={styles.filtersSection}>
        <Text style={styles.sectionTitle}>Filter Properties</Text>

        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedType}
                onValueChange={(value) => setSelectedType(value)}
                style={styles.picker}
              >
                <Picker.Item label="Any" value="any" />
                <Picker.Item label="Buy" value="buy" />
                <Picker.Item label="Rent" value="rent" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Property</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProperty}
                onValueChange={(value) => setSelectedProperty(value)}
                style={styles.picker}
              >
                <Picker.Item label="Any" value="any" />
                <Picker.Item label="Apartment" value="apartment" />
                <Picker.Item label="Villa" value="villa" />
                <Picker.Item label="House" value="house" />
                <Picker.Item label="Shop" value="shop" />
                <Picker.Item label="Office" value="office" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Min Price</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Any"
                placeholderTextColor="#7f8c8d"
                keyboardType="numeric"
                value={minPrice}
                onChangeText={setMinPrice}
              />
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Max Price</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Any"
                placeholderTextColor="#7f8c8d"
                keyboardType="numeric"
                value={maxPrice}
                onChangeText={setMaxPrice}
              />
            </View>
          </View>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Bedrooms</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Any"
              placeholderTextColor="#7f8c8d"
              keyboardType="numeric"
              value={bedrooms}
              onChangeText={setBedrooms}
            />
          </View>
        </View>
      </View>

      <View style={styles.listingsSection}>
        <Text style={styles.sectionTitle}>Available Properties</Text>
        <FlatList
          key={numColumns}
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={renderProperty}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          scrollEnabled={false}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Realestate. All rights reserved.</Text>
        <View style={styles.socialIcons}>
          <Ionicons
            name="logo-facebook"
            size={24}
            color="#27ae60"
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://facebook.com')}
          />
          <Ionicons
            name="logo-twitter"
            size={24}
            color="#27ae60"
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://twitter.com')}
          />
          <Ionicons
            name="logo-instagram"
            size={24}
            color="#27ae60"
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://instagram.com')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#27ae60',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inlineLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f9f4',
    borderRadius: 5,
    marginVertical: 10,
  },
  inlineLoadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#27ae60',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  filtersSection: {
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  listingsSection: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardImage: {
    width: '100',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cartBadge: {
    position: 'relative',
    backgroundColor: '#27ae60',
    borderRadius: 20,
    padding: 5,
  },
  badgeCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  cardLocationText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginVertical: 5,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  cardDetail: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  socialIcons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});
