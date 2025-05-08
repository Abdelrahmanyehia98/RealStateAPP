import React, { useState, useEffect } from "react";
import {View,Text,TextInput,ScrollView,FlatList,Image,StyleSheet,TouchableOpacity,Dimensions,} from "react-native";
import { Picker } from "@react-native-picker/picker";
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

    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.price}>${item.price.toLocaleString()}</Text>
    </View>
    </TouchableOpacity>

  );

  return (
    <ScrollView style={styles.container}>
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

      <View style={styles.width100}>
        <View style={styles.width50}>
          <Text>Type</Text>
          <View style={styles.input}>
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

        <View style={styles.width50}>
          <Text>Property</Text>
          <View style={styles.input}>
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

      <FlatList
        key={numColumns} // ← important fix
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={renderProperty}
        numColumns={numColumns}
        contentContainerStyle={styles.list}
        scrollEnabled={false}
      />
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  picker: {
    height: 20,
    width: "100%",
  },
  width100: {
    width: "100%",
    flexDirection: "row",
  },
  width50: {
    width: "50%",
  },
  searchSection: {
    flexDirection: "row",
    marginBottom: 16,
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
    fontWeight: "bold",
  },
  filters: {
    marginBottom: 20,
  },
  filter: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterHalf: {
    width: "50%",
  },
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    margin: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "black",
  },
  image: {
    width: "100%",
    height: 120,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  location: {
    color: "#777",
    paddingHorizontal: 8,
  },
  price: {
    color: "#28a745",
    fontWeight: "bold",
    padding: 8,
  },
  list: {
    paddingBottom: 100,
  },
});
