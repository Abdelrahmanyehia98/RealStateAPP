import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    
    // Mock user data - replace with actual user data from your backend
    const [userData, setUserData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 8900',
        location: 'New York, USA',
        bio: 'Real estate enthusiast with 5 years of experience in property management.',
        listings: 12,
        savedProperties: 8
    });

    // Mock posts data - replace with actual posts from your backend
    const [posts, setPosts] = useState([
        {
            id: 1,
            title: 'Modern Apartment in Downtown',
            description: 'Beautiful 2-bedroom apartment with city views',
            image: null,
            price: '$250,000',
            location: 'New York, NY',
            date: '2024-03-15'
        },
        {
            id: 2,
            title: 'Luxury Villa with Pool',
            description: 'Spacious 4-bedroom villa with private pool',
            image: null,
            price: '$750,000',
            location: 'Los Angeles, CA',
            date: '2024-03-14'
        }
    ]);

    const [newPost, setNewPost] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        image: null
    });

    const [editedData, setEditedData] = useState({...userData});

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your media to upload profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handlePostImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your media to upload post image.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            if (editingPost) {
                setEditingPost({...editingPost, image: result.assets[0].uri});
            } else {
                setNewPost({...newPost, image: result.assets[0].uri});
            }
        }
    };

    const handleAddPost = () => {
        if (!newPost.title || !newPost.description || !newPost.price || !newPost.location) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const post = {
            id: Date.now(),
            ...newPost,
            date: new Date().toISOString().split('T')[0]
        };

        setPosts([post, ...posts]);
        setNewPost({
            title: '',
            description: '',
            price: '',
            location: '',
            image: null
        });
        setShowAddPostModal(false);
    };

    const handleEditPost = () => {
        if (!editingPost.title || !editingPost.description || !editingPost.price || !editingPost.location) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setPosts(posts.map(post => 
            post.id === editingPost.id ? editingPost : post
        ));
        setEditingPost(null);
    };

    const handleDeletePost = (postId) => {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => {
                        setPosts(posts.filter(post => post.id !== postId));
                    }
                }
            ]
        );
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // Here you would typically send the updated data to your backend
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            setUserData(editedData);
            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderEditMode = () => (
        <View style={styles.editContainer}>
            <TextInput
                style={styles.input}
                value={editedData.name}
                onChangeText={(text) => setEditedData({...editedData, name: text})}
                placeholder="Full Name"
            />
            <TextInput
                style={styles.input}
                value={editedData.email}
                onChangeText={(text) => setEditedData({...editedData, email: text})}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                value={editedData.phone}
                onChangeText={(text) => setEditedData({...editedData, phone: text})}
                placeholder="Phone Number"
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                value={editedData.location}
                onChangeText={(text) => setEditedData({...editedData, location: text})}
                placeholder="Location"
            />
            <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedData.bio}
                onChangeText={(text) => setEditedData({...editedData, bio: text})}
                placeholder="Bio"
                multiline
                numberOfLines={4}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]} 
                    onPress={() => {
                        setEditedData({...userData});
                        setIsEditing(false);
                    }}
                >
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.saveButton]} 
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderViewMode = () => (
        <View style={styles.viewContainer}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.listings}</Text>
                    <Text style={styles.statLabel}>Listings</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{userData.savedProperties}</Text>
                    <Text style={styles.statLabel}>Saved</Text>
                </View>
            </View>

            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <Text style={styles.infoValue}>{userData.name}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{userData.email}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>{userData.phone}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Location</Text>
                    <Text style={styles.infoValue}>{userData.location}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Bio</Text>
                    <Text style={styles.infoValue}>{userData.bio}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
            >
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );

    const renderAddPostModal = () => (
        <Modal
            visible={showAddPostModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowAddPostModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Add New Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={newPost.title}
                        onChangeText={(text) => setNewPost({...newPost, title: text})}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        value={newPost.description}
                        onChangeText={(text) => setNewPost({...newPost, description: text})}
                        multiline
                        numberOfLines={4}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        value={newPost.price}
                        onChangeText={(text) => setNewPost({...newPost, price: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={newPost.location}
                        onChangeText={(text) => setNewPost({...newPost, location: text})}
                    />
                    <TouchableOpacity 
                        style={styles.imagePickerButton}
                        onPress={handlePostImagePick}
                    >
                        <Text style={styles.imagePickerText}>
                            {newPost.image ? 'Change Image' : 'Add Image'}
                        </Text>
                    </TouchableOpacity>
                    {newPost.image && (
                        <Image source={{ uri: newPost.image }} style={styles.postImagePreview} />
                    )}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setShowAddPostModal(false)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={handleAddPost}
                        >
                            <Text style={styles.buttonText}>Add Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderEditPostModal = () => (
        <Modal
            visible={!!editingPost}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setEditingPost(null)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Post</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={editingPost?.title}
                        onChangeText={(text) => setEditingPost({...editingPost, title: text})}
                    />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description"
                        value={editingPost?.description}
                        onChangeText={(text) => setEditingPost({...editingPost, description: text})}
                        multiline
                        numberOfLines={4}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Price"
                        value={editingPost?.price}
                        onChangeText={(text) => setEditingPost({...editingPost, price: text})}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Location"
                        value={editingPost?.location}
                        onChangeText={(text) => setEditingPost({...editingPost, location: text})}
                    />
                    <TouchableOpacity 
                        style={styles.imagePickerButton}
                        onPress={handlePostImagePick}
                    >
                        <Text style={styles.imagePickerText}>
                            {editingPost?.image ? 'Change Image' : 'Add Image'}
                        </Text>
                    </TouchableOpacity>
                    {editingPost?.image && (
                        <Image source={{ uri: editingPost.image }} style={styles.postImagePreview} />
                    )}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setEditingPost(null)}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.modalButton, styles.saveButton]}
                            onPress={handleEditPost}
                        >
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderPosts = () => (
        <View style={styles.postsContainer}>
            <View style={styles.postsHeader}>
                <Text style={styles.postsTitle}>My Posts</Text>
                <TouchableOpacity 
                    style={styles.addPostButton}
                    onPress={() => setShowAddPostModal(true)}
                >
                    <Text style={styles.addPostButtonText}>Add New Post</Text>
                </TouchableOpacity>
            </View>
            {posts.map(post => (
                <View key={post.id} style={styles.postCard}>
                    {post.image && (
                        <Image source={{ uri: post.image }} style={styles.postImage} />
                    )}
                    <View style={styles.postContent}>
                        <Text style={styles.postTitle}>{post.title}</Text>
                        <Text style={styles.postDescription}>{post.description}</Text>
                        <View style={styles.postDetails}>
                            <Text style={styles.postPrice}>{post.price}</Text>
                            <Text style={styles.postLocation}>{post.location}</Text>
                        </View>
                        <Text style={styles.postDate}>{post.date}</Text>
                        <View style={styles.postActions}>
                            <TouchableOpacity 
                                style={[styles.postActionButton, styles.editButton]}
                                onPress={() => setEditingPost(post)}
                            >
                                <Text style={styles.postActionButtonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.postActionButton, styles.deleteButton]}
                                onPress={() => handleDeletePost(post.id)}
                            >
                                <Text style={styles.postActionButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleImagePick}>
                    <View style={styles.imageContainer}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Text style={styles.placeholderText}>
                                    {userData.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View style={styles.editImageButton}>
                            <Text style={styles.editImageText}>Edit</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            {isEditing ? renderEditMode() : renderViewMode()}
            {renderPosts()}
            {renderAddPostModal()}
            {renderEditPostModal()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    imageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#29A132',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#29A132',
        padding: 8,
        borderRadius: 20,
    },
    editImageText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#29A132',
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    infoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 10,
    },
    infoItem: {
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
    },
    editButton: {
        backgroundColor: '#29A132',
        padding: 15,
        borderRadius: 8,
        margin: 20,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    editContainer: {
        padding: 20,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#666',
    },
    saveButton: {
        backgroundColor: '#29A132',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    viewContainer: {
        flex: 1,
    },
    postsContainer: {
        padding: 20,
    },
    postsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    postsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addPostButton: {
        backgroundColor: '#29A132',
        padding: 10,
        borderRadius: 8,
    },
    addPostButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    postCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    postImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    postContent: {
        padding: 16,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    postDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    postDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    postPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#29A132',
    },
    postLocation: {
        fontSize: 14,
        color: '#666',
    },
    postDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 12,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    postActionButton: {
        padding: 8,
        borderRadius: 6,
        minWidth: 80,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#29A132',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    postActionButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    imagePickerButton: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    imagePickerText: {
        color: '#666',
        fontWeight: '500',
    },
    postImagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
});
