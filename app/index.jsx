import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Dimensions,
  Linking
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const properties = [
  {
    id: "1",
    title: "Luxury Villa",
    location: "Maadi",
    price: 2000000,
    type: "buy",
    propertyType: "villa",
    bedrooms: 4,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
  },
  {
    id: "2",
    title: "Downtown Apartment",
    location: "Zamalek",
    price: 850000,
    type: "buy",
    propertyType: "apartment",
    bedrooms: 2,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  },
  {
    id: "3",
    title: "Beach House",
    location: "Haram",
    price: 1500000,
    type: "buy",
    propertyType: "house",
    bedrooms: 3,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
  },
  {
    id: "4",
    title: "Office Space",
    location: "Downtown",
    price: 1200000,
    type: "rent",
    propertyType: "office",
    bedrooms: 0,
    image: "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3a",
  },
  {
    id: "5",
    title: "Retail Shop",
    location: "Mohandesen",
    price: 950000,
    type: "rent",
    propertyType: "shop",
    bedrooms: 0,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
  },
  {
    id: "6",
    title: "Retail Shop",
    location: "Mohandesen",
    price: 950000,
    type: "rent",
    propertyType: "shop",
    bedrooms: 0,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
  },
];

export default function App() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("any");
  const [selectedProperty, setSelectedProperty] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [numColumns, setNumColumns] = useState(getNumColumns());

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

  const handleSearch = () => {
    const filtered = properties.filter((property) => {
      const matchesSearch =
        !searchQuery ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "any" || property.type === selectedType;
      const matchesProperty =
        selectedProperty === "any" ||
        property.propertyType === selectedProperty;
      const matchesMinPrice =
        minPrice === "" || property.price >= parseInt(minPrice);
      const matchesMaxPrice =
        maxPrice === "" || property.price <= parseInt(maxPrice);
      const matchesBedrooms =
        bedrooms === "" || property.bedrooms == parseInt(bedrooms);

      return (
        matchesSearch &&
        matchesType &&
        matchesProperty &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms
      );
    });

    setFilteredProperties(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [
    searchQuery,
    selectedType,
    selectedProperty,
    minPrice,
    maxPrice,
    bedrooms,
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
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardLocation}>
          <Ionicons name="location-sharp" size={16} color="#29A132" />
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
            color="#29A132" 
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://facebook.com')}
          />
          <Ionicons 
            name="logo-twitter" 
            size={24} 
            color="#29A132" 
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://twitter.com')}
          />
          <Ionicons 
            name="logo-instagram" 
            size={24} 
            color="#29A132" 
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
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
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
  searchSection: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#34495e',
  },
  filtersSection: {
    marginBottom: 25,
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
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  filterGroup: {
    flex: 1,
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    fontWeight: '500',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#34495e',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#34495e',
  },
  listingsSection: {
    marginBottom: 30,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLocationText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#29A132',
    marginBottom: 10,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  cardDetail: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 15,
    marginBottom: 5,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});