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
  TouchableOpacity,
} from 'react-native';
import { useRouter } from "expo-router";
import { usePathname } from 'expo-router';
import { auth, signOut } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from "@expo/vector-icons";

const Sidebar = () => {
  const router = useRouter();
  const [route, setRoute] = useState(usePathname().split('/').pop());
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(2 * windowWidth)).current;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuAnimation = new Animated.Value(0);

  useEffect(() => {
    console.log('Setting up auth listener');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setIsAuthenticated(!!user);
    });

    console.log('Checking initial auth state');
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('User is already logged in:', currentUser.email);
      setIsAuthenticated(true);
    }

    return () => {
      console.log('Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Attempting to log out...');
      await signOut(auth);
      console.log('Logout successful');
      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleMenu = () => {
    const toValue = isMenuOpened ? 0 : 1;
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setIsMenuOpened(!isMenuOpened);
  };

  const menuItems = [
    { icon: "home-outline", label: "Home", route: "/" },
    { icon: "search-outline", label: "Search", route: "/search" },
    { icon: "add-circle-outline", label: "Sell", route: "/sell" },
    { icon: "heart-outline", label: "Favorites", route: "/favorites" },
    { icon: "person-outline", label: "Profile", route: "/profile" },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
        <Ionicons
          name={isMenuOpened ? "close" : "menu"}
          size={24}
          color="#000"
        />
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [
              {
                translateX: menuAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-300, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.sidebarContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Property Finder</Text>
          </View>

          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  router.push(item.route);
                  setRoute(item.label.toLowerCase());
                  toggleMenu();
                }}
              >
                <Ionicons name={item.icon} size={24} color="#000" />
                <Text style={[styles.menuItemText, route === item.label.toLowerCase() && styles.activeItem]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.authButtons}>
            {isAuthenticated ? (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#fff" />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Pressable
                  style={styles.loginButton}
                  onPress={() => {
                    router.push("/login");
                    toggleMenu();
                  }}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </Pressable>
                <Pressable
                  style={styles.registerButton}
                  onPress={() => {
                    router.push("/signup");
                    toggleMenu();
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Animated.View>

      {isMenuOpened && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activeItem: {
    fontWeight: 'bold'
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  menuButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1001,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 300,
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  menuItems: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#000",
  },
  authButtons: {
    gap: 10,
  },
  loginButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1c9b25ef",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#1c9b25ef",
    fontSize: 16,
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#1c9b25ef",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Sidebar;
