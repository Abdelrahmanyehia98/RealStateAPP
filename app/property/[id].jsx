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
    Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

// Using the same properties data from index.jsx
const properties = [
    {
        id: "1",
        title: "Luxury Villa",
        location: "Maadi",
        price: 2000000,
        type: "buy",
        propertyType: "villa",
        bedrooms: 4,
        bathrooms: 3,
        area: 250,
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
        location: "Zamalek",
        price: 850000,
        type: "buy",
        propertyType: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        area: 120,
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
        location: "Haram",
        price: 1500000,
        type: "buy",
        propertyType: "house",
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        description: "Stunning beach house with direct access to the beach.",
        features: ["Beach Access", "Terrace", "Security", "Parking"],
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
        images: [
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb512",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb513",
        ],
    },
    {
        id: "4",
        title: "Office Space",
        location: "Downtown",
        price: 1200000,
        type: "rent",
        propertyType: "office",
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        description: "Modern office space in a prime business location.",
        features: ["Meeting Rooms", "Reception", "Security", "Parking"],
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
        location: "Mohandesen",
        price: 950000,
        type: "rent",
        propertyType: "shop",
        bedrooms: 0,
        bathrooms: 1,
        area: 150,
        description: "Prime retail space in a high-traffic area.",
        features: ["Storage Room", "Security", "Parking", "High Traffic"],
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
        images: [
            "https://images.unsplash.com/photo-1573164713988-8665fc963095",
            "https://images.unsplash.com/photo-1573164713988-8665fc963096",
            "https://images.unsplash.com/photo-1573164713988-8665fc963097",
        ],
    },
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

    const property = properties.find(p => p.id === id);
    const similarProperties = properties.filter(p =>
        p.id !== id &&
        (p.propertyType === property?.propertyType || p.type === property?.type)
    ).slice(0, 3);

    if (!property) {
        return (
            <View style={styles.container}>
                <Text>Property not found</Text>
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
        // Here you would typically send the contact form data to your backend
        Alert.alert('Success', 'Your message has been sent to the agent');
        setShowContactModal(false);
        setContactForm({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <View style={styles.container}>
            {/* Header with back button, logo and actions */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.logoContainer}
                    onPress={() => router.push('/')}
                >
                    <Text style={styles.logoText}>RealEstate</Text>
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
                >
                    {property.images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            style={styles.mainImage}
                        />
                    ))}
                </ScrollView>

                {/* Property Info */}
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{property.title}</Text>
                    <Text style={styles.location}>
                        <Ionicons name="location" size={16} color="#666" /> {property.location}
                    </Text>
                    <Text style={styles.price}>${property.price.toLocaleString()}</Text>

                    {/* Key Details */}
                    <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                            <Ionicons name="bed-outline" size={24} color="#28a745" />
                            <Text style={styles.detailText}>{property.bedrooms} Beds</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="water-outline" size={24} color="#28a745" />
                            <Text style={styles.detailText}>{property.bathrooms} Baths</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="square-outline" size={24} color="#28a745" />
                            <Text style={styles.detailText}>{property.area} m²</Text>
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
                                    <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Similar Properties */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Similar Properties</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.similarProperties}
                        >
                            {similarProperties.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.similarPropertyCard}
                                    onPress={() => router.push({
                                        pathname: "/property/[id]",
                                        params: { id: item.id }
                                    })}
                                >
                                    <Image source={{ uri: item.image }} style={styles.similarPropertyImage} />
                                    <Text style={styles.similarPropertyTitle}>{item.title}</Text>
                                    <Text style={styles.similarPropertyPrice}>${item.price.toLocaleString()}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Contact Button */}
                    <TouchableOpacity
                        style={styles.contactButton}
                        onPress={() => setShowContactModal(true)}
                    >
                        <Text style={styles.contactButtonText}>Contact Agent</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

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
                            value={contactForm.name}
                            onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            value={contactForm.email}
                            onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            keyboardType="phone-pad"
                            value={contactForm.phone}
                            onChangeText={(text) => setContactForm({ ...contactForm, phone: text })}
                        />
                        <TextInput
                            style={[styles.input, styles.messageInput]}
                            placeholder="Message"
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
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        zIndex: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
    },
    headerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 20,
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
    infoContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    location: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    price: {
        fontSize: 22,
        color: '#28a745',
        fontWeight: 'bold',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#eee',
        marginBottom: 20,
    },
    detailItem: {
        alignItems: 'center',
    },
    detailText: {
        marginTop: 5,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#444',
    },
    featuresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -5,
    },
    featureItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    featureText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#444',
    },
    similarProperties: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    similarPropertyCard: {
        width: 200,
        marginRight: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        overflow: 'hidden',
    },
    similarPropertyImage: {
        width: '100%',
        height: 120,
    },
    similarPropertyTitle: {
        padding: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    similarPropertyPrice: {
        padding: 10,
        paddingTop: 0,
        color: '#28a745',
        fontWeight: 'bold',
    },
    contactButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
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
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    messageInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});