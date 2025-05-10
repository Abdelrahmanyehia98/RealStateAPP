import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { processNaturalLanguageQuery } from './services22/aiSearchService';

const SmartSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const searchParams = await processNaturalLanguageQuery(query);
      onSearch(searchParams);
    } catch (error) {
      console.error('Search failed:', error);
      
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#7f8c8d" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Describe your ideal property..."
          placeholderTextColor="#7f8c8d"
          onSubmitEditing={handleSearch}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#27ae60" />
        ) : (
          <TouchableOpacity onPress={handleSearch} disabled={!query.trim()}>
            <Ionicons name="arrow-forward-circle" size={24} color="#27ae60" />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.examples}>
        Try: "Find me a villa in Maadi under $250,000"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  examples: {
    color: '#7f8c8d',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default SmartSearch;