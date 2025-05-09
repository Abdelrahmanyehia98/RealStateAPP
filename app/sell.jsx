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
    Switch // Fallback for checkbox
} from 'react-native';

// Error-boundary imports with fallbacks
let ImagePicker;
let Checkbox = Switch; // Default fallback
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
    const propertyOptions = ['Apartment', 'House', 'Studio', 'Land'];
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

        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need access to your media to upload images.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.[0]?.uri) {
                const selectedImage = result.assets[0];
                if (selectedImage.fileSize > 5000000) {
                    Alert.alert('Image too large', 'Please select an image smaller than 5MB');
                    return;
                }
                handleChange('image', selectedImage.uri);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
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
                    </Pressable>
                    <Modal 
                        visible={fieldName === 'property' ? propertyModalVisible : typeModalVisible} 
                        animationType="slide" 
                        transparent
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
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
                                    </Pressable>
                                ))}
                                <Pressable
                                    style={styles.modalOption}
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
                >
                    <Picker.Item label={placeholder} value="" />
                    {items.map(item => <Picker.Item label={item} value={item} key={item} />)}
                </Picker>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Sell Your Property</Text>

            {/* Image Upload */}
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>
                    {formData.image ? 'Change Photo' : 'Tap to Upload Photo'}
                </Text>
            </TouchableOpacity>
            {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

            {formData.image && <Image source={{ uri: formData.image }} style={styles.preview} />}

            {/* Title */}
            <TextInput
                style={[styles.input, errors.title && styles.errorBorder]}
                placeholder="Title"
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            {/* Location */}
            <TextInput
                style={[styles.input, errors.location && styles.errorBorder]}
                placeholder="Location"
                value={formData.location}
                onChangeText={(text) => handleChange('location', text)}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            {/* Description */}
            <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.errorBorder]}
                placeholder="Description"
                value={formData.description}
                onChangeText={(text) => handleChange('description', text)}
                multiline
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            {/* Property Type Picker */}
            <Text style={styles.label}>Property Type</Text>
            {renderPicker(propertyOptions, formData.property, 'property', 'Select Property')}
            {errors.property && <Text style={styles.errorText}>{errors.property}</Text>}

            {/* Transaction Type Picker */}
            <Text style={styles.label}>Transaction Type</Text>
            {renderPicker(typeOptions, formData.type, 'type', 'Select Type')}
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

            {/* Bedroom */}
            <TextInput
                style={[styles.input, errors.bedroom && styles.errorBorder]}
                placeholder="Bedroom"
                keyboardType="numeric"
                value={formData.bedroom}
                onChangeText={(text) => handleNumberInput(text, 'bedroom')}
            />
            {errors.bedroom && <Text style={styles.errorText}>{errors.bedroom}</Text>}

            {/* Area */}
            <TextInput
                style={[styles.input, errors.area && styles.errorBorder]}
                placeholder="Area (m²)"
                keyboardType="numeric"
                value={formData.area}
                onChangeText={(text) => handleNumberInput(text, 'area')}
            />
            {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}

            {/* Price */}
            <TextInput
                style={[styles.input, errors.price && styles.errorBorder]}
                placeholder="Price"
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
                    />
                ) : (
                    <Checkbox
                        value={formData.negotiationable}
                        onValueChange={(value) => handleChange('negotiationable', value)}
                        color={formData.negotiationable ? '#29A132' : undefined}
                    />
                )}
                <Text style={styles.checkboxLabel}>Negotiationable</Text>
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
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
        padding: 20,
        backgroundColor: '#f5f6fa',
        paddingBottom: 40,
    },
    heading: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 12,
        marginBottom: 8,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 12,
        marginTop: -6,
    },
    errorBorder: {
        borderColor: 'red',
    },
    label: {
        fontWeight: '600',
        marginBottom: 6,
        color: '#555',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginBottom: 8,
        overflow: 'hidden',
    },
    pickerIOSButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 8,
    },
    pickerIOSText: {
        color: '#333',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalOptionText: {
        fontSize: 18,
    },
    modalClose: {
        paddingVertical: 14,
        textAlign: 'center',
        color: '#007bff',
        fontWeight: '600',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    imagePicker: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#aaa',
        backgroundColor: '#fafafa',
        padding: 20,
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 12,
    },
    imagePickerText: {
        color: '#666',
        fontWeight: '500',
    },
    preview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    buttonContainer: {
        marginTop: 10,
    },
    submitButton: {
        backgroundColor: '#29A132',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SellScreen;