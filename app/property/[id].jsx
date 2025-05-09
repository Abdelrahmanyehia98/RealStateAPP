import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Share,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const properties = [
  {
    id: "1",
    title: "Luxury Villa",
    location: "Maadi, Cairo",
    price: 2000000,
    type: "buy",
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: "350 sqm",
    description: "Beautiful luxury villa with modern amenities, spacious rooms, and a private garden. Located in a prime area with easy access to all facilities.",
    features: ["Swimming Pool", "Garden", "Security", "Parking", "Central AC"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
  },
  {
    id: "2",
    title: "Downtown Apartment",
    location: "Zamalek, Cairo",
    price: 850000,
    type: "buy",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: "120 sqm",
    description: "Modern apartment in the heart of downtown with stunning city views. Recently renovated with high-end finishes.",
    features: ["Balcony", "Elevator", "Security", "Parking", "Furnished"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6a55c1",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6a55c2",
    ],
  },
  {
    id: "3",
    title: "Beach House",
    location: "North Coast",
    price: 1500000,
    type: "buy",
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    area: "250 sqm",
    description: "Stunning beach house with direct access to the beach. Perfect for vacation rentals or permanent living.",
    features: ["Beach Access", "Terrace", "Security", "Parking", "Furnished"],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb512",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb513",
    ],
  },
  {
    id: "4",
    title: "Modern Office Space",
    location: "Downtown, Cairo",
    price: 1200000,
    type: "rent",
    propertyType: "office",
    bedrooms: 0,
    bathrooms: 2,
    area: "200 sqm",
    description: "Professional office space in prime business location. Includes reception area, meeting rooms, and high-speed internet.",
    features: ["Meeting Rooms", "Reception", "Security", "Parking", "High-Speed Internet"],
    image: "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3a",
    images: [
      "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3a",
      "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3b",
      "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3c",
    ],
  },
  {
    id: "5",
    title: "Retail Shop",
    location: "Mohandeseen, Cairo",
    price: 950000,
    type: "rent",
    propertyType: "shop",
    bedrooms: 0,
    bathrooms: 1,
    area: "80 sqm",
    description: "Prime retail space in high-traffic commercial area. Great visibility and foot traffic for any retail business.",
    features: ["High Visibility", "Storage Room", "Security", "Parking"],
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    images: [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095",
      "https://images.unsplash.com/photo-1573164713988-8665fc963096",
      "https://images.unsplash.com/photo-1573164713988-8665fc963097",
    ],
  },
  {
    id: "6",
    title: "Penthouse with View",
    location: "New Cairo",
    price: 3500000,
    type: "buy",
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: "280 sqm",
    description: "Luxurious penthouse with panoramic city views. Top-floor unit with private elevator and premium finishes.",
    features: ["Panoramic View", "Private Elevator", "Smart Home", "Gym Access", "Pool"],
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b915",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b916",
    ],
  },
  {
    id: "7",
    title: "Family Compound",
    location: "6th of October",
    price: 5000000,
    type: "buy",
    propertyType: "compound",
    bedrooms: 5,
    bathrooms: 4,
    area: "600 sqm",
    description: "Spacious family compound with multiple buildings, garden, and private pool. Perfect for extended families.",
    features: ["Private Pool", "Garden", "Security", "Parking", "Maid's Room"],
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd7",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd8",
    ],
  },
  {
    id: "8",
    title: "Studio Apartment",
    location: "Nasr City",
    price: 600000,
    type: "buy",
    propertyType: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    area: "60 sqm",
    description: "Cozy studio apartment in central location. Recently renovated with modern kitchen and bathroom.",
    features: ["Furnished", "Elevator", "Security", "Parking"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93689",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93690",
    ],
  }
];

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const property = properties.find(p => p.id === id);
  const similarProperties = properties.filter(p =>
    p.id !== id &&
    (p.propertyType === property?.propertyType || p.type === property?.type)
  ).slice(0, 3);

  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Property not found</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${property.propertyType} in ${property.location} for ${property.type === 'buy' ? 'sale' : 'rent'}!`,
        url: property.image
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share property');
    }
  };

  const handleContactSubmit = () => {
    Alert.alert('Success', 'Your message has been sent to the agent');
    setShowContactModal(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const renderImageIndicator = () => (
    <View style={styles.imageIndicatorContainer}>
      {property.images.map((_, index) => (
        <View
          key={index}
          style={[
            styles.imageIndicator,
            index === activeImageIndex && styles.activeImageIndicator
          ]}
        />
      ))}
    </View>
  );

  const renderSimilarProperty = ({ item }) => (
    <TouchableOpacity
      style={styles.similarPropertyCard}
      onPress={() => router.push(`/property/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.similarPropertyImage} />
      <View style={styles.similarPropertyContent}>
        <Text style={styles.similarPropertyTitle}>{item.title}</Text>
        <Text style={styles.similarPropertyLocation}>
          <Ionicons name="location-sharp" size={14} color="#666" /> {item.location}
        </Text>
        <Text style={styles.similarPropertyPrice}>${item.price.toLocaleString()}</Text>
        <View style={styles.similarPropertyDetails}>
          <Text style={styles.similarPropertyDetail}>
            <MaterialIcons name="king-bed" size={14} color="#666" /> {item.bedrooms}
          </Text>
          <Text style={styles.similarPropertyDetail}>
            <MaterialIcons name="bathtub" size={14} color="#666" /> {item.bathrooms}
          </Text>
          <Text style={styles.similarPropertyDetail}>
            <MaterialIcons name="aspect-ratio" size={14} color="#666" /> {item.area}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleAddToCart = () => {
    if (!global.cartItems) {
      global.cartItems = [];
    }
    if (!global.cartItems.some((cartItem) => cartItem.id === property.id)) {
      global.cartItems = [...global.cartItems, property];
      Alert.alert('Success', `${property.title} added to cart!`);
      console.log(`Added ${property.title} to cart!`, global.cartItems);
    } else {
      Alert.alert('Info', `${property.title} is already in cart!`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#ff4444" : "#fff"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageGallery}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
            setActiveImageIndex(index);
          }}
        >
          {property.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.mainImage}
            />
          ))}
        </ScrollView>
        {renderImageIndicator()}

        {/* Property Info */}
        <View style={styles.infoContainer}>
          <View style={styles.propertyHeader}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.propertyTypeBadge}>
              {property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1)}
            </Text>
          </View>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color="#666" />
            <Text style={styles.location}>{property.location}</Text>
          </View>
          
          <Text style={styles.price}>${property.price.toLocaleString()}</Text>
          <Text style={styles.priceNote}>
            {property.type === 'rent' ? 'per month' : 'total price'}
          </Text>

          {/* Key Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MaterialIcons name="king-bed" size={20} color="#29A132" />
              <Text style={styles.detailText}>{property.bedrooms} Beds</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="bathtub" size={20} color="#29A132" />
              <Text style={styles.detailText}>{property.bathrooms} Baths</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialIcons name="aspect-ratio" size={20} color="#29A132" />
              <Text style={styles.detailText}>{property.area}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{property.description}</Text>
          </View>

          {/* Features */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {property.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#29A132" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Add to Cart Button */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Properties</Text>
              <FlatList
                data={similarProperties}
                renderItem={renderSimilarProperty}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarPropertiesList}
              />
            </View>
          )}
        </View>
        
      </ScrollView>

      {/* Contact Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={() => setShowContactModal(true)}
      >
        <Text style={styles.contactButtonText}>Contact Agent</Text>
      </TouchableOpacity>

      {/* Contact Modal */}
      <Modal
        visible={showContactModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Agent</Text>
              <TouchableOpacity onPress={() => setShowContactModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              placeholderTextColor="#999"
              value={contactForm.name}
              onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={contactForm.email}
              onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={contactForm.phone}
              onChangeText={(text) => setContactForm({ ...contactForm, phone: text })}
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={contactForm.message}
              onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleContactSubmit}
            >
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
            
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  imageGallery: {
    height: 300,
  },
  mainImage: {
    width: screenWidth,
    height: 300,
    resizeMode: 'cover',
  },
  imageIndicatorContainer: {
    position: 'absolute',
    top: 280,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeImageIndicator: {
    backgroundColor: '#fff',
    width: 12,
  },
  infoContainer: {
    padding: 20,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  propertyTypeBadge: {
    backgroundColor: '#e8f5e9',
    color: '#29A132',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#29A132',
  },
  priceNote: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#29A132',
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  similarPropertiesList: {
    paddingBottom: 10,
  },
  similarPropertyCard: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  similarPropertyImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  similarPropertyContent: {
    padding: 15,
  },
  similarPropertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  similarPropertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  similarPropertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#29A132',
    marginBottom: 5,
  },
  similarPropertyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  similarPropertyDetail: {
    fontSize: 12,
    color: '#666',
  },
  contactButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#29A132',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#29A132',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#29A132',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginVertical: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
