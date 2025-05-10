import React, { useState, useRef } from "react";
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
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";

// Sample static comments data

const screenWidth = Dimensions.get("window").width;

const properties = [
  {
    id: "ebLjzceVIxULhaFIQ8Pl",
    title: "Luxury Villa",
    location: "Maadi, Cairo",
    price: 2000000,
    type: "buy",
    propertyType: "villa",
    bedrooms: 4,
    bathrooms: 3,
    area: "350 sqm",
    description:
      "Beautiful luxury villa with modern amenities, spacious rooms, and a private garden. Located in a prime area with easy access to all facilities.",
    features: ["Swimming Pool", "Garden", "Security", "Parking", "Central AC"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Modern apartment in the heart of downtown with stunning city views. Recently renovated with high-end finishes.",
    features: ["Balcony", "Elevator", "Security", "Parking", "Furnished"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6a55c1",
      "https://images.unsplash.com/photo-1560448205-4d9b3e6a55c2",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Stunning beach house with direct access to the beach. Perfect for vacation rentals or permanent living.",
    features: ["Beach Access", "Terrace", "Security", "Parking", "Furnished"],
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4",
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "hello,This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Professional office space in prime business location. Includes reception area, meeting rooms, and high-speed internet.",
    features: [
      "Meeting Rooms",
      "Reception",
      "Security",
      "Parking",
      "High-Speed Internet",
    ],
    image: "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3a",
    images: [
      "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3a",
      "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3b",
      "https://images.unsplash.com/photo-1556742400-b5de4e9d3f3c",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Prime retail space in high-traffic commercial area. Great visibility and foot traffic for any retail business.",
    features: ["High Visibility", "Storage Room", "Security", "Parking"],
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    images: [
      "https://images.unsplash.com/photo-1573164713988-8665fc963095",
      "https://images.unsplash.com/photo-1573164713988-8665fc963096",
      "https://images.unsplash.com/photo-1573164713988-8665fc963097",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Luxurious penthouse with panoramic city views. Top-floor unit with private elevator and premium finishes.",
    features: [
      "Panoramic View",
      "Private Elevator",
      "Smart Home",
      "Gym Access",
      "Pool",
    ],
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b915",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b916",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Spacious family compound with multiple buildings, garden, and private pool. Perfect for extended families.",
    features: ["Private Pool", "Garden", "Security", "Parking", "Maid's Room"],
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd7",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd8",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
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
    description:
      "Cozy studio apartment in central location. Recently renovated with modern kitchen and bathroom.",
    features: ["Furnished", "Elevator", "Security", "Parking"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93689",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93690",
    ],
    comments: [
      {
        id: 1,
        user: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        comment:
          "This property looks amazing! The location is perfect and the price seems reasonable for the area.",
        date: "2024-03-15",
        rating: 5,
      },
      {
        id: 2,
        user: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        comment:
          "I've been looking at similar properties in this area, and this one stands out. The features are exactly what I'm looking for.",
        date: "2024-03-14",
        rating: 4,
      },
      {
        id: 3,
        user: "Mike Johnson",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        comment:
          "Great property! Would love to schedule a viewing. The photos don't do it justice.",
        date: "2024-03-13",
        rating: 5,
      },
    ],
  },
];

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const scrollViewRef = useRef(null);

  const property = properties.find((p) => p.id === id);
  const similarProperties = properties
    .filter(
      (p) =>
        p.id !== id &&
        (p.propertyType === property?.propertyType || p.type === property?.type)
    )
    .slice(0, 3);

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
        message: `Check out this ${property.propertyType} in ${
          property.location
        } for ${property.type === "buy" ? "sale" : "rent"}!`,
        url: property.image,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share property");
    }
  };

  const handleContactSubmit = () => {
    Alert.alert("Success", "Your message has been sent to the agent");
    setShowContactModal(false);
    setContactForm({ name: "", email: "", phone: "", message: "" });
  };

  const handleAddToCart = () => {
    if (!global.cartItems) {
      global.cartItems = [];
    }
    if (!global.cartItems.some((cartItem) => cartItem.id === property.id)) {
      global.cartItems = [...global.cartItems, property];
      Alert.alert("Success", `${property.title} added to cart!`);
      console.log(`Added ${property.title} to cart!`, global.cartItems);
    } else {
      Alert.alert("Info", `${property.title} is already in cart!`);
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
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        {/* Image Gallery */}
        <View style={styles.imageGalleryContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageGallery}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / screenWidth
              );
              setActiveImageIndex(index);
            }}
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / screenWidth
              );
              if (index !== activeImageIndex) {
                setActiveImageIndex(index);
              }
            }}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {property.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => {
                  // Optional: Add zoom functionality here if needed
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Navigation Buttons */}
          <TouchableOpacity 
            style={[styles.navButton, styles.prevButton]}
            onPress={() => {
              if (activeImageIndex > 0) {
                const newIndex = activeImageIndex - 1;
                setActiveImageIndex(newIndex);
                scrollViewRef.current?.scrollTo({
                  x: newIndex * screenWidth,
                  animated: true
                });
              }
            }}
            disabled={activeImageIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={30} 
              color={activeImageIndex === 0 ? "#ccc" : "#fff"} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navButton, styles.nextButton]}
            onPress={() => {
              if (activeImageIndex < property.images.length - 1) {
                const newIndex = activeImageIndex + 1;
                setActiveImageIndex(newIndex);
                scrollViewRef.current?.scrollTo({
                  x: newIndex * screenWidth,
                  animated: true
                });
              }
            }}
            disabled={activeImageIndex === property.images.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={30} 
              color={activeImageIndex === property.images.length - 1 ? "#ccc" : "#fff"} 
            />
          </TouchableOpacity>

          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {activeImageIndex + 1} / {property.images.length}
            </Text>
          </View>

          {/* Image Indicators */}
          <View style={styles.imageIndicatorContainer}>
            {property.images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setActiveImageIndex(index);
                  scrollViewRef.current?.scrollTo({
                    x: index * screenWidth,
                    animated: true
                  });
                }}
                style={styles.indicatorButton}
              >
                <View
                  style={[
                    styles.imageIndicator,
                    index === activeImageIndex && styles.activeImageIndicator,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Property Info */}
        <View style={styles.infoContainer}>
          <View style={styles.propertyHeader}>
            <Text style={styles.title}>{property.title}</Text>
            <Text style={styles.propertyTypeBadge}>
              {property.propertyType.charAt(0).toUpperCase() +
                property.propertyType.slice(1)}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={16} color="#666" />
            <Text style={styles.location}>{property.location}</Text>
          </View>

          <Text style={styles.price}>${property.price.toLocaleString()}</Text>
          <Text style={styles.priceNote}>
            {property.type === "rent" ? "per month" : "total price"}
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
          <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          {/* Add the comments section before the similar properties section */}
          {
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Comments & Reviews</Text>

              {/* Comment Input Form */}
              <View style={styles.commentInputContainer}>
                {
                  <View style={styles.starRatingContainer}>
                    <Text style={styles.ratingLabel}>Your Rating:</Text>
                    <View style={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setRating(star)}
                          style={styles.starButton}
                        >
                          <Ionicons
                            name={star <= rating ? "star" : "star-outline"}
                            size={24}
                            color={star <= rating ? "#FFD700" : "#ccc"}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                }
                <View style={styles.commentInputWrapper}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write a comment..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity
                    style={[
                      styles.commentSubmitButton,
                      (!rating || !newComment.trim()) &&
                        styles.commentSubmitButtonDisabled,
                    ]}
                    onPress={() => {
                      if (rating && newComment.trim()) {
                        Alert.alert(
                          "Success",
                          "Review submitted successfully!"
                        );
                        setNewComment("");
                        setRating(0);
                      } else {
                        Alert.alert(
                          "Error",
                          "Please provide both a rating and a comment"
                        );
                      }
                    }}
                    disabled={!rating || !newComment.trim()}
                  >
                    <Text style={styles.commentSubmitText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Comments List */}
              {property.comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Image
                      source={{ uri: comment.avatar }}
                      style={styles.commentAvatar}
                    />
                    <View style={styles.commentUserInfo}>
                      <Text style={styles.commentUserName}>{comment.user}</Text>
                      <Text style={styles.commentDate}>{comment.date}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, index) => (
                        <Ionicons
                          key={index}
                          name={
                            index < comment.rating ? "star" : "star-outline"
                          }
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.commentText}>{comment.comment}</Text>
                </View>
              ))}
            </View>
          }

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Similar Properties</Text>
              <FlatList
                data={similarProperties}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.similarPropertyCard}
                    onPress={() => router.push(`/property/${item.id}`)}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.similarPropertyImage}
                    />
                    <View style={styles.similarPropertyContent}>
                      <Text style={styles.similarPropertyTitle}>
                        {item.title}
                      </Text>
                      <Text style={styles.similarPropertyLocation}>
                        <Ionicons
                          name="location-sharp"
                          size={14}
                          color="#666"
                        />{" "}
                        {item.location}
                      </Text>
                      <Text style={styles.similarPropertyPrice}>
                        ${item.price.toLocaleString()}
                      </Text>
                      <View style={styles.similarPropertyDetails}>
                        <Text style={styles.similarPropertyDetail}>
                          <MaterialIcons
                            name="king-bed"
                            size={14}
                            color="#666"
                          />{" "}
                          {item.bedrooms}
                        </Text>
                        <Text style={styles.similarPropertyDetail}>
                          <MaterialIcons
                            name="bathtub"
                            size={14}
                            color="#666"
                          />{" "}
                          {item.bathrooms}
                        </Text>
                        <Text style={styles.similarPropertyDetail}>
                          <MaterialIcons
                            name="aspect-ratio"
                            size={14}
                            color="#666"
                          />{" "}
                          {item.area}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarPropertiesList}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Contact Button */}
      {/* <TouchableOpacity
        style={styles.contactButton}
        onPress={() => setShowContactModal(true)}
      >
        <Text style={styles.contactButtonText}>Contact Agent</Text>
      </TouchableOpacity> */}

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
              onChangeText={(text) =>
                setContactForm({ ...contactForm, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={contactForm.email}
              onChangeText={(text) =>
                setContactForm({ ...contactForm, email: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={contactForm.phone}
              onChangeText={(text) =>
                setContactForm({ ...contactForm, phone: text })
              }
            />
            <TextInput
              style={[styles.input, styles.messageInput]}
              placeholder="Message"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={contactForm.message}
              onChangeText={(text) =>
                setContactForm({ ...contactForm, message: text })
              }
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
    backgroundColor: "#fff",
  },
  notFoundText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 50,
  },
  header: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
  },
  actionButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  imageGalleryContainer: {
    position: 'relative',
    height: 300,
    backgroundColor: '#000', // Add background color to prevent white flash
  },
  imageGallery: {
    height: 300,
  },
  mainImage: {
    width: screenWidth,
    height: 300,
    resizeMode: "cover",
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  imageIndicatorContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  indicatorButton: {
    padding: 5, // Increase touch target
  },
  imageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  activeImageIndicator: {
    backgroundColor: "#fff",
    width: 20,
    height: 8,
    borderRadius: 4,
  },
  imageCounter: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    padding: 20,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  propertyTypeBadge: {
    backgroundColor: "#e8f5e9",
    color: "#29A132",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#29A132",
  },
  priceNote: {
    fontSize: 14,
    color: "#999",
    marginBottom: 15,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailItem: {
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#29A132",
    paddingBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: "row",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  similarPropertiesList: {
    paddingBottom: 10,
  },
  similarPropertyCard: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginRight: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  similarPropertyImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  similarPropertyContent: {
    padding: 15,
  },
  similarPropertyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 5,
  },
  similarPropertyLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  similarPropertyPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#29A132",
    marginBottom: 5,
  },
  similarPropertyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  similarPropertyDetail: {
    fontSize: 12,
    color: "#666",
  },
  contactButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#29A132",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    elevation: 3,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  messageInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#29A132",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#29A132",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Comments Section Styles
  commentsSection: {
    padding: 15,
    backgroundColor: "#fff",
    marginTop: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexWrap: "wrap",
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  commentInputContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  commentInputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 10,
  },
  starRatingContainer: {
    marginBottom: 15,
    alignItems: "center",
    width: "100%",
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  starButton: {
    padding: 4,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    minHeight: 80,
    textAlignVertical: "top",
    width: "90%",
  },
  commentSubmitButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  commentSubmitText: {
    color: "#fff",
    fontWeight: "bold",
  },
  commentCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUserName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  commentDate: {
    color: "#666",
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  commentSubmitButtonDisabled: {
    backgroundColor: "#ccc",
  },
});
