import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  Animated, 
  Dimensions,
  Platform
} from 'react-native';
import { useRouter } from "expo-router";
import { useRoute } from '@react-navigation/native';

const Sidebar = () => {
  
  const router = useRouter();
  let route =useRoute().name
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(2*windowWidth)).current;

  const toggleMenu = () => {
  
  // Handle menu toggle animation

    
    if (isMenuOpened) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: windowWidth,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
  
      ]).start();
    }
    setIsMenuOpened(!isMenuOpened);
  };

  // Menu items data
  const menuItems = [
    {title: "Home", path: "/",name:"index" },
    {title: "About", path: "/About" ,name:"About" },
    {title: "Admin", path: "/About" ,name:"Admin" },
    {title: "Profile", path: "/About" ,name:"Profile" },
    {title: "Sell", path: "/About",name:"Sell" },
  ];

  return (
    <>
      {/* Header */}
      <SafeAreaView 
        style={styles.safeArea}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      >
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logoImage}
              source={require('./../assets/Screenshot 2024-12-10 025803.png')}
            />
            <Text style={styles.logoText}>RealEstate</Text>
          </View>

          <View style={styles.authButtons}>
                {/* Logout Button */}
             {/* <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.logoutButtonPressed,
              ]}
            >
              {({ pressed }) => (
                <Text style={[styles.logoutText, pressed && styles.logoutTextPressed]}>
                  Logout
                </Text>
              )}
            </Pressable>  */}
            <Pressable
              onPress={() => router.push("/login")}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              {({ pressed }) => (
                <Text style={[styles.loginText, pressed && styles.loginTextPressed]}>
                  Login
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={() => router.push("/signup")}
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.registerButtonPressed,
              ]}
            >
              {({ pressed }) => (
                <Text style={[styles.registerText, pressed && styles.registerTextPressed]}>
                  Register
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={toggleMenu}
            style={({ pressed }) => [
              styles.menuButton,
              pressed && styles.menuButtonPressed,
            ]}
          >
            {({ pressed }) => (
              <Text style={[styles.menuText, pressed && styles.menuTextPressed]}>
                ☰
              </Text>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

    

      {/* Sidebar Menu */}
      <Animated.View 
        style={[
          styles.menu,
          { 
            transform: [{ translateX }],
            top: headerHeight,
         
          }
        ]}
      >
        {menuItems.map((item) => (
          <Pressable 
            key={item.id}
            onPress={() => {
              router.push(item.path);
              toggleMenu();
           
            }}
            style={styles.menuItem}
          >
            <Text style={[styles.menuItemText,route===item.name && styles.activeItem]}>{item.title}</Text>
          </Pressable>
        ))}
        
        
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  activeItem:{
    fontWeight:'bold'
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 5,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  authButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  
  // Logout Button Styles
  logoutButton: {
    borderWidth: 1,
    borderColor: 'darkred',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 10,
    backgroundColor: 'white',
  },
  logoutButtonPressed: {
    backgroundColor: 'darkred',
  },
  logoutText: {
    color: 'darkred',
    fontSize: 14,
  },
  logoutTextPressed: {
    color: 'white',
  },

  loginButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
    backgroundColor: 'white',
  },
  loginButtonPressed: {
    backgroundColor: '#000',
  },
  loginText: {
    color: '#000',
    fontSize: 14,
  },
  loginTextPressed: {
    color: '#fff',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: 'green',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  registerButtonPressed: {
    backgroundColor: 'green',
  },
  registerText: {
    color: 'green',
    fontSize: 14,
  },
  registerTextPressed: {
    color: '#fff',
  },
  menuButton: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  menuButtonPressed: {
    backgroundColor: '#000',
  },
  menuText: {
    fontSize: 18,
    color: '#000',
  },
  menuTextPressed: {
    color: '#fff',
  },
  menu: {
    position: 'absolute',
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
    elevation: 20,
    borderRightWidth: 1,

  },
  menuItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  menuItemText: {
    fontSize: 16,
  },
  
  overlayPressable: {
    flex: 1,
  },
});

export default Sidebar;