import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

export default function Cart({ onClose }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = global.cartItems || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemoveFromCart = (index) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    if (global.cartItems) {
      global.cartItems = newCartItems;
    }
  };

  const renderCartItem = (item, index) => (
    <View key={index.toString()} style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemTitle}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>${item.price.toLocaleString()}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromCart(index)}
        >
          <Ionicons name="trash" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + parseInt(item.price), 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Your Cart</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <View style={styles.cartSummary}>
        <Text style={styles.cartSummaryText}>
          Items: {totalItems} | Total: ${totalPrice.toLocaleString()}
        </Text>
      </View>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.cartList}>
          {cartItems.map((item, index) => renderCartItem(item, index))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 8,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cartItemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#27ae60',
    marginTop: 5,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  emptyCartText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  cartSummary: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  cartSummaryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
