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
} from 'react-native';
import { useRouter } from "expo-router";
import { usePathname } from 'expo-router';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Sidebar = () => {
  const router = useRouter();
  const [route, setRoute] = useState(usePathname().split('/').pop());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(2 * windowWidth)).current;

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
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
    { title: "Home", path: "/", name: "index", isActive: true },
    { title: "About", path: "/About", name: "About", isActive: false },
    { title: "Admin", path: "/Admin", name: "Admin", isActive: false },
    { title: "Profile", path: "/../Profile", name: "Profile", isActive: false },
    { title: "Sell", path: "/sell", name: "Sell", isActive: false },
    { title: "Cart", path: "/cart", name: "Cart", isActive: false },
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
            {isAuthenticated ? (
              <Pressable
                onPress={handleLogout}
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
              </Pressable>
            ) : (
              <>
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
              </>
            )}
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
            key={item.name}
            onPress={() => {
              router.push(item.path);
              setRoute(item.name)
              toggleMenu();
            }}
            style={styles.menuItem}
          >
            <Text style={[styles.menuItemText, route == item.name && styles.activeItem]}>{item.title}</Text>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  activeItem: {
    fontWeight: 'bold'
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
    borderColor: '#000',
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
    borderColor: '#1c9b25ef',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  registerButtonPressed: {
    backgroundColor: '#1c9b25ef',
  },
  registerText: {
    color: '#1c9b25ef',
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
