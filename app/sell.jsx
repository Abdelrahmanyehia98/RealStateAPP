import React, { useState } from 'react';
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


let ImagePicker;
let Checkbox = Switch;
let Picker;

try {
    ImagePicker = require('expo-image-picker');
} catch (error) {
    console.warn("expo-image-picker not available. Image upload functionality will be limited.");
}

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
        if (!ImagePicker) {
            Alert.alert('Error', 'Image upload functionality is not available');
            return;
        }

        Alert.alert(
            'Choose Photo Source',
            '',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Gallery', onPress: () => pickImage('library') },
                { text: 'Camera', onPress: () => pickImage('camera') },
            ]
        );
    };

    const pickImage = async (sourceType) => {
        try {
            let permissionResult;
            if (sourceType === 'camera') {
                permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            } else {
                permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            }

            if (permissionResult.status !== 'granted') {
                Alert.alert('Permission Denied', `We need access to your ${sourceType === 'camera' ? 'camera' : 'media library'} to upload images.`);
                return;
            }

            const pickerOptions = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            };

            const pickerResult = sourceType === 'camera'
                ? await ImagePicker.launchCameraAsync(pickerOptions)
                : await ImagePicker.launchImageLibraryAsync(pickerOptions);

            if (!pickerResult.canceled && pickerResult.assets?.[0]?.uri) {
                const selectedImage = pickerResult.assets[0];
                if (selectedImage.fileSize > 5000000) {
                    Alert.alert('Image too large', 'Please select an image smaller than 5MB');
                    return;
                }
                handleChange('image', selectedImage.uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to capture image. Please try again.');
        }
    };

    // Handle number inputs
    const handleNumberInput = (text, fieldName) => {
        if (/^\d*$/.test(text)) {
            handleChange(fieldName, text);
        }
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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            Alert.alert('Success', 'Your property has been listed!');
            
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
            Alert.alert('Error', 'Failed to submit property. Please try again.');
            console.error('Submission error:', error);
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
                <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
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
    imagePicker: {
        borderWidth: 2,
        borderColor: '#eee',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 15,
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
