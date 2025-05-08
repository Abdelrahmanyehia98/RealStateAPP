import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    Modal,
    Pressable,
    ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';

export default function SellScreen() {
    // Form state
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [property, setProperty] = useState('');
    const [type, setType] = useState('');
    const [bedroom, setBedroom] = useState('');
    const [area, setArea] = useState('');
    const [price, setPrice] = useState('');
    const [negotiationable, setNegotiationable] = useState(false);
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // iOS Picker modals
    const [propertyModalVisible, setPropertyModalVisible] = useState(false);
    const [typeModalVisible, setTypeModalVisible] = useState(false);

    // Options
    const propertyOptions = ['Apartment', 'House', 'Studio', 'Land'];
    const typeOptions = ['Buy', 'Rent'];

    // Handle image selection
    const handleImagePick = async () => {
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
            base64: true,
        });

        if (result.canceled) return;

        if (result.assets && result.assets[0].uri) {
            const selectedImage = result.assets[0];
            if (selectedImage.fileSize > 5000000) { // 5MB
                Alert.alert('Image too large', 'Please select an image smaller than 5MB');
                return;
            }
            setImage(selectedImage.uri);
            setErrors({ ...errors, image: null });
        }
    };

    // Handle number inputs
    const handleNumberInput = (text, setter, fieldName) => {
        if (/^\d*$/.test(text)) {
            setter(text);
            setErrors({ ...errors, [fieldName]: null });
        }
    };

    // Handle description input with word limit
    const handleDescriptionChange = (text) => {
        const wordCount = text.trim().split(/\s+/).length;
        if (wordCount <= 100) {
            setDescription(text);
            setErrors({ ...errors, description: null });
        } else {
            Alert.alert('Limit Exceeded', 'Description cannot exceed 100 words.');
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = 'Title is required';
        if (!location.trim()) newErrors.location = 'Location is required';
        if (!description.trim()) newErrors.description = 'Description is required';
        if (!property) newErrors.property = 'Property type is required';
        if (!type) newErrors.type = 'Transaction type is required';
        if (!bedroom) newErrors.bedroom = 'Bedroom count is required';
        if (!area) newErrors.area = 'Area is required';
        if (!price) newErrors.price = 'Price is required';
        if (!image) newErrors.image = 'Image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = {
            title,
            location,
            description,
            property,
            type,
            bedroom,
            area,
            price,
            negotiationable,
            image,
        };

        setSubmitting(true);

        try {
            // Here you would typically send the data to your backend
            console.log('Form Submitted:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert('Success', 'Your property has been listed!');

            // Reset form
            setTitle('');
            setLocation('');
            setDescription('');
            setProperty('');
            setType('');
            setBedroom('');
            setArea('');
            setPrice('');
            setNegotiationable(false);
            setImage(null);
            setErrors({});
        } catch (error) {
            Alert.alert('Error', 'Failed to submit property. Please try again.');
            console.error('Submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Sell Your Property</Text>

            {/* Image Upload */}
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>{image ? 'Change Photo' : 'Tap to Upload Photo'}</Text>
            </TouchableOpacity>
            {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

            {image && <Image source={{ uri: image }} style={styles.preview} />}

            {/* Title */}
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={(text) => {
                    setTitle(text);
                    setErrors({ ...errors, title: null });
                }}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            {/* Location */}
            <TextInput
                style={styles.input}
                placeholder="Location"
                value={location}
                onChangeText={(text) => {
                    setLocation(text);
                    setErrors({ ...errors, location: null });
                }}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

            {/* Description */}
            <TextInput
                style={[styles.input, { height: 100 }]}
                placeholder="Description (max 100 words)"
                value={description}
                onChangeText={handleDescriptionChange}
                multiline
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            {/* Property Type Picker */}
            <Text style={styles.label}>Property Type</Text>
            {Platform.OS === 'ios' ? (
                <>
                    <Pressable
                        style={[
                            styles.pickerIOSButton,
                            errors.property && { borderColor: 'red' }
                        ]}
                        onPress={() => setPropertyModalVisible(true)}
                    >
                        <Text style={styles.pickerIOSText}>{property || 'Select Property'}</Text>
                    </Pressable>
                    {errors.property && <Text style={styles.errorText}>{errors.property}</Text>}
                    <Modal visible={propertyModalVisible} animationType="slide" transparent>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                {propertyOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            setProperty(item);
                                            setPropertyModalVisible(false);
                                            setErrors({ ...errors, property: null });
                                        }}
                                    >
                                        <Text style={styles.modalOptionText}>{item}</Text>
                                    </Pressable>
                                ))}
                                <Pressable
                                    style={styles.modalOption}
                                    onPress={() => setPropertyModalVisible(false)}
                                >
                                    <Text style={styles.modalClose}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <>
                    <View style={[
                        styles.pickerWrapper,
                        errors.property && { borderColor: 'red' }
                    ]}>
                        <Picker
                            selectedValue={property}
                            onValueChange={(value) => {
                                setProperty(value);
                                setErrors({ ...errors, property: null });
                            }}
                        >
                            <Picker.Item label="Select Property" value="" />
                            {propertyOptions.map(item => <Picker.Item label={item} value={item} key={item} />)}
                        </Picker>
                    </View>
                    {errors.property && <Text style={styles.errorText}>{errors.property}</Text>}
                </>
            )}

            {/* Transaction Type Picker */}
            <Text style={styles.label}>Transaction Type</Text>
            {Platform.OS === 'ios' ? (
                <>
                    <Pressable
                        style={[
                            styles.pickerIOSButton,
                            errors.type && { borderColor: 'red' }
                        ]}
                        onPress={() => setTypeModalVisible(true)}
                    >
                        <Text style={styles.pickerIOSText}>{type || 'Select Type'}</Text>
                    </Pressable>
                    {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
                    <Modal visible={typeModalVisible} animationType="slide" transparent>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                {typeOptions.map((item) => (
                                    <Pressable
                                        key={item}
                                        style={styles.modalOption}
                                        onPress={() => {
                                            setType(item);
                                            setTypeModalVisible(false);
                                            setErrors({ ...errors, type: null });
                                        }}
                                    >
                                        <Text style={styles.modalOptionText}>{item}</Text>
                                    </Pressable>
                                ))}
                                <Pressable
                                    style={styles.modalOption}
                                    onPress={() => setTypeModalVisible(false)}
                                >
                                    <Text style={styles.modalClose}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </>
            ) : (
                <>
                    <View style={[
                        styles.pickerWrapper,
                        errors.type && { borderColor: 'red' }
                    ]}>
                        <Picker
                            selectedValue={type}
                            onValueChange={(value) => {
                                setType(value);
                                setErrors({ ...errors, type: null });
                            }}
                        >
                            <Picker.Item label="Select Type" value="" />
                            {typeOptions.map(item => <Picker.Item label={item} value={item} key={item} />)}
                        </Picker>
                    </View>
                    {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
                </>
            )}

            {/* Bedroom */}
            <TextInput
                style={styles.input}
                placeholder="Bedroom"
                keyboardType="numeric"
                value={bedroom}
                onChangeText={(text) => handleNumberInput(text, setBedroom, 'bedroom')}
            />
            {errors.bedroom && <Text style={styles.errorText}>{errors.bedroom}</Text>}

            {/* Area */}
            <TextInput
                style={styles.input}
                placeholder="Area (m²)"
                keyboardType="numeric"
                value={area}
                onChangeText={(text) => handleNumberInput(text, setArea, 'area')}
            />
            {errors.area && <Text style={styles.errorText}>{errors.area}</Text>}

            {/* Price */}
            <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={price}
                onChangeText={(text) => handleNumberInput(text, setPrice, 'price')}
            />
            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

            {/* Negotiationable */}
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={negotiationable}
                    onValueChange={setNegotiationable}
                    color={negotiationable ? '#29A132' : undefined}
                />
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
}

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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 12,
        marginTop: -6,
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