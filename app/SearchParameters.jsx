import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchParameters = ({ params, onClearParam }) => {
  if (!params || Object.keys(params).length === 0) {
    return null;
  }
  
  const getDisplayText = (key, value) => {
    switch (key) {
      case 'bedrooms':
        return `${value} ${value === 1 ? 'Bedroom' : 'Bedrooms'}`;
      case 'minPrice':
        return `Min $${parseInt(value).toLocaleString()}`;
      case 'maxPrice':
        return `Max $${parseInt(value).toLocaleString()}`;
      case 'propertyType':
        return value.charAt(0).toUpperCase() + value.slice(1);
      case 'type':
        return value === 'buy' ? 'For Sale' : 'For Rent';
      case 'location':
        return value;
      default:
        return `${key}: ${value}`;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Active filters:</Text>
        <TouchableOpacity onPress={() => onClearParam('all')}>
          <Text style={styles.clearAll}>Clear all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.paramsContainer}>
        {Object.entries(params).map(([key, value]) => {
          if (!value && value !== 0) return null;
          
          return (
            <TouchableOpacity 
              key={key} 
              style={styles.paramTag}
              onPress={() => onClearParam(key)}
            >
              <Text style={styles.paramText}>{getDisplayText(key, value)}</Text>
              <Ionicons name="close-circle" size={16} color="#666" />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  clearAll: {
    color: '#27ae60',
    fontSize: 12,
  },
  paramsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  paramTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 3,
  },
  paramText: {
    marginRight: 5,
    fontSize: 12,
    color: '#333',
  },
});

export default SearchParameters;