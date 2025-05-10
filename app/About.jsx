import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Linking } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('./../assets/Screenshot 2024-12-10 025803.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.titleContainer}>
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
          <Ionicons name="search" size={24} color="#29A132" style={styles.featureIcon} />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Advanced Search</Text>
            <Text style={styles.featureDesc}>Filter properties by location, price, bedrooms, and more.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <MaterialIcons name="virtual-tour" size={24} color="#29A132" style={styles.featureIcon} />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Virtual Tours</Text>
            <Text style={styles.featureDesc}>Explore properties with 360° virtual tours from anywhere.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color="#29A132" style={styles.featureIcon} />
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Instant Alerts</Text>
            <Text style={styles.featureDesc}>Get notified when new properties match your criteria.</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome name="handshake-o" size={24} color="#29A132" style={styles.featureIcon} />
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
          <Ionicons name="mail" size={20} color="#29A132" style={styles.contactIcon} />
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL('mailto:support@gmail.com')}
          >
            support@gmail.com
          </Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="call" size={20} color="#29A132" style={styles.contactIcon} />
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL('tel:+01001012277')}
          >
            01001012277
          </Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="globe" size={20} color="#29A132" style={styles.contactIcon} />
          <Text
            style={styles.contactText}
            onPress={() => Linking.openURL('https://www.Realestate.com')}
          >
            www.Realestate.com
          </Text>
        </View>

        <View style={styles.contactItem}>
          <Ionicons name="location" size={20} color="#29A132" style={styles.contactIcon} />
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
            style={styles.socialIcon}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 15,
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  tagline: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  description: {
    fontSize: 16,
    color: '#34495e',
    lineHeight: 24,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    elevation: 1,
  },
  featureIcon: {
    marginRight: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  featureDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    elevation: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#29A132',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  contactIcon: {
    marginRight: 15,
  },
  contactText: {
    fontSize: 16,
    color: '#34495e',
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialIcon: {
    marginHorizontal: 10,
  },
});

export default AboutScreen;