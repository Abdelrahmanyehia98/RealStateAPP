import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    Modal,
    Pressable,
    ActivityIndicator,
    Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addProperty } from '../services/firestore';
import { auth } from '../firebase';
import * as ImagePicker from 'expo-image-picker';

// Error-boundary imports with fallbacks
let Checkbox = Switch;
let Picker;

try {
    Checkbox = require('expo-checkbox').default;
} catch (error) {
    console.warn("expo-checkbox not available. Using Switch as fallback.");
}

try {
    Picker = require('@react-native-picker/picker').Picker;
} catch (error) {
    console.warn("@react-native-picker/picker not available. Picker functionality will be limited.");
}

const SellScreen = () => {
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        property: '',
        type: '',
        bedroom: '',
        area: '',
        price: '',
        negotiationable: false,
        image: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [propertyModalVisible, setPropertyModalVisible] = useState(false);
    const [typeModalVisible, setTypeModalVisible] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(null);

    // Request camera permissions when component mounts
    useEffect(() => {
        (async () => {
            try {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                setCameraPermission(status === 'granted');
                console.log('Initial camera permission status:', status);

                // Also request media library permissions
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            } catch (error) {
                console.error('Error requesting permissions:', error);
            }
        })();
    }, []);

    // Options
    const propertyOptions = ['Apartment', 'House', 'Villa', 'Office', 'Shop'];
    const typeOptions = ['Buy', 'Rent'];

    // Handle input changes
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Handle image selection with error handling
    const handleImagePick = async () => {
        try {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need access to your media to upload images.');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'image',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            // Process the result
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                console.log('Selected image:', selectedImage);

                // Check file size if available
                if (selectedImage.fileSize && selectedImage.fileSize > 5000000) {
                    Alert.alert('Image too large', 'Please select an image smaller than 5MB');
                    return;
                }

                // Update form data with the selected image
                handleChange('image', selectedImage.uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    // Handle camera capture with error handling
    const handleCameraCapture = async () => {
        try {
            console.log('Opening camera...');

            // Check if we already have camera permission
            if (!cameraPermission) {
                // Request camera permissions again if needed
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                console.log('Camera permission status:', status);

                setCameraPermission(status === 'granted');

                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Denied',
                        'We need access to your camera to take photos. Please enable camera access in your device settings.',
                        [
                            { text: 'OK' },
                            {
                                text: 'Open Settings',
                                onPress: () => {
                                    // This would ideally open settings, but we'll just show another alert for now
                                    Alert.alert('Info', 'Please open your device settings and enable camera access for this app.');
                                }
                            }
                        ]
                    );
                    return;
                }
            }

            // Launch camera
            console.log('Launching camera...');
            Alert.alert('Opening Camera', 'The camera will open now. Please allow access if prompted.');

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                exif: false, // Don't include EXIF data to reduce image size
            });

            console.log('Camera result:', result);

            // Process the result
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const capturedImage = result.assets[0];
                console.log('Captured image:', capturedImage);

                // Check file size if available
                if (capturedImage.fileSize && capturedImage.fileSize > 5000000) {
                    Alert.alert('Image too large', 'The captured image is too large. Please try again with lower quality.');
                    return;
                }

                // Update form data with the captured image
                handleChange('image', capturedImage.uri);
                Alert.alert('Success', 'Photo captured successfully!');
            } else {
                console.log('Camera capture canceled or failed');
            }
        } catch (error) {
            console.error('Camera error:', error);
            Alert.alert(
                'Camera Error',
                `Failed to capture image: ${error.message || 'Unknown error'}. Please try again.`
            );
        }
    };

    // Handle number inputs
    const handleNumberInput = (text, fieldName) => {
        if (/^\d*$/.test(text)) {
            handleChange(fieldName, text);
        }
    };

    // Parse features from description or other fields
    const parseFeatures = () => {
        const features = [];

        // Add common features based on property type
        if (formData.property.toLowerCase() === 'apartment') {
            features.push('Elevator');
        }

        if (formData.property.toLowerCase() === 'villa') {
            features.push('Garden');
        }

        if (Number(formData.bedroom) >= 3) {
            features.push('Family-Friendly');
        }

        if (formData.negotiationable) {
            features.push('Negotiable Price');
        }

        // Add "Parking" as a common feature
        features.push('Parking');

        return features;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['title', 'location', 'description', 'property', 'type', 'bedroom', 'area', 'price', 'image'];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        try {
            // Prepare property data for Firestore
            const propertyData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                location: formData.location.trim(),
                type: formData.type.toLowerCase(), // Convert to lowercase to match expected values (buy/rent)
                propertyType: formData.property.toLowerCase(), // Convert to lowercase to match expected values
                bedrooms: Number(formData.bedroom),
                bathrooms: 1, // Default value
                area: `${formData.area} sqm`,
                features: parseFeatures(),
                image: formData.image,
                images: [formData.image], // Use main image as the first additional image
                negotiable: formData.negotiationable,
                userId: auth.currentUser?.uid || 'anonymous',
                userEmail: auth.currentUser?.email || 'anonymous',
                status: 'pending' // Properties need approval before being listed
            };

            console.log('Submitting property to Firestore:', propertyData);

            // Add property to Firestore
            const result = await addProperty(propertyData);
            console.log('Property added successfully with ID:', result.id);

            Alert.alert('Success', 'Your property has been submitted for review. It will be listed once approved.');

            // Reset form
            setFormData({
                title: '',
                location: '',
                description: '',
                property: '',
                type: '',
                bedroom: '',
                area: '',
                price: '',
                negotiationable: false,
                image: null,
            });
            setErrors({});
        } catch (error) {
            console.error('Error submitting property to Firestore:', error);
            Alert.alert('Error', `Failed to submit property: ${error.message || 'Unknown error'}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Render picker based on platform and availability
    const renderPicker = (items, selectedValue, fieldName, placeholder) => {
        if (!Picker) {
            return (
                <Pressable
                    style={[styles.pickerIOSButton, errors[fieldName] && styles.errorBorder]}
                    onPress={() => Alert.alert('Info', 'Picker functionality not available')}
                >
                    <Text style={styles.pickerIOSText}>{selectedValue || placeholder}</Text>
                </Pressable>
            );
        }

        if (Platform.OS === 'ios') {
            return (
                <>
                    <Pressable
                        style={[styles.pickerIOSButton, errors[fieldName] && styles.errorBorder]}
                        onPress={() => fieldName === 'property'
                            ? setPropertyModalVisible(true)
                            : setTypeModalVisible(true)}
                    >
                        <Text style={styles.pickerIOSText}>{selectedValue || placeholder}</Text>
                        <Ionicons name="chevron-down" size={18} color="#7f8c8d" />
                    </Pressable>
                    <Modal
                        visible={fieldName === 'property' ? propertyModalVisible : typeModalVisible}
                        animationType="slide"
                        transparent
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>{placeholder}</Text>
                                {items.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            handleChange(fieldName, item);
                                            fieldName === 'property'
                                                ? setPropertyModalVisible(false)
                                                : setTypeModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.modalOptionText}>{item}</Text>
                                        {selectedValue === item && (
                                            <Ionicons name="checkmark" size={20} color="#29A132" />
                                        )}
                                    </Pressable>
                                ))}
                                <Pressable
                                    style={styles.modalCancel}
                                    onPress={() => fieldName === 'property'
                                        ? setPropertyModalVisible(false)
                                        : setTypeModalVisible(false)}
                                >
                                    <Text style={styles.modalClose}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </>
            );
        }

        return (
            <View style={[styles.pickerWrapper, errors[fieldName] && styles.errorBorder]}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(value) => handleChange(fieldName, value)}
                    style={styles.picker}
                >
                    <Picker.Item label={placeholder} value="" />
                    {items.map(item => <Picker.Item label={item} value={item} key={item} />)}
                </Picker>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.appName}>List Your Property</Text>
                <Text style={styles.tagline}>Fill in the details below</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Property Details</Text>

                {/* Image Upload */}
                <View style={styles.imageSection}>
                    <TouchableOpacity
                        style={styles.imagePicker}
                        onPress={handleImagePick}
                    >
                        {formData.image ? (
                            <Image source={{ uri: formData.image }} style={styles.preview} />
                        ) : (
                            <View style={styles.imageUploadContent}>
                                <Ionicons name="cloud-upload" size={40} color="#29A132" />
                                <Text style={styles.imagePickerText}>Tap to Upload Photo</Text>
                                <Text style={styles.imagePickerSubtext}>Max 5MB</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Image Action Buttons */}
                    <View style={styles.imageActions}>
                        <TouchableOpacity
                            style={[styles.imageActionButton, { backgroundColor: '#3498db' }]}
                            onPress={handleImagePick}
                        >
                            <Ionicons name="images-outline" size={20} color="#fff" />
                            <Text style={styles.imageActionText}>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.imageActionButton, {
                                backgroundColor: '#2ecc71',
                                paddingVertical: 12,
                                marginHorizontal: 8
                            }]}
                            onPress={handleCameraCapture}
                        >
                            <Ionicons name="camera-outline" size={24} color="#fff" />
                            <Text style={[styles.imageActionText, { fontSize: 16 }]}>Take Photo</Text>
                        </TouchableOpacity>

                        {formData.image && (
                            <TouchableOpacity
                                style={[styles.imageActionButton, { backgroundColor: '#e74c3c' }]}
                                onPress={() => handleChange('image', null)}
                            >
                                <Ionicons name="trash-outline" size={20} color="#fff" />
                                <Text style={styles.imageActionText}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Camera Instructions */}
                    <View style={styles.cameraInstructions}>
                        <Ionicons name="information-circle-outline" size={18} color="#7f8c8d" />
                        <Text style={styles.cameraInstructionsText}>
                            Tap "Take Photo" to capture an image with your camera
                        </Text>
                    </View>
                </View>
                {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

                {/* Title */}
                <Text style={styles.label}>Property Title</Text>
                <TextInput
                    style={[styles.input, errors.title && styles.errorBorder]}
                    placeholder="Enter property title"
                    placeholderTextColor="#7f8c8d"
                    value={formData.title}
                    onChangeText={(text) => handleChange('title', text)}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                {/* Location */}
                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={[styles.input, errors.location && styles.errorBorder]}
                    placeholder="Enter property location"
                    placeholderTextColor="#7f8c8d"
                    value={formData.location}
                    onChangeText={(text) => handleChange('location', text)}
                />
                {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.description && styles.errorBorder]}
                    placeholder="Describe your property"
                    placeholderTextColor="#7f8c8d"
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                    multiline
                />
                {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <View style={styles.filterRow}>
                    {/* Property Type Picker */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>Property Type</Text>
                        {renderPicker(propertyOptions, formData.property, 'property', 'Select Type')}
                        {errors.property && <Text style={styles.errorText}>{errors.property}</Text>}
                    </View>

                    {/* Transaction Type Picker */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>Transaction Type</Text>
                        {renderPicker(typeOptions, formData.type, 'type', 'Select Type')}
                        {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
                    </View>
                </View>

                <View style={styles.filterRow}>
                    {/* Bedroom */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>Bedrooms</Text>
                        <TextInput
                            style={[styles.input, errors.bedroom && styles.errorBorder]}
                            placeholder="0"
                            placeholderTextColor="#7f8c8d"
                            keyboardType="numeric"
                            value={formData.bedroom}
                            onChangeText={(text) => handleNumberInput(text, 'bedroom')}
                        />
                        {errors.bedroom && <Text style={styles.errorText}>{errors.bedroom}</Text>}
                    </View>

                    {/* Area */}
                    <View style={styles.filterGroup}>
                        <Text style={styles.label}>Area (m²)</Text>
                        <TextInput
                            style={[styles.input, errors.area && styles.errorBorder]}
                            placeholder="0"
                            placeholderTextColor="#7f8c8d"
                            keyboardType="numeric"
                            value={formData.area}
                            onChangeText={(text) => handleNumberInput(text, 'area')}
                        />
                        {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}
                    </View>
                </View>

                {/* Price */}
                <Text style={styles.label}>Price ($)</Text>
                <TextInput
                    style={[styles.input, errors.price && styles.errorBorder]}
                    placeholder="Enter price"
                    placeholderTextColor="#7f8c8d"
                    keyboardType="numeric"
                    value={formData.price}
                    onChangeText={(text) => handleNumberInput(text, 'price')}
                />
                {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                {/* Negotiationable */}
                <View style={styles.checkboxContainer}>
                    {Checkbox === Switch ? (
                        <Switch
                            value={formData.negotiationable}
                            onValueChange={(value) => handleChange('negotiationable', value)}
                            thumbColor={formData.negotiationable ? '#29A132' : '#f4f3f4'}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                        />
                    ) : (
                        <Checkbox
                            value={formData.negotiationable}
                            onValueChange={(value) => handleChange('negotiationable', value)}
                            color={formData.negotiationable ? '#29A132' : undefined}
                        />
                    )}
                    <Text style={styles.checkboxLabel}>Price is negotiable</Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Publish Property</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

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
        textAlign: 'center',
    },
    tagline: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 5,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 8,
        fontSize: 16,
        color: '#34495e',
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#34495e',
        marginBottom: 8,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 12,
        marginTop: -6,
    },
    errorBorder: {
        borderColor: 'red',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#34495e',
    },
    pickerIOSButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerIOSText: {
        color: '#34495e',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#34495e',
    },
    modalCancel: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalClose: {
        fontSize: 16,
        color: '#29A132',
        fontWeight: '600',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: 10,
    },
    checkboxLabel: {
        marginLeft: 12,
        fontSize: 16,
        color: '#34495e',
    },
    imageSection: {
        marginBottom: 15,
    },
    imagePicker: {
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 10,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageUploadContent: {
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#2c3e50',
        fontWeight: '500',
        marginTop: 10,
        fontSize: 16,
    },
    imagePickerSubtext: {
        color: '#7f8c8d',
        fontSize: 14,
        marginTop: 5,
    },
    preview: {
        width: '100%',
        height: '100%',
    },
    imageActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    imageActionButton: {
        backgroundColor: '#29A132',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        flex: 1,
        marginHorizontal: 4,
    },
    imageActionText: {
        color: '#fff',
        fontWeight: '500',
        marginLeft: 5,
        fontSize: 14,
    },
    cameraInstructions: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    cameraInstructionsText: {
        color: '#7f8c8d',
        fontSize: 14,
        marginLeft: 8,
        flex: 1,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    filterGroup: {
        width: '48%',
    },
    submitButton: {
        backgroundColor: '#29A132',
        padding: 18,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SellScreen;