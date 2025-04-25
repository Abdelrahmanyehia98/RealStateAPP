import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
<<<<<<< HEAD

=======
>>>>>>> e21a2dd02d0538cbe42f03f75e22e11dc56b8d0b

const AboutScreen = () => {
  return (
    <>
      <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={
         {
          justifyContent:'center',
          alignItems:'flex-end'
         }
        }>
        <Image
          source={require('./../assets/Screenshot 2024-12-10 025803.png')} 
          style={styles.logo}
        />
        </View>
        <View  style={
         { 
          justifyContent:'center',
          alignItems:'flex-start'
         }
        }>
  
        <Text style={styles.appName}>Realestate</Text>
        <Text style={styles.tagline}>Find Your Perfect Property</Text>
        </View>
     
      </View>

      

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Our App</Text>
        <Text style={styles.description}>
          Realestate is a comprehensive real estate platform designed to simplify your property search. 
          Whether you're looking to buy, rent, or sell, our app connects you with the best properties 
          and real estate professionals in your area.
        </Text>
      </View>

     

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Features</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="search" size={24} color="#29A132" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Advanced Search</Text>
            <Text style={styles.featureDesc}>Filter properties by location, price, bedrooms, and more.</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <MaterialIcons name="virtual-tour" size={24} color="#29A132" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Virtual Tours</Text>
            <Text style={styles.featureDesc}>Explore properties with 360° virtual tours from anywhere.</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color="#29A132" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Instant Alerts</Text>
            <Text style={styles.featureDesc}>Get notified when new properties match your criteria.</Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <FontAwesome name="handshake-o" size={24} color="#29A132" />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Agent Connect</Text>
            <Text style={styles.featureDesc}>Connect directly with trusted real estate agents.</Text>
          </View>
        </View>
      </View>

     

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Company</Text>
        <Text style={styles.description}>
          Founded in 2020, Realestate Technologies has revolutionized the real estate industry with 
          innovative technology solutions. We partner with thousands of brokers and agents nationwide 
          to bring you the most comprehensive property listings.
        </Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>50K+</Text>
            <Text style={styles.statLabel}>Properties</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Agents</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100+</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
        </View>
      </View>

      

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <View style={styles.contactItem}>
          <Ionicons name="mail" size={20} color="#666" />
          <Text 
            style={styles.contactText}
            onPress={() => Linking.openURL('')}
          >
            support@gmail.com
          </Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="call" size={20} color="#666" />
          <Text 
            style={styles.contactText}
            onPress={() => Linking.openURL('tel:+01001012277')}
          >
            01001012277
          </Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="globe" size={20} color="#666" />
          <Text 
            style={styles.contactText}
            onPress={() => Linking.openURL('https://www.facebook.com')}
          >
            www.Realestate.com
          </Text>
        </View>
        
        <View style={styles.contactItem}>
          <Ionicons name="location" size={20} color="#666" />
          <Text style={styles.contactText}>123 Real Estate Ave, street 100, Ard ellewaa</Text>
        </View>
      </View>

      

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Realestate Technologies. All rights reserved.</Text>
        <View style={styles.socialIcons}>
          <Ionicons 
            name="logo-facebook" 
            size={24} 
            color="#29A132" 
            onPress={() => Linking.openURL('https://facebook.com')}
          />
          <Ionicons 
            name="logo-twitter" 
            size={24} 
            color="#29A132" 
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://twitter.com')}
          />
          <Ionicons 
            name="logo-instagram" 
            size={24} 
            color="#29A132" 
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://instagram.com')}
          />
          <Ionicons 
            name="logo-linkedin" 
            size={24} 
            color="#29A132" 
            style={styles.socialIcon}
            onPress={() => Linking.openURL('https://linkedin.com')}
          />
        </View>
      </View>
    </ScrollView>
    </>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
   flex:1,
   flexDirection:'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  featureText: {
    flex: 1,
    marginLeft: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#29A132',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    marginLeft: 15,
  },
});

export default AboutScreen;
