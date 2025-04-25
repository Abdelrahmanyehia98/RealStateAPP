import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

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
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("any");
  const [selectedProperty, setSelectedProperty] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleSearch = () => {
    const filtered = properties.filter((property) => {
      const matchesSearch =
        !searchQuery ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "any" || property.type === selectedType;
      const matchesProperty = selectedProperty === "any" || property.propertyType === selectedProperty;
      const matchesMinPrice = minPrice === "" || property.price >= parseInt(minPrice);
      const matchesMaxPrice = maxPrice === "" || property.price <= parseInt(maxPrice);
      const matchesBedrooms = bedrooms === "" || property.bedrooms == parseInt(bedrooms);

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
  }, [searchQuery, selectedType, selectedProperty, minPrice, maxPrice, bedrooms]);

  const renderProperty = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.price}>${item.price.toLocaleString()}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Search by location or title"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Row (Type + Property) */}
      <View style={styles.filterRow}>
        <View style={styles.filterHalf}>
          <Text>Type</Text>
          <Picker selectedValue={selectedType} onValueChange={(value) => setSelectedType(value)}>
            <Picker.Item label="Any" value="any" />
            <Picker.Item label="Buy" value="buy" />
            <Picker.Item label="Rent" value="rent" />
          </Picker>
        </View>

        <View style={styles.filterHalf}>
          <Text>Property</Text>
          <Picker selectedValue={selectedProperty} onValueChange={(value) => setSelectedProperty(value)}>
            <Picker.Item label="Any" value="any" />
            <Picker.Item label="Apartment" value="apartment" />
            <Picker.Item label="Villa" value="villa" />
            <Picker.Item label="House" value="house" />
            <Picker.Item label="Shop" value="shop" />
            <Picker.Item label="Office" value="office" />
          </Picker>
        </View>
      </View>

      {/* Filters (Price & Bedrooms) */}
      <View style={styles.filterRow}>
        <View style={styles.filterHalf}>
          <Text>Min Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Any"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
        </View>

        <View style={styles.filterHalf}>
          <Text>Max Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Any"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
      </View>

      <View style={styles.filter}>
        <Text>Bedrooms</Text>
        <TextInput
          style={styles.input}
          placeholder="Any"
          keyboardType="numeric"
          value={bedrooms}
          onChangeText={setBedrooms}
        />
      </View>

      {/* Property Grid */}
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={renderProperty}
        numColumns={2}
        contentContainerStyle={styles.list}
        scrollEnabled={false} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  searchSection: {
    flexDirection: "row", 
    marginBottom: 16 
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  searchButtonText: { 
    color: "#fff", 
    fontWeight: "bold"
  },

  filters: { 
    marginBottom: 20 
  },
  filter: { 
    marginBottom: 12 
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterHalf: { 
    width: "48%" 
  },

  card: {
    width: cardWidth,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 16,
    marginRight: 16,
    overflow: "hidden",
    borderWidth: 2,       
    borderColor: 'black',
  },
  image: { 
    width: "100%", 
    height: 120 
  },
  title: { 
    fontWeight: "bold", 
    fontSize: 16, 
    marginTop: 8, 
    paddingHorizontal: 8 
  },
  location: { 
    color: "#777", 
    paddingHorizontal: 8 
  },
  price: { 
    color: "#28a745", 
    fontWeight: "bold", 
    padding: 8 
  },

  list: { 
    paddingBottom: 100 
  },
});
